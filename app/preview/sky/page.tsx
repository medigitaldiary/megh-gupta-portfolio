import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Coming-soon — blue-sky experiment",
  description: "Pure blue-and-white palette variant of the coming-soon page.",
  robots: { index: false, follow: false },
};

export default function SkyPreviewPage() {
  return <ComingSoon palette="blue" />;
}
