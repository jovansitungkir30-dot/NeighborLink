import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'

interface ChimneySmoke3DProps {
  position?: [number, number, number]
}

const PUFF_COUNT = 4

/** Soft round puffs that loop upward and fade, billboarded to always face the camera. */
export function ChimneySmoke3D({ position = [0, 0, 0] }: ChimneySmoke3DProps) {
  const refs = useRef<(Mesh | null)[]>([])
  const offsets = useMemo(() => Array.from({ length: PUFF_COUNT }, (_, i) => i / PUFF_COUNT), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((mesh, i) => {
      if (!mesh) return
      const loopT = (t * 0.12 + offsets[i]) % 1
      mesh.position.set(Math.sin((t + offsets[i] * 10) * 0.6) * 0.15, loopT * 2.4, 0)
      const s = 0.35 + i * 0.08 * (0.6 + loopT * 0.8)
      mesh.scale.setScalar(s)
      const mat = mesh.material as MeshBasicMaterial
      mat.opacity = 0.45 * (1 - loopT)
    })
  })

  return (
    <group position={position}>
      {offsets.map((_offset, i) => (
        <Billboard key={i}>
          <mesh ref={(el) => { refs.current[i] = el }}>
            <circleGeometry args={[1, 16]} />
            <meshBasicMaterial color="#E7E4DE" transparent opacity={0.4} depthWrite={false} />
          </mesh>
        </Billboard>
      ))}
    </group>
  )
}
