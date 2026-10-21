/* v0.3 orchestrator: one scroll timeline split into six chapters by the
   weights in config.js. Text follows scroll directly; 3D cameras get a
   ~60 ms settle so fast wheel flicks don't stutter. */
import { createGlobe } from "./globe.js";
import { createClouds } from "./clouds.js";
import { createStage } from "./stage.js";

const S = window.STORY;
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const mobile = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
const reducedMQ = matchMedia("(prefers-reduced-motion: reduce)");
const reduced = reducedMQ.matches;

const $ = (s, r = document) => r.querySelector(s);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const CH = S.chapters;
const idx = Object.fromEntries(CH.map((c, i) => [c.id, i]));

/* ---------- scroll sections, sized from the chapter weights ---------- */
const story = $("#story");
const totalW = CH.reduce((a, c) => a + c.weight, 0);
CH.forEach((c) => { const s = document.createElement("section"); s.className = "chapter"; s.id = c.id; s.setAttribute("aria-label", c.kicker); story.appendChild(s); });
const tail = document.createElement("div"); tail.style.height = "100vh"; story.appendChild(tail);
let lastW = 0;
function sizeChapters() {
  if (innerWidth === lastW) return; // ignore mobile toolbar height changes
  lastW = innerWidth;
  const vh = innerHeight, total = (mobile ? S.scroll.mobileVH : S.scroll.desktopVH) * vh / 100;
  CH.forEach((c) => { document.getElementById(c.id).style.height = `${Math.round((total * c.weight) / totalW)}px`; });
  tail.style.height = `${vh}px`;
  ScrollTrigger.refresh();
}

/* ---------- overlays ---------- */
const overlays = $("#overlays");
const words = (line) => line.split("\n").map((l) => l.split(" ").map((w) => `<span class="w">${esc(w)} </span>`).join("")).join("<br>");
const OV = CH.map((c, i) => {
  const el = document.createElement("div");
  el.className = "ov" + (i >= 2 && i <= 4 ? " ov--work" : "") + (i === 5 ? " ov--dawn" : "");
  const title = i === 0
    ? `<h1 class="ov__title"><span class="ov__kicker">A story in six chapters</span><span class="ov__name">From the Mountains<br><em>to Millions</em></span><span class="ov__by">${esc(S.author)} — ${esc(S.role)}</span></h1>`
    : `<h2 class="ov__title"><span class="ov__kicker">${esc(c.kicker)}</span><span class="ov__name">${esc(c.title)}</span></h2>`;
  const beats = c.beats.map((b) => `<div class="beat"><p class="beat__line">${words(b.line)}</p></div>`).join("");
  const stat = c.stat ? `<p class="stat"><b>${esc(c.stat.value)}</b><span>${esc(c.stat.label)}</span></p>` : "";
  const caption = i >= 2 && i <= 4 ? `<aside class="caption" aria-live="polite"></aside>` : "";
  const hero = i === 5 ? `<div class="hero"><h2>Let's build what's next.</h2>
      <ul class="hero__ctas">${S.ctas.map((a, k) => `<li><a class="cta${k === 0 ? " cta--primary" : ""}" href="${esc(a.href)}"${a.href.endsWith(".pdf") ? " download" : ""}>${esc(a.label)}</a></li>`).join("")}</ul>
      <p class="hero__mail">${esc(S.email)}</p>
      <ul class="hero__awards" aria-label="Awards">${S.awards.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>` : "";
  el.innerHTML = title + beats + stat + caption + hero;
  overlays.appendChild(el);
  return {
    el, title: el.querySelector(".ov__title"), stat: el.querySelector(".stat"), caption: el.querySelector(".caption"), hero: el.querySelector(".hero"),
    beats: [...el.querySelectorAll(".beat")].map((b, k) => ({ el: b, at: c.beats[k].at, words: [...b.querySelectorAll(".w")], sig: "" })),
    capIndex: -1,
  };
});
$("#campusFact").textContent = CH[1].fact;

