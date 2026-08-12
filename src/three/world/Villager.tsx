import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import type { Group } from 'three'
import { SkeletonUtils } from 'three-stdlib'

export interface VillagerProps {
  variant?: 'a' | 'b' | 'c' | 'd' | 'e'
  position?: [number, number, number]
  rotationY?: number
  scale?: number
  animation?: 'idle' | 'walk' | 'sit' | 'emote-yes' | 'pick-up' | 'interact-right'
}

/** A Kenney Blocky Characters villager, scaled from its native ~9-unit rig
 * height down to roughly two world units so it reads human-sized next to a
 * one-unit cottage wall segment. */
export function Villager({
  variant = 'a',
  position = [0, 0, 0],
  rotationY = 0,
  scale = 0.22,
  animation = 'idle',
}: VillagerProps) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(`/models/characters/character-${variant}.glb`)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const action = actions[animation]
    action?.reset().fadeIn(0.3).play()
    return () => {
      action?.fadeOut(0.3)
    }
  }, [actions, animation])

  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={clonedScene} castShadow receiveShadow />
    </group>
  )
}

useGLTF.preload('/models/characters/character-a.glb')
