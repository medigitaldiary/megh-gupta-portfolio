import Link, { type LinkProps } from "next/link";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  forwardRef,
  type ReactNode,
} from "react";

// Button — the one pill used across the portfolio.
//
// Two sibling components: <Button> renders a <button>, <ButtonLink> renders
// a Next <Link>. They share classes through `buttonStyles()` below, so a
// visual change to one updates every callsite.
//
// Variants
//   primary   Pine fill, oatmeal text, hover:opacity-90. The dominant CTA.
//   outline   Pine border on cream, invert on hover. Secondary CTA.
//   hairline  Toasted-oat border, pine text, hover darkens to --bg. The
//             quietest ghost, used end-of-study where the eye should rest
//             on the primary (Book 20 min) first.
//   ghost     No chrome until hover. For dense button rows (nav).
//
// Sizes
//   sm        px-4  py-2       (nav resume, back-to-work)
//   md        px-5  py-2.5     (hero, case-study CTA)
//   lg        px-6  py-3       (not-found, error, mobile nav)
//   touch     px-5 min-h-11    (end-of-study CTA, touch-first)
//
// Modifiers
//   mono      Switches body to font-mono, uppercase tracking.

export type ButtonVariant = "primary" | "outline" | "hairline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "touch";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  mono?: boolean;
  className?: string;
};

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg hover:opacity-90",
  outline: "border border-fg text-fg hover:bg-fg hover:text-accent-fg",
  hairline: "border border-border text-fg hover:bg-bg",
  ghost: "text-fg hover:bg-bg-elevated",
};

const SIZE_PAD: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-2.5",
  lg: "px-6 py-3",
  touch: "min-h-11 px-5",
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-sm",
  touch: "text-sm",
};

const MONO = "font-mono text-xs uppercase tracking-[0.14em]";

function buttonStyles({
  variant = "primary",
  size = "md",
  mono = false,
  className = "",
}: SharedProps) {
  return [
    BASE,
    VARIANT[variant],
    SIZE_PAD[size],
    mono ? MONO : SIZE_TEXT[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export const Button = forwardRef<
  HTMLButtonElement,
  SharedProps &
    ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }
>(function Button(
  { variant, size, mono, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, mono, className })}
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
  function ButtonLink(
    { variant, size, mono, className, children, ...rest },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={buttonStyles({ variant, size, mono, className })}
        {...rest}
      >
        {children}
      </Link>
    );
  },
);
