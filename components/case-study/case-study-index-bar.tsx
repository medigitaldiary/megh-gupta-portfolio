"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useActiveSection } from "@/components/case-study/case-study-toc";
import type { TocItem } from "@/lib/case-study-toc";

type Props = {
  items: TocItem[];
};

/**
 * Mobile / tablet "On this page" (G-M1 option #5, closes G-M2). Below xl
 * the index sticks to the top edge as a one-line bar naming the section
 * being read. Tapping it drops the full list down; picking a section, a
 * tap outside or Escape closes it. Hidden from xl up, where the sticky
 * rail does this job.
 */
export function CaseStudyIndexBar({ items }: Props) {
  const [activeId, setActiveId] = useActiveSection(items);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (items.length === 0) return null;

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const active = items[activeIndex];
  const number = (index: number) => String(index + 1).padStart(2, "0");

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-40 border-b border-border bg-bg xl:hidden"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="relative z-20 mx-auto flex min-h-12 w-full max-w-[46rem] items-center justify-between gap-3 px-6 text-left text-sm font-medium text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent md:px-8"
      >
        <span className="sr-only">On this page, current section: </span>
        <span className="min-w-0 truncate">
          <span className="font-mono text-xs text-fg-subtle">
            {number(activeIndex)}
          </span>{" "}
          {active?.heading}
        </span>
        <span aria-hidden="true" className="shrink-0 text-xs">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close the section list"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-0 cursor-default bg-fg/35"
          />
          <div
            id={panelId}
            className="absolute inset-x-0 top-full z-10 max-h-[70svh] overflow-y-auto rounded-b-2xl bg-bg-elevated shadow-[0_12px_30px_rgba(31,59,46,0.18)]"
          >
            <ol className="mx-auto w-full max-w-[46rem] px-6 pb-3 md:px-8">
              {items.map((item, index) => {
                const current = index === activeIndex;
                return (
                  <li
                    key={`${item.id}-${index}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <a
                      href={`#${item.id}`}
                      aria-current={current ? "location" : undefined}
                      onClick={() => {
                        setActiveId(item.id);
                        setOpen(false);
                      }}
                      className={`flex min-h-11 items-center gap-3 py-2.5 text-sm leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        current ? "font-semibold text-fg" : "text-fg-muted"
                      }`}
                    >
                      <span className="shrink-0 font-mono text-[10px] tracking-wider text-fg-subtle">
                        {number(index)}
                      </span>
                      <span className="min-w-0">{item.heading}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      ) : null}
    </nav>
  );
}
