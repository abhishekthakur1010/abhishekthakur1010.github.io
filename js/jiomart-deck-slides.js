/* ============================================================
   JioMart Discovery — interview deck (12 slides, visual-first)
   Story: Landing → Brief → Struggles → Investigation → Real problem →
          Opportunities → Ideas → Decisions → Final experience →
          Validation → Impact → Reflection
   Content only. Rendering in jiomart-deck.js.
   Numbers:
   · Real (Google Analytics pre/post, audit, usability test) are shown plain.
   · Hypothetical / estimated numbers carry `est: true` → shown with an "est." chip.
   · `notes` = presenter talk-track (press N).
   ============================================================ */
window.DECK = {
  imgBase: "./images/enhanceProduct/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "problem", n: "02", label: "Problem" },
    { id: "opportunity", n: "03", label: "Opportunity" },
    { id: "design", n: "04", label: "Design" },
    { id: "results", n: "05", label: "Results" },
    { id: "learnings", n: "06", label: "Reflection" }
  ],
  slides: [
    /* 01 — LANDING: live product page; hover fans out live Home + listing */
    {
      section: "context", type: "opening",
      eyebrow: "JioMart · Product discovery",
      headline: ["Helping shoppers ", "choose", " with confidence"],
      highlight: "choose",
      body: "Shoppers found products but struggled to pick one. I redesigned Home, listing and product pages to make choosing easy.",
      hero: "enhance-v2-pdp-main.png",
      backShots: ["enhance-v2-home.png", "enhance-v2-plp-grid.png"],
      badge: { n: "10.4 → 11.5%", l: "Sessions with add-to-cart" },
      meta: [
        { l: "My role", v: "Design lead, discovery" },
        { l: "Surfaces", v: "Home · Listing · Product" },
        { l: "Search add-to-cart", v: "41.4% → 44.3%" },
        { l: "Built on", v: "Jio Design System 2.0" }
      ],
      cta: "Hover the phone · press → to begin",
      notes: "Hover the phone to fan out the live Home and listing screens. One line: shoppers found products but struggled to choose; I redesigned discovery to fix that. Add-to-cart went from 10.4% to 11.5% of sessions after launch."
    },

    /* 02 — BRIEF */
    {
      section: "context", type: "brief",
      eyebrow: "The brief",
      headline: ["Asked for a refresh. Found a decision problem."],
      asked: { k: "We were asked", t: "Refresh Home, listing and product pages for Design System 2.0.", src: "Product brief" },
      investigated: { k: "We asked instead", t: "Why do shoppers reach a product and still not choose it?", src: "After the audit" },
      facts: [
        { k: "Business", v: "Grocery, fashion, electronics in one app" },
        { k: "Team", v: "Product · Engineering · DS 2.0 (Europe)" },
        { k: "I owned", v: "Audit, research, discovery design" },
        { k: "Scale", v: "~95M visitors" }
      ],
      notes: "The ask was a visual refresh. I reframed it as a question about choosing. I led audit, research and design; product owned priorities, engineering the build, the DS team the components."
    },

    /* 03 — WHERE SHOPPERS STRUGGLED */
    {
      section: "problem", type: "journey",
      eyebrow: "Where shoppers struggled",
      headline: ["Every step lost people"],
      steps: [
        { k: "Home", stat: "100%", statL: "sessions", issues: [{ t: "Confusing icons and banners" }] },
        { k: "Browse / search", stat: "72%", est: true, statL: "kept going", issues: [{ t: "Odd search results" }] },
        { k: "Listing", stat: "46%", est: true, statL: "opened a list", issues: [{ t: "Every card looked alike" }] },
        { k: "Product page", stat: "24%", est: true, statL: "opened a product", issues: [{ t: "Price, size, delivery hidden" }] },
        { k: "Add to cart", stat: "10.4%", statL: "added to cart", issues: [{ t: "41.4% when they searched" }] }
      ],
      foot: "Searchers added to cart about 4× more often. Browsing was the gap.",
      notes: "Walk left to right. 100% and 10.4% are from Google Analytics; the middle steps are estimates (est.). Searchers added to cart about 4× more often (41.4% vs 10.4%, different bases), so browsing was where we were losing people."
    },

    /* 04 — HOW WE INVESTIGATED */
    {
      section: "problem", type: "board",
      eyebrow: "How we found out",
      headline: ["Four lenses, one answer"],
      cards: [
        { k: "Analytics", img: "enhance-heatmaps-data.png", pos: "right top", stat: "4×",
          learned: "Searchers added to cart 4× more than browsers." },
        { k: "Interviews", img: "enhance-user-interview.png", stat: "8 shoppers", est: true,
          learned: "People wanted price, size and proof up front." },
        { k: "UX audit", img: "enhance-heuristic-table.png", stat: "23 issues",
          learned: "The product page was the worst offender." },
        { k: "Competitors", img: "enhance-pdp-competitor-benchmark.webp", stat: "5 apps",
          learned: "Leaders show discounts, images and ratings on the card." }
      ],
      notes: "Each lens alone is weak; together they agree. Audit: 23 issues scored by severity and ease of fixing. Competitors: Amazon, Flipkart, BigBasket, Grofers, Meesho. Interview count is an estimate (est.)."
    },

    /* 05 — THE REAL PROBLEM */
    {
      section: "problem", type: "synthesis",
      eyebrow: "The real problem",
      headline: ["Not a UI problem. A decision problem."],
      cols: ["What shoppers felt", "Why it happened"],
      rows: [
        { theme: "Finding", symptom: "“Where do I start?”", cause: "Inconsistent icons and categories" },
        { theme: "Comparing", symptom: "“Which one do I pick?”", cause: "Every card showed different info" },
        { theme: "Choosing", symptom: "“Can I trust this?”", cause: "Key details buried below the fold" }
      ],
      statement: "Shoppers didn't lack products. They lacked the information to choose one with confidence.",
      notes: "The most important slide. The same gaps showed up on every surface, so the fix was a system, not a reskin. Read the statement slowly."
    },

    /* 06 — OPPORTUNITIES */
    {
      section: "opportunity", type: "oppmatrix",
      eyebrow: "Opportunity",
      headline: ["Four needs, four levers"],
      rows: [
        { need: "Find it", lever: "Clear categories, better search", metric: "Search add-to-cart 41% → 45%", tier: "Target" },
        { need: "Compare it", lever: "Scannable cards, sort, filter", metric: "List → product 32% → 40%", tier: "Target · est." },
        { need: "Understand it", lever: "Variants and price up front", metric: "Add-to-cart 10.4% → 12%", tier: "Target" },
        { need: "Trust it", lever: "Delivery, offers, returns visible", metric: "Engagement +15%", tier: "Target" }
      ],
      prioritise: {
        img: "enhance-user-journey-02.png",
        cap: "MoSCoW: what made the first release",
        points: ["Must: name, price, rating, discount, clear images", "Later: reviews on the listing card"]
      },
      notes: "Each shopper need maps to a design lever and a target. Targets were set before launch; list → product is an estimate (est.). MoSCoW decided what shipped first."
    },

    /* 07 — BENCHMARKS & IDEAS */
    {
      section: "opportunity", type: "ideas",
      eyebrow: "Ideas",
      headline: ["What we saw, what we bet on"],
      pairs: [
        { saw: "Grofers, BigBasket: discount on the card", bet: "Show price and discount on every card" },
        { saw: "Flipkart, BigBasket: many image views", bet: "Bigger, swipeable product images" },
        { saw: "Amazon: rating next to the title", bet: "Proof right under the name" }
      ],
      tiles: [
        { img: "enhance-pdp-competitor-benchmark.webp", t: "Product page benchmark" },
        { img: "enhance-competitive-01.png", t: "Electronics benchmark" },
        { img: "enhance-brainstorming.png", t: "Whiteboard session" },
        { img: "enhance-impact-effort-matrix.png", t: "Impact / effort" }
      ],
      notes: "Benchmarks gave us patterns; each became a bet we designed and then measured. Click a tile to enlarge."
    },

    /* 08 — DECISIONS */
    {
      section: "design", type: "decisions", compact: true,
      eyebrow: "Key decisions",
      headline: ["Three calls that mattered"],
      rows: [
        { s: "Home", img: "enhance-v2-home.png",
          choice: "One icon style, search on top", ev: "Shoppers didn't know where to start", trade: "Fewer promo banners" },
        { s: "Listing", img: "enhance-v2-plp-grid.png",
          choice: "Price, discount, rating on every card", ev: "Cards looked alike", trade: "Fewer items per screen" },
        { s: "Product page", img: "enhance-v2-pdp-main.png",
          choice: "Size, price, delivery on the first screen", ev: "Key info was buried", trade: "Description moved lower" }
      ],
      notes: "For each: what we chose, why, and what we gave up. Clarity beat density every time."
    },

    /* 09 — FINAL EXPERIENCE (live screens) */
    {
      section: "design", type: "showcase",
      eyebrow: "The final experience",
      headline: ["Before and live today"],
      labels: ["Before", "Live"],
      pairs: [
        { k: "Home", before: "enhance-problem-home.png", after: "enhance-v2-home.png", note: "Clear start, search first" },
        { k: "Listing", before: "enhance-problem-plp.png", after: "enhance-v2-plp-grid.png", note: "Compare at a glance" },
        { k: "Product page", before: "enhance-problem-pdp.png", after: "enhance-v2-pdp-main.png", note: "Decide without scrolling" }
      ],
      evidence: {
        method: "Old vs new listing",
        img: "enhance-plp-old-new-improvements.webp", crop: 0.05,
        observed: "The old and new listing pages side by side, with the seven key improvements.",
        takeaway: "Cleaner cards, wishlist on the list, sort and filter up top, deal timers and tags.",
        implication: "Every change answers a comparison question on the card itself."
      },
      notes: "Let the screens speak. One line per surface. Click any phone to enlarge."
    },

    /* 10 — VALIDATION */
    {
      section: "results", type: "board",
      eyebrow: "Validation",
      headline: ["Tested, reviewed, refined"],
      cards: [
        { k: "Usability test", img: "enhance-usability-test-plp.png", stat: "9 / 12",
          learned: "Completed the task. Wishlist icon needed to be clearer." },
        { k: "Design reviews", img: "enhance-europe-review.png", stat: "6 rounds", est: true,
          learned: "Aligned every screen with the DS 2.0 team." },
        { k: "Stakeholders", img: "enhance-europe-presentation.png", stat: "1 scope",
          learned: "Product and engineering signed off on MoSCoW." },
        { k: "Iterations", img: "enhance-iter-reviews-v1.png", pos: "center 40%", stat: "3 versions", est: true,
          learned: "Reviews grew from one line to a full summary." }
      ],
      notes: "Usability test: 9 of 12 completed, 17.6s average. Review rounds and version counts are estimates (est.)."
    },

    /* 11 — IMPACT */
    {
      section: "results", type: "kpis",
      eyebrow: "Impact",
      headline: ["What moved after launch"],
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
      disclaimer: "Google Analytics, before vs after launch.",
      notes: "Conversion first: +107 and +293 basis points. Then engagement and speed. If asked: it's a before/after comparison, not an A/B test."
    },

    /* 12 — REFLECTION */
    {
      section: "learnings", type: "close",
      eyebrow: "Reflection",
      headline: ["Every screen should remove a doubt"],
      blocks: [
        { k: "My role", d: "Led research, framing and the discovery redesign." },
        { k: "Result", d: "+107 bps add-to-cart, +293 bps from search." },
        { k: "Learned", d: "Same gap everywhere? Fix the system, not the screen." },
        { k: "Next time", d: "Track every step and A/B test the product page." }
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
