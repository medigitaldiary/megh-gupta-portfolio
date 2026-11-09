import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

// TLDR — the three-bullet summary that opens a case study (CLAUDE.md §5).
// Lives above the first Section so a 30-second reader leaves knowing
// the shape of the story. Children are the bullets as <li> items; the
// chip and spacing are the component's job.

export function TLDR({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-6 mb-10 rounded-lg border border-border bg-bg-elevated p-5 md:p-6">
      <Eyebrow variant="accent" className="mb-3">
        TL;DR
      </Eyebrow>
      <ul className="list-disc space-y-2 pl-5 font-sans text-base leading-relaxed text-fg marker:text-fg-muted">
        {children}
      </ul>
    </aside>
  );
}
