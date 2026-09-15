export type Cert = {
  eyebrow: string;
  title: string;
  subtitle: string;
  year: string;
  seal: string;
  tint: [number, number, number];
};

export const CERTS: Cert[] = [
  {
    eyebrow: "Nocturne · Original Edition",
    title: "Under Construction",
    subtitle: "Portfolio in flight",
    year: "MMXXVI",
    seal: "N",
    tint: [0.94, 0.93, 0.88],
  },
  {
    eyebrow: "Site of the Year",
    title: "Editorial Craft",
    subtitle: "Awarded for restraint",
    year: "2026",
    seal: "★",
    tint: [0.98, 0.96, 0.9],
  },
  {
    eyebrow: "日本認識 · Recognition",
    title: "静けさ",
    subtitle: "Quiet interface, loud intent",
    year: "令和八年",
    seal: "印",
    tint: [0.96, 0.94, 0.92],
  },
  {
    eyebrow: "Certificate of Merit",
    title: "Megh Gupta",
    subtitle: "For shipping calm 0→1 fintech",
    year: "2026",
    seal: "M",
    tint: [0.99, 0.97, 0.92],
  },
];

/**
 * Paint one certificate onto a canvas. Shared by the WebGL scene
 * (wrapped as a THREE.CanvasTexture) and the DOM fallback.
 */
export function drawCertToCanvas(cert: Cert, size = 1024): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = Math.round(size * 1.4);
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  const W = c.width;
  const H = c.height;

  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "rgba(250,250,247,1)");
  grd.addColorStop(1, "rgba(240,238,230,1)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(31,77,58,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeStyle = "rgba(31,77,58,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  ctx.fillStyle = "#1F4D3A";
  ctx.font = "600 26px 'JetBrains Mono', ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(cert.eyebrow.toUpperCase(), W / 2, 140);

  ctx.fillStyle = "#111111";
  ctx.font = "72px 'Instrument Serif', 'Times New Roman', serif";
  ctx.fillText(cert.title, W / 2, 240);

  ctx.strokeStyle = "rgba(17,17,17,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 120, 380);
  ctx.lineTo(W / 2 + 120, 380);
  ctx.stroke();

  ctx.fillStyle = "#555555";
  ctx.font = "italic 32px 'Instrument Serif', serif";
  ctx.fillText(cert.subtitle, W / 2, 420);

  const seal = { x: W / 2, y: H * 0.66, r: 110 };
  ctx.beginPath();
  ctx.arc(seal.x, seal.y, seal.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(31,77,58,0.92)";
  ctx.fill();
  ctx.strokeStyle = "rgba(31,77,58,1)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(seal.x, seal.y, seal.r + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#FAFAF7";
  ctx.font = "96px 'Instrument Serif', serif";
  ctx.textBaseline = "middle";
  ctx.fillText(cert.seal, seal.x, seal.y + 4);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#111111";
  ctx.font = "500 22px 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText(cert.year, 120, H - 130);
  ctx.textAlign = "right";
  ctx.fillText("MEGH · GUPTA", W - 120, H - 130);

  ctx.strokeStyle = "rgba(17,17,17,0.4)";
  ctx.beginPath();
  ctx.moveTo(120, H - 180);
  ctx.lineTo(W - 120, H - 180);
  ctx.stroke();

  return c;
}

/**
 * Placement + tilt for the four certs. Shared between WebGL and DOM.
 * Values chosen so the middle of the frame stays clear for headline text.
 */
export const PLACEMENTS = [
  { x: -34, y: -8, tiltX: -4, tiltY: 22, tiltZ: -5, scale: 1.0 },
  { x: 34, y: -18, tiltX: 3, tiltY: -22, tiltZ: 6, scale: 1.0 },
  { x: -28, y: 32, tiltX: -2, tiltY: 18, tiltZ: 3, scale: 0.95 },
  { x: 30, y: 26, tiltX: 2, tiltY: -18, tiltZ: -4, scale: 0.98 },
] as const;
