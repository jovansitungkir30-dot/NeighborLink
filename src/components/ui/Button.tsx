import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode, MouseEvent, ButtonHTMLAttributes } from 'react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/utils'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>

interface ButtonProps extends NativeButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'md' | 'lg'
  icon?: ReactNode
  onClick?: () => void
  className?: string
  magnetic?: boolean
}

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-glow hover:shadow-glow hover:brightness-110',
  secondary:
    'bg-white text-ink border border-slate-200 hover:border-primary-300 shadow-soft dark:bg-white/5 dark:text-white dark:border-white/15 dark:hover:border-primary-400',
  ghost: 'bg-transparent text-white hover:bg-white/10',
  outline: 'bg-transparent border border-white/40 text-white hover:bg-white/10',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  className,
  type = 'button',
  magnetic = true,
  ...rest
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const ref = useRef<HTMLButtonElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 320, damping: 22, mass: 0.4 })
  const springY = useSpring(rawY, { stiffness: 320, damping: 22, mass: 0.4 })

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    if (!magnetic || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    rawX.set(relX * 0.25)
    rawY.set(relY * 0.35)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const id = Date.now()
    setRipples((r) => [...r, { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }])
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650)
    onClick?.()
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-colors duration-300',
        size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm',
        variants[variant],
        className
      )}
      {...rest}
    >
      {icon}
      <span className="relative z-10">{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40 animate-[ripple_0.65s_ease-out]"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </motion.button>
  )
}
