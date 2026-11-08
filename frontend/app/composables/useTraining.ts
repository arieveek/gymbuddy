import { buildWorkout, currentStep, estimateMinutes, isLightWeek, skippedForInjury, type WorkoutInput } from '~/utils/plan'
import { todayISO } from '~/utils/date'
import { levelDef } from '~/data/levels'
import type { BodyArea, Level } from '~/data/types'

/** Today's plan for the active athlete, derived from the store. */
export function useTraining() {
  const store = useTrainingStore()

  const level = computed<Level>(() => store.active?.level ?? 1)
  const def = computed(() => levelDef(level.value))
  const step = computed(() => currentStep(store.activeSessions, level.value))
  const lightWeek = computed(() => isLightWeek(store.activeSessions[0]?.date, todayISO()))
  const injuries = computed<BodyArea[]>(() => store.active?.injuries ?? [])
  /** Device-only settings (not synced). */
  const growthSpurt = computed(() => !!store.device.growthSpurt)
  const ageBand = computed(() => (store.active?.ageGroup === 'child' ? store.device.ageBand ?? null : null))
  const input = computed<WorkoutInput>(() => ({
    growthSpurt: growthSpurt.value,
    level: level.value,
    step: step.value,
    ageGroup: store.active?.ageGroup ?? 'child',
    testPullups: store.latestTest?.pullups ?? 0,
    lightWeek: lightWeek.value,
    injuries: injuries.value
  }))
  const workout = computed(() => buildWorkout(input.value))
  /** Exercises left out today because of an injury. */
  const skipped = computed(() => skippedForInjury(input.value))
  const minutes = computed(() => estimateMinutes(workout.value))
  const doneToday = computed(() => store.activeSessions.some(s => s.date === todayISO()))

  return { store, level, def, step, lightWeek, injuries, growthSpurt, ageBand, workout, skipped, minutes, doneToday }
}
