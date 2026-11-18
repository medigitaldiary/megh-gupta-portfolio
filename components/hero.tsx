import Image from "next/image";
import { type FoldLead, FoldLeadOut } from "@/components/fold-flow";
import { HeroLink } from "@/components/hero-link";
import { ProductVenn } from "@/components/product-venn";
import { ProductVennTravel } from "@/components/product-venn-travel";
import { ButtonLink, CtaArrow } from "@/components/ui";

export function Hero({
  link,
  settled = false,
  handoff = false,
  wide = false,
  leadOut,
  threeLine = false,
  resume = false,
}: {
  link?: "travel";
  settled?: boolean;
  handoff?: boolean;
  /** Fold-flow previews: sit on the same max-w-6xl edge as every other fold. */
  wide?: boolean;
  /** Fold-flow previews: the line that names the fold after the hero. */
  leadOut?: FoldLead;
  /**
   * /preview/v5.1: the headline sits on three lines wherever it fits
   * (tablet, and desktop from `xl`). The text column takes the width its
   * lines need and the Venn takes the rest. At `lg` the two columns are
   * too tight for that, and on phones 36px type cannot hold a full line,
   * so both keep the six-line wrap.
   */
  threeLine?: boolean;
  /** v5.1: Resume sits beside Let's connect. The nav no longer carries it. */
  resume?: boolean;
}) {
  const portrait = (
    <Image
      src="/images/hero-portrait.webp"
      alt="Megh Gupta, portrait avatar"
      width={128}
      height={128}
      priority
      className="h-[44px] w-[44px] shrink-0 rounded-full drop-shadow-[0_2px_8px_rgba(31,59,46,0.18)] md:h-[56px] md:w-[56px]"
    />
  );

  return (
    <section
      id="hero"
      className={
        link === "travel"
          ? "relative px-6 py-20 md:px-8 md:py-28"
          : "px-6 py-20 md:px-8 md:py-28"
      }
    >
      <div
        className={`mx-auto grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] ${
          wide ? "max-w-6xl" : "max-w-5xl"
        } ${threeLine ? "xl:grid-cols-[auto_minmax(0,1fr)]" : ""}`}
      >
        <div className="min-w-0">
          {/* Avatar + handwritten greeting sit on the same row; the
              avatar's left edge aligns with the H1 below. The avatar
              replaces the earlier sun icon pseudo-element: removing
              the data-hero-greeting attribute neutralises that rule
              in app/globals.css without touching the global stylesheet. */}
          <div className="mb-3 flex items-center gap-4 md:gap-[18px]">
            <span
              data-hero-slot="portrait"
              {...(link === "travel" ? { "data-hero-portrait": "" } : {})}
              className={`inline-flex shrink-0 ${handoff ? "opacity-0" : ""}`}
            >
              {portrait}
            </span>
            <p
              data-hero-slot="greeting"
              className={`translate-y-[3px] font-hand text-3xl leading-[1] text-accent md:translate-y-[5px] md:text-[2.25rem] ${handoff ? "opacity-0" : ""}`}
            >
              Hi, I am Megh.
            </p>
          </div>

          <h1
            data-hero-reveal
            className={`font-display text-[2.25rem] leading-[1.08] tracking-tight text-fg md:text-[3rem] ${
              threeLine
                ? "md:whitespace-nowrap lg:whitespace-normal lg:text-[3.25rem] xl:whitespace-nowrap xl:text-[3rem]"
                : "lg:text-[3.25rem]"
            } ${handoff ? "opacity-0" : ""}`}
          >
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

          <div
            data-hero-reveal
            className={`mt-8 flex flex-wrap items-center gap-3 ${handoff ? "opacity-0" : ""}`}
          >
            <ButtonLink href="#connect" size="lg">
              Let&apos;s connect <CtaArrow />
            </ButtonLink>
            {resume ? (
              <ButtonLink
                href="/resume.pdf"
                variant="secondary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
                <DownloadIcon />
              </ButtonLink>
            ) : null}
          </div>
        </div>

        {/* Venn is hidden below the `lg` breakpoint so the chip text
            doesn't shrink to the unreadable ~4px seen in the audit
            (design-system/03-gaps.md · G-A3). Phones get heading +
            CTA only; the Venn earns its place on viewports wide
            enough to render the chips at legible sizes. */}
        <div
          data-hero-reveal
          className={`hidden min-w-0 lg:block ${handoff ? "opacity-0" : ""}`}
        >
          {link === "travel" ? (
            <ProductVennTravel variant="travel" />
          ) : (
            <ProductVenn settled={settled} />
          )}
        </div>
      </div>
      {leadOut && (
        <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-5xl"}`}>
          <FoldLeadOut {...leadOut} className="mt-10 md:mt-14" />
        </div>
      )}
      {link === "travel" ? <HeroLink /> : null}
    </section>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}
