'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomBosses } from '@/hooks/useCustomBosses'
import type { CustomBoss } from '@/db/database'

type Mode = 'list' | 'add' | 'edit'

const defaultIcons = ['👹', '🐉', '🧙', '🦁', '👾', '🤖', '👻', '💀', '🕷️', '🧟', '🐙', '🔥']

/**
 * Página "Personalizar" — CRUD de chefes personalizados.
 * Permite criar, editar e deletar bosses que aparecem na
 * tela de "Pagar Conta" (boss fight).
 */
export default function PersonalizarPage() {
  const router = useRouter()
  const { bosses, add, update, remove } = useCustomBosses()

  const [mode, setMode] = useState<Mode>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('👹')
  const [hp, setHp] = useState('100')
  const [desc, setDesc] = useState('')

  function resetForm() {
    setName('')
    setIcon('👹')
    setHp('100')
    setDesc('')
    setEditingId(null)
  }

  function openEdit(boss: CustomBoss) {
    setEditingId(boss.id!)
    setName(boss.name)
    setIcon(boss.icon)
    setHp(String(boss.hp))
    setDesc(boss.desc)
    setMode('edit')
  }

  async function handleSave() {
    if (!name.trim() || !hp || Number(hp) <= 0) return
    if (mode === 'add') {
      await add({ name: name.trim(), icon, hp: Number(hp), desc: desc.trim() })
    } else if (mode === 'edit' && editingId !== null) {
      await update(editingId, { name: name.trim(), icon, hp: Number(hp), desc: desc.trim() })
    }
    resetForm()
    setMode('list')
  }

  async function handleDelete(id: number) {
    await remove(id)
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-ps1-black">
      <h1 className="font-pixel text-sm text-ps1-white glow-text mb-6">
        PERSONALIZAR CHEFES
      </h1>

      {mode === 'list' && (
        <>
          <button
            onClick={() => { resetForm(); setMode('add') }}
            className="btn-ps1 w-full max-w-md mb-4 bg-green-900 hover:bg-green-800"
          >
            + NOVO CHEFE
          </button>

          <div className="w-full max-w-md space-y-3">
            {bosses.length === 0 ? (
              <p className="font-mono text-sm text-ps1-white/40 text-center py-8">
                Nenhum chefe personalizado ainda.
              </p>
            ) : (
              bosses.map((boss) => (
                <div
                  key={boss.id}
                  className="dialog-box flex items-center gap-3"
                >
                  <span className="text-3xl">{boss.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-[9px] text-ps1-white truncate">{boss.name}</p>
                    <p className="font-mono text-xs text-ps1-white/60 truncate">{boss.desc}</p>
                    <p className="font-pixel text-[8px] text-ps1-red mt-1">HP: {boss.hp}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(boss)}
                      className="font-pixel text-[8px] text-ps1-yellow hover:text-ps1-white px-2 py-1 border border-ps1-yellow/40 rounded"
                    >
                      EDITAR
                    </button>
                    <button
                      onClick={() => handleDelete(boss.id!)}
                      className="font-pixel text-[8px] text-red-400 hover:text-red-300 px-2 py-1 border border-red-400/40 rounded"
                    >
                      DELETAR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ps1 w-full max-w-md mt-6"
          >
            VOLTAR
          </button>
        </>
      )}

      {(mode === 'add' || mode === 'edit') && (
        <div className="dialog-box w-full max-w-md">
          <h2 className="font-pixel text-[10px] text-ps1-white mb-4">
            {mode === 'add' ? 'NOVO CHEFE' : 'EDITAR CHEFE'}
          </h2>

          <div className="mb-4">
            <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">NOME</label>
            <input
              type="text"
              placeholder="Ex: IPTU, o Cobrador Implacável"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-mono text-sm px-3 py-2 outline-none focus:border-ps1-yellow"
            />
          </div>

          <div className="mb-4">
            <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">ÍCONE</label>
            <div className="flex flex-wrap gap-2">
              {defaultIcons.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`text-2xl p-1 border-2 rounded transition-all ${
                    icon === i ? 'border-ps1-yellow scale-110' : 'border-transparent hover:border-ps1-white/40'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">HP (VALOR DA CONTA)</label>
            <input
              type="number"
              min="1"
              placeholder="100"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-pixel text-sm px-3 py-2 outline-none focus:border-ps1-yellow"
            />
          </div>

          <div className="mb-4">
            <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">DESCRIÇÃO</label>
            <input
              type="text"
              placeholder="Ex: Aparece toda vez que você compra algo novo..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={60}
              className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-mono text-sm px-3 py-2 outline-none focus:border-ps1-yellow"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => { resetForm(); setMode('list') }}
              className="btn-ps1 flex-1"
            >
              CANCELAR
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !hp || Number(hp) <= 0}
              className="btn-ps1 flex-1 bg-green-800 hover:bg-green-700 disabled:opacity-30"
            >
              SALVAR
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
