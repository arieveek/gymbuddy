import type { AgeGroup, Text } from './types'

export interface TipSection {
  title: Text
  paragraphs: Text[]
}

const t = (en: string, nl: string): Text => ({ en, nl })

const shape: TipSection = {
  title: t("The gymnast's shape", 'De turnhouding'),
  paragraphs: [
    t('Every bar exercise here uses a hollow body: legs squeezed together, toes pointed, belly tight, ribs pulled in. Strength and technique grow together.',
      'Elke oefening aan de stang gebruikt de holle houding: benen tegen elkaar, tenen gestrekt, buik aangespannen, ribben naar binnen. Zo groeien kracht en techniek samen.')
  ]
}

const homeScreen: TipSection = {
  title: t('Put it on the home screen', 'Zet hem op je beginscherm'),
  paragraphs: [
    t('iPhone and iPad: open this page in Safari, tap Share, then Add to Home Screen. It opens like an app.',
      'iPhone en iPad: open deze pagina in Safari, tik op Deel en dan op Zet op beginscherm. Hij opent als een app.')
  ]
}

export const TIPS: Record<AgeGroup, TipSection[]> = {
  child: [
    {
      title: t('How to use it', 'Zo gebruik je het'),
      paragraphs: [
        t('Train 3 times a week with a day off in between, for example Monday, Wednesday and Friday. On gym days, ask the coach whether to add it after practice or save it for a home day.',
          'Train 3 keer per week met een rustdag ertussen, bijvoorbeeld maandag, woensdag en vrijdag. Vraag op turndagen aan de trainer of het na de training kan of beter op een dag thuis.'),
        t('Every rep with good form. One clean pull-up beats five messy ones, and judges score the clean shape.',
          'Elke herhaling met goede techniek. Eén nette pull-up is beter dan vijf slordige, en juryleden letten op een nette houding.'),
        t('Every 2 weeks, do a test on the Progress tab. The workout keeps growing with every test.',
          'Doe elke 2 weken een test op het tabblad Voortgang. De training groeit mee met elke test.')
      ]
    },
    shape,
    {
      title: t('Stay safe', 'Veilig trainen'),
      paragraphs: [
        t('Stop if he feels sharp pain in shoulders, elbows or wrists. Sore muscles the next day are normal; joint pain is not.',
          'Stop bij scherpe pijn in schouders, ellebogen of polsen. Spierpijn de volgende dag is normaal, pijn in gewrichten niet.'),
        t('Look after hands: use chalk, keep calluses filed down, and skip bar work with a fresh rip.',
          'Zorg voor je handen: gebruik magnesium, vijl eelt bij en sla stangwerk over bij een open blaar.'),
        t('No added weights. For growing kids, bodyweight and perfect form are the right tools.',
          'Geen extra gewicht. Voor kinderen in de groei zijn lichaamsgewicht en goede techniek genoeg.'),
        t('Share the plan with the coach. They know the training load and can say if anything should change.',
          'Laat de trainer het plan zien. Die kent de trainingsbelasting en kan zeggen of er iets anders moet.')
      ]
    },
    homeScreen
  ],
  adult: [
    {
      title: t('How to use it', 'Zo gebruik je het'),
      paragraphs: [
        t('Train 3 times a week with a day off in between. Consistency beats intensity: the streak on the Progress tab is the number that matters most.',
          'Train 3 keer per week met een rustdag ertussen. Regelmaat wint van intensiteit: de reeks op het tabblad Voortgang is het belangrijkste getal.'),
        t('Test every 2 weeks. The workout keeps growing with every test, also after the top level.',
          'Test elke 2 weken. De training groeit mee met elke test, ook na het hoogste niveau.')
      ]
    },
    shape,
    {
      title: t('Look after your shoulders', 'Zorg voor je schouders'),
      paragraphs: [
        t('Never skip the warm-up. Shoulders and elbows need longer to adapt than muscles do.',
          'Sla de warming-up nooit over. Schouders en ellebogen hebben meer tijd nodig om te wennen dan spieren.'),
        t('Stop on sharp pain in shoulders, elbows or wrists. Take the lighter weeks seriously: recovery is when you get stronger.',
          'Stop bij scherpe pijn in schouders, ellebogen of polsen. Neem de lichtere weken serieus: je wordt sterker tijdens herstel.'),
        t('Add weight only once 12 strict reps feel solid, and drop it as soon as form breaks.',
          'Voeg pas gewicht toe als 12 strikte herhalingen goed gaan, en haal het weg zodra je techniek wegvalt.')
      ]
    },
    homeScreen
  ]
}
