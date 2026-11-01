import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type CaseStudyFrontmatter = {
  title: string;
  slug: string;
  role: string;
  timeline: string;
  team: string;
  stack: string[];
  tags: string[];
  headline_metric: string;
  supporting_metrics: string[];
  featured: boolean;
  order: number;
  hero_image: string;
  published: boolean;
  // Short chips for the shelf spread. Optional so a case study still
  // renders if the block hasn't been written yet.
  shelf_metrics?: ShelfMetric[];
  // Up to three stills shown on the right of the open page.
  spread_images?: string[];
};

export type ShelfMetric = {
  value: string;
  label: string;
};

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  body: string;
};

/** Read one case study by slug from /content/work/<slug>.mdx. Returns null
 * when the file does not exist, so the route can fall back to its
 * coming-soon state. */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const file = path.join(process.cwd(), "content", "work", `${slug}.mdx`);
  try {
    const raw = await readFile(file, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = data as CaseStudyFrontmatter;
    frontmatter.shelf_metrics = readShelfMetrics(data.shelf_metrics);
    frontmatter.spread_images = readSpreadImages(data.spread_images);
    return {
      frontmatter,
      body: content,
    };
  } catch {
    return null;
  }
}

function readText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

export function readShelfMetrics(value: unknown): ShelfMetric[] {
  if (!Array.isArray(value)) return [];
  const metrics: ShelfMetric[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const metricValue = readText(record.value);
    const label = readText(record.label);
    if (!metricValue || !label) continue;
    metrics.push({ value: metricValue, label });
  }
  return metrics.slice(0, 3);
}

export function readSpreadImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, 3);
}
