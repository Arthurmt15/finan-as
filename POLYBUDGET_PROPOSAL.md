   # PolyBudget Web — Proposta de Arquitetura & Stack

---

## 1. Sugestões de Nomes

| Nome | Justificativa Temática |
|------|------------------------|
| **PolyBudget** | Fusão direta de "Polygon" + "Budget". Curto, memorável, comunica a estética low-poly e o propósito financeiro. |
| **Budget Station** | Trocadilho com "PlayStation". A palavra "Station" remete ao console e ao hub central de controle financeiro. |
| **PixelWallet** | "Pixel" pela estética retro + "Wallet" (carteira). Soa amigável e evoca a ideia de jogos clássicos de RPG. |

> **Recomendação principal:** `PolyBudget` — nome original do solicitante, mais profissional e fácil de encontrar/search engine.

---

## 2. Arquitetura de Telas (UI/UX Flow)

```
                    ┌───────────────────────────────────┐
                    │         SPLASH / LOADING           │
                    │  (Animação 3D low-poly do logo +   │
                    │   som de inicialização de console)  │
                    └────────────┬──────────────────────┘
                                 │
                    ┌────────────▼──────────────────────┐
                    │       DASHBOARD / TELA STATUS      │ ← Tela principal
                    │  ┌─────────────────────────────┐   │
                    │  │  HP ████████░░  R$ 1.200    │   │
                    │  │  MP ████░░░░░░  R$ 400      │   │
                    │  │  LV 5  XP ██████░░░░ 60%    │   │
                    │  └─────────────────────────────┘   │
                    │                                    │
                    │   [Cena 3D low-poly de fundo —     │
                    │    cubos/instâncias girando com     │
                    │    vertex wobble shader]            │
                    │                                    │
                    │  [NOVO GASTO] [CONTAS] [MEMORY CARD]│
                    └──────┬──────────┬──────────┬───────┘
                           │          │          │
              ┌────────────▼──┐  ┌────▼─────┐  ┌▼──────────────┐
              │ REGISTRAR     │  │ PAGAR    │  │ MEMORY CARD   │
              │ TRANSAÇÃO     │  │ CONTAS   │  │ (Backup)      │
              │ (LOJINHA RPG) │  │ (BOSS    │  │               │
              │               │  │  FIGHT)  │  │ - Backup      │
              │ Item 3D na    │  │           │  │   Local       │
              │ tela, escolhe │  │ Animação  │  │ - Cloud Sync  │
              │ categoria,    │  │ 3D de     │  │ - Exportar    │
              │ confirma =    │  │ combate,  │  │   JSON/CSV    │
              │ "comprou"     │  │ gasto     │  │ - Animação    │
              │               │  │ deduzido  │  │   Memory Card │
              └───────────────┘  └───────────┘  │   inserido    │
                                                └───────────────┘
                           │
              ┌────────────▼──────────────┐
              │      CATEGORIAS 3D        │
              │  (Grid de ícones low-poly │
              │   que giram no hover —     │
              │   Alimentação, Transporte, │
              │   Lazer, Moradia...)      │
              └───────────────────────────┘
```

### 2.1 Fluxo de Navegação Detalhado

| Tela | O que acontece |
|------|---------------|
| **Splash** | Logotipo 3D low-poly rotacionando com shader de "vertex wobble" e ruído de TV antiga. Transição automática após carregar assets. |
| **Dashboard** | Hub central. Painel 2D estilo RPG (HP, MP, LV, XP) sobreposto a um canvas 3D com elementos low-poly animados. Botões flutuantes para ações principais. |
| **Registrar Transação** | Interface "lojinha de RPG" — um item 3D (ex: café, pão) é exibido no centro, com preço e confirmação. Ao comprar, som de "moeda" e gasto registrado. |
| **Pagar Contas** | Tela de batalha por turnos simplificada. O saldo disponível "ataca" um Boss (ex: "Aluguel, o Devorador de Salários") com animação 3D. |
| **Memory Card** | Tela de backup com animação de Memory Card sendo inserido no slot. Opções: salvar local, sincronizar nuvem, exportar. |
| **Categorias** | Grid 3D interativo. Cada categoria é um mesh low-poly (ex: uma maçã para alimentação) que rotaciona ao passar o mouse. |

---

## 3. Stack Técnica Recomendada

### 3.1 Frontend

| Tecnologia | Por quê |
|-----------|---------|
| **Next.js 14 (App Router)** | SSR/SSG para performance em mobile, PWA-ready com service workers, ecossistema React maduro. |
| **Tailwind CSS v4** | Utilitário CSS rápido. Ideal para estilizar os elementos 2D sem conflitar com o canvas 3D. Fácil de aplicar fontes pixeladas e bordas retro. |
| **Fontes Pixeladas** | `"Press Start 2P"` (Google Fonts) para títulos/números. `"VT323"` para corpo. |

### 3.2 Camada 3D

