import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.meghgupta.in";
const TITLE = "Megh Gupta | Product Manager";
const DESCRIPTION =
  "Megh Gupta is a product manager at BondScanner, a SEBI-registered online bond platform. BITS Goa grad, 1.5 years in fintech, experimenting with voice AI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Megh Gupta",
  },
  description: DESCRIPTION,
  applicationName: "Megh Gupta",
  authors: [{ name: "Megh Gupta", url: SITE_URL }],
  creator: "Megh Gupta",
  publisher: "Megh Gupta",
  keywords: [
    "Megh Gupta",
    "Product Manager",
    "BondScanner",
    "SEBI",
    "Fintech India",
    "BITS Goa",
    "Voice AI",
  ],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "text/markdown": [{ url: "/index.md", title: "Profile as Markdown" }],
    },
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "Megh Gupta",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    firstName: "Megh",
    lastName: "Gupta",
    username: "meghgupta",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Megh Gupta — Product Manager, BondScanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  category: "personal",
};

// JSON-LD graph — Person + WebSite + ProfilePage. Rendered inline in <head>
// so crawlers see it on first byte without waiting for JS.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Megh Gupta",
      alternateName: "meghgupta",
      url: `${SITE_URL}/`,
      jobTitle: "Product Manager",
      description: DESCRIPTION,
      worksFor: {
        "@type": "Organization",
        name: "BondScanner",
        url: "https://www.bondscanner.com/",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "BITS Pilani, K.K. Birla Goa Campus",
      },
      homeLocation: {
        "@type": "Place",
        name: "India",
      },
      email: "mailto:megh.bpgc@gmail.com",
      sameAs: ["https://www.linkedin.com/in/megh-gupta-917280200"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Megh Gupta",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: TITLE,
      description: DESCRIPTION,
      mainEntity: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FAFAF7" />
        {/* discovery:start */}
        <link
          rel="help"
          type="text/plain"
          href="/llms.txt"
          title="AI reading guide"
        />
        <link
          rel="help"
          type="text/markdown"
          href="/AGENTS.md"
          title="Agent guidance"
        />
        <link
          rel="sitemap"
          type="application/xml"
          href="/sitemap.xml"
          title="Sitemap"
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, non-user-controlled JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* discovery:end */}
      </head>
      <body
        className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-bg text-fg`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
