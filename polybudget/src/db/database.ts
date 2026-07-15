import Dexie, { type Table } from 'dexie'

/** Schema de uma transação no banco IndexedDB */
export interface Transaction {
  id?: number
  amount: number
  category: string
  description: string
  date: Date
  type: 'expense' | 'income'
}

/** Boss personalizado criado pelo usuário */
export interface CustomBoss {
  id?: number
  name: string
  icon: string
  hp: number
  desc: string
  createdAt: Date
}

/**
 * Banco de dados local PolyBudget usando Dexie (IndexedDB).
 * Opera offline-first — todos os dados ficam no navegador
 * com opção futura de sincronização na nuvem.
 */
export class PolyBudgetDB extends Dexie {
  /** Tabela de transações indexada por id, date, category e type */
  transactions!: Table<Transaction, number>
  /** Tabela de bosses personalizados criados pelo usuário */
  customBosses!: Table<CustomBoss, number>

  constructor() {
    super('PolyBudgetDB')
    this.version(3).stores({
      transactions: '++id, date, category, type',
      customBosses: '++id, name, createdAt',
    })
  }
}

/** Instância singleton do banco de dados */
export const db = new PolyBudgetDB()
