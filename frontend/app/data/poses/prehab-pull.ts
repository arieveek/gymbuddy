import type { ExerciseId } from '../types'
import { rungY, type Angles, type PoseAnimation } from './engine'
import { ACTIVE, BAR, FOOT_Y, G, HANG, PASSIVE, STAND, t } from './shared'

/** On hands and knees, head right, hands under the shoulders. */
const QUAD: Angles = { ua: 90, fa: 90, to: 160, th: 90, sh: 180, hd: -15 }
/** Kneeling push-up position, body straight from knees to head. */
const KNEEL_PUSH: Angles = { ua: 90, fa: 90, to: 143, th: 143, sh: 180, hd: -37 }

export const PREHAB_PULL_POSES: Partial<Record<ExerciseId, PoseAnimation>> = {
  wrist_rocks: {
    root: 'hand', at: [82, FOOT_Y], ground: G,
    frames: [
      { a: QUAD, move: 900, hold: 300, cap: t('Hands under the shoulders', 'Handen onder je schouders') },
      { a: { ...QUAD, ua: 100, fa: 100 }, move: 900, hold: 300, cap: t('Rock gently forward and back', 'Schommel rustig naar voren en terug') }
    ]
  },
  palm_lifts: {
    root: 'hand', at: [82, FOOT_Y], ground: G,
    frames: [
      { a: QUAD, move: 700, hold: 400, cap: t('Hands flat, fingers forward', 'Handen plat, vingers naar voren') },
      { a: QUAD, len: { fa: 14 }, move: 700, hold: 500, cap: t('Lift the palms, fingers stay down', 'Til je handpalmen op, vingers blijven liggen') }
    ]
  },
  wrist_pushup: {
    root: 'hand', at: [84, FOOT_Y], ground: G,
    frames: [
      { a: KNEEL_PUSH, move: 700, hold: 300, cap: t('On the knees, hands under the shoulders', 'Op je knieën, handen onder je schouders') },
      { a: KNEEL_PUSH, len: { fa: 14.5 }, move: 800, hold: 400, cap: t('Press up onto the fingertips', 'Duw op naar je vingertoppen') }
    ]
  },
  assisted_hang: {
    root: 'foot', at: [84, FOOT_Y], ground: G, scene: { wallbars: 96 }, ik: { hand: [96, rungY(5, G)], bend: 1 },
    frames: [
      { a: { ...STAND, hd: -85 }, move: 900, hold: 400, cap: t('Hold a rung at chest height', 'Pak een sport op borsthoogte') },
      { a: { ua: 0, fa: 0, to: 72, th: 16, sh: 121, hd: -100 }, move: 1200, hold: 3000, ring: true, cap: t('Sit back: arms straight, knees bent', 'Zak naar achteren: armen gestrekt, knieën gebogen') }
    ]
  },
  band_rotation: {
    root: 'hip', at: [60, 70.5], view: 'front', ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 90, th: 94, sh: 92, hd: -90 }, len: { fa: 4 }, move: 800, hold: 300, cap: t('Elbows at your sides, forearms forward', 'Ellebogen langs je zij, onderarmen naar voren') },
      { a: { ua: 90, fa: 0, to: 90, th: 94, sh: 92, hd: -90 }, move: 900, hold: 400, cap: t('Turn the forearms out, slowly back', 'Draai je onderarmen naar buiten, langzaam terug') }
    ]
  },
  pass_through: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: { ...STAND, ua: 60, fa: 60 }, move: 1000, hold: 200, cap: t('Stick in front, arms straight', 'Stok voor je, armen gestrekt') },
      { a: { ...STAND, ua: -90, fa: -90 }, move: 1000, hold: 200, cap: t('Over the head…', 'Over je hoofd…') },
      { a: { ...STAND, ua: -150, fa: -150 }, move: 900, hold: 300, cap: t('…to behind the back', '…naar achter je rug') },
      { a: { ...STAND, ua: -90, fa: -90 }, move: 900, hold: 200, cap: t('And back', 'En terug') }
    ]
  },
  floor_angels: {
    root: 'hip', at: [60, 70], view: 'front', ground: false,
    frames: [
      { a: { ua: 30, fa: -60, to: 90, th: 92, sh: 90, hd: -90 }, move: 1000, hold: 300, cap: t('Seen from above: arms in a W on the floor', 'Van boven gezien: armen als een W op de grond') },
      { a: { ua: -55, fa: -60, to: 90, th: 92, sh: 90, hd: -90 }, move: 1200, hold: 300, cap: t('Slide up to a Y, keep touching the floor', 'Schuif omhoog naar een Y, blijf de grond raken') }
    ]
  },
  shoulder_opener: {
    root: 'foot', at: [62, FOOT_Y], ground: G, scene: { wallbars: 96 }, ik: { hand: [96, rungY(6, G)], bend: -1 },
    frames: [
      { a: { ...STAND, to: 120, hd: -60 }, move: 1000, hold: 400, cap: t('Hands on a rung, step back', 'Handen op een sport, stap naar achteren') },
      { a: { ...STAND, to: 185, hd: 5 }, move: 1200, hold: 3000, ring: true, cap: t('Flat back, let the chest sink', 'Rechte rug, laat je borst zakken') }
    ]
  },

  arch_hang: {
    root: 'hand', at: BAR,
    frames: [
      { a: { ...HANG, hd: -62 }, len: PASSIVE, move: 900, hold: 500, cap: t('Dead hang', 'Dode hang') },
      { a: { ...HANG, to: 96, th: 100, sh: 100, hd: -95 }, len: { ua: 11 }, move: 900, hold: 2500, ring: true, cap: t('Shoulder blades down and together, chest up', 'Schouderbladen omlaag en naar elkaar, borst omhoog') }
    ]
  },
  l_hang: {
    root: 'hand', at: BAR,
    frames: [
      { a: HANG, len: ACTIVE, move: 900, hold: 400, cap: t('Hang, shoulders active', 'Hang, schouders actief') },
      { a: { ...HANG, to: 92, th: 0, sh: 0, hd: -78 }, len: ACTIVE, move: 1000, hold: 3000, ring: true, cap: t('Straight legs to horizontal: hold', 'Gestrekte benen tot horizontaal: vasthouden') }
    ]
  },
  front_lever_tuck: {
    root: 'hand', at: BAR,
    frames: [
      { a: HANG, len: ACTIVE, move: 900, hold: 300, cap: t('Hang', 'Hang') },
      { a: { ...HANG, to: 100, th: -45, sh: 80 }, len: ACTIVE, move: 800, hold: 200, cap: t('Knees to the chest', 'Knieën naar je borst') },
      { a: { ua: -105, fa: -105, to: 0, th: 200, sh: 30, hd: 190 }, move: 1100, hold: 2500, ring: true, cap: t('Lean back until the back is horizontal: hold', 'Leun achterover tot je rug horizontaal is: vasthouden') }
    ]
  },
  skin_cat: {
    root: 'hand', at: BAR,
    frames: [
      { a: HANG, len: ACTIVE, move: 1200, hold: 300, cap: t('Hang', 'Hang') },
      { a: { ...HANG, to: 105, th: -50, sh: 70 }, len: ACTIVE, move: 900, hold: 100, cap: t('Tuck the knees', 'Knieën optrekken') },
      { a: { ua: -95, fa: -92, to: -80, th: 150, sh: 140, hd: 100 }, move: 1400, hold: 200, cap: t('Turn the legs through under the bar', 'Draai je benen onder de stang door') },
      { a: { ua: -98, fa: -94, to: 75, th: 95, sh: 95, hd: 110 }, move: 1800, hold: 800, cap: t('Lower gently into the shoulder stretch', 'Zak rustig in de schouderrek') },
      { a: { ua: -95, fa: -92, to: -80, th: 150, sh: 140, hd: 100 }, move: 1600, hold: 100, cap: t('Return the same way', 'Ga op dezelfde manier terug') },
      { a: { ...HANG, to: 105, th: -50, sh: 70 }, len: ACTIVE, move: 1300, hold: 100 }
    ]
  }
}
