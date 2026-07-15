'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Moeda low-poly central com 8 segmentos, material distort
 * e rotação senoidal suave nos eixos X e Y.
 */
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

/**
 * Conjunto de cubos semitransparentes flutuando ao fundo.
 * Usa InstancedMesh para performance com muitos objetos.
 * Cada cubo tem posição, rotação e velocidade de oscilação aleatórias.
 */
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
      dummy.position.set(p.x, p.y + Math.sin(state.clock.elapsedTime * p.bobSpeed + i) * 0.3, p.z)
      dummy.rotation.set(
        state.clock.elapsedTime * p.rotSpeed + i,
        state.clock.elapsedTime * p.rotSpeed * 1.5 + i,
        0,
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

/**
 * Cena 3D de fundo do Dashboard.
 * Configurações otimizadas para mobile:
 * - antialias desligado (estética PS1)
 * - frameloop="demand" (só renderiza quando necessário)
 * - dpr reduzido para economizar bateria
 */
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
