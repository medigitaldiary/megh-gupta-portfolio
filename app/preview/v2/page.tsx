import type { Metadata } from "next";
import { AboutStack } from "@/components/about-stack";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { LabSection } from "@/components/lab-section";
import { Nav } from "@/components/nav";
import { SelectedWork } from "@/components/selected-work";
import { SiteFooter } from "@/components/site-footer";
import { WritingSection } from "@/components/writing-section";

export const metadata: Metadata = {
  title: "Portfolio v2 preview — Megh Gupta",
  description:
    "Second preview of the full 7-fold portfolio: nav mirrors storyboard order, MoveInSync Independence Day card seeded on the shelf.",
  robots: { index: false, follow: false },
};

export default function PortfolioV2Preview() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <SelectedWork />
        <LabSection />
        <WritingSection />
        <AboutStack />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
