import type { ExerciseId } from '../types'
import { rungY, type Angles, type PoseAnimation, type PoseFrame } from './engine'
import { FOOT_Y, G, LIE_Y, STAND, t } from './shared'

/** Handstand on the floor (root hand), body vertical; the natural front faces left. */
const HANDSTAND: Angles = { ua: 90, fa: 90, to: -88, th: -82, sh: -82, hd: 95 }
const ARMS_UP: Angles = { ...STAND, ua: -90, fa: -90 }
/** Squat: knees forward, hips back, chest up, arms forward. */
const SQUAT: Angles = { ua: 0, fa: 0, to: 110, th: 15, sh: 115, hd: -80 }
const CROUCH_ARMS_BACK: Angles = { ...SQUAT, ua: 130, fa: 130 }
const AIR: Angles = { ...STAND, ua: -80, fa: -80, sh: 92, th: 91 }

/** Standing with arms up, with the root at the hands (so a frame can move into a handstand). */
const standByHands = (x: number): PoseFrame['at'] => [x, FOOT_Y - 80]

const kickUp = (x: number, cap: boolean): PoseFrame[] => [
  { a: { ...ARMS_UP, hd: -90 }, at: standByHands(x - 16), move: 900, hold: 500, cap: cap ? t('Arms up, step into a lunge', 'Armen omhoog, stap in een uitval') : undefined },
  { a: { ua: 90, fa: 90, to: -130, th: -150, sh: -150, hd: 100 }, l: { th: 100, sh: 100 }, at: [x, FOOT_Y], move: 1000, hold: 100, cap: cap ? t('Hands down, kick one leg up', 'Handen neer, zwaai één been omhoog') : undefined },
  { a: HANDSTAND, l: { th: -82, sh: -82 }, at: [x, FOOT_Y], move: 700, hold: 2500, ring: true, cap: cap ? t('Legs together, push tall: hold', 'Benen tegen elkaar, duw je lang: vasthouden') : undefined },
  { a: { ua: 90, fa: 90, to: -130, th: -150, sh: -150, hd: 100 }, l: { th: 100, sh: 100 }, at: [x, FOOT_Y], move: 900, hold: 100, cap: cap ? t('Step down one leg at a time', 'Stap één been tegelijk naar beneden') : undefined }
]

