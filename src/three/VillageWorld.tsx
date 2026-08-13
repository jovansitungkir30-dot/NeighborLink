import { memo, type RefObject } from 'react'
import { Experience } from './Experience'
import { GlbProp } from './world/GlbProp'
import { Scene1Village } from './scenes/Scene1Village'
import { NightLayer } from './world/NightLayer'
import { StreetLanterns, STREET_LANTERN_SPOTS } from './world/StreetLanterns'
import { GuardPost } from './world/GuardPost'
import { VillageHall } from './scenes/VillageHall'
import { CommunityFarm } from './scenes/CommunityFarm'
import { TreeOfHope } from './scenes/TreeOfHope'
import { River } from './world/River'
import { RiceField } from './world/RiceField'
import { Hills } from './world/Hills'
import { VillageGate } from './world/VillageGate'
import { Playground } from './world/Playground'
import { GardenBed } from './world/GardenBed'
import { Bench } from './world/Bench'
import { Bicycle } from './world/Bicycle'
import { Bird3D } from './world/Bird3D'
import { Critter3D } from './world/Critter3D'
import { Clouds } from './world/Clouds'
import { RoadNetwork } from './world/RoadNetwork'
import { VillagePerimeter } from './world/VillagePerimeter'
import { TreeCluster } from './world/TreeCluster'
import { InstancedForest } from './world/InstancedForest'
import { Villager } from './world/Villager'
import { BuildingHotspot } from './world/BuildingHotspot'
import { COTTAGES } from './world/villageLayout'
import { FreeRoamCamera, type FreeRoamCameraHandle } from './FreeRoamCamera'
import type { DaySample } from './dayCycle'
import { VILLAGE_OVERVIEW, VILLAGE_STORIES, storyCategory, type StoryCategory } from '../data/villageStories'

const RIVER_POINTS: [number, number, number][] = [
  [17.5, 0, 16],
  [16.5, 0, 11],
  [15.5, 0, 5],
  [16.2, 0, -1],
  [15.6, 0, -6],
  [16.8, 0, -11],
  [17.6, 0, -16],
]

// Short irrigation canals branching off the main river — one reaching back
// toward the village core, three reaching into the rice-field patches —
// so the river reads as the thing feeding the fields rather than a wall
// running past them.
const CANAL_PATHS: [number, number, number][][] = [
  [
    [16.2, 0, 2.5],
    [12.5, 0, 3.2],
  ],
  [
    [16.2, 0, -1],
    [18.2, 0, -1],
  ],
  [
    [16.6, 0, 7.5],
    [18.5, 0, 8.2],
  ],
  [
    [15.9, 0, -6.5],
    [17.8, 0, -7],
  ],
]

const RICE_FIELD_SPOTS: { pos: [number, number, number]; rows: number; cols: number }[] = [
  { pos: [21, 0, 0], rows: 6, cols: 8 },
  { pos: [21.5, 0, 8.5], rows: 5, cols: 6 },
  { pos: [21.5, 0, -7.5], rows: 5, cols: 7 },
  { pos: [-28.5, 0, -1], rows: 5, cols: 6 },
]

// A second river along the west side, outside the perimeter fence, mirroring
// the one on the east — the village now has water bookending both sides.
const RIVER_POINTS_WEST: [number, number, number][] = [
  [-25, 0, 16],
  [-24, 0, 10],
  [-23.5, 0, 4],
  [-24.2, 0, -2],
  [-23.6, 0, -8],
  [-24.8, 0, -16],
]

const CANAL_PATHS_WEST: [number, number, number][][] = [
  [
    [-23.8, 0, 2],
    [-20.6, 0, 2],
  ],
]

interface TreeSpot {
  pos: [number, number, number]
  radius: number
  count: number
  seed: number
}

/** Generates a ring of tree clusters at a given radius, skipping angle
 * ranges (in degrees, 0° = +x/east, 90° = +z) where the rivers, rice
 * fields, and the gate approach already occupy the ground — used to wrap
 * the forest belt densely around the *rest* of the village without
 * planting trees on top of water or blocking the main entrance view. */
