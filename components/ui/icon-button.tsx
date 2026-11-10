import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

// IconButton — a square focus-ring-equipped button used for carousel
// controls, the hamburger, password-eye toggles and any other "one icon,
// no label" action. The `aria-label` is required at the type level.

export type IconButtonVariant = "outline" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex shrink-0 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const VARIANT: Record<IconButtonVariant, string> = {
  outline: "border border-border text-fg hover:bg-bg-elevated",
  ghost: "text-fg hover:bg-bg-elevated",
};

const SIZE: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-11",
};

type Props = {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  "aria-label": string;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton(
    {
      variant = "outline",
      size = "md",
      className = "",
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim()}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
