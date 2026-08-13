import { useMemo } from 'react'
import { InstancedProps, type PropPlacement } from './InstancedProps'

interface RiceFieldProps {
  position?: [number, number, number]
  rows?: number
  cols?: number
  spacing?: number
}

/** A golden-green paddy patch — rows of the existing wheat-crop prop over a
 * tinted ground plane, used to replace what would otherwise be empty grass. */
export function RiceField({ position = [0, 0, 0], rows = 6, cols = 8, spacing = 0.9 }: RiceFieldProps) {
  const crops = useMemo<PropPlacement[]>(() => {
    const items: PropPlacement[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({
          kind: 'nature/crops_wheatStageB',
          position: [position[0] + (c - (cols - 1) / 2) * spacing, position[1], position[2] + (r - (rows - 1) / 2) * spacing],
          rotationY: ((r * cols + c) % 4) * 0.5,
          scale: 1,
        })
      }
    }
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols, spacing, position[0], position[1], position[2]])

  const width = cols * spacing + 1.6
  const depth = rows * spacing + 1.6

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], position[1] + 0.01, position[2]]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#D7E8A0" roughness={1} />
      </mesh>
      <InstancedProps items={crops} />
    </>
  )
}
