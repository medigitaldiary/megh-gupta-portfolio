import type { ReactNode } from "react";

// Quote — a longer pull-out, the center of gravity of a section. One per
// case study is the right rate; two is the ceiling. Attribution renders
// below as a mono micro-eyebrow prefixed with an em dash (aria-hidden
// so screen readers hear only the quote and the attribution name).

export function Quote({
  attribution,
  children,
}: {
  attribution?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-14 border-l-2 border-accent pl-6">
      <blockquote className="font-serif text-2xl leading-snug text-fg md:text-3xl">
        {children}
      </blockquote>
      {attribution ? (
        <figcaption className="mt-4 font-mono text-xs uppercase tracking-wider text-fg-subtle">
          <span aria-hidden="true">— </span>
          {attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
