"use client";

import { useEffect, useRef } from "react";

const CIRCLE_R = 250;
const RING_PAD = 8;

type Zone = "user" | "tech" | "biz";

type Chip = {
  label: string;
  zone: Zone;
  cx: number;
  cy: number;
};

const CIRCLES: Record<Zone, { cx: number; cy: number; color: string }> = {
  user: { cx: 360, cy: 330, color: "var(--venn-user)" },
  tech: { cx: 760, cy: 330, color: "var(--venn-tech)" },
  biz: { cx: 560, cy: 680, color: "var(--venn-biz)" },
};

const ZONE_LABELS: { zone: Zone; text: string }[] = [
  { zone: "user", text: "User" },
  { zone: "tech", text: "Technology" },
  { zone: "biz", text: "Business" },
];

const CHIPS: Chip[] = [
  // USER
  { label: "Onboarding", zone: "user", cx: 355, cy: 172 },
  { label: "Funnels", zone: "user", cx: 245, cy: 200 },
  { label: "KYC", zone: "user", cx: 225, cy: 255 },
  { label: "Activation", zone: "user", cx: 345, cy: 255 },
  { label: "Engagement", zone: "user", cx: 250, cy: 310 },
  { label: "Data", zone: "user", cx: 235, cy: 365 },
  { label: "Journeys", zone: "user", cx: 330, cy: 370 },
  { label: "Retention", zone: "user", cx: 270, cy: 420 },
  // TECH
  { label: "Claude Code", zone: "tech", cx: 740, cy: 180 },
  { label: "Cursor", zone: "tech", cx: 850, cy: 205 },
  { label: "Claude API", zone: "tech", cx: 735, cy: 240 },
  { label: "MCP", zone: "tech", cx: 860, cy: 280 },
  { label: "APIs", zone: "tech", cx: 860, cy: 365 },
  { label: "Github", zone: "tech", cx: 735, cy: 375 },
  { label: "SEO", zone: "tech", cx: 855, cy: 425 },
  { label: "Vercel", zone: "tech", cx: 760, cy: 430 },
  // BUSINESS
  { label: "Strategy", zone: "biz", cx: 440, cy: 715 },
  { label: "Compliance", zone: "biz", cx: 560, cy: 715 },
  { label: "Adoption", zone: "biz", cx: 690, cy: 715 },
  { label: "Stakeholder", zone: "biz", cx: 475, cy: 765 },
  { label: "Growth loops", zone: "biz", cx: 655, cy: 765 },
  { label: "Experimentation", zone: "biz", cx: 505, cy: 812 },
  { label: "Monetization", zone: "biz", cx: 650, cy: 812 },
];

