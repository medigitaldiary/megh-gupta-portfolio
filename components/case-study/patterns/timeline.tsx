import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { Eyebrow } from "../primitives/eyebrow";

// Timeline — dated events on an axis. Variants:
//   vertical   — events top-to-bottom with a left-margin axis (default).
//   horizontal — events left-to-right (collapses to vertical on mobile).
//   phase      — named phases on a horizontal strip + tick marks below.

type Variant = "vertical" | "horizontal" | "phase";

type EventProps = {
  date: string;
  title: string;
  children?: ReactNode;
  // Internal — set by Timeline.
  _variant?: Variant;
};

function Event({ date, title, children, _variant = "vertical" }: EventProps) {
  const label = (
    <>
      <Eyebrow variant="accent" as="span">
        <time dateTime={date}>{date}</time>
      </Eyebrow>
      <h3 className="mt-1 font-sans text-base leading-snug text-fg">{title}</h3>
      {children ? (
        <div className="mt-1 text-sm leading-relaxed text-fg-muted">
          {children}
        </div>
      ) : null}
    </>
  );
  if (_variant === "vertical") {
    return (
      <li className="relative pl-6">
        <span
          aria-hidden="true"
          className="absolute left-[-5px] top-[6px] h-2.5 w-2.5 rounded-full bg-accent"
        />
        {label}
      </li>
    );
  }
  if (_variant === "horizontal") {
    return (
      <li className="relative flex-1">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-2.5 w-2.5 -translate-y-[5px] rounded-full bg-accent"
        />
        <div className="pt-6">{label}</div>
      </li>
    );
  }
  // phase variant: event is a named band
  return (
    <li className="flex-1 border-l border-border px-4 py-3 first:border-l-0">
      {label}
    </li>
  );
}

function TimelineBase({
  variant = "vertical",
  children,
}: {
  variant?: Variant;
  children: ReactNode;
}) {
  if (variant === "vertical") {
    return (
      <ol className="my-10 space-y-6 border-l border-border pl-2">
        {injectVariant(children, variant)}
      </ol>
    );
  }
  if (variant === "horizontal") {
    return (
      <ol className="my-10 flex flex-col gap-6 border-l border-border pl-2 md:flex-row md:gap-10 md:border-l-0 md:border-t md:pl-0 md:pt-2">
        {injectVariant(children, variant)}
      </ol>
    );
  }
  return (
    <ol className="my-10 flex flex-col rounded-md border border-border bg-bg-elevated md:flex-row">
      {injectVariant(children, variant)}
    </ol>
  );
}

function injectVariant(children: ReactNode, variant: Variant) {
  return Children.map(children, (child) => {
    if (!isValidElement<EventProps>(child)) return child;
    return cloneElement(child, { _variant: variant });
  });
}

export const Timeline = Object.assign(TimelineBase, { Event });
