import type { ExerciseId } from '../types'
import { rungY, type Angles, type PoseAnimation } from './engine'
import { FOOT_Y, G, LIE_Y, SUPINE, t } from './shared'

/** Dip bar handle from the wall bars at x 30 out to x 66, at support height. */
const DIP = { x0: 30, x1: 66, y: 60 }
const SUPPORT: Angles = { ua: 90, fa: 90, to: 94, th: 92, sh: 95, hd: -95 }
const DIP_BOTTOM: Angles = { ua: 180, fa: 90, to: 80, th: 100, sh: 105, hd: -60 }
const dipScene = { wallbars: 30, dipbar: DIP }

/** Straight body from the toes (root foot) at elevation `b` degrees; the head is to the right. */
const plankAngles = (b: number): Angles => ({ ua: 0, fa: 0, to: 180 - b, th: 180 - b, sh: 180 - b, hd: -b })

export const PUSH_CORE_POSES: Partial<Record<ExerciseId, PoseAnimation>> = {
  pushup_incline: {
    root: 'foot', at: [36.8, FOOT_Y], ground: G, scene: { wallbars: 96 }, ik: { hand: [95, rungY(2, G)], bend: 1 },
    frames: [
      { a: plankAngles(40), move: 1000, hold: 300, cap: t('Hands on a low rung, body straight', 'Handen op een lage sport, lichaam recht') },
      { a: plankAngles(30), move: 1100, hold: 200, cap: t('Chest to the rung, elbows back', 'Borst naar de sport, ellebogen naar achteren') }
    ]
  },
  pushup: {
    root: 'foot', at: [30, FOOT_Y], ground: G, ik: { hand: [79, FOOT_Y], bend: 1 },
    frames: [
      { a: plankAngles(27), move: 1000, hold: 300, cap: t('Hands under the shoulders, body in one line', 'Handen onder je schouders, lichaam in één lijn') },
      { a: plankAngles(11), move: 1100, hold: 200, cap: t('Lower with control, push back up', 'Gecontroleerd zakken, weer opduwen') }
    ]
  },
  triceps_pushup: {
    root: 'foot', at: [30, FOOT_Y], ground: G, ik: { hand: [79, FOOT_Y], bend: 1 },
    frames: [
      { a: plankAngles(27), move: 1000, hold: 300, cap: t('Hands under the shoulders', 'Handen onder je schouders') },
      { a: plankAngles(11), move: 1200, hold: 200, cap: t('Elbows brush the ribs on the way down', 'Ellebogen langs je ribben tijdens het zakken') }
    ]
  },
  support_hold: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, len: { ua: 11 }, move: 800, hold: 500, cap: t('Hands on the dip bar, arms straight', 'Handen op de dipbar, armen gestrekt') },
      { a: SUPPORT, move: 700, hold: 3000, ring: true, cap: t('Shoulders down, long neck: hold', 'Schouders omlaag, lange nek: vasthouden') }
    ]
  },
  dip_negative: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, move: 900, hold: 500, cap: t('Start in support', 'Begin in steun') },
      { a: DIP_BOTTOM, move: 4000, ease: 'linear', count: 4, hold: 300, cap: t('Lower slowly, elbows back', 'Zak langzaam, ellebogen naar achteren') }
    ]
  },
  dip: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, move: 1000, hold: 400, cap: t('Support, shoulders down', 'Steun, schouders omlaag') },
      { a: DIP_BOTTOM, move: 1300, hold: 200, cap: t('Lower until the upper arm is level', 'Zak tot je bovenarm horizontaal is') }
    ]
  },
  bench_dip: {
    root: 'hand', at: [48, 86.5], ground: G, scene: { bench: [[14, 89], [50, 89]] },
    frames: [
      { a: { ua: 90, fa: 90, to: 90, th: 0, sh: 90, hd: -90 }, move: 1000, hold: 300, cap: t('Hands on the bench edge behind you', 'Handen op de rand van de bank achter je') },
      { a: { ua: 180, fa: 90, to: 92, th: -40, sh: 85, hd: -80 }, move: 1200, hold: 200, cap: t('Bend the elbows straight back', 'Buig je ellebogen recht naar achteren') }
    ]
  },
  pike_pushup: {
    root: 'hand', at: [70, FOOT_Y], ground: G, scene: { bench: [[8, 83.5], [42, 83.5]] }, ik: { foot: [31, 81], bend: 1 },
    frames: [
      { a: { ua: 80, fa: 80, to: 234, th: 0, sh: 0, hd: 70 }, move: 1000, hold: 300, cap: t('Feet on the bench, hips high', 'Voeten op de bank, heupen hoog') },
      { a: { ua: 135, fa: 40, to: 235, th: 0, sh: 0, hd: 80 }, move: 1200, hold: 200, cap: t('Head down between the hands, push back up', 'Hoofd omlaag tussen je handen, weer opduwen') }
    ]
  },
  planche_lean: {
    root: 'hand', at: [72, FOOT_Y], ground: G, ik: { foot: [20, FOOT_Y], bend: -1 },
    frames: [
      { a: { ua: 90, fa: 90, to: 153, th: 0, sh: 0, hd: -25 }, move: 1000, hold: 400, cap: t('Push-up position, arms locked', 'Opdrukhouding, armen gestrekt') },
      { a: { ua: 106, fa: 106, to: 156, th: 0, sh: 0, hd: -25 }, move: 1100, hold: 2500, ring: true, cap: t('Lean the shoulders past the hands: hold', 'Leun met je schouders voorbij je handen: vasthouden') }
    ]
  },
  frog_stand: {
    root: 'hand', at: [66, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 80, fa: 90, to: 190, th: 50, sh: 100, hd: 10 }, move: 1000, hold: 400, cap: t('Hands flat, knees on the elbows', 'Handen plat, knieën op je ellebogen') },
      { a: { ua: 100, fa: 90, to: 195, th: 40, sh: 160, hd: 20 }, move: 1100, hold: 2000, ring: true, cap: t('Lean forward until the feet lift', 'Leun naar voren tot je voeten loskomen') }
    ]
  },

  dead_bug: {
    root: 'hip', at: [62, LIE_Y], ground: G,
    frames: [
      { a: { ...SUPINE, ua: -90, fa: -90, th: -90, sh: 0 }, move: 900, hold: 400, cap: t('Arms up, knees above the hips', 'Armen omhoog, knieën boven je heupen') },
      { a: { ...SUPINE, ua: 180, fa: 180, th: -12, sh: -10 }, move: 1200, hold: 400, cap: t('Stretch an arm back and a leg out, back stays down', 'Strek een arm naar achteren en een been uit, rug blijft liggen') }
    ]
  },
  hollow_rock: {
    root: 'hip', at: [62, LIE_Y], ground: G,
    frames: [
      { a: { to: 25, hd: 215, ua: 208, fa: 202, th: -5, sh: -5 }, move: 700, cap: t('Rock like a banana, the shape stays the same', 'Schommel als een banaan, de houding blijft hetzelfde') },
      { a: { to: 5, hd: 195, ua: 188, fa: 182, th: -25, sh: -25 }, move: 700 }
    ]
  },
  arch_hold: {
    root: 'hip', at: [58, LIE_Y], ground: G,
    frames: [
      { a: { ua: 0, fa: 0, to: 180, th: 180, sh: 180, hd: 0 }, move: 900, hold: 400, cap: t('Face down, arms forward', 'Op je buik, armen naar voren') },
      { a: { ua: -15, fa: -15, to: 165, th: 190, sh: 190, hd: -20 }, move: 900, hold: 2500, ring: true, cap: t('Lift arms, chest and legs a little: hold', 'Til armen, borst en benen een beetje op: vasthouden') }
    ]
  },
  tuck_up: {
    root: 'hip', at: [60, LIE_Y], ground: G,
    frames: [
      { a: { ...SUPINE, ua: 180, fa: 180 }, move: 1000, hold: 300, cap: t('Lie flat, arms overhead', 'Lig plat, armen boven je hoofd') },
      { a: { ua: 10, fa: 10, to: 50, th: -110, sh: 20, hd: 230 }, move: 900, hold: 300, cap: t('Knees and chest together', 'Knieën en borst naar elkaar') }
    ]
  },
  plank: {
    root: 'hand', at: [86, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 90, fa: 0, to: 166, th: 166, sh: 166, hd: -14 }, hold: 3500, ring: true, cap: t('Forearms down, one straight line: hold', 'Onderarmen op de grond, één rechte lijn: vasthouden') }
    ]
  },
  side_plank: {
    root: 'foot', at: [22, FOOT_Y], view: 'front', ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 160, th: 150, sh: 160, hd: -27 }, l: { ua: -90, fa: -90, th: 150, sh: 160 }, move: 900, hold: 300, cap: t('On one hand, feet stacked', 'Op één hand, voeten op elkaar') },
      { a: { ua: 90, fa: 90, to: 153, th: 153, sh: 153, hd: -27 }, l: { ua: -90, fa: -90, th: 153, sh: 153 }, move: 900, hold: 2500, ring: true, cap: t('Hips up: one straight line', 'Heupen omhoog: één rechte lijn') }
    ]
  },
  leg_lift_bars: {
    root: 'hand', at: [36, rungY(9, 108)], ground: 108, scene: { wallbars: 36 },
    frames: [
      { a: { ua: -97, fa: -97, to: 90, th: 90, sh: 90, hd: -90 }, move: 1000, hold: 400, cap: t('Back against the bars, arms straight', 'Rug tegen het wandrek, armen gestrekt') },
      { a: { ua: -97, fa: -97, to: 90, th: 0, sh: 0, hd: -90 }, move: 1200, hold: 500, cap: t('Lift straight legs to an L', 'Til je gestrekte benen tot een L') }
    ]
  },
  toes_to_bar: {
    root: 'hand', at: [62, 20],
    frames: [
      { a: { ua: -90, fa: -90, to: 90, th: 88, sh: 88, hd: -75 }, move: 1200, hold: 300, cap: t('Hang, shoulders active', 'Hang, schouders actief') },
      { a: { ua: -80, fa: -80, to: 20, th: -124, sh: -124, hd: -95 }, move: 1200, hold: 300, cap: t('Straight legs up until the feet touch the bar', 'Gestrekte benen omhoog tot je voeten de stang raken') }
    ]
  },
  dip_leg_raise: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, move: 1000, hold: 300, cap: t('Support on the dip bar', 'Steun op de dipbar') },
      { a: { ...SUPPORT, th: -10, sh: 80 }, move: 1000, hold: 400, cap: t('Knees up to the chest', 'Knieën naar je borst') }
    ]
  },
  l_sit_tuck: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, move: 900, hold: 300, cap: t('Support, shoulders down', 'Steun, schouders omlaag') },
      { a: { ...SUPPORT, th: -25, sh: 95 }, move: 900, hold: 2500, ring: true, cap: t('Knees to the chest: hold', 'Knieën naar je borst: vasthouden') }
    ]
  },
  l_sit: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, move: 900, hold: 300, cap: t('Support, shoulders down', 'Steun, schouders omlaag') },
      { a: { ...SUPPORT, to: 96, th: 0, sh: 0 }, move: 1000, hold: 2500, ring: true, cap: t('Straight legs at horizontal: hold', 'Gestrekte benen horizontaal: vasthouden') }
    ]
  },
  straddle_l: {
    root: 'hip', at: [60, 62], view: 'front', ground: 108, scene: { posts: [[68.6, 62], [51.4, 62]] },
    frames: [
      { a: { ua: 70, fa: 70, to: 90, th: 95, sh: 92, hd: -90 }, move: 900, hold: 300, cap: t('Support, seen from the front', 'Steun, van voren gezien') },
      { a: { ua: 70, fa: 70, to: 90, th: 25, sh: 25, hd: -90 }, len: { th: 13, sh: 12 }, move: 1000, hold: 2500, ring: true, cap: t('Legs wide and high: hold', 'Benen wijd en hoog: vasthouden') }
    ]
  },
  reverse_leg_lift: {
    root: 'hand', at: [96, rungY(5, G)], ground: G, scene: { wallbars: 96 },
    frames: [
      { a: { ua: -22, fa: -22, to: 170, th: 90, sh: 90, hd: 0 }, move: 1000, hold: 300, cap: t('Hands on a rung, lean forward', 'Handen op een sport, leun naar voren') },
      { a: { ua: -22, fa: -22, to: 170, th: 175, sh: 175, hd: 0 }, move: 1200, hold: 400, cap: t('Lift straight legs back slowly', 'Til je gestrekte benen langzaam naar achteren') }
    ]
  },
  compression: {
    root: 'hip', at: [48, LIE_Y], ground: G,
    frames: [
      { a: { ua: 70, fa: 80, to: 88, th: 0, sh: 0, hd: -88 }, move: 800, hold: 300, cap: t('Sit tall, hands beside the knees', 'Zit rechtop, handen naast je knieën') },
      { a: { ua: 70, fa: 80, to: 82, th: -12, sh: -12, hd: -82 }, move: 800, hold: 1500, cap: t('Lift the heels without leaning back', 'Til je hielen op zonder achterover te leunen') }
    ]
  }
}
