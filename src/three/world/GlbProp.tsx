import { Clone, useGLTF } from '@react-three/drei'

interface GlbPropProps {
  src: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

/** Places one instance of a shared glTF scene via drei's <Clone>, so the same
 * cached model can be reused many times across the village without refetching. */
export function GlbProp({ src, position, rotation, scale = 1 }: GlbPropProps) {
  const { scene } = useGLTF(`/models/${src}.glb`)
  return <Clone object={scene} position={position} rotation={rotation} scale={scale} castShadow receiveShadow />
}
