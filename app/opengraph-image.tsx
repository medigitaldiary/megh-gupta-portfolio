import { ImageResponse } from "next/og";

export const alt = "Megh Gupta — Product Manager | Fintech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#1F4D3A";
const ACCENT_FG = "#FAFAF7";
const SUBTLE = "rgba(250,250,247,0.65)";

// Fetch a Google Font as an ArrayBuffer for use inside ImageResponse.
// Loading real font files (instead of falling back to the built-in
// system font) is what keeps the text from turning into mush when
// LinkedIn / Twitter downscale the OG card for a smaller preview.
async function loadGoogleFont(family: string, weight = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:wght@${weight}&display=swap`;
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const match = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype|woff2?)'\)/,
  );
  if (!match) throw new Error(`Font URL missing for ${family}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [instrumentSerif, interMedium] = await Promise.all([
    loadGoogleFont("Instrument Serif", 400),
    loadGoogleFont("Inter", 500),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "88px",
        backgroundColor: ACCENT,
        color: ACCENT_FG,
        fontFamily: "Inter",
      }}
    >
      {/* Top row — small mono/eyebrow label */}
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: SUBTLE,
        }}
      >
        meghgupta.in
      </div>

      {/* Middle — name + tagline */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "Instrument Serif",
            fontSize: 168,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Megh Gupta
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 44,
            fontWeight: 500,
            marginTop: 24,
            color: SUBTLE,
          }}
        >
          Product Manager · Fintech
        </div>
      </div>

      {/* Bottom row — small footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: SUBTLE,
        }}
      >
        <div style={{ display: "flex" }}>BondScanner</div>
        <div style={{ display: "flex" }}>2026</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: instrumentSerif,
          weight: 400,
          style: "normal",
        },
        { name: "Inter", data: interMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
