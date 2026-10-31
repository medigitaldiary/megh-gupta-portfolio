"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Eyebrow } from "../primitives/eyebrow";

// =====================================================================
// Pipeline — interactive multi-stage data-flow component
// =====================================================================
// Used for architecture visualisations in case studies that describe an
// ordered sequence of transformations: audio → transcript → analysis →
// delivery → human action. One component, up to ~6 stages, interactive.
//
// Shape
//   <Pipeline footnote="Nightly batch — not real-time" stages={[
//     { id, label, title, description, preview, icon? }, ...
//   ]} />
//
// Interaction
// -----------
//   Default state: all stages visible, muted. The reader can read the
//   whole pipeline statically without pressing anything.
//   Hover / focus / tap a stage: that stage activates (highlighted,
//     scaled slightly, preview panel reveals). Auto-play pauses.
//   Play / Reset controls: progressive activation 1 → N, 1.6s per
//     stage, loops once. Reset returns to the default state.
//   Keyboard: Tab through stages (each is a <button>), Enter/Space
//     activates. Play / Reset are also <button>.
//
// Accessibility
// -------------
//   prefers-reduced-motion: no auto-sequence; no CSS transitions.
//   Essential content (titles + descriptions) is always visible, not
//     hidden behind interaction. Preview is additive detail.
//   Each stage carries an aria-pressed boolean; preview panels have
//     aria-live="polite" so screen readers announce the swap.
// =====================================================================

export type PipelineStage = {
  id: string;
  label: string; // eyebrow e.g. "01 · Ingest"
  title: string; // short title
  description: string; // one-line explanation
  icon?: ReactNode; // optional icon
  preview?: ReactNode; // panel content when active
};

const STAGE_DURATION_MS = 1600;

export function Pipeline({
  stages,
  footnote,
  initialActive = 0,
}: {
  stages: PipelineStage[];
  footnote?: string;
  initialActive?: number;
}) {
  const [activeIdx, setActiveIdx] = useState(initialActive);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const activate = useCallback(
    (i: number) => {
      // User interaction cancels any running auto-sequence.
      clearTimer();
      setPlaying(false);
      setActiveIdx(i);
    },
    [clearTimer],
  );

  const reset = useCallback(() => {
    clearTimer();
    setPlaying(false);
    setActiveIdx(0);
  }, [clearTimer]);

  const play = useCallback(() => {
    clearTimer();
    setPlaying(true);
    setActiveIdx(0);
  }, [clearTimer]);

  // Auto-sequence tick — advances activeIdx one step per
  // STAGE_DURATION_MS while playing is true. Stops when the last
  // stage is reached.
  useEffect(() => {
    if (!playing) return;
    if (activeIdx >= stages.length - 1) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setActiveIdx((i) => i + 1);
    }, STAGE_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, activeIdx, stages.length]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const active = stages[activeIdx];

  return (
    <figure
      className="pipeline my-12 rounded-xl border border-border bg-bg-elevated p-4 md:p-6"
      aria-label="Interactive pipeline diagram"
    >
      {/* Controls row */}
      <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
        <div className="min-w-0">
          <Eyebrow variant="micro">
            {footnote ?? "Interactive pipeline"}
          </Eyebrow>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playing ? reset : play}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            aria-pressed={playing}
          >
            <PlayGlyph playing={playing} />
            {playing ? "Playing" : "Play workflow"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-muted transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Stage row — horizontal on md:+, vertical stack on mobile */}
      <ol className="pipeline-stages grid grid-cols-1 gap-3 md:grid-flow-col md:auto-cols-fr md:gap-0">
        {stages.map((s, i) => (
          <PipelineStageItem
            key={s.id}
            stage={s}
            index={i}
            total={stages.length}
            isActive={i === activeIdx}
            isReached={i <= activeIdx}
            onActivate={() => activate(i)}
          />
        ))}
      </ol>

      {/* Preview panel for the active stage. Keyed by id so React
          crossfades the content on switch. aria-live=polite announces
          the swap to screen-readers without stealing focus. */}
      {active ? (
        <div
          key={active.id}
          aria-live="polite"
          className="preview mt-4 rounded-lg border border-border bg-bg p-4 md:mt-6 md:p-5"
        >
          <Eyebrow variant="accent" className="block">
            {active.label}
          </Eyebrow>
          <p className="mt-2 font-sans text-sm leading-relaxed text-fg md:text-base">
            <strong className="text-fg">{active.title}</strong>
            <span className="text-fg-muted"> — {active.description}</span>
          </p>
          {active.preview ? (
            <div className="mt-4 text-sm leading-relaxed text-fg-muted">
              {active.preview}
            </div>
          ) : null}
        </div>
      ) : null}

      <style>{`
        .pipeline [data-pipeline-stage] {
          transition: transform 240ms cubic-bezier(0.22,0.61,0.36,1),
                      box-shadow 240ms cubic-bezier(0.22,0.61,0.36,1),
                      opacity 240ms ease-out,
                      background-color 240ms ease-out,
                      border-color 240ms ease-out;
        }
        .pipeline [data-pipeline-connector]::after {
          content: '';
          position: absolute;
          background: var(--fg-subtle);
          transition: background 240ms ease-out;
        }
        @media (min-width: 768px) {
          .pipeline [data-pipeline-connector]::after {
            top: 50%;
            right: -8px;
            width: 16px;
            height: 1px;
            transform: translateY(-50%);
          }
        }
        @media (max-width: 767px) {
          .pipeline [data-pipeline-connector]::after {
            left: 24px;
            bottom: -12px;
            width: 1px;
            height: 12px;
          }
        }
        .pipeline [data-pipeline-connector][data-reached='true']::after {
          background: var(--accent);
        }
        @media (prefers-reduced-motion: reduce) {
          .pipeline [data-pipeline-stage] {
            transition: none;
          }
          .pipeline [data-pipeline-connector]::after {
            transition: none;
          }
        }
      `}</style>
    </figure>
  );
}

