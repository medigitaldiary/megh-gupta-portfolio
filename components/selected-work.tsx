import { SectionHeader } from "@/components/section-header";
import { WorkCard } from "@/components/work-card";
import { getAllWorkCards } from "@/lib/work";

export function SelectedWork() {
  const cards = getAllWorkCards();
  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Selected Work"
          title="What I've shipped, with numbers."
        />
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {cards.map((card) => (
            <WorkCard key={card.slug} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
