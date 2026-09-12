import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

// Preview route for the coming-soon page. Kept behind /coming-soon on this
// branch so it can be reviewed on a Vercel preview URL before it replaces
// app/page.tsx on `main` and lands on the production domain.
export const metadata: Metadata = {
  title: "Megh Gupta — Portfolio, soon.",
  description:
    "Product Manager (fintech, growth, AI tooling). Portfolio launching soon.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoon />;
}
