import type { WorkCard as WorkCardType } from "@/lib/work";

export function WorkCard({ card }: { card: WorkCardType }) {
  const isClickable = card.status === "live" && Boolean(card.externalUrl);

  const content = (
    <>
      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-fg-subtle"
          >
            {tag}
          </span>
        ))}
        {!isClickable && (
          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-fg-subtle">
            Soon
          </span>
        )}
      </div>

      <h3 className="mt-4 font-serif text-2xl leading-tight text-fg line-clamp-2">
        {card.title}
      </h3>

      <div className="mt-4">
        <span className="font-serif text-3xl text-accent">
          {card.headlineMetric}
        </span>
        <span className="ml-2 text-sm text-fg-muted">
          {card.headlineMetricLabel}
        </span>
      </div>

      <p className="mt-4 text-base text-fg-muted line-clamp-4">
        {card.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm text-fg-subtle">
        <span>
          {card.role} · {card.timeline}
        </span>
        {isClickable && (
          <span aria-hidden="true" className="font-mono">
            ↗
          </span>
        )}
      </div>
    </>
  );

  const baseClasses =
    "block rounded-xl border border-border bg-bg-elevated p-6 md:p-8 transition-all duration-150 ease-out motion-reduce:transition-none";

  if (isClickable) {
    return (
      <a
        href={card.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} hover:-translate-y-0.5 hover:border-accent motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
      >
        {content}
      </a>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
