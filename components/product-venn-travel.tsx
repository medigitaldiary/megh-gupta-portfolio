"use client";

import { useEffect, useRef } from "react";

const CIRCLE_R = 250;
const RING_PAD = 8;
const MARKER = { x: 560, y: 445 };

type Zone = "user" | "tech" | "biz";

type Chip = {
  label: string;
  zone: Zone;
  cx: number;
  cy: number;
};

type ChipHome = {
  home: { x: number; y: number };
  halfDiag: number;
};

type ChipMotion = {
  x: number;
  y: number;
  rot: number;
  scale: number;
  op: number;
};

type RingMotion = { op: number; width: number };

type Phase = { sp: number; px: number; py: number };

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
  { label: "Onboarding", zone: "user", cx: 355, cy: 172 },
  { label: "Funnels", zone: "user", cx: 245, cy: 200 },
  { label: "KYC", zone: "user", cx: 225, cy: 255 },
  { label: "Activation", zone: "user", cx: 345, cy: 255 },
  { label: "Engagement", zone: "user", cx: 250, cy: 310 },
  { label: "Data", zone: "user", cx: 235, cy: 365 },
  { label: "Journeys", zone: "user", cx: 330, cy: 370 },
  { label: "Retention", zone: "user", cx: 270, cy: 420 },
  { label: "Claude Code", zone: "tech", cx: 740, cy: 180 },
  { label: "Cursor", zone: "tech", cx: 850, cy: 205 },
  { label: "Claude API", zone: "tech", cx: 735, cy: 240 },
  { label: "MCP", zone: "tech", cx: 860, cy: 280 },
  { label: "APIs", zone: "tech", cx: 860, cy: 365 },
  { label: "Github", zone: "tech", cx: 735, cy: 375 },
  { label: "SEO", zone: "tech", cx: 855, cy: 425 },
  { label: "Vercel", zone: "tech", cx: 760, cy: 430 },
  { label: "Strategy", zone: "biz", cx: 440, cy: 715 },
  { label: "Compliance", zone: "biz", cx: 560, cy: 715 },
  { label: "Adoption", zone: "biz", cx: 690, cy: 715 },
  { label: "Stakeholder", zone: "biz", cx: 475, cy: 765 },
  { label: "Growth loops", zone: "biz", cx: 655, cy: 765 },
  { label: "Experimentation", zone: "biz", cx: 505, cy: 812 },
  { label: "Monetization", zone: "biz", cx: 650, cy: 812 },
];

// Slow sway around each circle. Chips only drift inward from home,
// so a pill never crosses its ring.
const SWAY: Record<Zone, { speed: number; phase: number; amp: number }> = {
  user: { speed: 0.28, phase: 0.4, amp: 0.11 },
  tech: { speed: 0.33, phase: 2.3, amp: 0.11 },
  biz: { speed: 0.24, phase: 4.1, amp: 0.1 },
};

const RING_PHASE: Record<Zone, number> = { user: 0, tech: 2.1, biz: 4.15 };

const INTRO_START = 1.02;
const INTRO_STAGGER = 0.036;
const INTRO_DUR = 0.58;
const MARKER_AT = 2.5;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeOut(p: number) {
  return 1 - (1 - p) ** 3;
}

function damp(cur: number, target: number, k: number) {
  return cur + (target - cur) * k;
}

function zoneOf(el: Element): Zone {
  const z = el.dataset.zone;
  if (z === "user" || z === "tech" || z === "biz") return z;
  return "user";
}

function placeChip(
  g: SVGGElement,
  x: number,
  y: number,
  rot: number,
  scale: number,
) {
  g.setAttribute(
    "transform",
    `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${scale.toFixed(3)})`,
  );
}

