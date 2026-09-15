import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

// Kept as a comparison surface: blue is now the primary at /, so this
// route holds the previous "dawn" (warm-horizon) palette for reference.
export const metadata: Metadata = {
  title: "Coming-soon — dawn palette (reference)",
  description: "The previous dawn palette, kept for comparison.",
  robots: { index: false, follow: false },
};

export default function SkyPreviewPage() {
  return <ComingSoon palette="dawn" />;
}
