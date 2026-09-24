"use client";

import { useState } from "react";
import {
  getEfficiencyLabCards,
  getSideQuestLabCards,
  LAB_STAGE_LABEL,
  type LabCard,
} from "@/lib/lab";

// A workbench-style vignette that sits above the Lab subsections.
// - Laptop with Claude open, listing the six Efficiency Tools
// - Three flasks for the three Side Quests, each with a stage color
// - Hover any labeled object to see its details in the callout panel
//
// The whole thing is a single inline SVG at 800×360 viewBox, so it scales
// crisply. Animations are pure CSS keyframes (see app/globals.css) and
// respect prefers-reduced-motion.

type HoverKey =
  | { kind: "laptop" }
  | { kind: "flask"; slug: string }
  | { kind: "note" }
  | null;

const FLASK_COLORS: Record<NonNullable<LabCard["stage"]>, string> = {
  v1: "var(--accent)",
  building: "#c77e3b",
  testing: "#4a72b0",
  shipped: "var(--accent)",
};

export function LabScene() {
  const efficiency = getEfficiencyLabCards();
  const sideQuest = getSideQuestLabCards();
  const [hover, setHover] = useState<HoverKey>(null);

  // Layout flasks along the right side of the workbench.
  const flaskPositions = [
    { x: 460, cardIndex: 0 },
    { x: 570, cardIndex: 1 },
    { x: 680, cardIndex: 2 },
  ];

  const callout = renderCallout({ hover, efficiency, sideQuest });

  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
      {/* SVG scene */}
      <svg
        viewBox="0 0 800 360"
        role="img"
        aria-label="A workbench illustration: a laptop with Claude open next to three lab flasks"
        className="block h-auto w-full"
      >
        <title>Megh&apos;s Lab — workbench view</title>

        {/* Back wall — subtle pegboard hint */}
        <rect x="0" y="0" width="800" height="230" fill="var(--bg)" />
        <g stroke="var(--border)" strokeWidth="0.5" opacity="0.6">
          {Array.from({ length: 12 }, (_, i) => 20 + i * 18).map((y) => (
            <line key={`peg-${y}`} x1="0" x2="800" y1={y} y2={y} />
          ))}
        </g>

        {/* Desk surface */}
        <rect
          x="0"
          y="230"
          width="800"
          height="130"
          fill="var(--bg-elevated)"
        />
        <line
          x1="0"
          x2="800"
          y1="230"
          y2="230"
          stroke="var(--fg)"
          strokeWidth="1"
        />

        {/* Sticky notes on the wall */}
        {/* biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available */}
        <g
          role="button"
          tabIndex={0}
          aria-label="Notes to self — hover for details"
          onMouseEnter={() => setHover({ kind: "note" })}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover({ kind: "note" })}
          onBlur={() => setHover(null)}
          className="cursor-help focus:outline-none"
        >
          <g transform="translate(60 40) rotate(-4)">
            <rect
              width="72"
              height="60"
              fill="#f6e8a8"
              stroke="var(--border)"
              strokeWidth="0.5"
            />
            <line
              x1="10"
              x2="60"
              y1="18"
              y2="18"
              stroke="#c8a94a"
              strokeWidth="1"
            />
            <line
              x1="10"
              x2="55"
              y1="30"
              y2="30"
              stroke="#c8a94a"
              strokeWidth="1"
            />
            <line
              x1="10"
              x2="45"
              y1="42"
              y2="42"
              stroke="#c8a94a"
              strokeWidth="1"
            />
          </g>
          <g transform="translate(150 55) rotate(3)">
            <rect
              width="72"
              height="60"
              fill="#d7ecd1"
              stroke="var(--border)"
              strokeWidth="0.5"
            />
            <line
              x1="10"
              x2="55"
              y1="18"
              y2="18"
              stroke="#6a8a5c"
              strokeWidth="1"
            />
            <line
              x1="10"
              x2="60"
              y1="30"
              y2="30"
              stroke="#6a8a5c"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Coffee mug */}
        <g transform="translate(300 168)">
          <path
            d="M0 0 h44 v50 a12 12 0 0 1 -12 12 h-20 a12 12 0 0 1 -12 -12 z"
            fill="var(--bg-elevated)"
            stroke="var(--fg)"
            strokeWidth="1.2"
          />
          <path
            d="M44 12 a10 10 0 0 1 0 30"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="1.2"
          />
          {/* Steam */}
          <g
            opacity="0.55"
            stroke="var(--fg-subtle)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M12 -6 q4 -8 0 -16" />
            <path d="M24 -6 q-4 -8 0 -16" />
            <path d="M34 -6 q4 -8 0 -16" />
          </g>
        </g>

        {/* Laptop */}
        <LaptopGroup
          efficiency={efficiency}
          onEnter={() => setHover({ kind: "laptop" })}
          onLeave={() => setHover(null)}
          active={hover?.kind === "laptop"}
        />

        {/* Flasks */}
        {flaskPositions.map(({ x, cardIndex }) => {
          const card = sideQuest[cardIndex];
          if (!card) return null;
          const color = card.stage ? FLASK_COLORS[card.stage] : "var(--accent)";
          const active = hover?.kind === "flask" && hover.slug === card.slug;
          return (
            <FlaskGroup
              key={card.slug}
              x={x}
              color={color}
              label={card.title}
              onEnter={() => setHover({ kind: "flask", slug: card.slug })}
              onLeave={() => setHover(null)}
              active={active}
            />
          );
        })}

        {/* Wire from laptop to first flask */}
        <path
          d="M310 300 C 380 320, 400 300, 470 292"
          fill="none"
          stroke="var(--fg-subtle)"
          strokeWidth="1.2"
          strokeDasharray="3 4"
          opacity="0.7"
        />
      </svg>

      {/* Overlaid callout (React, positioned over the SVG) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4 pb-4 md:px-6 md:pb-6">
        <output
          aria-live="polite"
          className={`max-w-md rounded-lg border border-border bg-bg/95 px-4 py-3 shadow-sm backdrop-blur-sm transition-opacity duration-150 ${
            callout ? "opacity-100" : "opacity-0"
          }`}
        >
          {callout ?? <span className="text-fg-subtle">&nbsp;</span>}
        </output>
      </div>
    </div>
  );
}

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

  if (hover.kind === "laptop") {
    return (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
          Workbench · Claude
        </p>
        <p className="mt-1 font-serif text-base text-fg">
          {efficiency.length} skill files &amp; personal tools loaded
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Compliance reviewer · Interview prep · MoEngage MCP · Call analysis ·
          Bond Dictionary · Job Search OS.
        </p>
      </div>
    );
  }

  if (hover.kind === "flask") {
    const card = sideQuest.find((c) => c.slug === hover.slug);
    if (!card) return null;
    return (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
          Side Quest · {card.stage ? LAB_STAGE_LABEL[card.stage] : "experiment"}
        </p>
        <p className="mt-1 font-serif text-base text-fg">{card.title}</p>
        <p className="mt-1 text-sm text-fg-muted">{card.description}</p>
      </div>
    );
  }

  if (hover.kind === "note") {
    return (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
          Notes to self
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Rough drafts, product hunches, TODOs that haven&apos;t earned a card
          yet.
        </p>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────
// SVG groups
// ─────────────────────────────────────────────────────────────

function LaptopGroup({
  efficiency,
  onEnter,
  onLeave,
  active,
}: {
  efficiency: LabCard[];
  onEnter: () => void;
  onLeave: () => void;
  active: boolean;
}) {
  const skillTitles = efficiency.slice(0, 6).map((c) => c.title);
  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label="Laptop with Claude open — hover to see skill files loaded"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      {/* Laptop base */}
      <path
        d="M100 300 h240 l16 14 h-272 z"
        fill="var(--bg-elevated)"
        stroke="var(--fg)"
        strokeWidth="1.2"
      />
      <line
        x1="196"
        x2="260"
        y1="308"
        y2="308"
        stroke="var(--fg-subtle)"
        strokeWidth="1"
      />

      {/* Screen bezel */}
      <rect
        x="110"
        y="178"
        width="220"
        height="122"
        rx="4"
        fill="var(--fg)"
        stroke={active ? "var(--accent)" : "var(--fg)"}
        strokeWidth={active ? "2" : "1"}
      />

      {/* Screen inside */}
      <rect x="118" y="186" width="204" height="106" rx="2" fill="var(--bg)" />

      {/* App titlebar */}
      <rect x="118" y="186" width="204" height="14" fill="var(--bg-elevated)" />
      <circle cx="127" cy="193" r="2" fill="#e15c5c" />
      <circle cx="135" cy="193" r="2" fill="#e5b545" />
      <circle cx="143" cy="193" r="2" fill="#6bb572" />
      <text
        x="220"
        y="196"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="6.5"
        fill="var(--fg-muted)"
      >
        claude · skills
      </text>

      {/* Skill file rows */}
      <g fontFamily="var(--font-mono)" fontSize="7" fill="var(--fg)">
        {skillTitles.map((t, i) => (
          <g key={t} transform={`translate(126 ${212 + i * 12})`}>
            <rect
              x="-2"
              y="-7"
              width="192"
              height="10"
              rx="2"
              fill="transparent"
            />
            <text x="0" y="0" fill="var(--fg-subtle)">
              ▸
            </text>
            <text x="10" y="0">
              {t.length > 32 ? `${t.slice(0, 30)}…` : t}
            </text>
          </g>
        ))}
        {/* Blinking cursor */}
        <rect
          x="126"
          y={212 + skillTitles.length * 12 - 7}
          width="6"
          height="9"
          fill="var(--accent)"
          className="lab-cursor"
        />
      </g>

      {/* LED on hinge */}
      <circle
        cx="220"
        cy="303"
        r="1.6"
        fill="var(--accent)"
        className="lab-led"
      />

      {/* Label */}
      <text
        x="220"
        y="336"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1"
        fill="var(--fg-subtle)"
      >
        WORKBENCH · CLAUDE
      </text>
    </g>
  );
}

