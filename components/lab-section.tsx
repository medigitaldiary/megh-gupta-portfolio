import { LabCard } from "@/components/lab-card";
import { LabScene } from "@/components/lab-scene";
import { SectionHeader } from "@/components/section-header";
import {
  getEfficiencyLabCards,
  getSideQuestLabCards,
  type LabCard as LabCardType,
} from "@/lib/lab";

function SubsectionLabel({
  code,
  title,
  subtitle,
}: {
  code: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-baseline gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
        {code}
      </span>
      <div className="min-w-0">
        <h3 className="font-serif text-xl leading-tight text-fg md:text-2xl">
          {title}
        </h3>
        <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
      </div>
    </div>
  );
}

function CardGrid({ cards }: { cards: LabCardType[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <LabCard key={card.slug} card={card} index={i + 1} />
      ))}
    </div>
  );
}

export function LabSection() {
  const efficiency = getEfficiencyLabCards();
  const sideQuest = getSideQuestLabCards();

  return (
    <section id="lab" className="px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="The Lab"
          title="Where I test, build, and break things."
        />

        {/* Workbench scene — hover any object for details */}
        <LabScene />

        {/* Fold 4a — Efficiency Tools */}
        <SubsectionLabel
          code="01 · Efficiency Tools"
          title="Things I built when a tool didn't exist or moved too slow."
          subtitle="Shipped tools, skill files, and personal utilities I actually use."
        />
        <CardGrid cards={efficiency} />

        {/* Workbench divider */}
        <div
          aria-hidden="true"
          className="my-16 flex items-center gap-4 text-fg-subtle"
        >
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
            side quest
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Fold 4b — Side Quest */}
        <SubsectionLabel
          code="02 · Side Quest"
          title="Experiments still in the beaker."
          subtitle="Build-in-public bets — versions, stages, and rough edges included."
        />
        <CardGrid cards={sideQuest} />

        <div className="mt-10">
          <a
            href="#lab"
            aria-disabled="true"
            className="inline-flex items-center gap-2 text-sm text-fg-muted underline underline-offset-4 opacity-60"
          >
            all builds → <span className="font-mono text-xs">(soon)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