function PipelineStageItem({
  stage,
  index,
  total,
  isActive,
  isReached,
  onActivate,
}: {
  stage: PipelineStage;
  index: number;
  total: number;
  isActive: boolean;
  isReached: boolean;
  onActivate: () => void;
}) {
  const number = String(index + 1).padStart(2, "0");
  const isLast = index === total - 1;
  return (
    <li
      className="relative"
      data-pipeline-connector={!isLast ? "true" : undefined}
      data-reached={isReached && !isLast ? "true" : undefined}
    >
      <button
        type="button"
        data-pipeline-stage
        onClick={onActivate}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        aria-pressed={isActive}
        className={`group w-full rounded-lg border px-3 py-3 text-left md:px-4 md:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          isActive
            ? "border-accent bg-bg shadow-[0_14px_28px_-16px_rgba(31,77,58,0.35)]"
            : isReached
              ? "border-border bg-bg-elevated"
              : "border-border/70 bg-bg-elevated opacity-70"
        }`}
        style={{
          transform: isActive ? "translateY(-2px)" : "none",
        }}
      >
        <div className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-medium ${
              isReached
                ? "bg-accent text-accent-fg"
                : "bg-bg text-fg-subtle ring-1 ring-border"
            }`}
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {number}
          </span>
          <div className="min-w-0 flex-1">
            <Eyebrow variant="micro" as="span" className="block">
              {stage.label}
            </Eyebrow>
            <p className="mt-1 font-sans text-sm font-semibold leading-tight text-fg">
              {stage.title}
            </p>
          </div>
        </div>
        {stage.icon ? (
          <div className="mt-3 flex items-center justify-center">
            {stage.icon}
          </div>
        ) : null}
      </button>
    </li>
  );
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className="fill-current"
    >
      <rect x="2" y="1.5" width="2.2" height="7" rx="0.5" />
      <rect x="5.8" y="1.5" width="2.2" height="7" rx="0.5" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className="fill-current"
    >
      <path d="M2 1.2 L8.8 5 L2 8.8 Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------
// Stage-icon helpers — small SVG motifs the case study can hand to each
// stage so the diagram reads at a glance without any image assets.
// ---------------------------------------------------------------------

export function WaveformIcon() {
  return (
    <svg
      width="56"
      height="20"
      viewBox="0 0 56 20"
      aria-hidden="true"
      className="opacity-70"
    >
      <title>Audio waveform</title>
      {[3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51].map((x, i) => {
        const h = 4 + (Math.sin(i * 0.9) + 1) * 6;
        return (
          <rect
            key={x}
            x={x}
            y={10 - h / 2}
            width="2"
            height={h}
            rx="1"
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

export function TranscriptIcon() {
  return (
    <svg
      width="56"
      height="20"
      viewBox="0 0 56 20"
      aria-hidden="true"
      className="opacity-70"
    >
      <title>Transcript</title>
      <rect x="2" y="3" width="40" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="8" width="52" height="2" rx="1" fill="currentColor" />
      <rect x="2" y="13" width="34" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function AnalysisIcon() {
  return (
    <svg
      width="56"
      height="22"
      viewBox="0 0 56 22"
      aria-hidden="true"
      className="opacity-70"
    >
      <title>Analysis</title>
      <rect
        x="2"
        y="2"
        width="52"
        height="18"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="6" y="6" width="18" height="3" rx="1" fill="currentColor" />
      <rect x="6" y="12" width="26" height="3" rx="1" fill="currentColor" />
      <rect
        x="40"
        y="6"
        width="10"
        height="10"
        rx="2"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

export function DeliverIcon() {
  return (
    <svg
      width="56"
      height="20"
      viewBox="0 0 56 20"
      aria-hidden="true"
      className="opacity-70"
    >
      <title>Deliver to CRM</title>
      <circle cx="12" cy="10" r="4" fill="currentColor" />
      <rect
        x="22"
        y="4"
        width="30"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="25" y="8" width="20" height="2" rx="1" fill="currentColor" />
      <rect
        x="25"
        y="12"
        width="12"
        height="2"
        rx="1"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

export function HumanIcon() {
  return (
    <svg
      width="56"
      height="22"
      viewBox="0 0 56 22"
      aria-hidden="true"
      className="opacity-70"
    >
      <title>Human review</title>
      <circle cx="14" cy="7" r="3.5" fill="currentColor" />
      <path
        d="M7 20 Q 14 13 21 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="7" r="3.5" fill="currentColor" opacity="0.5" />
      <path
        d="M33 20 Q 40 13 47 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
