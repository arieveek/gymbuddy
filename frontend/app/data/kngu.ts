import type { ExerciseId, Text } from './types'

/**
 * KNGU physical-preparation standards ("fysieke voorbereiding") per age band, from the
 * Technische Leerlijn Turnen Heren 2021 (pages 7–18 overview, 20/28/37/46 descriptions).
 * These are end goals for the age band, not daily doses. "club" items need club equipment
 * (rope, parallel bars, pommel horse, foam rolls) or a coach.
 */
export const AGE_BANDS = ['7-8', '9-10', '11-12', '13-14'] as const
export type AgeBand = typeof AGE_BANDS[number]

export interface KnguGoal {
  id: string
  name: Text
  standard: Text
  where: 'home' | 'club'
  exercise?: ExerciseId
}

const t = (en: string, nl: string): Text => ({ en, nl })

export const KNGU_GOALS: Record<AgeBand, KnguGoal[]> = {
  '7-8': [
    { id: '7-1', where: 'home', exercise: 'stick_sequence', name: t('Stick series', 'Reeks met stok'), standard: t('3 s long sit arms up, disloque, 3 s hollow with arms by the ears; hands move at most 10 cm', '3” strekzit armen omhoog, disloque, 3” bolle schelphouding armen tegen de oren; handen max. 10 cm verplaatsen') },
    { id: '7-2', where: 'home', exercise: 'stalder_hang', name: t('Straddle hang on the wall bars', 'Spreidhang aan het wandrek (stalderhang)'), standard: t('5 s, feet 2 rungs below the hands, a little wider than the shoulders, arms and legs straight', '5”, voeten 2 sporten onder de handen, iets breder dan de schouders, armen en benen gestrekt') },
    { id: '7-3', where: 'home', exercise: 'bridge', name: t('Bridge with feet raised', 'Brug met voeten op een verhoging'), standard: t('5 s, feet on 20 cm, shoulders over the hands, arms and legs straight', '5”, voeten op 20 cm, schouders boven de handen, armen en benen gestrekt') },
    { id: '7-4', where: 'home', name: t('Tuck handstand against a wall', 'Gehurkte handstand tegen een wand'), standard: t('10 s, shins against a wall or mat, knees to the chest, shoulders pushed out', '10”, onderbenen tegen een wand of mat, knieën tegen de borst, schouders uitgeduwd') },
    { id: '7-5', where: 'home', exercise: 'front_split', name: t('Split preparation in a lunge', 'Voorbereiding spagaat in uitvalspas'), standard: t('10 s each side, front leg at 90°, back knee on 20 cm, no hands on the floor', '10” links en rechts, voorste been 90°, achterste knie op 20 cm, handen niet op de vloer') },
    { id: '7-6', where: 'home', exercise: 'tuck_planche', name: t('Tuck planche', 'Gehurkte bovenbalans'), standard: t('5 s, arms straight, feet off, shins parallel to the floor', '5”, armen gestrekt, voeten los, onderbenen evenwijdig met de grond') },
    { id: '7-7', where: 'club', name: t('Rope climb 2 m', 'Touwklimmen 2 m'), standard: t('Up with legs allowed, down very slowly without legs', 'Omhoog met benen mag, zeer traag omlaag zonder benen') },
    { id: '7-8', where: 'home', exercise: 'wall_walk', name: t('Handstand, belly to the wall', 'Handstand met de buik tegen een wand'), standard: t('10 s, hands within 20 cm of the wall, hips straight', '10”, handen binnen 20 cm van de wand, heupen recht') }
  ],
  '9-10': [
    { id: '9-1', where: 'home', exercise: 'stick_sequence', name: t('Physical series', 'Fysieke reeks'), standard: t('3 s arch lift, 3 s hollow, 3 s long sit, disloque, 3 s straddle sit belly down, pike fold', '3” opheffen in buiklig, 3” bolle schelphouding, 3” strekzit, disloque, 3” stalderzit buik op de vloer, vouwzit') },
    { id: '9-2', where: 'home', exercise: 'wall_walk', name: t('Straddle handstand, belly to the wall', 'Handstand gespreid met de buik tegen een mat'), standard: t('5 s, legs straddled horizontally against the wall, hands within 25 cm', '5”, benen horizontaal gespreid tegen de wand, handen binnen 25 cm') },
    { id: '9-3', where: 'home', exercise: 'straddle_l', name: t('Spitz gespreid', 'Spitz gespreid'), standard: t('3 s L-sit, 3 s high straddle with legs vertical, 3 s L-sit', '3” hoeksteun, 3” gespreide hoge hoeksteun met benen verticaal, 3” hoeksteun') },
    { id: '9-4', where: 'club', exercise: 'arch_hold', name: t('Courbette lying down', 'Courbette in lig'), standard: t('3 courbettes face down on two foam rolls, arms by the ears, glutes and belly tight', '3 x courbette in buiklig op 2 softrollen, armen tegen de oren, billen en buik opspannen') },
    { id: '9-5', where: 'home', exercise: 'front_split', name: t('Two splits', '2 spagaten'), standard: t('Two splits of choice on one line, one arm up, 3 s each', '2 spagaten naar keuze op 1 lijn, 1 arm omhoog, 3” elk') },
    { id: '9-6', where: 'club', exercise: 'straddle_press', name: t('Straddle L, press to handstand, back', 'Spreidhoeksteun, heffen tot handstand, terug'), standard: t('3 s straddle L, press to 3 s handstand, back to 3 s straddle L, back rounded throughout', '3” spreidhoeksteun, heffen tot 3” handstand, terug tot 3” spreidhoeksteun, rug de hele tijd bol') },
    { id: '9-7', where: 'home', exercise: 'tuck_planche', name: t('Tuck planche, knees behind the arms', 'Gehurkte bovenbalans, knieën achter de armen'), standard: t('3 s with arms straight and the knees behind the arms, shoulders rounded', '3” met gestrekte armen en de knieën achter de armen, schouders bol') },
    { id: '9-8', where: 'home', exercise: 'shoulder_stand_bars', name: t('Shoulder stand at the wall bars', 'Schouderstand aan wandrek'), standard: t('From the candlestick, lower to 30° above the floor, hold 3 s, come back up', 'Vanuit kaarshouding zakken tot 30° van de vloer, 3” houden en terug omhoog') }
  ],
  '11-12': [
    { id: '11-1', where: 'home', exercise: 'stick_sequence', name: t('Physical series', 'Fysieke reeks'), standard: t('Long sit, disloque, 3 s straddle sit 90° belly flat, pike fold, 3 s bridge, kick-over', 'Langzit, disloque, 3” spreidzit 90° onderbuik plat, vouwzit, 3” brug, kick over') },
    { id: '11-2', where: 'club', exercise: 'straddle_press', name: t('Straddle L and press', 'Spreidhoeksteun en heffen'), standard: t('3 s straddle L, press to 3 s handstand, back to 3 s straddle L, lift out to stand', '3” spreidhoeksteun, heffen tot 3” handstand, terug tot 3” spreidhoeksteun, uitheffen tot stand') },
    { id: '11-3', where: 'club', name: t('Rope climb 4 m', '4 m touwklimmen'), standard: t('Without feet in under 10 seconds', 'Zonder voeten in minder dan 10 seconden') },
    { id: '11-4', where: 'club', name: t('Chest roll to handstand', 'Buikrol tot handstand'), standard: t('From kneeling, roll through the arch to a correct handstand', 'Vanuit kniezit buikrol in overstrekte houding tot juiste handstand') },
    { id: '11-5', where: 'home', exercise: 'middle_split', name: t('Splits left, right and middle', 'Spagaat links, rechts en midden'), standard: t('3 s each, hips and shoulders square, one arm up', '3” elk, bekken en schouders recht, 1 arm op') },
    { id: '11-6', where: 'club', name: t('Straddle planche', 'Bovenbalans gespreid'), standard: t('5 s, arms straight, legs level with the back', '5”, armen gestrekt, benen op gelijke hoogte met de rug') },
    { id: '11-7', where: 'club', exercise: 'l_sit', name: t('Manna', 'Mana'), standard: t('3 s L-sit, 3 s manna with the back horizontal, 3 s L-sit', '3” hoeksteun, 3” mana met de rug horizontaal, 3” hoeksteun') },
    { id: '11-8', where: 'club', exercise: 'stick_landing', name: t('Standing jump onto 90 cm', 'Sprong uit stand op 90 cm'), standard: t('From standing still, land in a squat with knees and feet straight', 'Uit stilstand, landen in squathouding met knieën en voeten recht') }
  ],
  '13-14': [
    { id: '13-1', where: 'home', exercise: 'stick_sequence', name: t('Physical series', 'Fysieke reeks'), standard: t('As at 11–12, including bridge and kick-over', 'Zoals bij 11–12, met brug en kick over') },
    { id: '13-2', where: 'club', name: t('Press from straddle L in undergrip', 'Heffen uit spreidhoeksteun in ondergreep'), standard: t('On one bar: 3 s straddle L, press to 3 s handstand, back', 'Aan 1 legger: 3” spreidhoeksteun, heffen tot 3” handstand, terug') },
    { id: '13-3', where: 'club', name: t('Rope climb 4 m', '4 m touwklimmen'), standard: t('Without feet in under 8 seconds', 'Zonder voeten in minder dan 8 seconden') },
    { id: '13-4', where: 'club', name: t('Swing up to planche on the pommel horse', 'Opzwaai tot bovenbalans aan paard met beugels'), standard: t('3 s planche, back and hips straight', '3” bovenbalans, rug en bekken recht') },
    { id: '13-5', where: 'home', exercise: 'middle_split', name: t('Splits left, right and middle', 'Spagaat links, rechts en midden'), standard: t('3 s each, hips and shoulders square, one arm up', '3” elk, bekken en schouders recht, 1 arm op') },
    { id: '13-6', where: 'club', name: t('Straddle planche in undergrip', 'Bovenbalans in ondergreep'), standard: t('5 s on one bar', '5” aan 1 legger') },
    { id: '13-7', where: 'club', name: t('Manna and press between the handles', 'Mana en heffen tussen de steun'), standard: t('3 s L-sit, 3 s manna, press with legs together to 3 s handstand, back', '3” hoeksteun, 3” mana, heffen met benen samen tot 3” handstand, terug') },
    { id: '13-8', where: 'club', name: t('Bent-arm press to handstand', 'Heffen tot handstand met gebogen armen'), standard: t('From L-sit, body straight, arms fully bent, press to handstand', 'Vanuit hoeksteun, lichaam gestrekt, armen volledig gebogen, heffen tot handstand') }
  ]
}

/** Exercises to go easy on during a growth spurt (high impact, or forcing flexibility while it drops). */
export const GROWTH_CAUTION: ExerciseId[] = [
  'squat_jump', 'gym_jumps', 'long_jump', 'pogo_hops', 'line_hops', 'nordic', 'quad_lean', 'front_split', 'middle_split', 'pike_hang'
]
