import type { Metadata } from "next";
import { ComingSoonWithPaper } from "@/components/coming-soon-with-paper";

export const metadata: Metadata = {
  title: "Coming-soon · Variant A",
  description: "Always-WebGL preview.",
  robots: { index: false, follow: false },
};

export default function VariantAPage() {
  return <ComingSoonWithPaper variant="A" />;
}
