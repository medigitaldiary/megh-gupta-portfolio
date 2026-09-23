"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import {
  durationLabel,
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
  const hasProducts = entry.products && entry.products.length > 0;
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="group flex w-full items-center gap-4 py-5 text-left transition-colors duration-150 ease-out hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:gap-6"
      >
        <LogoTile
          logo={entry.logo}
          logoBg={entry.logoBg}
          fallback={entry.company}
          current={entry.current}
          size="md"
        />

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
        className="pb-10"
      >
        {hasProducts ? (
          <TapInvestExpanded entry={entry} />
        ) : (
          <EntryDetail
            role={entry.role}
            company={entry.company}
            logo={entry.logo}
            logoBg={entry.logoBg}
            headline={entry.headline}
            roleChips={entry.roleChips}
            narrative={entry.narrative}
            achievements={entry.achievements}
            closer={entry.closer}
            linkOut={entry.linkOut}
            tagline={entry.tagline}
            start={entry.start}
            end={entry.end}
            current={entry.current}
          />
        )}
      </section>
    </li>
  );
}

function LogoTile({
  logo,
  logoBg,
  fallback,
  current,
  size = "md",
}: {
  logo?: string;
  logoBg?: string;
  fallback: string;
  current?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg"
      ? { box: "h-14 w-14", text: "text-2xl", px: 56, pad: "p-1.5" }
      : size === "sm"
        ? { box: "h-9 w-9", text: "text-base", px: 36, pad: "p-1" }
        : { box: "h-11 w-11", text: "text-lg", px: 44, pad: "p-1" };
  const bgClass = logoBg ?? "bg-bg-elevated";
  return (
    <div
      className={`relative ${dims.box} shrink-0 overflow-hidden rounded-lg border border-border ${bgClass}`}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={dims.px}
          height={dims.px}
          className={`h-full w-full ${logoBg ? `${dims.pad} object-contain` : "object-cover"}`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`flex h-full w-full items-center justify-center font-serif ${dims.text} ${logoBg ? "text-accent-fg" : "text-fg-subtle"}`}
        >
          {fallback.slice(0, 1).toUpperCase()}
        </span>
      )}
      {current && (
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
// Expanded detail — Trackflow-style hierarchy
// ─────────────────────────────────────────────────────────────

function EntryDetail({
  role,
  company,
  logo,
  logoBg,
  headline,
  roleChips,
  narrative,
  achievements,
  closer,
  linkOut,
  tagline,
  start,
  end,
  current,
}: {
  role: string;
  company?: string;
  logo?: string;
  logoBg?: string;
  headline?: string;
  roleChips?: string[];
  narrative?: string[];
  achievements?: { intro?: string; items: string[] };
  closer?: string;
  linkOut?: { label: string; url: string; display?: string };
  tagline?: string;
  start: string;
  end: string | "present";
  current?: boolean;
}) {
  const dateLabel = formatDateRange({ start, end });
  const duration = durationLabel(start, end);

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6 md:p-8">
      <div className="flex items-start gap-4 md:gap-5">
        {(logo || company) && (
          <LogoTile
            logo={logo}
            logoBg={logoBg}
            fallback={company ?? role}
            current={current}
            size="lg"
          />
        )}
        <div className="min-w-0 flex-1">
          {company && (
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
              {company}
            </p>
          )}
          <h3 className="font-serif text-3xl leading-[1.05] tracking-tight text-fg md:text-[2.5rem]">
            {role}
          </h3>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-fg-muted md:text-base">
        <p className="flex flex-wrap items-center gap-2">
          <span aria-hidden="true">📅</span>
          <span>
            {dateLabel} · <span className="text-fg-subtle">{duration}</span>
          </span>
        </p>

        {roleChips && roleChips.length > 0 && (
          <p className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true">🎖</span>
            {roleChips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-xs uppercase tracking-wider text-fg-muted"
              >
                {c}
              </span>
            ))}
          </p>
        )}

        {headline && (
          <p className="flex items-start gap-2 text-lg font-semibold leading-[1.4] text-fg md:text-xl">
            <span aria-hidden="true" className="mt-0.5">
              📢
            </span>
            <span>{headline}</span>
          </p>
        )}

        {tagline && !headline && (
          <p className="flex items-start gap-2 font-serif text-lg italic leading-[1.4] text-fg md:text-xl">
            <span aria-hidden="true" className="mt-0.5 not-italic">
              📢
            </span>
            <span>{tagline}</span>
          </p>
        )}

        {narrative?.map((p) => (
          <p key={p.slice(0, 40)} className="text-fg-muted">
            {p}
          </p>
        ))}

        {achievements && (
          <div>
            {achievements.intro && (
              <p className="mb-3 text-fg">{achievements.intro}</p>
            )}
            <ul className="space-y-2.5">
              {achievements.items.map((item) => (
                <li key={item} className="flex gap-3 text-fg">
                  <span aria-hidden="true" className="mt-2 text-accent">
                    *
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {closer && <p className="text-fg-muted">{closer}</p>}

        {linkOut && (
          <p>
            {linkOut.label}{" "}
            <a
              href={linkOut.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {linkOut.display ?? linkOut.url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function TapInvestExpanded({ entry }: { entry: ExperienceEntry }) {
  const products = entry.products ?? [];
  // Default to the current product; else last (most recent).
  const defaultProduct =
    products.find((p) => p.current)?.name ?? products.at(-1)?.name ?? "";
  const [activeName, setActiveName] = useState(defaultProduct);
  const active = products.find((p) => p.name === activeName) ?? products[0];

  return (
    <div>
      {/* Sub-toggle: product tabs */}
      <div className="mb-6 flex items-center gap-3">
        <div
          role="tablist"
          aria-label={`${entry.company} products`}
          className="inline-flex items-center rounded-full border border-border bg-bg-elevated p-1 font-mono text-xs"
        >
          {products.map((p) => {
            const isActive = p.name === activeName;
            return (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveName(p.name)}
                className={`rounded-full px-3 py-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  isActive ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
        <a
          href={active?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-fg-subtle underline decoration-transparent underline-offset-4 hover:decoration-accent hover:text-fg"
        >
          {active?.name} ↗
        </a>
      </div>

      {active && (
        <EntryDetail
          role={active.role ?? entry.role}
          company={`${entry.company} · ${active.name}`}
          logo={active.logo ?? entry.logo}
          logoBg={active.logo ? active.logoBg : entry.logoBg}
          headline={active.headline}
          roleChips={active.roleChips}
          narrative={active.narrative}
          achievements={active.achievements}
          closer={active.closer}
          linkOut={active.linkOut}
          start={active.start ?? entry.start}
          end={active.end ?? entry.end}
          current={active.current}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Timeline view
// ─────────────────────────────────────────────────────────────

type TimelineItem = {
  key: string;
  label: string;
  role?: string;
  url?: string;
  current?: boolean;
  logo?: string;
  logoBg?: string;
  start: number;
  end: number;
};

function expandToItems(entries: ExperienceEntry[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (const entry of entries) {
    const dated = entry.products?.filter((p) => p.start && p.end);
    if (dated && dated.length > 0) {
      // Split the parent employer into one chip per dated product.
      for (const p of dated) {
        items.push({
          key: `${entry.slug}-${p.name}`,
          label: p.name,
          role: entry.role,
          url: p.url,
          current: p.current ?? p.end === "present",
          logo: p.logo ?? entry.logo,
          logoBg: p.logo ? p.logoBg : entry.logoBg,
          start: toDecimalYear(p.start as string),
          end: toDecimalYear(p.end as string),
        });
      }
    } else {
      items.push({
        key: entry.slug,
        label: entry.company,
        role: entry.role,
        url: entry.url,
        current: entry.current ?? entry.end === "present",
        logo: entry.logo,
        logoBg: entry.logoBg,
        start: toDecimalYear(entry.start),
        end: endAsDecimalYear(entry),
      });
    }
  }
  return items;
}

function TimelineView({ entries }: { entries: ExperienceEntry[] }) {
  const items = expandToItems(entries);

  const now = new Date();
  const nowYear = now.getFullYear() + now.getMonth() / 12;
  const earliest = Math.floor(Math.min(...items.map((i) => i.start)));
  const latest = Math.ceil(nowYear) + 0.25;
  const span = latest - earliest;
  const yearMarkers: number[] = [];
  for (let y = earliest; y <= Math.ceil(latest); y++) yearMarkers.push(y);

  const pct = (v: number) => ((v - earliest) / span) * 100;
  const nowPct = pct(nowYear);

  // Sort ascending; greedy lane packing prevents overlaps.
  const ascending = [...items].sort((a, b) => a.start - b.start);
  type Placed = { item: TimelineItem; lane: number };
  const laneEnds: number[] = [];
  const placed: Placed[] = ascending.map((item) => {
    let lane = laneEnds.findIndex((end) => end <= item.start - 0.2);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.end);
    } else {
      laneEnds[lane] = item.end;
    }
    return { item, lane };
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
          {placed.map(({ item, lane }) => {
            const left = pct(item.start);
            const width = Math.max(pct(item.end) - left, 8);
            return (
              <TimelineChip
                key={item.key}
                item={item}
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
  item,
  leftPct,
  widthPct,
  topPx,
}: {
  item: TimelineItem;
  leftPct: number;
  widthPct: number;
  topPx: number;
}) {
  const content = (
    <div className="flex h-full items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
      <LogoTile
        logo={item.logo}
        logoBg={item.logoBg}
        fallback={item.label}
        current={item.current}
        size="sm"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-fg">{item.label}</p>
        {item.role && (
          <p className="truncate text-xs text-fg-muted">{item.role}</p>
        )}
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
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label={item.role ? `${item.label} — ${item.role}` : item.label}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
