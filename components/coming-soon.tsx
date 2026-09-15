import { CloudBackground } from "@/components/cloud-background";

const CONTACT_EMAIL = "megh.bpgc@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

type Palette = "dawn" | "blue";

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
    ctaBg: "#0F2237",
    ctaFg: "#F5F9FC",
    ctaShadow: "0 8px 28px rgba(15,34,55,0.28)",
    ctaBorder: "rgba(15,34,55,0.4)",
    ctaGhostBg: "rgba(255,255,255,0.5)",
    veil: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 55%, transparent 80%)",
  },
};

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
          run behind it. Right now at BondScanner. Ultra before.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-3 text-sm transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: t.ctaBg,
              color: t.ctaFg,
              boxShadow: t.ctaShadow,
            }}
          >
            LinkedIn →
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

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
          className="mt-10 rounded-sm text-sm underline underline-offset-4 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: t.muted,
            textDecorationColor: `${t.muted}59`,
          }}
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </main>
  );
}
