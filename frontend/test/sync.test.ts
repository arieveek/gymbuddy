import { describe, expect, it } from 'vitest'
import { enqueue, mergeAthletes, mergeById, ordered, sessionFromWire, sessionToWire, type OutboxOp } from '../app/utils/sync'
import type { Athlete, Session } from '../app/data/types'

const athlete = (id: string, updatedAt: string, level: Athlete['level'] = 1): Athlete =>
  ({ id, name: 'Daan', ageGroup: 'child', level, language: 'nl', updatedAt })

describe('outbox', () => {
  it('queues each record once', () => {
    let box: OutboxOp[] = []
    box = enqueue(box, { kind: 'session', id: 's1' })
    box = enqueue(box, { kind: 'session', id: 's1' })
    box = enqueue(box, { kind: 'athlete', id: 's1' })
    expect(box).toEqual([{ kind: 'session', id: 's1' }, { kind: 'athlete', id: 's1' }])
  })

  it('uploads profiles before workouts and tests', () => {
    const box: OutboxOp[] = [{ kind: 'test', id: 't' }, { kind: 'session', id: 's' }, { kind: 'athlete', id: 'a' }]
    expect(ordered(box).map(o => o.kind)).toEqual(['athlete', 'session', 'test'])
  })
})

describe('merge', () => {
  it('adds unknown profiles and keeps the newer copy of known ones', () => {
    const local = [athlete('a', '2026-11-05T10:00:00Z', 3), athlete('b', '2026-11-01T10:00:00Z', 1)]
    const remote = [athlete('a', '2026-11-04T10:00:00Z', 2), athlete('b', '2026-11-02T10:00:00Z', 2), athlete('c', '2026-11-01T10:00:00Z')]
    const merged = mergeAthletes(local, remote)
    expect(merged.map(a => [a.id, a.level])).toEqual([['a', 3], ['b', 2], ['c', 1]])
  })

  it('adds records by id without duplicates', () => {
    expect(mergeById([{ id: '1' }, { id: '2' }], [{ id: '2' }, { id: '3' }]).map(x => x.id)).toEqual(['1', '2', '3'])
  })

  it('round-trips a session through the wire format', () => {
    const s: Session = { id: 's', athleteId: 'a', date: '2026-11-02', level: 2, step: 1, lightWeek: false, repsTotal: 20, holdSecondsTotal: 60, createdAt: '2026-11-02T16:00:00Z' }
    const wire = sessionToWire(s)
    expect(wire).not.toHaveProperty('athleteId')
    expect(sessionFromWire('a', wire)).toEqual(s)
  })
})
