# Story prototype — technical audit (v0.1 → v0.2)

Audit of the v0.1 prototype (`story-prototype` branch, preview at `/story-preview/`),
ranked by impact on the "realistic, cinematic, scroll-controlled journey" benchmark.
v0.2 implements items 1 and 2 only; 3–5 are the plan for the next passes.

## The five most important improvements

### 1. Earth realism — done in v0.2
**v0.1:** stylised shader over three-globe example textures (2K/4K, unclear licensing),
no clouds, a fake fresnel "glow" ring for the atmosphere, a painted terminator band,
no sun on the oceans. It read as a WebGL globe, not as the planet in KF1/KF2.
**v0.2:** NASA Blue Marble NG (Dec 2004) day map, Black Marble 2016 city lights,
NASA cloud layer on its own sphere with cloud shadows, GEBCO relief normals,
sun-driven day/night with ocean glint, Rayleigh + Mie single-scattering atmosphere
(raymarched, Earth's real coefficients) that also attenuates what is behind it,
ACES tone mapping. Sun placed for morning over India (terminator over East Africa),
matching KF1/KF2.

### 2. Earth → Himalayas transition — done in v0.2
**v0.1:** camera distance interpolated linearly (descent speed uneven), the globe
texture was magnified until blurry, then a mist cut to an unrelated previs plate.
**v0.2:** keyframed Catmull-Rom camera path with altitude interpolated in log space
(perceptually constant descent) through KF1 → KF2 → KF3 → KF4 framings; the camera
stays oblique and north-facing once low, so the frame sits on high-detail data.
A real terrain patch (24.5–36.6°N, 70.3–90°E; AWS terrain tiles + Sentinel-2
cloudless 2016, 3× vertical scale) grows out of the globe with edge-faded heights
and alpha, colour-matched to the globe, lit by the same sun, under the same
atmosphere. Clouds clear as the 2K cloud map stops holding up.

### 3. Chapter 01 cinematic sequence — next
The approved assets exist but are unused: `KF1–KF8.png` (2752×1536) and
`chapter-01-27s-30fps.mp4`. The frame player loads one image per frame with no decode
budget. Plan: start the sequence at KF4/KF5 (v0.2 already lands on a KF4 framing),
encode the Gemini clip as a scrubbable all-intra H.264/VP9 file (or a WebP frame set,
desktop + mobile), decode ahead with `createImageBitmap` under a memory cap, and keep
the boy's walk as filmed motion rather than 2.5D warps or sliding cut-outs.

### 4. Scroll engine — partly done
**v0.1 issues:** the globe drifted on a timer (scrolling backwards did not reproduce
the same frame); every WebGL scene re-rendered every frame even when still; mobile
progress used an exponential damping (~110 ms lag) on top of native momentum;
two WebGL contexts stay alive at once; `ScrollTrigger.refresh` only on width changes.
**v0.2:** the globe is a pure function of scroll progress (clouds move with scroll,
not time) and renders only when the view changes.
**Still to do:** one smoothing model for all devices, a single shared renderer,
refresh after fonts/images settle, adaptive resolution from measured frame time.

### 5. Mobile and reduced motion — next
Reduced motion currently quantises the camera into jump cuts; it should present
curated stills (KF1, KF3, KF5, KF8) with crossfades. Mobile needs GPU-tier detection
(fall back to 2K assets / fewer atmosphere samples / no terrain on weak GPUs) and
testing on real iOS Safari and mid-range Android, which headless Chrome cannot stand
in for.

## v0.2 known limitations
- Terrain detail is ~2 km elevation / ~450 m imagery: right for 70+ km altitude,
  not for village scale. Village and boy remain the sequence's job (KF5–KF8).
- The 2016 Sentinel-2 mosaic has composite seams (one visible near 85°E, Nepal);
  the southern strip below ~25.6°N is cropped out for the same reason.
- NASA's 8K cloud map is no longer published; the 2K layer fades out during descent.
- Atmospheric haze is deliberately thinned near the ground for the warm KF3/KF4 look.
- Beyond the terrain patch the globe is 4K (≈10 km/px), so its edges look soft
  mid-descent.
- Payload: desktop ≈ 4 MB globe + 4.4 MB terrain (terrain loads after the globe);
  mobile ≈ 1.2 MB + 2.1 MB.
- Verified in headless Chrome (desktop 1440×900 and 390×844 mobile emulation,
  ~60 fps on this Mac's GPU). Not yet verified on Safari or physical phones.

## Data credits
- NASA Visible Earth: Blue Marble Next Generation, Black Marble 2016, cloud composite,
  GEBCO relief — public domain.
- Sentinel-2 cloudless 2016 by EOX IT Services GmbH, https://s2maps.eu — CC BY 4.0
  (contains modified Copernicus Sentinel data 2016).
- Terrain Tiles on AWS Open Data (SRTM, GMTED2010, ETOPO1 and others).
