import type { Metadata } from "next";
import "./scope.css";

// Oatmeal palette experiment — colour-only override, scoped to
// .oatmeal-scope. Everything else (fonts, type scale, spacing,
// components) stays on the production design system.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OatmealPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="oatmeal-scope">{children}</div>;
}
