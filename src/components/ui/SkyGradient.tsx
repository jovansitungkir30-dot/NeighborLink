import { useMemo } from 'react'
import type { DaySample } from '../../three/dayCycle'

interface Star {
  top: number
  left: number
  size: number
  delay: number
}

const STARS: Star[] = Array.from({ length: 60 }, (_, i) => {
  // deterministic pseudo-random spread so the field doesn't reshuffle on re-render
  const seed = i * 137.508
  return {
    top: (seed * 3.7) % 70,
    left: (seed * 5.3) % 100,
    size: 1 + ((i * 7) % 3),
    delay: (i % 10) * 0.3,
  }
})

interface SkyGradientProps {
  sample: DaySample
}

/** Full-bleed sky backdrop behind the 3D canvas — a 3-stop gradient plus a
 * faint starfield, both driven by the current day-cycle sample. */
export function SkyGradient({ sample }: SkyGradientProps) {
  const background = useMemo(
    () => `linear-gradient(180deg, ${sample.skyTop} 0%, ${sample.skyMid} 55%, ${sample.skyBottom} 100%)`,
    [sample.skyTop, sample.skyMid, sample.skyBottom]
  )

  return (
    <div className="fixed inset-0 -z-10" style={{ background }}>
      <div className="absolute inset-0 overflow-hidden" style={{ opacity: sample.starOpacity }}>
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute animate-pulse rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
