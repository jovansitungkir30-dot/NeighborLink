import { Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { DayCycleLights } from './DayCycleLights'
import type { DaySample } from './dayCycle'

interface ExperienceProps {
  sample: DaySample
  children: ReactNode
}

export function Experience({ sample, children }: ExperienceProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
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
