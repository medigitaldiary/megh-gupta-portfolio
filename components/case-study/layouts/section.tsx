import type { ReactNode } from "react";
import { slugifyHeading } from "@/lib/case-study-toc";
import { Eyebrow } from "../primitives/eyebrow";

// Section — the one layout wrapper every case study section uses.
// Variants decide spacing + grid shape; content inside stays prose
// and primitives.

export type SectionVariant =
  | "narrative"
  | "split"
  | "fullBleed"
  | "comparison"
  | "metrics"
  | "deepDive"
  | "reflection"
  | "ownership";

type Props = {
  variant?: SectionVariant;
  heading?: string;
  eyebrow?: string;
  id?: string;
  children: ReactNode;
};

const SECTION_SPACING: Record<SectionVariant, string> = {
  narrative: "mt-16 md:mt-20",
  split: "mt-16 md:mt-20",
  fullBleed: "mt-16 md:mt-20",
  comparison: "mt-16 md:mt-20",
  metrics: "mt-16 md:mt-20",
  deepDive: "mt-20",
  reflection: "mt-20",
  ownership: "mt-16 md:mt-20",
};

export function Section({
  variant = "narrative",
  heading,
  eyebrow,
  id,
  children,
}: Props) {
  const resolvedId = id ?? (heading ? slugifyHeading(heading) : undefined);
  const spacing = `${SECTION_SPACING[variant]} scroll-mt-24`;

  const header = heading ? (
    <header className="mb-6">
      {eyebrow ? (
        <Eyebrow variant="section" className="mb-3 block">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2 className="font-display text-[1.75rem] leading-tight text-fg md:text-[2.25rem]">
        {heading}
      </h2>
    </header>
  ) : null;

  // Split: 3/5 text + 2/5 visual at md:+ ; stacks on mobile.
  if (variant === "split") {
    return (
      <section id={resolvedId} className={spacing}>
        {header}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-10">
          <div className="md:col-span-3">{splitChildren(children).text}</div>
          <div className="md:col-span-2">{splitChildren(children).visual}</div>
        </div>
      </section>
    );
  }

  // Reflection: tighter prose column.
  if (variant === "reflection") {
    return (
      <section id={resolvedId} className={spacing}>
        {header}
        <div className="max-w-xl">{children}</div>
      </section>
    );
  }

  // All other variants: single prose column; the inner primitives
  // (StepGrid, Metric row, Callout, Figure, DataTable) carry their
  // own layout. Nothing to add here except spacing.
  return (
    <section id={resolvedId} className={spacing}>
      {header}
      {children}
    </section>
  );
}

// splitChildren — scans top-level children for the first <Figure> or
// element flagged with data-split="visual" and sends it to the right
// column; everything else goes left. Keeps the Section API thin — the
// author doesn't have to declare slots.
function splitChildren(children: ReactNode): {
  text: ReactNode[];
  visual: ReactNode | null;
} {
  const text: ReactNode[] = [];
  let visual: ReactNode | null = null;
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (
      !visual &&
      child &&
      typeof child === "object" &&
      "props" in child &&
      (child as { props: { "data-split"?: string } }).props?.["data-split"] ===
        "visual"
    ) {
      visual = child;
      continue;
    }
    text.push(child);
  }
  return { text, visual };
}
