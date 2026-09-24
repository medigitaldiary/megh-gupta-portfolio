import type { MetadataRoute } from "next";
import { getAllWorkCards } from "@/lib/work";

const SITE = "https://www.meghgupta.in";

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
    ...workEntries,
  ];
}
