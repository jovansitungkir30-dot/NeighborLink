import { useMemo } from 'react'
import { CanvasTexture } from 'three'

let cached: CanvasTexture | null = null

function createGlowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

/** A single soft radial-gradient sprite texture, generated once and shared by
 * every glow (sun/moon, window lights, lanterns, fireflies) in the journey
 * scene — a flat circleGeometry disc reads as a hard-edged coin, this doesn't. */
export function useGlowTexture() {
  return useMemo(() => {
    if (!cached) cached = createGlowTexture()
    return cached
  }, [])
}
