import type { BodyArea, ExerciseId } from './types'

/**
 * Which body areas each exercise loads. With an injury in one of these areas the exercise is left out of
 * the workout and marked in the library. Typed as a full Record, so a new exercise without an entry is a
 * type error. An empty list means it is gentle enough to keep (e.g. the warm-up).
 * Hanging loads the hands (rips) and shoulders; weight on the hands loads wrists, elbows and shoulders;
 * jumps and landings load knees and ankles.
 */
export const LOADS: Record<ExerciseId, BodyArea[]> = {
  // Prehab and warm-up
  warmup: [],
  wrist_rocks: ['wrist'],
  palm_lifts: ['wrist'],
  wrist_pushup: ['wrist'],
  assisted_hang: ['hands', 'shoulder'],
  scap: ['hands', 'shoulder'],
  band_rotation: ['shoulder'],
  pass_through: ['shoulder'],
  floor_angels: ['shoulder'],
  shoulder_opener: ['hands', 'shoulder'],
  stick_sequence: ['shoulder', 'back'],
  overhead_liftoff: ['shoulder'],
  serratus_punch: ['shoulder'],
  towel_scrunch: ['ankle'],
  clamshell: ['hip'],

  // Pull (hanging)
  hang: ['hands', 'shoulder'],
  arch_hang: ['hands', 'shoulder'],
  row: ['hands', 'shoulder', 'elbow'],
  flexed: ['hands', 'shoulder', 'elbow'],
  neg: ['hands', 'shoulder', 'elbow'],
  box: ['hands', 'shoulder', 'elbow'],
  half: ['hands', 'shoulder', 'elbow'],
  pullup: ['hands', 'shoulder', 'elbow'],
  chin: ['hands', 'shoulder', 'elbow'],
  pause: ['hands', 'shoulder', 'elbow'],
  l_hang: ['hands', 'shoulder'],
  lsit: ['hands', 'shoulder', 'elbow'],
  front_lever_tuck: ['hands', 'shoulder', 'elbow'],
  skin_cat: ['hands', 'shoulder', 'elbow'],
  weighted: ['hands', 'shoulder', 'elbow'],

  // Push and support (weight on the hands)
  pushup_incline: ['wrist', 'shoulder', 'elbow'],
  pushup: ['wrist', 'shoulder', 'elbow'],
  triceps_pushup: ['wrist', 'shoulder', 'elbow'],
  support_hold: ['wrist', 'shoulder', 'elbow'],
  dip_negative: ['wrist', 'shoulder', 'elbow'],
  dip: ['wrist', 'shoulder', 'elbow'],
  bench_dip: ['wrist', 'shoulder', 'elbow'],
  pike_pushup: ['wrist', 'shoulder', 'elbow'],
  planche_lean: ['wrist', 'shoulder', 'elbow'],
  frog_stand: ['wrist', 'shoulder', 'elbow'],
  support_shrugs: ['wrist', 'shoulder', 'elbow'],
  side_lean: ['wrist', 'shoulder', 'elbow'],
  rear_support: ['wrist', 'shoulder'],
  seal_walk: ['wrist', 'shoulder'],
  tuck_planche: ['wrist', 'shoulder', 'elbow'],

  // Core
  dead_bug: [],
  hollow: [],
  hollow_rock: ['back'],
  arch_hold: ['back'],
  tuck_up: ['back'],
  plank: ['shoulder', 'elbow'],
  side_plank: ['wrist', 'shoulder'],
  tuck: ['hands', 'shoulder'],
  leg_lift_bars: ['hands', 'shoulder'],
  toes_to_bar: ['hands', 'shoulder'],
  dip_leg_raise: ['wrist', 'shoulder', 'elbow'],
  l_sit_tuck: ['wrist', 'shoulder', 'elbow'],
  l_sit: ['wrist', 'shoulder', 'elbow'],
  straddle_l: ['wrist', 'shoulder', 'elbow'],
  reverse_leg_lift: ['hands', 'shoulder', 'back'],
  compression: ['hip'],
  walkout: ['wrist', 'shoulder', 'hip'],
  bear_crawl: ['wrist', 'shoulder', 'knee'],
  stalder_hang: ['hands', 'shoulder', 'hip'],

  // Handstand and balance
  releve: ['ankle'],
  t_scale: ['ankle', 'hip', 'back'],
  shoulder_plank: ['wrist', 'shoulder'],
  handstand_back: ['wrist', 'shoulder', 'elbow'],
  wall_walk: ['wrist', 'shoulder', 'elbow'],
  handstand_kick: ['wrist', 'shoulder', 'elbow'],
  handstand_free: ['wrist', 'shoulder', 'elbow'],
  pike_up: ['wrist', 'shoulder', 'elbow'],
  straddle_press: ['wrist', 'shoulder', 'elbow'],

  // Legs, jumps and landings
  squat: ['knee', 'hip'],
  squat_jump: ['knee', 'ankle'],
  gym_jumps: ['knee', 'ankle'],
  stick_landing: ['knee', 'ankle'],
  long_jump: ['knee', 'ankle'],
  split_squat: ['knee', 'hip'],
  pistol_assisted: ['knee', 'ankle', 'hip'],
  calf_raise: ['ankle'],
  glute_bridge: ['hip', 'back'],
  nordic: ['knee'],
  quad_lean: ['knee'],
  pogo_hops: ['ankle', 'knee'],
  line_hops: ['ankle', 'knee'],
  single_leg_balance: ['ankle'],

  // Flexibility
  hamstring_rung: ['hip', 'back'],
  front_split: ['hip', 'knee'],
  butterfly: ['hip', 'knee'],
  middle_split: ['hip'],
  pike_stretch: ['back', 'hip'],
  pike_hang: ['hands', 'back', 'hip'],
  hip_flexor: ['hip', 'knee'],
  side_bend: ['hip', 'back'],
  thoracic: ['back', 'shoulder'],
  bridge: ['back', 'shoulder', 'wrist'],
  kicks: ['hip'],
  lat_stretch: ['shoulder'],
  wall_leg_lift: ['hip'],
  straddle_lift: ['hip'],
  ankle_stretch: ['ankle', 'knee'],

  // Light weights
  wrist_curl: ['wrist'],
  db_rotation: ['shoulder'],
  ytw_raise: ['shoulder'],
  db_row: ['shoulder', 'elbow', 'back'],
  db_press: ['shoulder', 'elbow', 'wrist'],
  goblet_squat: ['knee', 'hip', 'back'],
  kb_deadlift: ['back', 'hip', 'hands'],
  farmer_carry: ['hands', 'wrist', 'back']
}

/** The injured areas this exercise loads (empty = fine to do). */
export function blockedBy(id: ExerciseId, injuries: readonly BodyArea[] | undefined): BodyArea[] {
  if (!injuries?.length) return []
  return LOADS[id].filter(a => injuries.includes(a))
}
