import { CloudBackground } from "@/components/cloud-background";

const CONTACT_EMAIL = "megh.bpgc@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

export function ComingSoon() {
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center md:px-8"
    >
      <CloudBackground />

      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0 bg-gradient-to-b from-bg/25 via-bg/10 to-bg/30"
      />

      <div className="flex max-w-2xl flex-col items-center">
        <h1 className="font-serif text-[3.25rem] leading-[1.05] text-fg md:text-[5rem]">
          Under Construction
        </h1>

        <p className="mt-6 font-serif text-xl leading-[1.4] text-fg md:text-2xl">
          Building a new home for my work &amp; ideas.
        </p>

        <p className="mt-10 text-base leading-[1.7] text-fg md:text-lg">
          Hi, I&apos;m Megh. I build 0→1 fintech, and the AI tools that quietly
          run behind it. Right now at BondScanner. Ultra before.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-5 py-3 text-sm text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            LinkedIn →
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-fg/30 bg-bg/60 px-5 py-3 text-sm text-fg backdrop-blur-sm transition-colors duration-150 ease-out hover:border-fg hover:bg-bg/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Resume (PDF)
          </a>
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
          className="mt-8 text-sm text-fg-muted underline decoration-fg-subtle underline-offset-4 transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <p className="absolute bottom-6 font-mono text-xs uppercase tracking-wider text-fg-subtle">
        Megh Gupta · Product Manager
      </p>
    </main>
  );
}
