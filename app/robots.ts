import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Preview routes are design-system experiments and should not
      // compete with the canonical homepage in search. Each route also
      // ships `robots: { index: false, follow: false }` via its page
      // metadata — this is the belt alongside those braces. These paths
      // are also password-locked by middleware.ts.
      disallow: ["/preview", "/paper-preview", "/work", "/unlock"],
    },
    sitemap: "https://www.meghgupta.in/sitemap.xml",
  };
}
