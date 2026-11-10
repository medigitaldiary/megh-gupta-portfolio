// Data for the bento board (/preview/bento). Everything that already has
// a home (work cards, lab cards, experience, About prints) is read from
// that home; this file only holds what is new to the board.

export type BentoLens = "user" | "tech" | "business";

export const BENTO_LENSES: { id: BentoLens; label: string }[] = [
  { id: "user", label: "User" },
  { id: "tech", label: "Tech" },
  { id: "business", label: "Business" },
];

// Which lens each tile answers to. Draft mapping: please review.
export const BENTO_TILE_LENSES: Record<string, BentoLens[]> = {
  "product-led-seo-engine": ["tech", "business"],
  "ultra-web-platform": ["user", "tech"],
  "bond-bytes": ["user", "business"],
  workbench: ["tech"],
  numbers: ["business"],
};

// The three case studies on the board, with the short form of each
// headline metric. Long forms stay in the MDX frontmatter.
export const BENTO_WORK: {
  slug: string;
  value: string;
  label: string;
}[] = [
  {
    slug: "product-led-seo-engine",
    value: "~2x",
    label: "daily organic clicks in 3 months",
  },
  {
    slug: "ultra-web-platform",
    value: "15–20%",
    label: "True AUM growth from web, Q3 2025",
  },
  {
    slug: "bond-bytes",
    value: "3.5x",
    label: "reach growth, Feb to May 2026",
  },
];

// Numbers tile. Each figure already appears in a case study or in
// lib/experience.ts.
export const BENTO_NUMBERS: { value: string; label: string }[] = [
  { value: "~2x", label: "organic clicks in 3 months" },
  { value: "80%", label: "of deal fields auto-filled" },
  { value: "40%", label: "less manual support effort" },
  { value: "~₹50Cr", label: "AUM added in 3 months" },
  { value: "3.5x", label: "Bond Bytes reach growth" },
];

export type RouteStopId = "lko" | "goi" | "blr";

export const ROUTE_STOPS: {
  id: RouteStopId;
  code: string;
  city: string;
  chip: string;
}[] = [
  { id: "lko", code: "LKO", city: "Lucknow", chip: "Home" },
  { id: "goi", code: "GOI", city: "Goa", chip: "BITS Goa · 2025" },
  { id: "blr", code: "BLR", city: "Bengaluru", chip: "Work · now" },
];

// Print ids from lib/about-vox.ts, in stack order.
export const BENTO_PRINT_IDS = ["bike", "hyrox", "guitar", "camera", "horse"];

export const BENTO_EMAIL = "megh.bpgc@gmail.com";
export const BENTO_LINKEDIN = "https://www.linkedin.com/in/meghxgupta";
export const BENTO_CAL = "https://cal.com/megh-gupta/15min";
