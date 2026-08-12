import { motion } from 'framer-motion'
import { CATEGORY_META, type StoryCategory } from '../../data/villageStories'

const CATEGORIES = Object.keys(CATEGORY_META) as StoryCategory[]

interface CategoryFilterProps {
  value: StoryCategory | null
  onChange: (c: StoryCategory | null) => void
}

/** A row of category chips (Warga / Fasilitas Umum / UMKM & Pasar / ...)
 * so the 40 clickable characters stay browsable as the village grows —
 * picking one hides every hotspot outside that category. */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="pointer-events-auto fixed left-1/2 top-28 z-30 flex max-w-[92vw] -translate-x-1/2 flex-wrap items-center justify-center gap-2"
    >
      <button
        onClick={() => onChange(null)}
        className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-xl transition-colors ${
          value === null
            ? 'border-white/40 bg-white/90 text-ink'
            : 'border-white/20 bg-black/25 text-white/80 hover:bg-black/40'
        }`}
      >
        Semua
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(value === c ? null : c)}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-xl transition-colors ${
            value === c
              ? 'border-white/40 bg-white/90 text-ink'
              : 'border-white/20 bg-black/25 text-white/80 hover:bg-black/40'
          }`}
        >
          <span>{CATEGORY_META[c].icon}</span>
          {CATEGORY_META[c].label}
        </button>
      ))}
    </motion.div>
  )
}
