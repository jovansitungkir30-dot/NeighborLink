import { useMemo } from 'react'
import { CanvasTexture } from 'three'

/** A small hand-painted-looking wooden sign texture with the given text,
 * generated on a canvas so we don't need a font/texture asset for it. */
export function useSignTexture(text: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 176
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#7A5233'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#3E2812'
    ctx.lineWidth = 12
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12)
    ctx.fillStyle = '#FCE7C6'
    ctx.font = 'bold 68px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4)
    return new CanvasTexture(canvas)
  }, [text])
}
