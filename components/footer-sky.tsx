import { CloudBackground } from "@/components/cloud-background";
import { IstClock } from "@/components/site-footer";
import { SOCIALS } from "@/components/social-links";
import { buttonStyles } from "@/components/ui/button";

// Sky footer (sandbox at /preview/footer-sky).
//
// One closing fold: a headline, a row of contact pills and a meta strip,
// sitting on a slow cloud drift. The sky starts on the page colour and
// cools toward the bottom, so the footer grows out of the page.
// The clouds are CSS only (components/cloud-background.tsx): no video
// file, and they hold still under reduced motion.

const EMAIL = "megh.bpgc@gmail.com";
const CAL_URL = "https://cal.com/megh-gupta/15min";

const ICON = "h-4 w-4 shrink-0";

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={ICON}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function FooterSky({
  flow,
  wide = false,
  aligned = false,
}: {
  /** Fold-flow previews: chapter number above the headline. */
  flow?: { index?: string };
  /** Fold-flow previews: same max-w-6xl edge as the folds. */
  wide?: boolean;
  /**
   * /preview/v5.1: the footer follows the rules the other folds follow.
   * No solid background (the page wash runs through, so no line shows
   * above it), the standard fold padding, the highlighter label, a
   * supporting line, one primary and one secondary action, and the
   * shared reveal. LinkedIn and GitHub move to the meta strip.
   */
  aligned?: boolean;
} = {}) {
  if (aligned) return <AlignedFooterSky flow={flow} wide={wide} />;
  return (
    // Fold CTA: action. "Okay, how do I reach them?"
    <footer
      id="connect"
      className="relative isolate scroll-mt-16 overflow-hidden bg-bg px-6 pt-32 pb-6 md:px-8 md:pt-44 md:pb-8"
    >
      <CloudBackground
        palette="footer"
        className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]"
      />

      <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-5xl"}`}>
        {flow && (
          <p className="mb-4 font-mono text-fg-muted text-xs uppercase tracking-[0.24em]">
            <span className="border-highlight border-b pb-1">
              {flow.index ? `${flow.index} · Contact` : "Contact"}
            </span>
          </p>
        )}
        <h2 className="font-display text-[clamp(3rem,7vw,4rem)] leading-[1.05] tracking-tight text-fg">
          Let&apos;s connect.
        </h2>

        <ul className="mt-8 flex flex-wrap gap-3">
          <li>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "primary", size: "touch" })}
            >
              <CalendarIcon />
              Book 15 minutes
            </a>
          </li>
          {SOCIALS.map((s) => {
            const external = s.href.startsWith("http");
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "touch",
                  })}
                >
                  <span className={ICON}>{s.icon}</span>
                  {s.label === "Email" ? EMAIL : s.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-20 flex flex-col gap-1 border-fg/20 border-t pt-5 text-fg text-xs leading-[1.6] sm:flex-row sm:items-center sm:justify-between md:mt-28">
          <p>
            <IstClock />
          </p>
          <p>made with zero em dashes</p>
        </div>
      </div>
    </footer>
  );
}

function AlignedFooterSky({
  flow,
  wide,
}: {
  flow?: { index?: string };
  wide: boolean;
}) {
  const email = SOCIALS.find((s) => s.label === "Email");
  const profiles = SOCIALS.filter((s) => s.label !== "Email");
  return (
    // Fold CTA: action. "Okay, how do I reach them?"
    <footer
      id="connect"
      className="relative isolate scroll-mt-16 overflow-hidden px-6 pt-24 pb-6 md:px-8 md:pt-32 md:pb-8"
    >
      <CloudBackground
        palette="footer"
        className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]"
      />

      <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-5xl"}`}>
        <div data-reveal>
          <p className="mb-3 font-mono text-fg-muted text-xs uppercase tracking-[0.24em]">
            <span data-hl-word>
              {flow?.index ? `${flow.index} · Contact` : "Contact"}
            </span>
          </p>
          <h2 className="font-display text-[clamp(3rem,7vw,4rem)] leading-[1.05] tracking-tight text-fg">
            Let&apos;s connect.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-fg-muted leading-[1.6] md:text-lg">
            If you&apos;re working in fintech/wealthtech, product, or the
            early-stage startup world, I&apos;d love to hear from you.
          </p>
        </div>

        <ul data-reveal className="mt-8 flex flex-wrap gap-3">
          <li>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "primary", size: "touch" })}
            >
              <CalendarIcon />
              Book 15 minutes
            </a>
          </li>
          {email && (
            <li>
              <a
                href={email.href}
                className={buttonStyles({
                  variant: "secondary",
                  size: "touch",
                })}
              >
                <span className={ICON}>{email.icon}</span>
                {EMAIL}
              </a>
            </li>
          )}
        </ul>

        <div className="mt-16 flex flex-col gap-3 border-fg/20 border-t pt-4 text-fg text-xs leading-[1.6] sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <ul className="-ml-3 flex items-center gap-1">
            {profiles.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-fg transition-opacity duration-150 hover:opacity-70"
                >
                  <span className={ICON}>{s.icon}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="sm:text-right">
            <IstClock /> · made with zero em dashes
          </p>
        </div>
      </div>
    </footer>
  );
}
