import type { Text } from '../types'

/*
 * Animated exercise drawings: a stick figure solved from joint angles.
 * Angles in degrees, SVG convention: 0 = right, 90 = down.
 * ua: shoulder→elbow, fa: elbow→hand, to: shoulder→hip, th: hip→knee, sh: knee→foot, hd: shoulder→head.
 *
 * Side view: the body faces +x when standing (the eye is drawn on the front of the head). Lying on the back
 * means head left; face down means head right. Only one arm and leg are drawn unless a frame gives the
 * far-side limbs (`l` or `pinL`); those are drawn slightly faded.
 * Front view: both arms and legs are drawn; the left side mirrors the right across the torso line unless
 * a frame gives `l` angles.
 *
 * The root joint is fixed (hands on a bar or the floor, hips or feet on the floor); a frame may move it (`at`)
 * for jumps and walks. IK pins (`pin`, `pinL`) keep a hand or foot on a fixed point (a rung, the floor).
 */

export type Vec = [number, number]
export type Angles = { ua: number, fa: number, to: number, th: number, sh: number, hd: number }
export type Lengths = Angles
export type LimbAngles = { ua: number, fa: number, th: number, sh: number }

export const LEN: Lengths = { ua: 13, fa: 12, to: 24, th: 16, sh: 15, hd: 9 }
export const HEAD_R = 6.5
export const VIEW: Vec = [120, 110]
/** Spacing between wall-bar rungs (about 15 cm at this scale). */
export const RUNG = 9.4

export interface Pins { hand?: Vec, foot?: Vec, bend?: 1 | -1 }

export interface Scene {
  /** Side view of wall bars: a rail with rung circles at this x. */
  wallbars?: number
  /** Front view of wall bars: two rails with rungs between them. */
  ladder?: [number, number]
  /** Side view of the dip bar: a handle from x0 to x1 at height y. */
  dipbar?: { x0: number, x1: number, y: number }
  /** Bench top from one point to another. */
  bench?: [Vec, Vec]
  /** A wall at this x. */
  wall?: number
  /** Bars seen end-on (e.g. the dip handles from the front). */
  posts?: Vec[]
}

export interface PoseFrame {
  a: Angles
  len?: Partial<Lengths>
  /** Far-side (left) arm and leg angles. Front view: overrides the mirror image. */
  l?: Partial<LimbAngles>
  /** Moves the root joint for this frame (jumps, walking up the bars). */
  at?: Vec
  /** IK pins for this frame (override the animation's `ik`). */
  pin?: Pins
  /** IK pin for the far-side limbs. */
  pinL?: Pins
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
  view?: 'side' | 'front'
  /** Floor line; false for drawings seen from above. */
  ground?: number | false
  /** Pull-up bar cross-section; defaults to the hands when hanging high without wall bars. */
  bar?: Vec
  box?: [number, number, number, number]
  scene?: Scene
  /** A weight held in the near hand (and the far hand too when `propBoth`). */
  prop?: 'dumbbell' | 'kettlebell'
  propBoth?: boolean
  ik?: { hand?: Vec, foot?: Vec, bend: 1 | -1 }
  frames: PoseFrame[]
}

export interface Joints {
  hand: Vec, elbow: Vec, shoulder: Vec, hip: Vec, knee: Vec, foot: Vec, head: Vec
  /** Unit vector shoulder→head. */
  neck: Vec
  /** Far-side limbs, when drawn. */
  left?: { elbow: Vec, hand: Vec, knee: Vec, foot: Vec }
}

export interface Pose {
  a: Angles
  len: Lengths
  la: LimbAngles
  at?: Vec
  pin?: Pins
  pinL?: Pins
}

const rad = (a: number) => a * Math.PI / 180
const dir = (a: number): Vec => [Math.cos(rad(a)), Math.sin(rad(a))]
const add = (p: Vec, v: Vec, k: number): Vec => [p[0] + v[0] * k, p[1] + v[1] * k]
const lerp = (x: number, y: number, k: number) => x + (y - x) * k
const lerpVec = (p: Vec, q: Vec, k: number): Vec => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]

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

/** Reflects a limb angle across the torso line (front view mirror image). */
const mirror = (angle: number, torso: number) => 2 * torso - angle

/** Whether the far-side limbs are drawn for this animation. */
export const hasLeftLimbs = (anim: PoseAnimation) => anim.view === 'front' || anim.frames.some(f => f.l || f.pinL)

export function poseOf(anim: PoseAnimation, f: PoseFrame): Pose {
  const a = f.a
  const base: LimbAngles = anim.view === 'front'
    ? { ua: mirror(a.ua, a.to), fa: mirror(a.fa, a.to), th: mirror(a.th, a.to), sh: mirror(a.sh, a.to) }
    : { ua: a.ua, fa: a.fa, th: a.th, sh: a.sh }
  return { a, len: { ...LEN, ...f.len }, la: { ...base, ...f.l }, at: f.at, pin: f.pin, pinL: f.pinL }
}

