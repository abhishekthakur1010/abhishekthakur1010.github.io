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
    { id: "design", n: "03", label: "Design" },
    { id: "results", n: "04", label: "Impact" }
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
      calc: [["Dock throughput", "68%"], ["Put compliance", "65%"], ["Shipments ageing past 12 hrs", "20K–25K", 1]],
      observed: "Baseline at a large gateway before the redesign.",
      takeaway: "Rich data existed; nobody could act on it fast enough."
    }
  },

  slides: [
    /* 01 — OVERVIEW */
    {
      section: "context", type: "opening",
      eyebrow: "Delhivery · Mid-mile · HubEye",
      headline: ["The hub's ", "digital twin"],
      highlight: "digital twin",
      body: "Live operations on the real floor, so problems show where they happen.",
      heroWide: "hub-map-panel.webp", url: "eye.delhivery.com/mid-mile/hub",
      badge: { n: "{{Up to −33%|ageing}}", l: "Shipment ageing" },
      meta: [
        { l: "My role", v: "Design lead · direction to rollout" },
        { l: "Timeline", v: "2025–26 · live in hubs" },
        { l: "Users", v: "Hub managers · supervisors · central ops" },
        { l: "After rollout", v: "{{46% → 54%|obsl}} on-time departures" }
      ],
      notes: "HubEye is the control room for Delhivery's hubs. Supervisors could see every number but act on none of them. We turned it into a digital twin of the floor: grey is normal, red is act now, click anything for the why. Numbers are underlined; click to show the evidence. The brief was to refresh the HubEye dashboard; it became helping supervisors act on issues in real time. Why fix it: ageing shipments and late departures across 140+ hubs. Users: hub managers and supervisors, on the move, 24/7. Out of scope: sorter controls, yard scheduling and manpower planning."
    },

    /* The "Asking the right questions" slide was merged away: its users, 14 tabs and Excel
       workaround repeat the Existing HubEye, Research and Problem slides; the brief, the 140+ hubs
       and the scope now sit in the opening's notes. */

    /* WHY HUBS MATTER — the bicycle-wheel metaphor: seller → hub → doorstep (built by the enhancer) */
    {
      section: "context", type: "pair",
      eyebrow: "Why hubs matter",
      headline: ["Everything turns on the hub"],
      highlight: "the hub",
      sub: "Like a bicycle wheel: spokes run from sellers to doorsteps, and all of them meet at the hub.",
      figs: [],
      wheel: {
        legs: [
          { k: "First mile", t: "Seller", d: "Picked up from the seller" },
          { k: "Middle mile", t: "Hub", d: "Sorted, staged and line-hauled" },
          { k: "Last mile", t: "Doorstep", d: "Delivered to the customer" }
        ],
        stats: [
          { n: "107M+", l: "Shipments through Delhivery in one month (Oct 2025)" },
          { n: "7.2M", l: "Shipments on a single peak day" },
          { n: "₹19,000 Cr+", l: "Worth of goods moved that month" },
          { n: "~₹2 Cr", l: "Of goods astray a month if just 1 in 10,000 is misplaced", hot: 1 }
        ],
        line: "The hub is the heavy, sensitive core. If it wobbles, the whole ride does.",
        src: "Delhivery network updates, Sep–Oct 2025. ~₹2 Cr is illustrative: 0.01% of 107M shipments at that month's average value (~₹1,800)."
      },
      notes: "Before the hub floor, why the hub matters. Think of a bicycle wheel. On one side of the rim is the seller, where the first mile starts with a pickup. On the other side is the customer's doorstep, where the last mile ends. In the centre is the hub: the middle mile, where every consignment is unloaded, sorted, staged and loaded onto line-haul trucks. Every spoke runs through it, so it carries the most load and is the most sensitive part of the network. The scale: Delhivery moved over 107 million shipments in October 2025, worth more than 19,000 crore rupees, with a single-day peak of 7.2 million. At that volume even a tiny error rate is expensive: misplace just 1 in 10,000 and about 2 crore rupees of goods goes astray every month. That is why a hub needs a view that shows problems the moment they happen."
    },

    /* WHAT A HUB IS — the annotated floor photo with a few numbers (built by the enhancer) */
    {
      section: "context", type: "pair",
      eyebrow: "What a hub is",
      headline: ["Inside a Delhivery hub"],
      highlight: "Delhivery hub",
      sub: "Where shipments are sorted, staged and loaded, around the clock.",
      figs: [],
      hub: {
        img: "hub-floor-annotated.webp",
        cap: "A Delhivery hub floor: automatic sorters, docking stations and sectors 1 to 4, with 1,00,000+ shipments inside",
        stats: [
          { n: "140+", l: "Hubs and gateways across India" },
          { n: "100+", l: "Floor sectors per hub" },
          { n: "1.2M+", l: "Sq ft at the largest hubs" },
          { n: "24/7", l: "Round-the-clock operations" }
        ],
        flow: ["Inbound dock", "Sectors", "Outbound dock"]
      },
      notes: "Before the software, the place. A Delhivery hub is where shipments are unloaded at inbound docks, sorted by automatic sorters into floor sectors by destination, staged, and loaded onto outbound vehicles, around the clock. There are 140+ hubs and gateways across India, each with 100+ floor sectors; the largest exceed 1.2 million square feet, and a single hub holds 1,00,000+ shipments at a time. Every one of those zones needs decisions in minutes."
    },

    /* THE EXISTING HUBEYE */
    {
      section: "context", type: "pair",
      eyebrow: "The existing HubEye", device: "laptop",
      headline: ["Rich data, passive experience"],
      highlight: "passive experience",
      sub: "Alerts, tiles and tables across 14 tabs.",
      figs: [
        { img: "old-overview-browser.webp?v=2", t: "Overview tab", d: "Alert counts and tiles, no location or priority.", tag: "Before" },
        { img: "old-floorops.webp?v=3", t: "Floor ops tab", d: "Sector health as long tables to scan.", tag: "Before" }
      ],
      notes: "This is what supervisors had: alerts, tiles and tables across 14 tabs. Plenty to read, nothing that said where to act. Every number was there, but as counts and tables. To find a problem they had to read, cross-check tabs, then export."
    },

    /* 04 — THE BUSINESS PROBLEM: what watching-not-acting cost (stat cards built by the enhancer) */
    {
      section: "context", type: "pair",
      eyebrow: "The business problem",
      headline: ["Watching, while shipments age"],
      highlight: "shipments age",
      sub: "Supervisors could watch but not act, so shipments aged and went missing.",
      figs: [],
      biz: {
        lead: { n: "~₹5 Cr", u: "a month", l: "Lost to missing or lost shipments at hubs" },
        stats: [
          { n: "~₹60 Cr", l: "A year, at that rate" },
          { n: "20K–25K", l: "Shipments ageing past 12 hrs at a hub" },
          { n: "68%", l: "Dock throughput: unloading and loading" },
          { n: "140+", l: "Hubs and gateways carrying the risk" }
        ],
        hmw: "How might we help hub managers spot and act on issues in real time, without external analysis tools?"
      },
      notes: "This is what watching without acting cost. Delhivery was losing about 5 crore rupees a month to missing or lost shipments at hubs; at that rate, about 60 crore a year. At a large gateway, 20K–25K shipments sat ageing past 12 hours, and dock throughput, the productivity of unloading and loading, was at 68%. And this runs across 140+ hubs and gateways. Put compliance (65% before) was one of the floor metrics, but not the core problem: ageing, missing shipments and productivity were. Why it happened: supervisors couldn't see where the problem was, because HubEye showed tables and tiles with no hub layout and took 14 tabs to see the whole hub. They couldn't tell what to fix first, because every number looked equally important and there was no alert or priority layer. And they couldn't see why something was red, because the insight lived outside the tool: Excel and paper, with 6+ hours lost every shift. Supervisors didn't lack data; they lacked a view that told them where to act and why."
    },

    /* 03 — RESEARCH ON THE FLOOR */
    {
      section: "discover", type: "board", tall: true,
      eyebrow: "Research",
      headline: ["Designed on the hub floor"],
      highlight: "hub floor",
      sub: "Field visits with hub managers, supervisors and floor teams.",
      cards: [
        { k: "Control room", tag: "Observed", img: "control-room.webp", stat: "3 screens",
          learned: "HubEye, cameras and a sheet, side by side." },
        { k: "The workaround", tag: "Observed", proof: "workflow", img: "sheet-workaround.webp", stat: "{{6+ hrs|workflow}}",
          learned: "Shift data rebuilt in spreadsheets and paper slips." },
        { k: "Supervisor sessions", tag: "Research", img: "on-the-floor.webp", stat: "On the floor",
          learned: "“Tell me which dock, not which row.”" },
        { k: "Sorter line", tag: "Observed", img: "research-observe.webp", stat: "Induction",
          learned: "Jams show on the floor before the dashboard." }
      ],
      notes: "We spent time in the hubs: control room, docks, sorter, and with supervisors. Designed on the hub floor, not at a desk. In the control room, HubEye was on one screen, camera feeds on another and a sheet on the third. Shift data was rebuilt in spreadsheets and paper unloading slips. A supervisor: “Tell me which dock, not which row in a table.” Delays start at the dock and ripple into sectors within the hour. Rejections and jams are seen on the floor before the dashboard. Every station has data; nobody has the whole hub in one view. The clearest finding: the tool lost to the spreadsheet. People needed location and priority, not more numbers."
    },

    /* 05 — IDEATION & COLLABORATION */
    {
      section: "design", type: "collab",
      eyebrow: "Ideation & collaboration",
      headline: ["Built with the hub team"],
      highlight: "hub team",
      sub: "From floor walks to a shipped digital twin.",
      steps: [
        { img: "floor-walkthrough.webp", t: "Floor walkthrough", who: "Design + hub managers", out: "Mapped how supervisors move in a shift" },
        { img: "research-observe.webp", t: "Live observation", who: "Design + floor teams", out: "Found where delays start: docks and sorter" },
        { img: "field-sorter.webp", t: "Layout mapping", who: "Design + engineering", out: "Real hub layout as the base, 1:1" },
        { img: "team-tauru.webp", t: "Review at Tauru", who: "Design + ops leadership", out: "Grey or red only, signed off for rollout" }
      ],
      notes: "Every decision was made with the hub team: walk the floor, watch the docks and sorter, map the real layout, review at Tauru Gateway."
    },

    /* 06 — THE IDEA: MAP THE PHYSICAL HUB (sets up the dashboard that follows) */
    {
      section: "design", type: "hubmap",
      eyebrow: "The idea: map the physical hub",
      headline: ["A city of docks and sectors"],
      highlight: "docks and sectors",
      sub: "Supervisors think in this layout, so the dashboard should too.",
      aerial: "hub-aerial.webp", aerialTag: "Illustrative", place: "Tauru Gateway · near Gurgaon",
      stats: [{ n: "159", l: "docks" }, { n: "100+", l: "sectors" }, { n: "59K", l: "shipments inside" }],
      planK: "The floor plan, as HubEye maps it",
      plan: "layout-tauru.webp",
      legend: [
        { sw: "dock", k: "Docks", d: "Every edge. Trucks unload and load here." },
        { sw: "sector", k: "Sectors", d: "Rows inside, bags sorted by destination." },
        { sw: "stg", k: "Staging", d: "Hatched zones where bags await vehicles." }
      ],
      notes: "A hub is a city of docks and sectors. The idea before the screens. Docks sit on every edge: trucks unload inbound and load outbound. Sectors are the rows inside, where bags are sorted and put away by destination. Staging is the hatched zones where bags wait for their vehicle. 57 inbound and 102 outbound docks wrap Tauru Gateway; 100+ sectors inside; about 59K shipments in the building at any time. Press → to show the floor plan: this is the mental model supervisors already have, so we mapped it 1:1 as the dashboard. Next slide: the twin itself."
    },

    /* 07 — THE SOLUTION: one screen, the old Overview wiped away by a curtain (built by the enhancer) */
    {
      section: "design", type: "pair",
      eyebrow: "The solution",
      headline: ["The answer: a digital twin"],
      highlight: "a digital twin",
      sub: "Drag the line to compare before and after.",
      figs: [],
      twin: {
        before: "old-overview.webp?v=3", after: "hub-map-full.webp?v=2",
        cap: "HubEye digital twin: the whole hub mapped 1:1, with problem docks and sectors in red",
        labels: [ { n: "1:1", k: "Real layout", d: "Every dock where it is" }, { n: "2", k: "Colours only", d: "Grey fine, red act now" }, { n: "1 click", k: "To the why", d: "Bags, ETD and ageing" } ]
      },
      notes: "The hub, mapped 1:1; problems show where they happen. The screen opens on the old Overview tab, then the curtain wipes it away to the digital twin. Three ideas carry it. The map: every dock, sector and yard lane sits where it is on the floor. Grey or red: two states, no in-between colours to decode, so supervisors scan 300+ sectors in seconds. One click for the why: bags, ETD, ageing and compliance, with red rows saying what's wrong. Around the map: always-on hub vitals (shipments, yard, docks, manpower and compliance), an hour-by-hour yard forecast of vehicles in yard vs planned docks with overflow in red, and 158 live floor camera views, so a red dock can be checked on camera without leaving the map. Click the screen to enlarge."
    },

    /* AROUND THE MAP — the why on click, and what's coming next */
    {
      section: "design", type: "pair",
      eyebrow: "Around the map", device: "laptop",
      headline: ["The why, one click away"],
      highlight: "one click away",
      sub: "Click a sector for its reasons, then check it on camera.",
      figs: [
        { img: "hub-zoom-panel.webp", tone: "fit", t: "Click any sector", d: "Bags, ETD and only the signals that matter.", tag: "After" },
        { img: "floor-images.webp", tone: "fit", t: "See the floor live", d: "Every dock and floor camera on one screen.", tag: "After" }
      ],
      notes: "Around the map: click any sector to get the why, bags, ETD, ageing and compliance, red rows for what's wrong. And look ahead: the yard forecast shows vehicles against planned docks hour by hour, overflow in red."
    },

    /* 07 — IMPACT (outcomes and the money card built by the enhancer; numbers in green) */
    {
      section: "results", type: "results",
      eyebrow: "Impact",
      headline: ["From watching to acting"],
      highlight: "acting",
      sub: "Supervisors use it, it's simpler, and it drives action.",
      hero: [
        { k: "Shipment ageing", pre: 100, post: 92, pt: "100", qt: "92", d: "{{−8%|ageing}}", sub: "indexed, lower is better" },
        { k: "Ageing at Ionad hub", pre: 100, post: 67, pt: "100", qt: "67", d: "{{−33%|ageing}}", sub: "indexed, lower is better" },
        { k: "On-time departures", pre: 46, post: 54, pt: "46%", qt: "54%", d: "{{+8 pts|obsl}}", sub: "OBSL" },
        { k: "Put compliance", pre: 65, post: 79, pt: "65%", qt: "79%", d: "{{+14 pts|putc}}", sub: "right sector, on time" }
      ],
      checksTitle: "", checks: [], moreTitle: "", more: [],
      outcomes: {
        k: "What changed on the floor",
        items: [
          { t: "Adopted", d: "Supervisors adopted it hub-wide" },
          { t: "Simpler", d: "One map, not 14 tabs" },
          { t: "Action-driven", d: "Red means act now" }
        ],
        money: { n: "₹ crores", l: "Saved for Delhivery" }
      },
      disclaimer: "Delhivery hub reporting, before vs after rollout. Ageing shown as an index (before = 100).",
      notes: "From watching to acting. Supervisors adopted it hub-wide, it is simpler, one map instead of 14 tabs, and it drives action, because red means act now. Delhivery saves crores of rupees. The measured results: shipment ageing down 8% across hubs and 33% at Ionad, on-time departures 46% to 54%, and put compliance 65% to 79%. These are before/after, not an A/B test. What shipped: the real hub layout 1:1, two states, grey or red, and 158 live camera views. Live at Tauru Gateway today: put compliance 96.36%, 59,375 shipments in the centre, and 59 of 102 outbound docks live."
    },

    /* 08 — KEY TAKEAWAYS */
    {
      section: "results", type: "close",
      eyebrow: "Key takeaways",
      headline: ["Show where to act"],
      highlight: "where to act",
      sub: "A dashboard earns its place when people know what's next.",
      wins: [],   // the Impact slide already carries the wins
      rows: [
        { k: "My role", d: "Direction, critiques and hub ops alignment." },
        { k: "Learned", d: "Location and colour beat any new chart." },
        { k: "Next", d: "Simulate layout changes before moving a rack." }
      ],
      award: { img: "team-tauru.webp", caption: "Team Tauru · Delhivery" },
      cta: [
        { label: "Full case study", href: "./hubeye.html", primary: true },
        { label: "Next project →", href: "./profile.html#featured" }
      ],
      notes: "Close on the principle: a dashboard earns its place when the person reading it knows what to do next. My role: set the direction, ran critiques and aligned hub ops, working with 3 designers, 5 PMs, 20+ ops leaders and 7 developers. Learned: location and colour did more than any new chart. Next: from monitoring to simulation, testing layout changes before moving a rack."
    }
  ]
};

