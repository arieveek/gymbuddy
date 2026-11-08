import { describe, expect, it } from 'vitest'
import {
  lastWeeks, levelFromTest, longestStreak, milestoneStatus, nextGoals, retestNudge, thresholds, weeklyStreak
} from '../app/utils/progress'
import type { Level, Session, TestResult } from '../app/data/types'

let seq = 0
const session = (date: string, level: Level = 1): Session => ({
  id: `s${++seq}`, athleteId: 'a', date, level, step: 1, lightWeek: false, repsTotal: 0, holdSecondsTotal: 0, createdAt: `${date}T10:00:00Z`
})
const test = (date: string, pullups: number, hangSeconds = 0): TestResult => ({
  id: `t${++seq}`, athleteId: 'a', date, pullups, hangSeconds, createdAt: `${date}T10:00:00Z`
})
/** Three workouts in the week starting on the given Monday. */
const fullWeek = (monday: string) => {
  const [y, m, d] = monday.split('-').map(Number)
  return [0, 2, 4].map(off => session(new Date(Date.UTC(y!, m! - 1, d! + off)).toISOString().slice(0, 10)))
}

describe('levelFromTest', () => {
  it('follows the prototype rule', () => {
    expect(levelFromTest(0, 0)).toBe(1)
    expect(levelFromTest(0, 4)).toBe(1)
    expect(levelFromTest(0, 5)).toBe(2)
    expect(levelFromTest(1, 0)).toBe(3)
    expect(levelFromTest(4, 0)).toBe(4)
    expect(levelFromTest(8, 0)).toBe(5)
    expect(levelFromTest(30, 60)).toBe(5)
  })
})

describe('streaks', () => {
  const weeks = [...fullWeek('2026-10-12'), ...fullWeek('2026-10-19'), ...fullWeek('2026-10-26')]

  it('counts consecutive full weeks up to last week', () => {
    expect(weeklyStreak(weeks, '2026-11-02')).toBe(3) // Monday of the next week: not broken yet
    expect(weeklyStreak(weeks, '2026-11-09')).toBe(0) // a whole week missed
  })

  it('counts the running week once it is full', () => {
    expect(weeklyStreak([...weeks, ...fullWeek('2026-11-02')], '2026-11-06')).toBe(4)
  })

  it('finds the longest streak', () => {
    const gap = [...weeks, ...fullWeek('2026-11-16')]
    expect(longestStreak(gap)).toBe(3)
  })

  it('lists the last 12 weeks oldest first', () => {
    const w = lastWeeks(weeks, '2026-11-04')
    expect(w).toHaveLength(12)
    expect(w.at(-1)).toEqual({ week: '2026-11-02', count: 0 })
    expect(w.at(-2)).toEqual({ week: '2026-10-26', count: 3 })
  })
})

describe('nextGoals', () => {
  it('aims at the next level entry for levels 1–4', () => {
    expect(nextGoals(1, [test('2026-11-01', 0, 2)])).toEqual([{ kind: 'hang', target: 5, current: 2 }])
    expect(nextGoals(3, [test('2026-11-01', 2)])).toEqual([{ kind: 'pullups', target: 4, current: 2 }])
  })

  it('always has a new personal best at level 5', () => {
    const goals = nextGoals(5, [test('2026-10-01', 14, 20), test('2026-11-01', 12, 25)])
    expect(goals).toEqual([
      { kind: 'pullups', target: 15, current: 14 },
      { kind: 'hang', target: 30, current: 25 }
    ])
  })
})

describe('milestones', () => {
  it('generate thresholds forever', () => {
    const it = thresholds({ kind: 'pullups', start: [1, 5, 10, 15, 20], every: 5 })
    const first = Array.from({ length: 8 }, () => it.next().value)
    expect(first).toEqual([1, 5, 10, 15, 20, 25, 30, 35])
  })

  it('report earned and next', () => {
    const sessions = Array.from({ length: 27 }, (_, i) => session(`2026-0${1 + Math.floor(i / 9)}-${String(1 + (i % 9) * 3).padStart(2, '0')}`))
    const status = milestoneStatus(sessions, [test('2026-11-01', 23)])
    expect(status.find(s => s.kind === 'pullups')).toMatchObject({ value: 23, earned: [1, 5, 10, 15, 20], next: 25 })
    expect(status.find(s => s.kind === 'workouts')).toMatchObject({ value: 27, earned: [10, 25], next: 50 })
  })
})

describe('retestNudge', () => {
  it('asks for a first test', () => {
    expect(retestNudge([], [], 1, '2026-11-01')).toBe('first')
  })

  it('is due after 6 workouts and 12 days', () => {
    const tests = [test('2026-09-30', 2)] // 12 days before 2026-10-12
    const six = ['02', '04', '06', '08', '10', '12'].map(d => session(`2026-10-${d}`, 3))
    expect(retestNudge(six.slice(0, 5), tests, 3, '2026-10-14')).toBeNull()
    expect(retestNudge(six, tests, 3, '2026-10-12')).toBe('due')
    expect(retestNudge(six, tests, 3, '2026-10-10')).toBeNull()
  })

  it('suggests a retest after a break', () => {
    expect(retestNudge([session('2026-10-01', 3)], [test('2026-09-25', 2)], 3, '2026-10-20')).toBe('break')
  })
})
