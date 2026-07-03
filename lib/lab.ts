export type LabCard = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  externalUrl?: string;
};

// TODO: real copy — one-line descriptions and links to be filled in later.
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
      "An Investopedia-style glossary hub for BondScanner, built to rank and to teach retail investors bond terms.",
    stack: ["next.js", "programmatic-seo"],
    externalUrl: "#",
  },
  {
    slug: "compliance-content-tool",
    title: "Compliance Content Reviewer",
    description:
      "An AI tool that flags non-compliant language in marketing copy before it ships.",
    stack: ["claude-api", "python"],
  },
  {
    slug: "call-analysis-pipeline",
    title: "Call Analysis Pipeline",
    description:
      "Sarvam + Claude pipeline that transcribes and scores support calls automatically.",
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
      "MCP-driven lifecycle ops — campaign QA and segment checks without leaving the terminal.",
    stack: ["mcp", "moengage"],
  },
];

export function getAllLabCards(): LabCard[] {
  return labCards;
}
