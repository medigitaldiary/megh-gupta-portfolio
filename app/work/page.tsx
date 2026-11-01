import type { Metadata } from "next";
import Link from "next/link";
import { WorkThumbnails } from "@/components/work-thumbnails";
import { withCoverVideos } from "@/lib/cover-video";
import { getAllWorkCards } from "@/lib/work";

const TITLE = "Work";
const DESCRIPTION =
  "Case studies from BondScanner, Ultra, and MoveInSync. Product, growth, and the systems behind them.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.meghgupta.in/work" },
  openGraph: {
    type: "website",
    url: "https://www.meghgupta.in/work",
    siteName: "Megh Gupta",
    locale: "en_IN",
    title: `${TITLE} | Megh Gupta`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Megh Gupta`,
    description: DESCRIPTION,
  },
};

export default function WorkIndexPage() {
  const cards = withCoverVideos(getAllWorkCards());
  return (
    <main className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
        >
          <span aria-hidden="true">←</span> Selected work
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.24em] text-fg-subtle">
          Work
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-[1.1] tracking-tight text-fg md:text-5xl">
          Things I've built and shipped.
        </h1>
        <div className="mt-12 md:mt-16">
          <WorkThumbnails cards={cards} />
        </div>
      </div>
    </main>
  );
}
