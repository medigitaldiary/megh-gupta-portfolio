"use client";

import { useState } from "react";
import {
  getEfficiencyLabCards,
  getSideQuestLabCards,
  LAB_STAGE_LABEL,
  type LabCard,
} from "@/lib/lab";
import { getFeaturedStack, type StackTool } from "@/lib/stack";

// Rick's-lab-themed workbench scene — replaces the previous cards fold.
// Every hoverable object represents a real portfolio piece.
// - Portal (left): metaphor for 0→1 experiments
// - CRT stack: Claude with the loaded skill files (hover a line for details)
// - Flasks: three Side Quest projects (hover for chemistry smoke tooltips)
// - GitHub softboard: last 26 weeks of contribution grid
// - Pegboard: apps I build with, hanging on hooks
// - Bulletin board: my stack, red-string investigation-style
// SVG viewBox 1200×600; scales edge-to-edge.

type HoverKey =
  | { kind: "portal" }
  | { kind: "crt" }
  | { kind: "flask"; slug: string }
  | { kind: "github" }
  | { kind: "pegboard" }
  | { kind: "stack" }
  | null;

const FLASK_COLORS: Record<NonNullable<LabCard["stage"]>, string> = {
  v1: "#1F4D3A",
  building: "#C77E3B",
  testing: "#4A72B0",
  shipped: "#1F4D3A",
};

const APPS = [
  { name: "Claude", stroke: "#6EE7A0" },
  { name: "Cursor", stroke: "#4A72B0" },
  { name: "Figma", stroke: "#C1497F" },
  { name: "Notion", stroke: "#C77E3B" },
  { name: "GitHub", stroke: "#6EE7A0" },
  { name: "Linear", stroke: "#4A72B0" },
  { name: "Vercel", stroke: "#C8A94A" },
  { name: "Slack", stroke: "#A83232" },
];

// Six months of pseudo-random GitHub contribution intensities.
// Values 0..4 (empty → dark green). Frozen; refresh at next data pass.
const GH_GRID: number[][] = [
  [
    0, 1, 2, 0, 2, 1, 3, 0, 2, 1, 0, 3, 4, 3, 1, 0, 2, 3, 4, 3, 2, 0, 1, 3, 4,
    4,
  ],
  [
    2, 3, 4, 3, 1, 2, 0, 3, 4, 3, 2, 1, 3, 4, 4, 4, 3, 1, 4, 3, 2, 0, 3, 4, 4,
    4,
  ],
  [
    3, 4, 4, 4, 3, 3, 1, 3, 4, 4, 3, 3, 4, 4, 4, 4, 3, 4, 4, 4, 3, 1, 3, 4, 4,
    4,
  ],
  [
    4, 4, 3, 1, 0, 3, 4, 3, 1, 3, 4, 4, 4, 3, 3, 4, 4, 3, 4, 4, 3, 3, 4, 4, 4,
    4,
  ],
  [
    3, 4, 3, 0, 0, 1, 3, 4, 3, 1, 3, 4, 4, 3, 1, 3, 4, 3, 3, 4, 3, 4, 4, 4, 4,
    4,
  ],
  [
    1, 3, 3, 0, 0, 1, 1, 3, 1, 3, 1, 3, 4, 3, 1, 3, 4, 3, 1, 3, 4, 3, 4, 4, 4,
    3,
  ],
  [
    0, 0, 1, 0, 0, 0, 1, 0, 1, 3, 0, 0, 1, 0, 1, 3, 0, 0, 1, 3, 0, 1, 3, 4, 3,
    1,
  ],
];

const GH_COLORS = ["#2E2620", "#0E3B25", "#215D3F", "#43A163", "#6EE7A0"];

