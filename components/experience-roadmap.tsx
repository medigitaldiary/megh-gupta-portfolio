"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import {
  durationLabel,
  type ExperienceEntry,
  formatDateRange,
  getAllExperience,
  type NarrativeAchievements,
  type NarrativeLink,
} from "@/lib/experience";

// Experiment for fold 2. Same data as components/experience.tsx, drawn as
// two documents a PM lives in: a roadmap (timeline view) and a changelog
// (list view). Preview only until Megh picks it over the current fold.

type View = "timeline" | "list";

type Release = {
  key: string;
  version: string;
  name: string;
  lane: string;
  role: string;
  logo?: string;
  logoBg?: string;
  url?: string;
  startYm: string;
  endYm: string | "present";
  /** Month index (year * 12 + month), end exclusive. */
  start: number;
  end: number;
  current: boolean;
  metric?: string;
  summary?: string;
  roleChips?: string[];
  narrative?: string[];
  achievements?: NarrativeAchievements;
  closer?: string;
  linkOut?: NarrativeLink;
};

function monthIndex(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

/** Today as a month index, pinned to mid-month so server and client agree. */
function nowIndex(): number {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth() + 0.5;
}

function toReleases(entries: ExperienceEntry[]): Release[] {
  const flat: Omit<Release, "version">[] = [];
  for (const entry of entries) {
    const dated = (entry.products ?? []).filter((p) => p.start && p.end);
    if (dated.length === 0) {
      flat.push({
        key: entry.slug,
        name: entry.company,
        lane: entry.company,
        role: entry.role,
        logo: entry.logo,
        logoBg: entry.logoBg,
        url: entry.url,
        startYm: entry.start,
        endYm: entry.end,
        start: monthIndex(entry.start),
        end: entry.end === "present" ? nowIndex() : monthIndex(entry.end) + 1,
        current: Boolean(entry.current),
        metric: entry.metric,
        summary: entry.summary,
        roleChips: entry.roleChips,
        narrative: entry.narrative,
        achievements: entry.achievements,
        closer: entry.closer,
        linkOut: entry.linkOut,
      });
      continue;
    }
    for (const product of dated) {
      const startYm = product.start ?? entry.start;
      const endYm = product.end ?? entry.end;
      flat.push({
        key: `${entry.slug}-${product.name}`,
        name: product.name,
        lane: entry.company,
        role: product.role ?? entry.role,
        logo: product.logo ?? entry.logo,
        logoBg: product.logo ? product.logoBg : entry.logoBg,
        url: product.url,
        startYm,
        endYm,
        start: monthIndex(startYm),
        end: endYm === "present" ? nowIndex() : monthIndex(endYm) + 1,
        current: Boolean(product.current),
        metric: product.metric,
        summary: product.summary,
        roleChips: product.roleChips,
        narrative: product.narrative,
        achievements: product.achievements,
        closer: product.closer,
        linkOut: product.linkOut,
      });
    }
  }
  return flat
    .sort((a, b) => a.start - b.start)
    .map((release, index) => ({ ...release, version: `v${index + 1}.0` }));
}

export function ExperienceRoadmap() {
  const [view, setView] = useState<View>("timeline");
  const releases = useMemo(() => toReleases(getAllExperience()), []);

  // The roadmap draws itself once, the first time the fold is on screen.
  // Kept here so flipping the switcher does not replay it.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = bodyRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (hits) => {
        if (hits.some((hit) => hit.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="px-6 py-24 md:px-8 md:py-32">
      {/* Fold 2: trajectory. Where has this person been? */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Experience" title="Where I've been." />
          <div className="flex items-center gap-3 md:mb-2">
            <span className="font-hand text-lg leading-none text-accent">
              try this
            </span>
            <span aria-hidden="true" className="text-accent">
              ↗
            </span>
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        <div ref={bodyRef}>
          {view === "timeline" ? (
            <RoadmapView releases={releases} seen={seen} />
          ) : (
            <ChangelogView releases={releases} />
          )}
        </div>

        <p className="mt-10 text-right">
          <a
            href="#work"
            className="rounded-sm font-mono text-fg-muted text-xs uppercase tracking-[0.16em] underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:text-fg hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            See what shipped ↓
          </a>
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Switcher: same two views, the pine thumb slides between them.
// ─────────────────────────────────────────────────────────────

function ViewToggle({
  value,
  onChange,
}: {
  value: View;
  onChange: (v: View) => void;
}) {
  const options: View[] = ["list", "timeline"];
  return (
    <div
      role="tablist"
      aria-label="Experience view"
      className="relative inline-grid grid-cols-2 items-center rounded-full border border-border bg-bg-elevated p-1 font-mono text-xs"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-fg transition-transform duration-200 motion-reduce:transition-none ${
          value === "timeline" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={`relative z-10 rounded-full px-3 py-1.5 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
              active ? "text-bg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────

function Logo({ release, size }: { release: Release; size: "sm" | "md" }) {
  const px = size === "sm" ? 28 : 44;
  const box = size === "sm" ? "h-7 w-7 rounded-md" : "h-11 w-11 rounded-lg";
  return (
    <span
      className={`block shrink-0 overflow-hidden border border-border ${box} ${
        release.logoBg ?? "bg-bg-elevated"
      }`}
    >
      {release.logo ? (
        <Image
          src={release.logo}
          alt=""
          width={px}
          height={px}
          className={`h-full w-full ${
            release.logoBg ? "object-contain p-1" : "object-cover"
          }`}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-display text-fg-subtle"
        >
          {release.name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function StatusPill({
  current,
  onPine = false,
}: {
  current: boolean;
  onPine?: boolean;
}) {
  const base =
    "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em]";
  if (!current) {
    return (
      <span className={`${base} border border-border text-fg-muted`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-2.5 w-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <span className={onPine ? "sr-only @[13rem]:not-sr-only" : ""}>
          Shipped
        </span>
      </span>
    );
  }
  return (
    <span className={`${base} ${onPine ? "bg-bg text-fg" : "bg-fg text-bg"}`}>
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-current opacity-60 motion-safe:animate-ping" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      Live now
    </span>
  );
}

function Milestone({ metric }: { metric: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-muted uppercase tracking-[0.08em]">
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-fg" />
      {metric}
    </span>
  );
}

function ReleaseNotes({ release }: { release: Release }) {
  return (
    <div className="space-y-4 text-[15px] text-fg-muted leading-[1.7] md:text-base">
      {release.roleChips && release.roleChips.length > 0 && (
        <p className="flex flex-wrap gap-2">
          {release.roleChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-fg-muted text-xs uppercase tracking-wider"
            >
              {chip}
            </span>
          ))}
        </p>
      )}

      {release.narrative?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}

      {release.achievements && (
        <div>
          <p className="mb-2 font-mono text-fg-subtle text-xs uppercase tracking-[0.16em]">
            Shipped
          </p>
          <ul className="space-y-1.5">
            {release.achievements.items.map((item) => (
              <li key={item} className="flex gap-3 text-fg leading-[1.5]">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-fg"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {release.closer && <p>{release.closer}</p>}

      {release.linkOut && (
        <p>
          {release.linkOut.label}{" "}
          <a
            href={release.linkOut.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            {release.linkOut.display ?? release.linkOut.url}
          </a>
        </p>
      )}
    </div>
  );
}

/** Height-animated wrapper. Closed content is inert, so it leaves the tab order. */
function Collapse({
  id,
  open,
  label,
  children,
}: {
  id: string;
  open: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      inert={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 font-mono text-fg-subtle text-sm transition-transform duration-200 motion-reduce:transition-none ${
        open ? "rotate-90" : ""
      }`}
    >
      ›
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Timeline view = roadmap.
// Desktop: quarters across, one swimlane per company, a bar per role.
// Phone: the same releases stacked on a spine, newest first.
// ─────────────────────────────────────────────────────────────

function RoadmapView({
  releases,
  seen,
}: {
  releases: Release[];
  seen: boolean;
}) {
  const [pinned, setPinned] = useState<string | null>(null);
  const toggle = (key: string) =>
    setPinned((current) => (current === key ? null : key));

  return (
    <>
      <DesktopRoadmap
        releases={releases}
        seen={seen}
        pinned={pinned}
        onToggle={toggle}
      />
      <MobileRoadmap releases={releases} pinned={pinned} onToggle={toggle} />
    </>
  );
}

function DesktopRoadmap({
  releases,
  seen,
  pinned,
  onToggle,
}: {
  releases: Release[];
  seen: boolean;
  pinned: string | null;
  onToggle: (key: string) => void;
}) {
  const today = nowIndex();
  const axisStart =
    Math.floor(Math.min(...releases.map((r) => r.start)) / 3) * 3;
  const axisEnd = (Math.floor(today / 3) + 1) * 3;
  const span = axisEnd - axisStart;
  const pct = (value: number) => ((value - axisStart) / span) * 100;

  const quarters: { key: string; year: number; quarter: number }[] = [];
  for (let month = axisStart; month < axisEnd; month += 3) {
    const year = Math.floor(month / 12);
    const quarter = Math.floor((month % 12) / 3) + 1;
    quarters.push({ key: `${year}-q${quarter}`, year, quarter });
  }
  const columns = { gridTemplateColumns: `repeat(${quarters.length}, 1fr)` };

  const lanes: { name: string; items: Release[] }[] = [];
  for (const release of releases) {
    const lane = lanes.find((l) => l.name === release.lane);
    if (lane) lane.items.push(release);
    else lanes.push({ name: release.lane, items: [release] });
  }

  const pinnedRelease = releases.find((r) => r.key === pinned);

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto">
        <div className="relative min-w-[900px] rounded-xl border border-border">
          {/* Quarter grid lines, behind everything. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid"
            style={columns}
          >
            {quarters.map((q, index) => (
              <div
                key={q.key}
                className={
                  index === 0
                    ? ""
                    : q.quarter === 1
                      ? "border-border border-l"
                      : "border-border/50 border-l border-dashed"
                }
              />
            ))}
          </div>

          {/* Axis header: year on the first quarter of each year. */}
          <div
            className="relative grid border-border border-b font-mono text-[11px] uppercase tracking-[0.08em]"
            style={columns}
          >
            {quarters.map((q, index) => (
              <div key={q.key} className="px-3 py-2.5">
                <span className="block h-4 text-fg">
                  {index === 0 || q.quarter === 1 ? q.year : ""}
                </span>
                <span className="block text-fg-subtle">Q{q.quarter}</span>
              </div>
            ))}
          </div>

          {lanes.map((lane) => (
            <div
              key={lane.name}
              className="relative border-border/60 border-b pt-3 pb-4"
            >
              <p className="px-3 font-mono text-[10px] text-fg-subtle uppercase tracking-[0.16em]">
                {lane.name}
              </p>
              <div className="relative mt-2 h-[92px]">
                {lane.items.map((release) => {
                  const order = releases.indexOf(release);
                  const open = pinned === release.key;
                  return (
                    <div
                      key={release.key}
                      className="absolute top-0 px-1"
                      style={{
                        left: `${pct(release.start)}%`,
                        width: `${pct(release.end) - pct(release.start)}%`,
                      }}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls="roadmap-release-notes"
                        onClick={() => onToggle(release.key)}
                        className={`@container flex h-11 w-full items-center gap-2 rounded-lg border px-2 text-left transition-[clip-path,translate,border-color,box-shadow] duration-700 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:transition-none motion-reduce:[clip-path:none] ${
                          seen
                            ? "[clip-path:inset(-8px)]"
                            : "[clip-path:inset(-8px_100%_-8px_-8px)]"
                        } ${
                          release.current
                            ? "border-fg bg-fg text-bg"
                            : "border-border bg-bg-elevated text-fg hover:border-fg/40"
                        } ${open ? "ring-2 ring-accent ring-offset-2 ring-offset-bg" : ""}`}
                        style={{ transitionDelay: `${order * 220}ms` }}
                      >
                        <Logo release={release} size="sm" />
                        <span className="min-w-0 flex-1 truncate font-semibold text-sm">
                          {release.name}
                        </span>
                        <StatusPill current={release.current} onPine />
                      </button>
                      <div
                        className={`mt-2 px-1 transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                          seen
                            ? "translate-y-0 opacity-100"
                            : "translate-y-1 opacity-0"
                        }`}
                        style={{ transitionDelay: `${order * 220 + 450}ms` }}
                      >
                        <p
                          className="truncate text-fg text-sm leading-tight"
                          title={release.role}
                        >
                          {release.role}
                        </p>
                        {release.metric && (
                          <p className="mt-1 truncate">
                            <Milestone metric={release.metric} />
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Footer strip keeps room for the today chip. */}
          <div className="h-9" />

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-[3.75rem] bottom-2 flex -translate-x-1/2 flex-col items-center transition-opacity duration-500 motion-reduce:opacity-100 motion-reduce:transition-none ${
              seen ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: `${pct(today)}%`,
              transitionDelay: `${releases.length * 220 + 300}ms`,
            }}
          >
            <span className="w-px flex-1 border-fg border-l border-dashed" />
            <span className="mt-1 rounded-full bg-fg px-1.5 py-0.5 font-mono text-[10px] text-bg uppercase leading-none tracking-[0.08em]">
              today
            </span>
          </div>
        </div>
      </div>

      <Collapse
        id="roadmap-release-notes"
        open={Boolean(pinnedRelease)}
        label="Release notes"
      >
        {pinnedRelease && (
          <div className="mt-6 rounded-xl border border-border bg-bg-elevated p-6 md:p-8">
            <ReleaseHeading release={pinnedRelease} />
            <div className="mt-5">
              <ReleaseNotes release={pinnedRelease} />
            </div>
          </div>
        )}
      </Collapse>

      <p className="mt-6 text-center font-hand text-base text-fg-subtle">
        click any bar for the release notes
      </p>
    </div>
  );
}

function ReleaseHeading({ release }: { release: Release }) {
  return (
    <div className="flex items-start gap-4">
      <Logo release={release} size="md" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] text-fg-subtle uppercase tracking-[0.16em]">
          {release.version} · {release.name} ·{" "}
          {formatDateRange({ start: release.startYm, end: release.endYm })} ·{" "}
          {durationLabel(release.startYm, release.endYm)}
        </p>
        <h3 className="mt-1 font-display text-2xl text-fg leading-[1.1] tracking-tight md:text-3xl">
          {release.role}
        </h3>
        {release.metric && (
          <p className="mt-2">
            <Milestone metric={release.metric} />
          </p>
        )}
      </div>
      <StatusPill current={release.current} />
    </div>
  );
}

function MobileRoadmap({
  releases,
  pinned,
  onToggle,
}: {
  releases: Release[];
  pinned: string | null;
  onToggle: (key: string) => void;
}) {
  const newestFirst = [...releases].reverse();
  return (
    <ol className="relative space-y-4 pl-6 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border lg:hidden">
      {newestFirst.map((release) => {
        const open = pinned === release.key;
        const panelId = `roadmap-m-${release.key}`;
        return (
          <li key={release.key} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-5 -left-6 h-[11px] w-[11px] rotate-45 border border-fg ${
                release.current ? "bg-fg" : "bg-bg"
              }`}
            />
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => onToggle(release.key)}
              className={`flex w-full items-start gap-3 rounded-xl border bg-bg-elevated p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                open ? "border-accent" : "border-border"
              }`}
            >
              <Logo release={release} size="md" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-base text-fg">
                    {release.name}
                  </span>
                  <StatusPill current={release.current} />
                </span>
                <span className="mt-0.5 block text-fg-muted text-sm">
                  {release.role}
                </span>
                <span className="mt-1 block font-mono text-[11px] text-fg-subtle uppercase tracking-wider">
                  {formatDateRange({
                    start: release.startYm,
                    end: release.endYm,
                  })}
                </span>
                {release.metric && (
                  <span className="mt-1.5 block">
                    <Milestone metric={release.metric} />
                  </span>
                )}
              </span>
              <Chevron open={open} />
            </button>
            <Collapse
              id={panelId}
              open={open}
              label={`${release.name} release notes`}
            >
              <div className="px-1 pt-4 pb-2">
                <ReleaseNotes release={release} />
              </div>
            </Collapse>
          </li>
        );
      })}
    </ol>
  );
}

// ─────────────────────────────────────────────────────────────
// List view = changelog. One release per role, newest first.
// ─────────────────────────────────────────────────────────────

function ChangelogView({ releases }: { releases: Release[] }) {
  const newestFirst = useMemo(() => [...releases].reverse(), [releases]);
  const [openKey, setOpenKey] = useState<string | null>(
    newestFirst[0]?.key ?? null,
  );

  return (
    <ol className="relative before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border md:before:left-[11.25rem]">
      {newestFirst.map((release) => {
        const open = openKey === release.key;
        const panelId = `changelog-${release.key}`;
        return (
          <li
            key={release.key}
            className="relative pb-8 pl-8 last:pb-0 md:grid md:grid-cols-[10rem_1fr] md:gap-10 md:pl-0"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 h-[11px] w-[11px] rotate-45 border border-fg transition-colors duration-200 md:left-[calc(11.25rem-5px)] ${
                open || release.current ? "bg-fg" : "bg-bg"
              }`}
            />

            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-fg-subtle uppercase tracking-wider md:mb-0 md:flex-col md:items-end md:gap-1.5 md:text-right">
              <span className="rounded-full border border-border bg-bg-elevated px-2 py-0.5 text-fg text-xs normal-case tracking-normal">
                {release.version}
              </span>
              <span>
                {formatDateRange({
                  start: release.startYm,
                  end: release.endYm,
                })}
              </span>
              <span>{durationLabel(release.startYm, release.endYm)}</span>
            </div>

            <div className="min-w-0">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenKey(open ? null : release.key)}
                className="group flex w-full items-start gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg md:gap-4"
              >
                <Logo release={release} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-display text-fg text-xl leading-tight tracking-tight underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-accent md:text-2xl">
                      {release.name}
                    </span>
                    <StatusPill current={release.current} />
                  </span>
                  <span className="mt-0.5 block text-fg-muted text-sm md:text-base">
                    {release.role}
                  </span>
                  {release.metric && (
                    <span className="mt-2 block">
                      <Milestone metric={release.metric} />
                    </span>
                  )}
                </span>
                <Chevron open={open} />
              </button>

              <Collapse
                id={panelId}
                open={open}
                label={`${release.name} release notes`}
              >
                <div className="pt-5 md:pl-[3.75rem]">
                  <ReleaseNotes release={release} />
                </div>
              </Collapse>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
