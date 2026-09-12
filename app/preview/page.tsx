import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coming-soon variants",
  description: "A/B/C preview of the paper-backed coming-soon page.",
  robots: { index: false, follow: false },
};

const VARIANTS = [
  {
    slug: "a",
    label: "A · Always WebGL",
    body: "Paper scene on every device. Best-looking, worst-performing. Expect Lighthouse ~78–88 on mobile.",
  },
  {
    slug: "b",
    label: "B · WebGL on desktop, static on mobile",
    body: "Recommended. Desktop gets the live scene; mobile and reduced-motion get a static canvas composition of the same four certificates. Lighthouse stays ≥95 on mobile.",
  },
  {
    slug: "c",
    label: "C · Upgrade on interaction",
    body: "Static fallback on load. Swaps to WebGL on first pointer movement or after 2 seconds. Fast first paint everywhere, wow-factor kicks in on desktop.",
  },
];

export default function PreviewIndex() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-3 font-mono text-fg-subtle text-xs uppercase tracking-wider">
        Preview · coming-soon variants
      </p>
      <h1 className="font-serif text-4xl">Pick a flavor.</h1>
      <p className="mt-4 text-fg-muted">
        Three ways to combine the paper effect with the coming-soon copy.
        Compare and pick one; I&apos;ll wire it into <code>/</code> and delete
        the rest.
      </p>

      <ul className="mt-10 space-y-6">
        {VARIANTS.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/preview/${v.slug}`}
              className="group block rounded-lg border border-border p-5 transition-colors hover:border-fg/40"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl">{v.label}</h2>
                <span className="font-mono text-accent text-xs uppercase tracking-wider group-hover:underline">
                  Open →
                </span>
              </div>
              <p className="mt-2 text-fg-muted text-sm">{v.body}</p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-fg-subtle text-xs">
        Also live:{" "}
        <Link className="underline" href="/paper-preview">
          /paper-preview
        </Link>{" "}
        (the original scene by itself),{" "}
        <Link className="underline" href="/coming-soon">
          /coming-soon
        </Link>{" "}
        (the current photo-bg version).
      </p>
    </main>
  );
}
