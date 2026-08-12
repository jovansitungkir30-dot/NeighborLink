import { Color } from 'three'

export type DayPhase = 'pagi' | 'siang' | 'sore' | 'malam'

export interface DaySample {
  phase: DayPhase
  phaseLabel: string
  phaseIcon: string
  skyTop: string
  skyMid: string
  skyBottom: string
  fogColor: string
  fogDensity: number
  sunColor: string
  sunIntensity: number
  sunPosition: [number, number, number]
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  ambientColor: string
  ambientIntensity: number
  /** 0..1 — street lantern point-light strength */
  lanternGlow: number
  /** 0..1 — house window point-light strength */
  windowGlow: number
  /** 0..1 — firefly particle visibility */
  fireflyOpacity: number
  /** 0..1 — starfield visibility */
  starOpacity: number
  /** 0..1 — moon glow visibility */
  moonOpacity: number
}

interface DayKeyframe {
  t: number
  skyTop: string
  skyMid: string
  skyBottom: string
  fogColor: string
  fogDensity: number
  sunColor: string
  sunIntensity: number
  sunPosition: [number, number, number]
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  ambientColor: string
  ambientIntensity: number
  lanternGlow: number
  windowGlow: number
  fireflyOpacity: number
  starOpacity: number
  moonOpacity: number
}

/** The village's full day arc, expressed as keyframes along the 0..1 scroll
 * progress of the /journey page. Interpolated with sampleDayCycle(). */
const KEYFRAMES: DayKeyframe[] = [
  {
    // subuh — misty, cool dawn just before the village stirs
    t: 0,
    skyTop: '#8FB8DE',
    skyMid: '#F3C6A0',
    skyBottom: '#FCE0C2',
    fogColor: '#F4CBA8',
    fogDensity: 0.022,
    sunColor: '#FFB37A',
    sunIntensity: 1.4,
    sunPosition: [-24, 6, 16],
    hemiSky: '#9FC4E8',
    hemiGround: '#E9C9A8',
    hemiIntensity: 0.5,
    ambientColor: '#FFDDBE',
    ambientIntensity: 0.22,
    lanternGlow: 0.15,
    windowGlow: 0.1,
    fireflyOpacity: 0,
    starOpacity: 0.05,
    moonOpacity: 0.1,
  },
  {
    // pagi — warm golden morning, the village fully awake
    t: 0.14,
    skyTop: '#BFE0F5',
    skyMid: '#FCE7C6',
    skyBottom: '#FCEFD9',
    fogColor: '#FFE3C2',
    fogDensity: 0.018,
    sunColor: '#FFE3B0',
    sunIntensity: 2.4,
    sunPosition: [-18, 22, 10],
    hemiSky: '#BFE3FF',
    hemiGround: '#DCFCE7',
    hemiIntensity: 0.65,
    ambientColor: '#FFF3DE',
    ambientIntensity: 0.25,
    lanternGlow: 0,
    windowGlow: 0,
    fireflyOpacity: 0,
    starOpacity: 0,
    moonOpacity: 0,
  },
  {
    // siang naik — brighter, cooler, sun climbing
    t: 0.35,
    skyTop: '#7FC3F0',
    skyMid: '#CDEAFB',
    skyBottom: '#EAF6E9',
    fogColor: '#DCEFFB',
    fogDensity: 0.012,
    sunColor: '#FFF7E0',
    sunIntensity: 2.9,
    sunPosition: [-6, 30, 4],
    hemiSky: '#BEE3FF',
    hemiGround: '#E4FBE0',
    hemiIntensity: 0.75,
    ambientColor: '#FFFDF3',
    ambientIntensity: 0.3,
    lanternGlow: 0,
    windowGlow: 0,
    fireflyOpacity: 0,
    starOpacity: 0,
    moonOpacity: 0,
  },
  {
    // siang terik — midday plateau, sun near zenith
    t: 0.65,
    skyTop: '#63B6EC',
    skyMid: '#C7E7FA',
    skyBottom: '#E9F7E6',
    fogColor: '#D8EEFB',
    fogDensity: 0.011,
    sunColor: '#FFF4D6',
    sunIntensity: 3,
    sunPosition: [10, 31, -2],
    hemiSky: '#BEE3FF',
    hemiGround: '#E4FBE0',
    hemiIntensity: 0.78,
    ambientColor: '#FFFCF0',
    ambientIntensity: 0.3,
    lanternGlow: 0,
    windowGlow: 0,
    fireflyOpacity: 0,
    starOpacity: 0,
    moonOpacity: 0,
  },
  {
    // sore — golden hour over the community park
    t: 0.85,
    skyTop: '#5B85C4',
    skyMid: '#F0A868',
    skyBottom: '#FBD9A6',
    fogColor: '#F5B978',
    fogDensity: 0.02,
    sunColor: '#FF9D52',
    sunIntensity: 2,
    sunPosition: [22, 10, -8],
    hemiSky: '#7FA6D8',
    hemiGround: '#F3C58C',
    hemiIntensity: 0.55,
    ambientColor: '#FFD9A8',
    ambientIntensity: 0.28,
    lanternGlow: 0.05,
    windowGlow: 0.05,
    fireflyOpacity: 0,
    starOpacity: 0.05,
    moonOpacity: 0.05,
  },
  {
    // senja — dusk, lanterns and windows start glowing
    t: 0.93,
    skyTop: '#2C3E70',
    skyMid: '#7A4F73',
    skyBottom: '#E08A5B',
    fogColor: '#9C6B7A',
    fogDensity: 0.026,
    sunColor: '#FF7A45',
    sunIntensity: 0.8,
    sunPosition: [30, 3, -14],
    hemiSky: '#3A4E82',
    hemiGround: '#8A5E62',
    hemiIntensity: 0.4,
    ambientColor: '#6B5C8A',
    ambientIntensity: 0.22,
    lanternGlow: 0.7,
    windowGlow: 0.6,
    fireflyOpacity: 0.35,
    starOpacity: 0.45,
    moonOpacity: 0.5,
  },
  {
    // malam — full night, aerial finale over a warmly lit village
    t: 1,
    skyTop: '#050B22',
    skyMid: '#131A3D',
    skyBottom: '#2B2550',
    fogColor: '#161C3D',
    fogDensity: 0.03,
    sunColor: '#4A5FA0',
    sunIntensity: 0.35,
    sunPosition: [18, 26, -20],
    hemiSky: '#1B2550',
    hemiGround: '#2A2036',
    hemiIntensity: 0.35,
    ambientColor: '#39406E',
    ambientIntensity: 0.2,
    lanternGlow: 1,
    windowGlow: 1,
    fireflyOpacity: 1,
    starOpacity: 1,
    moonOpacity: 1,
  },
]

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpColor(a: string, b: string, t: number) {
  return `#${new Color(a).lerp(new Color(b), t).getHexString()}`
}

