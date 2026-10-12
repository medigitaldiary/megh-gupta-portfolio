import type { Metadata } from "next";
import { AboutStack } from "@/components/about-stack";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWork } from "@/components/selected-work";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v2 preview — Megh Gupta",
  description:
    "Second preview of the portfolio with Lab and Writing deliberately hidden while the rest of the folds get finalised.",
  robots: { index: false, follow: false },
};

// Lab + Writing are hidden entirely on v2 — nav pill AND page body — so
// Megh can finalise the other folds without the distraction. Both still
// render on /preview/v1 and in their own skills; promote them back here
// by restoring the imports + the two <section /> elements and dropping
// the `hide` prop on Nav.
export default function PortfolioV2Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <Hero />
        <Experience />
        <SelectedWork />
        <AboutStack />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
