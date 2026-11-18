"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { CloudBackground } from "@/components/cloud-background";

// Weather toy for the sky footer (/preview/v5.3).
//
// One button in the meta strip cycles the sky through five moods. The
// clouds stay the background; each mood only adds layers on top of them:
// a veil that tints the sky, plus sun, rain, a lightning flash or snow.
// The looks live in app/globals.css (.wx-*), keyed off data-weather on
// the footer. Every colour is one the sky already uses (CLAUDE.md §3).
// Reduced motion keeps the look but stills the rain, snow and flash.

const WEATHERS = [
  { id: "sunny", label: "Sunny" },
  { id: "drizzle", label: "Drizzling" },
  { id: "rain", label: "Rainy" },
  { id: "storm", label: "Thunderstorm" },
  { id: "winter", label: "Winter morning" },
] as const;

type WeatherId = (typeof WEATHERS)[number]["id"];

const WeatherContext = createContext<{
  index: number;
  next: () => void;
} | null>(null);

/** The footer element itself, with the sky and the weather layers. */
export function WeatherFooter({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % WEATHERS.length);
  return (
    <WeatherContext.Provider value={{ index, next }}>
      {/* Fold CTA: action. "Okay, how do I reach them?" */}
      <footer
        id="connect"
        data-weather={WEATHERS[index].id}
        className={className}
      >
        <CloudBackground
          palette="footer"
          className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]"
        />
        <div
          aria-hidden="true"
          className="-z-10 pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]"
        >
          <div className="wx-layer wx-veil" />
          <div className="wx-layer wx-sun" />
          <Rain mood="drizzle" />
          <Rain mood="rain" />
          <Rain mood="storm" />
          <div className="wx-layer wx-flash" />
          <div className="wx-layer wx-snow">
            <div className="wx-sway wx-sway-slow">
              <div className="wx-fall wx-snow-far" />
            </div>
            <div className="wx-sway">
              <div className="wx-fall wx-snow-near" />
            </div>
          </div>
        </div>
        {children}
      </footer>
    </WeatherContext.Provider>
  );
}

/** A rain layer: a far, faint strip and a near, fast one, both tilted. */
function Rain({ mood }: { mood: "drizzle" | "rain" | "storm" }) {
  return (
    <div className={`wx-layer wx-${mood}`}>
      <div className="wx-tilt">
        <div className={`wx-fall wx-${mood}-far`} />
        <div className={`wx-fall wx-${mood}-near`} />
      </div>
    </div>
  );
}

/** The one control: shows the current weather, a click moves to the next. */
export function WeatherToggle() {
  const ctx = useContext(WeatherContext);
  if (!ctx) return null;
  const current = WEATHERS[ctx.index];
  const upcoming = WEATHERS[(ctx.index + 1) % WEATHERS.length];
  return (
    <button
      type="button"
      onClick={ctx.next}
      aria-label={`Weather: ${current.label}. Change to ${upcoming.label.toLowerCase()}.`}
      title="Change the weather"
      className="-my-3 -ml-3 inline-flex sm:ml-0 min-h-11 items-center gap-1.5 self-start rounded-full px-3 text-fg text-xs underline decoration-fg/30 underline-offset-4 transition-colors duration-150 hover:decoration-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:self-auto"
    >
      <WeatherIcon id={current.id} />
      <span>{current.label.toLowerCase()}, tap to change</span>
      <span className="sr-only" aria-live="polite">
        {current.label}
      </span>
    </button>
  );
}

function WeatherIcon({ id }: { id: WeatherId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      {id === "sunny" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      )}
      {id !== "sunny" && id !== "winter" && (
        <path d="M7 15a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8a3.5 3.5 0 0 1 0 7Z" />
      )}
      {id === "drizzle" && <path d="M9 18v1M13 19v1M17 18v1" />}
      {id === "rain" && <path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" />}
      {id === "storm" && <path d="M13 13l-3 4.5h4L11 22" />}
      {id === "winter" && (
        <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5" />
      )}
    </svg>
  );
}