function lerpVec3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

export function getDayPhase(t: number): DayPhase {
  if (t < 0.28) return 'pagi'
  if (t < 0.8) return 'siang'
  if (t < 0.88) return 'sore'
  return 'malam'
}

const PHASE_META: Record<DayPhase, { label: string; icon: string }> = {
  pagi: { label: 'Pagi', icon: '🌅' },
  siang: { label: 'Siang', icon: '☀️' },
  sore: { label: 'Sore', icon: '🌇' },
  malam: { label: 'Malam', icon: '🌙' },
}

/** Samples the full day-cycle lighting/sky state at scroll progress t (0..1). */
export function sampleDayCycle(progress: number): DaySample {
  const t = Math.min(Math.max(progress, 0), 1)

  let lo = KEYFRAMES[0]
  let hi = KEYFRAMES[KEYFRAMES.length - 1]
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (t >= KEYFRAMES[i].t && t <= KEYFRAMES[i + 1].t) {
      lo = KEYFRAMES[i]
      hi = KEYFRAMES[i + 1]
      break
    }
  }
  const span = hi.t - lo.t
  const f = span > 0 ? smoothstep(0, 1, (t - lo.t) / span) : 0

  const phase = getDayPhase(t)
  const meta = PHASE_META[phase]

  return {
    phase,
    phaseLabel: meta.label,
    phaseIcon: meta.icon,
    skyTop: lerpColor(lo.skyTop, hi.skyTop, f),
    skyMid: lerpColor(lo.skyMid, hi.skyMid, f),
    skyBottom: lerpColor(lo.skyBottom, hi.skyBottom, f),
    fogColor: lerpColor(lo.fogColor, hi.fogColor, f),
    fogDensity: lerp(lo.fogDensity, hi.fogDensity, f),
    sunColor: lerpColor(lo.sunColor, hi.sunColor, f),
    sunIntensity: lerp(lo.sunIntensity, hi.sunIntensity, f),
    sunPosition: lerpVec3(lo.sunPosition, hi.sunPosition, f),
    hemiSky: lerpColor(lo.hemiSky, hi.hemiSky, f),
    hemiGround: lerpColor(lo.hemiGround, hi.hemiGround, f),
    hemiIntensity: lerp(lo.hemiIntensity, hi.hemiIntensity, f),
    ambientColor: lerpColor(lo.ambientColor, hi.ambientColor, f),
    ambientIntensity: lerp(lo.ambientIntensity, hi.ambientIntensity, f),
    lanternGlow: lerp(lo.lanternGlow, hi.lanternGlow, f),
    windowGlow: lerp(lo.windowGlow, hi.windowGlow, f),
    fireflyOpacity: lerp(lo.fireflyOpacity, hi.fireflyOpacity, f),
    starOpacity: lerp(lo.starOpacity, hi.starOpacity, f),
    moonOpacity: lerp(lo.moonOpacity, hi.moonOpacity, f),
  }
}
