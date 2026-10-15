"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// About fold — personal storytelling only. Dark, edge-to-edge fold with
// a left-panel intro and a right-panel horizontally-scrolling story
// track. A calmer "Looking Ahead" panel sits beneath on the cream
// surface, so the About fold ends on something quieter before the
// Contact fold.
//
// This fold deliberately breaks the single light theme — treat it as a
// scoped exception, same pattern the Lab fold uses, confined to this
// component. The rest of the site stays on cream.

type Story = {
  id: string;
  category: string;
  heading: string;
  copy: string;
  image: string;
};

const PORTRAIT = "/images/about/placeholders/portrait.webp";

const STORIES: Story[] = [
  {
    id: "fitness",
    category: "Fitness",
    heading: "Building a hybrid athlete.",
    copy: "I'm working towards becoming a hybrid athlete. I recently took part in HYROX Delhi and am now training for my next race in Noida this January.",
    image: "/images/about/placeholders/fitness.webp",
  },
  {
    id: "music",
    category: "Music",
    heading: "Musician at heart.",
    copy: "I play multiple instruments, with a special focus on the guitar.",
    image: "/images/about/placeholders/music.webp",
  },
  {
    id: "goa",
    category: "Goa",
    heading: "A different side of Goa.",
    copy: "I graduated from BITS Goa in 2025. Some of my favourite memories are of discovering a quieter side of the state, away from the usual tourist trail. If you ever get a month there, rent a two-wheeler, skip the fixed itinerary, and see where you end up.",
    image: "/images/about/placeholders/goa.webp",
  },
  {
    id: "motorcycle",
    category: "Retro aesthetics",
    heading: "Old-school by choice.",
    copy: "I'm drawn to retro bikes, classic cars, and vintage fashion. My GT650 is one of my favourite purchases. I'm not looking to build a collection of bikes. I just love the idea of taking it to new cities and exploring at my own pace.",
    image: "/images/about/placeholders/motorcycle.webp",
  },
  {
    id: "fifa",
    category: "FIFA",
    heading: "FIFA over football.",
    copy: "I don't follow football much, but I'm always up for a game of FIFA with friends.",
    image: "/images/about/placeholders/fifa.webp",
  },
  {
    id: "reading",
    category: "Reading",
    heading: "Building a reading habit.",
    copy: "I'm trying to build a more regular reading habit. I'm not a big reader just yet, but it's a habit I'd like to develop over time.",
    image: "/images/about/placeholders/reading.webp",
  },
];

export function AboutMe() {
  return (
    <>
      <section
        id="about"
        className="relative overflow-hidden bg-[#0E1A14] text-[#F3EEE2]"
      >
        <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
          <AboutIntro />
          <AboutStoryTrack />
        </div>
      </section>
      <AboutLookingAhead />
    </>
  );
}