function show(el, o) {
  if (!el) return;
  el.style.opacity = o;
  el.style.visibility = o > 0.003 ? "visible" : "hidden";
  el.style.pointerEvents = o > 0.6 ? "auto" : "none";
}
function renderBeats(ov, p) {
  const win = 0.1;
  ov.beats.forEach((b, bi) => {
    const local = (p - (b.at - win)) / (2 * win);
    const out = smooth(0.78, 1, local);
    const sig = (local * 300) | 0;
    if (sig === b.sig) return;
    b.sig = sig;
    const vis = local > -0.02 && local < 1.02;
    b.el.style.visibility = vis ? "visible" : "hidden";
    if (!vis) return;
    const n = b.words.length, st = 0.16 / Math.max(1, n);
    b.words.forEach((w, i) => {
      const inn = smooth(i * st, 0.32 + i * st, local), o = inn * (1 - out);
      w.style.opacity = o;
      if (!reduced) {
        w.style.transform = `translate3d(0, ${((1 - inn) * 0.4 - out * 0.2).toFixed(3)}em, 0)`;
        w.style.filter = `blur(${((1 - inn) * 8 + out * 5).toFixed(1)}px)`;
      }
    });
  });
}
function renderCaption(ov, list, i, eyebrow) {
  if (!ov.caption || i === ov.capIndex || !list[i]) return;
  ov.capIndex = i;
  const p = list[i];
  const link = p.link ? `<a class="caption__link" href="${esc(p.link)}">Read the case study</a>` : `<span>Case study coming soon</span>`;
  ov.caption.innerHTML = `<p class="caption__eyebrow">${esc(eyebrow(p))}</p><h3 class="caption__title">${esc(p.title)}</h3>
    <p class="caption__sub">${esc(p.sub)}</p><ul class="caption__metrics">${p.metrics.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
    <div class="caption__foot">${link}<span class="caption__count">${String(i + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}</span></div>
    ${ov.alsoText ? `<p class="also">${esc(ov.alsoText)}</p>` : ""}`;
}
OV[3].alsoText = "Also at Jio: " + S.projects.jioAlso.join(" · ");
OV[4].alsoText = "Also: " + S.projects.delhiveryAlso.join(" · ");

/* ---------- navigation ---------- */
const jumpTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + scrollY + 2;
  scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  closeWork();
};
const jumpLinks = $("#jumpLinks");
["dineout", "jio", "delhivery", "next"].forEach((id) => {
  const b = document.createElement("button"); b.type = "button"; b.dataset.jump = id; b.textContent = CH[idx[id]].nav; jumpLinks.appendChild(b);
});
document.addEventListener("click", (e) => {
  const j = e.target.closest("[data-jump]");
  if (j) { e.preventDefault(); jumpTo(j.dataset.jump); return; }
  const a = e.target.closest('a[href="#work-menu"]');
  if (a) { e.preventDefault(); openWork(); }
});
const workBtn = $("#workBtn"), workMenu = $("#workMenu");
workMenu.innerHTML = S.caseStudies.map((c) => `<a href="${esc(c.href)}">${esc(c.label)}</a>`).join("")
  + `<a href="mailto:${esc(S.email)}">Get in touch — ${esc(S.email)}</a>`;
function openWork() { workMenu.hidden = false; workBtn.setAttribute("aria-expanded", "true"); workMenu.querySelector("a").focus(); }
function closeWork() { workMenu.hidden = true; workBtn.setAttribute("aria-expanded", "false"); }
workBtn.addEventListener("click", () => (workMenu.hidden ? openWork() : closeWork()));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWork(); });
document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".work")) closeWork(); });

const rail = $("#rail");
CH.forEach((c) => {
  const li = document.createElement("li");
  li.innerHTML = `<button type="button" data-jump="${c.id}" style="width:${Math.max(18, c.weight * 2.2)}px" aria-label="Chapter ${c.n}: ${esc(c.title)}"><i></i></button>`;
  rail.appendChild(li);
});
const railFills = [...rail.querySelectorAll("i")];
const nowNum = $("#nowNum"), nowTitle = $("#nowTitle"), topline = $("#topline");

