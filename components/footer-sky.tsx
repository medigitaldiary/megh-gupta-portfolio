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
}: {
  /** Fold-flow previews: chapter number above the headline. */
  flow?: { index?: string };
  /** Fold-flow previews: same max-w-6xl edge as the folds. */
  wide?: boolean;
} = {}) {
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
