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
    { id: "context", n: "01", label: "Requirement" },
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
    reviews: {
      method: "Design review rounds", tag: "Illustrative estimate", est: true,
      img: "enhance-design-team-03.png", crop: 0,
      observed: "Screen reviews with senior stakeholders, the Head of Design and Head of Product, before build.",
      takeaway: "Each round flagged gaps we fixed before launch. The count is an estimate."
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
      headline: ["Enhancing ", "Product Discovery", " on JioMart"],
      highlight: "Product Discovery",
      body: "Simplifying the journey from discovery to purchase, helping shoppers make confident decisions.",
      hero: "enhance-v1-pdp-fold.png?v=4",
      backShots: ["enhance-v1-home.png", "enhance-v1-plp.png?v=3"],
      badge: { n: "{{+28%|carts}}", l: "More visits end in a cart" },
      meta: [
        { l: "My role", v: "Design lead · research to handoff" },
        { l: "Timeline", v: "Jan – Mar 2023 · results Aug 2023" },
        { l: "Team", v: "PM · Engineering · Analytics" },
        { l: "After launch", v: "{{50%|search}} search → cart · {{29%|speed}} faster" }
      ],
      notes: "Open simply: shoppers could find products but struggled to choose, so I simplified the journey from discovery to purchase. Hover the phone for my V1 Home and listing. Numbers are underlined; click any to show its evidence. +28%: sessions with add-to-cart went from 10.41% to 13.35%. Half of searchers now add to cart (50.2%, up from 41.4%). Project ran Jan – Mar 2023; results are from the report evaluated in Aug 2023; the first read was smaller (+1.07 points), and the gains kept growing."
    },

    /* 02 — WHO WE DESIGNED FOR */
    {
      section: "context", type: "audience",
      eyebrow: "Requirement · Who we designed for",
      headline: ["Target shopper"],
      sub: "JioMart started with value-conscious households beyond the metros.",
      tiers: [
        { india: "India 1", k: "Rich", inc: "above ₹17L a year", pct: "1%", pop: "16M people", hh: "3M households" },
        { india: "India 1", k: "Middle class", inc: "₹3.4–17L a year", pct: "13%", pop: "160M people", hh: "31M households" },
        { india: "India 2", k: "Aspirers", inc: "₹1.5–3.4L a year", pct: "30%", pop: "359M people", hh: "71M households", focus: true },
        { india: "India 3", k: "Deprived", inc: "below ₹1.5L a year", pct: "56%", pop: "684M people", hh: "135M households", focus: true }
      ],
      source: "Share of households by annual income. Source: India Stack",
      stats: [
        { n: "86%", l: "of Indian households earn under ₹3.4L a year", src: "India Stack", key: true },
        { n: "50%+", l: "of JioMart orders from Tier 2 cities and beyond", src: "Reliance AGM, 2021" },
        { n: "~98%", l: "of JioMart shoppers on mobile", src: "JioMart live analytics, Jan 2023" },
        { n: "~25K", l: "shoppers at any moment, mostly browsing, not searching", src: "JioMart live analytics, Jan 2023" }
      ],
      foot: "Price-sensitive, mobile-only, browsing to decide: price, size and trust have to read at a glance.",
      notes: "Before the problem, who the shopper is. JioMart started with value-conscious households beyond the metros, the India 2 aspirers and India 3. 86% of Indian households earn under ₹3.4L a year, about ₹28K a month. Reliance said at its 2021 AGM that over half of JioMart orders came from Tier 2 and 3 cities. A live analytics snapshot from Jan 2023: about 25K shoppers on the app at any moment, about 98% on mobile, and far more of them on home and category pages than on search. So they browse to decide, on a phone, watching the price. Every later decision follows: price first, unit price and size on the card, trust signals up front."
    },

    /* 04 — UNDERSTANDING THE EXISTING EXPERIENCE */
    {
      section: "context", type: "flowview",
      eyebrow: "Requirement · The existing experience",
      headline: ["Low conversion"],
      sub: "{{~95M visitors|visitors}}, but only {{1 in 10 sessions|carts}} added to cart.",
      reframe: { asks: [["Business", "More carts"], ["Product", "Refresh 3 pages"], ["Shopper", "\u201cCan I trust this?\u201d"]], toL: "Became", to: "Help shoppers choose" },
      steps: [
        { k: "Home", stat: "100%", statL: "sessions", img: "enhance-problem-home.png", issues: [{ t: "Inconsistent icons, busy banners", tag: "Audit" }], pain: "Busy banners and mixed icon styles" },
        { k: "Browse / search", stat: "{{72%|funnel}}", est: true, statL: "kept going", img: "enhance-iter-search-before.png", issues: [{ t: "Irrelevant search results", tag: "Audit" }], pain: "Generic suggestions, wrong categories" },
        { k: "Listing", stat: "{{46%|funnel}}", est: true, statL: "opened a list", img: "enhance-problem-plp.png", issues: [{ t: "Every card looked alike", tag: "Audit" }], pain: "No rating, discount or variant on the card" },
        { k: "Product page", stat: "{{24%|funnel}}", est: true, statL: "opened a product", img: "enhance-problem-pdp.png", issues: [{ t: "Price, size, delivery buried", tag: "Audit" }], pain: "Key details below the fold" },
        { k: "Add to cart", stat: "{{10.4%|carts}}", statL: "added to cart", img: "enhance-addtocart-before.webp", issues: [{ t: "{{41.4%|search}} when searching", tag: "Measured" }], pain: "Added from a list of near-identical cards, with no rating or detail to compare" }
      ],
      foot: "Searchers added to cart {{4× more|searchers}}: browsing was the gap.",
      notes: "Context: ~95M visitors but only 1 in 10 sessions added to cart, while searchers did at 41% (4x), so browsing was the gap. Business wanted more carts, product asked for a refresh of 3 pages, and shoppers asked: can I trust this? The brief asked for a facelift, but asking why (why fix it, what stops shoppers, where they get stuck, what is out of scope) turned it into helping shoppers choose with confidence. Then press → to walk the journey step by step; each step shows the real screen. 100% and 10.4% are from analytics; the middle steps are illustrative (est.). The audit found 23 issues; the product page was the weakest part of discovery."
    },

    /* 05 — RESEARCH & PROBLEM DISCOVERY */
    {
      section: "discover", type: "board", tall: true,
      eyebrow: "Research",
      headline: ["Root cause"],
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

    /* 08 — DEFINING THE PROBLEM */
    {
      section: "define", type: "synthesis",
      eyebrow: "Defining the problem",
      headline: ["Decision problem"],
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
      headline: ["Team effort"],
      sub: "Four working sessions took us from ideas to a plan we could ship.",
      steps: [
        { img: "enhance-design-team-01.png", t: "Whiteboard workshop", who: "PM + Design + Engineering", out: "3 concepts for listing and product page" },
        { img: "enhance-design-team-02.png", t: "Design critique", who: "Wider design team", out: "One pattern for every screen" },
        { img: "enhance-design-team-03.png", t: "Screen review", who: "Senior stakeholders: HoD + HoP", out: "Gaps fixed before build" },
        { img: "enhance-impact-effort-matrix.png", t: "Impact vs effort", who: "PM + Design + Engineering", out: "Quick wins first: discount tags, category clarity", fit: "contain" }
      ],
      notes: "Every decision was made with the team. We explored three concepts at the whiteboard, critiqued them with the wider design team, reviewed screens with engineering to catch gaps early, and plotted every idea on impact vs effort: quick wins like discount tags and category clarity shipped first, while 3D icons and gamified categories were parked."
    },

    /* 10–12 — SOLUTION: each screen Before → After, with the design decisions behind it (Top · Mid · Bottom) */
    {
      section: "design", type: "versions",
      eyebrow: "The solution",
      headline: ["PDP Conversion"],
      labels: ["Before", "After"],
      when: ["Until Dec 2022", "Jan – Mar 2023"],
      stages: [
        { img: "enhance-problem-pdp.png", scroll: "enhance-problem-pdp-nobar.png", cta: "enhance-before-pdp-bar.png", ctaH: "37%", n: "Long page, key details buried" },
        { img: "enhance-v1-pdp-fold.png?v=4", scroll: "enhance-v1-pdp-full.png?v=4", cta: "enhance-v1-pdp-cta.png?v=2", n: "Rating, size and offers moved up" }
      ],
      decisions: {
        title: "Design decisions",
        zones: [
          { k: "Top", where: "Header", laws: ["Hick's law", "Miller's law"],
            t: "Fewer actions, less to remember",
            pts: ["Only back, search, voice and cart"],
            stat: ["8 → 4", "header actions"], pin: 9 },
          { k: "Mid", where: "Content", laws: ["Social proof", "Visual hierarchy"],
            t: "Build trust above the fold",
            pts: ["Brand, then name, then ratings", "Price, offer and size before the fold"],
            stat: ["S3", "critical in the {{audit|audit}}"], pin: 50 },
          { k: "Bottom", where: "Action bar", laws: ["Fitts's law"],
            t: "One next step, not five exits",
            pts: ["Nav bar drove bounce", "Sticky Add to cart in thumb reach"],
            stat: ["6 → 1", "exits → one CTA"], pin: 95 }
        ]
      },
      notes: "Product answers: can I trust it? Read the After screen top to bottom. Top: the header went from 8 actions to 4 (Hick's and Miller's law). Mid: brand before name, ratings under it, price, size and offers above the fold, which is where trust is built. Bottom: the nav bar gave five ways out on a page meant for one decision and drove bounce, so it became a sticky price + Add to cart bar."
    },

    {
      section: "design", type: "versions",
      eyebrow: "The solution",
      headline: ["PLP Engagement"],
      labels: ["Before", "After"],
      when: ["Until Dec 2022", "Jan – Mar 2023"],
      stages: [
        { img: "enhance-problem-plp.png", n: "Name and price only" },
        { img: "enhance-v1-plp.png?v=3", n: "Discount, unit price, size and wishlist on every card" }
      ],
      evidence: {
        method: "Old vs new listing",
        img: "enhance-plp-old-new-improvements.webp", crop: 0.05,
        observed: "The old and new listing pages side by side, with the seven key improvements.",
        takeaway: "Cleaner cards, wishlist on the list, sort and filter up top, deal timers and tags.",
        implication: "Every change answers a comparison question on the card itself."
      },
      decisions: {
        title: "Design decisions",
        zones: [
          { k: "Top", where: "Header", laws: ["Hick's law", "Miller's law"],
            t: "Fewer actions, less to remember",
            pts: ["Same 4-action header", "Sort and Filter up front"],
            stat: ["8 → 4", "header actions"], pin: 8 },
          { k: "Mid", where: "Narrow down", laws: ["Chunking", "Progressive disclosure"],
            t: "Narrow the list in small steps",
            pts: ["Sub-category tiles, then quick chips"], pin: 18 },
          { k: "Bottom", where: "Product cards", laws: ["Consistency", "Visual hierarchy"],
            t: "Put the decision on the card",
            pts: ["Price, % off, unit price and size", "One card everywhere, like {{5 leading apps|competitors}}"] , pin: 45 }
        ]
      },
      notes: "Listing answers: which one? Top: the same 4-action header, with Sort and Filter as clear buttons. Mid: sub-category tiles and chips let shoppers narrow in small steps. Bottom: the card carries the decision: price, MRP, % off, unit price, size and wishlist, the same in every category."
    },

    {
      section: "design", type: "pricecue",
      eyebrow: "The solution · Why the price is big",
      headline: ["Price first"],
      sub: "For a family on ₹12–28K a month, the price tag is the decision. So we borrowed the shelf’s hierarchy.",
      cards: [
        { src: "In store", t: "Shoppers read the price first", d: "Every shelf tag leads with what you pay. Name next, MRP smallest.",
          img: "offline-price-spices.webp", inset: "offline-price-tag.webp", fit: "cover", alt: "Spice aisle; close-up tag: ₹79.50 large, MRP ₹106 small" },
        { src: "On JioMart · PDP", t: "MRP anchors, it doesn't lead", d: "Big selling price, struck-through MRP: the saving reads at a glance.",
          img: "price-pdp-product.png", fit: "contain still", alt: "PDP from brand and product image down to ₹900.00 large, MRP ₹1084 struck through" },
        { src: "On JioMart · PLP", t: "Faster comparison on a list", d: "A column of bold prices: compare cards without reading every line.",
          img: "price-plp-cards.png", fit: "contain still", alt: "Two PLP cards with ₹77.00 in bold" }
      ],
      notes: "An interviewer asked why the rupee price is bigger than the product name. Answer with the shelf: in every Indian supermarket the tag leads with the price you pay, big and bold, and puts MRP small and struck through. Shoppers already decide this way. On the PLP a column of bold prices makes cards quick to compare; on the PDP the big price next to the struck MRP makes the saving obvious. We didn't invent a pattern, we reused one they trust."
    },

    {
      section: "design", type: "versions",
      eyebrow: "The solution",
      headline: ["Home Discovery"],
      labels: ["Before", "After"],
      when: ["Until Dec 2022", "Jan – Mar 2023"],
      stages: [
        { img: "enhance-problem-home.png", n: "Banners first, mixed icon styles" },
        { img: "enhance-v1-home.png", n: "Search, categories, one icon style" }
      ],
      decisions: {
        title: "Design decisions",
        zones: [
          { k: "Top", where: "Header", laws: ["Hick's law", "Miller's law"],
            t: "Search first, fewer actions",
            pts: ["Searchers added to cart {{4× more|searchers}}"],
            stat: ["7 → 4", "header actions"], pin: 7 },
          { k: "Mid", where: "Categories", laws: ["Law of similarity", "Minimalist design"],
            t: "One clear way in",
            pts: ["Categories under search, one icon style", "4 promo blocks → 1 carousel"], pin: 25 },
          { k: "Bottom", where: "Below the fold", laws: ["Recognition over recall"],
            t: "Pick up where you left off",
            pts: ["Recent items shown, not recalled"], pin: 62 }
        ]
      },
      notes: "Home answers: where do I start? Top: search leads, header down from 7 actions to 4, because searchers converted 4× better. Mid: categories right under search in one icon style, and one banner carousel instead of four promo blocks. Bottom: Continue Shopping For and consistent deal cards."
    },

    /* ACROSS THE APP — every page type, Old → New, per category (new screens: blank frames until the final Figma) */
    {
      section: "design", type: "screenwall",
      eyebrow: "Across the app · Product page",
      headline: ["PDP, every vertical"],
      sub: "One product-page system for groceries, gadgets, fashion and beauty. Scroll sideways.",
      labels: ["Old", "New"],
      pairs: [
        { k: "Grocery", tag: "S3 critical", tone: "neg", before: "enhance-problem-pdp.png", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Brand not highlighted; delivery date hidden behind a pincode; rating and CTA weak.",
          proof: "Rated S3 / E2 in the {{23-issue audit|audit}}; breaks heuristics #3, #4 and #5.",
          decided: "Brand above the name, rating under it, price, size and delivery above the fold." },
        { k: "Electronics", beforeNote: "[ADD OLD SCREEN · Electronics PDP]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "EMI didn't look tappable; compare chart had no buy CTA; lots of white space.",
          proof: "Same gaps on 4 of 4 audited verticals: brand, pincode wall, weak rating and CTA.",
          decided: "[ADD · what changed on the Electronics PDP]" },
        { k: "Mobiles", beforeNote: "[ADD OLD SCREEN · Mobile PDP]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Colour and storage variants missing; specs text-heavy, main purpose not up front.",
          proof: "Section-by-section comparison across Beauty, Electronics, Mobile and Fashion PDPs.",
          decided: "[ADD · what changed on the Mobile PDP]" },
        { k: "Fashion", beforeNote: "[ADD OLD SCREEN · Fashion PDP]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Brand came after the product name; offers didn't look tappable; one font weight everywhere.",
          proof: "Audit note on Fashion: \u201cbrand first, then the product name\u201d.",
          decided: "[ADD · what changed on the Fashion PDP]" },
        { k: "Beauty", beforeNote: "[ADD OLD SCREEN · Beauty PDP]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Offers missing; wishlist badly placed; seller info and return policy not shown.",
          proof: "Beauty PDP audit: gaps and pain points page.",
          decided: "[ADD · what changed on the Beauty PDP]" },
        { k: "Ratings & reviews", before: "enhance-ba-pdp-reviews-before.png", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "No review section; rating didn't read as intuitive.",
          proof: "Reviews and ratings came up in field research and the audit.",
          decided: "Rating summary, reviews with View all, likes and photo upload." }
      ],
      notes: "This is the range. Every vertical had the same four problems in the audit: brand not highlighted, delivery behind a pincode, weak rating, weak CTA. One product-page system fixed them for groceries, gadgets, fashion and beauty. Each card says what we saw, the proof, and what we decided. Click any old screen to enlarge it."
    },

    {
      section: "design", type: "screenwall",
      eyebrow: "Across the app · Listing page",
      headline: ["PLP, every vertical"],
      sub: "The same card everywhere, so shoppers compare instead of read.",
      labels: ["Old", "New"],
      pairs: [
        { k: "Grocery", tag: "S2", before: "enhance-problem-plp.png", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Name and price only; the + button silently stopped at max quantity.",
          proof: "Listing page rated S2 / E2 (#5 Error prevention) in the {{audit|audit}}.",
          decided: "Discount, unit price, size and wishlist on every card; feedback at max quantity." },
        { k: "Mobiles & electronics", before: "enhance-iter-mobile-before.png", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Every card showed different info; selected filters barely visible.",
          proof: "Filter & sort rated S2 in the audit; {{5 leading apps|competitors}} show price and rating on cards.",
          decided: "[ADD · what changed on the Electronics PLP]" },
        { k: "Fashion", beforeNote: "[ADD OLD SCREEN · Fashion PLP]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "[ADD · audit finding for Fashion listing]", proof: "[ADD · data or field evidence]", decided: "[ADD · what changed]" },
        { k: "Beauty", beforeNote: "[ADD OLD SCREEN · Beauty PLP]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "[ADD · audit finding for Beauty listing]", proof: "[ADD · data or field evidence]", decided: "[ADD · what changed]" },
        { k: "Wishlist test", tag: "9 of 12", tone: "pos", beforeNote: "[ADD OLD SCREEN · wishlist]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Shoppers needed to save products while comparing.",
          proof: "{{9 of 12|usability}} completed the save-to-wishlist task in the usability test.",
          decided: "Wishlist on the card, then iterated so the icon was easier to spot." }
      ],
      notes: "Listing pages are where comparison happens, so every vertical got the same card: price, MRP, % off, unit price, size, wishlist. The usability test backs it: 9 of 12 completed the wishlist task, and we iterated the icon after."
    },

    {
      section: "design", type: "screenwall",
      eyebrow: "Across the app · Home and search",
      headline: ["Home & search"],
      sub: "Where most shoppers start, and where searchers already convert best.",
      labels: ["Old", "New"],
      pairs: [
        { k: "Home", before: "enhance-problem-home.png", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Busy banners, random fonts and colours, 7+ carousel cards; category icons inconsistent.",
          proof: "Banners rated S2 and category icons S0 in the {{audit|audit}}.",
          decided: "Search first, categories right under it, one banner carousel." },
        { k: "Search", before: "enhance-iter-search-before.png", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Wrong categories in suggestions; monotonous, text-only results.",
          proof: "Searchers added to cart {{4\u00d7 more|searchers}} than the average session.",
          decided: "Search made the hero of Home; visual suggestions." },
        { k: "Categories", beforeNote: "[ADD OLD SCREEN · category tray]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Category hierarchy differed by entry point; fashion and medicine missing.",
          proof: "Menu & categories rated S2 in the audit.",
          decided: "[ADD · what changed in categories]" }
      ],
      notes: "Home is where most sessions start, but searchers convert about four times better, so search became the hero and categories sit right under it."
    },

    /* WHERE I HELD THE LINE — real stories only: fill every [ADD] before presenting */
    {
      section: "design", type: "pushback",
      eyebrow: "Design leadership · Under product pressure",
      headline: ["Where I pushed back"],
      sub: "Moments where product wanted one thing, and data moved the decision.",
      rows: [
        { k: "[ADD · moment 1, e.g. bottom nav on the PDP]", want: "[ADD · what product asked for]", proposed: "[ADD · what I proposed]", evidence: "[ADD · data I used: bounce, test, audit]", outcome: "[ADD · what shipped, or the compromise]" },
        { k: "[ADD · moment 2, e.g. header actions]", want: "[ADD · what product asked for]", proposed: "[ADD · what I proposed]", evidence: "[ADD · data I used]", outcome: "[ADD · what shipped, or the compromise]" },
        { k: "[ADD · moment 3, a compromise]", want: "[ADD · what product asked for]", proposed: "[ADD · what I proposed]", evidence: "[ADD · data I used]", outcome: "[ADD · the trade-off we agreed and why]" }
      ],
      foot: "Draft: replace every placeholder with a real moment before presenting.",
      notes: "Three moments where design held a position under product pressure: what product wanted, what I proposed, the data I used, and how it ended. Include at least one compromise. Fill these with real stories only."
    },

    {
      section: "results", type: "results",
      eyebrow: "Validation & impact",
      headline: ["Measured impact"],
      hero: [
        { k: "Sessions with add-to-cart", pre: 10.41, post: 13.35, pt: "10.41%", qt: "13.35%", d: "{{+28%|carts}}", sub: "+294 bps" },
        { k: "Search-assisted add-to-cart", pre: 41.40, post: 50.20, pt: "41.40%", qt: "50.20%", d: "{{+21%|search}}", sub: "+880 bps" },
        { k: "Time per active user", pre: 254, post: 315, pt: "4m 14s", qt: "5m 15s", d: "{{+24%|time}}", sub: "more browsing" },
        { k: "Page download time", pre: 0.17, post: 0.12, pt: "0.17s", qt: "0.12s", d: "{{−29%|speed}}", sub: "faster, lower is better" }
      ],
      checksTitle: "Validated before launch",
      checks: [
        { n: "{{9 / 12|usability}}", l: "completed the usability test" },
        { n: "{{3|iterations}}", l: "design iterations", est: true },
        { n: "{{6|reviews}}", l: "design review rounds", est: true }
      ],
      moreTitle: "Also improved",
      more: [
        { l: "Time per session", pt: "1m 46s", qt: "2m 13s", d: "{{+25.5%|time}}" },
        { l: "Page views per user", pt: "5.81", qt: "7.04", d: "{{+21.2%|pages}}" },
        { l: "Server response time", pt: "0.47s", qt: "0.37s", d: "{{−21.3%|speed}}" }
      ],
      disclaimer: "Google Analytics, before launch vs after launch (report evaluated Aug 2023). Iteration and review counts are illustrative (est.).",
      notes: "Validation first: 9 of 12 completed the usability test; the wishlist icon needed work, so we iterated. Then results from the Aug 2023 report: add-to-cart +294 bps (+28%), search add-to-cart +880 bps (+21%), more time and pages, faster loads. The first read was smaller; gains grew as shoppers adapted. These are before/after, not an A/B test."
    },

    /* 12 — KEY TAKEAWAYS */
    /* NOW — today's design lens and AI-led process (placeholders until confirmed) */
    {
      section: "results", type: "nowlens",
      eyebrow: "Today",
      headline: ["If I built it now"],
      today: {
        k: "If I designed this today", lead: "2023 constraints shaped the UI. Here's how I'd evolve it now.",
        items: [
          { t: "Visual system", d: "[ADD · tokens, type scale, colour and dark mode]" },
          { t: "Motion & feedback", d: "[ADD · micro-interactions for add to cart, wishlist, filters]" },
          { t: "Accessibility", d: "[ADD · contrast, tap targets, screen-reader labels]" },
          { t: "Personalisation", d: "[ADD · what the page would adapt to]" }
        ]
      },
      ai: {
        k: "How I work now · AI-led", lead: "Where AI sits in my process, step by step.",
        items: [
          { t: "Research synthesis", d: "[ADD · tool and how: e.g. clustering audit and interview notes]" },
          { t: "Exploration", d: "[ADD · tool and how: variants and flows]" },
          { t: "Prototyping", d: "[ADD · tool and how: coded or interactive prototypes]" },
          { t: "Build & ship", d: "[ADD · tool and how: e.g. this deck and portfolio built with AI agents]" }
        ]
      },
      notes: "Two things: how I'd evolve this UI today, and where AI sits in my process now. Only list what I actually use."
    },

    {
      section: "results", type: "close",
      eyebrow: "Key takeaways",
      headline: ["Remove doubt"],
      wins: [
        { n: "{{+28%|carts}}", l: "add-to-cart sessions" },
        { n: "{{+21%|search}}", l: "add-to-cart from search" }
      ],
      rows: [
        { k: "My role", d: "Reframed the brief, led research, designed end to end." },
        { k: "Learned", d: "Same gap everywhere? Fix the system, not the screen." },
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

    /* 11 — VALIDATION, ITERATION & IMPACT */,
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
