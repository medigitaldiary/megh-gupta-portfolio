"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { WorkCard } from "@/lib/work";

export type ShelfBook = WorkCard & {
  headlineMetric?: string;
  supportingMetrics: string[];
  tags: string[];
};

// =====================================================================
// Fold 3 — Editorial bookshelf (LAB)
// =====================================================================
// Architectural rules this version enforces (why the previous attempts
// looked messy):
//
//  R1. NEVER put overflow:auto on a container that holds 3D transforms.
//      Any overflow other than visible flattens preserve-3d and clips
//      translateZ. On desktop we fit 6 books natively; on mobile we
//      switch to a wrap/stack, not a scroll.
//
//  R2. Perspective lives on the .stage element, which has NO overflow
//      and NO transforms of its own, so the vanishing point is honored
//      and children with translateZ don't get clipped.
//
//  R3. Books physically overlap (negative margin between neighbours),
//      so they lean into each other like real books on a shelf. The
//      active book lifts out of the row and the gap closes behind it
//      from the neighbours already touching.
//
//  R4. The preview is a separate section BELOW the shelf. It does NOT
//      negative-margin into the shelf (that was collapsing onto the
//      lifted book). The connection is purely visual: the panel's left
//      column is a 2× cover echo with the same spine color + paper
//      strip as the shelf book.
//
//  R5. Sticky-active state. Default to the first book. Hovering the
//      preview can't collapse it (there's no pointer dependency on the
//      panel). Zero flicker.
// =====================================================================

const BOOK_W = 170;
const BOOK_H = 255;
const BOOK_OVERLAP = 18; // px of negative margin — books lean into each other

