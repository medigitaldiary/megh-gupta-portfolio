import type { Metadata } from "next";
import { ComingSoonWithPaper } from "@/components/coming-soon-with-paper";

export const metadata: Metadata = {
  title: "Coming-soon · Variant B",
  description: "Desktop WebGL + mobile static fallback.",
  robots: { index: false, follow: false },
};

export default function VariantBPage() {
  return <ComingSoonWithPaper variant="B" />;
}
