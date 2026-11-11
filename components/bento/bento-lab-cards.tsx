"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBentoBoard } from "@/components/bento/bento-board";

// Card lab: six object cards to try before any of them joins the board.
// Values marked PLACEHOLDER are stand-ins until Megh supplies the real
// ones.

// ── 1. Call card ───────────────────────────────────────────────
// The AI call pipeline in one loop: a call plays, gets scored, and
// turns into follow-ups. The call shown is a made-up sample.

const WAVE = [
  34, 58, 42, 76, 90, 52, 38, 66, 84, 48, 30, 62, 94, 70, 44, 56, 80, 36, 60,
  88, 50, 32, 72, 96, 54, 40, 68, 82, 46, 28, 64, 92, 58, 38, 74, 86, 48, 34,
  62, 78, 44, 30, 56, 70, 40, 26,
];

const RUBRIC = [
  { label: "Opening", score: 4 },
  { label: "Discovery", score: 3 },
  { label: "Compliance", score: 5 },
];

const ACTIONS = [
  "Send the two-bond comparison",
  "Call back Thursday, 11 am",
  "Flag missing KYC document",
];

const CALL_STEPS = ["Listening", "Scoring", "Done"] as const;

export function CallCard() {
  const reduced = useReducedMotion() ?? false;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(2);
      return;
    }
    const waits = [3200, 1400, 5200];
    const id = window.setTimeout(
      () => setStep((s) => (s + 1) % 3),
      waits[step],
    );
    return () => window.clearTimeout(id);
  }, [step, reduced]);

  return (
    <Link
      href="/work/ai-call-analysis-pipeline"
      aria-label="AI call analysis pipeline: a sample call being scored. Read the case study."
      data-side="work"
      className="bento-tile bento-link flex h-full flex-col gap-4 p-5 md:flex-row md:gap-6 md:p-6"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="bento-eyebrow">Sample call · RM outbound · 06:42</p>
          <span className="bento-glass inline-flex min-h-7 items-center gap-1.5 px-3 text-fg text-xs">
            <span
              className="bento-live-dot"
              data-pulse={step < 2}
              aria-hidden="true"
            />
            {CALL_STEPS[step]}
          </span>
        </div>

        <div
          className="bento-wave"
          data-playing={step === 0}
          aria-hidden="true"
        >
          {WAVE.map((h, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative bars, never reordered.
              key={i}
              style={{ height: `${h}%`, animationDelay: `${(i % 9) * -110}ms` }}
            />
          ))}
        </div>

        <p className="text-fg-muted text-sm leading-snug">
          Every night, about 8 hours of recordings go in. Scores and follow-up
          tasks come out.
        </p>
      </div>

      <div className="flex shrink-0 flex-col justify-between gap-3 rounded-[18px] bg-bg/60 p-4 md:w-[44%]">
        {step < 2 ? (
          <div className="flex flex-1 flex-col justify-center gap-2.5">
            <p className="bento-eyebrow">
              {step === 0 ? "Transcribing" : "Scoring against the rubric"}
            </p>
            <span className="bento-skeleton w-[85%]" />
            <span className="bento-skeleton w-[60%]" />
            <span className="bento-skeleton w-[72%]" />
          </div>
        ) : (
          <div className="bento-roll flex flex-1 flex-col justify-between gap-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="bento-eyebrow">Call quality</p>
                <p className="mt-1 font-display text-[2.5rem] text-fg leading-none tracking-tight">
                  82
                  <span className="text-base text-fg-subtle"> / 100</span>
                </p>
              </div>
              <ul className="flex flex-col gap-1">
                {RUBRIC.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-end gap-2 font-mono text-[0.625rem] text-fg-muted uppercase tracking-[0.08em]"
                  >
                    {r.label}
                    <span className="flex gap-0.5" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`h-1.5 w-2.5 rounded-full ${n <= r.score ? "bg-fg" : "bg-border"}`}
                        />
                      ))}
                    </span>
                    <span className="sr-only">{r.score} of 5</span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="flex flex-col gap-1.5 border-border border-t pt-3">
              {ACTIONS.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 text-fg text-sm leading-tight"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                    role="presentation"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
}

// ── 2. GT650 twin dials ────────────────────────────────────────
// Retro twin-pod clocks: speedometer on the left, rev counter on the
// right. The needles sweep once on load, like turning the key, and
// jump when the card is tapped.

// Roughly where the bike is today.
const ODO_READING = "05000";

const SWEEP_START = 135;
const SWEEP = 270;

function polar(angle: number, radius: number): { x: number; y: number } {
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.round((100 + radius * Math.cos(rad)) * 100) / 100,
    y: Math.round((100 + radius * Math.sin(rad)) * 100) / 100,
  };
}

