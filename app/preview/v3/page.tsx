import type { Metadata } from "next";
import { AboutCollage } from "@/components/about-collage";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Portfolio v3 preview — Megh Gupta",
  description:
    "Third preview of the portfolio under an Oatmeal / Pine Green / Soft Lilac palette, Geist typography inherited from v2, with hero word highlights, a lilac sun greeting, and ambient lavender tints.",
  robots: { index: false, follow: false },
};

export default function PortfolioV3Preview() {
  return (
    <>
      <Nav hide={["lab", "writing"]} />
      <main>
        <Hero />
        <Experience />
        <SelectedWorkShelf />
        <AboutCollage />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
