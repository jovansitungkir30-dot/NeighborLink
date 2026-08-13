import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import type { Group } from 'three'
import { Ground } from '../world/Ground'
import { TreeCluster } from '../world/TreeCluster'
import { GlbProp } from '../world/GlbProp'
import { InstancedProps } from '../world/InstancedProps'
import { Villager } from '../world/Villager'
import { ChimneySmoke3D } from '../world/ChimneySmoke3D'
import { Butterfly3D } from '../world/Butterfly3D'
import { MedicalCross } from '../world/MedicalCross'
import { PaperAirplane } from '../world/PaperAirplane'
import { OpenBook } from '../world/OpenBook'
import { RunningDog } from '../world/RunningDog'
import { WaterPond } from '../world/WaterPond'
import { GrowingSapling } from '../world/GrowingSapling'
import { COTTAGES, buildCottageInstances } from '../world/villageLayout'

const COTTAGE_INSTANCES = buildCottageInstances(COTTAGES)

const YARD_DETAILS: { src: string; pos: [number, number, number]; rot: number; scale?: number }[] = [
  { src: 'town/hedge', pos: [-6.2, 0, -0.7], rot: 0.3 },
  { src: 'town/hedge', pos: [-5.2, 0, -0.9], rot: 0.3 },
  { src: 'nature/fence_simple', pos: [-3.4, 0, 1.2], rot: -0.6 },
  { src: 'nature/fence_simple', pos: [-3.0, 0, 1.9], rot: -0.6 },
  { src: 'nature/fence_gate', pos: [3.1, 0, 2.7], rot: 0.8 },
  { src: 'nature/fence_simple', pos: [4.9, 0, 2.5], rot: 0.8 },
  { src: 'town/hedge-curved', pos: [9.8, 0, 0.4], rot: -1.1 },
  { src: 'nature/fence_simple', pos: [-9.9, 0, -6.2], rot: 2.1 },
  { src: 'town/lantern', pos: [1.4, 0, 3.6], rot: 0 },
  { src: 'town/lantern', pos: [-1.2, 0, 2.4], rot: 0 },
]

const ROAD_TILES: [number, number, number][] = Array.from({ length: 18 }, (_, i) => [-8 + i, 0.01, -8.5 + i * 0.02])

function RollingCart() {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 0.6) % 18
    ref.current.position.set(-9 + t, 0, -8.3 + t * 0.02)
    ref.current.rotation.y = Math.PI / 2
  })
  return (
    <group ref={ref}>
      <GlbProp src="town/cart" scale={0.9} />
    </group>
  )
}

