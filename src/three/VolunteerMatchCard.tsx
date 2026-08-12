import { motion } from 'framer-motion'
import { HeartHandshake, MapPin, Clock } from 'lucide-react'

interface VolunteerMatchCardProps {
  progress: number
  range: [number, number]
  volunteerName: string
  distanceMeters: number
  etaMinutes: number
  impactLine: string
}

function rangeOpacity(progress: number, [start, end]: [number, number]) {
  const fadeSpan = Math.min(0.04, (end - start) / 3)
  if (progress < start || progress > end) return 0
  if (progress < start + fadeSpan) return (progress - start) / fadeSpan
  if (progress > end - fadeSpan) return (end - progress) / fadeSpan
  return 1
}

/** The "AI Assistant found a volunteer" beat — a small glass card, not a dashboard. */
export function VolunteerMatchCard({ progress, range, volunteerName, distanceMeters, etaMinutes, impactLine }: VolunteerMatchCardProps) {
  const opacity = rangeOpacity(progress, range)
  if (opacity <= 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-6 sm:justify-end sm:bottom-28 sm:pr-14">
      <motion.div
        style={{ opacity }}
        animate={{ y: (1 - opacity) * 14 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xs rounded-2xl border border-white/20 bg-black/30 px-5 py-4 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200/90">
          <HeartHandshake size={14} />
          Volunteer Found
        </div>
        <p className="mt-2 font-heading text-lg font-bold text-white">{volunteerName}</p>
        <div className="mt-2 flex flex-col gap-1.5 text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {distanceMeters} meters away
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> ETA {etaMinutes} minutes
          </span>
        </div>
        <p className="mt-3 border-t border-white/15 pt-3 text-xs leading-relaxed text-white/65">{impactLine}</p>
      </motion.div>
    </div>
  )
}
