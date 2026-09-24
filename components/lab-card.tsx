import {
  LAB_KIND_LABEL,
  LAB_STAGE_LABEL,
  type LabCard as LabCardType,
} from "@/lib/lab";

function experimentCode(
  section: LabCardType["section"],
  order: number,
): string {
  const prefix = section === "efficiency" ? "EXP" : "SQ";
  return `${prefix}-${String(order).padStart(2, "0")}`;
}

function StageDot({ stage }: { stage: LabCardType["stage"] }) {
  if (!stage) return null;
  const isLive = stage === "building" || stage === "testing";
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-muted">
      <span className="relative inline-flex h-1.5 w-1.5">
        {isLive && (
          <span
            aria-hidden="true"
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden"
          />
        )}
        <span
          aria-hidden="true"
          className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent"
        />
      </span>
      {LAB_STAGE_LABEL[stage]}
    </span>
  );
}

export function LabCard({
  card,
  index,
}: {
  card: LabCardType;
  index?: number;
}) {
  const code = experimentCode(card.section, index ?? card.order ?? 0);
  const primaryUrl = card.demoUrl ?? card.url ?? card.repoUrl;
  const hasLink = Boolean(primaryUrl && primaryUrl !== "#");

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          {code}
        </span>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          {LAB_KIND_LABEL[card.kind]}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-fg">
        {card.title}
      </h3>

      <p className="mt-2 text-sm leading-[1.55] text-fg-muted line-clamp-3">
        {card.description}
      </p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="font-mono text-xs text-fg-subtle">
          {card.stack.slice(0, 3).join(" · ")}
          {card.stack.length > 3 && ` · +${card.stack.length - 3}`}
        </p>
        {card.stage ? (
          <StageDot stage={card.stage} />
        ) : hasLink ? (
          <span aria-hidden="true" className="font-mono text-xs text-fg-subtle">
            ↗
          </span>
        ) : null}
      </div>
    </>
  );

  const baseClasses =
    "block h-full rounded-xl border border-border bg-bg-elevated p-5 md:p-6 transition-all duration-150 ease-out motion-reduce:transition-none";

  if (hasLink) {
    return (
      <a
        href={primaryUrl}
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
