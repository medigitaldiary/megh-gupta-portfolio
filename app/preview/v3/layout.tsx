import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./scope.css";

// Preview v3 — Oatmeal / Pine Green / Soft Lilac palette on top of
// the full portfolio folds. Inherits Geist fonts from the v2 direction
// so the colour palette is evaluated against the finalised typeface,
// not the production Oswald/Satoshi stack. Everything else is scoped
// through .v3-scope + ./scope.css — zero component edits.
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

export default function PortfolioV3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`v3-scope ${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
