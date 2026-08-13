import { useRef } from 'react'
import { AdditiveBlending, type DirectionalLight } from 'three'
import { useGlowTexture } from './useGlowTexture'
import type { DaySample } from './dayCycle'

interface DayCycleLightsProps {
  sample: DaySample
}

/** Sun/hemisphere/ambient lighting + fog + a soft sun-or-moon glow sprite,
 * all driven by the current day-cycle sample. Replaces the static lighting
 * rig that used to live directly in Experience.tsx. */
export function DayCycleLights({ sample }: DayCycleLightsProps) {
  const sunRef = useRef<DirectionalLight>(null)
  const glowTexture = useGlowTexture()

  const glowOpacity = Math.min(Math.max(sample.sunIntensity / 3, sample.moonOpacity * 0.85), 1)

  return (
    <>
      <fogExp2 attach="fog" args={[sample.fogColor, sample.fogDensity]} />

      <directionalLight
        ref={sunRef}
        position={sample.sunPosition}
        intensity={sample.sunIntensity}
        color={sample.sunColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0004}
      />
      <hemisphereLight args={[sample.hemiSky, sample.hemiGround, sample.hemiIntensity]} />
      <ambientLight intensity={sample.ambientIntensity} color={sample.ambientColor} />

      <sprite position={sample.sunPosition} scale={[11, 11, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={sample.sunColor}
          transparent
          opacity={glowOpacity}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>
    </>
  )
}
