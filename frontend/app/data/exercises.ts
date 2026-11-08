import { CATEGORIES, EXERCISE_IDS, type Category, type Exercise, type ExerciseId } from './types'
import { PREHAB } from './library/prehab'
import { PULL } from './library/pull'
import { PUSH } from './library/push'
import { CORE } from './library/core'
import { HANDSTAND } from './library/handstand'
import { LEGS } from './library/legs'
import { FLEXIBILITY } from './library/flexibility'
import { WEIGHTS } from './library/weights'
import { MORE } from './library/more'

export type { Exercise } from './types'

/**
 * The exercise library, from docs/exercise-library.md. One file per category in data/library/.
 * Completeness (every id exactly once, both languages, sources, progressions) is checked in test/library.test.ts.
 */
export const LIBRARY: Exercise[] = [...PREHAB, ...PULL, ...PUSH, ...CORE, ...HANDSTAND, ...LEGS, ...FLEXIBILITY, ...WEIGHTS, ...MORE]

export const EXERCISES = Object.fromEntries(LIBRARY.map(e => [e.id, e])) as Record<ExerciseId, Exercise>

/** Order on the Moves screen: by category, then easiest first, keeping the library order otherwise. */
export const MOVE_ORDER: ExerciseId[] = [...LIBRARY]
  .sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.difficulty - b.difficulty)
  .map(e => e.id)

export function byCategory(category: Category): Exercise[] {
  return MOVE_ORDER.map(id => EXERCISES[id]).filter(e => e.category === category)
}

export { EXERCISE_IDS }
