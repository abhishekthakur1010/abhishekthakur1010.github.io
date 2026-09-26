/* ============================================================
   JioMart Checkout XP — interview deck
   5 verticals · beat-based · Before → After evolution
   Reuses the shared jiomart-deck.js engine + jiomart-deck.css.
   Content only. No fabricated metrics (verified FY22-23 figures).
   ============================================================ */
window.DECK = {
  imgBase: "./images/stream-study/",
  sections: [
    { id: "intro", n: "01", label: "Introduction" },
    { id: "discovery", n: "02", label: "Discovery" },
    { id: "evolution", n: "03", label: "Redesign" },
    { id: "impact", n: "04", label: "Impact" },
    { id: "recognition", n: "05", label: "Reflection" }
  ],
  slides: [
    /* ============ 01 — INTRODUCTION ============ */

    /* 01 — OPENING */
    {
      section: "intro", type: "opening",
      eyebrow: "JioMart · Checkout · DS 2.0",
      headline: ["Streamlining ", "checkout", " from cart to payment"],
      highlight: "checkout",
      body: "Rebuilding JioMart's cart, address, payment and confirmation into a faster, clearer, more rewarding flow — the one screen every customer touches, but nobody had optimized.",
      hero: "stream-case-study-order-success-page.png",
      backShots: ["stream-case-study-cart-page-01.png", "stream-case-study-payment-page.png"],
      badge: { n: "+20.5%", l: "Conversion rate" },
      meta: [
        { l: "My role", v: "Design Lead — Checkout · Jio central design team" },
        { l: "Timeline", v: "Aug 2023 – Oct 2023 · During DS 2.0 rollout" },
        { l: "Flows", v: "Cart · Address · Payment · Review · Coupons" },
        { l: "Headline impact", v: "Conversion +20.54% · New users +29%" }
      ],
      cta: "Press → to begin"
    },

    /* 02 — WHY CHECKOUT MATTERS */
    {
      section: "intro", type: "problem-flow",
      eyebrow: "The product",
      headline: ["Checkout is the", "exit door of every trip."],
      sub: "Every JioMart customer passes through it — but it had never been truly optimized. Small frictions here quietly leaked users and abandoned carts.",
      flow: ["Cart", "Address", "Payment", "Review", "Success"],
      problems: [
        "Cart buried in the top-right corner",
        "No delivery clarity at checkout",
        "Coupons hard to find & apply",
        "Long address form, unexplained fields",
        "Cluttered payment, hidden payable amount"
      ],
      screens: [
        { label: "Cart", img: "stream-case-study-cart-page-before-01.png", tall: true },
        { label: "Payment", img: "stream-case-study-payment-page-before.png", tall: true },
        { label: "Address", img: "stream-case-study-add-address-before.png" }
      ],
      chain: ["Friction", "Hesitation", "Drop-off", "Abandoned cart"],
      end: "The job wasn't cosmetic. Every frustration removed is a leak in trust sealed."
    },

    /* 03 — THE PROBLEM, SHOWN */
    {
      section: "intro", type: "review",
      eyebrow: "Where it started",
      headline: ["Functional on top,", "friction underneath."],
      sub: "The original checkout worked — but hidden actions, clunky coupons and a cluttered payment page made it feel like a chore, not a continuation of shopping.",
      img: "redesign-img.png",
      points: [
        { k: "Cart", d: "Hidden actions, no easy way to group or clear items." },
        { k: "Payment", d: "Excessive scroll; the amount payable was hard to find." },
        { k: "Emotion", d: "No reward nudges — checkout felt flat and transactional." }
      ],
      caption: "The original JioMart checkout flow — cart, review, payment, loading, thank-you, confirmation.",
      end: "So I set out to make it faster, clearer, and rewarding."
    },

    /* ============ 02 — DISCOVERY ============ */

    /* 04 — HOW WE INVESTIGATED */
    {
      section: "discovery", type: "toolkit",
      eyebrow: "Research & process",
      headline: ["Grounded in real behavior."],
      sub: "Before touching a screen, I benchmarked the best flows, mapped the shopper's emotional journey, and audited the experience against usability heuristics.",
      tiles: [
        { t: "The approach", img: "stream-case-study-defining.png", crop: 0.2 },
        { t: "Competitive benchmarking", img: "stream-case-study-competitive.png", crop: 0.15 },
        { t: "Emotional journey map", img: "stream-case-study-emotional.png", crop: 0.2 },
        { t: "Heuristic evaluation", img: "stream-case-study-behavior-heuristic.png", crop: 0.2 },
        { t: "User interviews", img: "stream-case-study-behavior-sample-interview.png", crop: 0.3 },
        { t: "Friction points", img: "stream-case-study-behavior-friction-points-01.png", crop: 0.3 },
        { t: "Analysis", img: "stream-case-study-analysis.png", crop: 0.25 },
        { t: "Key performance", img: "stream-case-study-key-performance.png", crop: 0.25 }
      ],
      statement: "Different methods. The same friction kept surfacing across cart, payment and mindset."
    },

    /* 05 — WHAT THE EVIDENCE TOLD US */
    {
      section: "discovery", type: "findings",
      eyebrow: "What we learned",
      headline: ["Speed, clarity, reward."],
      sub: "The screens differed, but three needs repeated on every step of the journey.",
      findings: [
        { k: "Discoverability", d: "Key actions — cart, coupons — were hard to find." },
        { k: "Clarity", d: "Delivery ETAs and the payable amount were hidden." },
        { k: "Effort", d: "Long forms and heavy scrolling slowed decisions." },
        { k: "Trust", d: "No reason given for asks; little reassurance before paying." },
        { k: "Delight", d: "Nothing rewarded completing the purchase." }
      ],
      equation: ["Speed", "Clarity", "Reward"],
      equationResult: "Confidence"
    },

    /* 06 — PRIORITISATION */
    {
      section: "discovery", type: "prioritise",
      eyebrow: "What to fix first",
      headline: ["More friction than", "we could fix at once."],
      sub: "I ranked every issue by impact and effort, then sequenced the checkout screens into a redesign roadmap.",
      reveal: "So I prioritised.",
      img: "stream-case-study-analysis.png", crop: 0.2,
      tiers: [
        { k: "High impact · low effort", d: "Quick wins" },
        { k: "High impact · high effort", d: "Big bets" },
        { k: "Low impact", d: "Later" }
      ],
      roadmap: [
        { s: "Cart", d: "Decide" }, { s: "Address", d: "Trust" },
        { s: "Payment", d: "Pay" }, { s: "Success", d: "Delight" }
      ],
      end: "This became the redesign roadmap."
    },

    /* ============ 03 — REDESIGN (Before → After) ============ */

    /* 07 — CART */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Cart · 01",
      headline: ["A cart that helps you decide."],
      sub: "One clear primary action, automatic best-coupon, a colour-coded payment breakdown, and product details surfaced up front.",
      before: { img: "stream-case-study-cart-page-before-01.png", focus: 0.05, notes: ["Buried actions", "Flat pricing"] },
      v1: { img: "stream-case-study-cart-page-01.png", focus: 0.05, notes: ["Clear primary CTA", "Auto best-coupon"] },
      v2: { img: "stream-case-study-cart-page-01.png", focus: 0.05, notes: ["Shipped live", "Colour-coded savings"] },
      evidence: {
        method: "Heuristic evaluation · UX audit",
        img: "stream-case-study-behavior-heuristic.png", crop: 0.2,
        observed: "We scored the checkout against usability heuristics, rating each issue for severity and ease of fixing.",
        takeaway: "Cart friction and hidden actions were high-severity, low-effort wins.",
        implication: "Give the cart one clear action and make savings obvious."
      },
      signal: [{ t: "Decision clarity", dir: "up" }, { t: "Cart friction", dir: "down" }]
    },

    /* 08 — PAYMENT */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Payment · 02",
      headline: ["The amount, always in view."],
      sub: "Cut the scroll, kept the payable amount and breakdown pinned, and surfaced UPI, wallet and bank methods upfront.",
      before: { img: "stream-case-study-payment-page-before.png", focus: 0.05, notes: ["Heavy scroll", "Amount hidden"] },
      v1: { img: "stream-case-study-payment-page.png", focus: 0.05, notes: ["Payable pinned", "Methods upfront"] },
      v2: { img: "stream-case-study-payment-page.png", focus: 0.05, notes: ["Shipped live", "Cleaner spacing"] },
      punch: "Never make a user scroll to find what they owe.",
      signal: [{ t: "Payment clarity", dir: "up" }, { t: "Steps to pay", dir: "down" }]
    },

    /* 09 — ADDRESS */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Address · 03",
      headline: ["Let the map do the typing."],
      sub: "Simplified the map-based add/edit flow, surfaced key fields in the first viewport, and added drag-to-select with auto-fill.",
      before: { img: "stream-case-study-add-address-before.png", focus: 0.05, notes: ["Long form", "Unexplained fields"] },
      v1: { img: "stream-case-study-add-address.png", focus: 0.05, notes: ["Map-based", "Auto-fill"] },
      v2: { img: "stream-case-study-add-address.png", focus: 0.05, notes: ["Shipped live", "Fewer fields"] },
      signal: [{ t: "Form completion", dir: "up" }, { t: "Effort", dir: "down" }]
    },

    /* 10 — ORDER SUCCESS */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Order success · 04",
      headline: ["Close the loop with delight."],
      sub: "A clear savings callout, ordered-item images, a 'Continue shopping' CTA, status colours, and a 'Rate your experience' prompt.",
      before: { img: "stream-case-study-order-success-page-before.png", focus: 0.05, notes: ["Plain confirmation", "Dead end"] },
      v1: { img: "stream-case-study-order-success-page.png", focus: 0.05, notes: ["Savings callout", "Loop back to shop"] },
      v2: { img: "stream-case-study-order-success-page.png", focus: 0.05, notes: ["Shipped live", "Reward moment"] },
      punch: "End on a reward, then loop back to browsing.",
      signal: [{ t: "Delight", dir: "up" }, { t: "Repeat visits", dir: "up" }]
    },

    /* 11 — COUPON STORE + SUPPORT */
    {
      section: "evolution", type: "evolution",
      eyebrow: "Coupons & support · 05",
      headline: ["Savings early, help that helps."],
      sub: "A dedicated coupon store moves savings to the start of the journey; a rebuilt help hub with chat, call and a guided bot cut support load.",
      before: { img: "stream-case-study-coupon-page-before.png", focus: 0.05, notes: ["Coupons hard to find", "Generic FAQs"] },
      v1: { img: "stream-case-study-coupon-page.png", focus: 0.05, notes: ["Browse & filter offers", "Action-oriented help"] },
      v2: { img: "stream-case-study-support-page.png", focus: 0.05, notes: ["Shipped live", "Guided chatbot"] },
      evidence: {
        method: "Support impact · FY 22–23",
        img: "stream-case-study-key-performance.png", crop: 0.2,
        observed: "Replaced generic FAQs with a centralized, action-oriented help hub and a guided chatbot.",
        takeaway: "A clearer help experience reduced customer-support calls by 36%.",
        implication: "Resolve intent in-product before it becomes a support ticket."
      },
      signal: [{ t: "Savings discovery", dir: "up" }, { t: "Support calls", dir: "down" }]
    },

    /* ============ 04 — IMPACT ============ */

    /* 12 — IMPACT */
    {
      section: "impact", type: "impact",
      eyebrow: "Impact",
      headline: ["What changed at the exit door?"],
      sub: "By removing friction and adding moments of delight, checkout stopped leaking users — and started compounding growth.",
      experience: [
        "Discoverable cart", "Delivery clarity", "Automatic best-coupon",
        "Payable always in view", "Simpler address", "Rewarding confirmation"
      ],
      metricsLabel: "Performance · FY 22–23",
      metrics: [
        { n: "+20.54%", l: "Ecommerce conversion" },
        { n: "+29%", l: "New users" },
        { n: "+20.61%", l: "Returning users" },
        { n: "+8.15%", l: "Orders" },
        { n: "+11.4%", l: "Sessions" },
        { n: "−36%", l: "Customer-support calls" }
      ],
      evidence: {
        method: "Performance dashboard · FY 22–23",
        img: "stream-case-study-key-performance.png", crop: 0.2,
        observed: "Conversion +20.54%, new users +29%, returning users +20.61%, orders +8.15%, sessions +11.4%, and a 36% drop in CS calls.",
        takeaway: "Fixing checkout friction moved the numbers that matter most.",
        implication: "Checkout UX isn't polish — it's business-critical."
      },
      disclaimer: "Platform-level indicators (Sep 22 – Mar 23), reflecting the checkout redesign alongside broader JioMart improvements."
    },

    /* ============ 05 — REFLECTION ============ */

    /* 13 — REFLECTION */
    {
      section: "recognition", type: "recognition",
      eyebrow: "Reflection",
      headline: ["Where intent becomes purchase."],
      sub: "Checkout is where a shopping trip either completes or is abandoned.",
      award: { img: "stream-case-study-order-success-page.png", caption: "Order placed — the reward moment that closes the loop and invites the next trip." },
      reflection: [
        "Checkout is where intent turns into purchase — or abandonment.",
        "Every frustration you remove is a leak in trust you seal.",
        "Fixing them isn't UX polish. It's business-critical."
      ],
      cta: [
        { label: "Explore full case study", href: "./jio-checkout.html", primary: true },
        { label: "Next project →", href: "./jiomart-discovery.html" }
      ]
    }
  ]
};
