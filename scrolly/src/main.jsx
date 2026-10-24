import { createRoot } from "react-dom/client";
import OrbitDeliveryHero from "./hero.jsx";

// The models and decoder are fetched from ./models and ./draco. Where fetching files is not
// possible (a page opened straight from disk, or a preview that only serves web files), the
// same files are taken from ./assets.js, which carries them as base64 and loads only then.
const EMBEDDED = ["whimsical-world.glb", "courier.glb", "draco_decoder.wasm", "draco_wasm_wrapper.js"];
const realFetch = window.fetch.bind(window);
let pack = null;
function loadPack() {
  return pack || (pack = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = new URL("./assets.js", document.baseURI).href;
    s.onload = () => (window.ORBIT_ASSETS ? resolve(window.ORBIT_ASSETS) : reject(new Error("assets.js is empty")));
    s.onerror = () => reject(new Error("assets.js could not load"));
    document.head.appendChild(s);
  }));
}
function fromBase64(b64) {
  const bin = atob(b64), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  // data: URLs (the planet's surface map) are decoded here, so no network policy can block them.
  if (url.startsWith("data:")) {
    const comma = url.indexOf(",");
    const meta = url.slice(5, comma);
    const body = meta.endsWith(";base64") ? fromBase64(url.slice(comma + 1)) : decodeURIComponent(url.slice(comma + 1));
    return new Response(body, { headers: { "Content-Type": meta.replace(";base64", "") } });
  }
  const name = EMBEDDED.find((n) => url.split("?")[0].endsWith("/" + n));
  if (!name) return realFetch(input, init);
  try {
    const res = await realFetch(input, init);
    if (res.ok) return res;
  } catch (e) {
    if (e && e.name === "AbortError") throw e;
  }
  const files = await loadPack();
  return new Response(fromBase64(files[name]));
};

createRoot(document.getElementById("orbit")).render(<OrbitDeliveryHero theme="light" assetBaseUrl="." />);
