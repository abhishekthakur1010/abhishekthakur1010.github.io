/* ============================================================
   Delhivery Jarvis 2.0: Ticket Detail Page. Same engine and structure as
   the HubEye deck (jiomart-deck.js); black and red theme.
   Flow: Context → Problem → Research → Insight → Design → Impact → Learnings
   Figures come from the Figma file and stakeholder deck; dashboard values are samples.
   ============================================================ */
window.DECK = {
  imgBase: "./jarvis/img/",
  sections: [
    { id: "context", n: "01", label: "Context" },
    { id: "discover", n: "02", label: "Discovery" },
    { id: "define", n: "03", label: "Define" },
    { id: "design", n: "04", label: "Design" },
    { id: "results", n: "05", label: "Impact" }
  ],
  proofs: {},

  slides: [
    /* 01 — OVERVIEW */
    {
      section: "context", type: "opening",
      eyebrow: "Delhivery · CX platform · Jarvis 2.0",
      headline: ["50,000 tickets a day. ", "Only experienced agents", " knew where to\u00a0click."],
      highlight: "Only experienced agents",
      body: "Jarvis is Delhivery's one-stop ticketing platform. We redesigned its Ticket Detail Page so a new agent can resolve a ticket as confidently as one with five years' experience.",
      heroWide: "tdp.webp", url: "Jarvis · Ticket Detail Page",
      heroVideo: { mov: "../media/tdp-laptop.mov", webm: "../media/tdp-laptop.webm", poster: "../media/tdp-laptop-poster.webp" },
      badge: { n: "~50K", l: "Tickets a day" },
      meta: [
        { l: "My role", v: "Design Lead · Central Design Team" },
        { l: "Timeline", v: "Sept to Oct 2025" },
        { l: "Users", v: "~1.3K agents across CS, Ops, Security, Claims" },
        { l: "Scope", v: "TDP, with TLP and dashboard follow-ons" }
      ],
      notes: "Jarvis is Delhivery's ticketing platform. The Ticket Detail Page is where agents spend their day. The goal: a new joiner resolves a ticket as confidently as an experienced agent."
    },

    /* CONTEXT — what Jarvis is (Delhivery's own definition), then business, product and CS needs */
    {
      section: "context", type: "contextinfo",
      eyebrow: "Context",
      headline: ["One screen, three sets of needs"],
      sub: "Jarvis is the one-stop ticketing platform for the entire Delhivery ecosystem. It handles every ticket, external and internal, and is the single system of record for conversations and actions.",
      jdef: {
        hl: "one-stop ticketing platform",
        kinds: [
          { k: "External tickets", d: "Package communication with consignees, clients, shippers and consignors" },
          { k: "Internal tickets", d: "Requests between teams: PSI, Recon Digital, CCTV tracking, Ops and more" }
        ],
        users: ["CS", "Security", "Finance", "Claims", "Cross-Border", "PSI", "CCTV tracking", "Maintenance"]
      },
      flow: [
        { k: "Business", t: "Every ticket inside its SLA", icon: "star", pts: [["Goal", "Resolve every ticket in SLA, at Delhivery's scale"], ["Today", "Tickets breach SLA; some sit overdue for months"]] },
        { k: "Product", t: "One portal for everyone", icon: "brief", pts: [["Goal", "One portal for CS, Ops and anyone with Jarvis access"], ["Today", "Agents hop to HQ and the Escalation Matrix"]] },
        { k: "Users · CS team", t: "“What do I do next?”", icon: "people", tone: "pos", pts: [["Goal", "What happened, what's next, in one click"], ["Today", "Hidden actions, no escalation button, unclear SLA"]] }
      ],
      reality: { big: "~50K", l: "tickets a day, internal and external", dots: 0 },
      stats: [
        { n: "~1.3K", l: "active agents across cross-functional teams" }
      ],
      notes: "Jarvis is Delhivery's one-stop ticketing platform: every external and internal ticket lives here. Three sides of the same screen: the business needs tickets inside SLA, the product needs one portal, and CS agents need to know what to do next."
    },

    /* THE MOMENT — the old TDP plus the tools it depended on (built by the enhancer) */
    {
      section: "context", type: "pair",
      eyebrow: "The moment",
      headline: ["A ticket lands. It's already 88 days overdue."],
      figs: [],
      scatter: {
        main: { img: "jarvis-old-tdp.webp", full: "jarvis-old-tdp-full.webp", k: "Jarvis · the ticket", d: "Overdue, buried under private notes." },
        side: [
          { img: "context/escalation-matrix-thumb.webp", full: "context/escalation-matrix.webp", pos: "left top", k: "Escalation Matrix", d: "Who to escalate to? Look it up here.", alt: "Delhivery Control Tower Escalation Matrix: L1 to L6 escalation contacts per facility, contact details blurred" },
          { img: "context/hq-tracking-thumb.webp", full: "context/hq-tracking.webp", pos: "left top", k: "HQ · shipment tracking", d: "Where's the shipment? Check HQ.", alt: "HQ by Delhivery shipment page: delivery status, consignee details, AI summary and scan history" }
        ],
        line: "One ticket. Three tools. No single place to act."
      },
      notes: "Open on a real moment. The ticket is 88 days overdue, and to act on it the agent has to leave Jarvis for HQ, then the Escalation Matrix, then Excel. Click any screen to enlarge it."
    },

    /* 05 — THE REAL PROBLEM */
    {
      section: "discover", type: "synthesis",
      eyebrow: "The real problem",
      headline: ["Only experienced agents could use this screen"],
      cols: ["What agents asked", "Why it happened"],
      rows: [
        { theme: "Context", symptom: "“Where is the shipment?”", cause: "Information scattered across TDP, HQ and the Escalation Matrix" },
        { theme: "Reading", symptom: "“What happened here?”", cause: "No way to summarise long threads" },
        { theme: "Escalating", symptom: "“Who do I send this to?”", cause: "Escalation meant copying and pasting email IDs" },
        { theme: "Deadline", symptom: "“When is it due?”", cause: "SLA and next-response dates not visible upfront" }
      ],
      statement: "Experienced agents memorised where things hide; new joiners had no clear next action. Hidden actions became missed SLAs.",
      goals: [
        { k: "5 tools", v: "to resolve one ticket" },
        { k: "7 min", v: "before the first reply" },
        { k: "30 email IDs", v: "cap on a note" }
      ],
      notes: "Experienced agents were productive because they memorised the tool. New agents had no visible escalation button and no next step."
    },

    /* RESEARCH — everything on one board, like the Discovery deck */
    {
      section: "discover", type: "board", tall: true,
      eyebrow: "Research",
      headline: ["We sat with the people racing the SLA clock"],
      sub: "Map the tool, listen to the floor, then benchmark.",
      cards: [
        { k: "IA map", tag: "Map", img: "jarvis-ia-flow.webp", pos: "30% center", stat: "3 panels · ~100 teams", learned: "Every path from login to resolution, mapped." },
        { k: "Floor sessions", tag: "Listen", img: "interview.webp", pos: "center top", stat: "Agents + supervisors", learned: "“What happened? What do I do next?”" },
        { k: "Pain points", tag: "Synthesis", img: "research/cs-session-meet.webp", pos: "center center", stat: "30 email IDs", learned: "Note cap, tool hopping, buried P0 info." },
        { k: "CS lead's email", tag: "Co-create", img: "research/cs-suggestions-email.webp", pos: "left top", stat: "10 suggestions", learned: "Ageing in hours, escalation in the TDP, reassignment alerts." },
        { k: "Heuristic audit", tag: "Audit", img: "jarvis-old-tdp.webp", pos: "left top", stat: "~60 findings", learned: "Visibility, consistency, control and clutter.", link: "https://app.notion.com/p/User-Shadowing-Insights-40b24f9deb4880559c14c41693f65f4c", linkLabel: "Open in Notion" },
        { k: "Benchmarks", tag: "Benchmark", img: "competitive/intercom.webp", pos: "left top", stat: "4 tools", learned: "Freshdesk, HelpScout, Zendesk. Intercom set the north star." }
      ],
      notes: "All research on one board. We mapped the old TDP, sat with agents and supervisors, consolidated pain points, took the CS lead's ten suggestions, audited the live tool and benchmarked four help desks. Click any image to open it."
    },

    /* 07 — INSIGHT */
    {
      section: "define", type: "voice",
      eyebrow: "Insight",
      headline: ["Agents aren't trying to analyse. They're trying to fix."],
      quotes: [
        { q: "Tell me what happened.", src: "Need 1 · Context, P0 facts and a summary at a glance" },
        { q: "Tell me what to do next.", src: "Need 2 · SLA timers and the next action without scrolling" },
        { q: "Let me do it in one click.", src: "Need 3 · Reply, note, forward and escalate in place" }
      ],
      end: "That one line from research became the brief.",
      notes: "Every screen decision had to answer these three questions in the first seconds of opening a ticket."
    },

    /* 07c — NORTH STAR VISION (component in js/jarvis-northstar.js) */
    {
      section: "define", type: "pair",
      eyebrow: "North star vision",
      headline: ["A ticket = a conversation + actions + intelligence"],
      figs: [], northstar: true,
      notes: "The north star and the seven product pillars. Blue pillars serve the conversation, red ones the actions, violet ones the intelligence layer."
    },

    /* 09 — TDP 2.0: the V1 screen with live numbered markers and a linked legend (built by the enhancer) */
    {
      section: "design", type: "pair",
      eyebrow: "TDP 2.0",
      headline: ["One screen that answers “what's next”"],
      figs: [],
      zones: {
        img: "v1/06.webp", cap: "TDP 2.0: the Escalate to Ops moment, with the six zones numbered",
        pins: [
          { x: 11.0, y: 44.0, t: "Queue-aware list", d: "SLA in words on every ticket." },
          { x: 61.4, y: 20.0, t: "Ticket header", d: "Category, client, source and MAWB on one line." },
          { x: 83.4, y: 18.6, t: "AI summary", d: "The gist and current blocker." },
          { x: 75.9, y: 51.9, t: "Conversation first", d: "A chat, not an email chain." },
          { x: 59.0, y: 73.7, t: "Escalation is a button", d: "Facility and TL/ATL prefilled." },
          { x: 92.8, y: 44.0, t: "Properties", d: "Status, team, category, one Update." }
        ]
      },
      notes: "Same Tata Steel ticket in TDP 2.0. Hover a zone on the left to find it on the screen; click the screen to enlarge."
    },

    /* 09b — V1 CLICK-THROUGH (prototype mounted by js/jarvis-proto.js) */
    {
      section: "design", type: "pair",
      eyebrow: "V1 iteration",
      headline: ["Click through the first version"],
      figs: [], proto: true,
      notes: "Fourteen V1 screens wired up like a prototype. Click the red dot on each screen: reply, note, escalate, AI summary, voice reply, ticket details, related tickets, canned responses."
    },

    /* V2 — after usability testing the docked queue went (same screen + legend layout as TDP 2.0) */
    {
      section: "design", type: "pair",
      hide: true,   // waiting for the V2 screenshot; remove this line to show the slide
      eyebrow: "V2 · After usability testing",
      headline: ["V2: testing took the queue away"],
      sub: "Agents were distracted by the docked queue, and replies felt cramped.",
      figs: [],
      zones: {
        img: "v2/tdp-v2.webp", placeholder: "V2 screen",
        cap: "TDP V2: the conversation takes the full left column, with properties in the middle and the Ask AI panel on the right",
        pins: [
          { x: 3.5, y: 40.0, t: "Queue moved to the header", d: "Ticket List breadcrumb and next/previous arrows. The conversation gets the full width." },
          { x: 90.0, y: 40.0, t: "Ask AI panel", d: "Summaries of the consignee, product and ticket, plus a box for follow-ups." },
          { x: 40.0, y: 7.0, t: "Ticket context in one line", d: "Created, raised by, client, source, MAWB and LRN." },
          { x: 30.0, y: 93.0, t: "Same action bar", d: "Reply, Note, Forward and Escalate to Ops." }
        ]
      },
      notes: "Usability testing showed the docked queue on the left distracted agents and squeezed the reply area. V2 drops it for a breadcrumb and next/previous arrows, and adds an Ask AI panel on the right."
    },

    /* 11a — REQUESTS → V1 (only what the V1 screens show) */
    {
      section: "results", type: "columns",
      eyebrow: "Requests to design",
      headline: ["What they asked for, what shipped in V1"],
      cols: [
        { k: "Asked for → in V1", tone: "pos", items: [
          "Ageing in hours, like HQ → Ticket Details flags the current centre: Gurgaon Hub, ageing 24h",
          "Escalation inside the TDP → Escalate to Ops with the facility and TL and ATL levels filled in",
          "Escalation contacts in the reply panel → TL and ATL addresses prefilled in the Escalate tab",
          "A way past the 30-email note limit → notes tag whole teams, like @Bangalore_Hoskote_GW team",
          "P0 and SLA up front → “First response overdue by 5h”, “Resolution due tomorrow, 6PM”",
          "Clearer Related Tickets → each shows its AWB, status and ticket ID inline"
        ] },
        { k: "Next phase", tone: "neutral", items: [
          "Image upload for damaged or QC-failed shipments",
          "Dispatch and attempt count",
          "Geo-fence verification indicator",
          "Prepaid or COD indicator on tickets",
          "Reassignment alerts and backup assignment during leave",
          "Ticket download for audits"
        ] }
      ],
      notes: "Left: requests from the CS session that are visible in the V1 screens. Right: requests parked for the next phase."
    },

    /* IMPACT — what changed for the CS floor */
    {
      section: "results", type: "impact",
      eyebrow: "Impact",
      headline: ["Agents stopped hunting"],
      sub: "The right information in one place, and the next action one click away.",
      experience: [
        "CS agents find the new TDP engaging and easier to learn",
        "Ticket, shipment and SLA are in one place, so the answer is on screen",
        "Escalation is one click, not a lookup in the Escalation Matrix"
      ],
      metricsLabel: "What changed",
      metrics: [
        { n: "~3 days → a few hours", l: "avg. ticket resolution time", lead: true },
        { n: "3 → 1", l: "tools open per ticket" },
        { n: "2", l: "paid tools retired: Freshdesk and Rezo" },
        { n: "~$6.7K", l: "a month saved in licences" }
      ],
      notes: "From post-launch feedback from the CS team. Average resolution time dropped from about three days to a few hours."
    },

    /* 16 — LEARNINGS */
    {
      section: "results", type: "close",
      eyebrow: "Learnings",
      headline: ["From navigation to resolution"],
      wins: [
        { n: "1", l: "workspace for the common path" },
        { n: "~$6.7K", l: "a month saved in licences" }
      ],
      rows: [
        { k: "Design for the new joiner", d: "The real test was whether someone in their first week could close a ticket in one go." },
        { k: "Remove tools, not just clicks", d: "Most lost time was between screens. Bringing context in beat any layout change." },
        { k: "Ship, then shadow", d: "Going back to agents' desks after launch gave us the sharpest backlog." }
      ],
      award: { img: "tdp.webp", caption: "Jarvis 2.0 · Central Design Team, Delhivery" },
      cta: [
        { label: "Full case study", href: "./jarvis-case-study.html", primary: true },
        { label: "Next project →", href: "./profile.html#featured" }
      ],
      notes: "Close on the principle: design for the new joiner, and experienced agents get faster too."
    }
  ]
};

