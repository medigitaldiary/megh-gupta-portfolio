"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Rick & Morty portal shader — port of pizza3's CodePen with the four
// externally-hosted noise PNGs replaced by proper Perlin/fBm textures
// generated in-browser. Bloom is approximated with CSS filters on the
// canvas since UnrealBloomPass isn't in the three.js core UMD.
//
// See reference/portal-shader/ for the original CodePen source.

const VERT = `
  varying vec3 vNormal;
  varying vec3 camPos;
  varying vec2 vUv;
  void main() {
    vNormal = normal;
    vUv = uv;
    camPos = cameraPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  #define NUM_OCTAVES 5
  uniform vec4 resolution;
  varying vec3 vNormal;
  uniform sampler2D perlinnoise;
  uniform sampler2D sparknoise;
  uniform sampler2D waterturbulence;
  uniform sampler2D noiseTex;
  uniform float time;
  uniform vec3 color0;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  uniform vec3 color5;
  varying vec3 camPos;
  varying vec2 vUv;

  float setOpacity(float r, float g, float b, float tonethreshold) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if (tone < tonethreshold) { alpha = 0.0; }
    return alpha;
  }
  vec3 rgbcol(vec3 col) { return vec3(col.r/255.0, col.g/255.0, col.b/255.0); }
  vec2 rotate(vec2 v, float a) {
    float s = sin(a); float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
  }
  vec2 UnityPolarCoordinates(vec2 UV, vec2 Center, float RadialScale, float LengthScale) {
    vec2 delta = UV - Center;
    float radius = length(delta) * 2.0 * RadialScale;
    float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
    return vec2(radius, angle);
  }
  void main() {
    vec2 olduv = gl_FragCoord.xy / resolution.xy;
    vec2 uv = vUv;
    olduv *= 0.5 + time;
    float pct = distance(vUv, vec2(0.5));
    vec3 rgbcolor0 = rgbcol(color0);
    vec3 rgbcolor1 = rgbcol(color1);
    vec3 rgbcolor2 = rgbcol(color2);
    vec3 rgbcolor4 = rgbcol(color4);
    vec3 rgbcolor5 = rgbcol(color5);
    float y = smoothstep(0.16, 0.525, pct);
    vec3 backcolor = mix(rgbcolor0, rgbcolor5, y);
    gl_FragColor = vec4(backcolor, 1.0);
    vec2 center = vec2(0.5);
    vec2 cor = UnityPolarCoordinates(vUv, center, 1.0, 1.0);
    vec2 newvUv = vUv - 0.5;
    vec3 noisetexvUv = texture2D(perlinnoise, mod(rotate(newvUv*0.15 + vec2(sin(time*0.005), cos(time*0.005)), time), 1.0)).rgb;
    vec2 newUv = vec2(cor.x + time, cor.x + cor.y);
    vec3 noisetex  = texture2D(perlinnoise,      mod(newUv, 1.0)).rgb;
    vec3 noisetex2 = texture2D(sparknoise,       mod(newUv, 1.0)).rgb;
    vec3 noisetex3 = texture2D(waterturbulence,  mod(newUv, 1.0)).rgb;
    float tone0 = 1.0 - smoothstep(0.3, 0.6, noisetex.r);
    float tone1 = smoothstep(0.3, 0.6, noisetex2.r);
    float tone2 = smoothstep(0.3, 0.6, noisetex3.r);
    float opacity0 = setOpacity(tone0, tone0, tone0, 0.29);
    float opacity1 = setOpacity(tone1, tone1, tone1, 0.49);
    float opacity2 = setOpacity(tone2, tone2, tone2, 0.69);
    float gradienttone = 1.0 - smoothstep(0.196, 0.532, pct);
    vec4 circularnoise = vec4(vec3(gradienttone) * noisetexvUv * 1.4, 1.0);
    float gradopacity = setOpacity(circularnoise.r, circularnoise.g, circularnoise.b, 0.19);
    vec2 uv2 = uv;
    float iTime = time * 0.004;
    uv.y += iTime / 10.0;
    uv.x -= (sin(iTime/10.0)/2.0);
    uv2.x += iTime / 14.0;
    uv2.x += (sin(iTime/10.0)/9.0);
    float result = 0.0;
    result += texture2D(noiseTex, mod(uv*0.5,1.0) * 0.6 + vec2(iTime*-0.003)).r;
    result *= texture2D(noiseTex, mod(uv2*0.5,1.0) * 0.9 + vec2(iTime*0.002)).b;
    result = pow(result, 4.0);
    if (opacity2 > 0.0) {
      gl_FragColor = vec4(rgbcolor4, 0.0) * vec4(opacity2);
    } else if (opacity1 > 0.0) {
      gl_FragColor = vec4(rgbcolor2, 0.0) * vec4(opacity1);
    } else if (opacity0 > 0.0) {
      gl_FragColor = vec4(rgbcolor1, 0.0) * vec4(opacity0);
    }
    gl_FragColor += vec4(108.0) * result * (y * 0.02);
    gl_FragColor *= vec4(gradopacity);
  }
`;

