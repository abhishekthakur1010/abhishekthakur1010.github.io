/* ============================================================
   FROM THE MOUNTAINS TO MILLIONS — story prototype config
   Single source of truth for chapters, beats, places and metrics.
   Edit copy here; the engine reads everything from this object.
   ============================================================ */
window.STORY = {
  title: "From the Mountains to Millions",
  author: "Abhishek Thakur",
  contact: "mailto:abhi.thakur1010@gmail.com",

  // Places used by the real-time globe (lat, lon in degrees).
  // `home` is a general Himalayan point, not a specific village — adjust freely.
  places: {
    home: { lat: 31.1, lon: 77.2, label: "The Himalayas" },
    college: { lat: 25.43, lon: 81.85, label: "Allahabad · IIIT-A" },
  },

  // Chapter 01 pre-rendered sequence. Shares the frame folder planned in
  // cinematic/STORYBOARD.md, so one set of renders feeds both pages.
  sequence: {
    frameCount: 120,
    pad: 4,
    startIndex: 1,
    exts: ["webp", "jpg", "png"],
    pathDesktop: "../cinematic/assets/chapter-01/desktop/frame_{n}.{ext}",
    pathMobile: "../cinematic/assets/chapter-01/mobile/frame_{n}.{ext}",
    // Storyboard shots, shown as a previs card while frames are missing.
    shots: [
      { from: 1, to: 30, name: "Aerial establishing", note: "High wide of the Himalayas at sunrise; slow descent toward a valley village." },
      { from: 31, to: 60, name: "Descend + approach", note: "Camera drops toward a hillside home; the winding road appears; a boy outside, from behind." },
      { from: 61, to: 90, name: "Behind the boy", note: "He shoulders the backpack, looks to the valley, takes his first steps onto the road." },
      { from: 91, to: 120, name: "Follow to horizon", note: "Camera follows him down the road; mist parts; frame ends on the open road toward the light." },
    ],
  },

  // Scroll lengths (in viewport heights) per pinned scene. Mobile uses `* mobileScale`.
  scenes: {
    intro: 100,
    dive: 420,
    sequence: 480,
    photo: 220,
    arc: 300,
    layers: 460,
    mobileScale: 0.72,
  },

  // Text beats. `at` = scroll progress (0..1) within the scene where the line peaks.
  beats: {
    dive: [
      { at: 0.16, kicker: "Chapter 01 — The Beginning", line: "Somewhere near the top of the map," },
      { at: 0.5, kicker: "", line: "the land folds into mountains." },
      { at: 0.84, kicker: "", line: "That is where this begins." },
    ],
    sequence: [
      { at: 0.08, kicker: "", line: "I come from the mountains." },
      { at: 0.36, kicker: "", line: "Where the roads were winding,\nbut the ambition was clear." },
      { at: 0.66, kicker: "", line: "So I shouldered a bag,\nand started walking." },
      { at: 0.92, kicker: "", line: "Toward the valley.\nToward everything next." },
    ],
    photo: [
      { at: 0.3, kicker: "Archive", line: "That boy was me." },
      { at: 0.74, kicker: "", line: "One backpack. One phone.\nOne plan: engineering." },
    ],
    arc: [
      { at: 0.2, kicker: "Chapter 02 — Discovery", line: "The road led south, to Allahabad." },
      { at: 0.58, kicker: "IIIT Allahabad", line: "B.Tech, Information Technology." },
      { at: 0.88, kicker: "", line: "I came to write code." },
    ],
    layers: [
      { at: 0.1, kicker: "", line: "I started building websites." },
      { at: 0.34, kicker: "", line: "Then I wanted to know\nwhy some of them worked." },
      { at: 0.6, kicker: "", line: "Code became structure.\nStructure became interface." },
      { at: 0.86, kicker: "", line: "And under every interface —\na human being." },
    ],
  },

  // The four layers of the Chapter 02 interactive scene, bottom → top.
  layers: [
    { id: "code", label: "Code", caption: "Where it started: HTML, CSS, late nights." },
    { id: "structure", label: "Structure", caption: "Grids, hierarchy, the skeleton of a page." },
    { id: "interface", label: "Interface", caption: "What people actually see and touch." },
    { id: "human", label: "Human", caption: "Attention, intent, emotion — the real material." },
  ],

  // Chapter index (progress nav). `anchor` = element id to scroll to.
  chapters: [
    { n: "01", title: "The Beginning", anchor: "scene-dive", status: "prototype" },
    { n: "02", title: "Discovery", anchor: "scene-arc", status: "prototype" },
    { n: "03", title: "Dineout", anchor: "ch-03", status: "planned" },
    { n: "04", title: "Jio Platforms", anchor: "ch-04", status: "planned" },
    { n: "05", title: "Delhivery", anchor: "ch-05", status: "planned" },
    { n: "06", title: "What's Next", anchor: "ch-06", status: "planned" },
  ],

  // Upcoming chapters. Metrics are product/team outcomes and stay flagged
  // `verified: false` until confirmed — the UI labels them accordingly.
  upcoming: [
    {
      id: "ch-03", n: "03", title: "Dineout",
      line: "A founding design seat at a restaurant-tech startup.",
      work: ["Table reservations", "GIRF", "Predict & Win", "Product growth"],
      metric: { value: "~10K → ~10M", label: "users, as a product & team outcome", verified: false },
      logos: ["../images/brandLogo/dineout.svg"],
    },
    {
      id: "ch-04", n: "04", title: "Jio Platforms",
      line: "Designing at the scale of a country.",
      work: ["JioMart", "MyJio", "WhatsApp commerce", "Urban Ladder", "Netmeds"],
      metric: null,
      logos: ["../images/brandLogo/jiomart.svg", "../images/brandLogo/jio.svg", "../images/brandLogo/urban-ladder.svg", "../images/brandLogo/netmeds.svg"],
    },
    {
      id: "ch-05", n: "05", title: "Delhivery",
      line: "Into the machinery: complex B2B systems.",
      work: ["Logistics", "Warehouse management", "Fleet", "Fintech", "Enterprise experiences"],
      metric: null,
      logos: ["../images/brandLogo/delhivery.svg"],
    },
    {
      id: "ch-06", n: "06", title: "What's Next",
      line: "Looking for the next ambitious product challenge.",
      work: ["Senior · Lead · Staff · Principal Product Design"],
      metric: null,
      logos: [],
    },
  ],
};
