import { DirtPath } from './DirtPath'

/** Straight-line waypoints connecting the original village core to every
 * district added across the stages — Village Hall, the Community Farm, the
 * river crossings, and the main gate — so nothing feels stranded in bare
 * ground, rendered as wide dirt-path ribbons radiating out from the
 * fountain hub (matching a classic village-map look rather than a grid of
 * small square tiles). */
export const CONNECTORS: { from: [number, number]; to: [number, number]; width?: number }[] = [
  { from: [2, -1.5], to: [9.5, -2] }, // fountain -> Village Hall
  { from: [-9, 2], to: [-17, 2] }, // Pak Budi's -> Community Farm (through the west gate)
  { from: [10, 3], to: [15.9, 1] }, // east cottages -> bridge/river (through the east gate)
  { from: [0.5, 1.5], to: [0, 13], width: 3 }, // fountain -> the main village gate — the grand entrance
  { from: [9.5, -2], to: [7.5, -6.5] }, // Village Hall -> park/playground

  // A denser interior street grid so the ground between houses reads as
  // dirt paths radiating from the center, not open grass.
  { from: [0, 8], to: [-3, 9] },
  { from: [0, 8], to: [2.5, 10] },
  { from: [0.5, 1.5], to: [-5.5, 0] },
  { from: [0.5, 1.5], to: [5.5, 0.5] },
  { from: [-9, 2], to: [-9, 6.5] },
  { from: [-6, -7], to: [-1.5, -8.2] },
  { from: [9.5, -2], to: [11.8, -2] },
  { from: [-1.8, -3.4], to: [0.8, -6.9] },
]

export function RoadNetwork() {
  return (
    <group>
      {CONNECTORS.map((c, i) => (
        <DirtPath
          key={i}
          points={[
            [c.from[0], 0, c.from[1]],
            [c.to[0], 0, c.to[1]],
          ]}
          width={c.width ?? 2.2}
        />
      ))}
    </group>
  )
}
