import { useMemo } from 'react'
import { CatmullRomCurve3, DoubleSide, Vector3 } from 'three'

function buildRibbon(curve: CatmullRomCurve3, width: number, segments: number) {
  const positions: number[] = []
  const uvs: number[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const p = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)
    const normal = new Vector3(-tangent.z, 0, tangent.x).normalize()
    const left = p.clone().addScaledVector(normal, width / 2)
    const right = p.clone().addScaledVector(normal, -width / 2)
    positions.push(left.x, left.y, left.z, right.x, right.y, right.z)
    uvs.push(0, t, 1, t)
  }

  const indices: number[] = []
  for (let i = 0; i < segments; i++) {
    const a = i * 2
    const b = i * 2 + 1
    const c = i * 2 + 2
    const d = i * 2 + 3
    indices.push(a, b, c, b, d, c)
  }

  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  }
}

interface DirtPathProps {
  points: [number, number, number][]
  width?: number
}

/** A smooth, wide dirt-path ribbon following a curve — reads as a real road
 * from the overview camera, unlike small repeated square tiles which look
 * choppy at angles. Two-tone: a slightly darker worn border under a
 * lighter trodden center, same ribbon-geometry technique as River.tsx. */
export function DirtPath({ points, width = 2.4 }: DirtPathProps) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p)), false, 'catmullrom', 0.5),
    [points]
  )
  const segments = Math.max(6, Math.round(curve.getLength() / 1.2))

  const border = useMemo(() => buildRibbon(curve, width, segments), [curve, width, segments])
  const center = useMemo(() => buildRibbon(curve, width * 0.62, segments), [curve, width, segments])

  return (
    <group>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[border.positions, 3]} />
          <bufferAttribute attach="attributes-uv" args={[border.uvs, 2]} />
          <bufferAttribute attach="index" args={[border.indices, 1]} />
        </bufferGeometry>
        <meshStandardMaterial color="#A9824F" roughness={1} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.018, 0]} receiveShadow>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[center.positions, 3]} />
          <bufferAttribute attach="attributes-uv" args={[center.uvs, 2]} />
          <bufferAttribute attach="index" args={[center.indices, 1]} />
        </bufferGeometry>
        <meshStandardMaterial color="#C9A46B" roughness={1} side={DoubleSide} />
      </mesh>
    </group>
  )
}
