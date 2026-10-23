import type { ReactNode } from "react";

// Eyebrow — the mono-cased label pattern that runs through the whole
// system. One component, three variants: section (12px, above a Section
// H2), micro (10px, inside cards and strips), accent (10px, accent-
// coloured for Callout insight/result/decision eyebrows).

export type EyebrowVariant = "section" | "micro" | "accent";

export function Eyebrow({
  children,
  variant = "section",
  as: Tag = "p",
  className = "",
}: {
  children: ReactNode;
  variant?: EyebrowVariant;
  as?: "p" | "span" | "div";
  className?: string;
}) {
  const base = "font-mono font-medium uppercase";
  const size =
    variant === "section"
      ? "text-xs tracking-[0.24em] text-fg-subtle"
      : variant === "accent"
        ? "text-[10px] tracking-wider text-accent"
        : "text-[10px] tracking-wider text-fg-subtle";
  return (
    <Tag className={`${base} ${size} ${className}`.trim()}>{children}</Tag>
  );
}
