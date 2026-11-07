"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/case-study-toc";

export type IndexMark = "text" | "row";

type Props = {
  items: TocItem[];
  className?: string;
  mark?: IndexMark;
};

export function CaseStudyToc({ items, className = "", mark = "row" }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        let currentId = "";
        for (const item of items) {
          if (visible.has(item.id)) currentId = item.id;
        }
        if (currentId) setActiveId(currentId);
      },
      { rootMargin: "-96px 0px -80% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [items]);

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
