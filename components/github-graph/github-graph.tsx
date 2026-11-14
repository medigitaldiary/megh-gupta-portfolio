"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type ContributionDay,
  type ContributionLevel,
  formatDay,
  toMonthBlocks,
  toWeekColumns,
} from "@/lib/github-graph/model";
import { GRID_COLS, GRID_ROWS, maskAt, type Scene } from "./patterns";

// GitHub's contribution scale, plus the warm white card behind it.
// Content ink for this graphic only. See CLAUDE.md §3. Words stay pine.
const GRAPH_CARD = "#fffcf8";
const LEVEL_INK: Record<ContributionLevel, string> = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
};

const SCENE_ORDER: Scene[] = ["graph", "hello", "heart"];
const HOLD_MS: Record<Scene, number> = {
  graph: 2600,
  hello: 3000,
  heart: 1800,
};

const NEXT_SCENE: Record<Scene, Scene> = {
  graph: "hello",
  hello: "heart",
  heart: "graph",
};

const SCENE_LABEL: Record<Scene, string> = {
  graph: "contribution graph",
  hello: "hello",
  heart: "heart",
};

// Fixed coordinates. The key is the cell's place on the pill, so React
// reuses the square and the color can tween when the scene changes.
const PILL_COLUMNS = Array.from({ length: GRID_COLS }, (_, col) =>
  Array.from({ length: GRID_ROWS }, (__, row) => ({ col, row })),
);

