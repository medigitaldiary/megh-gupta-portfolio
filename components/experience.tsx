"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionHeader } from "@/components/section-header";
import {
  durationLabel,
  type ExperienceEntry,
  type ExperienceProduct,
  formatDateRange,
  getAllExperience,
  toDecimalYear,
} from "@/lib/experience";

const hand = { fontFamily: "var(--font-hand), cursive" } as const;

type View = "timeline" | "list";

export function Experience() {
  const [view, setView] = useState<View>("timeline");
  const entries = useMemo(getAllExperience, []);

  return (
    <section id="experience" className="px-6 py-24 md:px-8 md:py-32">
      {/* Fold 2: trajectory — where has this person been? */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Experience" title="Where I've been." />
          <div className="flex items-center gap-3 md:mb-2">
            <span className="text-lg leading-none text-accent" style={hand}>
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
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:hidden">
            {formatDateRange(entry)}
          </p>
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
    <div className={`relative ${dims.box} shrink-0`}>
      <div
        className={`h-full w-full overflow-hidden rounded-lg border border-border ${bgClass}`}
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
            className={`flex h-full w-full items-center justify-center font-display ${dims.text} ${logoBg ? "text-accent-fg" : "text-fg-subtle"}`}
          >
            {fallback.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
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
          <h3 className="font-display text-3xl leading-[1.05] tracking-tight text-fg md:text-[2.5rem]">
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
            <ul className="mt-1 space-y-1">
              {achievements.items.map((item) => (
                <li key={item} className="flex gap-3 leading-[1.5] text-fg">
                  <span aria-hidden="true" className="mt-1.5 text-accent">
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
          company={active.name}
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
// Phone: a vertical spine, newest first. Desktop keeps the original
// horizontal band — chips on a year axis, detail on hover.
// ─────────────────────────────────────────────────────────────

type TimelineItem = {
  key: string;
  label: string;
  role: string;
  url?: string;
  current: boolean;
  logo?: string;
  logoBg?: string;
  metric?: string;
  summary?: string;
  employer?: string;
  start: number;
  end: number;
  startYm: string;
  endYm: string | "present";
  headline?: string;
  roleChips?: string[];
  narrative?: string[];
  achievements?: ExperienceEntry["achievements"];
  closer?: string;
  linkOut?: ExperienceEntry["linkOut"];
};

function expandToItems(entries: ExperienceEntry[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (const entry of entries) {
    const dated = (entry.products ?? []).filter(
      (
        product,
      ): product is ExperienceProduct & {
        start: string;
        end: string | "present";
      } => Boolean(product.start && product.end),
    );
    if (dated.length > 0) {
      for (const product of dated) items.push(toTimelineItem(entry, product));
    } else {
      items.push(toTimelineItem(entry));
    }
  }
  return items;
}

function toTimelineItem(
  entry: ExperienceEntry,
  product?: ExperienceProduct & { start: string; end: string | "present" },
): TimelineItem {
  const startYm = product?.start ?? entry.start;
  const endYm = product?.end ?? entry.end;
  return {
    key: product ? `${entry.slug}-${product.name}` : entry.slug,
    label: product?.name ?? entry.company,
    role: product?.role ?? entry.role,
    url: product?.url ?? entry.url,
    current: product
      ? (product.current ?? endYm === "present")
      : (entry.current ?? endYm === "present"),
    logo: product?.logo ?? entry.logo,
    logoBg: product?.logo ? product.logoBg : entry.logoBg,
    metric: product?.metric ?? entry.metric,
    summary: product?.summary ?? entry.summary,
    employer: product ? entry.company : undefined,
    start: toDecimalYear(startYm),
    end: toDecimalYear(endYm),
    startYm,
    endYm,
    headline: product?.headline ?? entry.headline,
    roleChips: product?.roleChips ?? entry.roleChips,
    narrative: product?.narrative ?? entry.narrative,
    achievements: product?.achievements ?? entry.achievements,
    closer: product?.closer ?? entry.closer,
    linkOut: product?.linkOut ?? entry.linkOut,
  };
}

function TimelineView({ entries }: { entries: ExperienceEntry[] }) {
  const items = expandToItems(entries);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) =>
    setOpenKey((current) => (current === key ? null : key));
  const newestFirst = [...items].sort((a, b) => b.start - a.start);

  return (
    <div>
      <VerticalTimeline
        items={newestFirst}
        openKey={openKey}
        onToggle={toggle}
      />
      {openKey === null && (
        <p
          className="mt-6 text-center text-sm text-fg-subtle lg:hidden"
          style={hand}
        >
          open a card for the detail
        </p>
      )}
      <DesktopTimeline items={items} />
    </div>
  );
}

function VerticalTimeline({
  items,
  openKey,
  onToggle,
}: {
  items: TimelineItem[];
  openKey: string | null;
  onToggle: (key: string) => void;
}) {
  return (
    <ol
      aria-label="Career timeline"
      className="relative space-y-4 border-l border-border py-1 pl-5 lg:hidden"
    >
      {items.map((item) => {
        const open = openKey === item.key;
        const panelId = `tl-${item.key}-stack`;
        return (
          <li key={item.key} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-4 h-2.5 w-2.5 rounded-full ring-4 ring-bg ${
                item.current ? "bg-accent" : "bg-border"
              }`}
              style={{ left: "calc(-1.25rem - 5px)" }}
            />
            <TimelineCard
              item={item}
              open={open}
              onToggle={() => onToggle(item.key)}
              panelId={panelId}
            />
            {open && <TimelineDetail item={item} id={panelId} />}
          </li>
        );
      })}
    </ol>
  );
}

function DesktopTimeline({ items }: { items: TimelineItem[] }) {
  const now = new Date();
  const nowYear = now.getFullYear() + now.getMonth() / 12;
  const earliest = Math.floor(Math.min(...items.map((item) => item.start)));
  // Right edge = end of currentYear + 1. "now" lands near the right,
  // and the last year label anchors flush via -translate-x-full.
  const latest = now.getFullYear() + 1;
  const span = latest - earliest;
  const yearMarkers: number[] = [];
  for (let year = earliest; year <= latest; year++) yearMarkers.push(year);

  const pct = (value: number) => ((value - earliest) / span) * 100;
  const nowPct = pct(nowYear);

  const ascending = [...items].sort((a, b) => a.start - b.start);
  const laneEnds: number[] = [];
  const placed = ascending.map((item) => {
    let lane = laneEnds.findIndex((end) => end <= item.start - 0.2);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.end);
    } else {
      laneEnds[lane] = item.end;
    }
    return { item, lane };
  });

  const laneHeight = 68;
  const bandHeight = Math.max(1, laneEnds.length) * laneHeight;

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto pb-2">
        <div
          className="relative"
          style={{ minWidth: 780, height: bandHeight + 44 }}
        >
          <div
            className="absolute inset-x-0 top-0 rounded-2xl"
            style={{
              height: bandHeight,
              background:
                "linear-gradient(180deg, var(--venn-cream) 0%, rgba(253,247,238,0.6) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute top-0 flex flex-col items-center"
            style={{
              left: `${nowPct}%`,
              transform: "translateX(-50%)",
              height: bandHeight,
            }}
          >
            <span className="mb-1 text-sm text-accent" style={hand}>
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
          <div
            className="absolute inset-x-0 h-4 font-mono text-xs text-fg-subtle"
            style={{ top: bandHeight + 12 }}
          >
            {yearMarkers.map((year, index) => {
              const isFirst = index === 0;
              const isLast = index === yearMarkers.length - 1;
              return (
                <span
                  key={year}
                  className={`absolute ${
                    isFirst
                      ? "translate-x-0"
                      : isLast
                        ? "-translate-x-full"
                        : "-translate-x-1/2"
                  }`}
                  style={{ left: `${pct(year)}%` }}
                >
                  {year}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <p
        className="mt-6 text-center text-sm text-fg-subtle md:text-base"
        style={hand}
      >
        hover any card to see what I built there
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
  const tipId = `tl-tip-${item.key}`;
  const chip = (
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

  return (
    <ChipWithTooltip
      tipId={tipId}
      item={item}
      style={{
        left: `${leftPct}%`,
        width: `max(180px, ${widthPct}%)`,
        top: `${topPx}px`,
        height: "52px",
      }}
    >
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby={item.summary ? tipId : undefined}
          aria-label={item.role ? `${item.label} - ${item.role}` : item.label}
          className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {chip}
        </a>
      ) : (
        chip
      )}
    </ChipWithTooltip>
  );
}

function ChipWithTooltip({
  tipId,
  item,
  style,
  children,
}: {
  tipId: string;
  item: TimelineItem;
  style: {
    left: string;
    width: string;
    top: string;
    height: string;
  };
  children: ReactNode;
}) {
  const chipRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => setMounted(true), []);

  const show = () => {
    const next = chipRef.current?.getBoundingClientRect();
    if (!next) return;
    setRect(next);
    setOpen(true);
  };
  const hide = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const next = chipRef.current?.getBoundingClientRect();
      if (next) setRect(next);
    };
    window.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, [open]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover target for the tooltip; the link inside is the control
    <div
      ref={chipRef}
      className="absolute"
      style={style}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      {mounted && open && item.summary && rect
        ? createPortal(
            <TimelineTooltip tipId={tipId} item={item} chipRect={rect} />,
            document.body,
          )
        : null}
    </div>
  );
}

function TimelineTooltip({
  tipId,
  item,
  chipRect,
}: {
  tipId: string;
  item: TimelineItem;
  chipRect: DOMRect;
}) {
  const tipWidth = 280;
  const gap = 12;
  const edge = 12;
  const center = chipRect.left + chipRect.width / 2;
  const left = Math.max(
    edge,
    Math.min(center - tipWidth / 2, window.innerWidth - tipWidth - edge),
  );
  const notchLeft = Math.max(16, Math.min(center - left, tipWidth - 16));
  const dateRange = formatDateRange({
    start: item.startYm,
    end: item.endYm,
  });

  return (
    <div
      id={tipId}
      role="tooltip"
      className="pointer-events-none fixed z-[70] motion-reduce:transition-none"
      style={{
        left,
        top: chipRect.top - gap,
        width: tipWidth,
        transform: "translateY(-100%)",
        animation: "tl-tip-in 160ms ease-out both",
      }}
    >
      <div className="rounded-[18px] border border-slate-200/70 bg-white/95 p-4 shadow-[0_12px_28px_-10px_rgba(15,23,42,0.18)] backdrop-blur-sm">
        <p className="text-[15px] leading-relaxed text-slate-600">
          {item.summary}
        </p>
        <div className="mt-3 border-slate-200/80 border-t pt-3">
          <p className="font-mono text-[12px] tracking-wide text-slate-500">
            {dateRange}
          </p>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="absolute block h-[10px] w-[10px] rotate-45 border-slate-200/70 border-r border-b bg-white/95"
        style={{ left: notchLeft - 5, bottom: -5 }}
      />
      <style>{`
        @keyframes tl-tip-in {
          from { opacity: 0; transform: translateY(calc(-100% + 4px)); }
          to   { opacity: 1; transform: translateY(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="tooltip"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function TimelineCard({
  item,
  open,
  onToggle,
  panelId,
}: {
  item: TimelineItem;
  open: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  const dates = formatDateRange({ start: item.startYm, end: item.endYm });
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={`${item.label}, ${item.role}, ${dates}${
        item.metric ? `, ${item.metric}` : ""
      }`}
      onClick={onToggle}
      className={`flex w-full flex-col gap-1.5 rounded-xl border bg-bg-elevated px-3 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transition-none ${
        open ? "border-accent" : "border-border hover:border-fg/30"
      }`}
    >
      <div className="flex w-full min-w-0 shrink-0 items-center gap-2">
        <LogoTile
          logo={item.logo}
          logoBg={item.logoBg}
          fallback={item.label}
          current={item.current}
          size="sm"
        />
        <p className="truncate text-sm font-semibold text-fg">{item.label}</p>
        <span
          aria-hidden="true"
          className={`ml-auto shrink-0 font-mono text-sm text-fg-subtle transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </div>
      <p className="shrink-0 text-xs leading-snug text-fg-muted">{item.role}</p>
      <p className="shrink-0 font-mono text-[11px] text-fg-subtle">
        {item.current && (
          <span className="mr-1 text-accent" style={hand}>
            now
          </span>
        )}
        {dates}
        {item.employer ? ` · ${item.employer}` : null}
      </p>
      {item.metric && (
        <p className="shrink-0">
          <span className="bg-highlight/80 box-decoration-clone px-1 text-xs font-medium leading-relaxed text-fg">
            {item.metric}
          </span>
        </p>
      )}
    </button>
  );
}

function TimelineDetail({ item, id }: { item: TimelineItem; id: string }) {
  const company = item.employer
    ? `${item.label} · ${item.employer}`
    : item.label;
  return (
    <div id={id} className="mt-4">
      <EntryDetail
        role={item.role}
        company={company}
        logo={item.logo}
        logoBg={item.logoBg}
        headline={item.headline}
        roleChips={item.roleChips}
        narrative={item.narrative}
        achievements={item.achievements}
        closer={item.closer}
        linkOut={item.linkOut}
        start={item.startYm}
        end={item.endYm}
        current={item.current}
      />
      {item.url && !item.linkOut && (
        <p className="mt-3 text-sm">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            {item.label} ↗
          </a>
        </p>
      )}
    </div>
  );
}
