import type { MetadataRoute } from "next";
import { getAllWorkCards } from "@/lib/work";

const SITE = "https://www.meghgupta.in";

// /work/* is password-locked until launch (middleware.ts). Flip to false
// when the case studies go public so they're listed again.
const LOCK_WORK = true;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const workEntries: MetadataRoute.Sitemap = getAllWorkCards().map((c) => ({
    url: `${SITE}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...(LOCK_WORK ? [] : workEntries),
  ];
}
