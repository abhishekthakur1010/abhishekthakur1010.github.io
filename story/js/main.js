/* Story orchestrator: scroll → scene progress → globe / sequence / photo /
   layers + cinematic text beats + progress nav. */
import { createGlobe } from "./globe.js";
import { createSequence } from "./sequence.js";
import { createLayers } from "./layers.js";

const S = window.STORY;
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const mobile = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduced = reducedMQ.matches;
document.documentElement.classList.toggle("is-mobile", mobile);

const $ = (sel, root = document) => root.querySelector(sel);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/* ---------- scene lengths (px, fixed per width so mobile toolbars don't jump) ---------- */
const order = ["intro", "dive", "sequence", "photo", "arc", "layers"];
const sections = Object.fromEntries(order.map((k) => [k, $(`[data-scene="${k}"]`)]));
const stages = Object.fromEntries(order.map((k) => [k, $(".stage", sections[k])]));
let lastW = 0;
function sizeScenes() {
  if (window.innerWidth === lastW) return;
  lastW = window.innerWidth;
  const vh = window.innerHeight, scale = mobile ? S.scenes.mobileScale : 1;
  order.forEach((k) => { sections[k].style.height = `${Math.round(vh + (S.scenes[k] * scale * vh) / 100)}px`; });
  ScrollTrigger.refresh();
}

/* ---------- text beats ---------- */
const beatSets = {};
document.querySelectorAll("[data-beats]").forEach((host) => {
  const key = host.dataset.beats;
  beatSets[key] = (S.beats[key] || []).map((b) => {
    const el = document.createElement("div");
    el.className = "beat";
    const kick = b.kicker ? `<span class="beat__kicker">${b.kicker}</span>` : "";
    const words = b.line.split("\n").map((ln) => ln.split(" ").map((w) => `<span class="w">${w} </span>`).join("")).join("<br>");
    el.innerHTML = `${kick}<p class="beat__line">${words}</p>`;
    host.appendChild(el);
    return { at: b.at, el, kicker: el.querySelector(".beat__kicker"), words: [...el.querySelectorAll(".w")], last: "" };
  });
});

function renderBeats(key, p) {
  const set = beatSets[key];
  if (!set) return;
  const win = 0.13;
  set.forEach((b, bi) => {
    const local = (p - (b.at - win)) / (2 * win);
    // the last line holds; the scene crossfade carries it out
    const out = bi === set.length - 1 ? 0 : smooth(0.8, 1, local);
    const sig = `${Math.round(local * 400)}`;
    if (sig === b.last) return;
    b.last = sig;
    const vis = local > -0.05 && (local < 1.05 || !out);
    b.el.style.visibility = vis ? "visible" : "hidden";
    if (!vis) return;
    const n = b.words.length, st = 0.14 / Math.max(1, n);
    b.words.forEach((w, i) => {
      const inn = smooth(i * st, 0.36 + i * st, local);
      const o = inn * (1 - out);
      if (reduced) { w.style.opacity = o; w.style.transform = "none"; return; }
      w.style.opacity = o;
      w.style.transform = `translate3d(0, ${(1 - inn) * 0.45 - out * 0.25}em, 0)`;
      w.style.filter = `blur(${((1 - inn) * 10 + out * 6).toFixed(1)}px)`;
    });
    if (b.kicker) b.kicker.style.opacity = smooth(0, 0.3, local) * (1 - out);
  });
}

/* ---------- scroll state (ScrollTrigger) ---------- */
const st = {};
order.forEach((k) => {
  const sec = sections[k];
  st[k] = {
    p: ScrollTrigger.create({ trigger: sec, start: "top top", end: "bottom bottom" }),
    fin: k === "intro" ? null : ScrollTrigger.create({ trigger: sec, start: "top bottom", end: "top top" }),
    fout: ScrollTrigger.create({ trigger: sec, start: "bottom bottom", end: "bottom top" }),
    cur: { p: 0, fin: k === "intro" ? 1 : 0, fout: 0 },
  };
});

/* ---------- smooth scroll (desktop) ---------- */
let lenis = null;
if (!mobile && !reduced && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 2.2 }) : window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" }));

/* ---------- scenes ---------- */
const globeCanvas = $("#globe");
const mist = $(".mist");
let globeReadyAt = 0;
const globe = createGlobe(globeCanvas, { places: S.places, mobile, reduced, onReady: () => { globeReadyAt = performance.now(); } });

const seq = createSequence($("#seqCanvas"), S.sequence, {
  mobile,
  previsEls: { root: $("#previs"), shot: $("#previsShot"), note: $("#previsNote"), strip: $("#previsStrip"), frame: $("#previsFrame") },
});

