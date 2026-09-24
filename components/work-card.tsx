import Link from "next/link";
import type { WorkCard as WorkCardType } from "@/lib/work";

// A book-shaped project card. The whole card is a link to /work/[slug].
// On hover the "cover" swings open on a Y-axis rotation (3D transform),
// revealing the CTA underneath. Motion is disabled for reduced-motion users.
export function WorkCard({ card }: { card: WorkCardType }) {
  const href = `/work/${card.slug}`;

  return (
    <Link
      href={href}
      aria-label={`Read the case study: ${card.title}`}
      className="group block focus-visible:outline-none"
    >
      {/* 3D perspective wrapper */}
      <div className="relative aspect-[3/4] w-full [perspective:1200px]">
        {/* Back page — revealed as the cover swings open */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-between rounded-r-md rounded-l-sm border border-border bg-bg-elevated p-5 md:p-6"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            {card.company}
          </span>
          <div>
            <p className="font-serif text-lg leading-snug text-fg md:text-xl">
              {card.oneLiner}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-accent">
              Read the case study
              <span aria-hidden="true" className="font-mono">
                →
              </span>
            </p>
          </div>
        </div>

        {/* Front cover — swings open on hover */}
        <div
          className={[
            "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-r-md rounded-l-sm border border-border bg-bg shadow-sm",
            "[transform-origin:left_center] [backface-visibility:hidden]",
            "transition-transform duration-500 ease-out",
            "group-hover:[transform:rotateY(-32deg)] group-focus-visible:[transform:rotateY(-32deg)]",
            "motion-reduce:transition-none motion-reduce:group-hover:[transform:none] motion-reduce:group-focus-visible:[transform:none]",
          ].join(" ")}
        >
          {/* Spine strip on the left edge */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 left-0 w-1.5 ${card.spineColor}`}
          />
          {/* Subtle inner-page hint on the right edge of the cover */}
          <span
            aria-hidden="true"
            className="absolute inset-y-2 right-0 w-px bg-border/70"
          />

          <div className="relative flex h-full flex-col p-5 pl-6 md:p-6 md:pl-7">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                {card.eyebrow}
              </span>
              {card.status === "coming-soon" && (
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  Soon
                </span>
              )}
            </div>

            <h3 className="mt-6 font-serif text-2xl leading-[1.15] text-fg md:text-[1.6rem]">
              {card.title}
            </h3>

            <div className="mt-auto flex items-end justify-between pt-6 text-xs text-fg-subtle">
              <span className="font-mono">
                {card.role} · {card.timeline}
              </span>
              <span
                aria-hidden="true"
                className="font-mono transition-opacity duration-200 ease-out group-hover:opacity-0 motion-reduce:group-hover:opacity-100"
              >
                ↗
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Focus ring outside the perspective wrapper so it renders flat */}
      <span
        aria-hidden="true"
        className="pointer-events-none block h-0 w-full rounded-md ring-2 ring-transparent ring-offset-2 transition-shadow group-focus-visible:ring-accent"
      />
    </Link>
  );
}