function FlaskGroup({
  x,
  color,
  label,
  onEnter,
  onLeave,
  active,
}: {
  x: number;
  color: string;
  label: string;
  onEnter: () => void;
  onLeave: () => void;
  active: boolean;
}) {
  const strokeColor = active ? "var(--accent)" : "var(--fg)";
  const strokeWidth = active ? 1.8 : 1.2;
  return (
    // biome-ignore lint/a11y/useSemanticElements: SVG group, no HTML button available
    <g
      role="button"
      tabIndex={0}
      aria-label={`Side quest experiment: ${label}`}
      transform={`translate(${x} 200)`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="cursor-help focus:outline-none"
    >
      {/* Neck */}
      <path
        d="M-8 0 h16 v22 l24 52 a30 30 0 0 1 -64 0 l24 -52 z"
        fill="var(--bg-elevated)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Liquid clip */}
      <defs>
        <clipPath id={`flask-clip-${x}`}>
          <path d="M-8 22 l-24 52 a30 30 0 0 0 64 0 l-24 -52 z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flask-clip-${x})`}>
        <rect
          x="-40"
          y="46"
          width="80"
          height="80"
          fill={color}
          opacity="0.75"
        />
        {/* Liquid surface highlight */}
        <ellipse cx="0" cy="46" rx="26" ry="3" fill={color} />
        {/* Rising bubbles */}
        <circle
          cx="-6"
          cy="80"
          r="2.2"
          fill="var(--bg)"
          className="lab-bubble"
          style={{ animationDelay: "0s" }}
        />
        <circle
          cx="6"
          cy="80"
          r="1.6"
          fill="var(--bg)"
          className="lab-bubble"
          style={{ animationDelay: "1.2s" }}
        />
        <circle
          cx="0"
          cy="80"
          r="2.6"
          fill="var(--bg)"
          className="lab-bubble"
          style={{ animationDelay: "2.4s" }}
        />
      </g>

      {/* Cork */}
      <rect
        x="-6"
        y="-6"
        width="12"
        height="6"
        fill="var(--fg)"
        opacity="0.7"
      />

      {/* Label plate */}
      <rect
        x="-14"
        y="52"
        width="28"
        height="12"
        fill="var(--bg-elevated)"
        stroke={strokeColor}
        strokeWidth="0.6"
      />
      <text
        x="0"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="5.5"
        fill="var(--fg)"
      >
        {shortLabel(label)}
      </text>

      {/* Base tick label */}
      <text
        x="0"
        y="112"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="1"
        fill="var(--fg-subtle)"
      >
        {shortLabel(label).toUpperCase()}
      </text>
    </g>
  );
}

function shortLabel(title: string): string {
  // "AI Tool Scout" → "AITS", "PromptCraft" → "PC", "SiteGraph" → "SG"
  const parts = title.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const p = parts[0];
    // Split on internal caps: "PromptCraft" → ["Prompt", "Craft"]
    const camel = p.split(/(?=[A-Z])/);
    if (camel.length > 1) {
      return camel
        .map((s) => s[0])
        .join("")
        .toUpperCase();
    }
    return p.slice(0, 3).toUpperCase();
  }
  return parts
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}
