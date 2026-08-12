import { useMemo } from 'react'
import { GlbProp } from './GlbProp'

interface FenceSegment {
  pos: [number, number, number]
  rot: number
}

export interface Gate {
  point: [number, number]
  radius: number
}

export const CENTER: [number, number] = [0, 0]
// Capped by the east river (~x 15.5–17.6) — this keeps the closest point of
// the ring (13, 0) a safe ~2.5 units clear of it, with even more clearance
// everywhere else as the circle curves back toward the center.
export const RADIUS = 13

export const GATES: Gate[] = [
  { point: [0, 13], radius: 2.5 }, // main entrance — faces the default camera approach
  { point: [12.8, 2], radius: 2.2 }, // road to the east bridge
  { point: [-12.85, 2], radius: 2.2 }, // road to the Community Farm / west bridge
]

function buildPerimeter(center: [number, number], radius: number, gates: Gate[], spacing = 0.6) {
  const circumference = 2 * Math.PI * radius
  const count = Math.round(circumference / spacing)
  const fences: FenceSegment[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const x = center[0] + Math.cos(angle) * radius
    const z = center[1] + Math.sin(angle) * radius
    const nearGate = gates.some((g) => Math.hypot(x - g.point[0], z - g.point[1]) < g.radius)
    if (!nearGate) {
      // tangent direction, so each segment follows the curve
      const rot = angle + Math.PI / 2
      fences.push({ pos: [x, 0, z], rot })
    }
  }

  const gateMarkers: FenceSegment[] = gates.map((g) => {
    const angle = Math.atan2(g.point[1] - center[1], g.point[0] - center[0])
    return { pos: [g.point[0], 0, g.point[1]], rot: angle + Math.PI / 2 }
  })

  return { fences, gateMarkers }
}

/** A simple circular fence ring around the village core, built from the
 * existing Kenney fence props — deliberately a clean circle rather than a
 * polygon so the spacing reads consistently all the way around, with gate
 * openings only where a road already crosses it. Kept well clear of both
 * rivers at every point by construction (radius capped below the east
 * river's distance from the center). */
export function VillagePerimeter() {
  const { fences, gateMarkers } = useMemo(() => buildPerimeter(CENTER, RADIUS, GATES), [])

  return (
    <group>
      {fences.map((f, i) => (
        <GlbProp key={i} src="nature/fence_simple" position={f.pos} rotation={[0, f.rot, 0]} scale={[1.25, 1, 1]} />
      ))}
      {gateMarkers.map((g, i) => (
        <GlbProp key={`gate-${i}`} src="nature/fence_gate" position={g.pos} rotation={[0, g.rot, 0]} />
      ))}
    </group>
  )
}
