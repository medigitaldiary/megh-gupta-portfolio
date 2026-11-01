"use client";

import { useEffect } from "react";

type Point = { x: number; y: number };

// A pine dot leaves the portrait and lands on the Venn overlap.
// It is a fixed element in viewport coordinates, measured from the
// live portrait and pin, so it cannot get stuck in the diagram's
// own arrow (that arrow only draws after this dot arrives).
export function HeroLink() {
  useEffect(() => {
    const section = document.getElementById("hero");
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    delete document.documentElement.dataset.heroPin;

    const signalArrival = () => {
      document.documentElement.dataset.heroPin = "1";
      window.dispatchEvent(new Event("hero-pin-arrived"));
    };

    let alive = true;
    let raf = 0;
    const dot = document.createElement("div");
    dot.setAttribute("aria-hidden", "true");
    dot.style.position = "fixed";
    dot.style.zIndex = "60";
    dot.style.left = "0";
    dot.style.top = "0";
    dot.style.margin = "0";
    dot.style.borderRadius = "999px";
    dot.style.background = "var(--accent)";
    dot.style.pointerEvents = "none";
    dot.style.opacity = "0";
    document.body.appendChild(dot);

    const place = (p: Point, size: number) => {
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
    };

    const measure = () => {
      const portrait = section.querySelector("[data-hero-portrait]");
      const marker = section.querySelector("[data-role='marker']");
      if (!portrait || !marker) return null;
      const pr = portrait.getBoundingClientRect();
      const mr = marker.getBoundingClientRect();
      if (pr.width < 2 || mr.width < 2) return null;
      const start = {
        x: pr.left + pr.width / 2,
        y: pr.top + pr.height / 2,
      };
      const end = {
        x: mr.left + mr.width / 2,
        y: mr.top + mr.height / 2,
      };
      return { start, end, size: Math.max(12, mr.width) };
    };

    const begin = () => {
      if (!alive) return;
      if (reduced) {
        signalArrival();
        dot.remove();
        return;
      }

      const hold = 480;
      const flight = 1100;
      const delay = 600;
      const t0 = performance.now() + delay;
      let sent = false;

      const tick = (now: number) => {
        if (!alive) return;
        const geo = measure();
        if (!geo) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const elapsed = now - t0;
        if (elapsed < 0) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const ctrl = bow(geo.start, geo.end);
        const raw = elapsed < hold ? 0 : Math.min(1, (elapsed - hold) / flight);
        const p = quad(ease(raw), geo.start, ctrl, geo.end);
        place(p, geo.size);
        dot.style.opacity = "1";
        if (raw >= 1 && !sent) {
          sent = true;
          // The SVG pin is shown in this same turn. Remove the traveler
          // without a fade so a second circle does not take its place.
          signalArrival();
          dot.remove();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (document.fonts?.ready) {
      void document.fonts.ready.then(begin);
    } else {
      begin();
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      dot.remove();
    };
  }, []);

  return null;
}

function bow(start: Point, end: Point): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy) || 1;
  let px = dy / len;
  let py = -dx / len;
  if (py < 0) {
    px = -px;
    py = -py;
  }
  const amount = Math.min(72, len * 0.18);
  return {
    x: (start.x + end.x) / 2 + px * amount,
    y: (start.y + end.y) / 2 + py * amount,
  };
}

function quad(t: number, a: Point, b: Point, c: Point): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    y: u * u * a.y + 2 * u * t * b.y + t * t * c.y,
  };
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
