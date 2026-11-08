import { describe, expect, it } from 'vitest'
import { LEN, POSES, solve, stateAt, totalMs, twoBone, type Vec } from '../app/data/poses'
import { EXERCISES } from '../app/data/exercises'

const dist = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1])

describe('poses', () => {
  it('has an animation for every exercise', () => {
    for (const id of Object.keys(EXERCISES)) expect(POSES[id as keyof typeof POSES]).toBeDefined()
  })

  it('keeps hands on the bar and limb lengths constant through every animation', () => {
    for (const [id, anim] of Object.entries(POSES)) {
      const total = totalMs(anim)
      for (let ms = 0; ms < total; ms += 97) {
        const st = stateAt(anim, ms)
        const j = solve(anim, st.pose)
        expect(dist(j.elbow, j.hand), id).toBeCloseTo(LEN.fa, 1)
        expect(dist(j.hip, j.knee), id).toBeCloseTo(LEN.th, 1)
        if (anim.root === 'hand') expect(j.hand, id).toEqual(anim.at)
        if (anim.ik?.hand) expect(dist(j.hand, anim.ik.hand), id).toBeLessThan(2)
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
