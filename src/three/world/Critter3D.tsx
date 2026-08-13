import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import type { Group } from 'three'
import { SkeletonUtils } from 'three-stdlib'

export interface Critter3DProps {
  kind: 'cat' | 'dog'
  /** resting position — the wander loop's center when `wander` is set */
  position: [number, number, number]
  rotationY?: number
  scale?: number
  /** if set, the critter walks a slow loop instead of sitting/sleeping in place */
  wander?: { radius: number; speed: number }
  castShadow?: boolean
}

/** A Kenney "Cube Pets" cat or dog — sits/sleeps in place, or wanders a slow
 * loop when `wander` is given (dogs playing vs. cats napping in a doorway).
 * castShadow defaults to false, matching Villager/GlbProp. */
export function Critter3D({ kind, position, rotationY = 0, scale = 0.5, wander, castShadow = false }: Critter3DProps) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(`/models/animals/animal-${kind}.glb`)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  const clip = wander ? 'walk' : 'static'

  useEffect(() => {
    const action = actions[clip]
    action?.reset().fadeIn(0.3).play()
    return () => {
      action?.fadeOut(0.3)
    }
  }, [actions, clip])

  useFrame((state) => {
    if (!group.current || !wander) return
    const t = state.clock.elapsedTime * wander.speed
    group.current.position.set(
      position[0] + Math.cos(t) * wander.radius,
      position[1],
      position[2] + Math.sin(t) * wander.radius
    )
    group.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group
      ref={group}
      position={wander ? undefined : position}
      rotation={[0, rotationY, 0]}
      scale={scale}
    >
      <primitive object={clonedScene} castShadow={castShadow} receiveShadow />
    </group>
  )
}

useGLTF.preload('/models/animals/animal-cat.glb')
useGLTF.preload('/models/animals/animal-dog.glb')
