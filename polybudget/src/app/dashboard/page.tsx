'use client'

import { useRouter } from 'next/navigation'
import { StatusPanel } from '@/components/ui/StatusPanel'
import DynamicScene from '@/components/three/DynamicScene'
import { useTransactions } from '@/hooks/useTransactions'
import { categories } from '@/data/categories'

/** Ações rápidas do menu principal com respectivas rotas internas */
const quickActions = [
  { label: 'NOVO GASTO', route: '/dashboard/novo-gasto', desc: 'Lojinha RPG' },
  { label: 'PAGAR CONTA', route: '/dashboard/pagar-conta', desc: 'Boss Fight' },
  { label: 'ORÇAMENTO', route: '/dashboard/orcamento', desc: 'Definir HP / MP' },
  { label: 'MEMORY CARD', route: '/dashboard/memory-card', desc: 'Salvar / Exportar' },
  { label: 'PERSONALIZAR', route: '/dashboard/personalizar', desc: 'Criar Chefes' },
]

/**
 * Dashboard principal — Tela de Status do jogador.
 * Exibe:
 * - Cena 3D low-poly animada ao fundo (DynamicScene)
 * - Painel de status no estilo RPG (HP, MP, XP, LV, Streak)
 * - Botões de ação rápida (navegação interna)
 * - Lista das 5 transações mais recentes vindas do IndexedDB
 */
export default function DashboardPage() {
  const router = useRouter()
  const { transactions } = useTransactions()

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const recentTransactions = sorted.slice(0, 5)

  function getCategoryIcon(cat: string) {
    const found = categories.find((c) => c.id === cat)
    return found?.icon ?? '📦'
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-8 px-4 pb-20">
      <DynamicScene />

      <div className="text-center mb-6 z-10">
        <h1 className="font-pixel text-lg text-ps1-white glow-text tracking-wider">
          POLYBUDGET
        </h1>
        <p className="font-mono text-sm text-ps1-white/70">
          Sistema de Status Financeiro v0.1
        </p>
      </div>

      <div className="w-full max-w-md z-10">
        <StatusPanel />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md mt-4 z-10">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.route)}
            className="btn-ps1 text-center flex flex-col items-center gap-1"
          >
            <span className="font-pixel text-[10px]">{action.label}</span>
            <span className="font-mono text-[10px] text-ps1-white/60">{action.desc}</span>
          </button>
        ))}
      </div>

      <div className="dialog-box w-full max-w-md mt-6 z-10">
        <h2 className="font-pixel text-[10px] mb-3 text-ps1-white">ÚLTIMOS GASTOS</h2>
        <div className="space-y-2">
          {recentTransactions.length === 0 ? (
            <p className="font-mono text-sm text-ps1-white/40 text-center py-4">
              Nenhum gasto registrado ainda.
            </p>
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center border-b border-ps1-white/20 pb-1"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{getCategoryIcon(t.category)}</span>
                  <div className="truncate">
                    <p className="font-pixel text-[8px] text-ps1-white truncate">
                      {t.description}
                    </p>
                    <span className="font-mono text-[10px] text-ps1-white/50">
                      {getCategoryLabel(t.category)} · {formatDate(t.date)}
                    </span>
                  </div>
                </div>
                <span
                  className={`font-pixel text-[10px] shrink-0 ml-2 ${
                    t.type === 'expense' ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {t.type === 'expense' ? '-' : '+'}R${Math.abs(t.amount).toFixed(0)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="font-mono text-[10px] text-ps1-white/30 mt-8 z-10">
        © 2026 PolyBudget — Aperte START para continuar
      </p>
    </main>
  )
}

/** Retorna o nome legível de uma categoria a partir do seu ID */
function getCategoryLabel(cat: string) {
  const found = categories.find((c) => c.id === cat)
  return found?.label ?? cat
}
