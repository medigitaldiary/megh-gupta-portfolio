"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import {
  CloudBackground,
  SKY_WEATHERS,
  type SkyWeatherId,
  skyWeatherById,
} from "@/components/cloud-background";

// Weather switch for the v5.2 sky footer.
// One segmented control, the same track as the experience view toggle.
// The sky, rain, snow and flash sit behind the footer content.

const SkyMask =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]";

const ICON = "h-3.5 w-3.5 shrink-0";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={ICON}
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5M5.8 5.8l1.8 1.8M16.4 16.4l1.8 1.8M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8" />
    </svg>
  );
}

function CloudIcon({ drops }: { drops: "fine" | "steady" | "storm" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={ICON}
    >
      <path d="M8 13.5h8.2a2.8 2.8 0 0 0 .4-5.6 3.8 3.8 0 0 0-7.3-1.1A2.8 2.8 0 0 0 8 13.5z" />
      {drops === "fine" ? <path d="M10 16.5v1.8M14 16.5v1.8" /> : null}
      {drops === "steady" ? (
        <path d="M9.5 16.2l-1 3.2M12.5 16.2l-1 3.2M15.5 16.2l-1 3.2" />
      ) : null}
      {drops === "storm" ? <path d="M13 15.2 11 18h2l-2 2.8" /> : null}
    </svg>
  );
}

function SnowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={ICON}
    >
      <path d="M12 3v18M4.5 7.5l15 9M4.5 16.5l15-9" />
    </svg>
  );
}

function WeatherIcon({ id }: { id: SkyWeatherId }) {
  if (id === "sunny") return <SunIcon />;
  if (id === "drizzle") return <CloudIcon drops="fine" />;
  if (id === "rain") return <CloudIcon drops="steady" />;
  if (id === "storm") return <CloudIcon drops="storm" />;
  return <SnowIcon />;
}

function SkyWeatherEffects({ weather }: { weather: SkyWeatherId }) {
  const w = skyWeatherById(weather);
  return (
    <div
      aria-hidden="true"
      className={`sky-wx-fx -z-10 pointer-events-none absolute inset-0 overflow-hidden ${SkyMask}`}
    >
      <div
        className={`sky-fx sky-rain sky-rain-fine ${w.rain === "fine" ? "is-on" : "is-off"}`}
      />
      <div
        className={`sky-fx sky-rain sky-rain-steady ${w.rain === "steady" ? "is-on" : "is-off"}`}
      />
      <div
        className={`sky-fx sky-rain sky-rain-back ${w.rain === "steady" || w.rain === "heavy" ? "is-on" : "is-off"}`}
      />
      <div
        className={`sky-fx sky-rain sky-rain-heavy ${w.rain === "heavy" ? "is-on" : "is-off"}`}
      />
      <div className={`sky-fx sky-snow ${w.snow ? "is-on" : "is-off"}`} />
      {w.flash ? <div className="sky-flash" /> : null}
    </div>
  );
}

export function SkyWeatherFrame({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const [weather, setWeather] = useState<SkyWeatherId>("sunny");
  return (
    <footer id="connect" className={className}>
      <CloudBackground palette="footer" weather={weather} className={SkyMask} />
      <SkyWeatherEffects weather={weather} />
      <SkyWeatherContext.Provider value={{ weather, setWeather }}>
        {children}
      </SkyWeatherContext.Provider>
    </footer>
  );
}

const SkyWeatherContext = createContext<{
  weather: SkyWeatherId;
  setWeather: (id: SkyWeatherId) => void;
} | null>(null);

export function WeatherSwitch() {
  const ctx = useContext(SkyWeatherContext);
  if (!ctx) return null;
  const { weather, setWeather } = ctx;
  const current = skyWeatherById(weather);

  return (
    <fieldset className="mt-10 border-0 p-0" data-reveal>
      <legend className="sr-only">Change the weather</legend>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p
          aria-hidden="true"
          className="font-mono text-[10px] uppercase tracking-[0.24em] text-fg-muted"
        >
          The sky
        </p>
        <div className="inline-flex max-w-full flex-wrap items-center rounded-full border border-border bg-bg-elevated p-1 font-mono text-xs">
          {SKY_WEATHERS.map((item) => {
            const on = item.id === weather;
            return (
              <label
                key={item.id}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-150 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 ${
                  on ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
                }`}
              >
                <input
                  type="radio"
                  name="sky-weather"
                  value={item.id}
                  checked={on}
                  aria-label={item.ariaLabel}
                  onChange={() => setWeather(item.id)}
                  className="sr-only"
                />
                <WeatherIcon id={item.id} />
                <span className="hidden sm:inline">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted sm:hidden">
        {current.ariaLabel}
      </p>
      <p className="sr-only" aria-live="polite">
        Weather is {current.ariaLabel}
      </p>
    </fieldset>
  );
}