// ─── Procedural noise ──────────────────────────────────────────────────

function makePerlin(): (x: number, y: number) => number {
  const perm = new Uint8Array(512);
  const seed: number[] = [];
  for (let i = 0; i < 256; i++) seed.push(i);
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = seed[i];
    seed[i] = seed[j];
    seed[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = seed[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) !== 0 ? -u : u) + ((h & 2) !== 0 ? -2 * v : 2 * v);
  };

  return (x, y) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = perm[X] + Y;
    const AA = perm[A & 255];
    const AB = perm[(A + 1) & 255];
    const B = perm[(X + 1) & 255] + Y;
    const BA = perm[B & 255];
    const BB = perm[(B + 1) & 255];
    return lerp(
      v,
      lerp(u, grad(perm[AA], x, y), grad(perm[BA], x - 1, y)),
      lerp(u, grad(perm[AB], x, y - 1), grad(perm[BB], x - 1, y - 1)),
    );
  };
}

function makeFbmCanvas(
  size: number,
  freq: number,
  octaves: number,
  blurPx: number,
): HTMLCanvasElement {
  const noise = makePerlin();
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0, k = 0; y < size; y++) {
    for (let x = 0; x < size; x++, k++) {
      let v = 0;
      let amp = 1;
      let f = freq;
      let total = 0;
      for (let o = 0; o < octaves; o++) {
        v += amp * noise((x / size) * f, (y / size) * f);
        total += amp;
        amp *= 0.5;
        f *= 2;
      }
      let out = ((v / total) * 0.5 + 0.5) * 255;
      if (out < 0) out = 0;
      else if (out > 255) out = 255;
      d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = out;
      d[k * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  if (blurPx > 0) {
    const out = document.createElement("canvas");
    out.width = out.height = size;
    const octx = out.getContext("2d");
    if (octx) {
      octx.filter = `blur(${blurPx}px)`;
      octx.drawImage(c, 0, 0);
      return out;
    }
  }
  return c;
}

function makeSparkCanvas(size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  const n = (size * size * 0.0035) | 0;
  for (let i = 0; i < n; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.5 + Math.random() * 1.8;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.6);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

function makeRgbCanvas(size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let i = 0, n = size * size; i < n; i++) {
    const j = i * 4;
    d[j] = (Math.random() * 256) | 0;
    d[j + 1] = (Math.random() * 256) | 0;
    d[j + 2] = (Math.random() * 256) | 0;
    d[j + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function canvasToTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

// ─── Component ──────────────────────────────────────────────────────

export function LabPortalShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId: number | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      });
      renderer.setPixelRatio(1);
      renderer.setSize(canvas.width, canvas.height, false);
      renderer.autoClear = true;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const perlin = canvasToTexture(makeFbmCanvas(256, 4, 4, 1));
      const spark = canvasToTexture(makeSparkCanvas(256));
      const water = canvasToTexture(makeFbmCanvas(256, 2.4, 5, 2));
      const rgbTex = canvasToTexture(makeRgbCanvas(256));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          perlinnoise: { value: perlin },
          sparknoise: { value: spark },
          waterturbulence: { value: water },
          noiseTex: { value: rgbTex },
          color0: { value: new THREE.Vector3(1, 5, 1) },
          color1: { value: new THREE.Vector3(2, 20, 2) },
          color2: { value: new THREE.Vector3(44, 97, 15) },
          color3: { value: new THREE.Vector3(14, 28, 5) },
          color4: { value: new THREE.Vector3(255, 255, 255) },
          color5: { value: new THREE.Vector3(74, 145, 0) },
          resolution: {
            value: new THREE.Vector4(canvas.width, canvas.height, 1, 1),
          },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      canvas.classList.add("lab-portal-canvas-ready");

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const t0 = performance.now();

      const tick = () => {
        if (disposed || !renderer) return;
        const t = (performance.now() - t0) / 5000;
        material.uniforms.time.value = reduced ? 0.6 : t;
        renderer.render(scene, camera);
        if (!reduced) rafId = requestAnimationFrame(tick);
      };
      tick();

      return () => {
        disposed = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        perlin.dispose();
        spark.dispose();
        water.dispose();
        rgbTex.dispose();
        material.dispose();
        mesh.geometry.dispose();
        renderer?.dispose();
      };
    } catch (err) {
      console.warn("[lab-portal] shader init failed", err);
      return () => {
        disposed = true;
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={432}
      height={432}
      className="lab-portal-canvas"
      // canvas is decorative; sits behind the labeled portal <g> in
      // components/lab-scene.tsx which owns the accessible name.
      role="presentation"
    />
  );
}
