"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { WorkCard } from "@/lib/work";

export type ShelfBook = WorkCard & {
  headlineMetric?: string;
  supportingMetrics: string[];
  tags: string[];
};

// =====================================================================
// Fold 3 — Editorial bookshelf (LAB)
// =====================================================================
// Geometry
// --------
//  Each "book" is a real 3D object with four faces:
//    front cover   → artwork, translateZ(+10)
//    back cover    → dark, translateZ(-10)
//    spine         → left edge, rotateY(-90), width 20
//    pages         → right edge, rotateY(+90), width 20
//  The whole thing has transformStyle: preserve-3d, and the parent
//  container defines a shared perspective (1200px) so every book sits
//  in the same viewing plane.
//
// Shelf
// -----
//  Three-layer wooden plank directly beneath the books' baseline:
//    top surface  #D4B895 (h-4)
//    front edge   #A67B5B (h-3, shadow)
//    wall shadow  black/15 blur-xl (h-10, overlaps upward)
//
// Preview
// -------
//  The preview is ABSOLUTELY positioned relative to the stage, not a
//  sibling below. We measure the active book's bounding rect, place
//  the preview so it slides out from behind the book's right edge:
//    initial { opacity:0, x:-50, scale:0.9 }
//    animate { opacity:1, x:+20, scale:1   }
//  It overlaps the muted background books and never affects document
//  flow — so no vertical layout shift when it appears / disappears.
//
// Interaction
// -----------
//  Default: no active book → shelf shows all books tilted on their
//  spines, no preview.
//  Hover (desktop) / tap (mobile): active book straightens + lifts +
//  pulls forward (translateZ 50), neighbours dim to 0.4 and recede
//  (translateZ -20, scale 0.9), preview emerges.
//  Dismiss timer with cancel-on-enter prevents flicker.
// =====================================================================

const BOOK_W = 150;
const BOOK_H = 230;
const BOOK_DEPTH = 20; // spine + pages width
const PREVIEW_W = 480;
const DISMISS_MS = 180;

const TILT_PATTERN = [-10, 8, -8, 10, -9, 7, -10, 8];
const EASE = [0.25, 1, 0.5, 1] as const;

