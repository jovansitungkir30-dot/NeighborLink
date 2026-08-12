import { AdditiveBlending } from 'three'
import { GlbProp } from '../world/GlbProp'
import { Villager } from '../world/Villager'
import { useGlowTexture } from '../useGlowTexture'

interface TreeOfHopeProps {
  position?: [number, number, number]
}

/** The village's symbolic centerpiece — an oversized version of the existing
 * oak-family tree prop, dressed with a warm glow and hanging lanterns, with
 * villagers (and one smaller figure standing in for a child) gathered
 * underneath. This is the About destination's landmark. */
export function TreeOfHope({ position = [0, 0, 0] }: TreeOfHopeProps) {
  const glowTexture = useGlowTexture()

  const lanternAngles = [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2)

  return (
    <group position={position}>
      <GlbProp src="nature/tree_fat" scale={2.6} />

      <pointLight position={[0, 3.5, 0]} color="#FFD27A" intensity={1.4} distance={7} decay={2} />
      <sprite position={[0, 3.2, 0]} scale={[5, 5, 1]}>
        <spriteMaterial map={glowTexture} color="#FFDFA0" transparent opacity={0.35} depthWrite={false} blending={AdditiveBlending} />
      </sprite>

      {lanternAngles.map((angle, i) => (
        <GlbProp
          key={i}
          src="town/lantern"
          position={[Math.cos(angle) * 1.6, 2.6, Math.sin(angle) * 1.6]}
          rotation={[0, angle, 0]}
          scale={0.85}
        />
      ))}

      <Villager variant="a" position={[1.4, 0, 0.6]} rotationY={-2.2} animation="idle" scale={0.24} />
      <Villager variant="c" position={[-1.2, 0, 1]} rotationY={1.1} animation="emote-yes" scale={0.24} />
      <Villager variant="e" position={[0.6, 0, -1.5]} rotationY={2.6} animation="idle" scale={0.22} />
      <Villager variant="b" position={[-0.9, 0, -1.1]} rotationY={0.5} animation="sit" scale={0.16} />
    </group>
  )
}
