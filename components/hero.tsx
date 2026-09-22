export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[80svh] items-center px-6 pt-32 md:min-h-[85svh] md:px-8 md:pt-40"
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-wider text-fg-subtle">
          Megh Gupta · Product Manager
        </p>

        <h1 className="font-serif text-[3rem] leading-[1.05] tracking-tight text-fg md:text-[4.5rem]">
          I turn ideas into features,
          <br className="hidden md:block" /> features into products,
          <br className="hidden md:block" /> products into systems.
        </h1>

        <p className="mt-8 max-w-[36rem] text-lg leading-[1.6] text-fg-muted">
          I&apos;m a product manager at BondScanner, a SEBI-registered online
          bond platform, making bond investing as simple as it should be. BITS
          Goa grad, a couple of years into fintech, and lately I&apos;ve been
          building with voice AI and agentic systems.
        </p>

        <div className="mt-10">
          <a
            href="#connect"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Let&apos;s connect →
          </a>
        </div>
      </div>
    </section>
  );
}