export function LabScene() {
  const efficiency = getEfficiencyLabCards();
  const sideQuest = getSideQuestLabCards();
  const stack = getFeaturedStack().slice(0, 6);
  const [hover, setHover] = useState<HoverKey>(null);

  const callout = renderCallout({ hover, efficiency, sideQuest });

  const enterPortal = () => setHover({ kind: "portal" });
  const enterCrt = () => setHover({ kind: "crt" });
  const enterGithub = () => setHover({ kind: "github" });
  const enterPegboard = () => setHover({ kind: "pegboard" });
  const enterStack = () => setHover({ kind: "stack" });
  const leave = () => setHover(null);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1200 600"
        role="img"
        aria-label="Rick's lab: a workbench with portal, CRT screens, flasks, a pegboard of tools, and a bulletin board"
        className="block h-auto w-full"
      >
        <defs>
          <filter
            id="lab-softHalo"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter
            id="lab-sparkGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="lab-objShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#000"
              floodOpacity="0.55"
            />
          </filter>
          <filter
            id="lab-softShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#000"
              floodOpacity="0.4"
            />
          </filter>
          <filter
            id="lab-smokeBlur"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <linearGradient id="lab-crtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#12281E" />
            <stop offset="1" stopColor="#0A1611" />
          </linearGradient>
          <linearGradient id="lab-wallLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2E2620" />
            <stop offset="0.35" stopColor="#221F1B" />
            <stop offset="1" stopColor="#141210" />
          </linearGradient>
          <radialGradient id="lab-bulbGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFD98A" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#FFB84D" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FFB84D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lab-benchTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5A4A3C" />
            <stop offset="1" stopColor="#3F3428" />
          </linearGradient>
          <linearGradient id="lab-benchFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2E2620" />
            <stop offset="1" stopColor="#181410" />
          </linearGradient>
          <linearGradient id="lab-floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A1613" />
            <stop offset="1" stopColor="#0E0B08" />
          </linearGradient>
          <clipPath id="lab-flask-a">
            <path d="M542 400 l-24 60 a30 30 0 0 0 64 0 l-24 -60 z" />
          </clipPath>
          <clipPath id="lab-flask-b">
            <path d="M620 400 l-24 60 a30 30 0 0 0 64 0 l-24 -60 z" />
          </clipPath>
          <clipPath id="lab-flask-c">
            <path d="M698 400 l-24 60 a30 30 0 0 0 64 0 l-24 -60 z" />
          </clipPath>
          <pattern
            id="lab-pegDots"
            x="0"
            y="0"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="9" cy="9" r="1.2" fill="#5C544A" />
          </pattern>
        </defs>

        {/* Ceiling strip */}
        <rect x="0" y="0" width="1200" height="20" fill="#0E0C0A" />
        <line x1="0" x2="1200" y1="20" y2="20" stroke="#000" strokeWidth="1" />

        {/* Back wall */}
        <rect
          x="0"
          y="20"
          width="1200"
          height="440"
          fill="url(#lab-wallLight)"
        />
        <g stroke="#2A2620" strokeWidth="1" opacity="0.55">
          <line x1="0" x2="1200" y1="80" y2="80" />
          <line x1="0" x2="1200" y1="180" y2="180" />
          <line x1="0" x2="1200" y1="290" y2="290" />
        </g>
        <rect
          x="0"
          y="452"
          width="1200"
          height="8"
          fill="url(#lab-wallLight)"
          opacity="0.8"
        />

        {/* Ceiling pendant bulb */}
        <g className="lab-bulb-swing">
          <line
            x1="610"
            y1="20"
            x2="610"
            y2="70"
            stroke="#2A2620"
            strokeWidth="1.4"
          />
          <g className="lab-bulb-glow">
            <ellipse
              cx="610"
              cy="90"
              rx="280"
              ry="200"
              fill="url(#lab-bulbGlow)"
              opacity="0.55"
            />
            <circle
              cx="610"
              cy="80"
              r="9"
              fill="#FFE4A6"
              filter="url(#lab-sparkGlow)"
            />
            <path d="M604 68 h12 v-4 h-12 z" fill="#2A2620" />
          </g>
        </g>

        {/* Floor */}
        <rect
          x="0"
          y="460"
          width="1200"
          height="140"
          fill="url(#lab-floorGrad)"
        />
        <line
          x1="0"
          x2="1200"
          y1="460"
          y2="460"
          stroke="#000"
          strokeWidth="1"
        />

        {/* Workbench: top face + front face for a 3D read */}
        <polygon
          points="60,436 1140,436 1140,442 60,442"
          fill="url(#lab-benchTop)"
        />
        <rect
          x="60"
          y="442"
          width="1080"
          height="18"
          fill="url(#lab-benchFront)"
        />
        <line
          x1="60"
          x2="1140"
          y1="436"
          y2="436"
          stroke="#7A5F3F"
          strokeWidth="0.6"
          opacity="0.7"
        />
        <rect x="90" y="460" width="16" height="140" fill="#0E0B08" />
        <rect x="1094" y="460" width="16" height="140" fill="#0E0B08" />

        {/* Portal zone */}
        <PortalZone onEnter={enterPortal} onLeave={leave} />

        {/* CRT stack */}
        <CrtZone efficiency={efficiency} onEnter={enterCrt} onLeave={leave} />

        {/* GitHub softboard */}
        <GithubZone onEnter={enterGithub} onLeave={leave} />

        {/* Flasks — 3 side quests */}
        <FlasksZone
          sideQuest={sideQuest}
          onEnter={(slug) => setHover({ kind: "flask", slug })}
          onLeave={leave}
        />

        {/* Pegboard — apps I use */}
        <PegboardZone onEnter={enterPegboard} onLeave={leave} />

        {/* Bulletin board — my stack (absorbs the old Stack fold) */}
        <BulletinZone stack={stack} onEnter={enterStack} onLeave={leave} />

        {/* Portal-gun sitting on the bench */}
        <g filter="url(#lab-softShadow)">
          <rect x="380" y="430" width="46" height="10" rx="2" fill="#3A342E" />
          <circle cx="380" cy="435" r="4" fill="#6EE7A0" />
        </g>

        {/* Coffee mug */}
        <g transform="translate(770 405)" filter="url(#lab-softShadow)">
          <path
            d="M0 0 h30 v28 a8 8 0 0 1 -8 8 h-14 a8 8 0 0 1 -8 -8 z"
            fill="#F1EBDF"
            stroke="#0A0806"
            strokeWidth="1.2"
          />
          <path
            d="M30 8 a8 8 0 0 1 0 18"
            fill="none"
            stroke="#0A0806"
            strokeWidth="1.2"
          />
          <text
            x="15"
            y="22"
            textAnchor="middle"
            fontFamily="var(--font-hand), cursive"
            fontSize="9"
            fill="#A83232"
          >
            PM
          </text>
        </g>

        <text
          x="600"
          y="556"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="10"
          fill="#5C544A"
          letterSpacing="4"
        >
          HOVER · ANY · OBJECT
        </text>
      </svg>

      {/* Callout below the scene — narrates whatever's being hovered. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
        <output
          aria-live="polite"
          className={`max-w-md rounded-lg border border-white/10 bg-black/70 px-4 py-3 text-left shadow-lg backdrop-blur transition-opacity duration-150 ${
            callout ? "opacity-100" : "opacity-0"
          }`}
        >
          {callout ?? <span className="text-white/40">&nbsp;</span>}
        </output>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Callout
// ─────────────────────────────────────────────────────────────

function renderCallout({
  hover,
  efficiency,
  sideQuest,
}: {
  hover: HoverKey;
  efficiency: LabCard[];
  sideQuest: LabCard[];
}) {
  if (!hover) return null;

  const eyebrow = (t: string) => (
    <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--accent)]">
      {t}
    </p>
  );

  if (hover.kind === "portal") {
    return (
      <div>
        {eyebrow("Portal · 0→1 experiments")}
        <p className="mt-1 font-serif text-base text-white">
          Where new experiments walk out onto the workbench.
        </p>
        <p className="mt-1 text-sm text-white/70">
          Every Side Quest below started here as a hunch.
        </p>
      </div>
    );
  }
  if (hover.kind === "crt") {
    return (
      <div>
        {eyebrow(`Workbench · Claude · ${efficiency.length} skills loaded`)}
        <p className="mt-1 font-serif text-base text-white">
          Efficiency tools running on the workstation.
        </p>
        <p className="mt-1 text-sm text-white/70">
          Hover any file on the screen for what it does.
        </p>
      </div>
    );
  }
  if (hover.kind === "flask") {
    const card = sideQuest.find((c) => c.slug === hover.slug);
    if (!card) return null;
    return (
      <div>
        {eyebrow(
          `Side Quest · ${card.stage ? LAB_STAGE_LABEL[card.stage] : "experiment"}`,
        )}
        <p className="mt-1 font-serif text-base text-white">{card.title}</p>
        <p className="mt-1 text-sm text-white/70">{card.description}</p>
      </div>
    );
  }
  if (hover.kind === "github") {
    return (
      <div>
        {eyebrow("GitHub · last 26 weeks")}
        <p className="mt-1 font-serif text-base text-white">
          Contribution grid pinned to the wall.
        </p>
        <p className="mt-1 text-sm text-white/70">
          Darker = more shipped. Public commits only.
        </p>
      </div>
    );
  }
  if (hover.kind === "pegboard") {
    return (
      <div>
        {eyebrow("Pegboard · apps I use")}
        <p className="mt-1 font-serif text-base text-white">
          Every-day tools hanging by category.
        </p>
        <p className="mt-1 text-sm text-white/70">
          Claude · Cursor · Figma · Notion · GitHub · Linear · Vercel · Slack.
        </p>
      </div>
    );
  }
  if (hover.kind === "stack") {
    return (
      <div>
        {eyebrow("My Stack · red-string investigation")}
        <p className="mt-1 font-serif text-base text-white">
          What this site (and the tools) are built with.
        </p>
        <p className="mt-1 text-sm text-white/70">
          Next.js 15 · React 19 · Tailwind v4 · Supabase · Vercel · Claude Code.
        </p>
      </div>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Zone components
// ─────────────────────────────────────────────────────────────

function PortalZone({
  onEnter,
  onLeave,
}: {
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label="Portal — 0→1 experiments"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      {/* Ambient wall wash */}
      <ellipse
        cx="160"
        cy="240"
        rx="200"
        ry="180"
        fill="#6EE7A0"
        opacity="0.14"
        filter="url(#lab-softHalo)"
      />
      <ellipse
        cx="160"
        cy="475"
        rx="150"
        ry="18"
        fill="#6EE7A0"
        opacity="0.18"
        filter="url(#lab-softHalo)"
      />

      {/* Portal — CSS conic-gradient vortex inside a foreignObject. */}
      <foreignObject
        x="30"
        y="110"
        width="260"
        height="260"
        style={{ overflow: "visible" }}
      >
        <div
          className="relative h-full w-full"
          style={{ borderRadius: "50%", isolation: "isolate" }}
        >
          <div
            className="lab-portal-halo absolute rounded-full"
            style={{
              inset: -32,
              background:
                "radial-gradient(circle, rgba(184,245,198,0.75) 0%, rgba(110,231,160,0.45) 30%, rgba(31,77,58,0.15) 60%, transparent 75%)",
              filter: "blur(18px)",
              zIndex: 0,
            }}
          />
          <div
            className="lab-portal-swirl-outer absolute rounded-full"
            style={{
              inset: 22,
              background:
                "conic-gradient(from 0deg, #D8FCE5 0deg, #6EE7A0 40deg, #3E8759 90deg, #0E2A1B 150deg, #4BB77A 200deg, #B8F5C6 260deg, #6EE7A0 310deg, #D8FCE5 360deg)",
              filter: "blur(3px) saturate(1.15)",
              mask: "radial-gradient(circle, transparent 5%, #000 22%, #000 92%, transparent 100%)",
              WebkitMask:
                "radial-gradient(circle, transparent 5%, #000 22%, #000 92%, transparent 100%)",
              zIndex: 1,
            }}
          />
          <div
            className="lab-portal-swirl-inner absolute rounded-full"
            style={{
              inset: 62,
              background:
                "conic-gradient(from 90deg, #F5FFEB 0deg, #B8F5C6 60deg, #6EE7A0 130deg, #1F4D3A 200deg, #6EE7A0 280deg, #F5FFEB 360deg)",
              filter: "blur(4px) saturate(1.2)",
              mask: "radial-gradient(circle, transparent 5%, #000 22%, #000 92%, transparent 100%)",
              WebkitMask:
                "radial-gradient(circle, transparent 5%, #000 22%, #000 92%, transparent 100%)",
              zIndex: 2,
            }}
          />
          <div
            className="lab-portal-core absolute rounded-full"
            style={{
              inset: "42%",
              background:
                "radial-gradient(circle, #fff 0%, #F5FFEB 25%, rgba(184,245,198,0.6) 60%, transparent 85%)",
              filter: "blur(2px)",
              zIndex: 3,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: 22,
              border: "2px solid #08150E",
              boxShadow:
                "inset 0 0 8px rgba(184,245,198,0.9), inset 0 0 22px rgba(110,231,160,0.35), 0 0 12px rgba(110,231,160,0.5)",
              zIndex: 4,
              pointerEvents: "none",
            }}
          />
        </div>
      </foreignObject>

      {/* Sparks */}
      <g fill="#F5FFEB" filter="url(#lab-sparkGlow)">
        <circle className="lab-spark" cx="72" cy="188" r="1.8" />
        <circle className="lab-spark lab-spark-2" cx="248" cy="196" r="1.5" />
        <circle className="lab-spark lab-spark-3" cx="86" cy="300" r="1.6" />
        <circle className="lab-spark lab-spark-4" cx="236" cy="304" r="1.4" />
        <circle className="lab-spark lab-spark-5" cx="160" cy="122" r="1.6" />
      </g>

      <text
        x="160"
        y="392"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontSize="22"
        fill="#F1EBDF"
        fontWeight="700"
      >
        portal
      </text>
      <text
        x="160"
        y="414"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontSize="14"
        fill="#B8B0A0"
      >
        0→1 exits here
      </text>
    </g>
  );
}

