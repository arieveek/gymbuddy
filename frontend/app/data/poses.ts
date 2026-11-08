import type { ExerciseId } from './types'
import type { PoseAnimation } from './poses/engine'
import { BASIC_POSES } from './poses/basic'
import { PREHAB_PULL_POSES } from './poses/prehab-pull'
import { PUSH_CORE_POSES } from './poses/push-core'
import { HANDSTAND_LEGS_FLEX_POSES } from './poses/handstand-legs-flex'
import { WEIGHT_POSES } from './poses/weights'

export * from './poses/engine'

/** One animated drawing per exercise (completeness is checked in test/library.test.ts). */
export const POSES = {
  ...BASIC_POSES,
  ...PREHAB_PULL_POSES,
  ...PUSH_CORE_POSES,
  ...HANDSTAND_LEGS_FLEX_POSES,
  ...WEIGHT_POSES
} as Record<ExerciseId, PoseAnimation>
