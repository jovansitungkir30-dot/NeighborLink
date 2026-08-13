import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { SkyGradient } from '../components/ui/SkyGradient'
import { PhaseIndicator } from '../three/PhaseIndicator'
import { sampleDayCycle } from '../three/dayCycle'
import { VILLAGE_OVERVIEW, type StoryCategory } from '../data/villageStories'
import type { CameraStop, FreeRoamCameraHandle } from '../three/FreeRoamCamera'

type TimeMode = 'auto' | number

interface VillageWorldContextValue {
  flyTo: (stop: CameraStop) => Promise<void>
  flyToOverview: () => Promise<void>
  setInteractive: (v: boolean) => void
  setTimeMode: (mode: TimeMode) => void
  activeStoryId: string | null
  selectStory: (id: string | null) => void
  categoryFilter: StoryCategory | null
  setCategoryFilter: (c: StoryCategory | null) => void
}

const VillageWorldContext = createContext<VillageWorldContextValue | null>(null)

// Lazy-loaded — pulls in the full three.js/@react-three/fiber/drei scene
// graph, so routes that never set `active` (e.g. /fitur, /dashboard,
// /journey) shouldn't pay to download it.
const VillageWorld = lazy(() => import('../three/VillageWorld').then((m) => ({ default: m.VillageWorld })))

export function useVillageWorld() {
  const ctx = useContext(VillageWorldContext)
  if (!ctx) throw new Error('useVillageWorld must be used within VillageWorldProvider')
  return ctx
}

const DAY_CYCLE_DURATION_MS = 8 * 60 * 1000
const PHASE_ORDER = ['pagi', 'siang', 'sore', 'malam'] as const
const PHASE_TIMES: Record<(typeof PHASE_ORDER)[number], number> = { pagi: 0.05, siang: 0.4, sore: 0.85, malam: 0.95 }

interface VillageWorldProviderProps {
  /** whether the current route is one of the village destinations — when
   * false, the persistent Canvas is unmounted entirely (e.g. on /fitur or
   * /journey) rather than paying its cost while never being shown. */
  active: boolean
  children: ReactNode
}

/** Mounts the one persistent village Canvas (via VillageWorld) and shares
 * its camera/day-cycle/story-selection state with whichever destination
 * route (Home/About/Explore/Contact) is currently rendered as children —
 * so navigating between them flies the camera instead of remounting WebGL.
 * Always wraps <Routes> so the context itself never remounts between village
 * routes; only the Canvas underneath mounts/unmounts with `active`. */
export function VillageWorldProvider({ active, children }: VillageWorldProviderProps) {
  const cameraRef = useRef<FreeRoamCameraHandle>(null)
  const [progress, setProgress] = useState(0.14)
  const [timeMode, setTimeModeState] = useState<TimeMode>(0.14)
  const [interactive, setInteractive] = useState(false)
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<StoryCategory | null>(null)

  useEffect(() => {
    if (!active || timeMode !== 'auto') {
      if (timeMode !== 'auto') setProgress(timeMode)
      return
    }
    const id = setInterval(() => {
      setProgress((p) => (p + 250 / DAY_CYCLE_DURATION_MS) % 1)
    }, 250)
    return () => clearInterval(id)
  }, [timeMode, active])

  const daySample = useMemo(() => sampleDayCycle(progress), [progress])

  const setTimeMode = useCallback((mode: TimeMode) => setTimeModeState(mode), [])
  const selectStory = useCallback((id: string | null) => setActiveStoryId(id), [])

  // Clicking the phase badge jumps to the next time of day — this is what
  // makes it read as an actual control rather than a decorative status.
  const cyclePhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(daySample.phase)
    const next = PHASE_ORDER[(idx + 1) % PHASE_ORDER.length]
    setTimeModeState(PHASE_TIMES[next])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daySample.phase])

  const flyTo = useCallback(async (stop: CameraStop) => {
    await cameraRef.current?.flyTo(stop)
  }, [])

  const flyToOverview = useCallback(async () => {
    await cameraRef.current?.flyTo(VILLAGE_OVERVIEW)
  }, [])

  const value = useMemo<VillageWorldContextValue>(
    () => ({ flyTo, flyToOverview, setInteractive, setTimeMode, activeStoryId, selectStory, categoryFilter, setCategoryFilter }),
    [flyTo, flyToOverview, activeStoryId, selectStory, setTimeMode, categoryFilter]
  )

  return (
    <VillageWorldContext.Provider value={value}>
      {active && (
        <>
          <SkyGradient sample={daySample} />
          <Suspense fallback={null}>
            <VillageWorld
              sample={daySample}
              cameraRef={cameraRef}
              interactive={interactive}
              onSelectStory={selectStory}
              categoryFilter={categoryFilter}
            />
          </Suspense>
          <PhaseIndicator sample={daySample} onClick={cyclePhase} />
        </>
      )}
      {children}
    </VillageWorldContext.Provider>
  )
}
