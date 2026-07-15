'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTransactions } from '@/hooks/useTransactions'
import { DialogOverlay } from '@/components/ui/DialogOverlay'

type Phase = 'menu' | 'saving' | 'saved' | 'exporting' | 'exported'

/**
 * Página "Memory Card" — sistema de backup e exportação de dados.
 * Oferece:
 * - Salvamento local (simula Memory Card do PS1 com animação)
 * - Exportação JSON / CSV
 * - Sincronização na nuvem (placeholder para versão Pro)
 * - Limpeza total dos dados
 *
 * O visual inclui um Memory Card estilizado com LEDs que piscam durante operações.
 */
export default function MemoryCardPage() {
  const router = useRouter()
  const { exportJson, exportCsv, clearAll } = useTransactions()
  const [phase, setPhase] = useState<Phase>('menu')
  const [message, setMessage] = useState('')

  /** Salva um snapshot do estado no localStorage com animação de saving */
  async function handleSaveLocal() {
    setPhase('saving')
    setMessage('Salvando no Memory Card...')
    await sleep(1000)
    const backup = {
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      data: 'Dados salvos no navegador (IndexedDB).',
    }
    localStorage.setItem('polybudget-backup', JSON.stringify(backup))
    setPhase('saved')
    setMessage('Salvo com sucesso!')
  }

  /** Exporta todas as transações como JSON */
  async function handleExportJson() {
    setPhase('exporting')
    setMessage('Exportando dados...')
    await sleep(600)
    await exportJson()
    setPhase('exported')
    setMessage('Arquivo JSON exportado!')
  }

  /** Exporta todas as transações como CSV */
  async function handleExportCsv() {
    setPhase('exporting')
    setMessage('Exportando dados...')
    await sleep(600)
    await exportCsv()
    setPhase('exported')
    setMessage('Arquivo CSV exportado!')
  }

  /** Placeholder de sincronização na nuvem */
  async function handleCloudSync() {
    setPhase('saving')
    setMessage('Sincronizando com a nuvem...')
    await sleep(2000)
    setPhase('saved')
    setMessage('Nuvem: recurso disponível na versão Pro.')
  }

  return (
    <DialogOverlay>
      <div className="flex flex-col items-center w-full max-w-md">
        <h1 className="font-pixel text-sm text-ps1-white glow-text mb-6">
          MEMORY CARD
        </h1>

        {/* Representação visual estilizada de um Memory Card do PS1 */}
        <div className="w-32 h-48 bg-gradient-to-b from-ps1-blue to-ps1-blue-light border-2 border-ps1-white
                        rounded-sm mb-6 flex flex-col items-center justify-center gap-2 shadow-ps1
                        relative overflow-hidden">
          <div className="w-16 h-10 bg-ps1-black border border-ps1-white rounded-sm flex items-center justify-center">
            <span className="font-pixel text-[6px] text-ps1-white">BLOCK</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`w-3 h-3 rounded-full border border-ps1-white ${phase === 'saving' ? 'bg-ps1-yellow animate-pulse' : 'bg-green-700'}`} />
            ))}
          </div>
          <p className="font-pixel text-[6px] text-ps1-white">POLYBUDGET</p>

          {phase === 'saving' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-3/4 h-1 bg-ps1-yellow animate-pulse" />
            </div>
          )}
        </div>

        {/* Mensagem de status da operação atual */}
        {message && (
          <p className="font-mono text-sm text-ps1-yellow mb-4 animate-pulse">{message}</p>
        )}

        {/* Botões de ação */}
        <div className="w-full max-w-md space-y-3">
          <button onClick={handleSaveLocal} disabled={phase === 'saving' || phase === 'exporting'} className="btn-ps1 w-full disabled:opacity-30">
            SALVAR (Memory Card Local)
          </button>
          <button onClick={handleExportJson} disabled={phase === 'saving' || phase === 'exporting'} className="btn-ps1 w-full disabled:opacity-30">
            EXPORTAR JSON
          </button>
          <button onClick={handleExportCsv} disabled={phase === 'saving' || phase === 'exporting'} className="btn-ps1 w-full disabled:opacity-30">
            EXPORTAR CSV
          </button>
          <button onClick={handleCloudSync} disabled={phase === 'saving' || phase === 'exporting'} className="btn-ps1 w-full disabled:opacity-30">
            SINC. NUVEM (Pro)
          </button>

          <hr className="border-ps1-white/20 my-4" />

          <button onClick={clearAll} className="btn-ps1 w-full bg-red-900 hover:bg-red-800">
            APAGAR TODOS OS DADOS
          </button>

          <button onClick={() => router.push('/dashboard')} className="btn-ps1 w-full mt-4">
            VOLTAR
          </button>
        </div>
      </div>
    </DialogOverlay>
  )
}

/** Utilitário para pausar a execução (simula tempo de operação) */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
