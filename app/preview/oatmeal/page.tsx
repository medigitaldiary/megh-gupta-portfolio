import type { Metadata } from "next";
import { AboutMe } from "@/components/about-me";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWorkShelf } from "@/components/selected-work-shelf";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Oatmeal palette preview — Megh Gupta",
  description:
    "The /preview/v2 homepage rendered under an Oatmeal / Pine Green / Soft Lilac palette experiment. Colour-only override.",
  robots: { index: false, follow: false },
};

export default function OatmealPreviewPage() {
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
