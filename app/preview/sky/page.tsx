import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

// Kept as a comparison surface: dawn is now the primary at /, so this
// route holds the pure-blue palette for reference.
export const metadata: Metadata = {
  title: "Coming-soon — blue palette (reference)",
  description: "The pure blue-and-white palette, kept for comparison.",
  robots: { index: false, follow: false },
};

export default function SkyPreviewPage() {
  return <ComingSoon palette="blue" />;
}
