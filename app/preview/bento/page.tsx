import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { BentoBoard } from "@/components/bento/bento-board";
import { BentoEntrance } from "@/components/bento/bento-entrance";
import {
  ConnectTile,
  IntroTile,
  WorkbenchTile,
  WorkTile,
} from "@/components/bento/bento-tiles";
import {
  type BentoPrint,
  NowTile,
  NumbersTile,
  PrintStack,
  type RouteJob,
  RouteTile,
  ScanSwitch,
  VennTile,
} from "@/components/bento/bento-widgets";
import { ABOUT_VOX_CHAPTERS } from "@/lib/about-vox";
import { BENTO_PRINT_IDS, BENTO_TILE_LENSES, BENTO_WORK } from "@/lib/bento";
import { getCaseStudy } from "@/lib/case-study";
import { withCoverVideos } from "@/lib/cover-video";
import { formatDateRange, getAllExperience } from "@/lib/experience";
import { getEfficiencyLabCards, getSideQuestLabCards } from "@/lib/lab";
import { getWorkCardBySlug, type WorkCard } from "@/lib/work";
import "./bento.css";

export const metadata: Metadata = {
  title: "Bento",
  description:
    "Megh Gupta on one board: the route, the work, the numbers and how to reach him.",
  robots: { index: false, follow: false },
};

// The BITS mark shows on the Goa stop once the file is added to the repo.
const BITS_LOGO = "/images/logos/bits-goa.png";
const hasBitsLogo = () =>
  fs.existsSync(path.join(process.cwd(), "public", BITS_LOGO));

const lensesFor = (key: string) => (BENTO_TILE_LENSES[key] ?? []).join(" ");

function routeJobs(): RouteJob[] {
  return getAllExperience().flatMap((entry) => {
    if (!entry.products?.length) {
      return [
        {
          name: entry.company,
          role: entry.role,
          range: formatDateRange(entry),
          metric: entry.metric,
          logo: entry.logo,
          logoBg: entry.logoBg,
        },
      ];
    }
    return [...entry.products]
      .sort((a, b) => (b.start ?? "").localeCompare(a.start ?? ""))
      .map((product) => ({
        name: product.name,
        role: product.role ?? entry.role,
        range:
          product.start && product.end
            ? formatDateRange({ start: product.start, end: product.end })
            : formatDateRange(entry),
        metric: product.metric,
        logo: product.logo,
        logoBg: product.logoBg,
      }));
  });
}

export default async function BentoPreviewPage() {
  const cards = withCoverVideos(
    BENTO_WORK.map((w) => getWorkCardBySlug(w.slug)).filter(
      (c): c is WorkCard => Boolean(c),
    ),
  );
  const work = BENTO_WORK.flatMap((w) => {
    const card = cards.find((c) => c.slug === w.slug);
    return card ? [{ ...w, card }] : [];
  });
  const [seo, ultra, bytes] = work;
  const seoStudy = seo ? await getCaseStudy(seo.slug) : null;

  const prints: BentoPrint[] = BENTO_PRINT_IDS.flatMap((id) => {
    const chapter = ABOUT_VOX_CHAPTERS.find((c) => c.id === id);
    return chapter
      ? [
          {
            id: chapter.id,
            src: chapter.src,
            alt: chapter.alt,
            caption: chapter.caption,
          },
        ]
      : [];
  });
  const goa = ABOUT_VOX_CHAPTERS.find((c) => c.id === "convocation");

  const sideQuests = getSideQuestLabCards();
  const inUse = getEfficiencyLabCards();
  const shipped = [
    ...sideQuests.filter((c) => c.stage === "v1" || c.stage === "shipped"),
    ...inUse,
  ];

  return (
    <BentoBoard>
      <main className="mx-auto max-w-[90rem] px-4 pt-4 pb-10 md:px-8 lg:px-12 lg:pt-6">
        <BentoEntrance className="bento-grid">
          {/* Tile 1: hook. Who is this? */}
          <IntroTile />

          {/* Tile 2: trajectory. Where has this person been? */}
          <RouteTile
            jobs={routeJobs()}
            bitsLogo={hasBitsLogo() ? BITS_LOGO : undefined}
            goa={
              goa
                ? {
                    src: goa.src,
                    alt: goa.alt,
                    caption: goa.caption,
                  }
                : undefined
            }
          />

          {/* Tiles 3 to 5: proof. What shipped, with numbers? */}
          {seo ? (
            <WorkTile
              card={seo.card}
              value={seo.value}
              label={seo.label}
              lenses={lensesFor(seo.slug)}
              area="bento-area-seo"
              layout="tall"
              supporting={seoStudy?.frontmatter.supporting_metrics ?? []}
            />
          ) : null}
          {ultra ? (
            <WorkTile
              card={ultra.card}
              value={ultra.value}
              label={ultra.label}
              lenses={lensesFor(ultra.slug)}
              area="bento-area-ultra"
              layout="bleed"
            />
          ) : null}
          <VennTile />
          <NumbersTile lenses={lensesFor("numbers")} />
          {bytes ? (
            <WorkTile
              card={bytes.card}
              value={bytes.value}
              label={bytes.label}
              lenses={lensesFor(bytes.slug)}
              area="bento-area-bytes"
              layout="split"
            />
          ) : null}

          {/* Tiles 6 to 8: person. Would I want to work with them? */}
          <PrintStack prints={prints} />
          <ScanSwitch />
          <NowTile />
          <WorkbenchTile
            building={sideQuests.filter((c) => c.stage === "building")}
            testing={sideQuests.filter((c) => c.stage === "testing")}
            shipped={shipped.slice(0, 3)}
            moreShipped={Math.max(0, shipped.length - 3)}
            lenses={lensesFor("workbench")}
          />

          {/* Tile 9: action. How do I reach them? */}
          <ConnectTile />
        </BentoEntrance>

        <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-fg-subtle text-sm">
          <p>© 2026 Megh Gupta</p>
          <Link
            href="/resume"
            className="underline-offset-4 hover:text-fg hover:underline"
          >
            Resume
          </Link>
        </footer>
      </main>
    </BentoBoard>
  );
}