function idleOffset(
  home: { x: number; y: number },
  zone: Zone,
  dt: number,
  phase: Phase,
) {
  const circle = CIRCLES[zone];
  const dx = home.x - circle.cx;
  const dy = home.y - circle.cy;
  const homeDist = Math.hypot(dx, dy);
  const sway = SWAY[zone];
  const ang =
    Math.atan2(dy, dx) + Math.sin(dt * sway.speed + sway.phase) * sway.amp;
  const inhale = Math.min(0, Math.sin(dt * phase.sp + phase.py)) * 10;
  const dist = homeDist + inhale;
  return {
    x: circle.cx + Math.cos(ang) * dist - home.x,
    y: circle.cy + Math.sin(ang) * dist - home.y,
    rot: Math.sin(dt * phase.sp + phase.px) * 1.5,
  };
}

function clampToRing(x: number, y: number, zone: Zone, halfDiag: number) {
  const circle = CIRCLES[zone];
  const dx = x - circle.cx;
  const dy = y - circle.cy;
  const dist = Math.hypot(dx, dy);
  const limit = CIRCLE_R - halfDiag - RING_PAD;
  if (dist <= limit || dist === 0) return { x, y };
  const s = limit / dist;
  return { x: circle.cx + dx * s, y: circle.cy + dy * s };
}