export function WorkShelfLab({ books }: { books: ShelfBook[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const activate = useCallback((i: number) => setActiveIdx(i), []);
  const active = books[activeIdx] ?? null;

  return (
    <div className="mt-12 md:mt-16">
      <style>{`
        @keyframes shelf-lab-preview-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-shelf-lab-book], [data-shelf-lab-preview] {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* STAGE — perspective lives here. No overflow, no transforms.
          Padding gives the lifted book room to rise + cast shadow. */}
      <div
        className="stage relative"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 80%",
          paddingTop: 56,
          paddingBottom: 0,
        }}
      >
        {/* ROW — flex, centered, no scroll. Books overlap via negative
            margin on each sibling except the first. On mobile we switch
            to a wrap grid so nothing overflows. */}
        <div
          className={
            isMobile
              ? "flex flex-wrap justify-center gap-3"
              : "flex justify-center items-end"
          }
        >
          {books.map((book, i) => (
            <div
              key={book.slug}
              className="relative"
              style={{
                marginLeft: !isMobile && i > 0 ? -BOOK_OVERLAP : undefined,
                zIndex: i === activeIdx ? 30 : books.length - i,
              }}
            >
              <Book
                book={book}
                active={i === activeIdx}
                dim={activeIdx !== i}
                onHover={() => !isMobile && activate(i)}
                onFocus={() => activate(i)}
                onTap={() => isMobile && activate(i)}
              />
            </div>
          ))}
        </div>

        {/* SHELF — hairline + wooden strip grounds the row */}
        <div aria-hidden="true" className="mt-2 h-px w-full bg-fg/70" />
        <div
          aria-hidden="true"
          className="mx-auto h-3 w-[98%] rounded-b-md bg-gradient-to-b from-[#C9A979] to-[#8E6B3D] shadow-[0_8px_18px_-10px_rgba(17,17,17,0.4)]"
        />
      </div>

      {/* PREVIEW — docked beneath the shelf with normal spacing. The
          connection to the shelf is the cover echo on the left, not an
          overlapping position. */}
      {active ? (
        <div className="mt-10 md:mt-14">
          <ExpandedPreview key={active.slug} book={active} />
        </div>
      ) : null}
    </div>
  );
}

function Book({
  book,
  active,
  dim,
  onHover,
  onFocus,
  onTap,
}: {
  book: ShelfBook;
  active: boolean;
  dim: boolean;
  onHover: () => void;
  onFocus: () => void;
  onTap: () => void;
}) {
  // At rest: ~10° rotateY so each book shows a sliver of its side face
  // (physical object), with a hint of Z rotation for human-irregularity.
  const rawLean = book.leanDeg ?? 0;
  const restRotY = Math.max(-10, Math.min(10, rawLean * 5));
  const restRotZ = Math.max(-1, Math.min(1, rawLean * 0.5));

  const rotY = active ? 0 : restRotY;
  const rotZ = active ? 0 : restRotZ;
  const translateZ = active ? 70 : 0;
  const translateY = active ? -22 : 0;
  const scale = active ? 1.05 : 1;

  return (
    <Link
      href={`/work/${book.slug}`}
      aria-label={`Open case study: ${book.title}`}
      className="group block focus-visible:outline-none"
      onMouseEnter={onHover}
      onFocus={onFocus}
      onClick={(e) => {
        if (window.matchMedia("(max-width: 768px)").matches && !active) {
          e.preventDefault();
          onTap();
        }
      }}
      style={{
        width: BOOK_W,
        transition: "opacity 240ms ease-out, filter 240ms ease-out",
        opacity: dim ? 0.78 : 1,
        filter: dim ? "saturate(0.9) brightness(0.97)" : "none",
      }}
    >
      <div
        data-shelf-lab-book
        className="relative overflow-hidden rounded-r-[3px] rounded-l-[1px] border border-border bg-bg-elevated"
        style={{
          width: BOOK_W,
          height: BOOK_H,
          transformStyle: "preserve-3d",
          transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
          transformOrigin: "bottom center",
          transition:
            "transform 360ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 360ms ease-out",
          boxShadow: active
            ? "0 32px 50px -22px rgba(17,17,17,0.5), 0 10px 16px -8px rgba(17,17,17,0.3)"
            : "0 14px 22px -14px rgba(17,17,17,0.5), 0 2px 4px -2px rgba(17,17,17,0.25)",
        }}
      >
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            fill
            sizes="170px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-3">
            <h3 className="font-serif text-base leading-tight text-fg">
              {book.title}
            </h3>
          </div>
        )}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-2 ${book.spineColor}`}
          style={{ boxShadow: "inset -2px 0 3px rgba(0,0,0,0.15)" }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[3px] bg-[#F3EBD9]"
        />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none mt-2 block h-0.5 w-full rounded-full bg-transparent transition-colors duration-150 group-focus-visible:bg-accent"
      />
    </Link>
  );
}

function ExpandedPreview({ book }: { book: ShelfBook }) {
  const metrics = book.supportingMetrics.slice(0, 3);
  return (
    <div
      data-shelf-lab-preview
      className="mx-auto max-w-5xl rounded-3xl border border-border bg-[#F7F1E6] p-6 shadow-[0_28px_55px_-24px_rgba(17,17,17,0.28)] md:p-10"
      style={{ animation: "shelf-lab-preview-in 260ms ease-out both" }}
    >
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
        <div
          className="relative mx-auto w-full max-w-[220px] overflow-hidden rounded-r-[4px] rounded-l-[2px] border border-border bg-bg-elevated shadow-[0_18px_30px_-14px_rgba(17,17,17,0.4)]"
          style={{ aspectRatio: "2 / 3" }}
        >
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt=""
              fill
              sizes="220px"
              className="object-cover"
            />
          ) : null}
          <span
            aria-hidden="true"
            className={`absolute inset-y-0 left-0 w-2 ${book.spineColor}`}
            style={{ boxShadow: "inset -2px 0 3px rgba(0,0,0,0.15)" }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 w-[3px] bg-[#F3EBD9]"
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
            {book.eyebrow} · {book.company}
          </p>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-fg md:text-[2rem]">
            {book.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-fg-muted md:text-lg">
            {book.oneLiner}
          </p>

          {metrics.length ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {metrics.map((m) => (
                <MetricTile key={m} raw={m} />
              ))}
            </div>
          ) : book.headlineMetric ? (
            <div className="mt-6 rounded-xl border border-border bg-bg-elevated p-4">
              <p className="font-serif text-xl leading-snug text-fg md:text-2xl">
                {book.headlineMetric}
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs text-fg-subtle">
              {book.role} · {book.timeline}
            </span>
            <Link
              href={`/work/${book.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2"
            >
              View case study
              <span aria-hidden="true" className="font-mono">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ raw }: { raw: string }) {
  const match = raw.match(/^(\S+)\s+(.+)$/);
  const value = match ? match[1] : raw;
  const label = match ? match[2] : "";
  return (
    <div className="rounded-xl border border-border bg-bg-elevated p-3 text-center">
      <p className="font-serif text-xl leading-none text-fg md:text-2xl">
        {value}
      </p>
      {label ? (
        <p className="mt-1 text-xs leading-snug text-fg-muted">{label}</p>
      ) : null}
    </div>
  );
}
