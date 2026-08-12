import { GlbProp } from './GlbProp'

interface GardenBedProps {
  position?: [number, number, number]
  rotationY?: number
}

/** A small raised community garden bed, planted with the existing flower
 * and bush props. */
export function GardenBed({ position = [0, 0, 0], rotationY = 0 }: GardenBedProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.18, 0.9]} />
        <meshStandardMaterial color="#7C5330" roughness={1} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[1.38, 0.05, 0.78]} />
        <meshStandardMaterial color="#3F2E1A" roughness={1} />
      </mesh>

      <GlbProp src="nature/flower_redA" position={[-0.5, 0.2, 0.2]} rotation={[0, 0.4, 0]} />
      <GlbProp src="nature/flower_yellowA" position={[-0.1, 0.2, -0.2]} rotation={[0, 1.1, 0]} />
      <GlbProp src="nature/flower_purpleA" position={[0.35, 0.2, 0.15]} rotation={[0, 2, 0]} />
      <GlbProp src="nature/plant_bushSmall" position={[0.5, 0.2, -0.2]} rotation={[0, 0, 0]} scale={0.8} />
    </group>
  )
}
