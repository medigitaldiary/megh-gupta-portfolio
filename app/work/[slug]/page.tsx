import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  return {
    title: `${card.title} — case study`,
    description: card.oneLiner,
    // Case study bodies not published yet; keep out of index until MDX lands.
    robots: { index: false, follow: true },
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

  return (
    <main className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
        >
          <span aria-hidden="true">←</span> Back to selected work
        </Link>

        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-accent">
          {card.eyebrow} · {card.company}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-fg md:text-5xl">
          {card.title}
        </h1>
        <p className="mt-6 text-lg text-fg-muted">{card.oneLiner}</p>

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

        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              Role
            </dt>
            <dd className="mt-1 text-fg">{card.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              Timeline
            </dt>
            <dd className="mt-1 text-fg">{card.timeline}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
