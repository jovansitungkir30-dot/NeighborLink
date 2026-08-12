import { Cottage } from '../world/Cottage'
import { GlbProp } from '../world/GlbProp'
import { Villager } from '../world/Villager'

interface VillageHallProps {
  position?: [number, number, number]
  rotationY?: number
}

/** The village's civic building — a taller two-story hall built from the
 * same Kenney wall/roof kit as every cottage, dressed up with pillars,
 * stairs and banners so it reads as grander than an ordinary home. */
export function VillageHall({ position = [0, 0, 0], rotationY = 0 }: VillageHallProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Cottage stories={2} roof="highGable" doorFacing={2} chimney={false} />

      <GlbProp src="town/pillar-wood" position={[-0.55, 0, 0.55]} />
      <GlbProp src="town/pillar-wood" position={[0.55, 0, 0.55]} />
      <GlbProp src="town/stairs-wood" position={[0, 0, 0.75]} rotation={[0, Math.PI, 0]} />
      <GlbProp src="town/banner-red" position={[-0.9, 0, 0.15]} rotation={[0, 0.4, 0]} scale={1.05} />
      <GlbProp src="town/banner-green" position={[0.9, 0, 0.15]} rotation={[0, -0.4, 0]} scale={1.05} />
      <GlbProp src="town/lantern" position={[-0.75, 0, 0.85]} />
      <GlbProp src="town/lantern" position={[0.75, 0, 0.85]} />

      <Villager variant="a" position={[0.5, 0, 1.1]} rotationY={-2.6} animation="idle" scale={0.24} />
      <Villager variant="c" position={[-0.7, 0, 1.3]} rotationY={1.9} animation="emote-yes" scale={0.22} />
    </group>
  )
}
