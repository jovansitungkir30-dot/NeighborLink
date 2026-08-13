export interface CottageLayout {
  pos: [number, number, number]
  rot: number
  stories: 1 | 2
  door: 0 | 1 | 2 | 3
}

export interface CottagePartPlacement {
  kind: string
  position: [number, number, number]
  rotationY: number
  scale: number
}

const SIDE_ROTATIONS_Y = [0, Math.PI / 2, Math.PI, -Math.PI / 2]

/** Flattens every cottage into its wall/roof/chimney parts (matching
 * <Cottage>'s own assembly logic, which every entry here uses at its
 * defaults: roof="gable", chimney=true) so the whole village core can be
 * drawn as a handful of InstancedMesh draw calls instead of one GLB clone
 * per wall/roof/chimney per building. Because both the per-building rotation
 * and each wall's local sweep rotation are pure Y-axis rotations, and the
 * local offset is a pure Y translation, world transform = simple addition —
 * no matrix composition needed. */
export function buildCottageInstances(cottages: CottageLayout[]): CottagePartPlacement[] {
  const items: CottagePartPlacement[] = []
  for (const c of cottages) {
    for (let row = 0; row < c.stories; row++) {
      for (let side = 0; side < 4; side++) {
        const kind = row === 0 && side === c.door ? 'town/wall-wood-door' : 'town/wall-wood-window-shutters'
        items.push({
          kind,
          position: [c.pos[0], c.pos[1] + row, c.pos[2]],
          rotationY: c.rot + SIDE_ROTATIONS_Y[side],
          scale: 1,
        })
      }
    }
    items.push({ kind: 'town/roof-gable', position: [c.pos[0], c.pos[1] + c.stories, c.pos[2]], rotationY: c.rot, scale: 1 })
    items.push({ kind: 'town/chimney', position: [c.pos[0], c.pos[1] + c.stories, c.pos[2]], rotationY: c.rot, scale: 1 })
  }
  return items
}

/** Shared village layout data — used by Scene1Village (to place cottage geometry)
 * and NightLayer (to place matching window-glow lights) so the two never drift apart. */
