import type { Athlete, Session, TestResult } from '../data/types'

/** A pending upload. Only ids are queued; the current record is read at upload time. */
export type OutboxOp =
  | { kind: 'athlete', id: string }
  | { kind: 'session', id: string }
  | { kind: 'test', id: string }

/** Adds an op unless the same record is already queued. */
export function enqueue(outbox: OutboxOp[], op: OutboxOp): OutboxOp[] {
  return outbox.some(o => o.kind === op.kind && o.id === op.id) ? outbox : [...outbox, op]
}

/** Uploads profiles first, so the server knows the athlete before its workouts and tests arrive. */
export function ordered(outbox: OutboxOp[]): OutboxOp[] {
  const rank = { athlete: 0, session: 1, test: 2 } as const
  return [...outbox].sort((a, b) => rank[a.kind] - rank[b.kind])
}

/** Merges server profiles into local ones: unknown ones are added, known ones keep the newer version. */
export function mergeAthletes(local: Athlete[], remote: Athlete[]): Athlete[] {
  const result = local.map(a => ({ ...a }))
  for (const r of remote) {
    const i = result.findIndex(a => a.id === r.id)
    if (i === -1) result.push({ ...r })
    else if (r.updatedAt > result[i]!.updatedAt) result[i] = { ...r }
  }
  return result
}

/** Adds server records that are not on this device yet. Workouts and tests never change once made. */
export function mergeById<T extends { id: string }>(local: T[], remote: T[]): T[] {
  const known = new Set(local.map(x => x.id))
  return [...local, ...remote.filter(r => !known.has(r.id))]
}

/* ---------- Wire format (see docs/architecture.md, API) ---------- */

export interface SessionWire {
  id: string
  date: string
  level: number
  step: number
  lightWeek: boolean
  repsTotal: number
  holdSecondsTotal: number
  createdAt: string
}

export interface TestWire {
  id: string
  date: string
  pullups: number
  hangSeconds: number
  createdAt: string
}

export const sessionToWire = ({ athleteId: _, ...s }: Session): SessionWire => s

export const sessionFromWire = (athleteId: string, s: SessionWire): Session =>
  ({ ...s, athleteId, level: s.level as Session['level'], createdAt: s.createdAt ?? new Date().toISOString() })

export const testToWire = ({ athleteId: _, ...t }: TestResult): TestWire => t

export const testFromWire = (athleteId: string, t: TestWire): TestResult =>
  ({ ...t, athleteId, createdAt: t.createdAt ?? new Date().toISOString() })
