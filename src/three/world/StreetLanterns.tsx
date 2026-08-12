import { GlbProp } from './GlbProp'
import { CONNECTORS } from './RoadNetwork'
import { CENTER, RADIUS, GATES } from './VillagePerimeter'

/** Lanterns spaced along every road connector, alternating sides so they
 * read as "lining the street" rather than marching down the centerline. */
function roadLanternPositions(spacing = 4.5, offset = 1.7): [number, number][] {
  const positions: [number, number][] = []
  CONNECTORS.forEach((c, ci) => {
    const dx = c.to[0] - c.from[0]
    const dz = c.to[1] - c.from[1]
    const dist = Math.hypot(dx, dz)
    const nx = -dz / dist
    const nz = dx / dist
    const count = Math.max(1, Math.floor(dist / spacing))
    for (let i = 1; i < count; i++) {
      const t = i / count
      const px = c.from[0] + dx * t
      const pz = c.from[1] + dz * t
      const side = (ci + i) % 2 === 0 ? 1 : -1
      positions.push([px + nx * offset * side, pz + nz * offset * side])
    }
  })
  return positions
}

/** Lanterns evenly spaced just inside the perimeter fence, skipping the
 * same gate gaps the fence itself leaves open. */
function fenceLanternPositions(spacing = 5, inset = 1.1): [number, number][] {
  const circumference = 2 * Math.PI * RADIUS
  const count = Math.round(circumference / spacing)
  const positions: [number, number][] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const x = CENTER[0] + Math.cos(angle) * (RADIUS - inset)
    const z = CENTER[1] + Math.sin(angle) * (RADIUS - inset)
    const nearGate = GATES.some((g) => Math.hypot(x - g.point[0], z - g.point[1]) < g.radius)
    if (!nearGate) positions.push([x, z])
  }
  return positions
}

/** Ground-level [x,z] positions for every street lantern — shared with
 * NightLayer (via VillageWorld) so the glow effect lines up with the
 * physical lantern post rendered here. */
export const STREET_LANTERN_SPOTS: [number, number][] = [...roadLanternPositions(), ...fenceLanternPositions()]

/** The physical lantern posts along every road and around the inside of
 * the perimeter fence — the light/glow itself is handled by NightLayer,
 * which reuses STREET_LANTERN_SPOTS so post and glow always match. */
export function StreetLanterns() {
  return (
    <group>
      {STREET_LANTERN_SPOTS.map(([x, z], i) => (
        <GlbProp key={i} src="town/lantern" position={[x, 0, z]} />
      ))}
    </group>
  )
}
