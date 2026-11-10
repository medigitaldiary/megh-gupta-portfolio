"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import "./agents.css";

const CURSORS = [
  "Layout",
  "Copy",
  "Product",
  "Proof",
  "Tools",
  "Editor",
] as const;

type Cursor = {
  name: string;
  x: number;
  y: number;
  busy: boolean;
  phase: number;
  el: HTMLDivElement | null;
};

type LogLine = { t: string; agent: string; text: string };

const CONTROL =
  "inline-flex min-h-11 items-center rounded-full border border-fg bg-bg px-4 text-sm text-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export function ResumeAgents({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const api = useRef({
    skip: () => {},
    rebuild: () => {},
  });
  const [lines, setLines] = useState<LogLine[]>([]);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = root;

    const blocks = () => [
      ...stage.querySelectorAll<HTMLElement>("[data-block]"),
    ];
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      for (const block of blocks()) block.dataset.state = "done";
      setSettled(true);
      return;
    }

    let alive = true;
    let handed = false;
    let generation = 0;
    let runStart = performance.now();
    const playLocked = new URLSearchParams(window.location.search).has("play");
    const timers = new Set<number>();
    let raf = 0;
    const running = new Set<string>();
    const cleanups: Array<() => void> = [];

    const cursors: Cursor[] = CURSORS.map((name, index) => ({
      name,
      x: -48,
      y: 36 + index * 26,
      busy: false,
      phase: index * 1.2,
      el: stage.querySelector<HTMLDivElement>(`[data-cursor="${name}"]`),
    }));

    const narrow = () => window.matchMedia("(max-width: 767px)").matches;

    function stamp() {
      return `${((performance.now() - runStart) / 1000).toFixed(1)}s`;
    }

    function log(agent: string, text: string) {
      if (!alive) return;
      setLines((prev) => [...prev, { t: stamp(), agent, text }].slice(-6));
    }

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });
    }

    function rel(el: HTMLElement) {
      const box = el.getBoundingClientRect();
      const origin = stage.getBoundingClientRect();
      return {
        x: box.left - origin.left,
        y: box.top - origin.top,
        w: box.width,
        h: box.height,
      };
    }

    type Tween = {
      cursor: Cursor;
      fx: number;
      fy: number;
      tx: number;
      ty: number;
      t0: number;
      ms: number;
      bow: number;
      onFrame?: () => void;
      resolve: () => void;
    };
    const tweens: Tween[] = [];

    function tween(
      cursor: Cursor,
      tx: number,
      ty: number,
      onFrame?: () => void,
    ) {
      const dist = Math.hypot(tx - cursor.x, ty - cursor.y);
      return new Promise<void>((resolve) => {
        tweens.push({
          cursor,
          fx: cursor.x,
          fy: cursor.y,
          tx,
          ty,
          t0: performance.now(),
          ms: Math.min(900, Math.max(280, dist * 0.45)),
          bow: dist * 0.06 * (Math.random() < 0.5 ? -1 : 1),
          onFrame,
          resolve,
        });
      });
    }

    function frame(now: number) {
      if (!alive) return;
      const pending = tweens.splice(0, tweens.length);
      for (const tw of pending) {
        const raw = Math.min(1, (now - tw.t0) / tw.ms);
        const eased = raw < 0.5 ? 2 * raw * raw : 1 - (-2 * raw + 2) ** 2 / 2;
        const dx = tw.tx - tw.fx;
        const dy = tw.ty - tw.fy;
        const len = Math.hypot(dx, dy) || 1;
        const bow = Math.sin(Math.PI * raw) * tw.bow;
        tw.cursor.x = tw.fx + dx * eased - (dy / len) * bow;
        tw.cursor.y = tw.fy + dy * eased + (dx / len) * bow;
        tw.onFrame?.();
        if (raw >= 1) {
          tw.cursor.x = tw.tx;
          tw.cursor.y = tw.ty;
          tw.resolve();
        } else {
          tweens.push(tw);
        }
      }

      const anchor = stage.querySelector<HTMLElement>(
        "[data-state='mark'], [data-state='rough'], [data-state='type']",
      );
      const spot = anchor ? rel(anchor) : { x: 72, y: 72, w: 0, h: 0 };
      for (const cursor of cursors) {
        if (!cursor.busy) {
          const t = now / 1000;
          const ox = Math.sin(t * 0.7 + cursor.phase) * 28;
          const oy = Math.cos(t * 0.55 + cursor.phase) * 16;
          cursor.x += (spot.x + spot.w + 20 + ox - cursor.x) * 0.05;
          cursor.y += (spot.y + 8 + oy - cursor.y) * 0.05;
        }
        if (cursor.el) {
          cursor.el.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const marquees = new Map<HTMLElement, HTMLDivElement>();

    function showMarquee(
      block: HTMLElement,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
    ) {
      let el = marquees.get(block);
      if (!el) {
        el = document.createElement("div");
        el.className = "agents-marquee";
        el.append(document.createElement("span"));
        stage.append(el);
        marquees.set(block, el);
      }
      const x = Math.min(x0, x1);
      const y = Math.min(y0, y1);
      const w = Math.abs(x1 - x0);
      const h = Math.abs(y1 - y0);
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      const label = el.querySelector("span");
      if (label) label.textContent = `${Math.round(w)} × ${Math.round(h)}`;
    }

    function hideMarquee(block: HTMLElement) {
      marquees.get(block)?.remove();
      marquees.delete(block);
    }

    function pick(name: string): Promise<Cursor> {
      return new Promise((resolve) => {
        const look = () => {
          if (!alive) return;
          const preferred = cursors.find(
            (cursor) => cursor.name === name && !cursor.busy,
          );
          const free = preferred ?? cursors.find((cursor) => !cursor.busy);
          if (free) {
            resolve(free);
            return;
          }
          const id = window.setTimeout(look, 40);
          timers.add(id);
        };
        look();
      });
    }

    async function typeBlock(
      block: HTMLElement,
      cursor: Cursor,
      token: number,
    ) {
      const target = block.querySelector<HTMLElement>("[data-type-target]");
      if (!target) return;
      const full = target.textContent ?? "";
      target.dataset.typing = "";
      const overlay = document.createElement("div");
      overlay.className = "agents-caret";
      target.append(overlay);
      const step = block.dataset.type === "fast" ? 3 : 1;
      const gap = block.dataset.type === "fast" ? 16 : 34;
      for (let i = step; i <= full.length; i += step) {
        if (!alive || token !== generation) break;
        overlay.textContent = full.slice(0, Math.min(i, full.length));
        if (i % 8 === 0) {
          const box = rel(target);
          const along = Math.min(box.w - 12, (i / full.length) * box.w);
          cursor.x += (box.x + along - cursor.x) * 0.65;
          cursor.y += (box.y + 10 - cursor.y) * 0.65;
        }
        await wait(gap);
      }
      overlay.remove();
      delete target.dataset.typing;
      if (alive && token === generation) block.dataset.wasTyped = "";
    }

    async function runJob(block: HTMLElement, token: number) {
      const cursor = await pick(block.dataset.agent || "Layout");
      if (!alive || token !== generation) return;
      cursor.busy = true;
      block.dataset.state = "mark";
      const start = rel(block);
      await tween(cursor, start.x + 6, start.y + 6);
      if (!alive || token !== generation) {
        cursor.busy = false;
        return;
      }
      await tween(
        cursor,
        start.x + Math.max(24, start.w - 8),
        start.y + Math.max(20, start.h - 8),
        () => {
          const box = rel(block);
          showMarquee(block, box.x, box.y, cursor.x, cursor.y);
        },
      );
      hideMarquee(block);
      if (!alive || token !== generation) {
        cursor.busy = false;
        return;
      }
      block.dataset.state = "rough";
      await wait(240);
      if (!alive || token !== generation) {
        cursor.busy = false;
        return;
      }
      if (block.querySelector("[data-type-target]")) {
        block.dataset.state = "type";
        await typeBlock(block, cursor, token);
      }
      if (!alive || token !== generation) {
        cursor.busy = false;
        return;
      }
      block.dataset.state = "done";
      log(cursor.name, block.dataset.log || "built a block");
      cursor.busy = false;
    }

    function sectionNames() {
      const names: string[] = [];
      for (const block of blocks()) {
        const name = block.dataset.section ?? "";
        if (name && !names.includes(name)) names.push(name);
      }
      return names;
    }

    async function buildSection(name: string, token: number) {
      if (running.has(name)) return;
      const group = blocks().filter(
        (block) =>
          block.dataset.section === name && block.dataset.state !== "done",
      );
      if (group.length === 0) return;
      running.add(name);
      const top = group[0].getBoundingClientRect().top;
      if (!handed && top > 120) {
        window.scrollTo({
          top: window.scrollY + top - 80,
          behavior: "smooth",
        });
      }
      const limit = narrow() ? 2 : Math.min(4, group.length);
      let index = 0;
      try {
        await Promise.all(
          Array.from({ length: limit }, async () => {
            while (index < group.length && alive && token === generation) {
              const block = group[index];
              index += 1;
              if (block) await runJob(block, token);
            }
          }),
        );
      } finally {
        running.delete(name);
      }
    }

    async function play(token: number) {
      if (!alive) return;
      runStart = performance.now();
      setSettled(false);
      stage.classList.remove("is-settled");
      for (const name of sectionNames()) {
        if (!alive || token !== generation || handed) return;
        await buildSection(name, token);
      }
      if (!alive || token !== generation || handed) return;
      const seconds = ((performance.now() - runStart) / 1000).toFixed(1);
      log("Editor", `handed it over in ${seconds}s`);
      setSettled(true);
      stage.classList.add("is-settled");
    }

    function finishAll() {
      generation += 1;
      handed = true;
      for (const id of timers) clearTimeout(id);
      timers.clear();
      tweens.splice(0, tweens.length);
      for (const cursor of cursors) cursor.busy = false;
      for (const block of blocks()) {
        hideMarquee(block);
        for (const node of block.querySelectorAll(".agents-caret")) {
          node.remove();
        }
        block.dataset.state = "done";
      }
      if (!alive) return;
      log("Editor", "skipped to the finished page");
      setSettled(true);
      stage.classList.add("is-settled");
    }

    async function rebuild() {
      generation += 1;
      const token = generation;
      handed = false;
      running.clear();
      setLines([]);
      setSettled(false);
      stage.classList.remove("is-settled");
      for (const block of blocks().reverse()) {
        if (!alive || token !== generation) return;
        block.dataset.state = "rough";
        await wait(32);
        delete block.dataset.state;
        delete block.dataset.wasTyped;
        for (const node of block.querySelectorAll(".agents-caret")) {
          node.remove();
        }
        await wait(20);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      await wait(380);
      if (!alive || token !== generation) return;
      await play(token);
    }

    function handOver() {
      if (playLocked || handed) return;
      handed = true;
      const seen = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const name = (entry.target as HTMLElement).dataset.section ?? "";
            if (!name || seen.has(name)) continue;
            seen.add(name);
            void buildSection(name, generation);
          }
        },
        { threshold: 0.35 },
      );
      for (const block of blocks()) observer.observe(block);
      cleanups.push(() => observer.disconnect());
    }

    let wheelHits: number[] = [];
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 40) return;
      const now = performance.now();
      wheelHits = wheelHits.filter((hit) => now - hit < 500);
      wheelHits.push(now);
      if (wheelHits.length >= 2) handOver();
    };
    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchY;
      if (Math.abs(y - touchY) > 60) handOver();
    };
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        handOver();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);

    api.current.skip = finishAll;
    api.current.rebuild = () => {
      void rebuild();
    };

    void play(generation);

    return () => {
      alive = false;
      generation += 1;
      cancelAnimationFrame(raf);
      for (const id of timers) clearTimeout(id);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      for (const cleanup of cleanups) cleanup();
      for (const el of marquees.values()) el.remove();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={settled ? "agents-page is-settled" : "agents-page"}
    >
      {children}
      <div className="agents-cursors" aria-hidden="true">
        {CURSORS.map((name) => (
          <div key={name} className="agents-cursor" data-cursor={name}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5 2.5 5 17.2l4.2-3.3 2.6 6.3 2.3-1-2.7-6.4 5.8-.6L5 2.5Z" />
            </svg>
            <span className="agents-tag">{name}</span>
          </div>
        ))}
      </div>
      <div className="agents-dock print:hidden">
        {lines.length > 0 ? (
          <ol className="agents-log" aria-live="polite">
            {lines.map((line) => (
              <li key={`${line.t}-${line.agent}-${line.text}`}>
                {line.t} <strong>{line.agent}</strong> {line.text}
              </li>
            ))}
          </ol>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={CONTROL}
            onClick={() => api.current.skip()}
          >
            Skip
          </button>
          <button
            type="button"
            className={CONTROL}
            onClick={() => api.current.rebuild()}
          >
            Watch it build again
          </button>
        </div>
      </div>
    </div>
  );
}
