export type ExperienceEntry = {
  slug: string;
  company: string;
  role: string;
  logo?: string;
  start: string;
  end: string | "present";
  tagline: string;
  bullets: string[];
  current?: boolean;
  nda?: boolean;
  order?: number;
};

export const experienceEntries: ExperienceEntry[] = [
  {
    slug: "bondscanner",
    company: "bondscanner",
    role: "product manager",
    logo: "/images/logos/bondscanner.jpg",
    start: "2025-11",
    end: "present",
    current: true,
    tagline:
      "sebi-registered online bond platform making bond investing simple for retail investors.",
    bullets: [
      "built bondscanner 0→1 as founding pm — web + mobile onboarding live in 2 months.",
      "shipped a product-led seo engine: 350+ blogs, 200+ dictionary terms, 26,000+ programmatic pages → ~2× daily organic clicks in 3 months.",
      "built an ai call-analysis pipeline (sarvam stt + claude) → team call-quality 5.2 → 6.0 in 30 days.",
    ],
  },
  {
    slug: "ultra",
    company: "ultra (tap invest)",
    role: "platform product manager",
    start: "2025-03",
    end: "2025-10",
    tagline:
      "alternative-investment app across invoice discounting, fds, and market-linked products.",
    bullets: [
      "drove lifecycle automations across push, whatsapp, email, and in-app → +15pp retention in 30 days.",
      "launched flexi invoice discounting → ~₹50cr additional aum in 3 months.",
    ],
  },
  {
    slug: "moveinsync",
    company: "moveinsync",
    role: "product intern",
    start: "2023-05",
    end: "2023-07",
    tagline:
      "mobility saas moving 300k+ employees across 200+ enterprises daily.",
    bullets: [
      "TODO: replace with real bullets from résumé — kept as placeholder so the fold renders honestly.",
    ],
  },
];

export function getAllExperience(): ExperienceEntry[] {
  return [...experienceEntries].sort((a, b) => {
    const order = (e: ExperienceEntry) =>
      e.end === "present" ? "9999-99" : e.end;
    return order(b).localeCompare(order(a));
  });
}

export function formatDateRange(entry: ExperienceEntry): string {
  const fmt = (ym: string) => {
    const [y, m] = ym.split("-");
    const month = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", {
      month: "short",
    });
    return `${month} ${y}`;
  };
  return `${fmt(entry.start)} – ${entry.end === "present" ? "Present" : fmt(entry.end)}`;
}
