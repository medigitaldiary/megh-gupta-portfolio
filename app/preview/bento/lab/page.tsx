import type { Metadata } from "next";
import Link from "next/link";
import { BentoBoard } from "@/components/bento/bento-board";
import {
  CallCard,
  CassetteCard,
  CrewPassCard,
  CrossfaderCard,
  OdometerCard,
  RaceBibCard,
} from "@/components/bento/bento-lab-cards";
import "../bento.css";

export const metadata: Metadata = {
  title: "Bento card lab",
  description: "Six object cards to try before any of them joins the board.",
  robots: { index: false, follow: false },
};

// A try-out room, not part of the board. Cards graduate from here to
// /preview/bento one at a time, each replacing a tile.
export default function BentoLabPage() {
  return (
    <BentoBoard>
      <main className="mx-auto max-w-[90rem] px-4 pt-6 pb-10 md:px-8 lg:px-12">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="bento-eyebrow">Card lab · six to try</p>
            <h1 className="mt-2 font-display text-[2.25rem] text-fg leading-[1.05] tracking-tight">
              Slide the fader. Watch the room change.
            </h1>
          </div>
          <Link href="/preview/bento" className="bento-glass bento-btn">
            Back to the board
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:auto-rows-[9.75rem] lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-5">
            <CrossfaderCard />
          </div>
          <div className="lg:col-span-7 lg:row-span-2">
            <CallCard />
          </div>
          <div className="lg:col-span-5">
            <OdometerCard />
          </div>
          <div className="lg:col-span-3 lg:row-span-3">
            <CrewPassCard />
          </div>
          <div className="lg:col-span-5 lg:row-span-3">
            <CassetteCard />
          </div>
          <div className="lg:col-span-4 lg:row-span-3">
            <RaceBibCard />
          </div>
        </div>

        <p className="mt-6 text-center text-fg-subtle text-sm">
          Stand-ins for now: the odometer reading, the bib number and the sample
          call.
        </p>
      </main>
    </BentoBoard>
  );
}
