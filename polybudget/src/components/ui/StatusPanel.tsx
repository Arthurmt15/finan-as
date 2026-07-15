'use client'

import { usePlayerStore } from '@/stores/usePlayerStore'

/**
 * Barra de progresso horizontal estilo RPG (HP, MP ou XP).
 * Renderiza um fundo cheio e uma barra preenchida proporcional ao valor atual.
 */
function Bar({ label, current, max, barClass }: {
  label: string
  current: number
  max: number
  barClass: string
}) {
  const pct = max > 0 ? Math.min(current / max, 1) : 0

  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="font-pixel text-[8px] w-8 text-right text-ps1-white">{label}</span>
      <div className="flex-1 relative">
        <div className={`${barClass} w-full`} />
        <div
          className={`${barClass} absolute top-0 left-0`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className="font-pixel text-[8px] w-24 text-left text-ps1-white">
        {current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} /{' '}
        {max.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </div>
  )
}

/**
 * Painel de status do jogador no estilo tela de RPG clássico.
 * Exibe LV, Streak, HP (orçamento), MP (reserva) e XP.
 */
export function StatusPanel() {
  const { hp, maxHp, mp, maxMp, xp, xpToNext, level, streak } = usePlayerStore()

  const hpPct = maxHp > 0 ? Math.min(hp / maxHp, 1) : 0
  const mpPct = maxMp > 0 ? Math.min(mp / maxMp, 1) : 0
  const xpPct = xpToNext > 0 ? Math.min(xp / xpToNext, 1) : 0
  const hpColor = hpPct > 0.5 ? 'bg-green-600' : hpPct > 0.25 ? 'bg-yellow-600' : 'bg-red-600'

  return (
    <div className="dialog-box w-full max-w-md mx-auto mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-pixel text-[10px] text-ps1-white glow-text">
          LV.{String(level).padStart(2, '0')}
        </h2>
        <span className="font-pixel text-[8px] text-ps1-white">
          STREAK: {streak} DIAS
        </span>
      </div>

      <Bar label="HP" current={hp} max={maxHp} barClass="hp-bar" />
      <Bar label="MP" current={mp} max={maxMp} barClass="mp-bar" />

      <div className="flex items-center gap-2 mt-2">
        <span className="font-pixel text-[8px] w-8 text-right text-ps1-white">XP</span>
        <div className="flex-1 relative">
          <div className="xp-bar w-full" />
          <div className="xp-bar absolute top-0 left-0" style={{ width: `${xpPct * 100}%` }} />
        </div>
        <span className="font-pixel text-[8px] w-20 text-left text-ps1-white">
          {xp}/{xpToNext}
        </span>
      </div>
    </div>
  )
}