window.DECK.slides = window.DECK.slides.filter(function (s) { return !s.hide; });

/* Components for layouts without a slot of their own: screenshot thumbnails atop the before/after
   columns, the V1 prototype, the north star, the Feature 3 screen and lightbox figures. They use the
   engine's .tile class, so a click opens the centred lightbox. */
(function () {
  var D = window.DECK, stage = document.getElementById("deckStage");
  if (!stage || !window.MutationObserver) return;
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  var ICONS = {
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
    gauge: '<path d="M3.3 17a9 9 0 1 1 17.4 0"/><path d="m12 14 4-4"/>'
  };
  function thumb(s) {
    var src = D.imgBase + s.img;
    var el = document.createElement("button");
    el.className = "tile shot-thumb";
    el.setAttribute("data-img", D.imgBase + (s.full || s.img));
    // a full-page capture opens as a scrolling column instead of fitting the screen
    if (s.full) el.addEventListener("click", function () {
      setTimeout(function () { var lb = document.querySelector(".lightbox"); if (lb) lb.classList.add("jv-full"); });
    });
    el.title = "Click to enlarge";
    el.innerHTML = "<span class='tile-img'><img src='" + esc(src) + "' alt='' loading='lazy' onerror=\"this.parentElement.classList.add('failed')\"></span><span class='tile-t'>" + esc(s.cap) + "</span>";
    return el;
  }
  function enhance(el) {
    var eb = el.querySelector(".eyebrow");
    // board cards with a `link` open that page in a new tab instead of the lightbox
    var bs = eb && D.slides.filter(function (s) { return s.type === "board" && s.eyebrow === eb.textContent; })[0];
    if (bs) Array.prototype.forEach.call(el.querySelectorAll(".bd-card"), function (card, i) {
      var c = bs.cards[i], im = card.querySelector(".bd-img");
      if (!c || !c.link || !im || im.tagName === "A") return;
      var a = document.createElement("a");
      a.className = "bd-img jv-ext"; a.href = c.link; a.target = "_blank"; a.rel = "noopener";
      a.title = c.linkLabel || "Open link"; a.setAttribute("aria-label", c.k + ": " + (c.linkLabel || "open link") + " (new tab)");
      a.innerHTML = im.innerHTML + "<span class='jv-ext-cue'>" + esc(c.linkLabel || "Open") + " ↗</span>";
      a.addEventListener("click", function (e) { e.stopPropagation(); });   // no lightbox, no slide advance
      im.parentNode.replaceChild(a, im);
    });
    var sc = eb && D.slides.filter(function (s) { return (s.shots || s.proto || s.lightbox || s.feature || s.northstar || s.zones || s.scatter || s.jdef || s.heroVideo) && s.eyebrow === eb.textContent; })[0];
    if (!sc) return;
    if (sc.feature) {   // screen + key values, the same component as the case study
      var f = sc.feature, row2 = el.querySelector(".pr-row");
      if (!row2) return;
      row2.classList.add("pr-feature");
      row2.innerHTML = "<div class='jv-feature'><button class='tile jv-feature-shot' data-img='" + D.imgBase + f.full + "' title='Click to enlarge'>" +
        "<img src='" + D.imgBase + f.img + "' alt='TDP 2.0 conversation panel: the ticket header, the customer message, the agent reply as a chat message and the composer with Reply, Note, Forward and Escalate to Ops'><span class='tile-t'>" + esc(f.cap) + "</span></button>" +
        "<div class='jv-feature-copy'><span class='jv-feature-k'>" + esc(f.k) + "</span><h4>Key value</h4><ul class='jv-values'>" +
        f.values.map(function (v) { return "<li><span class='jv-ic'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" + ICONS[v.ic] + "</svg></span><div><b>" + esc(v.t) + "</b><p>" + esc(v.d) + "</p></div></li>"; }).join("") +
        "</ul></div></div>";
      return;
    }
    if (sc.lightbox) {   // open figures in the engine's lightbox (via its .tile wiring) instead of the in-place zoom
      el.querySelectorAll(".pr-img").forEach(function (pi, i) {
        var im = pi.querySelector("img"), f = sc.figs[i] || {};
        pi.classList.remove("zoomable");
        pi.classList.add("tile", "pr-lightbox");
        pi.setAttribute("data-img", sc.full && i === 0 ? D.imgBase + sc.full : im.getAttribute("src"));
        var cap = document.createElement("span");
        cap.className = "tile-t"; cap.hidden = true;
        cap.textContent = typeof sc.lightbox === "string" ? sc.lightbox : f.t || "";
        pi.appendChild(cap);
        if (sc.full && i === 0) pi.addEventListener("click", function () {   // a full-page capture scrolls in the lightbox
          setTimeout(function () { var lb = document.querySelector(".lightbox"); if (lb) lb.classList.add("jv-full"); });
        });
      });
    }
    if (sc.heroVideo) {   // cover headline: the figure on its own line, then the problem
      var h1 = el.querySelector("h1");
      if (h1 && h1.firstChild && h1.firstChild.nodeType === 3) {
        var l1 = document.createElement("span"); l1.className = "jv-l1"; l1.textContent = h1.firstChild.textContent.trim();
        h1.replaceChild(l1, h1.firstChild); h1.insertBefore(document.createTextNode(" "), l1.nextSibling);
      }
    }
    if (sc.heroVideo) {   // cover: the before → after reveal instead of the still (poster only for reduced motion)
      var hv = sc.heroVideo, hz = el.querySelector(".op-browser .zoomable");
      if (hz) {
        var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // transparent laptop: HEVC with alpha first (Safari), then VP9 with alpha (Chrome, Firefox)
        hz.parentNode.classList.add("jv-laptop");
        hz.outerHTML = "<video class='op-video' " + (still ? "" : "autoplay ") + "muted loop playsinline preload='metadata' poster='" + D.imgBase + hv.poster + "' aria-label='Jarvis TDP: the redesigned screen, then a wipe to the old screen and back'>" +
          "<source src='" + D.imgBase + hv.mov + "' type='video/quicktime; codecs=\"hvc1\"'><source src='" + D.imgBase + hv.webm + "' type='video/webm'></video>";
      }
    }
    if (sc.jdef) {   // context slide: highlight the definition, external/internal cards, who uses Jarvis
      var jd = sc.jdef, subEl = el.querySelector(".sl-head .sub");
      if (subEl) subEl.innerHTML = esc(sc.sub).replace(esc(jd.hl), "<b class='jv-hl'>" + esc(jd.hl) + "</b>");
      var kinds = document.createElement("div");
      kinds.className = "jv-kinds";
      kinds.innerHTML = jd.kinds.map(function (k) { return "<div class='jv-kind'><b>" + esc(k.k) + "</b><span>" + esc(k.d) + "</span></div>"; }).join("");
      var head = el.querySelector(".sl-head");
      if (head) head.parentNode.insertBefore(kinds, head.nextSibling);
      var real = el.querySelector(".ci-reality .ci-stats");
      if (real) {
        var u = document.createElement("div");
        u.className = "ci-stat jv-users";
        u.innerHTML = "<span class='jv-users-k'>Primary users</span><span class='jv-users-v'>" +
          jd.users.map(function (x, i) { return i ? esc(x) : "<b>" + esc(x) + "</b>"; }).join(", ") + " and more</span>";
        real.appendChild(u);
      }
    }
    if (sc.scatter) {   // the old TDP large, the tools it depended on beside it, and the hop between them
      var sx = sc.scatter, srow = el.querySelector(".pr-row");
      if (!srow) return;
      srow.classList.add("pr-scatter");
      function card(c, cls, hop) {
        var empty = "<span class='jvs-empty'><b>" + esc(c.k) + "</b>Screenshot coming</span>";
        var media = "<button class='tile jvs-shot' data-img='" + D.imgBase + (c.full || c.img) + "' title='Click to enlarge'>" +
          "<img src='" + D.imgBase + c.img + "' alt='" + esc(c.alt || c.k) + "'" + (c.pos ? " style='object-position:" + c.pos + "'" : "") + " onerror=\"this.parentElement.classList.add('is-empty')\">" + empty +
          "<span class='tile-t'>" + esc(c.k) + "</span></button>";
        return "<figure class='jvs-card " + cls + "'>" + (hop ? "<span class='jvs-hop' aria-hidden='true'>" + hop + "</span><span class='jvs-q' aria-hidden='true'>?</span>" : "") +
          media + "<figcaption><b>" + esc(c.k) + "</b>" + esc(c.d) + "</figcaption></figure>";
      }
      srow.innerHTML = "<div class='jv-scatter'>" + card(sx.main, "jvs-main") +
        sx.side.map(function (c, i) { return card(c, "jvs-side", i + 1); }).join("") + "</div>" +
        "<p class='jvs-line'>" + esc(sx.line) + "</p>";
      if (sx.main.full) srow.querySelector(".jvs-main .jvs-shot").addEventListener("click", function () {
        setTimeout(function () { var lb = document.querySelector(".lightbox"); if (lb) lb.classList.add("jv-full"); });
      });
      return;
    }
    if (sc.zones) {   // screen with numbered markers on the right, linked legend on the left
      var z = sc.zones, zrow = el.querySelector(".pr-row");
      if (!zrow) return;
      zrow.classList.add("pr-zones");
      zrow.innerHTML = "<div class='jv-zones'><ol class='jvz-legend'>" +
        z.pins.map(function (p, i) { return "<li tabindex='0' data-z='" + i + "'><span class='jvz-n'>" + (i + 1) + "</span><b>" + esc(p.t) + "</b><span class='jvz-d'>" + esc(p.d) + "</span></li>"; }).join("") +
        "</ol><div class='jvz-screen'><button class='tile jvz-shot' data-img='" + D.imgBase + z.img + "' title='Click to enlarge'><img src='" + D.imgBase + z.img + "' alt='" + esc(z.cap) + "' onerror=\"this.parentElement.classList.add('is-empty')\"><span class='jvz-empty'>" + esc(z.placeholder || "Screen") + "</span><span class='tile-t'>" + esc(z.cap) + "</span></button>" +
        z.pins.map(function (p, i) { return "<span class='jvz-pin' data-z='" + i + "' style='left:" + p.x + "%;top:" + p.y + "%' aria-hidden='true'>" + (i + 1) + "</span>"; }).join("") +
        "</div></div>";
      var box = zrow.querySelector(".jv-zones");
      function light(i) {
        box.querySelectorAll("[data-z]").forEach(function (n) { n.classList.toggle("on", i !== null && n.getAttribute("data-z") === String(i)); });
      }
      box.addEventListener("mouseover", function (e) { var t = e.target.closest("[data-z]"); light(t ? t.getAttribute("data-z") : null); });
      box.addEventListener("mouseleave", function () { light(null); });
      box.addEventListener("focusin", function (e) { var t = e.target.closest("[data-z]"); if (t) light(t.getAttribute("data-z")); });
      box.addEventListener("focusout", function () { light(null); });
      box.addEventListener("click", function (e) { if (e.target.closest(".jvz-pin, .jvz-legend")) e.stopPropagation(); });   // don't advance the slide
      return;
    }
    if (sc.northstar) {
      var nrow = el.querySelector(".pr-row");
      if (!nrow || !window.JarvisNorthStar) return;
      nrow.classList.add("pr-ns");
      var nbox = document.createElement("div");
      nrow.appendChild(nbox);
      window.JarvisNorthStar.mount(nbox);
      return;
    }
    if (sc.proto) {
      var row = el.querySelector(".pr-row"), box = document.createElement("div");
      if (!row || !window.JarvisProto) return;
      box.className = "jv-proto";
      box.setAttribute("data-full", "./jarvis-prototype.html");
      row.classList.add("pr-proto");
      row.appendChild(box);
      window.JarvisProto.mount(box);
      return;
    }
    if (sc.type === "columns" && !sc.shots) {
      return;
    } else if (sc.type === "columns") {
      el.querySelectorAll(".col-card > .col-k").forEach(function (k, i) {
        if (sc.shots[i]) k.parentNode.insertBefore(thumb(sc.shots[i]), k.nextSibling);
      });
    }
  }
  // the engine reuses one lightbox: drop the full-page mode once it closes
  document.addEventListener("click", function () {
    setTimeout(function () { var lb = document.querySelector(".lightbox.jv-full:not(.open)"); if (lb) lb.classList.remove("jv-full"); }, 30);
  }, true);
  document.addEventListener("keyup", function (e) {
    if (e.key === "Escape") { var lb = document.querySelector(".lightbox.jv-full"); if (lb) lb.classList.remove("jv-full"); }
  });
  // runs before the engine's requestAnimationFrame wiring, so the tiles get their click handler
  new MutationObserver(function (muts) {
    muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) enhance(n); }); });
  }).observe(stage, { childList: true });
})();
