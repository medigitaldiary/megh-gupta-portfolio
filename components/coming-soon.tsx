const CONTACT_EMAIL = "hi@meghgupta.com";

// TODO: real link — swap in the actual LinkedIn profile URL.
const LINKEDIN_URL = "https://www.linkedin.com/in/meghgupta/";

// TODO: real link — drop the resume PDF at public/resume.pdf, or swap this
// for a hosted URL (Notion, Read.cv, Dropbox).
const RESUME_URL = "/resume.pdf";

export function ComingSoon() {
  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-col items-start justify-between bg-bg px-6 py-16 md:px-12 md:py-20"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
        Megh Gupta · Product Manager
      </p>

      <div className="max-w-2xl">
        <h1 className="font-serif text-[3rem] leading-[1.05] text-fg md:text-[4.5rem]">
          Portfolio,
          <br />
          <span className="text-accent">soon.</span>
        </h1>
        <p className="mt-8 max-w-[32rem] text-lg leading-[1.6] text-fg-muted">
          I&apos;m rebuilding this from scratch — fintech, growth, and the AI
          tooling that runs behind both. In the meantime, here&apos;s the short
          version.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-5 py-3 text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            LinkedIn →
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-5 py-3 text-fg transition-colors duration-150 ease-out hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Resume (PDF)
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
            className="text-fg-muted underline decoration-fg-subtle underline-offset-4 transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <p className="font-mono text-xs text-fg-subtle">
        © 2026 · Built with Claude Code
      </p>
    </main>
  );
}
