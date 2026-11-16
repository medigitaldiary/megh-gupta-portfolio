import { type FoldFlow, FoldLeadOut } from "@/components/fold-flow";
import { SectionHeader } from "@/components/section-header";
import { type StudyMark, WorkThumbnails } from "@/components/work-thumbnails";
import { withCoverVideos } from "@/lib/cover-video";
import { getShelfWorkCards } from "@/lib/work";

// Fold 3: proof — numbers over adjectives.
// The homepage shows 3.5 cards and steps one at a time. The rest live
// on /work, in the same thumbnail cards.

export function SelectedWorkShelf({
  mark,
  flow,
}: {
  mark?: StudyMark;
  /** Fold-flow previews: chapter number, pine tone, handoff. */
  flow?: FoldFlow;
}) {
  const cards = withCoverVideos(getShelfWorkCards(10));
  return (
    <section
      id="work"
      className={`px-6 py-24 md:px-8 md:py-32 ${
        flow?.tone === "pine" ? "tone-pine bg-bg text-fg" : ""
      }`}
    >
      {/* Fold 3: proof — numbers over adjectives */}
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <SectionHeader
            eyebrow="Selected Work"
            title="Things I've built and shipped."
            index={flow?.index}
            action={{
              href: mark ? `/work?mark=${mark}` : "/work",
              label: "View all work",
            }}
          />
        </div>
        <div data-reveal>
          <WorkThumbnails cards={cards} layout="carousel" mark={mark} />
        </div>
        {flow?.leadOut && (
          <FoldLeadOut {...flow.leadOut} className="mt-6 md:mt-8" />
        )}
      </div>
    </section>
  );
}
