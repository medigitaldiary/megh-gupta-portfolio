"use client";

import { useEffect, useRef } from "react";
import { useBentoBoard } from "@/components/bento/bento-board";

// The one day and night switch for the board: a round sun that turns
// into a moon. The ink spreads from wherever this button is. The T key
// does the same thing.

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

export function ModeToggle() {
  const { mode, toggleMode } = useBentoBoard();
  const night = mode === "night";
  const ref = useRef<HTMLButtonElement | null>(null);

  const fromButton = () => {
    const rect = ref.current?.getBoundingClientRect();
    return rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
  };

  // Keep the latest handler without re-binding the key listener.
  const toggleRef = useRef(() => {});
  toggleRef.current = () => toggleMode(fromButton());

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "t") return;
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Dark mode"
      aria-pressed={night}
      title="Switch day and night (T)"
      onClick={(event) =>
        // A mouse click spreads from the pointer; the keyboard from the
        // middle of the button.
        toggleMode(
          event.detail === 0
            ? fromButton()
            : { x: event.clientX, y: event.clientY },
        )
      }
      className="bento-glass bento-mode-toggle"
      data-night={night}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" role="presentation">
        <mask id="bento-moon-mask">
          <rect width="24" height="24" fill="white" />
          <circle className="bento-mode-bite" cx="12" cy="12" r="5" />
        </mask>
        <circle
          className="bento-mode-body"
          cx="12"
          cy="12"
          r="5"
          mask="url(#bento-moon-mask)"
        />
        <g className="bento-mode-rays">
          {RAYS.map((angle, i) => (
            <line
              key={angle}
              x1="12"
              y1="2.5"
              x2="12"
              y2="4.5"
              transform={`rotate(${angle} 12 12)`}
              style={{ transitionDelay: `${i * 25}ms` }}
            />
          ))}
        </g>
      </svg>
    </button>
  );
}
