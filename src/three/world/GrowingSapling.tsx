import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { GlbProp } from './GlbProp'

interface GrowingSaplingProps {
  position?: [number, number, number]
  baseScale?: number
}

/** A freshly planted sapling that breathes slightly larger — a quiet "new
 * growth" cue rather than a literal one-shot grow-from-seed animation. */
export function GrowingSapling({ position = [0, 0, 0], baseScale = 0.55 }: GrowingSaplingProps) {
  const ref = useRef<Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const s = baseScale * (1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.04)
    ref.current.scale.setScalar(s)
  })

  return (
    <group ref={ref} position={position}>
      <GlbProp src="nature/tree_small" />
    </group>
  )
}
