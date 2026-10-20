"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { WorkCard } from "@/lib/work";

export type ShelfBook = WorkCard & {
  headlineMetric?: string;
  supportingMetrics: string[];
  tags: string[];
};

// Interactive bookshelf for Fold 3.
//
// Behaviour:
// - All books render in a single horizontal row with a varied lean so
//   the arrangement reads as a curated shelf, not a mechanical grid.
// - One book is "active" at a time (default: the first). Hovering or
//   keyboard-focusing another book switches the active book.
// - The expanded preview panel below the shelf always shows the active
//   book's content — this is why there's no hover-flicker between book
//   and panel: the panel is sticky to whichever book was last touched.
// - Clicking a book or the preview's CTA navigates to /work/<slug>.
// - Horizontal scroll kicks in on narrow screens via overflow-x-auto
//   on the row so new case studies don't force a layout rewrite.
export function WorkShelf({ books }: { books: ShelfBook[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = books[activeIdx] ?? null;

  const activate = useCallback((i: number) => setActiveIdx(i), []);

  return (
    <div className="mt-10 md:mt-14">
      {/* Shelf — the row and the wooden-ish strip beneath it. We don't
          clip the row vertically so the lifted book never gets cut off
          at the top. */}
      <div className="relative pt-10">
        <ul className="flex items-end justify-start gap-3 overflow-x-auto overflow-y-visible px-6 pb-2 md:justify-center md:gap-5 md:px-0">
          {books.map((book, i) => (
            <li
              key={book.slug}
              className="relative shrink-0"
              style={{ zIndex: i === activeIdx ? 10 : 1 }}
            >
              <Book
                book={book}
                active={i === activeIdx}
                dim={activeIdx !== i}
                onActivate={() => activate(i)}
              />
            </li>
          ))}
        </ul>
        {/* Shelf line — hairline + soft shadow strip to ground the row */}
        <div aria-hidden="true" className="mt-1 h-px w-full bg-fg/60" />
        <div
          aria-hidden="true"
          className="mx-auto h-2 w-[96%] rounded-b-md bg-fg/10"
        />
      </div>

      {/* Expanded preview — always visible, swaps content when active
          changes. Keyed by slug so React cross-fades the content on
          switch rather than mutating in place. */}
      {active ? <ExpandedPreview book={active} /> : null}
    </div>
  );
}

function Book({
  book,
  active,
  dim,
  onActivate,
}: {
  book: ShelfBook;
  active: boolean;
  dim: boolean;
  onActivate: () => void;
}) {
  // Clamped lean (±2°) so neighbours never overlap at ~140px width.
  const rawLean = book.leanDeg ?? 0;
  const lean = Math.max(-2, Math.min(2, rawLean));
  // Active book straightens; others carry their resting lean.
  const rotation = active ? 0 : lean;
  const translateY = active ? -14 : 0;
  const scale = active ? 1.06 : 1;

  return (
    <Link
      href={`/work/${book.slug}`}
      aria-label={`Open case study: ${book.title}`}
      className="group block focus-visible:outline-none"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      style={{
        width: 140,
        transition: "opacity 220ms ease-out",
        opacity: dim ? 0.55 : 1,
      }}
    >
      <div
        className="relative aspect-[2/3] w-full overflow-hidden rounded-r-md rounded-l-sm border border-border bg-bg-elevated motion-reduce:transition-none"
        style={{
          transform: `rotate(${rotation}deg) translateY(${translateY}px) scale(${scale})`,
          transformOrigin: "bottom center",
          transition:
            "transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 220ms ease-out",
          boxShadow: active
            ? "0 22px 40px -16px rgba(17,17,17,0.4), 0 2px 6px -2px rgba(17,17,17,0.2)"
            : "0 6px 14px -8px rgba(17,17,17,0.3)",
        }}
      >
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            fill
            sizes="160px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-3">
            <h3 className="font-serif text-sm leading-tight text-fg">
              {book.title}
            </h3>
          </div>
        )}
        {/* Spine strip grounds the book-cover idiom */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-1 ${book.spineColor}`}
        />
      </div>

      {/* Focus ring sits outside the transformed book so it reads flat */}
      <span
        aria-hidden="true"
        className="pointer-events-none mt-1 block h-0.5 w-full rounded-full bg-transparent transition-colors duration-150 group-focus-visible:bg-accent"
      />
    </Link>
  );
}

function ExpandedPreview({ book }: { book: ShelfBook }) {
  return (
    <div
      key={book.slug}
      className="mt-12 rounded-2xl border border-border bg-bg-elevated p-6 md:p-10"
      style={{ animation: "shelf-preview-in 220ms ease-out both" }}
    >
      <style>{`
        @keyframes shelf-preview-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-shelf-preview] { animation: none !important; }
        }
      `}</style>
      <div
        data-shelf-preview
        className="grid gap-6 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10"
      >
        {/* Larger cover — same artwork as the book on the shelf, shown
            at a size where the illustration can breathe. */}
        <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-md border border-border bg-bg-elevated shadow-[0_14px_28px_-14px_rgba(17,17,17,0.4)]">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : null}
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 left-0 w-1 ${book.spineColor}`}
          />
        </div>

        {/* Project info — eyebrow, title, one-liner, metrics, CTA */}
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
            {book.eyebrow} · {book.company}
          </p>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-fg md:text-[1.75rem]">
            {book.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
            {book.oneLiner}
          </p>

          {book.headlineMetric ? (
            <div className="mt-6 rounded-xl border border-border bg-bg p-5">
              <p className="font-serif text-xl leading-snug text-fg md:text-2xl">
                {book.headlineMetric}
              </p>
              {book.supportingMetrics.length ? (
                <ul className="mt-3 space-y-1 text-sm text-fg-muted">
                  {book.supportingMetrics.slice(0, 3).map((m) => (
                    <li key={m}>— {m}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-4 text-xs text-fg-subtle">
            <span className="font-mono">
              {book.role} · {book.timeline}
            </span>
          </div>

          <Link
            href={`/work/${book.slug}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            View case study
            <span aria-hidden="true" className="font-mono">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
