import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StoryPanel } from '../components/ui/StoryPanel'
import { VillageInfoPanel } from '../components/ui/VillageInfoPanel'
import { CategoryFilter } from '../components/ui/CategoryFilter'
import { ExploreProgress } from '../components/ui/ExploreProgress'
import { useVillageWorld } from '../context/VillageWorldContext'
import { VILLAGE_STORIES } from '../data/villageStories'

/** Free-roam mode — drag/zoom/click live, the day-cycle auto-advances, and
 * every building opens its own character story. The world itself lives in
 * VillageWorld/VillageWorldProvider; this page just switches the shared
 * camera into interactive mode and renders the Explore-only UI. */
export function ExploreDestination() {
  const { flyToOverview, setInteractive, setTimeMode, activeStoryId, selectStory, categoryFilter, setCategoryFilter } =
    useVillageWorld()
  const [showHint, setShowHint] = useState(true)
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set())

  const activeStory = useMemo(() => VILLAGE_STORIES.find((s) => s.id === activeStoryId) ?? null, [activeStoryId])

  useEffect(() => {
    if (!activeStoryId) return
    setVisitedIds((prev) => (prev.has(activeStoryId) ? prev : new Set(prev).add(activeStoryId)))
  }, [activeStoryId])

  useEffect(() => {
    setInteractive(true)
    setTimeMode('auto')
    flyToOverview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  const goToOverview = useCallback(() => {
    selectStory(null)
    flyToOverview()
    setShowHint(false)
  }, [selectStory, flyToOverview])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') goToOverview()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goToOverview])

  return (
    <>
      {!activeStoryId && <VillageInfoPanel />}
      {!activeStoryId && <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />}
      {!activeStoryId && <ExploreProgress visited={visitedIds.size} total={VILLAGE_STORIES.length} />}

      <AnimatePresence>
        {activeStoryId && (
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={goToOverview}
            className="pointer-events-auto fixed bottom-8 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-xl transition-colors hover:bg-black/45"
          >
            Esc · Kembali ke Desa
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && !activeStoryId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="pointer-events-none fixed bottom-8 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-xs font-medium text-white/80 backdrop-blur-xl"
          >
            Geser untuk menjelajah · Scroll untuk zoom · Klik bangunan untuk kenal ceritanya
          </motion.div>
        )}
      </AnimatePresence>

      <StoryPanel story={activeStory} onClose={goToOverview} />
    </>
  )
}
