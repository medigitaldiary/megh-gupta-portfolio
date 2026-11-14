"use client";

import { type ReactNode, useEffect, useRef } from "react";

// Entrance for a bento grid: each tile flies in from the edge of the
// screen nearest to it, one after another, and snaps into its slot. A
// tile's own small animations stay paused until it has landed (see
// "Entrance" in bento.css).
//
// Tiles start when they scroll into view, so the second fold and the
// phone layout get the same arrival instead of animating off screen.
// Under reduced motion nothing moves: the CSS never hides the tiles.

const STAGGER_MS = 130;

export function BentoEntrance({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const tiles = Array.from(grid.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );

    const land = (tile: HTMLElement) => {
      tile.dataset.fly = "done";
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      for (const tile of tiles) land(tile);
      return;
    }

    // Next free slot in the queue, so tiles arrive one by one even when
    // several come into view together.
    let nextAt = 0;

    const launch = (tile: HTMLElement) => {
      const rect = tile.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
      const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
      const length = Math.hypot(dx, dy);
      const reach = Math.min(window.innerWidth, 1100) * 0.55;
      // A tile in the middle has no nearest edge, so it rises from below.
      const ux = length < 40 ? 0 : dx / length;
      const uy = length < 40 ? 1 : dy / length;

      const now = performance.now();
      nextAt = Math.max(now, nextAt);
      tile.style.setProperty("--bento-fly-x", `${Math.round(ux * reach)}px`);
      tile.style.setProperty("--bento-fly-y", `${Math.round(uy * reach)}px`);
      tile.style.setProperty("--bento-fly-turn", `${ux >= 0 ? 7 : -7}deg`);
      tile.style.setProperty("--bento-fly-delay", `${nextAt - now}ms`);
      tile.dataset.fly = "in";
      nextAt += STAGGER_MS;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => tiles.indexOf(a) - tiles.indexOf(b));
        for (const tile of arriving) {
          observer.unobserve(tile);
          launch(tile);
        }
      },
      { threshold: 0.12 },
    );
    for (const tile of tiles) observer.observe(tile);

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "bento-land") return;
      const tile = event.target;
      if (tile instanceof HTMLElement && tile.parentElement === grid) {
        land(tile);
      }
    };
    grid.addEventListener("animationend", onEnd);

    return () => {
      observer.disconnect();
      grid.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    <div ref={ref} className={className} data-entrance="on">
      {children}
    </div>
  );
}
