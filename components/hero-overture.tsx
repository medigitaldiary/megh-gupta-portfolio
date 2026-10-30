"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/hero";
import { ProductVenn } from "@/components/product-venn";

type Phase = "boot" | "venn" | "zoom" | "land" | "done";

const PORTRAIT_R = 78;

// Opening for /preview/v3.4. The Venn draws, the portrait scales into
// the center, then the diagram leaves. The photo zooms, slides left,
// "Hi, I am Megh." writes beside it, and that same lockup travels
// into the hero fold.
export function HeroOverture() {
  const [phase, setPhase] = useState<Phase>("boot");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLParagraphElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<Phase>("boot");
  const lockupRef = useRef({
    x: 0,
    y: 0,
    size: 0,
    fontSize: 0,
    textLeft: 0,
    textTop: 0,
  });
  phaseRef.current = phase;
  const spotRef = useRef({ x: 0, y: 0, size: 0 });
  const zoomed = useRef(false);
  const revealed = useRef(false);
  const scaling = useRef(false);
  const revealRef = useRef<() => void>(() => {});
  const settleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setPhase("done");
      return;
    }
    setPhase("venn");
    document.body.style.overflow = "hidden";

    const skip = () => {
      if (phaseRef.current === "land" || phaseRef.current === "done") return;
      setPhase("done");
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  useEffect(() => {
    if (phase !== "venn") return;
    const stage = stageRef.current;
    const photo = photoRef.current;
    if (!stage || !photo) return;

    let alive = true;
    let hold = 0;

    const place = () => {
      const svg = stage.querySelector("svg");
      if (!svg) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const center = svg.createSVGPoint();
      center.x = 560;
      center.y = 445;
      const edge = svg.createSVGPoint();
      edge.x = 560 + PORTRAIT_R;
      edge.y = 445;
      const c = center.matrixTransform(ctm);
      const e = edge.matrixTransform(ctm);
      const size = Math.hypot(e.x - c.x, e.y - c.y) * 2;
      if (size <= 0) return;
      spotRef.current = { x: c.x, y: c.y, size };
      photo.style.width = `${size}px`;
      photo.style.height = `${size}px`;
      if (!revealed.current) {
        photo.style.opacity = "0";
        photo.style.transform = `translate(${c.x}px, ${c.y}px) translate(-50%, -50%) scale(0)`;
        return;
      }
      if (scaling.current) return;
      photo.style.opacity = "1";
      photo.style.transform = `translate(${c.x}px, ${c.y}px) translate(-50%, -50%) scale(1)`;
    };

    const reveal = () => {
      if (revealed.current) return;
      const { x, y, size } = spotRef.current;
      if (size <= 0) return;
      revealed.current = true;
      scaling.current = true;
      photo.style.opacity = "1";
      const from = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(0)`;
      const to = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
      photo.style.transform = from;
      const anim = photo.animate([{ transform: from }, { transform: to }], {
        duration: 720,
        easing: "cubic-bezier(.22,.8,.3,1)",
        fill: "forwards",
      });
      void anim.finished.then(() => {
        if (!alive) return;
        scaling.current = false;
        photo.style.transform = to;
        anim.cancel();
      });
    };
    revealRef.current = reveal;

    const settle = () => {
      window.clearTimeout(hold);
      hold = window.setTimeout(() => {
        if (!alive || zoomed.current) return;
        zoomed.current = true;
        setPhase("zoom");
      }, 1200);
    };
    settleRef.current = settle;

    const observer = new ResizeObserver(() => place());
    observer.observe(stage);
    place();

    const fallback = window.setTimeout(() => revealRef.current(), 9000);

    return () => {
      alive = false;
      observer.disconnect();
      window.clearTimeout(fallback);
      window.clearTimeout(hold);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "zoom") return;
    const stage = stageRef.current;
    const photo = photoRef.current;
    const line = lineRef.current;
    if (!stage || !photo || !line) return;

    const { x, y, size } = spotRef.current;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // The face grows well past its size inside the Venn, holds, then
    // settles to the greeting lockup as it slides left.
    const zoomed = Math.round(
      Math.max(size * 1.85, Math.min(window.innerWidth * 0.38, 320)),
    );
    const gapRatio = 0.41;
    const textRatio = 4.29;
    const maxRow = Math.min(window.innerWidth - 64, 600);
    const target = Math.round(maxRow / (1 + gapRatio + textRatio));
    const fontSize = Math.round(target * 0.82);
    let alive = true;

    line.style.fontSize = `${fontSize}px`;

    stage.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 560,
      easing: "ease-out",
      fill: "forwards",
    });

    photo.animate(
      [
        {
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
        },
        {
          width: `${zoomed}px`,
          height: `${zoomed}px`,
          transform: `translate(${cx}px, ${cy}px) translate(-50%, -50%)`,
        },
      ],
      { duration: 860, easing: "cubic-bezier(.22,.8,.3,1)", fill: "forwards" },
    );

    const moveTimer = window.setTimeout(() => {
      if (!alive) return;
      const textWidth = line.scrollWidth;
      const gap = target * gapRatio;
      const row = target + gap + textWidth;
      const rowLeft = Math.max(32, (window.innerWidth - row) / 2);
      const leftX = rowLeft + target / 2;
      lockupRef.current = {
        x: leftX,
        y: cy,
        size: target,
        fontSize,
        textLeft: rowLeft + target + gap,
        textTop: cy + target * 0.08,
      };
      photo.animate(
        [
          {
            width: `${zoomed}px`,
            height: `${zoomed}px`,
            transform: `translate(${cx}px, ${cy}px) translate(-50%, -50%)`,
          },
          {
            width: `${target}px`,
            height: `${target}px`,
            transform: `translate(${leftX}px, ${cy}px) translate(-50%, -50%)`,
          },
        ],
        {
          duration: 900,
          easing: "cubic-bezier(.22,.8,.3,1)",
          fill: "forwards",
        },
      );
      line.style.left = `${rowLeft + target + gap}px`;
      line.style.top = `${cy + target * 0.08}px`;
      line.style.transform = "translateY(-50%)";
      line.animate(
        [
          { opacity: 0, clipPath: "inset(0 100% 0 0)" },
          { opacity: 1, clipPath: "inset(0 0 0 0)" },
        ],
        { duration: 780, delay: 220, fill: "forwards", easing: "ease-out" },
      );
    }, 1280);

    const endTimer = window.setTimeout(
      () => {
        if (!alive) return;
        setPhase("land");
      },
      1280 + 900 + 1400,
    );

    return () => {
      alive = false;
      window.clearTimeout(moveTimer);
      window.clearTimeout(endTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "land") return;
    const photo = photoRef.current;
    const line = lineRef.current;
    const veil = veilRef.current;
    if (!photo || !line || !veil) return;

    let alive = true;
    const frame = requestAnimationFrame(() => {
      const portrait = document.querySelector<HTMLElement>(
        "[data-hero-slot='portrait']",
      );
      const greeting = document.querySelector<HTMLElement>(
        "[data-hero-slot='greeting']",
      );
      const from = lockupRef.current;
      if (!portrait || !greeting || from.size <= 0) {
        if (alive) setPhase("done");
        return;
      }
      const place = portrait.getBoundingClientRect();
      const words = greeting.getBoundingClientRect();
      const greetSize = Number.parseFloat(getComputedStyle(greeting).fontSize);
      const ease = "cubic-bezier(.22,.8,.3,1)";

      veil.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 780,
        easing: "ease-out",
        fill: "forwards",
      });

      for (const node of document.querySelectorAll<HTMLElement>(
        "[data-hero-reveal]",
      )) {
        node.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 860,
          delay: 160,
          easing: "ease-out",
          fill: "forwards",
        });
      }

      const flight = photo.animate(
        [
          {
            width: `${from.size}px`,
            height: `${from.size}px`,
            transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%)`,
            boxShadow: "0 0 0 5px var(--bg)",
          },
          {
            width: `${place.width}px`,
            height: `${place.height}px`,
            transform: `translate(${place.left + place.width / 2}px, ${place.top + place.height / 2}px) translate(-50%, -50%)`,
            boxShadow: "0 2px 8px rgba(31, 59, 46, 0.18)",
          },
        ],
        { duration: 980, easing: ease, fill: "forwards" },
      );

      line.animate(
        [
          {
            left: `${from.textLeft}px`,
            top: `${from.textTop}px`,
            fontSize: `${from.fontSize}px`,
            transform: "translateY(-50%)",
          },
          {
            left: `${words.left}px`,
            top: `${words.top + words.height / 2}px`,
            fontSize: `${greetSize}px`,
            transform: "translateY(-50%)",
          },
        ],
        { duration: 980, easing: ease, fill: "forwards" },
      );

      void flight.finished.then(() => {
        if (alive) setPhase("done");
      });
    });

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, [phase]);

  const showHero = phase === "land" || phase === "done";
  const flying = phase === "land";

  return (
    <>
      {showHero ? <Hero settled handoff={flying} /> : null}
      {phase === "done" ? null : (
        <div
          className={
            flying
              ? "pointer-events-none fixed inset-0 z-[60]"
              : "fixed inset-0 z-[60]"
          }
        >
          <div ref={veilRef} className="absolute inset-0 bg-bg" />
          {phase === "venn" || phase === "zoom" ? (
            <div
              ref={stageRef}
              className="absolute inset-0 grid overflow-hidden p-[clamp(1.25rem,6vmin,4.5rem)] [&_svg]:!h-full [&_svg]:!max-h-full [&_svg]:!min-h-0 [&_svg]:!w-full [&_svg]:!max-w-full [&_svg]:!min-w-0"
            >
              <ProductVenn
                hideMarker
                markerLabel="That's me."
                onCenter={() => revealRef.current()}
                onDrawn={() => settleRef.current()}
              />
            </div>
          ) : phase === "boot" ? (
            <div className="h-[100svh]" />
          ) : null}
          <div
            ref={photoRef}
            className="pointer-events-none fixed top-0 left-0 z-[61] overflow-hidden rounded-full"
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0)",
              boxShadow: "0 0 0 5px var(--bg)",
            }}
          >
            <Image
              src="/images/hero-portrait.webp"
              alt=""
              fill
              priority
              sizes="280px"
              className="object-cover"
            />
          </div>
          <p
            ref={lineRef}
            aria-hidden={flying}
            className="pointer-events-none fixed z-[61] whitespace-nowrap text-accent"
            style={{
              fontFamily: "var(--font-hand), cursive",
              fontSize: "4.15rem",
              lineHeight: 1,
              opacity: 0,
            }}
          >
            Hi, I am Megh.
          </p>
          {flying ? null : (
            <>
              <button
                type="button"
                className="fixed right-6 bottom-6 z-[62] font-mono text-xs text-fg-subtle"
                onClick={() => setPhase("done")}
              >
                Skip
              </button>
              <button
                type="button"
                aria-label="Skip opening"
                className="absolute inset-0 z-[61] cursor-default"
                onClick={() => setPhase("done")}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