function Dial({
  max,
  majorStep,
  minorStep,
  value,
  unit,
  redFrom,
  readout,
}: {
  max: number;
  majorStep: number;
  minorStep: number;
  value: number;
  unit: string;
  redFrom?: number;
  readout?: string;
}) {
  const angleFor = (v: number) => SWEEP_START + (v / max) * SWEEP;
  const ticks: { v: number; major: boolean }[] = [];
  for (let v = 0; v <= max + 0.001; v += minorStep) {
    const rounded = Math.round(v * 100) / 100;
    ticks.push({
      v: rounded,
      major:
        Math.abs(rounded / majorStep - Math.round(rounded / majorStep)) < 0.001,
    });
  }
  const red =
    redFrom === undefined
      ? null
      : { from: polar(angleFor(redFrom), 80), to: polar(angleFor(max), 80) };

  return (
    <svg
      viewBox="0 0 200 200"
      className="bento-dial bento-object block h-full w-auto max-w-full"
      aria-hidden="true"
      role="presentation"
    >
      <circle cx="100" cy="100" r="99" className="bento-dial-bezel" />
      <circle cx="100" cy="100" r="92" className="bento-dial-rim" />
      <circle cx="100" cy="100" r="88" className="bento-dial-face" />
      {red ? (
        <path
          d={`M${red.from.x} ${red.from.y} A80 80 0 0 1 ${red.to.x} ${red.to.y}`}
          className="bento-dial-red"
        />
      ) : null}
      {ticks.map((t) => {
        const a = angleFor(t.v);
        const outer = polar(a, 84);
        const inner = polar(a, t.major ? 72 : 78);
        return (
          <line
            key={t.v}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            className="bento-dial-tick"
            data-major={t.major}
          />
        );
      })}
      {ticks
        .filter((t) => t.major)
        .map((t) => {
          const pos = polar(angleFor(t.v), 58);
          return (
            <text
              key={t.v}
              x={pos.x}
              y={pos.y}
              className="bento-dial-num"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {t.v}
            </text>
          );
        })}
      <text x="100" y="74" className="bento-dial-unit" textAnchor="middle">
        {unit}
      </text>
      {readout ? (
        <>
          <rect
            x="72"
            y="128"
            width="56"
            height="20"
            rx="4"
            className="bento-dial-lcd"
          />
          <text
            x="100"
            y="138.5"
            className="bento-dial-lcd-text"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {readout}
          </text>
        </>
      ) : null}
      <g
        className="bento-dial-needle"
        style={{ transform: `rotate(${angleFor(value)}deg)` }}
      >
        <path
          d="M-14 0 L0 -3 L74 -0.8 L74 0.8 L0 3 Z"
          transform="translate(100 100)"
        />
      </g>
      <circle cx="100" cy="100" r="9" className="bento-dial-hub" />
      <circle cx="100" cy="100" r="3" className="bento-dial-pin" />
    </svg>
  );
}

// Engine note, built in the browser with Web Audio: no audio file. It is
// a synthesised stand-in for a parallel twin, not a recording of the
// bike. Plays only on a tap, never on load.
let revAudio: AudioContext | null = null;

function playRev() {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    revAudio = revAudio ?? new Ctor();
    const ctx = revAudio;
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime;

    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.22, t + 0.06);
    out.gain.setValueAtTime(0.22, t + 0.95);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(260, t);
    filter.frequency.exponentialRampToValueAtTime(1500, t + 0.5);
    filter.frequency.exponentialRampToValueAtTime(240, t + 1.4);

    // Soft clipping gives the exhaust its rasp.
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(3 * x);
    }
    shaper.curve = curve;

    // Three voices: the firing note, the uneven thump half an octave
    // down that a 270 degree twin has, and a thin edge on top.
    const voices: [OscillatorType, number, number][] = [
      ["sawtooth", 1, 0.5],
      ["sawtooth", 0.5, 0.6],
      ["square", 1.5, 0.08],
    ];
    for (const [type, ratio, level] of voices) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      gain.gain.value = level;
      osc.frequency.setValueAtTime(42 * ratio, t);
      osc.frequency.exponentialRampToValueAtTime(215 * ratio, t + 0.5);
      osc.frequency.setValueAtTime(215 * ratio, t + 0.62);
      osc.frequency.exponentialRampToValueAtTime(42 * ratio, t + 1.4);
      osc.connect(gain).connect(shaper);
      osc.start(t);
      osc.stop(t + 1.55);
    }

    shaper.connect(filter).connect(out).connect(ctx.destination);
  } catch {
    // No sound is fine; the needles still move.
  }
}

const IDLE = { speed: 0, revs: 1.2 };
const FULL = { speed: 200, revs: 8 };
const REVVED = { speed: 110, revs: 6.4 };

