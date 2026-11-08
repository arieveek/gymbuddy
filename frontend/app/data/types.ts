import type { SourceId } from './sources'

export type Locale = 'nl' | 'en'
export const LOCALES: readonly Locale[] = ['nl', 'en']

/** User-facing text in both languages. A missing language is a type error. */
export type Text = Record<Locale, string>

export type AgeGroup = 'child' | 'adult'
export type Level = 1 | 2 | 3 | 4 | 5

/** Every exercise in the library. The first 15 are used by the workout plan (data/levels.ts). */
export const EXERCISE_IDS = [
  // used by the workout plan
  'warmup', 'hang', 'scap', 'hollow', 'row', 'flexed', 'neg', 'box', 'half', 'tuck', 'pullup', 'chin', 'pause', 'lsit', 'weighted',
  // prehab
  'wrist_rocks', 'palm_lifts', 'wrist_pushup', 'assisted_hang', 'band_rotation', 'pass_through', 'floor_angels', 'shoulder_opener',
  // pull
  'arch_hang', 'l_hang', 'front_lever_tuck', 'skin_cat',
  // push
  'pushup_incline', 'pushup', 'triceps_pushup', 'support_hold', 'dip_negative', 'dip', 'bench_dip', 'pike_pushup', 'planche_lean', 'frog_stand',
  // core
  'dead_bug', 'hollow_rock', 'arch_hold', 'tuck_up', 'plank', 'side_plank', 'leg_lift_bars', 'toes_to_bar', 'dip_leg_raise',
  'l_sit_tuck', 'l_sit', 'straddle_l', 'reverse_leg_lift', 'compression',
  // handstand and balance
  'releve', 't_scale', 'shoulder_plank', 'handstand_back', 'wall_walk', 'handstand_kick', 'handstand_free', 'pike_up', 'straddle_press',
  // legs and jumps
  'squat', 'squat_jump', 'gym_jumps', 'stick_landing', 'long_jump', 'split_squat', 'pistol_assisted', 'calf_raise', 'glute_bridge', 'nordic',
  // flexibility
  'hamstring_rung', 'front_split', 'butterfly', 'middle_split', 'pike_stretch', 'pike_hang', 'hip_flexor', 'side_bend', 'thoracic', 'bridge', 'kicks',
  // light weights (dumbbells, kettlebell)
  'wrist_curl', 'db_rotation', 'ytw_raise', 'db_row', 'db_press', 'goblet_squat', 'kb_deadlift', 'farmer_carry',
  // second research round
  'stick_sequence', 'overhead_liftoff', 'serratus_punch', 'towel_scrunch', 'clamshell',
  'support_shrugs', 'side_lean', 'rear_support', 'seal_walk', 'tuck_planche',
  'walkout', 'bear_crawl', 'stalder_hang',
  'lat_stretch', 'wall_leg_lift', 'straddle_lift', 'ankle_stretch',
  'quad_lean', 'pogo_hops', 'line_hops', 'single_leg_balance'
] as const

export type ExerciseId = typeof EXERCISE_IDS[number]

export type ExerciseType = 'hold' | 'reps' | 'list'

export const CATEGORIES = ['prehab', 'pull', 'push', 'core', 'handstand', 'legs', 'flexibility'] as const
export type Category = typeof CATEGORIES[number]

/** floor, wall bars, pull-up bar, dip bar, bench, a wall, a band or stick, light dumbbells, a kettlebell. */
export const EQUIPMENT = ['floor', 'wallbars', 'pullupbar', 'dipbar', 'bench', 'wall', 'band', 'dumbbell', 'kettlebell'] as const
export type Equipment = typeof EQUIPMENT[number]

/** 1 beginner, 2 intermediate, 3 advanced. */
export type Difficulty = 1 | 2 | 3

export interface Exercise {
  id: ExerciseId
  name: Text
  type: ExerciseType
  category: Category
  equipment: Equipment[]
  difficulty: Difficulty
  cues: Text[]
  why?: Text
  tempo?: Text
  /** Shown highlighted in the library: what to watch out for. */
  safety?: Text
  /** Where it comes from (data/sources.ts); see docs/exercise-library.md. */
  sources: SourceId[]
  /** Standard conditioning that no opened source describes in detail. */
  commonPractice?: boolean
  /** Progression links; always reciprocal (A.harder = B ⇔ B.easier = A). */
  easier?: ExerciseId
  harder?: ExerciseId
  /** Learn it at the club with the coach before doing it at home. */
  coachFirst?: boolean
  /** Only offered to adult profiles. */
  adultOnly?: boolean
}

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
