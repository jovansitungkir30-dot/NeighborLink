import { Clone, useGLTF } from '@react-three/drei'

interface GlbPropProps {
  src: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
}

/** Places one instance of a shared glTF scene via drei's <Clone>, so the same
 * cached model can be reused many times across the village without refetching.
 * castShadow defaults to false — background/decorative props (most of the
 * scene) skip the shadow depth pass; only foreground pieces that visibly
 * ground-shadow (cottages, hero trees, villagers) opt back in. */
export function GlbProp({ src, position, rotation, scale = 1, castShadow = false, receiveShadow = true }: GlbPropProps) {
  const { scene } = useGLTF(`/models/${src}.glb`)
  return <Clone object={scene} position={position} rotation={rotation} scale={scale} castShadow={castShadow} receiveShadow={receiveShadow} />
}
