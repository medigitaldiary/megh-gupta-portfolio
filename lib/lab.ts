export type LabKind = "skill-file" | "personal-tool" | "github-project";
export type LabSection = "efficiency" | "side-quest";
export type LabStage = "v1" | "building" | "testing" | "shipped";

export type LabCard = {
  slug: string;
  title: string;
  kind: LabKind;
  section: LabSection;
  description: string;
  stack: string[];
  // Legacy single link — kept for back-compat; new entries prefer repoUrl/demoUrl.
  url?: string;
  repoUrl?: string;
  demoUrl?: string;
  stage?: LabStage;
  featured?: boolean;
  order?: number;
  published?: boolean;
};

export const LAB_KIND_LABEL: Record<LabKind, string> = {
  "skill-file": "Skill File",
  "personal-tool": "Personal Tool",
  "github-project": "GitHub",
};

export const LAB_STAGE_LABEL: Record<LabStage, string> = {
  v1: "v1 · shipped",
  building: "still building",
  testing: "in testing",
  shipped: "shipped",
};

export const labCards: LabCard[] = [
  // ── Efficiency Tools ─────────────────────────────────────────
  {
    slug: "job-search-os",
    title: "Job Search OS",
    kind: "personal-tool",
    section: "efficiency",
    description:
      "Claude Code + Supabase tracker for the whole job search — pipeline, notes, follow-ups in one place.",
    stack: ["claude-code", "supabase", "next.js"],
    featured: true,
    order: 1,
    published: true,
  },
  {
    slug: "bond-dictionary",
    title: "Bond Dictionary",
    kind: "personal-tool",
    section: "efficiency",
    description:
      "Investopedia-style glossary hub for BondScanner — 200+ terms, each anchored to a high-intent keyword.",
    stack: ["next.js", "programmatic-seo"],
    featured: true,
    order: 2,
    published: true,
  },
  {
    slug: "compliance-content-tool",
    title: "Compliance Content Reviewer",
    kind: "skill-file",
    section: "efficiency",
    description:
      "Claude skill file that checks draft copy against SEBI/NSE/BSE, flags risky claims, suggests compliant rewrites.",
    stack: ["claude-api"],
    featured: true,
    order: 3,
    published: true,
  },
  {
    slug: "call-analysis-pipeline",
    title: "Call Analysis Pipeline",
    kind: "personal-tool",
    section: "efficiency",
    description:
      "Sarvam speech-to-text + Claude scoring pipeline that grades RM calls and auto-extracts action items into Radar.",
    stack: ["sarvam", "claude-api"],
    featured: true,
    order: 4,
    published: true,
  },
  {
    slug: "interview-prep-system",
    title: "Interview Prep System",
    kind: "skill-file",
    section: "efficiency",
    description:
      "Structured Notion + Claude skill workflow for prepping PM interviews end to end.",
    stack: ["notion", "claude-api"],
    featured: true,
    order: 5,
    published: true,
  },
  {
    slug: "moengage-mcp-workflows",
    title: "MoEngage MCP Workflows",
    kind: "skill-file",
    section: "efficiency",
    description:
      "MCP-driven MoEngage workflows for AI-assisted campaign reporting, lifecycle execution, cross-channel orchestration.",
    stack: ["mcp", "moengage"],
    featured: true,
    order: 6,
    published: true,
  },

  // ── Side Quest ──────────────────────────────────────────────
  {
    slug: "ai-tool-scout",
    title: "AI Tool Scout",
    kind: "github-project",
    section: "side-quest",
    description:
      "Find and compare AI tools by use case, role, or industry — with real user experiences layered on top.",
    stack: ["next.js", "claude-api"],
    stage: "building",
    featured: true,
    order: 1,
    published: true,
  },
  {
    slug: "promptcraft",
    title: "PromptCraft",
    kind: "github-project",
    section: "side-quest",
    description:
      "Generates tailored prompts for LLMs like GPT and Claude based on your role, task, and desired output.",
    stack: ["next.js", "openai", "claude-api"],
    stage: "v1",
    featured: true,
    order: 2,
    published: true,
  },
  {
    slug: "sitegraph",
    title: "SiteGraph",
    kind: "github-project",
    section: "side-quest",
    description:
      "Crawls a website and renders a visual map of its pages and internal links — an SEO x-ray in one view.",
    stack: ["next.js", "d3"],
    stage: "testing",
    featured: true,
    order: 3,
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

export function getEfficiencyLabCards(): LabCard[] {
  return getAllLabCards()
    .filter((c) => c.section === "efficiency")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getSideQuestLabCards(): LabCard[] {
  return getAllLabCards()
    .filter((c) => c.section === "side-quest")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