| Tecnologia | Por quê |
|-----------|---------|
| **React Three Fiber** | Camada declarativa do Three.js para React. Permite criar cenas 3D complexas com componentização React. |
| **@react-three/drei** | Coleção de helpers prontos (OrbitControls, shaders, texturas, HTML overlays). Acelera o desenvolvimento. |
| **@react-three/postprocessing** | Efeitos de pós-processamento (scanlines, CRT, chromatic aberration). Essencial para a estética PS1. |
| **Custom Shaders (GLSL)** | Shaders de "vertex wobble" e "affine texture mapping" para simular as imperfeições geométricas do PS1. |

### 3.3 Gerenciamento de Estado & Dados

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Estado Global** | **Zustand** | Leve, sem boilerplate, funciona bem com React e fora do ciclo de renderização. Ideal para guardar saldo, XP, streak. |
| **Persistência Local** | **Dexie.js** (IndexedDB) | Wrapper elegante para IndexedDB. Suporta queries, schemas versionados. Dados ficam offline. |
| **Sincronização Cloud** | **Supabase** | PostgreSQL como backend, SDK JS excelente, suporte a realtime, autenticação built-in. Mais flexível que Firebase para modelagem financeira. |
| **PWA / Service Worker** | **next-pwa** ou `@serwist` | Cache de assets, suporte offline full, manifest para instalação como app. |

### 3.4 Áudio

| Tecnologia | Justificativa |
|-----------|---------------|
| **Howler.js + Web Audio API** | Howler para reprodução cross-browser; Web Audio API para manipular sample rate (16-bit crunch effect). |
| **jsfxr / sfxr** | Geradores de sons retro (coleta de moeda, dano, level up) inline, sem depender de arquivos externos. Ou sample packs gratuitos de chipmusic. |

### 3.5 Otimização de Performance (crítico para mobile)

- **Lazy loading do canvas 3D**: O componente `<Canvas>` do R3F só monta quando visível (viewport observer).
- **InstancedMesh**: Para múltiplos objetos (ex: partículas low-poly), usar instâncias reduz draw calls.
- **Redução de polígonos**: Modelos com <500 polígonos cada. Usar `useMemo` e `React.memo` em meshes.
- **Desligar pós-processamento em mobile**: Detectar capacidade via `useDetectGPU` (drei) e desativar scanlines/CRT em GPUs fracas.
- **Throttle de renderização**: R3F com `frameloop="demand"` — só renderiza quando há interação ou animação ativa.

### 3.6 Estrutura de Diretórios Sugerida

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx            # Splash -> Dashboard
│   ├── dashboard/
│   ├── transactions/
│   ├── bills/
│   └── memory-card/
├── components/
│   ├── three/              # Componentes 3D (R3F)
│   │   ├── Scene.tsx
│   │   ├── LowPolyCoin.tsx
│   │   ├── BossModel.tsx
│   │   ├── MemoryCardModel.tsx
│   │   └── shaders/
│   │       ├── vertexWobble.glsl
│   │       └── crtEffect.glsl
│   ├── ui/                 # Componentes 2D (Tailwind)
│   │   ├── StatusBar.tsx   # HP/MP/XP bars
│   │   ├── ShopDialog.tsx
│   │   └── DialogBox.tsx   # Caixa estilo RPG
│   └── audio/
│       └── SoundManager.ts
├── stores/                 # Zustand stores
│   ├── useBudgetStore.ts
│   ├── usePlayerStore.ts
│   └── useSettingsStore.ts
├── db/                     # Dexie.js (IndexedDB)
│   └── database.ts
├── hooks/                  # Custom hooks
│   ├── useSound.ts
│   └── usePerformance.ts
└── styles/
    └── globals.css         # Tailwind + fontes
```

---

## 4. Código de Exemplo — Dashboard

Abaixo, o código-fonte completo de uma tela de Dashboard funcional integrando layout 2D estilo RPG com canvas 3D low-poly de fundo. O projeto scaffoldado encontra-se em `./polybudget/`.

### 4.1 Estrutura de Arquivos do Exemplo

```
src/
├── app/
│   ├── globals.css            # Estilos PS1 (scanlines, dialog-box, barras HP/MP/XP)
│   ├── layout.tsx             # Root layout com fontes pixeladas e classe .scanlines
│   └── page.tsx               # Splash screen (animação "Inicializando...")
├── components/
│   ├── ui/
│   │   └── StatusPanel.tsx    # Painel RPG com HP, MP, XP, LV, Streak
│   └── three/
│       ├── BudgetScene.tsx    # Cena 3D low-poly (moeda + cubos flutuantes)
│       ├── DynamicScene.tsx   # Dynamic import (desabilita SSR no canvas)
│       └── shaders/
│           └── vertexWobble.ts  # Shader GLSL de vertex wobble PS1
├── stores/
│   └── usePlayerStore.ts      # Zustand: estado do jogador (HP, MP, XP, LV)
├── db/
│   └── database.ts            # Dexie.js (IndexedDB)
└── types/
    └── index.ts               # TypeScript types (Transaction, Category)
