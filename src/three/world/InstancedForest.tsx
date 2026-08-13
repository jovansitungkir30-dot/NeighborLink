import { useMemo } from 'react'
import { buildClusterItems, type ClusterSpot } from './TreeCluster'
import { InstancedProps, type PropPlacement } from './InstancedProps'

interface InstancedForestProps {
  spots: ClusterSpot[]
}

/** Renders hundreds of background trees/bushes/flowers (the outer forest
 * belt) as a handful of InstancedMesh draw calls instead of one GLB clone
 * per plant. Trades per-tree sway animation for draw-call count — at forest
 * scale/distance the sway was never visible anyway. Close-up clusters
 * (village core, gate) still use <TreeCluster> for the sway. */
export function InstancedForest({ spots }: InstancedForestProps) {
  const items = useMemo<PropPlacement[]>(
    () => spots.flatMap((spot) => buildClusterItems(spot).map((it) => ({ kind: it.kind, position: it.position, rotationY: it.rotationY, scale: it.scale }))),
    [spots]
  )

  return <InstancedProps items={items} />
}
