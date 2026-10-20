# Chapter 01 — "It started in the mountains"
## Storyboard + AI asset-generation guide (frame sequence)

This chapter is a **scroll-controlled frame sequence**: you render ~120 frames of one
continuous cinematic shot, drop them in the asset folder, and the engine scrubs through
them as the user scrolls. Treat it like animating a single camera move — **not** 120
unrelated images.

---

## A. Global art-direction spec (MUST be identical across every frame)

Lock these into every generation prompt so frames are continuous:

- **Character:** a ~12-year-old Himalayan boy, short dark hair, simple earth-tone jacket,
  a worn canvas backpack. Seen mostly from behind / 3-quarter back. Stylized-cinematic
  (think animated feature film), **not** photoreal, **not** a specific real person.
- **Environment:** a small terraced Himalayan village at dawn — stone-and-wood hillside
  houses, a winding dirt-and-stone road, pine trees, snow-dusted peaks receding into haze.
- **Time / light:** blue-hour giving way to golden sunrise. Cool blue shadows, warm gold
  key light from the right horizon. Soft volumetric morning mist in the valleys.
- **Palette:** deep slate blue `#0e1726`, dusk blue `#2a3b57`, periwinkle `#6d7fa3`,
  warm sand `#c9b89a`, cream light `#f3e8d6`, sun `#fef3dd`.
- **Camera:** cinematic wide, shallow-ish depth, slight atmospheric perspective. A slow
  forward dolly that ends following the boy down the path toward the valley.
- **Format:** Desktop **1920×1080 (16:9)**. Mobile **1080×1920 (9:16)** — reframe vertically,
  keep the boy centered.
- **Consistency trick:** generate with a fixed seed + the same style suffix on every frame,
  OR generate 6–8 keyframes then use an AI video/interpolation tool (Runway, Kling, Luma,
  Sora, Hailuo) to produce the in-between frames, then export the video to an image sequence.

**Shared style suffix (append to every prompt):**
> cinematic 3D animated film still, volumetric dawn mist, soft natural rim light,
> atmospheric perspective, muted slate-blue shadows with warm golden sunrise,
> Himalayan village, stylized realism (not photoreal, no real person), 35mm cinematic
> framing, subtle film grain, high detail, consistent character and environment, seed 7721

---

## B. Shot breakdown → frame ranges (120 frames total, `frame_0001`–`frame_0120`)

The engine maps these to scroll. The four text beats in `config.js` sit at the ✦ marks.

| Frames | Beat | Camera / action |
|---|---|---|
| 0001–0030 | ✦ "I come from the mountains." | **Aerial establishing.** High wide of the Himalayas at sunrise; slow descent begins toward a small village in the valley. Clouds drift. |
| 0031–0060 | ✦ "Where the roads were winding, but the ambition was clear." | **Descend + approach.** Camera keeps dropping and pushes toward a single hillside home; the winding road becomes visible. A small figure (the boy) appears outside the house, seen from behind. |
| 0061–0090 | ✦ "So I shouldered a bag, and started walking." | **Behind the boy.** Camera settles behind the boy at the doorway. He shoulders the backpack, looks toward the valley, and takes his first steps onto the winding road. |
| 0091–0120 | ✦ "Toward the valley. Toward everything next." | **Follow to horizon.** Camera follows him down the winding road; the valley and a glowing horizon open up ahead; mist parts; the frame ends on the open road toward the light. |

Keep motion **continuous between ranges** — the last frame of one range is the first of the next.

---

## C. Keyframe generation prompts (render these 7, then interpolate to 120)

Generate at the target aspect ratio. Use the **same seed + style suffix** (Section A) on all.

**KF1 — frame_0001 (aerial establishing)**
> Aerial wide shot high above the Himalayas at sunrise, endless snow-dusted peaks fading
> into golden morning haze, a small terraced village far below in a green valley, winding
> road threading through it. [+ style suffix]

**KF2 — frame_0020 (descending)**
> Descending aerial moving down toward a Himalayan hillside village at dawn, stone-and-wood
> houses on terraces, pine trees, drifting low mist, warm sun cresting the ridge on the right.
> [+ style suffix]

**KF3 — frame_0045 (approach the home)**
> Cinematic approach toward a single small hillside stone-and-wood home at dawn, a winding
> dirt road leading away from it down the mountain, soft golden light, long cool shadows.
> [+ style suffix]

**KF4 — frame_0062 (boy at the doorway, from behind)**
> A 12-year-old Himalayan boy in an earth-tone jacket with a worn canvas backpack stands
> outside his mountain home, seen from behind, looking toward the distant misty valley at
> sunrise, warm rim light on his shoulders. stylized cinematic, not photoreal. [+ style suffix]

**KF5 — frame_0078 (first steps)**
> Same boy from behind beginning to walk down the winding mountain road away from his home,
> backpack on, dawn mist in the valley ahead, warm sunrise light. continuous same character
> and village. [+ style suffix]

**KF6 — frame_0100 (following down the road)**
> Camera following the boy from behind as he walks down the winding Himalayan road toward
> the valley, peaks and golden horizon opening ahead, volumetric mist parting. [+ style suffix]

**KF7 — frame_0120 (open road to the light)**
> The boy small in frame, walking the winding road toward a glowing sunrise horizon over the
> valley, vast Himalayan landscape, hopeful cinematic ending frame. [+ style suffix]

---

## D. Exporting to the frame sequence

1. If you produced a **video** (keyframes → AI interpolation), export it to stills:
   - `frame_0001.webp` … `frame_0120.webp` (zero-padded to 4 digits).
2. Target **WebP** (quality ~82) for size; `jpg`/`png` also work (engine falls back).
3. Keep each desktop frame **1920×1080**; mobile **1080×1920** in the `mobile/` folder.
4. Aim < ~250 KB per desktop WebP so the sequence streams smoothly.

**Drop them here:**
```
cinematic/assets/chapter-01/desktop/frame_0001.webp … frame_0120.webp
cinematic/assets/chapter-01/mobile/frame_0001.webp  … frame_0120.webp   (optional but recommended)
```

If you render a **different count** than 120, just change `frameCount` in `cinematic/config.js`.

---

## E. After you supply assets
Tell me they're in, and I'll: verify they load, tune the scrub/scroll length, fine-tune the
four text beats to land on the right frames, and add mobile framing. Then we validate the
opening scene end-to-end before moving to Chapter 02.
