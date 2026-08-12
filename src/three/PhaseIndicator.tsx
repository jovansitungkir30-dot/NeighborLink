import { AnimatePresence, motion } from 'framer-motion'
import type { DaySample } from './dayCycle'

interface PhaseIndicatorProps {
  sample: DaySample
  onClick?: () => void
}

/** A corner badge naming the current time of day — pagi/siang/sore/malam —
 * and doubling as the control for it: click to jump to the next phase, so
 * it reads as an actual toggle rather than a decorative status. */
export function PhaseIndicator({ sample, onClick }: PhaseIndicatorProps) {
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-40 flex flex-col items-end gap-1 sm:right-8 sm:top-8">
      <AnimatePresence mode="wait">
        <motion.button
          key={sample.phase}
          onClick={onClick}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 backdrop-blur-xl transition-colors hover:border-white/40 hover:bg-black/35"
        >
          <span className="text-xl leading-none">{sample.phaseIcon}</span>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
            {sample.phaseLabel}
          </span>
        </motion.button>
      </AnimatePresence>
      <span className="pointer-events-none pr-1 text-[10px] font-medium text-white/50">Klik untuk ubah waktu</span>
    </div>
  )
}
