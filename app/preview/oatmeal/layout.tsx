import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./scope.css";

// Oatmeal palette experiment — colour + font override, scoped to
// .oatmeal-scope. Fonts match /preview/v2 (Geist) so the palette
// is evaluated against the finalised font direction, not the
// production Oswald/Satoshi.
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

export default function OatmealPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`oatmeal-scope ${geistSans.variable} ${geistMono.variable}`}
    >
      {children}
    </div>
  );
}
