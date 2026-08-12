interface Peak {
  pos: [number, number, number]
  radius: number
  height: number
  color: string
  seed: number
}

function ring(count: number, radius: number, minHeight: number, maxHeight: number, color: string, phase: number, seedBase: number): Peak[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + phase
    const r = radius + ((i * 53) % 9) - 4
    const height = minHeight + ((i * 37) % (maxHeight - minHeight))
    return {
      pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
      radius: height * 0.65,
      height,
      color,
      seed: seedBase + i,
    }
  })
}

const HILLS = ring(11, 27, 5, 9, '#9CC48A', 0, 1)
const MOUNTAINS = ring(9, 40, 11, 19, '#7C93B0', 0.32, 101)

function rand(seed: number, n: number) {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** An irregular mountain/hill massif — a wide flattened "skirt" cone plus a
 * few jittered, squashed sub-peaks clustered around the center — reads as a
 * jagged ridge instead of one perfectly symmetrical cone. Tall peaks get a
 * small snow cap. */
function Massif({ peak }: { peak: Peak }) {
  const subPeaks = [0, 1, 2].map((i) => ({
    jitterX: (rand(peak.seed, i) - 0.5) * peak.radius * 0.9,
    jitterZ: (rand(peak.seed, i + 10) - 0.5) * peak.radius * 0.9,
    hScale: 0.6 + rand(peak.seed, i + 20) * 0.5,
    rScale: 0.5 + rand(peak.seed, i + 30) * 0.45,
    segs: 5 + Math.floor(rand(peak.seed, i + 40) * 3),
    squashX: 0.75 + rand(peak.seed, i + 50) * 0.5,
    squashZ: 0.75 + rand(peak.seed, i + 60) * 0.5,
  }))

  const isSnowCapped = peak.height > 14

  return (
    <group position={peak.pos}>
      <mesh position={[0, peak.height * 0.22 - 0.6, 0]} scale={[1.25, 1, 1.25]}>
        <coneGeometry args={[peak.radius * 1.15, peak.height * 0.5, 7]} />
        <meshStandardMaterial color={peak.color} roughness={1} flatShading />
      </mesh>

      {subPeaks.map((sp, i) => (
        <mesh
          key={i}
          position={[sp.jitterX, (peak.height * sp.hScale) / 2 - 0.5, sp.jitterZ]}
          scale={[sp.squashX, 1, sp.squashZ]}
        >
          <coneGeometry args={[peak.radius * sp.rScale, peak.height * sp.hScale, sp.segs]} />
          <meshStandardMaterial color={peak.color} roughness={1} flatShading />
        </mesh>
      ))}

      {isSnowCapped && (
        <mesh position={[0, peak.height * 0.92 - 0.5, 0]}>
          <coneGeometry args={[peak.radius * 0.28, peak.height * 0.22, 6]} />
          <meshStandardMaterial color="#F5F7FA" roughness={0.85} flatShading />
        </mesh>
      )}
    </group>
  )
}

/** A hill/mountain ring around the village's outer boundary — pure backdrop
 * (outside the free-roam camera's pan/zoom range), giving the horizon
 * jagged depth instead of fading straight into flat fog. */
export function Hills() {
  return (
    <group>
      {HILLS.map((p, i) => (
        <Massif key={`hill-${i}`} peak={p} />
      ))}
      {MOUNTAINS.map((p, i) => (
        <Massif key={`mtn-${i}`} peak={p} />
      ))}
    </group>
  )
}
