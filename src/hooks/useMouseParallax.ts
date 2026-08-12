import { useEffect, useState } from 'react'

interface ParallaxPosition {
  x: number
  y: number
}

/** Returns normalized mouse position in range [-0.5, 0.5] relative to viewport center. */
export function useMouseParallax(): ParallaxPosition {
  const [pos, setPos] = useState<ParallaxPosition>({ x: 0, y: 0 })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    function handleMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      setPos({ x, y })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return pos
}
