"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type { BentoLens } from "@/lib/bento";

// The board owns two pieces of state that several tiles react to:
//   lens  the Venn circle a visitor picked (User / Tech / Business)
//   scan  the 30-second read switch
// Both are written to data attributes on the wrapper, and bento.css does
// the dimming and swapping. Tiles stay server components unless they
// need to change the state themselves.

type BoardState = {
  lens: BentoLens | null;
  setLens: (lens: BentoLens | null) => void;
  scan: boolean;
  setScan: (scan: boolean) => void;
  // Crossfader: "day" is the work side, "night" is after hours.
  mode: BentoMode;
  setMode: (mode: BentoMode) => void;
};

export type BentoMode = "day" | "night";

const BoardContext = createContext<BoardState | null>(null);

export function useBentoBoard(): BoardState {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBentoBoard must be used inside <BentoBoard>");
  return ctx;
}

export function BentoBoard({ children }: { children: ReactNode }) {
  const [lens, setLens] = useState<BentoLens | null>(null);
  const [scan, setScan] = useState(false);
  const [mode, setMode] = useState<BentoMode>("day");
  const value = useMemo(
    () => ({ lens, setLens, scan, setScan, mode, setMode }),
    [lens, scan, mode],
  );

  return (
    <BoardContext.Provider value={value}>
      <div
        className="bento"
        data-lens={lens ?? "all"}
        data-scan={scan ? "on" : "off"}
        data-mode={mode}
      >
        {children}
      </div>
    </BoardContext.Provider>
  );
}