export function Scene1Village() {
  const smokeChimneys = useMemo(
    () => COTTAGES.map((c) => [c.pos[0], c.stories + 1.3, c.pos[2]] as [number, number, number]),
    []
  )

  return (
    <group>
      <Ground />

      <InstancedProps items={COTTAGE_INSTANCES} castShadow />

      {smokeChimneys.map((pos, i) => (
        <ChimneySmoke3D key={i} position={pos} />
      ))}

      <TreeCluster position={[-14, 0, 6]} radius={3.5} count={9} seed={1} />
      <TreeCluster position={[14, 0, 8]} radius={4} count={9} seed={2} />
      <TreeCluster position={[-2, 0, -10]} radius={4.5} count={11} seed={3} />
      <TreeCluster position={[15, 0, -3]} radius={3} count={7} seed={4} />
      <TreeCluster position={[-13, 0, -8]} radius={3} count={6} seed={5} />
      <TreeCluster position={[8, 0, 9]} radius={3} count={6} seed={6} />
      <TreeCluster position={[-8.5, 0, 5.5]} radius={2.4} count={5} seed={7} />
      <TreeCluster position={[6.5, 0, -1]} radius={2} count={4} seed={8} />

      <GlbProp src="town/windmill" position={[-15, 0, -6.5]} rotation={[0, 0.6, 0]} scale={1.6} castShadow />
      <GlbProp src="town/fountain-round-detail" position={[0.5, 0, 1.5]} scale={1.1} castShadow />
      <GlbProp src="town/fountain-round" position={[0.5, 0.05, 1.5]} scale={1.1} />

      {/* small market row near the fountain */}
      <GlbProp src="town/stall-green" position={[-1.6, 0, -0.6]} rotation={[0, 0.5, 0]} scale={1.1} />
      <GlbProp src="town/stall-red" position={[2.6, 0, -0.9]} rotation={[0, -0.5, 0]} scale={1.1} />
      <GlbProp src="town/stall" position={[-2.6, 0, 0.4]} rotation={[0, 0.9, 0]} scale={1.1} />
      <GlbProp src="town/stall-bench" position={[3.6, 0, -1.9]} rotation={[0, -0.9, 0]} scale={1.1} />

      {YARD_DETAILS.map((d, i) => (
        <GlbProp key={i} src={d.src} position={d.pos} rotation={[0, d.rot, 0]} scale={d.scale ?? 1} />
      ))}

      {ROAD_TILES.map((pos, i) => (
        <GlbProp key={i} src="nature/ground_pathStraight" position={pos} rotation={[0, 0.02, 0]} scale={1.2} />
      ))}

      <Villager variant="a" position={[-4.6, 0, 3.4]} rotationY={0.4} animation="idle" scale={0.24} />
      <Villager variant="c" position={[2, 0, 5.2]} rotationY={-1.2} animation="walk" scale={0.24} />
      <Villager variant="e" position={[6.4, 0, 0.4]} rotationY={1.8} animation="idle" scale={0.24} />
      <Villager variant="b" position={[-1.4, 0, -0.2]} rotationY={-0.6} animation="idle" scale={0.24} />
      <Villager variant="d" position={[-8.3, 0, 1.6]} rotationY={2.4} animation="walk" scale={0.24} />
      <Villager variant="a" position={[9.6, 0, -5.2]} rotationY={0.9} animation="idle" scale={0.22} />

      <RollingCart />

      {/* Pak Budi's garden, out front of his cottage */}
      <GlbProp src="town/stall-bench" position={[-9.6, 0, 3.7]} rotation={[0, 2, 0]} scale={0.9} />
      <GlbProp src="nature/flower_purpleA" position={[-10.3, 0, 3.3]} rotation={[0, 0.2, 0]} scale={1.1} />
      <GlbProp src="nature/flower_redA" position={[-9.9, 0, 4.3]} rotation={[0, 0.6, 0]} scale={1.1} />
      <GlbProp src="nature/flower_yellowA" position={[-10.6, 0, 4.0]} rotation={[0, 1.1, 0]} scale={1} />
      <GlbProp src="nature/plant_bushSmall" position={[-8.9, 0, 3.9]} rotation={[0, 0, 0]} scale={1} />
      <GlbProp src="nature/plant_bushDetailed" position={[-10.6, 0, 2.6]} rotation={[0, 0, 0]} scale={0.9} />
      <Butterfly3D center={[-9.8, 0, 3.5]} radius={1.1} height={0.7} speed={0.5} color="#F97316" offset={1} />
      <Butterfly3D center={[-9.8, 0, 3.5]} radius={0.8} height={1} speed={0.65} color="#FDE68A" offset={4} />
      <Villager variant="b" position={[-9.9, 0, 3.1]} rotationY={-0.8} animation="emote-yes" scale={0.24} />

      {/* Bu Sari's Health Center, in front of the 2-story house at (-1.8, -3.4) */}
      <MedicalCross position={[-0.55, 1.1, -3.15]} />
      <GlbProp src="town/banner-green" position={[-2.6, 0, -3.6]} rotation={[0, 0.9, 0]} scale={0.9} />
      <GlbProp src="town/lantern" position={[-0.9, 0, -2.4]} rotation={[0, 0, 0]} scale={1} />
      <Villager variant="c" position={[-0.9, 0, -2.5]} rotationY={2.6} animation="idle" scale={0.24} />
      <Villager variant="e" position={[-0.1, 0, -2.9]} rotationY={-1.3} animation="idle" scale={0.22} />
      <Villager variant="d" position={[0.5, 0, -2.5]} rotationY={2.1} animation="walk" scale={0.24} />
      <Sparkles count={26} scale={[6, 4, 6]} size={2} speed={0.2} opacity={0.5} color="#CFFAFE" position={[-0.6, 2, -3.2]} />

      {/* Pak Andi's School, out front of the 2-story house at (12.2, 5.2) */}
      <GlbProp src="town/banner-red" position={[13.9, 0, 3.9]} rotation={[0, -0.6, 0]} scale={0.95} />
      <GlbProp src="town/stall-bench" position={[13.2, 0, 4.6]} rotation={[0, -0.9, 0]} scale={0.85} />
      <OpenBook position={[13.4, 0.42, 4.55]} rotationY={0.4} scale={1.6} color="#3B67F5" />
      <OpenBook position={[13.55, 0.42, 4.7]} rotationY={-0.3} scale={1.4} color="#22C55E" />
      <OpenBook position={[13.15, 0, 3.6]} rotationY={0.9} scale={1.3} color="#FBBF24" />
      <PaperAirplane center={[13.5, 0, 4.2]} radius={1.9} height={1.6} speed={0.35} />
      <Villager variant="e" position={[14.4, 0, 3.5]} rotationY={-2.2} animation="emote-yes" scale={0.19} />
      <Villager variant="c" position={[14.9, 0, 4.7]} rotationY={-1.9} animation="emote-yes" scale={0.18} />
      <Villager variant="a" position={[12.5, 0, 3.2]} rotationY={2.7} animation="idle" scale={0.24} />

      {/* Community Park, south of the market */}
      <WaterPond position={[7.5, 0.02, -7.2]} radius={1.9} />
      <RunningDog center={[7.5, 0, -7.2]} radius={3.1} speed={0.55} />
      <GrowingSapling position={[4.9, 0, -8.6]} baseScale={0.55} />
      <GrowingSapling position={[9.6, 0, -8.9]} baseScale={0.45} />
      <GlbProp src="nature/log_stack" position={[5.2, 0, -6.1]} rotation={[0, 0.5, 0]} scale={1} />
      <GlbProp src="nature/stump_round" position={[9.4, 0, -6.3]} rotation={[0, 0, 0]} scale={1.1} />
      <Butterfly3D center={[7.5, 0, -7.2]} radius={2.4} height={1.1} speed={0.4} color="#F472B6" offset={2} />
      <Butterfly3D center={[7.5, 0, -7.2]} radius={1.6} height={1.4} speed={0.55} color="#FDE68A" offset={6} />
      <Villager variant="b" position={[6, 0, -6.2]} rotationY={0.8} animation="idle" scale={0.24} />
      <Villager variant="d" position={[6.5, 0, -6.4]} rotationY={0.6} animation="idle" scale={0.19} />
      <Villager variant="a" position={[9, 0, -6.6]} rotationY={-0.9} animation="walk" scale={0.19} />
      <Villager variant="e" position={[4.6, 0, -9.1]} rotationY={2.1} animation="interact-right" scale={0.24} />
      <Villager variant="c" position={[9.9, 0, -9.4]} rotationY={-1.6} animation="pick-up" scale={0.24} />
      <Sparkles count={30} scale={[9, 4, 9]} size={2} speed={0.2} opacity={0.4} color="#86EFAC" position={[7.5, 1.5, -7.2]} />

      <Sparkles count={40} scale={[26, 6, 26]} size={2.4} speed={0.25} opacity={0.35} color="#FDE68A" position={[0, 3, 0]} />
    </group>
  )
}
