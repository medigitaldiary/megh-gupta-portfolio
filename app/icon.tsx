import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const ACCENT = "#1F4D3A";
const ACCENT_FG = "#FAFAF7";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        backgroundColor: ACCENT,
        color: ACCENT_FG,
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      M
    </div>,
    { ...size },
  );
}
