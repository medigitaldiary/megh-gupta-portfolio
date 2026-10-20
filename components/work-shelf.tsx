"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { WorkCard } from "@/lib/work";

export type ShelfBook = WorkCard & {
  headlineMetric?: string;
  supportingMetrics: string[];
  tags: string[];
};

// Fold 3 — editorial bookshelf.
//
// Interaction model
// -----------------
// - Books are the primary object. Hovering (or focusing) a book lifts it
//   forward and opens a floating preview "card" docked next to that same
//   book. The card is portal-rendered to <body> so overflow/clip on the
//   shelf row never truncates it, and it's absolutely positioned off the
//   hovered book's bounding rect — so the preview reads as attached to
//   the book, not as a separate panel.
// - Hover-safe: a 180ms dismiss timer kicks in when the pointer leaves
//   the book, but is cancelled the moment the pointer enters the panel.
//   That lets a visitor glide diagonally from book → panel without the
//   preview collapsing underneath them.
// - On narrow screens (<= 768px) the preview collapses to a mobile
//   sheet beneath the shelf, driven by tap. The shelf row scrolls
//   horizontally so new case studies never force a layout rewrite.
// - prefers-reduced-motion: all transforms + transitions degrade to
//   static state via a scoped @media block.

const DISMISS_MS = 180;
const BOOK_WIDTH = 180;
const BOOK_HEIGHT = 270;
const PANEL_WIDTH = 440;
const PANEL_GAP = 20;
const PANEL_MARGIN = 16;

