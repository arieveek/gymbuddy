import { describe, expect, it } from 'vitest'
import { POSES, poseOf, solve, stateAt, totalMs, twoBone, type Vec } from '../app/data/poses'
import { EXERCISES } from '../app/data/exercises'

const dist = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1])
const finite = (v: Vec) => Number.isFinite(v[0]) && Number.isFinite(v[1])

describe('poses', () => {
  it('has an animation for every exercise', () => {
    for (const id of Object.keys(EXERCISES)) expect(POSES[id as keyof typeof POSES], id).toBeDefined()
  })

  it('keeps every limb at its length and the root where it belongs, through every animation', () => {
    for (const [id, anim] of Object.entries(POSES)) {
      const total = Math.max(1, totalMs(anim))
      for (let ms = 0; ms < total; ms += 97) {
        const { pose } = stateAt(anim, ms)
        const j = solve(anim, pose)
        for (const v of [j.hand, j.elbow, j.shoulder, j.hip, j.knee, j.foot, j.head]) expect(finite(v), id).toBe(true)
        expect(dist(j.elbow, j.hand), id).toBeCloseTo(pose.len.fa, 1)
        expect(dist(j.shoulder, j.elbow), id).toBeCloseTo(pose.len.ua, 1)
        expect(dist(j.hip, j.knee), id).toBeCloseTo(pose.len.th, 1)
        expect(dist(j.knee, j.foot), id).toBeCloseTo(pose.len.sh, 1)
        const root = pose.at ?? anim.at
        const rootJoint = anim.root === 'hand' ? j.hand : anim.root === 'hip' ? j.hip : j.foot
        expect(dist(rootJoint, root), id).toBeLessThan(0.01)
        if (anim.ik?.hand && !pose.pin) {
          const reach = pose.len.ua + pose.len.fa
          if (dist(j.shoulder, anim.ik.hand) <= reach) expect(dist(j.hand, anim.ik.hand), id).toBeLessThan(0.5)
        }
      }
    }
  })

  it('mirrors the far side in the front view', () => {
    for (const [id, anim] of Object.entries(POSES)) {
      if (anim.view !== 'front') continue
      for (const f of anim.frames) {
        if (f.l) continue
        const j = solve(anim, poseOf(anim, f))
        // Reflecting the right foot across the torso line gives the left foot.
        const [ax, ay] = j.shoulder
        const [bx, by] = j.hip
        const dx = bx - ax
        const dy = by - ay
        const len2 = dx * dx + dy * dy
        const k = ((j.foot[0] - ax) * dx + (j.foot[1] - ay) * dy) / len2
        const proj: Vec = [ax + k * dx, ay + k * dy]
        const mirrored: Vec = [2 * proj[0] - j.foot[0], 2 * proj[1] - j.foot[1]]
        expect(dist(mirrored, j.left!.foot), id).toBeLessThan(0.01)
      }
    }
  })

  it('counts down during slow lowers', () => {
    const anim = POSES.neg
    const start = (anim.frames[0]!.move ?? 0) + (anim.frames[0]!.hold ?? 0)
    expect(stateAt(anim, start + 10).count).toBe(5)
    expect(stateAt(anim, start + 4990).count).toBe(1)
  })

  it('reaches the target when in range', () => {
    const [, end] = twoBone([0, 0], [20, 0], 13, 12, 1)
    expect(end[0]).toBeCloseTo(20, 3)
    expect(end[1]).toBeCloseTo(0, 3)
  })
})
