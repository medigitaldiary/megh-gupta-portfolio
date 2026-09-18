import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

/**
 * Coming-soon in ownCloud Design System v14 palette.
 * Tokens sourced from src/tokens/ods/color.yaml — brand navy #041E42,
 * primary steel-blue #4A76AC, cream #EEF3F9. Type family already
 * matches (Inter). Components themselves are Vue.js so can't be
 * imported; this preview reuses their token language on our React
 * coming-soon component.
 */
export const metadata: Metadata = {
  title: "Coming-soon — ownCloud DS palette test",
  description:
    "Sanity-check the ownCloud Design System v14 palette on the coming-soon page.",
  robots: { index: false, follow: false },
};

export default function OdsPreviewPage() {
  return <ComingSoon palette="ods" />;
}
