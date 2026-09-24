/* ============================================================
   JioMart Discovery — "Come shopping with Priya"
   Interactive product walkthrough (Growth.Design style)
   SCENE + BEAT model.  Content only — rendering in story.js.

   Journey rail:  HOME → PLP → PDP → CART
   Micro rail:    ACTION → FRICTION → WHY → DESIGN MOVE → SIGNAL

   Walkthrough beat fields:
     micro   : 0-4 index into [Action,Friction,Why,Design move,Signal]
     view    : "before" | "after"  (which screen the device shows)
     focus   : 0-1 vertical focus point on the screenshot
     react   : Priya's short line (speech bubble)
     hi      : [{x,y,w,h}] highlight boxes on the device (percent)
     note    : short insight/why line shown beside the UI
     research: small "observed through" tag (optional)
     signal  : [{t,dir}] qualitative experience signals (dir up|down)
   ============================================================ */
window.STORY = {
  imgBase: "./images/enhanceProduct/",
  microLabels: ["Action", "Friction", "Why", "Design move", "Signal"],
  journey: [
    { k: "home", s: "Home", d: "Orient" },
    { k: "plp", s: "PLP", d: "Compare" },
    { k: "pdp", s: "PDP", d: "Believe" },
    { k: "cart", s: "Cart", d: "Commit" }
  ],
  scenes: [
    /* 01 — OPENING */
    {
      type: "cover",
      eyebrow: "JioMart · Product Discovery · DS 2.0",
      headline: ["From browsing", "to believing."],
      body:
        "I led JioMart's discovery redesign across Home, PLP and PDP as part of DS 2.0. It looked like a discovery problem. It became a confidence problem.",
      img: "Hero.png",
      cta: "Press → to start shopping"
    },

    /* 02 — PRODUCT CONTEXT */
    {
      type: "journey-map",
      eyebrow: "The battlefield",
      headline: ["Where users orient,", "compare and decide."],
      flow: ["Home", "Search", "PLP", "PDP", "Cart"],
      active: ["Home", "PLP", "PDP"],
      note: "Three moments decided whether browsing became buying."
    },

    /* 03 — MEET PRIYA */
    {
      type: "priya",
      eyebrow: "Come shopping with",
      name: "Priya · 32",
      body: "Shopping after work. Scans fast, reads only when it matters.",
      thought: "\u201CNeed atta, shampoo… and maybe an air fryer.\u201D",
      cta: "Let's open the app."
    },

    /* 04 — HOME walkthrough */
    {
      type: "walkthrough",
      stage: "home",
      eyebrow: "01 · Home — Orient",
      before: "enhance-final-old-home-page.png",
      after: "enhance-final-new-home-page.png?v=2",
      beats: [
        { micro: 0, view: "before", focus: 0.12, react: "Okay… where do I start?",
          note: "Priya lands on Home and scans for a starting point." },
        { micro: 1, view: "before", focus: 0.2,
          hi: [{ x: 6, y: 20, w: 88, h: 16 }],
          note: "Categories, promos, search and scan all competed for first attention.",
          research: "Heuristic evaluation" },
        { micro: 2, view: "before", focus: 0.22,
          hi: [{ x: 6, y: 22, w: 88, h: 12 }],
          note: "Inconsistent icons meant meaning had to be interpreted, not recognised.",
          research: "Behavioural data",
          signal: [{ t: "Cognitive effort", dir: "up" }] },
        { micro: 3, view: "after", focus: 0.2,
          hi: [{ x: 6, y: 18, w: 88, h: 18 }],
          note: "A consistent category system, clearer hierarchy and recognisable search / scan entry points." },
        { micro: 4, view: "after", focus: 0.2, react: "Okay. I know where to go.",
          signal: [{ t: "Orientation", dir: "up" }, { t: "Cognitive effort", dir: "down" }] }
      ]
    },

    /* 05 — PLP walkthrough */
    {
      type: "walkthrough",
      stage: "plp",
      eyebrow: "02 · PLP — Compare",
      before: "enhance-final-old-plp-page.png",
      after: "enhance-final-new-plp-page.png",
      beats: [
        { micro: 0, view: "before", focus: 0.35, react: "Which one is actually better?",
          note: "Priya searches for an air fryer and starts comparing." },
        { micro: 1, view: "before", focus: 0.45,
          hi: [{ x: 6, y: 34, w: 88, h: 30 }],
          note: "Every card looked equally important — nothing guided the eye." },
        { micro: 2, view: "before", focus: 0.5,
          hi: [{ x: 8, y: 40, w: 40, h: 20 }],
          note: "Small imagery, hidden ratings and flat price hierarchy made comparison mental work.",
          research: "Competitive benchmarking",
          signal: [{ t: "Decision effort", dir: "up" }] },
        { micro: 3, view: "after", focus: 0.46,
          hi: [{ x: 6, y: 32, w: 88, h: 34 }],
          note: "Larger imagery, visible ratings, clear price hierarchy, filters and a wishlist to defer choices." },
        { micro: 4, view: "after", focus: 0.46, react: "This one looks promising.",
          signal: [{ t: "Scannability", dir: "up" }, { t: "Comparison effort", dir: "down" }, { t: "Decision confidence", dir: "up" }] }
      ]
    },

    /* 06 — PDP TRUST MOMENT (dramatic) */
    {
      type: "pdp-trust",
      eyebrow: "03 · PDP — Believe",
      img: "enhance-final-old-pdp-1st-fold.png",
      focus: 0.3,
      questions: [
        "Is this actually good?",
        "Which variant?",
        "When will it arrive?",
        "Can I return it?",
        "Who is selling it?",
        "What do others think?"
      ],
      reveal: "This was the trust gap."
    },

    /* 07 — PDP DIAGNOSIS (scroll old PDP, pin issues) */
    {
      type: "walkthrough",
      stage: "pdp",
      eyebrow: "PDP — Diagnosis",
      before: "enhance-final-old-pdp-1st-fold.png",
      after: "enhance-final-old-pdp-3rd-fold.png",
      staticView: true,
      beats: [
        { micro: 0, view: "before", focus: 0.1, react: "Let me evaluate before I buy.",
          note: "Priya needs reassurance — fast." },
        { micro: 1, view: "before", focus: 0.2,
          hi: [{ x: 8, y: 8, w: 84, h: 24 }],
          note: "Images: not enough product context.", research: "Heuristic evaluation" },
        { micro: 1, view: "before", focus: 0.45,
          hi: [{ x: 8, y: 40, w: 84, h: 14 }],
          note: "Variants harder to compare · offers had weak hierarchy." },
        { micro: 2, view: "before", focus: 0.7,
          hi: [{ x: 8, y: 62, w: 84, h: 16 }],
          note: "Seller trust hidden · specs too text-heavy · returns surfaced too late.",
          signal: [{ t: "Unanswered questions", dir: "up" }] },
        { micro: 2, view: "before", focus: 0.9,
          hi: [{ x: 8, y: 82, w: 84, h: 14 }],
          note: "Reviews were weak social validation — right when doubt peaks." }
      ]
    },

    /* 08 — TRUST FRAMEWORK */
    {
      type: "trust-framework",
      eyebrow: "The model",
      headline: ["So we reduced trust", "to three ingredients."],
      pillars: [
        { k: "Clarity", d: "Do I understand the product?" },
        { k: "Proof", d: "Why should I believe it?" },
        { k: "Control", d: "Can I inspect, compare or change my mind?" }
      ]
    },

    /* 09 — NEW PDP VERTICAL JOURNEY (hero) */
    {
      type: "pdp-scroll",
      eyebrow: "PDP rebuilt — the confidence journey",
      img: "enhance-final-new-pdp-1st-fold.png",
      layers: [
        { focus: 0.05, tag: "Clarity", q: "First fold", d: "Imagery · brand/product hierarchy · variants · pricing · delivery", signal: { t: "Product understanding", dir: "up" } },
        { focus: 0.32, tag: "Proof", q: "Offers & seller", d: "Offers · seller information · trust badges · key features", signal: { t: "Credibility", dir: "up" } },
        { focus: 0.58, tag: "Proof from people", q: "Reviews & UGC", d: "Ratings distribution · photo reviews · filters · helpful actions", signal: { t: "Social reassurance", dir: "up" } },
        { focus: 0.82, tag: "Control", q: "Policies & discovery", d: "Compare · returns · similar products · recently viewed", signal: { t: "Decision control", dir: "up" } }
      ]
    },

    /* 10 — SPOT THE ISSUE (interaction) */
    {
      type: "spot-issue",
      eyebrow: "Before I tell you what we found…",
      headline: ["What would you look for", "before buying this?"],
      img: "enhance-final-old-pdp-1st-fold.png",
      focus: 0.35,
      reveals: ["Ratings", "Delivery", "Seller", "Returns", "Reviews"],
      end: "These were exactly the signals that weren't prominent enough."
    },

    /* 11 — UGC (new reviews fold) */
    {
      type: "walkthrough",
      stage: "pdp",
      eyebrow: "PDP — Reassurance",
      before: "enhance-final-old-pdp-5th-fold.png",
      after: "enhance-final-new-pdp-5th-fold.png",
      beats: [
        { micro: 1, view: "before", focus: 0.4,
          hi: [{ x: 8, y: 30, w: 84, h: 40 }],
          note: "Brand could describe the product — but shoppers needed other shoppers to validate it." },
        { micro: 3, view: "after", focus: 0.4,
          hi: [{ x: 8, y: 28, w: 84, h: 44 }],
          note: "Ratings distribution, photo reviews, filters and helpful actions — proof from people." },
        { micro: 4, view: "after", focus: 0.4, react: "Others liked it too. Good.",
          signal: [{ t: "Reassurance", dir: "up" }, { t: "Credibility", dir: "up" }] }
      ]
    },

    /* 12 — BEFORE/AFTER MENTAL MODEL */
    {
      type: "mental-model",
      eyebrow: "System thinking",
      headline: ["The interface stopped", "making Priya do the work."],
      before: ["Find", "Interpret", "Search", "Remember", "Compare", "Doubt"],
      after: ["Recognise", "Compare", "Trust", "Choose"],
      note: "We made the decision easier — not just the interface cleaner."
    },

    /* 13 — IMPACT + REFLECTION */
    {
      type: "impact",
      eyebrow: "Impact & reflection",
      headline: ["Small clarity.", "Compounding confidence."],
      experience: [
        { t: "Navigation clarity", dir: "up" },
        { t: "Product scannability", dir: "up" },
        { t: "Social proof visibility", dir: "up" },
        { t: "Product confidence", dir: "up" },
        { t: "Seller / return clarity", dir: "up" }
      ],
      metrics: [
        { n: 65, suffix: "%", sign: "+", l: "Monthly active users" },
        { n: 64, suffix: "%", sign: "+", l: "Repeat users" },
        { n: 38, suffix: "%", sign: "+", l: "Revenue" },
        { n: 36, suffix: "%", sign: "-", l: "Support calls" }
      ],
      metricsLabel: "Broader JioMart business context",
      disclaimer: "Platform-level indicators — not solely attributable to this redesign."
    },

    /* 14 — CLOSING */
    {
      type: "closing",
      pre: ["People don't trust a marketplace", "because it tells them to."],
      reveal: ["They trust it when every interaction", "gives them fewer reasons to doubt."],
      note: "That became the principle behind JioMart Discovery 2.0.",
      cta: [
        { label: "Explore full case study", href: "./jiomart-discovery.html", primary: true },
        { label: "Next project →", href: "./index.html" }
      ]
    }
  ]
};
