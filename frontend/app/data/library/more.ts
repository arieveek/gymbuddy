import type { Exercise } from '../types'
import { t } from './text'

/** Second research round: apparatus-specific prep, shoulder prehab, balance, landings and KNGU test exercises. */
const WRIST = t('Warm up the wrists first; keep holds short and stop on wrist pain.', 'Warm eerst je polsen op; houd het kort en stop bij pijn in je pols.')
const LANDING = t('Soft, quiet landings with the knees over the toes. Few reps; stop when landings get loud.', 'Zachte, stille landingen met je knieën boven je tenen. Weinig herhalingen; stop als de landingen hard worden.')

export const MORE: Exercise[] = [
  // Prehab
  {
    id: 'stick_sequence', type: 'list', category: 'prehab', equipment: ['band', 'floor'], difficulty: 1,
    name: t('Stick sequence (KNGU)', 'Fysieke reeks met stok (KNGU)'),
    cues: [
      t('Long sit, stick overhead, back long: 3 seconds', 'Strekzit, stok boven je hoofd, rug lang: 3 tellen'),
      t('Stick over the head to behind the back and back (disloque)', 'Stok over je hoofd naar achter je rug en terug (disloque)'),
      t('Lie down in the hollow shape (schelphouding): 3 seconds', 'Ga liggen in schelphouding: 3 tellen'),
      t('Face down, lift arms and chest: 3 seconds', 'Op je buik, til armen en borst op: 3 tellen')
    ],
    why: t('The KNGU warm-up series for boys: shoulder mobility and body shapes in one go.', 'De KNGU-reeks voor jongens: schouderbeweeglijkheid en lichaamshoudingen in één keer.'),
    sources: ['kngu-leerlijn']
  },
  {
    id: 'overhead_liftoff', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Prone overhead lift-offs', 'Armen heffen in buiklig'),
    cues: [
      t('Lie face down, forehead on the floor, arms overhead, thumbs up', 'Lig op je buik, voorhoofd op de grond, armen boven je hoofd, duimen omhoog'),
      t('Squeeze the lower shoulder blades and lift both arms', 'Knijp je onderste schouderbladen samen en til beide armen op'),
      t('Hold 3 seconds; 2 × 10', 'Houd 3 tellen vast; 2 × 10')
    ],
    why: t('Shoulder control in the overhead position of the handstand.', 'Schoudercontrole in de armen-omhoog-houding van de handstand.'),
    sources: ['usag-shoulder']
  },
  {
    id: 'serratus_punch', type: 'reps', category: 'prehab', equipment: ['dumbbell', 'floor'], difficulty: 1,
    name: t('Serratus punch', 'Serratus punch'),
    cues: [
      t('Lie on your back, one arm straight up with a light dumbbell', 'Lig op je rug, één arm recht omhoog met een licht dumbbell'),
      t('Punch toward the ceiling by moving only the shoulder blade', 'Stoot naar het plafond door alleen je schouderblad te bewegen'),
      t('Elbow stays locked; 2 × 15', 'Elleboog blijft gestrekt; 2 × 15')
    ],
    why: t('Strengthens the muscle that pushes the shoulders out in support and handstand.', 'Versterkt de spier die je schouders naar buiten duwt in steun en handstand.'),
    safety: t('Very light weight (0.5–2 kg).', 'Heel licht gewicht (0,5–2 kg).'),
    sources: ['usag-shoulder']
  },
  {
    id: 'towel_scrunch', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Towel scrunches and toe lifts', 'Handdoek grijpen en tenen heffen'),
    cues: [
      t('Sit, foot flat on a towel, pull the towel in with the toes', 'Zit, voet plat op een handdoek, trek de handdoek naar je toe met je tenen'),
      t('Then lift only the big toe, then only the other four', 'Til daarna alleen je grote teen op, dan alleen de andere vier'),
      t('About 30 seconds per foot', 'Ongeveer 30 seconden per voet')
    ],
    why: t('Foot and ankle strength for landings; ankles are the most injured spot in gymnastics.', 'Voet- en enkelkracht voor landingen; de enkel is de meest geblesseerde plek in het turnen.'),
    sources: ['precision-acro', 'tno-turnen']
  },
  {
    id: 'clamshell', type: 'reps', category: 'prehab', equipment: ['floor'], difficulty: 1,
    name: t('Clamshells', 'Schelpje (clamshell)'),
    cues: [
      t('Lie on your side, knees bent, feet together', 'Lig op je zij, knieën gebogen, voeten tegen elkaar'),
      t('Open the top knee like a shell, hips stay still', 'Open je bovenste knie als een schelp, heupen blijven stil'),
      t('2 × 12–15 per side', '2 × 12–15 per kant')
    ],
    why: t('Hip control that keeps the knees from caving in on landings.', 'Heupcontrole die voorkomt dat je knieën naar binnen zakken bij landingen.'),
    sources: ['precision-acro']
  },
  // Push and support
  {
    id: 'support_shrugs', type: 'reps', category: 'push', equipment: ['dipbar'], difficulty: 1,
    name: t('Support shrugs', 'Schouders zakken en duwen in steun'),
    cues: [
      t('Straight-arm support on the dip bar, body bol', 'Steun met gestrekte armen op de dipbar, lichaam bol'),
      t('Let the shoulders sink toward the ears, then push tall', 'Laat je schouders naar je oren zakken en duw je dan lang'),
      t('Elbows stay locked; 3 × 8 slow', 'Ellebogen blijven gestrekt; 3 × 8 langzaam')
    ],
    why: t('Shoulder strength for support on pommel horse, parallel bars and rings.', 'Schouderkracht voor steun op voltige, brug (toestel) en ringen.'),
    safety: t('Check the dip bar hooks sit fully on the rung.', 'Controleer dat de haken van de dipbar helemaal op de sport zitten.'),
    sources: ['gb-pommel-forum', 'rbwf-support']
  },
  {
    id: 'side_lean', type: 'reps', category: 'push', equipment: ['dipbar'], difficulty: 2,
    name: t('Side-lean support', 'Steun met zijwaartse verplaatsing'),
    cues: [
      t('In support, shift the shoulders over the left hand', 'Verplaats in steun je schouders boven je linkerhand'),
      t('Hold 2 seconds, then over the right hand', 'Houd 2 tellen vast, dan boven je rechterhand'),
      t('Arms stay straight; 2 × 6 per side', 'Armen blijven gestrekt; 2 × 6 per kant')
    ],
    why: t('The weight shifts of pommel horse circles.', 'De gewichtsverplaatsing van cirkels op voltige.'),
    sources: ['gb-pommel-forum']
  },
  {
    id: 'rear_support', type: 'hold', category: 'push', equipment: ['floor', 'wallbars'], difficulty: 1,
    name: t('Rear support', 'Ligsteun ruggelings'),
    cues: [
      t('Sit, hands behind the hips with fingers forward', 'Zit, handen achter je heupen met vingers naar voren'),
      t('Lift into one straight line, chest open (feet on a low rung is harder)', 'Til je op tot één rechte lijn, borst open (voeten op een lage sport is zwaarder)'),
      t('3 × 15–20 seconds', '3 × 15–20 seconden')
    ],
    why: t('Back support for pommel horse and parallel bars, and shoulder extension.', 'Ruggelingse steun voor voltige en brug (toestel), en schouderstrekking.'),
    safety: t('Only as far as the shoulders feel fine.', 'Maar zo ver als je schouders goed voelen.'),
    sources: ['gb-pommel-forum', 'kngu-leerlijn']
  },
  {
    id: 'seal_walk', type: 'reps', category: 'push', equipment: ['floor'], difficulty: 2,
    name: t('Seal walk', 'Zeehondenloop'),
    cues: [
      t('Front support on the hands, feet on a towel', 'Steun voorover op je handen, voeten op een handdoek'),
      t('Upper back rounded (push the floor away), walk forward on the hands', 'Bovenrug bol (duw de grond weg), loop vooruit op je handen'),
      t('3 × 3–5 metres; don\'t let the back sag', '3 × 3–5 meter; laat je rug niet doorzakken')
    ],
    why: t('Support endurance for pommel horse.', 'Steunuithoudingsvermogen voor voltige.'),
    safety: WRIST,
    sources: ['gb-pommel-forum']
  },
  {
    id: 'tuck_planche', type: 'hold', category: 'push', equipment: ['floor'], difficulty: 3,
    name: t('Tuck planche', 'Gehurkte bovenbalans'),
    cues: [
      t('Hands on the floor, lean the shoulders forward over the hands', 'Handen op de grond, leun met je schouders naar voren boven je handen'),
      t('Knees to the chest, upper back rounded, feet off', 'Knieën naar je borst, bovenrug bol, voeten los'),
      t('5 × 3–5 seconds', '5 × 3–5 seconden')
    ],
    why: t('A KNGU and FIG test hold for 7–10 year olds; strength for floor, parallel bars and rings.', 'Een test van de KNGU en de FIG voor 7- tot 10-jarigen; kracht voor vloer, brug (toestel) en ringen.'),
    safety: WRIST,
    sources: ['kngu-leerlijn', 'fig-mag-tests'],
    easier: 'frog_stand'
  },
  // Core
  {
    id: 'walkout', type: 'reps', category: 'core', equipment: ['floor'], difficulty: 2,
    name: t('Plank-to-pike walkout', 'Uitlopen van plank naar pik'),
    cues: [
      t('Start in a plank on the hands', 'Begin in een plank op je handen'),
      t('Walk the hands back toward the feet into a pike, legs straight', 'Loop met je handen terug naar je voeten tot een pikhouding, benen gestrekt'),
      t('Walk out again; 2 × 5', 'Loop weer uit; 2 × 5')
    ],
    why: t('Builds the handstand line and the press pattern.', 'Bouwt de handstandlijn en de beweging van handstand opdrukken op.'),
    sources: ['flo-conditioning']
  },
  {
    id: 'bear_crawl', type: 'reps', category: 'core', equipment: ['floor'], difficulty: 1,
    name: t('Bear crawl and crab walk', 'Berenloop en krabbenloop'),
    cues: [
      t('Bear: on hands and feet, knees just off the floor, back flat', 'Beer: op handen en voeten, knieën net boven de grond, rug vlak'),
      t('Crab: face up, hips high, walk on hands and feet', 'Krab: buik omhoog, heupen hoog, loop op handen en voeten'),
      t('Races of 5–10 metres; fun as a family game', 'Wedstrijdjes van 5–10 meter; leuk als spelletje')
    ],
    why: t('Support shapes and endurance, playfully.', 'Steunhoudingen en uithoudingsvermogen, op een speelse manier.'),
    sources: ['flo-conditioning']
  },
  {
    id: 'stalder_hang', type: 'hold', category: 'core', equipment: ['wallbars'], difficulty: 2,
    name: t('Straddle hang on the wall bars', 'Stalderhang aan het wandrek'),
    cues: [
      t('Face the wall bars, hands on a high rung', 'Gezicht naar het wandrek, handen op een hoge sport'),
      t('Feet wide on a rung below, legs straight, bottom back', 'Voeten wijd op een sport lager, benen gestrekt, billen naar achteren'),
      t('Hold 5 seconds; arms straight', 'Houd 5 tellen vast; armen gestrekt')
    ],
    why: t('A KNGU test position: pike flexibility with strength, for stalders on high bar later.', 'Een KNGU-testhouding: lenigheid in de pikhouding met kracht, later voor stalders aan rek.'),
    sources: ['kngu-leerlijn']
  },
  // Flexibility
  {
    id: 'lat_stretch', type: 'hold', category: 'flexibility', equipment: ['bench', 'band'], difficulty: 1,
    name: t('Kneeling shoulder stretch on the bench', 'Schouders rekken geknield bij de bank'),
    cues: [
      t('Kneel, elbows on the bench, hold a stick between the hands', 'Kniel, ellebogen op de bank, houd een stok tussen je handen'),
      t('Sink the chest toward the floor', 'Laat je borst naar de grond zakken'),
      t('Bend the elbows to deepen; 5 × 10 seconds', 'Buig je ellebogen om het te verdiepen; 5 × 10 seconden')
    ],
    why: t('Opens the shoulder angle for handstands and swings.', 'Opent de schouderhoek voor handstand en zwaaien.'),
    safety: t('A stretch, never pain; ribs stay in.', 'Een rek, nooit pijn; ribben blijven binnen.'),
    sources: ['usag-shoulder']
  },
  {
    id: 'wall_leg_lift', type: 'reps', category: 'flexibility', equipment: ['wall'], difficulty: 1,
    name: t('Front leg lift against the wall', 'Been voorwaarts heffen tegen de muur'),
    cues: [
      t('Back flat against the wall, stand tall', 'Rug plat tegen de muur, sta rechtop'),
      t('Lift one straight leg as high as you can, toes pointed', 'Til één gestrekt been zo hoog mogelijk op, tenen gestrekt'),
      t('Hold 3–5 seconds; 2 × 5 per leg', 'Houd 3–5 tellen vast; 2 × 5 per been')
    ],
    why: t('Active flexibility: a FIG test item for leaps and leg work on pommel horse.', 'Actieve lenigheid: een FIG-testonderdeel voor sprongen en beenwerk op voltige.'),
    sources: ['fig-mag-tests']
  },
  {
    id: 'straddle_lift', type: 'reps', category: 'flexibility', equipment: ['floor'], difficulty: 1,
    name: t('Straddle leg lifts', 'Benen heffen in spreidzit'),
    cues: [
      t('Sit in a wide straddle, hands beside the knees', 'Zit in een wijde spreidzit, handen naast je knieën'),
      t('Lift both straight legs off the floor for 1–2 seconds', 'Til beide gestrekte benen 1–2 tellen van de grond'),
      t('3 × 8', '3 × 8')
    ],
    why: t('Active straddle flexibility for the straddle press, L and pommel horse.', 'Actieve lenigheid in spreidzit voor handstand opdrukken, hoeksteun en voltige.'),
    sources: ['gb-pommel-forum', 'kngu-leerlijn']
  },
  {
    id: 'ankle_stretch', type: 'hold', category: 'flexibility', equipment: ['wall'], difficulty: 1,
    name: t('Knee-to-wall ankle check', 'Knie-naar-muur enkeltest'),
    cues: [
      t('Half kneel, front toes a hand-width (about 13 cm) from the wall', 'Halfgeknield, voorste tenen een handbreedte (ongeveer 13 cm) van de muur'),
      t('Push the knee to the wall, heel down, knee not caving in', 'Duw je knie naar de muur, hiel op de grond, knie niet naar binnen'),
      t('Can\'t reach? Stretch daily and test again in 4–6 weeks', 'Lukt het niet? Rek dagelijks en test opnieuw over 4–6 weken')
    ],
    why: t('Enough ankle bend makes landings softer and safer.', 'Genoeg buiging in je enkel maakt landingen zachter en veiliger.'),
    safety: t('Still can\'t reach after 6 weeks: ask a physio.', 'Lukt het na 6 weken nog niet: vraag het een fysiotherapeut.'),
    sources: ['precision-acro']
  },
  // Legs and landings
  {
    id: 'quad_lean', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 2,
    name: t('Quad lean', 'Achteroverleunen op de knieën'),
    cues: [
      t('Kneel tall on a mat, arms forward', 'Kniel rechtop op een mat, armen naar voren'),
      t('Lean back in one straight line from knees to head', 'Leun achterover in één rechte lijn van knieën tot hoofd'),
      t('Come back without bending at the hips; 3 × 5 slow', 'Kom terug zonder in je heupen te buigen; 3 × 5 langzaam')
    ],
    why: t('Strong thighs and knee control for landings.', 'Sterke bovenbenen en controle over je knieën bij landingen.'),
    safety: t('Stop if the front of the knee hurts (common in growth spurts).', 'Stop als de voorkant van je knie pijn doet (vaak tijdens een groeispurt).'),
    sources: ['flo-conditioning', 'sportzorg-jeugd']
  },
  {
    id: 'pogo_hops', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Pogo hops', 'Pogosprongetjes'),
    cues: [
      t('Small, quick hops on the balls of the feet', 'Kleine, snelle sprongetjes op je voorvoeten'),
      t('Knees almost straight, body tight, quiet feet', 'Knieën bijna gestrekt, lichaam strak, stille voeten'),
      t('3 × 10', '3 × 10')
    ],
    why: t('Springy ankles for the vault punch and floor rebounds.', 'Verende enkels voor de afzet bij sprong en vloer.'),
    safety: LANDING,
    sources: ['bjsm-youth', 'kngu']
  },
  {
    id: 'line_hops', type: 'reps', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Line hops', 'Lijnsprongen'),
    cues: [
      t('Tape a line on the floor', 'Plak een lijn op de grond'),
      t('Hop with both feet forward and back, then side to side', 'Spring met beide voeten voor- en achteruit, dan van links naar rechts'),
      t('Land soft; 3 × 10 seconds', 'Zacht landen; 3 × 10 seconden')
    ],
    why: t('Landing skill and coordination; landings cause about a third of gymnastics injuries.', 'Landingstechniek en coördinatie; ongeveer een derde van de turnblessures ontstaat bij landingen.'),
    safety: LANDING,
    sources: ['bjsm-youth', 'tno-turnen']
  },
  {
    id: 'single_leg_balance', type: 'hold', category: 'legs', equipment: ['floor'], difficulty: 1,
    name: t('Single-leg balance', 'Balans op één been'),
    cues: [
      t('Stand on one leg, knee soft, 30 seconds', 'Sta op één been, knie licht gebogen, 30 seconden'),
      t('Then with eyes closed, then turning the head', 'Daarna met ogen dicht, dan met je hoofd draaiend'),
      t('Then on a pillow; both legs', 'Daarna op een kussen; beide benen')
    ],
    why: t('Balance and ankle control for landings, beam-like positions and scales.', 'Balans en enkelcontrole voor landingen en balanshoudingen.'),
    safety: t('A clear space around; go to the pillow only after eyes-closed works on the floor.', 'Vrije ruimte eromheen; pas op een kussen als het met ogen dicht op de grond lukt.'),
    sources: ['precision-acro', 'tno-turnen']
  }
]
