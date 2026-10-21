import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../v2/scope.css";

// Dedicated sandbox for iterating on the Selected Work bookshelf without
// churning /preview/v2. Inherits the v2 Geist scope.
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

export default function ShelfLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`v2-scope ${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  );
}
