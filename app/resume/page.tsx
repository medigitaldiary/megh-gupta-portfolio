import type { Metadata } from "next";
import { ResumeDocument } from "@/components/resume-document";

const SITE_URL = "https://www.meghgupta.in";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Megh Gupta, Associate Product Manager, Fintech. Founding PM at BondScanner and platform PM on Tap Invest's ultra app. Download the PDF.",
  alternates: {
    canonical: `${SITE_URL}/resume`,
  },
  openGraph: {
    title: "Megh Gupta · Resume",
    description:
      "Associate Product Manager, Fintech. Founding PM at BondScanner, a SEBI-registered bond platform, and platform PM on Tap Invest's ultra app.",
    url: `${SITE_URL}/resume`,
    siteName: "Megh Gupta",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Megh Gupta in a white turtleneck",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Megh Gupta · Resume",
    description:
      "Associate Product Manager, Fintech. Founding PM at BondScanner and platform PM on Tap Invest's ultra app.",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/resume#webpage`,
  url: `${SITE_URL}/resume`,
  name: "Resume | Megh Gupta",
  description:
    "Resume of Megh Gupta, Associate Product Manager, Fintech. Founding PM at BondScanner and platform PM on Tap Invest's ultra app.",
  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@id": `${SITE_URL}/#person`,
  },
};

export default function ResumePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD graph for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResumeDocument />
    </>
  );
}
