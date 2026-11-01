import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v3.1 — pin leaves the portrait",
  description:
    "Preview where a pine dot leaves the portrait and lands on the I'm here pin.",
  robots: { index: false, follow: false },
};

export default function PortfolioV31Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <Hero link="travel" />
        <Experience />
        <SelectedWorkShelf />
        <AboutCollage />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
