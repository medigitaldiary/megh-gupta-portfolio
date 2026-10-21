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

// Fold 3 — editorial bookshelf.
//
// Shape
// -----
// 1) A real-feeling shelf: six 200×300 "books" standing on a wooden strip,
//    rotated with a shared 3D perspective so each book shows a sliver of its
//    side face. Soft contact-shadows ground them.
// 2) One book is "active" at any time (default: first). Hover / focus moves
//    the active state; keeping an active-sticky state means pointing at the
//    preview card doesn't collapse it (no flicker).
// 3) The expanded preview sits BELOW the shelf as a wide horizontal panel,
//    overlapping the shelf-line slightly. Its left column is a LARGER echo
//    of the selected book's cover — so the preview reads as the same book
//    opened up, not a separate information panel.
// 4) The lifted book stays on the shelf (above the panel's z-index), so the
//    connection is visual: the small book on the shelf matches the big
//    cover on the panel's left.
// 5) Mobile (≤768px): tap toggles the preview beneath that book.

const BOOK_W = 200;
const BOOK_H = 300;

export function WorkShelf({ books }: { books: ShelfBook[] }) {
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
        @keyframes shelf-preview-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-shelf-book], [data-shelf-preview] {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Shelf
          perspective lives on the container so every book shares the same
          vanishing point — otherwise each rotated book would read as a
          flat 2D tilt instead of a solid object. */}
      <div className="relative">
        <div
          className="relative pt-16 md:pt-20"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 85%" }}
        >
          <ul className="flex items-end justify-start gap-2 overflow-x-auto overflow-y-visible px-6 pb-3 md:justify-center md:gap-3 md:px-0">
            {books.map((book, i) => (
              <li
                key={book.slug}
                className="relative shrink-0"
                style={{ zIndex: i === activeIdx ? 30 : 2 }}
              >
                <Book
                  book={book}
                  active={i === activeIdx}
                  dim={activeIdx !== i}
                  onHover={() => !isMobile && activate(i)}
                  onFocus={() => activate(i)}
                  onTap={() => isMobile && activate(i)}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Shelf line — a wooden-ish strip grounds the row. The shelf top
            is a hairline, then a narrow wooden band under it. */}
        <div aria-hidden="true" className="mt-1 h-px w-full bg-fg/70" />
        <div
          aria-hidden="true"
          className="mx-auto h-3 w-[98%] rounded-b-md bg-gradient-to-b from-[#C9A979] to-[#8E6B3D] shadow-[0_6px_14px_-8px_rgba(17,17,17,0.4)]"
        />
      </div>

      {/* Expanded preview — a WIDE horizontal panel that overlaps the shelf
          line slightly so it reads as attached, not a separate card. Its
          left column is a bigger version of the selected book cover; the
          right column holds the project detail. Keyed by slug so React
          cross-fades the content on switch. */}
      {active ? (
        <div className="relative -mt-6 md:-mt-10" style={{ zIndex: 20 }}>
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
  const rawLean = book.leanDeg ?? 0;
  // Rotation around Y so books show a slim side face (physical, not flat 2D).
  const baseRotY = Math.max(-14, Math.min(14, rawLean * 7));
  const rotY = active ? 0 : baseRotY;
  // Mild Z rotation for human-hand irregularity.
  const rotZ = active ? 0 : Math.max(-1.2, Math.min(1.2, rawLean * 0.6));
  // Forward lift: translateZ pulls the active book toward the camera,
  // translateY lifts it off the shelf, scale amplifies presence.
  const translateZ = active ? 90 : 0;
  const translateY = active ? -24 : 0;
  const scale = active ? 1.04 : 1;

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
        opacity: dim ? 0.75 : 1,
        filter: dim ? "saturate(0.85) brightness(0.95)" : "none",
      }}
    >
      <div
        data-shelf-book
        className="relative overflow-hidden rounded-r-[3px] rounded-l-[1px] border border-border bg-bg-elevated"
        style={{
          width: BOOK_W,
          height: BOOK_H,
          transformStyle: "preserve-3d",
          transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
          transformOrigin: "bottom center",
          transition:
            "transform 340ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 340ms ease-out",
          boxShadow: active
            ? "0 36px 60px -24px rgba(17,17,17,0.5), 0 10px 18px -8px rgba(17,17,17,0.3)"
            : "0 14px 22px -14px rgba(17,17,17,0.55), 0 2px 4px -2px rgba(17,17,17,0.3)",
        }}
      >
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-4">
            <h3 className="font-serif text-lg leading-tight text-fg">
              {book.title}
            </h3>
          </div>
        )}
        {/* Spine — the colored sliver at the binding edge */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-2 ${book.spineColor}`}
          style={{
            boxShadow: "inset -2px 0 3px rgba(0,0,0,0.15)",
          }}
        />
        {/* Right-edge paper hint — thin cream strip suggesting page block */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[3px] bg-[#F3EBD9]"
        />
      </div>

      {/* Focus ring sits outside the transformed book so it reads flat */}
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
      data-shelf-preview
      className="mx-auto max-w-5xl rounded-3xl border border-border bg-[#F7F1E6] p-6 shadow-[0_30px_60px_-24px_rgba(17,17,17,0.3)] md:p-10"
      style={{ animation: "shelf-preview-in 260ms ease-out both" }}
    >
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
        {/* Larger echo of the selected book cover — this is the visual
            "handshake" between the shelf and the panel. */}
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

        {/* Project info */}
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

// Split a supporting-metric string like "3.5x MoM reach" into a bold value
// and a muted label, matching the reference tiles.
function MetricTile({ raw }: { raw: string }) {
  // Grab the leading value: digits + optional decimal + optional unit suffix
  // (x, %, +, K, M, etc.) up to the first space.
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
