import fs from "node:fs";
import path from "node:path";
import type { WorkCard } from "@/lib/work";

// A clip dropped at public/videos/work/[slug].mp4 (or .gif) becomes the
// moving cover. coverVideo on the card overrides that path.

export function withCoverVideos(cards: WorkCard[]): WorkCard[] {
  return cards.map((card) => ({
    ...card,
    coverVideo: resolveCoverVideo(card),
  }));
}

function resolveCoverVideo(card: WorkCard): string | undefined {
  if (card.coverVideo) return card.coverVideo;
  const dir = path.join(process.cwd(), "public", "videos", "work");
  if (fs.existsSync(path.join(dir, `${card.slug}.mp4`))) {
    return `/videos/work/${card.slug}.mp4`;
  }
  if (fs.existsSync(path.join(dir, `${card.slug}.gif`))) {
    return `/videos/work/${card.slug}.gif`;
  }
  return undefined;
}
