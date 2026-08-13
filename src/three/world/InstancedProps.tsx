import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { InstancedMesh, Matrix4, Object3D } from 'three'
import type { Mesh } from 'three'

export interface PropPlacement {
  kind: string
  position: [number, number, number]
  rotationY: number
  scale: number
}

interface SubMesh {
  mesh: Mesh
  localMatrix: Matrix4
}

/** Every mesh in a GLB, flattened with its transform relative to the model
 * root — most Kenney props are a single mesh, but a few split into separate
 * mesh nodes (e.g. trunk/foliage), so each needs its own InstancedMesh
 * sharing the same per-placement transform. */
function useSubMeshes(kind: string): SubMesh[] {
  const { scene } = useGLTF(`/models/${kind}.glb`)
  return useMemo(() => {
    scene.updateWorldMatrix(true, true)
    const out: SubMesh[] = []
    scene.traverse((obj) => {
      const mesh = obj as Mesh
      if (mesh.isMesh) out.push({ mesh, localMatrix: mesh.matrixWorld.clone() })
    })
    return out
  }, [scene])
}

interface InstancedKindProps {
  kind: string
  placements: { position: [number, number, number]; rotationY: number; scale: number }[]
  castShadow?: boolean
}

function InstancedKind({ kind, placements, castShadow = false }: InstancedKindProps) {
  const subMeshes = useSubMeshes(kind)
  const refs = useRef<(InstancedMesh | null)[]>([])

  useEffect(() => {
    const tmp = new Object3D()
    subMeshes.forEach((sub, mi) => {
      const im = refs.current[mi]
      if (!im) return
      placements.forEach((p, i) => {
        tmp.position.set(p.position[0], p.position[1], p.position[2])
        tmp.rotation.set(0, p.rotationY, 0)
        tmp.scale.setScalar(p.scale)
        tmp.updateMatrix()
        im.setMatrixAt(i, tmp.matrix.clone().multiply(sub.localMatrix))
      })
      im.instanceMatrix.needsUpdate = true
      im.computeBoundingSphere()
    })
  }, [subMeshes, placements])

  if (placements.length === 0) return null

  return (
    <>
      {subMeshes.map((sub, mi) => (
        <instancedMesh
          key={mi}
          ref={(el) => {
            refs.current[mi] = el
          }}
          args={[sub.mesh.geometry, sub.mesh.material, placements.length]}
          castShadow={castShadow}
          receiveShadow
        />
      ))}
    </>
  )
}

interface InstancedPropsProps {
  items: PropPlacement[]
  castShadow?: boolean
}

/** Renders a flat list of {kind, position, rotationY, scale} placements as
 * one InstancedMesh (or two, for multi-mesh models) per unique kind found in
 * `items`, instead of one draw call per placement. Used anywhere the same
 * handful of GLB props repeat dozens+ of times — forest, crops, fences,
 * cottage parts. */
export function InstancedProps({ items, castShadow = false }: InstancedPropsProps) {
  const byKind = useMemo(() => {
    const groups = new Map<string, { position: [number, number, number]; rotationY: number; scale: number }[]>()
    for (const item of items) {
      if (!groups.has(item.kind)) groups.set(item.kind, [])
      groups.get(item.kind)!.push({ position: item.position, rotationY: item.rotationY, scale: item.scale })
    }
    return groups
  }, [items])

  return (
    <>
      {[...byKind.entries()].map(([kind, placements]) => (
        <InstancedKind key={kind} kind={kind} placements={placements} castShadow={castShadow} />
      ))}
    </>
  )
}
