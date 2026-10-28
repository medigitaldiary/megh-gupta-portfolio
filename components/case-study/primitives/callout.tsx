import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

// Callout — a sentence lifted out of the prose because the reader
// shouldn't scroll past it. One component, five variants: insight,
// result, decision (all accent-left-bordered) and caution, learning
// (muted-left-bordered). The eyebrow label is the actual signal; five
// labels on two visual treatments.

export type CalloutVariant =
  | "insight"
  | "result"
  | "decision"
  | "caution"
  | "learning";

const LABELS: Record<CalloutVariant, string> = {
  insight: "Insight",
  result: "Result",
  decision: "The decision",
  caution: "What didn't work",
  learning: "Learning",
};

const ACCENT_VARIANTS = new Set<CalloutVariant>([
  "insight",
  "result",
  "decision",
]);

export function Callout({
  variant = "insight",
  eyebrow,
  children,
}: {
  variant?: CalloutVariant;
  eyebrow?: string;
  children: ReactNode;
}) {
  const isAccent = ACCENT_VARIANTS.has(variant);
  const border = isAccent ? "border-l-accent" : "border-l-fg-muted";
  const labelVariant = isAccent ? "accent" : "micro";
  return (
    <aside
      className={`my-8 rounded-lg border border-border border-l-4 bg-bg-elevated p-5 md:p-6 ${border}`}
    >
      <Eyebrow variant={labelVariant}>{eyebrow ?? LABELS[variant]}</Eyebrow>
      <div className="mt-2 font-sans text-base leading-relaxed text-fg">
        {children}
      </div>
    </aside>
  );
}
