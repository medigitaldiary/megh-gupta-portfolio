"use client";

import { type PointerEvent, type ReactNode, useRef, useState } from "react";
import { useBentoBoard } from "@/components/bento/bento-board";
import { playRev } from "@/components/bento/bento-lab-cards";

// Card lab, round two: four objects that all do the same job, flipping
// the board between the day job and after hours. They share one piece of
// state, so using any of them moves the other three. Each object is a
// plain switch underneath, so a keyboard or a screen reader can use it.

function SwitchCard({
  eyebrow,
  children,
  caption,
}: {
  eyebrow: string;
  children: ReactNode;
  caption: string;
}) {
  const { mode } = useBentoBoard();
  return (
    <section className="bento-tile flex h-full flex-col gap-4 p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="bento-eyebrow">{eyebrow}</p>
        <p className="bento-eyebrow" aria-live="polite">
          {mode === "night" ? "After hours" : "Day job"}
        </p>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {children}
      </div>
      <p className="text-fg-muted text-sm leading-snug">{caption}</p>
    </section>
  );
}

// A short mechanical click, built in the browser. Plays only on a press.
let clickAudio: AudioContext | null = null;

function playClick() {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    clickAudio = clickAudio ?? new Ctor();
    const ctx = clickAudio;
    if (ctx.state === "suspended") void ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  } catch {
    // Silent is fine.
  }
}

// ── 1. Aeroplane window shade ──────────────────────────────────
// Drag the shade down and the cabin goes dark. A tap or the keyboard
// does the same thing.

export function WindowShadeSwitch() {
  const { mode, setMode } = useBentoBoard();
  const night = mode === "night";
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ y: number; pull: number; height: number } | null>(
    null,
  );
  const dragged = useRef(false);

  const pull = drag ?? (night ? 1 : 0);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = {
      y: e.clientY,
      pull: night ? 1 : 0,
      height: e.currentTarget.getBoundingClientRect().height,
    };
    dragged.current = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const s = start.current;
    if (!s) return;
    const dy = e.clientY - s.y;
    if (Math.abs(dy) > 4) dragged.current = true;
    if (!dragged.current) return;
    setDrag(Math.min(1, Math.max(0, s.pull + dy / (s.height * 0.8))));
  };

  const onPointerEnd = () => {
    if (start.current && dragged.current && drag !== null) {
      setMode(drag > 0.5 ? "night" : "day");
    }
    start.current = null;
    setDrag(null);
  };

  return (
    <SwitchCard
      eyebrow="Seat 14A · window"
      caption="Drag the shade down. The cabin goes dark."
    >
      <button
        type="button"
        role="switch"
        aria-checked={night}
        aria-label="Window shade. Down for after hours."
        className="bento-window bento-object"
        data-dragging={drag !== null}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClick={() => {
          // A drag already set the mode; only a tap or a key toggles.
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          setMode(night ? "day" : "night");
        }}
      >
        <span className="bento-window-pane">
          <span className="bento-window-sun" />
          <span className="bento-window-cloud bento-window-cloud-a" />
          <span className="bento-window-cloud bento-window-cloud-b" />
          <span className="bento-window-wing" />
          <span
            className="bento-window-shade"
            style={{ transform: `translateY(${(pull - 1) * 100}%)` }}
          >
            <span className="bento-window-lip" />
          </span>
        </span>
      </button>
    </SwitchCard>
  );
}

// ── 2. Guitar pedal ────────────────────────────────────────────
// A stomp box. Step on the footswitch, the lamp comes on.

