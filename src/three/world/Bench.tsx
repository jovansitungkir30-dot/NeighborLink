interface BenchProps {
  position?: [number, number, number]
  rotationY?: number
}

/** A simple wooden park bench built from primitives — Kenney's town kit has
 * a stall-bench, but no standalone bench. */
export function Bench({ position = [0, 0, 0], rotationY = 0 }: BenchProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.9, 0.06, 0.32]} />
        <meshStandardMaterial color="#8B5E34" />
      </mesh>
      <mesh position={[0, 0.5, -0.14]} castShadow>
        <boxGeometry args={[0.9, 0.4, 0.06]} />
        <meshStandardMaterial color="#8B5E34" />
      </mesh>
      {[-0.38, 0.38].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.14, 0.12]} castShadow>
            <boxGeometry args={[0.06, 0.28, 0.06]} />
            <meshStandardMaterial color="#44403C" />
          </mesh>
          <mesh position={[x, 0.14, -0.12]} castShadow>
            <boxGeometry args={[0.06, 0.28, 0.06]} />
            <meshStandardMaterial color="#44403C" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
