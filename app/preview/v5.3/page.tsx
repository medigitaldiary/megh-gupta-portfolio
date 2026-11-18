import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { FooterSky } from "@/components/footer-sky";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";

export const metadata: Metadata = {
  title: "Portfolio v5.3 · weather toy",
  description:
    "Preview of v5.1 with a weather toy in the sky footer: one button cycles the sky through sunny, drizzle, rain, a thunderstorm and a winter morning.",
  robots: { index: false, follow: false },
};

// v5.1 with one change: a weather toy in the sky footer. One button in
// the meta strip cycles the sky through five moods. The clouds stay the
// background; headline, pills and meta strip are unchanged.
// .fold-flow wraps the footer too, so it takes the shared reveal.
// Rhythm: light, pine, light, textured, sky.
export default function PortfolioV53Preview() {
  return (
    <div className="fold-flow">
      <Nav hide={["lab", "writing"]} wide />
      <main id="main">
        {/* Fold 1: hook. Who is this and why keep scrolling? */}
        <Hero
          link="travel"
          wide
          threeLine
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
            leadOut: { href: "#connect", label: "Say hello" },
          }}
        />
      </main>
      {/* CTA: action. How do I reach them? */}
      <FooterSky wide weather />
    </div>
  );
}
