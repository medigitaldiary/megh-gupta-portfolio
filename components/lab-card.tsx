import type { LabCard as LabCardType } from "@/lib/lab";

export function LabCard({ card }: { card: LabCardType }) {
  const content = (
    <>
      <h3 className="text-lg font-semibold text-fg">{card.title}</h3>
      <p className="mt-2 text-sm text-fg-muted">{card.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-xs text-fg-subtle">
          {card.stack.join(" · ")}
        </p>
        {card.externalUrl && (
          <span aria-hidden="true" className="font-mono text-xs text-fg-subtle">
            ↗
          </span>
        )}
      </div>
    </>
  );

  const baseClasses =
    "block rounded-lg border border-dashed border-border p-5 transition-colors duration-150 ease-out motion-reduce:transition-none";

  if (card.externalUrl) {
    return (
      <a
        href={card.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} hover:border-solid hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
      >
        {content}
      </a>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
