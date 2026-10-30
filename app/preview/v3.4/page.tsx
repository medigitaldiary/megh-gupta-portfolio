import type { Metadata } from "next";
import { AboutMe } from "@/components/about-me";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { HeroOverture } from "@/components/hero-overture";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v3.4 — opening",
  description:
    "Preview of the opening: a full-screen Venn with the portrait in the center, then the current hero fold.",
  robots: { index: false, follow: false },
};

export default function PortfolioV34Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <HeroOverture />
        <Experience />
        <SelectedWorkShelf />
        <AboutMe />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
