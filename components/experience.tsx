"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import {
  type ExperienceEntry,
  formatDateRange,
  getAllExperience,
} from "@/lib/experience";

export function Experience() {
  const entries = getAllExperience();
  const [openSlug, setOpenSlug] = useState<string | null>(
    entries[0]?.slug ?? null,
  );

  return (
    <section id="experience" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Experience" title="Where I've been." />
        <ul className="border-l border-border">
          {entries.map((entry) => (
            <ExperienceRow
              key={entry.slug}
              entry={entry}
              open={openSlug === entry.slug}
              onToggle={() =>
                setOpenSlug((s) => (s === entry.slug ? null : entry.slug))
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ExperienceRow({
  entry,
  open,
  onToggle,
}: {
  entry: ExperienceEntry;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `exp-panel-${entry.slug}`;
  return (
    <li className="border-b border-border last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="group flex w-full items-center gap-4 py-5 pl-6 pr-2 text-left transition-colors duration-150 ease-out hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:gap-6 md:pl-8"
      >
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-elevated overflow-hidden">
          {entry.logo ? (
            <Image
              src={entry.logo}
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="font-serif text-lg text-fg-subtle"
            >
              {entry.company.slice(0, 1).toUpperCase()}
            </span>
          )}
          {entry.current && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base font-semibold text-fg">
              {entry.company}
            </span>
            <span className="text-sm text-fg-muted">{entry.role}</span>
          </div>
          <p className="mt-0.5 hidden text-sm text-fg-subtle sm:block">
            {formatDateRange(entry)}
          </p>
        </div>

        <span
          aria-hidden="true"
          className={`shrink-0 font-mono text-sm text-fg-subtle transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </button>

      <section
        id={panelId}
        aria-label={`${entry.company} details`}
        hidden={!open}
        className="pb-6 pl-6 pr-4 md:pl-[5.5rem] md:pr-8"
      >
        <p className="mb-3 font-serif text-base italic text-fg-muted sm:hidden">
          {formatDateRange(entry)}
        </p>
        <p className="mb-4 font-serif text-lg italic leading-[1.5] text-fg-muted">
          {entry.tagline}
        </p>
        <ul className="space-y-2.5">
          {entry.bullets.map((b) => (
            <li
              key={b}
              className="flex gap-3 text-[15px] leading-[1.6] text-fg"
            >
              <span aria-hidden="true" className="mt-2 text-accent">
                *
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>
    </li>
  );
}
