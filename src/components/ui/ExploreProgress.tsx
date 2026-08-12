import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'

interface ExploreProgressProps {
  visited: number
  total: number
}

/** Bottom-right progress tracker for Explore mode — how many of the 40
 * residents you've met so far, turning wandering the village into a small
 * "collect them all" loop instead of just a static counter. */
export function ExploreProgress({ visited, total }: ExploreProgressProps) {
  const pct = total > 0 ? Math.min(100, Math.round((visited / total) * 100)) : 0
  const done = visited >= total && total > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="pointer-events-none fixed bottom-8 right-6 z-30 w-52 rounded-2xl border border-white/15 bg-black/25 px-4 py-3.5 backdrop-blur-xl sm:right-8"
    >
      <div className="flex items-center gap-1.5">
        <Compass size={13} className="text-amber-200/90" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200/90">Progres Jelajah</span>
      </div>
      <p className="mt-1.5 text-sm font-bold text-white">
        {visited}/{total} <span className="font-normal text-white/60">warga ditemui</span>
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-primary-500"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {done && <p className="mt-2 text-[11px] font-medium text-accent-400">Semua warga sudah kamu temui! 🎉</p>}
    </motion.div>
  )
}
