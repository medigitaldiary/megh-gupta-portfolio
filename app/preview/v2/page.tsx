import type { Metadata } from "next";
import { AboutMe } from "@/components/about-me";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v2 preview — Megh Gupta",
  description:
    "Second preview of the portfolio with Lab and Writing hidden, the About fold as horizontal personal-storytelling, and Selected Work as an interactive bookshelf.",
  robots: { index: false, follow: false },
};

export default function PortfolioV2Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <Hero />
        <Experience />
        <SelectedWorkShelf />
        <AboutMe />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
