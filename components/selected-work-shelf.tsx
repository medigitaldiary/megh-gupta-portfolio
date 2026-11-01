import { SectionHeader } from "@/components/section-header";
import { WorkThumbnails } from "@/components/work-thumbnails";
import { withCoverVideos } from "@/lib/cover-video";
import { getShelfWorkCards } from "@/lib/work";

// Fold 3: proof — numbers over adjectives.
// The homepage shows 3.5 cards and steps one at a time. The rest live
// on /work, in the same thumbnail cards.

export function SelectedWorkShelf() {
  const cards = withCoverVideos(getShelfWorkCards(10));
  return (
    <section id="work" className="px-6 py-24 md:px-8 md:py-32">
      {/* Fold 3: proof — numbers over adjectives */}
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Selected Work"
          title="Things I've built and shipped."
          action={{ href: "/work", label: "View all" }}
        />
        <WorkThumbnails cards={cards} layout="carousel" />
      </div>
    </section>
  );
}
