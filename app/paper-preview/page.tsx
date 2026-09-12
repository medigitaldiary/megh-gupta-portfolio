import type { Metadata } from "next";
import { ThreeDPaper } from "@/components/three-d-paper";

export const metadata: Metadata = {
  title: "3D Paper — preview",
  description: "Preview route for the 3D Paper effect.",
  robots: { index: false, follow: false },
};

export default function PaperPreviewPage() {
  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] flex-col bg-bg text-fg"
    >
      <header className="px-6 pt-10 md:px-10">
        <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
          Preview · 3D Paper
        </p>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl">
          Four certificates, suspended.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Drag any paper to spin it; move the cursor to parallax the group.
          Respects reduced-motion.
        </p>
      </header>

      <div className="relative mt-4 h-[70svh] w-full md:mt-8 md:h-[75svh]">
        <ThreeDPaper />
      </div>
    </main>
  );
}
