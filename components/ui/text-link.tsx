import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

// TextLink — the tertiary CTA. An underlined label with a small arrow.
// Use it for "see more", "go back" and "open elsewhere", where a pill
// would be too loud. Spec: design-system/02-components.md §2a.
//
// Direction
//   onward    Arrow right, trailing. The default.
//   external  Arrow up-right, trailing. Opens a new tab with
//             rel="noopener noreferrer".
//   back      Arrow left, leading.
//
// Modifiers
//   highlight The underline becomes a flowing Venn gradient. For one
//             time-bound moment (new, limited seats, a deadline). Shares
//             the "one highlight on the whole site" rule with
//             <Button variant="highlight">. Styles live in
//             app/globals.css (.link-highlight).
//   onPine    For pine surfaces (the contact fold). Oatmeal label and a
//             brighter gradient.

export type TextLinkDirection = "onward" | "external" | "back";

type Props = {
  direction?: TextLinkDirection;
  highlight?: boolean;
  onPine?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> &
  LinkProps;

const HIT =
  "inline-flex min-h-11 items-center rounded-sm text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const INNER = "inline-flex items-center gap-1.5";

const PATHS: Record<TextLinkDirection, string> = {
  onward: "M5 12h14M13 6l6 6-6 6",
  external: "M7 17 17 7M8 7h9v9",
  back: "M19 12H5M11 6l-6 6 6 6",
};

function Arrow({ direction }: { direction: TextLinkDirection }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d={PATHS[direction]} />
    </svg>
  );
}

export function TextLink({
  direction = "onward",
  highlight = false,
  onPine = false,
  className = "",
  children,
  ...rest
}: Props) {
  const external =
    direction === "external"
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
  const tone = onPine
    ? "text-accent-fg focus-visible:ring-accent-fg focus-visible:ring-offset-accent"
    : "text-fg focus-visible:ring-accent";
  const line = highlight
    ? `link-highlight ${onPine ? "link-highlight-pine" : ""}`
    : "underline decoration-[1.5px] underline-offset-[5px]";

  return (
    <Link
      className={`${HIT} ${tone} ${className}`.trim()}
      {...external}
      {...rest}
    >
      <span className={`${INNER} ${line}`.trim()}>
        {direction === "back" ? <Arrow direction={direction} /> : null}
        {children}
        {direction === "back" ? null : <Arrow direction={direction} />}
      </span>
    </Link>
  );
}
