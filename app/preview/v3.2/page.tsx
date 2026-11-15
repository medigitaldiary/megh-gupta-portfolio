import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { Contact } from "@/components/contact";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v3.2 · experience bar",
  description:
    "Preview of v3.1 with one swap: the experience fold drawn as one segmented bar, with a changelog as the list view.",
  robots: { index: false, follow: false },
};

// Same page as /preview/v3.1 with one swap: the experience fold.
export default function PortfolioV32Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main id="main">
        <Hero link="travel" />
        <ExperienceRoadmap timeline="bar" />
        <SelectedWorkShelf mark="row" />
        <AboutCollage />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
