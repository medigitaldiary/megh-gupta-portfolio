// Ink bleed: the day and night switch spreads from the toggle like ink
// in water, with a marbled edge.
//
// How it works, in three parts:
//   1. The browser's View Transitions API takes an exact picture of the
//      board before and after the switch. No screenshot library.
//   2. The "after" picture is revealed through a growing mask. The mask
//      is a solid disc plus four rings, and each ring only shows through
//      a marble texture that gets sparser toward the outside. That gives
//      the streaked, swirling edge (see "Ink bleed" in bento.css).
//   3. The four marble textures are drawn once with WebGL, here, from a
//      random seed, so every spread looks different.
//
// Where View Transitions or WebGL are missing, or motion is reduced, the
// board falls back to its plain colour fade.

const TEX_W = 1024;
const TEX_H = 640;
// Share of the marble field each ring lets through, dense to sparse.
const LEVELS = [0.34, 0.47, 0.59, 0.71];

const VERTEX = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 uSize;
uniform vec2 uSeed;
uniform float uLevel;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amp *= 0.5;
  }
  return v / 0.96875;
}

void main() {
  vec2 p = gl_FragCoord.xy / uSize.y;
  // Domain warping, twice: noise bent by noise curls into marble.
  vec2 q = p * 2.4 + uSeed;
  vec2 w = vec2(fbm(q), fbm(q + vec2(5.2, 1.3)));
  vec2 mq = p * 6.5 + uSeed * 0.83 + 2.1 * w;
  vec2 warp2 = vec2(fbm(mq * 0.8 + vec2(4.1, 0.0)), fbm(mq * 0.8 - vec2(2.7, 0.0)));
  vec2 mq2 = mq + 2.6 * warp2;
  vec2 warp3 = vec2(fbm(mq2 * 0.6 + 7.7), fbm(mq2 * 0.6 - 5.3));
  float marble = fbm(mq2 + 1.4 * warp3);
  // Slow lobes, so the front bulges instead of staying a circle.
  float lobes = fbm(p * 1.5 + uSeed.yx * 1.7 + 0.8 * w);
  float field = smoothstep(0.28, 0.72, 0.62 * marble + 0.38 * lobes);
  float alpha = smoothstep(uLevel - 0.03, uLevel + 0.03, field);
  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
`;

let textureUrls: string[] = [];
let preparing: Promise<void> | null = null;

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

async function drawTextures(): Promise<string[]> {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return [];

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return [];
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return [];
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook.
  gl.useProgram(program);

  // One triangle that covers the whole canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(gl.getUniformLocation(program, "uSize"), TEX_W, TEX_H);
  gl.uniform2f(
    gl.getUniformLocation(program, "uSeed"),
    Math.random() * 40,
    Math.random() * 40,
  );
  const level = gl.getUniformLocation(program, "uLevel");

  const urls: string[] = [];
  for (const value of LEVELS) {
    gl.uniform1f(level, value);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const blob = await toBlob(canvas);
    if (!blob) return [];
    urls.push(URL.createObjectURL(blob));
  }
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  // Decode before use, so the mask never starts with a missing layer.
  await Promise.all(
    urls.map((url) => {
      const img = new Image();
      img.src = url;
      return img.decode().catch(() => {});
    }),
  );
  return urls;
}

export function inkAvailable(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Draw a fresh set of marble textures and hand them to the CSS.
export function prepareInk(): Promise<void> {
  if (!inkAvailable()) return Promise.resolve();
  if (preparing) return preparing;
  preparing = drawTextures()
    .then((urls) => {
      if (urls.length !== LEVELS.length) return;
      const root = document.documentElement;
      urls.forEach((url, i) => {
        root.style.setProperty(`--ink-t${i + 1}`, `url("${url}")`);
      });
      for (const url of textureUrls) URL.revokeObjectURL(url);
      textureUrls = urls;
    })
    .catch(() => {})
    .finally(() => {
      preparing = null;
    });
  return preparing;
}

// Run `apply` (the theme switch) and spread the ink from `point`.
export function runInk(point: { x: number; y: number }, apply: () => void) {
  if (!inkAvailable()) {
    apply();
    return;
  }
  const root = document.documentElement;
  const farthest = Math.max(
    Math.hypot(point.x, point.y),
    Math.hypot(window.innerWidth - point.x, point.y),
    Math.hypot(point.x, window.innerHeight - point.y),
    Math.hypot(window.innerWidth - point.x, window.innerHeight - point.y),
  );
  root.style.setProperty("--ink-x", `${Math.round(point.x)}px`);
  root.style.setProperty("--ink-y", `${Math.round(point.y)}px`);
  root.style.setProperty("--ink-end", `${Math.round(farthest + 320)}px`);
  root.dataset.ink = "on";

  const transition = document.startViewTransition(apply);
  transition.finished
    .catch(() => {})
    .finally(() => {
      // A second click may have started a newer spread; leave it alone.
      if (current !== transition) return;
      delete root.dataset.ink;
      void prepareInk();
    });
  current = transition;
}

let current: ViewTransition | null = null;
