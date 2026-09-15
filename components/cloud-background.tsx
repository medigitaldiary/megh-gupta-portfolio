/**
 * Soft cumulus sky for the coming-soon page. Real cloud silhouettes
 * (overlapping ellipses inside an SVG) drift left-to-right on their
 * own timings, over a dawn gradient with a low warm sun-glow.
 *
 * Scoped to the coming-soon page only. The site's Tailwind tokens
 * (--bg, --fg, --accent) are unchanged for the rest of the portfolio.
 */

const CLOUDS = [
  { top: "8%", size: 520, opacity: 0.95, duration: 120, delay: -30 },
  { top: "22%", size: 380, opacity: 0.85, duration: 165, delay: -95 },
  { top: "38%", size: 640, opacity: 0.75, duration: 210, delay: -60 },
  { top: "55%", size: 460, opacity: 0.9, duration: 140, delay: -110 },
  { top: "70%", size: 560, opacity: 0.68, duration: 185, delay: -130 },
  { top: "84%", size: 500, opacity: 0.6, duration: 240, delay: -170 },
] as const;

function CloudSvg() {
  return (
    <svg
      viewBox="0 0 300 140"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="h-auto w-full"
      aria-hidden="true"
      role="presentation"
    >
      {/* Soft shadow base — a wider, grayer ellipse under the puffs */}
      <ellipse cx="150" cy="108" rx="112" ry="22" fill="#D5DBE3" />
      {/* Four overlapping bumps make a cumulus silhouette */}
      <ellipse cx="70" cy="92" rx="42" ry="36" fill="#FFFFFF" />
      <ellipse cx="130" cy="64" rx="62" ry="52" fill="#FFFFFF" />
      <ellipse cx="205" cy="72" rx="54" ry="46" fill="#FFFFFF" />
      <ellipse cx="248" cy="92" rx="36" ry="32" fill="#FFFFFF" />
      {/* Gentle highlight at the top */}
      <ellipse cx="140" cy="45" rx="55" ry="14" fill="#FFFFFF" opacity="0.7" />
    </svg>
  );
}

export function CloudBackground() {
  return (
    <div aria-hidden="true" className="-z-20 absolute inset-0 overflow-hidden">
      {/* Dawn sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#B7CDE1_0%,#CCDAE7_28%,#E3DFCF_60%,#F1E6CE_88%,#F6ECD1_100%)]" />
      {/* Warm sun glow, low-center, giving the sky a direction */}
      <div className="absolute inset-x-0 top-[55%] mx-auto h-[70vh] w-[85vw] max-w-4xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,239,200,0.85)_0%,rgba(255,232,187,0.35)_28%,transparent_60%)] blur-2xl" />

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
          <CloudSvg />
        </div>
      ))}
    </div>
  );
}
