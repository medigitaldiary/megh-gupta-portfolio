import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL = "https://www.meghgupta.in";
const RESUME_PDF = "/resume.pdf";

export const metadata: Metadata = {
  title: "Resume · Megh Gupta",
  description:
    "Resume of Megh Gupta, Associate Product Manager (Fintech, Growth, AI Tooling) at Tap Invest (BondScanner, Ultra) and MoveInSync. Explore experience, impact metrics, and download PDF.",
  alternates: {
    canonical: `${SITE_URL}/resume`,
  },
  openGraph: {
    title: "Megh Gupta · Resume",
    description:
      "Associate Product Manager at BondScanner (Tap Invest). 0 to 1 fintech builds, growth systems, programmatic SEO, and AI workflows.",
    url: `${SITE_URL}/resume`,
    siteName: "Megh Gupta",
    type: "profile",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Megh Gupta · Resume",
    description:
      "Associate Product Manager at BondScanner (Tap Invest). Explore experience and download resume.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#megh-gupta`,
      name: "Megh Gupta",
      url: SITE_URL,
      jobTitle: "Associate Product Manager",
      worksFor: {
        "@type": "Organization",
        name: "BondScanner (Tap Invest)",
        url: "https://tapinvest.in",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "BITS Pilani, Goa Campus",
      },
      sameAs: [
        "https://www.linkedin.com/in/megh-gupta-917280200",
      ],
      knowsAbout: [
        "Product Management",
        "Fintech",
        "Growth Product Management",
        "Programmatic SEO",
        "SEBI Regulations",
        "AI Workflows",
        "Funnel Optimization",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/resume#webpage`,
      url: `${SITE_URL}/resume`,
      name: "Resume · Megh Gupta",
      description:
        "Resume of Megh Gupta, Associate Product Manager at Tap Invest (BondScanner, Ultra).",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#megh-gupta`,
      },
    },
  ],
};

const CONTACT_ITEMS = [
  {
    label: "Bengaluru, India",
    href: undefined,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "megh.bpgc@gmail.com",
    href: "mailto:megh.bpgc@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "+91 7518857216",
    href: "tel:+917518857216",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "meghgupta.in",
    href: "https://www.meghgupta.in",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/megh-gupta-917280200",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74V9.89H5.06v8.61h2.8z" />
      </svg>
    ),
  },
];

const SKILL_TOOLS = [
  "Figma",
  "MoEngage",
  "Freshdesk",
  "Mixpanel",
  "Superset",
  "SQL",
  "Notion",
  "Strapi",
  "Digio",
  "AiSensy",
];

const SKILL_METHODS = [
  "0 to 1 Builds",
  "Growth PM",
  "Funnel Analysis",
  "PRD Writing",
  "A/B Testing",
  "Roadmapping",
];

