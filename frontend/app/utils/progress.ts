import { ENTRY } from '../data/levels'
import { MILESTONES, type MilestoneSeries } from '../data/milestones'
import type { Level, Session, TestResult } from '../data/types'
import { addDays, daysBetween, weekStart } from './date'

/** Level from a test (rule from the prototype): ≥8 → 5, ≥4 → 4, ≥1 → 3, hold ≥5 s → 2, else 1. */
export function levelFromTest(pullups: number, hangSeconds: number): Level {
  if (pullups >= ENTRY[5].pullups) return 5
  if (pullups >= ENTRY[4].pullups) return 4
  if (pullups >= ENTRY[3].pullups) return 3
  if (hangSeconds >= ENTRY[2].hangSeconds) return 2
  return 1
}

/** A week counts towards the streak when it has this many workouts. */
export const WEEKLY_TARGET = 3

function countsByWeek(sessions: Session[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const s of sessions) {
    const w = weekStart(s.date)
    m.set(w, (m.get(w) ?? 0) + 1)
  }
  return m
}

export function sessionsInWeek(sessions: Session[], today: string): number {
  return countsByWeek(sessions).get(weekStart(today)) ?? 0
}

/**
 * Current streak of weeks with WEEKLY_TARGET workouts. The running week only counts once it is
 * complete, so a streak is not broken on Monday morning.
 */
export function weeklyStreak(sessions: Session[], today: string): number {
  const counts = countsByWeek(sessions)
  let week = weekStart(today)
  let streak = (counts.get(week) ?? 0) >= WEEKLY_TARGET ? 1 : 0
  week = addDays(week, -7)
  while ((counts.get(week) ?? 0) >= WEEKLY_TARGET) {
    streak++
    week = addDays(week, -7)
  }
  return streak
}

export function longestStreak(sessions: Session[]): number {
  const counts = countsByWeek(sessions)
  const weeks = [...counts.keys()].filter(w => counts.get(w)! >= WEEKLY_TARGET).sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const w of weeks) {
    run = prev && daysBetween(prev, w) === 7 ? run + 1 : 1
    best = Math.max(best, run)
    prev = w
  }
  return best
}

/** Workouts per week for the last n weeks, oldest first, ending with the current week. */
export function lastWeeks(sessions: Session[], today: string, n = 12): { week: string, count: number }[] {
  const counts = countsByWeek(sessions)
  const current = weekStart(today)
  return Array.from({ length: n }, (_, i) => {
    const week = addDays(current, -7 * (n - 1 - i))
    return { week, count: counts.get(week) ?? 0 }
  })
}

export function personalBests(tests: TestResult[]): { pullups: number, hangSeconds: number } {
  return {
    pullups: tests.reduce((m, t) => Math.max(m, t.pullups), 0),
    hangSeconds: tests.reduce((m, t) => Math.max(m, t.hangSeconds), 0)
  }
}

export interface Goal {
  kind: 'pullups' | 'hang'
  target: number
  current: number
}

/** There is always a next goal: the next level's entry target, or at level 5 a new personal best. */
export function nextGoals(level: Level, tests: TestResult[]): Goal[] {
  const best = personalBests(tests)
  switch (level) {
    case 1: return [{ kind: 'hang', target: ENTRY[2].hangSeconds, current: best.hangSeconds }]
    case 2: return [{ kind: 'pullups', target: ENTRY[3].pullups, current: best.pullups }]
    case 3: return [{ kind: 'pullups', target: ENTRY[4].pullups, current: best.pullups }]
    case 4: return [{ kind: 'pullups', target: ENTRY[5].pullups, current: best.pullups }]
    default: return [
      { kind: 'pullups', target: best.pullups + 1, current: best.pullups },
      { kind: 'hang', target: best.hangSeconds + 5, current: best.hangSeconds }
    ]
  }
}

/** The milestone thresholds of a series, generated without end. */
export function* thresholds(series: MilestoneSeries): Generator<number> {
  yield* series.start
  let v = series.start[series.start.length - 1]!
  for (;;) {
    v += series.every
    yield v
  }
}

export interface MilestoneStatus {
  kind: MilestoneSeries['kind']
  value: number
  earned: number[]
  next: number
}

export function milestoneStatus(sessions: Session[], tests: TestResult[]): MilestoneStatus[] {
  const values = {
    pullups: personalBests(tests).pullups,
    workouts: sessions.length,
    streak: longestStreak(sessions)
  }
  return MILESTONES.map((series) => {
    const value = values[series.kind]
    const earned: number[] = []
    let next = 0
    for (const th of thresholds(series)) {
      if (th <= value) earned.push(th)
      else {
        next = th
        break
      }
    }
    return { kind: series.kind, value, earned, next }
  })
}

export type Nudge = 'first' | 'break' | 'due' | null

/** When Today should suggest a test: none yet, back after 14+ days off, or 6 workouts and 12+ days since the last test. */
export function retestNudge(sessions: Session[], tests: TestResult[], level: Level, today: string): Nudge {
  if (tests.length === 0) return 'first'
  const lastTest = [...tests].sort((a, b) => a.date.localeCompare(b.date)).at(-1)!
  const lastSession = [...sessions].sort((a, b) => a.date.localeCompare(b.date)).at(-1)
  if (lastSession && daysBetween(lastSession.date, today) >= 14 && daysBetween(lastTest.date, today) >= 14) return 'break'
  const sinceTest = sessions.filter(s => s.level === level && s.date >= lastTest.date).length
  if (sinceTest >= 6 && daysBetween(lastTest.date, today) >= 12) return 'due'
  return null
}
