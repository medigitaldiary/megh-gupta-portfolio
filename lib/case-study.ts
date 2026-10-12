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
    return {
      frontmatter: data as CaseStudyFrontmatter,
      body: content,
    };
  } catch {
    return null;
  }
}
