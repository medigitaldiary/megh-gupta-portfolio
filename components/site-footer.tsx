"use client";

import { type ReactNode, useEffect, useState } from "react";

const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/megh-gupta-917280200",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a11.5 11.5 0 00-3.635 22.412c.575.105.786-.25.786-.556 0-.274-.01-1.001-.015-1.966-3.2.695-3.877-1.542-3.877-1.542-.523-1.33-1.278-1.685-1.278-1.685-1.044-.714.079-.7.079-.7 1.155.082 1.762 1.187 1.762 1.187 1.027 1.76 2.695 1.251 3.352.957.104-.744.402-1.252.732-1.54-2.554-.29-5.24-1.277-5.24-5.687 0-1.256.449-2.283 1.187-3.089-.12-.291-.515-1.463.112-3.05 0 0 .967-.31 3.17 1.18a10.98 10.98 0 015.77 0c2.202-1.49 3.168-1.18 3.168-1.18.628 1.587.233 2.759.114 3.05.74.806 1.184 1.833 1.184 3.089 0 4.422-2.69 5.394-5.253 5.679.412.354.78 1.053.78 2.123 0 1.532-.014 2.767-.014 3.145 0 .309.208.667.79.554A11.502 11.502 0 0012 .5z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:megh.bpgc@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
];

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

export function SiteFooter() {
  const clock = useIstClock();
  return (
    <footer className="px-6 py-12 md:px-8 md:py-16">
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