export function WorkShelfLab({ books }: { books: ShelfBook[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [previewLeft, setPreviewLeft] = useState<number | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bookRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stageRef = useRef<HTMLDivElement | null>(null);

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

  const scheduleDismiss = useCallback(() => {
    clearDismiss();
    dismissTimer.current = setTimeout(() => setActiveIdx(null), DISMISS_MS);
  }, [clearDismiss]);

  const activate = useCallback(
    (i: number) => {
      clearDismiss();
      setActiveIdx(i);
    },
    [clearDismiss],
  );

  const toggleMobile = useCallback((i: number) => {
    setActiveIdx((cur) => (cur === i ? null : i));
  }, []);

  useEffect(() => () => clearDismiss(), [clearDismiss]);

  // Measure the active book's right edge within the stage so the
  // preview can anchor to it (no layout shift, no document flow).
  useLayoutEffect(() => {
    if (activeIdx == null || !stageRef.current) {
      setPreviewLeft(null);
      return;
    }
    const bookEl = bookRefs.current[activeIdx];
    if (!bookEl) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const bookRect = bookEl.getBoundingClientRect();
    // Right edge of the book, relative to the stage.
    let left = bookRect.right - stageRect.left;
    // If the preview would overflow the right side of the stage, flip
    // it to the LEFT of the book instead.
    if (left + PREVIEW_W > stageRect.width) {
      left = bookRect.left - stageRect.left - PREVIEW_W;
    }
    setPreviewLeft(left);
  }, [activeIdx]);

  const active = activeIdx != null ? (books[activeIdx] ?? null) : null;

  return (
    // Stable min-height so preview mount/unmount cannot shift the
    // folds below.
    <div className="mt-12 md:mt-16" style={{ minHeight: 560 }}>
      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-6xl"
        style={{ perspective: "1200px" }}
      >
        {/* Books row — items-end aligns bottoms with shelf top.
            px-12 keeps edge books from clipping on scale.
            Row-level onMouseLeave schedules dismiss once the pointer
            exits BOTH the books and the preview area. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-leave on the shelf row is purely decorative; keyboard dismissal is handled per-book via onBlur. */}
        <div
          className="relative z-10 flex w-full flex-row items-end justify-center gap-6 px-12 pt-24 pb-0"
          onMouseLeave={() => !isMobile && scheduleDismiss()}
        >
          {books.map((book, i) => {
            const tilt =
              typeof book.leanDeg === "number"
                ? Math.max(-12, Math.min(12, book.leanDeg * 2.5))
                : TILT_PATTERN[i % TILT_PATTERN.length];
            return (
              <Book
                ref={(el) => {
                  bookRefs.current[i] = el;
                }}
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

        {/* Shelf — CSS-only realistic wood plank. Sits directly beneath
            the books' baseline at z-0 (books are z-10 so they overlap).
            Four stacked layers simulate: top surface + front edge +
            bottom lip shadow + ambient wall shadow. */}
        <div aria-hidden="true" className="relative z-0 mt-[-2px] h-16 w-full">
          {/* Top surface — wood grain via horizontal gradient */}
          <div className="absolute top-0 h-5 w-full border-t border-[#d4b092] bg-gradient-to-r from-[#b38b6d] via-[#c29b7a] to-[#b38b6d] shadow-sm" />
          {/* Front thick edge — darker wood with top-to-bottom lighting */}
          <div className="absolute top-5 h-6 w-full border-t border-[#5c3a21]/50 bg-gradient-to-b from-[#8c5e3c] to-[#6a4226]" />
          {/* Bottom lip — hairline shadow line */}
          <div className="absolute top-11 h-1 w-full bg-[#3a2212] blur-[1px]" />
          {/* Ambient cast shadow on the wall below */}
          <div className="absolute top-12 h-12 w-full bg-black/20 blur-xl" />
        </div>

        {/* Preview — absolutely positioned over the stage, anchored to
            the active book's right edge. z-40 so it floats above the
            dimmed neighbours. No effect on document flow. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-enter cancels the dismiss timer so the panel stays open while hovered; keyboard dismissal is handled per-book via onBlur. */}
        <div
          className="pointer-events-none absolute inset-0 z-40"
          onMouseEnter={clearDismiss}
          onMouseLeave={() => !isMobile && scheduleDismiss()}
        >
          <AnimatePresence>
            {active && previewLeft != null ? (
              <motion.div
                key={active.slug}
                className="pointer-events-auto absolute"
                style={{
                  top: 80, // starts just below the stage's top padding
                  left: previewLeft,
                  width: PREVIEW_W,
                  zIndex: 40,
                }}
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 20, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.9 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <PreviewCard book={active} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 3D HARDCOVER BOOK — four faces composed in preserve-3d
// ---------------------------------------------------------------------
function Book({
  ref,
  book,
  tilt,
  active,
  anyActive,
  onHover,
  onFocus,
  onBlur,
  onTap,
}: {
  ref: (el: HTMLDivElement | null) => void;
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
        ref={ref}
        className="relative"
        initial={false}
        animate={{
          rotateY: active ? 0 : tilt,
          y: active ? -30 : 0,
          z: active ? 50 : isDim ? -20 : 0,
          scale: active ? 1.1 : isDim ? 0.9 : 1,
          opacity: isDim ? 0.4 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{
          width: BOOK_W,
          height: BOOK_H,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
          willChange: "transform",
          filter: active
            ? "drop-shadow(0 25px 25px rgba(0,0,0,0.25)) drop-shadow(0 10px 10px rgba(0,0,0,0.15))"
            : "drop-shadow(0 8px 10px rgba(0,0,0,0.25))",
        }}
      >
        {/* FRONT COVER */}
        <div
          className="absolute inset-0 overflow-hidden rounded-r-[3px] rounded-l-[1px] border border-border bg-bg-elevated"
          style={{ zIndex: 10, transform: "translateZ(10px)" }}
        >
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt=""
              fill
              sizes="150px"
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
        </div>

        {/* SPINE (left edge, rotated out of the plane) */}
        <div
          aria-hidden="true"
          className={`absolute left-0 top-0 h-full ${book.spineColor}`}
          style={{
            width: BOOK_DEPTH,
            transformOrigin: "left center",
            transform: `rotateY(-90deg) translateX(-${BOOK_DEPTH / 2}px)`,
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3)",
          }}
        />

        {/* PAGES (right edge) */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 h-full bg-[#F4F4F0]"
          style={{
            width: BOOK_DEPTH,
            transformOrigin: "right center",
            transform: `rotateY(90deg) translateX(${BOOK_DEPTH / 2}px)`,
            boxShadow: "inset 2px 0 4px rgba(0,0,0,0.1)",
          }}
        />

        {/* BACK COVER */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-r-[3px] rounded-l-[1px] bg-[#2a2521]"
          style={{ zIndex: 0, transform: "translateZ(-10px)" }}
        />
      </motion.div>
    </Link>
  );
}

// ---------------------------------------------------------------------
// PREVIEW CARD — content shown when a book is active
// ---------------------------------------------------------------------
function PreviewCard({ book }: { book: ShelfBook }) {
  const metrics = book.supportingMetrics.slice(0, 3);
  return (
    <div className="rounded-2xl border border-border bg-[#F7F1E6] p-5 shadow-2xl md:p-6">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
        {book.eyebrow} · {book.company}
      </p>
      <h3 className="mt-2 font-serif text-xl leading-tight text-fg md:text-2xl">
        {book.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {book.oneLiner}
      </p>

      {metrics.length ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <MetricTile key={m} raw={m} />
          ))}
        </div>
      ) : book.headlineMetric ? (
        <div className="mt-4 rounded-lg border border-border bg-bg-elevated p-3">
          <p className="font-serif text-base leading-snug text-fg">
            {book.headlineMetric}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="font-mono text-[0.7rem] text-fg-subtle">
          {book.role} · {book.timeline}
        </span>
        <Link
          href={`/work/${book.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-xs font-medium text-bg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2"
        >
          View case study
          <span aria-hidden="true" className="font-mono">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

function MetricTile({ raw }: { raw: string }) {
  const match = raw.match(/^(\S+)\s+(.+)$/);
  const value = match ? match[1] : raw;
  const label = match ? match[2] : "";
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-2 text-center">
      <p className="font-serif text-base leading-none text-fg">{value}</p>
      {label ? (
        <p className="mt-1 text-[0.65rem] leading-snug text-fg-muted">
          {label}
        </p>
      ) : null}
    </div>
  );
}