function CrtZone({
  efficiency,
  onEnter,
  onLeave,
}: {
  efficiency: LabCard[];
  onEnter: () => void;
  onLeave: () => void;
}) {
  const rows = efficiency.slice(0, 6);
  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label="CRT stack — Claude with skill files loaded"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      <ellipse cx="410" cy="446" rx="110" ry="6" fill="#000" opacity="0.55" />
      <g filter="url(#lab-objShadow)">
        <polygon points="310,296 510,296 500,290 320,290" fill="#4A423A" />
        <rect
          x="310"
          y="296"
          width="200"
          height="150"
          rx="10"
          fill="#3A342E"
          stroke="#0A0806"
          strokeWidth="2"
        />
        <rect
          x="326"
          y="308"
          width="168"
          height="118"
          rx="6"
          fill="url(#lab-crtGrad)"
          stroke="#0A0806"
          strokeWidth="1"
        />
        <rect x="332" y="446" width="12" height="6" fill="#0A0806" />
        <rect x="476" y="446" width="12" height="6" fill="#0A0806" />
      </g>
      <g
        className="lab-flick"
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        fill="#6EE7A0"
      >
        <text x="336" y="326">
          $ claude · loaded {rows.length} skills
        </text>
      </g>
      <g fontFamily="var(--font-mono), monospace" fontSize="9" fill="#6EE7A0">
        {rows.map((card, i) => {
          const y = 331 + i * 12;
          const textY = y + 9;
          const tipY = y + 5;
          const short =
            card.title.length > 26 ? `${card.title.slice(0, 24)}…` : card.title;
          return (
            <g key={card.slug} className="lab-skill-row">
              <rect
                className="lab-skill-hilite"
                x="326"
                y={y}
                width="168"
                height="12"
                fill="transparent"
              />
              <text x="336" y={textY}>
                ▸ {short}
              </text>
              <g className="lab-skill-tip" transform={`translate(504 ${tipY})`}>
                <rect
                  x="0"
                  y="-14"
                  width="200"
                  height="42"
                  rx="6"
                  fill="#F1EBDF"
                  filter="url(#lab-softShadow)"
                />
                <text
                  x="10"
                  y="0"
                  fontFamily="var(--font-mono), monospace"
                  fontSize="7.5"
                  fill="#1F4D3A"
                  letterSpacing="0.06em"
                >
                  {card.title}
                </text>
                <text
                  x="10"
                  y="14"
                  fontFamily="var(--font-sans), sans-serif"
                  fontSize="8"
                  fill="#3A342E"
                >
                  {card.description.slice(0, 44)}
                </text>
                <text
                  x="10"
                  y="24"
                  fontFamily="var(--font-sans), sans-serif"
                  fontSize="8"
                  fill="#3A342E"
                >
                  {card.description.slice(44, 88)}
                </text>
              </g>
            </g>
          );
        })}
        <rect
          className="lab-cursor"
          x="336"
          y={331 + rows.length * 12 + 2}
          width="7"
          height="1.5"
          fill="#6EE7A0"
        />
      </g>
      <g opacity="0.15" stroke="#6EE7A0" strokeWidth="0.6">
        <line x1="326" x2="494" y1="320" y2="320" />
        <line x1="326" x2="494" y1="352" y2="352" />
        <line x1="326" x2="494" y1="384" y2="384" />
        <line x1="326" x2="494" y1="416" y2="416" />
      </g>
      <circle cx="500" cy="435" r="2.5" fill="#6EE7A0" className="lab-led" />

      {/* Upper mini CRT */}
      <g filter="url(#lab-objShadow)">
        <polygon points="335,204 485,204 478,200 342,200" fill="#4A423A" />
        <rect
          x="335"
          y="204"
          width="150"
          height="86"
          rx="8"
          fill="#3A342E"
          stroke="#0A0806"
          strokeWidth="2"
        />
        <rect
          x="347"
          y="214"
          width="126"
          height="66"
          rx="4"
          fill="url(#lab-crtGrad)"
        />
      </g>
      <g
        fontFamily="var(--font-mono), monospace"
        fontSize="8"
        fill="#6EE7A0"
        opacity="0.85"
      >
        <text x="355" y="230">
          CI: pass
        </text>
        <text x="355" y="242">
          deploy: prod ↗
        </text>
        <text x="355" y="254">
          tokens: 8.4k
        </text>
        <text x="355" y="266">
          latency: 240ms
        </text>
      </g>

      <text
        x="410"
        y="474"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontSize="18"
        fill="#F1EBDF"
        fontWeight="700"
      >
        the workbench
      </text>
    </g>
  );
}

