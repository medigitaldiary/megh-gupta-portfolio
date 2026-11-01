"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkCard } from "@/lib/work";

// Fold 3 — case-study thumbnails.
// Same hinge as ramakrushna.xyz: perspective 1500, the front face
// rests at rotateY(-1) and springs to -35° off its left edge. The
// "Click to read" card behind it tilts 4°, in that product's color.
// A copy of the card sits 1px back and peeks out. Touch does not
// hinge. Reduced motion stays closed.

// Local product marks for this fold. Sampled from the logo files.
// BondScanner #182F8C, Ultra #171513, MoveInSync #3DAE2B.
const PRODUCT_MARK: Record<string, { logo: string; slab: string }> = {
  BondScanner: {
    logo: "/images/logos/bondscanner.jpg",
    slab: "bg-[#182F8C] text-accent-fg",
  },
  Ultra: {
    logo: "/images/logos/ultra.webp",
    slab: "bg-[#171513] text-accent-fg",
  },
  MoveInSync: {
    logo: "/images/logos/moveinsync.png",
    slab: "bg-[#3DAE2B] text-[#10240E]",
  },
};

function productMark(company: string) {
  return (
    PRODUCT_MARK[company] ?? {
      logo: "",
      slab: "bg-fg text-accent-fg",
    }
  );
}

export function WorkThumbnails({
  cards,
  layout = "grid",
}: {
  cards: WorkCard[];
  layout?: "grid" | "carousel";
}) {
  if (layout === "carousel") return <WorkCarousel cards={cards} />;
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.slug} className="min-w-0">
          <Thumbnail card={card} />
        </li>
      ))}
    </ul>
  );
}

const STEP_MS = 4500;

// Stop positions: one card at a time, then a final stop that puts the
// last card fully inside the viewport. The 3.5 peek means the last
// snap-start sits past the end, so without that stop the next arrow
// wraps before the last card is ever fully visible.
function carouselStops(viewport: HTMLElement) {
  const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const starts = [...viewport.querySelectorAll("li")]
    .map((item) => item.offsetLeft)
    .filter((left) => left < max - 4);
  const stops = starts.length > 0 ? starts : [0];
  const last = stops[stops.length - 1] ?? 0;
  if (max > 4 && max - last > 4) stops.push(max);
  return stops;
}

function nearestStop(stops: number[], scrollLeft: number) {
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  stops.forEach((stop, index) => {
    const dist = Math.abs(stop - scrollLeft);
    if (dist < bestDist) {
      best = index;
      bestDist = dist;
    }
  });
  return best;
}