export function WorkShelf({ books }: { books: ShelfBook[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bookRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
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

  const activeBook = activeIdx != null ? books[activeIdx] : null;
  const activeAnchor =
    activeIdx != null ? (bookRefs.current[activeIdx] ?? null) : null;

  return (
    <div className="mt-10 md:mt-14">
      <style>{`
        @keyframes shelf-preview-in {
          from { opacity: 0; transform: translateY(4px); }
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

      <div className="relative pt-14">
        <ul className="flex items-end justify-start gap-6 overflow-x-auto overflow-y-visible px-6 pb-4 md:justify-center md:gap-8 md:px-0">
          {books.map((book, i) => (
            <li
              key={book.slug}
              className="relative shrink-0"
              style={{ zIndex: i === activeIdx ? 20 : 1 }}
            >
              <Book
                ref={(el) => {
                  bookRefs.current[i] = el;
                }}
                book={book}
                active={i === activeIdx}
                dim={activeIdx != null && activeIdx !== i}
                onEnter={() => !isMobile && activate(i)}
                onLeave={() => !isMobile && scheduleDismiss()}
                onFocus={() => activate(i)}
                onBlur={() => scheduleDismiss()}
                onTap={() => isMobile && toggleMobile(i)}
              />
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="mt-1 h-px w-full bg-fg/60" />
        <div
          aria-hidden="true"
          className="mx-auto h-2 w-[96%] rounded-b-md bg-fg/10"
        />
      </div>

      {/* Desktop floating preview — portal-rendered so it never gets
          clipped by the shelf's horizontal scroll container. */}
      {mounted && !isMobile && activeBook && activeAnchor
        ? createPortal(
            <FloatingPreview
              book={activeBook}
              anchor={activeAnchor}
              onEnter={clearDismiss}
              onLeave={scheduleDismiss}
            />,
            document.body,
          )
        : null}

      {/* Mobile sheet — inline below the shelf, tap-dismissible. */}
      {isMobile && activeBook ? (
        <MobileSheet book={activeBook} onClose={() => setActiveIdx(null)} />
      ) : null}
    </div>
  );
}

type BookProps = {
  book: ShelfBook;
  active: boolean;
  dim: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onTap: () => void;
};

function Book({
  ref,
  book,
  active,
  dim,
  onEnter,
  onLeave,
  onFocus,
  onBlur,
  onTap,
}: BookProps & { ref: (el: HTMLDivElement | null) => void }) {
  const rawLean = book.leanDeg ?? 0;
  const lean = Math.max(-1.5, Math.min(1.5, rawLean));
  const rotation = active ? 0 : lean;
  const translateY = active ? -18 : 0;
  const scale = active ? 1.08 : 1;

  return (
    <Link
      href={`/work/${book.slug}`}
      aria-label={`Open case study: ${book.title}`}
      className="group block focus-visible:outline-none"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={(e) => {
        // On mobile, first tap opens preview rather than navigating.
        if (window.matchMedia("(max-width: 768px)").matches && !active) {
          e.preventDefault();
          onTap();
        }
      }}
      style={{
        width: BOOK_WIDTH,
        transition: "opacity 220ms ease-out",
        opacity: dim ? 0.5 : 1,
      }}
    >
      <div
        ref={ref}
        data-shelf-book
        className="relative overflow-hidden rounded-r-md rounded-l-sm border border-border bg-bg-elevated"
        style={{
          width: BOOK_WIDTH,
          height: BOOK_HEIGHT,
          transform: `rotate(${rotation}deg) translateY(${translateY}px) scale(${scale})`,
          transformOrigin: "bottom center",
          transition:
            "transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 240ms ease-out",
          boxShadow: active
            ? "0 28px 48px -18px rgba(17,17,17,0.45), 0 4px 10px -4px rgba(17,17,17,0.25)"
            : "0 8px 18px -10px rgba(17,17,17,0.35)",
        }}
      >
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            fill
            sizes="180px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-4">
            <h3 className="font-serif text-base leading-tight text-fg">
              {book.title}
            </h3>
          </div>
        )}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-1.5 ${book.spineColor}`}
        />
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none mt-2 block h-0.5 w-full rounded-full bg-transparent transition-colors duration-150 group-focus-visible:bg-accent"
      />
    </Link>
  );
}

function FloatingPreview({
  book,
  anchor,
  onEnter,
  onLeave,
}: {
  book: ShelfBook;
  anchor: HTMLDivElement;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const compute = () => {
      const rect = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Prefer right of the book; flip to left if it would overflow.
      let left = rect.right + PANEL_GAP;
      if (left + PANEL_WIDTH + PANEL_MARGIN > vw) {
        left = rect.left - PANEL_GAP - PANEL_WIDTH;
      }
      // Clamp to viewport if still out of bounds (very small screens
      // land in the mobile branch, so this is just a guard).
      left = Math.max(
        PANEL_MARGIN,
        Math.min(left, vw - PANEL_WIDTH - PANEL_MARGIN),
      );

      // Vertically centre on the book, then clamp to viewport.
      const approxHeight = 480;
      let top = rect.top + rect.height / 2 - approxHeight / 2;
      top = Math.max(
        PANEL_MARGIN,
        Math.min(top, vh - approxHeight - PANEL_MARGIN),
      );

      setPos({ top: window.scrollY + top, left: window.scrollX + left });
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
    };
  }, [anchor]);

  if (!pos) return null;

  return (
    <div
      data-shelf-preview
      role="dialog"
      aria-label={`Preview: ${book.title}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: PANEL_WIDTH,
        zIndex: 50,
        animation: "shelf-preview-in 200ms ease-out both",
      }}
      className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[0_28px_60px_-20px_rgba(17,17,17,0.35)]"
    >
      <PreviewBody book={book} />
    </div>
  );
}

function MobileSheet({
  book,
  onClose,
}: {
  book: ShelfBook;
  onClose: () => void;
}) {
  return (
    <div
      data-shelf-preview
      className="mt-8 rounded-2xl border border-border bg-bg-elevated p-5"
      style={{ animation: "shelf-preview-in 200ms ease-out both" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
          {book.eyebrow} · {book.company}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="-mt-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:text-fg"
        >
          <span aria-hidden="true" className="font-mono text-sm">
            ×
          </span>
        </button>
      </div>
      <PreviewBody book={book} compact />
    </div>
  );
}

function PreviewBody({
  book,
  compact,
}: {
  book: ShelfBook;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mt-3" : ""}>
      {!compact ? (
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
          {book.eyebrow} · {book.company}
        </p>
      ) : null}
      <h3
        className={`${compact ? "mt-1" : "mt-2"} font-serif leading-tight text-fg ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        {book.title}
      </h3>
      <p
        className={`${compact ? "mt-3 text-sm" : "mt-3 text-base"} leading-relaxed text-fg-muted`}
      >
        {book.oneLiner}
      </p>

      {book.headlineMetric ? (
        <div className="mt-5 rounded-xl border border-border bg-bg p-4">
          <p
            className={`font-serif leading-snug text-fg ${
              compact ? "text-lg" : "text-xl"
            }`}
          >
            {book.headlineMetric}
          </p>
          {book.supportingMetrics.length ? (
            <ul className="mt-2 space-y-1 text-sm text-fg-muted">
              {book.supportingMetrics.slice(0, 3).map((m) => (
                <li key={m}>— {m}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-3 text-xs text-fg-subtle">
        <span className="font-mono">
          {book.role} · {book.timeline}
        </span>
      </div>

      <Link
        href={`/work/${book.slug}`}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        View case study
        <span aria-hidden="true" className="font-mono">
          →
        </span>
      </Link>
    </div>
  );
}
