'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTransactions } from '@/hooks/useTransactions'
import { categories } from '@/data/categories'
import { DialogOverlay } from '@/components/ui/DialogOverlay'
import { NumericKeypad } from '@/components/ui/NumericKeypad'
import type { CategoryId } from '@/types'

/** Temas visuais (gradiente e borda) para cada categoria de gasto */
const categoryThemes: Partial<Record<CategoryId, { bg: string; border: string }>> = {
  alimentacao: { bg: 'from-green-900/80 to-green-950/80', border: 'border-green-600' },
  transporte: { bg: 'from-yellow-900/80 to-yellow-950/80', border: 'border-yellow-600' },
  moradia: { bg: 'from-red-900/80 to-red-950/80', border: 'border-red-600' },
  lazer: { bg: 'from-purple-900/80 to-purple-950/80', border: 'border-purple-600' },
  saude: { bg: 'from-cyan-900/80 to-cyan-950/80', border: 'border-cyan-600' },
  educacao: { bg: 'from-indigo-900/80 to-indigo-950/80', border: 'border-indigo-600' },
  outros: { bg: 'from-gray-800/80 to-gray-900/80', border: 'border-gray-500' },
}

/**
 * Página "Novo Gasto" — interface de lojinha de RPG.
 * Fluxo em 3 etapas:
 * 1. select: escolhe categoria + preenche valor/descrição
 * 2. confirm: revisão com ícone grande e valor em destaque
 * 3. done: confirmação com feedback de XP + botão de retorno
 */
export default function NovoGastoPage() {
  const router = useRouter()
  const { add } = useTransactions()

  const [category, setCategory] = useState<CategoryId>('alimentacao')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<'select' | 'confirm' | 'done'>('select')

  const selectedCat = categories.find((c) => c.id === category)!

  /** Persiste a transação no IndexedDB e avança para a tela de conclusão */
  async function handleConfirm() {
    await add({
      amount: Number(amount),
      category,
      description,
      date: new Date(),
      type: 'expense',
    })
    setStep('done')
  }

  if (step === 'done') {
    return (
      <DialogOverlay>
        <div className="dialog-box max-w-sm w-full text-center">
          <p className="font-pixel text-[16px] text-green-400 mb-4">ITEM ADQUIRIDO!</p>
          <p className="font-mono text-sm mb-2">{description}</p>
          <p className="font-pixel text-[10px] text-ps1-yellow mb-4">
            -R$ {Number(amount).toFixed(2)}
          </p>
          <p className="font-mono text-xs text-ps1-white/60 mb-6">
            XP +10 · Streak atualizado!
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ps1 w-full"
          >
            VOLTAR AO DASHBOARD
          </button>
        </div>
      </DialogOverlay>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-ps1-black">
      <h1 className="font-pixel text-sm text-ps1-white glow-text mb-6">
        {step === 'select' ? 'LOJINHA DO ORÇAMENTO' : 'CONFIRMAR COMPRA'}
      </h1>

      {step === 'select' ? (
        <>
          {/* Grid de categorias com destaque na selecionada */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-6">
            {categories.map((cat) => {
              const theme = categoryThemes[cat.id]
              if (!theme) return null
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded border-2 transition-all
                    ${category === cat.id
                      ? `${theme.border} bg-gradient-to-b ${theme.bg} scale-105`
                      : 'border-transparent bg-ps1-blue/40 hover:bg-ps1-blue/60'
                    }
                  `}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-pixel text-[6px] text-ps1-white text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Formulário de valor e descrição */}
          <div className="dialog-box w-full max-w-md">
            <div className="mb-4">
              <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">
                VALOR (R$)
              </label>
              <NumericKeypad value={amount} onChange={setAmount} placeholder="0,00" />
            </div>
            <div className="mb-4">
              <label className="font-pixel text-[8px] text-ps1-white/70 block mb-1">
                DESCRIÇÃO
              </label>
              <input
                type="text"
                placeholder="Ex: Café da manhã"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={40}
                className="w-full bg-ps1-black border-2 border-ps1-white text-ps1-white font-mono text-sm
                           px-3 py-2 outline-none focus:border-ps1-yellow"
              />
            </div>
            <button
              onClick={() => setStep('confirm')}
              disabled={!amount || Number(amount) <= 0 || !description.trim()}
              className="btn-ps1 w-full disabled:opacity-30 disabled:cursor-not-allowed"
            >
              COMPRAR
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-ps1 w-full mt-2"
            >
              VOLTAR
            </button>
          </div>
        </>
      ) : (
        /* Etapa de confirmação com resumo visual */
        <DialogOverlay>
        <div className="dialog-box w-full max-w-md text-center">
          <p className="font-pixel text-[10px] text-ps1-white/70 mb-1">Você está comprando:</p>
          <p className="text-4xl mb-2">{selectedCat.icon}</p>
          <p className="font-pixel text-sm text-ps1-white mb-1">{selectedCat.label}</p>
          <p className="font-mono text-sm text-ps1-white/80 mb-1">{description}</p>
          <p className="font-pixel text-lg text-ps1-yellow mb-6">-R$ {Number(amount).toFixed(2)}</p>

          <div className="flex gap-2">
            <button
              onClick={() => setStep('select')}
              className="btn-ps1 flex-1"
            >
              CANCELAR
            </button>
            <button
              onClick={handleConfirm}
              className="btn-ps1 flex-1 bg-green-800 hover:bg-green-700"
            >
              CONFIRMAR
            </button>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ps1 w-full mt-2"
          >
            VOLTAR
          </button>
        </div>
      </DialogOverlay>
      )}
    </main>
  )
}
