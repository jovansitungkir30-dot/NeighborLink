import { motion } from 'framer-motion'
import { HeartHandshake } from 'lucide-react'
import { AnimatedCounter } from './AnimatedCounter'
import { villageAboutStats } from '../../data/content'
import { useJoinModal } from '../../context/JoinModalContext'

/** A quiet, always-visible info card while exploring — quick village stats,
 * purely ambient. Deliberately separate from the building hotspots: it
 * never flies the camera or opens a modal on its own, it just sits on the
 * left — except for its one CTA, which turns the "43 Active Volunteers"
 * stat into an actual entry point instead of a dead-end number. */
export function VillageInfoPanel() {
  const { openJoinModal } = useJoinModal()

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden w-60 -translate-y-1/2 flex-col gap-3 rounded-2xl border border-white/15 bg-black/25 px-5 py-4 backdrop-blur-xl sm:left-10 sm:flex lg:left-14"
    >
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">Harmony Village</span>
        <p className="mt-1 text-xs text-white/60">Sekilas tentang desa ini</p>
      </div>
      <div className="flex flex-col gap-2">
        {villageAboutStats.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-4">
            <span className="text-xs text-white/65">{s.label}</span>
            <AnimatedCounter value={s.value} suffix={s.suffix} className="font-heading text-base font-bold text-white" />
          </div>
        ))}
      </div>
      <button
        onClick={() => openJoinModal('Gabung jadi Relawan')}
        className="pointer-events-auto mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 px-4 py-2.5 text-xs font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
      >
        <HeartHandshake size={14} />
        Gabung jadi Relawan
      </button>
    </motion.div>
  )
}
