import type { Exercise } from '../types'
import { t } from './text'

export const PULL: Exercise[] = [
  {
    id: 'hang', type: 'hold', category: 'pull', equipment: ['pullupbar', 'wallbars'], difficulty: 1,
    name: t('Dead hang', 'Strekhang (dode hang)'),
    cues: [
      t('Grab the bar, hands shoulder-width, thumbs around the bar', 'Pak de stang op schouderbreedte, duimen om de stang'),
      t('Arms straight, shoulders gently pulled down (not up by the ears)', 'Armen gestrekt, schouders licht omlaag (niet bij je oren)'),
      t('Legs together, toes pointed, belly tight', 'Benen tegen elkaar, tenen gestrekt, buik aangespannen')
    ],
    why: t('Builds grip and shoulder strength for everything on the bar.', 'Bouwt grip- en schouderkracht op voor alles aan de stang.'),
    sources: ['peak-stall', 'beyond-balance', 'rbwf-routine'],
    easier: 'assisted_hang', harder: 'arch_hang'
  },
  {
    id: 'arch_hang', type: 'hold', category: 'pull', equipment: ['pullupbar'], difficulty: 1,
    name: t('Active hang', 'Actieve hang'),
    cues: [
      t('Start in a dead hang', 'Begin in een strekhang'),
      t('Pull the shoulder blades down and together, chest lifts a little', 'Trek je schouderbladen omlaag en naar elkaar, je borst komt iets omhoog'),
      t('Arms stay straight; hold 10–20 seconds', 'Armen blijven gestrekt; houd 10–20 seconden vast')
    ],
    why: t('Teaches shoulder control in the hang, the start of every pull.', 'Leert controle over de schouders in de hang, het begin van elke trek.'),
    sources: ['rbwf-routine'],
    easier: 'hang'
  },
  {
    id: 'row', type: 'reps', category: 'pull', equipment: ['wallbars'], difficulty: 1,
    name: t('Bar rows', 'Roeien aan het wandrek'),
    cues: [
      t('Hold a rung at hip height, walk the feet forward', 'Pak een sport op heuphoogte en loop met je voeten naar voren'),
      t('Body straight like a plank from head to heels', 'Lichaam recht als een plank van hoofd tot hielen'),
      t('Pull your chest to the rung, elbows close to your sides', 'Trek je borst naar de sport, ellebogen langs je lichaam'),
      t('Lower with control; feet further forward makes it harder', 'Gecontroleerd terug; voeten verder naar voren maakt het zwaarder')
    ],
    why: t('Builds the pulling muscles with less than full bodyweight.', 'Bouwt de trekspieren op met minder dan je hele lichaamsgewicht.'),
    sources: ['peak-stall', 'rbwf-routine'],
    harder: 'flexed'
  },
  {
    id: 'flexed', type: 'hold', category: 'pull', equipment: ['pullupbar'], difficulty: 1,
    name: t('Chin-over-bar hold', 'Kin boven de stang'),
    cues: [
      t('Step up on a rung or jump so your chin is above the bar', 'Stap op een sport of spring zodat je kin boven de stang is'),
      t('Hold there, elbows tight to your sides', 'Houd vast, ellebogen dicht bij je lichaam'),
      t('Keep the hollow shape, legs together', 'Blijf in de schelphouding, benen tegen elkaar'),
      t('Step down safely when time is up', 'Stap veilig af als de tijd om is')
    ],
    why: t('Makes the hardest part of the pull-up, the top, feel strong.', 'Maakt het zwaarste deel van de pull-up, bovenaan, sterk.'),
    sources: ['gymbc-kickstart'],
    easier: 'row', harder: 'neg'
  },
  {
    id: 'neg', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 2,
    name: t('Slow lowers', 'Langzaam zakken'),
    tempo: t('Count 5 on the way down', 'Tel tot 5 tijdens het zakken'),
    cues: [
      t('Jump or step up to chin over the bar', 'Spring of stap omhoog tot je kin boven de stang is'),
      t('Lower as slowly as you can, count to 5', 'Zak zo langzaam mogelijk, tel tot 5'),
      t('Go all the way to straight arms', 'Zak helemaal tot je armen gestrekt zijn'),
      t('Put feet down, reset, repeat', 'Voeten neer, opnieuw beginnen')
    ],
    why: t('Lowering slowly is the fastest way to build a first pull-up.', 'Langzaam zakken is de snelste weg naar je eerste pull-up.'),
    sources: ['ghq-home', 'rbwf-routine'],
    easier: 'flexed', harder: 'pullup'
  },
  {
    id: 'box', type: 'reps', category: 'pull', equipment: ['pullupbar', 'wallbars'], difficulty: 2,
    name: t('Assisted pull-ups', 'Pull-ups met hulp van de benen'),
    cues: [
      t('Feet on a low rung of the wall bars (or a box) under the bar', 'Voeten op een lage sport van het wandrek (of een kist) onder de stang'),
      t('Pull with your arms, push only a little with your legs', 'Trek met je armen, duw maar een beetje met je benen'),
      t('Chin over the bar, then lower slowly', 'Kin boven de stang, dan langzaam zakken'),
      t('Use less leg help as you get stronger', 'Gebruik minder hulp van je benen naarmate je sterker wordt')
    ],
    why: t('Practises the full movement with a little help.', 'Oefent de hele beweging met een beetje hulp.'),
    sources: ['rbwf-routine']
  },
  {
    id: 'half', type: 'hold', category: 'pull', equipment: ['pullupbar'], difficulty: 2,
    name: t('90° hold', '90°-houding'),
    cues: [
      t('Get to the top, then lower until elbows are at a right angle', 'Kom naar boven en zak tot je ellebogen haaks staan'),
      t('Hold there, shoulders down, hollow body', 'Houd vast, schouders omlaag, schelphouding'),
      t('This is the sticky point: owning it makes reps easier', 'Dit is het lastigste punt: als je dit beheerst, gaan herhalingen makkelijker')
    ],
    why: t('Strengthens the middle of the pull-up, where most kids get stuck.', 'Versterkt het midden van de pull-up, waar de meeste kinderen vastlopen.'),
    sources: ['eurofit'], commonPractice: true
  },
  {
    id: 'pullup', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 2,
    name: t('Strict pull-ups', 'Strikte pull-ups'),
    cues: [
      t('Overhand grip, hands shoulder-width', 'Bovenhandse greep, handen op schouderbreedte'),
      t('Start from straight arms every rep', 'Begin elke herhaling met gestrekte armen'),
      t('Hollow body, legs together, toes pointed, no kicking', 'Schelphouding, benen tegen elkaar, tenen gestrekt, niet schoppen'),
      t('Chin clearly over the bar, then lower with control', 'Kin duidelijk boven de stang, dan gecontroleerd zakken')
    ],
    why: t('The main event: bars, rings and rope all need it.', 'Het hoofdonderdeel: rek, ringen en touw hebben het allemaal nodig.'),
    sources: ['ghq-home', 'ghq-principles', 'gymbc-kickstart', 'kngu-leerlijn'],
    easier: 'neg', harder: 'pause'
  },
  {
    id: 'chin', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 2,
    name: t('Chin-ups', 'Chin-ups'),
    cues: [
      t('Palms facing you, hands shoulder-width', 'Handpalmen naar je toe, handen op schouderbreedte'),
      t('Same strict form as pull-ups', 'Dezelfde strikte techniek als bij pull-ups'),
      t('Pull until chin is over the bar', 'Trek op tot je kin boven de stang is')
    ],
    why: t('Adds more biceps work and more good reps.', 'Meer werk voor de biceps en meer goede herhalingen.'),
    sources: ['ghq-home']
  },
  {
    id: 'pause', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 3,
    name: t('Pause pull-ups', 'Pull-ups met pauze'),
    tempo: t('Hold 2 seconds at the top', 'Bovenaan 2 tellen vasthouden'),
    cues: [
      t('A strict pull-up', 'Een strikte pull-up'),
      t('Freeze with chin over the bar for 2 seconds', 'Houd 2 tellen stil met je kin boven de stang'),
      t('Lower slowly', 'Langzaam zakken')
    ],
    why: t('Builds control and strength at the top.', 'Bouwt controle en kracht bovenaan op.'),
    sources: [], commonPractice: true,
    easier: 'pullup'
  },
  {
    id: 'l_hang', type: 'hold', category: 'pull', equipment: ['pullupbar', 'wallbars'], difficulty: 2,
    name: t('L-hang', 'L-hang'),
    cues: [
      t('Hang with straight arms, shoulders active', 'Hang met gestrekte armen, schouders actief'),
      t('Lift straight legs to horizontal, together, toes pointed', 'Til je gestrekte benen tot horizontaal, tegen elkaar, tenen gestrekt'),
      t('Back flat, head neutral; aim for 20 seconds', 'Rug vlak, hoofd neutraal; werk naar 20 seconden')
    ],
    why: t('The body position for rings, high bar and the rope climb.', 'De lichaamshouding voor ringen, rek en touwklimmen.'),
    sources: ['gymbc-kickstart'],
    harder: 'lsit'
  },
  {
    id: 'lsit', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 3,
    name: t('L-sit pull-ups', 'L-zit pull-ups'),
    cues: [
      t('Hang, then lift straight legs in front to make an L', 'Hang en til je gestrekte benen naar voren tot een L'),
      t('Keep legs up and toes pointed through the whole pull-up', 'Houd je benen omhoog en tenen gestrekt tijdens de hele pull-up'),
      t('If legs drop, bend knees into a tuck instead', 'Zakken je benen? Trek je knieën dan op in plaats daarvan')
    ],
    why: t('Competition-level strength and body control together; the home version of the piked rope climb.', 'Wedstrijdkracht en lichaamscontrole in één; de thuisversie van touwklimmen met gestrekte benen.'),
    sources: ['gymbc-kickstart', 'usag-tops'],
    easier: 'l_hang'
  },
  {
    id: 'front_lever_tuck', type: 'hold', category: 'pull', equipment: ['pullupbar'], difficulty: 3,
    name: t('Tuck front lever', 'Gehurkte voorlig'),
    cues: [
      t('From a hang, pull the knees to the chest', 'Trek vanuit hang je knieën naar je borst'),
      t('Lean back with straight arms until the back is horizontal', 'Leun achterover met gestrekte armen tot je rug horizontaal is'),
      t('Hold 5–10 seconds, shoulders pushed down', 'Houd 5–10 seconden vast, schouders omlaag gedrukt')
    ],
    why: t('Back and core strength for bars and still rings.', 'Rug- en rompkracht voor rek en stilstaande ringen.'),
    sources: ['antranik', 'beyond-balance']
  },
  {
    id: 'skin_cat', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 2,
    name: t('Skin the cat', 'Achterover doorhalen'),
    cues: [
      t('Only where the feet clear the floor; first time with the coach', 'Alleen waar je voeten vrij van de grond zijn; de eerste keer met de trainer'),
      t('Tuck the knees and turn the legs through under the bar', 'Trek je knieën op en draai je benen onder de stang door'),
      t('Lower gently into the stretched shoulder position, then return the same way', 'Zak rustig in de schouderrek en ga op dezelfde manier terug')
    ],
    why: t('Shoulder range for rings and bars.', 'Schouderbeweeglijkheid voor ringen en rek.'),
    safety: t('Slowly, never drop into the bottom position. Learn it at the club first.', 'Langzaam, nooit in de onderste stand laten vallen. Leer het eerst bij de club.'),
    sources: ['gymbc-kickstart', 'breaking-muscle'],
    coachFirst: true
  },
  {
    id: 'weighted', type: 'reps', category: 'pull', equipment: ['pullupbar'], difficulty: 3, adultOnly: true,
    name: t('Weighted pull-ups', 'Pull-ups met gewicht'),
    cues: [
      t('Add 2–5 kg with a belt or backpack', 'Voeg 2–5 kg toe met een riem of rugzak'),
      t('Same strict form; drop the weight if form breaks', 'Dezelfde strikte techniek; minder gewicht als de techniek wegvalt'),
      t('Chin over the bar, lower with control', 'Kin boven de stang, gecontroleerd zakken')
    ],
    why: t('Keeps strength growing once bodyweight reps are easy.', 'Houdt je kracht groeiend als pull-ups met lichaamsgewicht makkelijk zijn.'),
    safety: t('Adults only. Children use light weights only in the exercises made for them.', 'Alleen voor volwassenen. Kinderen gebruiken lichte gewichten alleen bij de oefeningen die daarvoor bedoeld zijn.'),
    sources: [], commonPractice: true
  }
]
