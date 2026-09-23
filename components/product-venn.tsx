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

export function ProductVenn() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const animsRef = useRef<Animation[]>([]);

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
    };

    const kickOff = () => {
      sizePills();
      computeChipConstraints();

      if (reduced) {
        renderFinal();
        return;
      }

      // 1. Rings draw in via pathLength=1 dashoffset.
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

      // 4. Marker + arrow draw in last.
      if (arrow) {
        const len = arrow.getTotalLength();
        arrow.style.strokeDasharray = String(len);
        arrow.style.strokeDashoffset = String(len);
        arrow.style.opacity = "1";
        const a = arrow.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          {
            duration: 600,
            delay: 2600,
            easing: "cubic-bezier(.4,.0,.2,1)",
            fill: "forwards",
          },
        );
        animsRef.current.push(a);
      }
      if (marker) {
        const a = marker.animate(
          [
            { opacity: 0, transform: "scale(0)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          {
            duration: 380,
            delay: 2450,
            easing: "cubic-bezier(.2,.7,.3,1)",
            fill: "forwards",
          },
        );
        animsRef.current.push(a);
      }
      if (markerLabel) {
        const a = markerLabel.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 400,
          delay: 3100,
          easing: "ease-out",
          fill: "forwards",
        });
        animsRef.current.push(a);
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
      }, 3400);
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
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 940"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      role="img"
      aria-label="A three-circle Venn diagram showing User, Technology, and Business. Each circle holds the tools and topics I work across; the green marker sits where they overlap and labels 'I'm here.'"
    >
      <defs>
        <marker
          id="pv-arrowhead"
          viewBox="0 0 12 12"
          refX="9"
          refY="6"
          markerWidth="9"
          markerHeight="9"
          orient="auto-start-reverse"
        >
          <path d="M1 1 L10 6 L1 11 Z" fill="var(--accent)" />
        </marker>
      </defs>

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
            style={{ opacity: 0 }}
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
            style={{ opacity: 0 }}
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
            style={{ opacity: 0 }}
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

      {/* I'm here marker + arrow + label */}
      <circle
        data-role="marker"
        cx="560"
        cy="445"
        r="9"
        fill="var(--accent)"
        style={{
          opacity: 0,
          transformOrigin: "560px 445px",
          transformBox: "fill-box",
        }}
      />
      <path
        data-role="arrow"
        d="M 574 448 C 720 468 882 476 1023 471"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#pv-arrowhead)"
        style={{ opacity: 0 }}
      />
      <text
        data-role="marker-label"
        x="1040"
        y="477"
        fontFamily="var(--font-serif), serif"
        fontStyle="italic"
        fontSize="30"
        fill="var(--accent)"
        style={{ opacity: 0 }}
      >
        I&apos;m here
      </text>
    </svg>
  );
}
