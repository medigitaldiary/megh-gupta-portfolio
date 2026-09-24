export type WorkStatus = "live" | "coming-soon";

export type WorkCard = {
  slug: string;
  title: string;
  eyebrow: string;
  oneLiner: string;
  role: string;
  company: string;
  timeline: string;
  // Tailwind bg class for the book spine; picked from the accent family.
  spineColor: string;
  status: WorkStatus;
  featured?: boolean;
  order?: number;
};

// Five case studies Megh is writing — the 4 highest-order ones surface on the
// homepage shelf; the fifth lives at /work/[slug] but is not on the fold yet.
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
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
    status: "coming-soon",
    order: 5,
  },
];

export function getAllWorkCards(): WorkCard[] {
  return [...workCards].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getShelfWorkCards(n = 4): WorkCard[] {
  return getAllWorkCards()
    .filter((c) => c.featured)
    .slice(0, n);
}

export function getWorkCardBySlug(slug: string): WorkCard | undefined {
  return workCards.find((c) => c.slug === slug);
}
