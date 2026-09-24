import { SectionHeader } from "@/components/section-header";
import { WorkCard } from "@/components/work-card";
import { getShelfWorkCards } from "@/lib/work";

export function SelectedWork() {
  const cards = getShelfWorkCards(4);
  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Selected Work"
          title="A shelf of things I've built and shipped."
        />
        {/* Book shelf — portrait book cards. Hover opens the cover. */}
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {cards.map((card) => (
            <WorkCard key={card.slug} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
