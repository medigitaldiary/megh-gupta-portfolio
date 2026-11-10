import type { HTMLAttributes, ReactNode } from "react";

// Tag — the small monospace chip pattern used for category labels, reading
// time, tech-stack entries and case-study meta rows. Variants cover the two
// real shapes the audit saw: `outline` (border, transparent fill) and
// `filled` (accent fill, used on the "LIVE" / "now" markers).

export type TagVariant = "outline" | "filled" | "subtle";

const BASE =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-mono uppercase";

const VARIANT: Record<TagVariant, string> = {
  outline: "border border-border bg-transparent text-fg-subtle",
  filled: "bg-accent text-accent-fg",
  subtle: "bg-bg-elevated text-fg-muted",
};

export function Tag({
  variant = "outline",
  className = "",
  children,
  ...rest
}: {
  variant?: TagVariant;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">) {
  return (
    <span
      className={`${BASE} ${VARIANT[variant]} px-2 py-0.5 text-[10px] tracking-[0.14em] ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