export function SpeedoCard() {
  const reduced = useReducedMotion() ?? false;
  const [dials, setDials] = useState({ speed: 0, revs: 0 });
  const [revving, setRevving] = useState(false);

  // Key-on sweep: needles run to the stop and settle back.
  useEffect(() => {
    if (reduced) {
      setDials(IDLE);
      return;
    }
    const up = window.setTimeout(() => setDials(FULL), 400);
    const down = window.setTimeout(() => setDials(IDLE), 1500);
    return () => {
      window.clearTimeout(up);
      window.clearTimeout(down);
    };
  }, [reduced]);

  useEffect(() => {
    if (!revving) return;
    setDials(REVVED);
    const id = window.setTimeout(() => {
      setDials(IDLE);
      setRevving(false);
    }, 1300);
    return () => window.clearTimeout(id);
  }, [revving]);

  const rev = () => {
    playRev();
    setRevving(true);
  };

  return (
    <section
      aria-label={`GT650 clocks. Odometer: ${Number(ODO_READING).toLocaleString("en-IN")} kilometres.`}
      data-side="life"
      className="bento-tile flex h-full flex-col gap-3 p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="bento-eyebrow">GT650 · the clocks</p>
        <button
          type="button"
          onClick={rev}
          className="bento-glass inline-flex min-h-8 items-center px-3 text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Twist the throttle
        </button>
      </div>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={rev}
        className="flex min-h-0 flex-1 items-center justify-center gap-3 md:gap-5"
      >
        <span className="flex aspect-square h-full max-h-[15rem] min-h-0 max-w-[48%] items-center justify-center">
          <Dial
            max={200}
            majorStep={20}
            minorStep={10}
            value={dials.speed}
            unit="km/h"
            readout={ODO_READING}
          />
        </span>
        <span className="flex aspect-square h-full max-h-[15rem] min-h-0 max-w-[48%] items-center justify-center">
          <Dial
            max={8}
            majorStep={1}
            minorStep={0.5}
            value={dials.revs}
            unit="x1000 rpm"
            redFrom={7}
          />
        </span>
      </button>

      <p className="text-fg-muted text-sm leading-snug">
        Not a collection. New cities at my own pace.
      </p>
    </section>
  );
}

// ── 3. HYROX race bib ──────────────────────────────────────────

// PLACEHOLDER bib number. Swap for the real one.
const BIB_NUMBER = "1107";

export function RaceBibCard() {
  return (
    <section
      aria-label="HYROX race bib: Delhi finished, Noida next"
      data-side="life"
      className="bento-tile flex h-full flex-col gap-4 p-5 md:p-6"
    >
      <p className="bento-eyebrow">Hybrid athlete, in training</p>

      <div className="flex flex-1 items-center justify-center py-2">
        <div className="bento-bib bento-object">
          <span className="bento-bib-hole" data-corner="tl" />
          <span className="bento-bib-hole" data-corner="tr" />
          <span className="bento-bib-hole" data-corner="bl" />
          <span className="bento-bib-hole" data-corner="br" />
          <div className="flex items-center justify-between bg-fg px-6 py-2 font-mono text-[0.625rem] text-accent-fg uppercase tracking-[0.14em]">
            <span>HYROX · Delhi</span>
            <span>Finisher</span>
          </div>
          <p className="px-4 pt-3 text-center font-display font-semibold text-[4.25rem] text-fg leading-none tracking-tight">
            {BIB_NUMBER}
          </p>
          <p className="pb-3 text-center font-display text-fg text-xl tracking-[0.3em]">
            MEGH
          </p>
          <div className="flex items-center justify-between gap-3 border-border border-t border-dashed px-4 py-2">
            <span className="font-mono text-[0.625rem] text-fg-muted uppercase tracking-[0.1em]">
              Next start · Noida · Jan
            </span>
            <span className="bento-barcode" aria-hidden="true" />
          </div>
        </div>
      </div>

      <p className="text-fg-muted text-sm leading-snug lg:hidden">
        Delhi is done. Noida is next.
      </p>
    </section>
  );
}

// ── 4. Cassette mixtape ────────────────────────────────────────

const SIDES = {
  a: {
    title: "Side A: Work",
    tracks: [
      "SEO Engine (2x remix)",
      "Ultra Web, four phases",
      "Bond Bytes, daily",
      "DERIDATA, 80% auto-fill",
    ],
  },
  b: {
    title: "Side B: Life",
    tracks: [
      "GT650, no itinerary",
      "HYROX, Delhi cut",
      "Guitar first",
      "FIFA over football",
    ],
  },
} as const;

