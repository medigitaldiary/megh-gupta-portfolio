"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { type FoldFlow, FoldLeadOut } from "@/components/fold-flow";
import { SectionHeader } from "@/components/section-header";
import { CtaArrow, TextLink } from "@/components/ui";
import { setCompanyFocus } from "@/lib/company-focus";
import {
  durationLabel,
  type ExperienceEntry,
  formatDateRange,
  getAllExperience,
  type NarrativeAchievements,
  type NarrativeLink,
} from "@/lib/experience";
import { getShelfWorkCards } from "@/lib/work";

// Experiment for fold 2. Same data as components/experience.tsx, drawn as
// two documents a PM lives in: a roadmap (timeline view) and a changelog
// (list view). Preview only until Megh picks it over the current fold.

type View = "timeline" | "list";

type Release = {
  key: string;
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
  const flat: Release[] = [];
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
        summary: product.summary,
        roleChips: product.roleChips,
        narrative: product.narrative,
        achievements: product.achievements,
        closer: product.closer,
        linkOut: product.linkOut,
      });
    }
  }
  return flat.sort((a, b) => a.start - b.start);
}

export function ExperienceRoadmap({
  timeline = "roadmap",
  flow,
}: {
  /** Which drawing the timeline view uses. The list view is the changelog either way. */
  timeline?: "roadmap" | "bar";
  /** Fold-flow previews: chapter number, pine tone, handoff, and the link to the work shelf. */
  flow?: FoldFlow & {
    workLink?: { direction: "down" | "up"; label: string };
  };
}) {
  const [view, setView] = useState<View>("timeline");
  const releases = useMemo(() => toReleases(getAllExperience()), []);
  // A role picked on the bar opens in the list view.
  const [handoff, setHandoff] = useState<string | null>(null);

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
    <section
      id="experience"
      className={`px-6 py-24 md:px-8 md:py-32 ${
        flow?.tone === "pine" ? "tone-pine bg-bg text-fg" : ""
      }`}
    >
      {/* Fold 2: trajectory. Where has this person been? */}
      <div className={`mx-auto ${flow ? "max-w-6xl" : "max-w-5xl"}`}>
        <div
          data-reveal
          className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between"
        >
          <SectionHeader
            eyebrow="Experience"
            title="Where I've been."
            index={flow?.index}
            className={flow ? "" : undefined}
          />
          <div className="flex items-center gap-3 md:mb-2">
            <span className="inline-flex items-center gap-1.5 text-accent">
              <span className="font-hand text-lg leading-none">try this</span>
              {/* Drawn, not the ↗ character. iPhone and iPad paint that glyph as a colour emoji. */}
              <CtaArrow
                direction="external"
                className="size-[1.125rem] shrink-0"
              />
            </span>
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        <div ref={bodyRef} data-reveal>
          {view === "timeline" ? (
            timeline === "bar" ? (
              <BarView
                releases={releases}
                seen={seen}
                onOpen={(key) => {
                  setHandoff(key);
                  setView("list");
                }}
              />
            ) : (
              <RoadmapView releases={releases} seen={seen} />
            )
          ) : (
            <ChangelogView releases={releases} initialOpen={handoff} />
          )}
        </div>

        {flow ? (
          <>
            {flow.workLink && (
              <WorkLinks releases={releases} {...flow.workLink} />
            )}
            {flow.leadOut && (
              <FoldLeadOut
                {...flow.leadOut}
                className={flow.workLink ? "mt-4 md:mt-6" : undefined}
              />
            )}
          </>
        ) : (
          /* The bar is the short view: no lead-out under it, to keep the fold small. */
          <p
            className={`mt-10 text-right ${
              timeline === "bar" && view === "timeline" ? "hidden" : ""
            }`}
          >
            <TextLink href="#work">See what shipped</TextLink>
          </p>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Link to the work shelf: one chip per company, with how many case
// studies it has on the shelf. A chip jumps to the shelf and brings
// that company's cards forward (lib/company-focus.ts).
// ─────────────────────────────────────────────────────────────

function WorkLinks({
  releases,
  direction,
  label,
}: {
  releases: Release[];
  direction: "down" | "up";
  label: string;
}) {
  const companies = useMemo(() => {
    const counts = new Map<string, number>();
    for (const card of getShelfWorkCards(10)) {
      counts.set(card.company, (counts.get(card.company) ?? 0) + 1);
    }
    const names = [...new Set(releases.map((release) => release.name))];
    return names
      .reverse()
      .map((name) => ({ name, count: counts.get(name) ?? 0 }))
      .filter((company) => company.count > 0);
  }, [releases]);
  if (companies.length === 0) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 md:mt-12">
      <span className="mr-1 font-mono text-fg-muted text-xs uppercase tracking-[0.16em]">
        {label}{" "}
        <span aria-hidden="true">{direction === "down" ? "↓" : "↑"}</span>
      </span>
      {companies.map(({ name, count }) => (
        <button
          key={name}
          type="button"
          onClick={() => {
            setCompanyFocus(name);
            document.getElementById("work")?.scrollIntoView();
          }}
          aria-label={`Show the ${count} case ${count === 1 ? "study" : "studies"} from ${name}`}
          className="group hidden min-h-11 items-center md:inline-flex"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-fg text-sm transition-colors duration-150 group-hover:border-fg">
            {name}
            <span className="font-mono text-fg-subtle text-xs">{count}</span>
          </span>
        </button>
      ))}
    </div>
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
          <TextLink href={release.linkOut.url} direction="external">
            {release.linkOut.display ?? release.linkOut.url}
          </TextLink>
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
              <div className="relative mt-2 h-[72px]">
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
          {release.name} ·{" "}
          {formatDateRange({ start: release.startYm, end: release.endYm })} ·{" "}
          {durationLabel(release.startYm, release.endYm)}
        </p>
        <h3 className="mt-1 font-display text-2xl text-fg leading-[1.1] tracking-tight md:text-3xl">
          {release.role}
        </h3>
      </div>
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
// Timeline view, compact take = segmented bar.
// One bar cut into pieces sized by how long each role lasted. It is a
// summary on purpose: nothing opens here, a click hands the role over to
// the list view. Phone gets three short rows instead of a bar.
// ─────────────────────────────────────────────────────────────

const FILL_MS_PER_MONTH = 62;

function BarView({
  releases,
  seen,
  onOpen,
}: {
  releases: Release[];
  seen: boolean;
  onOpen: (key: string) => void;
}) {
  // The most recent role is the filled piece, whether or not it is still running.
  const last = releases.length - 1;
  let elapsed = 0;
  const timed = releases.map((release) => {
    const months = release.end - release.start;
    const delay = elapsed * FILL_MS_PER_MONTH;
    elapsed += months;
    return { release, months, delay, duration: months * FILL_MS_PER_MONTH };
  });
  const label = (release: Release) =>
    `${release.name}, ${release.role}, ${formatDateRange({
      start: release.startYm,
      end: release.endYm,
    })}. Open in the list view.`;

  return (
    <>
      <div
        className="hidden gap-[3px] sm:grid [&:hover>button:not(:hover)]:opacity-50"
        style={{
          gridTemplateColumns: timed.map((t) => `${t.months}fr`).join(" "),
        }}
      >
        {timed.map(({ release, delay, duration }, i) => (
          <button
            key={release.key}
            type="button"
            aria-label={label(release)}
            onClick={() => onOpen(release.key)}
            className="group relative min-w-0 rounded-lg text-left transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
          >
            {/* The piece itself. Fills left to right once, at a steady pace per month. */}
            <span
              className={`block transition-[clip-path] ease-linear motion-reduce:transition-none motion-reduce:[clip-path:none] ${
                seen
                  ? "[clip-path:inset(-4px_-4px_-4px_0)]"
                  : "[clip-path:inset(-4px_100%_-4px_0)]"
              }`}
              style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
              }}
            >
              <span
                className={`relative flex h-11 items-center gap-2 overflow-hidden border pr-3 pl-2 transition-[translate,border-color] duration-150 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transition-none ${
                  i === 0 ? "rounded-l-full" : "rounded-l-md"
                } ${i === last ? "rounded-r-full" : "rounded-r-md"} ${
                  i === last
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-bg-elevated text-fg group-hover:border-fg"
                }`}
              >
                <Logo release={release} size="sm" />
                <span className="min-w-0 flex-1 truncate font-semibold text-sm">
                  {release.name}
                </span>
                {release.current && (
                  <>
                    <span
                      aria-hidden="true"
                      className="relative mr-1 flex h-1.5 w-1.5 shrink-0"
                    >
                      <span className="absolute inset-0 rounded-full bg-current opacity-60 motion-safe:animate-ping" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                    {/* Sheen: a slow highlight across a role still running. With no
                        current role, the dot and the sheen both stay off. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent_35%,color-mix(in_srgb,var(--bg)_24%,transparent)_50%,transparent_65%)] motion-safe:animate-[exp-sheen_3.4s_ease-in-out_2.5s_infinite]"
                    />
                  </>
                )}
              </span>
            </span>

            <span
              aria-hidden="true"
              className={`block px-2.5 pt-2 transition-[opacity,translate] duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                seen ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
              }`}
              style={{ transitionDelay: `${delay + 120}ms` }}
            >
              <span className="block text-fg-muted text-sm leading-snug">
                {release.role}
              </span>
              <span className="mt-0.5 block font-mono text-[11px] text-fg-subtle uppercase tracking-wider">
                {formatDateRange({
                  start: release.startYm,
                  end: release.endYm,
                })}
              </span>
            </span>

            {/* Floating card: detail without making the fold taller. */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-full z-[70] mb-3 block w-64 translate-y-1 rounded-xl border border-fg bg-bg-elevated p-3.5 opacity-0 shadow-[var(--shadow-md)] transition-[opacity,translate] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none ${
                i === last ? "right-0" : "left-0"
              }`}
            >
              <span className="block font-semibold text-[15px] text-fg leading-snug">
                {release.role}
              </span>
              <span className="mt-1 block font-mono text-[11px] text-fg-subtle uppercase tracking-wider">
                {release.name} · {durationLabel(release.startYm, release.endYm)}
              </span>
              {release.summary && (
                <span className="mt-2 block text-[13px] text-fg-muted leading-snug">
                  {release.summary}
                </span>
              )}
              <span className="mt-2 block font-hand text-fg-subtle text-sm">
                click to open in the list
              </span>
            </span>
          </button>
        ))}
      </div>

      <ol className="space-y-2 sm:hidden">
        {[...releases].reverse().map((release, i) => (
          <li key={release.key}>
            <button
              type="button"
              aria-label={label(release)}
              onClick={() => onOpen(release.key)}
              className={`flex w-full items-center gap-3 rounded-full border py-1.5 pr-4 pl-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                i === 0
                  ? "border-fg bg-fg text-bg"
                  : "border-border bg-bg-elevated text-fg"
              }`}
            >
              <Logo release={release} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-sm leading-tight">
                  {release.name}
                </span>
                <span
                  className={`block truncate text-xs ${
                    i === 0 ? "text-bg/80" : "text-fg-muted"
                  }`}
                >
                  {release.role}
                </span>
              </span>
              <span
                className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${
                  i === 0 ? "text-bg/80" : "text-fg-subtle"
                }`}
              >
                {durationLabel(release.startYm, release.endYm)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// List view = changelog. One release per role, newest first.
// ─────────────────────────────────────────────────────────────

function ChangelogView({
  releases,
  initialOpen,
}: {
  releases: Release[];
  /** Role to open first, when the visitor arrives from the bar. */
  initialOpen?: string | null;
}) {
  const newestFirst = useMemo(() => [...releases].reverse(), [releases]);
  const [openKey, setOpenKey] = useState<string | null>(
    initialOpen ?? newestFirst[0]?.key ?? null,
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
                  </span>
                  <span className="mt-0.5 block text-fg-muted text-sm md:text-base">
                    {release.role}
                  </span>
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
