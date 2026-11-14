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
    { id: "intro", n: "01", label: "Intro" },
    { id: "redesign", n: "02", label: "Old \u2192 New" },
    { id: "context", n: "03", label: "Why redesign" },
    { id: "research", n: "04", label: "Research" },
    { id: "home", n: "05", label: "Home" },
    { id: "listing", n: "06", label: "Listing" },
    { id: "pdp", n: "07", label: "Product page" },
    { id: "impact", n: "08", label: "Impact" }
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
      section: "intro", type: "opening",
      eyebrow: "JioMart · Product discovery redesign",
      headline: ["Enhancing ", "Product Discovery", " on JioMart"],
      highlight: "Product Discovery",
      body: "Simplifying the journey from discovery to purchase, helping shoppers make confident decisions.",
      hero: "new/pdp-grocery-fold.webp",
      backShots: ["enhance-v1-home.png", "new/plp-grocery.webp"],
      badge: { n: "{{+28%|carts}}", l: "More visits end in a cart" },
      meta: [
        { l: "My role", v: "Design lead · research to handoff" },
        { l: "Timeline", v: "Jan – Mar 2023 · results Aug 2023" },
        { l: "Team", v: "PM · Engineering · Analytics" },
        { l: "After launch", v: "{{50%|search}} search → cart · {{29%|speed}} faster" }
      ],
      notes: "Open simply: shoppers could find products but struggled to choose, so I simplified the journey from discovery to purchase. Hover the phone for my V1 Home and listing. Numbers are underlined; click any to show its evidence. +28%: sessions with add-to-cart went from 10.41% to 13.35%. Half of searchers now add to cart (50.2%, up from 41.4%). Project ran Jan – Mar 2023; results are from the report evaluated in Aug 2023; the first read was smaller (+1.07 points), and the gains kept growing."
    },

    /* OLD DESIGNS — overview */
    {
      section: "redesign", type: "overview", old: true,
      title: "Old designs",
      sub: "Every screen a different pattern. Nothing to compare on.",
      screens: [
        { src: "enhance-problem-home.png", cap: "Home" },
        { src: "enhance-problem-plp.png", cap: "Listing · grocery" },
        { src: "enhance-ba-electronics-before.png", cap: "Listing · mobiles" },
        { src: "enhance-problem-pdp-nobar.png", cap: "Product page" },
        { src: "enhance-iter-reviews-before.png", cap: "Reviews" },
        { src: "enhance-addtocart-before.webp", cap: "Add to cart" },
        { src: "enhance-iter-search-before.png", cap: "Search" },
        { src: "enhance-cart-before.webp", cap: "Cart" }
      ],
      notes: "Let the grid speak: dense, inconsistent, nothing to compare on."
    },

    /* NEW DESIGNS — overview */
    {
      section: "redesign", type: "overview",
      title: "New designs",
      sub: "One pattern from Home to product page.",
      screens: [
        { src: "enhance-v1-home.png", cap: "Home" },
        { src: "new/plp-grocery.webp", sheet: "new/plp-grocery-variant.webp", cap: "Listing · grocery", hint: "Tap 500 g to pick a pack size" },
        { src: "new/plp-electronics.webp", cap: "Listing · mobiles" },
        { src: "new/plp-fashion.webp", cap: "Listing · fashion" },
        { src: "new/plp-beauty-grid.webp", cap: "Listing · beauty" },
        { src: "new/pdp-grocery-fold.webp", cap: "Product page" },
        { src: "new/pdp-reviews.webp", cap: "Reviews" },
        { src: "new/plp-filter.webp", cap: "Filter" },
        { src: "new/pdp-electronics.webp", cap: "Product page · electronics" }
      ],
      notes: "The reveal. The next three slides explain the decisions behind each screen."
    },

    /* USPs OF JIOMART */
    {
      section: "context", type: "usp",
      title: "One app. Many kinds of shopping.",
      cats: ["Grocery", "Mobiles", "Electronics", "Fashion", "Beauty", "Home & Living", "Furniture", "Medicine"],
      stores: true,
      shots: [["enhance-store-appstore.png","App Store listing"],["enhance-store-playstore-v2.png","Play Store listing"]],
      usps: [
        ["cart", "One cart"],
        ["tag", "MRP savings"],
        ["pin", "Tier 2+"],
        ["chat", "WhatsApp"],
        ["store", "Kirana"],
        ["phone", "Mobile-first"]
      ],
      src: "App Store · Play Store · Reliance AGM 2021",
      notes: "Groceries and TVs in the same app, one design for both. What JioMart already did well; the redesign had to make it visible at the moment of choice."
    },

    /* 02 — WHY REDESIGN */
    {
      section: "context", type: "why",
      tag: "#Product discovery",
      title: "JioMart 2.0",
      sub: "Find. Compare. Choose.",
      ask: "Why redesign?",
      reasons: [
        ["1 in 10", "visits reached cart"],
        ["4×", "search beat browse"],
        ["Look-alike", "listing cards"],
        ["Buried", "price, size, trust"],
        ["23", "usability issues"]
      ],
      src: "Google Analytics · heuristic audit",
      notes: "1 in 10 sessions added to cart (10.41%, GA). Searchers converted 41.4% vs 10.4%. Cards had no rating, size or unit price. Product page rated S3 critical. 23 audit issues, 5 critical."
    },

    /* 02 — WHO WE DESIGNED FOR */
    {
      section: "context", type: "audience",
      eyebrow: "Requirement · Who we designed for",
      headline: ["Built for shoppers beyond the metros"],
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
      headline: ["1 in 10 visits ended in a cart"],
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

    /* FIELD — glimpses from research */
    {
      section: "research", type: "field",
      title: "Glimpses from the field",
      photos: [
        { src: "enhance-user-interview.png", cap: "\u201cI can\u2019t tell which one to buy.\u201d", pos: "center 40%" },
        { src: "offline-price-spices.webp", cap: "Price leads" },
        { src: "offline-price-shelf.webp", cap: "Pack sizes, side by side" },
        { src: "offline-price-tag.webp", cap: "Price \u203a name \u203a MRP" }
      ],
      notes: "Real photos from interviews and store visits. This is where the price-first and pack-size decisions came from."
    },

    /* 05 — RESEARCH & PROBLEM DISCOVERY */
    {
      section: "research", type: "board", tall: true,
      eyebrow: "Research",
      headline: ["Where shoppers got stuck"],
      cards: [
        { k: "Google Analytics", tag: "Validated", img: "enhance-ga-pre-conversion.png", fit: "contain", stat: "{{41%|search}} vs {{10%|carts}}" },
        { k: "Competitive benchmark", tag: "Benchmark", proof: "competitors", img: "enhance-pdp-competitor-benchmark.webp", pos: "left top", stat: "{{5 apps|competitors}}" },
        { k: "Heuristic audit", tag: "Validated", img: "enhance-heuristic-table-zoom.png", pos: "left top", stat: "{{23 issues|audit}}" },
        { k: "User interviews", tag: "Validated", img: "enhance-design-team-04.png", stat: "{{8 shoppers|interviews}}", est: true }
      ],
      notes: "A live product and limited time, so analytics first: searchers added to cart at 41.4% vs 10.4% overall, about 4x. The heuristic audit rated 23 problem areas; 5 were critical (S3 or worse). Interviews confirmed shoppers couldn't tell products apart. Six sources, in order: plan, analytics, journey map, competitors, audit, interviews. We planned the research first: benchmark competitors, analyse the current journey (heuristics, data, surveys), map emotions, then define the ideal journey. Interview count is illustrative (est.). Click any image to open it full size."
    },

    /* HEURISTIC EVALUATION — ranked */
    {
      section: "research", type: "chain",
      title: "23 issues, ranked before anything was drawn",
      sub: "A heuristic evaluation of the live app against Nielsen's 10 heuristics, done with the Central UI/UX research team.",
      steps: [
        { k: "Method", chips: ["10 heuristics", "Severity S0\u2013S4", "Ease to fix E0\u2013E3", "23 problem areas"], t: "Every issue was scored on how much it hurts and how hard it is to fix." },
        { k: "Ranked", img: "research/he-table.webp", pos: "top center", t: "Eight areas scored S3 or worse, the product page among them." },
        { k: "Product page \u00b7 S3", img: "research/he-pdp.webp", pos: "top center", t: "Brand hidden, EMI not tappable, delivery date needed a pincode, rating greyed out." },
        { k: "Listing \u00b7 S2", img: "research/he-plp.webp", fit: "contain", pos: "center", t: "At the max quantity the + button silently stopped working. No message." }
      ],
      src: "Heuristic evaluation, Central UI/UX research team.",
      notes: "This is where priorities came from. Severity times ease told us what to fix first."
    },

    /* 08 — DEFINING THE PROBLEM */
    {
      section: "research", type: "synthesis",
      eyebrow: "Defining the problem",
      headline: ["They could find products, not choose one"],
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

    /* EVIDENCE TO DECISION */
    {
      section: "research", type: "evidence",
      title: "Every decision traced back to something we saw",
      stats: [["20", "interviews"], ["8", "benchmarks"], ["2", "usability tests (12 + 8 users)"], ["23", "audit issues"]],
      items: [
        { m: "Analytics", img: "enhance-ga-pre-conversion.png", fit: "contain", saw: "Searchers added to cart 4\u00d7 more than browsers (41% vs 10%).", dec: "Search first on Home." },
        { m: "Shopper interviews", img: "enhance-user-interview.png", pos: "center 35%", saw: "\u201cI can\u2019t tell which one to buy.\u201d", dec: "Size, price and rating on every card." },
        { m: "Store observation", img: "offline-price-tag.webp", saw: "Every shelf tag leads with the price, MRP smallest.", dec: "Price is the biggest text." },
        { m: "Heuristic audit", img: "enhance-heuristic-table.png", pos: "top left", saw: "23 issues, 5 critical. The product page was the worst.", dec: "Key details above the fold." },
        { m: "Home audit", img: "research/fold-map.webp", pos: "top left", saw: "6 folds, banners back to back, 27 banner issues.", dec: "One system for every promo." },
        { m: "Benchmark", img: "research/benchmark.webp", pos: "left center", saw: "Leaders keep text left, image right, one clear CTA.", dec: "One card pattern across categories." }
      ],
      notes: "Method, what we saw, what we decided. This is the logic the rest of the deck follows."
    },

    /* 09 — IDEATION & COLLABORATION */
    {
      section: "research", type: "collab",
      eyebrow: "Ideation & collaboration",
      headline: ["From whiteboard to build plan"],
      steps: [
        { img: "enhance-design-team-01.png", t: "Whiteboard workshop", who: "PM + Design + Engineering", out: "3 concepts for listing and product page" },
        { img: "enhance-design-team-02.png", t: "Design critique", who: "Wider design team", out: "One pattern for every screen" },
        { img: "enhance-design-team-03.png", t: "Screen review", who: "Senior stakeholders: HoD + HoP", out: "Gaps fixed before build" },
        { img: "enhance-impact-effort-matrix.png", t: "Impact vs effort", who: "PM + Design + Engineering", out: "Quick wins first: discount tags, category clarity", fit: "contain" }
      ],
      notes: "Every decision was made with the team. We explored three concepts at the whiteboard, critiqued them with the wider design team, reviewed screens with engineering to catch gaps early, and plotted every idea on impact vs effort: quick wins like discount tags and category clarity shipped first, while 3D icons and gamified categories were parked."
    },

    /* HOME BANNER AUDIT */
    {
      section: "home", type: "audit",
      title: "Home was a wall of banners",
      sub: "We audited every banner on the Home page before redesigning it.",
      findings: [
        ["No pattern.", "Image, text and offer sat somewhere new on every banner."],
        ["Weak CTAs.", "Small, low-contrast buttons in a different shape each time."],
        ["Hard to read.", "A new background colour per category, text lost on top."],
        ["Logos anywhere.", "Brand logos and symbols overlapped the product."],
        ["Endless scroll.", "Banners stacked one after another in 4 different sizes."]
      ],
      src: "Home banner audit with the Central UI/UX team: 27 issues across text, image, CTA, logo, background and space.",
      screens: ["research/as-is-0.webp","research/as-is-1.webp","research/as-is-2.webp","research/as-is-3.webp","research/as-is-4.webp","research/as-is-5.webp","research/as-is-6.webp","research/as-is-7.webp","research/as-is-8.webp","research/as-is-9.webp"],
      notes: "This is why Home moved to search first and one card style: the banners were competing with each other, not helping shoppers start."
    },

    /* REDESIGN STRATEGY */
    {
      section: "home", type: "strategy",
      title: "Redesign strategy: fix the system, not each screen",
      goals: ["User-centric", "Standard sizes", "Shorter scroll", "Guidelines for consistency"],
      steps: [
        { k: "Map the page", t: "Home ran 6 folds, with banners back to back.", img: "research/fold-map.webp" },
        { k: "Name the parts", t: "Every promo is the same 6 parts, in a fixed order.", chips: ["Title", "Offer", "Image", "Logo", "CTA", "Validity"] },
        { k: "Benchmark", t: "Leaders use light backgrounds, text left, image right, one clear CTA.", img: "research/benchmark.webp" },
        { k: "Fix the sizes", t: "4 ratios on one 344px grid, 8px corners.", sizes: [["Strip", "344/56", "344\u00d756"], ["Slim", "4/1", "4:1"], ["Landscape", "2/1", "2:1"], ["Square", "1/1", "1:1"]] }
      ],
      src: "Five-stage process with the Central UI/UX team: audit, elements, scenarios, benchmark, templates.",
      notes: "The point is the system: once the parts and sizes were fixed, any team could make a promo that fits."
    },

    /* SYSTEM APPLIED */
    {
      section: "home", type: "applied",
      title: "Same content, one system",
      sub: "Templates from the system, applied to real promos.",
      pairs: [
        { b: "research/land-before.webp", a: "research/land-after.webp", cap: "Category offer" },
        { b: "research/offer-before.webp", a: "research/offer-after.webp", cap: "Weekly deal" },
        { b: "research/bank-before.webp", a: "research/bank-after.webp", cap: "Bank offers become a card set" }
      ],
      notes: "Same words, same offer. Only the system changed: one layout, readable contrast, one CTA."
    },

    {
      section: "home", type: "versions",
      eyebrow: "The solution",
      headline: ["Home: search first, then categories"],
      views: [
        { v: "old", label: "Before", img: "enhance-problem-home.png", n: "Banners first, mixed icon styles" },
        { v: "new", label: "After", img: "enhance-v1-home.png", n: "Search, categories, one icon style" },
        { v: "cat", label: "Categories", img: "new/cat-grocery.webp", n: "One category tray, the same from every entry point" }
      ],
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
            pts: ["Categories under search, one icon style"], pin: 25 },
          { k: "Bottom", where: "Below the fold", laws: ["Recognition over recall"],
            t: "Pick up where you left off",
            pts: ["Recent items shown, not recalled"], pin: 62 }
        ]
      },
      notes: "Home answers: where do I start? Top: search leads, header down from 7 actions to 4, because searchers converted 4× better. Mid: categories right under search in one icon style, and one banner carousel instead of four promo blocks. Bottom: Continue Shopping For and consistent deal cards."
    },

    /* PRODUCT CARD — prioritise, explore, ship */
    {
      section: "listing", type: "chain",
      title: "One card doesn't fit every category",
      sub: "The listing card, from audit to shipped: decide what earns a place on it, then test layouts across categories.",
      steps: [
        { k: "Saw", img: "research/card-old.webp", pos: "top center", t: "Six categories, six cards. Desktop and mobile differed, brand came before name, no rating." },
        { k: "Prioritised \u00b7 MoSCoW", moscow: [["Must", "Image, name, price, discount, rating"], ["Should", "Brand, variant or size, booster, source, wishlist"], ["Could", "Delivery date, coupons, share"]], t: "Must-haves are the minimum usable set. The rest earn their place by category." },
        { k: "Explored", opts: [{ img: "research/card-opt1.webp", cap: "Option 1 \u00b7 shipped", win: true }, { img: "research/card-opt3.webp", cap: "Option 3" }, { img: "research/card-opt4.webp", cap: "Option 4" }], t: "Wishlist and discount placement tried on beauty, grocery, fashion, furniture and mobiles." },
        { k: "Shipped", img: "new/plp-grocery.webp", pos: "center 40%", t: "Option 1, then by category: pack size for grocery, specs for mobiles, swatches for fashion and beauty." }
      ],
      src: "Product card research, Central UI/UX team.",
      notes: "Real alternatives, real prioritisation. Option 1 kept the discount right next to the price."
    },

    {
      section: "listing", type: "pricecue",
      eyebrow: "The solution · Why the price is big",
      headline: ["Why the price is the biggest text"],
      sub: "For a family on ₹12–28K a month, price decides. We copied the shelf tag.",
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
      section: "listing", type: "versions",
      eyebrow: "The solution",
      headline: ["Listing: the decision on the card"],
      views: [
        { v: "old", label: "Before", img: "enhance-problem-plp.png", n: "Name and price only" },
        { v: "new", label: "Grocery", img: "new/plp-grocery.webp", h: 800, n: "Discount, size and wishlist on every card",
          hot: [ { x: 236, y: 140, w: 66, h: 30, open: "new/plp-filter.webp", label: "Filter" }, { x: 305, y: 140, w: 32, h: 30, open: "new/plp-sort.webp", label: "Sort" }, { x: 142, y: 370, w: 58, h: 28, open: "new/plp-grocery-variant.webp", label: "Pack size" } ] },
        { v: "mob", label: "Mobiles", img: "new/plp-electronics.webp", h: 978, n: "Applied filters stay visible as chips; specs on every card",
          hot: [ { x: 236, y: 142, w: 66, h: 30, open: "new/plp-filter.webp", label: "Filter" }, { x: 305, y: 142, w: 32, h: 30, open: "new/plp-sort.webp", label: "Sort" } ] },
        { v: "fash", label: "Fashion", img: "new/plp-fashion.webp", h: 1024, n: "Size, fit and brand filters up top; colour dots on the card" },
        { v: "beauty", label: "Beauty", img: "new/plp-beauty-grid.webp", h: 1067, n: "Shade swatches on every card" }
      ],
      labels: ["Before", "After"],
      when: ["Until Dec 2022", "Jan – Mar 2023"],
      stages: [
        { img: "enhance-problem-plp.png", n: "Name and price only" },
        { img: "new/plp-grocery.webp", scroll: "new/plp-grocery.webp", n: "Discount, size and wishlist on every card; filter and sort up top" }
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
            pts: ["Same 4-action header"],
            stat: ["8 → 4", "header actions"], pin: 8 },
          { k: "Mid", where: "Narrow down", laws: ["Chunking", "Progressive disclosure"],
            t: "Narrow the list in small steps",
            pts: ["Sub-category tiles, then quick chips"], pin: 30 },
          { k: "Bottom", where: "Product cards", laws: ["Consistency", "Visual hierarchy"],
            t: "Put the decision on the card",
            pts: ["Price, % off, unit price and size"] , pin: 45 }
        ]
      },
      notes: "Listing answers: which one? Top: the same 4-action header, with Sort and Filter as clear buttons. Mid: sub-category tiles and chips let shoppers narrow in small steps. Bottom: the card carries the decision: price, MRP, % off, unit price, size and wishlist, the same in every category."
    },

    /* ELECTRONICS PDP — the ask, the benchmark, the answer */
    {
      section: "pdp", type: "chain",
      title: "Product asked for proof, so we benchmarked",
      sub: "The brief: make warranty, installation and replacement visible on electronics product pages, and justify where they go.",
      steps: [
        { k: "The ask", quote: "We need to have a justification for why placing it above or below something is likely to result in greater conversions.", by: "Product manager's brief", t: "A placement question, framed around conversion." },
        { k: "Saw", img: "research/pdp-ask-asis.webp", pos: "top left", t: "No warranty or replacement callout. Return policy sat near the bottom; compare opened its own flow." },
        { k: "Benchmarked", chips: ["Flipkart", "Amazon", "Tata CLiQ", "By Jio / Reliance", "By the seller", "By both"], t: "Listed every value-add competitors show, and who offers it." },
        { k: "Shipped", img: "research/pdp-valueprops.webp", pos: "center 100%", t: "One icon row under offers, above delivery: warranty, ResQ, cash on delivery, 7-day return." }
      ],
      src: "Electronics PDP research, Central UI/UX team.",
      notes: "The PM wanted a conversion argument. The answer was evidence from three competitors and a clear split of who offers what."
    },

    /* 10–12 — SOLUTION: each screen Before → After, with the design decisions behind it (Top · Mid · Bottom) */
    {
      section: "pdp", type: "versions",
      eyebrow: "The solution",
      headline: ["Product page: trust before the fold"],
      views: [
        { v: "old", label: "Before", img: "enhance-problem-pdp-nobar.png", cta: "enhance-before-pdp-bar.png", n: "Long page, key details buried" },
        { v: "new", label: "Grocery", img: "new/pdp-grocery.webp", h: 4098, cta: "enhance-v1-pdp-cta.png?v=2", n: "Brand, rating, price and every pack size up front" },
        { v: "elec", label: "Electronics", img: "new/pdp-electronics.webp", h: 4098, n: "EMI and full specs open in a sheet, so the page stays short",
          hot: [ { x: 252, y: 656, w: 84, h: 30, open: "new/pdp-emi.webp", label: "EMI" }, { x: 24, y: 1941, w: 126, h: 34, open: "new/pdp-details.webp", label: "Details" } ] },
        { v: "fash", label: "Fashion", img: "new/pdp-fashion.webp", h: 4098, n: "Brand first, then the name; colour and size before the fold" },
        { v: "beauty", label: "Beauty", img: "new/pdp-beauty.webp", h: 4098, n: "Shades as swatches, offers grouped, reviews with photos" }
      ],
      labels: ["Before", "After"],
      when: ["Until Dec 2022", "Jan – Mar 2023"],
      stages: [
        { img: "enhance-problem-pdp.png", scroll: "enhance-problem-pdp-nobar.png", cta: "enhance-before-pdp-bar.png", ctaH: "37%", n: "Long page, key details buried" },
        { img: "new/pdp-grocery-fold.webp", scroll: "new/pdp-grocery.webp", cta: "enhance-v1-pdp-cta.png?v=2", n: "Brand, rating, price and every pack size up front" }
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
            pts: ["Brand, then name, then ratings"],
            stat: ["S3", "critical in the {{audit|audit}}"], pin: 50 },
          { k: "Bottom", where: "Action bar", laws: ["Fitts's law"],
            t: "One next step, not five exits",
            pts: ["Nav bar drove bounce"],
            stat: ["6 → 1", "exits → one CTA"], pin: 95 }
        ]
      },
      notes: "Product answers: can I trust it? Read the After screen top to bottom. Top: the header went from 8 actions to 4 (Hick's and Miller's law). Mid: brand before name, ratings under it, price, size and offers above the fold, which is where trust is built. Bottom: the nav bar gave five ways out on a page meant for one decision and drove bounce, so it became a sticky price + Add to cart bar."
    },

    /* KEY PERFORMANCE METRICS */
    {
      section: "impact", type: "kpm",
      title: "Key performance metrics",
      sub: "Before vs after launch. Both targets beaten.",
      when: "Jan – Aug 2023",
      items: [
        ["+28%", "Sessions with add-to-cart", "10.41% vs 13.35% \u00b7 target was 12%"],
        ["+21%", "Search add-to-cart", "41.4% vs 50.2% \u00b7 target was 45%"],
        ["+24%", "Time per active user", "4m 14s vs 5m 15s"],
        ["+25%", "Time per session", "1m 46s vs 2m 13s"],
        ["+21%", "Page views per user", "5.81 vs 7.04"],
        ["\u221229%", "Page download time", "0.17s vs 0.12s"]
      ],
      src: "Google Analytics, report evaluated Aug 2023.",
      notes: "Lead with +28%: one in ten visits ending in a cart became more than one in eight."
    },


    /* 12 — KEY TAKEAWAYS */

    {
      section: "impact", type: "close",
      eyebrow: "Key takeaways",
      headline: ["What I took away"],
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
    /* ACROSS THE APP — every page type, Old → New, per category (new screens: blank frames until the final Figma) */
    {
      section: "results", type: "results",
      eyebrow: "Validation & impact",
      headline: ["Add-to-cart rose from 10.4% to 13.35%"],
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
        { k: "Categories", beforeNote: "[ADD OLD SCREEN · category tray]", after: "new/cat-grocery.webp",
          saw: "Category hierarchy differed by entry point; fashion and medicine missing.",
          proof: "Menu & categories rated S2 in the audit.",
          decided: "[ADD · what changed in categories]" }
      ],
      notes: "Home is where most sessions start, but searchers convert about four times better, so search became the hero and categories sit right under it."
    },

    /* TAP THROUGH IT — four live phones: tap the pulsing spots to open the real sheets */
    {
      section: "design", type: "proto",
      eyebrow: "Across the app · Try it",
      headline: ["Tap through it"],
      sub: "Four screens from the final design. Tap a pulsing ring to open the real sheet, scroll inside any phone, flip to Old to compare.",
      phones: [
        { k: "Grocery listing", img: "new/plp-grocery.webp", h: 800, old: "enhance-problem-plp.png",
          hot: [
            { x: 236, y: 140, w: 66, h: 30, open: "new/plp-filter.webp", label: "Filter" },
            { x: 305, y: 140, w: 32, h: 30, open: "new/plp-sort.webp", label: "Sort" },
            { x: 142, y: 370, w: 58, h: 28, open: "new/plp-grocery-variant.webp", label: "Pack size" }
          ],
          why: "Pick a pack size, filter or sort without leaving the list.", proof: "Listing rated S2 in the {{audit|audit}}: name and price only on the old card." },
        { k: "Mobiles listing", img: "new/plp-electronics.webp", h: 978, old: "enhance-iter-mobile-before.png",
          hot: [
            { x: 236, y: 142, w: 66, h: 30, open: "new/plp-filter.webp", label: "Filter" },
            { x: 305, y: 142, w: 32, h: 30, open: "new/plp-sort.webp", label: "Sort" }
          ],
          why: "Applied filters stay visible as chips; specs and rating on every card.", proof: "Filter & sort rated S2; {{5 leading apps|competitors}} show price and rating on the card." },
        { k: "Grocery product", img: "new/pdp-grocery.webp", h: 4098, old: "enhance-problem-pdp.png",
          hot: [],
          why: "Brand, rating, price and every pack size before the fold.", proof: "PDP rated S3 critical in the {{audit|audit}}; brand hidden on 4 of 4 verticals." },
        { k: "Electronics product", img: "new/pdp-electronics.webp", h: 4098,
          hot: [
            { x: 252, y: 656, w: 84, h: 30, open: "new/pdp-emi.webp", label: "EMI plans" },
            { x: 24, y: 1941, w: 126, h: 34, open: "new/pdp-details.webp", label: "Details" }
          ],
          why: "EMI and full specs open in a sheet, so the page stays short.", proof: "EMI didn't look tappable on 3 of 4 audited verticals." }
      ],
      notes: "Let the panel try it. Tap Filter, Sort or the pack size on the grocery list; tap View plans or View details on the phone page. Flip any phone to Old to see what it replaced. Every sheet is the real design, not a mock-up."
    },

    {
      section: "design", type: "screenwall",
      eyebrow: "Across the app · Product page",
      headline: ["PDP, every vertical"],
      sub: "One product-page system for groceries, gadgets, fashion and beauty. Scroll sideways, and scroll inside any phone.",
      labels: ["Old", "New"],
      pairs: [
        { k: "Grocery", tag: "S3 critical", tone: "neg", before: "enhance-problem-pdp.png", after: "new/pdp-grocery.webp",
          saw: "Brand not highlighted; delivery date hidden behind a pincode; rating and CTA weak.",
          proof: "Rated S3 / E2 in the {{23-issue audit|audit}}; breaks heuristics #3, #4 and #5.",
          decided: "Brand above the name, rating under it, price, size and delivery above the fold." },
        { k: "Electronics", beforeNote: "[ADD OLD SCREEN · Electronics PDP]", after: "new/pdp-electronics.webp",
          saw: "EMI didn't look tappable; compare chart had no buy CTA; lots of white space.",
          proof: "Same gaps on 4 of 4 audited verticals: brand, pincode wall, weak rating and CTA.",
          decided: "[ADD · what changed on the Electronics PDP]" },
        { k: "Mobiles", beforeNote: "[ADD OLD SCREEN · Mobile PDP]", after: "new/pdp-mobile.webp",
          saw: "Colour and storage variants missing; specs text-heavy, main purpose not up front.",
          proof: "Section-by-section comparison across Beauty, Electronics, Mobile and Fashion PDPs.",
          decided: "[ADD · what changed on the Mobile PDP]" },
        { k: "Fashion", beforeNote: "[ADD OLD SCREEN · Fashion PDP]", after: "new/pdp-fashion.webp",
          saw: "Brand came after the product name; offers didn't look tappable; one font weight everywhere.",
          proof: "Audit note on Fashion: \u201cbrand first, then the product name\u201d.",
          decided: "[ADD · what changed on the Fashion PDP]" },
        { k: "Beauty", beforeNote: "[ADD OLD SCREEN · Beauty PDP]", after: "new/pdp-beauty.webp",
          saw: "Offers missing; wishlist badly placed; seller info and return policy not shown.",
          proof: "Beauty PDP audit: gaps and pain points page.",
          decided: "[ADD · what changed on the Beauty PDP]" },
        { k: "Grocery · pack sizes", beforeNote: "[ADD OLD SCREEN · grocery sizes]", after: "new/pdp-grocery-b.webp",
          saw: "Size options weren't visible on the first screen.", proof: "Variants missing or incomplete across verticals in the PDP comparison.",
          decided: "Every pack size with its price, unit price and % off, right under the product." },
        { k: "Product details", beforeNote: "[ADD OLD SCREEN · description]", after: "new/pdp-details.webp",
          saw: "Description and specs didn't highlight the main purpose; text-heavy.", proof: "Flagged on 4 of 4 audited verticals.",
          decided: "Description, Specifications and More info in tabs, led by key features." },
        { k: "EMI options", beforeNote: "[ADD OLD SCREEN · EMI]", after: "new/pdp-emi.webp",
          saw: "EMI didn't look tappable.", proof: "Flagged on Electronics, Mobile and Fashion PDPs in the audit.",
          decided: "No cost, Low cost and Standard EMI in tabs, with a monthly table per bank." },
        { k: "Ratings & reviews", before: "enhance-ba-pdp-reviews-before.png", after: "new/pdp-reviews.webp",
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
      sub: "The same card everywhere, so shoppers compare instead of read. Scroll inside any phone.",
      labels: ["Old", "New"],
      pairs: [
        { k: "Grocery", tag: "S2", before: "enhance-problem-plp.png", after: "new/plp-grocery.webp",
          saw: "Name and price only; the + button silently stopped at max quantity.",
          proof: "Listing page rated S2 / E2 (#5 Error prevention) in the {{audit|audit}}.",
          decided: "Discount, unit price, size and wishlist on every card; feedback at max quantity." },
        { k: "Mobiles & electronics", before: "enhance-iter-mobile-before.png", after: "new/plp-electronics.webp",
          saw: "Every card showed different info; selected filters barely visible.",
          proof: "Filter & sort rated S2 in the audit; {{5 leading apps|competitors}} show price and rating on cards.",
          decided: "[ADD · what changed on the Electronics PLP]" },
        { k: "Fashion", beforeNote: "[ADD OLD SCREEN · Fashion PLP]", after: "new/plp-fashion.webp",
          saw: "[ADD · audit finding for Fashion listing]", proof: "[ADD · data or field evidence]", decided: "[ADD · what changed]" },
        { k: "Beauty", beforeNote: "[ADD OLD SCREEN · Beauty PLP]", after: "new/plp-beauty-grid.webp",
          saw: "[ADD · audit finding for Beauty listing]", proof: "[ADD · data or field evidence]", decided: "[ADD · what changed]" },
        { k: "Beauty · list view", beforeNote: "[ADD OLD SCREEN · Beauty list]", after: "new/plp-beauty-list.webp",
          saw: "[ADD · audit finding]", proof: "[ADD · data or field evidence]", decided: "A list view next to the grid, with shade swatches on every card." },
        { k: "Select pack size", beforeNote: "[ADD OLD SCREEN · variant picker]", after: "new/plp-grocery-variant.webp",
          saw: "[ADD · audit finding on variants]", proof: "[ADD · data or field evidence]", decided: "Pick a pack size from the list in a sheet, with price per size, without opening the product." },
        { k: "Sort & filter", beforeNote: "[ADD OLD SCREEN · filters]", after: "new/plp-filter.webp",
          saw: "Selected filters barely visible.", proof: "Filter & sort rated S2 in the {{audit|audit}}.", decided: "[ADD · what changed in sort and filter]" },
        { k: "Sort", beforeNote: "[ADD OLD SCREEN · sort]", after: "new/plp-sort.webp",
          saw: "Selected filters barely visible.", proof: "Filter & sort rated S2 in the {{audit|audit}}.", decided: "[ADD · what changed in sort]" },
        { k: "Wishlist test", tag: "9 of 12", tone: "pos", beforeNote: "[ADD OLD SCREEN · wishlist]", afterNote: "[ADD NEW SCREEN · final Figma]",
          saw: "Shoppers needed to save products while comparing.",
          proof: "{{9 of 12|usability}} completed the save-to-wishlist task in the usability test.",
          decided: "Wishlist on the card, then iterated so the icon was easier to spot." }
      ],
      notes: "Listing pages are where comparison happens, so every vertical got the same card: price, MRP, % off, unit price, size, wishlist. The usability test backs it: 9 of 12 completed the wishlist task, and we iterated the icon after."
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
