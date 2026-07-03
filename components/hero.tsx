const CONTACT_EMAIL = "hi@meghgupta.com";

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[80vh] md:min-h-[85vh] items-center px-6 md:px-8 pt-32 md:pt-40"
    >
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-[3rem] md:text-[4.5rem] leading-[1.05] text-fg">
          I&apos;m Megh.
          <br />I ship fintech products
          <br />
          and the AI tools that
          <br />
          run them.
        </h1>

        <p className="mt-6 max-w-[32rem] text-lg text-fg-muted">
          Currently at BondScanner, building India&apos;s bond market for
          retail.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="rounded-md border border-border px-5 py-3 text-sm text-fg transition-colors duration-150 ease-out hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            See selected work
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-md bg-accent px-5 py-3 text-sm text-accent-fg transition-colors duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Get in touch →
          </a>
        </div>
      </div>
    </section>
  );
}
