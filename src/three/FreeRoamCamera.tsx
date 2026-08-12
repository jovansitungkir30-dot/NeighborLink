import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { Box3, Vector3 } from 'three'

export interface CameraStop {
  position: [number, number, number]
  lookAt: [number, number, number]
}

export interface FreeRoamCameraHandle {
  flyTo: (stop: CameraStop) => Promise<void>
}

interface FreeRoamCameraProps {
  overview: CameraStop
  /** [minX, minZ, maxX, maxZ] — how far the pan target is allowed to wander */
  bounds?: [number, number, number, number]
  /** false = purely programmatic (curated destinations); true = drag/zoom/rotate live (Explore mode) */
  interactive?: boolean
}

/** The village's one shared camera: drag to pan, wheel to zoom, right-drag to
 * rotate slightly, clamped to an isometric-ish angle band and a pan boundary.
 * User input is gated by `interactive` — off it, the camera is purely under
 * flyTo() control so curated Home/About/Contact shots can't be dragged away
 * from. Exposes flyTo() for building clicks and destination-route changes. */
export const FreeRoamCamera = forwardRef<FreeRoamCameraHandle, FreeRoamCameraProps>(function FreeRoamCamera(
  { overview, bounds = [-26, -26, 26, 26], interactive = false },
  ref
) {
  const controls = useRef<CameraControlsImpl>(null)

  useEffect(() => {
    const c = controls.current
    if (!c) return

    c.minDistance = 4.5
    c.maxDistance = 34
    c.minPolarAngle = Math.PI * 0.16
    c.maxPolarAngle = Math.PI * 0.48
    c.dollyToCursor = true
    c.smoothTime = 0.5
    c.draggingSmoothTime = 0.15
    c.setBoundary(new Box3(new Vector3(bounds[0], -2, bounds[1]), new Vector3(bounds[2], 10, bounds[3])))

    c.setLookAt(...overview.position, ...overview.lookAt, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const c = controls.current
    if (!c) return
    if (interactive) {
      c.mouseButtons.left = CameraControlsImpl.ACTION.TRUCK
      c.mouseButtons.right = CameraControlsImpl.ACTION.ROTATE
      c.mouseButtons.wheel = CameraControlsImpl.ACTION.DOLLY
      c.mouseButtons.middle = CameraControlsImpl.ACTION.DOLLY
      c.touches.one = CameraControlsImpl.ACTION.TOUCH_TRUCK
      c.touches.two = CameraControlsImpl.ACTION.TOUCH_DOLLY_TRUCK
    } else {
      c.mouseButtons.left = CameraControlsImpl.ACTION.NONE
      c.mouseButtons.right = CameraControlsImpl.ACTION.NONE
      c.mouseButtons.wheel = CameraControlsImpl.ACTION.NONE
      c.mouseButtons.middle = CameraControlsImpl.ACTION.NONE
      c.touches.one = CameraControlsImpl.ACTION.NONE
      c.touches.two = CameraControlsImpl.ACTION.NONE
    }
  }, [interactive])

  useImperativeHandle(
    ref,
    () => ({
      flyTo: async (stop) => {
        await controls.current?.setLookAt(...stop.position, ...stop.lookAt, true)
      },
    }),
    []
  )

  return <CameraControls ref={controls} />
})
