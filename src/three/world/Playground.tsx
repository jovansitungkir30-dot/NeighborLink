import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

interface PlaygroundProps {
  position?: [number, number, number]
  rotationY?: number
}

/** A small swing set + seesaw built from primitives, both gently animated —
 * no matching Kenney playground kit exists, and hand-built keeps it in the
 * same low-poly language as the rest of the village. */
export function Playground({ position = [0, 0, 0], rotationY = 0 }: PlaygroundProps) {
  const swingRef = useRef<Group>(null)
  const seesawRef = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (swingRef.current) swingRef.current.rotation.x = Math.sin(t * 1.1) * 0.22
    if (seesawRef.current) seesawRef.current.rotation.z = Math.sin(t * 0.7) * 0.18
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[-1.3, 0, 0]}>
        <mesh position={[-0.65, 0.8, 0]} rotation={[0, 0, 0.28]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 1.8, 6]} />
          <meshStandardMaterial color="#92400E" />
        </mesh>
        <mesh position={[0.65, 0.8, 0]} rotation={[0, 0, -0.28]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 1.8, 6]} />
          <meshStandardMaterial color="#92400E" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[1.4, 0.06, 0.06]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <group ref={swingRef} position={[0, 1.5, 0]}>
          <mesh position={[-0.18, -0.55, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.1, 4]} />
            <meshStandardMaterial color="#44403C" />
          </mesh>
          <mesh position={[0.18, -0.55, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.1, 4]} />
            <meshStandardMaterial color="#44403C" />
          </mesh>
          <mesh position={[0, -1.1, 0]} castShadow>
            <boxGeometry args={[0.4, 0.04, 0.16]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
        </group>
      </group>

      <group position={[1.4, 0, 0.6]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <coneGeometry args={[0.16, 0.5, 4]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
        <group ref={seesawRef} position={[0, 0.53, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.06, 0.22]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          <mesh position={[-0.8, 0.1, 0]} castShadow>
            <boxGeometry args={[0.16, 0.16, 0.2]} />
            <meshStandardMaterial color="#FDE68A" />
          </mesh>
          <mesh position={[0.8, 0.1, 0]} castShadow>
            <boxGeometry args={[0.16, 0.16, 0.2]} />
            <meshStandardMaterial color="#93C5FD" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
