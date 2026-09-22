const CONTACT_EMAIL = "hi@meghgupta.in";
const FALLBACK_EMAIL = "megh.bpgc@gmail.com";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/megh-gupta-917280200",
  },
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Read.cv", href: "#" },
];

export function Contact() {
  return (
    <section
      id="connect"
      className="scroll-mt-16 bg-accent px-6 py-32 text-accent-fg md:px-8 md:py-48"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent-fg/70">
          Get in touch
        </p>

        <h2 className="font-serif text-5xl leading-[1.05] md:text-6xl">
          Let&apos;s connect.
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-[1.6] text-accent-fg/85">
          I&apos;m always up for a chat about fintech, agentic AI, or an
          interesting PM role. Drop a note and I&apos;ll reply within a couple
          of days.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
            className="rounded-full bg-accent-fg px-6 py-3 text-base font-medium text-accent transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
          >
            Email me →
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-base underline decoration-accent-fg/40 underline-offset-4 transition-opacity duration-150 hover:opacity-80"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <p className="mt-4 text-xs text-accent-fg/60">
          Or write to {FALLBACK_EMAIL}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-accent-fg/80">
          {SOCIAL_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm transition-colors duration-150 ease-out hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-fg focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
              >
                {link.label}
              </a>
              {i < SOCIAL_LINKS.length - 1 && <span aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
