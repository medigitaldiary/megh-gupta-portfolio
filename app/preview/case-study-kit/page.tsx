import type { Metadata } from "next";
import {
  Callout,
  DataTable,
  Eyebrow,
  Figure,
  Metric,
  MetricRow,
  Pill,
  Quote,
  ScreenshotStack,
  Section,
  StepGrid,
  Timeline,
} from "@/components/case-study";

// /preview/case-study-kit — a visual regression target. Renders every
// component in every variant so a token tweak can be verified at a
// glance. noindex per the preview route convention.

export const metadata: Metadata = {
  title: "Case study kit — Megh Gupta",
  description: "Every component in the case-study system, every variant.",
  robots: { index: false, follow: false },
};

export default function CaseStudyKitPage() {
  return (
    <main className="px-6 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-fg-subtle">
          Preview
        </p>
        <h1 className="mt-2 font-serif text-3xl leading-tight text-fg md:text-4xl">
          Case study design system — kit
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fg-muted">
          Every primitive, pattern, and layout variant on one page. If a token
          or font changes, this surface should still read correctly. Not linked
          from anywhere; noindex.
        </p>

        {/* ================ PRIMITIVES ================ */}
        <Section variant="narrative" eyebrow="Primitives" heading="Eyebrow">
          <div className="my-6 flex flex-col gap-3">
            <Eyebrow variant="section">Section</Eyebrow>
            <Eyebrow variant="micro">Micro</Eyebrow>
            <Eyebrow variant="accent">Accent</Eyebrow>
          </div>
        </Section>

        <Section variant="narrative" eyebrow="Primitives" heading="Pill">
          <div className="my-6 flex flex-wrap gap-2">
            <Pill variant="stack">Next.js</Pill>
            <Pill variant="stack">Claude API</Pill>
            <Pill variant="tag">Growth</Pill>
            <Pill variant="tag">Fintech</Pill>
            <Pill variant="status">Live since Sept 2026</Pill>
            <Pill variant="status">Experiment stopped</Pill>
          </div>
        </Section>

        <Section variant="narrative" eyebrow="Primitives" heading="Metric">
          <p>Standalone inline:</p>
          <div className="my-6">
            <Metric
              variant="inline"
              value="~2x"
              label="daily organic clicks"
              caption="3 months"
            />
          </div>
          <p>In a row:</p>
          <MetricRow>
            <Metric
              variant="inline"
              value="~2x"
              label="daily clicks"
              caption="3 months"
            />
            <Metric
              variant="inline"
              value="#3"
              label="hedge funds in india"
              caption="non-brand"
            />
            <Metric
              variant="inline"
              value="26,000+"
              label="ISIN pages"
              caption="long-tail"
            />
          </MetricRow>
          <p>Card variant (used inside StepGrid cells):</p>
          <div className="my-6 max-w-xs">
            <Metric
              variant="card"
              value="350+"
              label="compliance-reviewed blogs"
              caption="since Jan 2026"
            />
          </div>
        </Section>

        <Section variant="narrative" eyebrow="Primitives" heading="Callout">
          <Callout variant="insight">
            SEO had to be built as a product workstream, not a marketing
            function. Three problems, three different kinds of fix.
          </Callout>
          <Callout variant="result">
            Internal linking depth improved ~50–60% after the fixes shipped.
          </Callout>
          <Callout variant="decision">
            We chose Strapi + a Claude compliance agent over Framer — gates
            belong upstream of the publishing tool.
          </Callout>
          <Callout variant="caution">
            The Framer landing pages lived outside the compliance review path.
            We killed the experiment after three pages.
          </Callout>
          <Callout variant="learning">
            Earlier is cheaper — the kinds of learnings you can only see once
            the engine is actually running.
          </Callout>
        </Section>

        <Section variant="narrative" eyebrow="Primitives" heading="Quote">
          <Quote attribution="Nishchay, founder">
            Every blog, dictionary term, and programmatic page we publish today
            keeps working for years. Ads stop the moment we stop paying. SEO is
            a moat if we commit to it.
          </Quote>
        </Section>

        <Section variant="narrative" eyebrow="Primitives" heading="Figure">
          <p>Prose variant with placeholder image:</p>
          <Figure
            variant="prose"
            src="/images/work/product-led-seo-engine/sample-blog.webp"
            alt="Placeholder for a representative BondScanner blog on mobile."
            caption="Prose variant — fits the max-w-2xl column."
            eyebrow="Fig. demo — Prose"
            isPlaceholder
          />
          <p>Wide variant (same column, breaks prose rhythm):</p>
          <Figure
            variant="wide"
            src="/images/work/product-led-seo-engine/nodal-diagram.webp"
            alt="Placeholder for a nodal diagram of the site graph."
            caption="Wide variant — used for diagrams that are the point of the section."
            eyebrow="Fig. demo — Wide"
            isPlaceholder
          />
          <p>SVG variant (inline children, no next/image):</p>
          <Figure
            variant="svg"
            eyebrow="Fig. demo — SVG"
            caption="SVG variant — pass any inline SVG as children."
          >
            <svg
              viewBox="0 0 300 100"
              style={{ width: "100%", height: "auto" }}
            >
              <title>
                Demo SVG — single horizontal rule and a labeled dot.
              </title>
              <line
                x1="20"
                y1="50"
                x2="280"
                y2="50"
                stroke="var(--fg-muted)"
                strokeWidth="1.5"
              />
              <circle cx="150" cy="50" r="8" fill="var(--accent)" />
              <text
                x="150"
                y="30"
                textAnchor="middle"
                fontSize="11"
                fill="var(--fg-muted)"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                node
              </text>
            </svg>
          </Figure>
          <p>Annotated variant with marks + legend:</p>
          <Figure
            variant="annotated"
            src="/images/work/product-led-seo-engine/sample-isin.webp"
            alt="Placeholder for an ISIN page with three annotations."
            caption="Annotated variant — overlay numbered marks + legend below."
            eyebrow="Fig. demo — Annotated"
            isPlaceholder
            annotations={[
              { x: 25, y: 20, label: "Hero slot — issuer, coupon, maturity." },
              { x: 70, y: 45, label: "Secondary market activity feed." },
              {
                x: 40,
                y: 80,
                label: "Related ISINs + Dictionary cross-links.",
              },
            ]}
          />
        </Section>

        {/* ================ PATTERNS ================ */}
        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="StepGrid — parallel"
        >
          <StepGrid variant="parallel" numbered>
            <StepGrid.Cell title="Technical foundations" eyebrow="Workstream">
              Mapped the site graph, fixed crawlability.
            </StepGrid.Cell>
            <StepGrid.Cell title="Self-serve publishing" eyebrow="Workstream">
              Compliance agent + Strapi, 4 blogs a day.
            </StepGrid.Cell>
            <StepGrid.Cell title="Governance" eyebrow="Workstream">
              SEO in Specify / Review / Verify.
            </StepGrid.Cell>
            <StepGrid.Cell title="Editorial content" eyebrow="Workstream">
              350+ blogs on the keywords retail investors actually search.
            </StepGrid.Cell>
            <StepGrid.Cell title="Programmatic depth" eyebrow="Workstream">
              26,000+ ISIN pages + 200+ Dictionary entries.
            </StepGrid.Cell>
          </StepGrid>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="StepGrid — sequence"
        >
          <StepGrid variant="sequence">
            <StepGrid.Cell
              title="SEO requirements enter the PRD"
              eyebrow="Specify"
            >
              Every ticket's PRD carries an SEO section.
            </StepGrid.Cell>
            <StepGrid.Cell
              title="SEO is a line-item in review"
              eyebrow="Review"
            >
              Design + tech review flag crawl + canonical risks.
            </StepGrid.Cell>
            <StepGrid.Cell title="QA includes an SEO pass" eyebrow="Verify">
              View-source + Rich Results Test on preview URL.
            </StepGrid.Cell>
          </StepGrid>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="StepGrid — compare"
        >
          <StepGrid variant="compare">
            <StepGrid.Cell title="Manual compliance review" eyebrow="Before">
              Each blog waited 2–3 days in the reviewer's queue.
            </StepGrid.Cell>
            <StepGrid.Cell title="Claude agent + Strapi" eyebrow="After">
              Compliance review runs in minutes; cadence holds at 4 blogs a day.
            </StepGrid.Cell>
          </StepGrid>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="DataTable — data"
        >
          <DataTable variant="data" caption="Daily organic clicks by month">
            <thead>
              <tr>
                <th>Month</th>
                <th>Clicks / day</th>
                <th>Non-brand share</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jan 2026</td>
                <td className="num">~380</td>
                <td className="num">12%</td>
              </tr>
              <tr>
                <td>Feb 2026</td>
                <td className="num">~520</td>
                <td className="num">24%</td>
              </tr>
              <tr>
                <td>Mar 2026</td>
                <td className="num">~720</td>
                <td className="num">38%</td>
              </tr>
            </tbody>
          </DataTable>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="DataTable — ownership"
        >
          <DataTable variant="ownership">
            <DataTable.Column label="I owned">
              <ul>
                <li>Three-pillar strategy and the product-workstream case.</li>
                <li>Compliance AI agent: spec, prompt, evaluation harness.</li>
                <li>Programmatic page templating logic.</li>
              </ul>
            </DataTable.Column>
            <DataTable.Column label="Team owned">
              <ul>
                <li>Engineering: programmatic build + Strapi integration.</li>
                <li>Content: writing blogs and Dictionary entries.</li>
                <li>
                  Compliance: Rehana on ambiguous flags, final SEBI sign-off.
                </li>
              </ul>
            </DataTable.Column>
          </DataTable>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="DataTable — responsibility"
        >
          <DataTable variant="responsibility">
            <DataTable.Column label="Me">
              <ul>
                <li>Strategy, measurement, founder narrative.</li>
              </ul>
            </DataTable.Column>
            <DataTable.Column label="Engineering">
              <ul>
                <li>Build, integration, crawl fixes.</li>
              </ul>
            </DataTable.Column>
            <DataTable.Column label="Design">
              <ul>
                <li>Dictionary + ISIN templates.</li>
              </ul>
            </DataTable.Column>
          </DataTable>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="Timeline — vertical"
        >
          <Timeline variant="vertical">
            <Timeline.Event date="2026-09-10" title="20% ramp">
              Rollout to 20% of traffic at 5:28 PM IST. No issues.
            </Timeline.Event>
            <Timeline.Event date="2026-09-11" title="100% at 12 PM IST">
              Full rollout, verified across Android, iOS, Web, mWeb.
            </Timeline.Event>
            <Timeline.Event date="2026-10-01" title="First retention cohort">
              First week-4 retention cohort reported.
            </Timeline.Event>
          </Timeline>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="Timeline — horizontal"
        >
          <Timeline variant="horizontal">
            <Timeline.Event date="2026-01" title="Audit">
              Site-graph crawl + nodal diagram.
            </Timeline.Event>
            <Timeline.Event date="2026-02" title="Compliance agent">
              Claude prompt + evaluation harness live.
            </Timeline.Event>
            <Timeline.Event date="2026-03" title="Programmatic ramp">
              26,000+ ISIN pages ship.
            </Timeline.Event>
          </Timeline>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="Timeline — phase"
        >
          <Timeline variant="phase">
            <Timeline.Event date="Jan 2026" title="Discovery" />
            <Timeline.Event date="Feb 2026" title="Build" />
            <Timeline.Event date="Mar 2026" title="Rollout" />
            <Timeline.Event date="Apr 2026" title="Measure" />
          </Timeline>
        </Section>

        <Section
          variant="narrative"
          eyebrow="Patterns"
          heading="ScreenshotStack"
        >
          <ScreenshotStack
            layout="row"
            eyebrow="Fig. demo — ScreenshotStack row"
          >
            <ScreenshotStack.Item
              src="/images/work/product-led-seo-engine/sample-blog.webp"
              alt="Placeholder: blog on mobile."
              caption="Mobile"
            />
            <ScreenshotStack.Item
              src="/images/work/product-led-seo-engine/sample-dictionary.webp"
              alt="Placeholder: Dictionary entry."
              caption="Dictionary"
            />
            <ScreenshotStack.Item
              src="/images/work/product-led-seo-engine/sample-isin.webp"
              alt="Placeholder: ISIN page."
              caption="ISIN"
            />
          </ScreenshotStack>
        </Section>

        {/* ================ LAYOUTS ================ */}
        <Section
          variant="narrative"
          eyebrow="Layouts"
          heading="narrative (this one)"
        >
          <p>Default layout — single-column prose, max-w-2xl.</p>
        </Section>

        <Section variant="split" eyebrow="Layouts" heading="split">
          <p>
            Left column, 3/5 of the row. Prose + optional inline primitives like{" "}
            <Pill variant="tag">tags</Pill>.
          </p>
          <p>Stacks on mobile with the visual below.</p>
          <Figure
            data-split="visual"
            variant="prose"
            src="/images/work/product-led-seo-engine/sample-blog.webp"
            alt="Placeholder split visual."
            caption="Right column, 2/5."
            isPlaceholder
          />
        </Section>

        <Section variant="fullBleed" eyebrow="Layouts" heading="fullBleed">
          <p>H2 + one wide Figure + optional caption prose below.</p>
          <Figure
            variant="wide"
            src="/images/work/product-led-seo-engine/nodal-diagram.webp"
            alt="Placeholder wide figure."
            caption="A diagram that is the point of the section."
            isPlaceholder
          />
          <p>
            Prose can continue below the figure if the caption isn't enough.
          </p>
        </Section>

        <Section variant="comparison" eyebrow="Layouts" heading="comparison">
          <p>Two things read side by side.</p>
          <StepGrid variant="compare">
            <StepGrid.Cell title="Before" eyebrow="Before">
              The old world.
            </StepGrid.Cell>
            <StepGrid.Cell title="After" eyebrow="After">
              The new one.
            </StepGrid.Cell>
          </StepGrid>
        </Section>

        <Section variant="metrics" eyebrow="Layouts" heading="metrics">
          <p>
            Numbers above, structural wins below, qualitative at the bottom.
          </p>
          <MetricRow>
            <Metric
              variant="inline"
              value="~2x"
              label="daily organic clicks"
              caption="3 months"
            />
            <Metric
              variant="inline"
              value="#3"
              label="hedge funds in india"
              caption="non-brand"
            />
            <Metric
              variant="inline"
              value="26,000+"
              label="ISIN pages"
              caption="long-tail"
            />
          </MetricRow>
          <p>Structural wins:</p>
          <ul>
            <li>Internal linking depth +50–60%</li>
            <li>230+ orphaned posts now reachable</li>
          </ul>
        </Section>

        <Section variant="deepDive" eyebrow="Layouts" heading="deepDive">
          <p>Longer-form section with sub-H3s styled by the article wrapper.</p>
          <h3>A sub-section</h3>
          <p>Sub-content with its own rhythm.</p>
        </Section>

        <Section variant="reflection" eyebrow="Layouts" heading="reflection">
          <p>Short section — tighter prose column (max-w-xl).</p>
          <Callout variant="learning">
            One short learning, framing the whole section.
          </Callout>
        </Section>

        <Section variant="ownership" eyebrow="Layouts" heading="ownership">
          <p>Closing attribution section.</p>
          <DataTable variant="ownership">
            <DataTable.Column label="I owned">
              <ul>
                <li>Shape and constraints.</li>
              </ul>
            </DataTable.Column>
            <DataTable.Column label="Team owned">
              <ul>
                <li>Everything else.</li>
              </ul>
            </DataTable.Column>
          </DataTable>
        </Section>
      </div>
    </main>
  );
}
