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
  proofs: {
    carts: {
      method: "Sessions with add-to-cart", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0.12,
      calc: [["Before launch", "10.41%"], ["First read after launch", "11.48%"], ["Longer period after launch", "13.35%"], ["Change", "+2.94 points (+294 bps)"], ["Relative lift", "+28.2%", 1]],
      observed: "Share of all sessions where a shopper added at least one product to cart.",
      takeaway: "About 1 in 10 visits ended in a cart before; about 1 in 7.5 over the longer period. The lift kept growing after launch."
    },
    search: {
      method: "Search-assisted add-to-cart", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0.2,
      calc: [["Before launch", "41.40%"], ["First read after launch", "44.33%"], ["Longer period after launch", "50.20%"], ["Change", "+8.8 points (+880 bps)"], ["Relative lift", "+21.3%", 1]],
      observed: "Share of search sessions that ended with an add-to-cart.",
      takeaway: "Half of all searchers now add to cart, up from 41 in 100."
    },
    searchers: {
      method: "Search vs all sessions", tag: "Google Analytics · measured",
      img: "enhance-impact-table.png", crop: 0.85,
      calc: [["Search sessions → cart", "41.40%"], ["All sessions → cart", "10.41%"], ["Ratio", "≈ 4×", 1]],
      observed: "Shoppers who searched added to cart about four times as often as the average session.",
      takeaway: "Intent was there. Browsing was where people got lost.",
      implicationL: "Note", implication: "Different bases (search sessions vs all sessions), so treat 4× as a direction, not an exact ratio."
    },
    pages: {
      method: "Page views per user", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0.55,
      calc: [["Before launch", "5.81"], ["First read after launch", "6.49"], ["Longer period after launch", "7.04"], ["Change", "+21.2%", 1]],
      observed: "Average pages each shopper viewed: Home, listings and product pages.",
      takeaway: "Rose together with add-to-cart, so shoppers explored more and decided more, not got lost."
    },
    time: {
      method: "Engagement time", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0.45,
      calc: [["Per active user", "4m 14s → 5m 15s"], ["Per session", "1m 46s → 2m 13s"], ["Engagement rate", "80.51% → 84.21%"], ["Change per user", "+24.0%", 1]],
      observed: "Average active time, before launch vs the longer period after launch.",
      takeaway: "Read with add-to-cart: more time plus more carts means exploration, not friction."
    },
    speed: {
      method: "Page speed", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0.95,
      calc: [["Page download time", "0.17s → 0.12s"], ["Server response time", "0.47s → 0.37s"], ["Redirection time", "0.13s → 0.09s"], ["Page download change", "−29.4% (faster)", 1]],
      observed: "Average load times before launch vs the longer period after launch.",
      takeaway: "Lighter, consistent components made pages load faster."
    },
    volume: {
      method: "Extra carts per quarter", tag: "Estimate from real data", est: true,
      img: "enhance-impact-longterm.png", crop: 0.12,
      calc: [["Lift in add-to-cart sessions", "+2.94 points"], ["Visits per quarter (GA)", "~334M"], ["2.94% × 334M", "≈ 10M more carts", 1]],
      observed: "Multiplies the measured add-to-cart lift by JioMart's quarterly visit volume from the Google Analytics sheet.",
      takeaway: "An order-of-magnitude estimate, not a measured count. Say \u201croughly 10 million more carts a quarter\u201d."
    },
    visitors: {
      method: "JioMart visitors", tag: "Internal town hall",
      img: "enhance-townhall-visitors.jpg", crop: 0.4,
      observed: "Jio's town hall listed 94.6M visitors for JioMart, alongside MyJio and Jio.com.",
      takeaway: "Scale context: small percentage gains mean millions of shoppers."
    },
    audit: {
      method: "Heuristic evaluation", tag: "UX audit",
      img: "enhance-heuristic-table.png", crop: 0.2,
      calc: [["Problem areas rated", "23"], ["Most severe (S3)", "List, scan, checkout, order details, product page", 1]],
      observed: "Each area scored for severity (S0–S3) and ease of fixing (E0–E3) against Nielsen's heuristics.",
      takeaway: "Inconsistency and recognition problems repeated across every surface."
    },
    usability: {
      method: "Usability test · listing page", tag: "Usability test",
      img: "enhance-usability-test-plp.png", crop: 0.4,
      calc: [["Completed the task", "9 of 12"], ["Average time", "17.56s"], ["Misclicks", "59.1%", 1]],
      observed: "Shoppers saved a product to their wishlist on the new listing page.",
      takeaway: "The feedback strip worked; the wishlist icon itself needed to be easier to spot, so we iterated."
    },
    funnel: {
      method: "Journey step estimates", tag: "Illustrative estimate", est: true,
      calc: [["Home", "100%"], ["Kept browsing", "~72% est."], ["Opened a list", "~46% est."], ["Opened a product", "~24% est."], ["Added to cart (measured)", "10.4%", 1]],
      observed: "Only the start and end points were measured. Middle steps show the shape of the drop-off.",
      takeaway: "Use them to explain where people leave, not as exact figures."
    },
    interviews: {
      method: "Shopper interviews", tag: "Illustrative estimate", est: true,
      img: "enhance-design-team-04.png", crop: 0.3,
      observed: "In-person sessions with shoppers on how they browse, compare and decide.",
      takeaway: "Interview count is an estimate."
    },
    iterations: {
      method: "Iterations and review rounds", tag: "Illustrative estimate", est: true,
      img: "enhance-design-team-02.png", crop: 0.3,
      observed: "Design reviews with the wider design team and iterations after the usability test.",
      takeaway: "Counts are estimates."
    },
    decide: {
      method: "Time-to-decide target", tag: "Illustrative target", est: true,
      observed: "A target we set for how quickly shoppers move from listing to add-to-cart.",
      takeaway: "Not measured after launch; shown as the goal."
    }
  },
  slides: [
    /* 01 — PROJECT OVERVIEW & OUTCOME (mockups + hover unchanged) */
    {
      section: "context", type: "opening",
      eyebrow: "JioMart · Product discovery redesign",
      headline: ["Making ", "product discovery", " seamless"],
      highlight: "product discovery",
      body: "Shoppers could find products but struggled to choose. I redesigned the journey from Home to product page so deciding feels effortless.",
      hero: "enhance-v2-pdp-main.png",
      backShots: ["enhance-v2-home.png", "enhance-v2-plp-grid.png"],
      badge: { n: "{{~10M|volume}}", l: "More carts every quarter · est." },
      meta: [
        { l: "My role", v: "Design lead · research to handoff" },
        { l: "Timeline", v: "Aug – Oct 2023 · 10 weeks" },
        { l: "Team", v: "PM · Engineering · Analytics" },
        { l: "After launch", v: "{{+28%|carts}} carts · {{+21%|pages}} pages · {{29%|speed}} faster" }
      ],
      notes: "Open simply: shoppers could find products but struggled to choose, so I made discovery seamless. Hover the phone for the live Home and listing. Numbers are underlined; click any to show its evidence. ~10M carts a quarter is an estimate: +2.94 points of add-to-cart sessions × ~334M visits a quarter. Results are from the longer period after launch; the first read was smaller (+1.07 points), and the gains kept growing."
    },

    /* 02 — BUSINESS CONTEXT (infographic) */
    {
      section: "context", type: "contextinfo",
      eyebrow: "Where it all started",
      headline: ["Traffic was high. Carts were not."],
      define: {
        k: "Discovery at JioMart",
        steps: ["Home", "Search / browse", "Listing", "Product page", "Add to cart"],
        note: "Where most of a shopping session is spent",
        btn: "See before screens",
        shots: [
          { k: "Home", img: "enhance-problem-home.png", pain: "Busy banners, mixed icons" },
          { k: "Search / browse", img: "enhance-iter-search-before.png", pain: "Generic suggestions" },
          { k: "Listing", img: "enhance-problem-plp.png", pain: "Cards look alike" },
          { k: "Product page", img: "enhance-problem-pdp.png", pain: "Key details buried" }
        ]
      },
      flow: [
        { k: "Who asked", t: "Product Manager and business stakeholders", icon: "people" },
        { k: "The ask", t: "Refresh Home, listing and product pages", icon: "brief" },
        { k: "North Star", t: "More sessions ending in an add-to-cart", icon: "star", tone: "pos" }
      ],
      reality: { big: "{{1 in 10|carts}}", l: "sessions added to cart", dots: 10, hit: 1 },
      stats: [
        { n: "{{~95M|visitors}}", l: "visitors" },
        { n: "3", l: "big categories: grocery, fashion, electronics" },
        { n: "{{41%|search}}", l: "add-to-cart when shoppers searched" }
      ],
      bounds: [
        { k: "Constraint", v: "Live app, no release freeze" },
        { k: "Expected", v: "Higher add-to-cart and engagement" }
      ],
      notes: "First define discovery: every step from opening the app to adding to cart, where most of a session is spent. Then left to right: the PM and business stakeholders asked for a refresh of discovery; the North Star was more sessions ending in add-to-cart. Ground reality: huge traffic, but only 1 in 10 sessions added to cart, while searchers did at 41%. We had to ship on a live app without freezing releases."
    },

    /* 03 — ASKING THE RIGHT QUESTIONS */
    {
      section: "context", type: "qa",
      eyebrow: "Asking the right questions",
      headline: ["Before designing, we questioned the brief"],
      qs: [
        { q: "Why solve this?", a: "Browsing sessions rarely ended in a cart. Search did {{4×|searchers}} better." },
        { q: "Why now?", a: "Traffic was growing fast; every lost cart cost more." },
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
        { k: "Browse / search", stat: "{{72%|funnel}}", est: true, statL: "kept going", issues: [{ t: "Irrelevant search results", tag: "Audit" }] },
        { k: "Listing", stat: "{{46%|funnel}}", est: true, statL: "opened a list", issues: [{ t: "Every card looked alike", tag: "Audit" }] },
        { k: "Product page", stat: "{{24%|funnel}}", est: true, statL: "opened a product", issues: [{ t: "Price, size, delivery buried", tag: "Audit" }] },
        { k: "Add to cart", stat: "{{10.4%|carts}}", statL: "added to cart", issues: [{ t: "{{41.4%|search}} when searching", tag: "Measured" }] }
      ],
      foot: "{{23 heuristic issues|audit}} found. The product page scored worst.",
      notes: "Walk the journey left to right. 100% and 10.4% are from analytics; middle steps are illustrative (est.). The heuristic audit found 23 issues, and the product page was the most severe."
    },

    /* 05 — RESEARCH & PROBLEM DISCOVERY */
    {
      section: "discover", type: "board",
      eyebrow: "Research",
      headline: ["Data first, then people"],
      cards: [
        { k: "Analytics", tag: "Validated", img: "enhance-heatmaps-data.png", pos: "right top", stat: "{{4×|searchers}}",
          learned: "Searchers added to cart 4× more than browsers." },
        { k: "Journey audit", tag: "Validated", img: "enhance-flow-pipeline.png", stat: "{{23 issues|audit}}",
          learned: "Every screen mapped. Product page worst." },
        { k: "User interviews", tag: "Validated", img: "enhance-design-team-04.png", stat: "{{8 shoppers|interviews}}", est: true,
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
        { need: "Find it by search", lever: "Protect the {{41%|search}} channel", metric: "Better result matching", tier: "Medium" }
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
        { k: "Add-to-cart", v: "{{10.4%|carts}} → 12% target" },
        { k: "Search add-to-cart", v: "{{41%|search}} → 45% target" },
        { k: "Time to decide", v: "{{−20%|decide}} est." }
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
        { saw: "Design critiques with the wider design team", bet: "One consistent pattern for every surface" },
        { saw: "Feasibility review with engineering", bet: "Chose the direction we could ship in phases" }
      ],
      tiles: [
        { img: "enhance-design-team-01.png", t: "Whiteboard workshop" },
        { img: "enhance-design-team-02.png", t: "Design critique" },
        { img: "enhance-design-team-03.png", t: "Screen review with new DS" },
        { img: "enhance-user-journey-02.png", t: "MoSCoW: what shipped first" }
      ],
      notes: "Every decision was made with the team. We explored three concepts, critiqued them with the wider design team, and picked the one engineering could ship in phases. MoSCoW decided the first release."
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
        { k: "Consistency", v: "One card and icon style across categories" },
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
      notes: "One shopper question per screen. Click any phone to enlarge. Then the chips: one consistent style, accessibility checks, edge cases, and a clean Figma handoff."
    },

    /* 11 — VALIDATION, ITERATION & IMPACT */
    {
      section: "results", type: "kpis",
      eyebrow: "Validation & impact",
      headline: ["Tested, refined, and it moved the numbers"],
      checks: [
        { n: "{{9 / 12|usability}}", l: "completed the usability test" },
        { n: "{{3|iterations}}", l: "design iterations", est: true },
        { n: "{{6|iterations}}", l: "design review rounds", est: true }
      ],
      groups: [
        { k: "Conversion", rows: [
          { l: "Sessions with add-to-cart", pre: 10.41, post: 13.35, unit: "%", d: "{{+294 bps|carts}}", rel: "+28.2%" },
          { l: "Search-assisted add-to-cart", pre: 41.40, post: 50.20, unit: "%", d: "{{+880 bps|search}}", rel: "+21.3%" }
        ] },
        { k: "Engagement", rows: [
          { l: "Time per active user", pre: 254, post: 315, unit: "s", fmt: "ms", d: "{{+24.0%|time}}" },
          { l: "Time per session", pre: 106, post: 133, unit: "s", fmt: "ms", d: "{{+25.5%|time}}" },
          { l: "Page views per user", pre: 5.81, post: 7.04, unit: "", d: "{{+21.2%|pages}}" }
        ] },
        { k: "Speed", rows: [
          { l: "Page download time", pre: 0.17, post: 0.12, unit: "s", d: "{{−29.4%|speed}}", lowerBetter: true },
          { l: "Server response time", pre: 0.47, post: 0.37, unit: "s", d: "{{−21.3%|speed}}", lowerBetter: true }
        ] }
      ],
      disclaimer: "Google Analytics, before launch vs a longer period after launch. Iteration and review counts are illustrative (est.).",
      notes: "Validation first: 9 of 12 completed the usability test; the wishlist icon needed work, so we iterated. Then results over the longer period: add-to-cart +294 bps (+28%), search add-to-cart +880 bps (+21%), more time and pages, faster loads. The first read was smaller; gains grew as shoppers adapted. These are before/after, not an A/B test."
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
        { k: "For the business", d: "{{+28%|carts}} add-to-cart sessions, {{+21%|search}} from search." },
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