/* ---------- scenes ---------- */
const globeCanvas = $("#globe");
let globeReady = 0;
const globe = createGlobe(globeCanvas, { places: S.places, mobile, reduced, onReady: () => { globeReady = performance.now(); loadKeyframes(); } });
const clouds = createClouds($("#clouds"), { mobile });
const stage = createStage($("#stage"), { S, mobile, reduced, tipEl: $("#layerTip"), hintEl: $("#layersHint") });
const L = { kf: $("#kf"), campus: $("#campus"), laptop: $("#laptop"), stage: $("#stage"), clouds: $("#clouds") };
const kfImgs = [...L.kf.querySelectorAll("img")];
function loadKeyframes() {
  const size = mobile ? 1280 : 1920;
  kfImgs.forEach((im) => { im.decoding = "async"; im.src = `./assets/kf/kf${im.dataset.kf}-${size}.webp`; });
}
setTimeout(loadKeyframes, 4000); // in case the globe textures are slow

/* ---------- master timeline ---------- */
const master = ScrollTrigger.create({ trigger: story, start: "top top", end: () => `+=${story.offsetHeight - innerHeight}` });
const cum = [];
CH.reduce((a, c, i) => { cum[i] = a; return a + c.weight; }, 0);
const P = new Array(6).fill(0);   // chapter progress, exact
const D = new Array(6).fill(0);   // chapter progress, lightly settled for 3D cameras
let lastNow = -1;