function ringOfTrees(radius: number, num: number, skipRanges: [number, number][], seedBase: number): TreeSpot[] {
  const spots: TreeSpot[] = []
  for (let i = 0; i < num; i++) {
    const angle = (i / num) * Math.PI * 2
    const deg = ((angle * 180) / Math.PI + 360) % 360
    if (skipRanges.some(([a, b]) => deg >= a && deg <= b)) continue
    spots.push({
      pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
      radius: 2.2 + (i % 3) * 0.9,
      count: 7 + (i % 4) * 2,
      seed: seedBase + i,
    })
  }
  return spots
}

// East river/rice fields sit around 0°, the west river/farm around 180°,
// and the main gate approach sits at 90° — keep those corridors clear,
// densely forest everything else across two rings for real depth.
const FOREST_SKIP: [number, number][] = [
  [0, 18],
  [342, 360],
  [162, 198],
  [83, 97],
]
const FOREST_RING_1 = ringOfTrees(15.5, 26, FOREST_SKIP, 200)
const FOREST_RING_2 = ringOfTrees(19.5, 30, FOREST_SKIP, 300)
// Module-level so this stays one stable array reference across re-renders —
// VillageWorld re-renders every 250ms while the day-cycle auto-advances, and
// an inline spread here would otherwise rebuild the whole forest's instance
// matrices every tick even though the forest itself never actually changes.

// Tree belts filling the land outside the fence, between the village and
// the Hills backdrop, so the perimeter doesn't open onto bare ground.
const OUTER_TREE_CLUSTERS: TreeSpot[] = [
  { pos: [-28, 0, 8], radius: 4, count: 9, seed: 21 },
  { pos: [-27, 0, -11], radius: 3.5, count: 8, seed: 22 },
  { pos: [5, 0, 13], radius: 4, count: 8, seed: 23 },
  { pos: [-10, 0, 13], radius: 3.5, count: 7, seed: 24 },
  { pos: [10, 0, -13], radius: 3.5, count: 7, seed: 25 },
  { pos: [22, 0, 14], radius: 4, count: 8, seed: 26 },

  // Round 3 — filling in the rest of the ring so the tree belt wraps all
  // the way around instead of leaving quadrants bare.
  { pos: [14.5, 0, 8.5], radius: 4, count: 8, seed: 41 },
  { pos: [8, 0, 15.5], radius: 3.5, count: 7, seed: 42 },
  { pos: [-13, 0, 11.5], radius: 3.5, count: 7, seed: 43 },
  { pos: [-15.5, 0, -8.5], radius: 4, count: 8, seed: 44 },
  { pos: [-7, 0, -15], radius: 3.5, count: 7, seed: 45 },
  { pos: [6, 0, -16], radius: 3.5, count: 7, seed: 46 },
  { pos: [15, 0, -8], radius: 3.5, count: 7, seed: 47 },
]

// Small tree pockets tucked between the interior house clusters — the
// screenshot review showed the flat ground between clusters read as empty
// even with houses added, so these break it up without blocking the roads.
const INNER_TREE_CLUSTERS: { pos: [number, number, number]; radius: number; count: number; seed: number }[] = [
  { pos: [-4, 0, -1.5], radius: 1.7, count: 4, seed: 31 },
  { pos: [1.5, 0, 5], radius: 1.6, count: 4, seed: 32 },
  { pos: [-8.5, 0, -5], radius: 1.8, count: 4, seed: 33 },
  { pos: [5.5, 0, -2.8], radius: 1.4, count: 3, seed: 34 },
  { pos: [-14.5, 0, -1.5], radius: 1.8, count: 4, seed: 35 },
  { pos: [12, 0, 0.5], radius: 1.6, count: 3, seed: 36 },
  { pos: [-9, 0, 6.5], radius: 1.6, count: 3, seed: 37 },
  { pos: [9, 0, -7], radius: 1.5, count: 3, seed: 38 },
]

const FOREST_SPOTS: TreeSpot[] = [...OUTER_TREE_CLUSTERS, ...FOREST_RING_1, ...FOREST_RING_2, ...INNER_TREE_CLUSTERS]

