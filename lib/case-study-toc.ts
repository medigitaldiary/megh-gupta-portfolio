export type TocItem = {
  id: string;
  heading: string;
};

/** Same slug the case study headings use as their element id. */
export function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readAttr(source: string, name: string): string | null {
  const double = source.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`));
  if (double) return double[1];
  const single = source.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`));
  return single ? single[1] : null;
}

/**
 * Outline for the "On this page" index, in source order.
 * Reads `<Section heading>` (the design-system chapters) and markdown
 * `##` headings (the older studies). Ids match the rendered anchors.
 */
export function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = body.split("\n");
  let inFence = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      i += 1;
      continue;
    }
    if (inFence) {
      i += 1;
      continue;
    }

    const markdown = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (markdown?.[1]) {
      const heading = markdown[1].trim();
      if (heading) items.push({ id: slugifyHeading(heading), heading });
      i += 1;
      continue;
    }

    if (line.includes("<Section")) {
      let block = line;
      let j = i;
      while (!block.includes(">") && j + 1 < lines.length) {
        j += 1;
        block += `\n${lines[j]}`;
      }
      const open = /<Section\b[^>]*>/.exec(block);
      if (open) {
        const heading = readAttr(open[0], "heading");
        if (heading) {
          const id = readAttr(open[0], "id") ?? slugifyHeading(heading);
          items.push({ id, heading });
        }
      }
      i = j + 1;
      continue;
    }

    i += 1;
  }

  return items;
}

/** Rough read time. 200 words a minute, at least one minute. */
export function readingMinutes(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|]/g, " ");
  const words = text.split(/\s+/).filter((word) => /[A-Za-z0-9]/.test(word));
  return Math.max(1, Math.round(words.length / 200));
}
