'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { DialogOverlay } from '@/components/ui/DialogOverlay'

/**
 * Página "Orçamento" — define HP máximo (orçamento mensal) e
 * MP máximo (reserva/economias). Os valores alimentam a store
 * do jogador e são exibidos no painel de status do Dashboard.
 */
export default function OrcamentoPage() {
  const router = useRouter()
  const { hp, maxHp, mp, maxMp, setBudget, setSavings } = usePlayerStore()

  const [budgetInput, setBudgetInput] = useState(String(maxHp))
  const [savingsInput, setSavingsInput] = useState(String(maxMp))
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const newBudget = Number(budgetInput)
    const newSavings = Number(savingsInput)
    if (newBudget > 0) setBudget(newBudget)
    if (newSavings >= 0) setSavings(newSavings)
    setSaved(true)
  }

  return (
    <DialogOverlay>
      <div className="dialog-box w-full max-w-md">
        <h1 className="font-pixel text-sm text-ps1-white glow-text mb-6 text-center">
          ORÇAMENTO MENSAL
        </h1>

        <div className="mb-4">
          <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">
            ORÇAMENTO TOTAL (HP MÁXIMO)
          </label>
          <input
            type="number"
            min="1"
            readOnly
            value={budgetInput}
            className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-pixel text-sm px-3 py-2 outline-none"
          />
          <p className="font-mono text-[10px] text-ps1-white/40 mt-1">
            Atual: {maxHp.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} · HP restante: {hp.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <div className="mb-6">
          <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">
            RESERVA / ECONOMIAS (MP)
          </label>
          <input
            type="number"
            min="0"
            readOnly
            value={savingsInput}
            className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-pixel text-sm px-3 py-2 outline-none"
          />
          <p className="font-mono text-[10px] text-ps1-white/40 mt-1">
            Atual: {maxMp.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} · MP atual: {mp.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        {saved && (
          <p className="font-mono text-sm text-green-400 text-center mb-4 animate-pulse">
            Salvo com sucesso!
          </p>
        )}

        <button
          onClick={handleSave}
          className="btn-ps1 w-full bg-green-800 hover:bg-green-700"
        >
          SALVAR
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className="btn-ps1 w-full mt-2"
        >
          VOLTAR
        </button>
      </div>
    </DialogOverlay>
  )
}