const MORE_VILLAGER_SCATTER: {
  pos: [number, number, number]
  rot: number
  variant: 'a' | 'b' | 'c' | 'd' | 'e'
  animation: 'idle' | 'walk' | 'emote-yes' | 'interact-right'
  scale?: number
}[] = [
  { pos: [-6.3, 0, -6.5], rot: 0.7, variant: 'b', animation: 'idle', scale: 0.24 },
  { pos: [2.8, 0, -7.8], rot: -1.4, variant: 'd', animation: 'walk', scale: 0.22 },
  { pos: [-5.8, 0, 0.6], rot: 2, variant: 'a', animation: 'walk', scale: 0.19 },
  { pos: [-2.5, 0, 5.3], rot: -0.8, variant: 'c', animation: 'idle', scale: 0.24 },
  { pos: [5.8, 0, 1.1], rot: 1.3, variant: 'e', animation: 'emote-yes', scale: 0.22 },
  { pos: [3.4, 0, -0.4], rot: -2.1, variant: 'b', animation: 'walk', scale: 0.19 },
  { pos: [-1.3, 0, 6], rot: 0.5, variant: 'd', animation: 'idle', scale: 0.24 },
  { pos: [11.9, 0, -8.1], rot: -0.6, variant: 'a', animation: 'walk', scale: 0.22 },
  { pos: [-17.8, 0, -5.1], rot: 1.9, variant: 'c', animation: 'idle', scale: 0.19 },
  { pos: [-15.4, 0, -2.6], rot: -1.1, variant: 'e', animation: 'walk', scale: 0.24 },
  { pos: [13.4, 0, -2.1], rot: 2.4, variant: 'b', animation: 'idle', scale: 0.22 },
  { pos: [-11.4, 0, 5.4], rot: 0.4, variant: 'd', animation: 'emote-yes', scale: 0.19 },
  { pos: [7.9, 0, -6.4], rot: -1.8, variant: 'a', animation: 'walk', scale: 0.24 },
  { pos: [10.9, 0, -4.9], rot: 1.6, variant: 'c', animation: 'idle', scale: 0.22 },
]

const BENCH_SPOTS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [8.4, 0, -3.4], rot: 0.6 },
  { pos: [6.3, 0, -8.6], rot: -0.4 },
  { pos: [12, 0, 2.6], rot: 1.2 },
  { pos: [1.9, 0, 2.6], rot: -0.8 },
]

const BICYCLE_SPOTS: { pos: [number, number, number]; rot: number; color: string }[] = [
  { pos: [-9, 0, 1.3], rot: 0.5, color: '#DC2626' },
  { pos: [1.6, 0, -2.1], rot: -1, color: '#2563EB' },
  { pos: [12.9, 0, 5.6], rot: 2, color: '#16A34A' },
]

const GARDEN_SPOTS: { pos: [number, number, number]; rot: number }[] = [
  { pos: [-2.3, 0, 8.4], rot: 0.3 },
  { pos: [8, 0, -0.8], rot: -0.5 },
]

const BIRD_SPOTS: { center: [number, number, number]; radius: number; height: number; offset: number; color: string }[] = [
  { center: [0, 0, 0], radius: 12, height: 7, offset: 0, color: '#4B5563' },
  { center: [-8, 0, 0], radius: 8, height: 6, offset: 2, color: '#57534E' },
  { center: [8, 0, -3], radius: 9, height: 8, offset: 4, color: '#4B5563' },
  { center: [0, 0, -8], radius: 7, height: 6.5, offset: 6, color: '#78716C' },
  { center: [-16, 0, 1], radius: 6, height: 7, offset: 1, color: '#57534E' },
  { center: [11, 0, 4], radius: 6, height: 6.5, offset: 3, color: '#4B5563' },
]

// Villagers scattered across the Stage-2 districts (river/bridge, farm road,
// Village Hall neighborhood, gate road, rice-field hamlet) so those areas
// feel as lived-in as the original core.
const VILLAGER_SCATTER: {
  pos: [number, number, number]
  rot: number
  variant: 'a' | 'b' | 'c' | 'd' | 'e'
  animation: 'idle' | 'walk' | 'emote-yes' | 'interact-right'
  scale?: number
}[] = [
  { pos: [14.6, 0, 4.2], rot: -1.8, variant: 'a', animation: 'walk', scale: 0.24 },
  { pos: [13.4, 0, 6.5], rot: 2.1, variant: 'c', animation: 'idle', scale: 0.22 },
  { pos: [15.3, 0, -0.5], rot: 0.6, variant: 'e', animation: 'walk', scale: 0.23 },
  { pos: [-13.4, 0, 1], rot: -0.9, variant: 'd', animation: 'idle', scale: 0.24 },
  { pos: [-12, 0, -2.8], rot: 1.4, variant: 'b', animation: 'walk', scale: 0.22 },
  { pos: [-12.6, 0, 2.6], rot: 2.6, variant: 'a', animation: 'walk', scale: 0.19 },
  { pos: [7.3, 0, 1.4], rot: 0.3, variant: 'c', animation: 'idle', scale: 0.24 },
  { pos: [8.7, 0, 3.6], rot: -1.6, variant: 'e', animation: 'emote-yes', scale: 0.22 },
  { pos: [9.9, 0, -3.6], rot: 2.4, variant: 'b', animation: 'idle', scale: 0.19 },
  { pos: [-2.4, 0, -6.9], rot: -0.5, variant: 'd', animation: 'walk', scale: 0.24 },
  { pos: [1.2, 0, -7.2], rot: 1.9, variant: 'a', animation: 'interact-right', scale: 0.22 },
  { pos: [18.3, 0, -0.4], rot: -2.2, variant: 'c', animation: 'idle', scale: 0.24 },
  { pos: [17.6, 0, 2.9], rot: 0.9, variant: 'e', animation: 'walk', scale: 0.19 },
]

