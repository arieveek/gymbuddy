import { buildWorkout, currentStep, estimateMinutes, isLightWeek } from '~/utils/plan'
import { todayISO } from '~/utils/date'
import { levelDef } from '~/data/levels'
import type { Level } from '~/data/types'

/** Today's plan for the active athlete, derived from the store. */
export function useTraining() {
  const store = useTrainingStore()

  const level = computed<Level>(() => store.active?.level ?? 1)
  const def = computed(() => levelDef(level.value))
  const step = computed(() => currentStep(store.activeSessions, level.value))
  const lightWeek = computed(() => isLightWeek(store.activeSessions[0]?.date, todayISO()))
  const workout = computed(() => buildWorkout({
    level: level.value,
    step: step.value,
    ageGroup: store.active?.ageGroup ?? 'child',
    testPullups: store.latestTest?.pullups ?? 0,
    lightWeek: lightWeek.value
  }))
  const minutes = computed(() => estimateMinutes(workout.value))
  const doneToday = computed(() => store.activeSessions.some(s => s.date === todayISO()))

  return { store, level, def, step, lightWeek, workout, minutes, doneToday }
}
