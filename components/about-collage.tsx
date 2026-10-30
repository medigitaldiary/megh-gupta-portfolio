"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { ABOUT_VOX_CHAPTERS, framesFor } from "@/lib/about-vox";
import "./about-collage.css";

const CUTS = ["a", "b", "c", "d", "e", "f"] as const;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function unitNoise(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function outwardSide(x: number, y: number) {
  const dx = x - 50;
  const dy = y - 50;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "top" : "bottom";
}

function pinToFrame(
  point: { x: number; y: number },
  frame: { x0: number; x1: number; y0: number; y1: number },
) {
  if (point.x > 30 && point.x < 70) point.x = point.x < 50 ? 22 : 78;
  point.x = clamp(point.x, frame.x0, frame.x1);
  point.y = clamp(point.y, frame.y0, frame.y1);
}

function separatePrints(
  points: { x: number; y: number }[],
  frame: { x0: number; x1: number; y0: number; y1: number },
  rx: number,
  ry: number,
) {
  for (let iter = 0; iter < 28; iter++) {
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      if (!a) continue;
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        if (!b) continue;
        const nx = (b.x - a.x) / rx;
        const ny = (b.y - a.y) / ry;
        const d2 = nx * nx + ny * ny;
        if (d2 >= 1 || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const push = (1 - d) * 0.55;
        a.x -= (nx / d) * push * rx;
        a.y -= (ny / d) * push * ry;
        b.x += (nx / d) * push * rx;
        b.y += (ny / d) * push * ry;
      }
      pinToFrame(a, frame);
    }
  }
}

function scatterAroundSlip(
  count: number,
  pockets: { x: number; y: number }[],
  frame: { x0: number; x1: number; y0: number; y1: number },
  rx: number,
  ry: number,
) {
  const points = Array.from({ length: count }, (_, i) => {
    const pocket = pockets[i % pockets.length] ?? { x: 12, y: 22 };
    const point = {
      x: pocket.x + (unitNoise(i * 2.1) - 0.5) * 3,
      y: pocket.y + (unitNoise(i * 5.7) - 0.5) * 2.4,
    };
    pinToFrame(point, frame);
    return point;
  });
  separatePrints(points, frame, rx, ry);
  return points;
}

function layoutPrints(count: number) {
  const desk = scatterAroundSlip(
    count,
    [
      { x: 12, y: 18 },
      { x: 88, y: 18 },
      { x: 11, y: 40 },
      { x: 89, y: 40 },
      { x: 12, y: 62 },
      { x: 88, y: 62 },
      { x: 16, y: 86 },
      { x: 84, y: 86 },
      { x: 24, y: 28 },
      { x: 76, y: 28 },
      { x: 24, y: 74 },
      { x: 76, y: 74 },
    ],
    { x0: 10, x1: 90, y0: 14, y1: 88 },
    16,
    23,
  );
  const phone = scatterAroundSlip(
    count,
    [
      { x: 14, y: 18 },
      { x: 86, y: 18 },
      { x: 13, y: 40 },
      { x: 87, y: 40 },
      { x: 14, y: 62 },
      { x: 86, y: 62 },
      { x: 18, y: 84 },
      { x: 82, y: 84 },
      { x: 24, y: 28 },
      { x: 76, y: 28 },
      { x: 24, y: 74 },
      { x: 76, y: 74 },
    ],
    { x0: 12, x1: 88, y0: 16, y1: 86 },
    18,
    24,
  );

  return Array.from({ length: count }, (_, i) => {
    const pileA = (i / count) * Math.PI * 2;
    const sign = i % 2 === 0 ? -1 : 1;
    const spot = desk[i] ?? { x: 12, y: 20 };
    const mobile = phone[i] ?? { x: 14, y: 22 };
    const x = spot.x;
    const y = spot.y;
    const mx = mobile.x;
    const my = mobile.y;
    const onTop = y < 50;

    return {
      z: i + 1,
      mz: onTop ? 4 + (i % 5) : 8 + (i % 4),
      tape: i % 3 === 1,
      cut: CUTS[i % CUTS.length],
      px: `${(50 + Math.cos(pileA) * 2.8).toFixed(2)}%`,
      py: `${(48 + Math.sin(pileA) * 2.4).toFixed(2)}%`,
      pr: `${(sign * (3 + (i % 5) * 1.4)).toFixed(1)}deg`,
      pw: "12.4rem",
      fx: `${x.toFixed(2)}%`,
      fy: `${y.toFixed(2)}%`,
      fr: `${(sign * (5 + (i % 4) * 1.2)).toFixed(1)}deg`,
      fw: "8.85rem",
      side: outwardSide(x, y),
      band: onTop ? "top" : "bottom",
      mfx: `${mx.toFixed(2)}%`,
      mfy: `${my.toFixed(2)}%`,
      mfr: `${(sign * (6 + (i % 3) * 2.2)).toFixed(1)}deg`,
      mfw: "5.85rem",
      floatDelay: `${(-i * 0.67).toFixed(2)}s`,
      floatDur: `${(4.2 + (i % 5) * 0.55).toFixed(2)}s`,
    };
  });
}

