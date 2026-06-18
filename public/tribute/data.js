// ================= IAF DATA =================

const FLEET = [
  {
    id: 'rafale',
    name: 'Dassault Rafale',
    role: 'Omnirole Fighter',
    gen: '4.5 Generation',
    speed: 1912,           // km/h max
    range: 3700,           // km ferry
    ceiling: 15835,        // m
    crew: '1–2',
    manufacturer: 'Dassault Aviation · France',
    weapons: 'METEOR · SCALP · HAMMER · MICA · 30mm GIAT',
    intro: '2020 (IAF)',
    color: '#5fb8ff',
    accent: '#0a7fff',
    units: 36,
    blurb: 'Twin-engine, canard delta omnirole fighter inducted into 17 "Golden Arrows" and 101 "Falcons" Squadrons. SPECTRA EW suite, advanced AESA radar and the long-reach Meteor BVRAAM make it the spear-tip of Indian air dominance.',
    model: 'fabb8472bc2e413282c80406b13ff1a7',
    modelAuthor: 'andertan',
    modelAuthorUrl: 'https://sketchfab.com/andertan',
    modelUrl: 'https://sketchfab.com/3d-models/dassault-rafale-fabb8472bc2e413282c80406b13ff1a7'
  },
  {
    id: 'su30',
    name: 'Sukhoi Su-30 MKI',
    role: 'Air Superiority',
    gen: '4.5 Generation',
    speed: 2120,
    range: 3000,
    ceiling: 17300,
    crew: '2',
    manufacturer: 'HAL · Sukhoi · India / Russia',
    weapons: 'BrahMos-A · Astra · R-77 · R-73 · KAB-1500',
    intro: '2002',
    color: '#ff7a59',
    accent: '#ff4e1f',
    units: 272,
    blurb: 'The backbone of the IAF — a thrust-vectoring, two-seat heavyweight with phenomenal manoeuvrability. The world\'s only operator of the air-launched BrahMos cruise missile.',
    model: '421bd56fd97c4c7196904e778f27aef7',
    modelAuthor: 'Immersive3D',
    modelAuthorUrl: 'https://sketchfab.com/Immersive3A',
    modelUrl: 'https://sketchfab.com/3d-models/pbr-sukhoi-su-30-421bd56fd97c4c7196904e778f27aef7'
  },
  {
    id: 'tejas',
    name: 'HAL Tejas',
    role: 'Light Combat Aircraft',
    gen: '4+ Generation',
    speed: 1980,
    range: 3000,
    ceiling: 15240,
    crew: '1',
    manufacturer: 'Hindustan Aeronautics · India',
    weapons: 'Astra · Derby · R-73 · Python-5 · 23mm GSh',
    intro: '2016',
    color: '#ffb43d',
    accent: '#ff8a00',
    units: 40,
    blurb: 'India\'s indigenous tailless delta LCA — lighter than a Mirage, smarter than a MiG-21. The Mk1A variant adds AESA radar, EW suite and a glass cockpit. 83 more on order.',
    model: '3b6d615077af4d1a978283d8a2b87ceb',
    modelAuthor: 'Sengchor',
    modelAuthorUrl: 'https://sketchfab.com/Sengchor',
    modelUrl: 'https://sketchfab.com/3d-models/hal-tejas-3b6d615077af4d1a978283d8a2b87ceb'
  },
  {
    id: 'mirage',
    name: 'Dassault Mirage 2000',
    role: 'Multirole Fighter',
    gen: '4 Generation',
    speed: 2336,
    range: 1550,
    ceiling: 17000,
    crew: '1–2',
    manufacturer: 'Dassault Aviation · France',
    weapons: 'MICA · Magic II · Crystal Maze · 30mm DEFA',
    intro: '1985',
    color: '#ffd166',
    accent: '#f59f00',
    units: 49,
    blurb: 'The "Vajra" — hero of Kargil 1999 and Balakot 2019. Precision strike maestro, upgraded to MK-2 standard with Thales RDY-2 radar.',
    model: '3894c147f6474d5eb6308b8d2724a914',
    modelAuthor: 'Jeyhun1985',
    modelAuthorUrl: 'https://sketchfab.com/Jeyhun1985',
    modelUrl: 'https://sketchfab.com/3d-models/mirage-2000-5f-3894c147f6474d5eb6308b8d2724a914'
  },
  {
    id: 'c17',
    name: 'Boeing C-17 Globemaster III',
    role: 'Strategic Airlift',
    gen: 'Heavy Transport',
    speed: 830,
    range: 10390,
    ceiling: 13716,
    crew: '3',
    manufacturer: 'Boeing · USA',
    weapons: 'N/A · 77,500 kg payload',
    intro: '2013',
    color: '#9fb3c8',
    accent: '#5b7a99',
    units: 11,
    blurb: 'India\'s strategic lifter — operated by 81 "Skylords" Sqn at Hindon. Has flown evacuations from Kabul, Wuhan, Ukraine and rapid-deployed troops to Ladakh in 2020.',
    model: '597e0d7f9e3446719a2f2de3dd3fa67d',
    modelAuthor: 'AnirudhRao',
    modelAuthorUrl: 'https://sketchfab.com/AnirudhRao',
    modelUrl: 'https://sketchfab.com/3d-models/c17-globemaster-iii-597e0d7f9e3446719a2f2de3dd3fa67d'
  },
  {
    id: 'apache',
    name: 'Boeing AH-64E Apache',
    role: 'Attack Helicopter',
    gen: 'Rotary Attack',
    speed: 293,
    range: 480,
    ceiling: 6400,
    crew: '2',
    manufacturer: 'Boeing · USA',
    weapons: 'Hellfire · Stinger · Hydra-70 · 30mm M230',
    intro: '2019',
    color: '#7be38b',
    accent: '#2ea44f',
    units: 22,
    blurb: 'Hunter-killer of the rotary fleet. Longbow fire-control radar fingerprints up to 256 targets, engages 16 simultaneously. Operated by 125 "Gladiators" Sqn.',
    model: '19e8e5cf073747e89f2c900b87ad9d6f',
    modelAuthor: 'Carbuni',
    modelAuthorUrl: 'https://sketchfab.com/carbuni',
    modelUrl: 'https://sketchfab.com/3d-models/apache-ah-64d-19e8e5cf073747e89f2c900b87ad9d6f'
  },
  {
    id: 'chinook',
    name: 'Boeing CH-47F Chinook',
    role: 'Heavy Lift Helicopter',
    gen: 'Rotary Lift',
    speed: 315,
    range: 740,
    ceiling: 6100,
    crew: '3',
    manufacturer: 'Boeing · USA',
    weapons: 'N/A · 10,886 kg sling-load',
    intro: '2019',
    color: '#c9a7ff',
    accent: '#8a5cff',
    units: 15,
    blurb: 'Tandem-rotor workhorse capable of lifting M777 howitzers into Himalayan firing positions. Operated by 126 "Featherweights" Sqn from Chandigarh.',
    model: '7d5c8e4957264d27af562dc0ac0be755',
    modelAuthor: 'Studio Lab',
    modelAuthorUrl: 'https://sketchfab.com/studiolab.dev',
    modelUrl: 'https://sketchfab.com/3d-models/chinook-ch-47-military-transport-helicopter-7d5c8e4957264d27af562dc0ac0be755'
  },
  {
    id: 'amca',
    name: 'HAL AMCA',
    role: 'Stealth Multirole Fighter',
    gen: '5th Generation',
    speed: 2450,
    range: 2800,
    ceiling: 16800,
    crew: '1',
    manufacturer: 'HAL · ADA · India',
    weapons: 'Astra Mk2/Mk3 · SFDR · Rudram · Internal Bay · 23mm',
    intro: '2035 (planned)',
    color: '#7ef7c8',
    accent: '#1ea934',
    units: 0,
    blurb: 'India\'s first indigenous 5th-generation stealth fighter — twin-engine, low-observable shaping, internal weapons bay, AESA radar and an AI-assisted cockpit. The Cabinet Committee on Security cleared the AMCA programme in 2024 for development by HAL and ADA, with the first prototype rollout targeted for the late 2020s and induction into IAF squadrons in the 2030s. Future Mk2 will fly an indigenous 110 kN class engine.',
    model: 'b2b598c09f3f4c2793c722cbd68b7c02',
    modelAuthor: 'Ankur',
    modelAuthorUrl: 'https://sketchfab.com/anx450z',
    modelUrl: 'https://sketchfab.com/3d-models/amca-upload-b2b598c09f3f4c2793c722cbd68b7c02'
  }
];

