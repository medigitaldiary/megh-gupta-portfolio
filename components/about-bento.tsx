"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";
import { type FoldFlow, FoldLeadOut } from "@/components/fold-flow";

// Fold 4 (bento variant): person. Would I want to work with them?
// A row of mixed-size cards drifts right to left on a loop, the way a
// moodboard reads: big photos, small type cards, one pattern tile.
// The row is drawn twice back to back; the track slides by half its own
// width, so the second copy lands where the first began and the seam
// never shows. Hover, keyboard focus and the Pause button all hold it.
// Reduced motion: no drift, the row becomes a plain horizontal scroll.

type Photo = { src: string; alt: string; position?: string };

type Card =
  | {
      kind: "photo";
      photo: Photo;
      /** Big word top-left, small line bottom-right. */
      title?: string;
      note?: string;
    }
  | { kind: "framed"; photo: Photo; top: string; bottom: string }
  | { kind: "type"; label: string; thumbs?: Photo[] }
  | { kind: "places"; places: [string, string, string] }
  | { kind: "split"; photo: Photo; words: [string, string, string] }
  | { kind: "inset"; photo: Photo; caption: string }
  | { kind: "pattern"; label: string };

type Column = { id: string } & (
  | { size: "big"; card: Card }
  | { size: "wide"; card: Card }
  | { size: "stack"; top?: Card; bottom?: Card }
);

const P = {
  bike: {
    src: "/images/about/gt650.webp",
    alt: "Megh standing over a green GT650 motorcycle in front of a gated house.",
    position: "50% 35%",
  },
  hyrox: {
    src: "/images/about/hyrox.webp",
    alt: "Megh flexing in a HYROX Delhi shirt after the race.",
    position: "50% 30%",
  },
  guitar: {
    src: "/images/about/guitar.webp",
    alt: "Megh playing an acoustic guitar on stage, leaning into a microphone.",
    position: "50% 40%",
  },
  camera: {
    src: "/images/about/camera.webp",
    alt: "Megh taking a mirror self-portrait with a camera, wearing a red bandana.",
    position: "50% 35%",
  },
  goa: {
    src: "/images/about/goa-convocation.webp",
    alt: "Megh in BITS Pilani Goa convocation robes in front of campus.",
  },
  studio: {
    src: "/images/about/studio-tank.webp",
    alt: "Megh in a black tank top under studio light.",
    position: "50% 25%",
  },
  horse: {
    src: "/images/about/horse.webp",
    alt: "Megh riding a horse through tall trees and green hills.",
  },
  wedding: {
    src: "/images/about/wedding-tent.webp",
    alt: "Megh in a kurta and sunglasses at a wedding tent.",
    position: "50% 30%",
  },
  lilac: {
    src: "/images/about/lilac-suit.webp",
    alt: "Megh in a lilac suit on stone stairs.",
    position: "50% 30%",
  },
  festive: {
    src: "/images/about/festive-kurta-crop.webp",
    alt: "Megh in a green kurta on a festive night.",
    position: "50% 30%",
  },
} satisfies Record<string, Photo>;

const COLUMNS: Column[] = [
  {
    id: "bike",
    size: "big",
    card: {
      kind: "photo",
      photo: P.bike,
      title: "GT650",
      note: "New cities at my own pace",
    },
  },
  {
    id: "off-clock",
    size: "stack",
    top: {
      kind: "type",
      label: "Off the clock",
      thumbs: [P.horse, P.camera, P.festive],
    },
  },
  {
    id: "goa",
    size: "big",
    card: { kind: "framed", photo: P.goa, top: "2025", bottom: "BITS Goa" },
  },
  {
    id: "guitar",
    size: "stack",
    top: { kind: "photo", photo: P.guitar, title: "Guitar" },
    bottom: { kind: "places", places: ["Bangalore", "Goa", "Delhi"] },
  },
  {
    id: "read-run-build",
    size: "wide",
    card: { kind: "split", photo: P.studio, words: ["Read", "Run", "Build"] },
  },
  {
    id: "lilac",
    size: "stack",
    top: { kind: "photo", photo: P.lilac },
    bottom: {
      kind: "inset",
      photo: P.camera,
      caption: "Shooting the days I actually want to keep.",
    },
  },
  {
    id: "pattern",
    size: "stack",
    bottom: { kind: "pattern", label: "Wedding season" },
  },
  {
    id: "hyrox",
    size: "big",
    card: {
      kind: "photo",
      photo: P.hyrox,
      title: "HYROX",
      note: "Delhi done. Noida next",
    },
  },
  {
    id: "wedding",
    size: "stack",
    top: { kind: "photo", photo: P.wedding },
    bottom: { kind: "type", label: "Fintech × AI tooling" },
  },
];

