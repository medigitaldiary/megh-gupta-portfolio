"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CAL_LINK = "megh-gupta/15min";
const NAMESPACE = "15min";

export function CalEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#1F4D3A" },
          dark: { "cal-brand": "#1F4D3A" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="mx-auto w-full overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]">
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
  );
}
