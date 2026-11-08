import type { ExerciseId } from '../types'
import type { PoseAnimation, PoseFrame } from './engine'
import { ACTIVE, BAR, HALF, HANG, PASSIVE, STAND, TOP, t } from './shared'

/** The original drawings (from docs/exercise-animations.html), used by the workout plan. */
const pullupFrames = (topHold: number, ring = false): PoseFrame[] => [
  { a: HANG, len: ACTIVE, move: 0, hold: 500, cap: t('Straight arms, legs together, toes pointed', 'Gestrekte armen, benen tegen elkaar, tenen gestrekt') },
  { a: TOP, move: 1000, hold: topHold, ring, cap: t('Chin clearly over the bar, no kicking', 'Kin duidelijk boven de stang, niet schoppen') },
  { a: HANG, len: ACTIVE, move: 1400, hold: 200, cap: t('Lower with control, all the way down', 'Gecontroleerd helemaal zakken') }
]

export const BASIC_POSES: Partial<Record<ExerciseId, PoseAnimation>> = {
  warmup: {
    root: 'foot', at: [60, 103.5], ground: 106,
    frames: [
      { a: { ...STAND, ua: 90, fa: 90 }, move: 450, ease: 'linear', cap: t('Big arm circles', 'Grote armcirkels') },
      { a: { ...STAND, ua: 0, fa: 0 }, move: 450, ease: 'linear' },
      { a: { ...STAND, ua: -90, fa: -90 }, move: 450, ease: 'linear' },
      { a: { ...STAND, ua: -180, fa: -180 }, move: 450, ease: 'linear' }
    ]
  },
  hang: {
    root: 'hand', at: BAR,
    frames: [
      { a: { ...HANG, hd: -62 }, len: PASSIVE, move: 700, hold: 800, cap: t('Grab the bar, arms straight', 'Pak de stang, armen gestrekt') },
      { a: { ...HANG, th: 82, sh: 84 }, len: ACTIVE, move: 600, hold: 3000, ring: true, cap: t('Shoulders gently down, legs together: hold', 'Schouders licht omlaag, benen tegen elkaar: vasthouden') }
    ]
  },
  scap: {
    root: 'hand', at: BAR,
    frames: [
      { a: { ...HANG, hd: -62 }, len: PASSIVE, move: 0, hold: 600, cap: t('Dead hang, arms straight', 'Strekhang, armen gestrekt') },
      { a: { ...HANG, th: 83, sh: 85 }, len: { ua: 10.5 }, move: 800, hold: 1000, cap: t('Shoulders down: the body rises, elbows stay straight', 'Schouders omlaag: je lichaam komt omhoog, ellebogen gestrekt') },
      { a: { ...HANG, hd: -62 }, len: PASSIVE, move: 1300, hold: 200, cap: t('Lower slowly', 'Langzaam terug') }
    ]
  },
  hollow: {
    root: 'hip', at: [62, 101], ground: 104,
    frames: [
      { a: { to: 0, hd: 195, ua: 180, fa: 180, th: 0, sh: 0 }, move: 900, hold: 800, cap: t('On your back, arms by your ears', 'Op je rug, armen langs je oren') },
      { a: { to: 15, hd: 205, ua: 198, fa: 192, th: -15, sh: -15 }, move: 900, hold: 3000, ring: true, cap: t('Lift shoulders and feet, lower back on the floor', 'Schouders en voeten omhoog, onderrug op de grond') }
    ]
  },
  row: {
    root: 'foot', at: [106, 98], ground: 100.5, bar: [72, 55], ik: { hand: [72, 55], bend: -1 },
    frames: [
      { a: { ua: 0, fa: 0, to: 26, th: 26, sh: 26, hd: 206 }, move: 1200, hold: 500, cap: t('Body straight like a plank, arms straight', 'Lichaam recht als een plank, armen gestrekt') },
      { a: { ua: 0, fa: 0, to: 48, th: 48, sh: 48, hd: 228 }, move: 900, hold: 400, cap: t('Chest to the bar, elbows close', 'Borst naar de stang, ellebogen langs je lichaam') }
    ]
  },
  flexed: {
    root: 'hand', at: BAR,
    frames: [
      { a: HANG, len: ACTIVE, move: 0, hold: 500, cap: t('Step or jump up', 'Stap of spring omhoog') },
      { a: TOP, move: 600, hold: 3000, ring: true, cap: t('Chin over the bar, elbows tight: hold', 'Kin boven de stang, ellebogen in: vasthouden') },
      { a: HANG, len: ACTIVE, move: 1000, hold: 300, cap: t('Step down safely', 'Rustig naar beneden') }
    ]
  },
  neg: {
    root: 'hand', at: BAR,
    frames: [
      { a: TOP, move: 600, hold: 700, cap: t('Jump up to chin over the bar', 'Spring omhoog tot je kin boven de stang is') },
      { a: HANG, len: ACTIVE, move: 5000, ease: 'linear', count: 5, hold: 800, cap: t('Lower slowly: count to 5', 'Langzaam zakken: tel tot 5') }
    ]
  },
  box: {
    root: 'hand', at: BAR, ik: { foot: [70, 72], bend: -1 }, box: [60, 74.5, 26, 30.5], ground: 105,
    frames: [
      { a: HANG, len: ACTIVE, move: 0, hold: 500, cap: t('Feet on the box, arms straight', 'Voeten op de kist, armen gestrekt') },
      { a: TOP, move: 1000, hold: 400, cap: t('Pull with your arms, push a little with your legs', 'Trek met je armen, duw een beetje met je benen') },
      { a: HANG, len: ACTIVE, move: 1300, hold: 200, cap: t('Lower slowly', 'Langzaam zakken') }
    ]
  },
  half: {
    root: 'hand', at: BAR,
    frames: [
      { a: TOP, move: 900, hold: 400, cap: t('Get to the top', 'Kom naar boven') },
      { a: HALF, move: 700, hold: 3000, ring: true, cap: t('Elbows at a right angle: hold', 'Ellebogen haaks: vasthouden') },
      { a: HANG, len: ACTIVE, move: 900, hold: 400, cap: t('Lower down', 'Rustig zakken') }
    ]
  },
  tuck: {
    root: 'hand', at: BAR,
    frames: [
      { a: HANG, len: ACTIVE, move: 0, hold: 400, cap: t('Hang, shoulders active', 'Hang, schouders actief') },
      { a: { ...HANG, to: 100, th: -45, sh: 80 }, len: ACTIVE, move: 900, hold: 300, cap: t('Knees to the chest, no swinging', 'Knieën naar je borst, niet zwaaien') },
      { a: HANG, len: ACTIVE, move: 1200, hold: 200, cap: t('Lower slowly', 'Langzaam zakken') }
    ]
  },
  pullup: { root: 'hand', at: BAR, frames: pullupFrames(300) },
  chin: { root: 'hand', at: BAR, frames: pullupFrames(300) },
  weighted: { root: 'hand', at: BAR, frames: pullupFrames(300) },
  pause: { root: 'hand', at: BAR, frames: pullupFrames(2000, true) },
  lsit: {
    root: 'hand', at: BAR,
    frames: [
      { a: HANG, len: ACTIVE, move: 800, hold: 300, cap: t('Hang with straight arms', 'Hang met gestrekte armen') },
      { a: { ...HANG, to: 92, th: 0, sh: 0, hd: -78 }, len: ACTIVE, move: 800, hold: 400, cap: t('Lift straight legs into an L', 'Til gestrekte benen tot een L') },
      { a: { ...TOP, to: 100, th: 4, sh: 4, hd: -76 }, move: 1100, hold: 300, cap: t('Pull up, legs stay up', 'Trek op, benen blijven omhoog') },
      { a: { ...HANG, to: 92, th: 0, sh: 0, hd: -78 }, len: ACTIVE, move: 1400, hold: 300, cap: t('Lower slowly', 'Langzaam zakken') }
    ]
  }
}
