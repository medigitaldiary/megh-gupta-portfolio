export type LabCard = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  externalUrl?: string;
};

// TODO: real copy — job-search-os and interview-prep-system are still placeholder
// (personal projects not covered by Megh_Gupta_PM_Case_Studies.docx).
export const labCards: LabCard[] = [
  {
    slug: "job-search-os",
    title: "Job Search OS",
    description:
      "A Claude Code + Supabase tracker for the whole job search — pipeline, notes, and follow-ups in one place.",
    stack: ["claude-code", "supabase", "next.js"],
    externalUrl: "#",
  },
  {
    slug: "bond-dictionary",
    title: "Bond Dictionary",
    description:
      "An Investopedia-style glossary hub for BondScanner — 200+ terms, each anchored to a high-intent keyword, built to rank and to teach retail investors bond terms.",
    stack: ["next.js", "programmatic-seo"],
    externalUrl: "#",
  },
  {
    slug: "compliance-content-tool",
    title: "Compliance Content Reviewer",
    description:
      "A no-code AI tool (Claude API) that checks draft content against SEBI/NSE/BSE guidelines, flags risky claims, and suggests compliant rewrites — powers the 350+ blog SEO engine.",
    stack: ["claude-api"],
  },
  {
    slug: "call-analysis-pipeline",
    title: "Call Analysis Pipeline",
    description:
      "Sarvam speech-to-text + Claude scoring pipeline that grades BondScanner RM call quality and auto-extracts action items into Radar.",
    stack: ["sarvam", "claude-api"],
  },
  {
    slug: "interview-prep-system",
    title: "Interview Prep System",
    description:
      "A structured Notion + Claude workflow for prepping PM interviews end to end.",
    stack: ["notion", "claude-api"],
    externalUrl: "#",
  },
  {
    slug: "moengage-mcp-workflows",
    title: "MoEngage MCP Workflows",
    description:
      "MCP-driven MoEngage workflows for AI-assisted campaign reporting, lifecycle execution, and cross-channel orchestration.",
    stack: ["mcp", "moengage"],
  },
];

export function getAllLabCards(): LabCard[] {
  return labCards;
}
