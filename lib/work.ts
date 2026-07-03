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

// TODO: real copy — swap in details from Megh_Gupta_PM_Case_Studies.docx once prepared.
export const workCards: WorkCard[] = [
  {
    slug: "seo-engine",
    title: "Growing organic traffic at BondScanner",
    tags: ["Growth", "SEO", "Fintech"],
    headlineMetric: "2x",
    headlineMetricLabel: "organic traffic — placeholder",
    description:
      "Built a programmatic SEO engine spanning thousands of bond pages and shipped compliance-safe content at scale. Placeholder description — replace with real case study copy.",
    role: "Growth PM",
    timeline: "2026",
    externalUrl: "#",
    status: "live",
  },
  {
    slug: "ai-call-analysis",
    title: "AI call analysis pipeline for support ops",
    tags: ["AI Tooling", "Ops", "Fintech"],
    headlineMetric: "10x",
    headlineMetricLabel: "faster call review — placeholder",
    description:
      "Designed and shipped an AI pipeline that transcribes and scores customer calls automatically, cutting manual QA time. Placeholder description — replace with real case study copy.",
    role: "PM",
    timeline: "2026",
    externalUrl: "#",
    status: "live",
  },
  {
    slug: "ultra-reinvestment",
    title: "Reinvestment growth loop at Ultra",
    tags: ["Growth", "Fintech", "Platform"],
    headlineMetric: "1.5x",
    headlineMetricLabel: "reinvestment rate — placeholder",
    description:
      "Owned the reinvestment funnel end to end, from trigger design to in-app nudges. Placeholder description — replace with real case study copy.",
    role: "Platform PM",
    timeline: "2025",
    externalUrl: "#",
    status: "live",
  },
  {
    slug: "bondscanner-launch",
    title: "Founding PM: BondScanner 0→1",
    tags: ["0→1", "Fintech", "Founding PM"],
    headlineMetric: "0→1",
    headlineMetricLabel: "launched the product — placeholder",
    description:
      "Founding PM on BondScanner — scoped the initial product and shipped v1 with a small team. Placeholder description — replace with real case study copy.",
    role: "Founding PM",
    timeline: "2025 – present",
    externalUrl: "#",
    status: "live",
  },
];

export function getAllWorkCards(): WorkCard[] {
  return workCards;
}