export function PedalSwitch() {
  const { mode, setMode } = useBentoBoard();
  const night = mode === "night";

  return (
    <SwitchCard
      eyebrow="Pedalboard · one stomp"
      caption="Step on it. The lamp says which side is playing."
    >
      <button
        type="button"
        role="switch"
        aria-checked={night}
        aria-label="Guitar pedal. On for after hours."
        className="bento-pedal bento-object"
        onClick={() => {
          playClick();
          setMode(night ? "day" : "night");
        }}
      >
        <span className="bento-pedal-top">
          <span className="bento-pedal-knob" data-turned={night} />
          <span className="bento-pedal-lamp" data-on={night} />
          <span className="bento-pedal-knob" data-turned={!night} />
        </span>
        <span className="bento-pedal-name">After hours</span>
        <span className="bento-pedal-sub">Overdrive · MG-1</span>
        <span className="bento-pedal-foot" />
        <span className="bento-pedal-jacks">
          <span>In</span>
          <span>Out</span>
        </span>
      </button>
    </SwitchCard>
  );
}

// ── 3. Ignition key ────────────────────────────────────────────
// Turn the key: the engine catches and the headlamp comes on.

export function IgnitionSwitch() {
  const { mode, setMode } = useBentoBoard();
  const night = mode === "night";

  return (
    <SwitchCard
      eyebrow="GT650 · ignition"
      caption="Turn the key. Engine on, headlamp on, work off."
    >
      <button
        type="button"
        role="switch"
        aria-checked={night}
        aria-label="Ignition key. On for after hours."
        className="bento-ignition bento-object"
        onClick={() => {
          if (!night) playRev();
          setMode(night ? "day" : "night");
        }}
      >
        <svg viewBox="0 0 200 200" aria-hidden="true" role="presentation">
          <circle cx="100" cy="100" r="96" className="bento-dial-bezel" />
          <circle cx="100" cy="100" r="88" className="bento-dial-rim" />
          <circle cx="100" cy="100" r="62" className="bento-ignition-barrel" />
          <text x="42" y="48" className="bento-ignition-mark" data-on={!night}>
            OFF
          </text>
          <text x="158" y="48" className="bento-ignition-mark" data-on={night}>
            ON
          </text>
          <circle
            cx="100"
            cy="20"
            r="3.5"
            className="bento-ignition-lamp"
            data-on={night}
          />
          <g className="bento-ignition-key" data-on={night}>
            <rect x="94" y="64" width="12" height="72" rx="3" />
            <rect
              x="81"
              y="32"
              width="38"
              height="38"
              rx="10"
              className="bento-ignition-head"
            />
            <circle cx="100" cy="44" r="4.5" className="bento-ignition-hole" />
          </g>
        </svg>
      </button>
    </SwitchCard>
  );
}

// ── 4. Clock out ───────────────────────────────────────────────
// A status pill and a punch card: at work, or clocked out.

function istNow(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function ClockOutSwitch() {
  const { mode, setMode } = useBentoBoard();
  const night = mode === "night";
  const [stamp, setStamp] = useState<string | null>(null);

  return (
    <SwitchCard
      eyebrow="Status · punch card"
      caption="One tap between shipping and switching off."
    >
      <div className="flex w-full max-w-[15rem] flex-col items-stretch gap-3">
        <p className="bento-glass inline-flex min-h-9 items-center gap-2 self-start px-3 text-fg text-sm">
          <span className="bento-status-dot" data-away={night} />
          {night ? "Clocked out" : "At work · shipping"}
        </p>

        <div className="bento-punch bento-object">
          <p className="bento-punch-row">
            <span>In</span>
            <span>09:30</span>
          </p>
          <p className="bento-punch-row" data-empty={!night}>
            <span>Out</span>
            <span>{night ? (stamp ?? "19:30") : "--:--"}</span>
          </p>
          <span className="bento-punch-stamp" data-on={night}>
            Done for the day
          </span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={night}
          className="bento-btn bento-btn-solid bento-clock-btn"
          onClick={() => {
            if (!night) setStamp(istNow());
            setMode(night ? "day" : "night");
          }}
        >
          {night ? "Clock back in" : "Clock out"}
        </button>
      </div>
    </SwitchCard>
  );
}
