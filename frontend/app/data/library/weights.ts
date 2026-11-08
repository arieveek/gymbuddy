import type { Exercise } from '../types'
import { t } from './text'

/**
 * Light-weight exercises. Youth guidance (AAP, BJSM consensus, NSCA) supports resistance training with
 * weights for children when supervised, light to moderate and technique-first, never maximal.
 */
const LIGHT = t(
  'Light weight you can lift 15 times with clean form. An adult nearby. Never a maximal lift.',
  'Een licht gewicht dat je 15 keer netjes kunt tillen. Een volwassene in de buurt. Nooit maximaal tillen.'
)
const GUIDANCE = ['aap-resistance', 'bjsm-youth'] as const

export const WEIGHTS: Exercise[] = [
  {
    id: 'wrist_curl', type: 'reps', category: 'prehab', equipment: ['dumbbell', 'bench'], difficulty: 1,
    name: t('Wrist curls', 'Polskrullen'),
    cues: [
      t('Sit on the bench, forearm resting on the thigh, a light dumbbell in the hand', 'Zit op de bank, onderarm op je bovenbeen, een licht dumbbell in je hand'),
      t('Only the wrist moves: curl up, lower slowly', 'Alleen je pols beweegt: krul omhoog, laat langzaam zakken'),
      t('Then palm down (reverse curls); 12–15 each', 'Daarna met de handpalm omlaag (omgekeerd); 12–15 per kant')
    ],
    why: t('Stronger forearms take load off the wrists in supports and handstands.', 'Sterkere onderarmen ontlasten de polsen bij steun en handstand.'),
    safety: LIGHT,
    sources: ['american-gymnast', 'childrens-mercy', 'youth-throwers-ten', 'uf-throwers-ten']
  },
  {
    id: 'db_rotation', type: 'reps', category: 'prehab', equipment: ['dumbbell', 'floor'], difficulty: 1,
    name: t('Side-lying shoulder rotation', 'Schouder draaien in zijlig'),
    cues: [
      t('Lie on your side, top elbow against your side, bent 90°', 'Lig op je zij, bovenste elleboog tegen je zij, 90° gebogen'),
      t('Rotate the forearm up toward the ceiling, slowly back', 'Draai je onderarm omhoog naar het plafond en langzaam terug'),
      t('Very light (0.5–1 kg); 12–15 each arm', 'Heel licht (0,5–1 kg); 12–15 per arm')
    ],
    why: t('Strengthens the rotator cuff, the small muscles that keep the shoulder stable on bars and rings.', 'Versterkt de rotator cuff, de kleine spieren die de schouder stabiel houden aan rek en ringen.'),
    safety: LIGHT,
    sources: ['youth-throwers-ten', 'uf-throwers-ten', 'usag-shoulder', 'american-gymnast']
  },
  {
    id: 'ytw_raise', type: 'reps', category: 'prehab', equipment: ['dumbbell', 'floor'], difficulty: 1,
    name: t('Y-T-W raises', 'Y-T-W heffen'),
    cues: [
      t('Lie face down, very light dumbbells or none', 'Lig op je buik, heel lichte dumbbells of zonder'),
      t('Lift the arms into a Y, then a T, then a W, thumbs up', 'Til je armen op in een Y, dan een T, dan een W, duimen omhoog'),
      t('Squeeze the shoulder blades, 8 of each', 'Knijp je schouderbladen samen, 8 van elk')
    ],
    why: t('Shoulder-blade control for handstands, supports and swings.', 'Controle over de schouderbladen voor handstand, steun en zwaaien.'),
    safety: LIGHT,
    sources: ['usag-shoulder', 'uf-throwers-ten']
  },
  {
    id: 'db_row', type: 'reps', category: 'pull', equipment: ['dumbbell', 'bench'], difficulty: 1,
    name: t('One-arm dumbbell row', 'Roeien met één dumbbell'),
    cues: [
      t('One hand and knee on the bench, back flat', 'Eén hand en knie op de bank, rug vlak'),
      t('Pull the dumbbell to the hip, elbow close to the body', 'Trek het dumbbell naar je heup, elleboog dicht bij je lichaam'),
      t('Lower slowly; 10–12 each side', 'Langzaam zakken; 10–12 per kant')
    ],
    why: t('Horizontal pulling balances all the pushing in gymnastics.', 'Horizontaal trekken houdt alle duwkracht in het turnen in balans.'),
    safety: LIGHT,
    sources: ['ghq-home', 'ghq-principles']
  },
  {
    id: 'db_press', type: 'reps', category: 'push', equipment: ['dumbbell'], difficulty: 1,
    name: t('Overhead press', 'Boven het hoofd drukken'),
    cues: [
      t('Stand tall, light dumbbells at the shoulders', 'Sta rechtop, lichte dumbbells bij je schouders'),
      t('Press straight up until the arms are by the ears', 'Druk recht omhoog tot je armen langs je oren zijn'),
      t('Ribs in, no arching; lower slowly; 10–12 reps', 'Ribben binnen, niet hol; langzaam zakken; 10–12 keer')
    ],
    why: t('Overhead strength in the same line as the handstand.', 'Kracht boven het hoofd in dezelfde lijn als de handstand.'),
    safety: LIGHT,
    sources: ['acsm-youth', 'bjsm-youth', 'kidshealth'], commonPractice: true
  },
  {
    id: 'goblet_squat', type: 'reps', category: 'legs', equipment: ['kettlebell', 'dumbbell'], difficulty: 1,
    name: t('Goblet squat', 'Goblet squat'),
    cues: [
      t('Hold the kettlebell or a dumbbell against the chest', 'Houd de kettlebell of een dumbbell tegen je borst'),
      t('Squat down between the knees, chest up', 'Zak tussen je knieën door, borst omhoog'),
      t('Knees over the toes; 10 reps', 'Knieën boven je tenen; 10 keer')
    ],
    why: t('Leg strength for take-offs and landings, and a good squat shape.', 'Beenkracht voor afzetten en landen, en een goede squathouding.'),
    safety: LIGHT,
    sources: ['nsca-youth-coach', 'bjsm-youth']
  },
  {
    id: 'kb_deadlift', type: 'reps', category: 'legs', equipment: ['kettlebell'], difficulty: 2,
    name: t('Kettlebell deadlift', 'Deadlift met kettlebell'),
    cues: [
      t('Kettlebell between the feet, push the hips back', 'Kettlebell tussen je voeten, duw je heupen naar achteren'),
      t('Flat back, grab it, stand up by pushing the hips forward', 'Rechte rug, pak hem vast, kom omhoog door je heupen naar voren te duwen'),
      t('Lower the same way; 8–10 reps', 'Op dezelfde manier terug; 8–10 keer')
    ],
    why: t('Hamstrings and hip strength protect the knees and the lower back.', 'Kracht in hamstrings en heupen beschermt de knieën en de onderrug.'),
    safety: t('Back stays flat; light weight; learn it from an adult or the coach first.', 'Rug blijft recht; licht gewicht; leer het eerst van een volwassene of de trainer.'),
    sources: ['nsca-ltad', 'bjsm-youth', 'aap-gymnastics'], commonPractice: true
  },
  {
    id: 'farmer_carry', type: 'hold', category: 'core', equipment: ['kettlebell', 'dumbbell'], difficulty: 1,
    name: t("Farmer's carry", 'Boerenwandeling'),
    cues: [
      t('Start with a dumbbell in each hand; later one weight in one hand', 'Begin met een dumbbell in elke hand; later één gewicht in één hand'),
      t('Walk tall and slowly, do not lean to the side', 'Loop rechtop en langzaam, niet opzij hangen'),
      t('20–30 seconds, then switch hands', '20–30 seconden, dan wisselen van hand')
    ],
    why: t('Grip and trunk strength for bars and rings.', 'Grip- en rompkracht voor rek en ringen.'),
    safety: LIGHT,
    sources: ['nsca-carries', 'bjsm-youth']
  }
]
