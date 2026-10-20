import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./scope.css";

// Load Geist for /preview/v2 only. v1 and the production homepage stay
// on Oswald + Satoshi. Scope-based override lives in scope.css.
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

export default function PortfolioV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The .v2-scope wrapper is the surface scope.css targets. Everything
  // inside — the Nav, every fold, the footer — resolves the leaf
  // --font-oswald / --font-satoshi / --font-jetbrains-mono / --font-hand
  // variables to Geist instead of their original faces. Type scale,
  // radii, and padding stay unchanged — this is fonts-only on v2.
  return (
    <div className={`v2-scope ${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
