"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { StackIcon } from "@/components/stack-icon";
import { getExtraStack, getFeaturedStack, type StackTool } from "@/lib/stack";

export function AboutStack() {
  const [showMore, setShowMore] = useState(false);
  const featured = getFeaturedStack();
  const extra = getExtraStack();
  const visible = showMore ? [...featured, ...extra] : featured;

  return (
    <section id="about" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="About" title="A bit about me." />
        <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-14">
          <div className="mx-auto md:mx-0">
            <div className="relative h-[280px] w-[220px] overflow-hidden rounded-lg bg-accent/10 md:h-[320px] md:w-[240px]">
              <Image
                src="/images/about/megh-convocation.webp"
                alt="Megh at BITS Pilani K.K. Birla Goa Campus convocation"
                fill
                sizes="(min-width: 768px) 240px, 220px"
                className="scale-[1.18] object-cover object-[center_72%]"
                priority
              />
            </div>
          </div>
          <div className="prose prose-neutral max-w-none">
            <p className="text-base leading-[1.7] text-fg md:text-lg">
              I&apos;m a product manager at the fintech × AI-tooling
              intersection. Founding PM at BondScanner, where I&apos;m making
              the retail bond market feel less like a spreadsheet and more like
              an app.
            </p>
            <p className="mt-4 text-base leading-[1.7] text-fg-muted md:text-lg">
              Before that I was a platform PM at Ultra, running growth loops and
              reinvestment for their alternative-investment app — the kind of
              lifecycle work that adds a real ₹50cr of AUM if you get it right.
            </p>
            <p className="mt-4 text-base leading-[1.7] text-fg-muted md:text-lg">
              I got into fintech because financial products in India still feel
              hostile to the person using them. That&apos;s the fix I keep
              chasing. Outside work: I read too much, run in Bangalore weather
              badly, and vibe-code the tools I wish existed.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-10">
          <p className="mb-5 font-serif text-lg italic text-fg-muted">
            my stack
          </p>
          <ul className="flex flex-wrap items-center gap-3">
            {visible.map((tool) => (
              <StackChip key={tool.slug} tool={tool} />
            ))}
            {extra.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => setShowMore((v) => !v)}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-dashed border-border px-4 font-mono text-xs uppercase tracking-wide text-fg-subtle transition-colors duration-150 hover:border-accent hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  aria-expanded={showMore}
                >
                  {showMore ? "− less" : `+ ${extra.length} more`}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StackChip({ tool }: { tool: StackTool }) {
  const tipId = `stack-tip-${tool.slug}`;
  return (
    <li className="relative">
      <button
        type="button"
        aria-describedby={tipId}
        aria-label={`${tool.name}: ${tool.oneLiner}`}
        className="group peer flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg-muted transition-colors duration-150 hover:border-accent hover:text-fg focus:border-accent focus:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <span className="h-5 w-5">
          <StackIcon name={tool.icon} />
        </span>
      </button>
      <div
        id={tipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max max-w-[240px] -translate-x-1/2 rounded-md bg-fg px-3 py-2 text-left text-accent-fg opacity-0 shadow-lg transition-opacity duration-100 peer-hover:block peer-hover:opacity-100 peer-focus:block peer-focus:opacity-100 sm:block"
      >
        <p className="text-[13px] font-semibold leading-tight">{tool.name}</p>
        <p className="mt-1 text-[11px] leading-snug opacity-75">
          {tool.oneLiner}
        </p>
      </div>
    </li>
  );
}
