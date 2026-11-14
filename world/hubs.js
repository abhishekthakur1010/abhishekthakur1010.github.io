/* Abhishek's World: every hub on the world map, and the walkable town behind it.
   A hub is one valley (town.html?hub=<id>). Its buildings sit on the fixed plots of the town plan:
     lane plots:   barn, clinic, gate, arcade
     square plots: cabin, saucer, chapel, market, studio
   Any plot a hub does not use becomes a "coming soon" lot.
   style = which builder draws it: cabin · saucer · chapel · market · studio · gate · clinic · barn · arcade
   Links are relative to /world/. */

const SUNSET = { fog: '#e3a687', top: '#3d3a78', mid: '#d9826f', hor: '#ffd28e', sun: '#ffb27a', sunI: 2.3, hemiSky: '#ffcfae', hemiGround: '#5e4e6e', hemiI: 1.25,
  fill: '#ffd6bb', amb: '#9484a8', cloud: '#ffc6a6', glow: [1, .72, .42], rays: .22, exposure: 1.14, snowLo: 44, snowHi: 62, snowfall: false, motes: '#ffe3b8', bg: '#e59a6f', veil: 'rgba(242,166,120,.55)', sunTint: ['255,225,130', '255,170,80', '255,140,70'] };

export const HUBS = {
  home: {
    name: 'Mountain Home', place: 'Himachal Pradesh', tint: '#5b8def', icon: '🏔',
    eyebrow: "Abhishek's World · where I'm from",
    lede: 'A snowy valley in the Himachal hills, where it all started. Walk up to the ghar, sit by the chulha, and hear the story of a pahadi kid who became a product designer.',
    gate: ['MOUNTAIN HOME', 'HIMACHAL · WHERE IT ALL STARTED'], board: ['THE VILLAGE', 'Every house here is a chapter', 'Snow on the deodars all year'],
    theme: { ...SUNSET, fog: '#b9c4d8', top: '#23305f', mid: '#7f90c2', hor: '#f3cdb6', sun: '#ffc9a0', sunI: 1.7, hemiSky: '#d4ddff', hemiGround: '#4a4a62', hemiI: 1.15, fill: '#cfd9ff', amb: '#8a93b8', cloud: '#e6ebff', glow: [1, .82, .66], rays: .14, exposure: 1.08, snowLo: 6, snowHi: 20, snowFloor: .8, snowfall: true, motes: '#ffffff', bg: '#9fb0d4', veil: 'rgba(160,178,214,.55)', sunTint: ['255,236,200', '255,205,160', '255,180,150'] },
    buildings: [
      { slot: 'cabin', style: 'cabin', name: 'Abhishek ka Ghar', sub: 'Playable home', kind: 'Walk around my cabin', tint: '#d62839', href: '../ghar/index.html', desc: 'My Himachali home as a little game: the chulha, the Gaddi dogs, chai by the window and every chapter of my story.' },
      { slot: 'chapel', style: 'chapel', name: 'My Story', sub: 'About me', kind: 'The long version', tint: '#2a9d8f', href: '../about-us.html', desc: 'From the hills of Himachal to leading product design at scale. The people, places and turns that shaped me.' },
      { slot: 'market', style: 'market', name: 'Story Chapters', sub: 'Interactive story', kind: 'Scroll through my journey', tint: '#e76f51', href: '../story/index.html', desc: 'My journey told chapter by chapter, as an interactive story.' },
      { slot: 'studio', style: 'studio', name: 'Scrollytelling', sub: '3D scroll story', kind: 'A story you scroll through', tint: '#d4a83a', href: '../scrolly/index.html', desc: 'A 3D scroll-driven story through the mountains.' },
      { slot: 'gate', style: 'gate', name: 'Cinematic Chapter', sub: 'Film-style intro', kind: 'Chapter one, on film', tint: '#c9a227', href: '../cinematic/index.html', desc: 'Chapter one of my story, shot like a film.' },
      { slot: 'barn', style: 'barn', name: 'Luna & Bruno', sub: 'The pack', kind: 'The real bosses', tint: '#b5121b', href: '../ghar/index.html', desc: 'Usually outdoors with Luna and Bruno. Meet the Gaddi dogs by the fire in the ghar.' },
    ],
  },

  city: {
    name: 'City Hub', place: 'Gurugram', tint: '#f2b705', icon: '🏙',
    eyebrow: "Abhishek's World · where I work",
    lede: 'The work district. Every building is a product I designed or led: commerce, logistics, health and AI. Walk the lane, step up to a door, and open the case study.',
    gate: ['CITY HUB', 'GURUGRAM · EVERY BUILDING IS A PRODUCT'], board: ['WORK SQUARE', 'Every building here is a product', 'Step up to a door to open it'],
    theme: { ...SUNSET },
    buildings: [
      { slot: 'barn', style: 'barn', name: 'JioMart', sub: 'Discovery & commerce', kind: 'Case study', tint: '#0f6fff', href: '../jiomart-discovery.html', desc: 'Rethinking product discovery for one of India’s largest grocery and commerce apps.' },
      { slot: 'clinic', style: 'clinic', name: 'Delhivery Express', sub: 'Logistics', kind: 'Case study', tint: '#d62839', href: '../delhivery-express.html', desc: 'Designing express parcel booking and tracking for India’s largest logistics company.' },
      { slot: 'saucer', style: 'saucer', name: 'HubEye', sub: 'Ops intelligence', kind: 'Case study', tint: '#7c5cff', href: '../hubeye.html', desc: 'Giving hub managers eyes on the ground: on-floor research turned into an operations product.' },
      { slot: 'studio', style: 'studio', name: 'Delfin', sub: 'Product design', kind: 'Case study', tint: '#2a9d8f', href: '../delfin.html', desc: 'A product case study from concept to shipped design.' },
      { slot: 'market', style: 'market', name: 'JioMart Deck', sub: 'Design decisions', kind: 'Presentation', tint: '#e76f51', href: '../jiomart-deck.html', desc: 'The deck: the design decisions behind the JioMart work, slide by slide.' },
      { slot: 'arcade', style: 'arcade', name: 'Visual Design', sub: 'UI gallery', kind: 'Gallery', tint: '#ff4fd8', href: '../profile.html#ui-visual', desc: 'A wall of UI and visual design work from over the years.' },
      { slot: 'chapel', style: 'chapel', name: 'Recommendations', sub: 'What people say', kind: 'Kind words', tint: '#1d7ed6', href: '../profile.html#recommendations', desc: 'Notes from the people I have worked with.' },
      { slot: 'gate', style: 'gate', name: 'Resume', sub: 'PDF', kind: 'Ten years, one page', tint: '#c9a227', href: '../resume.pdf?v=3', desc: 'Lead Product Designer, ten years of shipping products. The one-page version.' },
      { slot: 'cabin', style: 'cabin', name: 'Book a Call', sub: '30 minutes', kind: 'Let’s talk', tint: '#d4a83a', href: 'https://cal.com/abhishek-thakur-adhbch/30min', desc: 'Hiring a design leader, or want to talk products, design systems or AI? Grab 30 minutes.' },
    ],
  },

  play: {
    name: 'Fitness & Play', place: 'The weekend valley', tint: '#3fae6a', icon: '🚴',
    eyebrow: "Abhishek's World · what keeps me going",
    lede: 'A bright morning valley for everything away from the screen: workouts, long rides, the outdoors and a little play.',
    gate: ['FITNESS & PLAY', 'WORK OUT · RIDE · PLAY'], board: ['THE PLAYGROUND', 'Rides, reps and fresh air', 'The trail starts at the gate'],
    theme: { ...SUNSET, fog: '#cfe2ee', top: '#3a74c4', mid: '#8dbae6', hor: '#f5ead0', sun: '#fff1d6', sunI: 2.7, hemiSky: '#dcefff', hemiGround: '#5d6b4a', hemiI: 1.15, fill: '#e6f2ff', amb: '#8fa3b8', cloud: '#ffffff', glow: [1, .95, .82], rays: .1, exposure: 1.05, snowLo: 52, snowHi: 70, motes: '#fffbe6', bg: '#9fc6e8', veil: 'rgba(150,196,232,.5)', sunTint: ['255,250,225', '255,236,190', '255,226,170'] },
    buildings: [
      { slot: 'market', style: 'market', name: 'The Gym', sub: 'Strength', kind: 'Daily reps', tint: '#e76f51', href: '../ghar/index.html', desc: 'Strength training keeps the mind sharp. In the ghar you can even do a workout with me.' },
      { slot: 'barn', style: 'barn', name: 'Cycling Club', sub: 'Long rides', kind: 'Solo Gurgaon–Dehradun', tint: '#0f6fff', href: '../profile.html#interests', desc: 'Solo ride from Gurgaon to Dehradun, plus cyclothons. Thousands of kilometres on two wheels.' },
      { slot: 'cabin', style: 'cabin', name: 'Trek Base Camp', sub: 'Outdoors', kind: 'Into the hills', tint: '#2a9d8f', href: '../profile.html#interests', desc: 'Weekends in the outdoors, usually with Luna and Bruno.' },
      { slot: 'arcade', style: 'arcade', name: 'Game Room', sub: 'Play', kind: 'Play a game', tint: '#ff4fd8', href: '../profile.html', desc: 'Games and play. Try the archery game hidden in the banner on my profile.' },
      { slot: 'studio', style: 'studio', name: 'Music Corner', sub: 'Unwind', kind: 'Turn it up', tint: '#d4a83a', href: '../profile.html#interests', desc: 'The playlist that keeps the long rides and late design nights going.' },
    ],
  },

  dream: {
    name: 'Dream Place', place: 'Where I want to build next', tint: '#c06cff', icon: '✨',
    eyebrow: "Abhishek's World · where I'm headed",
    lede: 'A twilight valley for what comes next: the kind of team, studio and problems I want to work on. If you are building something like this, the door is open.',
    gate: ['DREAM PLACE', 'WHERE I WANT TO BUILD NEXT'], board: ['TOMORROW SQUARE', 'Every building is a dream job', 'Some of them might be yours'],
    theme: { ...SUNSET, fog: '#c7a6d6', top: '#1d1848', mid: '#8a5cb2', hor: '#ffb6a6', sun: '#ffb6d2', sunI: 1.9, hemiSky: '#f0c8ff', hemiGround: '#4a3a66', hemiI: 1.2, fill: '#e8c8ff', amb: '#9a84c0', cloud: '#ffd0f0', glow: [1, .7, .85], rays: .2, exposure: 1.12, snowLo: 40, snowHi: 58, motes: '#ffd9fb', bg: '#b58ad0', veil: 'rgba(180,140,210,.55)', sunTint: ['255,215,240', '255,170,220', '220,140,220'] },
    buildings: [
      { slot: 'saucer', style: 'saucer', name: 'Dream Studio', sub: 'A studio of my own', kind: 'The big dream', tint: '#c06cff', href: 'https://cal.com/abhishek-thakur-adhbch/30min', desc: 'A small, sharp product studio that designs for millions. Want to build it together?' },
      { slot: 'studio', style: 'studio', name: 'AI Product Lab', sub: 'AI-first products', kind: 'Where design meets AI', tint: '#2a9d8f', href: 'https://www.linkedin.com/in/abhishekthakur1010/', desc: 'Designing AI-native products where the interface thinks with you.' },
      { slot: 'chapel', style: 'chapel', name: 'Design Leadership', sub: 'Teams', kind: 'Grow great designers', tint: '#1d7ed6', href: 'https://www.linkedin.com/in/abhishekthakur1010/', desc: 'Building and growing a design team that ships work it is proud of.' },
      { slot: 'gate', style: 'gate', name: 'Global Product', sub: 'Worldwide scale', kind: 'Design for the world', tint: '#c9a227', href: 'mailto:abhishekiit2k12@gmail.com', desc: 'Products used across countries and cultures. Say hello if you are hiring for this.' },
      { slot: 'arcade', style: 'arcade', name: 'Games I Want to Make', sub: 'Playful products', kind: 'Play as a medium', tint: '#ff4fd8', href: '../ghar/index.html', desc: 'Portfolios you walk through, stories you play. This world is the first one.' },
    ],
  },

  travel: {
    name: 'Travel Harbour', place: '6–7 countries so far', tint: '#ff8a3d', icon: '✈',
    eyebrow: "Abhishek's World · places I've been",
    lede: 'A golden-hour harbour town for the road: countries visited, the ones still on the list, and what travel taught me about designing for people.',
    gate: ['TRAVEL HARBOUR', '6–7 COUNTRIES · MANY MORE TO GO'], board: ['THE HARBOUR', 'Every building is a trip', 'More on the way'],
    theme: { ...SUNSET, fog: '#efc79a', top: '#4a5fa8', mid: '#e6a070', hor: '#ffe0a0', sun: '#ffc27a', sunI: 2.5, hemiSky: '#ffe2c0', hemiGround: '#6a5a4a', hemiI: 1.2, cloud: '#ffe0c0', exposure: 1.1, snowLo: 50, snowHi: 68, bg: '#f0b27a' },
    buildings: [
      { slot: 'market', style: 'market', name: 'Passport Office', sub: 'Countries visited', kind: 'Travel log', tint: '#ff8a3d', href: '../profile.html#interests', desc: '6–7 countries so far, and counting.' },
      { slot: 'chapel', style: 'chapel', name: 'Lessons from the Road', sub: 'Design notes', kind: 'What travel teaches', tint: '#2a9d8f', href: '../about-us.html', desc: 'Watching people use products in other countries is the best user research there is.' },
      { slot: 'cabin', style: 'cabin', name: 'Next Stop', sub: 'Bucket list', kind: 'Still on the list', tint: '#d62839', href: 'mailto:abhishekiit2k12@gmail.com?subject=Travel%20tips', desc: 'The places still on the list. Got a recommendation? Send it over.' },
    ],
  },

  give: {
    name: 'Giving Back', place: 'Community corner', tint: '#ef476f', icon: '❤',
    eyebrow: "Abhishek's World · giving back",
    lede: 'A warm little village for the causes I give time to: CRY Foundation and the Robin Hood Army.',
    gate: ['GIVING BACK', 'CRY FOUNDATION · ROBIN HOOD ARMY'], board: ['COMMUNITY SQUARE', 'Time given, never wasted', 'Join in'],
    theme: { ...SUNSET, fog: '#e8b3a0', top: '#4a3a78', mid: '#e08a7a', hor: '#ffd6a0', cloud: '#ffd0c0' },
    buildings: [
      { slot: 'clinic', style: 'clinic', name: 'CRY Foundation', sub: 'Child rights', kind: 'Volunteering', tint: '#ef476f', href: 'https://www.cry.org/', desc: 'Supporting CRY’s work for children’s rights in India.' },
      { slot: 'barn', style: 'barn', name: 'Robin Hood Army', sub: 'Food for all', kind: 'Volunteering', tint: '#3fae6a', href: 'https://robinhoodarmy.com/', desc: 'Getting surplus food from restaurants to people who need it.' },
    ],
  },
};

/* the order hubs appear in on the world map, and where they sit on the island (x, z in map units) */
export const MAP = [
  { id: 'home', x: -34, z: -40 },
  { id: 'city', x: 30, z: -6 },
  { id: 'play', x: -38, z: 22 },
  { id: 'dream', x: 4, z: -62 },
  { id: 'travel', x: 46, z: 36 },
  { id: 'give', x: -4, z: 48 },
];
