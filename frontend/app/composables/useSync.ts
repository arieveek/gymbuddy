import type { Athlete } from '~/data/types'
import { errorCode } from '~/stores/auth'
import { ordered, sessionFromWire, sessionToWire, testFromWire, testToWire, type SessionWire, type TestWire } from '~/utils/sync'

const syncing = ref(false)
const lastError = ref<string | null>(null)
let running: Promise<void> | null = null

/**
 * Uploads the outbox, then pulls what the server has. Safe to call often: calls overlap into one run,
 * and the server stores a record once however often it is sent.
 */
export function useSync() {
  const store = useTrainingStore()
  const auth = useAuthStore()
  const { $api } = useNuxtApp()

  async function push() {
    for (const op of ordered(store.outbox)) {
      try {
        if (op.kind === 'athlete') {
          const a = store.athletes.find(x => x.id === op.id)
          if (a) await $api(`/athletes`, { method: 'POST', body: a })
        }
        else if (op.kind === 'session') {
          const s = store.sessions.find(x => x.id === op.id)
          if (s) await $api(`/athletes/${s.athleteId}/sessions`, { method: 'POST', body: sessionToWire(s) })
        }
        else {
          const t = store.tests.find(x => x.id === op.id)
          if (t) await $api(`/athletes/${t.athleteId}/tests`, { method: 'POST', body: testToWire(t) })
        }
        store.dequeue(op)
      }
      catch (e) {
        const code = errorCode(e)
        // Offline or signed out: keep the queue for later. A record the server refuses would block the queue forever, so drop it.
        if (code === 'NETWORK' || code === 'UNAUTHORIZED' || code === 'UNKNOWN') throw e
        console.warn('Dropping record the server refused', op, code)
        store.dequeue(op)
      }
    }
  }

  async function pull() {
    const athletes = await $api<Athlete[]>('/athletes')
    const sessions = await Promise.all(athletes.map(async a =>
      (await $api<SessionWire[]>(`/athletes/${a.id}/sessions`)).map(s => sessionFromWire(a.id, s))))
    const tests = await Promise.all(athletes.map(async a =>
      (await $api<TestWire[]>(`/athletes/${a.id}/tests`)).map(t => testFromWire(a.id, t))))
    store.applyRemote({ athletes, sessions: sessions.flat(), tests: tests.flat() })
  }

  function sync(): Promise<void> {
    if (!auth.signedIn || (typeof navigator !== 'undefined' && navigator.onLine === false)) return Promise.resolve()
    running ??= (async () => {
      syncing.value = true
      try {
        await push()
        await pull()
        lastError.value = null
      }
      catch (e) {
        lastError.value = errorCode(e)
      }
      finally {
        syncing.value = false
        running = null
      }
    })()
    return running
  }

  return { sync, syncing, lastError }
}
