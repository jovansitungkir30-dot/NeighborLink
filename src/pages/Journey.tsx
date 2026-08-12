import { useMemo, useRef, useState } from 'react'
import { Experience } from '../three/Experience'
import { CameraRig, type CameraStop } from '../three/CameraRig'
import { Scene1Village } from '../three/scenes/Scene1Village'
import { NightLayer } from '../three/world/NightLayer'
import { JourneyIntro } from '../three/JourneyIntro'
import { StatPanel } from '../three/StatPanel'
import { SceneCaption } from '../three/SceneCaption'
import { VolunteerMatchCard } from '../three/VolunteerMatchCard'
import { PhaseIndicator } from '../three/PhaseIndicator'
import { SkyGradient } from '../components/ui/SkyGradient'
import { sampleDayCycle } from '../three/dayCycle'

const VILLAGE_STOPS: CameraStop[] = [
  // Scene 1 — the village wakes up
  { position: [0, 15, 19], lookAt: [0, 2, 0] },
  { position: [7, 9, 13], lookAt: [2, 1.6, 1] },
  { position: [-4.5, 5.2, 8], lookAt: [-2, 1.5, 1] },
  { position: [2, 2.8, 5], lookAt: [0.5, 1.6, 0] },
  { position: [-1.2, 2.1, 3.2], lookAt: [1, 1.4, -1] },
  // Scene 2 — Pak Budi's house
  { position: [-4.5, 3.4, 4.6], lookAt: [-6.5, 1.6, 2.8] },
  { position: [-7.6, 2.6, 5.8], lookAt: [-9, 1.7, 3.2] },
  { position: [-11.3, 1.9, 4], lookAt: [-9.7, 1.4, 3.2] },
  // Scene 3 — the health center
  { position: [-7, 3.5, 1], lookAt: [-3, 1.6, -1] },
  { position: [-3.2, 2.6, -1], lookAt: [-1.4, 1.6, -2.8] },
  { position: [0.2, 2, -1.5], lookAt: [-0.6, 1.3, -3] },
  // Scene 4 — the school
  { position: [5, 4.5, 0], lookAt: [9, 1.8, 2] },
  { position: [10, 3, 2.5], lookAt: [12.5, 1.6, 4] },
  { position: [14.8, 2.1, 2], lookAt: [13.4, 1.4, 4.3] },
  // Scene 5 — the community park
  { position: [12, 5, -1], lookAt: [9, 2, -4] },
  { position: [9.5, 3.2, -4.5], lookAt: [8, 1.8, -6.5] },
  { position: [7.6, 2.4, -4], lookAt: [7.5, 1.2, -7.2] },
]

// Scene 6 — dusk falls, and the camera rises from the park into a warm
// aerial view of the whole village at night. Kept as its own curve leg
// (see CameraRig's nightStops) so it never re-tunes the main journey above.
const NIGHT_STOPS: CameraStop[] = [
  { position: [6, 4.5, -2], lookAt: [7, 2, -6] },
  { position: [0.5, 9, 5], lookAt: [0.5, 2, -1] },
  { position: [-3, 15, 13], lookAt: [0, 1.5, 0] },
  { position: [2, 18.5, 17.5], lookAt: [0, 1.8, 0] },
]

// The main journey's 0..1 progress is compressed into [0, NIGHT_START] so the
// night finale can occupy the tail of the scroll without disturbing any of
// the original scene timing below (every *_RANGE is scaled by NIGHT_START).
const NIGHT_START = 0.85
const scaled = (a: number, b: number): [number, number] => [a * NIGHT_START, b * NIGHT_START]

const SCENE2_RANGE = scaled(0.29, 0.47)
const SCENE3_RANGE = scaled(0.47, 0.65)
const SCENE4_RANGE = scaled(0.65, 0.82)
const SCENE5_RANGE = scaled(0.82, 1)

