/* ============================================================
   Delhivery HubEye: hub digital twin. Same engine and structure as
   the JioMart deck (jiomart-deck.js); black and red theme.
   Flow: Overview → Right questions → Research → Problem →
         Ideation → Solution → Impact → Takeaways
   Numbers are from Delhivery hub reporting; confirm before external use.
   ============================================================ */
window.DECK = {
  imgBase: "./images/hubeye/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "discover", n: "02", label: "Discovery" },
    { id: "define", n: "03", label: "Define" },
    { id: "design", n: "04", label: "Design" },
    { id: "results", n: "05", label: "Impact" }
  ],
  proofs: {
    putc: {
      method: "Put compliance", tag: "Hub reporting · measured",
      img: "panel-top.webp", crop: 0,
      calc: [["Before the redesign", "65%"], ["After rollout", "79%"], ["Change", "+14 points", 1]],
      observed: "Share of shipments put away in the right sector on time.",
      takeaway: "With red sectors on the map, supervisors fix misplaced bags in the same shift."
    },
    obsl: {
      method: "On-time vehicle departures (OBSL)", tag: "Hub reporting · measured",
      img: "hub-zoom.webp", crop: 0,
      calc: [["Before the redesign", "46%"], ["After rollout", "54%"], ["Change", "+8 points", 1]],
      observed: "Share of outbound vehicles that left within the scheduled time.",
      takeaway: "Docks turn red when loading slips, so delays are caught before departure."
    },
    ageing: {
      method: "Shipment ageing", tag: "Hub reporting · measured",
      img: "pop-bangalore.webp", crop: 0,
      calc: [["Across hubs", "−8%"], ["Ionad hub", "−33%", 1]],
      observed: "Shipments sitting in a hub past the ageing threshold.",
      takeaway: "Every sector card shows ageing bags first, so the oldest shipments get moved."
    },
    workflow: {
      method: "The manual workaround", tag: "Field research · observed",
      img: "sheet-workaround.webp", crop: 0,
      calc: [["Export data", "~30 min"], ["Clean in Excel, pivot", "+2 hrs"], ["Find the bottleneck", "+3 hrs"], ["Lost per shift", "6+ hrs", 1]],
      observed: "Supervisors pulled HubEye data into spreadsheets and paper slips to decide what to fix.",
      takeaway: "By the time a decision reached the floor, the shipment was already stuck."
    },
    baseline: {
      method: "Where it hurt", tag: "Hub reporting · measured",
      img: "control-room.webp", crop: 0,
      calc: [["Dock throughput", "68%"], ["Put compliance", "65%"], ["Shipments ageing past 12 hrs", "3,400+", 1]],
      observed: "Baseline at a large gateway before the redesign.",
      takeaway: "Rich data existed; nobody could act on it fast enough."
    }
  },

  slides: [
    /* 01 — OVERVIEW */
    {
      section: "context", type: "opening",
      eyebrow: "Delhivery · Mid-mile · HubEye",
      headline: ["Turning HubEye into a ", "digital twin", " of the hub"],
      highlight: "digital twin",
      body: "Supervisors could see every number but act on none of them. We mapped live operations onto the real hub floor, so problems show up where they happen.",
      heroWide: "hub-map-panel.webp", url: "eye.delhivery.com/mid-mile/hub",
      badge: { n: "{{65% → 79%|putc}}", l: "Put compliance" },
      meta: [
        { l: "My role", v: "Design lead · direction to rollout" },
        { l: "Timeline", v: "2025–26 · live in hubs" },
        { l: "Users", v: "Hub managers · supervisors · central ops" },
        { l: "After rollout", v: "{{46% → 54%|obsl}} on-time departures" }
      ],
      notes: "HubEye is the control room for Delhivery's hubs. It was rich in data but passive. We turned it into a digital twin of the floor: grey is normal, red is act now, click anything for the why. Numbers are underlined; click to show the evidence."
    },

    /* 02 — THE PHYSICAL HUB */
    {
      section: "context", type: "hubmap",
      eyebrow: "The physical hub",
      headline: ["A hub is a city of docks and sectors"],
      sub: "Supervisors think in this layout, not in tables.",
      aerial: "hub-aerial.webp", aerialTag: "Illustrative", place: "Tauru Gateway · near Gurgaon",
      stats: [{ n: "159", l: "docks" }, { n: "100+", l: "sectors" }, { n: "59K", l: "shipments inside" }],
      planK: "The floor plan, as HubEye maps it",
      plan: "layout-tauru.webp",
      legend: [
        { sw: "dock", k: "Docks", d: "On every edge. Trucks unload inbound and load outbound." },
        { sw: "sector", k: "Sectors", d: "Rows inside. Bags are sorted and put away by destination." },
        { sw: "stg", k: "Staging", d: "Hatched zones where bags wait for their vehicle." }
      ],
      notes: "Set the scene. 57 inbound and 102 outbound docks wrap Tauru Gateway; 100+ sectors inside; about 59K shipments in the building at any time. Press → to show the floor plan: this is the mental model supervisors already have, so we used it as the dashboard."
    },

    /* 02 — ASKING THE RIGHT QUESTIONS */
    {
      section: "context", type: "qa",
      eyebrow: "Asking the right questions",
      headline: ["We asked why before we designed"],
      sub: "Six questions turned a dashboard refresh into a clear problem to solve.",
      qs: [
        { tag: "Business", q: "Why fix it?", a: "Ageing shipments and late departures at {{140+ hubs|baseline}}." },
        { tag: "Business", q: "What does success look like?", a: "Higher put compliance and on-time departures." },
        { tag: "User", q: "Who uses it?", a: "Hub managers and supervisors, on the move, 24/7." },
        { tag: "User", q: "What stops them?", a: "Read-only tiles across 14 tabs: no priority, no reason." },
        { tag: "User", q: "What do they do instead?", a: "Export to Excel and paper: {{6+ hrs lost a shift|workflow}}." },
        { tag: "Scope", q: "What's not included?", a: "Sorter controls, yard scheduling and manpower planning." }
      ],
      fromL: "The brief", from: "Refresh the HubEye dashboard",
      toL: "What it became", to: "Help supervisors act on issues in real time",
      notes: "Business first, then users, then scope. The key answer is the workaround: supervisors left HubEye for spreadsheets to decide anything. The brief shifted from a refresh to helping people act."
    },

    /* THE EXISTING HUBEYE */
    {
      section: "discover", type: "pair",
      eyebrow: "The existing HubEye", device: "laptop",
      headline: ["Rich data, passive experience"],
      sub: "Alerts, tiles and tables across 14 tabs. Plenty to read, nothing that said where to act.",
      figs: [
        { img: "old-overview.webp", t: "Overview tab", d: "Alert counts and tiles, with no location or priority.", tag: "Before" },
        { img: "old-floorops.webp", t: "Floor ops tab", d: "Sector health as long tables to scan by hand.", tag: "Before" }
      ],
      notes: "This is what supervisors had. Every number was there, but as counts and tables. To find a problem they had to read, cross-check tabs, then export."
    },

    /* 03 — RESEARCH ON THE FLOOR */
    {
      section: "discover", type: "board", tall: true,
      eyebrow: "Research",
      headline: ["Designed on the hub floor, not at a desk"],
      sub: "Field visits with hub managers, supervisors and floor teams.",
      cards: [
        { k: "Control room", tag: "Observed", img: "control-room.webp", stat: "3 screens",
          learned: "HubEye on one screen, camera feeds on another, a sheet on the third." },
        { k: "The workaround", tag: "Observed", proof: "workflow", img: "sheet-workaround.webp", stat: "{{6+ hrs|workflow}}",
          learned: "Shift data rebuilt in spreadsheets and paper unloading slips." },
        { k: "Supervisor sessions", tag: "Research", img: "research-discussion.webp", stat: "On the floor",
          learned: "“Tell me which dock, not which row in a table.”" },
        { k: "Dock unloading", tag: "Observed", img: "research-dock.webp", stat: "Live",
          learned: "Delays start at the dock and ripple into sectors within the hour." },
        { k: "Sorter line", tag: "Observed", img: "research-observe.webp", stat: "Induction",
          learned: "Rejections and jams are seen on the floor before the dashboard." },
        { k: "Operator screens", tag: "Observed", img: "research-sorter-screen.webp", stat: "Per station",
          learned: "Every station has data; nobody has the whole hub in one view." }
      ],
      notes: "We spent time in the hubs: control room, docks, sorter, and with supervisors. The clearest finding: the tool lost to the spreadsheet. People needed location and priority, not more numbers."
    },

    /* 04 — DEFINING THE PROBLEM */
    {
      section: "define", type: "synthesis",
      eyebrow: "Defining the problem",
      headline: ["Not a data problem. An action problem."],
      cols: ["What supervisors felt", "Why it happened", "How we know"],
      rows: [
        { theme: "Finding", symptom: "“Where is the problem?”", cause: "Tables and tiles, no hub layout",
          how: [["Research", "Supervisors think in docks and sectors"], ["Observed", "14 tabs to see the whole hub"]] },
        { theme: "Prioritising", symptom: "“What do I fix first?”", cause: "Every number looked equally important",
          how: [["Measured", "{{3,400+ shipments|baseline}} ageing past 12 hrs"], ["Observed", "No alert or priority layer"]] },
        { theme: "Acting", symptom: "“Why is it red?”", cause: "Insight lived outside the tool",
          how: [["Observed", "{{Excel and paper|workflow}} to find bottlenecks"], ["Measured", "{{6+ hrs lost|workflow}} every shift"]] }
      ],
      from: "Show more data",
      to: "Show where to act, and why",
      statement: "Supervisors didn't lack data. They lacked a view that told them where to act and why.",
      goals: [
        { k: "Put compliance", v: "{{65%|putc}} → higher" },
        { k: "On-time departures", v: "{{46%|obsl}} → higher" },
        { k: "Shipment ageing", v: "Down" }
      ],
      notes: "Read each row: what supervisors felt, why it happened, how we know. The shift: from showing more data to showing where to act and why."
    },

    /* 05 — IDEATION & COLLABORATION */
    {
      section: "design", type: "collab",
      eyebrow: "Ideation & collaboration",
      headline: ["Built with the hub team"],
      sub: "From floor walks to a shipped digital twin.",
      steps: [
        { img: "research-session.webp", t: "Floor walkthrough", who: "Design + hub managers", out: "Mapped how supervisors move through a shift" },
        { img: "research-observe.webp", t: "Live observation", who: "Design + floor teams", out: "Found where delays start: docks and sorter" },
        { img: "field-sorter.webp", t: "Layout mapping", who: "Design + engineering", out: "Real hub layout as the base, 1:1" },
        { img: "team-tauru.webp", t: "Review at Tauru", who: "Design + ops leadership", out: "Grey or red only, signed off for rollout" }
      ],
      notes: "Every decision was made with the hub team: walk the floor, watch the docks and sorter, map the real layout, review at Tauru Gateway."
    },

    /* 06 — THE SOLUTION */
    {
      section: "design", type: "board", tall: true,
      eyebrow: "The solution",
      headline: ["The hub, mapped 1:1. Problems show where they happen."],
      sub: "A digital twin of the floor: grey is normal, red is act now.",
      cards: [
        { k: "Digital twin map", tag: "Shipped", img: "hub-map-full.webp", fit: "contain", stat: "1:1 layout",
          learned: "Every dock, sector and yard lane sits where it is on the floor." },
        { k: "Grey or red", tag: "Shipped", img: "hub-zoom.webp", fit: "contain", stat: "2 states",
          learned: "No in-between colours to decode. Scan 300+ sectors in seconds." },
        { k: "Click for the why", tag: "Shipped", proof: "ageing", img: "pop-bangalore.webp", fit: "contain", stat: "1 click",
          learned: "Bags, ETD, ageing and compliance: red rows say what's wrong." },
        { k: "Hub vitals", tag: "Shipped", proof: "putc", img: "panel-top.webp", fit: "contain", stat: "Always on",
          learned: "Shipments, yard, docks, manpower and compliance beside the map." },
        { k: "Yard forecast", tag: "Shipped", img: "yard-waiting.webp", fit: "contain", stat: "Hour by hour",
          learned: "Vehicles in yard vs planned docks, overflow in red." },
        { k: "Floor cameras", tag: "Shipped", img: "floor-images.webp", fit: "contain", stat: "158 views",
          learned: "Check a red dock on camera without leaving the map." }
      ],
      notes: "Walk the six parts: the map, the two-colour rule, the click-for-why card, the always-on vitals, the yard forecast and floor cameras. Click any card to enlarge."
    },

    /* 07 — IMPACT */
    {
      section: "results", type: "results",
      eyebrow: "Impact",
      headline: ["Turning observation into operation"],
      hero: [
        { k: "Put compliance", pre: 65, post: 79, pt: "65%", qt: "79%", d: "{{+14 pts|putc}}", sub: "right sector, on time" },
        { k: "On-time departures", pre: 46, post: 54, pt: "46%", qt: "54%", d: "{{+8 pts|obsl}}", sub: "OBSL" },
        { k: "Shipment ageing", pre: 100, post: 92, pt: "100", qt: "92", d: "{{−8%|ageing}}", sub: "indexed, lower is better" },
        { k: "Ageing at Ionad hub", pre: 100, post: 67, pt: "100", qt: "67", d: "{{−33%|ageing}}", sub: "indexed, lower is better" }
      ],
      checksTitle: "What shipped",
      checks: [
        { n: "1:1", l: "real hub layout" },
        { n: "2", l: "states: grey or red" },
        { n: "158", l: "live camera views" }
      ],
      moreTitle: "Live at Tauru Gateway today",
      more: [
        { l: "Put compliance", pt: "", qt: "96.36%", d: "" },
        { l: "Shipments in centre", pt: "", qt: "59,375", d: "" },
        { l: "Outbound docks live", pt: "", qt: "59 / 102", d: "" }
      ],
      disclaimer: "Delhivery hub reporting, before vs after rollout. Ageing shown as an index (before = 100).",
      notes: "Put compliance 72 to 79, on-time departures 46 to 54, ageing down 8% and 33% at Ionad. These are before/after, not an A/B test."
    },

    /* 08 — KEY TAKEAWAYS */
    {
      section: "results", type: "close",
      eyebrow: "Key takeaways",
      headline: ["Show where to act"],
      wins: [
        { n: "{{65→79%|putc}}", l: "put compliance" },
        { n: "{{46→54%|obsl}}", l: "on-time departures" }
      ],
      rows: [
        { k: "My role", d: "Set the direction, ran critiques, aligned hub ops, with 3 designers, 5 PMs, 20+ ops leaders and 7 developers." },
        { k: "Learned", d: "Location and colour did more than any new chart." },
        { k: "Next", d: "From monitoring to simulation: test layout changes before moving a rack." }
      ],
      award: { img: "team-tauru.webp", caption: "Team Tauru · Delhivery" },
      cta: [
        { label: "Full case study", href: "./hubeye.html", primary: true },
        { label: "Next project →", href: "./profile.html#featured" }
      ],
      notes: "Close on the principle: a dashboard earns its place when the person reading it knows what to do next."
    }
  ]
};
