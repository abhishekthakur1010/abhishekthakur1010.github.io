/* ============================================================
   JioMart Discovery — interview deck (12 slides, plain language)
   Story: Context → Problem → Research → Decisions → Results → Learnings
   Content only. Rendering in jiomart-deck.js.
   Data rules:
   · Real numbers come from project artifacts (GA report, usability
     test, heuristic audit, FY22–23 dashboard).
   · `illus: true` = example shape only, labelled on the slide.
   · `notes` = presenter talk-track (press N in the deck).
   ============================================================ */
window.DECK = {
  imgBase: "./images/enhanceProduct/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "problem", n: "02", label: "Problem" },
    { id: "research", n: "03", label: "Research" },
    { id: "decisions", n: "04", label: "Decisions" },
    { id: "results", n: "05", label: "Results" },
    { id: "learnings", n: "06", label: "Learnings" }
  ],
  slides: [
    /* ============ 01 — CONTEXT ============ */

    {
      section: "context", type: "opening",
      eyebrow: "JioMart · Product Discovery",
      headline: ["Helping shoppers ", "choose", " with confidence"],
      highlight: "choose",
      body: "People came to buy, but got lost while browsing. I redesigned Home, listing and product pages so choosing felt easy.",
      hero: "enhance-v2-pdp-main.png",
      backShots: ["enhance-v2-home.png", "enhance-v2-plp-grid.png"],
      badge: { n: "10.4 → 11.5%", l: "Visits with add-to-cart" },
      meta: [
        { l: "My role", v: "Design Lead, Discovery" },
        { l: "Timeline", v: "Aug – Oct 2023" },
        { l: "Screens", v: "Home · Listing · Product page" },
        { l: "Result", v: "More add-to-cart, better search" }
      ],
      cta: "Press → to begin",
      notes: "Shoppers had intent, browsing lost them. I fixed that. I'll show what broke, how I proved it, what I chose, and what changed."
    },

    {
      section: "context", type: "columns",
      eyebrow: "My role",
      headline: ["What I owned"],
      sub: "Design lead for discovery — from research to sign-off.",
      cols: [
        { k: "I led", tone: "info", items: [
          "Research and usability tests",
          "Problem framing and roadmap",
          "Home, listing and product page design"
        ] },
        { k: "I worked with", tone: "pos", items: [
          "Product team",
          "Engineers",
          "Design system team (Europe)"
        ] },
        { k: "My key calls", tone: "warn", items: [
          "Clear first, personal later",
          "Quick wins first",
          "Fix the system, not one screen"
        ] }
      ],
      notes: "Be clear on 'I' vs 'we'. I owned research, framing and design. Product, engineering and the design-system team shaped what we shipped."
    },

    /* ============ 02 — PROBLEM ============ */

    {
      section: "problem", type: "funnel",
      eyebrow: "The problem",
      headline: ["People wanted to buy.", "Browsing lost them."],
      sub: "Search worked. Browsing leaked at every step.",
      stages: [
        { k: "Home", s: "Visits", v: 100, illus: true },
        { k: "Listing", s: "Opened a list", v: 46, illus: true,
          drop: { q: "Where do I start?", c: "Confusing icons" } },
        { k: "Product", s: "Opened a product", v: 24, illus: true,
          drop: { q: "Which one?", c: "All cards looked the same" } },
        { k: "Cart", s: "Added to cart", v: 10.4, label: "10.4%",
          drop: { q: "Can I trust it?", c: "Key info hidden" } }
      ],
      compare: [
        { n: "41.4%", l: "Searchers who added to cart" },
        { n: "10.4%", l: "All visits that added to cart" }
      ],
      read: "Searchers bought 4× more. Browsing was the gap.",
      legend: { measured: "Real data (Google Analytics)", illus: "Example shape — not real data", drop: "Where people dropped off" },
      source: "Rough comparison — the two numbers use different bases.",
      notes: "Two numbers are real: 10.4% of visits added to cart, and 41.4% of search visits did. The middle bars are an example shape — say that out loud."
    },

    {
      section: "problem", type: "framing",
      eyebrow: "Why it mattered",
      headline: ["One problem, three sides"],
      sub: "",
      lenses: [
        { k: "Business", tone: "warn", t: "Visits weren't turning into sales.",
          d: "Only 10.4% of visits added to cart." },
        { k: "Shoppers", tone: "neg", t: "Choosing was hard work.",
          d: "In tests, 59% of taps hit the wrong place." },
        { k: "Design", tone: "pos", t: "Answer one question per screen.",
          d: "Where do I start? Which one? Can I trust it?" }
      ],
      why: [
        "Most shopping time is spent browsing",
        "Search proved people wanted to buy",
        "The new design system was the right moment"
      ],
      hmw: "How might we help shoppers choose with confidence — faster?",
      notes: "Keep the three sides apart: what the business lost, what shoppers felt, what design could change."
    },

    /* ============ 03 — RESEARCH ============ */

    {
      section: "research", type: "findings",
      eyebrow: "Research",
      headline: ["Four methods.", "One answer."],
      sub: "Every method pointed to the same thing.",
      findings: [
        { k: "Expert review", d: "23 issues found. The product page was the worst." },
        { k: "Usability test", d: "9 of 12 finished — but 59% of taps were wrong." },
        { k: "Analytics", d: "Searchers added to cart 4× more than browsers." },
        { k: "Interviews", d: "People wanted clarity, proof and control." }
      ],
      equation: ["Clarity", "Proof", "Control"],
      equationResult: "Confidence",
      notes: "Each method alone is weak; together they agree. Clarity + proof + control became the rule for every design choice."
    },

    /* ============ 04 — DECISIONS ============ */

    {
      section: "decisions", type: "alternatives",
      eyebrow: "Options I weighed",
      headline: ["What I chose, and why"],
      sub: "",
      rows: [
        { s: "Home", no: "Personalised feed", yes: "Clear category layout", why: "Fix confusion first. Personalise later." },
        { s: "Listing", no: "More products per screen", yes: "Bigger cards with price & rating", why: "People couldn't tell products apart." },
        { s: "Product", no: "Info hidden in tabs", yes: "Key info on the first screen", why: "No extra taps to decide." },
        { s: "Launch", no: "One big launch", yes: "Small steps", why: "Less risk, faster learning." }
      ],
      notes: "For each row: the tempting option, and the proof that ruled it out."
    },

    {
      section: "decisions", type: "evolution",
      eyebrow: "Decision 1 · Home",
      headline: ["Where do I start?"],
      sub: "",
      rationale: {
        evidence: "Icons and banners were confusing.",
        insight: "People didn't know where to begin.",
        hypothesis: "Clear categories → more people reach a list.",
        decision: "One icon style, calmer layout, search on top.",
        metric: "Home → listing clicks",
        observed: "Pages per visit 5.8 → 6.5"
      },
      before: { img: "enhance-problem-home.png", focus: 0.05, notes: ["Messy categories"] },
      v1: { img: "enhance-v1-home.png", focus: 0.05, notes: ["Clear categories"] },
      v2: { img: "enhance-v2-home.png", focus: 0.05, video: "enhance-v2-home.mp4", poster: "enhance-v2-home.png", notes: ["Live today"] },
      evidence: {
        method: "Expert review (heuristics)",
        img: "enhance-heuristic-table.png", crop: 0.15,
        observed: "I scored 23 problem areas by how bad they were and how easy they were to fix.",
        takeaway: "The same issues showed up everywhere: inconsistency and things that were hard to recognise.",
        implication: "Make common actions predictable. Fix the worst, easiest ones first."
      },
      notes: "Read the chain top to bottom, then show Before → V1 → Live. Pages per visit is a proxy; the real target is Home → listing clicks."
    },

    {
      section: "decisions", type: "evolution",
      eyebrow: "Decision 2 · Listing",
      headline: ["Which one do I pick?"],
      sub: "",
      rationale: {
        evidence: "9 of 12 finished the test, but 59% of taps were wrong.",
        insight: "Every product card looked the same.",
        hypothesis: "Price & rating on the card → more product clicks.",
        decision: "Bigger images, price and rating first, grid or list view.",
        metric: "Listing → product clicks",
        observed: "Search add-to-cart 41.4% → 44.3%"
      },
      before: { img: "enhance-problem-plp.png", focus: 0.05, notes: ["Cards look equal"] },
      v1: { img: "enhance-v1-plp.png", focus: 0.05, notes: ["Price & rating clear"] },
      v2: { img: "enhance-v2-plp-grid.png", focus: 0.25, video: "enhance-v2-plp.mp4", poster: "enhance-v2-plp-grid.png", altImg: "enhance-v2-plp-list.png", notes: ["Live today"] },
      evidence: {
        method: "Usability test · listing",
        img: "enhance-usability-test-plp.png", crop: 0.4,
        observed: "9 of 12 people finished the task. Average 17.6s, with 59.1% wrong taps.",
        takeaway: "People got there — but with effort.",
        implication: "Show the deciding info first on every card."
      },
      notes: "Lead with the 59% wrong taps. Grid for groceries, list for electronics."
    },

    {
      section: "decisions", type: "pdp-questions",
      eyebrow: "Decision 3 · Product page",
      headline: ["Can I trust this?"],
      sub: "",
      img: "enhance-problem-pdp.png", focus: 0.05,
      questions: ["Right size?", "Good price?", "When will it arrive?", "What do others say?"],
      rationale: {
        evidence: "The product page was the worst-rated area.",
        insight: "Key details were too far down.",
        hypothesis: "Key info up top → more add-to-cart.",
        decision: "Price, size, delivery and reviews on the first screen.",
        metric: "Product page → cart",
        observed: "Add-to-cart 10.4% → 11.5%"
      },
      before: { img: "enhance-problem-pdp.png", focus: 0.05 },
      v1: { img: "enhance-v1-pdp.png", focus: 0.05 },
      v2: { video: "enhance-v2-pdp.mp4", poster: "enhance-v2-pdp-main.png" },
      notes: "Each shopper question became one element on the first screen."
    },

    /* ============ 05 — RESULTS ============ */

    {
      section: "results", type: "uxfunnel",
      eyebrow: "Did it work?",
      headline: ["Yes — people bought more"],
      sub: "Before vs after, from Google Analytics.",
      takeaways: [
        "Add-to-cart: 10.4% → 11.5%",
        "Search add-to-cart: 41.4% → 44.3%",
        "Pages per visit: 5.8 → 6.5",
        "Pages loaded 29% faster"
      ],
      tableLabel: "Before vs after · Google Analytics",
      img: "enhance-impact-table.png",
      evidence: {
        method: "Google Analytics · before vs after",
        img: "enhance-impact-table.png", crop: 0.1,
        observed: "Speed, engagement and add-to-cart were measured before and after the redesign.",
        takeaway: "Pages got faster, people looked at more, and more of them added to cart.",
        implication: "Better browsing is a sales lever, not just a nicer look."
      },
      disclaimer: "Before vs after, not an A/B test — a strong signal, not proof.",
      notes: "Link each line to its decision. Say the caveat before they ask."
    },

    {
      section: "results", type: "impact",
      eyebrow: "The bigger picture",
      headline: ["The whole app grew"],
      sub: "Same period, across JioMart.",
      experience: ["Clearer navigation", "Easier to compare", "Reviews up front", "More confidence"],
      metricsLabel: "App-wide · FY 22–23",
      metrics: [
        { n: "+65%", l: "Monthly users" },
        { n: "+64%", l: "Repeat users" },
        { n: "+38%", l: "Revenue" },
        { n: "+51%", l: "Downloads" },
        { n: "+31%", l: "Daily orders" },
        { n: "−36%", l: "Support calls (Help & Support)" }
      ],
      evidence: {
        method: "Performance dashboard · FY 22–23",
        img: "enhance-improvement-metrics.png", crop: 0.15,
        observed: "Downloads +51%, monthly users +65%, repeat users +64%, daily orders +31%, revenue +38%. Support calls −36% came from Help & Support work.",
        takeaway: "Many teams contributed to these numbers.",
        implication: "Discovery was one part of a bigger push."
      },
      disclaimer: "App-wide numbers — many teams contributed, including this redesign.",
      notes: "Context, not credit. The previous slide is what I can link directly to my work."
    },

    /* ============ 06 — LEARNINGS ============ */

    {
      section: "learnings", type: "recognition",
      eyebrow: "What I learned",
      headline: ["Fewer doubts, more buys"],
      sub: "Recognised with the Jio Spotlight Award.",
      award: { img: "enhance-award.png", caption: "Jio Spotlight Award — presented by Anish Shah, President (Q4 2022–23)." },
      reflection: [
        "Next time: A/B test each step, and track clicks per screen from day one.",
        "Next up: a personal homepage and better search results.",
        "People buy when every screen removes a doubt."
      ],
      cta: [
        { label: "Full case study", href: "./jiomart-discovery.html", primary: true },
        { label: "Next project →", href: "./index.html" }
      ],
      notes: "Own the measurement gap, say what's next, then close on the principle."
    }
  ]
};
