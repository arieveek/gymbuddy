import type { ExerciseId, Text } from './types'

/*
 * Animated exercise drawings, ported from docs/exercise-animations.html.
 * Side view, body facing +x. Angles in degrees, SVG convention: 0 = right, 90 = down.
 * ua: shoulder→elbow, fa: elbow→hand, to: shoulder→hip, th: hip→knee, sh: knee→foot, hd: shoulder→head.
 * The root joint stays fixed (hands on the bar, hips or feet on the floor); the rest follows.
 * An ik pin keeps the hands or feet on a fixed point (low bar, box).
 */

export type Vec = [number, number]
export type Angles = { ua: number, fa: number, to: number, th: number, sh: number, hd: number }
export type Lengths = Angles

export const LEN: Lengths = { ua: 13, fa: 12, to: 24, th: 16, sh: 15, hd: 9 }
export const HEAD_R = 6.5
export const VIEW: Vec = [120, 110]
const BAR: Vec = [62, 20]

export interface PoseFrame {
  a: Angles
  len?: Partial<Lengths>
  /** Time to move into this frame from the previous one, ms. */
  move?: number
  /** Time to stay in this frame, ms. */
  hold?: number
  ease?: 'inout' | 'linear'
  /** Show a filling ring during the hold. */
  ring?: boolean
  /** Count down from this number during the move into this frame. */
  count?: number
  cap?: Text
}

export interface PoseAnimation {
  root: 'hand' | 'hip' | 'foot'
  at: Vec
  ground?: number
  bar?: Vec
  box?: [number, number, number, number]
  ik?: { hand?: Vec, foot?: Vec, bend: 1 | -1 }
  frames: PoseFrame[]
}

const HANG: Angles = { ua: -90, fa: -90, to: 90, th: 86, sh: 88, hd: -72 }
const TOP: Angles = { ua: 60, fa: -80, to: 92, th: 82, sh: 88, hd: -80 }
const HALF: Angles = { ua: 0, fa: -90, to: 78, th: 84, sh: 90, hd: -80 }
const STAND: Angles = { ua: 90, fa: 90, to: 90, th: 90, sh: 90, hd: -90 }
const PASSIVE = { ua: 15 }
const ACTIVE = { ua: 13 }
const t = (en: string, nl: string): Text => ({ en, nl })

const pullupFrames = (topHold: number, ring = false): PoseFrame[] => [
  { a: HANG, len: ACTIVE, move: 0, hold: 500, cap: t('Straight arms, legs together, toes pointed', 'Gestrekte armen, benen tegen elkaar, tenen gestrekt') },
  { a: TOP, move: 1000, hold: topHold, ring, cap: t('Chin clearly over the bar, no kicking', 'Kin duidelijk boven de stang, niet schoppen') },
  { a: HANG, len: ACTIVE, move: 1400, hold: 200, cap: t('Lower with control, all the way down', 'Gecontroleerd helemaal zakken') }
]

export const POSES: Record<ExerciseId, PoseAnimation> = {
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
      { a: { ...HANG, hd: -62 }, len: PASSIVE, move: 0, hold: 600, cap: t('Dead hang, arms straight', 'Dode hang, armen gestrekt') },
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

/* ---------- Kinematics ---------- */

export interface Joints {
  hand: Vec, elbow: Vec, shoulder: Vec, hip: Vec, knee: Vec, foot: Vec, head: Vec
  /** Unit vector shoulder→head. */
  neck: Vec
}

export interface Pose { a: Angles, len: Lengths }

const rad = (a: number) => a * Math.PI / 180
const dir = (a: number): Vec => [Math.cos(rad(a)), Math.sin(rad(a))]
const add = (p: Vec, v: Vec, k: number): Vec => [p[0] + v[0] * k, p[1] + v[1] * k]

/** Two-bone IK: joint and end point for a limb from `a` reaching for `target`. */
export function twoBone(a: Vec, target: Vec, l1: number, l2: number, bend: number): [Vec, Vec] {
  const dx = target[0] - a[0]
  const dy = target[1] - a[1]
  const dist = Math.min(l1 + l2 - 0.001, Math.max(Math.abs(l1 - l2) + 0.001, Math.hypot(dx, dy)))
  const base = Math.atan2(dy, dx)
  const ang = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist))))
  const j: Vec = [a[0] + Math.cos(base + bend * ang) * l1, a[1] + Math.sin(base + bend * ang) * l1]
  const ex = target[0] - j[0]
  const ey = target[1] - j[1]
  const el = Math.hypot(ex, ey) || 1
  return [j, [j[0] + ex / el * l2, j[1] + ey / el * l2]]
}

