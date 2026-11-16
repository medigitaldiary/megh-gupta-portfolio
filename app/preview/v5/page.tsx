import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { FooterSky } from "@/components/footer-sky";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";

export const metadata: Metadata = {
  title: "Portfolio v5 · sky footer",
  description:
    "Preview of v4.1 with the contact fold and the footer merged into one closing fold on a slow cloud drift.",
  robots: { index: false, follow: false },
};

// v4.1 with one change: the pine contact fold and the site footer become
// a single sky footer. The inline calendar is gone; booking is a pill.
// Rhythm: light, pine, light, textured, sky.
export default function PortfolioV5Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} wide />
      <main id="main" className="fold-flow">
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
      <FooterSky flow={{ index: "04" }} wide />
    </>
  );
}
