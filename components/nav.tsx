"use client";

import {
  type ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  Icon: () => ReactElement;
};

// Nav mirrors the 7-fold storyboard in CLAUDE.md §14 — "the map should not
// contradict the territory." Hero is the home anchor (click the status chip),
// so the pill carries the scrollable sections after it. Pages that want
// a subset (e.g. v2 while Lab + Writing are being finalised) pass their
// own `items` prop.
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
    Icon: BriefcaseIcon,
  },
  { id: "work", label: "Work", href: "#work", Icon: BookIcon },
  { id: "lab", label: "Lab", href: "#lab", Icon: FlaskIcon },
  { id: "writing", label: "Writing", href: "#writing", Icon: PenIcon },
  { id: "about", label: "About", href: "#about", Icon: UserIcon },
  { id: "connect", label: "Contact", href: "#connect", Icon: MailIcon },
];

const LINKEDIN_URL = "https://www.linkedin.com/in/megh-gupta-917280200";
const RESUME_URL = "/resume.pdf";

// The hero greeting already says the name. These four lines take turns
// in the left slot. The last one is the contact CTA: filled pine, arrow,
// and a jump to the connect fold. The others scroll back to the top.
const CHIP_LINES = [
  { text: "Product Manager" },
  { text: "Building in fintech" },
  { text: "Got a problem?" },
  { text: "Let's connect.", cta: true },
] as const;
// Still time before the swap. ~4.3s of readable text after the 500ms flip.
const CHIP_HOLD_MS = 4800;
// Keep in sync with nav-chip-in / nav-chip-out in globals.css.
const CHIP_FLIP_MS = 500;

