/**
 * Soft cumulus sky for the coming-soon page.
 *
 * Real cloud silhouettes (overlapping ellipses in an SVG) drifting
 * left-to-right over a gradient sky. `palette` picks the color grammar:
 * - "dawn" (default): sky-blue at top warming into gold at the horizon,
 *   with a low warm sun-glow. The current live version.
 * - "blue": pure blue-and-white, no warm tones anywhere. A cooler,
 *   more editorial feel — for the experiment at /preview/sky.
 *
 * Scoped inline; nothing here leaks into the rest of the site.
 */

const CLOUDS = [
  { top: "8%", size: 520, opacity: 0.95, duration: 120, delay: -30 },
  { top: "22%", size: 380, opacity: 0.85, duration: 165, delay: -95 },
  { top: "38%", size: 640, opacity: 0.78, duration: 210, delay: -60 },
  { top: "55%", size: 460, opacity: 0.9, duration: 140, delay: -110 },
  { top: "70%", size: 560, opacity: 0.7, duration: 185, delay: -130 },
  { top: "84%", size: 500, opacity: 0.62, duration: 240, delay: -170 },
] as const;

type Palette = "dawn" | "blue";

const PALETTES: Record<
  Palette,
  { sky: string; glow: string; shadowFill: string; highlight: string }
> = {
  dawn: {
    sky: "linear-gradient(180deg,#B7CDE1 0%,#CCDAE7 28%,#E3DFCF 60%,#F1E6CE 88%,#F6ECD1 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,239,200,0.85) 0%,rgba(255,232,187,0.35) 28%,transparent 60%)",
    shadowFill: "#D5DBE3",
    highlight: "#FFFFFF",
  },
  blue: {
    sky: "linear-gradient(180deg,#5E8BB7 0%,#7EA6CE 22%,#A9C5DE 48%,#D2E1EE 78%,#EDF3F8 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.25) 32%,transparent 62%)",
    shadowFill: "#B3C3D3",
    highlight: "#FFFFFF",
  },
};

function CloudSvg({ shadowFill }: { shadowFill: string }) {
  return (
    <svg
      viewBox="0 0 300 140"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-auto w-full"
      aria-hidden="true"
      role="presentation"
    >
      <ellipse cx="150" cy="108" rx="112" ry="22" fill={shadowFill} />
      <ellipse cx="70" cy="92" rx="42" ry="36" fill="#FFFFFF" />
      <ellipse cx="130" cy="64" rx="62" ry="52" fill="#FFFFFF" />
      <ellipse cx="205" cy="72" rx="54" ry="46" fill="#FFFFFF" />
      <ellipse cx="248" cy="92" rx="36" ry="32" fill="#FFFFFF" />
      <ellipse cx="140" cy="45" rx="55" ry="14" fill="#FFFFFF" opacity="0.7" />
    </svg>
  );
}

export function CloudBackground({ palette = "dawn" }: { palette?: Palette }) {
  const p = PALETTES[palette];
  return (
    <div aria-hidden="true" className="-z-20 absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: p.sky }} />
      <div
        className="absolute inset-x-0 top-[55%] mx-auto h-[70vh] w-[85vw] max-w-4xl rounded-full blur-2xl"
        style={{ background: p.glow }}
      />

      {CLOUDS.map((c, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static config
          key={i}
          className="cs-cloud absolute"
          style={{
            top: c.top,
            width: `${c.size}px`,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <CloudSvg shadowFill={p.shadowFill} />
        </div>
      ))}
    </div>
  );
}
