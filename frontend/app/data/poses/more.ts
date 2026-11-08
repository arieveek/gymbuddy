import type { ExerciseId } from '../types'
import { rungY, type Angles, type PoseAnimation } from './engine'
import { FOOT_Y, G, LIE_Y, STAND, t } from './shared'

const DIP = { x0: 30, x1: 66, y: 60 }
const dipScene = { wallbars: 30, dipbar: DIP }
const SUPPORT: Angles = { ua: 90, fa: 90, to: 94, th: 92, sh: 95, hd: -95 }
/** Straight body from the toes at elevation `b` degrees, head to the right. */
const plankAngles = (b: number): Angles => ({ ua: 0, fa: 0, to: 180 - b, th: 180 - b, sh: 180 - b, hd: -b })
const HOLLOW: Angles = { to: 15, hd: 205, ua: 198, fa: 192, th: -15, sh: -15 }

export const MORE_POSES: Partial<Record<ExerciseId, PoseAnimation>> = {
  stick_sequence: {
    root: 'hip', at: [50, LIE_Y], ground: G,
    frames: [
      { a: { ua: -90, fa: -90, to: 90, th: 0, sh: 0, hd: -90 }, move: 900, hold: 1000, cap: t('Long sit, stick up, back long', 'Strekzit, stok omhoog, rug lang') },
      { a: { ua: -165, fa: -165, to: 90, th: 0, sh: 0, hd: -90 }, move: 1000, hold: 300, cap: t('Stick over to behind the back', 'Stok over je hoofd naar achter je rug') },
      { a: { ua: -90, fa: -90, to: 90, th: 0, sh: 0, hd: -90 }, move: 1000, hold: 200 },
      { a: HOLLOW, move: 1200, hold: 1500, ring: true, cap: t('Lie down in the hollow shape', 'Ga liggen in schelphouding') }
    ]
  },
  overhead_liftoff: {
    root: 'hip', at: [52, LIE_Y], ground: G,
    frames: [
      { a: { ua: 0, fa: 0, to: 180, th: 180, sh: 180, hd: 5 }, move: 800, hold: 300, cap: t('Face down, arms overhead, thumbs up', 'Op je buik, armen boven je hoofd, duimen omhoog') },
      { a: { ua: -12, fa: -12, to: 180, th: 180, sh: 180, hd: 5 }, move: 700, hold: 1500, cap: t('Lift the arms with the shoulder blades: hold 3', 'Til je armen op met je schouderbladen: 3 tellen') }
    ]
  },
  serratus_punch: {
    root: 'hip', at: [66, LIE_Y], ground: G, prop: 'dumbbell',
    frames: [
      { a: { ua: -90, fa: -90, to: 0, th: -40, sh: 70, hd: 180 }, move: 700, hold: 300, cap: t('On your back, arm straight up', 'Op je rug, arm recht omhoog') },
      { a: { ua: -90, fa: -90, to: 0, th: -40, sh: 70, hd: 180 }, len: { ua: 15.5 }, move: 600, hold: 500, cap: t('Punch up with the shoulder blade only', 'Stoot omhoog met alleen je schouderblad') }
    ]
  },
  towel_scrunch: {
    root: 'hip', at: [40, LIE_Y], ground: G,
    frames: [
      { a: { ua: 110, fa: 100, to: 85, th: -40, sh: 60, hd: -85 }, move: 600, hold: 300, cap: t('Foot flat on a towel', 'Voet plat op een handdoek') },
      { a: { ua: 110, fa: 100, to: 85, th: -40, sh: 58, hd: -85 }, len: { sh: 14 }, move: 500, hold: 400, cap: t('Pull the towel in with the toes', 'Trek de handdoek naar je toe met je tenen') }
    ]
  },
  clamshell: {
    root: 'hip', at: [64, 99], ground: G,
    frames: [
      { a: { ua: 5, fa: -60, to: 0, th: 40, sh: 170, hd: 180 }, l: { th: 40, sh: 170 }, move: 800, hold: 200, cap: t('On your side, knees bent', 'Op je zij, knieën gebogen') },
      { a: { ua: 5, fa: -60, to: 0, th: 40, sh: 170, hd: 180 }, l: { th: -10, sh: 140 }, move: 800, hold: 500, cap: t('Open the top knee like a shell', 'Open je bovenste knie als een schelp') }
    ]
  },
  support_shrugs: {
    root: 'hand', at: [48, DIP.y], ground: 108, scene: dipScene,
    frames: [
      { a: SUPPORT, len: { ua: 10 }, move: 900, hold: 300, cap: t('Let the shoulders sink to the ears', 'Laat je schouders naar je oren zakken') },
      { a: SUPPORT, len: { ua: 13.5 }, move: 900, hold: 500, cap: t('Push tall, arms stay straight', 'Duw je lang, armen blijven gestrekt') }
    ]
  },
  side_lean: {
    root: 'hand', at: [68.6, 62], view: 'front', ground: 108, scene: { posts: [[68.6, 62], [51.4, 62]] },
    frames: [
      { a: { ua: 71, fa: 71, to: 90, th: 92, sh: 90, hd: -90 }, l: { th: 88, sh: 90 }, pinL: { hand: [51.4, 62], bend: 1 }, move: 700, hold: 300, cap: t('Support, seen from the front', 'Steun, van voren gezien') },
      { a: { ua: 84, fa: 84, to: 90, th: 92, sh: 90, hd: -90 }, l: { th: 88, sh: 90 }, pinL: { hand: [51.4, 62], bend: 1 }, move: 900, hold: 900, cap: t('Shift the shoulders over one hand', 'Verplaats je schouders boven één hand') },
      { a: { ua: 71, fa: 71, to: 90, th: 92, sh: 90, hd: -90 }, l: { th: 88, sh: 90 }, pinL: { hand: [51.4, 62], bend: 1 }, move: 800, hold: 200 },
      { a: { ua: 59, fa: 59, to: 90, th: 92, sh: 90, hd: -90 }, l: { th: 88, sh: 90 }, pinL: { hand: [51.4, 62], bend: 1 }, move: 900, hold: 900, cap: t('Then over the other hand', 'Dan boven de andere hand') }
    ]
  },
  rear_support: {
    root: 'hand', at: [40, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 60, th: 0, sh: 0, hd: 240 }, move: 900, hold: 300, cap: t('Sit, hands behind, fingers forward', 'Zit, handen achter je, vingers naar voren') },
      { a: { ua: 90, fa: 90, to: 27, th: 27, sh: 27, hd: 207 }, move: 900, hold: 2500, ring: true, cap: t('Lift into one straight line, chest open', 'Til je op tot één rechte lijn, borst open') }
    ]
  },
  seal_walk: {
    root: 'hand', at: [62, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 160, th: 162, sh: 165, hd: -20 }, at: [58, FOOT_Y], move: 0, hold: 200, cap: t('Front support, feet on a towel, back round', 'Steun voorover, voeten op een handdoek, rug bol') },
      { a: { ua: 90, fa: 90, to: 160, th: 162, sh: 165, hd: -20 }, at: [82, FOOT_Y], move: 2000, ease: 'linear', hold: 200, cap: t('Walk forward on the hands', 'Loop vooruit op je handen') }
    ]
  },
  tuck_planche: {
    root: 'hand', at: [64, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 190, th: 50, sh: 100, hd: 5 }, move: 900, hold: 300, cap: t('Hands down, knees in', 'Handen neer, knieën in') },
      { a: { ua: 100, fa: 100, to: 190, th: 20, sh: 170, hd: 0 }, move: 900, hold: 2000, ring: true, cap: t('Lean forward, feet off, back round: hold', 'Leun naar voren, voeten los, rug bol: vasthouden') }
    ]
  },
  walkout: {
    root: 'foot', at: [30, FOOT_Y], ground: G, ik: { bend: 1 },
    frames: [
      { a: plankAngles(27), pin: { hand: [79, FOOT_Y], bend: 1 }, move: 1200, hold: 300, cap: t('Plank on the hands', 'Plank op je handen') },
      { a: { ua: 0, fa: 0, to: 202, th: 108.7, sh: 108.7, hd: 100 }, pin: { hand: [52, FOOT_Y], bend: 1 }, move: 1500, hold: 400, cap: t('Walk the hands back into a pike', 'Loop met je handen terug tot een pikhouding') }
    ]
  },
  bear_crawl: {
    root: 'hand', at: [66, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 175, th: 100, sh: 160, hd: -10 }, l: { th: 80, sh: 150 }, at: [60, FOOT_Y], move: 0, hold: 100, cap: t('Bear: knees just off the floor, back flat', 'Beer: knieën net boven de grond, rug vlak') },
      { a: { ua: 95, fa: 95, to: 175, th: 85, sh: 150, hd: -10 }, l: { th: 100, sh: 160 }, at: [72, FOOT_Y], move: 700, hold: 0 },
      { a: { ua: 85, fa: 85, to: 175, th: 100, sh: 160, hd: -10 }, l: { th: 80, sh: 150 }, at: [84, FOOT_Y], move: 700, hold: 200 }
    ]
  },
  stalder_hang: {
    root: 'hand', at: [96, rungY(8, G)], ground: G, scene: { wallbars: 96 }, ik: { foot: [93, rungY(3, G)], bend: 1 },
    frames: [
      { a: { ua: -60, fa: -60, to: 95, th: 0, sh: 0, hd: -80 }, move: 900, hold: 300, cap: t('Hands high, feet on a lower rung', 'Handen hoog, voeten op een lagere sport') },
      { a: { ua: -32, fa: -32, to: 112, th: 0, sh: 0, hd: -40 }, move: 1200, hold: 2500, ring: true, cap: t('Feet wide, legs straight, bottom back', 'Voeten wijd, benen gestrekt, billen naar achteren') }
    ]
  },
  lat_stretch: {
    root: 'foot', at: [30, LIE_Y], ground: G, scene: { bench: [[72, 82], [112, 82]] },
    frames: [
      { a: { ua: -33, fa: -90, to: 160, th: 90, sh: 180, hd: -10 }, move: 1000, hold: 300, cap: t('Kneel, elbows on the bench', 'Kniel, ellebogen op de bank') },
      { a: { ua: -46, fa: -100, to: 195, th: 90, sh: 180, hd: 20 }, move: 1300, hold: 2500, ring: true, cap: t('Let the chest sink', 'Laat je borst zakken') }
    ]
  },
  wall_leg_lift: {
    root: 'foot', at: [56, FOOT_Y], ground: G, scene: { wall: 50 },
    frames: [
      { a: { ...STAND, ua: 95, fa: 95 }, l: { th: 90, sh: 90 }, move: 900, hold: 300, cap: t('Back flat against the wall', 'Rug plat tegen de muur') },
      { a: { ...STAND, ua: 95, fa: 95 }, l: { th: -15, sh: -15 }, move: 1100, hold: 1500, cap: t('Lift a straight leg as high as you can', 'Til een gestrekt been zo hoog mogelijk op') }
    ]
  },
  straddle_lift: {
    root: 'hip', at: [60, 98], view: 'front', ground: G,
    frames: [
      { a: { ua: 60, fa: 80, to: 90, th: 10, sh: 10, hd: -90 }, move: 800, hold: 300, cap: t('Wide straddle, hands beside the knees (from the front)', 'Wijde spreidzit, handen naast je knieën (van voren)') },
      { a: { ua: 60, fa: 80, to: 90, th: -4, sh: -4, hd: -90 }, len: { th: 14, sh: 13 }, move: 700, hold: 800, cap: t('Lift both legs off the floor', 'Til beide benen van de grond') }
    ]
  },
  ankle_stretch: {
    root: 'foot', at: [84, FOOT_Y], ground: G, scene: { wall: 96 },
    frames: [
      { a: { ua: 80, fa: 80, to: 90, th: 20, sh: 105, hd: -88 }, l: { th: 105, sh: 180 }, move: 900, hold: 300, cap: t('Half kneel, toes a hand-width from the wall', 'Halfgeknield, tenen een handbreedte van de muur') },
      { a: { ua: 60, fa: 40, to: 88, th: 30, sh: 125, hd: -85 }, l: { th: 110, sh: 180 }, move: 1000, hold: 2000, ring: true, cap: t('Push the knee to the wall, heel down', 'Duw je knie naar de muur, hiel op de grond') }
    ]
  },
  quad_lean: {
    root: 'foot', at: [30, LIE_Y], ground: G,
    frames: [
      { a: { ua: 0, fa: 0, to: 90, th: 90, sh: 180, hd: -90 }, move: 1000, hold: 300, cap: t('Kneel tall, arms forward', 'Kniel rechtop, armen naar voren') },
      { a: { ua: -30, fa: -30, to: 60, th: 60, sh: 180, hd: 240 }, move: 1500, hold: 600, cap: t('Lean back in one straight line', 'Leun achterover in één rechte lijn') }
    ]
  },
  pogo_hops: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: { ...STAND, ua: 100, fa: 90 }, len: { sh: 17 }, at: [60, FOOT_Y], move: 220, hold: 40, cap: t('Small quick hops, body tight', 'Kleine snelle sprongetjes, lichaam strak') },
      { a: { ...STAND, ua: 100, fa: 90 }, len: { sh: 17 }, at: [60, 93], move: 220, hold: 0 }
    ]
  },
  line_hops: {
    root: 'foot', at: [52, FOOT_Y], ground: G, scene: { posts: [[60, G]] },
    frames: [
      { a: { ...STAND, to: 95, th: 80, sh: 100, ua: 60, fa: 40 }, at: [50, FOOT_Y], move: 250, hold: 150, cap: t('Hop over the line and back', 'Spring over de lijn en terug') },
      { a: { ...STAND, ua: 60, fa: 40 }, at: [60, 92], move: 200, hold: 0 },
      { a: { ...STAND, to: 95, th: 80, sh: 100, ua: 60, fa: 40 }, at: [70, FOOT_Y], move: 200, hold: 150 },
      { a: { ...STAND, ua: 60, fa: 40 }, at: [60, 92], move: 250, hold: 0 }
    ]
  },
  single_leg_balance: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: { ...STAND, ua: 40, fa: 30 }, l: { th: 90, sh: 90 }, move: 800, hold: 300, cap: t('Stand tall', 'Sta rechtop') },
      { a: { ...STAND, ua: 30, fa: 10, th: 88 }, l: { th: -5, sh: 90 }, move: 900, hold: 3000, ring: true, cap: t('One leg, knee soft: 30 seconds', 'Eén been, knie licht gebogen: 30 seconden') }
    ]
  }
}
