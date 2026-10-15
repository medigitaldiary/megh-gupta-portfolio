"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// About fold — personal storytelling only. No professional toolkit, no
// stack row (that belongs elsewhere per the v2 brief). Three parts:
//   1. AboutIntro — portrait + eyebrow + headline + intro paragraph
//   2. AboutStoryTrack — six horizontally scroll-snapping cards
//   3. AboutLookingAhead — calmer closing panel with current ambitions
//
// Horizontal track uses native scroll-snap, not pinned-scroll. The
// project ships no motion library and a hand-rolled pin would be
// fragile; the brief explicitly allows this fallback. Keyboard arrows
// scroll one card at a time, touchpad / wheel scroll freely, touch
// swipes. Progress bar reads scrollLeft via requestAnimationFrame.

type Story = {
  id: string;
  heading: string;
  copy: string;
  image: string;
  // Visual weight — "wide" gets a longer card for denser copy (Goa),
  // "small" tightens cards whose copy is short (FIFA, Reading).
  width: "normal" | "wide" | "small";
};

// Image references kept in one place for easy swap when the real photos land.
// Replace each `src` here, not inside component JSX.
const PLACEHOLDER_PORTRAIT = "/images/about/placeholders/portrait.svg";
// `looking-ahead.svg` sits in the placeholders dir too — reserved for
// an optional visual on the Looking Ahead panel; not used today to keep
// that closing panel calmer than the story track.

const STORIES: Story[] = [
  {
    id: "fitness",
    heading: "Building a hybrid athlete.",
    copy: "I'm working towards becoming a hybrid athlete. I recently took part in HYROX Delhi and am now training for my next race in Noida this January.",
    image: "/images/about/placeholders/fitness.svg",
    width: "normal",
  },
  {
    id: "music",
    heading: "Musician at heart.",
    copy: "I play multiple instruments, with a special focus on the guitar.",
    image: "/images/about/placeholders/music.svg",
    width: "normal",
  },
  {
    id: "goa",
    heading: "A different side of Goa.",
    copy: "I graduated from BITS Goa in 2025. Some of my favourite memories are of discovering a quieter side of the state, away from the usual tourist trail. If you ever get a month there, rent a two-wheeler, skip the fixed itinerary, and see where you end up.",
    image: "/images/about/placeholders/goa.svg",
    width: "wide",
  },
  {
    id: "motorcycle",
    heading: "Old-school by choice.",
    copy: "I'm drawn to retro bikes, classic cars, and vintage fashion. My GT650 is one of my favourite purchases. I'm not looking to build a collection of bikes. I just love the idea of taking it to new cities and exploring at my own pace.",
    image: "/images/about/placeholders/motorcycle.svg",
    width: "normal",
  },
  {
    id: "fifa",
    heading: "FIFA over football.",
    copy: "I don't follow football much, but I'm always up for a game of FIFA with friends.",
    image: "/images/about/placeholders/fifa.svg",
    width: "small",
  },
  {
    id: "reading",
    heading: "Building a reading habit.",
    copy: "I'm trying to build a more regular reading habit. I'm not a big reader just yet, but it's a habit I'd like to develop over time.",
    image: "/images/about/placeholders/reading.svg",
    width: "small",
  },
];

export function AboutMe() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-24 md:px-8 md:py-32"
    >
      <AboutIntro />
      <AboutStoryTrack />
      <AboutLookingAhead />
    </section>
  );
}

function AboutIntro() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] md:gap-14">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated">
          <Image
            src={PLACEHOLDER_PORTRAIT}
            alt=""
            fill
            sizes="(min-width: 768px) 420px, 90vw"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
            A little about me
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-[1.08] text-fg md:text-[2.5rem]">
            Old-school taste. Always something new to explore.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted md:text-lg">
            Outside work, I like having something to work towards, something to
            explore, and something to get lost in.
          </p>
        </div>
      </div>
    </div>
  );
}

function AboutStoryTrack() {
  const trackRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-story-card]");
    const step = card?.offsetWidth ?? 320;
    el.scrollBy({ left: direction * (step + 24), behavior: "smooth" });
  };

  return (
    <div className="relative mx-auto mt-20 max-w-6xl md:mt-28">
      <div className="mx-auto flex max-w-5xl items-end justify-between gap-6 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle">
          Six small stories
        </p>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => scrollByCard(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg-muted transition-colors duration-150 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Next story"
            onClick={() => scrollByCard(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated text-fg-muted transition-colors duration-150 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* The track. Overflow is contained inside this element so the page
          itself never gets a horizontal scrollbar. Keyboard viewers advance
          via the Prev/Next buttons above the track, which focus naturally. */}
      <section
        ref={trackRef}
        className="about-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-6 md:gap-8 md:px-8"
        aria-label="Personal stories"
      >
        {STORIES.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
        {/* Right-side spacer so the last card can snap flush to the left edge. */}
        <div
          aria-hidden="true"
          className="shrink-0"
          style={{ width: "4rem" }}
        />
      </section>

      {/* Progress bar */}
      <div className="mx-auto mt-2 max-w-5xl px-6 md:px-8">
        <div className="h-px w-full bg-border">
          <div
            className="h-px bg-accent transition-[width] duration-150 ease-out"
            style={{ width: `${Math.min(100, Math.max(4, progress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  const widthClass =
    story.width === "wide"
      ? "basis-[22rem] md:basis-[32rem]"
      : story.width === "small"
        ? "basis-[18rem] md:basis-[22rem]"
        : "basis-[20rem] md:basis-[26rem]";

  return (
    <article
      data-story-card
      className={`group shrink-0 snap-start ${widthClass}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 768px) 420px, 85vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <h3 className="mt-5 font-serif text-xl leading-tight text-fg md:text-2xl">
        {story.heading}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
        {story.copy}
      </p>
    </article>
  );
}

function AboutLookingAhead() {
  return (
    <div className="mx-auto mt-28 max-w-3xl md:mt-32">
      <div className="rounded-2xl border border-border bg-bg-elevated p-8 md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          Looking ahead
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-tight text-fg md:text-3xl">
          Financial products, from the ground up.
        </h3>
        <p className="mt-5 text-base leading-relaxed text-fg-muted md:text-lg">
          Lately, I&apos;ve been spending more time learning about payments,
          lending, and the infrastructure behind them. I&apos;m especially
          curious about GIFT City and its financial ecosystem. Over the next
          five years, I&apos;d like to work within this ecosystem and explore
          how we can build consumer-facing financial products for retail
          investors.
        </p>
      </div>
    </div>
  );
}
