# Rick & Morty Portal Shader — production reference

Source: [pizza3 on CodePen](https://codepen.io/pizza3/pen/JjKjbZY)

This is the target visual for the Lab fold's portal in the production
portfolio. The brainstorm artifact at
https://claude.ai/artifact/Eecx1TanMMnzU9KegXXzn5 uses a simpler CSS
conic-gradient stand-in; the real fold ports this shader.

## What's in here

- `script.js` — Three.js + WebGL setup, fragment shader (`frag`) and
  vertex shader (`vert`), UnrealBloomPass, `dat.GUI` controls
- `style.css` — 10 lines: fullscreen container
- `index.html` — one-liner: `<div id="world"></div>`
- `LICENSE.txt` — CodePen's MIT-style attribution

## Port plan (for the production Lab fold)

1. Wrap the shader as a client component
   (`components/lab/PortalShader.tsx`) using `three` + `@react-three/fiber`.
2. Replace the four external texture URLs with local assets under
   `public/shaders/`:
   - `perlin.png` (was `noise9.png`)
   - `sparkle.png` (was `sparklenoise.png`)
   - `water.png` (was `waterturbulence.png`)
   - `rgb.png` (was `rgbnoise2.png`)
   These are ~50 KB each — inline them at build time so the shader boots
   without a network round trip.
3. Drop `dat.GUI`; the color options become props with sensible defaults.
4. Keep the `UnrealBloomPass` — it's the reason the shader looks alive,
   not just green.
5. Size the canvas to the portal region only (not fullscreen). The camera
   position and OrthographicCamera settings need adjusting so the plane
   fills the ~260×260 slot.
6. Respect `prefers-reduced-motion`: pause the animation loop.
7. `use client` on the component; lazy-load via `next/dynamic` with
   `ssr: false` since WebGL is browser-only.

## Attribution

The shader is credited to pizza3. Keep the LICENSE.txt shipped alongside
the compiled bundle in production.
