import type { Metadata } from "next";
import { AboutBento } from "@/components/about-bento";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { FooterSky } from "@/components/footer-sky";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";

export const metadata: Metadata = {
  title: "Portfolio v5.4 · bento about",
  description:
    "Preview of v5.3 with a new About fold: a bento row of photos and type cards that drifts on a loop.",
  robots: { index: false, follow: false },
};

// v5.3 with one change: the About fold. The scroll-scrubbed collage is
// swapped for a bento marquee (components/about-bento.tsx): a row of
// mixed-size photo and type cards that drifts right to left on a loop.
// Rhythm: light, pine, light, pine, sky.
export default function PortfolioV54Preview() {
  return (
    <div className="fold-flow">
      <Nav hide={["lab", "writing"]} wide resume={false} github chip="roles" />
      <main id="main">
        {/* Fold 1: hook. Who is this and why keep scrolling? */}
        <Hero
          link="travel"
          wide
          threeLine
          resume
          leadOut={{ href: "#experience", label: "Where I have done it" }}
        />
        {/* Fold 2: trajectory. Where has this person been? */}
        <ExperienceRoadmap
          timeline="bar"
          flow={{
            index: "01",
            tone: "pine",
            workLink: { direction: "down", label: "Here is what shipped" },
          }}
        />
        {/* Fold 3: proof. What have they shipped, with numbers? */}
        <SelectedWorkShelf
          mark="row"
          flow={{
            index: "02",
            leadOut: { href: "#about", label: "The person behind the work" },
          }}
        />
        {/* Fold 4: person. Would I want to work with them? */}
        <AboutBento
          flow={{
            tone: "pine",
            leadOut: { href: "#connect", label: "Say hello" },
          }}
        />
      </main>
      {/* CTA: action. How do I reach them? */}
      <FooterSky wide weather />
    </div>
  );
}
