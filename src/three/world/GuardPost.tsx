import { Villager } from './Villager'

interface GuardPostProps {
  position?: [number, number, number]
  rotationY?: number
}

/** A small wooden guard booth just inside the main gate, with a villager
 * standing watch — no matching Kenney asset exists, hand-built from
 * primitives to match the low-poly language of the rest of the village. */
export function GuardPost({ position = [0, 0, 0], rotationY = 0 }: GuardPostProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.6, -0.25]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.2, 0.7]} />
        <meshStandardMaterial color="#8B5E34" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, 0.11]}>
        <boxGeometry args={[0.5, 0.55, 0.04]} />
        <meshStandardMaterial color="#1C1917" />
      </mesh>
      <mesh position={[0, 1.28, -0.25]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.72, 0.5, 4]} />
        <meshStandardMaterial color="#5B3A21" roughness={0.9} />
      </mesh>

      {/* a small striped barrier arm, half-raised */}
      <mesh position={[0.55, 0.15, 0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#44403C" />
      </mesh>
      <mesh position={[0.55, 0.32, 0.75]} rotation={[0.9, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.3, 6]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>

      <Villager variant="d" position={[0.9, 0, 0.3]} rotationY={-1.2} animation="idle" scale={0.24} />
    </group>
  )
}