function WorkCarousel({ cards }: { cards: WorkCard[] }) {
  const reduced = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Native smooth scrolling never reaches the final snap-end stop, so
  // the arrow animates scrollLeft itself and lifts snap for that move.
  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const stops = carouselStops(viewport);
      const last = stops[stops.length - 1] ?? 0;
      const atEnd = viewport.scrollLeft >= last - 8;
      const atStart = viewport.scrollLeft <= 8;
      const current =
        frameRef.current != null
          ? indexRef.current
          : nearestStop(stops, viewport.scrollLeft);
      const next =
        direction === 1 && atEnd
          ? 0
          : direction === -1 && atStart
            ? stops.length - 1
            : (current + direction + stops.length) % stops.length;
      indexRef.current = next;
      const target = stops[next] ?? 0;
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      if (reduced) {
        frameRef.current = null;
        viewport.style.scrollSnapType = "";
        viewport.scrollLeft = target;
        return;
      }
      const start = viewport.scrollLeft;
      const delta = target - start;
      const started = performance.now();
      viewport.style.scrollSnapType = "none";
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / 420);
        const eased = 1 - (1 - t) ** 3;
        viewport.scrollLeft = start + delta * eased;
        if (t < 1) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }
        viewport.scrollLeft = target;
        frameRef.current = null;
        viewport.style.scrollSnapType = "";
      };
      frameRef.current = requestAnimationFrame(tick);
    },
    [reduced],
  );

  const onScrollEnd = () => {
    const viewport = viewportRef.current;
    if (!viewport || frameRef.current != null) return;
    indexRef.current = nearestStop(carouselStops(viewport), viewport.scrollLeft);
  };

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => scrollByCard(1), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, scrollByCard]);

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          setPaused(false);
        }
      }}
    >
      <section
        ref={viewportRef}
        aria-roledescription="carousel"
        aria-label="Selected case studies"
        onScrollEnd={onScrollEnd}
        className="@container overflow-x-auto pt-12 pb-16 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-6">
          {cards.map((card, index) => (
            <li
              key={card.slug}
              className={`w-[calc((100cqw-1.5rem)/1.15)] shrink-0 sm:w-[calc((100cqw-3rem)/2.15)] lg:w-[calc((100cqw-4.5rem)/3.5)] ${
                index === cards.length - 1 ? "snap-end" : "snap-start"
              }`}
            >
              <Thumbnail card={card} />
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous case study"
          onClick={() => scrollByCard(-1)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-fg transition-colors duration-150 hover:bg-bg-elevated"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next case study"
          onClick={() => scrollByCard(1)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-fg transition-colors duration-150 hover:bg-bg-elevated"
        >
          →
        </button>
      </div>
    </div>
  );
}

const SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 1,
};

function Thumbnail({ card }: { card: WorkCard }) {
  const reduced = useReducedMotion() ?? false;
  const [armed, setArmed] = useState(false);
  const open = armed && !reduced;
  const transition = reduced ? { duration: 0 } : SPRING;
  const mark = productMark(card.company);

  return (
    <Link
      href={`/work/${card.slug}`}
      aria-label={`Read the ${card.title} case study`}
      className={`relative block h-full ${open ? "z-20" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setArmed(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        setArmed(false);
      }}
      onFocus={() => setArmed(true)}
      onBlur={() => setArmed(false)}
    >
      <div className="relative [perspective:1500px] [transform-style:preserve-3d]">
        <div
          aria-hidden="true"
          className="absolute inset-0 [transform:translateZ(-1px)]"
        >
          <CardFace card={card} still />
        </div>
        <motion.div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 flex h-[86%] items-center justify-end rounded-[1.75rem] pr-4 ${mark.slab}`}
          style={{ transformOrigin: "left bottom" }}
          initial={false}
          animate={{ rotate: open ? 4 : 0 }}
          transition={transition}
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-[-0.04em] [writing-mode:vertical-rl]">
            Click to read
          </span>
        </motion.div>
        <motion.div
          className="relative shadow-[0_18px_32px_-22px_rgba(31,59,46,0.45)]"
          style={{ transformOrigin: "left bottom" }}
          initial={false}
          animate={{ rotateY: open ? -35 : -1, z: 1 }}
          transition={transition}
        >
          <CardFace card={card} />
        </motion.div>
      </div>
    </Link>
  );
}

function CardFace({
  card,
  still = false,
}: {
  card: WorkCard;
  still?: boolean;
}) {
  const mark = productMark(card.company);
  return (
    <div className="flex h-full flex-col rounded-[1.75rem] border border-border bg-bg-elevated p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-subtle">
          {card.eyebrow}
        </p>
        {mark.logo ? (
          <Image
            src={mark.logo}
            alt={card.company}
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-md"
          />
        ) : null}
      </div>
      <h3 className="mt-3 font-serif text-2xl leading-tight text-fg">
        {card.title}
      </h3>
      <p className="mt-2 line-clamp-2 h-10 text-sm leading-5 text-fg-muted">
        {card.oneLiner}
      </p>
      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl bg-bg [clip-path:inset(0_round_1rem)]">
        <CoverMedia
          poster={card.coverImage}
          video={still ? undefined : card.coverVideo}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        />
      </div>
    </div>
  );
}

function CoverMedia({
  poster,
  video,
  sizes,
}: {
  poster?: string;
  video?: string;
  sizes: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isGif = video?.toLowerCase().endsWith(".gif") ?? false;
  const playVideo = Boolean(video) && !isGif && !reduced;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !playVideo) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.play().catch(() => {});
          return;
        }
        el.pause();
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playVideo]);

  if (playVideo && video) {
    return (
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover [clip-path:inset(0_round_1rem)]"
      >
        <source src={video} type="video/mp4" />
      </video>
    );
  }

  const still = isGif && !reduced ? video : poster;
  if (!still) return null;
  return (
    <Image
      src={still}
      alt=""
      fill
      sizes={sizes}
      unoptimized={isGif}
      className="object-cover [clip-path:inset(0_round_1rem)]"
    />
  );
}
