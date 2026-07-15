'use client'

import dynamic from 'next/dynamic'

/**
 * Importação dinâmica da cena 3D com SSR desabilitado.
 * O Three.js precisa do objeto `window` do navegador para funcionar,
 * então não pode ser renderizado no servidor.
 */
const Scene = dynamic(
  () => import('@/components/three/BudgetScene').then((m) => ({ default: m.BudgetScene })),
  { ssr: false },
)

export default Scene
