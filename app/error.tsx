"use client";

import Link from "next/link";
import { useEffect } from "react";

// Next.js App Router error boundary. Fires when a client component throws
// (Venn stage, About collage, carousel, etc.). Minimal branded shell with a
// retry and a home link. `global-error.tsx` is NOT needed here: this boundary
// covers every route under the root layout, and Next's default global shell
// is fine for the rare case where this component itself crashes.

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg px-6 py-16 text-center md:px-8"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-fg-muted">
        Something broke
      </p>
      <h1
        className="font-display font-semibold tracking-tight text-fg"
        style={{
          fontSize: "clamp(2.25rem, 9vw, 5rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
        }}
      >
        Not your fault.
      </h1>
      <p
        className="mt-6 max-w-xl text-fg-muted leading-relaxed"
        style={{ fontSize: "clamp(0.9375rem, 2vw, 1.125rem)" }}
      >
        A piece of the page crashed. Try again, or head home.
        {error.digest ? (
          <>
            {" "}
            <span className="font-mono text-fg-subtle text-xs">
              (ref: {error.digest})
            </span>
          </>
        ) : null}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors duration-150 ease-out hover:bg-fg hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