export function solve(anim: PoseAnimation, pose: Pose): Joints {
  const { a, len: L } = pose
  let hand: Vec | undefined, elbow: Vec | undefined, knee: Vec | undefined, foot: Vec | undefined
  let shoulder: Vec, hip: Vec
  if (anim.root === 'hand') {
    hand = anim.at
    elbow = add(hand, dir(a.fa), -L.fa)
    shoulder = add(elbow, dir(a.ua), -L.ua)
    hip = add(shoulder, dir(a.to), L.to)
  } else if (anim.root === 'hip') {
    hip = anim.at
    shoulder = add(hip, dir(a.to), -L.to)
  } else {
    foot = anim.at
    knee = add(foot, dir(a.sh), -L.sh)
    hip = add(knee, dir(a.th), -L.th)
    shoulder = add(hip, dir(a.to), -L.to)
  }
  if (!elbow || !hand) {
    if (anim.ik?.hand) [elbow, hand] = twoBone(shoulder, anim.ik.hand, L.ua, L.fa, anim.ik.bend)
    else {
      elbow = add(shoulder, dir(a.ua), L.ua)
      hand = add(elbow, dir(a.fa), L.fa)
    }
  }
  if (!knee || !foot) {
    if (anim.ik?.foot) [knee, foot] = twoBone(hip, anim.ik.foot, L.th, L.sh, anim.ik.bend)
    else {
      knee = add(hip, dir(a.th), L.th)
      foot = add(knee, dir(a.sh), L.sh)
    }
  }
  return { hand, elbow, shoulder, hip, knee, foot, head: add(shoulder, dir(a.hd), L.hd), neck: dir(a.hd) }
}

const lerpAng = (x: number, y: number, k: number) => x + ((((y - x) % 360) + 540) % 360 - 180) * k
const KEYS = ['ua', 'fa', 'to', 'th', 'sh', 'hd'] as const

export function mix(p: Pose, q: Pose, k: number): Pose {
  const a = { ...p.a }
  const len = { ...p.len }
  for (const key of KEYS) {
    a[key] = lerpAng(p.a[key], q.a[key], k)
    len[key] = p.len[key] + (q.len[key] - p.len[key]) * k
  }
  return { a, len }
}

const EASE = { inout: (k: number) => 0.5 - Math.cos(Math.PI * k) / 2, linear: (k: number) => k }

export const poseOf = (f: PoseFrame): Pose => ({ a: f.a, len: { ...LEN, ...f.len } })

export function totalMs(anim: PoseAnimation): number {
  return anim.frames.reduce((s, f) => s + (f.move ?? 0) + (f.hold ?? 0), 0)
}

export interface AnimState {
  pose: Pose
  frame: PoseFrame
  /** 0–1 while a ring hold runs, otherwise null. */
  ring: number | null
  count: number | null
}

export function stateAt(anim: PoseAnimation, ms: number): AnimState {
  const total = totalMs(anim)
  let tm = total > 0 ? ((ms % total) + total) % total : 0
  const n = anim.frames.length
  for (let i = 0; i < n; i++) {
    const f = anim.frames[i]!
    const prev = anim.frames[(i - 1 + n) % n]!
    const move = f.move ?? 0
    const hold = f.hold ?? 0
    if (tm < move) {
      const k = tm / move
      return {
        pose: mix(poseOf(prev), poseOf(f), EASE[f.ease ?? 'inout'](k)),
        frame: f,
        count: f.count ? Math.max(1, Math.ceil((1 - k) * f.count)) : null,
        ring: null
      }
    }
    tm -= move
    if (tm < hold) return { pose: poseOf(f), frame: f, count: null, ring: f.ring ? tm / hold : null }
    tm -= hold
  }
  const last = anim.frames[n - 1]!
  return { pose: poseOf(last), frame: last, count: null, ring: null }
}
