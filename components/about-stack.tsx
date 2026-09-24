import Image from "next/image";
import { SectionHeader } from "@/components/section-header";

// About fold. The stack (tools I build with) moved into the Lab fold's
// bulletin board — see components/lab-scene.tsx.
export function AboutStack() {
  return (
    <section id="about" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="About" title="A bit about me." />
        <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-14">
          <div className="mx-auto md:mx-0">
            <div className="relative h-[280px] w-[220px] overflow-hidden rounded-lg bg-accent/10 md:h-[320px] md:w-[240px]">
              <Image
                src="/images/about/megh-convocation.webp"
                alt="Megh at BITS Pilani K.K. Birla Goa Campus convocation"
                fill
                sizes="(min-width: 768px) 240px, 220px"
                className="scale-[1.18] object-cover object-[center_72%]"
                priority
              />
            </div>
          </div>
          <div className="prose prose-neutral max-w-none">
            <p className="text-base leading-[1.7] text-fg md:text-lg">
              I&apos;m a product manager at the fintech × AI-tooling
              intersection. Founding PM at BondScanner, where I&apos;m making
              the retail bond market feel less like a spreadsheet and more like
              an app.
            </p>
            <p className="mt-4 text-base leading-[1.7] text-fg-muted md:text-lg">
              Before that I was a platform PM at Ultra, running growth loops and
              reinvestment for their alternative-investment app — the kind of
              lifecycle work that adds a real ₹50cr of AUM if you get it right.
            </p>
            <p className="mt-4 text-base leading-[1.7] text-fg-muted md:text-lg">
              I got into fintech because financial products in India still feel
              hostile to the person using them. That&apos;s the fix I keep
              chasing. Outside work: I read too much, run in Bangalore weather
              badly, and vibe-code the tools I wish existed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
