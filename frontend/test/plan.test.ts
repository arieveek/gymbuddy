import { describe, expect, it } from 'vitest'
import { buildWorkout, currentStep, isLightWeek } from '../app/utils/plan'
import type { Level, Session } from '../app/data/types'

let seq = 0
function session(date: string, level: Level): Session {
  seq++
  return { id: `s${seq}`, athleteId: 'a', date, level, step: 1, lightWeek: false, repsTotal: 0, holdSecondsTotal: 0, createdAt: `${date}T10:00:${String(seq % 60).padStart(2, '0')}Z` }
}

describe('currentStep', () => {
  it('starts at step 1 with no workouts at the level', () => {
    expect(currentStep([], 1)).toBe(1)
    expect(currentStep([session('2026-11-02', 1)], 2)).toBe(1)
  })

  it('moves up one step per 3 workouts and caps at 4', () => {
    const s = ['02', '04', '06', '09', '11', '13'].map(d => session(`2026-11-${d}`, 2))
    expect(currentStep(s.slice(0, 2), 2)).toBe(1)
    expect(currentStep(s.slice(0, 3), 2)).toBe(2)
    expect(currentStep(s, 2)).toBe(3)
    const many = Array.from({ length: 20 }, (_, i) => session(`2026-10-${String(i + 1).padStart(2, '0')}`, 2))
    expect(currentStep(many, 2)).toBe(4)
  })

  it('resets when the level changes', () => {
    const s = [
      ...['01', '02', '03', '04', '05', '06'].map(d => session(`2026-10-${d}`, 2)),
      session('2026-10-08', 3)
    ]
    expect(currentStep(s, 3)).toBe(1)
  })
})

describe('isLightWeek', () => {
  it('is every 6th week from the first workout', () => {
    const first = '2026-01-05' // a Monday
    expect(isLightWeek(undefined, '2026-03-01')).toBe(false)
    expect(isLightWeek(first, '2026-01-07')).toBe(false) // week 0
    expect(isLightWeek(first, '2026-02-09')).toBe(true) // week 5
    expect(isLightWeek(first, '2026-02-16')).toBe(false) // week 6
    expect(isLightWeek(first, '2026-03-16')).toBe(false) // week 10
    expect(isLightWeek(first, '2026-03-23')).toBe(true) // week 11
  })
})

describe('buildWorkout', () => {
  const base = { ageGroup: 'child' as const, testPullups: 0, lightWeek: false }

  it('starts with the warm-up', () => {
    const w = buildWorkout({ ...base, level: 1, step: 1 })
    expect(w[0]).toEqual({ ex: 'warmup', sets: 1, value: 0 })
    expect(w.map(s => s.ex)).toEqual(['warmup', 'hang', 'scap', 'row', 'hollow'])
  })

  it('raises the dose with each step', () => {
    const s1 = buildWorkout({ ...base, level: 1, step: 1 }).find(s => s.ex === 'hang')!
    const s3 = buildWorkout({ ...base, level: 1, step: 3 }).find(s => s.ex === 'hang')!
    expect(s1.value).toBe(20)
    expect(s3.value).toBe(30)
  })

  it('drops a set in a light week, never below 1', () => {
    const normal = buildWorkout({ ...base, level: 1, step: 1 })
    const light = buildWorkout({ ...base, level: 1, step: 1, lightWeek: true })
    normal.forEach((s, i) => expect(light[i]!.sets).toBe(Math.max(1, s.sets - 1)))
  })

  it('scales level 5 from the latest test without a ceiling', () => {
    const at10 = buildWorkout({ ...base, level: 5, step: 1, testPullups: 10 }).find(s => s.ex === 'pullup')!
    const at20 = buildWorkout({ ...base, level: 5, step: 1, testPullups: 20 }).find(s => s.ex === 'pullup')!
    const at40 = buildWorkout({ ...base, level: 5, step: 1, testPullups: 40 }).find(s => s.ex === 'pullup')!
    expect(at10.value).toBe(6)
    expect(at20.value).toBe(12)
    expect(at40.value).toBe(24)
  })

  it('offers weighted pull-ups only to adults with 12+ reps', () => {
    const has = (ageGroup: 'child' | 'adult', testPullups: number) =>
      buildWorkout({ ...base, ageGroup, level: 5, step: 1, testPullups }).some(s => s.ex === 'weighted')
    expect(has('adult', 12)).toBe(true)
    expect(has('adult', 11)).toBe(false)
    expect(has('child', 20)).toBe(false)
  })
})
