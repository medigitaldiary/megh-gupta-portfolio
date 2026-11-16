"use client";

import { useEffect, useState } from "react";
import { SOCIALS } from "@/components/social-links";

function useIstClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    function tick() {
      const label = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })
        .format(new Date())
        .toLowerCase();
      setNow(`${label} ist`);
    }
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** "megh gupta · 3:42 pm ist". Shared with the sky footer sandbox. */
export function IstClock() {
  const clock = useIstClock();
  return (
    <span suppressHydrationWarning>megh gupta{clock ? ` · ${clock}` : ""}</span>
  );
}

export function SiteFooter() {
  const clock = useIstClock();
  return (
    <footer className="px-6 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <ul className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  s.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                aria-label={s.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-subtle transition-colors duration-150 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <span className="h-4 w-4">{s.icon}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="text-center text-xs leading-[1.6] text-fg-subtle sm:text-right">
          <p suppressHydrationWarning>megh gupta{clock ? ` · ${clock}` : ""}</p>
          <p>made with zero em dashes</p>
        </div>
      </div>
    </footer>
  );
}