function GithubZone({
  onEnter,
  onLeave,
}: {
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label="GitHub — last 26 weeks of activity"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      <g filter="url(#lab-objShadow)">
        <rect x="540" y="60" width="220" height="130" rx="4" fill="#3A2E22" />
        <rect x="546" y="66" width="208" height="118" fill="#8A6D4F" />
        <rect
          x="546"
          y="66"
          width="208"
          height="118"
          fill="#7A5D3F"
          opacity="0.55"
        />
      </g>
      <text
        x="556"
        y="82"
        fontFamily="var(--font-mono), monospace"
        fontSize="8"
        letterSpacing="0.14em"
        fill="#F1EBDF"
        opacity="0.9"
      >
        GITHUB · last 26 wks
      </text>
      <text
        x="744"
        y="82"
        textAnchor="end"
        fontFamily="var(--font-mono), monospace"
        fontSize="8"
        fill="#B8B0A0"
      >
        312 commits
      </text>

      <g transform="translate(556 92)">
        {GH_GRID.map((row, r) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static grid, index is the identity
          <g key={r} transform={`translate(0 ${r * 6})`}>
            {row.map((v, c) => (
              <rect
                // biome-ignore lint/suspicious/noArrayIndexKey: static grid, index is the identity
                key={c}
                x={c * 6}
                y={0}
                width="5"
                height="5"
                rx="1"
                fill={GH_COLORS[v] ?? GH_COLORS[0]}
              />
            ))}
          </g>
        ))}
      </g>

      <g>
        <circle
          cx="550"
          cy="70"
          r="2.5"
          fill="#A83232"
          filter="url(#lab-sparkGlow)"
        />
        <circle
          cx="750"
          cy="70"
          r="2.5"
          fill="#A83232"
          filter="url(#lab-sparkGlow)"
        />
        <circle
          cx="550"
          cy="180"
          r="2.5"
          fill="#A83232"
          filter="url(#lab-sparkGlow)"
        />
        <circle
          cx="750"
          cy="180"
          r="2.5"
          fill="#A83232"
          filter="url(#lab-sparkGlow)"
        />
      </g>
      <text
        x="650"
        y="205"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontSize="14"
        fill="#F1EBDF"
        fontWeight="700"
      >
        github · lately
      </text>
    </g>
  );
}

