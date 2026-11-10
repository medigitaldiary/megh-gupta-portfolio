import { ButtonLink } from "@/components/ui";

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-fg-muted">
        <span data-hl-word>{eyebrow}</span>
      </p>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 className="max-w-3xl font-display text-3xl leading-[1.1] tracking-tight text-fg md:text-5xl">
          {title}
        </h2>
        {action ? (
          <ButtonLink
            href={action.href}
            variant="outline"
            size="sm"
            mono
            className="shrink-0 tracking-[0.16em]"
          >
            {action.label}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}
