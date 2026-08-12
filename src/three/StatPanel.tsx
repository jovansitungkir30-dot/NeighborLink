import { useEffect, useState } from 'react'
import { AnimatePresence, motion, animate } from 'framer-motion'

function useCountUp(target: number, active: boolean, duration = 1.4) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [active, target, duration])

  return value
}

interface Stat {
  label: string
  value: number
  suffix?: string
  decimals?: number
}

interface StatRowProps extends Stat {
  active: boolean
}

function StatRow({ label, value, suffix = '', decimals = 0, active }: StatRowProps) {
  const n = useCountUp(value, active)
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="text-xs uppercase tracking-[0.16em] text-white/65">{label}</span>
      <span className="font-heading text-lg font-bold text-white">
        {n.toFixed(decimals)}
        {suffix}
      </span>
    </div>
  )
}

interface StatPanelProps {
  progress: number
  range: [number, number]
  eyebrow: string
  stats: Stat[]
  align?: 'left' | 'right'
}

/** A quiet, cinematic lower-third of counted-up numbers for one scene beat —
 * not a dashboard, just a few honest figures while the camera lingers. */
export function StatPanel({ progress, range, eyebrow, stats, align = 'left' }: StatPanelProps) {
  const visible = progress > range[0] && progress < range[1]

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-8 z-40 flex px-6 ${
        align === 'right' ? 'justify-center sm:justify-end sm:pr-10' : 'justify-center sm:justify-start sm:pl-10'
      }`}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2.5 rounded-2xl border border-white/15 bg-black/25 px-6 py-5 backdrop-blur-xl"
          >
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">{eyebrow}</span>
            {stats.map((s) => (
              <StatRow key={s.label} {...s} active={visible} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
