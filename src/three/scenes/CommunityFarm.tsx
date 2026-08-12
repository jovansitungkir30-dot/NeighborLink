import { useMemo } from 'react'
import { GlbProp } from '../world/GlbProp'
import { Villager } from '../world/Villager'
import { Butterfly3D } from '../world/Butterfly3D'

interface CommunityFarmProps {
  position?: [number, number, number]
}

const ROWS = 5
const COLS = 6
const SPACING = 0.85

/** A small community farm plot — rows of wheat with a carrot/pumpkin corner,
 * fenced, with a scarecrow standing watch. Built entirely from existing
 * Kenney nature-kit crop props, no new geometry needed for the plants. */
export function CommunityFarm({ position = [0, 0, 0] }: CommunityFarmProps) {
  const wheatRows = useMemo(() => {
    const items: { pos: [number, number, number]; rot: number }[] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        items.push({
          pos: [(c - (COLS - 1) / 2) * SPACING, 0, (r - (ROWS - 1) / 2) * SPACING - 1.4],
          rot: ((r * COLS + c) % 4) * 0.4,
        })
      }
    }
    return items
  }, [])

  return (
    <group position={position}>
      {wheatRows.map((w, i) => (
        <GlbProp key={i} src="nature/crops_wheatStageB" position={w.pos} rotation={[0, w.rot, 0]} scale={1} />
      ))}

      <GlbProp src="nature/crop_carrot" position={[-2.6, 0, 1.8]} rotation={[0, 0.3, 0]} />
      <GlbProp src="nature/crop_carrot" position={[-2.1, 0, 2.1]} rotation={[0, 1.1, 0]} />
      <GlbProp src="nature/crop_pumpkin" position={[2.4, 0, 1.9]} rotation={[0, 0.5, 0]} scale={1.1} />
      <GlbProp src="nature/crop_pumpkin" position={[2.9, 0, 1.5]} rotation={[0, -0.4, 0]} scale={0.9} />

      <GlbProp src="nature/fence_simple" position={[-3, 0, -2.6]} rotation={[0, 0, 0]} />
      <GlbProp src="nature/fence_simple" position={[-1.8, 0, -2.6]} rotation={[0, 0, 0]} />
      <GlbProp src="nature/fence_gate" position={[-0.6, 0, -2.6]} rotation={[0, 0, 0]} />
      <GlbProp src="nature/fence_simple" position={[0.6, 0, -2.6]} rotation={[0, 0, 0]} />
      <GlbProp src="nature/fence_simple" position={[1.8, 0, -2.6]} rotation={[0, 0, 0]} />
      <GlbProp src="nature/fence_simple" position={[3, 0, -2.6]} rotation={[0, 0, 0]} />

      {/* a simple primitive scarecrow, since no matching Kenney model exists */}
      <group position={[0, 0, 0.2]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 6]} />
          <meshStandardMaterial color="#8B6A45" />
        </mesh>
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 6]} />
          <meshStandardMaterial color="#8B6A45" />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial color="#E8C88A" />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.32, 0.34, 0.14]} />
          <meshStandardMaterial color="#C2410C" />
        </mesh>
      </group>

      <Villager variant="d" position={[1.6, 0, -1.6]} rotationY={-1.1} animation="pick-up" scale={0.24} />
      <Butterfly3D center={[-0.5, 0, 1.6]} radius={1.4} height={0.7} speed={0.4} color="#FDE68A" offset={3} />
    </group>
  )
}
