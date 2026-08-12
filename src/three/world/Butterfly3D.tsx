import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import type { Group, Mesh } from 'three'

interface Butterfly3DProps {
  center: [number, number, number]
  radius?: number
  height?: number
  speed?: number
  color?: string
  offset?: number
}

/** A small billboarded sprite that loops around a center point and flaps via scaleX. */
export function Butterfly3D({ center, radius = 1.4, height = 0.9, speed = 0.5, color = '#F97316', offset = 0 }: Butterfly3DProps) {
  const group = useRef<Group>(null)
  const wing = useRef<Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset * 10
    if (group.current) {
      group.current.position.set(
        center[0] + Math.cos(t) * radius,
        center[1] + height + Math.sin(t * 1.7) * 0.3,
        center[2] + Math.sin(t) * radius
      )
    }
    if (wing.current) {
      wing.current.scale.x = 0.5 + 0.5 * Math.abs(Math.sin(t * 6))
    }
  })

  return (
    <group ref={group}>
      <Billboard>
        <mesh ref={wing}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshBasicMaterial color={color} transparent opacity={0.95} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  )
}
