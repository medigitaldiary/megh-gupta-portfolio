"use client";

import { useEffect, useState } from "react";
import { PaperFallback } from "@/components/paper-fallback";
import { ThreeDPaper } from "@/components/three-d-paper";

const CONTACT_EMAIL = "hi@meghgupta.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

type Variant = "A" | "B" | "C";

/**
 * Coming-soon page with paper background, in three flavors:
 * - A: always WebGL
 * - B: WebGL on desktop, static canvas fallback on mobile/reduced-motion
 * - C: static fallback on load, upgrade to WebGL on first pointermove or after 2s
 */
export function ComingSoonWithPaper({ variant }: { variant: Variant }) {
  const [mode, setMode] = useState<"webgl" | "fallback">(() => {
    if (variant === "A") return "webgl";
    return "fallback";
  });

  useEffect(() => {
    if (variant === "A") return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const capable = window.matchMedia?.(
      "(min-width: 768px) and (hover: hover)",
    ).matches;

    if (variant === "B") {
      if (capable && !reduce) setMode("webgl");
      return;
    }

    // Variant C: fallback first, upgrade on interaction or timeout.
    if (!capable || reduce) return;
    let upgraded = false;
    const upgrade = () => {
      if (upgraded) return;
      upgraded = true;
      setMode("webgl");
      window.removeEventListener("pointermove", upgrade);
    };
    window.addEventListener("pointermove", upgrade, { once: true });
    const t = setTimeout(upgrade, 2000);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointermove", upgrade);
    };
  }, [variant]);

  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16 text-center md:px-8"
    >
      <div className="absolute inset-0 -z-20">
        {mode === "webgl" ? <ThreeDPaper background /> : <PaperFallback />}
      </div>

      {/* Radial scrim keeps the middle readable without hiding the papers */}
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(250,250,247,0.62) 0%, rgba(250,250,247,0.15) 55%, transparent 80%)",
        }}
      />

      <div className="flex max-w-2xl flex-col items-center">
        <h1 className="font-serif text-[3.25rem] leading-[1.05] text-fg md:text-[5rem]">
          Under Construction
        </h1>

        <p className="mt-6 font-serif text-xl leading-[1.4] text-fg md:text-2xl">
          Building a new home for my work &amp; ideas.
        </p>

        <p className="mt-10 text-base leading-[1.7] text-fg md:text-lg">
          I&apos;m Megh — Product Manager at BondScanner, building 0→1 fintech
          and the AI tools that quietly run behind it. Previously platform PM at
          Ultra.
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
          className="mt-8 rounded-sm text-fg-muted text-sm underline decoration-fg-subtle underline-offset-4 transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <p className="absolute bottom-6 font-mono text-fg-subtle text-xs uppercase tracking-wider">
        Megh Gupta · Product Manager · Variant {variant}
      </p>
    </main>
  );
}
