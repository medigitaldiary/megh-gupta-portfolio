"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ABOUT_VOX_CHAPTERS } from "@/lib/about-vox";
import "./about-collage.css";

const CUTS = ["a", "b", "c", "d", "e", "f"] as const;

function layoutPrints(count: number) {
  const leftCount = Math.ceil(count / 2);
  const rightCount = Math.floor(count / 2);

  return Array.from({ length: count }, (_, i) => {
    const pileA = (i / count) * Math.PI * 2;
    const isLeft = i % 2 === 0;
    const indexInCol = Math.floor(i / 2);
    const colCount = isLeft ? leftCount : rightCount;
    const t = colCount <= 1 ? 0.5 : indexInCol / (colCount - 1);
    const jitter = ((i * 17) % 5) - 2;
    const sign = isLeft ? -1 : 1;
    return {
      z: i + 1,
      tape: i % 3 === 1,
      cut: CUTS[i % CUTS.length],
      px: `${(50 + Math.cos(pileA) * 2.8).toFixed(2)}%`,
      py: `${(48 + Math.sin(pileA) * 2.4).toFixed(2)}%`,
      pr: `${(sign * (3 + (i % 5) * 1.4)).toFixed(1)}deg`,
      pw: "11.6rem",
      fx: `${(isLeft ? 13.2 + jitter * 0.2 : 86.8 - jitter * 0.2).toFixed(2)}%`,
      fy: `${(18 + t * 64).toFixed(2)}%`,
      fr: `${(sign * (4 + (i % 4))).toFixed(1)}deg`,
      fw: "8.2rem",
      side: isLeft ? "right" : "left",
    };
  });
}

const PRINT_LAYOUTS = layoutPrints(ABOUT_VOX_CHAPTERS.length);

const PIECES = ABOUT_VOX_CHAPTERS.map((chapter, i) => ({
  ...chapter,
  ...PRINT_LAYOUTS[i],
  cut: chapter.cut || CUTS[i % CUTS.length],
}));

export function AboutCollage() {
  const rootRef = useRef<HTMLElement>(null);
  const [openTip, setOpenTip] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setStatic = () => {
      root.style.setProperty("--p", "1");
      root.dataset.open = "true";
    };

    if (reduce.matches) {
      setStatic();
      const onChange = () => {
        if (reduce.matches) setStatic();
      };
      reduce.addEventListener("change", onChange);
      return () => reduce.removeEventListener("change", onChange);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const total = root.offsetHeight - window.innerHeight;
      if (total <= 0) {
        root.style.setProperty("--p", "0");
        root.dataset.open = "false";
        return;
      }
      const p = Math.min(
        1,
        Math.max(0, -root.getBoundingClientRect().top / total),
      );
      root.style.setProperty("--p", p.toFixed(4));
      root.dataset.open = p >= 0.62 ? "true" : "false";
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const onChange = () => {
      if (reduce.matches) {
        setStatic();
        return;
      }
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
    <section
      ref={rootRef}
      id="about"
      className="about-collage"
      aria-labelledby="about-heading"
    >
      <div className="about-collage-stage">
        <div className="about-strips" aria-hidden="true">
          <span className="about-strip about-strip-1" />
          <span className="about-strip about-strip-2" />
          <span className="about-strip about-strip-3" />
        </div>

        <div className="about-collage-desk">
          {PIECES.map((piece) => (
            <figure
              key={piece.id}
              className={`about-cut about-cut-${piece.cut}`}
              data-side={piece.side}
              data-tip={openTip === piece.id ? "true" : undefined}
              onMouseEnter={() => setOpenTip(piece.id)}
              onMouseLeave={() =>
                setOpenTip((id) => (id === piece.id ? null : id))
              }
              style={
                {
                  "--px": piece.px,
                  "--py": piece.py,
                  "--pr": piece.pr,
                  "--pw": piece.pw,
                  "--fx": piece.fx,
                  "--fy": piece.fy,
                  "--fr": piece.fr,
                  "--fw": piece.fw,
                  "--z": piece.z,
                } as CSSProperties
              }
            >
              {piece.tape ? (
                <span className="about-cut-tape" aria-hidden="true" />
              ) : null}
              <button
                type="button"
                className="about-cut-hit"
                aria-describedby={`about-tip-${piece.id}`}
                aria-expanded={openTip === piece.id}
                onClick={() =>
                  setOpenTip((id) => (id === piece.id ? null : piece.id))
                }
              >
                <div className="about-sticker">
                  <div className="about-sticker-photo">
                    <Image
                      src={piece.src}
                      alt={piece.alt}
                      width={piece.width}
                      height={piece.height}
                      sizes="(min-width: 768px) 12rem, 7rem"
                    />
                  </div>
                </div>
              </button>
              <figcaption id={`about-tip-${piece.id}`} className="about-tip">
                <span className="about-tip-kicker">{piece.headline}</span>
                <span className="about-tip-body">{piece.tip}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="about-collage-bio">
          <article className="about-slip">
            <span className="about-slip-tape" aria-hidden="true" />
            <h2 id="about-heading" className="about-collage-title">
              A bit about me.
            </h2>
            <p className="about-collage-copy">
              I&apos;m a product manager at the{" "}
              <span className="about-collage-mark">fintech</span> × AI-tooling
              intersection. Founding PM at BondScanner, where I&apos;m making
              the retail bond market feel less like a spreadsheet and more like
              an app.
            </p>
            <p className="about-collage-copy">
              Before that I was a platform PM at Ultra, running growth loops and
              reinvestment for their alternative-investment app. The kind of
              lifecycle work that adds a real ₹50cr of AUM if you get it right.
            </p>
            <p className="about-collage-copy">
              I got into fintech because financial products in India still feel
              hostile to the person using them. That&apos;s the fix I keep
              chasing. Outside work: I read too much, run in Bangalore weather
              badly, and vibe-code the tools I wish existed.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
