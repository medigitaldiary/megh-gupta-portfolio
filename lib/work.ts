export type WorkCard = {
  slug: string;
  title: string;
  tags: string[];
  headlineMetric: string;
  headlineMetricLabel: string;
  description: string;
  role: string;
  timeline: string;
  externalUrl?: string;
  status: "live" | "soon";
};

// TODO: real link — copy is real (from Megh_Gupta_PM_Case_Studies.docx), but the
// docx itself only has "[Insert link]" placeholders for every artifact, so
// externalUrl stays "#" until real decks/PRDs/dashboards are ready to link.
export const workCards: WorkCard[] = [
  {
    slug: "seo-engine",
    title: "How I 2x'd organic traffic at BondScanner in 3 months",
    tags: ["Growth", "SEO", "Fintech"],
    headlineMetric: "2x",
    headlineMetricLabel: "daily organic clicks in 3 months",
    description:
      'Built and ran BondScanner\'s product-led SEO engine — 350+ compliance-safe blogs, a 200+ term Bond Dictionary, and 26,000+ programmatic bond pages. Ranked #3 for "hedge funds in india" and captured ISIN-level search intent.',
    role: "Growth PM",
    timeline: "Jan 2026 – Q2 2026",
    externalUrl: "#",
    status: "live",
  },
  {
    slug: "ai-call-analysis",
    title: "AI call analysis pipeline for BondScanner's RM team",
    tags: ["AI Tooling", "Ops", "Fintech"],
    headlineMetric: "5.2 → 6.0",
    headlineMetricLabel: "call quality score in 30 days",
    description:
      "Vibe-coded an end-to-end pipeline — Sarvam speech-to-text plus Claude scoring — to grade 8 hours of daily RM call recordings and auto-extract action items into Radar as tasks.",
    role: "PM",
    timeline: "Mar 2026 – present",
    externalUrl: "#",
    status: "live",
  },
  {
    slug: "ultra-reinvestment",
    title: "Lifting payout-to-reinvestment from 55% to 70% at Ultra",
    tags: ["Growth", "Fintech", "Platform"],
    headlineMetric: "+15pp",
    headlineMetricLabel: "retention lift in 30 days",
    description:
      "Audited every screen across Ultra's investment flows, fixed hygiene gaps, then shipped lifecycle automations across push, email, and WhatsApp for users sitting on un-reinvested payouts.",
    role: "Platform PM",
    timeline: "Jun 2025 – Jul 2025",
    externalUrl: "#",
    status: "live",
  },
  {
    slug: "bondscanner-launch",
    title: "Founding PM: BondScanner 0→1",
    tags: ["0→1", "Fintech", "Founding PM"],
    headlineMetric: "2 months",
    headlineMetricLabel: "regulated platform, sign-up to launch",
    description:
      "Founding PM on BondScanner's 0→1 build — owned the sign-up and onboarding funnel and the inbound support system, ran competitive benchmarking, and shipped the MVP across web and mobile to a hard regulatory deadline.",
    role: "Founding PM",
    timeline: "Nov 2025 – present",
    externalUrl: "#",
    status: "live",
  },
];

export function getAllWorkCards(): WorkCard[] {
  return workCards;
}
