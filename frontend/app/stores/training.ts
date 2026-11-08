import { defineStore } from 'pinia'
import type { AgeGroup, Athlete, Level, Locale, Session, TestResult } from '~/data/types'
import { todayISO } from '~/utils/date'
import { levelFromTest } from '~/utils/progress'
import { enqueue, mergeAthletes, mergeById, type OutboxOp } from '~/utils/sync'

const byDate = <T extends { date: string, createdAt: string }>(a: T, b: T) =>
  a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt)

/**
 * Athletes, workouts and tests, kept on the device so the app works offline at the gym.
 * Every change is also queued in the outbox, which the sync uploads once signed in and online.
 */
export const useTrainingStore = defineStore('training', () => {
  const athletes = ref<Athlete[]>([])
  const activeId = ref<string | null>(null)
  const sessions = ref<Session[]>([])
  const tests = ref<TestResult[]>([])
  const outbox = ref<OutboxOp[]>([])
  const lastSyncAt = ref<string | null>(null)
  /** Email of the account this data belongs to, so the next person logging in on a shared device never sees it. */
  const owner = ref<string | null>(null)

  const active = computed(() => athletes.value.find(a => a.id === activeId.value) ?? athletes.value[0] ?? null)
  const activeSessions = computed(() => sessions.value.filter(s => s.athleteId === active.value?.id).sort(byDate))
  const activeTests = computed(() => tests.value.filter(t => t.athleteId === active.value?.id).sort(byDate))
  const latestTest = computed(() => activeTests.value.at(-1) ?? null)

  const queue = (op: OutboxOp) => { outbox.value = enqueue(outbox.value, op) }

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
    queue({ kind: 'athlete', id: athlete.id })
    return athlete
  }

  function updateAthlete(patch: Partial<Pick<Athlete, 'name' | 'ageGroup' | 'level' | 'language'>>) {
    const a = active.value
    if (!a) return
    Object.assign(a, patch, { updatedAt: new Date().toISOString() })
    if (patch.name !== undefined) a.name = patch.name.trim().slice(0, 30)
    queue({ kind: 'athlete', id: a.id })
  }

  function setActive(id: string) {
    if (athletes.value.some(a => a.id === id)) activeId.value = id
  }

  function addSession(input: Pick<Session, 'level' | 'step' | 'lightWeek' | 'repsTotal' | 'holdSecondsTotal'>): Session | null {
    const a = active.value
    if (!a) return null
    const session: Session = { id: crypto.randomUUID(), athleteId: a.id, date: todayISO(), createdAt: new Date().toISOString(), ...input }
    sessions.value.push(session)
    queue({ kind: 'session', id: session.id })
    return session
  }

  /** Records a test and moves the athlete to the level it gives. Returns the old and new level. */
  function addTest(pullups: number, hangSeconds: number): { result: TestResult, from: Level, to: Level } | null {
    const a = active.value
    if (!a) return null
    const result: TestResult = { id: crypto.randomUUID(), athleteId: a.id, date: todayISO(), pullups, hangSeconds, createdAt: new Date().toISOString() }
    tests.value.push(result)
    queue({ kind: 'test', id: result.id })
    const from = a.level
    const to = levelFromTest(pullups, hangSeconds)
    if (to !== from) updateAthlete({ level: to })
    return { result, from, to }
  }

  /** Queues everything on this device, for the first sync after signing in. */
  function queueAll() {
    athletes.value.forEach(a => queue({ kind: 'athlete', id: a.id }))
    sessions.value.forEach(s => queue({ kind: 'session', id: s.id }))
    tests.value.forEach(t => queue({ kind: 'test', id: t.id }))
  }

  function dequeue(op: OutboxOp) {
    outbox.value = outbox.value.filter(o => !(o.kind === op.kind && o.id === op.id))
  }

  /** Empties this device's training data (logout, or a different account logging in). */
  function reset() {
    athletes.value = []
    activeId.value = null
    sessions.value = []
    tests.value = []
    outbox.value = []
    lastSyncAt.value = null
    owner.value = null
  }

  /** Called after login: keeps the data if it is this account's, otherwise starts clean. */
  function claimFor(email: string) {
    if (owner.value !== email) reset()
    owner.value = email
  }

  /** Merges what the server has into this device. */
  function applyRemote(remote: { athletes: Athlete[], sessions: Session[], tests: TestResult[] }) {
    athletes.value = mergeAthletes(athletes.value, remote.athletes)
    sessions.value = mergeById(sessions.value, remote.sessions)
    tests.value = mergeById(tests.value, remote.tests)
    if (!activeId.value || !athletes.value.some(a => a.id === activeId.value)) activeId.value = athletes.value[0]?.id ?? null
    lastSyncAt.value = new Date().toISOString()
  }

  return {
    athletes, activeId, sessions, tests, outbox, lastSyncAt, owner,
    active, activeSessions, activeTests, latestTest,
    createAthlete, updateAthlete, setActive, addSession, addTest, queueAll, dequeue, applyRemote, reset, claimFor
  }
}, {
  persist: { pick: ['athletes', 'activeId', 'sessions', 'tests', 'outbox', 'lastSyncAt', 'owner'] }
})
