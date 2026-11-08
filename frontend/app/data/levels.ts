import type { AgeGroup, ExerciseId, Level, Text } from './types'

/** What a plan item needs to work out its dose. */
export interface PlanContext {
  step: number
  ageGroup: AgeGroup
  /** Pull-ups at the latest test (0 if none). Level 5 scales from this. */
  testPullups: number
}

type Dose = number | ((c: PlanContext) => number)

export interface PlanItem {
  ex: ExerciseId
  sets: Dose
  /** Reps, or seconds for a hold. */
  value: Dose
  /** Added to value for every step above 1. */
  inc?: number
  /** Added to sets for every step above 1 (fractions round down). */
  setInc?: number
  /** Only included when this returns true. */
  when?: (c: PlanContext) => boolean
}

export interface LevelDef {
  n: Level
  name: Text
  who: Text
  goal: Text
  plan: PlanItem[]
}

/** Steps within a level: the dose rises a little each week up to this cap. */
export const MAX_STEPS = 4
/** Workouts at one step before moving to the next (3 a week, so about a week). */
export const WORKOUTS_PER_STEP = 3

const t = (en: string, nl: string): Text => ({ en, nl })
const atLeast = (min: number, v: number) => Math.max(min, Math.round(v))

export const LEVELS: LevelDef[] = [
  {
    n: 1,
    name: t('Foundation', 'Basis'),
    who: t("Can't do a pull-up yet", 'Kan nog geen pull-up'),
    goal: t('Goal: hold chin over the bar for 5 seconds.', 'Doel: 5 seconden je kin boven de stang houden.'),
    plan: [
      { ex: 'hang', sets: 3, value: 20, inc: 5 },
      { ex: 'scap', sets: 3, value: 6, inc: 1 },
      { ex: 'row', sets: 3, value: 8, inc: 1 },
      { ex: 'hollow', sets: 3, value: 20, inc: 5 }
    ]
  },
  {
    n: 2,
    name: t('Builder', 'Bouwer'),
    who: t('Can hold chin over bar, no pull-ups yet', 'Kan de kin boven de stang houden, nog geen pull-ups'),
    goal: t('Goal: your first strict pull-up.', 'Doel: je eerste strikte pull-up.'),
    plan: [
      { ex: 'flexed', sets: 3, value: 10, inc: 2 },
      { ex: 'neg', sets: 3, value: 3, inc: 1 },
      { ex: 'box', sets: 3, value: 5, inc: 1 },
      { ex: 'row', sets: 3, value: 10, inc: 1 },
      { ex: 'tuck', sets: 2, value: 6, inc: 1 },
      { ex: 'hollow', sets: 3, value: 25, inc: 5 }
    ]
  },
  {
    n: 3,
    name: t('First reps', 'Eerste herhalingen'),
    who: t('1 to 3 pull-ups', '1 tot 3 pull-ups'),
    goal: t('Goal: 4 strict pull-ups in a row.', 'Doel: 4 strikte pull-ups achter elkaar.'),
    plan: [
      { ex: 'pullup', sets: 3, value: c => Math.min(2, Math.max(1, c.testPullups - 1)), setInc: 1 },
      { ex: 'neg', sets: 3, value: 3, inc: 1 },
      { ex: 'half', sets: 3, value: 10, inc: 3 },
      { ex: 'chin', sets: 2, value: 2, setInc: 0.5 },
      { ex: 'tuck', sets: 2, value: 8, inc: 1 },
      { ex: 'hollow', sets: 3, value: 30, inc: 5 }
    ]
  },
  {
    n: 4,
    name: t('Strong', 'Sterk'),
    who: t('4 to 7 pull-ups', '4 tot 7 pull-ups'),
    goal: t('Goal: 8 strict pull-ups in a row.', 'Doel: 8 strikte pull-ups achter elkaar.'),
    plan: [
      { ex: 'pullup', sets: 4, value: c => atLeast(3, c.testPullups * 0.6), inc: 1 },
      { ex: 'pause', sets: 3, value: 2, inc: 0.5 },
      { ex: 'chin', sets: 2, value: 4, inc: 1 },
      { ex: 'tuck', sets: 3, value: 8, inc: 1 },
      { ex: 'hollow', sets: 3, value: 30, inc: 5 }
    ]
  },
  {
    // Open-ended: every dose scales from the latest test, so a better test always means a harder workout.
    n: 5,
    name: t('Competition', 'Wedstrijd'),
    who: t('8 or more pull-ups', '8 of meer pull-ups'),
    goal: t('Keep beating your best: the workout grows with every test.', 'Blijf je record verbeteren: de training groeit mee met elke test.'),
    plan: [
      { ex: 'lsit', sets: 3, value: c => atLeast(2, c.testPullups * 0.25) },
      { ex: 'pullup', sets: 4, value: c => atLeast(5, c.testPullups * 0.6), inc: 0.5 },
      { ex: 'weighted', sets: 3, value: 5, when: c => c.ageGroup === 'adult' && c.testPullups >= 12 },
      { ex: 'pause', sets: 3, value: c => atLeast(3, c.testPullups * 0.3) },
      { ex: 'neg', sets: 2, value: 3, inc: 1 },
      { ex: 'tuck', sets: 3, value: c => atLeast(10, c.testPullups * 0.8), inc: 1 },
      { ex: 'hollow', sets: 3, value: 40, inc: 5 }
    ]
  }
]

export function levelDef(level: number): LevelDef {
  const n = Math.min(Math.max(Math.round(level), 1), 5)
  return LEVELS[n - 1]!
}

/** Entry targets: the test result needed to be placed on each level. */
export const ENTRY: Record<Level, { pullups: number, hangSeconds: number }> = {
  1: { pullups: 0, hangSeconds: 0 },
  2: { pullups: 0, hangSeconds: 5 },
  3: { pullups: 1, hangSeconds: 0 },
  4: { pullups: 4, hangSeconds: 0 },
  5: { pullups: 8, hangSeconds: 0 }
}
