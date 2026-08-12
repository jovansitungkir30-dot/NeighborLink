import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import type { Group } from 'three'
import type { CharacterModel } from '../data/villageStories'

interface PortraitModelProps {
  variant: CharacterModel
}

function PortraitModel({ variant }: PortraitModelProps) {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(`/models/characters/character-${variant}.glb`)

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.35
  })

  return (
    <group ref={group} position={[0, -1.05, 0]} scale={0.24}>
      <primitive object={scene} />
    </group>
  )
}

interface CharacterPortraitProps {
  characterModel: CharacterModel
  className?: string
}

/** A small secondary Canvas rendering the character's rigged glb slowly
 * turning under soft studio lighting — used as the "portrait" in story
 * panels since no 2D face art exists, only the handcrafted 3D villagers. */
export function CharacterPortrait({ characterModel, className = '' }: CharacterPortraitProps) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-gradient-to-b from-amber-100/15 to-black/40 ${className}`}>
      <Canvas
        camera={{ fov: 30, position: [0, 0, 2.6] }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: SRGBColorSpace,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.75} color="#FFF3DE" />
        <directionalLight position={[2, 3, 3]} intensity={1.7} color="#FFE3B0" />
        <directionalLight position={[-2, 1, -2]} intensity={0.5} color="#BFE3FF" />

        <mesh position={[0, -1.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.75, 32]} />
          <meshStandardMaterial color="#FFE9B0" transparent opacity={0.25} />
        </mesh>

        <Suspense fallback={null}>
          <PortraitModel variant={characterModel} />
        </Suspense>
      </Canvas>
    </div>
  )
}
