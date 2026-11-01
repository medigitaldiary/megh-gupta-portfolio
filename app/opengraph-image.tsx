import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Megh Gupta in a white turtleneck";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Oatmeal, locked in CLAUDE.md. The portrait file is already flattened
// onto this exact color, so the square corners disappear into the card.
const BG = "#E8DCC6";

// Google's search thumbnail is a center square crop of this 1200x630
// card (the middle 630x630). Keep the portrait inside that square so
// the face is not sliced the way the old wordmark was. The side
// margins show on LinkedIn, WhatsApp, and Slack, and fall away in
// the Google thumbnail.
//
// Source art is public/images/hero-portrait.webp. This route reads
// public/images/og/hero-portrait.jpg because the image renderer cannot
// decode that WebP. Re-export the jpg (square, flattened on oatmeal)
// if the homepage portrait changes.
const PORTRAIT = 540;

export default async function Image() {
  const file = await readFile(
    path.join(process.cwd(), "public/images/og/hero-portrait.jpg"),
  );
  const src = `data:image/jpeg;base64,${file.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BG,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/og only paints a raw img */}
      <img src={src} width={PORTRAIT} height={PORTRAIT} alt="" />
    </div>,
    { ...size },
  );
}
