import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import * as caseStudy from "@/components/case-study";
import { CaseStudyContact } from "@/components/case-study/case-study-contact";
import { CaseStudyIndexBar } from "@/components/case-study/case-study-index-bar";
import {
  CaseStudyToc,
  type IndexMark,
} from "@/components/case-study/case-study-toc";
import { CaseStudyTopBar } from "@/components/case-study/case-study-top-bar";
import { WorkThumbnails } from "@/components/work-thumbnails";
import { getCaseStudy } from "@/lib/case-study";
import { extractToc, readingMinutes } from "@/lib/case-study-toc";
import { withCoverVideos } from "@/lib/cover-video";
import {
  getAllWorkCards,
  getNextWorkCards,
  getWorkCardBySlug,
} from "@/lib/work";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllWorkCards().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getWorkCardBySlug(slug);
  if (!card) return { title: "Case study not found" };
  const study = await getCaseStudy(slug);
  const hasBody = !!study;
  return {
    title: `${card.title} · case study`,
    description: card.oneLiner,
    robots: { index: hasBody, follow: true },
  };
}

const proseColumn = "min-w-0 xl:col-start-1";

const articleClass =
  "mt-12 max-w-none text-fg xl:col-start-1 [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[1.75rem] [&_h2]:leading-tight [&_h2]:text-fg md:[&_h2]:text-[2.25rem] [&_h3]:mt-6 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-fg [&_li]:leading-relaxed [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:text-fg [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6";

function readMark(value: string | undefined): IndexMark | null {
  return value === "text" || value === "row" ? value : null;
}

/** The page a study was opened from: a preview build or the homepage. */
function homeHref(mark: IndexMark | null, hash: "work" | "connect"): string {
  if (mark === "text") return `/preview/v3#${hash}`;
  if (mark === "row") return `/preview/v3.1#${hash}`;
  return `/#${hash}`;
}

export default async function WorkCaseStudy({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ mark?: string }>;
}) {
  const { slug } = await params;
  const { mark: markParam } = await searchParams;
  const previewMark = readMark(markParam);
  const mark: IndexMark = previewMark ?? "row";
  const card = getWorkCardBySlug(slug);
  if (!card) notFound();

  const study = await getCaseStudy(slug);
  const toc = study ? extractToc(study.body) : [];
  const minutes = study ? readingMinutes(study.body) : null;
  const more = withCoverVideos(getNextWorkCards(slug, 2));

  const role = study?.frontmatter.role ?? card.role;
  const timeline = study?.frontmatter.timeline ?? card.timeline;
  const kicker = [role, card.company, timeline];
  if (minutes) kicker.push(`${minutes} min`);

  const team = study?.frontmatter.team;
  const stack = study?.frontmatter.stack ?? [];

  const backHref = homeHref(previewMark, "work");
  const connectHref = homeHref(previewMark, "connect");

  return (
    <>
      <CaseStudyTopBar backHref={backHref} connectHref={connectHref} />
      <CaseStudyIndexBar items={toc} />
      <main
        id="main"
        className="px-6 pt-12 pb-24 md:px-8 md:pt-16 md:pb-32 xl:pt-20"
      >
        <div
          className={`mx-auto grid w-full max-w-[46rem] grid-cols-[minmax(0,1fr)] ${
            toc.length > 0
              ? "xl:max-w-6xl xl:grid-cols-[minmax(0,46rem)_15.5rem] xl:justify-center xl:gap-x-16"
              : ""
          }`}
        >
          <header className={proseColumn}>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-sm text-sm text-fg-muted underline underline-offset-4 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">←</span> Back to selected work
            </Link>

            <p className="mt-8 font-mono text-xs uppercase tracking-wider text-accent">
              {kicker.join(" · ")}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-fg md:text-5xl">
              {study?.frontmatter.title ?? card.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-fg-muted">
              {card.oneLiner}
            </p>

            {team ? <p className="mt-4 text-sm text-fg-muted">{team}</p> : null}
            {stack.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {stack.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-fg-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          {toc.length > 0 ? (
            <aside className="hidden xl:col-start-2 xl:row-span-6 xl:row-start-1 xl:block xl:self-stretch">
              <CaseStudyToc
                items={toc}
                mark={mark}
                className="xl:sticky xl:top-[5.5rem] xl:max-h-[calc(100svh-7rem)] xl:overflow-y-auto"
              />
            </aside>
          ) : null}

          {study ? (
            <>
              <div
                className={`mt-10 rounded-xl border border-border bg-bg-elevated p-6 md:p-8 ${proseColumn}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  Headline metric
                </p>
                <p className="mt-2 font-display text-2xl text-fg md:text-3xl">
                  {study.frontmatter.headline_metric}
                </p>
                {study.frontmatter.supporting_metrics?.length ? (
                  <ul className="mt-4 space-y-1 text-sm text-fg-muted">
                    {study.frontmatter.supporting_metrics.map((metric) => (
                      <li key={metric}>· {metric}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <article className={articleClass}>
                <MDXRemote source={study.body} components={caseStudy} />
              </article>

              <CaseStudyContact
                connectHref={connectHref}
                className={proseColumn}
              />
            </>
          ) : (
            <div
              className={`mt-10 rounded-xl border border-border bg-bg-elevated p-6 md:p-8 ${proseColumn}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                Case study
              </p>
              <p className="mt-2 font-display text-2xl text-fg">
                Coming soon. I&apos;m writing it up.
              </p>
              <p className="mt-3 text-sm text-fg-muted">
                The full breakdown (context, decisions, tradeoffs, and numbers)
                drops here shortly. In the meantime, feel free to reach out and
                I&apos;ll walk you through it live.
              </p>
              <Link
                href={connectHref}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Let&apos;s talk about it →
              </Link>
            </div>
          )}

          <KeepReading cards={more} mark={previewMark} />
        </div>
      </main>
    </>
  );
}

function KeepReading({
  cards,
  mark,
}: {
  cards: ReturnType<typeof getNextWorkCards>;
  mark: IndexMark | null;
}) {
  if (cards.length === 0) return null;

  return (
    <section
      aria-labelledby="keep-reading"
      className={`mt-20 border-t border-border pt-12 ${proseColumn}`}
    >
      <h2
        id="keep-reading"
        className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle"
      >
        Keep reading
      </h2>
      <div className="mt-8">
        <WorkThumbnails cards={cards} columns={2} mark={mark ?? undefined} />
      </div>
    </section>
  );
}
