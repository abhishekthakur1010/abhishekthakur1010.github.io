/* ============================================================
   FROM THE MOUNTAINS TO MILLIONS — v0.3 story config
   Single source of truth: pacing, copy, projects, links.
   Metrics are copied verbatim from the portfolio's own project
   cards (index.html) — edit here, never in the scene code.
   ============================================================ */
window.STORY = {
  title: "From the Mountains to Millions",
  author: "Abhishek Thakur",
  role: "Lead Product Designer",
  email: "abhishekiit2k12@gmail.com",

  // Total storytelling scroll, in viewport heights, and how it splits per chapter.
  // Change the weights to re-pace the story; scenes retime themselves.
  scroll: { desktopVH: 1400, mobileVH: 1150 },

  places: {
    home: { lat: 31.1, lon: 77.2, label: "The Himalayas" },
    college: { lat: 25.43, lon: 81.77, label: "IIIT Allahabad" },
  },

  chapters: [
    {
      id: "beginning", n: "01", nav: "Beginning", kicker: "Chapter 01 — The Beginning", title: "From the Mountains", weight: 12,
      beats: [
        { at: 0.2, line: "Some journeys begin far from the world's spotlight." },
        { at: 0.5, line: "Mine began in the mountains." },
        { at: 0.86, line: "A winding road.\nAn endless curiosity." },
      ],
    },
    {
      id: "discovery", n: "02", nav: "Discovery", kicker: "Chapter 02 — The Discovery", title: "From Code to Curiosity", weight: 12,
      beats: [
        { at: 0.2, line: "That curiosity took me to IIIT Allahabad." },
        { at: 0.43, line: "I studied Information Technology.\nBut I became fascinated by something beyond code." },
        { at: 0.68, line: "Why do people interact with technology the way they do?" },
        { at: 0.88, line: "That's where my journey into design began." },
      ],
      fact: "B.Tech, Information Technology · IIIT Allahabad · 2012–2016",
    },
    {
      id: "dineout", n: "03", nav: "Dineout", kicker: "Chapter 03 — Dineout", title: "Designing for Millions", weight: 20,
      beats: [
        { at: 0.19, line: "My first big design challenge was changing how people discovered and booked restaurants." },
        { at: 0.32, line: "At Dineout, I helped shape experiences as the product scaled." },
        { at: 0.46, line: "From thousands to millions of users." },
      ],
      stat: { value: "~10K → ~10M", label: "users — Dineout's growth as a product and company, as reported; to be verified" },
    },
    {
      id: "jio", n: "04", nav: "Jio", kicker: "Chapter 04 — Jio Platforms", title: "Designing at Scale", weight: 21,
      beats: [
        { at: 0.17, line: "Then the scale changed." },
        { at: 0.36, line: "At Jio Platforms, I worked across digital ecosystems serving enormous and diverse audiences." },
        { at: 0.56, line: "From shopping to everyday services, I learned to design for complexity, accessibility, and scale." },
      ],
    },
    {
      id: "delhivery", n: "05", nav: "Delhivery", kicker: "Chapter 05 — Delhivery", title: "Designing Complex Systems", weight: 23,
      beats: [
        { at: 0.17, line: "At Delhivery, I moved from consumer experiences into the systems that power businesses." },
        { at: 0.36, line: "Designing for operators, warehouses, fleets, and complex logistics networks." },
        { at: 0.84, line: "Beyond individual screens, I began thinking in systems, teams, and long-term product impact." },
      ],
    },
    {
      id: "next", n: "06", nav: "Contact", kicker: "Chapter 06 — What's Next", title: "The Journey Continues", weight: 12,
      beats: [
        { at: 0.17, line: "From the mountains to products used by millions." },
        { at: 0.35, line: "But curiosity doesn't have a finish line." },
        { at: 0.53, line: "I'm looking for the next meaningful problem worth solving." },
      ],
    },
  ],

  // Project evidence, in the order each chapter presents it.
  // `link: null` = case study not published yet (the card says so).
  projects: {
    dineout: [
      { title: "From 10K to 10M: Scaling Delight", sub: "Web, app & B2B experiences across Dineout's ecosystem", img: "../images/feature-project-05.webp",
        metrics: ["RDP/PDP CTA clicks 60.2%", "Booking funnel 41.7%", "Stories adoption 38.6%"], link: null },
      { title: "Booking Without Friction", sub: "Table booking flow for simpler, faster reservations", img: "../images/feature-project-17.webp",
        metrics: ["Booking time → 1.5 min", "Drop-off 50%", "Post-booking satisfaction 30%"], link: null },
      { title: "Reimagining Browsing for Foodies", sub: "Restaurant discovery: listing & detail pages · GIRF", img: "../images/feature-project-16.webp",
        metrics: ["Time on PLP & PDP 35%", "Bounce rate 23%", "Booking conversions 28%"], link: null },
      { title: "Game On: Predict & Win", sub: "An IPL campaign that turned predictions into bookings", img: "../images/feature-project-14.webp",
        metrics: ["Participation 3.2×", "Deal redemption 48%", "Play → deal → book 37%"], link: null },
      { title: "Dining, Refined", sub: "Premium experience through Gourmet Passport", img: "../images/feature-project-15.webp",
        metrics: ["GP redemption 54%", "GP offer usage 58%", "Premium NPS +21 pts"], link: null },
    ],
    jio: [
      { brand: "JioMart", title: "Making Product Discovery Seamless", sub: "Homepage, PLP and PDP", img: "../images/feature-project-02.webp",
        screens: ["../images/enhanceProduct/enhance-final-new-home-page.png", "../images/enhanceProduct/enhance-final-new-plp-page.png", "../images/enhanceProduct/enhance-final-new-pdp-1st-fold.png"],
        metrics: ["Installs 51%", "MAU 65%", "Revenue 38%"], link: "../jiomart-discovery.html" },
      { brand: "JioMart", title: "Streamlining Checkout", sub: "Cart → Offer → Review → Payment", img: "../images/feature-project-01.webp",
        screens: ["../images/stream-study/stream-case-study-cart-page-01.png", "../images/stream-study/stream-case-study-payment-page.png", "../images/stream-study/stream-case-study-order-success-page.png"],
        metrics: ["Conversion 20.54%", "Returning users 20.54%", "Page load −29.6%"], link: "../jio-checkout.html" },
      { brand: "MyJio", title: "One Payment, Many Journeys", sub: "MyJio payment experience", img: "../images/feature-project-12.webp",
        metrics: ["Payment time 1.8 min → 42 s", "UPI adoption 32%", "Repeat transactions 1.4×"], link: null },
      { brand: "Netmeds", title: "Healing by Design", sub: "Discovery to delivery, from field research", img: "../images/feature-project-11.webp",
        metrics: ["Discovery → order 29%", "Post-order engagement 47%", "CS ticket reduction 38%"], link: null },
    ],
    jioAlso: ["WhatsApp commerce", "Urban Ladder", "Post-purchase & support", "Ratings & reviews"],
    jioRecognition: { title: "Spotlight Award · Jio's Best Team", img: "../images/enhanceProduct/enhance-award.png" },
    delhivery: [
      { node: "Warehouse", title: "Powering the Engine of Fulfillment", sub: "WMS & apps for inbound, outbound and inventory", img: "../images/feature-project-06.webp",
        metrics: ["Real-time process visibility", "Pick task accuracy 35.5%", "Order tracking 40%"], link: null },
      { node: "Inventory", title: "Building for Speed", sub: "Rapid OMS & unified pick-pack-manifest app", img: "../images/feature-project-07.webp",
        metrics: ["Task completion time 20–30%", "Picker-packer productivity 50%", "In-app error rate 2%"], link: null },
      { node: "Transportation", title: "Making Mid-Mile Smarter", sub: "Mega-hub productivity systems", img: "../images/feature-project-09.webp",
        metrics: ["Hub visibility 80%", "Inbound processing 40%", "Road Train launch"], link: null },
      { node: "Fleet", title: "First Impressions Matter", sub: "First-mile pickup tools across India", img: "../images/feature-project-08.webp",
        metrics: ["Pickup success 8%", "TL planning time 12%", "Error rate 6.2%"], link: null },
      { node: "Fintech", title: "DelFin — 0→1 Financial Services", sub: "FASTag, GPS & beyond, built from scratch", img: "../images/delfin/delfin-cover.png",
        metrics: ["Concept to launch ~8 weeks", "1K+ Play Store downloads", "4.9/5 early rating"], link: "../delfin.html" },
      { node: "Last mile", title: "Delhivery's Last Mile Express", sub: "Dispatch to delivery for an ₹8,000 Cr+ express network", img: "../images/feature-project-04.webp",
        metrics: ["Digital payments 32%", "Pin accuracy 98%"], link: "../delhivery-case-study-v2.html" },
    ],
    delhiveryAlso: ["Design systems", "AI-assisted product experiences", "Leading product design across logistics verticals"],
  },

  // Chapter 02's interactive page, bottom → top
  layersMeta: [
    { id: "code", label: "Code", caption: "Where it started: HTML, CSS, late nights." },
    { id: "structure", label: "Structure", caption: "Grids, hierarchy, the skeleton of a page." },
    { id: "interface", label: "Interface", caption: "What people actually see and touch." },
    { id: "human", label: "Human", caption: "Attention, intent, emotion — the real material." },
  ],

  awards: ["Mega Mind", "Star Performer", "Jio's Best Team", "Spotlight Star", "Design Nerd"],

  ctas: [
    { label: "Explore my work", href: "../profile.html#featured" },
    { label: "View case studies", href: "#work-menu" },
    { label: "Get in touch", href: "mailto:abhishekiit2k12@gmail.com" },
    { label: "Download resume", href: "../resume.pdf" },
  ],

  // Always-available case studies (the Work menu).
  caseStudies: [
    { label: "JioMart — Product discovery", href: "../jiomart-discovery.html" },
    { label: "JioMart — Checkout", href: "../jio-checkout.html" },
    { label: "Delhivery — DelFin 0→1", href: "../delfin.html" },
    { label: "Delhivery — Last Mile Express", href: "../delhivery-case-study-v2.html" },
    { label: "All work on the portfolio", href: "../profile.html#featured" },
  ],
};
