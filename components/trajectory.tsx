"use client";

import type { CSSProperties } from "react";
import { workCards } from "@/lib/work";

type TimelineItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  label: string;
  isNow?: boolean;
};

const items: TimelineItem[] = [
  ...workCards.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.description,
    tags: c.tags,
    label: c.timeline,
  })),
  {
    slug: "ai-copilot-now",
    title: "AI Co-pilot for BondScanner",
    description:
      "A platform-wide AI assistant helping users navigate bonds, live in internal beta.",
    tags: ["AI", "In Progress"],
    label: "Now",
    isNow: true,
  },
];

function TagChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-fg-subtle">
      {label}
    </span>
  );
}

function Dot({ item }: { item: TimelineItem }) {
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 block h-3 w-3 rounded-full ${
        item.isNow ? "trajectory-now-dot" : "bg-accent"
      }`}
    />
  );
}

function Card({ item }: { item: TimelineItem }) {
  return (
    <div className="w-60 rounded-xl border border-border bg-bg-elevated p-4 text-left shadow-sm">
      <h3 className="font-serif text-base text-fg">{item.title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
        {item.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}

export function Trajectory() {
  return (
    <section
      id="trajectory"
      className="px-6 py-24 md:px-8 md:py-32"
      style={{ "--live-green": "#3FA66B" } as CSSProperties}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 md:mb-16">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-fg-subtle">
            Trajectory
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">
            How the work has stacked up.
          </h2>
        </div>

        {/* Desktop: horizontal timeline, hover-reveal cards */}
        <div className="relative hidden md:block">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-1.5 h-px bg-border"
          />
          <div className="relative flex items-start justify-between">
            {items.map((item, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === items.length - 1;
              const cardAlign = isFirst
                ? "left-0"
                : isLast
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2";
              return (
                <button
                  key={item.slug}
                  type="button"
                  aria-label={`${item.label}: ${item.title}`}
                  className="group relative flex flex-col items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Dot item={item} />
                  <span className="mt-3 font-mono text-xs text-fg-subtle">
                    {item.label}
                  </span>
                  <div
                    className={`pointer-events-none absolute bottom-full ${cardAlign} mb-3 scale-95 opacity-0 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100`}
                  >
                    <Card item={item} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline, content shown inline (no hover on touch) */}
        <div className="flex flex-col md:hidden">
          {items.map((item, idx) => (
            <div key={item.slug} className="flex gap-4">
              <div className="flex flex-col items-center">
                <Dot item={item} />
                {idx < items.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="mt-2 w-px flex-1 bg-border"
                  />
                )}
              </div>
              <div className="pb-8">
                <span className="font-mono text-xs text-fg-subtle">
                  {item.label}
                </span>
                <h3 className="mt-1 font-serif text-base text-fg">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                  {item.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <TagChip key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .trajectory-now-dot {
          background-color: var(--live-green);
          animation: trajectoryPulse 2s ease-in-out infinite;
        }
        @keyframes trajectoryPulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .trajectory-now-dot {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
