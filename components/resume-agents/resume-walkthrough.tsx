"use client";

import { useEffect, useRef, useState } from "react";
import { ResumeAgents } from "@/components/resume-agents/resume-agents";
import { ResumeDocument } from "@/components/resume-document";
import { Button } from "@/components/ui";

export function ResumeWalkthrough({ scroll = false }: { scroll?: boolean }) {
  const startRef = useRef<(() => void) | null>(null);
  const [started, setStarted] = useState(false);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionOk(false);
    }
  }, []);

  return (
    <ResumeAgents cta scroll={scroll} startRef={startRef}>
      <ResumeDocument
        headerAside={
          started || !motionOk ? null : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setStarted(true);
                startRef.current?.();
              }}
            >
              Watch it get built
            </Button>
          )
        }
      />
    </ResumeAgents>
  );
}
