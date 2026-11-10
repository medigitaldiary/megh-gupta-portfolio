"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useBentoBoard } from "@/components/bento/bento-board";
import {
  BENTO_LENSES,
  BENTO_NUMBERS,
  ROUTE_STOPS,
  type RouteStopId,
} from "@/lib/bento";

// ── Cover video ────────────────────────────────────────────────
// Poster first, clip plays only while the tile is on screen. Reduced
// motion keeps the poster. Same behaviour as the work shelf covers.

export function CoverVideo({
  poster,
  video,
  sizes,
  className = "object-cover",
}: {
  poster?: string;
  video?: string;
  sizes: string;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement | null>(null);
  const play = Boolean(video) && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.play().catch(() => {});
          return;
        }
        el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [play]);

  if (play && video) {
    return (
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        className={`absolute inset-0 h-full w-full ${className}`}
      >
        <source src={video} type="video/mp4" />
      </video>
    );
  }
  if (!poster) return null;
  return <Image src={poster} alt="" fill sizes={sizes} className={className} />;
}

// ── Route tile ─────────────────────────────────────────────────
// Lucknow to Goa to Bengaluru, drawn as a boarding pass. The left side
// is the route; the stub on the right shows the selected stop. The
// Bengaluru stop carries the career, so this tile is also the
// experience strip.

export type RouteJob = {
  name: string;
  role: string;
  range: string;
  metric?: string;
  logo?: string;
  logoBg?: string;
};

export type RoutePhoto = { src: string; alt: string; caption: string };

