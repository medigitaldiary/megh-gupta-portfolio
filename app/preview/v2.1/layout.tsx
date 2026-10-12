import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./scope.css";

// Load Geist as the one face for v2.1 per DS v1 §3. Mono is kept
// available for inline code blocks that might land in future case
// studies but is not consumed by nav/eyebrows anymore (DS v1 drops
// the sans/mono distinction).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortfolioV21Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The `.v21-scope` wrapper is the surface that scope.css targets.
  // Everything inside — the Nav, every fold, the footer — resolves
  // --font-serif / --font-sans / --font-mono / --font-hand to Geist
  // instead of the Oswald + Satoshi + JetBrains Mono + Kalam stack,
  // and picks up the DS v1 type scale, 16px card radii, and
  // tighter card padding. Everything outside this wrapper (the rest
  // of the site, including /work/[slug] case study pages) is
  // unaffected.
  return (
    <div className={`v21-scope ${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
