import type { Metadata } from "next";
import { AboutBento } from "@/components/about-bento";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { FooterSky } from "@/components/footer-sky";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";

export const metadata: Metadata = {
  title: "Portfolio v5.5 · bento about on oatmeal",
  description:
    "Preview of v5.3 with a new About fold: the bento row from v5.4 on oatmeal, so it blends into the sky footer.",
  robots: { index: false, follow: false },
};

// v5.4 with the About fold back on oatmeal. Pine there cut a hard edge
// above the sky footer, which starts on --bg; on oatmeal, Work, About and
// the footer run as one warm surface into the sky. Type cards turn solid
// pine so the row still has the dark tiles of the reference.
// Rhythm: light, pine, light, light, sky.
export default function PortfolioV55Preview() {
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
            leadOut: { href: "#connect", label: "Say hello" },
          }}
        />
      </main>
      {/* CTA: action. How do I reach them? */}
      <FooterSky wide weather />
    </div>
  );
}
