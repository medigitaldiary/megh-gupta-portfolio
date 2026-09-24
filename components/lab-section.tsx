import { LabScene } from "@/components/lab-scene";

// Fold 4 · The Lab.
// Full-width, dark garage bg. No max-w container around the scene — the
// workbench runs edge-to-edge to feel like a real place, not a slide.
// A top-gradient strip fades from the page's light bg into the dark, so
// Selected Work above pours smoothly into the Lab without a hard seam.
export function LabSection() {
  return (
    <section
      id="lab"
      className="relative"
      style={{ backgroundColor: "#1A1815" }}
    >
      {/* Fade from the page background into the garage.
          Sits above the section, contained by the section's own bg. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, rgba(26,24,21,0) 100%)",
        }}
      />

      {/* Section header — quiet, dark-background copy */}
      <div className="mx-auto max-w-5xl px-6 pt-24 md:px-8 md:pt-32">
        <p
          className="font-mono text-xs uppercase tracking-[0.18em]"
          style={{ color: "#6EE7A0" }}
        >
          The Lab
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">
          Where I test, build, and break things.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-white/60 md:text-base">
          Hover any object on the workbench — every one is a real skill file,
          side quest, app, or piece of the stack.
        </p>
      </div>

      {/* The scene runs edge-to-edge on wide screens; on mobile it stays
          within a comfortable inset so nothing clips. */}
      <div className="relative mt-8 w-full">
        <LabScene />
      </div>

      {/* Bottom fade back to page bg for a clean handoff to Writing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
        style={{
          background:
            "linear-gradient(to top, var(--bg) 0%, rgba(26,24,21,0) 100%)",
        }}
      />

      <div className="h-24 md:h-32" />
    </section>
  );
}
