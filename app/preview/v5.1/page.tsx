import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { FooterSky } from "@/components/footer-sky";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";

export const metadata: Metadata = {
  title: "Portfolio v5.1 · sky footer, in line",
  description:
    "Preview of v5 with the sky footer brought into line with the other folds: no hard edge above it, the shared spacing, label, reveal and one clear action.",
  robots: { index: false, follow: false },
};

// v5 with one change: the sky footer follows the fold rules (Option A in
// the sky footer audit). Its height is set by its content, not forced.
// .fold-flow wraps the footer too, so it takes the shared reveal.
// Rhythm: light, pine, light, textured, sky.
export default function PortfolioV51Preview() {
  return (
    <div className="fold-flow">
      <Nav hide={["lab", "writing"]} wide />
      <main id="main">
        {/* Fold 1: hook. Who is this and why keep scrolling? */}
        <Hero
          link="travel"
          wide
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
        <AboutCollage
          flow={{
            index: "03",
            leadOut: { href: "#connect", label: "Say hello" },
          }}
        />
      </main>
      {/* CTA: action. How do I reach them? */}
      <FooterSky flow={{ index: "04" }} wide aligned />
    </div>
  );
}