function StatusChip({
  paused,
  tabIndex,
  onScrollTop,
}: {
  paused: boolean;
  tabIndex: number;
  onScrollTop: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const prevIndex = useRef(0);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const sizerRef = useRef<HTMLSpanElement>(null);
  const primed = useRef(false);

  const line = CHIP_LINES[index];
  const isCta = "cta" in line && line.cta;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => setReduceMotion(mq.matches);
    onMotion();
    mq.addEventListener("change", onMotion);
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || pageHidden) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % CHIP_LINES.length);
    }, CHIP_HOLD_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, pageHidden]);

  useEffect(() => {
    if (prevIndex.current === index) return;
    const prev = prevIndex.current;
    prevIndex.current = index;
    setOutgoing(prev);
    const t = window.setTimeout(() => setOutgoing(null), CHIP_FLIP_MS + 40);
    return () => window.clearTimeout(t);
  }, [index]);

  // The pill width follows the current line. A hidden sizer has the same
  // contents as the visible row, including the arrow on the CTA, and the
  // link eases to that measured width.
  useLayoutEffect(() => {
    const link = linkRef.current;
    const sizer = sizerRef.current;
    if (!link || !sizer) return;

    const apply = (animate: boolean) => {
      const cs = getComputedStyle(link);
      const extra =
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.borderLeftWidth) +
        parseFloat(cs.borderRightWidth);
      const next = Math.ceil(sizer.getBoundingClientRect().width + extra) + 1;
      if (!animate) link.style.transition = "none";
      link.style.width = `${next}px`;
      if (!animate) {
        // Flush so the first paint doesn't ease in from width: auto.
        void link.offsetWidth;
        link.style.transition = "";
      }
    };

    // `line.text` is read so the measure re-runs when the sizer's copy changes.
    if (line.text.length === 0) return;
    apply(primed.current && !reduceMotion);
    primed.current = true;
  }, [line.text, reduceMotion]);

  useEffect(() => {
    const fonts = document.fonts;
    if (!fonts) return;
    let cancelled = false;
    void fonts.ready.then(() => {
      const link = linkRef.current;
      const sizer = sizerRef.current;
      if (cancelled || !link || !sizer) return;
      const cs = getComputedStyle(link);
      const extra =
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.borderLeftWidth) +
        parseFloat(cs.borderRightWidth);
      link.style.transition = "none";
      link.style.width = `${Math.ceil(sizer.getBoundingClientRect().width + extra) + 1}px`;
      void link.offsetWidth;
      link.style.transition = "";
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const flipping = outgoing !== null && !reduceMotion;

  return (
    <a
      ref={linkRef}
      href={isCta ? "#connect" : "#hero"}
      onClick={(e) => {
        if (!isCta) onScrollTop(e);
      }}
      tabIndex={tabIndex}
      className={`relative hidden max-md:inline-flex min-[860px]:inline-flex min-w-0 items-center rounded-full border py-2 pl-2.5 pr-3.5 text-sm font-medium transition-[width,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        isCta
          ? "border-accent bg-accent text-accent-fg hover:opacity-90"
          : "border-border bg-bg-elevated text-fg"
      }`}
    >
      <span className="sr-only">
        {isCta ? "Let's connect" : `${line.text}. Back to top`}
      </span>
      <span
        ref={sizerRef}
        className="pointer-events-none invisible absolute inline-flex w-max items-center gap-2 whitespace-nowrap"
        aria-hidden="true"
      >
        <span className="h-1.5 w-1.5 shrink-0" />
        <span>{line.text}</span>
        {isCta ? (
          <span className="h-3.5 w-3.5 shrink-0">
            <ArrowRightIcon />
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={`mr-2 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500 ${
          isCta ? "bg-accent-fg" : "bg-fg"
        }`}
      />
      <span className="relative h-5 min-w-0 flex-1 overflow-hidden" aria-hidden="true">
        <span className="invisible whitespace-nowrap">{line.text}</span>
        {outgoing !== null && !reduceMotion ? (
          <span className="nav-chip-out absolute inset-0 flex items-center whitespace-nowrap">
            {CHIP_LINES[outgoing].text}
          </span>
        ) : null}
        <span
          className={`absolute inset-0 flex items-center whitespace-nowrap ${
            flipping ? "nav-chip-in" : ""
          }`}
        >
          {line.text}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 overflow-hidden transition-[width,margin,opacity] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
          isCta ? "ml-2 w-3.5 opacity-100" : "ml-0 w-0 opacity-0"
        }`}
      >
        <span className="h-3.5 w-3.5 shrink-0">
          <ArrowRightIcon />
        </span>
      </span>
    </a>
  );
}

export function Nav({ hide }: { hide?: string[] } = {}) {
  // `hide` is a list of nav ids to drop (e.g. `["lab", "writing"]`). Keeping
  // the filter here, not at the call site, means callers can be server
  // components without having to serialise the icon refs on NavItem.
  const navItems = hide?.length
    ? DEFAULT_NAV_ITEMS.filter((i) => !hide.includes(i.id))
    : DEFAULT_NAV_ITEMS;
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  // Collapse the status chip + right CTAs once past the hero, unless the viewer
  // is hovering or keyboard-focused in the nav. The pill stays anchored.
  const collapsed = scrolled && !hovered && !focusWithin;

  // rAF-throttle the scroll handler so the state flip lands on a frame
  // boundary — otherwise React can commit mid-frame and the CSS transition
  // picks up partway through, which reads as the small jerk on first
  // collapse.
  useEffect(() => {
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const past = window.scrollY > 80;
        setScrolled(past);
        // On the hero fold, clear any active tab the IntersectionObserver
        // may have latched onto when the page first loaded with a short hero.
        if (!past) setActiveId("");
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll spy — mark the closest section as active. Depending on a joined
  // id string keeps the effect from re-running on every render while still
  // re-subscribing if the id set actually changes.
  const navIdKey = navItems.map((i) => i.id).join(",");
  useEffect(() => {
    const sections = navIdKey
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((s): s is HTMLElement => s !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, [navIdKey]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function scrollToTop(e: React.MouseEvent) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
    >
      {/* Outer bar is always transparent — the pill carries its own weight,
          and keeping a single surface across the scroll threshold removes the
          backdrop-filter transition that was causing the collapse jerk. */}
      <div>
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[72px] md:px-6">
          {/* Left: status chip. Four lines, the last one a contact CTA.
              The pill eases to the width of whichever line is showing.
              Hidden from md up to 860px so the longer lines don't push
              Resume off the bar. Collapses once the hero leaves. */}
          <div
            className={`justify-self-start will-change-[transform,opacity] transition-[transform,opacity] duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
              collapsed
                ? "pointer-events-none translate-x-10 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <StatusChip
              paused={collapsed || hovered || focusWithin}
              tabIndex={collapsed ? -1 : 0}
              onScrollTop={scrollToTop}
            />
          </div>

          {/* Center pill — always visible. Slightly bumped shadow when floating
              alone (collapsed) so it reads as a raised capsule. */}
          <div
            role="tablist"
            aria-label="Sections"
            className={`hidden items-center gap-0.5 rounded-full border border-border bg-bg-elevated p-1 transition-shadow duration-300 ease-out md:flex ${
              collapsed ? "shadow-md" : "shadow-sm"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              const { Icon } = item;
              return (
                <a
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-bg text-fg shadow-sm"
                      : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <span className="h-4 w-4">
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Right: LinkedIn + Resume. Same gentle fade + short slide inward
              so the pair reads as tucking behind the pill. */}
          <div
            className={`hidden items-center justify-end gap-2 justify-self-end will-change-[transform,opacity] transition-[transform,opacity] duration-[400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none md:flex ${
              collapsed
                ? "pointer-events-none -translate-x-10 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              tabIndex={collapsed ? -1 : 0}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0A66C2]/30 bg-bg-elevated text-[#0A66C2] transition-colors duration-150 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2"
            >
              <span className="h-[18px] w-[18px]">
                <LinkedInIcon />
              </span>
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={collapsed ? -1 : 0}
              className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm text-accent-fg transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span>Resume</span>
              <span className="h-3.5 w-3.5">
                <DownloadIcon />
              </span>
            </a>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="col-start-3 inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-md text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:hidden"
          >
            <span aria-hidden="true" className="font-mono text-xl">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col items-center justify-center gap-6 bg-bg md:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-3 rounded-sm text-lg text-fg-muted transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <span className="h-5 w-5">
                <item.Icon />
              </span>
              {item.label}
            </a>
          ))}
          <div className="mt-4 flex items-center gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0A66C2]/30 bg-bg-elevated text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
            >
              <span className="h-5 w-5">
                <LinkedInIcon />
              </span>
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base text-accent-fg"
            >
              Resume
              <span className="h-4 w-4">
                <DownloadIcon />
              </span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M4 4h7a3 3 0 0 1 3 3v13" />
      <path d="M20 4h-7a3 3 0 0 0-3 3v13" />
      <path d="M4 4v16h16V4" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M9 3h6" />
      <path d="M10 3v6L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3" />
      <path d="M7 14h10" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 21h16" />
    </svg>
  );
}
