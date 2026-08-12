import { useMemo } from 'react'
import { GlbProp } from './GlbProp'

interface RiceFieldProps {
  position?: [number, number, number]
  rows?: number
  cols?: number
  spacing?: number
}

/** A golden-green paddy patch — rows of the existing wheat-crop prop over a
 * tinted ground plane, used to replace what would otherwise be empty grass. */
export function RiceField({ position = [0, 0, 0], rows = 6, cols = 8, spacing = 0.9 }: RiceFieldProps) {
  const crops = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({
          pos: [(c - (cols - 1) / 2) * spacing, 0, (r - (rows - 1) / 2) * spacing],
          rot: ((r * cols + c) % 4) * 0.5,
        })
      }
    }
    return items
  }, [rows, cols, spacing])

  const width = cols * spacing + 1.6
  const depth = rows * spacing + 1.6

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#D7E8A0" roughness={1} />
      </mesh>
      {crops.map((c, i) => (
        <GlbProp key={i} src="nature/crops_wheatStageB" position={c.pos} rotation={[0, c.rot, 0]} />
      ))}
    </group>
  )
}
