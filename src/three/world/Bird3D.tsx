import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide } from 'three'
import type { Group, Mesh } from 'three'

interface Bird3DProps {
  center: [number, number, number]
  radius?: number
  height?: number
  speed?: number
  color?: string
  offset?: number
}

/** A tiny low-poly bird — cone body + two flapping wing planes — gliding in a
 * slow loop high above the village. Cheap enough to place a dozen of. */
export function Bird3D({ center, radius = 6, height = 5, speed = 0.3, color = '#4B5563', offset = 0 }: Bird3DProps) {
  const group = useRef<Group>(null)
  const leftWing = useRef<Mesh>(null)
  const rightWing = useRef<Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset * 10
    if (group.current) {
      group.current.position.set(
        center[0] + Math.cos(t) * radius,
        center[1] + height + Math.sin(t * 0.8) * 0.6,
        center[2] + Math.sin(t) * radius
      )
      group.current.rotation.y = -t + Math.PI / 2
    }
    const flap = Math.sin(t * 10) * 0.8
    if (leftWing.current) leftWing.current.rotation.z = flap
    if (rightWing.current) rightWing.current.rotation.z = -flap
  })

  return (
    <group ref={group}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.035, 0.16, 5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={leftWing} position={[0, 0, 0.04]}>
        <planeGeometry args={[0.16, 0.045]} />
        <meshBasicMaterial color={color} side={DoubleSide} />
      </mesh>
      <mesh ref={rightWing} position={[0, 0, -0.04]}>
        <planeGeometry args={[0.16, 0.045]} />
        <meshBasicMaterial color={color} side={DoubleSide} />
      </mesh>
    </group>
  )
}
