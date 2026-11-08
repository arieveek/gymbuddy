import type { Exercise } from '../types'
import { t } from './text'

export const PUSH: Exercise[] = [
  {
    id: 'pushup_incline', type: 'reps', category: 'push', equipment: ['wallbars'], difficulty: 1,
    name: t('Incline push-ups', 'Schuine opdrukken'),
    cues: [
      t('Hands on a rung at hip height, walk the feet back', 'Handen op een sport op heuphoogte, loop met je voeten naar achteren'),
      t('Body straight from head to heels', 'Lichaam recht van hoofd tot hielen'),
      t('Chest to the rung, elbows back along the body; lower rung = harder', 'Borst naar de sport, ellebogen langs je lichaam naar achteren; lagere sport = zwaarder')
    ],
    why: t('First pushing strength, easy on the wrists.', 'Eerste duwkracht, licht voor de polsen.'),
    sources: ['rbwf-routine', 'ghq-home'],
    harder: 'pushup'
  },
  {
    id: 'pushup', type: 'reps', category: 'push', equipment: ['floor'], difficulty: 1,
    name: t('Push-ups', 'Opdrukken'),
    cues: [
      t('Hands under the shoulders, body in one straight line', 'Handen onder de schouders, lichaam in één rechte lijn'),
      t('Lower as far as you can control, elbows back', 'Zak zo ver als je kunt controleren, ellebogen naar achteren'),
      t('Push away until the arms are straight; on the knees is fine to start', 'Duw weg tot je armen gestrekt zijn; op de knieën mag in het begin')
    ],
    why: t('Pushing and support strength for floor, vault and bars.', 'Duw- en steunkracht voor vloer, sprong en brug (toestel).'),
    sources: ['ghq-home', 'gymmax', 'rbwf-routine'],
    easier: 'pushup_incline', harder: 'triceps_pushup'
  },
  {
    id: 'triceps_pushup', type: 'reps', category: 'push', equipment: ['floor'], difficulty: 2,
    name: t('Triceps push-ups', 'Smalle opdrukken'),
    cues: [
      t('Hands under the shoulders, elbows point back to the feet', 'Handen onder de schouders, ellebogen wijzen naar je voeten'),
      t('Elbows brush the ribs on the way down', 'Ellebogen schuren langs je ribben tijdens het zakken'),
      t('Straight body; test goal 10 in 30 seconds', 'Recht lichaam; testdoel 10 in 30 seconden')
    ],
    why: t('Support strength for mushroom/pommel horse and parallel bars.', 'Steunkracht voor paddenstoel/voltige en brug (toestel).'),
    sources: ['gymbc-kickstart'],
    easier: 'pushup'
  },
  {
    id: 'support_hold', type: 'hold', category: 'push', equipment: ['dipbar'], difficulty: 1,
    name: t('Support hold', 'Steunhouding'),
    cues: [
      t('Hands on the dip bar, jump or step up to straight arms', 'Handen op de dipbar, spring of stap op tot gestrekte armen'),
      t('Push the shoulders down: long neck', 'Duw je schouders omlaag: lange nek'),
      t('Body slightly hollow, legs together; build to 60 seconds', 'Lichaam licht bol (schelphouding), benen tegen elkaar; werk naar 60 seconden')
    ],
    why: t('The base of every support skill on bars and mushroom/pommel horse.', 'De basis van elke steunoefening op brug (toestel) en paddenstoel/voltige.'),
    safety: t('Check the dip bar hooks sit fully on the rung.', 'Controleer dat de haken van de dipbar helemaal op de sport zitten.'),
    sources: ['rbwf-support', 'beyond-balance'],
    harder: 'dip_negative'
  },
  {
    id: 'dip_negative', type: 'reps', category: 'push', equipment: ['dipbar'], difficulty: 2,
    name: t('Dip negatives', 'Langzaam zakken in steun'),
    tempo: t('Count 3–5 on the way down', 'Tel 3–5 tijdens het zakken'),
    cues: [
      t('Start in the support hold', 'Begin in de steunhouding'),
      t('Lower slowly, elbows going back', 'Zak langzaam, ellebogen naar achteren'),
      t('Stop when the upper arm is level; step back up', 'Stop als je bovenarm horizontaal is; stap weer omhoog')
    ],
    why: t('Builds the strength for full dips.', 'Bouwt de kracht op voor hele dips.'),
    sources: ['rbwf-routine'],
    easier: 'support_hold', harder: 'dip'
  },
  {
    id: 'dip', type: 'reps', category: 'push', equipment: ['dipbar'], difficulty: 2,
    name: t('Dips', 'Dips'),
    cues: [
      t('From the support hold, lower with elbows going back', 'Zak vanuit steun met je ellebogen naar achteren'),
      t('Until the upper arm is about horizontal, not deeper', 'Tot je bovenarm ongeveer horizontaal is, niet dieper'),
      t('Push back up to straight arms, shoulders down', 'Duw terug tot gestrekte armen, schouders omlaag')
    ],
    why: t('Pressing strength for parallel bars and rings.', 'Duwkracht voor brug (toestel) en ringen.'),
    safety: t('Stop if the front of the shoulder hurts.', 'Stop als de voorkant van je schouder pijn doet.'),
    sources: ['peak-swedish', 'rbwf-routine'],
    easier: 'dip_negative'
  },
  {
    id: 'bench_dip', type: 'reps', category: 'push', equipment: ['bench'], difficulty: 1,
    name: t('Bench dips', 'Dips op de bank'),
    cues: [
      t('Hands on the edge of the bench behind you, legs bent', 'Handen op de rand van de bank achter je, benen gebogen'),
      t('Lower by bending the elbows straight back', 'Zak door je ellebogen recht naar achteren te buigen'),
      t('Push up again; straighter legs make it harder', 'Duw weer op; meer gestrekte benen maakt het zwaarder')
    ],
    why: t('An easier dip to build arm strength.', 'Een makkelijkere dip om armkracht op te bouwen.'),
    sources: ['rbwf-routine']
  },
  {
    id: 'pike_pushup', type: 'reps', category: 'push', equipment: ['bench'], difficulty: 2,
    name: t('Pike push-ups', 'Opdrukken in pikhouding'),
    cues: [
      t('Feet on the bench, hands on the floor, hips high', 'Voeten op de bank, handen op de grond, heupen hoog'),
      t('Lower the head forward between the hands', 'Laat je hoofd naar voren tussen je handen zakken'),
      t('Push back up; elbows stay over the wrists', 'Duw weer op; ellebogen blijven boven je polsen')
    ],
    why: t('Overhead pressing strength for the press handstand.', 'Duwkracht boven het hoofd voor de handstand opdrukken.'),
    sources: ['breaking-muscle', 'usag-tops']
  },
  {
    id: 'planche_lean', type: 'hold', category: 'push', equipment: ['floor'], difficulty: 2,
    name: t('Planche lean', 'Planche leun'),
    cues: [
      t('Push-up position, fingers turned slightly out', 'Opdrukhouding, vingers iets naar buiten'),
      t('Lean the shoulders forward past the hands, arms locked', 'Leun met je schouders voorbij je handen, armen gestrekt'),
      t('Upper back rounded, body hollow; hold 10–20 seconds', 'Bovenrug bol, lichaam bol; houd 10–20 seconden vast')
    ],
    why: t('Builds straight-arm strength for planche and press.', 'Bouwt kracht met gestrekte armen op voor planche en opdrukken.'),
    sources: ['antranik'],
    harder: 'frog_stand'
  },
  {
    id: 'frog_stand', type: 'hold', category: 'push', equipment: ['floor'], difficulty: 2,
    name: t('Frog stand', 'Kikkerstand'),
    cues: [
      t('Squat, hands flat on the floor shoulder-width', 'Hurk, handen plat op de grond op schouderbreedte'),
      t('Knees on the backs of the elbows', 'Knieën op de achterkant van je ellebogen'),
      t('Lean forward until the feet lift; hold 10 seconds', 'Leun naar voren tot je voeten loskomen; houd 10 seconden vast')
    ],
    why: t('Balance on the hands, a step toward handstands and planche.', 'Balans op je handen, een stap naar handstand en planche.'),
    safety: t('A pillow in front of the head for the first tries.', 'Een kussen voor je hoofd bij de eerste pogingen.'),
    sources: ['antranik'],
    easier: 'planche_lean', harder: 'tuck_planche'
  }
]
