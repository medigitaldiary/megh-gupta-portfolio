import Link, { type LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

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
// Size
//   sm        14px. The default.
//   xs        12px. The product tab link beside the segmented control.
//   base      16px. The company name in Experience.
//
// Modifiers
//   highlight The underline becomes a flowing Venn gradient. For one
//             time-bound moment (new, limited seats, a deadline). Shares
//             the "one highlight on the whole site" rule with
//             <Button variant="highlight">. Styles live in
//             app/globals.css (.link-highlight). Not used by any call site.
//   onPine    For pine surfaces (the contact fold). Oatmeal label and a
//             brighter gradient.
//   arrow     Set false when a leading icon already marks the link and a
//             trailing arrow would be a second glyph (resume contact row).
//             LinkedIn still uses the external arrow.
//
// TextLinkButton is the same look on a <button> (Skip, replay).

export type TextLinkDirection = "onward" | "external" | "back";
export type TextLinkSize = "xs" | "sm" | "base";
export type TextLinkWeight = "medium" | "semibold";

type VisualProps = {
  direction?: TextLinkDirection;
  highlight?: boolean;
  onPine?: boolean;
  size?: TextLinkSize;
  weight?: TextLinkWeight;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

const HIT =
  "inline-flex min-h-11 items-center rounded-sm font-sans transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const INNER = "inline-flex items-center gap-1.5";

const SIZE_CLASS: Record<TextLinkSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
};

const WEIGHT_CLASS: Record<TextLinkWeight, string> = {
  medium: "font-medium",
  semibold: "font-semibold",
};

const PATHS: Record<TextLinkDirection, string> = {
  onward: "M5 12h14M13 6l6 6-6 6",
  external: "M7 17 17 7M8 7h9v9",
  back: "M19 12H5M11 6l-6 6 6 6",
};

export function CtaArrow({
  direction = "onward",
  className = "size-3.5 shrink-0",
}: {
  direction?: TextLinkDirection;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[direction]} />
    </svg>
  );
}

function textLinkClass({
  direction = "onward",
  highlight = false,
  onPine = false,
  size = "sm",
  weight = "medium",
  arrow = true,
  className = "",
}: VisualProps) {
  const tone = onPine
    ? "text-accent-fg focus-visible:ring-accent-fg focus-visible:ring-offset-accent"
    : "text-fg focus-visible:ring-accent";
  const line = highlight
    ? `link-highlight ${onPine ? "link-highlight-pine" : ""}`
    : "underline decoration-[1.5px] underline-offset-[5px]";
  return {
    direction,
    arrow,
    line,
    className: [HIT, SIZE_CLASS[size], WEIGHT_CLASS[weight], tone, className]
      .filter(Boolean)
      .join(" "),
  };
}

function TextLinkInner({
  direction,
  arrow,
  line,
  children,
}: {
  direction: TextLinkDirection;
  arrow: boolean;
  line: string;
  children: ReactNode;
}) {
  return (
    <span className={`${INNER} ${line}`.trim()}>
      {arrow && direction === "back" ? <CtaArrow direction="back" /> : null}
      {children}
      {arrow && direction !== "back" ? (
        <CtaArrow direction={direction} />
      ) : null}
    </span>
  );
}

type LinkPropsForText = VisualProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> &
  LinkProps;

export function TextLink({
  direction,
  highlight,
  onPine,
  size,
  weight,
  arrow,
  className,
  children,
  ...rest
}: LinkPropsForText) {
  const visual = textLinkClass({
    direction,
    highlight,
    onPine,
    size,
    weight,
    arrow,
    className,
    children,
  });
  const external =
    visual.direction === "external"
      ? { target: "_blank" as const, rel: "noopener noreferrer" }
      : {};

  return (
    <Link className={visual.className} {...external} {...rest}>
      <TextLinkInner
        direction={visual.direction}
        arrow={visual.arrow}
        line={visual.line}
      >
        {children}
      </TextLinkInner>
    </Link>
  );
}

type ButtonPropsForText = VisualProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function TextLinkButton({
  direction,
  highlight,
  onPine,
  size,
  weight,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: ButtonPropsForText) {
  const visual = textLinkClass({
    direction,
    highlight,
    onPine,
    size,
    weight,
    arrow,
    className,
    children,
  });

  return (
    <button type={type} className={visual.className} {...rest}>
      <TextLinkInner
        direction={visual.direction}
        arrow={visual.arrow}
        line={visual.line}
      >
        {children}
      </TextLinkInner>
    </button>
  );
}
