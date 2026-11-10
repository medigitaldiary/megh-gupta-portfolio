"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import "./agents.css";

const CURSORS = [
  "Layout",
  "Copy",
  "Product",
  "Growth",
  "Research",
  "Design",
  "Metrics",
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

const DOCK_BUTTON =
  "mx-2 mb-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

export function ResumeAgents({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const api = useRef({
    skip: () => {},
    rebuild: () => {},
  });
  const [lines, setLines] = useState<LogLine[]>([]);
  const [status, setStatus] = useState("Built 0 / 0");
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
    let roaming = false;

    function stamp() {
      const ms = Math.max(0, performance.now() - runStart);
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const tenth = Math.floor((ms % 1000) / 100);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenth}`;
    }

    function report(summary?: string) {
      if (!alive) return;
      if (summary) {
        setStatus(summary);
        return;
      }
      const all = blocks();
      const done = all.filter((block) => block.dataset.state === "done").length;
      setStatus(`Built ${done} / ${all.length}`);
    }

    function log(agent: string, text: string) {
      if (!alive) return;
      setLines((prev) => [...prev, { t: stamp(), agent, text }].slice(-3));
      report();
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

      const origin = stage.getBoundingClientRect();
      if (roaming) {
        const sheet = stage.querySelector(".resume-sheet");
        const sheetLeft = sheet ? sheet.getBoundingClientRect().left : 24;
        const gutter = Math.max(0, sheetLeft - 12);
        const colGap = gutter > 190 ? 72 : 30;
        const baseX = Math.max(8, sheetLeft - (colGap + 108));
        const rows = Math.ceil(cursors.length / 2);
        const rowGap = 26;
        const clusterHeight = (rows - 1) * rowGap + 22;
        const dock = document.querySelector(".agents-dock");
        const dockBox = dock?.getBoundingClientRect();
        const clusterRight = baseX + colGap + 96;
        const floor =
          dockBox && dockBox.left < clusterRight + 8
            ? dockBox.top - 8
            : window.innerHeight - 16;
        const baseY = Math.max(64, floor - clusterHeight);
        const t = now / 1000;
        cursors.forEach((cursor, index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const tx =
            baseX -
            origin.left +
            col * colGap +
            Math.sin(t * 0.55 + cursor.phase) * 3;
          const ty =
            baseY -
            origin.top +
            row * rowGap +
            Math.cos(t * 0.45 + cursor.phase) * 2;
          cursor.x += (tx - cursor.x) * 0.06;
          cursor.y += (ty - cursor.y) * 0.06;
        });
      } else {
        const anchor = stage.querySelector<HTMLElement>(
          "[data-state='mark'], [data-state='rough'], [data-state='type']",
        );
        const idle = cursors.filter((cursor) => !cursor.busy);
        idle.forEach((cursor, index) => {
          const t = now / 1000;
          let tx = 18 - origin.left;
          let ty =
            72 + index * 30 - origin.top + Math.sin(t * 0.6 + cursor.phase) * 5;
          if (index < 2 && anchor) {
            const spot = rel(anchor);
            tx = spot.x + 16 + Math.sin(t * 0.7 + cursor.phase) * 18;
            ty =
              spot.y + 20 + index * 26 + Math.cos(t * 0.55 + cursor.phase) * 10;
          }
          cursor.x += (tx - cursor.x) * 0.05;
          cursor.y += (ty - cursor.y) * 0.05;
        });
      }
      for (const cursor of cursors) {
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

    function pace(block: HTMLElement) {
      switch (block.dataset.type) {
        case "fast":
          return { step: 3, gap: 16 };
        case "line":
          return { step: 1, gap: 18 };
        case "title":
          return { step: 1, gap: 26 };
        default:
          return { step: 1, gap: 34 };
      }
    }

    let nudgeAt = 0;
    function nudge(el: HTMLElement) {
      if (handed) return;
      const now = performance.now();
      if (now - nudgeAt < 520) return;
      const box = el.getBoundingClientRect();
      const limit = window.innerHeight - 188;
      if (box.bottom <= limit && box.top >= 56) return;
      nudgeAt = now;
      const delta = box.bottom > limit ? box.bottom - limit + 32 : box.top - 96;
      window.scrollBy({ top: delta, behavior: "smooth" });
    }

    async function typeBlock(
      block: HTMLElement,
      cursor: Cursor,
      token: number,
    ) {
      const targets = [
        ...block.querySelectorAll<HTMLElement>("[data-type-target]"),
      ];
      if (targets.length === 0) return;
      const { step, gap } = pace(block);
      for (const target of targets) {
        if (!alive || token !== generation) return;
        const full = (target.textContent ?? "").replace(/\s+/g, " ").trim();
        const box = rel(target);
        await tween(cursor, box.x + 10, box.y + Math.min(16, box.h * 0.5));
        if (!alive || token !== generation) return;
        nudge(target);
        target.dataset.typing = "";
        const overlay = document.createElement("span");
        overlay.className = "agents-caret";
        target.append(overlay);
        for (let i = step; i <= full.length; i += step) {
          if (!alive || token !== generation) break;
          overlay.textContent = full.slice(0, Math.min(i, full.length));
          if (i % 16 === 0) {
            const live = rel(target);
            const along = Math.min(live.w - 12, (i / full.length) * live.w);
            cursor.x += (live.x + along - cursor.x) * 0.65;
            cursor.y += (live.y + 10 - cursor.y) * 0.65;
          }
          await wait(gap);
        }
        if (alive && token === generation) overlay.textContent = full;
        overlay.remove();
        delete target.dataset.typing;
        if (!alive || token !== generation) return;
        target.dataset.typed = "";
      }
      if (alive && token === generation) block.dataset.wasTyped = "";
    }

    async function runJob(block: HTMLElement, token: number) {
      const cursor = await pick(block.dataset.agent || "Layout");
      if (!alive || token !== generation) return;
      cursor.busy = true;
      try {
        if (block.dataset.type === "line") {
          block.dataset.state = "type";
          const box = rel(block);
          await tween(cursor, box.x + 14, box.y + Math.min(14, box.h * 0.6));
          if (!alive || token !== generation) return;
          await typeBlock(block, cursor, token);
          if (!alive || token !== generation) return;
          block.dataset.state = "done";
          log(cursor.name, block.dataset.log || "wrote a line");
          return;
        }
        block.dataset.state = "mark";
        const start = rel(block);
        await tween(cursor, start.x + 6, start.y + 6);
        if (!alive || token !== generation) return;
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
        if (!alive || token !== generation) return;
        block.dataset.state = "rough";
        await wait(240);
        if (!alive || token !== generation) return;
        if (block.querySelector("[data-type-target]")) {
          block.dataset.state = "type";
          await typeBlock(block, cursor, token);
        }
        if (!alive || token !== generation) return;
        block.dataset.state = "done";
        log(cursor.name, block.dataset.log || "built a block");
      } finally {
        cursor.busy = false;
      }
    }

    async function runGroup(group: HTMLElement[], token: number) {
      const limit = narrow() ? 2 : Math.min(4, group.length);
      let index = 0;
      await Promise.all(
        Array.from({ length: limit }, async () => {
          while (index < group.length && alive && token === generation) {
            const block = group[index];
            index += 1;
            if (block) await runJob(block, token);
          }
        }),
      );
    }

    async function ensureVisible(el: HTMLElement) {
      if (handed) return;
      const box = el.getBoundingClientRect();
      const view = window.innerHeight;
      const floor = view - 188;
      if (box.top >= 64 && box.bottom <= floor) return;
      if (box.top >= 64 && box.top <= view * 0.42) return;
      const desired = Math.round(Math.min(view * 0.34, 260));
      window.scrollTo({
        top: Math.max(0, window.scrollY + box.top - desired),
        behavior: "smooth",
      });
      await wait(560);
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
      const headers = group.filter((block) => block.dataset.type !== "line");
      const lines = group.filter((block) => block.dataset.type === "line");
      const lead = headers[0] ?? lines[0];
      try {
        if (lead) await ensureVisible(lead);
        if (!alive || token !== generation) return;
        if (headers.length > 0) await runGroup(headers, token);
        if (lines.length > 0 && alive && token === generation) {
          await runGroup(lines, token);
        }
      } finally {
        running.delete(name);
      }
    }

    async function play(token: number) {
      if (!alive) return;
      roaming = false;
      runStart = performance.now();
      setSettled(false);
      stage.classList.remove("is-settled");
      report();
      for (const name of sectionNames()) {
        if (!alive || token !== generation || handed) return;
        await buildSection(name, token);
        if (!alive || token !== generation || handed) return;
        const kinds = new Set(
          blocks()
            .filter((block) => block.dataset.section === name)
            .map((block) => block.dataset.type ?? ""),
        );
        const dwell = kinds.has("line")
          ? 1000
          : kinds.has("fast") || kinds.has("name")
            ? 800
            : kinds.has("title")
              ? 640
              : 240;
        await wait(dwell);
      }
      if (!alive || token !== generation || handed) return;
      const seconds = ((performance.now() - runStart) / 1000).toFixed(1);
      log("Editor", `handed it over in ${seconds}s`);
      roaming = true;
      report(`Built in ${seconds}s`);
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
        for (const target of block.querySelectorAll<HTMLElement>(
          "[data-type-target]",
        )) {
          delete target.dataset.typing;
        }
        block.dataset.state = "done";
      }
      if (!alive) return;
      const seconds = ((performance.now() - runStart) / 1000).toFixed(1);
      log("Editor", "skipped to the finished page");
      roaming = true;
      report(`Built in ${seconds}s`);
      setSettled(true);
      stage.classList.add("is-settled");
    }

    async function rebuild() {
      generation += 1;
      const token = generation;
      handed = false;
      roaming = false;
      running.clear();
      setLines([]);
      setStatus("Built 0 / 0");
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
        for (const target of block.querySelectorAll<HTMLElement>(
          "[data-type-target]",
        )) {
          delete target.dataset.typing;
          delete target.dataset.typed;
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
        <div className="agents-log-head">
          <span>Agent log</span>
          <span>{status}</span>
        </div>
        {lines.length > 0 ? (
          <ol className="agents-log" aria-live="polite">
            {lines.map((line) => (
              <li key={`${line.t}-${line.agent}-${line.text}`}>
                <span className="agents-log-time">{line.t}</span>
                <span className="agents-chip" data-agent={line.agent}>
                  {line.agent}
                </span>
                <span className="agents-log-text">{line.text}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <button
          type="button"
          className={DOCK_BUTTON}
          onClick={() => (settled ? api.current.rebuild() : api.current.skip())}
        >
          {settled ? "Watch it build again" : "Skip"}
        </button>
      </div>
    </div>
  );
}
