import { Eyebrow } from "./eyebrow";

// Metric — a number that earns the page. Used inside the body for a
// results strip (inline), or inside a StepGrid cell when a workstream
// carries a quantified outcome (card). The HeadlineStrip above the fold
// is a different thing, driven by frontmatter.

export type MetricVariant = "inline" | "card";

export function Metric({
  value,
  label,
  caption,
  variant = "inline",
}: {
  value: string;
  label: string;
  caption?: string;
  variant?: MetricVariant;
}) {
  const body = (
    <>
      <p className="font-serif text-3xl leading-none text-fg md:text-4xl">
        {value}
      </p>
      <Eyebrow variant="micro" className="mt-2">
        {label}
      </Eyebrow>
      {caption ? (
        <p className="mt-1 text-sm leading-tight text-fg-muted">{caption}</p>
      ) : null}
    </>
  );

  if (variant === "card") {
    return (
      <figure className="rounded-lg border border-border bg-bg-elevated p-6">
        {body}
      </figure>
    );
  }
  return <figure>{body}</figure>;
}

// MetricRow — a 1/3-column grid wrapper for inline metrics. The row IS a
// layout; use it when the Results section has 3 numbers to show side by
// side. For a one-off standalone metric, drop Metric on its own.
export function MetricRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
      {children}
    </div>
  );
}
