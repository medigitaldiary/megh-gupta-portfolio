import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { Contact } from "@/components/contact";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v4.3 · fold flow, work first on pine",
  description:
    "Preview of v3.2 with the folds in sync and reordered: Selected Work comes second on a pine band, Experience third on oatmeal.",
  robots: { index: false, follow: false },
};

// Idea 3 from the fold-flow audit. Work moves ahead of Experience, so
// the nav order moves with it (CLAUDE.md §14: the map matches the
// territory). Rhythm: light, pine, light, textured, pine.
export default function PortfolioV43Preview() {
  return (
    <>
      <Nav
        hide={["lab", "writing"]}
        order={["work", "experience", "about", "connect"]}
        wide
      />
      <main id="main" className="fold-flow">
        {/* Fold 1: hook. Who is this and why keep scrolling? */}
        <Hero
          link="travel"
          wide
          leadOut={{ href: "#work", label: "What I have shipped" }}
        />
        {/* Fold 2: proof. What have they shipped, with numbers? */}
        <SelectedWorkShelf
          mark="row"
          flow={{
            index: "01",
            tone: "pine",
            leadOut: { href: "#experience", label: "Where I shipped it" },
          }}
        />
        {/* Fold 3: trajectory. Where did this happen? */}
        <ExperienceRoadmap
          timeline="bar"
          flow={{
            index: "02",
            workLink: { direction: "up", label: "See the work from" },
            leadOut: { href: "#about", label: "The person behind it" },
          }}
        />
        {/* Fold 4: person. Would I want to work with them? */}
        <AboutCollage
          flow={{
            leadOut: { href: "#connect", label: "Say hello" },
          }}
        />
        {/* CTA: action. How do I reach them? */}
        <Contact flow={{ index: "03" }} />
      </main>
      <SiteFooter wide />
    </>
  );
}
