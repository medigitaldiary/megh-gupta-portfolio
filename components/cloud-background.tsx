/**
 * Soft cumulus sky for the coming-soon page.
 *
 * Real cloud silhouettes (overlapping ellipses in an SVG) drifting
 * left-to-right over a gradient sky. `palette` picks the color grammar:
 * - "dawn" (default): sky-blue at top warming into gold at the horizon,
 *   with a low warm sun-glow. The current live version.
 * - "blue": pure blue-and-white, no warm tones anywhere. A cooler,
 *   more editorial feel, for the experiment at /preview/sky.
 * - "footer": the dawn sky turned upside down. It starts on the page
 *   colour (--bg) and cools into blue at the bottom, so a footer can
 *   grow out of the page with no visible seam. Sandbox: /preview/footer-sky.
 * - `weather`: v5.2 only. Remixes the footer sky with the blue palette
 *   already in this file. The bottom stop stays light enough for pine text.
 *
 * Scoped inline; nothing here leaks into the rest of the site.
 */

import type { CSSProperties } from "react";

// Eight clouds across the vertical band. Durations vary slightly for
// parallax; delays are chosen so at load time the phases are evenly
// spaced (~1/8 of a cycle apart). Since each cloud is in the viewport
// for ~65% of its own cycle, 5+ clouds are visible at any moment.
const CLOUDS = [
  { top: "5%", size: 380, opacity: 0.92, duration: 155, delay: -9 },
  { top: "16%", size: 460, opacity: 0.82, duration: 170, delay: -32 },
  { top: "28%", size: 340, opacity: 0.88, duration: 185, delay: -58 },
  { top: "40%", size: 520, opacity: 0.75, duration: 150, delay: -66 },
  { top: "52%", size: 400, opacity: 0.86, duration: 195, delay: -110 },
  { top: "64%", size: 480, opacity: 0.72, duration: 160, delay: -110 },
  { top: "76%", size: 380, opacity: 0.8, duration: 180, delay: -146 },
  { top: "88%", size: 440, opacity: 0.68, duration: 165, delay: -155 },
] as const;

type Palette = "dawn" | "blue" | "ods" | "footer";

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
  // Same hues as dawn, reversed, with the page colour on top.
  footer: {
    sky: "linear-gradient(180deg,var(--bg) 0%,#F1E6CE 24%,#E3DFCF 48%,#CCDAE7 76%,#B7CDE1 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,239,200,0.85) 0%,rgba(255,232,187,0.35) 28%,transparent 60%)",
    shadowFill: "#D5DBE3",
    highlight: "#FFFFFF",
  },
  // ownCloud palette: brand navy at the top, steel-blue mid, near-white bottom.
  ods: {
    sky: "linear-gradient(180deg,#041E42 0%,#22385A 22%,#4A76AC 48%,#B4C7DF 78%,#EEF3F9 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.18) 32%,transparent 60%)",
    shadowFill: "#A4B4CC",
    highlight: "#FFFFFF",
  },
};