export function solve(anim: PoseAnimation, pose: Pose): Joints {
  const { a, len: L } = pose
  const at = pose.at ?? anim.at
  const pins: Pins = { bend: anim.ik?.bend ?? 1, hand: anim.ik?.hand, foot: anim.ik?.foot, ...pose.pin }
  let hand: Vec | undefined, elbow: Vec | undefined, knee: Vec | undefined, foot: Vec | undefined
  let shoulder: Vec, hip: Vec
  if (anim.root === 'hand') {
    hand = at
    elbow = add(hand, dir(a.fa), -L.fa)
    shoulder = add(elbow, dir(a.ua), -L.ua)
    hip = add(shoulder, dir(a.to), L.to)
  } else if (anim.root === 'hip') {
    hip = at
    shoulder = add(hip, dir(a.to), -L.to)
  } else {
    foot = at
    knee = add(foot, dir(a.sh), -L.sh)
    hip = add(knee, dir(a.th), -L.th)
    shoulder = add(hip, dir(a.to), -L.to)
  }
  if (!elbow || !hand) {
    if (pins.hand) [elbow, hand] = twoBone(shoulder, pins.hand, L.ua, L.fa, pins.bend ?? 1)
    else {
      elbow = add(shoulder, dir(a.ua), L.ua)
      hand = add(elbow, dir(a.fa), L.fa)
    }
  }
  if (!knee || !foot) {
    if (pins.foot) [knee, foot] = twoBone(hip, pins.foot, L.th, L.sh, pins.bend ?? 1)
    else {
      knee = add(hip, dir(a.th), L.th)
      foot = add(knee, dir(a.sh), L.sh)
    }
  }
  const joints: Joints = { hand, elbow, shoulder, hip, knee, foot, head: add(shoulder, dir(a.hd), L.hd), neck: dir(a.hd) }

  if (hasLeftLimbs(anim)) {
    const la = pose.la
    const pl = pose.pinL
    let lelbow: Vec, lhand: Vec, lknee: Vec, lfoot: Vec
    if (pl?.hand) [lelbow, lhand] = twoBone(shoulder, pl.hand, L.ua, L.fa, pl.bend ?? 1)
    else {
      lelbow = add(shoulder, dir(la.ua), L.ua)
      lhand = add(lelbow, dir(la.fa), L.fa)
    }
    if (pl?.foot) [lknee, lfoot] = twoBone(hip, pl.foot, L.th, L.sh, pl.bend ?? 1)
    else {
      lknee = add(hip, dir(la.th), L.th)
      lfoot = add(lknee, dir(la.sh), L.sh)
    }
    joints.left = { elbow: lelbow, hand: lhand, knee: lknee, foot: lfoot }
  }
  return joints
}

const lerpAng = (x: number, y: number, k: number) => x + ((((y - x) % 360) + 540) % 360 - 180) * k
const KEYS = ['ua', 'fa', 'to', 'th', 'sh', 'hd'] as const
const LIMB_KEYS = ['ua', 'fa', 'th', 'sh'] as const

function mixPins(p: Pins | undefined, q: Pins | undefined, k: number): Pins | undefined {
  if (!p || !q) return k < 0.5 ? p : q
  return {
    bend: q.bend ?? p.bend,
    hand: p.hand && q.hand ? lerpVec(p.hand, q.hand, k) : (k < 0.5 ? p.hand : q.hand),
    foot: p.foot && q.foot ? lerpVec(p.foot, q.foot, k) : (k < 0.5 ? p.foot : q.foot)
  }
}

export function mix(p: Pose, q: Pose, k: number): Pose {
  const a = { ...p.a }
  const len = { ...p.len }
  const la = { ...p.la }
  for (const key of KEYS) {
    a[key] = lerpAng(p.a[key], q.a[key], k)
    len[key] = lerp(p.len[key], q.len[key], k)
  }
  for (const key of LIMB_KEYS) la[key] = lerpAng(p.la[key], q.la[key], k)
  const at = p.at && q.at ? lerpVec(p.at, q.at, k) : (k < 0.5 ? p.at : q.at)
  return { a, len, la, at, pin: mixPins(p.pin, q.pin, k), pinL: mixPins(p.pinL, q.pinL, k) }
}

const EASE = { inout: (k: number) => 0.5 - Math.cos(Math.PI * k) / 2, linear: (k: number) => k }

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
        pose: mix(poseOf(anim, prev), poseOf(anim, f), EASE[f.ease ?? 'inout'](k)),
        frame: f,
        count: f.count ? Math.max(1, Math.ceil((1 - k) * f.count)) : null,
        ring: null
      }
    }
    tm -= move
    if (tm < hold) return { pose: poseOf(anim, f), frame: f, count: null, ring: f.ring ? tm / hold : null }
    tm -= hold
  }
  const last = anim.frames[n - 1]!
  return { pose: poseOf(anim, last), frame: last, count: null, ring: null }
}

/** The pull-up bar to draw: explicit, or the hands when hanging high and no wall bars are drawn. */
export function barOf(anim: PoseAnimation): Vec | undefined {
  if (anim.bar) return anim.bar
  if (anim.root === 'hand' && anim.at[1] < 50 && !anim.scene?.wallbars) return anim.at
  return undefined
}

/** y of rung k (1 = lowest) above a floor at `ground`. */
export const rungY = (k: number, ground: number) => ground - k * RUNG
