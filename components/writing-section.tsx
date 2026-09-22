import { SectionHeader } from "@/components/section-header";
import { WritingThumbnail } from "@/components/writing/thumbnail";
import {
  getFeaturedWriting,
  WRITING_KIND_LABEL,
  type WritingEntry,
} from "@/lib/writing";

export function WritingSection() {
  const entries = getFeaturedWriting(3);
  if (entries.length === 0) return null;

  return (
    <section id="writing" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Writing"
          title="Notes on product and building."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {entries.map((e) => (
            <WritingCard key={e.slug} entry={e} />
          ))}
        </div>
        <div className="mt-10">
          <a
            href="#writing"
            aria-disabled="true"
            className="inline-flex items-center gap-2 text-sm text-fg-muted underline underline-offset-4 opacity-60"
          >
            view all → <span className="font-mono text-xs">(soon)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function WritingCard({ entry }: { entry: WritingEntry }) {
  const dateLabel = new Date(entry.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <a
      href={`#writing`}
      aria-disabled="true"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="aspect-[3/2] w-full">
        <WritingThumbnail kind={entry.kind} slug={entry.slug} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          <span className="rounded-full border border-border px-2 py-0.5">
            {WRITING_KIND_LABEL[entry.kind]}
          </span>
          <span>·</span>
          <span>{dateLabel}</span>
          {entry.readingTime && (
            <>
              <span>·</span>
              <span>{entry.readingTime} min</span>
            </>
          )}
        </div>
        <h3 className="font-serif text-xl leading-[1.2] text-fg line-clamp-2 group-hover:text-accent">
          {entry.title}
        </h3>
        <p className="mt-3 text-sm leading-[1.55] text-fg-muted line-clamp-3">
          {entry.excerpt}
        </p>
      </div>
    </a>
  );
}
