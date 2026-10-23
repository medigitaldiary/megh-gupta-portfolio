import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import * as caseStudy from "@/components/case-study";
import "@/components/case-study/case-study.css";
import { getCaseStudy } from "@/lib/case-study";
import { getAllWorkCards, getWorkCardBySlug } from "@/lib/work";

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
    title: `${card.title} — case study`,
    description: card.oneLiner,
    robots: { index: hasBody, follow: true },
  };
}

export default async function WorkCaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const card = getWorkCardBySlug(slug);
  if (!card) notFound();

  const study = await getCaseStudy(slug);

  return (
    <main className="case-study-page px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
        >
          <span aria-hidden="true">←</span> Back to selected work
        </Link>

        <p className="case-study-hero-eyebrow mt-8 font-mono text-xs uppercase tracking-wider text-accent">
          <span data-hl-word>
            {card.eyebrow} · {card.company}
          </span>
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-fg md:text-5xl">
          {study?.frontmatter.title ?? card.title}
        </h1>
        <p className="mt-6 text-lg text-fg-muted">{card.oneLiner}</p>

        {study ? (
          <>
            {/* Headline metric strip — the one number that earns the page */}
            <div className="mt-10 rounded-xl border border-border bg-bg-elevated p-6 md:p-8">
              <p className="case-study-headline-eyebrow font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                <span data-hl-word>Headline metric</span>
              </p>
              <p className="mt-2 font-serif text-2xl text-fg md:text-3xl">
                {study.frontmatter.headline_metric}
              </p>
              {study.frontmatter.supporting_metrics?.length ? (
                <ul className="mt-4 space-y-1 text-sm text-fg-muted">
                  {study.frontmatter.supporting_metrics.map((m) => (
                    <li key={m}>— {m}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Body — MDX rendered with the case-study design-system
                components. Arbitrary selectors below are the typography
                source of truth (no @tailwindcss/typography in deps). */}
            <article className="mt-12 max-w-none text-fg [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-fg [&_h3]:mt-6 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-fg [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-fg-muted [&_strong]:text-fg [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:text-fg-muted [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4">
              <MDXRemote source={study.body} components={caseStudy} />
            </article>
          </>
        ) : (
          <div className="mt-10 rounded-xl border border-border bg-bg-elevated p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              Case study
            </p>
            <p className="mt-2 font-serif text-2xl text-fg">
              Coming soon — I&apos;m writing it up.
            </p>
            <p className="mt-3 text-sm text-fg-muted">
              The full breakdown — context, decisions, tradeoffs, and numbers —
              drops here shortly. In the meantime, feel free to reach out and
              I&apos;ll walk you through it live.
            </p>
            <Link
              href="/#connect"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm text-accent-fg transition-opacity duration-150 hover:opacity-90"
            >
              Let&apos;s talk about it →
            </Link>
          </div>
        )}

        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              Role
            </dt>
            <dd className="mt-1 text-fg">
              {study?.frontmatter.role ?? card.role}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              Timeline
            </dt>
            <dd className="mt-1 text-fg">
              {study?.frontmatter.timeline ?? card.timeline}
            </dd>
          </div>
          {study?.frontmatter.team ? (
            <div className="col-span-2">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                Team
              </dt>
              <dd className="mt-1 text-fg-muted">{study.frontmatter.team}</dd>
            </div>
          ) : null}
          {study?.frontmatter.stack?.length ? (
            <div className="col-span-2">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                Stack
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {study.frontmatter.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-fg-muted"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </main>
  );
}
