import type { Exercise } from '../types'
import { t } from './text'

export const CORE: Exercise[] = [
  {
    id: 'dead_bug', type: 'reps', category: 'core', equipment: ['floor'], difficulty: 1,
    name: t('Dead bug', 'Dode kever'),
    cues: [
      t('Lie on your back, arms up, knees above the hips', 'Lig op je rug, armen omhoog, knieën boven je heupen'),
      t('Lower back pressed into the floor the whole time', 'Onderrug de hele tijd tegen de grond gedrukt'),
      t('Stretch one arm back and the opposite leg out, slowly; switch', 'Strek langzaam één arm naar achteren en het andere been uit; wissel')
    ],
    why: t('The first step to a strong hollow body.', 'De eerste stap naar een sterke schelphouding.'),
    sources: ['rbwf-routine', 'tilley-core'],
    harder: 'hollow'
  },
  {
    id: 'hollow', type: 'hold', category: 'core', equipment: ['floor', 'wallbars'], difficulty: 1,
    name: t('Hollow hold', 'Schelphouding (bolle houding)'),
    cues: [
      t('Lie on your back, lower back pressed into the floor', 'Lig op je rug, onderrug tegen de grond gedrukt'),
      t('Arms by your ears, legs straight and squeezed together', 'Armen langs je oren, benen gestrekt en tegen elkaar'),
      t('Lift shoulders and feet off the floor, toes pointed', 'Til schouders en voeten van de grond, tenen gestrekt'),
      t('If the back lifts, bend the knees or raise the legs higher', 'Komt je rug omhoog? Buig je knieën of houd je benen hoger')
    ],
    why: t("The gymnast's body shape. A strong hollow stops kicking and swinging.", 'De basishouding van een turner. Een sterke schelphouding voorkomt schoppen en zwaaien.'),
    sources: ['gymbc-kickstart', 'gymmax', 'peak-stall', 'kngu-leerlijn'],
    easier: 'dead_bug', harder: 'hollow_rock'
  },
  {
    id: 'hollow_rock', type: 'reps', category: 'core', equipment: ['floor'], difficulty: 2,
    name: t('Hollow rocks', 'Schommelen in schelphouding'),
    cues: [
      t('Get into the hollow hold', 'Ga in de schelphouding liggen'),
      t('Rock gently from shoulders to hips like a banana', 'Schommel rustig van schouders naar heupen, als een banaan'),
      t('The shape must not change; 10–20 rocks', 'De houding mag niet veranderen; 10–20 keer')
    ],
    why: t('Keeps the hollow shape while moving, like in swings.', 'Houdt de schelphouding vast tijdens bewegen, zoals bij zwaaien.'),
    sources: ['breaking-muscle'],
    easier: 'hollow'
  },
  {
    id: 'arch_hold', type: 'hold', category: 'core', equipment: ['floor', 'wallbars'], difficulty: 1,
    name: t('Arch hold', 'Overstrekte houding (superman)'),
    cues: [
      t('Lie face down, feet hooked under the lowest rung if you like', 'Lig op je buik, voeten eventueel onder de onderste sport'),
      t('Squeeze the glutes, lift arms and chest a little', 'Span je billen aan, til armen en borst een beetje op'),
      t('Long, not a deep bend in the lower back; 20 seconds', 'Lang maken, geen diepe knik in de onderrug; 20 seconden')
    ],
    why: t('Back strength for the arch shape, the opposite of the hollow.', 'Rugkracht voor de overstrekte houding, het tegenovergestelde van de schelphouding.'),
    sources: ['peak-stall', 'breaking-muscle']
  },
  {
    id: 'tuck_up', type: 'reps', category: 'core', equipment: ['floor'], difficulty: 1,
    name: t('Tuck-ups', 'Buikvouwen'),
    cues: [
      t('Lie on your back, arms overhead', 'Lig op je rug, armen boven je hoofd'),
      t('Bring knees and chest together, hands to the shins', 'Breng knieën en borst naar elkaar, handen naar je schenen'),
      t('Lower slowly; straight legs (V-ups) when it gets easy', 'Langzaam terug; met gestrekte benen (V-ups) als het makkelijk wordt')
    ],
    why: t('Compression strength for pike and tuck skills.', 'Kracht om te vouwen, voor gehurkte en gesloten elementen.'),
    sources: ['ghq-home']
  },
  {
    id: 'plank', type: 'hold', category: 'core', equipment: ['floor', 'wallbars'], difficulty: 1,
    name: t('Plank', 'Plank'),
    cues: [
      t('On the forearms or hands, feet on the floor or on a low rung', 'Op je onderarmen of handen, voeten op de grond of op een lage sport'),
      t('One straight line from head to heels, belly tight', 'Eén rechte lijn van hoofd tot hielen, buik aangespannen'),
      t('Keep breathing; 20–60 seconds', 'Blijf ademen; 20–60 seconden')
    ],
    why: t('Body tension that carries over to handstands and supports.', 'Lichaamsspanning die je nodig hebt bij handstand en steun.'),
    sources: ['beyond-balance', 'tilley-core', 'ghq-home']
  },
  {
    id: 'side_plank', type: 'hold', category: 'core', equipment: ['floor'], difficulty: 1,
    name: t('Side plank', 'Zijplank'),
    cues: [
      t('On one forearm or hand, feet stacked', 'Op één onderarm of hand, voeten op elkaar'),
      t('Hips up: a straight line from head to feet', 'Heupen omhoog: een rechte lijn van hoofd tot voeten'),
      t('20–30 seconds each side', '20–30 seconden per kant')
    ],
    why: t('Side stability for landings and twists; part of the FIFA 11+ Kids injury-prevention warm-up.', 'Zijwaartse stabiliteit voor landingen en draaien; onderdeel van de FIFA 11+ Kids blessurepreventie-warming-up.'),
    sources: ['tilley-core', 'fifa-11-kids']
  },
  {
    id: 'tuck', type: 'reps', category: 'core', equipment: ['pullupbar', 'wallbars'], difficulty: 1,
    name: t('Hanging tuck raises', 'Knieheffen in hang'),
    cues: [
      t('Hang with straight arms and active shoulders', 'Hang met gestrekte armen en actieve schouders'),
      t('Bring knees up to the chest without swinging', 'Breng je knieën naar je borst zonder te zwaaien'),
      t('Lower slowly until legs are straight', 'Zak langzaam tot je benen gestrekt zijn')
    ],
    why: t('Core strength on the bar for kips and casts.', 'Rompkracht aan de stang voor kips en opzwaaien.'),
    sources: ['beyond-balance', 'szeged'],
    harder: 'leg_lift_bars'
  },
  {
    id: 'leg_lift_bars', type: 'reps', category: 'core', equipment: ['wallbars'], difficulty: 2,
    name: t('Wall-bar leg lifts', 'Beenheffen aan het wandrek'),
    cues: [
      t('Hang with your back to the wall bars, hands on a high rung', 'Hang met je rug tegen het wandrek, handen op een hoge sport'),
      t('Head, shoulders and upper back stay against the bars', 'Hoofd, schouders en bovenrug blijven tegen het wandrek'),
      t('Lift straight legs together to an L (half) or higher (full); lower slowly', 'Til je gestrekte benen samen tot een L (half) of hoger (heel); langzaam terug')
    ],
    why: t('Compression strength for the press handstand; a federation test item.', 'Kracht om te vouwen voor de handstand opdrukken; een testonderdeel van de bond.'),
    sources: ['usag-tops', 'gymbc-kickstart', 'beyond-balance'],
    easier: 'tuck', harder: 'toes_to_bar'
  },
  {
    id: 'toes_to_bar', type: 'reps', category: 'core', equipment: ['pullupbar', 'wallbars'], difficulty: 3,
    name: t('Toes to bar', 'Tenen naar de stang'),
    cues: [
      t('Hang with active shoulders', 'Hang met actieve schouders'),
      t('Lift straight legs until the feet touch the bar', 'Til je gestrekte benen tot je voeten de stang raken'),
      t('No swinging; lower slowly', 'Niet zwaaien; langzaam terug')
    ],
    why: t('Kip and cast strength for high bar and rings.', 'Kracht voor kip en opzwaaien aan rek en ringen.'),
    sources: ['gymbc-kickstart', 'beyond-balance'],
    easier: 'leg_lift_bars'
  },
  {
    id: 'dip_leg_raise', type: 'reps', category: 'core', equipment: ['dipbar'], difficulty: 1,
    name: t('Leg raises in the dip station', 'Beenheffen in de dipbar'),
    cues: [
      t('Support on the dip bar, back near the wall bars', 'Steun op de dipbar, rug dicht bij het wandrek'),
      t('Lift the knees to the chest, or straight legs to 90°', 'Til je knieën naar je borst, of gestrekte benen tot 90°'),
      t('Lower slowly, shoulders stay down', 'Langzaam terug, schouders blijven omlaag')
    ],
    why: t('Safe compression work with support.', 'Veilig vouwen met steun.'),
    sources: ['shop-apotheke', 'fitshop-benchk'],
    harder: 'l_sit_tuck'
  },
  {
    id: 'l_sit_tuck', type: 'hold', category: 'core', equipment: ['dipbar', 'floor'], difficulty: 2,
    name: t('Tuck L-sit', 'Gehurkte hoeksteun'),
    cues: [
      t('Support on the dip bar (or hands on the floor beside the hips)', 'Steun op de dipbar (of handen naast je heupen op de grond)'),
      t('Lift the knees to the chest, feet off', 'Trek je knieën naar je borst, voeten los'),
      t('Shoulders down, arms locked; 10–20 seconds', 'Schouders omlaag, armen gestrekt; 10–20 seconden')
    ],
    why: t('The step toward the L-sit.', 'De stap naar de hoeksteun.'),
    sources: ['antranik', 'gymmax'],
    easier: 'dip_leg_raise', harder: 'l_sit'
  },
  {
    id: 'l_sit', type: 'hold', category: 'core', equipment: ['dipbar', 'floor'], difficulty: 2,
    name: t('L-sit', 'Hoeksteun'),
    cues: [
      t('Support with straight arms, shoulders pushed down', 'Steun met gestrekte armen, schouders omlaag gedrukt'),
      t('Straight legs together at horizontal, toes pointed', 'Gestrekte benen samen horizontaal, tenen gestrekt'),
      t('3 × 10 counts; one leg bent is fine at first', '3 × 10 tellen; in het begin mag één been gebogen')
    ],
    why: t('The basic position on mushroom/pommel horse and parallel bars.', 'De basishouding op paddenstoel/voltige en brug (toestel).'),
    sources: ['gymmax', 'rbwf-support', 'antranik', 'kngu-leerlijn'],
    easier: 'l_sit_tuck', harder: 'straddle_l'
  },
  {
    id: 'straddle_l', type: 'hold', category: 'core', equipment: ['dipbar', 'floor'], difficulty: 3,
    name: t('Straddle L-sit', 'Spreidhoeksteun'),
    cues: [
      t('From the L-sit, open the legs wide', 'Spreid vanuit de hoeksteun je benen wijd'),
      t('Legs straight and high, hips pushed up', 'Benen gestrekt en hoog, heupen omhoog'),
      t('3 × 10 counts', '3 × 10 tellen')
    ],
    why: t('Prepares the straddle press to handstand.', 'Bereidt de handstand opdrukken met gespreide benen voor.'),
    sources: ['gymmax', 'kngu-leerlijn'],
    easier: 'l_sit'
  },
  {
    id: 'reverse_leg_lift', type: 'reps', category: 'core', equipment: ['wallbars'], difficulty: 2,
    name: t('Reverse leg lift at the wall bars', 'Omgekeerd beenheffen aan het wandrek'),
    cues: [
      t('Face the wall bars, hold a rung at chest height', 'Gezicht naar het wandrek, pak een sport op borsthoogte'),
      t('Pike forward and lift straight legs back and up slowly', 'Vouw naar voren en til je gestrekte benen langzaam naar achteren omhoog'),
      t('Lower with control; 8 reps', 'Gecontroleerd terug; 8 keer')
    ],
    why: t('Active flexibility and control for pike positions.', 'Actieve lenigheid en controle voor gesloten houdingen.'),
    sources: ['gymnasticbodies']
  },
  {
    id: 'compression', type: 'reps', category: 'core', equipment: ['floor'], difficulty: 2,
    name: t('Pike compression lifts', 'Benen heffen in zit'),
    cues: [
      t('Sit with straight legs together, hands beside the knees', 'Zit met gestrekte benen tegen elkaar, handen naast je knieën'),
      t('Lift both heels off the floor without leaning back', 'Til beide hielen van de grond zonder achterover te leunen'),
      t('Hold 2 seconds, lower; 8–10 reps', 'Houd 2 tellen vast, zak terug; 8–10 keer')
    ],
    why: t('Active pike flexibility for the press handstand.', 'Actieve lenigheid in de pikhouding voor de handstand opdrukken.'),
    sources: ['gb-seated-pike']
  }
]