function FlasksZone({
  sideQuest,
  onEnter,
  onLeave,
}: {
  sideQuest: LabCard[];
  onEnter: (slug: string) => void;
  onLeave: () => void;
}) {
  const positions = [
    { x: 542, cx: 542, clip: "lab-flask-a", pathX: 534 },
    { x: 620, cx: 620, clip: "lab-flask-b", pathX: 612 },
    { x: 698, cx: 698, clip: "lab-flask-c", pathX: 690 },
  ];

  return (
    <g>
      <ellipse cx="542" cy="472" rx="34" ry="4" fill="#000" opacity="0.55" />
      <ellipse cx="620" cy="472" rx="34" ry="4" fill="#000" opacity="0.55" />
      <ellipse cx="698" cy="472" rx="34" ry="4" fill="#000" opacity="0.55" />

      {positions.map((pos, i) => {
        const card = sideQuest[i];
        if (!card) return null;
        const color = card.stage ? FLASK_COLORS[card.stage] : "#1F4D3A";
        const stageLabel = card.stage ? LAB_STAGE_LABEL[card.stage] : "";
        const desc = card.description;
        return (
          // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
          <g
            key={card.slug}
            className="lab-flask-slot"
            role="button"
            tabIndex={0}
            aria-label={`Side quest: ${card.title}`}
            onMouseEnter={() => onEnter(card.slug)}
            onMouseLeave={onLeave}
            onFocus={() => onEnter(card.slug)}
            onBlur={onLeave}
          >
            <g className="lab-smoke" transform={`translate(${pos.cx} 366)`}>
              <g filter="url(#lab-smokeBlur)" opacity="0.9">
                <ellipse
                  cx="0"
                  cy="-20"
                  rx="34"
                  ry="18"
                  fill="#F1EBDF"
                  opacity="0.55"
                />
                <ellipse
                  cx="-10"
                  cy="-30"
                  rx="20"
                  ry="13"
                  fill="#F1EBDF"
                  opacity="0.5"
                />
                <ellipse
                  cx="12"
                  cy="-32"
                  rx="16"
                  ry="11"
                  fill="#F1EBDF"
                  opacity="0.55"
                />
              </g>
              <text
                x="0"
                y="-24"
                textAnchor="middle"
                fontFamily="var(--font-hand), cursive"
                fontSize="11"
                fontWeight="700"
                fill="#1A1613"
              >
                {card.title}
              </text>
              <text
                x="0"
                y="-12"
                textAnchor="middle"
                fontFamily="var(--font-sans), sans-serif"
                fontSize="8"
                fill="#1F4D3A"
              >
                {stageLabel}
              </text>
              <text
                x="0"
                y="-3"
                textAnchor="middle"
                fontFamily="var(--font-sans), sans-serif"
                fontSize="8"
                fill="#1F4D3A"
              >
                {desc.slice(0, 44)}
              </text>
            </g>
            <g filter="url(#lab-softShadow)">
              <path
                d={`M${pos.pathX} 380 h16 v20 l24 60 a30 30 0 0 1 -64 0 l24 -60 z`}
                fill="#0A0806"
                fillOpacity="0.15"
                stroke="#0A0806"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <g clipPath={`url(#${pos.clip})`}>
                <rect
                  x={pos.cx - 42}
                  y="418"
                  width="90"
                  height="80"
                  fill={color}
                  opacity="0.85"
                />
                <ellipse
                  cx={pos.cx}
                  cy="418"
                  rx="20"
                  ry="2.5"
                  fill={color}
                  opacity="0.6"
                />
                <circle
                  cx={pos.cx - 12}
                  cy="452"
                  r="3"
                  fill="#F1EBDF"
                  className="lab-bubble"
                />
                <circle
                  cx={pos.cx + 6}
                  cy="452"
                  r="2.2"
                  fill="#F1EBDF"
                  className="lab-bubble"
                  style={{ animationDelay: "1.2s" }}
                />
                <circle
                  cx={pos.cx}
                  cy="452"
                  r="3.6"
                  fill="#F1EBDF"
                  className="lab-bubble"
                  style={{ animationDelay: "2.4s" }}
                />
              </g>
              <rect
                x={pos.cx - 6}
                y="374"
                width="12"
                height="6"
                fill="#F1EBDF"
              />
            </g>
            <text
              x={pos.cx}
              y="492"
              textAnchor="middle"
              fontFamily="var(--font-hand), cursive"
              fontSize="12"
              fill="#F1EBDF"
            >
              {card.title}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function PegboardZone({
  onEnter,
  onLeave,
}: {
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label="Pegboard — apps I build with"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      <g filter="url(#lab-objShadow)">
        <rect
          x="775"
          y="80"
          width="180"
          height="270"
          rx="6"
          fill="#3A302A"
          stroke="#0A0806"
          strokeWidth="2"
        />
        <rect
          x="782"
          y="88"
          width="166"
          height="254"
          fill="url(#lab-pegDots)"
        />
      </g>
      <line
        x1="782"
        y1="108"
        x2="948"
        y2="108"
        stroke="#0A0806"
        strokeWidth="1"
      />
      <line
        x1="782"
        y1="170"
        x2="948"
        y2="170"
        stroke="#0A0806"
        strokeWidth="1"
      />
      <line
        x1="782"
        y1="232"
        x2="948"
        y2="232"
        stroke="#0A0806"
        strokeWidth="1"
      />
      <line
        x1="782"
        y1="294"
        x2="948"
        y2="294"
        stroke="#0A0806"
        strokeWidth="1"
      />

      <g
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        fill="#F1EBDF"
        textAnchor="middle"
      >
        {APPS.map((app, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 796 + col * 60;
          const y = 118 + row * 62;
          return (
            <g key={app.name}>
              <rect
                x={x}
                y={y}
                width="46"
                height="34"
                rx="4"
                fill="#111"
                stroke={app.stroke}
                strokeWidth="1"
              />
              <text x={x + 23} y={y + 21}>
                {app.name}
              </text>
            </g>
          );
        })}
      </g>
      <text
        x="865"
        y="370"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontSize="18"
        fill="#F1EBDF"
        fontWeight="700"
      >
        apps I use
      </text>
    </g>
  );
}

function BulletinZone({
  stack,
  onEnter,
  onLeave,
}: {
  stack: StackTool[];
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Layout six notes in two columns × three rows on the corkboard.
  // Each note tilts slightly for a hand-pinned feel; a red thread connects
  // them into a "red-string investigation" of the stack.
  const notes = stack.slice(0, 6).map((tool, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const baseX = 1010 + col * 86;
    const baseY = 100 + row * 74;
    const rot = [-4, 3, 2, -3, -2, 2][i] ?? 0;
    const fill =
      ["#F1EBDF", "#F1EBDF", "#D7ECD1", "#F6E8A8", "#F1EBDF", "#D7ECD1"][i] ??
      "#F1EBDF";
    return { tool, baseX, baseY, rot, fill };
  });

  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label="Bulletin board — my stack"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      <g filter="url(#lab-objShadow)">
        <rect
          x="980"
          y="80"
          width="200"
          height="270"
          rx="6"
          fill="#8A6D4F"
          stroke="#0A0806"
          strokeWidth="2"
        />
        <rect
          x="986"
          y="86"
          width="188"
          height="258"
          fill="#7A5D3F"
          opacity="0.5"
        />
      </g>

      {notes.map(({ tool, baseX, baseY, rot, fill }) => (
        <g
          key={tool.slug}
          transform={`translate(${baseX} ${baseY}) rotate(${rot})`}
        >
          <rect
            width="56"
            height="40"
            fill={fill}
            stroke="#B8B0A0"
            strokeWidth="0.5"
          />
          <text
            x="28"
            y="18"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="9"
            fill="#1A1613"
          >
            {tool.name}
          </text>
          <text
            x="28"
            y="30"
            textAnchor="middle"
            fontFamily="var(--font-mono), monospace"
            fontSize="7"
            fill="#7A7469"
          >
            {tool.oneLiner.split(" ").slice(0, 3).join(" ")}
          </text>
          <circle cx="52" cy="4" r="3" fill="#A83232" />
        </g>
      ))}

      {/* Red threads between notes */}
      <g stroke="#A83232" strokeWidth="1.4" fill="none" opacity="0.85">
        <line x1="1062" y1="114" x2="1148" y2="109" />
        <line x1="1038" y1="150" x2="1034" y2="184" />
        <line x1="1128" y1="149" x2="1128" y2="194" />
        <line x1="1062" y1="220" x2="1128" y2="230" />
        <line x1="1038" y1="220" x2="1038" y2="258" />
        <line x1="1128" y1="230" x2="1124" y2="264" />
      </g>

      <text
        x="1080"
        y="370"
        textAnchor="middle"
        fontFamily="var(--font-hand), cursive"
        fontSize="18"
        fill="#F1EBDF"
        fontWeight="700"
      >
        my stack
      </text>
    </g>
  );
}
