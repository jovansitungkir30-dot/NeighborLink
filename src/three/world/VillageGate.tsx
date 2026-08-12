import { GlbProp } from './GlbProp'
import { useSignTexture } from '../useSignTexture'

interface VillageGateProps {
  position?: [number, number, number]
  rotationY?: number
}

/** A wooden welcome arch marking the village entrance, with a hand-painted
 * (canvas-generated) sign readable from both directions, flanked by lanterns. */
export function VillageGate({ position = [0, 0, 0], rotationY = 0 }: VillageGateProps) {
  const signTexture = useSignTexture('Harmony Village')

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.17, 2.2, 8]} />
          <meshStandardMaterial color="#6B4226" roughness={0.9} />
        </mesh>
      ))}

      <mesh position={[0, 2.3, 0]} castShadow>
        <boxGeometry args={[3.8, 0.2, 0.2]} />
        <meshStandardMaterial color="#6B4226" roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.82, 0.13]}>
        <planeGeometry args={[1.6, 0.55]} />
        <meshStandardMaterial map={signTexture} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.82, -0.13]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.6, 0.55]} />
        <meshStandardMaterial map={signTexture} roughness={0.85} />
      </mesh>

      <GlbProp src="town/lantern" position={[-1.7, 0, 0.45]} />
      <GlbProp src="town/lantern" position={[1.7, 0, 0.45]} />
      <GlbProp src="town/lantern" position={[-1.7, 0, -0.45]} rotation={[0, Math.PI, 0]} />
      <GlbProp src="town/lantern" position={[1.7, 0, -0.45]} rotation={[0, Math.PI, 0]} />
    </group>
  )
}
