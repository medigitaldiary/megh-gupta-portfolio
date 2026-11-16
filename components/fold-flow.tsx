// Shared bits for the fold-flow previews (/preview/v4.1, /preview/v4.3).
// A fold opts in by taking a `flow` prop: a chapter number, an optional
// pine tone, and a one-line handoff to the fold after it (CLAUDE.md §14,
// rule 4: no fold ends flat).

export type FoldLead = { href: string; label: string };

export type FoldFlow = {
  /** Chapter number for the eyebrow, e.g. "01". */
  index?: string;
  /** Put the fold on pine. Tokens flip through .tone-pine in globals.css. */
  tone?: "pine";
  /** The line at the bottom of the fold that names what comes next. */
  leadOut?: FoldLead;
};

export function FoldLeadOut({
  href,
  label,
  direction = "down",
  className = "mt-12 md:mt-16",
}: FoldLead & { direction?: "down" | "up"; className?: string }) {
  return (
    <p className={className}>
      <a
        href={href}
        className="group inline-flex min-h-11 items-center gap-2 font-mono text-fg-muted text-xs uppercase tracking-[0.16em] transition-colors duration-150 hover:text-fg"
      >
        {label}
        <span
          aria-hidden="true"
          className={`transition-transform duration-150 motion-reduce:transition-none ${
            direction === "down"
              ? "group-hover:translate-y-0.5"
              : "group-hover:-translate-y-0.5"
          }`}
        >
          {direction === "down" ? "↓" : "↑"}
        </span>
      </a>
    </p>
  );
}
