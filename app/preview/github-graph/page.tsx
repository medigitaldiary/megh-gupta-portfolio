import type { Metadata } from "next";
import { GithubGraph } from "@/components/github-graph/github-graph";
import snapshot from "@/lib/github-graph/contributions.json";
import { formatDay, normalizeDays } from "@/lib/github-graph/model";

export const metadata: Metadata = {
  title: "Contribution pill",
  description:
    "A GitHub contribution graph that morphs into hello and a heart. Preview only, placement still open.",
  robots: { index: false, follow: false },
};

export default function GithubGraphPreviewPage() {
  const contributions = normalizeDays(snapshot.contributions);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <p className="mb-3 font-mono text-fg-subtle text-xs uppercase tracking-[0.16em]">
        Preview
      </p>
      <h1 className="font-sans text-3xl text-fg tracking-tight md:text-5xl">
        Contribution pill
      </h1>
      <p className="mt-4 max-w-xl text-base text-fg-muted md:text-lg">
        Your last year on GitHub, drawn as the little grid from the clip. The
        squares are the public graph for @{snapshot.login}: {snapshot.total}{" "}
        contributions, pulled {formatDay(snapshot.fetched)}. Click the pill, or
        press play.
      </p>
      <div className="mt-12">
        <GithubGraph
          login={snapshot.login}
          total={snapshot.total}
          contributions={contributions}
        />
      </div>
    </main>
  );
}
