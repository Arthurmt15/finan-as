import type { Metadata } from 'next'
import './globals.css'

/** Metadados globais da aplicação e configuração PWA via manifest.json */
export const metadata: Metadata = {
  title: 'PolyBudget — Status Financeiro',
  description: 'Gerencie seu orçamento como em um RPG clássico.',
  manifest: '/manifest.json',
}

/**
 * Layout raiz da aplicação.
 * Aplica o tema PS1: fundo preto, fonte monoespaçada, e o efeito
 * de scanlines (linhas horizontais) em todo o corpo da página.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen scanlines">{children}</body>
    </html>
  )
}
