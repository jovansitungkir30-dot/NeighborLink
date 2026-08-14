import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Vector3, type Group } from 'three'
import { SkeletonUtils } from 'three-stdlib'

// Shared scratch vector reused across every Villager's useFrame — safe since
// each instance reads it synchronously before the next one runs.
const _worldPos = new Vector3()

// Distance bands (world units) from the camera at which a villager's
// animation mixer updates: full rate up close, throttled at mid range, and
// fully paused + hidden past the cull radius. Buffer between CULL_HIDE and
// CULL_SHOW avoids visibility flicker when a villager sits right at the edge.
const THROTTLE_DISTANCE = 14
const CULL_HIDE = 38
const CULL_SHOW = 33

export interface VillagerProps {
  variant?: 'a' | 'b' | 'c' | 'd' | 'e'
  position?: [number, number, number]
  rotationY?: number
  scale?: number
  animation?: 'idle' | 'walk' | 'sit' | 'emote-yes' | 'pick-up' | 'interact-right'
  castShadow?: boolean
}

/** A Kenney Blocky Characters villager, scaled from its native ~9-unit rig
 * height down to roughly two world units so it reads human-sized next to a
 * one-unit cottage wall segment.
 * castShadow defaults to false — with ~60 of these animated on screen at
 * once, each casting was an extra shadow-depth draw call per villager per
 * frame and was a real chunk of the reported lag; only opt a villager back
 * in when it's a hero/foreground character close to a camera stop. */
export function Villager({
  variant = 'a',
  position = [0, 0, 0],
  rotationY = 0,
  scale = 0.22,
  animation = 'idle',
  castShadow = false,
}: VillagerProps) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(`/models/characters/character-${variant}.glb`)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const mixer = useMemo(() => new AnimationMixer(clonedScene), [clonedScene])
  const frameCount = useRef(0)

  useEffect(() => {
    const clip = animations.find((c) => c.name === animation)
    if (!clip) return
    const action = mixer.clipAction(clip)
    action.reset().fadeIn(0.3).play()
    return () => {
      action.fadeOut(0.3)
    }
  }, [mixer, animations, animation])

  useEffect(() => () => void mixer.stopAllAction(), [mixer])

  // Villagers are static (never move), so a plain local-position distance
  // check against the camera is equivalent to world distance here — cheaper
  // than a matrix-world lookup for ~75 instances every frame.
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    _worldPos.set(g.position.x, g.position.y, g.position.z)
    const dist = state.camera.position.distanceTo(_worldPos)

    if (dist > CULL_HIDE) {
      g.visible = false
      return
    }
    if (dist < CULL_SHOW) g.visible = true

    frameCount.current++
    const skip = dist > THROTTLE_DISTANCE ? 3 : 1
    if (frameCount.current % skip !== 0) return
    mixer.update(delta * skip)
  })

  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={clonedScene} castShadow={castShadow} receiveShadow />
    </group>
  )
}

useGLTF.preload('/models/characters/character-a.glb')
