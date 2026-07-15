import type { CategoryId } from '@/types'

/** Dados de exibição de uma categoria de gasto */
export interface CategoryData {
  id: CategoryId
  /** Nome legível (ex: "Alimentação") */
  label: string
  /** Emoji representando a categoria */
  icon: string
  /** Cor principal para temas e barras */
  color: string
  /** Variação mais clara da cor principal */
  lightColor: string
}

/** Categorias de gastos do dia a dia com ícone e cores PS1 */
export const categories: CategoryData[] = [
  { id: 'alimentacao', label: 'Alimentação', icon: '🍞', color: '#00a000', lightColor: '#00c000' },
  { id: 'transporte', label: 'Transporte', icon: '🚗', color: '#c0c000', lightColor: '#ffff00' },
  { id: 'moradia', label: 'Moradia', icon: '🏠', color: '#c00000', lightColor: '#ff3030' },
  { id: 'lazer', label: 'Lazer', icon: '🎮', color: '#a000c0', lightColor: '#d030ff' },
  { id: 'saude', label: 'Saúde', icon: '❤️', color: '#00a0a0', lightColor: '#00c0c0' },
  { id: 'educacao', label: 'Educação', icon: '📚', color: '#6060c0', lightColor: '#8080ff' },
  { id: 'outros', label: 'Outros', icon: '📦', color: '#808080', lightColor: '#a0a0a0' },
]

/** Contas fixas mensais (bosses do sistema de boss fight) */
export const fixedBills: CategoryData[] = [
  { id: 'aluguel', label: 'Aluguel', icon: '🏢', color: '#c00000', lightColor: '#ff3030' },
  { id: 'internet', label: 'Internet', icon: '🌐', color: '#0000c0', lightColor: '#3030ff' },
  { id: 'agua', label: 'Água', icon: '💧', color: '#0080c0', lightColor: '#00a0ff' },
  { id: 'luz', label: 'Luz', icon: '⚡', color: '#c0c000', lightColor: '#ffff00' },
]

/**
 * Mapa de bosses para o sistema de boss fight.
 * Cada chave corresponde ao id da conta fixa.
 */
export const bossMap: Record<string, { name: string; hp: number; desc: string }> = {
  aluguel: { name: 'Aluguel, o Devorador de Salários', hp: 1500, desc: 'Um gigante de concreto que aparece todo início de mês.' },
  internet: { name: 'Provedor Sombrio', hp: 120, desc: 'Uma entidade digital que vive nos roteadores.' },
  agua: { name: 'Hidro-Mago das Profundezas', hp: 90, desc: 'Domina as correntezas do seu bolso.' },
  luz: { name: 'Lord Voltagem', hp: 140, desc: 'Eletrocuta seu orçamento mensalmente.' },
}
