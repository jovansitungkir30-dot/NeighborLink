import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

interface RunningDogProps {
  center: [number, number, number]
  radius?: number
  speed?: number
  color?: string
}

/** A simple low-poly dog built from primitives, looping around the park with a bouncy gait. */
export function RunningDog({ center, radius = 2.6, speed = 0.6, color = '#B45309' }: RunningDogProps) {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * speed
    const x = center[0] + Math.cos(t) * radius
    const z = center[2] + Math.sin(t) * radius
    const bounce = Math.abs(Math.sin(t * 9)) * 0.06
    group.current.position.set(x, center[1] + 0.14 + bounce, z)
    group.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={group} scale={0.5}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.34, 0.2, 0.16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.14]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.19, 0.22, 0]} rotation={[0, 0, -0.6]} castShadow>
        <boxGeometry args={[0.04, 0.16, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
