"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/case-study-toc";

export type IndexMark = "text" | "row";

type Props = {
  items: TocItem[];
  className?: string;
  mark?: IndexMark;
};

/**
 * Tracks which case-study section is in view. Shared by the desktop
 * "On this page" rail and the mobile index bar so both highlight the
 * same section.
 */
export function useActiveSection(
  items: TocItem[],
): [string, (id: string) => void] {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    // Active = the last section whose top has passed the reading line
    // (just under the sticky bars). Works for normal scrolling and for a
    // page that opens mid-way or jumps straight to the end.
    let frame = 0;
    const update = () => {
      frame = 0;
      let currentId = sections[0]?.id ?? "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top < 120) currentId = section.id;
      }
      if (currentId) setActiveId(currentId);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return [activeId, setActiveId];
}

export function CaseStudyToc({ items, className = "", mark = "row" }: Props) {
  const [activeId, setActiveId] = useActiveSection(items);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" data-index-mark={mark} className={className}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
        On this page
      </p>
      <ol className="mt-3 border-t border-border">
        {items.map((item, index) => {
          const current = item.id === activeId;
          const number = String(index + 1).padStart(2, "0");
          return (
            <li key={`${item.id}-${index}`} className="border-b border-border">
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                onClick={() => setActiveId(item.id)}
                className={`relative z-0 flex gap-3 px-2 py-2.5 text-sm leading-snug transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  current ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                <span className="mt-0.5 shrink-0 font-mono text-[10px] tracking-wider text-fg-subtle">
                  {number}
                </span>
                <span className="min-w-0">
                  <span
                    {...(mark === "text" && current
                      ? { "data-hl-word": "" }
                      : {})}
                  >
                    {item.heading}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
