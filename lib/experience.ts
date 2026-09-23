export type ExperienceProduct = {
  name: string;
  url: string;
  // Optional — if present, the timeline view renders this product as its own
  // chip in place of the parent entry. List view still shows the parent.
  start?: string;
  end?: string | "present";
  logo?: string;
  current?: boolean;
};

export type ExperienceEntry = {
  slug: string;
  company: string;
  role: string;
  logo?: string;
  url?: string;
  start: string;
  end: string | "present";
  tagline: string;
  bullets: string[];
  products?: ExperienceProduct[];
  current?: boolean;
  order?: number;
};

export const experienceEntries: ExperienceEntry[] = [
  {
    slug: "tap-invest",
    company: "tap invest",
    role: "associate product manager",
    url: "https://tapinvest.in",
    start: "2025-03",
    end: "present",
    current: true,
    tagline:
      "building bondscanner (0→1 sebi-regulated bond platform) and driving retention on ultra (alternative-investment app).",
    products: [
      {
        name: "Ultra",
        url: "https://tapinvest.in",
        start: "2025-03",
        end: "2025-10",
      },
      {
        name: "BondScanner",
        url: "https://bondscanner.com",
        start: "2025-11",
        end: "present",
        current: true,
      },
    ],
    bullets: [
      "built bondscanner 0→1 as founding pm — web + mobile onboarding live in 2 months.",
      "shipped a product-led seo engine: 350+ blogs, 200+ dictionary terms, 26,000+ programmatic pages → ~2× daily organic clicks in 3 months.",
      "launched bond bytes newsletter across 100+ editions → 20% of total sign-ups, 3.5× mom reach growth, 7% pn-to-conversion.",
      "built an ai call-analysis pipeline (sarvam stt + claude) → team call-quality +15% in 30 days.",
      "led third-party data partnership with derivium → automated 80% of deal-detail fields, eliminated manual ops entry.",
      "launched flexi invoice discounting on ultra → ~₹50cr additional aum in 3 months.",
      "shipped ultra web app across investment, wallet, dashboard, kyc → 15-20% true aum growth in q3 2025.",
    ],
  },
  {
    slug: "moveinsync",
    company: "moveinsync",
    role: "product intern",
    url: "https://www.moveinsync.com",
    start: "2024-06",
    end: "2025-02",
    tagline:
      "employee transportation saas — 300k+ commutes daily across 200+ enterprises.",
    bullets: [
      "developed pricing strategies for safety toolkit and dms-adas premium features → presented at chennai prodcon summit, driving upselling with 50+ commute clients.",
      "expanded cross-sell to 50 commute clients via an ets dashboard for transport teams, targeting 15% revenue increase.",
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
