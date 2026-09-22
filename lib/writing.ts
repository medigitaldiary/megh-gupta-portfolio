export type WritingKind =
  | "field-note"
  | "learning"
  | "take"
  | "idea"
  | "mini-case"
  | "teardown";

export type WritingEntry = {
  slug: string;
  title: string;
  kind: WritingKind;
  date: string;
  excerpt: string;
  readingTime?: number;
  tags?: string[];
  featured?: boolean;
  order?: number;
  published?: boolean;
};

export const WRITING_KIND_LABEL: Record<WritingKind, string> = {
  "field-note": "Field Note",
  learning: "Learning",
  take: "Take",
  idea: "Idea",
  "mini-case": "Mini Case",
  teardown: "Teardown",
};

export const writingEntries: WritingEntry[] = [
  {
    slug: "prd-as-conversation",
    title: "The PRD is a conversation, not a document",
    kind: "learning",
    date: "2026-08-30",
    excerpt:
      "Every PRD I've shipped that mattered got rewritten mid-build. The ones I locked hard never survived contact with engineers.",
    readingTime: 4,
    tags: ["PRDs", "process"],
    featured: true,
    order: 1,
    published: true,
  },
  {
    slug: "voice-ai-in-regulated-fintech",
    title: "Voice AI in regulated fintech: what we shipped, what we didn't",
    kind: "field-note",
    date: "2026-08-12",
    excerpt:
      "The RM call-quality pipeline. Sarvam STT for Hindi + Claude for scoring. Everything I'd do differently.",
    readingTime: 7,
    tags: ["AI", "fintech", "ops"],
    featured: true,
    order: 2,
    published: true,
  },
  {
    slug: "26k-programmatic-pages",
    title: "Shipping 26,000 programmatic pages without embarrassing the brand",
    kind: "mini-case",
    date: "2026-07-24",
    excerpt:
      "The compliance layer, the crawl budget fight, and the one template rule that made or broke each page.",
    readingTime: 9,
    tags: ["SEO", "growth"],
    featured: true,
    order: 3,
    published: true,
  },
  {
    slug: "against-passionate-about",
    title: "Against 'passionate about'",
    kind: "take",
    date: "2026-06-14",
    excerpt:
      "PMs who list what they care about are hedging. The ones I want to hire tell me what they built last month.",
    readingTime: 2,
    tags: ["hiring", "voice"],
    order: 4,
    published: true,
  },
];

export function getAllWriting(): WritingEntry[] {
  return writingEntries.filter((e) => e.published !== false);
}

export function getFeaturedWriting(n = 3): WritingEntry[] {
  return getAllWriting()
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const oa = a.order ?? 99;
      const ob = b.order ?? 99;
      if (oa !== ob) return oa - ob;
      return b.date.localeCompare(a.date);
    })
    .slice(0, n);
}

// Deterministic hash for procedural thumbnails.
export function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
