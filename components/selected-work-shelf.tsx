import { SectionHeader } from "@/components/section-header";
import { type ShelfBook, WorkShelf } from "@/components/work-shelf";
import { getCaseStudy } from "@/lib/case-study";
import { getShelfWorkCards } from "@/lib/work";

// Server component — pulls the shelf cards from lib/work and enriches
// each one with headline + supporting metrics parsed from the matching
// MDX frontmatter under /content/work. The interactive bookshelf below
// stays a client component.
export async function SelectedWorkShelf() {
  // Allow up to 10 books so adding a 7th / 8th case study doesn't need
  // a layout tweak.
  const cards = getShelfWorkCards(10);
  const books: ShelfBook[] = await Promise.all(
    cards.map(async (card) => {
      const study = await getCaseStudy(card.slug);
      return {
        ...card,
        headlineMetric: study?.frontmatter.headline_metric,
        supportingMetrics: study?.frontmatter.supporting_metrics ?? [],
        tags: study?.frontmatter.tags ?? [],
      };
    }),
  );
  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Selected Work"
          title="A shelf of things I've built and shipped."
        />
        <WorkShelf books={books} />
      </div>
    </section>
  );
}
