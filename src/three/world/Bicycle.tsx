interface BicycleProps {
  position?: [number, number, number]
  rotationY?: number
  color?: string
}

/** A small stylized bicycle leaning by a wall or fence — no matching Kenney
 * asset exists, hand-built from primitives to match the low-poly language. */
export function Bicycle({ position = [0, 0, 0], rotationY = 0, color = '#DC2626' }: BicycleProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0.12]} scale={0.55}>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.32, 0.025, 8, 20]} />
          <meshStandardMaterial color="#292524" />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.75, 0.045, 0.045]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.15, 0.65, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.35, 0.04, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.42, 0.6, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[0.28, 0.15, 0.02]} />
        <meshStandardMaterial color="#1C1917" />
      </mesh>
      <mesh position={[-0.05, 0.72, 0]} castShadow>
        <boxGeometry args={[0.05, 0.18, 0.16]} />
        <meshStandardMaterial color="#78350F" />
      </mesh>
    </group>
  )
}