export function ProductVenn({
  markerLabel = "I'm here",
  hideMarker = false,
  onCenter,
  onDrawn,
  settled = false,
}: {
  markerLabel?: string;
  hideMarker?: boolean;
  onCenter?: () => void;
  onDrawn?: () => void;
  settled?: boolean;
} = {}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const animsRef = useRef<Animation[]>([]);
  const onCenterRef = useRef(onCenter);
  const onDrawnRef = useRef(onDrawn);
  const settledRef = useRef(settled);
  onCenterRef.current = onCenter;
  onDrawnRef.current = onDrawn;
  settledRef.current = settled;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Cache elements
    const rings = Array.from(
      svg.querySelectorAll<SVGCircleElement>("[data-role='ring']"),
    );
    const chipGroups = Array.from(
      svg.querySelectorAll<SVGGElement>("[data-role='chip']"),
    );
    const arrow = svg.querySelector<SVGPathElement>("[data-role='arrow']");
    const arrowhead = svg.querySelector<SVGPolygonElement>(
      "[data-role='arrowhead']",
    );
    const marker = svg.querySelector<SVGCircleElement>("[data-role='marker']");
    const markerLabel = svg.querySelector<SVGTextElement>(
      "[data-role='marker-label']",
    );
    const zoneLabels = Array.from(
      svg.querySelectorAll<SVGTextElement>("[data-role='zone-label']"),
    );

    // Pre-size chip pills after fonts load (mono getBBox depends on font)
    const sizePills = () => {
      for (const g of chipGroups) {
        const text = g.querySelector<SVGTextElement>("text");
        const rect = g.querySelector<SVGRectElement>("rect");
        if (!text || !rect) continue;
        const bbox = text.getBBox();
        const padX = 14;
        const h = 29;
        const w = bbox.width + padX * 2;
        rect.setAttribute("x", String(-w / 2));
        rect.setAttribute("y", String(-h / 2));
        rect.setAttribute("width", String(w));
        rect.setAttribute("height", String(h));
        rect.setAttribute("rx", "7");
      }
    };

    // Compute a chip's max drift so its farthest corner never crosses the ring.
    const chipRadii: Record<
      string,
      { home: { x: number; y: number }; maxOut: number; halfDiag: number }
    > = {};

    const computeChipConstraints = () => {
      for (const g of chipGroups) {
        const label = g.dataset.label ?? "";
        const rect = g.querySelector<SVGRectElement>("rect");
        if (!rect) continue;
        const w = Number(rect.getAttribute("width"));
        const h = Number(rect.getAttribute("height"));
        const halfDiag = Math.hypot(w / 2, h / 2);

        const chip = CHIPS.find((c) => c.label === label);
        if (!chip) continue;
        const circle = CIRCLES[chip.zone];
        const safeR = CIRCLE_R - halfDiag - RING_PAD;

        // Vector from circle centre → authored home.
        const dx = chip.cx - circle.cx;
        const dy = chip.cy - circle.cy;
        const distFromCentre = Math.hypot(dx, dy);

        let homeX = chip.cx;
        let homeY = chip.cy;
        // If authored home already sits outside safe radius, pull it inward.
        if (distFromCentre > safeR && distFromCentre > 0) {
          const scale = safeR / distFromCentre;
          homeX = circle.cx + dx * scale;
          homeY = circle.cy + dy * scale;
        }

        // maxOut: how far the chip's centre may drift from circle centre.
        // Never further out than its home, and never past the safe radius.
        const homeDist = Math.hypot(homeX - circle.cx, homeY - circle.cy);
        const maxOut = Math.min(homeDist, safeR);

        chipRadii[label] = {
          home: { x: homeX, y: homeY },
          maxOut,
          halfDiag,
        };

        g.setAttribute("transform", `translate(${homeX} ${homeY})`);
      }
    };

    // Reduced-motion path: render finished, skip all animations.
    const renderFinal = () => {
      for (const r of rings) {
        r.style.strokeDashoffset = "0";
        r.style.opacity = "1";
      }
      for (const g of chipGroups) {
        g.style.opacity = "1";
      }
      for (const l of zoneLabels) l.style.opacity = "1";
      if (marker) marker.style.opacity = "1";
      if (markerLabel) markerLabel.style.opacity = "1";
      if (arrow) {
        arrow.style.strokeDashoffset = "0";
        arrow.style.opacity = "1";
      }
      if (arrowhead) arrowhead.style.opacity = "1";
    };

    let centerTimer = 0;

    const kickOff = () => {
      sizePills();
      computeChipConstraints();

      if (reduced || settledRef.current) {
        renderFinal();
        if (reduced) return;
      }

      const quiet = settledRef.current;
      let floatDelay = 0;

      if (!quiet) {
        rings.forEach((r, i) => {
          r.style.strokeDasharray = "1";
          r.style.strokeDashoffset = "1";
          r.style.opacity = "1";
          const a = r.animate(
            [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
            {
              duration: 900,
              delay: 120 + i * 140,
              easing: "cubic-bezier(.4,.0,.2,1)",
              fill: "forwards",
            },
          );
          animsRef.current.push(a);
        });

        // 2. Zone labels fade in with their ring.
        zoneLabels.forEach((l, i) => {
          const a = l.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 500,
            delay: 700 + i * 140,
            easing: "ease-out",
            fill: "forwards",
          });
          animsRef.current.push(a);
        });

        // 3. Chips fade + scale in, staggered.
        chipGroups.forEach((g, i) => {
          const info = chipRadii[g.dataset.label ?? ""];
          if (!info) return;
          const { x, y } = info.home;
          const a = g.animate(
            [
              {
                opacity: 0,
                transform: `translate(${x}px, ${y}px) scale(0.85)`,
              },
              {
                opacity: 1,
                transform: `translate(${x}px, ${y}px) scale(1)`,
              },
            ],
            {
              duration: 420,
              delay: 1250 + i * 45,
              easing: "cubic-bezier(.2,.7,.3,1)",
              fill: "forwards",
            },
          );
          animsRef.current.push(a);
        });

        // 4. On the opening, the portrait lands in the center before the
        // arrow. Everywhere else, the marker settles and then the arrow draws.
        const MARKER_START = 2600;
        const MARKER_DUR = 550;
        const CENTER_AT = 2780;
        const ARROW_START = hideMarker
          ? CENTER_AT + 920
          : MARKER_START + MARKER_DUR;
        const ARROW_DUR = 700;
        const ARROWHEAD_START = ARROW_START + ARROW_DUR;
        const ARROWHEAD_DUR = 200;
        const LABEL_START = ARROWHEAD_START + ARROWHEAD_DUR - 50;
        const LABEL_DUR = 400;
        const FLOAT_START = LABEL_START + LABEL_DUR + 200;
        floatDelay = FLOAT_START;

        if (hideMarker) {
          centerTimer = window.setTimeout(() => {
            onCenterRef.current?.();
          }, CENTER_AT);
        }

        if (marker) {
          // Overshoot bounce: scale 0 → past 1 → 1, with cubic-bezier back-out.
          const a = marker.animate(
            [
              { opacity: 1, transform: "scale(0)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            {
              duration: MARKER_DUR,
              delay: MARKER_START,
              easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
              fill: "forwards",
            },
          );
          animsRef.current.push(a);
        }
        if (arrow) {
          const len = arrow.getTotalLength();
          arrow.style.strokeDasharray = String(len);
          arrow.style.strokeDashoffset = String(len);
          arrow.style.opacity = "1";
          const a = arrow.animate(
            [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
            {
              duration: ARROW_DUR,
              delay: ARROW_START,
              easing: "cubic-bezier(.4,.0,.2,1)",
              fill: "forwards",
            },
          );
          animsRef.current.push(a);
        }
        if (arrowhead) {
          const a = arrowhead.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: ARROWHEAD_DUR,
            delay: ARROWHEAD_START,
            easing: "ease-out",
            fill: "forwards",
          });
          animsRef.current.push(a);
        }
        if (markerLabel) {
          const a = markerLabel.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: LABEL_DUR,
            delay: LABEL_START,
            easing: "ease-out",
            fill: "forwards",
          });
          animsRef.current.push(a);
          void a.finished.then(
            () => onDrawnRef.current?.(),
            () => {},
          );
        }
      }

      // 5. Float loop starts a moment after chips have landed.
      const start = performance.now();
      const wavePhases: Record<string, { px: number; py: number; sp: number }> =
        {};
      chipGroups.forEach((g, i) => {
        const label = g.dataset.label ?? "";
        wavePhases[label] = {
          px: (i * 1.37) % (Math.PI * 2),
          py: (i * 2.11) % (Math.PI * 2),
          sp: 0.55 + ((i * 0.13) % 0.6),
        };
      });

      const tick = (t: number) => {
        const dt = (t - start) / 1000;
        for (const g of chipGroups) {
          const label = g.dataset.label ?? "";
          const info = chipRadii[label];
          const phase = wavePhases[label];
          if (!info || !phase) continue;

          const circle =
            CIRCLES[
              (CHIPS.find((c) => c.label === label)?.zone ?? "user") as Zone
            ];

          // Sine drift ~2–4px along both axes.
          const amp = 3;
          const ox = Math.sin(dt * phase.sp + phase.px) * amp;
          const oy = Math.cos(dt * phase.sp * 0.9 + phase.py) * amp;

          let nx = info.home.x + ox;
          let ny = info.home.y + oy;

          // Clamp so the chip's farthest corner stays inside the ring.
          const dx = nx - circle.cx;
          const dy = ny - circle.cy;
          const dist = Math.hypot(dx, dy);
          const safeR = CIRCLE_R - info.halfDiag - RING_PAD;
          if (dist > safeR && dist > 0) {
            const scale = safeR / dist;
            nx = circle.cx + dx * scale;
            ny = circle.cy + dy * scale;
            // Also cap: no further out than home.
            const homeDist = Math.hypot(
              info.home.x - circle.cx,
              info.home.y - circle.cy,
            );
            const cappedDist = Math.min(homeDist, safeR);
            const capScale =
              cappedDist / Math.hypot(nx - circle.cx, ny - circle.cy);
            if (Number.isFinite(capScale) && capScale < 1) {
              nx = circle.cx + (nx - circle.cx) * capScale;
              ny = circle.cy + (ny - circle.cy) * capScale;
            }
          }

          g.setAttribute("transform", `translate(${nx} ${ny})`);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      // Delay float start until intro is done.
      const floatStart = window.setTimeout(() => {
        rafRef.current = requestAnimationFrame(tick);
      }, floatDelay);
      // Attach cleanup for the setTimeout too.
      animsRef.current.push({
        cancel: () => window.clearTimeout(floatStart),
      } as unknown as Animation);
    };

    // Wait for fonts (mono) before sizing pills.
    if (document.fonts?.ready) {
      document.fonts.ready.then(kickOff);
    } else {
      kickOff();
    }

    return () => {
      window.clearTimeout(centerTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      for (const a of animsRef.current) {
        try {
          a.cancel();
        } catch {
          // ignore
        }
      }
      animsRef.current = [];
    };
  }, [hideMarker]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 940"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      role="img"
      aria-label="A three-circle Venn diagram showing User, Technology, and Business. Each circle holds the tools and topics I work across; the green marker sits where they overlap and labels 'I'm here.'"
    >
      {/* Rings — colored strokes only, no fill, big overlap area */}
      {(Object.keys(CIRCLES) as Zone[]).map((z) => {
        const c = CIRCLES[z];
        return (
          <circle
            key={z}
            data-role="ring"
            cx={c.cx}
            cy={c.cy}
            r={CIRCLE_R}
            fill="none"
            stroke={c.color}
            strokeWidth={2}
            strokeOpacity={0.85}
            pathLength={1}
            style={{ opacity: settled ? 1 : 0 }}
          />
        );
      })}

      {/* Zone labels */}
      {ZONE_LABELS.map((z) => {
        const c = CIRCLES[z.zone];
        return (
          <text
            key={z.zone}
            data-role="zone-label"
            x={c.cx}
            y={c.cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-serif), serif"
            fontSize="36"
            fill="var(--fg)"
            style={{ opacity: settled ? 1 : 0 }}
          >
            {z.text}
          </text>
        );
      })}

      {/* Chips */}
      {CHIPS.map((chip) => {
        const color = CIRCLES[chip.zone].color;
        return (
          <g
            key={chip.label}
            data-role="chip"
            data-label={chip.label}
            transform={`translate(${chip.cx} ${chip.cy})`}
            style={{ opacity: settled ? 1 : 0 }}
          >
            <rect
              x="-40"
              y="-14.5"
              width="80"
              height="29"
              rx="7"
              fill={color}
            />
            <text
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono), monospace"
              fontSize="14.5"
              fill="var(--venn-cream)"
              style={{ pointerEvents: "none" }}
            >
              {chip.label}
            </text>
          </g>
        );
      })}

      {/* Center stays empty on the opening. The portrait scales in there
          once the diagram, arrow, and label have finished drawing. */}
      {hideMarker ? null : (
        <circle
          data-role="marker"
          cx="560"
          cy="445"
          r="9"
          fill="var(--accent)"
          style={{
            opacity: settled ? 1 : 0,
            transformOrigin: "560px 445px",
            transformBox: "fill-box",
          }}
        />
      )}
      <path
        data-role="arrow"
        d={
          hideMarker
            ? "M 656 452 C 820 468 940 460 1024 456"
            : "M 574 448 C 720 468 882 476 1023 471"
        }
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ opacity: settled ? 1 : 0 }}
      />
      {/* Standalone arrowhead — decoupled from the path so it doesn't
          ride the stroke tip while the line draws in. Faded in only
          after the arrow finishes drawing. */}
      <polygon
        data-role="arrowhead"
        points={
          hideMarker
            ? "1024,456 1011,449.5 1011,462.5"
            : "1023,471 1010,464.5 1010,477.5"
        }
        fill="var(--accent)"
        transform={hideMarker ? "rotate(-2 1024 456)" : "rotate(-2 1023 471)"}
        style={{ opacity: settled ? 1 : 0 }}
      />
      <text
        data-role="marker-label"
        x={hideMarker ? 1048 : 1040}
        y={hideMarker ? 464 : 477}
        fontFamily="var(--font-serif), serif"
        fontStyle="italic"
        fontSize={hideMarker ? 24 : 30}
        fill="var(--accent)"
        style={{ opacity: settled ? 1 : 0 }}
      >
        {markerLabel}
      </text>
    </svg>
  );
}
