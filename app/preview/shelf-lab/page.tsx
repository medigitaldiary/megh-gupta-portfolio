import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { type ShelfBook, WorkShelfLab } from "@/components/work-shelf-lab";
import { getCaseStudy } from "@/lib/case-study";
import { getShelfWorkCards } from "@/lib/work";

export const metadata: Metadata = {
  title: "Shelf lab — Megh Gupta",
  robots: { index: false, follow: false },
};

export default async function ShelfLabPage() {
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
    <main className="min-h-screen bg-bg">
      <section className="px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Shelf lab"
            title="A shelf of things I've built and shipped."
          />
          <WorkShelfLab books={books} />
        </div>
      </section>
    </main>
  );
}
