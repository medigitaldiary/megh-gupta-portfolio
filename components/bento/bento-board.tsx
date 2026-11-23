"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { prepareInk, runInk } from "@/components/bento/bento-ink";
import type { BentoLens } from "@/lib/bento";

// The board owns two pieces of state that several tiles react to:
//   lens  the Venn circle a visitor picked (User / Tech / Business)
//   mode  day (oatmeal) or night (pine)
// All are written to data attributes on the wrapper, and bento.css does
// the dimming and swapping. Tiles stay server components unless they
// need to change the state themselves.

type InkPoint = { x: number; y: number };

type BoardState = {
  lens: BentoLens | null;
  setLens: (lens: BentoLens | null) => void;
  mode: BentoMode;
  // Plain switch, with the board's short colour fade.
  setMode: (mode: BentoMode) => void;
  // Switch with the ink bleed spreading from `point` (the toggle).
  toggleMode: (point?: InkPoint) => void;
};

export type BentoMode = "day" | "night";

const MODE_KEY = "bento-mode";

const BoardContext = createContext<BoardState | null>(null);

export function useBentoBoard(): BoardState {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBentoBoard must be used inside <BentoBoard>");
  return ctx;
}

function remember(mode: BentoMode) {
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // Private browsing: the choice just does not survive a reload.
  }
}

export function BentoBoard({ children }: { children: ReactNode }) {
  const [lens, setLens] = useState<BentoLens | null>(null);
  const [mode, setModeState] = useState<BentoMode>("day");
  const modeRef = useRef<BentoMode>("day");

  const setMode = useCallback((next: BentoMode) => {
    modeRef.current = next;
    setModeState(next);
    remember(next);
  }, []);

  const toggleMode = useCallback((point?: InkPoint) => {
    const next: BentoMode = modeRef.current === "night" ? "day" : "night";
    modeRef.current = next;
    remember(next);
    runInk(
      point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      // The browser needs the new colours on screen before it takes the
      // "after" picture, so this render cannot be deferred.
      () => flushSync(() => setModeState(next)),
    );
  }, []);

  // Bring back the mode from the last visit, and get the ink ready.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(MODE_KEY) === "night") {
        modeRef.current = "night";
        setModeState("night");
      }
    } catch {
      // Storage blocked: stay on day.
    }
    void prepareInk();
  }, []);

  const value = useMemo(
    () => ({ lens, setLens, mode, setMode, toggleMode }),
    [lens, mode, setMode, toggleMode],
  );

  return (
    <BoardContext.Provider value={value}>
      <div className="bento" data-lens={lens ?? "all"} data-mode={mode}>
        {children}
      </div>
    </BoardContext.Provider>
  );
}
