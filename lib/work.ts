export type WorkStatus = "live" | "coming-soon";

export type WorkCard = {
  slug: string;
  title: string;
  eyebrow: string;
  oneLiner: string;
  role: string;
  company: string;
  timeline: string;
  // Tailwind bg class for the book spine (used by work-card / work-shelf).
  spineColor: string;
  // Hex form of the spine color used by the 3D hardcover faces on the
  // bookshelf lab (spine, back cover, hinge crease). Picked per project
  // brand so each book reads as its own cover.
  spineHex: string;
  // Resting lean angle in degrees; pivots on the book's bottom edge.
  // Alternating signs create the "propped against each other" shelf feel.
  leanDeg?: number;
  // Path to the editorial cover art for the shelf. 2:3 portrait webp.
  coverImage?: string;
  status: WorkStatus;
  featured?: boolean;
  order?: number;
};

// Five case studies Megh is writing. All five surface on the shelf as leaning
// books; each straightens up and opens its cover on hover.
export const workCards: WorkCard[] = [
  {
    slug: "product-led-seo-engine",
    title: "Product-led SEO Engine",
    eyebrow: "Growth · SEO",
    oneLiner:
      "How programmatic SEO ~2x'd BondScanner's organic clicks in three months.",
    role: "Growth PM",
    company: "BondScanner",
    timeline: "2026",
    spineColor: "bg-accent",
    spineHex: "#1F4D3A",
    coverImage: "/images/work/product-led-seo-engine/cover.webp",
    leanDeg: -4,
    status: "live",
    featured: true,
    order: 1,
  },
  {
    slug: "ultra-web-platform",
    title: "Ultra Web Platform",
    eyebrow: "Platform · 0→1",
    oneLiner:
      "Shipping Ultra's web app across investment, wallet, dashboard, and KYC.",
    role: "Platform PM",
    company: "Ultra",
    timeline: "2025",
    spineColor: "bg-fg",
    spineHex: "#1E3A8A",
    coverImage: "/images/work/ultra-web-platform/cover.webp",
    leanDeg: 3,
    status: "live",
    featured: true,
    order: 2,
  },
  {
    slug: "bond-bytes",
    title: "Bond Bytes",
    eyebrow: "Content · Retention",
    oneLiner:
      "A daily bite of India's bond market — the retention lever we built into BondScanner.",
    role: "Growth PM",
    company: "BondScanner",
    timeline: "2026",
    spineColor: "bg-[#8B5E3C]",
    spineHex: "#C2410C",
    coverImage: "/images/work/bond-bytes/cover.webp",
    leanDeg: -2,
    status: "live",
    featured: true,
    order: 3,
  },
  {
    slug: "deridata-integration",
    title: "DERIDATA Integration",
    eyebrow: "Data · Integrations",
    oneLiner:
      "Wiring DERIDATA into BondScanner so pricing, yield, and risk stay one source of truth.",
    role: "Product Manager",
    company: "BondScanner",
    timeline: "2026",
    spineColor: "bg-[#4A5D5A]",
    spineHex: "#0F4C3A",
    coverImage: "/images/work/deridata-integration/cover.webp",
    leanDeg: 4,
    status: "live",
    featured: true,
    order: 4,
  },
  {
    slug: "freshdesk-support-stack",
    title: "Freshdesk · Support Stack",
    eyebrow: "Ops · Support",
    oneLiner:
      "Building the inbound support stack — Freshdesk + workflows + SLAs — from zero.",
    role: "Founding PM",
    company: "BondScanner",
    timeline: "2025",
    spineColor: "bg-[#6B4E71]",
    spineHex: "#701A2F",
    coverImage: "/images/work/freshdesk-support-stack/cover.webp",
    leanDeg: -3,
    status: "live",
    featured: true,
    order: 5,
  },
  // Promoted Oct 2026 after the full narrative landed — a traffic-analysis
  // + founder-brand LinkedIn play, not a pricing campaign as initially
  // scaffolded. Full story in content/work/moveinsync-independence-day.mdx.
  {
    slug: "moveinsync-independence-day",
    title: "MoveInSync Independence Day",
    eyebrow: "Analytics · Content",
    oneLiner:
      "An Independence Day traffic analysis across 5 Indian metros that fed a founder-brand LinkedIn post.",
    role: "Product Intern",
    company: "MoveInSync",
    timeline: "Aug 2024",
    spineColor: "bg-[#A66B2A]",
    spineHex: "#D97706",
    coverImage: "/images/work/moveinsync-independence-day/cover.webp",
    leanDeg: 2,
    status: "live",
    featured: true,
    order: 6,
  },
];

export function getAllWorkCards(): WorkCard[] {
  return [...workCards].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getShelfWorkCards(n = 5): WorkCard[] {
  return getAllWorkCards()
    .filter((c) => c.featured)
    .slice(0, n);
}

export function getWorkCardBySlug(slug: string): WorkCard | undefined {
  return workCards.find((c) => c.slug === slug);
}
