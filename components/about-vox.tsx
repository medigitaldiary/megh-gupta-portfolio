"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ABOUT_VOX_CHAPTERS, type AboutVoxChapter } from "@/lib/about-vox";

const INTRO_END = 0.1;
const CHAPTER_SPAN = (1 - INTRO_END) / ABOUT_VOX_CHAPTERS.length;

function HighlightedHeadline({
  headline,
  highlight,
}: {
  headline: string;
  highlight: string;
}) {
  const i = headline.indexOf(highlight);
  if (i < 0) return <>{headline}</>;
  return (
    <>
      {headline.slice(0, i)}
      <span className="v44-mark">{highlight}</span>
      {headline.slice(i + highlight.length)}
    </>
  );
}

function Cutout({
  chapter,
  priority,
}: {
  chapter: AboutVoxChapter;
  priority: boolean;
}) {
  return (
    <figure className={`v44-cutout v44-cut-${chapter.cut}`}>
      <div className="v44-tape" aria-hidden="true" />
      <div className="v44-paper">
        <Image
          src={chapter.src}
          alt={chapter.alt}
          width={chapter.width}
          height={chapter.height}
          sizes="(min-width: 768px) 42vw, 86vw"
          priority={priority}
        />
      </div>
    </figure>
  );
}

export function AboutVox() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduce = () => {
      if (reduce.matches) {
        root.dataset.reduced = "true";
        root.style.setProperty("--p", "0");
        return true;
      }
      root.dataset.reduced = "false";
      return false;
    };

    if (applyReduce()) {
      const onChange = () => applyReduce();
      reduce.addEventListener("change", onChange);
      return () => reduce.removeEventListener("change", onChange);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const total = root.offsetHeight - window.innerHeight;
      if (total <= 0) {
        root.style.setProperty("--p", "0");
        return;
      }
      const p = Math.min(
        1,
        Math.max(0, -root.getBoundingClientRect().top / total),
      );
      root.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const onChange = () => {
      if (applyReduce()) return;
      update();
    };
    reduce.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onChange);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="v44-desk" style={{ ["--p" as string]: "0" }}>
      <div className="v44-track">
        <div className="v44-stage">
          <div className="v44-camera" aria-hidden="true">
            <span className="v44-bar v44-bar-1" />
            <span className="v44-bar v44-bar-2" />
            <span className="v44-bar v44-bar-3" />
          </div>

          <section
            className="v44-intro"
            style={{
              ["--start" as string]: "0",
              ["--end" as string]: String(INTRO_END + CHAPTER_SPAN * 0.4),
            }}
          >
            <p className="v44-kicker">About</p>
            <h1 className="v44-display">
              A bit about <span className="v44-mark">me.</span>
            </h1>
            <p className="v44-lede">
              Product manager at the fintech × AI-tooling intersection. Founding
              PM at BondScanner. Before that, platform PM at Ultra.
            </p>
            <p className="v44-note">
              Scroll. Each page is a cut-out on the desk.
            </p>
          </section>

          {ABOUT_VOX_CHAPTERS.map((chapter, index) => {
            const start = INTRO_END + index * CHAPTER_SPAN;
            const end = INTRO_END + (index + 1) * CHAPTER_SPAN;
            const odd = index % 2 === 1;
            return (
              <section
                key={chapter.id}
                className={`v44-chapter${odd ? " v44-chapter-flip" : ""}`}
                style={{
                  ["--start" as string]: start.toFixed(4),
                  ["--end" as string]: end.toFixed(4),
                }}
                aria-label={chapter.headline}
              >
                <Cutout chapter={chapter} priority={index === 0} />
                <div className="v44-copy">
                  <p className="v44-kicker">{chapter.kicker}</p>
                  <h2 className="v44-headline">
                    <HighlightedHeadline
                      headline={chapter.headline}
                      highlight={chapter.highlight}
                    />
                  </h2>
                  <p className="v44-caption">{chapter.caption}</p>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