const TIMELINE = [
  {
    year: '1932',
    title: 'Birth of the Service',
    body: 'The Royal Indian Air Force is established on 8 October. No. 1 Squadron forms at Drigh Road with four Westland Wapiti biplanes and six pilots.',
    tag: 'FOUNDING'
  },
  {
    year: '1947',
    title: 'Republic\'s Wings',
    body: 'Independence airlift to Srinagar saves Kashmir. Dakotas of No. 12 Sqn fly 28-minute sorties under fire — the IAF\'s first combat operation.',
    tag: 'KASHMIR'
  },
  {
    year: '1965',
    title: 'War with Pakistan',
    body: 'Mystères, Gnats and Hunters dogfight Sabres over Punjab. Sqn Ldr A.B. Devayya is posthumously awarded the Maha Vir Chakra for ramming a Starfighter.',
    tag: 'CONFLICT'
  },
  {
    year: '1971',
    title: 'Liberation of Bangladesh',
    body: 'In 13 days the IAF flies 6,000 sorties, achieves complete air superiority, and enables the surrender of 93,000 Pakistani troops at Dhaka.',
    tag: 'VICTORY'
  },
  {
    year: '1984',
    title: 'Operation Meghdoot',
    body: 'IAF helicopters insert Indian troops onto Siachen Glacier at 22,000 ft — the highest battlefield on Earth. Cheetahs still serve there today.',
    tag: 'HIGH ALTITUDE'
  },
  {
    year: '1999',
    title: 'Operation Safed Sagar',
    body: 'Mirage 2000s drop laser-guided Paveways on Tiger Hill and Muntho Dhalo, decisively shifting the Kargil war in India\'s favour.',
    tag: 'KARGIL'
  },
  {
    year: '2019',
    title: 'Balakot Airstrike',
    body: 'On 26 February, 12 Mirage 2000s strike a JeM training camp 80 km inside Pakistan — the first cross-border airstrike since 1971.',
    tag: 'STRIKE'
  },
  {
    year: '2020',
    title: 'Rafale Inducted',
    body: 'No. 17 "Golden Arrows" Sqn formally inducts the Rafale at Ambala — India\'s first 4.5-gen omnirole platform.',
    tag: 'NEW ERA'
  },
  {
    year: '2024',
    title: 'Tejas Mk1A & AMCA',
    body: 'HAL rolls out the first Tejas Mk1A; CCS approves the indigenous fifth-generation AMCA stealth fighter programme.',
    tag: 'INDIGENOUS'
  },
  {
    year: 'NOW',
    title: 'Vision 2047',
    body: 'A leaner, deadlier, network-centric force — 42 squadrons of 4.5/5 gen fighters, indigenous AEW&C, and homegrown stealth UCAVs.',
    tag: 'FUTURE'
  }
];

