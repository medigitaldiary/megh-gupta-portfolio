"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Lab", href: "#lab" },
  { label: "Writing", href: "#writing" },
  { label: "About", href: "#about" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <nav aria-label="Primary" className="sticky top-0 z-50">
      <div
        className={`h-14 bg-bg/80 backdrop-blur-md transition-[border-color] duration-150 md:h-16 ${
          scrolled ? "border-b border-border" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6 md:px-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="rounded-sm font-sans text-base font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Megh Gupta
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm text-fg-muted transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#connect"
              className="rounded-full bg-accent px-4 py-2 text-sm text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Let&apos;s connect →
            </a>
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 md:hidden"
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
          className="fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-sm text-lg text-fg-muted transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          ))}
          {/* biome-ignore lint/a11y/useValidAnchor: anchor scrolls to #connect; onClick only closes the mobile menu */}
          <a
            href="#connect"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-accent px-6 py-3 text-base text-accent-fg transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Let&apos;s connect →
          </a>
        </div>
      )}
    </nav>
  );
}
