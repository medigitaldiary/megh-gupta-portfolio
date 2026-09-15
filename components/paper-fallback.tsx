"use client";

import { useEffect, useRef } from "react";
import { CERTS, drawCertToCanvas, PLACEMENTS } from "@/lib/paper-art";

/**
 * Static DOM composition of the four certificates. No WebGL, no RAF loop.
 * Used as the mobile fallback (variant B) and the pre-upgrade view (variant C).
 * Each cert is drawn once into its own canvas at mount, then CSS-transformed.
 */
export function PaperFallback({ className }: { className?: string }) {
  const refs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    CERTS.forEach((cert, i) => {
      const target = refs.current[i];
      if (!target) return;
      const src = drawCertToCanvas(cert, 720);
      target.width = src.width;
      target.height = src.height;
      const ctx = target.getContext("2d");
      ctx?.drawImage(src, 0, 0);
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        perspective: "1400px",
      }}
    >
      {CERTS.map((cert, i) => {
        const p = PLACEMENTS[i];
        return (
          <div
            key={cert.title}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "min(28vw, 320px)",
              transform: `
                translate(-50%, -50%)
                translate(${p.x}vw, ${p.y}vh)
                rotateX(${p.tiltX}deg)
                rotateY(${p.tiltY}deg)
                rotateZ(${p.tiltZ}deg)
                scale(${p.scale})
              `,
              opacity: 0.72,
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 24px 48px rgba(17,17,17,0.18))",
            }}
          >
            <canvas
              ref={(el) => {
                refs.current[i] = el;
              }}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
