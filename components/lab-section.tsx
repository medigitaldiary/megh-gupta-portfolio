import { LabCard } from "@/components/lab-card";
import { SectionHeader } from "@/components/section-header";
import { getFeaturedLabCards } from "@/lib/lab";

export function LabSection() {
  const cards = getFeaturedLabCards(6);
  return (
    <section
      id="lab"
      className="px-6 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="The Lab"
          title="Things I built when a tool didn't exist or moved too slow."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <LabCard key={card.slug} card={card} />
          ))}
        </div>
        <div className="mt-10">
          <a
            href="#lab"
            aria-disabled="true"
            className="inline-flex items-center gap-2 text-sm text-fg-muted underline underline-offset-4 opacity-60"
          >
            all builds → <span className="font-mono text-xs">(soon)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
