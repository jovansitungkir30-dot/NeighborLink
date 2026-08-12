interface OpenBookProps {
  position?: [number, number, number]
  rotationY?: number
  scale?: number
  color?: string
}

/** A small open book, built from primitives — a page in the "12 books
 * donated" story rather than a literal glTF asset. */
export function OpenBook({ position = [0, 0, 0], rotationY = 0, scale = 1, color = '#F97316' }: OpenBookProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <mesh position={[-0.11, 0.02, 0]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.22, 0.02, 0.16]} />
        <meshStandardMaterial color="#F8FAFC" />
      </mesh>
      <mesh position={[0.11, 0.02, 0]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.22, 0.02, 0.16]} />
        <meshStandardMaterial color="#F8FAFC" />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.17]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
