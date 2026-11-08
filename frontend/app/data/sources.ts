/** Sources for the exercise library; see docs/exercise-library.md for what each covers. */
export type SourceKind = 'federation' | 'medical' | 'physio' | 'coach' | 'manufacturer' | 'community' | 'academic'

export interface Source {
  name: string
  url: string
  kind: SourceKind
}

export const SOURCES = {
  'fig-mag': { name: 'FIG Age Group Development Programme (MAG)', url: 'https://gymdanmark.dk/wp-content/uploads/2021/08/agegroup-mag-manual-e.pdf', kind: 'federation' },
  'usag-tops': { name: 'USA Gymnastics TOPs Physical Abilities', url: 'https://static.usagym.org/PDFs/Women/TOPs/physicalabilities.pdf', kind: 'federation' },
  'gymbc-kickstart': { name: 'Gymnastics BC — KICKSTART boys\' tests', url: 'https://www.gymbc.org/media/rhvc0myw/kickstart-l1.pdf', kind: 'federation' },
  'gymnz': { name: 'Gymnastics NZ Training Guidelines', url: 'https://gymnasticscoaching.com/wp-content/uploads/2024/12/gymnastics-nz-training-guidelines-art-rg-gfa.pdf', kind: 'federation' },
  'kngu': { name: 'KNGU — Verminderen van piekkrachten', url: 'https://dutchgymnastics.nl/assets/Documenten/Veilig-sporten/Artikel-verminderen-piekkrachten-turnen.pdf', kind: 'federation' },
  'mobilesport': { name: 'mobilesport.ch — Sprossenwand', url: 'https://assets01.sdd1.ch/assets/lbwp-cdn/mobilesport/files/1676564806/mobilesport-geraete--sprossenwand-handstandwandern.pdf', kind: 'federation' },
  'aap-resistance': { name: 'HealthyChildren (AAP) — Resistance training', url: 'https://www.healthychildren.org/English/news/Pages/Guidance-on-Resistance-Training-for-Children.aspx', kind: 'medical' },
  'aap-gymnastics': { name: 'HealthyChildren (AAP) — Gymnastics', url: 'https://healthychildren.org/English/healthy-living/sports/Pages/Gymnastics.aspx', kind: 'medical' },
  'bjsm-youth': { name: 'Youth resistance training consensus (BJSM 2014)', url: 'https://bjsm.bmj.com/content/48/7/498.long', kind: 'academic' },
  'nsca-ltad': { name: 'NSCA — Long-term athletic development', url: 'https://www.nsca.com/about-us/position-statements/youth-training-and-long-term-athletic-development/', kind: 'academic' },
  'boston-childrens': { name: 'Boston Children\'s — Gymnastics injury prevention', url: 'https://www.childrenshospital.org/sports-injury-prevention/gymnastics', kind: 'medical' },
  'childrens-mercy': { name: 'Children\'s Mercy — Gymnast wrist', url: 'https://www.childrensmercy.org/departments-and-clinics/orthopedics/sports-medicine/injury-management/gymnast-wrist/', kind: 'medical' },
  'schn': { name: 'Sydney Children\'s Hospitals — Strength training', url: 'https://www.schn.health.nsw.gov.au/kids-health-hub/physical-activity/organised-sport/strength-training', kind: 'medical' },
  'nhs': { name: 'NHS — Activity guidelines 5–18', url: 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-children-and-young-people/', kind: 'medical' },
  'sporza': { name: 'Sporza — Myths about youth strength training', url: 'https://sporza.be/nl/2026/03/12/belemmering-van-groei-en-beschadiging-aan-gewrichten-mythes-rond-krachttraining-bij-jongeren-ontkracht~1773312294670/', kind: 'academic' },
  'moeskops': { name: 'Moeskops et al. — Demands of youth artistic gymnastics', url: 'https://pure.cardiffmet.ac.uk/en/publications/the-physiological-demands-of-youth-artistic-gymnastics-applicatio/', kind: 'academic' },
  'dance-teacher': { name: 'Dance Teacher — Extreme stretches for children', url: 'https://dance-teacher.com/extreme-stretches-children/', kind: 'coach' },
  'tilley-legs': { name: 'Dave Tilley DPT — Leg power exercises', url: 'https://themanualtherapist.com/2016/12/top-5-fridays-5-leg-exercises-to-build.html', kind: 'physio' },
  'tilley-core': { name: 'Dave Tilley DPT — Core exercises', url: 'https://themanualtherapist.com/2016/10/top-5-fridays-5-non-traditional-core.html', kind: 'physio' },
  'steven-low': { name: 'Steven Low DPT — Full handstand progression', url: 'https://www.artofmanliness.com/articles/build-ability-full-handstand/', kind: 'physio' },
  'ghq-home': { name: 'GymnasticsHQ — At-home workout plans', url: 'https://gymnasticshq.com/gymnastics-at-home-workout-plans/', kind: 'coach' },
  'ghq-principles': { name: 'GymnasticsHQ — Strength training principles', url: 'https://gymnasticshq.com/8-strength-training-principles-for-gymnasts', kind: 'coach' },
  'ghq-handstand': { name: 'GymnasticsHQ — Handstand workout', url: 'https://gymnasticshq.com/5-minute-handstand-workout/', kind: 'coach' },
  'ghq-splits': { name: 'GymnasticsHQ — How to do the splits', url: 'https://gymnasticshq.com/how-to-do-a-split/', kind: 'coach' },
  'ghq-flexibility': { name: 'GymnasticsHQ — Flexibility in gymnastics', url: 'https://gymnasticshq.com/flexibility-in-gymnastics', kind: 'coach' },
  'gymnasticbodies': { name: 'GymnasticBodies — Stall-bar exercises', url: 'https://gymnasticbodies.com/exercises/vertical-pike-hang', kind: 'coach' },
  'gymmax': { name: 'GymMAX@HOME (Belgian club)', url: 'https://sites.google.com/gymmax.be/gymmaxhome/competitie/demo/2111', kind: 'coach' },
  'sportplan': { name: 'Sportplan — Wall-bar drills', url: 'https://www.sportplan.net/drills/Gymnastics/C-Walk-Overs-Backwards/Bridge-Exits-gymc109a.jsp', kind: 'coach' },
  'szeged': { name: 'University of Szeged — Wall-bar exercises', url: 'https://eta.bibl.u-szeged.hu/1251/2/gymnastic/gymnastic/www.jgypk.hu/tamop15e/tananyag_html/gymnastic/wall_bars_exercises.html', kind: 'academic' },
  'breaking-muscle': { name: 'Breaking Muscle — Gymnastics foundation', url: 'https://breakingmuscle.com/fitness/why-you-need-a-gymnastics-foundation', kind: 'coach' },
  'antranik': { name: 'Antranik — Progressions for static holds', url: 'https://antranik.org/progression-exercises-for-static-holds/', kind: 'coach' },
  'american-gymnast': { name: 'American Gymnast — Wrist and shoulder strength', url: 'https://go.american-gymnast.com/training-information/tag/wrist-strength', kind: 'coach' },
  'fitshop-benchk': { name: 'Fitshop — BenchK 733 specifications', url: 'https://www.fitshop.co.uk/benchk-733-series-7-700-wall-bars-steel-pull-up-barbell-holder-dip-bar-bench-benchk-733', kind: 'manufacturer' },
  'peak-stall': { name: 'Peak Primal Wellness — Stall bar exercises', url: 'https://peakprimalwellness.com/blogs/wellness/stall-bars-exercises', kind: 'manufacturer' },
  'peak-swedish': { name: 'Peak Primal Wellness — Swedish ladder guide', url: 'https://peakprimalwellness.com/blogs/wellness/swedish-ladder-exercises', kind: 'manufacturer' },
  'beyond-balance': { name: 'Beyond Balance — Stall bars for kids', url: 'https://beyond-balance.net/blogs/beyond-balance-blog/top-5-exercises-for-kids-using-stall-bars', kind: 'manufacturer' },
  'shop-apotheke': { name: 'Shop Apotheke — Sprossenwand-Übungen', url: 'https://www.shop-apotheke.com/fitness-trends/sprossenwand-uebungen-fuer-zuhause/', kind: 'manufacturer' },
  'veiligheid': { name: 'VeiligheidNL — Val OK!', url: 'https://www.veiligheid.nl/sites/default/files/2022-04/Val%20OK%21%20Voorover%20vallen%20C%20School.pdf', kind: 'medical' },
  'rbwf-routine': { name: 'r/bodyweightfitness Recommended Routine', url: 'https://redditbwf.github.io/wiki/recommended_routine.html', kind: 'community' },
  'rbwf-support': { name: 'r/bodyweightfitness — Support progression', url: 'https://asdjflk.github.io/r/bodyweightfitness/wiki/exercises/support', kind: 'community' },
  // Second research round
  'gymbc-kickstart-l3': { name: 'Gymnastics BC — KICKSTART Level 3 tests', url: 'https://gymbc.org/media/d1jpzffn/kickstart-l3.pdf', kind: 'federation' },
  'fig-mag-tests': { name: 'FIG men\'s age-group physical test battery (peer-reviewed)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6358534', kind: 'academic' },
  'usag-shoulder': { name: 'USA Gymnastics — Suggested shoulder exercises', url: 'https://static.usagym.org/PDFs/about/wellness/exercise/shoulder1.pdf', kind: 'federation' },
  'gb-pommel-forum': { name: 'GymnasticBodies coaches — Pommel horse strength', url: 'https://gymnasticbodies.com/forum/topic/265-important-strenght-exercises-for-the-pommel-horse', kind: 'coach' },
  'gb-seated-pike': { name: 'GymnasticBodies — Seated pike lift', url: 'https://www.gymnasticbodies.com/exercises/seated-pike-lift/', kind: 'coach' },
  'precision-acro': { name: 'Precision Acrobatics (with a physio) — Balance and ankles', url: 'https://precisionacrobatics.blogspot.com/2017/08', kind: 'physio' },
  'flo-conditioning': { name: 'FloGymnastics — Fun conditioning ideas', url: 'https://www.flogymnastics.com/articles/6519272-10-fun-gymnastics-conditioning-ideas-to-try', kind: 'coach' },
  'youth-throwers-ten': { name: 'Youth Throwers Ten (Int J Sports Phys Ther 2021)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8637265', kind: 'physio' },
  'uf-throwers-ten': { name: 'University of Florida Orthopaedics — Throwers Ten', url: 'https://www.ortho.ufl.edu/throwers-ten', kind: 'physio' },
  'fifa-11-kids': { name: 'FIFA 11+ Kids injury-prevention warm-up', url: 'https://projectplay.org/s/FIFA-11-Kids-1.pdf', kind: 'medical' },
  'nsca-youth-coach': { name: 'NSCA Coach — Teaching youth athletes (squat progression)', url: 'https://nsca.com/education/articles/nsca-coach/teaching-and-motivating-youth-athletesa-personal-perspective', kind: 'academic' },
  'nsca-carries': { name: 'NSCA Coach — Loaded carries', url: 'https://www.nsca.com/education/articles/nsca-coach/increase-hip-and-trunk-stability-with-loaded-carries/', kind: 'academic' },
  'acsm-youth': { name: 'ACSM — Youth strength training', url: 'https://acsm.org/mythbusting-youth-resistance-training/', kind: 'academic' },
  'eurofit': { name: 'Eurofit / FitnessGram flexed-arm hang test', url: 'https://www.topendsports.com/testing/tests/bent-arm-hang-eurofit.htm', kind: 'academic' },
  'kidshealth': { name: 'KidsHealth (Nemours) — Strength training', url: 'https://kidshealth.org/en/parents/strength-training.html', kind: 'medical' },
  'kngu-leerlijn': { name: 'KNGU — Technische Leerlijn Turnen Heren 2021', url: 'https://dutchgymnastics.nl/assets/Wedstrijdzaken-/Turnen-Heren/TECHNISCHE-LEERLIJN-TURNEN-HEREN-VOLLEDIG_DEF_-16-9-2021.pdf', kind: 'federation' },
  'tno-turnen': { name: 'TNO / KNGU — Blessures turnen (2009)', url: 'https://publications.tno.nl/publication/34622976/554377/hespen-2009-turnen.pdf', kind: 'academic' },
  'sportzorg-jeugd': { name: 'Sportzorg — Sportmedisch onderzoek bij jongeren', url: 'https://www.sportzorg.nl/_asset/_public/Files/SMNZ-Sportmedisch-onderzoek-bij-jongeren-210115.pdf', kind: 'medical' },
  'kvlo-turnen': { name: 'KVLO — Werken met een methodiek, turnen', url: 'https://kvlo.nl/MagazineDownloads/Werken%20met%20een%20methodiek%20turnen%20(2)%20-%20Klein%20Lankhorst%20(praktijk).pdf', kind: 'coach' }
} as const satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES
