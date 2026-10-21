"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkCard } from "@/lib/work";

export type ShelfBook = WorkCard & {
  headlineMetric?: string;
  supportingMetrics: string[];
  tags: string[];
};

// =====================================================================
// Fold 3 — Editorial bookshelf (LAB)
// =====================================================================
// Interaction
// -----------
//  Default (no hover): all books tilted on the shelf, no preview card.
//  Hover a book        -> that book straightens to 0°, lifts, scales up;
//                         neighbours dim to 0.5 + scale 0.95; preview
//                         card animates in beneath the shelf.
//  Move between books  -> row-level hover state cancels the dismiss, so
//                         gliding book → book never collapses the panel;
//                         inner content crossfades, outer card stays.
//  Mouse leaves row    -> after a short grace, dismiss both the lift and
//                         the preview card.
//  Tap (mobile)        -> toggles active for that book.
//
// Layout stability
// ----------------
//  The outer container reserves a stable min-height so mounting /
//  unmounting the preview never shifts the page below. Horizontal
//  padding on the row prevents edge books from being clipped when
//  they scale up on hover.
// =====================================================================

const BOOK_W = 160;
const BOOK_H = 240;
const DISMISS_MS = 160;

// Alternating default tilts (used if a book has no leanDeg).
const TILT_PATTERN = [-4, 3, -3, 4, -4, 2, -3, 3, -4, 2];

export function WorkShelfLab({ books }: { books: ShelfBook[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const clearDismiss = useCallback(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
  }, []);

  const activate = useCallback(
    (i: number) => {
      clearDismiss();
      setActiveIdx(i);
    },
    [clearDismiss],
  );

  const scheduleDismiss = useCallback(() => {
    clearDismiss();
    dismissTimer.current = setTimeout(() => setActiveIdx(null), DISMISS_MS);
  }, [clearDismiss]);

  const toggleMobile = useCallback((i: number) => {
    setActiveIdx((cur) => (cur === i ? null : i));
  }, []);

  useEffect(() => () => clearDismiss(), [clearDismiss]);

  const active = activeIdx != null ? (books[activeIdx] ?? null) : null;

  return (
    // Wrapper reserves vertical room so preview mount/unmount cannot
    // shift the folds below. min-height = shelf stage + preview card.
    <div className="mt-12 md:mt-16" style={{ minHeight: 760 }}>
      {/* Shelf + books */}
      <div className="relative flex w-full flex-col pt-20">
        {/* Books row — items-end so bottoms align with shelf top.
            px-12 keeps edge books from clipping when they scale up on
            hover. onMouseLeave on the row (not per-book) schedules the
            dismiss, so gliding between neighbours never flickers. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-leave on the shelf row is purely decorative; keyboard dismissal is handled per-book via onBlur. */}
        <div
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-row items-end justify-center gap-2 overflow-visible px-12 pb-0 md:gap-4"
          onMouseLeave={() => !isMobile && scheduleDismiss()}
        >
          {books.map((book, i) => {
            const tilt =
              typeof book.leanDeg === "number"
                ? Math.max(-6, Math.min(6, book.leanDeg * 1.5))
                : TILT_PATTERN[i % TILT_PATTERN.length];
            return (
              <Book
                key={book.slug}
                book={book}
                tilt={tilt}
                active={i === activeIdx}
                anyActive={activeIdx != null}
                onHover={() => !isMobile && activate(i)}
                onFocus={() => activate(i)}
                onBlur={() => scheduleDismiss()}
                onTap={() => isMobile && toggleMobile(i)}
              />
            );
          })}
        </div>

        {/* Shelf — three-layer plank directly under the books' baseline */}
        <div aria-hidden="true" className="relative z-0 h-12 w-full">
          <div className="absolute top-0 h-4 w-full bg-[#C19A6B]" />
          <div className="absolute top-4 h-3 w-full border-t border-[#5C3A21]/30 bg-[#8B5A2B]" />
          <div className="absolute top-7 h-8 w-full bg-black/10 blur-md" />
        </div>
      </div>

      {/* Preview — only present when a book is active. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-enter on the preview container keeps the dismiss timer paused so the panel stays open while hovered; keyboard dismissal is handled per-book via onBlur. */}
      <div
        className="relative z-20 mt-10 md:mt-12"
        onMouseEnter={clearDismiss}
        onMouseLeave={() => !isMobile && scheduleDismiss()}
      >
        <AnimatePresence mode="wait" initial={false}>
          {active ? <PreviewCard key={active.slug} book={active} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Book({
  book,
  tilt,
  active,
  anyActive,
  onHover,
  onFocus,
  onBlur,
  onTap,
}: {
  book: ShelfBook;
  tilt: number;
  active: boolean;
  anyActive: boolean;
  onHover: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onTap: () => void;
}) {
  const isDim = anyActive && !active;

  return (
    <Link
      href={`/work/${book.slug}`}
      aria-label={`Open case study: ${book.title}`}
      className="group block shrink-0 focus-visible:outline-none"
      onMouseEnter={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={(e) => {
        if (window.matchMedia("(max-width: 768px)").matches && !active) {
          e.preventDefault();
          onTap();
        }
      }}
      style={{ width: BOOK_W, zIndex: active ? 50 : 1 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-r-[3px] rounded-l-[1px] border border-border bg-bg-elevated"
        initial={false}
        animate={{
          rotate: active ? 0 : tilt,
          y: active ? -20 : 0,
          scale: active ? 1.05 : isDim ? 0.95 : 1,
          opacity: isDim ? 0.5 : 1,
          boxShadow: active
            ? "0 25px 50px -12px rgba(0,0,0,0.35), 0 10px 20px -8px rgba(0,0,0,0.25)"
            : "0 10px 20px -10px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.2)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          width: BOOK_W,
          height: BOOK_H,
          transformOrigin: "bottom center",
          willChange: "transform",
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
            <h3 className="font-serif text-base leading-tight text-fg">
              {book.title}
            </h3>
          </div>
        )}
        {/* Spine */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-2 ${book.spineColor}`}
          style={{ boxShadow: "inset -2px 0 3px rgba(0,0,0,0.15)" }}
        />
        {/* Paper block hint */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[3px] bg-[#F3EBD9]"
        />
      </motion.div>
    </Link>
  );
}

function PreviewCard({ book }: { book: ShelfBook }) {
  const metrics = book.supportingMetrics.slice(0, 3);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-5xl rounded-3xl border border-border bg-[#F7F1E6] p-6 shadow-xl md:p-10"
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
