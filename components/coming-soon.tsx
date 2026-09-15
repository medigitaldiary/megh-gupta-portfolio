import { CloudBackground } from "@/components/cloud-background";

const CONTACT_EMAIL = "megh.bpgc@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

/**
 * Coming-soon page. Its own small design language — dawn sky, cumulus
 * clouds, warm ink CTAs — separate from the site's green portfolio
 * palette (which stays for /work, /about etc. when they launch).
 * Palette is scoped inline so nothing here leaks into the rest of the site.
 */
export function ComingSoon() {
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center md:px-8"
      style={{ color: "#22262B" }}
    >
      <CloudBackground />

      {/* Very soft veil so text has just enough contrast without hiding the sky. */}
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(246,236,209,0.55) 0%, rgba(246,236,209,0.15) 55%, transparent 80%)",
        }}
      />

      <div className="flex max-w-2xl flex-col items-center">
        <p
          className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.28em]"
          style={{ color: "#6B7078" }}
        >
          Megh · cloud
        </p>

        <h1
          className="font-serif text-[3.5rem] leading-[1] md:text-[6rem]"
          style={{ color: "#22262B", letterSpacing: "-0.01em" }}
        >
          Under Construction
        </h1>

        <p
          className="mt-6 font-serif text-xl italic leading-[1.35] md:text-2xl"
          style={{ color: "#4A505A" }}
        >
          Building a new home for my work &amp; ideas.
        </p>

        <p
          className="mt-10 max-w-xl text-base leading-[1.75] md:text-lg"
          style={{ color: "#3A3F47" }}
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
              backgroundColor: "#22262B",
              color: "#F6ECD1",
              boxShadow: "0 8px 28px rgba(34,38,43,0.25)",
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
              border: "1px solid rgba(34,38,43,0.35)",
              color: "#22262B",
              backgroundColor: "rgba(255,255,255,0.35)",
            }}
          >
            Resume (PDF)
          </a>
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
          className="mt-10 rounded-sm text-sm underline underline-offset-4 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: "#4A505A",
            textDecorationColor: "rgba(74,80,90,0.35)",
          }}
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <p
        className="absolute bottom-6 font-mono text-[0.65rem] uppercase tracking-[0.32em]"
        style={{ color: "#7A8089" }}
      >
        Megh Gupta · Product Manager
      </p>
    </main>
  );
}
