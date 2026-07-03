import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex values mirror the CSS variables in app/globals.css — ImageResponse
// renders in an isolated context without access to the app's CSS.
const ACCENT = "#1F4D3A";
const ACCENT_FG = "#FAFAF7";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px",
        backgroundColor: ACCENT,
        color: ACCENT_FG,
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 400 }}>Megh Gupta</div>
      <div style={{ fontSize: 36, marginTop: 16, opacity: 0.85 }}>
        Product Manager — Fintech, Growth, AI
      </div>
    </div>,
    { ...size },
  );
}
