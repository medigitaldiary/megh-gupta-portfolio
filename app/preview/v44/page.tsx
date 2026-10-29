import Link from "next/link";
import { AboutVox } from "@/components/about-vox";

export default function AboutVoxV44Page() {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/preview/v1"
          className="pointer-events-auto font-mono text-[0.68rem] text-fg-subtle uppercase tracking-[0.18em] underline-offset-4 hover:text-fg hover:underline"
        >
          ← Portfolio v1
        </Link>
        <p className="font-mono text-[0.68rem] text-fg-subtle uppercase tracking-[0.18em]">
          v44 · About collage
        </p>
      </header>
      <main>
        <AboutVox />
      </main>
    </>
  );
}
