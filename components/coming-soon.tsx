import { CloudBackground } from "@/components/cloud-background";
import { CopyEmailButton } from "@/components/copy-email-button";

const CONTACT_EMAIL = "megh.bpgc@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

type Palette = "dawn" | "blue" | "ods";

const TOKENS: Record<
  Palette,
  {
    headline: string;
    subtitle: string;
    body: string;
    eyebrow: string;
    muted: string;
    ctaBg: string;
    ctaFg: string;
    ctaShadow: string;
    ctaBorder: string;
    ctaGhostBg: string;
    veil: string;
  }
> = {
  dawn: {
    headline: "#22262B",
    subtitle: "#4A505A",
    body: "#3A3F47",
    eyebrow: "#6B7078",
    muted: "#4A505A",
    ctaBg: "#22262B",
    ctaFg: "#F6ECD1",
    ctaShadow: "0 8px 28px rgba(34,38,43,0.25)",
    ctaBorder: "rgba(34,38,43,0.35)",
    ctaGhostBg: "rgba(255,255,255,0.35)",
    veil: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(246,236,209,0.55) 0%, rgba(246,236,209,0.15) 55%, transparent 80%)",
  },
  blue: {
    headline: "#0F2237",
    subtitle: "#334A63",
    body: "#243953",
    eyebrow: "#4F6884",
    muted: "#334A63",
    ctaBg: "#0A66C2", // LinkedIn brand blue
    ctaFg: "#FFFFFF",
    ctaShadow: "0 8px 28px rgba(10,102,194,0.32)",
    ctaBorder: "rgba(15,34,55,0.4)",
    ctaGhostBg: "rgba(255,255,255,0.5)",
    veil: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 55%, transparent 80%)",
  },
  // Derived from the ownCloud Design System v14 tokens (src/tokens/ods/color.yaml).
  // brand.default rgb(4,30,66), primary.default rgb(74,118,172), success.muted rgb(83,150,10).
  ods: {
    headline: "#041E42", // brand.default
    subtitle: "#22385A",
    body: "#22385A",
    eyebrow: "#4A76AC", // primary.default
    muted: "#4A76AC",
    ctaBg: "#041E42", // brand.default — dark navy pill
    ctaFg: "#FFFFFF",
    ctaShadow: "0 8px 28px rgba(4,30,66,0.32)",
    ctaBorder: "rgba(4,30,66,0.35)",
    ctaGhostBg: "rgba(255,255,255,0.6)",
    veil: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(240,245,252,0.55) 0%, rgba(240,245,252,0.15) 55%, transparent 80%)",
  },
};

function LinkedInMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ComingSoon({ palette = "dawn" }: { palette?: Palette }) {
  const t = TOKENS[palette];
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center md:px-8"
      style={{ color: t.headline }}
    >
      <CloudBackground palette={palette} />

      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0"
        style={{ background: t.veil }}
      />

      <div className="flex max-w-2xl flex-col items-center">
        <p
          className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.28em]"
          style={{ color: t.eyebrow }}
        >
          Product Manager · Fintech
        </p>

        <h1
          className="font-serif text-[3.5rem] leading-[1] md:text-[6rem]"
          style={{ color: t.headline, letterSpacing: "-0.01em" }}
        >
          Under Construction
        </h1>

        <p
          className="mt-6 font-serif text-xl italic leading-[1.35] md:text-2xl"
          style={{ color: t.subtitle }}
        >
          Building a new home for my work &amp; ideas.
        </p>

        <p
          className="mt-10 max-w-xl text-base leading-[1.75] md:text-lg"
          style={{ color: t.body }}
        >
          Hi, I&apos;m Megh. I build 0→1 fintech, and the AI tools that quietly
          run behind it. Right now at BondScanner, making bond investing simple
          for retail investors.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: t.ctaBg,
              color: t.ctaFg,
              boxShadow: t.ctaShadow,
            }}
          >
            <LinkedInMark />
            <span>LinkedIn →</span>
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-3 text-sm backdrop-blur-sm transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              border: `1px solid ${t.ctaBorder}`,
              color: t.headline,
              backgroundColor: t.ctaGhostBg,
            }}
          >
            Resume (PDF)
          </a>
        </div>

        <CopyEmailButton
          email={CONTACT_EMAIL}
          className="mt-10 inline-flex cursor-pointer items-center gap-2 rounded-sm bg-transparent text-sm underline underline-offset-4 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: t.muted,
            textDecorationColor: `${t.muted}59`,
          }}
        />
      </div>
    </main>
  );
}