export function RouteTile({
  jobs,
  goa,
  bitsLogo,
}: {
  jobs: RouteJob[];
  goa?: RoutePhoto;
  bitsLogo?: string;
}) {
  const [stop, setStop] = useState<RouteStopId>("blr");

  return (
    <section
      aria-label="My route: Lucknow, Goa, Bengaluru"
      className="bento-tile bento-area-route flex flex-col md:flex-row"
    >
      <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-4 p-5 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="bento-eyebrow">The route so far</p>
          <p className="bento-eyebrow hidden sm:block">
            Boarding pass · Megh Gupta
          </p>
        </div>

        <div>
          <svg
            viewBox="0 0 600 84"
            className="block h-auto w-full text-fg"
            aria-hidden="true"
            role="presentation"
          >
            <path
              d="M100 78 Q200 -6 300 78 Q400 -6 500 78"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="1 9"
              opacity="0.55"
            />
            <g className="bento-plane">
              <path
                d="M-11 0 L-5 -2.4 L-8 -8 L-5 -8 L1 -2.4 L8 -2.4 Q11 -2.4 11 0 Q11 2.4 8 2.4 L1 2.4 L-5 8 L-8 8 L-5 2.4 Z"
                fill="currentColor"
              />
            </g>
          </svg>

          <div className="grid grid-cols-3">
            {ROUTE_STOPS.map((s) => {
              const active = s.id === stop;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStop(s.id)}
                  className="group flex min-h-11 flex-col items-center gap-1 rounded-[18px] px-1 py-2 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span
                    data-active={active}
                    className="bento-code font-display text-[1.75rem] leading-none tracking-tight text-fg md:text-[3rem]"
                  >
                    {s.code}
                  </span>
                  <span className="text-fg-muted text-xs md:text-sm">
                    {s.city}
                  </span>
                  <span
                    className={`mt-1 hidden rounded-full px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] sm:block ${
                      active
                        ? "bg-fg text-accent-fg"
                        : "bento-glass text-fg-muted group-hover:text-fg"
                    }`}
                  >
                    {s.chip}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bento-stub flex min-h-[13.5rem] flex-col justify-between gap-3 p-5 md:w-[44%] md:p-7">
        <div aria-live="polite" className="min-w-0">
          {stop === "lko" ? <LucknowStop /> : null}
          {stop === "goi" ? <GoaStop photo={goa} logo={bitsLogo} /> : null}
          {stop === "blr" ? <BengaluruStop jobs={jobs} /> : null}
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="bento-eyebrow">LKO → BLR · via GOI</p>
          <span className="bento-barcode" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function LucknowStop() {
  const [hindi, setHindi] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setHindi((v) => !v), 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div>
      <p className="bento-eyebrow">Stop 01 · Home</p>
      <p className="sr-only">Lucknow, the City of Nawabs.</p>
      <p
        aria-hidden="true"
        className="bento-flip mt-3 font-display text-[1.75rem] leading-[1.15] tracking-tight text-fg md:text-[2rem]"
      >
        <span data-on={!hindi}>City of Nawabs</span>
        <span data-on={hindi} lang="hi">
          नवाबों का शहर
        </span>
      </p>
      <p className="mt-3 text-fg-muted text-sm leading-normal">
        Where I am from, and where the manners come from.
      </p>
    </div>
  );
}

function GoaStop({ photo, logo }: { photo?: RoutePhoto; logo?: string }) {
  return (
    <div>
      <div className="flex items-start gap-4">
        {photo ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="bento-eyebrow">Stop 02 · College</p>
            {logo ? (
              <span className="relative block h-7 w-[4.5rem] shrink-0">
                <Image
                  src={logo}
                  alt="BITS Pilani, K K Birla Goa Campus"
                  fill
                  sizes="72px"
                  className="object-contain object-right"
                />
              </span>
            ) : null}
          </div>
          <p className="mt-2 font-display text-fg text-xl leading-tight tracking-tight">
            BITS Goa, class of 2025.
          </p>
        </div>
      </div>
      <p className="mt-3 font-medium text-fg text-sm leading-snug">
        Chief Coordinator, Backstage.
      </p>
      <p className="mt-1 text-fg-muted text-sm leading-normal">
        Hosted the best DJ nights on campus. Managed Waves &apos;22, one of
        India&apos;s largest cultural festivals.
      </p>
    </div>
  );
}

function BengaluruStop({ jobs }: { jobs: RouteJob[] }) {
  return (
    <div>
      <p className="bento-eyebrow">Stop 03 · Work</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {jobs.map((job) => (
          <li key={job.name} className="flex items-center gap-3">
            <span
              className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-[8px] ${job.logoBg ?? "bg-bg"}`}
            >
              {job.logo ? (
                <Image
                  src={job.logo}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-fg text-sm leading-tight">
                  {job.name}
                </span>
                {job.metric ? (
                  <span className="shrink-0 font-display text-fg text-sm tracking-tight">
                    {job.metric}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="truncate text-fg-muted text-xs">
                  {job.role}
                </span>
                <span className="shrink-0 font-mono text-[0.625rem] text-fg-subtle uppercase tracking-[0.06em]">
                  {job.range}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Print stack ────────────────────────────────────────────────
// The illustrated cut-outs from the About collage as a loose pile.
// Tap to send the top print to the back.

export type BentoPrint = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export function PrintStack({ prints }: { prints: BentoPrint[] }) {
  const [top, setTop] = useState(0);
  const count = prints.length;
  const current = prints[top];

  return (
    <section
      aria-label="Off the clock"
      data-scan-dim
      className="bento-tile bento-area-prints flex flex-col p-5 md:p-6"
    >
      <div className="flex items-center justify-between">
        <p className="bento-eyebrow">Off the clock</p>
        <p className="bento-eyebrow">
          {top + 1} / {count}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setTop((t) => (t + 1) % count)}
        aria-label="Show the next photo"
        className="group relative mx-auto mt-4 mb-8 min-h-[19rem] w-[66%] flex-1 focus-visible:outline-none lg:min-h-0 lg:w-[74%]"
      >
        {prints.map((print, i) => {
          const pos = (i - top + count) % count;
          return (
            <span
              key={print.id}
              data-pos={Math.min(pos, 3)}
              className="bento-print absolute inset-0 overflow-hidden rounded-[12px] border-[5px] border-bg-elevated bg-bg"
            >
              <Image
                src={print.src}
                alt={pos === 0 ? print.alt : ""}
                fill
                sizes="(min-width: 1024px) 260px, 60vw"
                className="object-cover"
              />
            </span>
          );
        })}
      </button>

      <p
        aria-live="polite"
        className="min-h-10 text-fg-muted text-sm leading-snug"
      >
        {current?.caption}
      </p>
    </section>
  );
}

// ── Venn filter ────────────────────────────────────────────────
// Pick a circle and the tiles that answer to it stay lit.

const VENN_CIRCLES = [
  { id: "user", cx: 48, cy: 44 },
  { id: "tech", cx: 88, cy: 44 },
  { id: "business", cx: 68, cy: 78 },
] as const;

export function VennTile() {
  const { lens, setLens } = useBentoBoard();

  return (
    <section
      aria-label="Filter the board by lens"
      data-scan-dim
      className="bento-tile bento-area-venn flex flex-col justify-between p-4 md:p-5"
    >
      <p className="bento-eyebrow">Pick a lens</p>
      <svg
        viewBox="0 0 136 122"
        className="mx-auto block h-auto w-full max-w-[9.5rem]"
        aria-hidden="true"
        role="presentation"
      >
        {VENN_CIRCLES.map((c) => (
          // biome-ignore lint/a11y/noStaticElementInteractions: the chips below are the keyboard path; circles are a pointer shortcut.
          <circle
            key={c.id}
            cx={c.cx}
            cy={c.cy}
            r={38}
            data-venn={c.id}
            data-active={lens === null || lens === c.id}
            className="bento-venn-circle"
            onClick={() => setLens(lens === c.id ? null : c.id)}
          />
        ))}
      </svg>
      <div className="flex flex-wrap justify-center gap-1.5">
        {BENTO_LENSES.map((l) => {
          const active = lens === l.id;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={active}
              onClick={() => setLens(active ? null : l.id)}
              className={`min-h-8 rounded-full px-2.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                active ? "bg-fg text-accent-fg" : "bento-glass text-fg"
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Numbers tile ───────────────────────────────────────────────

export function NumbersTile({ lenses }: { lenses: string }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setI((v) => (v + 1) % BENTO_NUMBERS.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  const n = BENTO_NUMBERS[i];

  return (
    <section
      aria-label="Numbers I have moved"
      data-lenses={lenses}
      className="bento-tile bento-area-nums flex flex-col justify-between p-4 md:p-5"
    >
      <p className="bento-eyebrow">Receipts</p>
      <div key={i} className="bento-roll">
        <p className="font-display text-[2.5rem] text-fg leading-none tracking-tight md:text-[2.75rem]">
          {n?.value}
        </p>
        <p className="mt-2 text-fg-muted text-sm leading-snug">{n?.label}</p>
      </div>
      <div className="flex gap-1" aria-hidden="true">
        {BENTO_NUMBERS.map((item, idx) => (
          <span
            key={item.label}
            className={`h-1 flex-1 rounded-full ${idx === i ? "bg-fg" : "bg-border"}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── Bengaluru, right now ───────────────────────────────────────

function statusFor(day: string, hour: number): string {
  if (hour < 7) return "Asleep. Email works.";
  const weekend = day === "Sat" || day === "Sun";
  if (day === "Sun" && hour < 11) return "Probably on the GT650.";
  if (weekend) return hour < 19 ? "Out exploring." : "Guitar, or FIFA.";
  if (hour < 10) return "Coffee, then standup.";
  if (hour < 19) return "Shipping.";
  if (hour < 21) return "At the gym.";
  return "Guitar, or FIFA.";
}

export function NowTile() {
  const [now, setNow] = useState<{ time: string; status: string } | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      weekday: "short",
    });
    const hourFmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false,
    });
    const tick = () => {
      const date = new Date();
      const parts = fmt.formatToParts(date);
      const get = (type: string) =>
        parts.find((p) => p.type === type)?.value ?? "";
      const hour = Number(hourFmt.format(date)) % 24;
      setNow({
        time: `${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`,
        status: statusFor(get("weekday"), hour),
      });
    };
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Bengaluru, right now"
      data-scan-dim
      className="bento-tile bento-area-now flex flex-col justify-between p-4 md:p-5"
    >
      <p className="bento-eyebrow flex items-center gap-1.5">
        <span className="bento-live-dot" aria-hidden="true" />
        BLR · now
      </p>
      <div>
        <p className="font-display text-[1.5rem] text-fg leading-none tracking-tight md:text-[1.625rem]">
          {now?.time ?? "··:··"}
        </p>
        <p className="mt-1.5 min-h-5 text-fg-muted text-sm leading-snug">
          {now?.status ?? ""}
        </p>
      </div>
    </section>
  );
}

// ── Scan mode switch ───────────────────────────────────────────

export function ScanSwitch() {
  const { scan, setScan } = useBentoBoard();

  return (
    <section
      aria-label="Scan mode"
      className="bento-tile bento-area-scan flex flex-col justify-between p-4 md:p-5"
    >
      <p className="bento-eyebrow">Scan mode</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-fg text-sm leading-snug">
          Short on time?
          <span className="block text-fg-muted">Numbers only.</span>
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={scan}
          aria-label="Scan mode: show numbers, roles and contact only"
          onClick={() => setScan(!scan)}
          className="bento-switch shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated"
        >
          <span className="bento-switch-knob" />
        </button>
      </div>
    </section>
  );
}