const WARRIORS = [
  {
    name: 'MIAF Arjan Singh',
    rank: 'Marshal of the Air Force',
    medal: 'DFC · PVSM',
    years: '1919 – 2017',
    bio: 'The only IAF officer ever promoted to five-star rank. Led No. 1 Sqn in the Burma Campaign aged 25; commanded the IAF in the 1965 war.',
    color: '#ff9933'
  },
  {
    name: 'Nirmal Jit Singh Sekhon',
    rank: 'Flying Officer · PVC',
    medal: 'Param Vir Chakra',
    years: '1943 – 1971',
    bio: 'The IAF\'s only Param Vir Chakra. Took off from Srinagar in a Gnat under attack, downed two Sabres and damaged a third before being shot down.',
    color: '#138808'
  },
  {
    name: 'Air Cmde M.S. Bawa',
    rank: 'Air Commodore · MVC',
    medal: 'Maha Vir Chakra',
    years: '1930 – 1995',
    bio: 'Led the daring Hunter strike on Sargodha airbase in 1965, destroying multiple PAF aircraft on the ground in a single low-level pass.',
    color: '#5fb8ff'
  },
  {
    name: 'Wg Cdr Abhinandan Varthaman',
    rank: 'Wing Commander · VrC',
    medal: 'Vir Chakra',
    years: 'b. 1983',
    bio: 'Engaged a PAF F-16 in a MiG-21 Bison on 27 Feb 2019, scoring a confirmed kill before ejecting. Returned home a national hero.',
    color: '#ffd166'
  },
  {
    name: 'Sqn Ldr Ajjamada B. Devayya',
    rank: 'Squadron Leader · MVC',
    medal: 'Maha Vir Chakra',
    years: '1932 – 1965',
    bio: 'Posthumously decorated for shooting down a PAF Starfighter over Sargodha while flying a vastly inferior Mystère IV in 1965.',
    color: '#ff7a59'
  },
  {
    name: 'Gp Capt A.K. Gokhale',
    rank: 'Group Captain · VrC',
    medal: 'Vir Chakra',
    years: 'Kargil 1999',
    bio: 'Mirage 2000 strike leader who delivered the first laser-guided bomb on Tiger Hill — a turning point of the Kargil war.',
    color: '#9fb3c8'
  }
];

