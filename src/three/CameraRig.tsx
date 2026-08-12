import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

export interface CameraStop {
  /** camera world position */
  position: [number, number, number]
  /** point the camera looks toward */
  lookAt: [number, number, number]
  /** narrow field of view for a dolly-zoom-ish feel, degrees */
  fov?: number
}

interface CameraRigProps {
  stops: CameraStop[]
  /** Optional second leg appended after the main journey (e.g. a night finale) —
   * kept as its own curve so it doesn't re-parameterize (and re-tune) the main one. */
  nightStops?: CameraStop[]
  /** Scroll progress (0..1) at which the main leg ends and the night leg begins. */
  nightStart?: number
  trackRef: RefObject<HTMLElement | null>
  onProgress?: (t: number) => void
}

function buildCurves(stops: CameraStop[]) {
  return {
    pos: new CatmullRomCurve3(
      stops.map((s) => new Vector3(...s.position)),
      false,
      'catmullrom',
      0.5
    ),
    look: new CatmullRomCurve3(
      stops.map((s) => new Vector3(...s.lookAt)),
      false,
      'catmullrom',
      0.5
    ),
  }
}

export function CameraRig({ stops, nightStops, nightStart = 1, trackRef, onProgress }: CameraRigProps) {
  const { camera } = useThree()
  const progress = useRef(0)
  const curves = useRef<{ pos: CatmullRomCurve3; look: CatmullRomCurve3 } | null>(null)
  const nightCurves = useRef<{ pos: CatmullRomCurve3; look: CatmullRomCurve3 } | null>(null)
  const current = useRef({ pos: new Vector3(...stops[0].position), look: new Vector3(...stops[0].lookAt) })

  useEffect(() => {
    curves.current = buildCurves(stops)
  }, [stops])

  useEffect(() => {
    nightCurves.current = nightStops && nightStops.length > 1 ? buildCurves(nightStops) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nightStops])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const lenis = getLenis()
    const onLenisScroll = () => ScrollTrigger.update()
    lenis?.on('scroll', onLenisScroll)

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
      onUpdate: (self) => {
        progress.current = self.progress
        onProgress?.(self.progress)
      },
    })

    return () => {
      trigger.kill()
      lenis?.off('scroll', onLenisScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackRef])

  useFrame(() => {
    const c = curves.current
    if (!c) return
    const t = Math.min(Math.max(progress.current, 0), 1)

    let targetPos: Vector3
    let targetLook: Vector3

    if (nightCurves.current && t >= nightStart) {
      const lt = (t - nightStart) / (1 - nightStart)
      targetPos = nightCurves.current.pos.getPointAt(Math.min(Math.max(lt, 0), 1))
      targetLook = nightCurves.current.look.getPointAt(Math.min(Math.max(lt, 0), 1))
    } else {
      const mt = nightCurves.current ? Math.min(t / nightStart, 1) : t
      targetPos = c.pos.getPointAt(mt)
      targetLook = c.look.getPointAt(mt)
    }

    current.current.pos.lerp(targetPos, 0.09)
    current.current.look.lerp(targetLook, 0.09)
    camera.position.copy(current.current.pos)
    camera.lookAt(current.current.look)
  })

  return null
}
