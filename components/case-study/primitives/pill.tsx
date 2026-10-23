import type { ReactNode } from "react";

// Pill — a rounded hairline-bordered chip with a short label. Not
// interactive by default; a linked tag is a <Link> with pill styling,
// not this component. Variants: stack (mono muted, default), tag (sans
// fg), status (accent border + accent mono).

export type PillVariant = "stack" | "tag" | "status";

export function Pill({
  variant = "stack",
  children,
}: {
  variant?: PillVariant;
  children: ReactNode;
}) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-1";
  const look =
    variant === "tag"
      ? "border-border font-sans text-xs text-fg"
      : variant === "status"
        ? "border-accent font-mono text-[11px] uppercase tracking-wider text-accent"
        : "border-border font-mono text-[11px] text-fg-muted";
  // tag variant opts into the case-study-page lilac hover fill via
  // data-hl-tag — picked up by components/case-study/case-study.css.
  const hoverAttr = variant === "tag" ? { "data-hl-tag": true } : {};
  return (
    <span className={`${base} ${look}`} {...hoverAttr}>
      {children}
    </span>
  );
}
