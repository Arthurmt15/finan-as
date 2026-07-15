import { useCallback, useEffect, useState } from 'react'
import { db } from '@/db/database'
import type { Transaction } from '@/db/database'
import { usePlayerStore } from '@/stores/usePlayerStore'

/**
 * Hook que encapsula todas as operações CRUD de transações
 * com o Dexie (IndexedDB), sincronizando automaticamente com a
 * store do jogador (HP, XP, Streak).
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const addTransactionToPlayer = usePlayerStore((s) => s.addTransaction)
  const addXp = usePlayerStore((s) => s.addXp)

  /** Carrega as últimas 20 transações ordenadas por data descendente */
  const load = useCallback(async () => {
    const all = await db.transactions.orderBy('date').reverse().limit(20).toArray()
    setTransactions(all)
  }, [])

  /** Carrega automaticamente na montagem do componente */
  useEffect(() => { load() }, [load])

  /** Adiciona uma transação ao banco e atualiza HP/XP/Streak do jogador */
  const add = useCallback(async (t: Omit<Transaction, 'id'>) => {
    await db.transactions.add(t as Transaction)
    addTransactionToPlayer(t.amount)
    addXp(10)
    await load()
  }, [addTransactionToPlayer, addXp, load])

  /** Remove uma transação pelo ID */
  const remove = useCallback(async (id: number) => {
    await db.transactions.delete(id)
    await load()
  }, [load])

  /** Exporta todas as transações como arquivo JSON */
  const exportJson = useCallback(async () => {
    const all = await db.transactions.toArray()
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `polybudget-backup-${Date.now()}.json`)
  }, [])

  /** Exporta todas as transações como arquivo CSV */
  const exportCsv = useCallback(async () => {
    const all = await db.transactions.toArray()
    const header = 'id,amount,category,description,date,type'
    const rows = all.map((t) =>
      `${t.id},${t.amount},"${t.category}","${t.description}","${new Date(t.date).toISOString()}",${t.type}`
    )
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' })
    downloadBlob(blob, `polybudget-export-${Date.now()}.csv`)
  }, [])

  /** Apaga todas as transações do banco */
  const clearAll = useCallback(async () => {
    await db.transactions.clear()
    await load()
  }, [load])

  return { transactions, add, remove, load, exportJson, exportCsv, clearAll }
}

/** Dispara o download de um blob no navegador */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
