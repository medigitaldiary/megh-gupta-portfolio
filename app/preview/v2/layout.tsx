import type { Metadata } from "next";
import "./scope.css";

// /preview/v2 was the earlier font + palette experiment surface
// (Geist typography on the retired green theme). Both have since been
// promoted to the production direction in app/layout.tsx and
// app/globals.css, so this layout and its scope.css are no-ops. Kept
// so bookmarks and links to /preview/v2 don't break.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortfolioV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="v2-scope">{children}</div>;
}
