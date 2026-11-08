import { defineStore } from 'pinia'
import type { AgeGroup, Athlete, Level, Locale, Session, TestResult } from '~/data/types'
import { todayISO } from '~/utils/date'
import { levelFromTest } from '~/utils/progress'

const byDate = <T extends { date: string, createdAt: string }>(a: T, b: T) =>
  a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt)

/** Athletes, workouts and tests, kept on the device so the app works offline at the gym. */
export const useTrainingStore = defineStore('training', () => {
  const athletes = ref<Athlete[]>([])
  const activeId = ref<string | null>(null)
  const sessions = ref<Session[]>([])
  const tests = ref<TestResult[]>([])

  const active = computed(() => athletes.value.find(a => a.id === activeId.value) ?? athletes.value[0] ?? null)
  const activeSessions = computed(() => sessions.value.filter(s => s.athleteId === active.value?.id).sort(byDate))
  const activeTests = computed(() => tests.value.filter(t => t.athleteId === active.value?.id).sort(byDate))
  const latestTest = computed(() => activeTests.value.at(-1) ?? null)

  function createAthlete(input: { name: string, ageGroup: AgeGroup, language: Locale }): Athlete {
    const athlete: Athlete = {
      id: crypto.randomUUID(),
      name: input.name.trim().slice(0, 30),
      ageGroup: input.ageGroup,
      language: input.language,
      level: 1,
      updatedAt: new Date().toISOString()
    }
    athletes.value.push(athlete)
    activeId.value = athlete.id
    return athlete
  }

  function updateAthlete(patch: Partial<Pick<Athlete, 'name' | 'ageGroup' | 'level' | 'language'>>) {
    const a = active.value
    if (!a) return
    Object.assign(a, patch, { updatedAt: new Date().toISOString() })
    if (patch.name !== undefined) a.name = patch.name.trim().slice(0, 30)
  }

  function setActive(id: string) {
    if (athletes.value.some(a => a.id === id)) activeId.value = id
  }

  function addSession(input: Pick<Session, 'level' | 'step' | 'lightWeek' | 'repsTotal' | 'holdSecondsTotal'>): Session | null {
    const a = active.value
    if (!a) return null
    const session: Session = { id: crypto.randomUUID(), athleteId: a.id, date: todayISO(), createdAt: new Date().toISOString(), ...input }
    sessions.value.push(session)
    return session
  }

  /** Records a test and moves the athlete to the level it gives. Returns the old and new level. */
  function addTest(pullups: number, hangSeconds: number): { result: TestResult, from: Level, to: Level } | null {
    const a = active.value
    if (!a) return null
    const result: TestResult = { id: crypto.randomUUID(), athleteId: a.id, date: todayISO(), pullups, hangSeconds, createdAt: new Date().toISOString() }
    tests.value.push(result)
    const from = a.level
    const to = levelFromTest(pullups, hangSeconds)
    if (to !== from) updateAthlete({ level: to })
    return { result, from, to }
  }

  return { athletes, activeId, sessions, tests, active, activeSessions, activeTests, latestTest, createAthlete, updateAthlete, setActive, addSession, addTest }
}, {
  persist: { pick: ['athletes', 'activeId', 'sessions', 'tests'] }
})
