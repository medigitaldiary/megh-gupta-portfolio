import Image from "next/image";
import Link from "next/link";
import { CoverVideo } from "@/components/bento/bento-widgets";
import { CopyEmailButton } from "@/components/copy-email-button";
import { BENTO_CAL, BENTO_EMAIL, BENTO_LINKEDIN } from "@/lib/bento";
import type { LabCard } from "@/lib/lab";
import type { WorkCard } from "@/lib/work";

// Server-rendered tiles for the bento board. Anything that holds state
// lives in bento-widgets.tsx.

// ── Intro ──────────────────────────────────────────────────────

export function IntroTile() {
  return (
    <section
      aria-label="Intro"
      className="bento-area-intro flex flex-col justify-center gap-6 px-1 py-6 lg:px-3 lg:py-2"
    >
      <div>
        <div className="mb-3 flex items-center gap-3">
          <Image
            src="/images/hero-portrait.webp"
            alt="Megh Gupta, portrait avatar"
            width={112}
            height={112}
            priority
            className="h-12 w-12 shrink-0 rounded-full drop-shadow-[0_2px_8px_rgba(31,59,46,0.18)]"
          />
          <p className="translate-y-[3px] font-hand text-[1.75rem] text-accent leading-none">
            Hi, I am Megh.
          </p>
        </div>
        <h1 className="font-display text-[2.25rem] text-fg leading-[1.08] tracking-tight xl:text-[2.5rem]">
          <span className="block">
            I turn ideas into <span data-hl-word>features</span>,
          </span>
          <span className="block">
            features into <span data-hl-word>products</span>,
          </span>
          <span className="block">
            products into <span data-hl-word>systems</span>.
          </span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-fg-muted text-sm">
        <span>Product Manager at</span>
        <a
          href="https://bondscanner.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bento-glass inline-flex min-h-8 items-center gap-1.5 px-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Image
            src="/images/logos/bondscanner.jpg"
            alt=""
            width={32}
            height={32}
            className="h-4 w-4 rounded-[4px]"
          />
          BondScanner
        </a>
        <span className="bento-glass bento-glass-lilac inline-flex min-h-8 items-center px-3 text-fg">
          Ex-Ultra
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <CopyEmailButton
          email={BENTO_EMAIL}
          label="Copy email"
          className="bento-glass bento-btn"
        />
        <Link href="/resume" className="bento-glass bento-btn">
          Resume
        </Link>
      </div>
    </section>
  );
}

// ── Work ───────────────────────────────────────────────────────

type WorkTileProps = {
  card: WorkCard;
  value: string;
  label: string;
  lenses: string;
  area: string;
  // tall   cover on top, big number and proof points below (4 x 5)
  // bleed  cover fills the tile, caption sits on it (dark covers)
  // split  cover on top, one-line caption below
  layout: "tall" | "bleed" | "split";
  supporting?: string[];
};

function StatusPill({ onDark = false }: { onDark?: boolean }) {
  return (
    <span
      className={`bento-glass absolute top-4 right-4 z-10 inline-flex min-h-7 items-center gap-1.5 px-3 text-xs ${
        onDark ? "bento-glass-dark text-accent-fg" : "text-fg"
      }`}
    >
      <span className="bento-live-dot" aria-hidden="true" />
      Shipped
    </span>
  );
}

