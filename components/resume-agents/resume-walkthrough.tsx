"use client";

import { useEffect, useRef, useState } from "react";
import { ResumeAgents } from "@/components/resume-agents/resume-agents";
import { ResumeDocument } from "@/components/resume-document";

const WATCH_BUTTON =
  "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-fg/20 px-4 text-sm text-fg transition-colors duration-150 hover:border-fg hover:bg-fg hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:opacity-90";

export function ResumeWalkthrough() {
  const startRef = useRef<(() => void) | null>(null);
  const [started, setStarted] = useState(false);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionOk(false);
    }
  }, []);

  return (
    <ResumeAgents cta startRef={startRef}>
      <ResumeDocument
        headerAside={
          started || !motionOk ? null : (
            <button
              type="button"
              className={WATCH_BUTTON}
              onClick={() => {
                setStarted(true);
                startRef.current?.();
              }}
            >
              Watch it get built
            </button>
          )
        }
      />
    </ResumeAgents>
  );
}
