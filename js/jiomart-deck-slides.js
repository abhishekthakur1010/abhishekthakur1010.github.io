/* ============================================================
   JioMart Discovery — 15-slide interview deck
   5 verticals · beat-based · BEFORE → V1 → V2 evolution
   Content only. Rendering in jiomart-deck.js.
   Headings kept short + simple; `sub` explains in one plain line.
   Left-aligned throughout. No fabricated metrics.
   ============================================================ */
window.DECK = {
  imgBase: "./images/enhanceProduct/",
  sections: [
    { id: "intro", n: "01", label: "Introduction" },
    { id: "discovery", n: "02", label: "Discovery" },
    { id: "evolution", n: "03", label: "Design evolution" },
    { id: "impact", n: "04", label: "Impact" },
    { id: "recognition", n: "05", label: "Recognition" }
  ],
  slides: [
    /* ============ VERTICAL 01 — INTRODUCTION ============ */

    /* 01 — OPENING (matches jiomart-discovery.html hero) */
    {
      section: "intro", type: "opening",
      eyebrow: "JioMart · Product Discovery · DS 2.0",
      headline: ["Making ", "discovery", " feel personal across Home, PLP & PDP"],
      highlight: "discovery",
      body: "Refining content structure, navigation, and widgets across JioMart's homepage, listing, and product pages — turning aimless browsing into confident decisions for millions of shoppers.",
      hero: "Hero.png",
      backShots: ["enhance-v1-home.png", "enhance-v1-plp.png"],
      badge: { n: "+65%", l: "Monthly active users" },
      meta: [
        { l: "My role", v: "Design Lead — Discovery · Jio central design team" },
        { l: "Timeline", v: "Aug 2023 – Oct 2023 · During DS 2.0 rollout" },
        { l: "Surfaces", v: "Homepage · PLP · PDP · Search · Scan · Voice" },
        { l: "Headline impact", v: "MAU +65% · Revenue +38% · Repeat users +64%" }
      ],
      cta: "Press → to begin"
    },

    /* 02 — WHAT IS JIOMART */
    {
      section: "intro", type: "categories",
      eyebrow: "The product",
      headline: ["One app.", "Many kinds of shopping."],
      sub: "People buy groceries and TVs in the same app. One design had to work for both.",
      cats: ["Grocery", "Mobiles", "Electronics", "Fashion", "Beauty", "Home & Living", "Furniture", "Medicine"],
      snapshot: [
        { store: "App Store", img: "enhance-store-appstore.png", rating: "4.6", stat: "No. 16 · Shopping", sub: "213K ratings" },
        { store: "Play Store", img: "enhance-store-playstore-v2.png", rating: "4.0", stat: "10Cr+ downloads", sub: "25.3L reviews" }
      ],
      reasons: ["Delivery", "Assortment", "Value", "Quality", "Payment", "Support"]
    },

    /* 03 — THE PROBLEM */
    {
      section: "intro", type: "problem-flow",
      eyebrow: "The problem",
      headline: ["Finding was easy.", "Deciding was hard."],
      sub: "Shoppers could find products. They struggled to feel sure about buying them.",
      flow: ["Home", "Search", "PLP", "PDP"],
      problems: [
        "Navigation felt inconsistent",
        "Products were hard to scan",
        "Info lacked context",
        "Ratings & reviews were hidden",
        "Delivery & trust cues were missing"
      ],
      screens: [
        { label: "Home", img: "enhance-problem-home.png" },
        { label: "PLP", img: "enhance-problem-plp.png" },
        { label: "PDP", img: "enhance-problem-pdp.png", tall: true }
      ],
      chain: ["Hard to discover", "Too much thinking", "Doubt", "Low trust"],
      end: "So the real job wasn't finding products. It was helping people believe in their choice."
    },

    /* ============ VERTICAL 02 — DISCOVERY ============ */

    /* 04 — HOW WE INVESTIGATED (toolkit) */
    {
      section: "discovery", type: "toolkit",
      eyebrow: "How we investigated",
      headline: ["First, evidence."],
      sub: "Before touching a screen, I gathered proof of what was really going wrong.",
      tiles: [
        { t: "Flow pipeline audit", img: "enhance-flow-pipeline.png", crop: 0.15 },
        { t: "Research strategy", img: "enhance-research-strategy.png", crop: 0.2 },
        { t: "Heuristic evaluation", img: "enhance-heuristic-table.png", crop: 0.2 },
        { t: "Benchmarking", img: "enhance-benchmarking.png", crop: 0.15 },
        { t: "User interviews", img: "enhance-user-interview.png", crop: 0.3 },
        { t: "Usability testing", img: "enhance-usability-test-plp.png", crop: 0.4 },
        { t: "Team brainstorming", img: "enhance-brainstorming.png", crop: 0.3 },
        { t: "Design review · Europe", img: "enhance-europe-review.png", crop: 0.3 },
        { t: "Impact / effort", img: "enhance-impact-effort-matrix.png", crop: 0.35 }
      ],
      statement: "Different methods. The same problems kept showing up."
    },

    /* 05 — WHO WE DESIGNED FOR (personas) */
    {
      section: "discovery", type: "personas",
      eyebrow: "Who we designed for",
      headline: ["Different shoppers.", "Same wish."],
      sub: "I spoke with real shoppers. Their missions differed, but their needs matched.",
      personas: [
        { name: "Priya", type: "Busy repeat shopper", need: "Find familiar items fast", friction: "Too much to figure out" },
        { name: "Value seeker", type: "Deal-driven", need: "Compare price & ratings", friction: "Signals scattered" },
        { name: "Considered buyer", type: "Researches first", need: "Reassurance before buying", friction: "Not enough proof" }
      ],
      evidence: {
        method: "User interviews",
        img: "enhance-user-interview.png", crop: 0.3,
        observed: "I sat with real shoppers and watched how they browse, compare and decide.",
        takeaway: "Across every mission, people wanted the same three things.",
        implication: "Design around clarity, proof and control — not individual features."
      },
      end: "All of them wanted clarity, proof and control."
    },

    /* 06 — PRIORITISATION */
    {
      section: "discovery", type: "prioritise",
      eyebrow: "What to fix first",
      headline: ["Too much to fix at once."],
      sub: "There were more problems than time. So I ranked them by impact and effort.",
      reveal: "So I prioritised.",
      img: "enhance-impact-effort-matrix.png", crop: 0.35,
      tiers: [
        { k: "High impact · low effort", d: "Quick wins" },
        { k: "High impact · high effort", d: "Big bets" },
        { k: "Low impact", d: "Later" }
      ],
      roadmap: [
        { s: "Home", d: "Orient" },
        { s: "PLP", d: "Compare" }, { s: "PDP", d: "Believe" }
      ],
      end: "This became the redesign roadmap."
    },

    /* ============ VERTICAL 03 — DESIGN EVOLUTION ============ */

    /* 07b — STAKEHOLDER REVIEW → SIGN-OFF */
    {
      section: "evolution", type: "review",
      eyebrow: "Review & sign-off",
      headline: ["Aligned before we built."],
      sub: "Before development, I walked every design through a review with senior stakeholders and the design-system team — resolving open issues live. Once they signed off, it was ready to build.",
      img: "enhance-europe-presentation.png",
      points: [
        { k: "Walkthrough", d: "Presented the new flows and DS decisions screen by screen." },
        { k: "Open issues", d: "Mapped DS gaps live — image slots, badges, offers, star widgets, reusable components." },
        { k: "Sign-off", d: "Once seniors approved, designs moved straight into development." }
      ],
      caption: "Design review · \u201CFew Issues with New DS\u201D walkthrough with the team",
      end: "Approval wasn't a formality. It was how design and engineering stayed in sync."
    },

    /* 08 — HOMEPAGE */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Home · 01",
      headline: ["Where do I start?"],
      sub: "The homepage's one job: help people know where to begin.",
      before: { img: "enhance-problem-home.png", focus: 0.05, notes: ["Messy categories", "Noisy layout"] },
      v1: { img: "enhance-v1-home.png", focus: 0.05, notes: ["Clear categories", "Simple hierarchy"] },
      v2: { img: "enhance-v2-home.png", focus: 0.05, video: "enhance-v2-home.mp4", poster: "enhance-v2-home.png", notes: ["Live version", "Cleaner & calmer"] },
      evidence: {
        method: "Heuristic evaluation · UX audit",
        img: "enhance-heuristic-table.png", crop: 0.15,
        observed: "I scored 23 problem areas against Nielsen's heuristics, rating severity (S0–S3) and ease of fixing (E0–E3).",
        takeaway: "The same heuristics broke everywhere — consistency, recognition, error prevention.",
        implication: "Make common actions predictable, and fix by severity vs. effort."
      },
      signal: [{ t: "Easier to start", dir: "up" }, { t: "Mental effort", dir: "down" }]
    },

    /* 09 — PLP */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Listing · 02",
      headline: ["Which one do I pick?"],
      sub: "Finding products wasn't enough. People needed help choosing between them.",
      before: { img: "enhance-problem-plp.png", focus: 0.05, notes: ["Cards look equal", "Ratings hidden"] },
      v1: { img: "enhance-v1-plp.png", focus: 0.05, notes: ["Bigger images", "Clear price & rating"] },
      v2: { img: "enhance-v2-plp-grid.png", focus: 0.25, video: "enhance-v2-plp.mp4", poster: "enhance-v2-plp-grid.png", altImg: "enhance-v2-plp-list.png", notes: ["Live grid & list", "Key cues first"] },
      evidence: {
        method: "Design review · Europe",
        img: "enhance-europe-presentation.png", crop: 0.25,
        observed: "I reviewed the PLP designs with a Europe-based design team, mapping issues in the new design system — image slots, badges, offers and reusable components.",
        takeaway: "The card had to show the deciding cues first — and the system had to support that.",
        implication: "Decide what deserves attention first, then fix the system beneath it."
      },
      signal: [{ t: "Easier to scan", dir: "up" }, { t: "Effort to compare", dir: "down" }]
    },

    /* 10 — PDP FIRST DECISION */
    {
      section: "evolution", type: "pdp-questions",
      eyebrow: "Product page · 03",
      headline: ["Can I trust this?"],
      sub: "The product page is where browsing turns into a real decision.",
      img: "enhance-problem-pdp.png", focus: 0.05,
      questions: [
        "Right variant?",
        "Good price?",
        "When does it arrive?",
        "Can I trust it?",
        "What do others say?"
      ],
      before: { img: "enhance-problem-pdp.png", focus: 0.05 },
      v1: { img: "enhance-v1-pdp.png", focus: 0.05 },
      v2: { video: "enhance-v2-pdp.mp4", poster: "enhance-v2-pdp-main.png" },
      firstFold: ["Images", "Brand", "Ratings", "Price", "Variants", "Delivery", "Wishlist", "Clear CTA"],
      signal: [{ t: "Understanding", dir: "up" }, { t: "Confidence", dir: "up" }]
    },

    /* ============ VERTICAL 04 — IMPACT ============ */

    /* 13 — IMPACT */
    {
      section: "impact", type: "impact",
      eyebrow: "Impact",
      headline: ["What got better?"],
      sub: "When the experience improved, the way people shopped improved too.",
      experience: [
        "Clearer navigation", "Easier to scan", "Simpler comparison",
        "Visible trust info", "Reviews up front", "More confidence"
      ],
      metricsLabel: "Performance · FY 22–23",
      metrics: [
        { n: "+65%", l: "Monthly active users" },
        { n: "+64%", l: "Repeat users" },
        { n: "+38%", l: "Revenue" },
        { n: "+51%", l: "App downloads" },
        { n: "+31%", l: "Avg. daily orders" },
        { n: "−36%", l: "Customer-support calls" }
      ],
      evidence: {
        method: "Performance dashboard · FY 22–23",
        img: "enhance-improvement-metrics.png", crop: 0.15,
        observed: "App downloads +51%, MAU +65%, repeat users +64%, avg. order value +4.7%, daily orders +31%, revenue +38%, and a 36% reduction in CS calls.",
        takeaway: "Engagement +26%, page views per user +22%, conversion +20.54% — while redirection, page-load and server-response times all dropped.",
        implication: "A clearer, more trustworthy experience moved the numbers that matter."
      },
      disclaimer: "Platform-level indicators (Sep 22 – Mar 23) — reflecting broader JioMart improvements alongside this redesign."
    },

    /* 14 — CUSTOMER VOICE */
    {
      section: "impact", type: "voice",
      eyebrow: "Customer voice",
      headline: ["Shoppers said it best."],
      sub: "The strongest proof came straight from the people using the app.",
      quotes: [
        { q: "After the latest update the app is totally changed — much faster, well designed and easy to use. I'll give it 5/5.", src: "Play Store · Redmi Note 8 · ★★★★★" },
        { q: "Really good app. Best service experience and user experience.", src: "Dhruv Chhabra · realme 8 5G · ★★★★★" },
        { q: "New update is far better than before — it's smooth, better and stable.", src: "Play Store · Galaxy F41 · ★★★★★" },
        { q: "Improved, and the new UI looks better than earlier.", src: "Play Store · Galaxy S10 Lite · ★★★★" },
        { q: "Excellent shopping experience online.", src: "Ritesh Ka. Patel · Redmi 5A · ★★★★★" },
        { q: "Very good app experience.", src: "Sachin Katole · Galaxy A20s · ★★★★★" }
      ],
      evidence: {
        method: "Play Store reviews · Feb 2023",
        img: "enhance-trust-reviews.png", crop: 0.2,
        observed: "Multiple verified shoppers praised the redesign — faster, cleaner, easier to use — often citing the update directly.",
        takeaway: "Real users noticed the change and rated it 4–5 stars.",
        implication: "The experience improvements landed with the people who matter most."
      },
      end: "Numbers show what changed. People show how it felt."
    },

    /* ============ VERTICAL 05 — RECOGNITION ============ */

    /* 15 — AWARD + REFLECTION */
    {
      section: "recognition", type: "recognition",
      eyebrow: "Recognition",
      headline: ["The work got noticed."],
      sub: "A discovery redesign that grew into a lesson about trust.",
      award: { img: "enhance-award.png", caption: "Jio Spotlight Award · Certificate of Recognition — presented to Abhishek Thakur by Anish Shah, President (Q4 2022–23)." },
      reflection: [
        "It began as a discovery redesign.",
        "It became something bigger:",
        "People trust an app when every step gives them fewer reasons to doubt."
      ],
      cta: [
        { label: "Explore full case study", href: "./jiomart-discovery.html", primary: true },
        { label: "Next project →", href: "./index.html" }
      ]
    }
  ]
};