type VillagerSpot = {
  pos: [number, number, number]
  rot: number
  variant: 'a' | 'b' | 'c' | 'd' | 'e'
  animation: 'idle' | 'walk' | 'emote-yes' | 'interact-right'
  scale?: number
}

function rand2(seed: number, n: number) {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const VARIANTS = ['a', 'b', 'c', 'd', 'e'] as const
const ANIMATIONS = ['idle', 'walk', 'emote-yes', 'interact-right'] as const

/** A villager standing in the front yard of every other cottage — with 60+
 * houses now built up across every district, hand-placing individual
 * figures doesn't scale, so this seeds one deterministically near each
 * house instead, keeping every neighborhood populated. */
const COTTAGE_VILLAGERS: VillagerSpot[] = COTTAGES.filter((_, i) => i % 2 === 0).map((c, idx) => {
  const seed = 700 + idx
  const angle = rand2(seed, 1) * Math.PI * 2
  const dist = 1.3 + rand2(seed, 2) * 0.7
  return {
    pos: [c.pos[0] + Math.cos(angle) * dist, 0, c.pos[2] + Math.sin(angle) * dist],
    rot: rand2(seed, 3) * Math.PI * 2,
    variant: VARIANTS[Math.floor(rand2(seed, 4) * VARIANTS.length)],
    animation: ANIMATIONS[Math.floor(rand2(seed, 5) * ANIMATIONS.length)],
    scale: 0.19 + rand2(seed, 6) * 0.06,
  }
})

interface StaticVillageProps {
  cameraRef: RefObject<FreeRoamCameraHandle | null>
  /** free-roam drag/zoom + building hotspots — only on Explore Village */
  interactive: boolean
  onSelectStory: (id: string) => void
  /** when set, only hotspots in this category render — the rest stay
   * hidden rather than dimmed, so a filtered view doesn't feel cluttered */
  categoryFilter?: StoryCategory | null
}

/** Everything in the village that doesn't depend on the day-cycle sample —
 * split out and memoized so it never re-renders on the 250ms auto day-cycle
 * tick in VillageWorldContext. Only NightLayer (which reads `sample` for
 * window/lantern glow) needs to re-render that often; re-running this whole
 * multi-thousand-element tree 4x/second for no visual change was a real
 * chunk of the reported lag. */
const StaticVillage = memo(function StaticVillage({ cameraRef, interactive, onSelectStory, categoryFilter }: StaticVillageProps) {
  const visibleStories = categoryFilter
    ? VILLAGE_STORIES.filter((s) => storyCategory(s.id) === categoryFilter)
    : VILLAGE_STORIES
  return (
    <>
      <FreeRoamCamera ref={cameraRef} overview={VILLAGE_OVERVIEW} interactive={interactive} />

      <Scene1Village />
      <StreetLanterns />
      <GuardPost position={[0, 0, 10.5]} />

      <VillageHall position={[9.5, 0, -2]} />
      <CommunityFarm position={[-17, 0, 2]} />
      <TreeOfHope position={[7, 0, -4.5]} />

      <River points={RIVER_POINTS} />
      {CANAL_PATHS.map((points, i) => (
        <River key={i} points={points} width={0.6} />
      ))}
      <GlbProp src="nature/bridge_wood" position={[15.9, 0, 1]} rotation={[0, Math.PI / 2, 0]} scale={1.1} />

      <River points={RIVER_POINTS_WEST} />
      {CANAL_PATHS_WEST.map((points, i) => (
        <River key={`west-${i}`} points={points} width={0.6} />
      ))}
      <GlbProp src="nature/bridge_wood" position={[-23.9, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={1.1} />

      {RICE_FIELD_SPOTS.map((r, i) => (
        <RiceField key={i} position={r.pos} rows={r.rows} cols={r.cols} />
      ))}
      <RiceField position={[16.5, 0, -3.5]} rows={3} cols={4} />
      <InstancedForest spots={FOREST_SPOTS} />
      <Hills />
      <Clouds />
      <VillagePerimeter />
      <VillageGate position={[0, 0, 13]} />
      <TreeCluster position={[-3.5, 0, 15.5]} radius={1.8} count={5} seed={51} />
      <TreeCluster position={[3.5, 0, 15.5]} radius={1.8} count={5} seed={52} />
      <Playground position={[5.2, 0, -9.4]} rotationY={0.4} />
      <RoadNetwork />

      {VILLAGER_SCATTER.map((v, i) => (
        <Villager key={i} variant={v.variant} position={v.pos} rotationY={v.rot} animation={v.animation} scale={v.scale} />
      ))}
      {MORE_VILLAGER_SCATTER.map((v, i) => (
        <Villager key={`more-${i}`} variant={v.variant} position={v.pos} rotationY={v.rot} animation={v.animation} scale={v.scale} />
      ))}
      {COTTAGE_VILLAGERS.map((v, i) => (
        <Villager key={`cottage-${i}`} variant={v.variant} position={v.pos} rotationY={v.rot} animation={v.animation} scale={v.scale} />
      ))}

      {GARDEN_SPOTS.map((g, i) => (
        <GardenBed key={i} position={g.pos} rotationY={g.rot} />
      ))}
      {BENCH_SPOTS.map((b, i) => (
        <Bench key={i} position={b.pos} rotationY={b.rot} />
      ))}
      {BICYCLE_SPOTS.map((b, i) => (
        <Bicycle key={i} position={b.pos} rotationY={b.rot} color={b.color} />
      ))}

      {BIRD_SPOTS.map((b, i) => (
        <Bird3D key={i} center={b.center} radius={b.radius} height={b.height} offset={b.offset} color={b.color} speed={0.28} />
      ))}

      <Critter3D kind="cat" position={[-9.7, 0, 2.8]} rotationY={0.6} />
      <Critter3D kind="cat" position={[0.9, 0, -1.8]} rotationY={-1.2} />
      <Critter3D kind="cat" position={[-4.3, 0, 7.9]} rotationY={2.1} />
      <Critter3D kind="dog" position={[9.5, 0, -2]} wander={{ radius: 1.9, speed: 0.5 }} />
      <Critter3D kind="dog" position={[-17, 0, 2]} wander={{ radius: 2.2, speed: 0.45 }} />

      {interactive &&
        visibleStories.map((story) => (
          <BuildingHotspot
            key={story.id}
            position={story.position}
            icon={story.icon}
            label={story.tooltip}
            onSelect={() => {
              cameraRef.current?.flyTo(story.cameraStop).then(() => onSelectStory(story.id))
            }}
          />
        ))}
    </>
  )
})

interface VillageWorldProps {
  sample: DaySample
  cameraRef: RefObject<FreeRoamCameraHandle | null>
  /** free-roam drag/zoom + building hotspots — only on Explore Village */
  interactive: boolean
  onSelectStory: (id: string) => void
  /** when set, only hotspots in this category render — the rest stay
   * hidden rather than dimmed, so a filtered view doesn't feel cluttered */
  categoryFilter?: StoryCategory | null
}

/** The one persistent 3D village — every layer built across both stages,
 * always mounted once any village route is active so switching between
 * Home/About/Explore/Contact never remounts the Canvas. */
export function VillageWorld({ sample, cameraRef, interactive, onSelectStory, categoryFilter }: VillageWorldProps) {
  return (
    <div className="fixed inset-0">
      <Experience sample={sample}>
        <StaticVillage cameraRef={cameraRef} interactive={interactive} onSelectStory={onSelectStory} categoryFilter={categoryFilter} />
        <NightLayer sample={sample} extraLanternSpots={STREET_LANTERN_SPOTS} />
      </Experience>
    </div>
  )
}
