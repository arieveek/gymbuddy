import type { ExerciseId, ExerciseType, Text } from './types'

export interface Exercise {
  id: ExerciseId
  name: Text
  type: ExerciseType
  cues: Text[]
  why?: Text
  tempo?: Text
  /** Only offered to adult profiles. */
  adultOnly?: boolean
}

const t = (en: string, nl: string): Text => ({ en, nl })

/** Training content, ported from docs/bar-strong.html. Dutch text to be checked by the coach. */
export const EXERCISES: Record<ExerciseId, Exercise> = {
  warmup: {
    id: 'warmup', type: 'list',
    name: t('Warm-up', 'Warming-up'),
    cues: [
      t('20 arm circles forwards, 20 backwards', '20 armcirkels naar voren, 20 naar achteren'),
      t('10 shoulder shrugs up and down', '10 keer schouders ophalen en laten zakken'),
      t('10 wrist circles each way', '10 polscirkels elke kant op'),
      t('5 slow cat-cow stretches on hands and knees', '5 langzame kat-koe-oefeningen op handen en knieën'),
      t('10 jumping jacks', '10 jumping jacks')
    ]
  },
  hang: {
    id: 'hang', type: 'hold',
    name: t('Dead hang', 'Dode hang'),
    cues: [
      t('Grab the bar, hands shoulder-width, thumbs around the bar', 'Pak de stang op schouderbreedte, duimen om de stang'),
      t('Arms straight, shoulders gently pulled down (not up by the ears)', 'Armen gestrekt, schouders licht omlaag (niet bij je oren)'),
      t('Legs together, toes pointed, belly tight', 'Benen tegen elkaar, tenen gestrekt, buik aangespannen')
    ],
    why: t('Builds grip and shoulder strength for everything on the bar.', 'Bouwt grip- en schouderkracht op voor alles aan de stang.')
  },
  scap: {
    id: 'scap', type: 'reps',
    name: t('Scap pulls', 'Schouderbladtrekken'),
    cues: [
      t('Start in a dead hang with straight arms', 'Begin in een dode hang met gestrekte armen'),
      t('Pull shoulders down and back so the body rises a few centimetres', 'Trek je schouders omlaag en naar achteren, zodat je lichaam een paar centimeter stijgt'),
      t('Keep elbows straight the whole time', 'Houd je ellebogen de hele tijd gestrekt'),
      t('Pause 1 second at the top, then lower slowly', 'Houd 1 tel vast bovenaan en zak dan langzaam terug')
    ],
    why: t('Teaches the first part of every pull-up and protects the shoulders.', 'Leert het eerste deel van elke pull-up en beschermt de schouders.')
  },
  hollow: {
    id: 'hollow', type: 'hold',
    name: t('Hollow hold', 'Holle houding'),
    cues: [
      t('Lie on your back, lower back pressed into the floor', 'Lig op je rug, onderrug tegen de grond gedrukt'),
      t('Arms by your ears, legs straight and squeezed together', 'Armen langs je oren, benen gestrekt en tegen elkaar'),
      t('Lift shoulders and feet off the floor, toes pointed', 'Til schouders en voeten van de grond, tenen gestrekt'),
      t('If the back lifts, bend the knees or raise the legs higher', 'Komt je rug omhoog? Buig je knieën of houd je benen hoger')
    ],
    why: t("The gymnast's body shape. A strong hollow stops kicking and swinging.", 'De basishouding van een turner. Een sterke holle houding voorkomt schoppen en zwaaien.')
  },
  row: {
    id: 'row', type: 'reps',
    name: t('Bar rows', 'Roeien aan lage stang'),
    cues: [
      t('Under a low bar, rings or a sturdy table edge', 'Onder een lage stang, ringen of een stevige tafelrand'),
      t('Body straight like a plank from head to heels', 'Lichaam recht als een plank van hoofd tot hielen'),
      t('Pull your chest to the bar, elbows close to your sides', 'Trek je borst naar de stang, ellebogen langs je lichaam'),
      t('Lower with control', 'Gecontroleerd terug zakken')
    ],
    why: t('Builds the pulling muscles with less than full bodyweight.', 'Bouwt de trekspieren op met minder dan je hele lichaamsgewicht.')
  },
  flexed: {
    id: 'flexed', type: 'hold',
    name: t('Chin-over-bar hold', 'Kin boven de stang'),
    cues: [
      t('Step up on a box or jump so your chin is above the bar', 'Stap op een kist of spring zodat je kin boven de stang is'),
      t('Hold there, elbows tight to your sides', 'Houd vast, ellebogen dicht bij je lichaam'),
      t('Keep the hollow shape, legs together', 'Blijf in de holle houding, benen tegen elkaar'),
      t('Step down safely when time is up', 'Stap veilig af als de tijd om is')
    ],
    why: t('Makes the hardest part of the pull-up, the top, feel strong.', 'Maakt het zwaarste deel van de pull-up, bovenaan, sterk.')
  },
  neg: {
    id: 'neg', type: 'reps',
    name: t('Slow lowers', 'Langzaam zakken'),
    tempo: t('Count 5 on the way down', 'Tel tot 5 tijdens het zakken'),
    cues: [
      t('Jump or step up to chin over the bar', 'Spring of stap omhoog tot je kin boven de stang is'),
      t('Lower as slowly as you can, count to 5', 'Zak zo langzaam mogelijk, tel tot 5'),
      t('Go all the way to straight arms', 'Zak helemaal tot je armen gestrekt zijn'),
      t('Put feet down, reset, repeat', 'Voeten neer, opnieuw beginnen')
    ],
    why: t('Lowering slowly is the fastest way to build a first pull-up.', 'Langzaam zakken is de snelste weg naar je eerste pull-up.')
  },
  box: {
    id: 'box', type: 'reps',
    name: t('Box-assisted pull-ups', 'Pull-ups met kist'),
    cues: [
      t('Put a box or chair under the bar, feet resting on it', 'Zet een kist of stoel onder de stang, voeten erop'),
      t('Pull with your arms, push only a little with your legs', 'Trek met je armen, duw maar een beetje met je benen'),
      t('Chin over the bar, then lower slowly', 'Kin boven de stang, dan langzaam zakken'),
      t('Use less leg help as you get stronger', 'Gebruik minder hulp van je benen naarmate je sterker wordt')
    ],
    why: t('Practises the full movement with a little help.', 'Oefent de hele beweging met een beetje hulp.')
  },
  half: {
    id: 'half', type: 'hold',
    name: t('90° hold', '90°-houding'),
    cues: [
      t('Get to the top, then lower until elbows are at a right angle', 'Kom naar boven en zak tot je ellebogen haaks staan'),
      t('Hold there, shoulders down, hollow body', 'Houd vast, schouders omlaag, holle houding'),
      t('This is the sticky point: owning it makes reps easier', 'Dit is het lastigste punt: als je dit beheerst, gaan herhalingen makkelijker')
    ],
    why: t('Strengthens the middle of the pull-up, where most kids get stuck.', 'Versterkt het midden van de pull-up, waar de meeste kinderen vastlopen.')
  },
  tuck: {
    id: 'tuck', type: 'reps',
    name: t('Hanging tuck raises', 'Knieheffen in hang'),
    cues: [
      t('Hang with straight arms and active shoulders', 'Hang met gestrekte armen en actieve schouders'),
      t('Bring knees up to the chest without swinging', 'Breng je knieën naar je borst zonder te zwaaien'),
      t('Lower slowly until legs are straight', 'Zak langzaam tot je benen gestrekt zijn')
    ],
    why: t('Core strength on the bar for kips and casts.', 'Rompkracht aan de stang voor kips en opzwaaien.')
  },
  pullup: {
    id: 'pullup', type: 'reps',
    name: t('Strict pull-ups', 'Strikte pull-ups'),
    cues: [
      t('Overhand grip, hands shoulder-width', 'Bovenhandse greep, handen op schouderbreedte'),
      t('Start from straight arms every rep', 'Begin elke herhaling met gestrekte armen'),
      t('Hollow body, legs together, toes pointed, no kicking', 'Holle houding, benen tegen elkaar, tenen gestrekt, niet schoppen'),
      t('Chin clearly over the bar, then lower with control', 'Kin duidelijk boven de stang, dan gecontroleerd zakken')
    ],
    why: t('The main event.', 'Het hoofdonderdeel.')
  },
  chin: {
    id: 'chin', type: 'reps',
    name: t('Chin-ups', 'Chin-ups'),
    cues: [
      t('Palms facing you, hands shoulder-width', 'Handpalmen naar je toe, handen op schouderbreedte'),
      t('Same strict form as pull-ups', 'Dezelfde strikte techniek als bij pull-ups'),
      t('Pull until chin is over the bar', 'Trek op tot je kin boven de stang is')
    ],
    why: t('Adds more biceps work and more good reps.', 'Meer werk voor de biceps en meer goede herhalingen.')
  },
  pause: {
    id: 'pause', type: 'reps',
    name: t('Pause pull-ups', 'Pull-ups met pauze'),
    tempo: t('Hold 2 seconds at the top', 'Bovenaan 2 tellen vasthouden'),
    cues: [
      t('A strict pull-up', 'Een strikte pull-up'),
      t('Freeze with chin over the bar for 2 seconds', 'Houd 2 tellen stil met je kin boven de stang'),
      t('Lower slowly', 'Langzaam zakken')
    ],
    why: t('Builds control and strength at the top.', 'Bouwt controle en kracht bovenaan op.')
  },
  lsit: {
    id: 'lsit', type: 'reps',
    name: t('L-sit pull-ups', 'L-zit pull-ups'),
    cues: [
      t('Hang, then lift straight legs in front to make an L', 'Hang en til je gestrekte benen naar voren tot een L'),
      t('Keep legs up and toes pointed through the whole pull-up', 'Houd je benen omhoog en tenen gestrekt tijdens de hele pull-up'),
      t('If legs drop, bend knees into a tuck instead', 'Zakken je benen? Trek je knieën dan op in plaats daarvan')
    ],
    why: t('Competition-level strength and body control together.', 'Wedstrijdkracht en lichaamscontrole in één.')
  },
  weighted: {
    id: 'weighted', type: 'reps', adultOnly: true,
    name: t('Weighted pull-ups', 'Pull-ups met gewicht'),
    cues: [
      t('Add 2–5 kg with a belt or backpack', 'Voeg 2–5 kg toe met een riem of rugzak'),
      t('Same strict form; drop the weight if form breaks', 'Dezelfde strikte techniek; minder gewicht als de techniek wegvalt'),
      t('Chin over the bar, lower with control', 'Kin boven de stang, gecontroleerd zakken')
    ],
    why: t('Keeps strength growing once bodyweight reps are easy.', 'Houdt je kracht groeiend als pull-ups met lichaamsgewicht makkelijk zijn.')
  }
}

/** Order on the Moves screen. */
export const MOVE_ORDER: ExerciseId[] = [
  'warmup', 'hang', 'scap', 'hollow', 'row', 'flexed', 'neg', 'box', 'half', 'tuck', 'pullup', 'chin', 'pause', 'lsit', 'weighted'
]
