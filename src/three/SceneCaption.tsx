import { motion } from 'framer-motion'

interface SceneCaptionProps {
  progress: number
  range: [number, number]
  eyebrow?: string
  speaker?: string
  quote: string
  align?: 'left' | 'right'
}

function rangeOpacity(progress: number, [start, end]: [number, number]) {
  const fadeSpan = Math.min(0.05, (end - start) / 3)
  if (progress < start || progress > end) return 0
  if (progress < start + fadeSpan) return (progress - start) / fadeSpan
  if (progress > end - fadeSpan) return (end - progress) / fadeSpan
  return 1
}

/** A quiet, single-line dialogue card for one character beat in the journey —
 * fades in as the camera settles on them, fades out as it moves on. */
export function SceneCaption({ progress, range, eyebrow, speaker, quote, align = 'left' }: SceneCaptionProps) {
  const opacity = rangeOpacity(progress, range)
  if (opacity <= 0) return null

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-1/3 z-40 flex px-6 ${
        align === 'right' ? 'justify-end sm:pr-14' : 'justify-start sm:pl-14'
      }`}
    >
      <motion.div
        style={{ opacity }}
        animate={{ y: (1 - opacity) * 14 }}
        transition={{ duration: 0.2 }}
        className="max-w-sm rounded-2xl border border-white/20 bg-black/25 px-6 py-5 backdrop-blur-xl"
      >
        {eyebrow && (
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/90">
            {eyebrow}
          </span>
        )}
        <p className="font-heading text-xl italic leading-snug text-white sm:text-2xl">&ldquo;{quote}&rdquo;</p>
        {speaker && <span className="mt-3 block text-sm font-semibold text-white/75">— {speaker}</span>}
      </motion.div>
    </div>
  )
}