let layers = null;
const fontsReady = Promise.race([
  Promise.all([document.fonts.load("300 64px Fraunces"), document.fonts.load("600 16px Inter")]),
  new Promise((r) => setTimeout(r, 2500)),
]);
fontsReady.then(() => {
  layers = createLayers($("#layersCanvas"), { layers: S.layers, mobile, reduced, tipEl: $("#layerTip"), hintEl: $("#layersHint") });
});

const homeLabel = $("#homeLabel"), collegeLabel = $("#collegeLabel");
homeLabel.querySelector("span").textContent = S.places.home.label;
collegeLabel.querySelector("span").textContent = S.places.college.label;
function placeLabel(el, pos, op) {
  el.style.opacity = pos.visible ? op : 0;
  el.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 9}px, 0)`;
}

const print = $("#print"), print2 = $("#print2");
if (mobile) $("#layersHint").textContent = "Swipe sideways to turn · tap a layer";
const intro = $(".intro"), cue = $(".cue");

/* ---------- progress nav ---------- */
const navList = $("#chapterNav");
S.chapters.forEach((c, i) => {
  const li = document.createElement("li");
  if (c.status === "planned") li.className = "is-planned";
  li.innerHTML = `<button type="button" aria-label="Chapter ${c.n}: ${c.title}${c.status === "planned" ? " (planned)" : ""}"><i></i><span>${c.n} · ${c.title}</span></button>`;
  li.querySelector("button").addEventListener("click", () => scrollToY(ranges[i][0] + 2));
  navList.appendChild(li);
});
const navFills = [...navList.querySelectorAll("i")];
const nowNum = $("#nowNum"), nowTitle = $("#nowTitle"), progressFill = $("#progressFill");
const absTop = (el) => el.getBoundingClientRect().top + window.scrollY;

function chapterRange(i) {
  const vh = window.innerHeight;
  if (i === 0) return [absTop(sections.dive), absTop(sections.photo) + sections.photo.offsetHeight - vh];
  if (i === 1) return [absTop(sections.arc), absTop(sections.layers) + sections.layers.offsetHeight - vh];
  const el = document.getElementById(S.chapters[i].anchor);
  return [absTop(el) - vh * 0.5, absTop(el) + el.offsetHeight - vh * 0.5];
}
let ranges = [];
const measure = () => { ranges = S.chapters.map((_, i) => chapterRange(i)); };
ScrollTrigger.addEventListener("refresh", measure);
let lastNow = -2;
function renderNav() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressFill.style.transform = `scaleX(${clamp01(y / max)})`;
  let now = -1;
  S.chapters.forEach((c, i) => {
    const [a, b] = ranges[i] || [0, 1];
    navFills[i].style.transform = `scaleX(${clamp01((y - a) / (b - a))})`;
    if (y >= a - 1) now = i;
  });
  if (now !== lastNow) {
    lastNow = now;
    navList.querySelectorAll("li").forEach((li, i) => li.classList.toggle("is-active", i === now));
    nowNum.textContent = now < 0 ? "00" : S.chapters[now].n;
    nowTitle.textContent = now < 0 ? "Prologue" : S.chapters[now].title;
  }
}

/* ---------- upcoming chapters ---------- */
$("#upcomingList").innerHTML = S.upcoming.map((c) => `
  <article class="ch" id="${c.id}">
    <div class="ch__n">${c.n}</div>
    <div class="ch__body">
      <h3>${c.title}</h3>
      <p>${c.line}</p>
      <ul class="ch__tags">${c.work.map((w) => `<li>${w}</li>`).join("")}</ul>
    </div>
    <div class="ch__side">
      <span class="ch__status">Scene not built yet</span>
      ${c.metric ? `<div class="ch__metric"><b>${c.metric.value}</b><span>${c.metric.label}</span>${c.metric.verified ? "" : "<br><em>Unverified — placeholder</em>"}</div>` : ""}
      ${c.logos.length ? `<div class="ch__logos">${c.logos.map((l) => `<img src="${l}" alt="" loading="lazy">`).join("")}</div>` : ""}
    </div>
  </article>`).join("");
ScrollTrigger.batch(".ch", {
  start: "top 85%",
  onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: reduced ? 0 : 1.1, ease: "expo.out", stagger: 0.12 }),
});
$("#contactLink").href = S.contact;

/* ---------- prototype panel ---------- */
const protoBtn = $("#protoToggle"), protoPanel = $("#protoPanel");
protoBtn.addEventListener("click", () => {
  const open = protoPanel.hidden;
  protoPanel.hidden = !open;
  protoBtn.setAttribute("aria-expanded", String(open));
});

/* ---------- frame loop ---------- */
function setStage(k, op) {
  const s = stages[k];
  s.style.opacity = op;
  s.style.visibility = op > 0.002 ? "visible" : "hidden";
  s.style.pointerEvents = op > 0.6 ? "auto" : "none";
}

function tick(_, dtMs) {
  const dt = Math.min(0.05, (dtMs || 16) / 1000);
  // damp scroll progress for a filmic feel where Lenis isn't smoothing for us
  const k = reduced || lenis ? 1 : 1 - Math.exp(-dt * 9);
  order.forEach((key) => {
    const s = st[key], c = s.cur;
    c.p += (s.p.progress - c.p) * k;
    if (s.fin) c.fin += (s.fin.progress - c.fin) * k;
    c.fout += (s.fout.progress - c.fout) * k;
  });
  const P = (key) => st[key].cur.p;
  const vis = (key) => st[key].cur.fin * (1 - st[key].cur.fout);

  order.forEach((key) => setStage(key, vis(key)));

  // prologue
  const ip = P("intro");
  intro.style.opacity = 1 - smooth(0.15, 0.75, ip);
  intro.style.transform = reduced ? "none" : `translate3d(0, ${-60 * ip}px, 0)`;
  cue.style.opacity = 1 - smooth(0, 0.15, ip);

  // globe: dive (Ch01) or arc (Ch02 transition)
  const q = (x) => (reduced ? Math.round(x * 2) / 2 : x);
  const diveVis = 1 - st.sequence.cur.fin;
  const arcVis = st.arc.cur.fin * (1 - st.layers.cur.fin);
  // the planet fades up once its textures have arrived, instead of popping in
  const ready = globeReadyAt ? (reduced ? 1 : smooth(0, 1400, performance.now() - globeReadyAt)) : 0;
  const gVis = Math.max(diveVis, arcVis);
  globeCanvas.style.opacity = gVis * ready;
  if (gVis > 0.002) {
    if (arcVis > diveVis) {
      globe.setArc(q(P("arc")));
      placeLabel(homeLabel, globe.project("home"), 1 - smooth(0.42, 0.55, P("arc")));
      placeLabel(collegeLabel, globe.project("college"), smooth(0.58, 0.7, P("arc")));
    } else {
      globe.setDive(q(P("dive")));
      placeLabel(homeLabel, globe.project("home"), smooth(0.6, 0.78, P("dive")));
      collegeLabel.style.opacity = 0;
    }
    globe.render(dt);
  }
  // mist peaks halfway through the dive → sequence crossfade
  mist.style.opacity = Math.sin(Math.PI * st.dive.cur.fout) * 0.85;

  // Ch01 sequence
  if (vis("sequence") > 0) { seq.setProgress(P("sequence")); seq.render(reduced ? 0 : dt); }

  // archive photo develops like a print
  if (vis("photo") > 0) {
    const pp = P("photo"), dev = smooth(0.02, 0.4, pp);
    print.style.filter = `brightness(${(1 + (1 - dev) * 1.4).toFixed(2)}) blur(${((1 - dev) * 4).toFixed(1)}px)`;
    print.style.transform = reduced
      ? "translate(-50%, -50%)"
      : `translate(-50%, calc(-50% + ${(1 - smooth(0, 0.35, pp)) * 40 - pp * 20}px)) rotate(${-4 + 2.5 * smooth(0, 0.6, pp)}deg)`;
  }

  // Ch02 layers: the archive photo lifts away to reveal the page underneath
  if (vis("layers") > 0) {
    const lp = P("layers"), lift = smooth(0.08, 0.2, lp);
    print2.style.opacity = 1 - lift;
    print2.style.transform = reduced
      ? "translate(-50%, -50%)"
      : `translate(-50%, calc(-50% - ${lift * 70}px)) rotate(${3 - lift * 6}deg) scale(${1 - lift * 0.12})`;
    if (layers) { layers.setProgress(lp); layers.render(dt); }
  }

  ["dive", "sequence", "photo", "arc", "layers"].forEach((key) => { if (vis(key) > 0) renderBeats(key, P(key)); });
  renderNav();
}

/* ---------- boot ---------- */
sizeScenes();
measure();
window.addEventListener("resize", () => {
  sizeScenes();
  globe.resize();
  if (layers) layers.resize();
});
reducedMQ.addEventListener("change", () => location.reload());
gsap.ticker.add(tick);
