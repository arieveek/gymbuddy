import type { Exercise } from '../types'
import { t } from './text'

const WRIST = t('Warm up the wrists first. Thumb-side wrist pain: stop and see a doctor.', 'Warm eerst je polsen op. Pijn aan de duimkant van de pols: stop en ga naar de dokter.')

export const HANDSTAND: Exercise[] = [
  {
    id: 'releve', type: 'hold', category: 'handstand', equipment: ['floor'], difficulty: 1,
    name: t('Relevé hold, arms up', 'Op de tenen, armen omhoog'),
    cues: [
      t('Rise high on the toes, arms by the ears', 'Kom hoog op je tenen, armen langs je oren'),
      t('Ribs in, glutes tight, push the arms up tall', 'Ribben binnen, billen aangespannen, duw je armen lang omhoog'),
      t('Hold 30 seconds without wobbling', 'Houd 30 seconden vast zonder te wiebelen')
    ],
    why: t('The standing version of the handstand line.', 'De staande versie van de handstandlijn.'),
    sources: ['ghq-handstand']
  },
  {
    id: 't_scale', type: 'hold', category: 'handstand', equipment: ['floor'], difficulty: 1,
    name: t('Lunge – T-scale – lunge', 'Uitval – T-balans – uitval'),
    cues: [
      t('Lunge, arms up by the ears', 'Uitvalspas, armen langs je oren'),
      t('Tip forward into a T: arms, body and back leg in one line', 'Kantel naar voren tot een T: armen, lichaam en achterste been in één lijn'),
      t('Hold 3 seconds, back to the lunge; 3 × each leg', 'Houd 3 tellen vast, terug naar de uitval; 3 keer per been')
    ],
    why: t('The kick-up into a handstand starts exactly like this.', 'Het opzwaaien naar handstand begint precies zo.'),
    sources: ['ghq-handstand']
  },
  {
    id: 'shoulder_plank', type: 'hold', category: 'handstand', equipment: ['floor'], difficulty: 1,
    name: t('Open-shoulder plank', 'Plank met open schouders'),
    cues: [
      t('Plank on the hands, then move the hands forward past the head', 'Plank op je handen en zet je handen verder naar voren, voorbij je hoofd'),
      t('Push the floor away, body hollow', 'Duw de grond weg, lichaam hol'),
      t('Hold 20–45 seconds', 'Houd 20–45 seconden vast')
    ],
    why: t('Trains the open shoulder angle of a straight handstand.', 'Traint de open schouderhoek van een rechte handstand.'),
    safety: WRIST,
    sources: ['ghq-handstand'],
    harder: 'handstand_back'
  },
  {
    id: 'handstand_back', type: 'hold', category: 'handstand', equipment: ['wall'], difficulty: 2,
    name: t('Back-to-wall handstand', 'Handstand met de rug naar de muur'),
    cues: [
      t('Hands a hand-length from the wall, kick up so the heels rest on the wall', 'Handen een handlengte van de muur, zwaai op zodat je hielen tegen de muur rusten'),
      t('Push tall, shoulders by the ears, belly and glutes tight', 'Duw je lang, schouders bij je oren, buik en billen aangespannen'),
      t('Hold 20–30 seconds, come down one leg at a time', 'Houd 20–30 seconden vast, kom één been tegelijk naar beneden')
    ],
    why: t('The first supported handstand.', 'De eerste handstand met steun.'),
    safety: WRIST,
    sources: ['steven-low', 'ghq-handstand'],
    easier: 'shoulder_plank', harder: 'wall_walk'
  },
  {
    id: 'wall_walk', type: 'reps', category: 'handstand', equipment: ['wallbars', 'floor'], difficulty: 2,
    name: t('Wall-bar walk-up', 'Handstand oplopen tegen het wandrek'),
    cues: [
      t('Push-up position with the feet on a low rung', 'Opdrukhouding met je voeten op een lage sport'),
      t('Walk the feet up the rungs and the hands toward the bars', 'Loop met je voeten de sporten op en met je handen naar het wandrek'),
      t('Go only as high as you control, then walk back down', 'Ga maar zo hoog als je kunt controleren en loop weer terug')
    ],
    why: t('Handstand line with the chest to the bars: the straight shape coaches want.', 'Handstandlijn met je buik naar het wandrek: de rechte houding die trainers willen zien.'),
    safety: t('A mat under the bars; an adult nearby the first times.', 'Een mat onder het wandrek; een volwassene erbij de eerste keren.'),
    sources: ['mobilesport', 'usag-tops'],
    easier: 'handstand_back', harder: 'handstand_kick'
  },
  {
    id: 'handstand_kick', type: 'reps', category: 'handstand', equipment: ['wallbars', 'floor'], difficulty: 2,
    name: t('Kick to handstand facing the bars', 'Opzwaaien naar handstand tegen het wandrek'),
    cues: [
      t('Hands close to the bars, kick up with straight legs', 'Handen dicht bij het wandrek, zwaai op met gestrekte benen'),
      t('Feet touch the bars lightly; elbows locked, body long', 'Voeten raken het wandrek licht; ellebogen gestrekt, lichaam lang'),
      t('Come down by stepping back one leg at a time', 'Kom naar beneden door één been tegelijk terug te stappen')
    ],
    why: t('Practises the kick-up and handstand for floor and beam.', 'Oefent het opzwaaien en de handstand voor vloer en balk.'),
    safety: WRIST,
    sources: ['sportplan', 'mobilesport'],
    easier: 'wall_walk', harder: 'handstand_free'
  },
  {
    id: 'handstand_free', type: 'hold', category: 'handstand', equipment: ['floor'], difficulty: 3,
    name: t('Freestanding handstand', 'Vrije handstand'),
    cues: [
      t('Learn the roll-out first: tuck the head and roll, or turn out to the side', 'Leer eerst het afrollen: hoofd in en rollen, of opzij uitdraaien'),
      t('Kick up, balance with the fingers', 'Zwaai op en houd je balans met je vingers'),
      t('Aim for 3 clean "saves" of a few seconds', 'Werk naar 3 nette pogingen van een paar seconden')
    ],
    why: t('Balance control: the most important position in the sport.', 'Balanscontrole: de belangrijkste houding in het turnen.'),
    safety: t('Only on a soft surface with space around, after the coach taught the bail-out.', 'Alleen op een zachte ondergrond met ruimte eromheen, nadat de trainer het afrollen heeft geleerd.'),
    sources: ['steven-low', 'ghq-handstand'],
    easier: 'handstand_kick', coachFirst: true
  },
  {
    id: 'pike_up', type: 'reps', category: 'handstand', equipment: ['floor'], difficulty: 3,
    name: t('Pike-up toward handstand', 'Vanuit pik naar handstand'),
    cues: [
      t('Hands on the floor, feet close in a pike', 'Handen op de grond, voeten dichtbij in pikhouding'),
      t('Shift the shoulders forward and lift the hips over the hands', 'Breng je schouders naar voren en til je heupen boven je handen'),
      t('Lift the feet only as far as you control; 3 × 3', 'Til je voeten maar zo ver als je kunt controleren; 3 × 3')
    ],
    why: t('Builds the press-to-handstand movement.', 'Bouwt de beweging van handstand opdrukken op.'),
    safety: WRIST,
    sources: ['gymmax', 'ghq-handstand'],
    harder: 'straddle_press'
  },
  {
    id: 'straddle_press', type: 'reps', category: 'handstand', equipment: ['floor'], difficulty: 3,
    name: t('Straddle press', 'Handstand opdrukken met spreidbenen'),
    cues: [
      t('From a straddle stand, hands on the floor', 'Vanuit spreidstand, handen op de grond'),
      t('Lean forward and lift the legs wide up into a handstand', 'Leun naar voren en til je gespreide benen omhoog tot handstand'),
      t('Straight arms, no bouncing; lower back down with control', 'Gestrekte armen, niet veren; gecontroleerd terug')
    ],
    why: t('A federation test item for 8–10 year olds.', 'Een testonderdeel van de bond voor 8- tot 10-jarigen.'),
    safety: WRIST,
    sources: ['usag-tops', 'gymmax'],
    easier: 'pike_up', coachFirst: true
  }
]
