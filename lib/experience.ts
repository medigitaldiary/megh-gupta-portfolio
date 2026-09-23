export type NarrativeAchievements = {
  intro?: string;
  items: string[];
};

export type NarrativeLink = {
  label: string;
  url: string;
  display?: string;
};

export type ExperienceProduct = {
  name: string;
  url: string;
  // Timeline: if start/end are set, timeline expands parent into per-product chips.
  start?: string;
  end?: string | "present";
  logo?: string;
  // Tailwind bg class to sit behind a transparent-mark logo (e.g. "bg-fg").
  logoBg?: string;
  current?: boolean;
  // Rich content for the list-view expand (mirrors ExperienceEntry).
  role?: string;
  headline?: string;
  roleChips?: string[];
  narrative?: string[];
  achievements?: NarrativeAchievements;
  closer?: string;
  linkOut?: NarrativeLink;
};

export type ExperienceEntry = {
  slug: string;
  company: string;
  role: string;
  logo?: string;
  logoBg?: string;
  url?: string;
  start: string;
  end: string | "present";
  tagline: string;
  products?: ExperienceProduct[];
  current?: boolean;
  order?: number;
  // Rich content for the list-view expand.
  headline?: string;
  roleChips?: string[];
  narrative?: string[];
  achievements?: NarrativeAchievements;
  closer?: string;
  linkOut?: NarrativeLink;
};

export const experienceEntries: ExperienceEntry[] = [
  {
    slug: "tap-invest",
    company: "tap invest",
    role: "associate product manager",
    url: "https://tapinvest.in",
    logo: "/images/logos/tap-invest.png",
    logoBg: "bg-fg",
    start: "2025-03",
    end: "present",
    current: true,
    tagline:
      "sebi-registered fintech behind bondscanner (retail bonds) and ultra (alternative investments).",
    products: [
      {
        name: "Ultra",
        url: "https://tapinvest.in",
        logo: "/images/logos/ultra.webp",
        start: "2025-03",
        end: "2025-10",
        role: "platform product manager",
        roleChips: ["Platform PM", "Retention", "0→1"],
        narrative: [
          "My first PM role. Owned Platform & Retention for Ultra, Tap's alternative-investments app.",
          "Co-owned the roadmap with the CTO and shipped products end to end. Learned the job in the deep end. I sat on customer calls with sales, turned messy feedback into an actual backlog, and slowly figured out the difference between what converts and what just sounds clever in a PRD.",
        ],
        achievements: {
          intro: "A few things I'm proud of:",
          items: [
            "Built the GIFT City NRI FD initiative from market sizing to live pilot with the founding team.",
            "Launched Flexi Invoice Discounting, a variable-tenure investment product that added ~₹50Cr in AUM within 3 months.",
            "Redesigned the referral journey, increasing adoption by 40% and driving acquisition growth.",
            "Shipped the Ultra web app across investment, wallet, dashboard, and KYC, opening up a new acquisition channel.",
          ],
        },
        closer:
          "Retention, platform, growth, and 0→1. The full product lifecycle before moving on to build BondScanner.",
      },
      {
        name: "BondScanner",
        url: "https://bondscanner.com",
        logo: "/images/logos/bondscanner.jpg",
        start: "2025-11",
        end: "present",
        current: true,
        role: "founding product manager",
        roleChips: ["0→1 builder", "Growth PM", "AI/Product Systems"],
        headline: "Founding PM. There was no product yet.",
        narrative: [
          "Just a freshly acquired SEBI license, a 2-month deadline, and a bet that India's bond market could be dragged out of the offline HNI world and made retail-friendly. I was one of the three PMs building it.",
          "Shipped the 0→1 onboarding across web and mobile in 2 months. Then took ownership of growth.",
          "Product-led SEO is where I got obsessed. Built the whole engine. 350+ compliance-safe blogs, a 200+ term bond dictionary, 16,000+ programmatic ISIN directory pages. Organic clicks roughly doubled in three months. Turns out if you build enough surface area you can rank for bonds nobody's ever heard of.",
          "Lately I've been living in Claude Code. Built an AI call-analysis pipeline that reviews outbound calls, scores conversations, and auto-generates action items. Also built James, our internal AI copilot, and shipped AI tools across ops, compliance, and marketing.",
          "Also worked on the less glamorous but equally important stuff: onboarding improvements, support infrastructure, Bond Bytes, and Bonds watchlist module.",
        ],
        linkOut: {
          label: "Check out everything here",
          url: "https://bondscanner.com/bonds",
          display: "bondscanner.com/bonds",
        },
      },
    ],
  },
  {
    slug: "moveinsync",
    company: "moveinsync",
    role: "product intern",
    url: "https://www.moveinsync.com",
    logo: "/images/logos/moveinsync.png",
    start: "2024-06",
    end: "2025-02",
    tagline:
      "employee transportation saas — 300k+ commutes daily across 200+ enterprises.",
    roleChips: ["Product Intern", "Pricing", "Revenue"],
    narrative: [
      "Developed pricing strategies for Safety Toolkit and DMS-ADAS premium features, presented at the Chennai Prodcon Summit and drove upselling conversations with 50+ commute clients.",
      "Expanded cross-sell to 50 commute clients by shipping an ETS dashboard for transport teams, targeting a 15% revenue increase.",
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

function formatYm(ym: string): string {
  const [y, m] = ym.split("-");
  const month = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", {
    month: "short",
  });
  return `${month} ${y}`;
}

export function formatDateRange(entry: {
  start: string;
  end: string | "present";
}): string {
  return `${formatYm(entry.start)} – ${entry.end === "present" ? "Present" : formatYm(entry.end)}`;
}

/** Human duration label between two YYYY-MM (or "present"). */
export function durationLabel(start: string, end: string | "present"): string {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] =
    end === "present"
      ? [now.getFullYear(), now.getMonth() + 1]
      : end.split("-").map(Number);
  const totalMonths = (ey - sy) * 12 + (em - sm) + 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} yr ${months} mo`;
}

/** YYYY-MM → decimal year (e.g. 2025-06 → 2025.416). */
export function toDecimalYear(ym: string): number {
  if (ym === "present")
    return new Date().getFullYear() + new Date().getMonth() / 12;
  const [y, m] = ym.split("-").map(Number);
  return y + (m - 1) / 12;
}

export function endAsDecimalYear(entry: ExperienceEntry): number {
  return entry.end === "present"
    ? toDecimalYear("present")
    : toDecimalYear(entry.end);
}
