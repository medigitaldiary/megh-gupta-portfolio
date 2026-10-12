import { SectionHeader } from "@/components/section-header";
import { WorkCard } from "@/components/work-card";
import { getShelfWorkCards } from "@/lib/work";

export function SelectedWork() {
  const cards = getShelfWorkCards(6);
  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Selected Work"
          title="A shelf of things I've built and shipped."
        />

        {/* Book shelf — 6 leaning books, straighten + open cover on hover.
            Cards get a smaller gap on desktop so their leans can overlap.
            On tablet we fall to 3 across so the row doesn't awkwardly orphan
            one book; on phone it's a stacked single column. */}
        <div className="relative pt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-6 lg:gap-2">
            {cards.map((card) => (
              <WorkCard key={card.slug} card={card} />
            ))}
          </div>

          {/* The shelf itself */}
          <div aria-hidden="true" className="mt-2 h-px w-full bg-fg/80" />
          <div
            aria-hidden="true"
            className="mx-auto h-2 w-[92%] rounded-b-md bg-fg/10"
          />
        </div>
      </div>
    </section>
  );
}
