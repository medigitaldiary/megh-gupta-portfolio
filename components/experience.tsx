"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import {
  type ExperienceEntry,
  endAsDecimalYear,
  formatDateRange,
  getAllExperience,
  toDecimalYear,
} from "@/lib/experience";

type View = "timeline" | "list";

export function Experience() {
  const [view, setView] = useState<View>("timeline");
  const entries = useMemo(getAllExperience, []);

  return (
    <section id="experience" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Experience" title="Where I've been." />
          <div className="flex items-center gap-3 md:mb-2">
            <span
              className="text-lg leading-none text-accent"
              style={{ fontFamily: "var(--font-hand), cursive" }}
            >
              try this
            </span>
            <span aria-hidden="true" className="text-accent">
              ↗
            </span>
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        {view === "timeline" ? (
          <TimelineView entries={entries} />
        ) : (
          <ListView entries={entries} />
        )}
      </div>
    </section>
  );
}

function ViewToggle({
  value,
  onChange,
}: {
  value: View;
  onChange: (v: View) => void;
}) {
  const options: { value: View; label: string }[] = [
    { value: "list", label: "list" },
    { value: "timeline", label: "timeline" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Experience view"
      className="inline-flex items-center rounded-full border border-border bg-bg-elevated p-1 font-mono text-xs"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              active ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// List view
// ─────────────────────────────────────────────────────────────

function ListView({ entries }: { entries: ExperienceEntry[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(
    entries[0]?.slug ?? null,
  );
  return (
    <ul className="divide-y divide-border">
      {entries.map((entry) => (
        <ListRow
          key={entry.slug}
          entry={entry}
          open={openSlug === entry.slug}
          onToggle={() =>
            setOpenSlug((s) => (s === entry.slug ? null : entry.slug))
          }
        />
      ))}
    </ul>
  );
}

function ListRow({
  entry,
  open,
  onToggle,
}: {
  entry: ExperienceEntry;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `exp-panel-${entry.slug}`;
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="group flex w-full items-center gap-4 py-5 text-left transition-colors duration-150 ease-out hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:gap-6"
      >
        <LogoTile entry={entry} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <CompanyName entry={entry} />
            <span className="text-sm text-fg-muted">{entry.role}</span>
          </div>
        </div>

        <div className="hidden shrink-0 font-mono text-xs uppercase tracking-wider text-fg-subtle sm:block">
          {formatDateRange(entry)}
        </div>

        <span
          aria-hidden="true"
          className={`shrink-0 font-mono text-sm text-fg-subtle transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </button>

      <section
        id={panelId}
        aria-label={`${entry.company} details`}
        hidden={!open}
        className="pb-6 pl-[calc(2.75rem+1rem)] pr-2 md:pl-[calc(2.75rem+1.5rem)]"
      >
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-fg-subtle sm:hidden">
          {formatDateRange(entry)}
        </p>
        <p className="mb-4 font-serif text-base italic leading-[1.5] text-fg-muted md:text-lg">
          {entry.tagline}
        </p>
        {entry.products && entry.products.length > 0 && (
          <p className="mb-4 flex flex-wrap gap-2 text-xs">
            {entry.products.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-bg-elevated px-3 py-1 font-mono uppercase tracking-wider text-fg-muted transition-colors duration-150 hover:border-accent hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {p.name} ↗
              </a>
            ))}
          </p>
        )}
        <ul className="space-y-2.5">
          {entry.bullets.map((b) => (
            <li
              key={b}
              className="flex gap-3 text-[15px] leading-[1.6] text-fg"
            >
              <span aria-hidden="true" className="mt-2 text-accent">
                *
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>
    </li>
  );
}

function LogoTile({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <span aria-hidden="true" className="font-serif text-lg text-fg-subtle">
        {entry.company.slice(0, 1).toUpperCase()}
      </span>
      {entry.current && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg"
        />
      )}
    </div>
  );
}

function CompanyName({ entry }: { entry: ExperienceEntry }) {
  const className = "text-base font-semibold text-fg";
  if (entry.url) {
    return (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`${className} underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm`}
      >
        {entry.company}
      </a>
    );
  }
  return <span className={className}>{entry.company}</span>;
}

// ─────────────────────────────────────────────────────────────
// Timeline view
// ─────────────────────────────────────────────────────────────

function TimelineView({ entries }: { entries: ExperienceEntry[] }) {
  // Timeline range: earliest start (floored) → this year + 1
  const now = new Date();
  const nowYear = now.getFullYear() + now.getMonth() / 12;
  const earliest = Math.floor(
    Math.min(...entries.map((e) => toDecimalYear(e.start))),
  );
  const latest = Math.ceil(nowYear) + 0.25;
  const span = latest - earliest;
  const yearMarkers: number[] = [];
  for (let y = earliest; y <= Math.ceil(latest); y++) yearMarkers.push(y);

  const pct = (v: number) => ((v - earliest) / span) * 100;
  const nowPct = pct(nowYear);

  // Sort ascending so earliest is left-most; assign lanes to prevent overlap.
  const ascending = [...entries].sort(
    (a, b) => toDecimalYear(a.start) - toDecimalYear(b.start),
  );
  type Placed = { entry: ExperienceEntry; lane: number };
  const laneEnds: number[] = [];
  const placed: Placed[] = ascending.map((entry) => {
    const s = toDecimalYear(entry.start);
    const e = endAsDecimalYear(entry);
    let lane = laneEnds.findIndex((end) => end <= s - 0.2);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(e);
    } else {
      laneEnds[lane] = e;
    }
    return { entry, lane };
  });

  const numLanes = Math.max(1, laneEnds.length);
  const laneHeight = 68; // px
  const bandHeight = numLanes * laneHeight;

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div
          className="relative"
          style={{ minWidth: 780, height: bandHeight + 44 }}
        >
          {/* cream band */}
          <div
            className="absolute inset-x-0 top-0 rounded-2xl"
            style={{
              height: bandHeight,
              background:
                "linear-gradient(180deg, var(--venn-cream) 0%, rgba(253,247,238,0.6) 100%)",
            }}
          />

          {/* now marker */}
          <div
            className="pointer-events-none absolute top-0 flex flex-col items-center"
            style={{
              left: `${nowPct}%`,
              transform: "translateX(-50%)",
              height: bandHeight,
            }}
          >
            <span
              className="mb-1 text-sm text-accent"
              style={{ fontFamily: "var(--font-hand), cursive" }}
            >
              now
            </span>
            <div
              className="w-px flex-1"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, var(--accent) 50%, transparent 50%)",
                backgroundSize: "1px 6px",
              }}
            />
          </div>

          {/* chips */}
          {placed.map(({ entry, lane }) => {
            const s = toDecimalYear(entry.start);
            const e = endAsDecimalYear(entry);
            const left = pct(s);
            const width = Math.max(pct(e) - left, 8);
            return (
              <TimelineChip
                key={entry.slug}
                entry={entry}
                leftPct={left}
                widthPct={width}
                topPx={lane * laneHeight + 8}
              />
            );
          })}

          {/* year labels */}
          <div
            className="absolute inset-x-0 flex justify-between px-1 font-mono text-xs text-fg-subtle"
            style={{ top: bandHeight + 12 }}
          >
            {yearMarkers.map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>
        </div>
      </div>

      <p
        className="mt-6 text-center text-sm text-fg-subtle md:text-base"
        style={{ fontFamily: "var(--font-hand), cursive" }}
      >
        scroll sideways — the last {Math.ceil(span)} years are in here
      </p>
    </div>
  );
}

function TimelineChip({
  entry,
  leftPct,
  widthPct,
  topPx,
}: {
  entry: ExperienceEntry;
  leftPct: number;
  widthPct: number;
  topPx: number;
}) {
  const content = (
    <div className="flex h-full items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-bg">
        <span aria-hidden="true" className="font-serif text-sm text-fg-subtle">
          {entry.company.slice(0, 1).toUpperCase()}
        </span>
        {entry.current && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-bg-elevated"
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-fg">
          {entry.company}
        </p>
        <p className="truncate text-xs text-fg-muted">{entry.role}</p>
      </div>
    </div>
  );
  const style = {
    left: `${leftPct}%`,
    width: `max(180px, ${widthPct}%)`,
    top: `${topPx}px`,
    height: "52px",
  } as const;
  return (
    <div className="absolute" style={style}>
      {entry.url ? (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label={`${entry.company} — ${entry.role}`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
