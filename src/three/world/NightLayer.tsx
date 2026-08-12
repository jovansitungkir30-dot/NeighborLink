import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PointLight, Sprite } from 'three'
import { AdditiveBlending } from 'three'
import { COTTAGES, LANTERN_POSITIONS } from './villageLayout'
import { useGlowTexture } from '../useGlowTexture'
import type { DaySample } from '../dayCycle'

interface GlowLightProps {
  position: [number, number, number]
  glow: number
  seed: number
  color: string
  distance: number
  lightStrength: number
  spriteScale: number
  flickerSpeed: number
  flickerDepth: number
}

/** A point light paired with a visible soft-glow sprite, so a "lit window" or
 * "street lantern" actually reads as a warm dot from a distance (especially
 * from the night finale's aerial view) instead of just an invisible light. */
function GlowLight({ position, glow, seed, color, distance, lightStrength, spriteScale, flickerSpeed, flickerDepth }: GlowLightProps) {
  const lightRef = useRef<PointLight>(null)
  const glowRef = useRef<Sprite>(null)
  const texture = useGlowTexture()

  useFrame((state) => {
    const flicker = 1 - flickerDepth + flickerDepth * Math.sin(state.clock.elapsedTime * flickerSpeed + seed * 11)
    const value = glow > 0.001 ? glow * flicker : 0
    if (lightRef.current) lightRef.current.intensity = value * lightStrength
    if (glowRef.current) glowRef.current.material.opacity = value * 0.95
  })

  return (
    <group position={position}>
      <pointLight ref={lightRef} color={color} distance={distance} decay={2} intensity={0} />
      <sprite ref={glowRef} scale={[spriteScale, spriteScale, 1]}>
        <spriteMaterial map={texture} color={color} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
      </sprite>
    </group>
  )
}

interface FireflyProps {
  center: [number, number, number]
  radius: number
  height: number
  speed: number
  offset: number
  opacity: number
}

function Firefly({ center, radius, height, speed, offset, opacity }: FireflyProps) {
  const ref = useRef<Sprite>(null)
  const texture = useGlowTexture()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset * 10
    ref.current.position.set(
      center[0] + Math.cos(t) * radius + Math.sin(t * 0.6) * radius * 0.3,
      center[1] + height + Math.sin(t * 1.3) * 0.4,
      center[2] + Math.sin(t) * radius + Math.cos(t * 0.6) * radius * 0.3
    )
    const twinkle = 0.4 + 0.6 * Math.max(0, Math.sin(t * 3 + offset * 5))
    ref.current.material.opacity = opacity * twinkle
  })

  if (opacity <= 0.001) return null

  return (
    <sprite ref={ref} scale={[0.3, 0.3, 1]}>
      <spriteMaterial map={texture} color="#E9FF9E" transparent opacity={0} depthWrite={false} blending={AdditiveBlending} />
    </sprite>
  )
}

const FIREFLY_SPOTS: { center: [number, number, number]; radius: number }[] = [
  { center: [-6, 0, -1], radius: 2.6 },
  { center: [-3, 0, 3], radius: 2.2 },
  { center: [3, 0, 5], radius: 2.4 },
  { center: [7, 0, -2], radius: 2.8 },
  { center: [-9, 0, 3], radius: 1.8 },
  { center: [0, 0, -3], radius: 2.5 },
  { center: [10, 0, 3], radius: 2.2 },
  { center: [7.5, 0, -7], radius: 2.6 },
  { center: [-5, 0, -7], radius: 2 },
  { center: [13, 0, 4], radius: 2 },
]

interface NightLayerProps {
  sample: DaySample
  /** extra [x, z] lantern spots (e.g. street lanterns along roads/fence) —
   * merged with the hand-placed LANTERN_POSITIONS so every physical lantern
   * post gets a matching glow. */
  extraLanternSpots?: [number, number][]
}

/** Everything that switches on after dusk — glowing house windows, street
 * lanterns, and drifting fireflies — kept as a sibling of Scene1Village so
 * the large static village tree never has to re-render on scroll. */
export function NightLayer({ sample, extraLanternSpots }: NightLayerProps) {
  const windowSpots = useMemo(
    () => COTTAGES.map((c) => [c.pos[0], c.stories * 0.9 + 0.3, c.pos[2]] as [number, number, number]),
    []
  )

  const lanternSpots = useMemo(
    () => [...LANTERN_POSITIONS, ...(extraLanternSpots ?? []).map(([x, z]) => [x, 1.5, z] as [number, number, number])],
    [extraLanternSpots]
  )

  const fireflies = useMemo(
    () =>
      FIREFLY_SPOTS.flatMap((spot, i) =>
        Array.from({ length: 2 }, (_, j) => ({
          center: spot.center,
          radius: spot.radius * (0.6 + j * 0.5),
          height: 0.4 + ((i + j) % 3) * 0.35,
          speed: 0.18 + ((i * 3 + j) % 5) * 0.05,
          offset: i * 2 + j,
        }))
      ),
    []
  )

  return (
    <group>
      {windowSpots.map((pos, i) => (
        <GlowLight
          key={i}
          position={pos}
          glow={sample.windowGlow}
          seed={i}
          color="#FFC46B"
          distance={4.5}
          lightStrength={1.6}
          spriteScale={0.55}
          flickerSpeed={1.4 + i * 0.3}
          flickerDepth={0.15}
        />
      ))}

      {lanternSpots.map((pos, i) => (
        <GlowLight
          key={i}
          position={pos}
          glow={sample.lanternGlow}
          seed={i}
          color="#FFB84D"
          distance={6}
          lightStrength={2.2}
          spriteScale={0.85}
          flickerSpeed={2.2 + i * 0.4}
          flickerDepth={0.1}
        />
      ))}

      {fireflies.map((f, i) => (
        <Firefly
          key={i}
          center={f.center}
          radius={f.radius}
          height={f.height}
          speed={f.speed}
          offset={f.offset}
          opacity={sample.fireflyOpacity}
        />
      ))}
    </group>
  )
}
