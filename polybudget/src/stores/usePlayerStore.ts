import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Estado gamificado do jogador no estilo RPG.
 * - HP  = orçamento disponível no mês
 * - MP  = reserva financeira / economias
 * - XP  = experiência acumulada por registrar gastos
 * - LV  = nível atual (sobe ao acumular XP suficiente)
 * - Streak = dias consecutivos registrando transações
 */
export interface PlayerState {
  /** Budget restante do mês (HP) */
  hp: number
  /** Orçamento total definido para o mês (HP máximo) */
  maxHp: number
  /** Economias/reserva financeira (MP) */
  mp: number
  /** Capacidade máxima de reserva (MP máximo) */
  maxMp: number
  /** Experiência acumulada no nível atual */
  xp: number
  /** Experiência necessária para o próximo nível */
  xpToNext: number
  /** Nível atual do jogador */
  level: number
  /** Dias consecutivos registrando transações */
  streak: number
  /** Mês de referência no formato "YYYY-MM" */
  month: string

  /** Deduz um valor do HP e incrementa o streak */
  addTransaction: (amount: number) => void
  /** Adiciona XP e gerencia level up */
  addXp: (amount: number) => void
  /** Fecha o mês: calcula bônus de XP e reseta HP/streak */
  endMonth: () => void
  /** Define o orçamento mensal (maxHp) e recalcula HP proporcionalmente */
  setBudget: (newMaxHp: number) => void
  /** Define a reserva financeira (MP) */
  setSavings: (newMp: number) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
  hp: 2500,
  maxHp: 2500,
  mp: 2000,
  maxMp: 2000,
  xp: 0,
  xpToNext: 100,
  level: 1,
  streak: 0,
  month: '2026-07',

  /** Deduz o valor do HP (não deixa ficar negativo) e incrementa o streak */
  addTransaction: (amount) => {
    const state = get()
    const newHp = Math.max(0, state.hp - amount)
    set({ hp: newHp, streak: state.streak + 1 })
  },

  /** Adiciona XP; se ultrapassar o necessário, sobe de nível com escala 1.5x */
  addXp: (amount) => {
    const state = get()
    const newXp = state.xp + amount
    if (newXp >= state.xpToNext) {
      set({
        xp: newXp - state.xpToNext,
        xpToNext: Math.floor(state.xpToNext * 1.5),
        level: state.level + 1,
      })
    } else {
      set({ xp: newXp })
    }
  },

  /** Finaliza o mês: concede XP bônus se HP > 0, reseta HP e streak */
  endMonth: () => {
    const state = get()
    const hpPercent = state.hp / state.maxHp
    if (hpPercent > 0) {
      get().addXp(hpPercent > 0.5 ? 200 : 100)
    }
    set({
      month: new Date().toISOString().slice(0, 7),
      hp: state.maxHp,
      streak: 0,
    })
  },

  /** Define o orçamento mensal e recalcula HP proporcionalmente */
  setBudget: (newMaxHp) => {
    const state = get()
    const ratio = state.maxHp > 0 ? state.hp / state.maxHp : 1
    const newHp = Math.round(newMaxHp * ratio)
    set({ maxHp: newMaxHp, hp: Math.max(0, newHp) })
  },

  /** Define a reserva financeira (MP máximo) */
  setSavings: (newMaxMp) => {
    set({ maxMp: newMaxMp, mp: newMaxMp })
  },
}),
{ name: 'polybudget-player' }
))
