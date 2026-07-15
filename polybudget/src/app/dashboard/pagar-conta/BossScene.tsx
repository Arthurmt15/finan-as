'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Modelo 3D low-poly do boss para a batalha.
 * Composto por:
 * - Corpo principal (icosaedro com vértices deslocados aleatoriamente)
 * - Olhos esféricos low-poly (4 segmentos)
 * - Chifres cônicos (estilo "devorador de salários")
 *
 * A cor do corpo muda conforme a vida restante (verde → amarelo → vermelho).
 * Quando o jogador ataca, o modelo treme com vertex wobble procedural.
 */
function BossModel({ bossHp, maxHp, playerAttack }: {
  bossHp: number
  maxHp: number
  playerAttack: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const bodyRef = useRef<THREE.Mesh>(null!)
  const wobble = useRef(0)

  const healthPct = bossHp / maxHp
  const color = healthPct > 0.5 ? '#c00000' : healthPct > 0.25 ? '#a0a000' : '#600000'

  useFrame((state) => {
    wobble.current += 0.03
    if (!groupRef.current) return

    const rotSpeed = playerAttack ? 0.05 : 0.008
    const rotIntensity = playerAttack ? 0.3 : 0.05

    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    groupRef.current.rotation.y += rotSpeed

    if (playerAttack && bodyRef.current) {
      bodyRef.current.position.x = Math.sin(wobble.current * 10) * 0.15
      bodyRef.current.position.z = Math.sin(wobble.current * 8) * 0.1
    }

    if (bodyRef.current) {
      bodyRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * rotIntensity
      bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * rotIntensity
    }
  })

  /** Gera a geometria do corpo com vértices deslocados (low-poly imperfeito) */
  const bodyGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.8, 0)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      const offset = (Math.random() - 0.5) * 0.15
      pos.setXYZ(i, x + offset, y + offset, z + offset)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group ref={groupRef}>
      <mesh ref={bodyRef} geometry={bodyGeo} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} flatShading roughness={0.8} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[-0.3, 0.25, 0.7]}>
        <sphereGeometry args={[0.12, 4, 4]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[0.3, 0.25, 0.7]}>
        <sphereGeometry args={[0.12, 4, 4]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[-0.25, 0.6, 0.3]} rotation={[0.2, 0, -0.3]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <meshStandardMaterial color="#c0c000" flatShading />
      </mesh>
      <mesh position={[0.25, 0.6, 0.3]} rotation={[0.2, 0, 0.3]}>
        <coneGeometry args={[0.08, 0.25, 4]} />
        <meshStandardMaterial color="#c0c000" flatShading />
      </mesh>
    </group>
  )
}

/**
 * Cena 3D que encapsula o modelo do boss.
 * Renderiza em um Canvas absoluto com iluminação dramática (luzes vermelha e azul).
 * Configurações otimizadas: sem antialias, dpr reduzido, alpha=true.
 */
export default function BossScene({ bossHp, maxHp, playerAttack }: {
  bossHp: number
  maxHp: number
  playerAttack: boolean
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[0.5, 1]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ff8080" />
      <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#8080ff" />
      <BossModel bossHp={bossHp} maxHp={maxHp} playerAttack={playerAttack} />
    </Canvas>
  )
}
