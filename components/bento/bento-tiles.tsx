import Image from "next/image";
import Link from "next/link";
import { CoverVideo } from "@/components/bento/bento-widgets";
import { CopyEmailButton } from "@/components/copy-email-button";
import { BENTO_CAL, BENTO_EMAIL, BENTO_LINKEDIN } from "@/lib/bento";
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
        onDark
          ? "bento-glass-dark bento-on-cover text-accent-fg"
          : "bento-object text-fg"
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

// ── Connect ────────────────────────────────────────────────────

export function ConnectTile() {
  return (
    <section
      aria-label="Get in touch"
      className="bento-tile bento-tile-pine bento-area-connect flex flex-col justify-between gap-6 p-6 md:p-8 lg:p-6 xl:p-7"
    >
      <div>
        <p className="bento-eyebrow bento-eyebrow-on-pine">
          Let&apos;s connect
        </p>
        <h2 className="mt-3 font-display text-[2.5rem] text-accent-fg leading-[1.05] tracking-tight md:text-[3rem] lg:text-[2.25rem] xl:text-[2.5rem]">
          Fifteen minutes is enough.
        </h2>
        <p className="mt-3 max-w-md text-accent-fg/80 text-base leading-normal lg:text-sm">
          A role, a product problem, or a question about bonds. Pick a slot or
          drop a line.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
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
