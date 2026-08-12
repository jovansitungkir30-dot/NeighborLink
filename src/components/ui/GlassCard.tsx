import { motion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  tilt?: boolean
  glow?: 'primary' | 'secondary' | 'accent' | 'none'
  strong?: boolean
  as?: 'div'
}

const glowClasses: Record<string, string> = {
  primary: 'hover:shadow-glow',
  secondary: 'hover:shadow-glow-teal',
  accent: 'hover:shadow-glow-green',
  none: '',
}

export function GlassCard({ children, className, tilt = false, glow = 'none', strong = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(900px) rotateX(0deg) rotateY(0deg)')

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!tilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const rotateY = px * 10
    const rotateX = -py * 10
    setTransform(`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`)
  }

  function handleMouseLeave() {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg)')
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-3xl transition-shadow duration-500 will-change-transform',
        glowClasses[glow],
        className
      )}
    >
      {children}
    </motion.div>
  )
}
