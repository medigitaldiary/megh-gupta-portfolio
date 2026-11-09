"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

const CAL_LINK = "megh-gupta/15min";
const NAMESPACE = "15min";
const CAL_BRAND = "#1F3B2E"; // --fg · pine
const FALLBACK_EMAIL = "megh.bpgc@gmail.com";

export function CalEmbed() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": CAL_BRAND },
          dark: { "cal-brand": CAL_BRAND },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full">
      {/* Skeleton + mailto fallback. Stays visible under the Cal iframe so
          the fold has something real on it while Cal boots. Fades out once
          the Cal API reports ready. */}
      {!ready && (
        <div
          aria-hidden="true"
          className="mb-3 flex flex-col items-center gap-3"
        >
          <div className="h-[420px] w-full max-w-xl overflow-hidden rounded-xl border border-white/15 bg-white/5">
            <div className="flex items-center justify-between border-white/15 border-b px-5 py-3">
              <div className="h-4 w-28 animate-pulse rounded bg-white/15" />
              <div className="flex gap-1.5">
                <div className="h-6 w-6 animate-pulse rounded bg-white/15" />
                <div className="h-6 w-6 animate-pulse rounded bg-white/15" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 p-5">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static grid
                  key={i}
                  className="h-9 animate-pulse rounded bg-white/10"
                />
              ))}
            </div>
          </div>
          <p className="text-accent-fg/80 text-sm">
            Booker loading. Prefer email?{" "}
            <a
              href={`mailto:${FALLBACK_EMAIL}`}
              className="text-accent-fg underline underline-offset-4 decoration-accent-fg/40 hover:decoration-accent-fg"
            >
              {FALLBACK_EMAIL}
            </a>
          </p>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: ready ? "auto" : 0 }}
      >
        <Cal
          namespace={NAMESPACE}
          calLink={CAL_LINK}
          style={{ width: "100%", minHeight: 560 }}
          config={{
            layout: "month_view",
            theme: "light",
          }}
        />
      </div>
    </div>
  );
}
