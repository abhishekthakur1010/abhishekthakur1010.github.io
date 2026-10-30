/* ============================================================
   DelFin by Delhivery: 0→1 fintech for truck owners.
   Same engine as the JioMart and HubEye decks (jiomart-deck.js).
   Numbers: Google Analytics funnels, 1–7 Oct 2026; Play Store rating.
   ============================================================ */
window.DECK = {
  imgBase: "./images/delfin/v2/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "define", n: "02", label: "Problem" },
    { id: "design", n: "03", label: "Design" },
    { id: "results", n: "04", label: "Impact" },
    { id: "next", n: "05", label: "Next" }
  ],
  proofs: {
    fastag: {
      method: "FASTag purchase funnel", tag: "Google Analytics · measured",
      img: "ga-fastag.webp", crop: 0,
      calc: [["Order created", "840"], ["Payment done", "708 (84.3%)"], ["Tag handed over", "701 (83.5%)"], ["Tag activated", "675 (80.4%)", 1]],
      observed: "Every FASTag order, from creation to an active tag, 1–7 Oct 2026.",
      takeaway: "Four in five orders became an active tag without a sales call."
    },
    onboarding: {
      method: "Onboarding funnel", tag: "Google Analytics · measured",
      img: "ga-onboarding.webp", crop: 0,
      calc: [["Login page shown", "1,690"], ["Login success", "1,504 (89.0%)"], ["Role selection shown", "944 (55.9%)"], ["Role selected", "928 (54.9%)", 1]],
      observed: "New users from the login screen to choosing owner or driver.",
      takeaway: "98.3% pick a role once they see it. The leak is the 37% gap between login and the role screen."
    },
    wallet: {
      method: "Wallet top-up funnel", tag: "Google Analytics · measured",
      img: "ga-wallet.webp", crop: 0,
      calc: [["Home page", "2,057"], ["Wallet card tap", "984"], ["Add money tap", "338"], ["Add money success", "243 (71.9% of taps)", 1]],
      observed: "From home to a completed wallet top-up.",
      takeaway: "Once people decide to add money, 7 in 10 finish. Getting them to the button is the work."
    },
    recharge: {
      method: "FASTag recharge funnel", tag: "Google Analytics · measured",
      img: "ga-recharge.webp", crop: 0,
      calc: [["Home page", "1,422"], ["FASTag list shown", "964"], ["Recharge page shown", "359 (37%)"], ["Recharge success", "200", 1]],
      observed: "From home, through the FASTag list, to a completed recharge.",
      takeaway: "Only 37% of people who open their tags reach recharge, so recharge moves to one tap from home."
    }
  },

  slides: [
    /* 01 — OPENING */
    {
      section: "context", type: "opening",
      eyebrow: "DelFin by Delhivery · 0→1 fintech",
      headline: ["Fleet finance a truck owner can ", "run alone"],
      highlight: "run alone",
      body: "FASTag and GPS used to mean sales calls, paper KYC and days of silence. I led design for DelFin to make it self-serve, from first tap to an active tag.",
      hero: "home-refined.webp",
      backShots: ["tut-drive.webp", "sheet-fastag.webp"],
      badge: { n: "{{80.4%|fastag}}", l: "FASTag orders activated in-app" },
      meta: [
        { l: "My role", v: "Design lead · 0→1" },
        { l: "Timeline", v: "Jul – Aug 2026 · 8 weeks" },
        { l: "Users", v: "Fleet owners · owner-drivers" },
        { l: "Status", v: "Live on Android · 4.9★" }
      ],
      notes: "DelFin is Delhivery's new fintech app for truck owners. FASTag and GPS used to need a sales call and paper. I led design to make the whole thing self-serve. 80.4% of FASTag orders now reach an active tag in-app."
    },

    /* 02 — RIGHT QUESTIONS */
    {
      section: "context", type: "qa",
      eyebrow: "Asking the right questions",
      headline: ["We asked why before we designed"],
      sub: "Six questions turned 'build a FASTag app' into a platform for a new business.",
      qs: [
        { tag: "Business", q: "Why build it?", a: "Delhivery already works with thousands of truck owners. Tolls are a daily spend." },
        { tag: "Business", q: "What does success look like?", a: "Orders that reach an active tag, with no sales call." },
        { tag: "Owner", q: "Who uses it?", a: "Fleet owners with many trucks, and owner-drivers on the road." },
        { tag: "Owner", q: "What stops them today?", a: "Calls, paper KYC, and no idea where the order is." },
        { tag: "Owner", q: "What do they fear?", a: "Paying, then being stuck at a toll with a dead tag." },
        { tag: "Scope", q: "What's first?", a: "FASTag, then GPS, on one shared wallet and profile." }
      ],
      fromL: "The brief", from: "Build a FASTag purchase flow",
      toL: "What it became", to: "A platform every fleet service can plug into",
      notes: "Business, then users, then scope. The shift at the bottom: this was never just a FASTag flow. It was the base for a new business line."
    },

    /* 03 — PROBLEM */
    {
      section: "define", type: "synthesis",
      eyebrow: "Defining the problem",
      headline: ["Buying a FASTag meant a call, paper and waiting"],
      cols: ["What owners felt", "Why it happened", "How we know"],
      rows: [
        { theme: "Starting", symptom: "“What is this app for?”", cause: "No guidance; owners and drivers got the same setup",
          how: [["Measured", "{{37% dropped|onboarding}} between login and role"], ["Observed", "Partners signed up without knowing the offer"]] },
        { theme: "Buying", symptom: "“Who do I call?”", cause: "Offline sales and paper KYC",
          how: [["Observed", "Every order needed a sales call"], ["Audit", "No in-app document or KYC flow"]] },
        { theme: "Waiting", symptom: "“Is my tag active?”", cause: "No activation status anywhere",
          how: [["Observed", "Tag issues found at the toll plaza"], ["Research", "Owners called support to check"]] }
      ],
      from: "Sell FASTags online",
      to: "Let a truck owner finish alone, and trust it",
      statement: "Owners didn't need more products. They needed to finish a purchase alone and know it worked.",
      goals: [
        { k: "Orders → active tag", v: "Self-serve" },
        { k: "Onboarding", v: "Guided, role-based" },
        { k: "Support calls", v: "Fewer" }
      ],
      notes: "Each row: what owners felt, why, and how we know. The refined problem: finish alone, and trust it."
    },

    /* 04 — PLATFORM BET */
    {
      section: "define", type: "stack",
      eyebrow: "The platform bet",
      headline: ["Not a feature. The base layer for a new business."],
      sub: "Identity, vehicles, documents and one wallet under every service.",
      services: [
        { k: "FASTag", s: "Live", on: true }, { k: "GPS", s: "Live", on: true },
        { k: "Fuel", s: "Next" }, { k: "Insurance", s: "Next" }, { k: "Credit", s: "Next" }
      ],
      layer: "Identity · Vehicles · Documents · Wallet · Payments", layerL: "Shared platform layer",
      user: "Fleet owner",
      quote: "Two banks run FASTag wallets differently. The owner only ever sees: my truck, my balance, what needs attention.",
      notes: "FASTag proved the layer, GPS reused it. IDFC keeps a balance per tag, Axis pools them; DelFin hides that difference."
    },

    /* 05 — THE JOURNEY */
    {
      section: "design", type: "flowview", cap: "DelFin",
      eyebrow: "The journey",
      headline: ["From install to an active FASTag"],
      sub: "Click a step to see the screen.",
      steps: [
        { k: "Benefits first", stat: "3 cards", statL: "before any form", img: "tut-earn.webp", issues: [{ t: "Why DelFin, in 3 lines", tag: "Onboarding" }], pain: "Lower charges, no toll surprises, cashback" },
        { k: "Phone OTP + role", stat: "{{98.3%|onboarding}}", statL: "pick a role once shown", img: "role.webp", issues: [{ t: "Owner or driver setup", tag: "Onboarding" }], pain: "Role decides the rest of the setup" },
        { k: "Home", stat: "1 glance", statL: "what needs attention", img: "home-refined.webp", issues: [{ t: "Pending actions first", tag: "Home" }], pain: "Active counts, pending actions, wallet" },
        { k: "Documents + KYC", stat: "4 steps", statL: "all in-app", img: "kyc.webp", issues: [{ t: "RC, PAN, Aadhaar, bank", tag: "Purchase" }], pain: "No paper, no calls" },
        { k: "Pay", stat: "{{84.3%|fastag}}", statL: "of orders paid", img: "pay-summary.webp", issues: [{ t: "Every fee itemised", tag: "Purchase" }], pain: "₹599, line by line" },
        { k: "Track activation", stat: "{{80.4%|fastag}}", statL: "orders → active tag", img: "sheet-fastag.webp", issues: [{ t: "6-step tracker, resumable", tag: "Measured" }], pain: "Know exactly what's left" }
      ],
      notes: "Walk the six steps. Each has the real screen. 98.3% pick a role once they see it; 84.3% of orders are paid; 80.4% reach an active tag."
    },

    /* 06 — HOME */
    {
      section: "design", type: "versions",
      eyebrow: "Decision · Home",
      headline: ["Home shows what needs attention"],
      labels: ["First visit", "Returning owner"],
      when: ["Buy FASTag or GPS", "Pending actions first"],
      jump: "After first purchase",
      sub: "New owners see what to buy. Returning owners see their trucks and what's pending.",
      stages: [
        { img: "home-first.webp", n: "Buy cards and wallet" },
        { img: "home-refined.webp", n: "Active counts, pending actions, wallet" }
      ],
      notes: "Owners came back to check status, not to browse, so home leads with what needs attention."
    },

    /* 07 — TRACKER */
    {
      section: "design", type: "versions",
      eyebrow: "Decision · Progress",
      headline: ["Progress you can see, and pick up later"],
      labels: ["FASTag", "GPS"],
      when: ["6 steps", "4 steps"],
      jump: "Same pattern",
      sub: "Handover and installation happen in the field, hours later. The tracker remembers where you stopped.",
      stages: [
        { img: "sheet-fastag.webp", n: "Verification, KYC, payment, handover, activation, KYV" },
        { img: "sheet-gps.webp", n: "Address, payment, device link, installation" }
      ],
      notes: "One tracker pattern for both services. Each truck has its own progress and a Continue button."
    },

    /* 08 — REFUND ITERATION */
    {
      section: "design", type: "versions",
      eyebrow: "Decision · Money, said clearly",
      headline: ["Say exactly what happens to the money"],
      labels: ["Before", "After"],
      when: ["Refund mentioned", "Amount and destination"],
      jump: "Iterated",
      sub: "Vague refund copy made owners call support. The new dialog names the amount and where it goes.",
      stages: [
        { img: "delete-v1.webp", n: "“Amount will be refunded”" },
        { img: "delete-v2.webp", n: "“₹599 back to your DelFin wallet”" }
      ],
      notes: "Small change, big trust signal: the exact amount, highlighted, and where it goes."
    },

    /* 09 — BEYOND PURCHASE */
    {
      section: "design", type: "collab",
      eyebrow: "Beyond the purchase",
      headline: ["Everything after buying, without a call"],
      sub: "Account, GST, geofences and buying again, all self-serve.",
      steps: [
        { img: "account.webp", t: "Account", who: "One menu", out: "Services, wallets and help together" },
        { img: "profile-business.webp", t: "Business profile", who: "GSTIN", out: "Fills name and address automatically" },
        { img: "geofence-filled.webp", t: "Geofences", who: "GPS", out: "Alerts when a truck leaves a zone" },
        { img: "home-buy-menu.webp", t: "Buy again", who: "Anywhere", out: "FASTag or GPS in one tap" }
      ],
      notes: "Post-purchase used to mean support calls. Now it's four screens."
    },

    /* 10 — IMPACT */
    {
      section: "results", type: "funnels",
      eyebrow: "Impact",
      headline: ["We tracked every step, so we know where people stop"],
      funnels: [
        { k: "FASTag purchase", proof: "fastag", rows: [
          { l: "Order created", v: 840 }, { l: "Payment done", v: 708 }, { l: "Tag handed over", v: 701 },
          { l: "Tag activated", v: 675, d: "675 · 80.4%", tone: "hot" } ], note: "4 in 5 orders became an active tag, no sales call." },
        { k: "Onboarding", proof: "onboarding", rows: [
          { l: "Login shown", v: 1690 }, { l: "Logged in", v: 1504 }, { l: "Role screen shown", v: 944, d: "944 · −37%", tone: "warn" },
          { l: "Role picked", v: 928, d: "928 · 98.3% of shown" } ], note: "The leak is between login and role, not the role screen." }
      ],
      foot: "Google Analytics funnels, 1–7 Oct 2026. Click Source for the raw report.",
      notes: "FASTag: 840 orders, 675 active, 80.4%. Onboarding: 98.3% pick a role once shown; the 37% gap after login is next."
    },

    /* 11 — NEXT */
    {
      section: "next", type: "qa",
      eyebrow: "What the data changed",
      headline: ["Where people stopped became the next quarter"],
      sub: "Fix the leaks, then extend the platform.",
      qs: [
        { tag: "Fix", q: "37% drop after login", a: "Carry people from OTP straight into setup." },
        { tag: "Fix", q: "37% reach recharge", a: "Recharge in {{one tap from home|recharge}}." },
        { tag: "Fix", q: "Getting to Add money", a: "{{71.9%|wallet}} finish once they tap it; surface it sooner." },
        { tag: "Build", q: "GST invoices", a: "GSTIN at payment, PAN auto-fetch, bulk invoices." },
        { tag: "Build", q: "Wallet to bank", a: "Self-serve refunds in under two minutes." },
        { tag: "Build", q: "AI for FASTag", a: "Flag odd toll charges, suggest recharges, predict low balance." }
      ],
      notes: "The funnels set the roadmap: fix the two leaks, then GST, refunds and an AI assistant for FASTag."
    },

    /* 12 — CLOSE */
    {
      section: "next", type: "close",
      eyebrow: "Key takeaways",
      headline: ["Let the owner finish alone"],
      wins: [
        { n: "{{80.4%|fastag}}", l: "orders → active tag" },
        { n: "{{98.3%|onboarding}}", l: "pick a role once shown" }
      ],
      rows: [
        { k: "My role", d: "Led design 0→1: platform model, flows, and every screen, in 8 weeks." },
        { k: "Learned", d: "Design the shared layer; the second service ships faster." },
        { k: "Next", d: "Fix the login gap, then GST, refunds and AI for FASTag." }
      ],
      award: { img: "tut-ai.webp", caption: "Exploring next · AI for FASTag", phone: true },
      cta: [
        { label: "Full case study", href: "./delfin.html", primary: true },
        { label: "Next project →", href: "./profile.html#featured" }
      ],
      notes: "Close: the goal was always that a truck owner can finish alone and trust it."
    }
  ]
};
