import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Sprite } from 'three'
import { useGlowTexture } from '../useGlowTexture'

interface CloudProps {
  startX: number
  z: number
  height: number
  speed: number
  scale: number
  /** drifts across [-rangeX, rangeX] then wraps back around */
  rangeX: number
}

function Cloud({ startX, z, height, speed, scale, rangeX }: CloudProps) {
  const ref = useRef<Sprite>(null)
  const texture = useGlowTexture()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    const x = (((startX + t + rangeX) % (rangeX * 2)) + rangeX * 2) % (rangeX * 2) - rangeX
    ref.current.position.set(x, height, z)
  })

  return (
    <sprite ref={ref} scale={[scale, scale * 0.5, 1]}>
      <spriteMaterial map={texture} color="#FFFFFF" transparent opacity={0.78} depthWrite={false} />
    </sprite>
  )
}

const CLOUD_SPOTS: CloudProps[] = [
  { startX: -20, z: -10, height: 16, speed: 0.25, scale: 9, rangeX: 32 },
  { startX: 5, z: 8, height: 18.5, speed: 0.18, scale: 11, rangeX: 32 },
  { startX: -8, z: 15, height: 15, speed: 0.3, scale: 7, rangeX: 32 },
  { startX: 18, z: -15, height: 19, speed: 0.2, scale: 10, rangeX: 32 },
  { startX: -25, z: 3, height: 17, speed: 0.22, scale: 8, rangeX: 32 },
  { startX: 10, z: -5, height: 20, speed: 0.15, scale: 12, rangeX: 32 },
]

/** Soft billboard clouds drifting slowly across the village sky, wrapping
 * around once they reach the edge of their range — the same cheap sprite
 * technique used for the sun/moon glow, just flatter and more opaque. */
export function Clouds() {
  return (
    <group>
      {CLOUD_SPOTS.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
    </group>
  )
}