export const COTTAGES: CottageLayout[] = [
  { pos: [-7, 0, -2], rot: 0.3, stories: 1, door: 2 },
  { pos: [-4.2, 0, 2.6], rot: -0.6, stories: 1, door: 0 },
  { pos: [5.5, 0, -3.5], rot: 2.4, stories: 2, door: 1 },
  { pos: [8.5, 0, 1.2], rot: -1.1, stories: 1, door: 2 },
  { pos: [1.5, 0, 6.5], rot: 1.4, stories: 1, door: 3 },
  { pos: [-9.5, 0, 2], rot: 1.9, stories: 1, door: 0 },
  { pos: [-1.8, 0, -3.4], rot: -1.7, stories: 2, door: 3 },
  { pos: [4, 0, 3.3], rot: 0.8, stories: 1, door: 2 },
  { pos: [10.8, 0, -5.6], rot: -0.4, stories: 1, door: 1 },
  { pos: [-6.2, 0, -6.8], rot: 2.1, stories: 1, door: 0 },
  { pos: [10.5, 0, 7], rot: -2.6, stories: 2, door: 2 },
  { pos: [-11, 0, -3.6], rot: 0.9, stories: 1, door: 3 },
  { pos: [7.6, 0, 6.4], rot: -1.5, stories: 1, door: 0 },
  { pos: [-3.8, 0, 7.2], rot: 2.8, stories: 1, door: 1 },

  // Stage-2 infill — the new eastern (river/bridge), western (windmill/farm),
  // civic (Village Hall) and southern (gate road) districts were sparse
  // compared to the original core; these fill the gaps between them.
  { pos: [11.5, 0, -1], rot: 1.2, stories: 1, door: 1 },
  { pos: [9, 0, 9], rot: -0.8, stories: 1, door: 3 },
  { pos: [-9, 0, 6.5], rot: 2, stories: 1, door: 0 },
  { pos: [-12.3, 0, -3.2], rot: -1.3, stories: 2, door: 2 },
  { pos: [6.8, 0, 1.8], rot: 0.5, stories: 1, door: 3 },
  { pos: [8.2, 0, 4.2], rot: -2.1, stories: 1, door: 1 },
  { pos: [-3, 0, -6.4], rot: 1, stories: 1, door: 2 },
  { pos: [0.8, 0, -6.9], rot: -0.6, stories: 1, door: 0 },
  { pos: [11.8, 0, -2], rot: 1.7, stories: 1, door: 1 },
  { pos: [11.8, 0, 4], rot: -0.3, stories: 2, door: 3 },

  // Densify round 2 — real screenshot feedback showed big flat gaps in the
  // south-central strip and between the west/center/east clusters; this
  // batch fills those specific pockets rather than the outer districts.
  { pos: [-6, 0, -7], rot: 0.4, stories: 1, door: 1 },
  { pos: [2.5, 0, -7.3], rot: -1.1, stories: 1, door: 3 },
  { pos: [-1.5, 0, -8.2], rot: 2.3, stories: 2, door: 0 },
  { pos: [-5.5, 0, 0], rot: 1.7, stories: 1, door: 2 },
  { pos: [-2.8, 0, 4.8], rot: -0.5, stories: 1, door: 0 },
  { pos: [-6.5, 0, 4], rot: 2.9, stories: 2, door: 1 },
  { pos: [5.5, 0, 0.5], rot: 0.8, stories: 1, door: 3 },
  { pos: [3, 0, -0.8], rot: -1.9, stories: 1, door: 0 },
  { pos: [-1, 0, 5.5], rot: 1.2, stories: 1, door: 2 },
  { pos: [3.5, 0, 7.5], rot: -0.6, stories: 2, door: 3 },
  { pos: [9, 0, -8.5], rot: 0.3, stories: 1, door: 1 },
  { pos: [-10.5, 0, -6.5], rot: -0.8, stories: 1, door: 2 },
  { pos: [-11.5, 0, -1], rot: 1.5, stories: 1, door: 0 },
  { pos: [4.5, 0, 6], rot: 2, stories: 1, door: 3 },
  { pos: [-11, 0, 5], rot: -1.3, stories: 2, door: 1 },
  { pos: [7.5, 0, -6.8], rot: 0.6, stories: 1, door: 2 },
  { pos: [10.5, 0, -4.5], rot: -2.4, stories: 1, door: 0 },
  { pos: [-8, 0, -8.5], rot: 1, stories: 1, door: 1 },

  // Round 3 — flanking the new north gate approach, plus filling the last
  // thin patches inside the circular fence.
  { pos: [-3, 0, 9], rot: 0.8, stories: 1, door: 2 },
  { pos: [2.5, 0, 10], rot: -1.5, stories: 1, door: 0 },
  { pos: [2, 0, 2], rot: 1.1, stories: 2, door: 3 },
  { pos: [-3.5, 0, -1], rot: -0.4, stories: 1, door: 1 },
  { pos: [6, 0, -1.5], rot: 2.2, stories: 1, door: 0 },
  { pos: [-8.5, 0, -0.5], rot: 0.6, stories: 1, door: 2 },
  { pos: [-4, 0, -9], rot: -1.8, stories: 1, door: 3 },
  { pos: [5, 0, -5.5], rot: 1.4, stories: 2, door: 1 },
  { pos: [0, 0, -3], rot: 2.5, stories: 1, door: 0 },

  // Round 4 — tighter infill, right up to the gate frontage this time.
  { pos: [-2, 0, 10.5], rot: 0.2, stories: 1, door: 1 },
  { pos: [1, 0, 11.5], rot: -2, stories: 1, door: 3 },
  { pos: [-6, 0, 8], rot: 1.6, stories: 1, door: 0 },
  { pos: [9.5, 0, 2], rot: -0.9, stories: 1, door: 2 },
  { pos: [0, 0, 4], rot: 0.5, stories: 2, door: 0 },
  { pos: [8, 0, -3], rot: 2.1, stories: 1, door: 1 },
  { pos: [-2, 0, -5], rot: -1.4, stories: 1, door: 3 },
  { pos: [3, 0, 5], rot: 1.9, stories: 1, door: 2 },
  { pos: [-6, 0, -3], rot: 0.3, stories: 2, door: 0 },
  { pos: [10, 0, 0], rot: -0.6, stories: 1, door: 1 },
]

/** Street lanterns already scattered around the village (see YARD_DETAILS / health
 * center prop placement in Scene1Village) — reused as point-light positions at night. */
export const LANTERN_POSITIONS: [number, number, number][] = [
  [1.4, 1.4, 3.6],
  [-1.2, 1.4, 2.4],
  [-0.9, 1.4, -2.4],
  [9.5, 1.4, -3.5],
  [-14.5, 1.4, 1.5],
]
