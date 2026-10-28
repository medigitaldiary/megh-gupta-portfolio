import type { Metadata } from "next";
import "./scope.css";

// /preview/v3 was the palette + chrome experiment (Oatmeal / Pine Green /
// Soft Lilac on top of Geist). Both palette and chrome have been promoted
// to the production direction in app/layout.tsx and app/globals.css, so
// this layout and its scope.css are no-ops. Kept so bookmarks and links
// to /preview/v3 don't break.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortfolioV3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="v3-scope">{children}</div>;
}
