/* ============================================================
   JioMart Discovery — interview deck (12 slides)
   Flow: Overview → Business context → Right questions → Existing
         experience → Research → Synthesis → Competitors → Problem →
         Ideation → Solution → Validation & impact → Takeaways
   Content only. Rendering in jiomart-deck.js.
   Numbers:
   · Real: Google Analytics pre/post table, 23-issue audit, 9/12 usability test.
   · Illustrative placeholders carry `est: true` or "est." → shown as such.
   · `notes` = presenter talk-track (press N).
   ============================================================ */
window.DECK = {
  imgBase: "./images/enhanceProduct/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "discover", n: "02", label: "Discovery" },
    { id: "define", n: "03", label: "Define" },
    { id: "design", n: "04", label: "Design" },
    { id: "results", n: "05", label: "Impact" }
  ],
  slides: [
    /* 01 — PROJECT OVERVIEW & OUTCOME (mockups + hover unchanged) */
    {
      section: "context", type: "opening",
      eyebrow: "JioMart · Product discovery redesign",
      headline: ["Clearer discovery, ", "10% more", " shoppers adding to cart"],
      highlight: "10% more",
      body: "Shoppers found products but struggled to choose. I redesigned Home, listing and product pages so choosing felt easy.",
      hero: "enhance-v2-pdp-main.png",
      backShots: ["enhance-v2-home.png", "enhance-v2-plp-grid.png"],
      badge: { n: "10.4 → 11.5%", l: "Sessions with add-to-cart" },
      meta: [
        { l: "My role", v: "Design lead · research to handoff" },
        { l: "Timeline", v: "Aug – Oct 2023 · 10 weeks" },
        { l: "Team", v: "PM · Engineering · Analytics · DS 2.0" },
        { l: "Search add-to-cart", v: "41.4% → 44.3%" }
      ],
      cta: "Hover the phone · press → to begin",
      notes: "Open with the outcome: add-to-cart sessions rose from 10.4% to 11.5%, about 10% more, and search add-to-cart from 41.4% to 44.3%. Hover the phone to show the live Home and listing. I led discovery design from research to handoff over about 10 weeks."
    },

    /* 02 — BUSINESS CONTEXT (infographic) */
    {
      section: "context", type: "contextinfo",
      eyebrow: "Where it all started",
      headline: ["Traffic was high. Carts were not."],
      flow: [
        { k: "Who asked", t: "Product Manager and business stakeholders", icon: "people" },
        { k: "The ask", t: "Refresh Home, listing and product pages for DS 2.0", icon: "brief" },
        { k: "North Star", t: "More sessions ending in an add-to-cart", icon: "star", tone: "pos" }
      ],
      reality: { big: "1 in 10", l: "sessions added to cart", dots: 10, hit: 1 },
      stats: [
        { n: "~95M", l: "visitors" },
        { n: "3", l: "big categories: grocery, fashion, electronics" },
        { n: "41%", l: "add-to-cart when shoppers searched" }
      ],
      bounds: [
        { k: "Constraint", v: "Ship inside the DS 2.0 rollout" },
        { k: "Expected", v: "Higher add-to-cart and engagement" }
      ],
      notes: "Left to right: the PM and business stakeholders asked for a DS 2.0 refresh; the North Star was more sessions ending in add-to-cart. Ground reality: huge traffic, but only 1 in 10 sessions added to cart, while searchers did at 41%. We had to ship inside the DS 2.0 rollout."
    },

    /* 03 — ASKING THE RIGHT QUESTIONS */
    {
      section: "context", type: "qa",
      eyebrow: "Asking the right questions",
      headline: ["Before designing, we questioned the brief"],
      qs: [
        { q: "Why solve this?", a: "Browsing sessions rarely ended in a cart. Search did 4× better." },
        { q: "Why now?", a: "DS 2.0 meant every screen was being rebuilt anyway." },
        { q: "What is the business after?", a: "More add-to-carts from the same traffic." },
        { q: "What do users struggle with?", a: "Comparing products and trusting the details." },
        { q: "What does success look like?", a: "Add-to-cart up, time to decide down." },
        { q: "What's out of scope?", a: "Checkout, payments and personalisation." }
      ],
      foot: "Outcome: a visual refresh became a conversion problem, with one goal for business and users.",
      notes: "This is where I challenged the brief. Each answer came from a conversation with the PM, analytics or engineering. The big shift: 'make it look new' became 'help people decide'."
    },

    /* 04 — UNDERSTANDING THE EXISTING EXPERIENCE */
    {
      section: "discover", type: "journey",
      eyebrow: "The existing experience",
      headline: ["Shoppers dropped at every step"],
      steps: [
        { k: "Home", stat: "100%", statL: "sessions", issues: [{ t: "Inconsistent icons, busy banners", tag: "Audit" }] },
        { k: "Browse / search", stat: "72%", est: true, statL: "kept going", issues: [{ t: "Irrelevant search results", tag: "Audit" }] },
        { k: "Listing", stat: "46%", est: true, statL: "opened a list", issues: [{ t: "Every card looked alike", tag: "Audit" }] },
        { k: "Product page", stat: "24%", est: true, statL: "opened a product", issues: [{ t: "Price, size, delivery buried", tag: "Audit" }] },
        { k: "Add to cart", stat: "10.4%", statL: "added to cart", issues: [{ t: "41.4% when searching", tag: "Measured" }] }
      ],
      foot: "23 heuristic issues found. The product page scored worst.",
      notes: "Walk the journey left to right. 100% and 10.4% are from analytics; middle steps are illustrative (est.). The heuristic audit found 23 issues, and the product page was the most severe."
    },

    /* 05 — RESEARCH & PROBLEM DISCOVERY */
    {
      section: "discover", type: "board",
      eyebrow: "Research",
      headline: ["Data first, then people"],
      cards: [
        { k: "Analytics", tag: "Validated", img: "enhance-heatmaps-data.png", pos: "right top", stat: "4×",
          learned: "Searchers added to cart 4× more than browsers." },
        { k: "Journey audit", tag: "Validated", img: "enhance-flow-pipeline.png", stat: "23 issues",
          learned: "Every screen mapped. Product page worst." },
        { k: "User interviews", tag: "Validated", img: "enhance-design-team-04.png", stat: "8 shoppers", est: true,
          learned: "“I can't tell which one to buy.”" },
        { k: "Our hypothesis", tag: "Assumption", img: "enhance-research-strategy.png", stat: "H1",
          learned: "Show price, size and proof earlier → more add-to-cart." }
      ],
      notes: "Limited time and a live product, so we started with analytics, then talked to shoppers. Be clear: the first three are findings; H1 was our assumption to test. Interview count is illustrative (est.)."
    },

    /* 06 — ANALYSIS & SYNTHESIS */
    {
      section: "discover", type: "oppmatrix",
      eyebrow: "Analysis & synthesis",
      headline: ["Where user needs met business goals"],
      heads: ["User need", "Business goal", "Opportunity"],
      rows: [
        { need: "Know where to start", lever: "More sessions reach a list", metric: "Clear category entry", tier: "High" },
        { need: "Compare quickly", lever: "More list → product clicks", metric: "Decision info on cards", tier: "High" },
        { need: "Trust the choice", lever: "More add-to-cart", metric: "Key details up front", tier: "High" },
        { need: "Find it by search", lever: "Protect the 41% channel", metric: "Better result matching", tier: "Medium" }
      ],
      prioritise: {
        img: "enhance-impact-effort-matrix.png",
        cap: "Pain points prioritised by impact and effort",
        points: ["Quick wins first: discount tags, category clarity", "Parked: 3D icons, gamified categories"]
      },
      notes: "We clustered pain points and plotted them on impact vs effort. The top three opportunities sat where user needs and business goals overlapped."
    },

    /* 07 — COMPETITIVE ANALYSIS */
    {
      section: "discover", type: "ideas",
      eyebrow: "Competitive analysis",
      headline: ["Leaders make the decision obvious"],
      pairLabels: ["They do", "So we"],
      pairs: [
        { saw: "Grofers, BigBasket: discount on every card", bet: "Put price and discount on the card" },
        { saw: "Flipkart, BigBasket: many image views", bet: "Bigger, swipeable product images" },
        { saw: "Amazon: rating next to the title", bet: "Proof right under the name" }
      ],
      tiles: [
        { img: "enhance-pdp-competitor-benchmark.webp", t: "Product page benchmark" },
        { img: "enhance-competitive-01.png", t: "Electronics benchmark" },
        { img: "enhance-competitive-03.png", t: "Category screens audit" },
        { img: "enhance-competitive-02.png", t: "Feature gaps" }
      ],
      notes: "Five apps: Amazon, Flipkart, BigBasket, Grofers, Meesho. The gap: JioMart hid what competitors showed on the card."
    },

    /* 08 — DEFINING THE PROBLEM */
    {
      section: "define", type: "synthesis",
      eyebrow: "Defining the problem",
      headline: ["Not a UI problem. A decision problem."],
      cols: ["What shoppers felt", "Why it happened"],
      rows: [
        { theme: "Finding", symptom: "“Where do I start?”", cause: "Inconsistent icons and categories" },
        { theme: "Comparing", symptom: "“Which one do I pick?”", cause: "Every card showed different info" },
        { theme: "Choosing", symptom: "“Can I trust this?”", cause: "Key details buried below the fold" }
      ],
      from: "Refresh the UI",
      to: "Help shoppers decide with confidence",
      statement: "Shoppers didn't lack products. They lacked the information to choose one with confidence.",
      goals: [
        { k: "Add-to-cart", v: "10.4% → 12%" },
        { k: "Search add-to-cart", v: "41% → 45%" },
        { k: "Time to decide", v: "−20% est." }
      ],
      notes: "The key milestone. Show the shift from 'refresh the UI' to 'help shoppers decide'. Then the statement and the success metrics we set. Time-to-decide is illustrative (est.)."
    },

    /* 09 — IDEATION & COLLABORATION */
    {
      section: "design", type: "ideas",
      eyebrow: "Ideation & collaboration",
      headline: ["Built with the team, not handed to it"],
      pairLabels: ["Step", "Outcome"],
      pairs: [
        { saw: "Whiteboard workshop with PM and engineers", bet: "3 concepts for listing and product page" },
        { saw: "Critiques with the DS 2.0 team in Europe", bet: "Patterns locked to shared components" },
        { saw: "Feasibility review with engineering", bet: "Chose the direction we could ship in phases" }
      ],
      tiles: [
        { img: "enhance-design-team-01.png", t: "Whiteboard workshop" },
        { img: "enhance-design-team-02.png", t: "DS 2.0 critique, Europe" },
        { img: "enhance-design-team-03.png", t: "Screen review with new DS" },
        { img: "enhance-user-journey-02.png", t: "MoSCoW: what shipped first" }
      ],
      notes: "Every decision was made with the team. We explored three concepts, critiqued them with the DS 2.0 team, and picked the one engineering could ship in phases. MoSCoW decided the first release."
    },

    /* 10 — SOLUTION & DESIGN EXECUTION (mockups unchanged) */
    {
      section: "design", type: "showcase",
      eyebrow: "The solution",
      headline: ["Every screen answers one shopper question"],
      labels: ["Before", "Live"],
      pairs: [
        { k: "Home · Where do I start?", before: "enhance-problem-home.png", after: "enhance-v2-home.png", note: "One icon style, search first" },
        { k: "Listing · Which one?", before: "enhance-problem-plp.png", after: "enhance-v2-plp-grid.png", note: "Price, discount, rating on every card" },
        { k: "Product · Can I trust it?", before: "enhance-problem-pdp.png", after: "enhance-v2-pdp-main.png", note: "Size, price, delivery on the first screen" }
      ],
      chips: [
        { k: "Design system", v: "Built from JDS 2.0 components" },
        { k: "Accessibility", v: "4.5:1 contrast, 44px tap targets" },
        { k: "Edge cases", v: "Out of stock, no reviews, long names" },
        { k: "Handoff", v: "Specs and states in Figma" }
      ],
      evidence: {
        method: "Old vs new listing",
        img: "enhance-plp-old-new-improvements.webp", crop: 0.05,
        observed: "The old and new listing pages side by side, with the seven key improvements.",
        takeaway: "Cleaner cards, wishlist on the list, sort and filter up top, deal timers and tags.",
        implication: "Every change answers a comparison question on the card itself."
      },
      notes: "One shopper question per screen. Click any phone to enlarge. Then the chips: built on JDS components, accessibility checks, edge cases, and a clean Figma handoff."
    },

    /* 11 — VALIDATION, ITERATION & IMPACT */
    {
      section: "results", type: "kpis",
      eyebrow: "Validation & impact",
      headline: ["Tested, refined, and it moved the numbers"],
      checks: [
        { n: "9 / 12", l: "completed the usability test" },
        { n: "3", l: "design iterations", est: true },
        { n: "6", l: "review rounds with DS team", est: true }
      ],
      groups: [
        { k: "Conversion", rows: [
          { l: "Sessions with add-to-cart", pre: 10.41, post: 11.48, unit: "%", d: "+107 bps", rel: "+10.3%" },
          { l: "Search-assisted add-to-cart", pre: 41.40, post: 44.33, unit: "%", d: "+293 bps", rel: "+7.1%" }
        ] },
        { k: "Engagement", rows: [
          { l: "Time per active user", pre: 254, post: 294, unit: "s", fmt: "ms", d: "+15.7%" },
          { l: "Page views per user", pre: 5.81, post: 6.49, unit: "", d: "+11.7%" }
        ] },
        { k: "Speed", rows: [
          { l: "Page download time", pre: 0.17, post: 0.12, unit: "s", d: "−29%", lowerBetter: true }
        ] }
      ],
      disclaimer: "Google Analytics, before vs after launch. Iteration and review counts are illustrative (est.).",
      notes: "Validation first: 9 of 12 completed the usability test; the wishlist icon needed work, so we iterated. Then results: add-to-cart +107 bps, search add-to-cart +293 bps, more time and pages, faster loads. These are before/after, not an A/B test."
    },

    /* 12 — KEY TAKEAWAYS */
    {
      section: "results", type: "close",
      eyebrow: "Key takeaways",
      headline: ["Every screen should remove a doubt"],
      blocks: [
        { k: "Problem solved", d: "Shoppers can now find, compare and trust a product fast." },
        { k: "My contribution", d: "Reframed the brief, led research and designed discovery end to end." },
        { k: "For users", d: "Decision info up front on every screen." },
        { k: "For the business", d: "+10% add-to-cart sessions, +7% from search." },
        { k: "What I learned", d: "Same gap everywhere? Fix the system, not the screen." },
        { k: "Next time", d: "Track every step and A/B test from day one." }
      ],
      award: { img: "enhance-award.png", caption: "Jio Spotlight Award · Q4 2022–23" },
      cta: [
        { label: "Full case study", href: "./jiomart-discovery.html", primary: true },
        { label: "Next project →", href: "./index.html" }
      ],
      notes: "Close on the principle: people buy when every screen removes a doubt."
    }
  ]
};