export function Journey() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const daySample = useMemo(() => sampleDayCycle(progress), [progress])

  return (
    <div ref={trackRef} className="relative h-[2000vh] w-full bg-black">
      <SkyGradient sample={daySample} />

      <div className="fixed inset-0">
        <Experience sample={daySample}>
          <Scene1Village />
          <NightLayer sample={daySample} />
          <CameraRig
            stops={VILLAGE_STOPS}
            nightStops={NIGHT_STOPS}
            nightStart={NIGHT_START}
            trackRef={trackRef}
            onProgress={setProgress}
          />
        </Experience>
      </div>

      <PhaseIndicator sample={daySample} />

      <JourneyIntro />

      <StatPanel
        progress={progress}
        range={[0.04, SCENE2_RANGE[0] - 0.04]}
        eyebrow="The Village Wakes Up"
        stats={[
          { label: 'Population', value: 1248, suffix: ' Residents' },
          { label: 'Families', value: 248 },
          { label: 'Community Happiness', value: 94, suffix: '%' },
          { label: 'Volunteers Online', value: 18 },
        ]}
      />

      <SceneCaption
        progress={progress}
        range={[SCENE2_RANGE[0] + 0.02, SCENE2_RANGE[0] + 0.13]}
        eyebrow="Pak Budi · 72 years old · lives alone"
        quote="Today I need to visit the health center, but I cannot walk very far."
      />
      <VolunteerMatchCard
        progress={progress}
        range={[SCENE2_RANGE[0] + 0.13, SCENE2_RANGE[1] - 0.02]}
        volunteerName="Rina"
        distanceMeters={350}
        etaMinutes={4}
        impactLine="Helping elderly neighbors strengthens the whole community's bonds."
      />

      <SceneCaption
        progress={progress}
        range={[SCENE3_RANGE[0] + 0.02, SCENE3_RANGE[0] + 0.13]}
        eyebrow="Bu Sari · Village Nurse"
        quote="Today we provide free health screening."
        align="right"
      />
      <StatPanel
        progress={progress}
        range={[SCENE3_RANGE[0] + 0.13, SCENE3_RANGE[1] - 0.01]}
        eyebrow="Health Center"
        align="right"
        stats={[
          { label: 'Residents Registered', value: 42 },
          { label: 'Checkups Completed', value: 18 },
          { label: 'Volunteers Helping', value: 6 },
          { label: 'Home Visits', value: 3 },
        ]}
      />

      <SceneCaption
        progress={progress}
        range={[SCENE4_RANGE[0] + 0.02, SCENE4_RANGE[0] + 0.13]}
        eyebrow="Pak Andi · Elementary Teacher"
        quote="Tonight we organize free tutoring for children."
      />
      <StatPanel
        progress={progress}
        range={[SCENE4_RANGE[0] + 0.13, SCENE4_RANGE[1] - 0.01]}
        eyebrow="Village School"
        stats={[
          { label: 'Students', value: 24 },
          { label: 'Volunteers', value: 8 },
          { label: 'Books Donated', value: 12 },
          { label: 'Learning Progress', value: 92, suffix: '%' },
        ]}
      />

      <SceneCaption
        progress={progress}
        range={[SCENE5_RANGE[0] + 0.02, SCENE5_RANGE[0] + 0.11]}
        eyebrow="Community Park · Golden Hour"
        quote="As the sun dips low, neighbors gather for gotong royong before the lanterns light."
      />

      <SceneCaption
        progress={progress}
        range={[0.9, 0.97]}
        eyebrow="Pak Slamet · Village Head"
        quote="When every lantern is lit, you can see it — this whole village is one family."
        align="right"
      />
      <StatPanel
        progress={progress}
        range={[0.95, 0.998]}
        eyebrow="A Day in Harmony Village"
        align="right"
        stats={[
          { label: 'Neighbors Helped Today', value: 47 },
          { label: 'Volunteer Hours', value: 132 },
          { label: 'Acts of Kindness', value: 89 },
          { label: 'Community Spirit', value: 98, suffix: '%' },
        ]}
      />
    </div>
  )
}
