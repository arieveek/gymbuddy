import type { Exercise } from '../types'
import { t } from './text'

const LANDING = t('Land softly on the balls of the feet, knees over the toes (not falling inwards).', 'Land zacht op je voorvoeten, knieën boven je tenen (niet naar binnen).')

export const LEGS: Exercise[] = [
  {
    id: 'squat', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Squat', 'Squat (kniebuiging)'),
    cues: [
      t('Feet hip-width, weight on the heels', 'Voeten op heupbreedte, gewicht op je hielen'),
      t('Sit back and down, chest up, knees over the toes', 'Zak naar achteren en omlaag, borst omhoog, knieën boven je tenen'),
      t('Only as deep as you control; 2 × 10', 'Maar zo diep als je kunt controleren; 2 × 10')
    ],
    why: t('The base for jumping and landing.', 'De basis voor springen en landen.'),
    sources: ['ghq-home', 'rbwf-routine'],
    harder: 'split_squat'
  },
  {
    id: 'squat_jump', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Squat jump', 'Hurksprong'),
    cues: [
      t('Squat down, swing the arms', 'Zak in de squat, zwaai met je armen'),
      t('Jump straight up, body long and tight', 'Spring recht omhoog, lichaam lang en strak'),
      t('Land softly back into the squat; 5–8 jumps', 'Land zacht terug in de squat; 5–8 sprongen')
    ],
    why: t('Jumping power for floor and vault.', 'Springkracht voor vloer en sprong.'),
    safety: LANDING,
    sources: ['gymmax', 'tilley-legs']
  },
  {
    id: 'gym_jumps', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Gymnastics jumps', 'Turnsprongen'),
    cues: [
      t('Straight jump, tuck jump, straddle jump, half turn', 'Strekspronk, hurksprong, spreidsprong, halve draai'),
      t('Straight legs and pointed toes in the air', 'Gestrekte benen en tenen in de lucht'),
      t('Stick every landing; 3 of each', 'Elke landing staan; 3 van elk')
    ],
    why: t('Body tension and shapes in the air.', 'Lichaamsspanning en houdingen in de lucht.'),
    safety: LANDING,
    sources: ['ghq-home']
  },
  {
    id: 'stick_landing', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Stick landing', 'Landing staan'),
    cues: [
      t('Small jump, land on both feet at the same time', 'Kleine sprong, land op beide voeten tegelijk'),
      t('Knees soft and apart, arms forward, freeze for 2 seconds', 'Knieën zacht en uit elkaar, armen naar voren, 2 tellen stilstaan'),
      t('Quiet landing = good landing; 8 reps', 'Stille landing = goede landing; 8 keer')
    ],
    why: t('Good landings protect the knees (ACL).', 'Goede landingen beschermen de knieën (kruisband).'),
    safety: LANDING,
    sources: ['aap-gymnastics']
  },
  {
    id: 'long_jump', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Standing long jump', 'Verspringen uit stand'),
    cues: [
      t('Feet together, swing the arms back', 'Voeten tegen elkaar, zwaai je armen naar achteren'),
      t('Jump forward as far as you can, arms forward', 'Spring zo ver mogelijk naar voren, armen naar voren'),
      t('Land and hold; goal: further than your own height', 'Land en blijf staan; doel: verder dan je eigen lengte')
    ],
    why: t('Power for the vault run and floor.', 'Kracht voor de aanloop van sprong en vloer.'),
    safety: LANDING,
    sources: ['gymbc-kickstart']
  },
  {
    id: 'split_squat', type: 'reps', category: 'legs', equipment: ['wallbars'], difficulty: 2,
    name: t('Split squat, rear foot on a rung', 'Split squat met achterste voet op een sport'),
    cues: [
      t('Back foot on a knee-height rung, front foot forward', 'Achterste voet op een sport op kniehoogte, voorste voet naar voren'),
      t('Lower the back knee, front shin stays upright', 'Laat je achterste knie zakken, voorste scheen blijft rechtop'),
      t('8 per leg', '8 per been')
    ],
    why: t('Single-leg strength for take-offs and landings.', 'Kracht op één been voor afzetten en landen.'),
    sources: ['peak-swedish', 'rbwf-routine'],
    easier: 'squat', harder: 'pistol_assisted'
  },
  {
    id: 'pistol_assisted', type: 'reps', category: 'legs', equipment: ['wallbars'], difficulty: 3,
    name: t('Assisted pistol at the wall bars', 'Pistol squat met hulp van het wandrek'),
    cues: [
      t('Face the bars, hold a rung, one leg out in front', 'Gezicht naar het wandrek, houd een sport vast, één been naar voren'),
      t('Squat down on one leg as deep as you control', 'Zak op één been zo diep als je kunt controleren'),
      t('Use the hands only for help; 5 per leg', 'Gebruik je handen alleen als hulp; 5 per been')
    ],
    why: t('Strong single-leg control for punching and landing.', 'Sterke controle op één been voor afzetten en landen.'),
    sources: ['breaking-muscle', 'rbwf-routine'],
    easier: 'split_squat'
  },
  {
    id: 'calf_raise', type: 'reps', category: 'legs', equipment: ['wallbars'], difficulty: 1,
    name: t('Calf raises on a rung', 'Kuitheffen op een sport'),
    cues: [
      t('Balls of the feet on the lowest rung, hands on a higher one', 'Voorvoeten op de onderste sport, handen op een hogere'),
      t('Lower the heels, then rise as high as you can', 'Laat je hielen zakken en kom zo hoog mogelijk op je tenen'),
      t('Slow, ankles straight (not rolling out); 12–15 reps', 'Langzaam, enkels recht (niet naar buiten kantelen); 12–15 keer')
    ],
    why: t('Strong ankles for landings and relevé on beam.', 'Sterke enkels voor landingen en relevé op de balk.'),
    sources: ['peak-swedish', 'mobilesport']
  },
  {
    id: 'glute_bridge', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Single-leg glute bridge', 'Bekken heffen op één been'),
    cues: [
      t('On your back, one foot flat, the other leg straight up', 'Op je rug, één voet plat, het andere been gestrekt omhoog'),
      t('Push the hips up by squeezing the glutes', 'Duw je heupen omhoog door je billen aan te spannen'),
      t('Back stays flat, not arched; 8 per leg', 'Rug blijft recht, niet hol; 8 per been')
    ],
    why: t('Hip strength for tumbling; protects the lower back.', 'Heupkracht voor acrobatiek; beschermt de onderrug.'),
    sources: ['ghq-home'],
    harder: 'nordic'
  },
  {
    id: 'nordic', type: 'reps', category: 'legs', equipment: ['wallbars', 'floor'], difficulty: 3,
    name: t('Nordic curl', 'Nordic curl'),
    cues: [
      t('Kneel on a mat, heels hooked under the lowest rung', 'Kniel op een mat, hielen onder de onderste sport'),
      t('Body straight, lower forward as slowly as you can', 'Lichaam recht, zak zo langzaam mogelijk naar voren'),
      t('Catch yourself with the hands; 3–5 reps', 'Vang jezelf op met je handen; 3–5 keer')
    ],
    why: t('Strong hamstrings protect the knees.', 'Sterke hamstrings beschermen de knieën.'),
    safety: t('Hard on the hamstrings: few reps, and only once a week to start.', 'Zwaar voor de hamstrings: weinig herhalingen, en in het begin maar één keer per week.'),
    sources: ['aap-gymnastics', 'rbwf-routine'],
    easier: 'glute_bridge'
  }
]
