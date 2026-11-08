import { EXERCISES } from '../data/exercises'
import { levelDef, MAX_STEPS, WORKOUTS_PER_STEP, type PlanContext } from '../data/levels'
import type { AgeGroup, ExerciseId, Level, Session } from '../data/types'
import { weeksBetween } from './date'

export interface WorkoutStep {
  ex: ExerciseId
  sets: number
  /** Reps, or seconds for a hold; 0 for the warm-up list. */
  value: number
}

/** Light week: every 6th week counted from the athlete's first workout. */
export const LIGHT_WEEK_EVERY = 6

/**
 * Step within the current level: workouts done at this level since he last arrived at it,
 * one step per WORKOUTS_PER_STEP workouts, capped at MAX_STEPS. Resets when the level changes.
 */
export function currentStep(sessions: Session[], level: Level): number {
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
  let n = 0
  for (let i = sorted.length - 1; i >= 0 && sorted[i]!.level === level; i--) n++
  return Math.min(MAX_STEPS, Math.floor(n / WORKOUTS_PER_STEP) + 1)
}

export function isLightWeek(firstSessionDate: string | undefined, today: string): boolean {
  if (!firstSessionDate) return false
  const week = weeksBetween(firstSessionDate, today)
  return week > 0 && week % LIGHT_WEEK_EVERY === LIGHT_WEEK_EVERY - 1
}

export interface WorkoutInput {
  level: Level
  step: number
  ageGroup: AgeGroup
  testPullups: number
  lightWeek: boolean
}

const resolve = (dose: number | ((c: PlanContext) => number), c: PlanContext) => typeof dose === 'function' ? dose(c) : dose

/** Today's workout: the warm-up, then the level's exercises with their dose for this step. */
export function buildWorkout(input: WorkoutInput): WorkoutStep[] {
  const ctx: PlanContext = { step: input.step, ageGroup: input.ageGroup, testPullups: input.testPullups }
  const extra = Math.max(0, input.step - 1)
  const steps: WorkoutStep[] = [{ ex: 'warmup', sets: 1, value: 0 }]
  for (const item of levelDef(input.level).plan) {
    if (item.when && !item.when(ctx)) continue
    if (EXERCISES[item.ex].adultOnly && input.ageGroup !== 'adult') continue
    let sets = resolve(item.sets, ctx) + Math.floor(extra * (item.setInc ?? 0))
    const value = Math.floor(resolve(item.value, ctx) + extra * (item.inc ?? 0))
    if (input.lightWeek) sets = Math.max(1, sets - 1)
    steps.push({ ex: item.ex, sets, value })
  }
  return steps
}

/** Rough length in minutes: work time, plus 60 s rest between sets, plus the warm-up. */
export function estimateMinutes(steps: WorkoutStep[]): number {
  let seconds = 0
  for (const s of steps) {
    const ex = EXERCISES[s.ex]
    if (ex.type === 'list') seconds += 120
    else seconds += s.sets * ((ex.type === 'hold' ? s.value : s.value * 4) + 60)
  }
  return Math.max(5, Math.round(seconds / 60))
}
