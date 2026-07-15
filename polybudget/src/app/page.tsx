'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Tela de abertura (splash) estilo boot de PlayStation 1.
 * Exibe o logotipo do PolyBudget por 2 segundos com efeito de fade,
 * depois redireciona automaticamente para o Dashboard.
 */
export default function SplashPage() {
  const router = useRouter()
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFade(true), 2000)
    const r = setTimeout(() => router.push('/dashboard'), 2800)
    return () => { clearTimeout(t); clearTimeout(r) }
  }, [router])

  return (
    <div
      className={`fixed inset-0 bg-ps1-black flex flex-col items-center justify-center
                  transition-opacity duration-700 ${fade ? 'opacity-0' : 'opacity-100'}`}
    >
      <h1 className="font-pixel text-2xl text-ps1-white mb-4 glow-text">
        POLYBUDGET
      </h1>
      <p className="font-mono text-ps1-white text-lg animate-pulse">
        Inicializando...
      </p>
    </div>
  )
}
