import type { Exercise } from '../types'
import { t } from './text'

export const PREHAB: Exercise[] = [
  {
    id: 'warmup', type: 'list', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Warm-up', 'Warming-up'),
    cues: [
      t('20 arm circles forwards, 20 backwards', '20 armcirkels naar voren, 20 naar achteren'),
      t('10 shoulder shrugs up and down', '10 keer schouders ophalen en laten zakken'),
      t('10 wrist circles each way', '10 polscirkels elke kant op'),
      t('5 slow cat-cow stretches on hands and knees', '5 langzame kat-koe-oefeningen op handen en knieën'),
      t('10 jumping jacks', '10 jumping jacks')
    ],
    why: t('Gets joints and muscles ready, so training is safer.', 'Maakt gewrichten en spieren klaar, zodat trainen veiliger is.'),
    sources: ['ghq-home', 'aap-resistance', 'rbwf-routine']
  },
  {
    id: 'wrist_rocks', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Wrist circles and rocks', 'Polscirkels en polsschommels'),
    cues: [
      t('10 slow wrist circles each way', '10 langzame polscirkels elke kant op'),
      t('On hands and knees, fingers forward: rock gently forward and back', 'Op handen en knieën, vingers naar voren: schommel rustig naar voren en terug'),
      t('Repeat with fingers to the side and fingers pointing back', 'Herhaal met vingers opzij en vingers naar achteren'),
      t('Gentle: a stretch, never pain', 'Rustig: een rek, nooit pijn')
    ],
    why: t('Wrists carry every support and handstand.', 'De polsen dragen elke steun en elke handstand.'),
    safety: t('Wrist pain on the thumb side that gets worse with weight: stop and see a doctor.', 'Pijn aan de duimkant van de pols die erger wordt bij steunen: stop en ga naar de dokter.'),
    sources: ['rbwf-routine', 'american-gymnast', 'childrens-mercy'],
    harder: 'palm_lifts'
  },
  {
    id: 'palm_lifts', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Palm lifts', 'Handpalm optillen'),
    cues: [
      t('On hands and knees, fingers forward', 'Op handen en knieën, vingers naar voren'),
      t('Lift the palms off the floor, fingers stay down', 'Til de handpalmen van de grond, vingers blijven liggen'),
      t('Lower slowly, 10 times', 'Langzaam terug, 10 keer')
    ],
    why: t('Strengthens the muscles that protect the wrist in landings.', 'Versterkt de spieren die de pols beschermen bij landingen.'),
    sources: ['childrens-mercy', 'youth-throwers-ten'], commonPractice: true,
    easier: 'wrist_rocks', harder: 'wrist_pushup'
  },
  {
    id: 'wrist_pushup', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 2,
    name: t('Wrist push-ups', 'Polsopdrukken'),
    cues: [
      t('Start on the knees, hands under the shoulders', 'Begin op de knieën, handen onder de schouders'),
      t('Press up onto the fingertips, then lower the palms again', 'Duw op naar de vingertoppen en zak terug op de handpalmen'),
      t('Slow and controlled, 8–10 times', 'Langzaam en gecontroleerd, 8–10 keer')
    ],
    why: t('Builds wrist tolerance for tumbling and handstands.', 'Maakt de polsen sterker voor acrobatiek en handstand.'),
    sources: ['american-gymnast', 'childrens-mercy'],
    easier: 'palm_lifts'
  },
  {
    id: 'assisted_hang', type: 'hold', category: 'prehab', equipment: ['wallbars'], difficulty: 1,
    name: t('Assisted hang', 'Hangen met voeten op de grond'),
    cues: [
      t('Hold a rung at chest height, facing the wall bars', 'Pak een sport op borsthoogte, gezicht naar het wandrek'),
      t('Bend the knees so the arms take part of the weight', 'Buig de knieën zodat de armen een deel van je gewicht dragen'),
      t('Arms straight, breathe calmly, 20–30 seconds', 'Armen gestrekt, rustig ademen, 20–30 seconden')
    ],
    why: t('A gentle way into hanging that opens the shoulders.', 'Een rustige manier om te leren hangen en de schouders te openen.'),
    sources: ['peak-stall'],
    harder: 'hang'
  },
  {
    id: 'scap', type: 'reps', category: 'prehab', equipment: ['pullupbar', 'wallbars'], difficulty: 1,
    name: t('Scap pulls', 'Schouderbladtrekken'),
    cues: [
      t('Start in a dead hang with straight arms', 'Begin in een strekhang met gestrekte armen'),
      t('Pull shoulders down and back so the body rises a few centimetres', 'Trek je schouders omlaag en naar achteren, zodat je lichaam een paar centimeter stijgt'),
      t('Keep elbows straight the whole time', 'Houd je ellebogen de hele tijd gestrekt'),
      t('Pause 1 second at the top, then lower slowly', 'Houd 1 tel vast bovenaan en zak dan langzaam terug')
    ],
    why: t('Teaches the first part of every pull-up and protects the shoulders.', 'Leert het eerste deel van elke pull-up en beschermt de schouders.'),
    sources: ['peak-swedish', 'gymnasticbodies', 'rbwf-routine']
  },
  {
    id: 'band_rotation', type: 'reps', category: 'prehab', equipment: ['band', 'wallbars'], difficulty: 1,
    name: t('Band external rotation', 'Elastiek naar buiten draaien'),
    cues: [
      t('Tie a light band to a rung at elbow height', 'Bind een licht elastiek aan een sport op ellebooghoogte'),
      t('Elbow against your side, bent at a right angle', 'Elleboog tegen je zij, haaks gebogen'),
      t('Turn the forearm outwards and back slowly, 10–15 times each arm', 'Draai je onderarm langzaam naar buiten en terug, 10–15 keer per arm')
    ],
    why: t('Strengthens the small shoulder muscles that keep the joint stable on bars and rings.', 'Versterkt de kleine schouderspieren die het gewricht stabiel houden aan rek en ringen.'),
    sources: ['american-gymnast']
  },
  {
    id: 'pass_through', type: 'reps', category: 'prehab', equipment: ['band'], difficulty: 1,
    name: t('Stick pass-throughs', 'Stok over het hoofd'),
    cues: [
      t('Hold a broomstick or band with a wide grip', 'Houd een bezemsteel of elastiek wijd vast'),
      t('Arms straight, bring it slowly over the head to behind the back', 'Armen gestrekt, breng hem langzaam over je hoofd naar achter je rug'),
      t('Grip wider if it pinches, 10 slow passes', 'Pak wijder als het knelt, 10 rustige keren')
    ],
    why: t('Shoulder mobility for bars, rings and bridges.', 'Schouderbeweeglijkheid voor rek, ringen en brug (achteroverbuigen).'),
    sources: ['rbwf-routine', 'breaking-muscle']
  },
  {
    id: 'floor_angels', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Floor angels', 'Engeltjes op de grond'),
    cues: [
      t('Lie on your back, knees bent, lower back down', 'Lig op je rug, knieën gebogen, onderrug op de grond'),
      t('Arms like a W on the floor', 'Armen als een W op de grond'),
      t('Slide them up to a Y and back, keeping contact with the floor, 10 times', 'Schuif ze omhoog naar een Y en terug, steeds tegen de grond, 10 keer')
    ],
    why: t('Overhead mobility and shoulder-blade control for handstands.', 'Beweeglijkheid boven het hoofd en controle over de schouderbladen voor de handstand.'),
    sources: ['ghq-flexibility']
  },
  {
    id: 'shoulder_opener', type: 'hold', category: 'prehab', equipment: ['wallbars'], difficulty: 1,
    name: t('Shoulder opener at the wall bars', 'Schouders openen aan het wandrek'),
    cues: [
      t('Hold a rung at shoulder height, step back', 'Pak een sport op schouderhoogte en stap naar achteren'),
      t('Bend at the hips until the back is flat, arms long', 'Buig in de heupen tot je rug vlak is, armen lang'),
      t('Let the chest sink gently, 30 seconds', 'Laat je borst rustig zakken, 30 seconden')
    ],
    why: t('Opens the shoulder angle needed for a straight handstand and bridge.', 'Opent de schouderhoek die nodig is voor een rechte handstand en brug (achteroverbuigen).'),
    safety: t('Never push into pain; ribs stay in.', 'Nooit doorduwen bij pijn; ribben blijven binnen.'),
    sources: ['peak-stall', 'peak-swedish']
  }
]
