import Link from "next/link";

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
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-fg px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-fg transition-colors duration-150 hover:bg-fg hover:text-accent-fg"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
