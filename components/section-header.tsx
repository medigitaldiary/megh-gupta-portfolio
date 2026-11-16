import { TextLink } from "@/components/ui";

export function SectionHeader({
  eyebrow,
  title,
  action,
  index,
  className = "mb-12 md:mb-16",
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
  /** Chapter number shown before the eyebrow, e.g. "01". */
  index?: string;
  /** Replaces the bottom margin when the parent sets its own. */
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-fg-muted">
        <span data-hl-word>{index ? `${index} · ${eyebrow}` : eyebrow}</span>
      </p>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 className="max-w-3xl font-display text-3xl leading-[1.1] tracking-tight text-fg md:text-5xl">
          {title}
        </h2>
        {action ? (
          <TextLink href={action.href} className="shrink-0">
            {action.label}
          </TextLink>
        ) : null}
      </div>
    </div>
  );
}