export default function ResumePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD graph for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top utility navigation: hidden when printing */}
      <header className="print:hidden border-b border-border/70 bg-bg/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-medium text-fg hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            >
              <span className="font-display tracking-tight text-base">Megh Gupta</span>
              <span className="text-xs text-fg-subtle font-mono hidden sm:inline">/ resume</span>
            </Link>
          </div>

          <nav className="flex items-center gap-4 text-xs sm:text-sm">
            <Link
              href="/"
              className="text-fg-muted hover:text-fg transition-colors duration-150 hidden md:inline"
            >
              Home
            </Link>
            <Link
              href="/#work"
              className="text-fg-muted hover:text-fg transition-colors duration-150 hidden md:inline"
            >
              Work
            </Link>
            <Link
              href="/#about"
              className="text-fg-muted hover:text-fg transition-colors duration-150 hidden md:inline"
            >
              About
            </Link>

            <a
              href={RESUME_PDF}
              download="Megh_Gupta_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs sm:text-sm font-medium text-accent-fg hover:opacity-90 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Download PDF</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="main" className="px-4 py-8 sm:px-6 md:py-14 print:p-0">
        <article className="resume-sheet mx-auto max-w-5xl rounded-2xl border border-border/80 bg-bg-elevated p-6 sm:p-10 md:p-12 shadow-[0_4px_24px_-8px_rgba(31,59,46,0.08)] print:border-none print:shadow-none print:p-0 print:bg-transparent">
          
          {/* Header & Identity */}
          <header className="border-b border-border/70 pb-6 print:pb-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-medium leading-tight text-fg tracking-tight print:text-[20pt] print:leading-tight">
                  Megh Gupta
                </h1>
                <p className="mt-1 font-mono text-xs sm:text-sm uppercase tracking-wider text-accent font-semibold print:text-[9pt]">
                  Associate Product Manager · Fintech
                </p>
              </div>

              {/* Action buttons inside sheet header: hidden in print */}
              <div className="print:hidden mt-3 sm:mt-0 flex items-center gap-2.5">
                <a
                  href={RESUME_PDF}
                  download="Megh_Gupta_Resume.pdf"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/80 px-3.5 py-1.5 text-xs font-medium text-fg hover:border-accent hover:bg-bg transition-colors duration-150"
                  aria-label="Download PDF copy"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            {/* Contact details row */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-muted print:text-[8pt] print:mt-1.5 print:gap-x-3.5">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="inline-flex items-center gap-1.5">
                  <span className="text-fg-subtle">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="hover:text-fg underline underline-offset-2 transition-colors duration-150"
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
                <h2 id="resume-summary-title" className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8.5pt]">
                  Summary
                </h2>
                <div className="mt-2.5 space-y-2 text-xs sm:text-[13px] leading-relaxed text-fg-muted print:text-[8pt] print:mt-1 print:space-y-1">
                  <p>
                    Founding PM at BondScanner, building a 0 to 1 SEBI-regulated online bond investing platform simplifying access to India&apos;s traditionally offline bond market through digital onboarding, growth systems, and investor workflows.
                  </p>
                  <p>
                    Platform &amp; Retention PM at Tap Invest Ultra, leading 25+ feature launches across invoice discounting, acquisition funnels, customer experience, onboarding, wallet systems, and retention journeys.
                  </p>
                </div>
              </section>

              {/* Work Experience Section */}
              <section aria-labelledby="resume-experience-title">
                <h2 id="resume-experience-title" className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8.5pt]">
                  Experience
                </h2>

                <div className="mt-4 space-y-7 print:mt-2 print:space-y-3">
                  
                  {/* Tap Invest */}
                  <div className="print:break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-border/50 pb-1.5 print:pb-0.5">
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-medium text-fg print:text-[10pt]">
                          Associate Product Manager
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-fg-muted print:text-[8.5pt]">
                          Tap Invest
                        </p>
                      </div>
                      <time className="font-mono text-[11px] sm:text-xs text-fg-subtle print:text-[7.5pt]">
                        Mar &apos;25 - Present (15 Mos)
                      </time>
                    </div>

                    {/* Product 1: BondScanner */}
                    <div className="mt-3 pl-0 sm:pl-3 border-l-0 sm:border-l-2 sm:border-border/60 print:pl-2 print:border-l print:mt-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h4 className="font-medium text-xs sm:text-sm text-fg print:text-[8.5pt]">
                          BondScanner <span className="font-normal text-fg-subtle text-xs">· SEBI-Regulated Bond Platform</span>
                        </h4>
                        <span className="font-mono text-[10px] sm:text-[11px] text-fg-subtle print:text-[7pt]">
                          Nov &apos;25 - Present
                        </span>
                      </div>

                      {/* Sub-track: Acquisition & Activation */}
                      <div className="mt-2 print:mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90 print:text-[7pt]">
                          Acquisition &amp; Activation
                        </p>
                        <ul className="mt-1 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                          <li>
                            Built BondScanner from 0 to 1 as Founding PM, launching onboarding and sign-up journeys across web and mobile within 2 Mos.
                          </li>
                          <li>
                            Developed a product-led SEO engine comprising 350+ blogs, 200+ Bond Dictionary terms, and 26,000+ programmatic bond pages, driving ~2x growth in daily organic clicks within 3 months.
                          </li>
                        </ul>
                      </div>

                      {/* Sub-track: Engagement & Retention */}
                      <div className="mt-2.5 print:mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90 print:text-[7pt]">
                          Engagement &amp; Retention
                        </p>
                        <ul className="mt-1 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                          <li>
                            Launched and scaled Bond Bytes newsletter across 100+ editions, reaching 20% of total sign-ups with a 3.5x MoM reach growth and 7% PN-to-conversion rate towards KYC and payment completions.
                          </li>
                          <li>
                            Launched Bonds Wrapped, a Spotify-inspired web campaign; optimized onboarding funnels and performance marketing journeys, contributing to ~20% reduction in CAC.
                          </li>
                        </ul>
                      </div>

                      {/* Sub-track: Product Infrastructure & Scale */}
                      <div className="mt-2.5 print:mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90 print:text-[7pt]">
                          Product Infrastructure &amp; Scale
                        </p>
                        <ul className="mt-1 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                          <li>
                            Led third-party data partnership end-to-end with Derivium, integrating vendor APIs into the backend as a data layer for the deal creation flow, automating 80% of fields and eliminating manual ops entry.
                          </li>
                          <li>
                            Revamped the Deal Detail page with datasets no other retail bond platform surfaces, including secondary market activity, covenants, and security data, so users can evaluate bonds at institutional depth before investing.
                          </li>
                          <li>
                            Built and operationalized customer support workflows using Freshdesk integrations, SLA systems, and ticket automations, reducing manual support effort by 40%.
                          </li>
                          <li>
                            Built an AI-powered call analysis pipeline using Sarvam STT and Claude to automate RM call evaluations and action-item generation, improving team quality scores by ~15% within 30 days.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Product 2: Ultra */}
                    <div className="mt-4 pl-0 sm:pl-3 border-l-0 sm:border-l-2 sm:border-border/60 print:pl-2 print:border-l print:mt-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h4 className="font-medium text-xs sm:text-sm text-fg print:text-[8.5pt]">
                          Ultra <span className="font-normal text-fg-subtle text-xs">· Alternative Investment App</span>
                        </h4>
                        <span className="font-mono text-[10px] sm:text-[11px] text-fg-subtle print:text-[7pt]">
                          Mar &apos;25 - Oct &apos;25
                        </span>
                      </div>

                      {/* Sub-track: Acquisition & Activation */}
                      <div className="mt-2 print:mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90 print:text-[7pt]">
                          Acquisition &amp; Activation
                        </p>
                        <ul className="mt-1 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                          <li>
                            Led GIFT City NRI FD initiative from market sizing to live pilot, evaluating 13 banking partners and onboarding 5 pilot accounts before strategic pause due to regulatory and business prioritization shifts.
                          </li>
                          <li>
                            Redesigned referral flow within onboarding journey, driving 40% referral adoption and 20% acquisition growth over 3 months.
                          </li>
                        </ul>
                      </div>

                      {/* Sub-track: Revenue & Monetization */}
                      <div className="mt-2.5 print:mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90 print:text-[7pt]">
                          Revenue &amp; Monetization
                        </p>
                        <ul className="mt-1 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                          <li>
                            Launched Flexi Invoice Discounting, a variable-tenure product enabling early liquidity for investors, contributing ~₹50Cr additional AUM within 3 months.
                          </li>
                        </ul>
                      </div>

                      {/* Sub-track: Product Infrastructure & Scale */}
                      <div className="mt-2.5 print:mt-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90 print:text-[7pt]">
                          Product Infrastructure &amp; Scale
                        </p>
                        <ul className="mt-1 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3">
                          <li>
                            Shipped Strapi CMS infrastructure to streamline campaign operations, enabling independent publishing workflows and reducing turnaround time by ~30%.
                          </li>
                          <li>
                            Shipped the Ultra web app across investment, wallet, dashboard, and KYC modules, driving 15-20% True AUM growth and 30% new user acquisition in Q3 2025 through web-led campaigns.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* MoveInSync */}
                  <div className="print:break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-border/50 pb-1.5 print:pb-0.5">
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-medium text-fg print:text-[10pt]">
                          Product Intern
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-fg-muted print:text-[8.5pt]">
                          MoveInSync
                        </p>
                      </div>
                      <time className="font-mono text-[11px] sm:text-xs text-fg-subtle print:text-[7.5pt]">
                        Jun &apos;24 - Feb &apos;25 (9 Mos)
                      </time>
                    </div>

                    <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3 print:mt-1">
                      <li>
                        Developed pricing strategies for Safety Toolkit and DMS-ADAS premium features, presented at Chennai Prodcon Summit driving upselling conversations with 50+ commute clients.
                      </li>
                      <li>
                        Expanded cross-sell penetration to 50 commute clients by delivering an ETS dashboard for transport teams, driving a targeted 15% revenue increase.
                      </li>
                    </ul>
                  </div>

                  {/* Department of Backstage and Infrastructure Management */}
                  <div className="print:break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1 border-b border-border/50 pb-1.5 print:pb-0.5">
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-medium text-fg print:text-[10pt]">
                          Chief Coordinator
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-fg-muted print:text-[8.5pt]">
                          Department of Backstage and Infrastructure Management
                        </p>
                      </div>
                      <time className="font-mono text-[11px] sm:text-xs text-fg-subtle print:text-[7.5pt]">
                        May &apos;22 - Jun &apos;23 (13 Mos)
                      </time>
                    </div>

                    <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3 print:mt-1">
                      <li>
                        Oversaw production, infrastructure, and technical support for two national-level festivals with 30,000+ attendees, leading a 54-member team.
                      </li>
                      <li>
                        WAVES 2022 united 6,000+ students nationwide with a budget of ~₹1.25 Crore, up 25% from the previous offline edition.
                      </li>
                    </ul>
                  </div>

                  {/* AI Systems & Automations */}
                  <div className="print:break-inside-avoid">
                    <div className="border-b border-border/50 pb-1.5 print:pb-0.5">
                      <h3 className="font-display text-base sm:text-lg font-medium text-fg print:text-[10pt]">
                        AI Systems &amp; Automations
                      </h3>
                      <p className="text-xs text-fg-subtle print:text-[7.5pt]">
                        Internal Tooling &amp; Agent Workflows
                      </p>
                    </div>

                    <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-xs sm:text-[12.5px] leading-relaxed text-fg-muted print:text-[7.5pt] print:space-y-0.5 print:pl-3 print:mt-1">
                      <li>
                        Developed 5 internal AI tools using Claude API across deal QC, compliance validation, and operational workflows for Ops, Sales, and Marketing teams.
                      </li>
                      <li>
                        Built MoEngage MCP workflows and reporting systems for product-led marketing and lifecycle execution.
                      </li>
                      <li>
                        Designed an AI-powered content compliance system with automated review workflows, governing all content published across the BondScanner platform.
                      </li>
                    </ul>
                  </div>

                </div>
              </section>

            </div>

            {/* Sidebar Column: Skills, Education, Case Studies */}
            <aside className="space-y-7 print:space-y-3" aria-label="Skills and Education">
              
              {/* Skills - Methods */}
              <section className="print:break-inside-avoid">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8pt]">
                  Methods &amp; Craft
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
                  {SKILL_METHODS.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center rounded-md border border-border/80 bg-bg/60 px-2 py-0.5 text-xs text-fg print:text-[7.5pt] print:px-1.5 print:py-0 print:border-border/60"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </section>

              {/* Skills - Tools */}
              <section className="print:break-inside-avoid">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8pt]">
                  Tools &amp; Stack
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5 print:mt-1 print:gap-1">
                  {SKILL_TOOLS.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center rounded-md border border-border/80 bg-bg/60 px-2 py-0.5 text-xs text-fg-muted font-mono print:text-[7.5pt] print:px-1.5 print:py-0 print:border-border/60"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section className="print:break-inside-avoid">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold print:text-[8pt]">
                  Education
                </h2>
                <div className="mt-2.5 text-xs text-fg-muted print:text-[7.5pt] print:mt-1">
                  <p className="font-medium text-fg print:text-[8pt]">
                    BITS Pilani, Goa Campus
                  </p>
                  <p className="mt-0.5 leading-snug">
                    B.E. Chemical Engineering + M.Sc. Biological Sciences
                  </p>
                  <time className="mt-1 block font-mono text-[11px] text-fg-subtle print:text-[7pt]">
                    2020 - 2025
                  </time>
                </div>
              </section>

              {/* Relevant Case Studies (Hidden in print) */}
              <section className="print:hidden pt-2 border-t border-border/60">
                <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Featured Case Studies
                </h2>
                <ul className="mt-2.5 space-y-2 text-xs">
                  <li>
                    <Link
                      href="/work/product-led-seo-engine"
                      className="group block rounded-lg border border-border/70 p-2.5 bg-bg/40 hover:bg-bg hover:border-accent transition-colors duration-150"
                    >
                      <span className="font-medium text-fg group-hover:underline">
                        Product-Led SEO Engine
                      </span>
                      <span className="block text-[11px] text-fg-subtle mt-0.5">
                        2x organic clicks, 26,000+ programmatic pages
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/work/ai-call-analysis-pipeline"
                      className="group block rounded-lg border border-border/70 p-2.5 bg-bg/40 hover:bg-bg hover:border-accent transition-colors duration-150"
                    >
                      <span className="font-medium text-fg group-hover:underline">
                        AI Call Analysis Pipeline
                      </span>
                      <span className="block text-[11px] text-fg-subtle mt-0.5">
                        Sarvam STT + Claude automated RM evaluation
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/work/ultra-web-platform"
                      className="group block rounded-lg border border-border/70 p-2.5 bg-bg/40 hover:bg-bg hover:border-accent transition-colors duration-150"
                    >
                      <span className="font-medium text-fg group-hover:underline">
                        Ultra Web Platform
                      </span>
                      <span className="block text-[11px] text-fg-subtle mt-0.5">
                        0 to 1 web investment platform for alternate assets
                      </span>
                    </Link>
                  </li>
                </ul>
              </section>

              {/* Quick links to sections */}
              <section className="print:hidden pt-2 border-t border-border/60 text-xs text-fg-subtle space-y-1">
                <p>Looking for more context?</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/#experience"
                    className="inline-flex items-center gap-1 text-fg hover:underline"
                  >
                    Interactive Timeline →
                  </Link>
                  <Link
                    href="/#connect"
                    className="inline-flex items-center gap-1 text-fg hover:underline"
                  >
                    Get in touch →
                  </Link>
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
              <p className="text-xs text-fg-subtle mt-0.5">
                Download the official PDF or open any linked case studies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={RESUME_PDF}
                download="Megh_Gupta_Resume.pdf"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg hover:opacity-90 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                <span>Download Resume (PDF)</span>
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