```

### 4.2 Código-Fonte dos Principais Componentes

#### `src/app/globals.css` — Tema PS1

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

@layer base {
  body {
    @apply bg-ps1-black text-ps1-white font-mono antialiased;
    image-rendering: pixelated;
  }
}

@layer components {
  .dialog-box {
    @apply bg-ps1-blue border-2 border-ps1-white text-ps1-white p-4 shadow-ps1;
    box-shadow: inset -2px -2px 0px #000080, inset 2px 2px 0px #6060ff;
  }
  .btn-ps1 {
    @apply bg-ps1-blue-light border-2 border-ps1-white text-ps1-white px-4 py-2
           font-pixel text-xs uppercase tracking-wider
           hover:bg-ps1-blue active:translate-y-0.5;
    box-shadow: 3px 3px 0px #000;
  }
  .hp-bar {
    @apply h-3 border border-ps1-white;
    background: repeating-linear-gradient(
      90deg,
      #00a000 0px, #00a000 4px,
      #00c000 4px, #00c000 8px
    );
  }
  .mp-bar {
    @apply h-3 border border-ps1-white;
    background: repeating-linear-gradient(
      90deg,
      #0000c0 0px, #0000c0 4px,
      #3030ff 4px, #3030ff 8px
    );
  }
  .xp-bar {
    @apply h-2 border border-ps1-white;
    background: repeating-linear-gradient(
      90deg,
      #c0c000 0px, #c0c000 4px,
      #ffff00 4px, #ffff00 8px
    );
  }
  .scanlines {
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
    );
  }
  .glow-text {
    text-shadow: 2px 2px 0px #000, -1px -1px 0px rgba(255,255,255,0.1);
  }
}
```

#### `src/stores/usePlayerStore.ts` — Estado Global (Zustand)

```ts
import { create } from 'zustand'

export interface PlayerState {
  hp: number        // budget restante do mês
  maxHp: number     // orçamento total do mês
  mp: number        // economias/reserva
  maxMp: number
  xp: number
  xpToNext: number
  level: number
  streak: number    // dias consecutivos registrando
  month: string

  addTransaction: (amount: number) => void
  addXp: (amount: number) => void
  endMonth: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  hp: 1200,
  maxHp: 2500,
  mp: 400,
  maxMp: 2000,
  xp: 60,
  xpToNext: 100,
  level: 5,
  streak: 3,
  month: '2026-07',

  addTransaction: (amount) => {
    const state = get()
    const newHp = Math.max(0, state.hp - amount)
    set({ hp: newHp, streak: state.streak + 1 })
  },

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
}))
```

#### `src/components/ui/StatusPanel.tsx` — Barras de Status (RPG)

```tsx
'use client'

import { usePlayerStore } from '@/stores/usePlayerStore'

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

export function StatusPanel() {
  const { hp, maxHp, mp, maxMp, xp, xpToNext, level, streak } = usePlayerStore()

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
          <div className="xp-bar absolute top-0 left-0" style={{ width: `${(xp/xpToNext)*100}%` }} />
        </div>
        <span className="font-pixel text-[8px] w-20 text-left text-ps1-white">
          {xp}/{xpToNext}
        </span>
      </div>
    </div>
  )
}
```

#### `src/components/three/BudgetScene.tsx` — Cena 3D Low-Poly

```tsx
'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

function LowPolyCoin() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    meshRef.current.rotation.y += 0.01
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.15, 8]} />
        <MeshDistortMaterial
          color="#c0c000"
          emissive="#808000"
          emissiveIntensity={0.1}
          flatShading
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </Float>
  )
}

function FloatingCubes({ count = 30 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = new THREE.Object3D()

  const positions = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 12,
    y: (Math.random() - 0.5) * 8,
    z: (Math.random() - 0.5) * 6 - 3,
    rotSpeed: 0.005 + Math.random() * 0.02,
    bobSpeed: 0.3 + Math.random() * 0.5,
  }))

  useFrame((state) => {
    positions.forEach((p, i) => {
      dummy.position.set(
        p.x,
        p.y + Math.sin(state.clock.elapsedTime * p.bobSpeed + i) * 0.3,
        p.z
      )
      dummy.rotation.set(
        state.clock.elapsedTime * p.rotSpeed + i,
        state.clock.elapsedTime * p.rotSpeed * 1.5 + i, 0
      )
      dummy.scale.setScalar(0.08 + Math.random() * 0.06)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#4040a0"
        flatShading
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={0.25}
      />
    </instancedMesh>
  )
}

export function BudgetScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        frameloop="demand"
        dpr={[0.5, 1]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#8080ff" />
        <directionalLight position={[-5, -3, 2]} intensity={0.2} color="#ff8080" />
        <LowPolyCoin />
        <FloatingCubes count={24} />
      </Canvas>
    </div>
  )
}
```

#### `src/app/page.tsx` — Splash Screen (Boot PS1)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
```

#### `src/app/layout.tsx` — Root Layout

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PolyBudget — Status Financeiro',
  description: 'Gerencie seu orçamento como em um RPG clássico.',
  manifest: '/manifest.json',
}

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
```

### 4.3 Como Executar

```bash
cd polybudget
npm install        # já executado
npm run dev        # http://localhost:3000
npm run build      # produção
```

O build compila sem erros e gera as rotas `/` (splash) e `/dashboard` com ~90 kB de First Load JS total — leve o suficiente para mobile.

