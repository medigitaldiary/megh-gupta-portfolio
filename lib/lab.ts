export type LabKind = "skill-file" | "personal-tool" | "github-project";

export type LabCard = {
  slug: string;
  title: string;
  kind: LabKind;
  description: string;
  stack: string[];
  url?: string;
  featured?: boolean;
  order?: number;
  published?: boolean;
};

export const LAB_KIND_LABEL: Record<LabKind, string> = {
  "skill-file": "Skill File",
  "personal-tool": "Personal Tool",
  "github-project": "GitHub",
};

export const labCards: LabCard[] = [
  {
    slug: "job-search-os",
    title: "Job Search OS",
    kind: "personal-tool",
    description:
      "Claude Code + Supabase tracker for the whole job search — pipeline, notes, follow-ups in one place.",
    stack: ["claude-code", "supabase", "next.js"],
    url: "#",
    featured: true,
    order: 1,
    published: true,
  },
  {
    slug: "bond-dictionary",
    title: "Bond Dictionary",
    kind: "personal-tool",
    description:
      "Investopedia-style glossary hub for BondScanner — 200+ terms, each anchored to a high-intent keyword.",
    stack: ["next.js", "programmatic-seo"],
    url: "#",
    featured: true,
    order: 2,
    published: true,
  },
  {
    slug: "compliance-content-tool",
    title: "Compliance Content Reviewer",
    kind: "skill-file",
    description:
      "Claude skill file that checks draft copy against SEBI/NSE/BSE, flags risky claims, suggests compliant rewrites.",
    stack: ["claude-api"],
    url: "#",
    featured: true,
    order: 3,
    published: true,
  },
  {
    slug: "call-analysis-pipeline",
    title: "Call Analysis Pipeline",
    kind: "personal-tool",
    description:
      "Sarvam speech-to-text + Claude scoring pipeline that grades RM calls and auto-extracts action items into Radar.",
    stack: ["sarvam", "claude-api"],
    url: "#",
    featured: true,
    order: 4,
    published: true,
  },
  {
    slug: "interview-prep-system",
    title: "Interview Prep System",
    kind: "skill-file",
    description:
      "Structured Notion + Claude skill workflow for prepping PM interviews end to end.",
    stack: ["notion", "claude-api"],
    url: "#",
    featured: true,
    order: 5,
    published: true,
  },
  {
    slug: "moengage-mcp-workflows",
    title: "MoEngage MCP Workflows",
    kind: "skill-file",
    description:
      "MCP-driven MoEngage workflows for AI-assisted campaign reporting, lifecycle execution, cross-channel orchestration.",
    stack: ["mcp", "moengage"],
    url: "#",
    featured: true,
    order: 6,
    published: true,
  },
];

export function getAllLabCards(): LabCard[] {
  return labCards.filter((c) => c.published !== false);
}

export function getFeaturedLabCards(n = 6): LabCard[] {
  return getAllLabCards()
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .slice(0, n);
}
