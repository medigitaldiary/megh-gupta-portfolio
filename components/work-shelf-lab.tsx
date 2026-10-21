"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { WorkCard } from "@/lib/work";

export type ShelfBook = WorkCard & {
  headlineMetric?: string;
  supportingMetrics: string[];
  tags: string[];
};

// =====================================================================
// Fold 3 — Editorial bookshelf (LAB · motion-driven)
// =====================================================================
// Interaction contract
// --------------------
//  - Default state: books rest on a wooden shelf with a small randomized
//    tilt. Each book is a physical object with a visible spine.
//  - Hover (desktop) / Tap (mobile) activates a book: it lifts, scales,
//    straightens to exactly 0°, and gets a deeper shadow. Neighbors stay
//    on the shelf but dim.
//  - A connected preview panel sits below the shelf and transitions its
//    content between active books via AnimatePresence crossfade.
//  - Sticky-active (first book) so the preview is always present and
//    pointing at it never collapses the state.
//
// Architectural rules (same as the previous lab commit — these ARE the
// fixes to the "it's messy" problem):
//  R1. Perspective lives on a container with NO overflow and NO
//      transforms, so translateZ isn't clipped and preserve-3d holds.
//  R2. Books physically overlap via negative margin on the row items
//      themselves (not the stage), so leaning behaves like a shelf.
//  R3. Horizontal scroll is on the OUTER container only, which has no
//      3D context — the inner row never clips the lifted book.
// =====================================================================

const BOOK_W = 170;
const BOOK_H = 255;
const BOOK_OVERLAP = 18;

// Deterministic tilt per book so SSR hydration matches client render.
function restTilt(seedKey: string, provided?: number): number {
  if (typeof provided === "number") {
    return Math.max(-6, Math.min(6, provided * 4));
  }
  // Simple string hash → [-6°, +6°]
  let h = 0;
  for (let i = 0; i < seedKey.length; i++) {
    h = (h * 31 + seedKey.charCodeAt(i)) | 0;
  }
  const v = ((h % 1000) / 1000) * 12 - 6;
  return Math.round(v * 10) / 10;
}

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

  const tilts = useMemo(
    () => books.map((b) => restTilt(b.slug, b.leanDeg)),
    [books],
  );

  return (
    <div className="mt-12 md:mt-16">
      {/* OUTER scroll container (position:relative + z-10 so books sit
          above the wooden plank below). Horizontal overflow is here,
          where there are no 3D transforms, so it cannot flatten the
          stage. */}
      <div className="shelf-scroll relative z-10 overflow-x-auto overflow-y-visible">
        {/* STAGE — perspective + preserve-3d. NO overflow of its own.
            min-width so narrower viewports engage the scroll on the
            outer wrapper rather than squeezing the books. */}
        <div
          className="stage relative mx-auto"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 80%",
            paddingTop: 72,
            paddingBottom: 0,
            minWidth: isMobile
              ? undefined
              : BOOK_W * books.length - BOOK_OVERLAP * (books.length - 1) + 80,
            width: "fit-content",
          }}
        >
          <div className="flex items-end justify-center">
            {books.map((book, i) => (
              <div
                key={book.slug}
                className="relative"
                style={{
                  marginLeft: i > 0 ? -BOOK_OVERLAP : undefined,
                  zIndex: i === activeIdx ? 30 : books.length - i,
                }}
              >
                <Book
                  book={book}
                  tilt={tilts[i]}
                  active={i === activeIdx}
                  dim={activeIdx !== i}
                  onHover={() => !isMobile && activate(i)}
                  onFocus={() => activate(i)}
                  onTap={() => isMobile && activate(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WOODEN SHELF PLANK — spans the full container width edge-to-edge.
          Pulled up 10px so books visually sit ON the top surface rather
          than hover above it. z-0 keeps it behind the books. */}
      <div aria-hidden="true" className="relative z-0 mt-[-10px] h-12 w-full">
        {/* Top surface (where books rest) */}
        <div className="absolute inset-x-0 top-0 h-6 bg-[#C19A6B]" />
        {/* Front edge */}
        <div className="absolute inset-x-0 top-6 h-4 border-t border-[#5C3A21]/30 bg-[#8B5A2B]" />
        {/* Drop shadow on the wall below */}
        <div className="absolute inset-x-0 top-10 h-8 bg-black/10 blur-md" />
      </div>

      {/* PREVIEW — docked below. Content crossfades across active books. */}
      <div className="mt-10 md:mt-14">
        <AnimatePresence mode="wait" initial={false}>
          {active ? <ExpandedPreview key={active.slug} book={active} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Book({
  book,
  tilt,
  active,
  dim,
  onHover,
  onFocus,
  onTap,
}: {
  book: ShelfBook;
  tilt: number;
  active: boolean;
  dim: boolean;
  onHover: () => void;
  onFocus: () => void;
  onTap: () => void;
}) {
  // Convert the rest tilt into rotateY (showing a side face) + a touch of
  // rotateZ for human-irregularity. Active book straightens to 0 on both.
  const restRotY = tilt;
  const restRotZ = tilt * 0.15;

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
      style={{ width: BOOK_W }}
    >
      <motion.div
        animate={{
          rotateY: active ? 0 : restRotY,
          rotateZ: active ? 0 : restRotZ,
          y: active ? -24 : 0,
          z: active ? 80 : 0,
          scale: active ? 1.06 : 1,
          opacity: dim ? 0.78 : 1,
          filter: dim ? "saturate(0.9) brightness(0.97)" : "saturate(1)",
          boxShadow: active
            ? "0 36px 56px -22px rgba(17,17,17,0.5), 0 10px 16px -8px rgba(17,17,17,0.3)"
            : "0 14px 22px -14px rgba(17,17,17,0.5), 0 2px 4px -2px rgba(17,17,17,0.25)",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 26,
          mass: 0.8,
        }}
        className="relative overflow-hidden rounded-r-[3px] rounded-l-[1px] border border-border bg-bg-elevated"
        style={{
          width: BOOK_W,
          height: BOOK_H,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
          willChange: "transform",
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
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto max-w-5xl rounded-3xl border border-border bg-[#F7F1E6] p-6 shadow-[0_28px_55px_-24px_rgba(17,17,17,0.28)] md:p-10"
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
    </motion.div>
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