type GithubGraphProps = {
  login: string;
  total: number;
  contributions: ContributionDay[];
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function cellDelay(
  scene: Scene,
  row: number,
  col: number,
  reduced: boolean,
): number {
  if (reduced) return 0;
  if (scene === "heart") {
    return Math.round(Math.hypot(col - 7, row - 3) * 32);
  }
  return col * 16 + row * 6;
}

function Square({
  level,
  size,
  delay,
  title,
  reduced,
}: {
  level: ContributionLevel;
  size: number;
  delay: number;
  title?: string;
  reduced?: boolean;
}) {
  return (
    <span
      title={title}
      aria-hidden={title ? undefined : true}
      style={{
        display: "block",
        width: size,
        height: size,
        borderRadius: Math.max(2, Math.round(size * 0.22)),
        backgroundColor: LEVEL_INK[level],
        transitionProperty: "background-color",
        transitionDuration: reduced ? "0ms" : "460ms",
        transitionTimingFunction: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

export function GithubGraph({ login, total, contributions }: GithubGraphProps) {
  const reduced = useReducedMotion();
  const weeks = toWeekColumns(contributions);
  const months = toMonthBlocks(contributions);
  const maxStart = Math.max(0, weeks.length - GRID_COLS);
  const [scene, setScene] = useState<Scene>("graph");
  const [playing, setPlaying] = useState(true);
  const [start, setStart] = useState(maxStart);

  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setTimeout(() => {
      setScene((current) => NEXT_SCENE[current]);
    }, HOLD_MS[scene]);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, scene]);

  useEffect(() => {
    if (scene !== "graph" || reduced) return;
    let direction: -1 | 1 = -1;
    const timer = window.setInterval(() => {
      setStart((current) => {
        const next = current + direction;
        if (next <= Math.max(0, maxStart - 8)) direction = 1;
        if (next >= maxStart) direction = -1;
        return Math.min(maxStart, Math.max(0, next));
      });
    }, 520);
    return () => window.clearInterval(timer);
  }, [scene, reduced, maxStart]);

  const windowWeeks = Array.from({ length: GRID_COLS }, (_, index) => {
    return (
      weeks[start + index] ?? Array.from({ length: GRID_ROWS }, () => null)
    );
  });

  const open = scene === "hello";
  const first = contributions[0]?.date;
  const last = contributions[contributions.length - 1]?.date;

  function show(next: Scene) {
    setPlaying(false);
    setScene(next);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <p className="sr-only" aria-live="polite">
        {`Showing ${SCENE_LABEL[scene]}${open ? ", year open" : ""}`}
      </p>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="github-year"
        aria-label={`${total} contributions in the last year on GitHub. Showing ${SCENE_LABEL[scene]}. Activate to show ${SCENE_LABEL[NEXT_SCENE[scene]]}.`}
        onClick={() => show(NEXT_SCENE[scene])}
        className="cursor-pointer border border-border px-3 py-3 shadow-[var(--shadow-md)] transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{ backgroundColor: GRAPH_CARD, borderRadius: 18 }}
      >
        <span className="flex gap-1">
          {PILL_COLUMNS.map((column) => (
            <span key={column[0]?.col} className="flex flex-col gap-1">
              {column.map((cell) => {
                const day = windowWeeks[cell.col]?.[cell.row] ?? null;
                const level: ContributionLevel =
                  scene === "graph"
                    ? (day?.level ?? 0)
                    : maskAt(scene, cell.row, cell.col) === 1
                      ? 4
                      : 0;
                return (
                  <Square
                    key={`${cell.col}-${cell.row}`}
                    level={level}
                    size={11}
                    delay={cellDelay(scene, cell.row, cell.col, reduced)}
                    reduced={reduced}
                  />
                );
              })}
            </span>
          ))}
        </span>
      </button>

      <div
        className={`grid w-full transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="px-2 pt-5 pb-3">
            <article
              id="github-year"
              aria-label={`${total} contributions in the last year`}
              className="border border-border p-4 shadow-[var(--shadow-md)] sm:p-6"
              style={{ backgroundColor: GRAPH_CARD, borderRadius: 18 }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-fg text-sm md:text-base">
                  <span className="font-medium">{total}</span> contributions in
                  the last year
                </h2>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-fg text-sm">
                  <span className="font-medium">Personal</span>{" "}
                  <a
                    href={`https://github.com/${login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-muted underline decoration-border underline-offset-4 hover:text-fg"
                  >
                    @{login}
                    <ArrowIcon />
                  </a>
                </p>
                <p className="font-mono text-fg-subtle text-xs tabular-nums">
                  {total}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-4 md:grid-cols-6">
                {months.map((month) => (
                  <div key={month.key}>
                    <p className="mb-1.5 font-mono text-[10px] text-fg-subtle uppercase tracking-[0.14em]">
                      {month.label}
                    </p>
                    <div className="flex gap-[3px]">
                      {month.weeks.map((week, col) => (
                        <div
                          key={`${month.key}-${col}`}
                          className="flex flex-col gap-[3px]"
                        >
                          {week.map((day, row) => (
                            <Square
                              key={`${month.key}-${col}-${row}`}
                              level={day?.level ?? 0}
                              size={9}
                              delay={0}
                              title={
                                day
                                  ? `${formatDay(day.date)}: ${day.count === 1 ? "1 contribution" : `${day.count} contributions`}`
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end gap-1.5 text-fg-subtle text-xs">
                <span>Less</span>
                {([0, 1, 2, 3, 4] as const).map((level) => (
                  <Square key={level} level={level} size={10} delay={0} />
                ))}
                <span>More</span>
              </div>
              {first && last ? (
                <p className="mt-3 text-fg-subtle text-xs">
                  {formatDay(first)} to {formatDay(last)}
                </p>
              ) : null}
            </article>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {SCENE_ORDER.map((item) => (
          <Button
            key={item}
            size="sm"
            mono
            variant={scene === item ? "primary" : "hairline"}
            aria-pressed={scene === item}
            onClick={() => show(item)}
          >
            {item === "graph" ? "Graph" : item === "hello" ? "Hello" : "Heart"}
          </Button>
        ))}
        <Button
          size="sm"
          mono
          variant="outline"
          aria-pressed={playing}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ml-0.5 inline size-3.5 align-[-2px]"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