function AboutIntro() {
  return (
    <div className="relative isolate flex min-h-[520px] flex-col justify-between overflow-hidden p-8 md:p-12 lg:min-h-[720px]">
      {/* Portrait fills the panel as a background; a scrim keeps text
          readable without washing out the photo. */}
      <Image
        src={PORTRAIT}
        alt=""
        fill
        sizes="(min-width: 1024px) 42vw, 100vw"
        className="-z-10 object-cover object-right-top"
        priority={false}
      />
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0 bg-gradient-to-r from-[#0E1A14] via-[#0E1A14]/80 to-[#0E1A14]/10"
      />

      <div className="max-w-md">
        <p className="font-mono text-xs tracking-[0.3em] text-[#F3EEE2]/60">
          06 &nbsp;/&nbsp; ABOUT ME
        </p>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-[#F3EEE2]/60">
          A little about me
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-[#F3EEE2] md:text-5xl">
          Old-school taste. Always something new to explore.
        </h2>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#F3EEE2]/75 md:text-base">
          Outside work, I like having something to work towards, something to
          explore, and something to get lost in.
        </p>
      </div>

      {/* Handwritten closer, pinned to the bottom of the panel to echo the
          reference layout. Uses the --font-hand variable so a reduced-font
          build still falls back cleanly to a cursive system font. */}
      <p
        className="mt-10 max-w-xs text-base italic leading-snug text-[#D9D0B8]/85 md:text-lg"
        style={{ fontFamily: "var(--font-hand), 'Caveat', cursive" }}
      >
        Exploring new places, new ideas, and a better version of myself.
      </p>
    </div>
  );
}

function AboutStoryTrack() {
  const trackRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
      setActiveIndex(Math.round(p * (STORIES.length - 1)));
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
    const step = card?.offsetWidth ?? 260;
    el.scrollBy({ left: direction * (step + 16), behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col px-6 pt-10 pb-8 md:px-8 lg:pt-14 lg:pb-10">
      {/* Prev / Next shown on the intro side's bottom-left in the ref,
          but we repeat them in-panel here so touch viewers who skip the
          intro also have affordances. */}
      <div className="flex items-center justify-end gap-2 pb-6">
        <button
          type="button"
          aria-label="Previous story"
          onClick={() => scrollByCard(-1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F3EEE2]/25 text-[#F3EEE2] transition-colors duration-150 hover:border-[#F3EEE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3EEE2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1A14]"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          aria-label="Next story"
          onClick={() => scrollByCard(1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F3EEE2]/25 text-[#F3EEE2] transition-colors duration-150 hover:border-[#F3EEE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3EEE2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1A14]"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* The horizontal track. Overflow is contained inside this element so
          the page itself never gets a horizontal scrollbar. */}
      <section
        ref={trackRef}
        className="about-track flex grow snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pr-10 md:gap-5"
        aria-label="Personal stories"
      >
        {STORIES.map((story, i) => (
          <StoryCard key={story.id} story={story} index={i} />
        ))}
        <div
          aria-hidden="true"
          className="shrink-0"
          style={{ width: "2rem" }}
        />
      </section>

      {/* Bottom bar: counter · segmented progress · scroll hint */}
      <div className="mt-6 flex items-center gap-6 text-xs">
        <span className="font-mono tracking-[0.2em] text-[#F3EEE2]/70">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(STORIES.length).padStart(2, "0")}
        </span>
        <div className="flex grow items-center gap-1.5">
          {STORIES.map((s, i) => (
            <span
              key={s.id}
              className={`h-px grow transition-colors duration-200 ${
                i <= activeIndex ? "bg-[#F3EEE2]" : "bg-[#F3EEE2]/20"
              }`}
            />
          ))}
        </div>
        <span className="hidden items-center gap-2 font-mono tracking-[0.2em] text-[#F3EEE2]/60 md:inline-flex">
          SCROLL TO EXPLORE
          <span
            aria-hidden="true"
            className="inline-block h-4 w-[14px] rounded-full border border-[#F3EEE2]/60"
          />
        </span>
      </div>

      {/* Visual progress fill under the segments */}
      <div className="mt-2 h-px w-full bg-[#F3EEE2]/10">
        <div
          className="h-px bg-[#F3EEE2]/70 transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(4, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}

function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <article
      data-story-card
      className="group relative flex shrink-0 basis-[14rem] snap-start flex-col overflow-hidden rounded-md bg-[#141F19] md:basis-[16rem]"
    >
      {/* Hero image (top ~65%) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={story.image}
          alt=""
          fill
          sizes="(min-width: 768px) 260px, 60vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-[#F3EEE2]/70">
          {String(index + 1).padStart(2, "0")} / 06
        </span>
      </div>

      {/* Copy block */}
      <div className="flex grow flex-col gap-3 p-4 md:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F3EEE2]/55">
          {story.category}
        </p>
        <h3 className="font-serif text-lg leading-tight text-[#F3EEE2] md:text-xl">
          {story.heading}
        </h3>
        <p className="text-xs leading-relaxed text-[#F3EEE2]/70 md:text-sm">
          {story.copy}
        </p>
        <span
          aria-hidden="true"
          className="mt-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#F3EEE2]/25 text-[#F3EEE2]/80 transition-colors duration-150 group-hover:border-[#F3EEE2]"
        >
          →
        </span>
      </div>
    </article>
  );
}

function AboutLookingAhead() {
  return (
    <div className="bg-bg px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] md:gap-14">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Looking ahead
            </p>
            <h3 className="mt-4 font-serif text-3xl leading-tight text-fg md:text-[2.25rem]">
              Financial products, from the ground up.
            </h3>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
              Lately, I&apos;ve been spending more time learning about payments,
              lending, and the infrastructure behind them. I&apos;m especially
              curious about GIFT City and its financial ecosystem. Over the next
              five years, I&apos;d like to work within this ecosystem and
              explore how we can build consumer-facing financial products for
              retail investors.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-bg-elevated">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-fg-subtle">
                placeholder — GIFT City / fintech
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
