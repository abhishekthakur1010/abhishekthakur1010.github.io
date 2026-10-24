# v0.3 — status, pacing, and what's still needed

Preview: https://abhishekthakur1010.github.io/story-preview/v0.3/
Source: branch `story-v0.3`, folder `story/`. v0.1 and v0.2 are untouched.

## Pacing (config.js → `chapters[].weight`, `scroll`)

| Chapter | Weight | Desktop (900 px tall) | Mobile (844 px) |
|---|---|---|---|
| 01 Beginning | 12% | 1.7 screens | 1.4 |
| 02 Discovery | 12% | 1.7 | 1.4 |
| 03 Dineout | 20% | 2.8 | 2.3 |
| 04 Jio | 21% | 2.9 | 2.4 |
| 05 Delhivery | 23% | 3.2 | 2.6 |
| 06 What's Next | 12% | 1.7 | 1.4 |
| **Total** | 100% | **14 screens** (v0.2: ~26) | **11.5** |

At an ordinary trackpad pace (~1 screen every 5–6 s) that is roughly 70–85 s on desktop.
Change `scroll.desktopVH` / `mobileVH` to stretch or tighten the whole story, or a
chapter's `weight` to rebalance; every scene retimes itself.

## What is real vs. placeholder

| Moment | Built from | Status |
|---|---|---|
| Earth → India → Himalayas | Real-time 3D: NASA imagery, real elevation (v0.2 globe) | Final technique |
| Cloud descent | Procedural cloud layers, generated in-browser | Interim — would benefit from real cloud footage |
| Village → boy leaves home | KF5, KF6, KF7, KF8 **stills** with slow push-ins and cuts | **Placeholder** — labelled on screen |
| IIIT Allahabad | Typographic plate | **Placeholder** — labelled on screen |
| Laptop → code → interface → human | Archive photo + interactive 3D layers | Final technique |
| Dineout table → reservation card → work | Code-built 3D table + real project covers | Final technique; objects are stylised, not photoreal |
| Jio connected devices | Code-built devices showing real JioMart screens | Final technique |
| Delhivery network | Code-built warehouse/trucks/parcel + real project covers | Stylised, not photoreal |
| Dawn horizon | Real-time sky + network lights | Final technique |

## Production assets still needed (priority order)

1. **Chapter 01 motion (KF5 → KF8).** A 4–6 s shot: village, the boy at the door, first
   steps onto the road. 1920×1080 + 1080×1920. Delivered as an image sequence
   (`frame_0001.webp`…) or a short H.264 clip encoded all-intra for scrubbing.
   The Gemini clip `chapter-01-27s-30fps.mp4` is an Earth rotation only; the globe
   already covers that.
2. **IIIT Allahabad campus.** One establishing photo or 3–4 s clip (morning, the
   academic block or main road). Needs rights: your own photo, or an institutional photo
   you have permission to use.
3. **Raw Dineout screens** (app/web PNG exports: reservation flow, GIRF listing, Predict &
   Win). Today the chapter uses the portfolio's cover images.
4. **WhatsApp commerce and Urban Ladder** screens. Today they're named in the scene but not shown.
5. **Delhivery product screens** for WMS, mid-mile, first-mile (the covers contain them,
   but full-resolution exports would let the panels show the real UI on devices).
6. **Verification:**
   - Dineout ~10K → ~10M users (shown with "as reported; to be verified").
   - Every metric chip is copied verbatim from the portfolio's project cards (index.html).
     Please confirm before this goes public.

## Known limitations
- 3D objects (table, devices, trucks, warehouse) are code-built and stylised; they are not
  photoreal renders and are not presented as such.
- Six project cards say "Case study coming soon" because the portfolio has no page for
  them yet; the Work menu links only to published case studies.
- Tested in headless Chrome (desktop 1440×900, iPhone-size emulation, reduced motion):
  no console errors; ~60 fps while scrolling; forward/reverse frames match (≤1.1/255
  mean pixel difference). Not yet tested on Safari or physical phones.
- First load: desktop ~4 MB globe, then terrain, keyframes and chapter images stream in
  ahead of the reader; mobile uses the 2K set.
