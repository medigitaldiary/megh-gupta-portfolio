import { SectionHeader } from "@/components/section-header";
import { WorkCard } from "@/components/work-card";
import { getShelfWorkCards } from "@/lib/work";

export function SelectedWork() {
  const cards = getShelfWorkCards(6);
  const row1 = cards.slice(0, 3);
  const row2 = cards.slice(3, 6);

  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Selected Work"
          title="A shelf of things I've built and shipped."
        />

        {/* Two shelves of three books each. Books carry their editorial
            cover art on the resting face; hover lifts a book off the
            shelf and surfaces the title + role as an overlay. The 3-wide
            layout is intentional — a tighter 6-wide grid at this content
            width crammed the cover art and caused neighbor-leakage from
            the lean angles. */}
        <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
          <Shelf cards={row1} />
          <Shelf cards={row2} />
        </div>
      </div>
    </section>
  );
}

function Shelf({ cards }: { cards: ReturnType<typeof getShelfWorkCards> }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {cards.map((card) => (
          <WorkCard key={card.slug} card={card} />
        ))}
      </div>
      {/* The shelf itself — hairline + soft shadow strip beneath */}
      <div aria-hidden="true" className="mt-2 h-px w-full bg-fg/70" />
      <div
        aria-hidden="true"
        className="mx-auto h-2 w-[92%] rounded-b-md bg-fg/10"
      />
    </div>
  );
}
