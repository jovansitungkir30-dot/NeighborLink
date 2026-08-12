import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CatmullRomCurve3, DoubleSide, Vector3 } from 'three'
import type { Sprite } from 'three'
import { useGlowTexture } from '../useGlowTexture'

interface FoamSpriteProps {
  curve: CatmullRomCurve3
  offset: number
  speed: number
}

function FoamSprite({ curve, offset, speed }: FoamSpriteProps) {
  const ref = useRef<Sprite>(null)
  const texture = useGlowTexture()

  useFrame((state) => {
    if (!ref.current) return
    const t = (((state.clock.elapsedTime * speed + offset) % 1) + 1) % 1
    const p = curve.getPointAt(t)
    ref.current.position.set(p.x, p.y + 0.05, p.z)
    const fade = Math.sin(t * Math.PI)
    ref.current.material.opacity = 0.5 * fade
  })

  return (
    <sprite ref={ref} scale={[0.5, 0.25, 1]}>
      <spriteMaterial map={texture} color="#EAF6FF" transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
    </sprite>
  )
}

interface RiverProps {
  /** control points the river winds through, in world space */
  points: [number, number, number][]
  width?: number
}

/** A winding river built as a flat ribbon along a Catmull-Rom curve, with a
 * handful of foam sprites drifting downstream to sell the flowing motion
 * cheaply (no water shader / texture asset needed). */
export function River({ points, width = 1.7 }: RiverProps) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p)), false, 'catmullrom', 0.5),
    [points]
  )

  const segments = 48

  const { positions, uvs, indices } = useMemo(() => {
    const verts: number[] = []
    const uv: number[] = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const p = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t)
      const normal = new Vector3(-tangent.z, 0, tangent.x).normalize()
      const left = p.clone().addScaledVector(normal, width / 2)
      const right = p.clone().addScaledVector(normal, -width / 2)
      verts.push(left.x, left.y, left.z, right.x, right.y, right.z)
      uv.push(0, t, 1, t)
    }
    const idx: number[] = []
    for (let i = 0; i < segments; i++) {
      const a = i * 2
      const b = i * 2 + 1
      const c = i * 2 + 2
      const d = i * 2 + 3
      idx.push(a, b, c, b, d, c)
    }
    return { positions: new Float32Array(verts), uvs: new Float32Array(uv), indices: new Uint16Array(idx) }
  }, [curve, width])

  const foamSprites = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ offset: i / 9, speed: 0.035 + (i % 3) * 0.006 })),
    []
  )

  return (
    <group position={[0, 0.04, 0]}>
      <mesh receiveShadow>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-uv" args={[uvs, 2]} />
          <bufferAttribute attach="index" args={[indices, 1]} />
        </bufferGeometry>
        <meshStandardMaterial color="#4A90C2" roughness={0.25} metalness={0.15} transparent opacity={0.88} side={DoubleSide} />
      </mesh>

      {foamSprites.map((f, i) => (
        <FoamSprite key={i} curve={curve} offset={f.offset} speed={f.speed} />
      ))}
    </group>
  )
}
