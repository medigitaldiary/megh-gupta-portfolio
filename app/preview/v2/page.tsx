import type { Metadata } from "next";
import { AboutMe } from "@/components/about-me";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWork } from "@/components/selected-work";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v2 preview — Megh Gupta",
  description:
    "Second preview of the portfolio with Lab and Writing hidden, and the About fold rebuilt as a horizontal personal-storytelling experience.",
  robots: { index: false, follow: false },
};

export default function PortfolioV2Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <Hero />
        <Experience />
        <SelectedWork />
        <AboutMe />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
