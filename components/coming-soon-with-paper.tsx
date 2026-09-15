"use client";

import { useEffect, useState } from "react";
import { PaperFallback } from "@/components/paper-fallback";
import { ThreeDPaper } from "@/components/three-d-paper";

const CONTACT_EMAIL = "hi@meghgupta.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

type Variant = "A" | "B" | "C";

const LABELS: Record<Variant, { name: string; note: string }> = {
  A: {
    name: "Variant A · Live paper (WebGL)",
    note: "Animated bent glass. Best-looking. Heavy on mobile.",
  },
  B: {
    name: "Variant B · Static paper (no WebGL)",
    note: "Same four certs, no animation. Fast on every device.",
  },
  C: {
    name: "Variant C · Live on desktop, static on mobile",
    note: "WebGL where the device can afford it, static elsewhere.",
  },
};

/**
 * Coming-soon with three visually distinct background strategies:
 * - A: always WebGL. Heavy but the strongest first impression.
 * - B: always the static canvas composition. No WebGL anywhere.
 * - C: WebGL on desktop with hover + no reduced-motion; static otherwise.
 */
export function ComingSoonWithPaper({ variant }: { variant: Variant }) {
  const [mode, setMode] = useState<"webgl" | "fallback">(() => {
    if (variant === "A") return "webgl";
    return "fallback";
  });

  useEffect(() => {
    if (variant !== "C") return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const capable = window.matchMedia?.(
      "(min-width: 768px) and (hover: hover)",
    ).matches;
    if (capable && !reduce) setMode("webgl");
  }, [variant]);

  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16 text-center md:px-8"
    >
      <div className="-z-20 absolute inset-0">
        {mode === "webgl" ? <ThreeDPaper background /> : <PaperFallback />}
      </div>

      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(250,250,247,0.62) 0%, rgba(250,250,247,0.15) 55%, transparent 80%)",
        }}
      />

      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 rounded-full border border-fg/20 bg-bg/70 px-4 py-1.5 font-mono text-fg-muted text-xs uppercase tracking-wider backdrop-blur-sm">
        {LABELS[variant].name} · rendering: {mode}
      </div>

      <div className="flex max-w-2xl flex-col items-center">
        <h1 className="font-serif text-[3.25rem] text-fg leading-[1.05] md:text-[5rem]">
          Under Construction
        </h1>

        <p className="mt-6 font-serif text-fg text-xl leading-[1.4] md:text-2xl">
          Building a new home for my work &amp; ideas.
        </p>

        <p className="mt-10 text-base text-fg leading-[1.7] md:text-lg">
          I&apos;m Megh — Product Manager at BondScanner, building 0→1 fintech
          and the AI tools that quietly run behind it. Previously platform PM at
          Ultra.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-accent px-5 py-3 text-accent-fg text-sm transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            LinkedIn →
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-fg/30 bg-bg/60 px-5 py-3 text-fg text-sm backdrop-blur-sm transition-colors duration-150 ease-out hover:border-fg hover:bg-bg/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Resume (PDF)
          </a>
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Hello%20from%20your%20site`}
          className="mt-8 rounded-sm text-fg-muted text-sm underline decoration-fg-subtle underline-offset-4 transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {CONTACT_EMAIL}
        </a>

        <p className="mt-6 max-w-md text-fg-subtle text-xs">
          {LABELS[variant].note}
        </p>
      </div>

      <p className="absolute bottom-6 font-mono text-fg-subtle text-xs uppercase tracking-wider">
        Megh Gupta · Product Manager
      </p>
    </main>
  );
}
