import type { Metadata } from "next";

// /preview/v3 was the palette + chrome experiment (Oatmeal / Pine Green /
// Soft Lilac on top of Geist). Both palette and chrome have been promoted
// to the production direction in app/layout.tsx and app/globals.css, so
// no scope CSS is needed. The route is kept so bookmarks and links to
// /preview/v3 don't break (G-C7).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortfolioV3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
