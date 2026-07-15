/** Transação financeira registrada pelo usuário */
export interface Transaction {
  /** Identificador único */
  id: string
  /** Valor em reais (positivo para receita, negativo para despesa) */
  amount: number
  /** Categoria do gasto (alimentacao, transporte, etc.) */
  category: CategoryId
  /** Descrição livre do que foi gasto */
  description: string
  /** Data em que a transação ocorreu */
  date: Date
  /** Tipo: despesa ou receita */
  type: 'expense' | 'income'
}

/** Categorias de gasto disponíveis no sistema, incluindo contas fixas */
export type CategoryId =
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'lazer'
  | 'saude'
  | 'educacao'
  | 'outros'
  | 'aluguel'
  | 'agua'
  | 'luz'
  | 'internet'

/** Metadados de uma categoria para exibição na interface */
export interface Category {
  id: CategoryId
  label: string
  color: string
}
