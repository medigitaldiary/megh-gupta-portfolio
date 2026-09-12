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
    label: "A · Live paper (WebGL)",
    body: "Full animated bent-glass scene, on every device. Cinematic. Heavy on mobile — Lighthouse ~78–88.",
  },
  {
    slug: "b",
    label: "B · Static paper (no WebGL)",
    body: "Same four certificates, drawn once to canvas, CSS-tilted into place. No animation, no GPU cost, works everywhere. Lighthouse ≥95.",
  },
  {
    slug: "c",
    label: "C · Live on desktop, static on mobile",
    body: "WebGL where the device can afford it (desktop + hover + no reduced-motion); static composition everywhere else. Recommended default.",
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