export const HANDSTAND_LEGS_FLEX_POSES: Partial<Record<ExerciseId, PoseAnimation>> = {
  releve: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: ARMS_UP, move: 900, hold: 300, cap: t('Arms up by the ears', 'Armen omhoog langs je oren') },
      { a: ARMS_UP, len: { sh: 18 }, move: 800, hold: 2500, ring: true, cap: t('High on the toes, body tight: hold', 'Hoog op je tenen, lichaam strak: vasthouden') }
    ]
  },
  t_scale: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: { ...ARMS_UP }, l: { th: 120, sh: 110, ua: -90, fa: -90 }, move: 1000, hold: 400, cap: t('Lunge, arms up', 'Uitval, armen omhoog') },
      { a: { ua: 0, fa: 0, to: 180, th: 90, sh: 90, hd: 0 }, l: { th: 180, sh: 180, ua: 0, fa: 0 }, move: 1100, hold: 2000, ring: true, cap: t('Tip into a T: arms, body and leg in one line', 'Kantel tot een T: armen, lichaam en been in één lijn') }
    ]
  },
  shoulder_plank: {
    root: 'foot', at: [24, FOOT_Y], ground: G, ik: { hand: [96, FOOT_Y], bend: 1 },
    frames: [
      { a: { ua: 0, fa: 0, to: 163, th: 163, sh: 163, hd: -17 }, hold: 3500, ring: true, cap: t('Hands far forward, push the floor away: hold', 'Handen ver naar voren, duw de grond weg: vasthouden') }
    ]
  },
  handstand_back: {
    root: 'hand', at: [64, FOOT_Y], ground: G, scene: { wall: 72.5 },
    frames: [
      { a: { ...HANDSTAND, to: -85, th: -80, sh: -80, hd: 92 }, hold: 3500, ring: true, cap: t('Heels on the wall, push tall: hold', 'Hielen tegen de muur, duw je lang: vasthouden') }
    ]
  },
  wall_walk: {
    root: 'hand', at: [88, FOOT_Y], ground: G, scene: { wallbars: 30 },
    frames: [
      { a: { ua: 90, fa: 90, to: 161.5, th: 0, sh: 0, hd: -18 }, at: [88, FOOT_Y], pin: { foot: [32, rungY(1, G)], bend: -1 }, move: 1200, hold: 600, cap: t('Push-up position, feet on a low rung', 'Opdrukhouding, voeten op een lage sport') },
      { a: { ua: 90, fa: 90, to: -120, th: 0, sh: 0, hd: 80 }, at: [62, FOOT_Y], pin: { foot: [32, rungY(4, G)], bend: -1 }, move: 1600, hold: 200, cap: t('Walk the feet up and the hands in', 'Loop met je voeten omhoog en je handen naar binnen') },
      { a: { ...HANDSTAND, to: -95, hd: 92 }, at: [42, FOOT_Y], pin: { foot: [33, rungY(9, G)], bend: -1 }, move: 1600, hold: 2000, ring: true, cap: t('Chest to the bars, only as high as you control', 'Buik naar het wandrek, maar zo hoog als je kunt controleren') },
      { a: { ua: 90, fa: 90, to: -120, th: 0, sh: 0, hd: 80 }, at: [62, FOOT_Y], pin: { foot: [32, rungY(4, G)], bend: -1 }, move: 1400, hold: 200, cap: t('Walk back down', 'Loop weer terug') }
    ]
  },
  handstand_kick: {
    root: 'hand', at: [78, FOOT_Y], ground: G, scene: { wallbars: 88 },
    frames: kickUp(78, true)
  },
  handstand_free: {
    root: 'hand', at: [66, FOOT_Y], ground: G,
    frames: kickUp(66, true)
  },
  pike_up: {
    root: 'hand', at: [66, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 90, fa: 90, to: 196, th: 98, sh: 98, hd: 100 }, move: 1000, hold: 400, cap: t('Pike stand, hands on the floor', 'Pikstand, handen op de grond') },
      { a: { ua: 100, fa: 100, to: -110, th: 120, sh: 115, hd: 100 }, move: 1300, hold: 1000, cap: t('Shoulders forward, hips over the hands', 'Schouders naar voren, heupen boven je handen') }
    ]
  },
  straddle_press: {
    root: 'hand', at: [70, FOOT_Y], view: 'front', ground: G,
    frames: [
      { a: { ua: 63, fa: 63, to: -90, th: 75, sh: 75, hd: 90 }, len: { to: 9, th: 17, sh: 16 }, move: 1100, hold: 400, cap: t('Straddle stand, hands down (from the front)', 'Spreidstand, handen neer (van voren)') },
      { a: { ua: 72, fa: 72, to: -90, th: -8, sh: -8, hd: 90 }, move: 1400, hold: 300, cap: t('Lean forward, lift the legs wide', 'Leun naar voren, til je benen gespreid op') },
      { a: { ua: 80, fa: 80, to: -90, th: -88, sh: -88, hd: 90 }, move: 1200, hold: 1500, ring: true, cap: t('Legs together in handstand', 'Benen samen in handstand') },
      { a: { ua: 72, fa: 72, to: -90, th: -8, sh: -8, hd: 90 }, move: 1200, hold: 200, cap: t('Lower back down with control', 'Gecontroleerd terug') }
    ]
  },

  squat: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: { ...STAND, ua: 0, fa: 0 }, move: 1100, hold: 300, cap: t('Feet hip-width, arms forward', 'Voeten op heupbreedte, armen naar voren') },
      { a: SQUAT, move: 1200, hold: 300, cap: t('Sit back and down, chest up', 'Zak naar achteren en omlaag, borst omhoog') }
    ]
  },
  squat_jump: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: { ...STAND }, at: [60, FOOT_Y], move: 600, hold: 300, cap: t('Stand tall', 'Sta rechtop') },
      { a: CROUCH_ARMS_BACK, at: [60, FOOT_Y], move: 600, hold: 100, cap: t('Squat, arms back', 'Zak, armen naar achteren') },
      { a: AIR, at: [60, 80], move: 350, hold: 100, cap: t('Jump straight up, body tight', 'Spring recht omhoog, lichaam strak') },
      { a: SQUAT, at: [60, FOOT_Y], move: 350, hold: 500, cap: t('Land softly', 'Land zacht') }
    ]
  },
  gym_jumps: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: CROUCH_ARMS_BACK, at: [60, FOOT_Y], move: 600, hold: 100, cap: t('Straight jump', 'Strekspronk') },
      { a: AIR, at: [60, 82], move: 350, hold: 100 },
      { a: SQUAT, at: [60, FOOT_Y], move: 350, hold: 400 },
      { a: CROUCH_ARMS_BACK, at: [60, FOOT_Y], move: 400, hold: 100, cap: t('Tuck jump', 'Hurksprong') },
      { a: { ua: 20, fa: 60, to: 85, th: -20, sh: 120, hd: -85 }, at: [60, 78], move: 350, hold: 150 },
      { a: SQUAT, at: [60, FOOT_Y], move: 350, hold: 500, cap: t('Stick every landing', 'Elke landing staan') }
    ]
  },
  stick_landing: {
    root: 'foot', at: [60, FOOT_Y], ground: G,
    frames: [
      { a: CROUCH_ARMS_BACK, at: [60, FOOT_Y], move: 700, hold: 100, cap: t('Small jump', 'Kleine sprong') },
      { a: AIR, at: [60, 86], move: 300, hold: 50 },
      { a: { ...SQUAT, ua: -10, fa: -10 }, at: [60, FOOT_Y], move: 300, hold: 2000, ring: true, cap: t('Land on both feet, knees soft: freeze', 'Land op beide voeten, knieën zacht: stilstaan') },
      { a: { ...STAND }, at: [60, FOOT_Y], move: 700, hold: 300 }
    ]
  },
  long_jump: {
    root: 'foot', at: [30, FOOT_Y], ground: G,
    frames: [
      { a: CROUCH_ARMS_BACK, at: [24, FOOT_Y], move: 0, hold: 500, cap: t('Swing the arms back', 'Zwaai je armen naar achteren') },
      { a: { ua: -40, fa: -40, to: 60, th: 60, sh: 70, hd: -60 }, at: [58, 84], move: 450, hold: 0, cap: t('Jump forward as far as you can', 'Spring zo ver mogelijk naar voren') },
      { a: { ...SQUAT, ua: -10, fa: -10 }, at: [92, FOOT_Y], move: 450, hold: 1300, cap: t('Land and hold', 'Land en blijf staan') }
    ]
  },
  split_squat: {
    root: 'foot', at: [74, FOOT_Y], ground: G, scene: { wallbars: 30 },
    frames: [
      { a: { ua: 95, fa: 95, to: 90, th: 52, sh: 90, hd: -90 }, pinL: { foot: [32, rungY(2, G) - 1], bend: 1 }, move: 1000, hold: 300, cap: t('Back foot on a knee-high rung', 'Achterste voet op een sport op kniehoogte') },
      { a: { ua: 95, fa: 95, to: 90, th: -6, sh: 90, hd: -90 }, pinL: { foot: [32, rungY(2, G) - 1], bend: 1 }, move: 1200, hold: 300, cap: t('Lower the back knee, front shin upright', 'Laat je achterste knie zakken, voorste scheen rechtop') }
    ]
  },
  pistol_assisted: {
    root: 'foot', at: [70, FOOT_Y], ground: G, scene: { wallbars: 98 }, ik: { hand: [98, rungY(5, G)], bend: 1 },
    frames: [
      { a: { ...STAND, hd: -85 }, l: { th: 60, sh: 60 }, move: 1100, hold: 300, cap: t('Hold a rung, one leg forward', 'Houd een sport vast, één been naar voren') },
      { a: { ua: 0, fa: 0, to: 110, th: 20, sh: 120, hd: -75 }, l: { th: -5, sh: 0 }, move: 1400, hold: 300, cap: t('Squat on one leg, hands only help', 'Zak op één been, je handen helpen alleen') }
    ]
  },
  calf_raise: {
    root: 'foot', at: [90, rungY(1, G) - 2], ground: G, scene: { wallbars: 96 }, ik: { hand: [96, rungY(6, G)], bend: 1 },
    frames: [
      { a: { ...STAND, to: 92, th: 91, sh: 95, hd: -88 }, len: { sh: 13.5 }, move: 900, hold: 300, cap: t('Balls of the feet on the lowest rung, heels down', 'Voorvoeten op de onderste sport, hielen omlaag') },
      { a: { ...STAND, to: 92, th: 91, sh: 92, hd: -88 }, len: { sh: 17.5 }, move: 900, hold: 500, cap: t('Rise as high as you can', 'Kom zo hoog mogelijk op je tenen') }
    ]
  },
  glute_bridge: {
    root: 'foot', at: [78, FOOT_Y], ground: G,
    frames: [
      { a: { ua: 0, fa: 0, to: -8, th: -40, sh: 70, hd: 180 }, l: { th: -40, sh: -40 }, move: 1000, hold: 300, cap: t('One foot flat, the other leg straight', 'Eén voet plat, het andere been gestrekt') },
      { a: { ua: -10, fa: 0, to: -36, th: 18, sh: 80, hd: 150 }, l: { th: -36, sh: -36 }, move: 1000, hold: 600, cap: t('Push the hips up with the glutes', 'Duw je heupen omhoog met je billen') }
    ]
  },
  nordic: {
    root: 'foot', at: [34, LIE_Y], ground: G, scene: { wallbars: 30 },
    frames: [
      { a: { ua: 60, fa: -120, to: 90, th: 90, sh: 180, hd: -90 }, move: 1200, hold: 300, cap: t('Kneel, heels under the lowest rung', 'Kniel, hielen onder de onderste sport') },
      { a: { ua: 60, fa: -120, to: 125, th: 125, sh: 180, hd: -55 }, move: 1600, ease: 'linear', hold: 0, cap: t('Lower forward as slowly as you can', 'Zak zo langzaam mogelijk naar voren') },
      { a: { ua: 70, fa: 70, to: 155, th: 155, sh: 180, hd: -25 }, move: 1400, ease: 'linear', hold: 500, cap: t('Catch yourself with the hands', 'Vang jezelf op met je handen') }
    ]
  },

  hamstring_rung: {
    root: 'foot', at: [66, FOOT_Y], ground: G, scene: { wallbars: 98 },
    frames: [
      { a: { ...STAND, ua: 70, fa: 70 }, pinL: { foot: [96, rungY(4, G)], bend: -1 }, move: 1000, hold: 300, cap: t('Heel on a rung at hip height', 'Hiel op een sport op heuphoogte') },
      { a: { ua: 50, fa: 40, to: 130, th: 90, sh: 90, hd: -30 }, pinL: { foot: [96, rungY(4, G)], bend: -1 }, move: 1200, hold: 3000, ring: true, cap: t('Hinge forward with a flat back', 'Buig naar voren met een rechte rug') }
    ]
  },
  front_split: {
    root: 'hip', at: [60, 85], ground: G,
    frames: [
      { a: { ua: -90, fa: -90, to: 90, th: 29, sh: 29, hd: -90 }, l: { th: 120, sh: 180 }, at: [60, 85], move: 1000, hold: 500, cap: t('Half split: back knee down', 'Halve spagaat: achterste knie op de grond') },
      { a: { ua: -90, fa: -90, to: 90, th: 2, sh: 0, hd: -90 }, l: { th: 178, sh: 180 }, at: [60, 99], move: 1500, hold: 3000, ring: true, cap: t('Slide down only as far as feels OK', 'Schuif maar zo ver als goed voelt') }
    ]
  },
  butterfly: {
    root: 'hip', at: [60, 97], view: 'front', ground: G,
    frames: [
      { a: { ua: 80, fa: 100, to: 90, th: -15, sh: 160, hd: -90 }, move: 1000, hold: 300, cap: t('Soles together, knees out (from the front)', 'Voetzolen tegen elkaar, knieën naar buiten (van voren)') },
      { a: { ua: 80, fa: 100, to: 90, th: 12, sh: 172, hd: -90 }, move: 1500, hold: 2500, ring: true, cap: t('Let the knees sink slowly', 'Laat je knieën langzaam zakken') }
    ]
  },
  middle_split: {
    root: 'hip', at: [60, 66], view: 'front', ground: false,
    frames: [
      { a: { ua: 20, fa: 10, to: -90, th: -90, sh: -90, hd: 90 }, move: 1000, hold: 400, cap: t('On your back, legs up the wall (seen from above)', 'Op je rug, benen omhoog tegen de muur (van boven gezien)') },
      { a: { ua: 20, fa: 10, to: -90, th: -25, sh: -25, hd: 90 }, move: 2000, hold: 3000, ring: true, cap: t('Let the legs open slowly to the sides', 'Laat je benen langzaam naar opzij zakken') }
    ]
  },
  pike_stretch: {
    root: 'hip', at: [46, LIE_Y], ground: G,
    frames: [
      { a: { ua: 20, fa: 10, to: 90, th: 0, sh: 0, hd: -90 }, move: 1000, hold: 300, cap: t('Sit tall, legs straight', 'Zit rechtop, benen gestrekt') },
      { a: { ua: 15, fa: 5, to: 148, th: 0, sh: 0, hd: -12 }, move: 1500, hold: 3000, ring: true, cap: t('Fold forward from the hips', 'Vouw naar voren vanuit je heupen') }
    ]
  },
  pike_hang: {
    root: 'foot', at: [92, rungY(1, G) - 2], ground: G, scene: { wallbars: 100 }, ik: { hand: [100, rungY(6, G)], bend: 1 },
    frames: [
      { a: { ...STAND, to: 92, hd: -85 }, move: 1000, hold: 300, cap: t('Feet on the lowest rung, hold a rung at waist height', 'Voeten op de onderste sport, houd een sport op middelhoogte vast') },
      { a: { ua: 0, fa: 0, to: 200, th: 55, sh: 55, hd: 60 }, move: 1500, hold: 3000, ring: true, cap: t('Lean back, arms and legs straight', 'Leun achterover, armen en benen gestrekt') }
    ]
  },
  hip_flexor: {
    root: 'foot', at: [74, FOOT_Y], ground: G, scene: { wallbars: 30 },
    frames: [
      { a: { ua: 95, fa: 95, to: 92, th: -3, sh: 90, hd: -90 }, pinL: { foot: [33, rungY(1, G) - 1], bend: 1 }, move: 1000, hold: 300, cap: t('Kneel, back foot on a low rung', 'Kniel, achterste voet op een lage sport') },
      { a: { ua: -100, fa: -100, to: 100, th: -12, sh: 90, hd: -95 }, pinL: { foot: [33, rungY(1, G) - 1], bend: 1 }, move: 1200, hold: 3000, ring: true, cap: t('Tuck the pelvis, hips gently forward', 'Kantel je bekken, heupen rustig naar voren') }
    ]
  },
  side_bend: {
    root: 'foot', at: [74, FOOT_Y], view: 'front', ground: G, scene: { ladder: [22, 38] },
    frames: [
      { a: { ua: -100, fa: -100, to: 90, th: 90, sh: 90, hd: -90 }, l: { ua: -80, fa: -80, th: 185, sh: 180 }, move: 1000, hold: 300, cap: t('Leg on a rung, arms up (from the front)', 'Been op een sport, armen omhoog (van voren)') },
      { a: { ua: -150, fa: -170, to: 60, th: 90, sh: 90, hd: -130 }, l: { ua: -160, fa: 180, th: 185, sh: 180 }, move: 1200, hold: 2500, ring: true, cap: t('Bend sideways over the leg', 'Buig zijwaarts over je been') }
    ]
  },
  thoracic: {
    root: 'foot', at: [42, FOOT_Y], ground: G, scene: { wallbars: 30 }, ik: { hand: [31, rungY(9, G)], bend: 1 },
    frames: [
      { a: { ...STAND, to: 92, th: 92, sh: 92, hd: -88 }, move: 1000, hold: 300, cap: t('Back to the bars, hands on a high rung', 'Rug naar het wandrek, handen op een hoge sport') },
      { a: { ua: 0, fa: 0, to: 70, th: 85, sh: 90, hd: -125 }, move: 1200, hold: 2500, ring: true, cap: t('Lean the upper back over a rung', 'Leun met je bovenrug over een sport') }
    ]
  },
  bridge: {
    root: 'foot', at: [80, FOOT_Y], ground: G, ik: { hand: [36, FOOT_Y], bend: -1 },
    frames: [
      { a: { ua: 0, fa: 0, to: -5, th: -40, sh: 70, hd: 180 }, move: 1200, hold: 400, cap: t('Feet flat, hands by the ears', 'Voeten plat, handen naast je oren') },
      { a: { ua: 0, fa: 0, to: -12, th: 61.5, sh: 61.5, hd: 110 }, move: 1400, hold: 2500, ring: true, cap: t('Push up, shoulders over the hands', 'Duw op, schouders boven je handen') }
    ]
  },
  kicks: {
    root: 'foot', at: [56, FOOT_Y], ground: G,
    frames: [
      { a: { ...STAND, ua: 40, fa: 40 }, l: { th: 90, sh: 90 }, move: 700, hold: 300, cap: t('Stand tall, toes pointed', 'Sta rechtop, tenen gestrekt') },
      { a: { ...STAND, ua: 40, fa: 40 }, l: { th: -45, sh: -45 }, move: 600, hold: 200, cap: t('Kick a straight leg up, controlled', 'Zwaai een gestrekt been omhoog, gecontroleerd') },
      { a: { ...STAND, ua: 40, fa: 40 }, l: { th: 90, sh: 90 }, move: 700, hold: 200 }
    ]
  }
}