// Pine-tinted scrim so oatmeal type holds contrast on any photo.
const SCRIM =
  "bg-[linear-gradient(180deg,rgba(31,59,46,0.55)_0%,rgba(31,59,46,0)_38%,rgba(31,59,46,0)_45%,rgba(31,59,46,0.88)_100%)]";

function Fill({ photo, sizes }: { photo: Photo; sizes: string }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      className="object-cover"
      style={photo.position ? { objectPosition: photo.position } : undefined}
    />
  );
}

function Frame({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] ${className}`}>
      {children}
    </div>
  );
}

// Card surfaces flip with the fold. On pine, type cards lift to
// pine-elevated and cream panels stay oatmeal. On oatmeal, type cards turn
// solid pine (the dark tiles in the reference) and cream panels lift to
// --bg-elevated with a toasted-oat hairline so they don't melt into the page.
function surfaces(onPine: boolean) {
  return {
    ink: onPine ? "bg-bg-elevated" : "tone-pine bg-bg",
    cream: onPine
      ? "tone-oat bg-bg"
      : "tone-oat bg-bg-elevated ring-1 ring-border ring-inset",
  };
}

function CardBody({
  card,
  big,
  onPine,
}: {
  card: Card;
  big: boolean;
  onPine: boolean;
}) {
  const { ink, cream } = surfaces(onPine);
  const sizes = big
    ? "(min-width: 768px) 18rem, 12rem"
    : "(min-width: 768px) 9rem, 6rem";
  switch (card.kind) {
    case "photo":
      return (
        <>
          <Fill photo={card.photo} sizes={sizes} />
          {(card.title || card.note) && (
            // Small line top-right, big word bottom-left: type stays off faces.
            <div
              className={`tone-pine absolute inset-0 flex flex-col justify-end p-3 md:p-4 ${SCRIM}`}
            >
              {card.note && (
                <span className="mb-auto max-w-[11rem] self-end text-right text-sm leading-tight text-fg md:text-lg">
                  {card.note}
                </span>
              )}
              <span
                className={`font-display leading-none tracking-[-0.04em] text-fg ${
                  big
                    ? "text-[2.75rem] md:text-[4.5rem]"
                    : "text-2xl md:text-4xl"
                }`}
              >
                {card.title}
              </span>
            </div>
          )}
        </>
      );
    case "framed":
      // Words sit on the lilac mat, not over the face.
      return (
        <div className="tone-oat absolute inset-0 flex flex-col items-center bg-highlight px-[14%] text-fg">
          <span className="flex h-[16%] items-center font-display text-lg leading-none md:text-3xl">
            {card.top}
          </span>
          <div className="relative w-full flex-1 overflow-hidden rounded-[4px]">
            <Fill photo={card.photo} sizes="(min-width: 768px) 13rem, 9rem" />
          </div>
          <span className="flex h-[16%] items-center font-mono text-[10px] uppercase tracking-[0.16em] md:text-xs">
            {card.bottom}
          </span>
        </div>
      );
    case "type":
      return (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-3 md:p-4 ${ink}`}
        >
          <span className="font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-fg md:text-xs">
            {card.label}
          </span>
          {card.thumbs && (
            <span className="flex gap-1.5">
              {card.thumbs.map((t) => (
                <span
                  key={t.src}
                  className="relative size-6 overflow-hidden rounded-[4px] md:size-9"
                >
                  <Image
                    src={t.src}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
              ))}
            </span>
          )}
        </div>
      );
    case "places":
      return (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-3 font-mono ${ink} text-[10px] uppercase tracking-[0.16em] text-fg md:p-4 md:text-xs`}
        >
          <span>{card.places[0]}</span>
          <span className="self-center">{card.places[1]}</span>
          <span className="self-end">{card.places[2]}</span>
        </div>
      );
    case "split":
      return (
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="relative">
            <Fill photo={card.photo} sizes="(min-width: 768px) 13.5rem, 9rem" />
          </div>
          <div
            className={`flex flex-col justify-between px-4 py-5 font-display text-xl text-fg md:px-6 md:py-8 md:text-3xl ${cream}`}
          >
            <span>{card.words[0]}</span>
            <span>{card.words[1]}</span>
            <span>{card.words[2]}</span>
          </div>
        </div>
      );
    case "inset":
      return (
        <div
          className={`absolute inset-0 flex flex-col items-center gap-1.5 p-2 md:gap-2 md:p-3 ${cream}`}
        >
          <span className="relative h-1/2 w-full overflow-hidden rounded-full">
            <Fill photo={card.photo} sizes="(min-width: 768px) 8rem, 6rem" />
          </span>
          <span className="text-center text-[9px] leading-tight text-fg md:text-xs">
            {card.caption}
          </span>
        </div>
      );
    case "pattern":
      return (
        <div className={`absolute inset-0 ${cream}`}>
          <span className="absolute top-2 left-0 w-full text-center font-mono text-[9px] uppercase tracking-[0.16em] text-fg md:top-3 md:text-[11px]">
            {card.label}
          </span>
          {/* Scallops: rows of half-discs, drawn in currentColor (pine). */}
          <svg
            aria-hidden="true"
            viewBox="0 0 96 60"
            preserveAspectRatio="xMidYMax slice"
            className="absolute inset-x-0 bottom-0 h-3/5 w-full text-fg"
          >
            {[0, 1, 2].map((row) =>
              [0, 1, 2, 3, 4].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={col * 24 + (row % 2 ? 0 : 12)}
                  cy={row * 20 + 20}
                  r={12}
                  fill="currentColor"
                />
              )),
            )}
          </svg>
        </div>
      );
  }
}

function Strip({ copy, onPine }: { copy: number; onPine: boolean }) {
  return (
    // Every copy carries a trailing gap (pr) equal to the column gap, so
    // two copies side by side are exactly twice one copy: -50% is seamless.
    <ul
      className="flex shrink-0 items-start gap-[var(--g)] pr-[var(--g)]"
      aria-hidden={copy > 0 ? true : undefined}
      data-copy={copy}
    >
      {COLUMNS.map((col) => (
        <li key={col.id} className="shrink-0">
          {col.size === "big" && (
            <Frame className="size-[var(--h)]">
              <CardBody card={col.card} big onPine={onPine} />
            </Frame>
          )}
          {col.size === "wide" && (
            <Frame className="h-[var(--h)] w-[calc(var(--h)*1.5)]">
              <CardBody card={col.card} big onPine={onPine} />
            </Frame>
          )}
          {col.size === "stack" && (
            <div className="flex h-[var(--h)] w-[calc((var(--h)-var(--g))/2)] flex-col justify-between">
              {col.top ? (
                <Frame className="size-[calc((var(--h)-var(--g))/2)]">
                  <CardBody card={col.top} big={false} onPine={onPine} />
                </Frame>
              ) : (
                <span />
              )}
              {col.bottom ? (
                <Frame className="size-[calc((var(--h)-var(--g))/2)]">
                  <CardBody card={col.bottom} big={false} onPine={onPine} />
                </Frame>
              ) : (
                <span />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function AboutBento({
  flow,
}: {
  /** Fold-flow previews: chapter number, pine tone, handoff. */
  flow?: FoldFlow;
} = {}) {
  const [paused, setPaused] = useState(false);
  const onPine = flow?.tone === "pine";

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={`overflow-hidden py-24 md:py-32 ${
        flow?.tone === "pine" ? "tone-pine bg-bg text-fg" : ""
      }`}
    >
      {/* Fold 4: person. Would I want to work with them? */}
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div
          data-reveal
          className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12"
        >
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-fg-muted">
              <span data-hl-word>
                {flow?.index ? `${flow.index} · About` : "About"}
              </span>
            </p>
            <h2
              id="about-heading"
              className="font-display text-3xl leading-[1.1] tracking-tight text-fg md:text-5xl"
            >
              A bit about me.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-[1.6] text-fg-muted">
            <p>
              I&apos;m a product manager at the fintech × AI-tooling
              intersection. Founding PM at BondScanner, where I&apos;m making
              the retail bond market feel less like a spreadsheet and more like
              an app. Before that, platform PM at Ultra: growth loops and
              reinvestment that added a real ₹50cr of AUM.
            </p>
            <p>
              Financial products in India still feel hostile to the person using
              them. That&apos;s the fix I keep chasing. Outside work: I read too
              much, run in Bangalore weather badly, and vibe-code the tools I
              wish existed.
            </p>
          </div>
        </div>
      </div>

      <div
        data-reveal
        data-paused={paused ? "true" : undefined}
        className="bento-marquee mt-12 [--g:0.75rem] [--h:12rem] md:mt-16 md:[--g:1rem] md:[--h:18rem]"
      >
        <div className="bento-track flex w-max">
          <Strip copy={0} onPine={onPine} />
          <Strip copy={1} onPine={onPine} />
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 md:mt-8 md:px-8">
        {flow?.leadOut ? (
          <FoldLeadOut {...flow.leadOut} className="" />
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="bento-toggle inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-mono text-fg-muted text-xs uppercase tracking-[0.16em] transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {paused ? (
              <path d="M8 5.5v13l10-6.5z" />
            ) : (
              <>
                <path d="M9 5.5v13" />
                <path d="M15 5.5v13" />
              </>
            )}
          </svg>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}
