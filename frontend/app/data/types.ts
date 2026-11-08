export type Locale = 'nl' | 'en'
export const LOCALES: readonly Locale[] = ['nl', 'en']

/** User-facing text in both languages. A missing language is a type error. */
export type Text = Record<Locale, string>

export type AgeGroup = 'child' | 'adult'
export type Level = 1 | 2 | 3 | 4 | 5

export type ExerciseId =
  | 'warmup' | 'hang' | 'scap' | 'hollow' | 'row' | 'flexed' | 'neg' | 'box'
  | 'half' | 'tuck' | 'pullup' | 'chin' | 'pause' | 'lsit' | 'weighted'

export type ExerciseType = 'hold' | 'reps' | 'list'

export interface Athlete {
  id: string
  name: string
  ageGroup: AgeGroup
  level: Level
  language: Locale
  /** ISO timestamp; profiles merge last-write-wins on this. */
  updatedAt: string
}

export interface Session {
  id: string
  athleteId: string
  /** Local date, YYYY-MM-DD. */
  date: string
  level: Level
  step: number
  lightWeek: boolean
  repsTotal: number
  holdSecondsTotal: number
  createdAt: string
}

export interface TestResult {
  id: string
  athleteId: string
  date: string
  pullups: number
  hangSeconds: number
  createdAt: string
}
