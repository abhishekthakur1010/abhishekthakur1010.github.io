/* ============================================================
   JioMart Discovery — interview deck (12 slides)
   Story: Transformation → Brief → Struggles → Investigation →
          Real problem → Opportunities → Benchmarks & ideas →
          Decisions → Final experience → Validation → Impact → Reflection
   Content only. Rendering in jiomart-deck.js.
   Evidence rules:
   · Numbers come only from project artifacts (GA pre/post table,
     usability test, heuristic audit, MoSCoW, impact/effort matrix).
   · Every claim carries a source tag: Measured · Audit · Test ·
     Review · Benchmark · Hypothesis.
   · "After" screens are the DS 2.0 project screens (V1), not today's app.
   · `notes` = presenter talk-track (press N). TODO = confirm before interview.
   ============================================================ */
window.DECK = {
  imgBase: "./images/enhanceProduct/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "problem", n: "02", label: "Problem" },
    { id: "opportunity", n: "03", label: "Opportunity" },
    { id: "design", n: "04", label: "Design" },
    { id: "results", n: "05", label: "Validation & impact" },
    { id: "learnings", n: "06", label: "Reflection" }
  ],
  slides: [
    /* ============ 01 — THE TRANSFORMATION ============ */
    {
      section: "context", type: "transform",
      eyebrow: "JioMart · Product discovery",
      headline: ["Improving product discovery across JioMart"],
      body: "Shoppers could reach products but struggled to compare and trust them. I led the redesign of Home, listing and product pages on Jio's Design System 2.0.",
      before: { img: "enhance-problem-plp.png", label: "Before" },
      after: { img: "enhance-v1-plp.png", label: "After · DS 2.0" },
      kpis: [
        { k: "Sessions with add-to-cart", from: "10.41%", to: "11.48%", d: "+107 bps" },
        { k: "Search-assisted add-to-cart", from: "41.40%", to: "44.33%", d: "+293 bps" }
      ],
      caveat: "Google Analytics, before vs after. Not an A/B test.",
      meta: [
        { l: "My role", v: "Design lead, discovery" },
        { l: "Team", v: "Jio central design · DS 2.0 partners" },
        { l: "Surfaces", v: "Home · Listing · Product page" }
      ],
      notes: "30 seconds. Left is the listing page shoppers had; right is what we shipped on Design System 2.0. Two numbers moved after launch: sessions with an add-to-cart went from 10.41% to 11.48%, and search-assisted add-to-cart from 41.40% to 44.33%. Say straight away this is a before/after comparison, not an experiment. Then: 'I'll show what we were asked, what we found, why we chose what we did, and what I can and can't claim.' TODO: confirm project dates; the case study says Aug–Oct 2023 but the metrics dashboard says Sep 2022–Mar 2023."
    },

    /* ============ 02 — CONTEXT & BRIEF ============ */
    {
      section: "context", type: "brief",
      eyebrow: "Business context",
      headline: ["The brief, and the question behind it"],
      asked: {
        k: "What we were asked",
        t: "Refine structure, navigation and widgets on Home, listing and product pages as Design System 2.0 rolled out.",
        src: "Paraphrased from project records"
      },
      investigated: {
        k: "What we chose to investigate",
        t: "Why do shoppers who reach a product still struggle to choose it?",
        src: "Reframed after the audit"
      },
      facts: [
        { k: "Business", v: "Multi-category marketplace: grocery, fashion, electronics" },
        { k: "Users", v: "Mobile shoppers browsing and searching" },
        { k: "Worked with", v: "Product owners · Engineering · DS 2.0 team (Europe)" },
        { k: "I owned", v: "Audit, research synthesis, Home / listing / product design" }
      ],
      notes: "The brief was framed as a UI refresh tied to the design-system rollout. I didn't want to just reskin screens, so I turned it into a question about choosing. Be precise on 'I' vs 'we': I led the audit, synthesis and the discovery designs; product owned priorities, engineering owned build, the DS 2.0 team owned components. Scale (only if asked): an internal town-hall slide listed about 94.6M JioMart visitors; I don't have the exact period, so call it context. TODO: if you have the original PRD or brief, quote one line from it here instead of the paraphrase."
    },

    /* ============ 03 — WHERE SHOPPERS STRUGGLED ============ */
    {
      section: "problem", type: "journey",
      eyebrow: "Where shoppers struggled",
      headline: ["Friction at every step, measured at only one"],
      steps: [
        { k: "Home", issues: [
          { t: "Inconsistent category icons and colours", tag: "Audit" },
          { t: "Busy banners compete for attention", tag: "Audit" }
        ] },
        { k: "Browse / search", issues: [
          { t: "Wrong categories, irrelevant suggestions", tag: "Audit" },
          { t: "Scan and voice often failed", tag: "Audit" }
        ] },
        { k: "Listing", issues: [
          { t: "Cards look alike, small images", tag: "Observed" },
          { t: "Filter and sort hard to use", tag: "Audit" }
        ] },
        { k: "Product page", issues: [
          { t: "Variants and offers unclear", tag: "Observed" },
          { t: "Delivery, seller, returns buried", tag: "Observed" }
        ] },
        { k: "Add to cart", issues: [
          { t: "10.41% of sessions", tag: "Measured" },
          { t: "41.40% when search-assisted", tag: "Measured" }
        ] }
      ],
      foot: "We had no step-by-step drop-off data. Only the end point was measured.",
      notes: "Walk left to right. Most of this is what the audit and product review showed, not measured drop-off. Name the tags: Audit means the heuristic evaluation, Observed means we documented it from the live screens, Measured means Google Analytics. The two add-to-cart numbers use different bases (all sessions vs search-assisted), so don't call one '4× the other' as if it were a like-for-like comparison."
    },

    /* ============ 04 — HOW WE INVESTIGATED ============ */
    {
      section: "problem", type: "board",
      eyebrow: "Investigation",
      headline: ["Four sources of evidence"],
      cards: [
        { k: "Analytics", tag: "Measured", img: "enhance-heatmaps-data.png", pos: "right top",
          q: "Where does intent turn into action?",
          learned: "Search-assisted sessions added to cart far more often than average.",
          gap: "No stage-by-stage funnel data." },
        { k: "User research", tag: "Research", img: "enhance-user-interview.png",
          q: "What do shoppers need before they choose?",
          learned: "Sessions with shoppers on how they browse, compare and decide.",
          gap: "Findings weren't written up; confirm before quoting." },
        { k: "UX audit", tag: "Audit", img: "enhance-heuristic-table.png",
          q: "Where does the interface break basic usability rules?",
          learned: "23 problem areas rated. The product page was among the most severe.",
          gap: "Expert judgement, not user behaviour." },
        { k: "Competitors", tag: "Benchmark", img: "enhance-pdp-competitor-benchmark.webp",
          q: "How do leading apps help people choose?",
          learned: "Discount labels, multiple image views, ratings and sharing near the title.",
          gap: "Shows patterns, not what our shoppers want." }
      ],
      foot: "Live-user counts showed scale (~24.7K active in 5 min), not where people dropped off.",
      notes: "For each source: the question, what we had, what we learned, what stayed uncertain. Analytics: GA pre-period add-to-cart rates plus heatmaps. Audit: 23 areas scored for severity (S0–S3) and ease of fixing (E0–E3); the S3 items were the list feature, scan, checkout, order details and the product page. Competitors: Grofers, BigBasket, Flipkart, Meesho and Amazon product pages, plus Flipkart, Amazon and Tata CLiQ electronics. TODO: confirm how many interviews you ran and the top 2–3 things people said; the photo is real but the findings aren't documented in the repo, so keep that card to what you can defend."
    },

    /* ============ 05 — THE REAL PROBLEM ============ */
    {
      section: "problem", type: "synthesis",
      eyebrow: "Discovering the real problem",
      headline: ["Not a UI refresh: a decision problem"],
      cols: ["Symptom", "Evidence", "Underlying cause"],
      rows: [
        { theme: "Finding",
          symptom: "Shoppers didn't know where to start",
          evidence: "Audit: icons, search, scan (S2–S3)",
          cause: "Inconsistent entry points and categories" },
        { theme: "Comparing",
          symptom: "Products looked alike on listings",
          evidence: "Audit + competitor listings",
          cause: "No shared card or information hierarchy" },
        { theme: "Choosing",
          symptom: "Unsure of variant, price, delivery, returns",
          evidence: "Product page rated S3 in audit",
          cause: "Deciding details buried below the fold" }
      ],
      statement: "Across JioMart's categories, shoppers met inconsistent ways in and too little decision information, so finding, comparing and confidently choosing a product took more effort than it should.",
      status: "Supported by audit and benchmarks. A working hypothesis, not validated by testing.",
      notes: "The most important slide. The ask sounded like 'make it look modern'. The evidence pointed to something else: the same gaps showed up on every surface, in every category. That's why the answer was a system (shared components on DS 2.0), not a reskin of three screens. Read the problem statement once, slowly. Be explicit that the root causes are well supported by the audit and benchmarks, but we didn't run a study that proved them."
    },

    /* ============ 06 — OPPORTUNITIES ============ */
    {
      section: "opportunity", type: "oppmatrix",
      eyebrow: "From user problems to business value",
      headline: ["Four needs, four levers"],
      rows: [
        { need: "Find relevant products", lever: "Clear categories, better search matching", metric: "Search-assisted add-to-cart", tier: "Primary" },
        { need: "Compare options", lever: "Scannable cards, filter, sort, grid / list", metric: "Listing → product clicks", tier: "Not tracked" },
        { need: "Understand variants and price", lever: "Variants, price, discount up front", metric: "Sessions with add-to-cart", tier: "Primary" },
        { need: "Trust offers, delivery, returns", lever: "Delivery strip, offers, seller and return info", metric: "Engagement time, pages per user", tier: "Supporting" }
      ],
      prioritise: {
        img: "enhance-user-journey-02.png",
        cap: "MoSCoW used to scope the first release",
        points: [
          "Must: name, price, rating, discount, clear images",
          "Won't (yet): reviews on the listing card"
        ]
      },
      notes: "Connect each shopper need to a lever and a metric. Two primary metrics were measured; listing-to-product clicks is the metric I wanted but it wasn't tracked, so say that. Prioritisation: we used MoSCoW for scope and an impact/effort matrix for sequencing; high-effort, low-impact ideas like 3D icons and gamified category views were parked. TODO: if you remember a specific engineering or business constraint (e.g. catalogue data quality for variants), add it here; it's not in the records."
    },

    /* ============ 07 — BENCHMARKS & IDEATION ============ */
    {
      section: "opportunity", type: "ideas",
      eyebrow: "Competitive research and ideation",
      headline: ["What we learned, and what we bet on"],
      pairs: [
        { saw: "Grofers and BigBasket put discount and trust labels on the card", bet: "Price and discount on the card make comparison faster" },
        { saw: "BigBasket and Flipkart show several image views and carousels", bet: "Better images reduce doubt on the product page" },
        { saw: "Amazon keeps rating and share next to the title", bet: "Proof near the name builds confidence" }
      ],
      tiles: [
        { img: "enhance-pdp-competitor-benchmark.webp", t: "Product page benchmark" },
        { img: "enhance-competitive-01.png", t: "Electronics benchmark" },
        { img: "enhance-brainstorming.png", t: "Team whiteboard session" },
        { img: "enhance-impact-effort-matrix.png", t: "Impact / effort matrix" }
      ],
      notes: "Benchmarks told us what patterns exist, not what our shoppers want; each one became a hypothesis we designed around. The whiteboard photo and matrix are from the real sessions. Click any tile to enlarge it."
    },

    /* ============ 08 — DECISIONS & TRADE-OFFS ============ */
    {
      section: "design", type: "decisions",
      eyebrow: "Key decisions",
      headline: ["Evidence, choice, trade-off"],
      rows: [
        { s: "Home", img: "enhance-v1-home.png",
          ev: "Audit: inconsistent icons and colours",
          choice: "One icon style, category-first layout, search on top",
          value: "Shoppers know where to start",
          trade: "Novel ideas (3D icons, gamified categories) parked as high effort" },
        { s: "Listing", img: "enhance-v1-plp.png",
          ev: "Cards looked alike; competitors label price and discount",
          choice: "Bigger images; price, discount, rating on the card; sort and filter on top",
          value: "Compare without opening every product",
          trade: "Bigger cards show fewer items per screen" },
        { s: "Product page", img: "enhance-v1-pdp.png",
          ev: "Product page rated most severe; key details buried",
          choice: "Brand above name, variants with price, delivery strip on the first screen",
          value: "Decide without scrolling",
          trade: "Long description moved lower" },
        { s: "System", img: "enhance-jds-ui-application.webp",
          ev: "Same issues on every surface and category",
          choice: "Build every screen from DS 2.0 components",
          value: "Consistent pages, faster to ship",
          trade: "Timeline tied to the design-system rollout" }
      ],
      notes: "Four decisions, each from evidence to trade-off. The trade-offs are real: bigger cards mean fewer products per screen, and parking high-effort ideas was explicit in the impact/effort matrix. Reviews on the listing card were a 'Won't have' in MoSCoW. TODO: if a specific alternative was debated with product or engineering (e.g. tabs vs a long product page), add it in your words; I've left out anything not in the records."
    },

    /* ============ 09 — FINAL EXPERIENCE ============ */
    {
      section: "design", type: "showcase",
      eyebrow: "The final discovery experience",
      headline: ["Before and after, on Design System 2.0"],
      pairs: [
        { k: "Home", before: "enhance-problem-home.png", after: "enhance-v1-home.png",
          note: "One icon style · clear categories · search first" },
        { k: "Listing", before: "enhance-problem-plp.png", after: "enhance-v1-plp.png",
          note: "Price, discount, rating on every card" },
        { k: "Product page", before: "enhance-problem-pdp.png", after: "enhance-v1-pdp.png",
          note: "Variants, price, delivery on the first screen" }
      ],
      evidence: {
        method: "Project slide · old vs new listing",
        img: "enhance-plp-old-new-improvements.webp", crop: 0.05,
        observed: "Old and new listing pages side by side, with the seven key improvements we presented.",
        takeaway: "Minimal cards, wishlist on the listing, prominent sort and filter, search term kept, bottom navigation, deal timers and tags, no grey patches.",
        implication: "Each change answers one comparison question on the card itself."
      },
      notes: "These are the screens we shipped on DS 2.0, not today's app; the live app has moved on since. One line per surface, then let them look. Open the evidence pill for the project's own old-vs-new listing slide with the seven improvements."
    },

    /* ============ 10 — VALIDATION & ITERATION ============ */
    {
      section: "results", type: "board",
      eyebrow: "Validation and iteration",
      headline: ["How we checked the work"],
      cards: [
        { k: "Usability test · listing", tag: "Test", img: "enhance-usability-test-plp.png",
          q: "Can shoppers save and find a product?",
          learned: "9 of 12 completed. Avg 17.6s, 59.1% misclicks: the strip worked, the icon was slow to find.",
          gap: "One task, on the new design." },
        { k: "DS 2.0 design reviews", tag: "Review", img: "enhance-europe-review.png",
          q: "Do screens follow the system and scale?",
          learned: "Components and patterns aligned with the design-system partners.",
          gap: "Expert review, not user validation." },
        { k: "Stakeholder review", tag: "Review", img: "enhance-europe-presentation.png",
          q: "Do product and engineering agree on scope?",
          learned: "Scope locked with MoSCoW before build.",
          gap: "Alignment, not user validation." },
        { k: "Iteration · reviews", tag: "Iteration", img: "enhance-iter-reviews-v1.png", pos: "center 40%",
          q: "How did a screen change after feedback?",
          learned: "A rating line became a ratings summary with star filters.",
          gap: "What triggered it needs confirming." }
      ],
      foot: "Design reviews checked quality. Only the usability test involved shoppers.",
      notes: "Separate the kinds of validation clearly. Shoppers: one usability test on the new listing (wishlist task): 9 of 12 completed, 17.56s average, 59.1% misclicks. The feedback strip after adding to wishlist was noticed; the wishlist icon itself took time to find. Experts: DS 2.0 reviews with the European partners. Stakeholders: scope reviews with product and engineering. Then behaviour data on the next slide. TODO: confirm what feedback led to the reviews redesign."
    },

    /* ============ 11 — IMPACT ============ */
    {
      section: "results", type: "kpis",
      eyebrow: "Business impact",
      headline: ["What moved after launch"],
      groups: [
        { k: "Conversion", rows: [
          { l: "Sessions with add-to-cart", pre: 10.41, post: 11.48, unit: "%", d: "+107 bps", rel: "+10.3%" },
          { l: "Search-assisted add-to-cart", pre: 41.40, post: 44.33, unit: "%", d: "+293 bps", rel: "+7.1%" }
        ] },
        { k: "Engagement", rows: [
          { l: "Engagement per active user", pre: 254, post: 294, unit: "s", fmt: "ms", d: "+15.7%" },
          { l: "Engagement per session", pre: 106, post: 122, unit: "s", fmt: "ms", d: "+15.1%" },
          { l: "Page views per user", pre: 5.81, post: 6.49, unit: "", d: "+11.7%" }
        ] },
        { k: "Performance", rows: [
          { l: "Avg. page download time", pre: 0.17, post: 0.12, unit: "s", d: "−29%", lowerBetter: true }
        ] }
      ],
      context: "App-wide FY22–23 growth (users, orders, revenue) had many causes and isn't claimed here.",
      disclaimer: "Google Analytics, before vs after. Not an A/B test; other releases shipped in the same period.",
      notes: "Changes are recalculated from the raw pre/post figures. Conversion is the headline: +107 and +293 basis points. Engagement and speed support it. Say the caveat before they ask: this is pre/post, not causal; other releases shipped too. Where my numbers differ from the original table: page views per user is +11.7% (the table says +11.07%), engagement per session +15.1% (table +15.5%), engagement per user +15.7% (table +16%), engagement rate 80.51%→80.63% is +12 bps (table +14 bps). Small gaps may be rounding in the source. The FY22–23 dashboard (MAU +65%, revenue +38%, CS calls −36% from Help & Support) is company context, not this project. TODO: confirm the two comparison periods for the pre/post table."
    },

    /* ============ 12 — CONTRIBUTION & REFLECTION ============ */
    {
      section: "learnings", type: "close",
      eyebrow: "My contribution and reflection",
      headline: ["Every screen should remove a doubt"],
      blocks: [
        { k: "My role", d: "Led the audit and synthesis, designed Home, listing and product pages on DS 2.0, and ran reviews with product, engineering and the DS team." },
        { k: "What changed", d: "Consistent discovery across categories. Add-to-cart +107 bps and search-assisted add-to-cart +293 bps after launch." },
        { k: "What I learned", d: "When the same gap shows up everywhere, fix the system, not the screen." },
        { k: "Next time", d: "Track listing → product → cart from day one, and A/B test the product page's first screen." }
      ],
      award: { img: "enhance-award.png", caption: "Jio Spotlight Award · Q4 2022–23" },
      cta: [
        { label: "Full case study", href: "./jiomart-discovery.html", primary: true },
        { label: "Next project →", href: "./index.html" }
      ],
      notes: "Own the measurement gap: I'd instrument each step and test the product page first screen. Close on the principle: people buy when every screen removes a doubt. TODO: confirm the award was for this discovery work, and its date."
    }
  ]
};