const SQUADRONS = [
  { num: '17', name: 'Golden Arrows', motto: 'Udyamodvijayah', aircraft: 'Rafale', base: 'Ambala', color: '#ffd166' },
  { num: '101', name: 'Falcons', motto: 'Always on Top', aircraft: 'Rafale', base: 'Hashimara', color: '#5fb8ff' },
  { num: '1',   name: 'Tigers', motto: 'In Pursuit', aircraft: 'Mirage 2000', base: 'Gwalior', color: '#ff7a59' },
  { num: '7',   name: 'Battle Axes', motto: 'Hindustan Sarvopari', aircraft: 'Mirage 2000', base: 'Gwalior', color: '#ff9933' },
  { num: '24',  name: 'Hunting Hawks', motto: 'Strike & Conquer', aircraft: 'Su-30 MKI', base: 'Bareilly', color: '#7be38b' },
  { num: '45',  name: 'Flying Daggers', motto: 'Forward, Always Forward', aircraft: 'Tejas', base: 'Sulur', color: '#c9a7ff' },
  { num: '81',  name: 'Skylords', motto: 'Wings to the Nation', aircraft: 'C-17', base: 'Hindon', color: '#9fb3c8' },
  { num: '125', name: 'Gladiators', motto: 'Strike Hard, Strike Sure', aircraft: 'Apache', color: '#138808', base: 'Pathankot' }
];

