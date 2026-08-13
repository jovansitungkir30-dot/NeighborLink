import { Suspense, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { DayCycleLights } from './DayCycleLights'
import type { DaySample } from './dayCycle'

interface ExperienceProps {
  sample: DaySample
  children: ReactNode
}

/** Narrow screen or few CPU cores — used to drop shadow rendering and cap
 * device pixel ratio on phones/low-end laptops, where the shadow pass and
 * high-DPI supersampling are the biggest GPU cost in this scene. */
function isLowPowerDevice() {
  const narrowScreen = window.innerWidth < 768
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4
  return narrowScreen || fewCores
}

export function Experience({ sample, children }: ExperienceProps) {
  const [lowPower] = useState(isLowPowerDevice)

  return (
    <Canvas
      shadows={lowPower ? false : 'basic'}
      dpr={lowPower ? [1, 1] : [1, 1.5]}
      camera={{ fov: 42, near: 0.5, far: 220, position: [0, 6, 18] }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: SRGBColorSpace,
      }}
    >
      <DayCycleLights sample={sample} />

      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
