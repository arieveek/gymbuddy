import type { Exercise } from '../types'
import { t } from './text'

const GENTLE = t('Stretch to a mild pull, never pain. No bouncing. Warm up first.', 'Rek tot een lichte trek, nooit pijn. Niet veren. Eerst opwarmen.')

export const FLEXIBILITY: Exercise[] = [
  {
    id: 'hamstring_rung', type: 'hold', category: 'flexibility', equipment: ['wallbars'], difficulty: 1,
    name: t('Hamstring stretch, heel on a rung', 'Hamstrings rekken met de hiel op een sport'),
    cues: [
      t('Heel on a rung at hip height or lower, standing leg straight', 'Hiel op een sport op heuphoogte of lager, standbeen gestrekt'),
      t('Hinge forward from the hips with a flat back', 'Buig naar voren vanuit je heupen met een rechte rug'),
      t('30 seconds per leg; a higher rung over the weeks', '30 seconden per been; over de weken een hogere sport')
    ],
    why: t('Flexibility for splits and pike positions.', 'Lenigheid voor spagaat en pikhouding.'),
    safety: GENTLE,
    sources: ['peak-stall', 'peak-swedish', 'shop-apotheke'],
    harder: 'front_split'
  },
  {
    id: 'front_split', type: 'hold', category: 'flexibility', equipment: ['floor'], difficulty: 2,
    name: t('Front split', 'Spagaat'),
    cues: [
      t('Half split first: back knee down, front leg straight', 'Eerst een halve spagaat: achterste knie op de grond, voorste been gestrekt'),
      t('Slide down only as far as feels OK, hips square, use cushions', 'Schuif maar zo ver als goed voelt, heupen recht naar voren, gebruik kussens'),
      t('Hold 10 → 30 → 60 seconds over the weeks; both legs', 'Houd over de weken 10 → 30 → 60 seconden vast; beide benen')
    ],
    why: t('Leaps and split positions on every apparatus.', 'Sprongen en spagaathoudingen op elk toestel.'),
    safety: t('Never past flat (no oversplits at home).', 'Nooit verder dan plat (thuis geen overspagaat).'),
    sources: ['ghq-splits', 'usag-tops', 'gymmax', 'kngu-leerlijn'],
    easier: 'hamstring_rung'
  },
  {
    id: 'butterfly', type: 'hold', category: 'flexibility', equipment: ['floor'], difficulty: 1,
    name: t('Butterfly', 'Kleermakerszit (vlinder)'),
    cues: [
      t('Sit tall, soles of the feet together, knees out', 'Zit rechtop, voetzolen tegen elkaar, knieën naar buiten'),
      t('Let the knees sink slowly; do not push them down', 'Laat je knieën langzaam zakken; niet naar beneden duwen'),
      t('30 seconds, breathe calmly', '30 seconden, rustig ademen')
    ],
    why: t('Opens the hips for straddle positions.', 'Opent de heupen voor spreidhoudingen.'),
    safety: GENTLE,
    sources: ['ghq-splits'],
    harder: 'middle_split'
  },
  {
    id: 'middle_split', type: 'hold', category: 'flexibility', equipment: ['floor', 'wall'], difficulty: 2,
    name: t('Middle split against the wall', 'Middenspagaat tegen de muur'),
    cues: [
      t('Lie on your back, bottom against the wall, legs up the wall', 'Lig op je rug met je billen tegen de muur, benen omhoog tegen de muur'),
      t('Let the legs open slowly to the sides', 'Laat je benen langzaam naar opzij zakken'),
      t('Knees straight, toes pointed; 30–60 seconds', 'Knieën gestrekt, tenen gestrekt; 30–60 seconden')
    ],
    why: t('Straddle elements on floor, pommel horse and bars.', 'Spreidelementen op vloer, voltige en brug (toestel).'),
    safety: GENTLE,
    sources: ['gymbc-kickstart', 'usag-tops', 'kngu-leerlijn'],
    easier: 'butterfly'
  },
  {
    id: 'pike_stretch', type: 'hold', category: 'flexibility', equipment: ['floor'], difficulty: 1,
    name: t('Pike stretch', 'Pikzit rekken'),
    cues: [
      t('Sit with straight legs together, toes pointed', 'Zit met gestrekte benen tegen elkaar, tenen gestrekt'),
      t('Fold forward from the hips, chest toward the knees', 'Vouw naar voren vanuit je heupen, borst naar je knieën'),
      t('Knees stay straight; 30 seconds', 'Knieën blijven gestrekt; 30 seconden')
    ],
    why: t('Pike shapes and the press handstand.', 'Pikhoudingen en de handstand opdrukken.'),
    safety: GENTLE,
    sources: ['ghq-splits', 'usag-tops'],
    harder: 'pike_hang'
  },
  {
    id: 'pike_hang', type: 'hold', category: 'flexibility', equipment: ['wallbars'], difficulty: 1,
    name: t('Pike hang at the wall bars', 'Pikhang aan het wandrek'),
    cues: [
      t('Stand on the lowest rung, hold a rung at waist height', 'Sta op de onderste sport, houd een sport op middelhoogte vast'),
      t('Lean back with straight arms and straight legs', 'Leun achterover met gestrekte armen en benen'),
      t('Let the chest sink toward the knees; 30 seconds', 'Laat je borst richting je knieën zakken; 30 seconden')
    ],
    why: t('Deeper pike flexibility with the help of the bars.', 'Diepere lenigheid in de pikhouding met hulp van het wandrek.'),
    safety: GENTLE,
    sources: ['gymnasticbodies'],
    easier: 'pike_stretch'
  },
  {
    id: 'hip_flexor', type: 'hold', category: 'flexibility', equipment: ['wallbars'], difficulty: 1,
    name: t('Hip-flexor stretch, rear foot on a rung', 'Heupbuigers rekken met de achterste voet op een sport'),
    cues: [
      t('Kneel with the back foot hooked on a low rung behind you', 'Kniel met je achterste voet achter je op een lage sport'),
      t('Tuck the pelvis under, push the hips gently forward', 'Kantel je bekken onder je, duw je heupen rustig naar voren'),
      t('30 seconds per side', '30 seconden per kant')
    ],
    why: t('Flexibility for the back leg in splits and leaps.', 'Lenigheid voor het achterste been in spagaat en sprongen.'),
    safety: GENTLE,
    sources: ['peak-stall', 'peak-swedish']
  },
  {
    id: 'side_bend', type: 'hold', category: 'flexibility', equipment: ['wallbars'], difficulty: 1,
    name: t('Side bend, leg on the wall bars', 'Zijwaarts buigen met been op het wandrek'),
    cues: [
      t('Stand side-on, one straight leg resting on a rung', 'Sta zijwaarts, één gestrekt been rust op een sport'),
      t('Arms up, bend sideways over the leg', 'Armen omhoog, buig zijwaarts over je been'),
      t('3 slow bends, then hold 15 seconds; both sides', '3 langzame buigingen, dan 15 seconden vasthouden; beide kanten')
    ],
    why: t('Side flexibility for side splits and turns.', 'Zijwaartse lenigheid voor middenspagaat en draaien.'),
    safety: GENTLE,
    sources: ['szeged']
  },
  {
    id: 'thoracic', type: 'hold', category: 'flexibility', equipment: ['wallbars'], difficulty: 1,
    name: t('Upper-back stretch over a rung', 'Bovenrug rekken over een sport'),
    cues: [
      t('Back to the wall bars, hands holding a rung above the head', 'Rug naar het wandrek, handen houden een sport boven je hoofd vast'),
      t('Lean the upper back gently over a rung behind you', 'Leun met je bovenrug rustig over een sport achter je'),
      t('Move up one rung at a time; 15 seconds each', 'Schuif steeds één sport op; 15 seconden per sport')
    ],
    why: t('Upper-back flexibility, so bridges come from the shoulders, not the lower back.', 'Lenigheid in de bovenrug, zodat de brug uit de schouders komt en niet uit de onderrug.'),
    safety: GENTLE,
    sources: ['peak-stall', 'peak-swedish'],
    harder: 'bridge'
  },
  {
    id: 'bridge', type: 'hold', category: 'flexibility', equipment: ['floor'], difficulty: 2,
    name: t('Bridge', 'Brug (achteroverbuigen)'),
    cues: [
      t('On your back, feet flat, hands by the ears with fingers to the shoulders', 'Op je rug, voeten plat, handen naast je oren met vingers naar je schouders'),
      t('Push up to straight arms, shoulders over the wrists', 'Duw op tot gestrekte armen, schouders boven je polsen'),
      t('Push the shoulders out, legs as straight as possible; 10–20 seconds', 'Duw je schouders naar buiten, benen zo gestrekt mogelijk; 10–20 seconden')
    ],
    why: t('A federation test standard; open shoulders protect the lower back.', 'Een testnorm van de bond; open schouders beschermen de onderrug.'),
    safety: t('Stop if the lower back hurts. Back pain that lasts more than 2 weeks: see a doctor. Walkovers only at the club.', 'Stop als je onderrug pijn doet. Rugpijn die langer dan 2 weken duurt: ga naar de dokter. Overslagen alleen bij de club.'),
    sources: ['usag-tops', 'gymbc-kickstart', 'gymmax', 'aap-gymnastics', 'kngu-leerlijn'],
    easier: 'thoracic'
  },
  {
    id: 'kicks', type: 'reps', category: 'flexibility', equipment: ['floor', 'wallbars'], difficulty: 1,
    name: t('Active kicks', 'Actief beenzwaaien'),
    cues: [
      t('Hold a rung for balance if you like', 'Houd eventueel een sport vast voor je balans'),
      t('Kick a straight leg up to the front, controlled, toes pointed', 'Zwaai een gestrekt been naar voren omhoog, gecontroleerd, tenen gestrekt'),
      t('10 front, 10 side, 10 back per leg', '10 naar voren, 10 opzij, 10 naar achteren per been')
    ],
    why: t('Active flexibility for leaps and kicks.', 'Actieve lenigheid voor sprongen en zwaaien.'),
    sources: ['ghq-splits', 'ghq-flexibility']
  }
]
