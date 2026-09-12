import type { Metadata } from "next";
import { ComingSoonWithPaper } from "@/components/coming-soon-with-paper";

export const metadata: Metadata = {
  title: "Coming-soon · Variant C",
  description: "Static-first, upgrade to WebGL on interaction.",
  robots: { index: false, follow: false },
};

export default function VariantCPage() {
  return <ComingSoonWithPaper variant="C" />;
}
