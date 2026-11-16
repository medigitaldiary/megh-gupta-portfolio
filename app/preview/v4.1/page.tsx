import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { Contact } from "@/components/contact";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v4.1 · fold flow, experience on pine",
  description:
    "Preview of v3.2 with the folds in sync: one left edge, numbered headers, a handoff line under each fold, and Experience on a pine band.",
  robots: { index: false, follow: false },
};

// Idea 1 from the fold-flow audit. Same order as v3.2.
// Rhythm: light, pine, light, textured, pine.
export default function PortfolioV41Preview() {
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
        {/* CTA: action. How do I reach them? */}
        <Contact flow={{ index: "04" }} />
      </main>
      <SiteFooter wide />
    </>
  );
}
