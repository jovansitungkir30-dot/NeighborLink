import { GlbProp } from './GlbProp'

const SIDE_ROTATIONS: [number, number, number][] = [
  [0, 0, 0],
  [0, Math.PI / 2, 0],
  [0, Math.PI, 0],
  [0, -Math.PI / 2, 0],
]

export interface CottageProps {
  position?: [number, number, number]
  rotationY?: number
  scale?: number
  stories?: 1 | 2
  roof?: 'gable' | 'highGable'
  doorFacing?: 0 | 1 | 2 | 3
  chimney?: boolean
}

/** A small village cottage assembled from Kenney Fantasy Town Kit wall/roof
 * pieces on a 1-unit grid: each wall piece sits at the tile's +X edge and is
 * rotated 0/90/180/270 to sweep around the four sides. */
export function Cottage({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  stories = 1,
  roof = 'gable',
  doorFacing = 0,
  chimney = true,
}: CottageProps) {
  const roofFile = roof === 'highGable' ? 'town/roof-high-gable' : 'town/roof-gable'
  const roofY = stories

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {Array.from({ length: stories }).map((_, row) =>
        SIDE_ROTATIONS.map((rot, side) => (
          <GlbProp
            key={`${row}-${side}`}
            src={row === 0 && side === doorFacing ? 'town/wall-wood-door' : 'town/wall-wood-window-shutters'}
            position={[0, row, 0]}
            rotation={rot}
            castShadow
          />
        ))
      )}
      <GlbProp src={roofFile} position={[0, roofY, 0]} castShadow />
      {chimney && <GlbProp src="town/chimney" position={[0, roofY, 0]} castShadow />}
    </group>
  )
}
