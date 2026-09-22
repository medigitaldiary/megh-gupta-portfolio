import { LAB_KIND_LABEL, type LabCard as LabCardType } from "@/lib/lab";

export function LabCard({ card }: { card: LabCardType }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-fg">
          {card.title}
        </h3>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          {LAB_KIND_LABEL[card.kind]}
        </span>
      </div>
      <p className="mt-2 text-sm leading-[1.55] text-fg-muted line-clamp-3">
        {card.description}
      </p>
      <div className="mt-5 flex items-center justify-between">
        <p className="font-mono text-xs text-fg-subtle">
          {card.stack.slice(0, 3).join(" · ")}
          {card.stack.length > 3 && ` · +${card.stack.length - 3}`}
        </p>
        {card.url && card.url !== "#" && (
          <span aria-hidden="true" className="font-mono text-xs text-fg-subtle">
            ↗
          </span>
        )}
      </div>
    </>
  );

  const baseClasses =
    "block h-full rounded-xl border border-border bg-bg-elevated p-5 md:p-6 transition-all duration-150 ease-out motion-reduce:transition-none";

  if (card.url) {
    return (
      <a
        href={card.url}
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
