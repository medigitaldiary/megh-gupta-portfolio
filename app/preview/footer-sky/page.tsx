import type { Metadata } from "next";
import { FooterSky } from "@/components/footer-sky";

export const metadata: Metadata = {
  title: "Sky footer (sandbox)",
  description: "A closing fold with contact pills on a slow cloud drift.",
  robots: { index: false, follow: false },
};

export default function FooterSkyPreviewPage() {
  return (
    <main className="bg-bg">
      {/* Stand-in for the page above, so the sky's fade-in can be judged. */}
      <div className="mx-auto flex min-h-[60svh] max-w-5xl items-end px-6 pb-16 md:px-8">
        <p className="font-mono text-[0.6875rem] text-fg-subtle uppercase tracking-[0.2em]">
          The page ends here. The footer starts below.
        </p>
      </div>
      <FooterSky />
    </main>
  );
}
