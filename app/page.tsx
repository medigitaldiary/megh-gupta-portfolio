import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { LabCard } from "@/components/lab-card";
import { Nav } from "@/components/nav";
import { WorkCard } from "@/components/work-card";
import { labCards } from "@/lib/lab";
import { workCards } from "@/lib/work";

function SectionHeader({
  eyebrow,
  heading,
}: {
  eyebrow: string;
  heading: string;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-fg-subtle">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl">{heading}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />

        <section id="work" className="px-6 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="Selected work"
              heading="What I've shipped, with numbers."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {workCards.map((card) => (
                <WorkCard key={card.slug} card={card} />
              ))}
            </div>
            {/* TODO: real copy — optional "See more case studies" link, add once a real Notion/PDF index exists */}
          </div>
        </section>

        <section
          id="lab"
          className="bg-bg-elevated px-6 py-24 md:px-8 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <SectionHeader
              eyebrow="The lab"
              heading="Things I built when a tool didn't exist or moved too slow."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {labCards.map((card) => (
                <LabCard key={card.slug} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="px-6 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-5xl">
            <SectionHeader eyebrow="About" heading="A bit about me." />
            {/* TODO: real copy — placeholder prose, structure is locked per PRD §6.5 */}
            <div className="max-w-[36rem] space-y-4 text-lg leading-relaxed text-fg-muted">
              <p>
                I&apos;m Megh, a Product Manager working at the intersection of
                fintech and AI tooling.
              </p>
              <p>
                Right now I&apos;m Founding PM at BondScanner, building
                India&apos;s bond market for retail investors.
              </p>
              <p>
                Before that, I was Platform PM at Ultra, working on growth loops
                and reinvestment.
              </p>
              <p>
                I care about 0→1 builds, growth loops, and shipping internal
                tools that compound team leverage.
              </p>
              <p className="font-medium text-fg">
                Currently interviewing for PM roles at VC-backed fintechs and
                AI-first startups.
              </p>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      {/* TODO: real copy — add "· Source" back once the GitHub repo is public, per PRD §6.7 */}
      <footer className="px-6 py-8 text-center font-sans text-xs text-fg-subtle">
        © 2026 Megh Gupta · Built with Claude Code
      </footer>
    </>
  );
}
