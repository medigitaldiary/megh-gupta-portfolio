import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg px-6 py-16 text-center md:px-8"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-fg-muted">
        404 · nothing here
      </p>
      <h1
        className="font-display font-semibold tracking-tight text-fg"
        style={{
          fontSize: "clamp(2.25rem, 9vw, 5rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
        }}
      >
        Wrong doorway.
      </h1>
      <p
        className="mt-6 max-w-xl text-fg-muted leading-relaxed"
        style={{ fontSize: "clamp(0.9375rem, 2vw, 1.125rem)" }}
      >
        Either the page moved or the URL took a wrong turn. The exits below lead
        somewhere real.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Home
        </Link>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 rounded-full border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors duration-150 ease-out hover:bg-fg hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Selected Work
        </Link>
        <Link
          href="/#connect"
          className="inline-flex items-center gap-2 rounded-full border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors duration-150 ease-out hover:bg-fg hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
