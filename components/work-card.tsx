import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { WorkCard as WorkCardType } from "@/lib/work";

// A book-shaped case-study card. The cover art is the entire resting face;
// the book leans very slightly (±1.5° max to prevent neighbor-leakage at
// 3-across), sits on the shelf with a soft drop shadow underneath. On
// hover the book straightens, lifts off the shelf, the shadow deepens,
// and a title + role overlay slides up from the bottom edge. Motion is
// disabled for reduced-motion viewers; the overlay still shows them.
export function WorkCard({ card }: { card: WorkCardType }) {
  const href = `/work/${card.slug}`;
  // Clamp the lean so a 3-column shelf at ~300px per book never has
  // a book's top corner overhanging into its neighbor.
  const rawLean = card.leanDeg ?? 0;
  const lean = Math.max(-1.5, Math.min(1.5, rawLean));
  const leanStyle: CSSProperties = { "--lean": `${lean}deg` } as CSSProperties;

  return (
    <Link
      href={href}
      aria-label={`Read the case study: ${card.title}`}
      className="group relative z-0 block focus-visible:outline-none hover:z-10 focus-visible:z-10"
      style={leanStyle}
    >
      {/* Book body: aspect-ratio portrait, holds the cover art + overlay */}
      <div
        className={[
          "relative aspect-[3/4] w-full",
          "origin-bottom-left [transform:rotate(var(--lean))]",
          "transition-[transform,box-shadow] duration-300 ease-out",
          "shadow-[0_4px_12px_-6px_rgba(17,17,17,0.25)]",
          "group-hover:[transform:translateY(-10px)_rotate(0deg)]",
          "group-hover:shadow-[0_18px_30px_-12px_rgba(17,17,17,0.4)]",
          "group-focus-visible:[transform:translateY(-10px)_rotate(0deg)]",
          "group-focus-visible:shadow-[0_18px_30px_-12px_rgba(17,17,17,0.4)]",
          "motion-reduce:transition-none motion-reduce:group-hover:[transform:rotate(var(--lean))]",
          "motion-reduce:group-focus-visible:[transform:rotate(var(--lean))]",
          "rounded-r-md rounded-l-sm overflow-hidden border border-border bg-bg-elevated",
        ].join(" ")}
      >
        {/* Cover art — fills the book face */}
        {card.coverImage ? (
          <Image
            src={card.coverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 320px, 90vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          // Fallback for a card without cover art yet
          <div className="absolute inset-0 flex items-end bg-bg-elevated p-5">
            <h3 className="font-serif text-xl leading-snug text-fg">
              {card.title}
            </h3>
          </div>
        )}

        {/* Spine strip on the left edge — grounds the "book" idiom */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-1.5 ${card.spineColor}`}
        />

        {/* Info overlay — slides up from the bottom on hover / focus */}
        <div
          className={[
            "absolute inset-x-0 bottom-0 translate-y-full",
            "bg-gradient-to-t from-fg/95 via-fg/85 to-fg/0",
            "p-4 pt-10 text-accent-fg",
            "transition-transform duration-300 ease-out",
            "group-hover:translate-y-0 group-focus-visible:translate-y-0",
            "motion-reduce:translate-y-0 motion-reduce:bg-fg/90",
          ].join(" ")}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-fg/70">
            {card.eyebrow} · {card.company}
          </p>
          <h3 className="mt-1 font-serif text-base leading-snug text-accent-fg md:text-lg">
            {card.title}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-xs text-accent-fg/80">
            {card.role} · {card.timeline}
            <span aria-hidden="true" className="ml-auto font-mono">
              Read →
            </span>
          </p>
        </div>
      </div>

      {/* Focus ring, outside the transformed book so it renders flat */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 transition-shadow group-focus-visible:ring-accent"
      />
    </Link>
  );
}