function CassetteFace({ title }: { title: string }) {
  return (
    <span className="bento-tape-face">
      <span className="bento-tape-label">
        <span className="font-hand text-[1.375rem] text-fg leading-none">
          {title}
        </span>
        <span className="font-mono text-[0.5625rem] text-fg-subtle uppercase tracking-[0.14em]">
          Megh · C60
        </span>
      </span>
      <span className="bento-tape-window">
        <span className="bento-reel" />
        <span className="bento-tape-film" />
        <span className="bento-reel" />
      </span>
      <span className="bento-tape-foot" />
    </span>
  );
}

export function CassetteCard() {
  const [side, setSide] = useState<"a" | "b">("a");
  const current = SIDES[side];

  return (
    <section
      aria-label="Mixtape: side A is work, side B is life"
      className="bento-tile flex h-full flex-col gap-4 p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="bento-eyebrow">The mixtape</p>
        <button
          type="button"
          onClick={() => setSide(side === "a" ? "b" : "a")}
          className="bento-glass inline-flex min-h-8 items-center px-3 text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Flip the tape
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center gap-5 sm:flex-row">
        <button
          type="button"
          onClick={() => setSide(side === "a" ? "b" : "a")}
          aria-label={`Playing ${current.title}. Flip the tape.`}
          className="bento-tape bento-object focus-visible:outline-none"
          data-side-up={side}
        >
          <span className="bento-tape-inner">
            <CassetteFace title={SIDES.a.title} />
            <CassetteFace title={SIDES.b.title} />
          </span>
        </button>

        <ol
          key={side}
          aria-live="polite"
          className="bento-roll flex w-full min-w-0 flex-1 flex-col gap-2"
        >
          {current.tracks.map((t, i) => (
            <li
              key={t}
              className="flex items-baseline gap-2.5 border-border border-b pb-2 text-fg text-sm leading-tight last:border-b-0"
            >
              <span className="font-mono text-[0.625rem] text-fg-subtle">
                0{i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── 5. Backstage crew pass ─────────────────────────────────────

export function CrewPassCard() {
  return (
    <section
      aria-label="Backstage crew pass: Waves 2022, Chief Coordinator, all access"
      data-side="life"
      className="bento-tile flex h-full flex-col items-center overflow-hidden px-5 pb-5 md:px-6 md:pb-6"
    >
      <span className="bento-strap" aria-hidden="true" />
      <div className="bento-pass bento-object">
        <span className="bento-pass-slot" aria-hidden="true" />
        <p className="font-mono text-[0.625rem] text-fg-subtle uppercase tracking-[0.2em]">
          BITS Goa presents
        </p>
        <p className="mt-1 font-display font-semibold text-[2rem] text-fg leading-none tracking-tight">
          WAVES &apos;22
        </p>
        <div className="relative mt-4 h-20 w-20 overflow-hidden rounded-full border-2 border-fg">
          <Image
            src="/images/hero-portrait.webp"
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <p className="mt-3 font-medium text-base text-fg leading-tight">
          Megh Gupta
        </p>
        <p className="mt-0.5 text-center text-fg-muted text-xs leading-snug">
          Chief Coordinator · Backstage
        </p>
        <p className="mt-4 w-full bg-fg py-1.5 text-center font-mono text-[0.6875rem] text-accent-fg uppercase tracking-[0.3em]">
          All access
        </p>
        <span className="bento-barcode mt-3" aria-hidden="true" />
      </div>
    </section>
  );
}

// ── 6. Crossfader ──────────────────────────────────────────────
// A DJ fader between the day job and after hours. Past the middle,
// the board goes dark and the life cards take the light.

export function CrossfaderCard() {
  const { mode, setMode } = useBentoBoard();
  const [value, setValue] = useState(0);

  const snap = () => setValue(mode === "night" ? 100 : 0);

  return (
    <section
      aria-label="Crossfader: day job or after hours"
      className="bento-tile flex h-full flex-col justify-between gap-4 p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="bento-eyebrow">Crossfader</p>
        <p className="bento-eyebrow">
          Now playing · {mode === "night" ? "After hours" : "Day job"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setMode("day");
            setValue(0);
          }}
          className={`shrink-0 rounded-full px-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === "day" ? "font-medium text-fg" : "text-fg-subtle"
          }`}
        >
          Day job
        </button>
        <div className="bento-fader">
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            aria-label="Crossfade from day job to after hours"
            aria-valuetext={mode === "night" ? "After hours" : "Day job"}
            onChange={(e) => {
              const v = Number(e.target.value);
              setValue(v);
              setMode(v > 50 ? "night" : "day");
            }}
            onPointerUp={snap}
            onKeyUp={snap}
            onBlur={snap}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setMode("night");
            setValue(100);
          }}
          className={`shrink-0 rounded-full px-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            mode === "night" ? "font-medium text-fg" : "text-fg-subtle"
          }`}
        >
          After hours
        </button>
      </div>
    </section>
  );
}