/* Short headings: one key phrase in the red accent, plus the subtitle where a template has no slot
   for it. Runs before the engine's requestAnimationFrame wiring. */
(function () {
  var D = window.DECK, stage = document.getElementById("deckStage");
  if (!stage || !window.MutationObserver) return;
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function enhance(el) {
    var eb = el.querySelector(".eyebrow");
    var hs = eb && D.slides.filter(function (s) { return s.highlight && s.type !== "opening" && s.eyebrow === eb.textContent; })[0];
    var h2 = hs && el.querySelector("h2");
    if (!h2) return;
    h2.innerHTML = hs.headline.map(function (part) { return esc(part).replace(esc(hs.highlight), "<span class='hl'>" + esc(hs.highlight) + "</span>"); }).join("<br>");
    if (hs.sub && !h2.parentNode.querySelector(".sub")) {
      var sp = document.createElement("p"); sp.className = "sub"; sp.textContent = hs.sub;
      h2.parentNode.insertBefore(sp, h2.nextSibling);
    }
    // laptop screens open in the lightbox (smooth zoom) instead of zooming in place
    Array.prototype.forEach.call(el.querySelectorAll(".pr-laptop .pr-img"), function (x) { x.classList.remove("zoomable"); x.classList.add("rv-shot"); });
    var hrow = hs.hub && el.querySelector(".pr-row");
    if (hrow) {   // what a hub is: a few numbers beside the annotated floor photo, the flow under it
      var hb = hs.hub;
      hrow.className = "hb-hub";
      hrow.innerHTML = "<div class='hbh-stats'>" + hb.stats.map(function (x) { return "<div class='hbh-stat'><b>" + esc(x.n) + "</b><span>" + esc(x.l) + "</span></div>"; }).join("") + "</div>" +
        "<div class='hbh-visual'><figure class='rv-shot hbh-shot' title='Click to enlarge'><img src='" + D.imgBase + hb.img + "' alt='" + esc(hb.cap) + "'></figure>" +
        "<ol class='hbh-flow'>" + hb.flow.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></div>";
    }
    var wrow = hs.wheel && el.querySelector(".pr-row");
    if (wrow) {   // why hubs matter: a flat bicycle wheel; one parcel travels seller → hub → doorstep and the labels light up in step
      var w = hs.wheel, sp = "", i, a;
      for (i = 0; i < 32; i++) {   // crossed lacing: each spoke leaves the flange and lands a few degrees on
        a = i * Math.PI / 16; var b = a + (i % 2 ? 0.55 : -0.55);
        sp += "<line x1='" + (13 * Math.cos(a)).toFixed(2) + "' y1='" + (13 * Math.sin(a)).toFixed(2) + "' x2='" + (86 * Math.cos(b)).toFixed(2) + "' y2='" + (86 * Math.sin(b)).toFixed(2) + "'/>";
      }
      var ico = [
        "<path d='M3 9l1.5-5h15L21 9'/><path d='M4 9v11h16V9'/><path d='M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0'/><path d='M10 20v-6h4v6'/>",
        "",
        "<path d='M3 11l9-8 9 8'/><path d='M5 10v10h14V10'/><path d='M10 20v-6h4v6'/>"
      ];
      var leg = function (j) {
        var x = w.legs[j];
        return "<div class='hw-leg hw-leg-" + j + "'>" + (ico[j] ? "<svg class='hw-ico' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" + ico[j] + "</svg>" : "") +
          "<span>" + esc(x.k) + "</span><b>" + esc(x.t) + "</b><em>" + esc(x.d) + "</em></div>";
      };
      wrow.className = "hb-wheel";
      wrow.innerHTML =
        "<div class='hw-stage'><div class='hw-grid'>" + leg(1) + leg(0) +
          "<svg class='hw-svg' viewBox='-100 -100 200 200' role='img' aria-label='A bicycle wheel: the seller on the left of the rim, the hub at the centre, the doorstep on the right'>" +
            "<circle class='hw-tire' r='93'/><circle class='hw-rim' r='87.5'/><g class='hw-spokes'>" + sp + "</g>" +
            "<line class='hw-track' x1='-93' y1='0' x2='93' y2='0'/><line class='hw-go' x1='-93' y1='0' x2='93' y2='0' pathLength='186'/>" +
            "<g class='hw-parcel'><rect x='-6' y='-6' width='12' height='12' rx='2.2'/><path d='M-6 -1.2h12M0 -6v12'/></g>" +
            "<circle class='hw-pulse' r='20'/><circle class='hw-hub-halo' r='24'/><circle class='hw-hub' r='18'/>" +
            "<path class='hw-hub-ico' d='M-8.5 7V-2.5L0 -7.5 8.5 -2.5V7Z M-3.5 7V1h7v6'/>" +
            "<circle class='hw-pin hw-pin-l' cx='-93' r='5.5'/><circle class='hw-pin hw-pin-r' cx='93' r='5.5'/>" +
          "</svg>" + leg(2) +
        "</div></div>" +
        "<div class='hw-side'><div class='hw-stats'>" + w.stats.map(function (x) { return "<div class='hw-stat" + (x.hot ? " hot" : "") + "'><b>" + esc(x.n) + "</b><span>" + esc(x.l) + "</span></div>"; }).join("") + "</div>" +
        "<p class='hw-line'>" + esc(w.line) + "</p><p class='hw-src'>" + esc(w.src) + "</p></div>";
    }
    var row = hs.biz && el.querySelector(".pr-row");
    if (row) {   // business problem: the money figure large, the other stats beside it
      var b = hs.biz;
      row.className = "hb-biz";
      row.innerHTML = "<div class='hb-lead'><span class='hb-k'>The cost</span><b>" + esc(b.lead.n) + "<small>" + esc(b.lead.u) + "</small></b><span class='hb-l'>" + esc(b.lead.l) + "</span></div>" +
        b.stats.map(function (s) { return "<div class='hb-stat'><b>" + esc(s.n) + "</b><span>" + esc(s.l) + "</span></div>"; }).join("");
      if (b.hmw) { var hm = document.createElement("p"); hm.className = "hb-hmw"; hm.innerHTML = "<span>How might we</span>" + esc(b.hmw.replace(/^How might we /, "")); row.parentNode.insertBefore(hm, row.nextSibling); }
    }
    var trow = hs.twin && el.querySelector(".pr-row");
    if (trow) {   // solution: one screen; the old Overview sits on top and a curtain wipes it away (same reveal as the Jarvis deck)
      var t = hs.twin, still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      trow.className = "hb-twin";
      // drag the line (or use arrow keys) to compare the old Overview with the twin
      trow.innerHTML = "<span class='hbt-shot hbt-cmp' style='--x:50%'><img src='" + D.imgBase + t.after + "' alt='" + esc(t.cap) + "'>" +
        "<span class='hbt-before' aria-hidden='true'><img src='" + D.imgBase + t.before + "' alt=''></span>" +
        "<span class='hbt-edge' aria-hidden='true'><i></i></span>" +
        "<span class='hbt-tag hbt-tag-b' aria-hidden='true'>Before</span><span class='hbt-tag hbt-tag-a' aria-hidden='true'>After</span>" +
        "<input class='hbt-range' type='range' min='0' max='100' value='50' step='0.5' aria-label='Compare the old dashboard with the digital twin'></span>" +
        "<ul class='hbt-labels'>" + t.labels.map(function (x) { return typeof x === "string" ? "<li>" + esc(x) + "</li>" : "<li class='hbt-win'><b>" + esc(x.n) + "</b><span><strong>" + esc(x.k) + "</strong>" + esc(x.d) + "</span></li>"; }).join("") + "</ul>";
      var cmp = trow.querySelector(".hbt-cmp"), rg = trow.querySelector(".hbt-range");
      rg.addEventListener("input", function () { cmp.style.setProperty("--x", rg.value + "%"); });
      rg.addEventListener("keydown", function (e) { e.stopPropagation(); });
      ["click", "pointerdown"].forEach(function (ev) { rg.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    }
    var low = hs.outcomes && el.querySelector(".im-low");
    if (low) {   // impact: the outcomes supervisors felt, and the money card, in place of the panels
      var o = hs.outcomes;
      el.querySelector(".sl").classList.add("hb-impact");
      low.className = "im-low hb-out reveal";
      low.innerHTML = "<div class='im-panel'><div class='tier-label'>" + esc(o.k) + "</div><ul class='hbo-list'>" +
        o.items.map(function (x) { return "<li><span class='hbo-chk' aria-hidden='true'>✓</span><b>" + esc(x.t) + "</b><span>" + esc(x.d) + "</span></li>"; }).join("") + "</ul></div>" +
        "<div class='hbo-money'><b>" + esc(o.money.n) + "</b><span>" + esc(o.money.l) + "</span></div>";
    }
  }
  new MutationObserver(function (muts) {
    muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) enhance(n); }); });
  }).observe(stage, { childList: true });
})();