function boxesOverlap(a: DOMRect, b: DOMRect, pad = 8) {
  return (
    a.left < b.right - pad &&
    a.right > b.left + pad &&
    a.top < b.bottom - pad &&
    a.bottom > b.top + pad
  );
}

function pinTipInView(figure: HTMLElement) {
  const tip = figure.querySelector(".about-tip");
  if (!(tip instanceof HTMLElement)) return;
  const stage = figure.closest(".about-collage-stage");
  const slip = figure.closest(".about-collage")?.querySelector(".about-slip");
  const stageBox =
    stage instanceof HTMLElement ? stage.getBoundingClientRect() : null;
  const slipBox =
    slip instanceof HTMLElement ? slip.getBoundingClientRect() : null;
  const pad = 8;
  const home = figure.dataset.homeSide ?? figure.dataset.side ?? "on";
  if (!figure.dataset.homeSide) figure.dataset.homeSide = home;
  const cover =
    figure.getBoundingClientRect().top > window.innerHeight * 0.45
      ? "cover-top"
      : "cover-bottom";
  const order = [
    home,
    "right",
    "left",
    "bottom",
    "top",
    cover,
    "cover-top",
    "cover-bottom",
  ].filter((side, index, all) => all.indexOf(side) === index);
  for (const side of order) {
    figure.dataset.side = side;
    const box = tip.getBoundingClientRect();
    const inFrame = stageBox
      ? box.top >= stageBox.top + pad &&
        box.left >= stageBox.left + pad &&
        box.bottom <= stageBox.bottom - pad &&
        box.right <= stageBox.right - pad
      : box.top >= pad &&
        box.left >= pad &&
        box.bottom <= window.innerHeight - pad &&
        box.right <= window.innerWidth - pad;
    if (inFrame && !(slipBox && boxesOverlap(box, slipBox))) return;
  }
  figure.dataset.side = cover;
}

const PRINT_LAYOUTS = layoutPrints(ABOUT_VOX_CHAPTERS.length);

const PIECES = ABOUT_VOX_CHAPTERS.map((chapter, i) => ({
  ...chapter,
  ...PRINT_LAYOUTS[i],
  cut: chapter.cut || CUTS[i % CUTS.length],
}));

