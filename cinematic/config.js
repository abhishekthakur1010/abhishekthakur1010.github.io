/* ============================================================
   FROM THE MOUNTAINS TO MILLIONS — centralized config
   Single source of truth for chapters, frames, and text beats.
   Edit this file to add frames, change counts, or tune narrative.
   Designed to port cleanly to a React/Three.js config later.
   ============================================================ */
window.CINEMATIC_CONFIG = {
  // Global art-direction tokens (kept here so React port can reuse them)
  art: {
    palette: ["#0e1726", "#2a3b57", "#6d7fa3", "#c9b89a", "#f3e8d6", "#fef3dd"],
    mood: "Himalayan blue-hour → golden sunrise; cool shadows, warm key light; volumetric mist.",
    aspectRatioDesktop: 16 / 9,
    aspectRatioMobile: 9 / 16,
  },

  chapters: [
    {
      id: "chapter-01",
      title: "It started in the mountains.",
      // How many rendered frames you will supply for this chapter.
      // Set this to the real count once you drop files in. Engine reads it.
      frameCount: 120,
      // Filename pattern. {n} is zero-padded to `pad` digits.
      // Desktop example: assets/chapter-01/desktop/frame_0001.webp
      pad: 4,
      startIndex: 1,
      ext: "webp",            // webp preferred; falls back to jpg/png if webp missing
      fallbackExts: ["jpg", "png"],
      pathDesktop: "assets/chapter-01/desktop/frame_{n}.{ext}",
      pathMobile: "assets/chapter-01/mobile/frame_{n}.{ext}",
      // Scroll length for the pinned section, in viewport heights.
      // Larger = slower, more cinematic scrub. ~5vh per narrative beat.
      scrollVH: 500,

      // Narrative milestones mapped to scroll progress (0..1).
      // `at` is where the text is fully visible; it fades in/out around it.
      beats: [
        { at: 0.06, kicker: "Chapter 01", line: "I come from the mountains." },
        { at: 0.34, kicker: "", line: "Where the roads were winding,\nbut the ambition was clear." },
        { at: 0.70, kicker: "", line: "So I shouldered a bag,\nand started walking." },
        { at: 0.96, kicker: "", line: "Toward the valley.\nToward everything next." },
      ],
    },
  ],

  // Preloading strategy
  preload: {
    initialBatch: 12,   // frames to load before revealing the scene
    aheadWindow: 24,    // frames to keep loaded ahead of current scroll
    behindWindow: 8,    // frames to keep behind
  },
};
