import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { GlbProp } from './GlbProp'

export const TREE_KINDS = ['nature/tree_oak', 'nature/tree_detailed', 'nature/tree_fat', 'nature/tree_default']
export const UNDERGROWTH = ['nature/plant_bushSmall', 'nature/plant_bushDetailed', 'nature/flower_purpleA', 'nature/flower_yellowA', 'nature/flower_redA']

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface ClusterSpot {
  pos: [number, number, number]
  radius: number
  count: number
  seed: number
}

export interface ClusterItem {
  key: string
  kind: string
  isTree: boolean
  position: [number, number, number]
  rotationY: number
  scale: number
  phase: number
}

/** The deterministic scatter math shared by <TreeCluster> and the global
 * forest instancer — kept here so both produce byte-identical placements
 * from the same (position, radius, count, seed) spot. */
export function buildClusterItems(spot: ClusterSpot): ClusterItem[] {
  const { pos, radius, count, seed } = spot
  const rand = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => {
    const angle = rand() * Math.PI * 2
    const dist = Math.sqrt(rand()) * radius
    const isTree = i < Math.ceil(count * 0.5)
    const kind = isTree ? TREE_KINDS[Math.floor(rand() * TREE_KINDS.length)] : UNDERGROWTH[Math.floor(rand() * UNDERGROWTH.length)]
    return {
      key: `${seed}-${i}`,
      kind,
      isTree,
      position: [pos[0] + Math.cos(angle) * dist, pos[1], pos[2] + Math.sin(angle) * dist],
      rotationY: rand() * Math.PI * 2,
      scale: (isTree ? 0.55 : 0.45) + rand() * 0.3,
      phase: rand() * Math.PI * 2,
    }
  })
}

interface SwayingTreeProps {
  kind: string
  position: [number, number, number]
  rotation: number
  scale: number
  phase: number
}

function SwayingTree({ kind, position, rotation, scale, phase }: SwayingTreeProps) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + phase) * 0.025
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55 + phase * 1.3) * 0.02
  })
  return (
    <group ref={ref} position={position}>
      <GlbProp src={kind} rotation={[0, rotation, 0]} scale={scale} />
    </group>
  )
}

interface TreeClusterProps {
  position?: [number, number, number]
  radius?: number
  count?: number
  seed?: number
}

/** A deterministic scatter of trees, bushes and flowers around a center point.
 * Used directly only where the cluster is small/close enough that individual
 * sway animation is worth it — the large background forest belt uses
 * <InstancedForest> instead (see VillageWorld.tsx). */
export function TreeCluster({ position = [0, 0, 0], radius = 3, count = 6, seed = 1 }: TreeClusterProps) {
  const items = useMemo(() => buildClusterItems({ pos: position, radius, count, seed }), [position, radius, count, seed])

  return (
    <>
      {items.map((it) =>
        it.isTree ? (
          <SwayingTree key={it.key} kind={it.kind} position={it.position} rotation={it.rotationY} scale={it.scale} phase={it.phase} />
        ) : (
          <GlbProp key={it.key} src={it.kind} position={it.position} rotation={[0, it.rotationY, 0]} scale={it.scale} />
        )
      )}
    </>
  )
}
