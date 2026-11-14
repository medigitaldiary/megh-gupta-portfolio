import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { Contact } from "@/components/contact";
import { ExperienceRoadmap } from "@/components/experience-roadmap";
import { HeroOverture } from "@/components/hero-overture";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v3.2 · experience stepper",
  description:
    "Preview of the experience fold drawn as a version stepper, with a changelog as the list view.",
  robots: { index: false, follow: false },
};

// Same page as /preview/v3.4 with one swap: the experience fold.
export default function PortfolioV32Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <HeroOverture />
        <ExperienceRoadmap timeline="stepper" />
        <SelectedWorkShelf />
        <AboutCollage />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
