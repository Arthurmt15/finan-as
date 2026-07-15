'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useTransactions } from '@/hooks/useTransactions'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useCustomBosses } from '@/hooks/useCustomBosses'
import { DialogOverlay } from '@/components/ui/DialogOverlay'

/** Cena 3D do boss carregada dinamicamente (sem SSR) */
const BossScene = dynamic(
  () => import('./BossScene'),
  { ssr: false },
)

type Phase = 'select' | 'battle' | 'win' | 'lose'

interface Boss {
  id: string
  name: string
  hp: number
  maxHp: number
  desc: string
}

/**
 * Página "Pagar Conta" — sistema de boss fight temático.
 * Fluxo:
 * - select: escolhe um chefe (conta fixa) para enfrentar
 * - battle: batalha por turnos com ataques de dano aleatório
 * - win/lose: resultado com feedback de XP
 *
 * Também oferece "Ataque Total" para pagar todas as contas de uma vez.
 */
export default function PagarContaPage() {
  const router = useRouter()
  const { add } = useTransactions()
  const hp = usePlayerStore((s) => s.hp)
  const addXp = usePlayerStore((s) => s.addXp)
  const { bosses: customBosses } = useCustomBosses()

  const [phase, setPhase] = useState<Phase>('select')
  const [boss, setBoss] = useState<Boss | null>(null)
  const [bossHp, setBossHp] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [playerAttack, setPlayerAttack] = useState(false)

  /** Inicia a batalha contra um boss personalizado */
  function startBattle(bossId: string) {
    const custom = customBosses.find((c) => `custom_${c.id}` === bossId)
    if (!custom) return
    setBoss({ id: bossId, name: custom.name, hp: custom.hp, maxHp: custom.hp, desc: custom.desc })
    setBossHp(custom.hp)
    setLogs([`${custom.name} apareceu!`, `${custom.desc}`])
    setPhase('battle')
  }

  /** Executa um turno de ataque: dano aleatório entre 50-80 */
  async function attack() {
    if (!boss) return

    setPlayerAttack(true)
    await sleep(400)
    setPlayerAttack(false)

    const damage = Math.min(50 + Math.floor(Math.random() * 30), bossHp)
    const newBossHp = bossHp - damage
    setBossHp(newBossHp)
    setLogs((prev) => [...prev, `Ataque causa ${damage} de dano!`])

    if (newBossHp <= 0) {
      await add({
        amount: boss.hp,
        category: boss.id as any,
        description: `${boss.name} — Conta paga`,
        date: new Date(),
        type: 'expense',
      })
      addXp(50)
      setLogs((prev) => [...prev, `${boss.name} foi derrotado!`, 'XP +50 · Conta paga!'])
      await sleep(600)
      setPhase('win')
      return
    }

    await sleep(800)

    const currentHp = usePlayerStore.getState().hp
    if (currentHp <= 0) {
      setLogs((prev) => [...prev, 'Seu saldo acabou... Você foi derrotado.'])
      await sleep(600)
      setPhase('lose')
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 bg-ps1-black">
      <h1 className="font-pixel text-sm text-ps1-white glow-text mb-4">
        {phase === 'select' ? 'SELECIONE O CHEFE' : 'BOSS FIGHT'}
      </h1>

      {/* Tela de seleção de boss */}
      {phase === 'select' && (
        <div className="w-full max-w-md space-y-3">

          {customBosses.map((boss) => (
            <button
              key={boss.id}
              onClick={() => startBattle(`custom_${boss.id}`)}
              className="dialog-box w-full text-left flex items-center gap-4 hover:border-ps1-yellow transition-colors cursor-pointer"
            >
              <span className="text-3xl">{boss.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-pixel text-[9px] text-ps1-white">{boss.name}</p>
                <p className="font-mono text-xs text-ps1-white/60 truncate">{boss.desc}</p>
                <p className="font-pixel text-[8px] text-ps1-red mt-1">HP: {boss.hp}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ps1 w-full mt-2"
          >
            VOLTAR
          </button>
        </div>
      )}

      {/* Tela de batalha com cena 3D e log de eventos */}
      {(phase === 'battle') && boss && (
        <div className="w-full max-w-md">
          <div className="relative h-64 mb-4 dialog-box flex items-center justify-center overflow-hidden">
            <BossScene bossHp={bossHp} maxHp={boss.maxHp} playerAttack={playerAttack} />
            <div className="absolute top-2 left-2 right-2">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[7px] text-ps1-red">BOSS</span>
                <div className="flex-1 h-2 bg-ps1-black border border-ps1-white">
                  <div
                    className="h-full bg-red-700 transition-all duration-300"
                    style={{ width: `${(bossHp / boss.maxHp) * 100}%` }}
                  />
                </div>
                <span className="font-pixel text-[7px] text-ps1-white">{bossHp}</span>
              </div>
            </div>
          </div>

          <div className="dialog-box h-28 overflow-y-auto mb-4">
            {logs.map((log, i) => (
              <p
                key={i}
                className={`font-mono text-sm ${
                  log.includes('derrotado') || log.includes('pagas')
                    ? 'text-green-400'
                    : log.includes('causa')
                    ? 'text-ps1-yellow'
                    : 'text-ps1-white/80'
                }`}
              >
                {log}
              </p>
            ))}
          </div>

          <button
            onClick={attack}
            disabled={playerAttack}
            className="btn-ps1 w-full disabled:opacity-30"
          >
            {playerAttack ? 'ATACANDO...' : 'ATACAR'}
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ps1 w-full mt-2"
          >
            VOLTAR (RENDER)
          </button>
          <p className="font-mono text-[10px] text-ps1-white/40 text-center mt-2">
            Seu HP atual: {hp}
          </p>
        </div>
      )}

      {/* Resultado da batalha (vitória ou derrota) */}
      {(phase === 'win' || phase === 'lose') && (
        <DialogOverlay>
        <div className="dialog-box max-w-sm w-full text-center">
          <p
            className={`font-pixel text-lg mb-4 ${
              phase === 'win' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {phase === 'win' ? 'VITÓRIA!' : 'DERROTA'}
          </p>
          <div className="space-y-1 mb-6">
            {logs.slice(-3).map((log, i) => (
              <p key={i} className="font-mono text-sm text-ps1-white/80">{log}</p>
            ))}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-ps1 w-full"
          >
            VOLTAR AO DASHBOARD
          </button>
        </div>
      </DialogOverlay>
      )}
    </main>
  )
}

/** Utilitário para pausar a execução (usado nos timings da batalha) */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
