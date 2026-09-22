import { hashSlug, type WritingKind } from "@/lib/writing";

const GLYPH_STROKE = "#F5EBD4";
const BG = "#0E1622";
const INNER_BORDER = "rgba(245,235,212,0.08)";

function Glyph({ kind }: { kind: WritingKind }) {
  const common = {
    stroke: GLYPH_STROKE,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  switch (kind) {
    case "field-note":
      return (
        <g {...common}>
          <path d="M60 34c-8 0-14 6-14 14 0 10 14 26 14 26s14-16 14-26c0-8-6-14-14-14z" />
          <circle cx="60" cy="48" r="4" />
        </g>
      );
    case "learning":
      return (
        <g {...common}>
          <path d="M46 50a14 14 0 1 1-2 8" />
          <path d="M44 44v10h10" />
        </g>
      );
    case "take":
      return (
        <g {...common}>
          <path d="M46 62V52c0-6 4-10 10-11" />
          <path d="M64 62V52c0-6 4-10 10-11" />
        </g>
      );
    case "idea":
      return (
        <g {...common}>
          <path d="M60 34a12 12 0 0 0-7 21c2 2 3 4 3 6h8c0-2 1-4 3-6a12 12 0 0 0-7-21z" />
          <path d="M56 68h8M57 72h6" />
        </g>
      );
    case "mini-case":
      return (
        <g {...common}>
          <rect x="42" y="38" width="10" height="10" />
          <rect x="55" y="38" width="10" height="10" />
          <rect x="68" y="38" width="10" height="10" />
          <rect x="42" y="52" width="10" height="10" fill={GLYPH_STROKE} />
          <rect x="55" y="52" width="10" height="10" />
          <rect x="68" y="52" width="10" height="10" />
        </g>
      );
    case "teardown":
      return (
        <g {...common}>
          <rect x="42" y="38" width="14" height="14" />
          <rect x="60" y="38" width="14" height="14" />
          <rect x="42" y="56" width="14" height="14" />
          <rect x="60" y="56" width="14" height="14" strokeDasharray="3 3" />
          <path d="M63 59l8 8M71 59l-8 8" />
        </g>
      );
  }
}

const HLINES = Array.from({ length: 6 }, (_, i) => `h-${i * 16 + 8}`);
const CIRCLES = Array.from({ length: 8 }, (_, i) => `c-${i * 18 + 6}`);
const DIAGS = Array.from({ length: 12 }, (_, i) => `d-${i * 12}`);
const DOTS: string[] = [];
for (let r = 0; r < 10; r++) {
  for (let c = 0; c < 15; c++) DOTS.push(`dot-${r}-${c}`);
}

function BackgroundPattern({ variant }: { variant: number }) {
  const stroke = INNER_BORDER;
  switch (variant) {
    case 0:
      return (
        <g stroke={stroke} strokeWidth="1">
          {HLINES.map((key, i) => (
            <line key={key} x1="0" y1={i * 16 + 8} x2="120" y2={i * 16 + 8} />
          ))}
        </g>
      );
    case 1:
      return (
        <g stroke={stroke} strokeWidth="1">
          {CIRCLES.map((key, i) => (
            <circle key={key} cx={i * 18 + 6} cy="40" r="18" fill="none" />
          ))}
        </g>
      );
    case 2:
      return (
        <g stroke={stroke} strokeWidth="1">
          {DIAGS.map((key, i) => (
            <line key={key} x1={i * 12} y1="0" x2={i * 12 + 40} y2="80" />
          ))}
        </g>
      );
    case 3:
      return (
        <g stroke={stroke} strokeWidth="1">
          {DOTS.map((key, idx) => {
            const r = Math.floor(idx / 15);
            const c = idx % 15;
            return (
              <circle
                key={key}
                cx={c * 8 + 4}
                cy={r * 8 + 4}
                r="0.7"
                fill={GLYPH_STROKE}
                stroke="none"
              />
            );
          })}
        </g>
      );
    default:
      return null;
  }
}

export function WritingThumbnail({
  kind,
  slug,
}: {
  kind: WritingKind;
  slug: string;
}) {
  const variant = hashSlug(slug) % 4;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="120" height="80" fill={BG} />
      <BackgroundPattern variant={variant} />
      <rect
        x="0.5"
        y="0.5"
        width="119"
        height="79"
        fill="none"
        stroke={INNER_BORDER}
      />
      <Glyph kind={kind} />
    </svg>
  );
}