export function WorkTile({
  card,
  value,
  label,
  lenses,
  area,
  layout,
  supporting = [],
}: WorkTileProps) {
  const sizes = "(min-width: 1024px) 36vw, 100vw";

  return (
    <Link
      href={`/work/${card.slug}`}
      aria-label={`${card.title}: ${value} ${label}. Read the case study.`}
      data-lenses={lenses}
      className={`bento-tile bento-link ${area} group flex flex-col`}
    >
      {/* Scan mode face: number, role, where, when. */}
      <div
        data-scan-show
        className="absolute inset-0 z-20 flex-col justify-between bg-bg-elevated p-6"
      >
        <p className="bento-eyebrow">
          {card.company} · {card.timeline}
        </p>
        <div>
          <p className="font-display text-[3rem] text-fg leading-none tracking-tight">
            {value}
          </p>
          <p className="mt-2 text-fg-muted text-sm leading-snug">{label}</p>
        </div>
        <p className="text-fg text-sm">
          {card.title} · {card.role}
        </p>
      </div>

      {layout === "bleed" ? (
        <>
          <div className="absolute inset-0 bg-fg">
            <CoverVideo
              poster={card.coverImage}
              video={card.coverVideo}
              sizes={sizes}
            />
          </div>
          <StatusPill onDark />
          <div className="bento-scrim relative z-10 mt-auto p-6 pt-28 text-accent-fg">
            <p className="font-display text-[2.5rem] leading-none tracking-tight">
              {value}
            </p>
            <p className="mt-1.5 text-sm leading-snug opacity-90">{label}</p>
            <p className="mt-3 font-medium text-base">{card.title}</p>
          </div>
        </>
      ) : (
        <>
          <div
            className={`relative w-full shrink-0 overflow-hidden bg-bg ${
              layout === "tall"
                ? "aspect-[4/3]"
                : "aspect-[4/3] lg:aspect-auto lg:min-h-0 lg:flex-1"
            }`}
          >
            <CoverVideo
              poster={card.coverImage}
              video={card.coverVideo}
              sizes={sizes}
            />
          </div>
          <StatusPill />
          {layout === "tall" ? (
            <div className="flex flex-1 flex-col justify-between gap-5 p-6">
              <div>
                <p className="bento-eyebrow">
                  {card.company} · {card.eyebrow}
                </p>
                <p className="mt-3 font-display text-[4rem] text-fg leading-none tracking-tight xl:text-[4.5rem]">
                  {value}
                </p>
                <p className="mt-2 text-base text-fg-muted leading-snug">
                  {label}
                </p>
              </div>
              {supporting.length ? (
                <ul className="flex flex-col gap-2 border-border border-t pt-4">
                  {supporting.map((line) => (
                    <li
                      key={line}
                      className="flex gap-2 text-fg-muted text-sm leading-snug"
                    >
                      <span aria-hidden="true" className="text-fg-subtle">
                        +
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="flex items-center justify-between font-medium text-base text-fg">
                {card.title}
                <Arrow />
              </p>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-4 p-5 md:p-6">
              <div className="min-w-0">
                <p className="font-medium text-base text-fg">{card.title}</p>
                <p className="mt-1 text-fg-muted text-sm leading-snug">
                  {card.oneLiner}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-[2rem] text-fg leading-none tracking-tight">
                  {value}
                </p>
                <p className="mt-1 font-mono text-[0.625rem] text-fg-subtle uppercase tracking-[0.08em]">
                  {label.split(",")[0]}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </Link>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// ── Workbench ──────────────────────────────────────────────────
// Lab projects sorted by how done they are. Stages come from lib/lab.ts.

export function WorkbenchTile({
  building,
  testing,
  shipped,
  moreShipped,
  lenses,
}: {
  building: LabCard[];
  testing: LabCard[];
  shipped: LabCard[];
  moreShipped: number;
  lenses: string;
}) {
  const columns = [
    { id: "building", label: "Building", cards: building },
    { id: "testing", label: "Testing", cards: testing },
    { id: "shipped", label: "Shipped", cards: shipped },
  ];

  return (
    <section
      aria-label="The workbench: side projects by stage"
      data-lenses={lenses}
      className="bento-tile bento-area-bench flex flex-col gap-4 p-5 md:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="bento-eyebrow">The workbench</p>
        <p className="text-fg-muted text-sm">Things I build after hours.</p>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col gap-2 rounded-[18px] bg-bg/60 p-3"
          >
            <p className="flex items-center gap-1.5 font-mono text-[0.625rem] text-fg-muted uppercase tracking-[0.1em]">
              <span
                className="bento-stage-dot"
                data-stage={col.id}
                aria-hidden="true"
              />
              {col.label}
              <span className="ml-auto text-fg-subtle">
                {col.cards.length + (col.id === "shipped" ? moreShipped : 0)}
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              {col.cards.map((card) => (
                <div
                  key={card.slug}
                  className="rounded-[12px] bg-bg-elevated px-3 py-2 shadow-[0_1px_2px_rgba(31,59,46,0.08)]"
                >
                  <p className="text-fg text-sm leading-tight">{card.title}</p>
                  <p className="mt-0.5 truncate font-mono text-[0.625rem] text-fg-subtle uppercase tracking-[0.08em]">
                    {card.stack.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
            {col.id === "shipped" && moreShipped > 0 ? (
              <p className="px-1 text-fg-subtle text-xs">
                +{moreShipped} more in daily use
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Connect ────────────────────────────────────────────────────

export function ConnectTile() {
  return (
    <section
      aria-label="Get in touch"
      className="bento-tile bento-tile-pine bento-area-connect flex flex-col justify-between gap-8 p-6 md:p-8"
    >
      <div>
        <p className="bento-eyebrow bento-eyebrow-on-pine">
          Let&apos;s connect
        </p>
        <h2 className="mt-3 font-display text-[2.5rem] text-accent-fg leading-[1.05] tracking-tight md:text-[3rem]">
          Fifteen minutes is enough.
        </h2>
        <p className="mt-3 max-w-md text-accent-fg/80 text-base leading-normal">
          A role, a product problem, or a question about bonds. Pick a slot or
          drop a line.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={BENTO_CAL}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-btn bento-btn-solid"
        >
          Book 15 min
        </a>
        <a
          href={BENTO_LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-glass bento-glass-dark bento-btn"
        >
          LinkedIn
        </a>
        <CopyEmailButton
          email={BENTO_EMAIL}
          label="Copy email"
          className="bento-glass bento-glass-dark bento-btn"
        />
      </div>
    </section>
  );
}