function tick(_, dtMs) {
  const dt = Math.min(0.05, (dtMs || 16) / 1000);
  const G = master.progress * totalW;
  CH.forEach((c, i) => { P[i] = clamp01((G - cum[i]) / c.weight); });
  const k = reduced ? 1 : 1 - Math.exp(-dt * 16);
  P.forEach((p, i) => { D[i] += (p - D[i]) * k; if (Math.abs(p - D[i]) < 1e-5) D[i] = p; });
  const q = (x, n = 4) => (reduced ? Math.round(x * n) / n : x);
  let cur = 0;
  for (let i = 1; i < CH.length; i++) if (G >= cum[i]) cur = i;
  const [p1, p2, p3, p4, p5, p6] = P;

  /* Chapter 01 — globe, clouds, village, boy */
  const ready = globeReady ? (reduced ? 1 : smooth(0, 1200, performance.now() - globeReady)) : 0;
  const globeVis = cur === 0 ? (1 - smooth(0.5, 0.58, p1)) * ready : 0;
  show(globeCanvas, globeVis);
  if (globeVis > 0) { globe.setDive(q(smooth(0.04, 0.56, D[0]))); globe.render(); }

  const cloudT = reduced ? 0 : (p1 - 0.46) / 0.2;
  show(L.clouds, cur === 0 && cloudT > 0 && cloudT < 1 ? 1 : 0);
  if (cur === 0 && cloudT > 0 && cloudT < 1) clouds.render(cloudT);

  const kfVis = (cur === 0 ? smooth(0.52, 0.58, p1) : 0) + (cur === 1 ? 1 - smooth(0.14, 0.24, p2) : 0);
  show(L.kf, kfVis);
  if (kfVis > 0) {
    // KF5 village, then the boy: hard cuts under one continuous slow push (no warping, no gliding)
    const t = cur === 0 ? p1 : 1 + p2;
    const which = t < 0.72 ? 0 : t < 0.82 ? 1 : t < 0.9 ? 2 : 3;
    kfImgs.forEach((im, i) => { im.style.opacity = i === which ? 1 : 0; });
    const push = reduced ? 1.03 : which === 0 ? lerp(1.0, 1.07, smooth(0.55, 0.72, t)) : lerp(1.02, 1.1, smooth(0.72, 1, t)) * (cur === 1 ? lerp(1, 1.45, smooth(0, 0.22, p2)) : 1);
    kfImgs[which].style.transform = `scale(${push.toFixed(4)})`;
  }

  /* Chapter 02 — campus plate, laptop, layers */
  show(L.campus, cur === 1 ? smooth(0.14, 0.2, p2) * (1 - smooth(0.34, 0.4, p2)) : 0);
  const lap = cur === 1 ? smooth(0.32, 0.38, p2) * (1 - smooth(0.5, 0.56, p2)) : 0;
  show(L.laptop, lap);
  if (lap > 0) {
    const lift = reduced ? 0 : smooth(0.46, 0.56, p2);
    L.laptop.style.transform = `translate(-50%, calc(-50% - ${(lift * 80).toFixed(1)}px)) rotate(${(2 - lift * 5).toFixed(2)}deg) scale(${(1 - lift * 0.1).toFixed(3)})`;
  }

  /* Chapters 02–06 — the shared stage */
  let key = null, a = 0, b = 0, vis = 0;
  if (cur === 1 && p2 >= 0.44) { key = "layers"; a = q((D[1] - 0.44) / 0.56); vis = smooth(0.44, 0.52, p2) * (1 - smooth(0.97, 1, p2)); }
  if (cur === 2) { key = "dineout"; a = q(D[2]); vis = smooth(0, 0.05, p3) * (1 - smooth(0.97, 1, p3)); }
  if (cur === 3) { key = "jio"; a = q(D[3]); vis = smooth(0, 0.05, p4) * (1 - smooth(0.97, 1, p4)); }
  if (cur >= 4) { key = "delhivery"; a = q(D[4]); b = cur === 5 ? q(D[5]) : 0; vis = cur === 4 ? smooth(0, 0.05, p5) : 1; }
  show(L.stage, vis);
  if (key && vis > 0) {
    const focus = stage.render(key, a, b, dt);
    if (key === "dineout") renderCaption(OV[2], S.projects.dineout, Math.max(0, focus), () => "Dineout · Times Internet");
    if (key === "jio") renderCaption(OV[3], S.projects.jio, Math.max(0, focus), (p) => p.brand);
    if (key === "delhivery" && cur === 4) renderCaption(OV[4], S.projects.delhivery, Math.max(0, focus), (p) => `Delhivery · ${p.node}`);
  }
  // load the next chapter's textures shortly before it arrives
  if (cur === 1 && p2 > 0.5) stage.prefetch("dineout");
  if (cur === 2 && p3 > 0.5) stage.prefetch("jio");
  if (cur === 3 && p4 > 0.5) stage.prefetch("delhivery");

  /* overlays */
  OV.forEach((ov, i) => {
    const on = i === cur;
    // display, not visibility: children set visibility themselves and would override a hidden parent
    ov.el.style.display = on ? "" : "none";
    ov.el.style.visibility = "visible";
    if (!on) return;
    const p = P[i];
    // each chapter opens on its title card, which clears before the first line arrives
    show(ov.title, i === 0 ? 1 - smooth(0.06, 0.12, p) : smooth(0.0, 0.015, p) * (1 - smooth(0.06, 0.09, p)));
    renderBeats(ov, p);
    if (ov.stat) show(ov.stat, smooth(0.36, 0.4, p) * (1 - smooth(0.52, 0.56, p)));
    if (ov.caption) {
      const [s0, s1] = i === 2 ? [0.58, 0.97] : i === 3 ? [0.3, 0.88] : [0.24, 0.8];
      show(ov.caption, smooth(s0, s0 + 0.04, p) * (1 - smooth(s1 - 0.03, s1, p)));
    }
    if (ov.hero) show(ov.hero, smooth(0.64, 0.74, p));
  });

  /* chrome */
  topline.style.transform = `scaleX(${master.progress.toFixed(4)})`;
  railFills.forEach((f, i) => { f.style.transform = `scaleX(${P[i].toFixed(3)})`; });
  if (cur !== lastNow) {
    lastNow = cur;
    nowNum.textContent = CH[cur].n;
    nowTitle.textContent = CH[cur].title;
    jumpLinks.querySelectorAll("button").forEach((btn) => btn.classList.toggle("is-active", idx[btn.dataset.jump] === cur));
  }
}

/* ---------- boot ---------- */
sizeChapters();
addEventListener("resize", () => { sizeChapters(); globe.resize(); clouds.resize(); stage.resize(); });
reducedMQ.addEventListener("change", () => location.reload());
gsap.ticker.add(tick);
// deep links: /story/#dineout etc.
if (location.hash && document.getElementById(location.hash.slice(1))) requestAnimationFrame(() => jumpTo(location.hash.slice(1)));
