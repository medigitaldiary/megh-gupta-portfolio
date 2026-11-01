"use client";

// Case-study-specific wrapper for the AI Call Analysis Pipeline.
//
// Shape: a bordered placeholder container (part of the case study
// system's visual language) with the LIVE interactive artifact
// embedded inside via <iframe>. The artifact is served statically from
// /public/artifacts/ai-call-pipeline.html — a self-contained HTML/CSS/
// JS prototype that owns its own CSS variables, fonts, and scripts.
//
// Why iframe, not inline markup
// - The artifact declares its own :root CSS variables (--bg, --text,
//   --accent, …) that collide name-for-name with the host site's own
//   leaf variables. Inlining would either override the site's palette
//   or need every artifact token to be renamed.
// - The artifact attaches global body/html styles and uses specific
//   element IDs for its scripts. An iframe keeps those scoped to the
//   embedded document.
// - The user asked for "exactly as the artifact, no changes" — the
//   iframe preserves it byte-for-byte with no translation to React.
//
// The iframe height auto-resizes to its content on load and on
// window resize via a lightweight ResizeObserver. The placeholder
// container is responsive and matches the case study chrome.

import { useEffect, useRef, useState } from "react";

const ARTIFACT_SRC = "/artifacts/ai-call-pipeline.html";
const FALLBACK_HEIGHT_PX = 820;

export function AiCallPipeline() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState<number>(FALLBACK_HEIGHT_PX);

  // Resize the iframe to match its content height on load, after image
  // decode, and on window resize. Same-origin iframes expose
  // contentDocument so this is a simple measurement.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const measure = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const el = doc.documentElement;
        const next = Math.max(
          el.scrollHeight,
          doc.body?.scrollHeight ?? 0,
          FALLBACK_HEIGHT_PX,
        );
        if (next && Math.abs(next - height) > 2) {
          setHeight(next);
        }
      } catch {
        // Cross-origin or detached — leave the fallback height.
      }
    };

    const onLoad = () => {
      measure();
      // ResizeObserver on the embedded <html> so expand/collapse
      // inside the artifact also drives host height.
      try {
        const doc = iframe.contentDocument;
        if (doc && typeof ResizeObserver !== "undefined") {
          const ro = new ResizeObserver(() => measure());
          ro.observe(doc.documentElement);
          // Store the observer on the element so we can disconnect
          // on cleanup via the next load/unmount.
          (iframe as unknown as { __ro?: ResizeObserver }).__ro = ro;
        }
      } catch {
        /* ignore */
      }
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", measure);

    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measure);
      const ro = (iframe as unknown as { __ro?: ResizeObserver }).__ro;
      if (ro) ro.disconnect();
    };
  }, [height]);

  return (
    <figure
      className="my-12 overflow-hidden rounded-xl border border-border bg-bg-elevated"
      aria-label="AI Call Analysis Pipeline: interactive architecture diagram"
    >
      <iframe
        ref={iframeRef}
        src={ARTIFACT_SRC}
        title="AI Call Analysis Pipeline: interactive architecture diagram"
        style={{
          width: "100%",
          height,
          border: 0,
          display: "block",
          background: "transparent",
        }}
        // The artifact ships its own CSS, scripts, and interaction
        // model. Keep sandbox minimal so the embedded JS can run but
        // can't navigate the host or open popups.
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
      />
    </figure>
  );
}
