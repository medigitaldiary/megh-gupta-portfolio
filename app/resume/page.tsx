import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://www.meghgupta.in";
const RESUME_PDF = "/resume.pdf";
const RESUME_DOWNLOAD = "Megh.Gupta_Resume.pdf";

const DOWNLOAD_BUTTON =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent text-sm text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Megh Gupta, Associate Product Manager, Fintech. Founding PM at BondScanner and platform PM on Tap Invest's ultra app. Download the PDF.",
  alternates: {
    canonical: `${SITE_URL}/resume`,
  },
  openGraph: {
    title: "Megh Gupta · Resume",
    description:
      "Associate Product Manager, Fintech. Founding PM at BondScanner, a SEBI-registered bond platform, and platform PM on Tap Invest's ultra app.",
    url: `${SITE_URL}/resume`,
    siteName: "Megh Gupta",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Megh Gupta in a white turtleneck",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Megh Gupta · Resume",
    description:
      "Associate Product Manager, Fintech. Founding PM at BondScanner and platform PM on Tap Invest's ultra app.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/resume#webpage`,
  url: `${SITE_URL}/resume`,
  name: "Resume | Megh Gupta",
  description:
    "Resume of Megh Gupta, Associate Product Manager, Fintech. Founding PM at BondScanner and platform PM on Tap Invest's ultra app.",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#person`,
  },
};

const CONTACT_ITEMS = [
  {
    label: "Bengaluru",
    href: undefined,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "megh.bpgc@gmail.com",
    href: "mailto:megh.bpgc@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "+91 75188 57216",
    href: "tel:+917518857216",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "meghgupta.in",
    href: "https://www.meghgupta.in",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    label: "linkedin.com/in/meghxgupta",
    href: "https://www.linkedin.com/in/meghxgupta",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74V9.89H5.06v8.61h2.8z" />
      </svg>
    ),
  },
  {
    label: "Open to relocation",
    href: undefined,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M3 12h13" />
        <path d="m12 7 5 5-5 5" />
        <path d="M21 5v14" />
      </svg>
    ),
  },
];

const SKILL_TOOLS = [
  "Figma",
  "Mixpanel",
  "Superset",
  "SQL",
  "Postman",
  "MoEngage",
  "Strapi",
  "Freshdesk",
  "AiSensy",
  "Claude",
  "Claude Code",
  "Cursor",
  "MCP",
];

const SKILL_METHODS = [
  "0-1 PM",
  "first principles",
  "Agile",
  "vibe coding",
  "PRD writing",
  "roadmapping",
  "SEO",
  "funnel analysis",
  "A/B testing",
  "pricing",
];

