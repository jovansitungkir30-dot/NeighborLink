interface WaterPondProps {
  position?: [number, number, number]
  radius?: number
}

/** A small still pond — smooth and slightly reflective so the sky and trees
 * pick up in its surface without needing a full planar-reflection rig. */
export function WaterPond({ position = [0, 0.02, 0], radius = 2 }: WaterPondProps) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[radius, 32]} />
      <meshStandardMaterial color="#7DD3E8" metalness={0.55} roughness={0.12} />
    </mesh>
  )
}