export function AboutCollage() {
  const rootRef = useRef<HTMLElement>(null);
  const pausedRef = useRef(false);
  const [openTip, setOpenTip] = useState<string | null>(null);
  const [deskOpen, setDeskOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState<Record<string, number>>({});

  pausedRef.current = openTip !== null;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setStatic = () => {
      root.style.setProperty("--p", "1");
      root.dataset.open = "true";
      setDeskOpen(true);
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
    let latched = false;
    const update = () => {
      frame = 0;
      if (latched) {
        root.style.setProperty("--p", "1");
        root.dataset.open = "true";
        setDeskOpen(true);
        return;
      }
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
      if (p >= 0.62) {
        latched = true;
        root.style.setProperty("--p", "1");
        root.dataset.open = "true";
        setDeskOpen(true);
        return;
      }
      root.style.setProperty("--p", p.toFixed(4));
      root.dataset.open = "false";
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || root.contains(event.target))
        return;
      setOpenTip(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
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
      document.removeEventListener("pointerdown", onPointerDown);
      reduce.removeEventListener("change", onChange);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!deskOpen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const left = PIECES.filter(
      (piece) => parseFloat(piece.fx) < 50 && framesFor(piece).length > 1,
    ).map((piece) => piece.id);
    const right = PIECES.filter(
      (piece) => parseFloat(piece.fx) >= 50 && framesFor(piece).length > 1,
    ).map((piece) => piece.id);
    if (left.length === 0 && right.length === 0) return;

    let lastLeft: string | null = null;
    let lastRight: string | null = null;

    const pick = (pool: string[], last: string | null) => {
      if (pool.length === 0) return null;
      const fresh = pool.filter((id) => id !== last);
      const source = fresh.length > 0 ? fresh : pool;
      return source[Math.floor(Math.random() * source.length)] ?? source[0];
    };

    const tick = () => {
      if (pausedRef.current) return;
      const leftId = pick(left, lastLeft);
      const rightId = pick(right, lastRight);
      const ids = [leftId, rightId].filter((id): id is string => Boolean(id));
      if (ids.length === 0) return;
      lastLeft = leftId;
      lastRight = rightId;
      setFrameIndex((prev) => {
        const next = { ...prev };
        for (const id of ids) {
          const piece = PIECES.find((entry) => entry.id === id);
          const stack = piece ? framesFor(piece) : [];
          if (stack.length < 2) continue;
          next[id] = ((prev[id] ?? 0) + 1) % stack.length;
        }
        return next;
      });
    };

    const fadeMs = 900;
    const gapMs = 1000;
    const start = window.setTimeout(tick, 1600);
    const pulse = window.setInterval(tick, fadeMs + gapMs);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(pulse);
    };
  }, [deskOpen]);

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
              data-band={piece.band}
              data-tip={openTip === piece.id ? "true" : undefined}
              onMouseEnter={(event) => {
                setOpenTip(piece.id);
                const figure = event.currentTarget;
                window.requestAnimationFrame(() => pinTipInView(figure));
              }}
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
                  "--mz": piece.mz,
                  "--mfx": piece.mfx,
                  "--mfy": piece.mfy,
                  "--mfr": piece.mfr,
                  "--mfw": piece.mfw,
                  "--float-delay": piece.floatDelay,
                  "--float-dur": piece.floatDur,
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
                onClick={(event) => {
                  // Mouse click must not pin the tip; hover already shows it.
                  if (window.matchMedia("(hover: hover)").matches) {
                    setOpenTip(null);
                    event.currentTarget.blur();
                    return;
                  }
                  setOpenTip((id) => (id === piece.id ? null : piece.id));
                  const figure = event.currentTarget.closest("figure");
                  if (figure instanceof HTMLElement) {
                    window.requestAnimationFrame(() => pinTipInView(figure));
                  }
                }}
              >
                <div className="about-sticker">
                  <div
                    className={
                      framesFor(piece).length > 1
                        ? "about-sticker-photo is-stack"
                        : "about-sticker-photo"
                    }
                    style={
                      {
                        aspectRatio: `${piece.width} / ${piece.height}`,
                      } as CSSProperties
                    }
                  >
                    {framesFor(piece).map((frame, i) => (
                      <Image
                        key={frame.src}
                        src={frame.src}
                        alt={i === (frameIndex[piece.id] ?? 0) ? frame.alt : ""}
                        width={frame.width}
                        height={frame.height}
                        sizes="(min-width: 768px) 15rem, 9rem"
                        className={
                          i === (frameIndex[piece.id] ?? 0)
                            ? "is-on"
                            : undefined
                        }
                      />
                    ))}
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
