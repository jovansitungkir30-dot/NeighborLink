interface GroundProps {
  size?: number
  color?: string
}

/** A large soft ground plane the village sits on. */
export function Ground({ size = 140, color = '#BFE9A8' }: GroundProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  )
}