export default function ResumePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD graph for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-bg print:hidden">
        <div className="mx-auto flex min-h-14 w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-2 md:px-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">←</span>
            <span>
              <span className="font-semibold">Megh Gupta</span>
              <span className="text-fg-muted"> · Resume</span>
            </span>
          </Link>
          <a
            href={RESUME_PDF}
            download={RESUME_DOWNLOAD}
            className={`${DOWNLOAD_BUTTON} px-4`}
          >
            <DownloadIcon />
            <span>Download resume (PDF)</span>
          </a>
        </div>
      </header>

      <main id="main" className="px-4 py-8 sm:px-6 md:py-14 print:p-0">
        <article className="resume-sheet mx-auto max-w-5xl rounded-[18px] border border-border/80 bg-bg-elevated p-6 shadow-[var(--shadow-md)] print:border-none print:bg-transparent print:p-0 print:shadow-none sm:p-10 md:p-12">
          {/* Header & Identity */}
          <header className="border-b border-border/70 pb-6 print:pb-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h1 className="font-display text-[2.25rem] font-medium leading-[1.05] tracking-tight text-fg print:text-[20pt] print:leading-tight md:text-[3rem]">
                  Megh Gupta
                </h1>
                <p className="mt-1 font-mono text-xs sm:text-sm uppercase tracking-wider text-accent font-semibold print:text-[9pt]">
                  Associate Product Manager, Fintech
                </p>
              </div>
            </div>

            {/* Contact details row */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-fg-muted print:mt-1.5 print:gap-x-3.5 print:text-[8pt]">
              {CONTACT_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-1.5"
                >
                  <span className="text-fg-subtle">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="inline-flex min-h-11 items-center underline underline-offset-2 transition-colors duration-150 hover:text-fg"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </header>

          {/* Two-column layout: Experience (left) & Sidebar (right) */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-12 print:grid-cols-[minmax(0,1fr)_15rem] print:gap-6 print:mt-3">
            {/* Primary Column: Experience & Projects */}
            <div className="space-y-8 print:space-y-3.5">
              {/* Summary Section */}
              <section aria-labelledby="resume-summary-title">
                <h2
                  id="resume-summary-title"
                  className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8.5pt]"
                >
                  Summary
                </h2>
                <div className="mt-2.5 text-[15px] leading-relaxed text-fg-muted print:mt-1 print:text-[8pt] md:text-base">
                  <p>
                    Product manager who builds regulated fintech products from 0
                    to 1. Founding PM at BondScanner, a SEBI-registered bond
                    platform opening up India&apos;s bond market for retail
                    investors, and before that platform and retention PM on Tap
                    Invest&apos;s ultra app with 25+ feature launches across
                    onboarding, wallet, referral and retention.
                  </p>
                </div>
              </section>

              {/* Work Experience Section */}
              <section aria-labelledby="resume-experience-title">
                <h2
                  id="resume-experience-title"
                  className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8.5pt]"
                >
                  Experience
                </h2>

                <div className="mt-4 space-y-7 print:mt-2 print:space-y-3">
                  {/* Tap Invest */}
                  <div className="print:break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-border/50 pb-1.5 print:pb-0.5">
                      <div>
                        <h3 className="font-display text-[18px] font-semibold md:text-[20px] text-fg print:text-[10pt]">
                          Associate Product Manager
                        </h3>
                        <p className="text-sm font-medium text-fg-muted print:text-[8.5pt]">
                          Tap Invest
                        </p>
                      </div>
                      <time className="font-mono text-[11px] sm:text-xs text-fg-subtle print:text-[7.5pt]">
                        Mar 2025 – Oct 2026 (18 mos)
                      </time>
                    </div>

                    {/* Product 1: BondScanner */}
                    <div className="mt-3 pl-0 sm:pl-3 border-l-0 sm:border-l-2 sm:border-border/60 print:pl-2 print:border-l print:mt-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h4 className="text-[15px] font-medium md:text-base text-fg print:text-[8.5pt]">
                          BondScanner{" "}
                          <span className="font-normal text-fg-subtle">
                            · SEBI-registered online bond platform
                          </span>
                        </h4>
                        <span className="font-mono text-[10px] sm:text-[11px] text-fg-subtle print:text-[7pt]">
                          Nov 2025 – Oct 2026 (12 mos)
                        </span>
                      </div>

                      <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                        <li>
                          Built BondScanner 0 to 1 as founding PM, launching
                          awareness and acquisition journeys on web and mobile
                          within 2 months.
                        </li>
                        <li>
                          Owned SEO as a product surface, shipping a Strapi blog
                          revamp, a site-wide SEO SOP and an internal linking
                          graph that lifted link health 50–60% in 2 months,
                          helping drive ~2x daily organic clicks.
                        </li>
                        <li>
                          Launched and grew the Bond Bytes newsletter to 200+
                          editions. It reached 20% of all sign-ups, grew reach
                          3.5x month on month and converted 7% of push
                          notifications into KYC and payment completions.
                        </li>
                        <li>
                          Shipped Watchlist, the first native bond-tracking tool
                          among Indian bond platforms. About 5,000 users adopted
                          it in the first two weeks, adding bonds at a 3:1 ratio
                          to removals.
                        </li>
                        <li>
                          Led a third-party bond data partnership from vendor
                          evaluation to API integration, automating 80% of 35+
                          deal creation fields and removing manual ops entry.
                        </li>
                        <li>
                          Revamped the Deal Detail page with secondary market
                          activity, covenants and security data that no other
                          retail bond platform shows, so investors can judge a
                          bond at institutional depth.
                        </li>
                        <li>
                          Set up support workflows on Freshdesk with SLAs and
                          ticket automations, cutting manual support effort by
                          40%.
                        </li>
                        <li>
                          Built an AI call analysis pipeline with Sarvam STT and
                          Claude that scores RM calls and writes action items,
                          lifting team quality scores by about 15% in 30 days.
                        </li>
                      </ul>
                    </div>

                    {/* Product 2: Ultra */}
                    <div className="mt-4 pl-0 sm:pl-3 border-l-0 sm:border-l-2 sm:border-border/60 print:pl-2 print:border-l print:mt-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h4 className="text-[15px] font-medium md:text-base text-fg print:text-[8.5pt]">
                          ultra{" "}
                          <span className="font-normal text-fg-subtle">
                            · Alternative investment app
                          </span>
                        </h4>
                        <span className="font-mono text-[10px] sm:text-[11px] text-fg-subtle print:text-[7pt]">
                          Mar 2025 – Oct 2025 (6 mos)
                        </span>
                      </div>

                      <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                        <li>
                          Built a GIFT City NRI FD MVP under IFSCA rules,
                          closing 3 bank partnerships and onboarding 5 pilot
                          accounts.
                        </li>
                        <li>
                          Launched Flexi Invoice Discounting, a variable-tenure
                          product for early liquidity, adding ~₹50 Cr AUM in 3
                          months.
                        </li>
                        <li>
                          Redesigned the referral flow in onboarding, reaching
                          40% referral adoption and 20% acquisition growth in 3
                          months.
                        </li>
                        <li>
                          Expanded ultra from mobile to web (invest, wallet,
                          KYC), driving 15–20% True AUM growth and 30% of Q3
                          sign-ups.
                        </li>
                        <li>
                          Shipped Strapi CMS so the marketing team could publish
                          on their own, cutting turnaround time by about 30%.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* MoveInSync */}
                  <div className="print:break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-border/50 pb-1.5 print:pb-0.5">
                      <div>
                        <h3 className="font-display text-[18px] font-semibold md:text-[20px] text-fg print:text-[10pt]">
                          Product Intern
                        </h3>
                        <p className="text-sm font-medium text-fg-muted print:text-[8.5pt]">
                          MoveInSync
                        </p>
                      </div>
                      <time className="font-mono text-[11px] sm:text-xs text-fg-subtle print:text-[7.5pt]">
                        Jun 2024 – Feb 2025 (9 mos)
                      </time>
                    </div>

                    <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3 print:mt-1">
                      <li>
                        Worked across PMs, marketing and customer success,
                        turning client-built features into upsells and
                        cross-sells.
                      </li>
                      <li>
                        Built pricing for Safety Toolkit and DMS-ADAS premium
                        features, pitched to 50+ clients at Chennai Prodcon
                        Summit.
                      </li>
                    </ul>
                  </div>

                  {/* Department of Backstage and Infrastructure Management */}
                  <div className="print:break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-border/50 pb-1.5 print:pb-0.5">
                      <div>
                        <h3 className="font-display text-[18px] font-semibold md:text-[20px] text-fg print:text-[10pt]">
                          Chief Coordinator
                        </h3>
                        <p className="text-sm font-medium text-fg-muted print:text-[8.5pt]">
                          Department of Backstage and Infrastructure Mgmt.
                        </p>
                      </div>
                      <time className="font-mono text-[11px] sm:text-xs text-fg-subtle print:text-[7.5pt]">
                        May 2022 – Jun 2023 (13 mos)
                      </time>
                    </div>

                    <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3 print:mt-1">
                      <li>
                        Led production, infrastructure and tech support for two
                        national fests, managing 50+ members and 30k+ attendees.
                      </li>
                      <li>
                        Delivered WAVES&apos;22 for 6,000+ students nationwide
                        on a ~₹1.25 Cr budget, 25% higher than the previous
                        offline fest.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section aria-labelledby="resume-ai-title">
                <h2
                  id="resume-ai-title"
                  className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8.5pt]"
                >
                  AI projects
                </h2>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3 print:mt-1">
                  <li>
                    Built 5 Claude-powered tools for ops, sales and marketing,
                    including a deal QC tool that checked ~60 deals in 15 days.
                  </li>
                  <li>
                    Built internal funnel dashboards on MoEngage MCP and user
                    data, going deeper than MoEngage&apos;s built-in analytics.
                  </li>
                  <li>
                    Built an AI compliance agent that checks every blog draft
                    against NSE and SEBI rules before it reaches human review.
                  </li>
                </ul>
              </section>
            </div>

            {/* Sidebar Column: Skills, Education, Case Studies */}
            <aside
              className="space-y-7 print:space-y-3"
              aria-label="Skills and Education"
            >
              <section className="print:break-inside-avoid">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8pt]">
                  Tools
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
                  {SKILL_TOOLS.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center rounded border border-border/80 bg-bg/60 px-2 py-0.5 font-mono text-sm text-fg-muted print:border-border/60 print:px-1.5 print:py-0 print:text-[7.5pt]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              <section className="print:break-inside-avoid">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8pt]">
                  Methods
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
                  {SKILL_METHODS.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center rounded border border-border/80 bg-bg/60 px-2 py-0.5 text-sm text-fg print:border-border/60 print:px-1.5 print:py-0 print:text-[7.5pt]"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="print:break-inside-avoid">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8pt]">
                  Education
                </h2>
                <div className="mt-2.5 text-sm text-fg-muted print:mt-1 print:text-[7.5pt]">
                  <p className="font-medium text-fg print:text-[8pt]">
                    BITS Pilani, Goa Campus
                  </p>
                  <p className="mt-0.5 leading-snug">
                    B.E. Chemical Engineering + M.Sc. Biological Sciences
                  </p>
                  <time className="mt-1 block font-mono text-[11px] text-fg-subtle print:text-[7pt]">
                    2020 – 2025
                  </time>
                </div>
              </section>
            </aside>
          </div>

          {/* Bottom Action Bar: Download CTA */}
          <div className="print:hidden mt-12 pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-display text-base font-medium text-fg">
                Need a copy for reference or applicant tracking?
              </p>
              <p className="mt-0.5 text-sm text-fg-subtle">
                Download the official PDF for your records or an ATS upload.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={RESUME_PDF}
                download={RESUME_DOWNLOAD}
                className={`${DOWNLOAD_BUTTON} px-6`}
              >
                <DownloadIcon />
                <span>Download resume (PDF)</span>
              </a>
            </div>
          </div>
        </article>
      </main>

      {/* Footer: hidden in print */}
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
