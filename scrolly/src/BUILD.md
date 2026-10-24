# Scrollytelling globe

`orbit.js` is a bundle of the Orbit Delivery hero (React, three.js, @react-three/fiber), trimmed to only the globe and the courier.

- `hero.jsx`: the component, with the header, hero copy, captions, clouds and footer removed (see the "Portfolio edit" comments).
- `main.jsx`: mounts it into `#orbit` in `../index.html`.

Everything it needs is in this folder, so it works offline and in previews:

- `../models/whimsical-world.glb`, `../models/courier.glb`: the planet and courier, copied from the component's asset repo (github.com/fadeichev2121/planet, commit b3f70fb). The repo states no license; it publishes them for this component.
- `../draco/`: the Draco mesh decoder from three.js (`examples/jsm/libs/draco`).

- `../assets.js`: the same four files as base64. `main.jsx` loads it only when the real files can't be fetched (a page opened from disk, or a preview that won't serve .glb), so the globe still appears. Regenerate it if the models change:

```
python3 -c "import base64,json;d={k:base64.b64encode(open(v,'rb').read()).decode() for k,v in [('whimsical-world.glb','models/whimsical-world.glb'),('courier.glb','models/courier.glb'),('draco_decoder.wasm','draco/draco_decoder.wasm'),('draco_wasm_wrapper.js','draco/draco_wasm_wrapper.js')]};open('assets.js','w').write('window.ORBIT_ASSETS='+json.dumps(d)+';\\n')"
```

Rebuild after editing. Bundle from a folder whose own node_modules holds the dependencies: if a parent folder has another copy of three, esbuild picks up both and the scene fails with "getComponent is not a function".

```
mkdir orbit-build && cd orbit-build && echo '{"private":true}' > package.json
npm i react@18.3.1 react-dom@18.3.1 three@0.175.0 @react-three/fiber@8.17.10 esbuild@0.24.0
cp path/to/scrolly/src/*.jsx .
npx esbuild main.jsx --bundle --minify --format=iife --jsx=automatic --loader:.jsx=jsx \
  --define:process.env.NODE_ENV=\"production\" --legal-comments=eof --outfile=path/to/scrolly/orbit.js
```
