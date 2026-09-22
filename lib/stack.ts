export type StackTool = {
  slug: string;
  name: string;
  icon: string;
  oneLiner: string;
  featured?: boolean;
  order?: number;
};

export const stackTools: StackTool[] = [
  {
    slug: "figma",
    name: "figma",
    icon: "figma",
    oneLiner: "wireframes, hi-fi flows, and the odd hand-off illustration.",
    featured: true,
    order: 1,
  },
  {
    slug: "claude-code",
    name: "claude code",
    icon: "claude",
    oneLiner:
      "my second engineer — ships internal tools while the team ships product.",
    featured: true,
    order: 2,
  },
  {
    slug: "cursor",
    name: "cursor",
    icon: "cursor",
    oneLiner:
      "quick spikes, one-off scripts, and reading unfamiliar codebases.",
    featured: true,
    order: 3,
  },
  {
    slug: "notion",
    name: "notion",
    icon: "notion",
    oneLiner:
      "prds, weekly reviews, and the messy back-of-house of every launch.",
    featured: true,
    order: 4,
  },
  {
    slug: "linear",
    name: "linear",
    icon: "linear",
    oneLiner:
      "sprint plans and the single source of truth for what's actually shipping.",
    featured: true,
    order: 5,
  },
  {
    slug: "mixpanel",
    name: "mixpanel",
    icon: "mixpanel",
    oneLiner: "funnel + retention analytics on the growth loops.",
    featured: true,
    order: 6,
  },
  {
    slug: "moengage",
    name: "moengage",
    icon: "moengage",
    oneLiner: "lifecycle automations across push, whatsapp, email, and in-app.",
    featured: true,
    order: 7,
  },
  {
    slug: "supabase",
    name: "supabase",
    icon: "supabase",
    oneLiner: "backing store for the personal tools i vibe-code on weekends.",
    featured: true,
    order: 8,
  },
  {
    slug: "vercel",
    name: "vercel",
    icon: "vercel",
    oneLiner: "hosting for this site and every side project.",
    featured: false,
    order: 9,
  },
  {
    slug: "postman",
    name: "postman",
    icon: "postman",
    oneLiner:
      "poking apis and sanity-checking backend before writing a ticket.",
    featured: false,
    order: 10,
  },
];

export function getFeaturedStack(): StackTool[] {
  return stackTools
    .filter((t) => t.featured !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getExtraStack(): StackTool[] {
  return stackTools
    .filter((t) => t.featured === false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
