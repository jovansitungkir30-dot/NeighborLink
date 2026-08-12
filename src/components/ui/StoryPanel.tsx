import { AnimatePresence, motion } from 'framer-motion'
import { CharacterPortrait } from '../../three/CharacterPortrait'
import { Button } from './Button'
import { useJoinModal } from '../../context/JoinModalContext'
import type { VillageStory } from '../../data/villageStories'

interface StoryPanelProps {
  story: VillageStory | null
  onClose: () => void
}

/** The character-story modal that opens once the camera settles on a
 * building — portrait, quote, current need, NeighborLink AI recommendation,
 * and a "Help {name}" CTA wired into the existing join-request flow. */
export function StoryPanel({ story, onClose }: StoryPanelProps) {
  const { openJoinModal } = useJoinModal()

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex w-full max-w-lg flex-col gap-5 rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-2xl sm:flex-row sm:p-7"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
              aria-label="Tutup"
            >
              ✕
            </button>

            <CharacterPortrait characterModel={story.characterModel} className="h-40 w-full shrink-0 sm:h-auto sm:w-40" />

            <div className="flex flex-1 flex-col gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/90">
                  {story.buildingName}
                </span>
                <h3 className="font-heading text-2xl font-bold text-white">{story.characterName}</h3>
                <p className="text-sm text-white/70">
                  {story.occupation} · {story.age} tahun
                </p>
              </div>

              <p className="font-heading text-lg italic leading-snug text-white">&ldquo;{story.quote}&rdquo;</p>

              <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">Kebutuhan Saat Ini</span>
                  <p className="text-white">{story.need}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">NeighborLink AI</span>
                  <p className="text-white">
                    {story.aiRecommendation} <span className="text-amber-200">ETA {story.etaMinutes} menit</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">Dampak</span>
                  <p className="text-white/80">{story.impact}</p>
                </div>
              </div>

              <Button
                onClick={() =>
                  openJoinModal({
                    title: `Bantu ${story.characterName}`,
                    characterName: story.characterName,
                    need: story.need,
                    buildingName: story.buildingName,
                  })
                }
                className="mt-1 self-start"
              >
                Bantu {story.characterName}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
