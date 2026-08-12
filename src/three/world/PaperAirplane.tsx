import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, type Group } from 'three'

interface PaperAirplaneProps {
  center: [number, number, number]
  radius?: number
  height?: number
  speed?: number
}

/** A tiny folded-paper glider looping over the schoolyard. */
export function PaperAirplane({ center, radius = 2.4, height = 1.6, speed = 0.35 }: PaperAirplaneProps) {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * speed
    const x = center[0] + Math.cos(t) * radius
    const z = center[2] + Math.sin(t) * radius
    const y = center[1] + height + Math.sin(t * 2.3) * 0.3
    group.current.position.set(x, y, z)
    group.current.rotation.y = -t + Math.PI / 2
    group.current.rotation.z = Math.sin(t * 2) * 0.2
  })

  return (
    <group ref={group}>
      <mesh rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.06, 0.32, 3]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.6} side={DoubleSide} />
      </mesh>
    </group>
  )
}
