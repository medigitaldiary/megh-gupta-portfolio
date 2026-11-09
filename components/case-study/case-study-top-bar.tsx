import Link from "next/link";

type Props = {
  /** Where "Megh Gupta · Work" goes (homepage or the preview it came from). */
  backHref: string;
  /** Where "Let's connect" goes (the Contact fold on that same page). */
  connectHref: string;
};

/**
 * Slim bar above a case study (G-M1, option #3). A visitor who lands on a
 * shared study link gets a way back to the work and a way to reach Megh.
 * Sticky from xl up, where the "On this page" rail sits beside it. Below
 * xl it scrolls away and the index bar takes the top edge instead.
 */
export function CaseStudyTopBar({ backHref, connectHref }: Props) {
  return (
    <div className="z-40 border-b border-border bg-bg xl:sticky xl:top-0">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6 md:px-8">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">←</span>
          <span>
            <span className="font-semibold">Megh Gupta</span>
            <span className="text-fg-muted"> · Work</span>
          </span>
        </Link>
        <Link
          href={connectHref}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-[13px] text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Let&apos;s connect <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