// lat = top%, lon = left% — calibrated against india-map.png outline
const BASES = [
  { name: 'Srinagar AFS', cmd: 'Western', lat: 9, lon: 28, role: 'MiG-29UPG', acft: 'MiG-29' },
  { name: 'Leh AFS', cmd: 'Western (Forward)', lat: 10, lon: 38, role: 'Heli Ops · Forward', acft: 'Chinook · Mi-17' },
  { name: 'Pathankot AFS', cmd: 'Western', lat: 15, lon: 31, role: 'Apache · 125 Sqn', acft: 'Apache' },
  { name: 'Ambala AFS', cmd: 'Western', lat: 19, lon: 33, role: 'Rafale · 17 Sqn', acft: 'Rafale' },
  { name: 'Hindon AFS', cmd: 'Western', lat: 23, lon: 34, role: 'C-17 · 81 Sqn', acft: 'Strategic Airlift' },
  { name: 'Jodhpur AFS', cmd: 'South-Western', lat: 30, lon: 22, role: 'Su-30 MKI · Rafale Det', acft: 'Sukhoi' },
  { name: 'Gwalior AFS', cmd: 'Central', lat: 30, lon: 38, role: 'Mirage 2000', acft: 'Mirage 2000' },
  { name: 'Bagdogra AFS', cmd: 'Eastern', lat: 30, lon: 62, role: 'MiG-21 Bison', acft: 'MiG-21' },
  { name: 'Hashimara AFS', cmd: 'Eastern', lat: 29, lon: 68, role: 'Rafale · 101 Sqn', acft: 'Rafale' },
  { name: 'Tezpur AFS', cmd: 'Eastern', lat: 26, lon: 75, role: 'Su-30 MKI', acft: 'Sukhoi' },
  { name: 'Pune (Lohegaon)', cmd: 'South-Western', lat: 53, lon: 26, role: 'Su-30 MKI', acft: 'Sukhoi' },
  { name: 'Bengaluru (Yelahanka)', cmd: 'Training', lat: 76, lon: 33, role: 'Transport · Training', acft: 'C-130J' },
  { name: 'Sulur AFS', cmd: 'Southern', lat: 83, lon: 34, role: 'Tejas · 45 Sqn', acft: 'Tejas' },
  { name: 'Car Nicobar AFS', cmd: 'Andaman', lat: 86, lon: 86, role: 'FRA · Forward', acft: 'Su-30' }
];

const HUMANITARIAN = [
  { year: '2013', name: 'Operation Rahat', loc: 'Uttarakhand Floods', stat: '20,000+ rescued · 3,600 sorties', body: 'IAF helicopters flew round-the-clock through monsoon clouds to evacuate stranded pilgrims from Kedarnath.' },
  { year: '2015', name: 'Operation Maitri', loc: 'Nepal Earthquake', stat: '11,200 evacuated · 1,700 tons aid', body: 'Within 6 hours of the quake, C-17s, IL-76s and Mi-17s formed an air bridge to Kathmandu.' },
  { year: '2018', name: 'Operation Sahayata', loc: 'Kerala Floods', stat: '900+ airlifted · 24/7 rotary ops', body: 'Mi-17 V5s and ALH Dhruvs winched survivors from rooftops across submerged districts.' },
  { year: '2020', name: 'COVID Air Bridge', loc: 'Global', stat: '900+ sorties · O₂ tanks worldwide', body: 'IL-76s and C-17s flew cryogenic oxygen containers from Singapore, Germany and the UAE.' },
  { year: '2021', name: 'Operation Devi Shakti', loc: 'Kabul Evacuation', stat: '800+ evacuated', body: 'C-17 Globemasters lifted Indian nationals and Afghan Sikhs out of a collapsing Kabul.' },
  { year: '2023', name: 'Operation Dost', loc: 'Türkiye / Syria Quake', stat: 'Field hospital airlifted', body: 'C-17s deployed the 60-bed Army Field Hospital and NDRF teams within 24 hours.' },
  { year: '2024', name: 'Operation Brahma', loc: 'Myanmar Quake', stat: '120 tons HADR cargo', body: 'IAF C-130Js and C-17s landed relief supplies and search teams in Naypyidaw.' }
];