// v5.2 skies. Every stop is already in the footer or blue palette above.
// The last stop stays on #A9C5DE or lighter so the meta line stays pine.
export const SKY_WEATHERS = [
  {
    id: "sunny",
    label: "Sunny",
    ariaLabel: "Sunny",
    sky: "linear-gradient(180deg,var(--bg) 0%,#F1E6CE 24%,#E3DFCF 48%,#CCDAE7 76%,#B7CDE1 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,239,200,0.95) 0%,rgba(255,232,187,0.55) 24%,transparent 58%)",
    shadowFill: "#E3DFCF",
    highlight: "#FFFFFF",
    cloudAlpha: 0.82,
    cloudScale: 0.92,
    sun: true,
    rain: "none",
    snow: false,
    flash: false,
  },
  {
    id: "drizzle",
    label: "Drizzle",
    ariaLabel: "Drizzle",
    sky: "linear-gradient(180deg,var(--bg) 0%,#E3DFCF 22%,#CCDAE7 50%,#B7CDE1 76%,#A9C5DE 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,255,255,0.35) 0%,rgba(255,255,255,0.12) 30%,transparent 60%)",
    shadowFill: "#D5DBE3",
    highlight: "#FFFFFF",
    cloudAlpha: 0.95,
    cloudScale: 1,
    sun: false,
    rain: "fine",
    snow: false,
    flash: false,
  },
  {
    id: "rain",
    label: "Rain",
    ariaLabel: "Rain",
    sky: "linear-gradient(180deg,var(--bg) 0%,#CCDAE7 20%,#A9C5DE 48%,#7EA6CE 74%,#A9C5DE 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,255,255,0.2) 0%,rgba(255,255,255,0.06) 28%,transparent 58%)",
    shadowFill: "#B3C3D3",
    highlight: "#EDF3F8",
    cloudAlpha: 1,
    cloudScale: 1.05,
    sun: false,
    rain: "steady",
    snow: false,
    flash: false,
  },
  {
    id: "storm",
    label: "Storm",
    ariaLabel: "Thunderstorm",
    sky: "linear-gradient(180deg,var(--bg) 0%,#A9C5DE 18%,#5E8BB7 46%,#7EA6CE 72%,#A9C5DE 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.04) 26%,transparent 55%)",
    shadowFill: "#5E8BB7",
    highlight: "#D2E1EE",
    cloudAlpha: 1,
    cloudScale: 1.12,
    sun: false,
    rain: "heavy",
    snow: false,
    flash: true,
  },
  {
    id: "winter",
    label: "Winter",
    ariaLabel: "Winter morning",
    sky: "linear-gradient(180deg,var(--bg) 0%,#F6ECD1 16%,#EDF3F8 42%,#D2E1EE 72%,#EDF3F8 100%)",
    glow: "radial-gradient(ellipse at center,rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.22) 32%,transparent 62%)",
    shadowFill: "#D2E1EE",
    highlight: "#FFFFFF",
    cloudAlpha: 0.7,
    cloudScale: 1,
    sun: false,
    rain: "none",
    snow: true,
    flash: false,
  },
] as const;

export type SkyWeatherId = (typeof SKY_WEATHERS)[number]["id"];

export function skyWeatherById(id: SkyWeatherId) {
  const found = SKY_WEATHERS.find((item) => item.id === id);
  return found ?? SKY_WEATHERS[0];
}

function CloudSvg({
  shadowFill,
  highlight,
}: {
  shadowFill: string;
  highlight: string;
}) {
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
      <ellipse cx="70" cy="92" rx="42" ry="36" fill={highlight} />
      <ellipse cx="130" cy="64" rx="62" ry="52" fill={highlight} />
      <ellipse cx="205" cy="72" rx="54" ry="46" fill={highlight} />
      <ellipse cx="248" cy="92" rx="36" ry="32" fill={highlight} />
      <ellipse
        cx="140"
        cy="45"
        rx="55"
        ry="14"
        fill={highlight}
        opacity="0.7"
      />
    </svg>
  );
}

export function CloudBackground({
  palette = "dawn",
  weather,
  className = "",
}: {
  palette?: Palette;
  /** v5.2 sky footer. Omit it and the palette renders as before. */
  weather?: SkyWeatherId;
  className?: string;
}) {
  const base = PALETTES[palette];
  const w = weather ? skyWeatherById(weather) : null;
  const sky = w?.sky ?? base.sky;
  const glow = w?.glow ?? base.glow;
  const shadowFill = w?.shadowFill ?? base.shadowFill;
  const highlight = w?.highlight ?? base.highlight;

  return (
    <div
      aria-hidden="true"
      className={`-z-20 absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className={w ? "sky-wx-sky absolute inset-0" : "absolute inset-0"}
        style={{ background: sky }}
      />
      <div
        className={`absolute inset-x-0 top-[55%] mx-auto h-[70vh] w-[85vw] max-w-4xl rounded-full blur-2xl ${w ? "sky-wx-sky" : ""}`}
        style={{ background: glow }}
      />
      {w?.sun ? <div className="sky-sun" /> : null}

      {CLOUDS.map((c, i) => {
        const style = {
          top: c.top,
          opacity: Math.min(1, c.opacity * (w?.cloudAlpha ?? 1)),
          animationDuration: `${c.duration}s`,
          animationDelay: `${c.delay}s`,
          ...(w
            ? { "--cs-w": `${Math.round(c.size * w.cloudScale)}px` }
            : { width: `${c.size}px` }),
        } as CSSProperties;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static config
            key={i}
            className={
              w ? "cs-cloud sky-wx-cloud absolute" : "cs-cloud absolute"
            }
            style={style}
          >
            <CloudSvg shadowFill={shadowFill} highlight={highlight} />
          </div>
        );
      })}
    </div>
  );
}
