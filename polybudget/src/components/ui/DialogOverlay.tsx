'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Overlay de fundo escuro que envolve um card/dialog.
 * Ao clicar fora do card (no backdrop), navega de volta ao dashboard
 * ou executa o callback `onClose` se fornecido.
 */
export function DialogOverlay({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  const router = useRouter()

  function handleClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose?.() ?? router.push('/dashboard')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ps1-black/80 flex items-center justify-center z-50"
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