export function ProductVennTravel({
  variant,
}: {
  variant?: "travel" | "stage";
} = {}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const animsRef = useRef<Animation[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

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

    const chipRadii: Record<string, ChipHome> = {};
    const hover: { zone: Zone | null; label: string | null } = {
      zone: null,
      label: null,
    };
    // The dragged pill is a fixed element on document.body so it can
    // travel the whole page. The SVG copy stays hidden until it lands.
    const lift: { label: string | null; node: HTMLDivElement | null } = {
      label: null,
      node: null,
    };
    let detachDrag: (() => void) | null = null;
    let returnAnim: Animation | null = null;
    let alive = true;
    let stopTravel: (() => void) | null = null;
    const ac = new AbortController();

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

    const computeChipHomes = () => {
      for (const g of chipGroups) {
        const label = g.dataset.label ?? "";
        const rect = g.querySelector<SVGRectElement>("rect");
        const chip = CHIPS.find((c) => c.label === label);
        if (!rect || !chip) continue;
        const w = Number(rect.getAttribute("width"));
        const h = Number(rect.getAttribute("height"));
        const halfDiag = Math.hypot(w / 2, h / 2);
        const circle = CIRCLES[chip.zone];
        const safeR = CIRCLE_R - halfDiag - RING_PAD;
        const dx = chip.cx - circle.cx;
        const dy = chip.cy - circle.cy;
        const dist = Math.hypot(dx, dy);
        let homeX = chip.cx;
        let homeY = chip.cy;
        if (dist > safeR && dist > 0) {
          const scale = safeR / dist;
          homeX = circle.cx + dx * scale;
          homeY = circle.cy + dy * scale;
        }
        chipRadii[label] = { home: { x: homeX, y: homeY }, halfDiag };
        placeChip(g, homeX, homeY, 0, 1);
      }
    };

    const paintHover = () => {
      for (const g of chipGroups) {
        const info = chipRadii[g.dataset.label ?? ""];
        if (!info) continue;
        if (lift.label === g.dataset.label) {
          g.style.opacity = "0";
          continue;
        }
        const mine = hover.zone === null || hover.zone === zoneOf(g);
        const hot = hover.label !== null && hover.label === g.dataset.label;
        g.style.opacity = mine ? "1" : "0.35";
        placeChip(g, info.home.x, info.home.y, 0, hot ? 1.1 : 1);
      }
      for (const ring of rings) {
        const hot = hover.zone !== null && zoneOf(ring) === hover.zone;
        ring.style.strokeOpacity =
          hover.zone === null ? "0.85" : hot ? "1" : "0.28";
        ring.setAttribute("stroke-width", hot ? "3" : "2");
      }
    };

    for (const g of chipGroups) {
      g.addEventListener(
        "pointerenter",
        () => {
          hover.zone = zoneOf(g);
          hover.label = g.dataset.label ?? null;
          if (reduced) paintHover();
        },
        { signal: ac.signal },
      );
      g.addEventListener(
        "pointerleave",
        () => {
          hover.zone = null;
          hover.label = null;
          if (reduced) paintHover();
        },
        { signal: ac.signal },
      );
    }

    const renderFinal = () => {
      for (const ring of rings) {
        ring.style.strokeDashoffset = "0";
        ring.style.opacity = "1";
      }
      for (const g of chipGroups) g.style.opacity = "1";
      for (const label of zoneLabels) label.style.opacity = "1";
      if (marker) marker.style.opacity = "1";
      if (markerLabel) markerLabel.style.opacity = "1";
      if (arrow) {
        arrow.style.strokeDashoffset = "0";
        arrow.style.opacity = "1";
      }
      if (arrowhead) arrowhead.style.opacity = "1";
      paintHover();
    };

    const screenOf = (x: number, y: number) => {
      const pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      return pt.matrixTransform(ctm);
    };

    const attachDrag = () => {
      for (const g of chipGroups) {
        g.style.cursor = "grab";
        g.style.touchAction = "none";
        g.addEventListener(
          "pointerdown",
          (e) => {
            if (e.button !== 0 || lift.label) return;
            if (!reduced && g.dataset.ready !== "1") return;
            const label = g.dataset.label ?? "";
            const info = chipRadii[label];
            const chip = CHIPS.find((c) => c.label === label);
            if (!info || !chip) return;
            e.preventDefault();
            g.setPointerCapture(e.pointerId);

            const box = g.getBoundingClientRect();
            const originX = box.left + box.width / 2;
            const originY = box.top + box.height / 2;
            const grabDx = e.clientX - originX;
            const grabDy = e.clientY - originY;
            const place = (x: number, y: number, scale: number) =>
              `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;

            const node = document.createElement("div");
            node.textContent = label;
            node.setAttribute("aria-hidden", "true");
            node.style.position = "fixed";
            node.style.zIndex = "80";
            node.style.left = "0";
            node.style.top = "0";
            node.style.margin = "0";
            node.style.display = "flex";
            node.style.alignItems = "center";
            node.style.justifyContent = "center";
            node.style.width = `${box.width}px`;
            node.style.height = `${box.height}px`;
            node.style.borderRadius = "7px";
            node.style.background = CIRCLES[chip.zone].color;
            node.style.color = "var(--venn-cream)";
            node.style.fontFamily = "var(--font-mono), ui-monospace, monospace";
            node.style.fontSize = `${Math.max(11, box.height * 0.46)}px`;
            node.style.lineHeight = "1";
            node.style.pointerEvents = "none";
            node.style.userSelect = "none";
            node.style.whiteSpace = "nowrap";
            node.style.boxShadow =
              "0 14px 28px -16px color-mix(in oklab, var(--fg) 50%, transparent)";
            node.style.transform = place(originX, originY, 1.06);
            document.body.appendChild(node);
            lift.label = label;
            lift.node = node;
            g.style.opacity = "0";
            document.body.style.cursor = "grabbing";

            let lastX = originX;
            let lastY = originY;
            let settled = false;
            const move = (ev: PointerEvent) => {
              lastX = ev.clientX - grabDx;
              lastY = ev.clientY - grabDy;
              node.style.transform = place(lastX, lastY, 1.06);
            };
            const up = () => {
              if (settled) return;
              settled = true;
              detachDrag?.();
              detachDrag = null;
              document.body.style.cursor = "";
              const home = screenOf(info.home.x, info.home.y);
              returnAnim = node.animate(
                [
                  { transform: place(lastX, lastY, 1.06) },
                  { transform: place(home.x, home.y, 1) },
                ],
                {
                  duration: reduced ? 1 : 520,
                  easing: "cubic-bezier(.22,.9,.3,1)",
                  fill: "forwards",
                },
              );
              returnAnim.onfinish = () => {
                node.remove();
                returnAnim = null;
                if (lift.node !== node) return;
                lift.label = null;
                lift.node = null;
                if (alive) g.style.opacity = "1";
              };
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
            window.addEventListener("pointercancel", up);
            detachDrag = () => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
              window.removeEventListener("pointercancel", up);
            };
          },
          { signal: ac.signal },
        );
      }
    };

    const playIntro = () => {
      rings.forEach((ring, i) => {
        ring.style.strokeDasharray = "1";
        ring.style.strokeDashoffset = "1";
        ring.style.opacity = "1";
        animsRef.current.push(
          ring.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
            duration: 1000,
            delay: 80 + i * 160,
            easing: "cubic-bezier(.4,0,.2,1)",
            fill: "forwards",
          }),
        );
      });

      zoneLabels.forEach((label, i) => {
        animsRef.current.push(
          label.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 480,
            delay: 640 + i * 160,
            easing: "ease-out",
            fill: "forwards",
          }),
        );
      });
    };

    let markerStarted = false;
    const playMarker = (delay: number) => {
      if (markerStarted) return;
      markerStarted = true;
      // Travel already delivered the pin from the portrait. Showing the
      // SVG circle with the old scale-in makes a second dot fly in from
      // the right, because its transform origin sits far outside the circle.
      const carried = variant === "travel";
      if (marker && variant !== "stage") {
        if (carried) {
          marker.style.opacity = "1";
          marker.style.transform = "none";
        } else {
          animsRef.current.push(
            marker.animate(
              [
                { opacity: 1, transform: "scale(0)" },
                { opacity: 1, transform: "scale(1)" },
              ],
              {
                duration: 550,
                delay,
                easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                fill: "forwards",
              },
            ),
          );
        }
      }
      const afterPin = carried ? 180 : 550;
      if (arrow) {
        const len = arrow.getTotalLength();
        arrow.style.strokeDasharray = String(len);
        arrow.style.strokeDashoffset = String(len);
        arrow.style.opacity = "1";
        animsRef.current.push(
          arrow.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
            duration: 700,
            delay: delay + afterPin,
            easing: "cubic-bezier(.4,0,.2,1)",
            fill: "forwards",
          }),
        );
      }
      if (arrowhead) {
        animsRef.current.push(
          arrowhead.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
            delay: delay + afterPin + 700,
            easing: "ease-out",
            fill: "forwards",
          }),
        );
      }
      if (markerLabel) {
        const labelAnim = markerLabel.animate(
          [
            { opacity: 0, transform: "translateX(8px)" },
            { opacity: 1, transform: "translateX(0px)" },
          ],
          {
            duration: 400,
            delay: delay + afterPin + 860,
            easing: "cubic-bezier(.2,.7,.3,1)",
            fill: "forwards",
          },
        );
        animsRef.current.push(labelAnim);
        if (variant === "stage") {
          void labelAnim.finished.then(() => {
            if (!alive) return;
            window.dispatchEvent(new Event("venn-stage-ready"));
          });
        }
      }
    };

    const kickOff = () => {
      if (!alive) return;
      sizePills();
      computeChipHomes();
      attachDrag();
      if (variant === "stage") {
        for (const g of chipGroups) g.style.pointerEvents = "none";
      }
      if (reduced) {
        for (const g of chipGroups) g.dataset.ready = "1";
        renderFinal();
        return;
      }

      playIntro();
      if (variant === "travel") {
        const onArrive = () => playMarker(40);
        if (document.documentElement.dataset.heroPin === "1") {
          onArrive();
        } else {
          window.addEventListener("hero-pin-arrived", onArrive);
          const fallback = window.setTimeout(() => playMarker(0), 5600);
          stopTravel = () => {
            window.removeEventListener("hero-pin-arrived", onArrive);
            window.clearTimeout(fallback);
          };
        }
      } else {
        playMarker(MARKER_AT * 1000);
      }

      const motion: ChipMotion[] = chipGroups.map(() => ({
        x: 0,
        y: 0,
        rot: 0,
        scale: 0.92,
        op: 0,
      }));
      const ringMotion: RingMotion[] = rings.map(() => ({
        op: 0.85,
        width: 2,
      }));
      const phases: Phase[] = chipGroups.map((_, i) => ({
        px: (i * 1.37) % (Math.PI * 2),
        py: (i * 2.11) % (Math.PI * 2),
        sp: 0.45 + (i % 6) * 0.07,
      }));
      const t0 = performance.now();

      const tick = (now: number) => {
        const dt = (now - t0) / 1000;

        rings.forEach((ring, i) => {
          const zone = zoneOf(ring);
          const breathe =
            0.58 + 0.36 * (0.5 + 0.5 * Math.sin(dt * 0.7 + RING_PHASE[zone]));
          const drawn = clamp01((dt - 1.35) / 0.45);
          let targetOp = 0.85 * (1 - drawn) + breathe * drawn;
          let targetW = 2;
          if (hover.zone) {
            const hot = zone === hover.zone;
            targetOp = hot ? 1 : 0.28;
            targetW = hot ? 3 : 1.5;
          }
          const state = ringMotion[i];
          if (!state) return;
          state.op = damp(state.op, targetOp, 0.14);
          state.width = damp(state.width, targetW, 0.18);
          ring.style.strokeOpacity = String(state.op);
          ring.setAttribute("stroke-width", state.width.toFixed(2));
        });

        chipGroups.forEach((g, i) => {
          const label = g.dataset.label ?? "";
          const info = chipRadii[label];
          const state = motion[i];
          const phase = phases[i];
          if (!info || !state || !phase) return;
          if (lift.label === label) {
            placeChip(g, info.home.x, info.home.y, 0, 1);
            g.style.opacity = "0";
            g.style.pointerEvents = "none";
            return;
          }
          const zone = zoneOf(g);
          const circle = CIRCLES[zone];
          const age = dt - (INTRO_START + i * INTRO_STAGGER);
          const introP =
            age >= INTRO_DUR ? 1 : age > 0 ? easeOut(age / INTRO_DUR) : 0;
          const hot = hover.label === label;
          const mine = hover.zone === null || hover.zone === zone;
          const idle = idleOffset(info.home, zone, dt, phase);
          const relX = hot || introP < 1 ? 0 : idle.x;
          const relY = hot || introP < 1 ? 0 : idle.y;
          state.x = damp(state.x, relX, 0.14);
          state.y = damp(state.y, relY, 0.14);
          state.rot = damp(state.rot, hot || introP < 1 ? 0 : idle.rot, 0.14);

          const baseScale = introP < 1 ? 0.92 + 0.08 * introP : 1;
          const targetScale = baseScale * (hot ? 1.1 : 1);
          state.scale =
            introP < 1 ? targetScale : damp(state.scale, targetScale, 0.22);
          const targetOp = introP * (mine ? 1 : 0.35);
          state.op =
            introP < 1 && hover.zone === null
              ? targetOp
              : damp(state.op, targetOp, 0.16);

          const pullDx = info.home.x - circle.cx;
          const pullDy = info.home.y - circle.cy;
          const pullDist = Math.hypot(pullDx, pullDy) || 1;
          const fromX = info.home.x - (pullDx / pullDist) * 28;
          const fromY = info.home.y - (pullDy / pullDist) * 28;
          const rawX = fromX + (info.home.x - fromX) * introP + state.x;
          const rawY = fromY + (info.home.y - fromY) * introP + state.y;
          const placed = clampToRing(rawX, rawY, zone, info.halfDiag);
          placeChip(g, placed.x, placed.y, state.rot, state.scale);
          g.style.opacity = String(state.op);
          g.dataset.ready = introP >= 1 ? "1" : "0";
          if (variant !== "stage") {
            g.style.pointerEvents = introP >= 1 ? "auto" : "none";
          }
        });

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (alive) kickOff();
      });
    } else {
      kickOff();
    }

    return () => {
      alive = false;
      ac.abort();
      detachDrag?.();
      returnAnim?.cancel();
      lift.node?.remove();
      document.body.style.cursor = "";
      stopTravel?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      for (const anim of animsRef.current) {
        try {
          anim.cancel();
        } catch {
          // ignore
        }
      }
      animsRef.current = [];
    };
  }, [variant]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 940"
      xmlns="http://www.w3.org/2000/svg"
      className={
        variant === "stage"
          ? "block h-[100svh] w-full"
          : "block h-auto w-full overflow-visible"
      }
      overflow="visible"
      role="img"
      aria-label="A three-circle Venn diagram showing User, Technology, and Business. Each circle holds the tools and topics I work across; the green marker sits where they overlap and labels 'I'm here.'"
    >
      {(Object.keys(CIRCLES) as Zone[]).map((z) => {
        const c = CIRCLES[z];
        return (
          <circle
            key={z}
            data-role="ring"
            data-zone={z}
            cx={c.cx}
            cy={c.cy}
            r={CIRCLE_R}
            fill="none"
            stroke={c.color}
            strokeWidth={2}
            strokeOpacity={0.85}
            pathLength={1}
            pointerEvents="none"
            style={{ opacity: 0 }}
          />
        );
      })}

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
            pointerEvents="none"
            style={{ opacity: 0 }}
          >
            {z.text}
          </text>
        );
      })}

      {CHIPS.map((chip) => {
        const color = CIRCLES[chip.zone].color;
        return (
          <g
            key={chip.label}
            data-role="chip"
            data-label={chip.label}
            data-zone={chip.zone}
            transform={`translate(${chip.cx} ${chip.cy})`}
            style={{ opacity: 0, cursor: "grab", touchAction: "none" }}
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
              pointerEvents="none"
            >
              {chip.label}
            </text>
          </g>
        );
      })}

      {variant === "stage" ? null : (
        <circle
          data-role="marker"
          cx={MARKER.x}
          cy={MARKER.y}
          r="9"
          fill="var(--accent)"
          pointerEvents="none"
          style={{
            opacity: 0,
            transformOrigin: "560px 445px",
            transformBox: "fill-box",
          }}
        />
      )}
      <path
        data-role="arrow"
        d={
          variant === "stage"
            ? "M 648 452 C 780 466 880 472 948 470"
            : "M 574 448 C 720 468 882 476 1023 471"
        }
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pointerEvents="none"
        style={{ opacity: 0 }}
      />
      <polygon
        data-role="arrowhead"
        points={
          variant === "stage"
            ? "948,470 935,463.5 935,476.5"
            : "1023,471 1010,464.5 1010,477.5"
        }
        fill="var(--accent)"
        transform={
          variant === "stage" ? "rotate(-1 948 470)" : "rotate(-2 1023 471)"
        }
        pointerEvents="none"
        style={{ opacity: 0 }}
      />
      <text
        data-role="marker-label"
        x={variant === "stage" ? 964 : 1040}
        y={variant === "stage" ? 478 : 477}
        fontFamily={
          variant === "stage"
            ? "var(--font-hand), cursive"
            : "var(--font-serif), serif"
        }
        fontStyle={variant === "stage" ? "normal" : "italic"}
        fontSize={variant === "stage" ? 28 : 30}
        fill="var(--accent)"
        pointerEvents="none"
        style={{ opacity: 0 }}
      >
        {variant === "stage" ? "That's me." : "I'm here"}
      </text>
    </svg>
  );
}
