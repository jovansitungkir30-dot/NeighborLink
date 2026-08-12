import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface MedicalCrossProps {
  position?: [number, number, number]
}

/** A small glowing cross sign, plus a soft rising light-ray column — reads as
 * "health center" without needing a bespoke building asset. */
export function MedicalCross({ position = [0, 0, 0] }: MedicalCrossProps) {
  const glow = useRef<Mesh>(null)

  useFrame((state) => {
    if (!glow.current) return
    const pulse = 0.75 + Math.sin(state.clock.elapsedTime * 1.6) * 0.15
    ;(glow.current.material as import('three').MeshBasicMaterial).opacity = pulse * 0.4
  })

  return (
    <group position={position}>
      <mesh position={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[0.55, 0.16, 0.08]} />
        <meshStandardMaterial color="#F8FAFC" emissive="#E11D48" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[0.16, 0.55, 0.08]} />
        <meshStandardMaterial color="#F8FAFC" emissive="#E11D48" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.9, 0.9, 0.04]} />
        <meshStandardMaterial color="#0D9488" />
      </mesh>

      {/* soft healing light column */}
      <mesh ref={glow} position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.05, 1.1, 4.8, 20, 1, true]} />
        <meshBasicMaterial color="#CFFAFE" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  )
}
