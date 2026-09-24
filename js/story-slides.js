/* ============================================================
   JioMart Discovery — "From Browsing to Believing"
   SLIDE DATA (content only — rendering lives in story.js)
   Central thesis: JioMart wasn't asking users to click too much.
   It was asking them to trust with too little evidence.
   Trust = Clarity + Proof + Control
   ============================================================ */
window.STORY = {
  imgBase: "./images/enhanceProduct/",
  slides: [
    /* 01 — COVER */
    {
      type: "cover",
      eyebrow: "JioMart · Product Discovery · DS 2.0",
      headline: ["From browsing", "to believing."],
      body:
        "How we redesigned discovery across Home, PLP and PDP to reduce cognitive load and help shoppers decide with confidence.",
      img: "Hero.png",
      meta: [
        { l: "Role", v: "Design Lead — Product Discovery" },
        { l: "Timeline", v: "Aug 2023 – Oct 2023" },
        { l: "Surfaces", v: "Home · Search · PLP · PDP" },
        { l: "Context", v: "JioMart DS 2.0" }
      ],
      cta: "Press → to begin"
    },

    /* 02 — SETTING THE STAGE */
    {
      type: "statement",
      eyebrow: "Stage 1 · The setup",
      headline: ["Millions came to shop.", "But browsing didn't always", "lead to belief."],
      body:
        "People came to JioMart ready to buy. But inconsistent navigation, unclear information and weak product cues made simple decisions feel like work.",
      note: "And every unanswered question weakened confidence."
    },

    /* 03 — MEET PRIYA */
    {
      type: "priya",
      eyebrow: "Our shopper",
      headline: ["Meet Priya."],
      body:
        "32, Navi Mumbai. It's 9 PM. She needs atta, shampoo, and maybe that air fryer everyone keeps recommending. She isn't here to explore an interface — she just wants to make the right choice.",
      modules: [
        { l: "Goal", v: "Find the right things quickly." },
        { l: "Behaviour", v: "Scans first. Reads when needed." },
        { l: "Expectation", v: "\u201CShow me enough to know I'm making the right choice.\u201D" }
      ],
      note: "Priya isn't impatient. She's busy.",
      side: "right"
    },

    /* 04 — THE FRICTION */
    {
      type: "friction",
      eyebrow: "The experience",
      headline: ["Every screen asked Priya", "to think too much."],
      img: "enhance-final-old-home-page.png",
      reveals: [
        "Icons changed meaning.",
        "Categories competed for attention.",
        "Products looked similar.",
        "Important information came too late.",
        "Ratings and reviews were easy to miss.",
        "Seller, return and delivery info required hunting."
      ],
      end: ["More cognitive load.", "Less confidence."],
      emotion: "confused"
    },

    /* 05 — THE REFRAME */
    {
      type: "reframe",
      eyebrow: "The reframe",
      pre: ["The problem wasn't", "discovery alone."],
      reveal: "It was trust.",
      questions: [
        { q: "\u201CCan I find it?\u201D", t: "Navigation problem" },
        { q: "\u201CIs this the right one?\u201D", t: "Decision problem" },
        { q: "\u201CCan I trust it?\u201D", t: "Confidence problem" }
      ],
      note: "We needed to solve all three."
    },

    /* 06 — TRUST LEAKS */
    {
      type: "hotspots",
      eyebrow: "Where confidence broke",
      headline: ["Trust was leaking", "at every step."],
      hotspots: [
        { n: "01", t: "Navigation", q: "Where should I go?", img: "enhance-final-old-home-page.png", focus: 0.14 },
        { n: "02", t: "Visual language", q: "What does this mean?", img: "enhance-final-old-home-page.png", focus: 0.24 },
        { n: "03", t: "Product information", q: "Which one is actually better?", img: "enhance-final-old-plp-page.png", focus: 0.5 },
        { n: "04", t: "Social proof", q: "Has anyone else bought this?", img: "enhance-final-old-pdp-1st-fold.png", focus: 0.6 },
        { n: "05", t: "Product credibility", q: "What exactly am I getting?", img: "enhance-final-old-pdp-3rd-fold.png", focus: 0.5 }
      ]
    },

    /* 07 — RESEARCH */
    {
      type: "research",
      eyebrow: "Stage 2 · Understanding the problem",
      headline: ["Before redesigning screens,", "we mapped where", "confidence broke."],
      cards: [
        { t: "Heuristic evaluation", d: "Where does the interface make people stop and think?" },
        { t: "Behaviour + heatmaps", d: "What are shoppers engaging with, skipping or abandoning?" },
        { t: "Competitive benchmarking", d: "How do mature marketplaces reduce uncertainty?" },
        { t: "User journey review", d: "What information does someone need at each decision?" }
      ]
    },

    /* 08 — RESEARCH FINDINGS */
    {
      type: "findings",
      eyebrow: "What we learned",
      headline: ["Five patterns", "kept repeating."],
      reveals: [
        "People recognised faster than they recalled.",
        "Too many choices slowed decisions.",
        "Inconsistent patterns created hesitation.",
        "Missing context reduced product confidence.",
        "Social proof mattered near the decision."
      ],
      end: ["Trust wasn't one feature.", "It was the sum of dozens", "of small signals."]
    },

    /* 09 — TRUST FRAMEWORK */
    {
      type: "equation",
      eyebrow: "The model",
      headline: ["So we reduced trust", "to three ingredients."],
      pillars: [
        { k: "Clarity", d: "I understand what I'm seeing." },
        { k: "Proof", d: "I have reasons to believe it." },
        { k: "Control", d: "I can compare, filter, save and change my mind." }
      ],
      note: "Every major design decision had to strengthen at least one."
    },

    /* 10 — PRINCIPLE 1 */
    {
      type: "principle-text",
      eyebrow: "Design principle 01",
      headline: ["Reduce thinking", "before adding features."],
      contrast: { bad: "More widgets \u2260 better discovery", good: "Better hierarchy \u2192 easier discovery" },
      body:
        "We simplified structure, reduced competing signals and made important actions easier to recognise."
    },

    /* 11 — PRINCIPLE 2 */
    {
      type: "principle-morph",
      eyebrow: "Design principle 02",
      headline: ["Recognition", "over recall."],
      before: "enhance-final-old-home-page.png",
      after: "enhance-final-new-home-page.png?v=2",
      focus: 0.22,
      points: ["Consistent iconography", "Predictable placement", "Clear labels", "Familiar visual patterns"],
      note: "If shoppers have to remember what an icon means, the interface is already asking too much."
    },

    /* 12 — PRINCIPLE 3 */
    {
      type: "principle-stack",
      eyebrow: "Design principle 03",
      headline: ["Show proof", "where doubt appears."],
      stack: ["Product", "Price", "Rating", "Reviews", "Delivery", "Returns"],
      note: "Don't make shoppers hunt for reassurance."
    },

    /* 13 — TRANSITION TO SOLUTION */
    {
      type: "journey",
      eyebrow: "Stage 3 · The redesign",
      headline: ["Same Priya.", "Same shopping list.", "Different experience."],
      body:
        "Instead of redesigning three isolated screens, we rebuilt one continuous confidence journey.",
      steps: [
        { s: "Home", d: "Orient" },
        { s: "Search", d: "Focus" },
        { s: "PLP", d: "Narrow" },
        { s: "PDP", d: "Believe" }
      ],
      note: "One journey. Different questions."
    },

    /* 14 — HOME */
    {
      type: "ui",
      eyebrow: "01 · Orient",
      headline: ["Home should answer", "one question first."],
      sub: "\u201CWhere do I begin?\u201D",
      before: "enhance-final-old-home-page.png",
      after: "enhance-final-new-home-page.png?v=2",
      focus: 0.2,
      annotations: [
        "Consistent categories",
        "Clear search",
        "Scan + voice entry points",
        "Simpler promotional hierarchy",
        "Better navigation grouping"
      ],
      note: "Less interpreting. More moving.",
      emotion: "curious"
    },

    /* 15 — ICON INTERACTION */
    {
      type: "icon-guess",
      eyebrow: "A quick test",
      headline: ["Can you tell what", "these icons do?"],
      reveal: "Neither could everyone else.",
      final: "Recognition beats memorisation."
    },

    /* 16 — PLP */
    {
      type: "ui",
      eyebrow: "02 · Narrow",
      headline: ["Finding products", "wasn't enough."],
      sub: "Priya needed help choosing between them.",
      before: "enhance-final-old-plp-page.png",
      after: "enhance-final-new-plp-page.png",
      focus: 0.46,
      annotations: [
        "Clearer filters",
        "Simplified product cards",
        "Visible ratings",
        "Clear price + discount hierarchy",
        "Best Seller / Trending signals",
        "Larger product imagery"
      ],
      note: "The listing stopped being a catalogue. It became a decision tool.",
      emotion: "curious"
    },

    /* 17 — SOCIAL PROOF */
    {
      type: "social-proof",
      eyebrow: "Proof near the decision",
      headline: ["Let other shoppers", "reduce the uncertainty."],
      chips: ["4.6 ★", "122 reviews", "Best Seller", "10% OFF"],
      body:
        "Ratings, reviews and useful popularity signals help shoppers understand where to look first.",
      flow: { a: "Social proof", b: "Lower uncertainty" },
      img: "enhance-final-new-plp-page.png",
      focus: 0.46,
      side: "right"
    },

    /* 18 — PDP TRANSITION */
    {
      type: "pdp-transition",
      eyebrow: "The moment of commitment",
      pre: ["Then came the page", "where trust mattered most."],
      reveal: "The PDP.",
      questions: [
        "\u201CDoes this look genuine?\u201D",
        "\u201CWhich variant?\u201D",
        "\u201CWhen will it arrive?\u201D",
        "\u201CCan I return it?\u201D",
        "\u201CDo people actually like it?\u201D",
        "\u201CWho is selling it?\u201D"
      ],
      note: "This is where browsing becomes commitment.",
      img: "enhance-final-old-pdp-1st-fold.png",
      focus: 0.3
    },

    /* 19 — PDP FIRST FOLD */
    {
      type: "ui",
      eyebrow: "03 · Believe",
      headline: ["Answer doubt before", "asking for commitment."],
      before: "enhance-final-old-pdp-1st-fold.png",
      after: "enhance-final-new-pdp-1st-fold.png",
      focus: 0.42,
      annotations: [
        "High-quality contextual imagery",
        "Brand + product hierarchy",
        "Ratings + reviews",
        "Variants upfront",
        "Price + discount clarity",
        "Delivery location"
      ],
      note: "Trust before Add to Cart.",
      emotion: "happy"
    },

    /* 20 — PDP DEEPER JOURNEY (scrollable) */
    {
      type: "pdp-scroll",
      eyebrow: "The deeper page",
      headline: ["Confidence", "has layers."],
      img: "enhance-final-new-pdp-1st-fold.png",
      layers: [
        { focus: 0.05, q: "What am I buying?", d: "Images + specifications" },
        { focus: 0.3, q: "Is it worth it?", d: "Price + offers" },
        { focus: 0.55, q: "Can I trust it?", d: "Reviews + seller + trust signals" },
        { focus: 0.78, q: "What if something goes wrong?", d: "Delivery + returns" },
        { focus: 1.0, q: "What else could work?", d: "Similar products + recently viewed" }
      ]
    },

    /* 21 — UGC */
    {
      type: "ui",
      eyebrow: "The reassurance layer",
      headline: ["JioMart could describe", "the product."],
      sub: "Shoppers needed other shoppers to validate it.",
      before: "enhance-final-old-pdp-5th-fold.png",
      after: "enhance-final-new-pdp-5th-fold.png",
      focus: 0.4,
      annotations: [
        "Ratings distribution",
        "Photo reviews",
        "Review filters",
        "Helpful / like interaction",
        "View all reviews"
      ],
      note: "Brand information creates understanding. UGC creates reassurance.",
      emotion: "happy"
    },

    /* 22 — COGNITIVE LOAD BEFORE/AFTER */
    {
      type: "load",
      eyebrow: "The transformation",
      headline: ["The interface stopped", "making Priya do the work."],
      before: ["Find", "Interpret", "Search", "Remember", "Compare", "Doubt"],
      after: ["Recognise", "Compare", "Trust", "Choose"],
      note: "We removed decisions the interface should have made easier."
    },

    /* 23 — IMPACT */
    {
      type: "impact",
      eyebrow: "The impact",
      headline: ["Small clarity.", "Compounding confidence."],
      experience: [
        "Simpler navigation",
        "Stronger product hierarchy",
        "Richer product information",
        "More visible social proof",
        "Clearer delivery / seller / return info",
        "Improved discovery continuity"
      ],
      metrics: [
        { n: 65, suffix: "%", sign: "+", l: "Monthly active users" },
        { n: 64, suffix: "%", sign: "+", l: "Repeat users" },
        { n: 38, suffix: "%", sign: "+", l: "Revenue" },
        { n: 36, suffix: "%", sign: "-", l: "Support calls" }
      ],
      disclaimer:
        "Broader JioMart performance indicators — not solely attributable to this redesign."
    },

    /* 24 — CLOSING */
    {
      type: "closing",
      pre: ["People don't trust a marketplace", "because it tells them to."],
      reveal: ["They trust it when every interaction", "gives them fewer reasons to doubt."],
      note: "That became the principle behind JioMart Discovery 2.0.",
      quote: "Good discovery isn't more content. It's the right evidence, at the right moment.",
      cta: [
        { label: "Explore full case study", href: "./jiomart-discovery.html", primary: true },
        { label: "Next project →", href: "./index.html" }
      ]
    }
  ]
};
