import type { ExerciseId } from '../types'
import type { Angles, PoseAnimation } from './engine'
import { FOOT_Y, G, LIE_Y, STAND, t } from './shared'

const SQUAT_BODY: Angles = { ua: 60, fa: -130, to: 110, th: 15, sh: 115, hd: -80 }

export const WEIGHT_POSES: Partial<Record<ExerciseId, PoseAnimation>> = {
  wrist_curl: {
    root: 'hip', at: [46, 85.5], ground: G, scene: { bench: [[26, 88], [66, 88]] }, prop: 'dumbbell',
    frames: [
      { a: { ua: 64, fa: 28, to: 88, th: 0, sh: 90, hd: -85 }, move: 800, hold: 200, cap: t('Forearm on the thigh, wrist relaxed', 'Onderarm op je bovenbeen, pols ontspannen') },
      { a: { ua: 64, fa: -8, to: 88, th: 0, sh: 90, hd: -85 }, move: 800, hold: 300, cap: t('Curl only the wrist up, lower slowly', 'Krul alleen je pols omhoog, langzaam terug') }
    ]
  },
  db_rotation: {
    root: 'hip', at: [64, 96], ground: G, prop: 'dumbbell',
    frames: [
      { a: { ua: 0, fa: 90, to: 0, th: 0, sh: 0, hd: 180 }, len: { fa: 6 }, move: 900, hold: 300, cap: t('On your side, elbow against your side', 'Op je zij, elleboog tegen je zij') },
      { a: { ua: 0, fa: -90, to: 0, th: 0, sh: 0, hd: 180 }, move: 1100, hold: 400, cap: t('Rotate the forearm up, slowly back', 'Draai je onderarm omhoog, langzaam terug') }
    ]
  },
  ytw_raise: {
    root: 'hip', at: [52, LIE_Y], ground: G, prop: 'dumbbell',
    frames: [
      { a: { ua: 0, fa: 0, to: 180, th: 180, sh: 180, hd: 0 }, move: 900, hold: 300, cap: t('Face down, arms forward', 'Op je buik, armen naar voren') },
      { a: { ua: -18, fa: -18, to: 174, th: 180, sh: 180, hd: -6 }, move: 900, hold: 800, cap: t('Lift into a Y, then a T and a W', 'Til op in een Y, dan een T en een W') }
    ]
  },
  db_row: {
    root: 'foot', at: [36, FOOT_Y], ground: G, scene: { bench: [[44, 84], [98, 84]] }, prop: 'dumbbell',
    frames: [
      { a: { ua: 90, fa: 90, to: 180, th: 80, sh: 80, hd: 0 }, l: { th: 36, sh: 0 }, pinL: { hand: [72, 81.5], bend: -1 }, move: 1000, hold: 300, cap: t('Hand and knee on the bench, back flat', 'Hand en knie op de bank, rug vlak') },
      { a: { ua: -160, fa: 75, to: 180, th: 80, sh: 80, hd: 0 }, l: { th: 36, sh: 0 }, pinL: { hand: [72, 81.5], bend: -1 }, move: 900, hold: 300, cap: t('Pull the dumbbell to the hip', 'Trek het dumbbell naar je heup') }
    ]
  },
  db_press: {
    root: 'foot', at: [60, FOOT_Y], ground: G, prop: 'dumbbell',
    frames: [
      { a: { ...STAND, ua: 70, fa: -110 }, move: 1000, hold: 300, cap: t('Dumbbells at the shoulders', 'Dumbbells bij je schouders') },
      { a: { ...STAND, ua: -90, fa: -90 }, move: 1000, hold: 300, cap: t('Press up until the arms are by the ears', 'Druk omhoog tot je armen langs je oren zijn') }
    ]
  },
  goblet_squat: {
    root: 'foot', at: [60, FOOT_Y], ground: G, prop: 'kettlebell',
    frames: [
      { a: { ...STAND, ua: 70, fa: -120 }, move: 1100, hold: 300, cap: t('Kettlebell against the chest', 'Kettlebell tegen je borst') },
      { a: SQUAT_BODY, move: 1200, hold: 300, cap: t('Squat down, chest up', 'Zak omlaag, borst omhoog') }
    ]
  },
  kb_deadlift: {
    root: 'foot', at: [60, FOOT_Y], ground: G, prop: 'kettlebell',
    frames: [
      { a: { ua: 90, fa: 90, to: 150, th: 60, sh: 95, hd: -20 }, move: 1200, hold: 300, cap: t('Hips back, flat back, grab the kettlebell', 'Heupen naar achteren, rechte rug, pak de kettlebell') },
      { a: { ...STAND, ua: 90, fa: 90 }, move: 1100, hold: 400, cap: t('Stand up by pushing the hips forward', 'Kom omhoog door je heupen naar voren te duwen') }
    ]
  },
  farmer_carry: {
    root: 'foot', at: [60, FOOT_Y], ground: G, prop: 'kettlebell',
    frames: [
      { a: { ...STAND, ua: 90, fa: 92 }, l: { th: 102, sh: 92 }, move: 600, hold: 0, cap: t('Walk tall, the kettlebell by your side', 'Loop rechtop, de kettlebell langs je zij') },
      { a: { ...STAND, ua: 90, fa: 92 }, l: { th: 78, sh: 96 }, move: 600, hold: 0 }
    ]
  }
}
