import Link, { type LinkProps } from "next/link";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  forwardRef,
  type ReactNode,
} from "react";

// Button — the pill CTA.
//
// Two sibling components: <Button> renders a <button>, <ButtonLink> renders
// a Next <Link>. They share classes through `buttonStyles()` below, so a
// visual change to one updates every callsite. Elements that cannot be
// either (a copy button, a file download) take `buttonStyles()` as className.
//
// Variants
//   primary    Pine fill, oatmeal label, --shadow-md. The one most
//              important action in view. One per fold.
//   secondary  1.5px pine border on --bg-elevated, pine label. Hover
//              inverts to pine fill. A real alternative to the primary.
//   highlight  Flowing Venn gradient with a matching glow. For one
//              time-bound moment (new, limited seats, a deadline). At most
//              one on the whole site at a time; it replaces the primary in
//              its fold. Styles live in app/globals.css (.cta-highlight).
//              Not used by any call site today.
//
// Sizes
//   sm        px-4  py-2       (nav resume)
//   md        px-5  py-2.5     (hero, case-study CTA)
//   lg        px-6  py-3       (not-found, error, mobile nav, unlock)
//   touch     px-5 min-h-11    (end-of-study CTA, touch-first)
//
// Labels are sentence case in Geist Sans. Tertiary actions are TextLink.

export type ButtonVariant = "primary" | "secondary" | "highlight";
export type ButtonSize = "sm" | "md" | "lg" | "touch";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-fg shadow-[var(--shadow-md)] hover:opacity-90",
  secondary:
    "border-[1.5px] border-solid border-fg bg-bg-elevated text-fg hover:bg-fg hover:text-accent-fg",
  highlight: "cta-highlight",
};

const SIZE_PAD: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-2.5",
  lg: "px-6 py-3",
  touch: "min-h-11 px-5",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: SharedProps) {
  return [BASE, VARIANT[variant], SIZE_PAD[size], className]
    .filter(Boolean)
    .join(" ");
}

export const Button = forwardRef<
  HTMLButtonElement,
  SharedProps &
    ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }
>(function Button(
  { variant, size, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...rest}
    >
      {children}
    </button>
  );
});

type ButtonLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps & { children: ReactNode };

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink({ variant, size, className, children, ...rest }, ref) {
    return (
      <Link
        ref={ref}
        className={buttonStyles({ variant, size, className })}
        {...rest}
      >
        {children}
      </Link>
    );
  },
);