const GALLERY = [
  { cat: 'Aircraft', label: 'Rafale · Omnirole Fighter', tint: ['#0a7fff','#5fb8ff'], image: 'assets/rafale.png' },
  { cat: 'Aircraft', label: 'Su-30 MKI · Air Dominance', tint: ['#ff4e1f','#ff9b6e'], image: 'assets/su30.png' },
  { cat: 'Aircraft', label: 'Tejas · Indigenous LCA', tint: ['#ff8a00','#ffd166'], image: 'assets/tejas.png' },
  { cat: 'Aircraft', label: 'C-17 · Strategic Airlift', tint: ['#5b7a99','#cad7e6'], image: 'assets/c17.png' },
  { cat: 'Pilots', label: 'Sarang Display Team', tint: ['#ff9933','#ffd6a8'], image: 'assets/sarang.png' },
  { cat: 'Pilots', label: 'Pre-Flight Briefing', tint: ['#1a3a5e','#5fb8ff'], image: 'assets/briefing.png' },
  { cat: 'Operations', label: 'Precision Strike Ops', tint: ['#0a1628','#ff4e1f'], image: 'assets/strike.png' },
  { cat: 'Operations', label: 'High Altitude Ops', tint: ['#1a3a5e','#ffd166'], image: 'assets/high_alt.png' },
  { cat: 'Air Shows', label: 'Suryakiran Formation', tint: ['#0a7fff','#ff9933'], image: 'assets/suryakiran.png' },
  { cat: 'Air Shows', label: 'Aerobatic Heart', tint: ['#ff9933','#138808'], image: 'assets/heart.png' },
  { cat: 'Infrastructure', label: 'Leh · 11,000 ft', tint: ['#3a5a7a','#9fb3c8'], image: 'assets/leh.png' },
  { cat: 'Infrastructure', label: 'Hardened Aircraft Shelter', tint: ['#0a1628','#3a5a7a'], image: 'assets/shelter.png' }
];

const TRIBUTES = [
  { name: 'Aarav · Mumbai',       msg: 'Every time I look up and see a contrail, I think of you. Jai Hind Ki Sena.' },
  { name: 'Priya · Bengaluru',    msg: 'My grandfather flew Vampires in 1962. This salute is for him, and for every airman after.' },
  { name: 'Karan · Chandigarh',   msg: 'Watched Sarang at the Air Show as a kid. Today I\'m an aerospace engineer because of them.' },
  { name: 'Meera · Delhi',        msg: 'To the women breaking the sound barrier and the glass ceiling — we are watching, and we are proud.' },
  { name: 'Vikram · Pune',        msg: 'For the Rafale and the Vajra. For Abhinandan. For the ones we never named. Vande Mataram.' },
  { name: 'Tashi · Leh',          msg: 'The thump of the Chinook over our valleys is the sound of safety. Thank you.' },
  { name: 'Anjali · Kolkata',     msg: 'For 1971 — for what you gave a new nation. Bangladesh remembers. India remembers.' },
  { name: 'Rohan · Chennai',      msg: 'Tejas — the lightning. Made in India. Flown by heroes. The future is bright.' },
  { name: 'Saira · Srinagar',     msg: 'Through the worst floods of 2014, your helicopters were the first thing we saw. Shukriya.' },
  { name: 'Devansh · Jaipur',     msg: 'I am 11. When I grow up, I will fly for you. Touch the sky with glory.' },
  { name: 'Captain (Retd) M.R.',  msg: 'Once a fighter pilot, forever a fighter pilot. To my brothers still on the line — keep them flying.' },
  { name: 'Aisha · Hyderabad',    msg: 'For Sekhon. For every PVC story we tell our children. This nation owes you its sky.' }
];

const COMM_LINES = [
  'GARUDA-1 · airborne · climbing FL380',
  'THUNDER-3 · contact bogey · 045 · 22 nm',
  'TANKER FLEUR · refuel complete · 4 receivers',
  'BASE AMBALA · weather CAVOK · runway 14 active',
  'ARROW-7 · weapons safe · RTB',
  'EAGLE-2 · CAP station alpha · on station',
  'AWACS NETRA · paint clear · 360°',
  'GARUDA-1 · tally three · engaging',
  'THUNDER-3 · fox-3 · splash one',
  'ATC HINDON · C-17 SKYLORD-04 · cleared to land',
  'CHINOOK 126 · sling load secure · departing Leh',
  'STATION KEEPING · all assets nominal'
];
