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
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[150, 214]],
      calc: [["Before launch", "10.41%"], ["First read after launch", "11.48%"], ["After launch (report, Aug 2023)", "13.35%"], ["Change", "+2.94 points (+294 bps)"], ["Relative lift", "+28.2%", 1]],
      observed: "Share of all sessions where a shopper added at least one product to cart.",
      takeaway: "About 1 in 10 visits ended in a cart before; about 1 in 7.5 by the Aug 2023 report. The lift kept growing after launch."
    },
    search: {
      method: "Search-assisted add-to-cart", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[214, 279]],
      calc: [["Before launch", "41.40%"], ["First read after launch", "44.33%"], ["After launch (report, Aug 2023)", "50.20%"], ["Change", "+8.8 points (+880 bps)"], ["Relative lift", "+21.3%", 1]],
      observed: "Share of search sessions that ended with an add-to-cart.",
      takeaway: "Half of all searchers now add to cart, up from 41 in 100."
    },
    searchers: {
      method: "Search vs all sessions", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[150, 279]],
      calc: [["Search sessions → cart (before launch)", "41.40%"], ["All sessions → cart (before launch)", "10.41%"], ["Ratio", "≈ 4×", 1]],
      observed: "Shoppers who searched added to cart about four times as often as the average session.",
      takeaway: "Intent was there. Browsing was where people got lost.",
      implicationL: "Note", implication: "Different bases (search sessions vs all sessions), so treat 4× as a direction, not an exact ratio."
    },
    pages: {
      method: "Page views per user", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[476, 542]],
      calc: [["Before launch", "5.81"], ["First read after launch", "6.49"], ["After launch (report, Aug 2023)", "7.04"], ["Change", "+21.2%", 1]],
      observed: "Average pages each shopper viewed: Home, listings and product pages.",
      takeaway: "Rose together with add-to-cart, so shoppers explored more and decided more, not got lost."
    },
    time: {
      method: "Engagement time", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[346, 476], [542, 607]],
      calc: [["Per active user", "4m 14s → 5m 15s"], ["Per session", "1m 46s → 2m 13s"], ["Engagement rate", "80.51% → 84.21%"], ["Change per user", "+24.0%", 1]],
      observed: "Average active time, before launch vs after launch (report evaluated Aug 2023).",
      takeaway: "Read with add-to-cart: more time plus more carts means exploration, not friction."
    },
    speed: {
      method: "Page speed", tag: "Google Analytics · measured",
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[672, 868]],
      calc: [["Page download time", "0.17s → 0.12s"], ["Server response time", "0.47s → 0.37s"], ["Redirection time", "0.13s → 0.09s"], ["Page download change", "−29.4% (faster)", 1]],
      observed: "Average load times before launch vs after launch (report evaluated Aug 2023).",
      takeaway: "Lighter, consistent components made pages load faster."
    },
    volume: {
      method: "Extra carts per quarter", tag: "Estimate from real data", est: true,
      img: "enhance-impact-longterm.png", crop: 0, hlH: 896, hl: [[150, 214]],
      calc: [["Lift in add-to-cart sessions", "+2.94 points"], ["Visits per quarter (GA)", "~334M"], ["2.94% × 334M", "≈ 10M more carts", 1]],
      observed: "Multiplies the measured add-to-cart lift by JioMart's quarterly visit volume from the Google Analytics sheet.",
      takeaway: "An order-of-magnitude estimate, not a measured count. Say \u201croughly 10 million more carts a quarter\u201d."
    },
    categories: {
      method: "JioMart categories", tag: "JioMart",
      img: "enhance-categories-11.webp", crop: 0,
      observed: "Grocery, Mobiles, Home & Living, Fruits, Electronics, Fashion, Beauty, Handloom, Medicines, Furniture and Jewellery.",
      takeaway: "Every category had different product info, so one consistent way to compare mattered across all 11."
    },
    competitors: {
      method: "Competitive benchmark", tag: "Benchmark",
      calc: [["Apps studied", "Amazon, Flipkart, BigBasket, Grofers, Meesho"], ["Also for electronics", "Amazon, Flipkart, Tata CLiQ"], ["Finding", "Leaders make the decision obvious", 1]],
      pairsL: "What they do → what we did",
      pairs: [
        ["Grofers, BigBasket: discount on every card", "Put price and discount on the card"],
        ["Flipkart, BigBasket: many image views", "Bigger, swipeable product images"],
        ["Amazon: rating next to the title", "Proof right under the name"]
      ],
      galleryL: "Benchmark boards · click to open",
      gallery: [
        ["enhance-pdp-competitor-benchmark.webp", "Product page benchmark"],
        ["enhance-competitive-01.png", "Electronics benchmark"],
        ["enhance-competitive-03.png", "Category screens audit"],
        ["enhance-competitive-02.png", "Feature gaps"]
      ]
    },
    visitors: {
      method: "JioMart visitors", tag: "Internal town hall",
      img: "enhance-townhall-visitors.jpg", crop: 0.4,
      observed: "Jio's town hall listed 94.6M visitors for JioMart, alongside MyJio and Jio.com.",
      takeaway: "Scale context: small percentage gains mean millions of shoppers."
    },
    audit: {
      method: "Heuristic evaluation", tag: "UX audit",
      img: "enhance-heuristic-table.png", crop: 0,
      calc: [["Problem areas rated", "23"], ["Severity scale", "S0 cosmetic → S4 critical"], ["Ease scale", "E0 easy → E3 hard"], ["Most severe", "Help & support (S4), product page, scan, list, My List (S3)", 1]],
      findingsL: "Key findings · click a page to open it",
      findings: [
        { k: "Scan / QR search", img: "enhance-heur-scan.webp", s: "S3", e: "E3", h: ["#5 Error prevention", "#6 Recognition", "#9 Help & docs"], issue: "Scanner unclear and broken: photo scan returned a blank screen." },
        { k: "List feature", img: "enhance-heur-list.webp", s: "S3", e: "E2", h: ["#2 Match real world", "#3 User control"], issue: "Only the first item in a pasted list was searched, and the list couldn't be edited." },
        { k: "Voice search", img: "enhance-heur-voice.webp", s: "S2", e: "E2", h: ["#7 Flexibility", "#10 Help & docs"], issue: "Couldn't add to cart by voice; everyday items like onion came back \u201cnot found\u201d." },
        { k: "Search page", img: "enhance-heur-search.webp", s: "S1", e: "E1", h: ["#3 User control", "#6 Recognition"], issue: "Wrong categories (orange in Fashion) and monotonous, text-only suggestions." },
        { k: "Category icons", img: "enhance-heur-home-icons.webp", s: "S0", e: "E0", h: ["#4 Consistency", "#6 Recognition"], issue: "Icons and colours inconsistent and dull across the category tray." },
        { k: "List & scan icons", img: "enhance-heur-home-icons.webp", s: "S0", e: "E0", h: ["#6 Recognition"], issue: "Hard for non-tech-savvy shoppers to tell what the icons do." },
        { k: "Help & support", s: "S4", e: "E3", h: ["#4 Consistency", "#10 Help & docs"], issue: "FAQs add mental load; the complaint option is hard to find." },
        { k: "Product page", s: "S3", e: "E2", h: ["#3 User control", "#4 Consistency", "#5 Error prevention"], issue: "Brand not highlighted, EMI not clickable, delivery date needs a pincode, seller info and clear CTAs missing." },
        { k: "My List", s: "S3", e: "E2", h: ["#2 Match real world", "#4 Consistency"], issue: "Related features (orders, wishlist, buy again) not grouped; empty states have no action." },
        { k: "Listing page", s: "S2", e: "E2", h: ["#5 Error prevention"], issue: "The + button silently stops at max quantity, with no message." },
        { k: "Top deals", s: "S2", e: "E1", h: ["#5 Error prevention"], issue: "No feedback when quantity can't increase; price, discount and quantity hierarchy unclear." },
        { k: "Banners", s: "S2", e: "E2", h: ["#4 Consistency", "#8 Minimalist design"], issue: "Random fonts and colours, no break between banners and products, 7+ carousel cards." },
        { k: "Filter & sort", s: "S2", e: "E2", h: ["#9 Recover from errors"], issue: "Selected filters barely visible; the red dot is ambiguous." },
        { k: "Menu & categories", s: "S2", e: "E1", h: ["#2 Real world", "#4 Consistency", "#6 Recognition", "#8 Minimalist"], issue: "Category hierarchy differs by entry point; fashion and medicine missing; old icons." },
        { k: "Category showcase", s: "S2", e: "E1", h: ["#7 Flexibility"], issue: "Category widgets make the page long and look inconsistent." },
        { k: "Address", s: "S2", e: "E1", h: ["#6 Recognition"], issue: "Pincode-only location and no GPS auto-detect in the app." },
        { k: "Profile & account", s: "S2", e: "E2", h: ["#4 Consistency"], issue: "Profile and My Account show the same content under different names." },
        { k: "Top categories", s: "S0", e: "E0", h: ["#4 Consistency", "#8 Minimalist design"], issue: "Tile styles vary across the top-categories grid." }
      ],
      takeaway: "Inconsistency and recognition problems repeated across every surface. The product page, scan and list features were among the most severe."
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
      badge: { n: "{{+28%|carts}}", l: "More visits end in a cart" },
      meta: [
        { l: "My role", v: "Design lead · research to handoff" },
        { l: "Timeline", v: "Jan – Mar 2023 · results Aug 2023" },
        { l: "Team", v: "PM · Engineering · Analytics" },
        { l: "After launch", v: "{{50%|search}} search → cart · {{29%|speed}} faster" }
      ],
      notes: "Open simply: shoppers could find products but struggled to choose, so I made discovery seamless. Hover the phone for the live Home and listing. Numbers are underlined; click any to show its evidence. +28%: sessions with add-to-cart went from 10.41% to 13.35%. Half of searchers now add to cart (50.2%, up from 41.4%). Project ran Jan – Mar 2023; results are from the report evaluated in Aug 2023; the first read was smaller (+1.07 points), and the gains kept growing."
    },

    /* 02 — BUSINESS CONTEXT (infographic) */
    {
      section: "context", type: "contextinfo",
      eyebrow: "Context",
      headline: ["Traffic was high. Carts were not."],
      sub: "{{~95M visitors|visitors}} came to JioMart, but only {{1 in 10 sessions|carts}} ended with something in the cart.",
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
        { k: "Business", t: "Visits, but few carts", icon: "star", pts: [["Ask", "Convert more visits"], ["Goal", "More add-to-carts"]] },
        { k: "Product", t: "Pages felt dated", icon: "brief", pts: [["Ask", "Refresh 3 key pages"], ["Goal", "One consistent look"]] },
        { k: "Shopper", t: "\u201cCan I trust this?\u201d", icon: "people", tone: "pos", pts: [["Need", "Key info up front"], ["Goal", "Buy with confidence"]] }
      ],
      paths: {
        rows: [
          { k: "Search", flow: "Search → Product → Cart", lit: 4, v: "{{41%|search}}", l: "add to cart", tone: "good" },
          { k: "Browse", flow: "Home → Listing → Product → Cart", lit: 1, v: "{{10%|carts}}", l: "add to cart", tone: "bad" }
        ],
        big: "{{4×|searchers}}", bigL: "Shoppers who search add to cart 4× more. Browsing was the gap."
      },
      notes: "First define discovery: every step from opening the app to adding to cart, where most of a session is spent. Then the three frustrations, left to right: business saw lots of visits but too few carts; product felt the pages looked dated and messy, so they asked for a refresh; and shoppers didn't trust what they saw: unclear price, size, delivery and no reviews up front. That third one was the real problem. Ground reality: huge traffic, but only 1 in 10 sessions added to cart, while searchers did at 41%. We had to ship on a live app without freezing releases."
    },

    /* 03 — ASKING THE RIGHT QUESTIONS */
    {
      section: "context", type: "qa",
      eyebrow: "Asking the right questions",
      headline: ["We asked why before we designed"],
      sub: "Six questions turned a facelift request into a clear problem to solve.",
      qs: [
        { tag: "Business", q: "Why fix it?", a: "Only {{1 in 10|carts}} visits ended in a cart." },
        { tag: "Business", q: "Why now?", a: "Traffic kept growing, so every lost cart cost more." },
        { tag: "Business", q: "What does success look like?", a: "More carts from browsing and search." },
        { tag: "Shopper", q: "What stops shoppers?", a: "They can't compare products or trust the details." },
        { tag: "Shopper", q: "Where do they get stuck?", a: "Browsing: listing and product page." },
        { tag: "Scope", q: "What's not included?", a: "Checkout, payments and personalisation." }
      ],
      fromL: "The brief", from: "Make the pages look better",
      toL: "What it became", to: "Help shoppers choose with confidence",
      notes: "Business questions first, then shopper questions, then scope. Each answer came from talking to the PM, analytics or engineering. The shift at the bottom is the point: a facelift request became a problem about helping people choose."
    },

    /* 04 — UNDERSTANDING THE EXISTING EXPERIENCE */
    {
      section: "discover", type: "flowview",
      eyebrow: "The existing experience",
      headline: ["Shoppers dropped at every step"],
      sub: "Click a step to see the screen shoppers saw.",
      steps: [
        { k: "Home", stat: "100%", statL: "sessions", img: "enhance-problem-home.png", issues: [{ t: "Inconsistent icons, busy banners", tag: "Audit" }], pain: "Busy banners and mixed icon styles" },
        { k: "Browse / search", stat: "{{72%|funnel}}", est: true, statL: "kept going", img: "enhance-iter-search-before.png", issues: [{ t: "Irrelevant search results", tag: "Audit" }], pain: "Generic suggestions, wrong categories" },
        { k: "Listing", stat: "{{46%|funnel}}", est: true, statL: "opened a list", img: "enhance-problem-plp.png", issues: [{ t: "Every card looked alike", tag: "Audit" }], pain: "No rating, discount or variant on the card" },
        { k: "Product page", stat: "{{24%|funnel}}", est: true, statL: "opened a product", img: "enhance-problem-pdp.png", issues: [{ t: "Price, size, delivery buried", tag: "Audit" }], pain: "Key details below the fold" },
        { k: "Add to cart", stat: "{{10.4%|carts}}", statL: "added to cart", img: "enhance-addtocart-before.webp", issues: [{ t: "{{41.4%|search}} when searching", tag: "Measured" }], pain: "Added from a list of near-identical cards, with no rating or detail to compare" }
      ],
      foot: "{{23 heuristic issues|audit}} found. The product page was the weakest part of discovery.",
      notes: "Press → to walk the journey step by step; each step shows the real screen. 100% and 10.4% are from analytics; the middle steps are illustrative (est.). The audit found 23 issues; the product page was the weakest part of discovery."
    },

    /* 05 — RESEARCH & PROBLEM DISCOVERY */
    {
      section: "discover", type: "board", tall: true,
      eyebrow: "Research",
      headline: ["How we found the real problem"],
      sub: "A plan, then data, then shoppers.",
      cards: [
        { k: "Research strategy", tag: "Plan", img: "enhance-research-strategy.png", pos: "left center", stat: "4 steps",
          learned: "Benchmark, analyse the journey, map emotions, define the ideal." },
        { k: "Google Analytics", tag: "Validated", img: "enhance-ga-pre-conversion.png", fit: "contain", stat: "{{41%|search}} vs {{10%|carts}}",
          learned: "Searchers added to cart {{4× more|searchers}} than the average visit." },
        { k: "Journey map", tag: "Validated", img: "enhance-flow-pipeline.png", pos: "center top", stat: "End to end",
          learned: "Mapped every screen from Home to checkout to spot drop points." },
        { k: "Competitive benchmark", tag: "Benchmark", proof: "competitors", img: "enhance-pdp-competitor-benchmark.webp", pos: "left top", stat: "{{5 apps|competitors}}",
          learned: "Amazon, Flipkart, BigBasket, Grofers, Meesho put decision info up front." },
        { k: "Heuristic audit", tag: "Validated", img: "enhance-heuristic-table-zoom.png", pos: "left top", stat: "{{23 issues|audit}}",
          learned: "5 critical, led by scan, list and the product page." },
        { k: "User interviews", tag: "Validated", img: "enhance-design-team-04.png", stat: "{{8 shoppers|interviews}}", est: true,
          learned: "\u201cI can\u2019t tell which one to buy.\u201d" }
      ],
      notes: "A live product and limited time, so analytics first: searchers added to cart at 41.4% vs 10.4% overall, about 4x. The heuristic audit rated 23 problem areas; 5 were critical (S3 or worse). Interviews confirmed shoppers couldn't tell products apart. Six sources, in order: plan, analytics, journey map, competitors, audit, interviews. We planned the research first: benchmark competitors, analyse the current journey (heuristics, data, surveys), map emotions, then define the ideal journey. Interview count is illustrative (est.). Click any image to open it full size."
    },

    /* 06 — ANALYSIS & SYNTHESIS */
    {
      section: "discover", type: "oppmatrix",
      eyebrow: "Analysis & synthesis",
      headline: ["Where both sides win"],
      heads: ["User need", "Business goal", "Opportunity"],
      rows: [
        { need: "Know where to start", lever: "More visits reach a list", metric: "Clear category entry", tier: "High" },
        { need: "Compare quickly", lever: "More product clicks", metric: "Decision info on cards", tier: "High" },
        { need: "Trust the choice", lever: "More add-to-cart", metric: "Key details up front", tier: "High" },
        { need: "Find it by search", lever: "Protect the {{41%|search}} channel", metric: "Better search results", tier: "Medium" }
      ],
      prioritise: {
        img: "enhance-impact-effort-matrix.png",
        cap: "Pain points prioritised by impact and effort",
        points: ["Quick wins first: discount tags, category clarity", "Parked: 3D icons, gamified categories"]
      },
      notes: "We clustered pain points and plotted them on impact vs effort. The top three opportunities sat where user needs and business goals overlapped."
    },

    /* 08 — DEFINING THE PROBLEM */
    {
      section: "define", type: "synthesis",
      eyebrow: "Defining the problem",
      headline: ["Not a UI problem. A decision problem."],
      cols: ["What shoppers felt", "Why it happened", "How we know"],
      rows: [
        { theme: "Finding", symptom: "\u201cWhere do I start?\u201d", cause: "Inconsistent icons and categories",
          how: [["Audit", "Icons flagged in the {{23-issue audit|audit}}"], ["Measured", "Only {{1 in 10|carts}} visits reached the cart"]] },
        { theme: "Comparing", symptom: "\u201cWhich one do I pick?\u201d", cause: "Every card showed different info",
          how: [["Research", "{{Interviews|interviews}}: \u201cI can\u2019t tell which to buy\u201d"], ["Benchmark", "{{5 leading apps|competitors}} show price and rating on cards"]] },
        { theme: "Choosing", symptom: "\u201cCan I trust this?\u201d", cause: "Key details buried below the fold",
          how: [["Audit", "Product page rated critical (S3)"], ["Measured", "Searchers bought {{4× more|searchers}}, so intent was there"]] }
      ],
      from: "Refresh the UI",
      to: "Help shoppers decide with confidence",
      statement: "Shoppers didn't lack products. They lacked the information to choose one with confidence.",
      goals: [
        { k: "Add-to-cart", v: "{{10.4%|carts}} \u2192 12% target" },
        { k: "Search add-to-cart", v: "{{41%|search}} \u2192 45% target" },
        { k: "Time to decide", v: "{{\u221220%|decide}} est." }
      ],
      notes: "Read each row left to right: what shoppers felt, why it happened, and how we know. Every claim has a source: audit, analytics, interviews or benchmark. The key milestone. Show the shift from 'refresh the UI' to 'help shoppers decide'. Then the statement and the success metrics we set. Time-to-decide is illustrative (est.)."
    },

    /* 09 — IDEATION & COLLABORATION */
    {
      section: "design", type: "collab",
      eyebrow: "Ideation & collaboration",
      headline: ["Built with the team"],
      sub: "Four working sessions took us from ideas to a plan we could ship.",
      steps: [
        { img: "enhance-design-team-01.png", t: "Whiteboard workshop", who: "PM + engineers", out: "3 concepts for listing and product page" },
        { img: "enhance-design-team-02.png", t: "Design critique", who: "Wider design team", out: "One pattern for every screen" },
        { img: "enhance-design-team-03.png", t: "Screen review", who: "Engineering", out: "Gaps fixed before build" },
        { img: "enhance-user-journey-02.png", t: "MoSCoW", who: "PM + design + engineering", out: "Price, rating, discount shipped first", fit: "contain" }
      ],
      notes: "Every decision was made with the team. We explored three concepts at the whiteboard, critiqued them with the wider design team, reviewed screens with engineering to catch gaps early, and used MoSCoW to decide what shipped first: name, price, rating and discount were Musts."
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
      disclaimer: "Google Analytics, before launch vs after launch (report evaluated Aug 2023). Iteration and review counts are illustrative (est.).",
      notes: "Validation first: 9 of 12 completed the usability test; the wishlist icon needed work, so we iterated. Then results from the Aug 2023 report: add-to-cart +294 bps (+28%), search add-to-cart +880 bps (+21%), more time and pages, faster loads. The first read was smaller; gains grew as shoppers adapted. These are before/after, not an A/B test."
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
  ],
  /* parked slides (not shown): kept for later use */
  parked: [
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
    }
  ]
};
