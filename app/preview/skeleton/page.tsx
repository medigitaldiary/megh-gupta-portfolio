import type { Metadata } from "next";

/**
 * Full portfolio homepage skeleton — one route showing every fold
 * from CLAUDE.md §14 in order, at wireframe fidelity. Every element
 * is a labeled placeholder; nothing here is the real design.
 *
 * Intent: give Megh (and any future reviewer) a scannable map of
 * what the launched homepage will contain, in the right sequence,
 * before any pixel work happens. Reference this route in launch
 * PRs so the storyboard-review discipline in CLAUDE.md §14 stays
 * honest.
 *
 * Fonts, colors, and spacing are intentionally not the site's
 * design tokens — they override to a plain system stack so the
 * skeleton reads as scaffolding, not as "the design."
 */

export const metadata: Metadata = {
  title: "Homepage skeleton — full portfolio wireframe",
  description: "Wireframe-fidelity mockup of the full portfolio, fold by fold.",
  robots: { index: false, follow: false },
};

const box: React.CSSProperties = {
  border: "1px dashed #94a3b8",
  padding: "16px",
  borderRadius: "6px",
  background: "#ffffff",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const foldStyle: React.CSSProperties = {
  minHeight: "100svh",
  padding: "32px 24px",
  borderBottom: "2px solid #cbd5e1",
  background: "#f8fafc",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  color: "#0f172a",
};

const foldHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "24px",
  padding: "12px 14px",
  background: "#0f172a",
  color: "#f1f5f9",
  fontSize: "12px",
  letterSpacing: "0.08em",
  borderRadius: "4px",
};

const placeholder: React.CSSProperties = {
  color: "#64748b",
  fontStyle: "italic",
  fontSize: "13px",
};

const grayBlock = (h: string): React.CSSProperties => ({
  height: h,
  background: "#e2e8f0",
  border: "1px dashed #94a3b8",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  fontSize: "12px",
});

function FoldHeader({
  n,
  name,
  job,
  question,
  docRef,
}: {
  n: number;
  name: string;
  job: string;
  question: string;
  docRef: string;
}) {
  return (
    <div style={foldHeader}>
      <div>
        <div style={{ fontWeight: 700, fontSize: "14px" }}>
          FOLD {n} · {name.toUpperCase()}
        </div>
        <div style={{ opacity: 0.7, marginTop: "4px" }}>
          job: {job} · answers: {question}
        </div>
      </div>
      <div style={{ opacity: 0.6 }}>{docRef}</div>
    </div>
  );
}

export default function SkeletonPage() {
  return (
    <main
      style={{
        background: "#f1f5f9",
        color: "#0f172a",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      <div
        style={{
          padding: "24px",
          background: "#0f172a",
          color: "#f1f5f9",
          position: "sticky",
          top: 0,
          zIndex: 10,
          fontSize: "13px",
        }}
      >
        <strong>Homepage skeleton — wireframe fidelity only.</strong>{" "}
        <span style={{ opacity: 0.7 }}>
          Not the design. Reads top-to-bottom in the fold order locked in
          CLAUDE.md §14. Every block is a placeholder for content that lives
          elsewhere in the PRD.
        </span>
      </div>

      {/* ─────────────────────────────── FOLD 1 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={1}
          name="Hero"
          job="Hook"
          question="Who is this and why should I keep scrolling?"
          docRef="CLAUDE.md §14"
        />
        <div style={{ ...box, minHeight: "60vh" }}>
          <div style={placeholder}>
            [MONO EYEBROW · &quot;Product Manager · Fintech&quot;]
          </div>
          <div
            style={{
              ...grayBlock("120px"),
              marginTop: "16px",
              fontSize: "18px",
            }}
          >
            [HERO HEADLINE — one line, editorial serif, ~64px display]
          </div>
          <div
            style={{
              ...grayBlock("60px"),
              marginTop: "12px",
              fontSize: "13px",
            }}
          >
            [10-second intro paragraph — PRD §7.3]
          </div>
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                ...grayBlock("48px"),
                flex: "0 0 200px",
                maxWidth: "220px",
              }}
            >
              [CTA · Let&apos;s connect → scrolls to #connect]
            </div>
          </div>
          <div style={{ marginTop: "16px", ...placeholder, fontSize: "11px" }}>
            One CTA only. LinkedIn + Resume live inside the Let&apos;s connect
            fold, not here — the hero pulls the reader down the page, not off
            it.
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FOLD 2 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={2}
          name="Experience"
          job="Trajectory"
          question="Where has this person been?"
          docRef="PRD §7.7"
        />
        <div style={{ ...box }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <div style={placeholder}>
                [MONO EYEBROW · &quot;EXPERIENCE&quot;]
              </div>
              <div style={{ ...grayBlock("48px"), marginTop: "8px" }}>
                [SECTION HEADLINE · &quot;where I have worked&quot; · serif]
              </div>
            </div>
            <div style={{ ...grayBlock("36px"), flex: "0 0 160px" }}>
              [toggle: list | timeline]
            </div>
          </div>

          <div style={placeholder}>
            Default = timeline. Horizontal pill row on a year axis.
          </div>
          <div style={{ ...grayBlock("140px"), marginTop: "8px" }}>
            [TIMELINE · pills on a year axis · &quot;now&quot; dashed marker ·
            drag sideways]
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
              ...placeholder,
            }}
          >
            <span>2020</span>
            <span>2021</span>
            <span>2022</span>
            <span>2023</span>
            <span>2024</span>
            <span>2025</span>
            <span>2026 · now</span>
            <span>2027</span>
          </div>

          <div style={{ marginTop: "24px", ...placeholder }}>
            ↓ clicking a pill reveals detail panel below:
          </div>
          <div style={{ ...grayBlock("140px"), marginTop: "8px" }}>
            [DETAIL PANEL · company tagline · 2-4 verb-first bullets with
            numbers]
          </div>

          <div style={{ marginTop: "16px", ...placeholder, fontSize: "12px" }}>
            Alternate view (toggle → list): vertical LinkedIn-style stack, logo
            tile left, date right, tap-to-expand bullets. Same data.
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FOLD 3 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={3}
          name="Selected Work"
          job="Proof"
          question="What have they actually shipped, with numbers?"
          docRef="CLAUDE.md §5, PRD §7.5"
        />
        <div style={box}>
          <div style={placeholder}>
            [MONO EYEBROW · &quot;SELECTED WORK&quot;]
          </div>
          <div style={{ ...grayBlock("48px"), marginTop: "8px" }}>
            [SECTION HEADLINE · e.g. &quot;what I&apos;ve shipped, with
            numbers&quot;]
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...box, background: "#f8fafc" }}>
                <div style={grayBlock("140px")}>
                  [HERO IMAGE · /images/work/[slug]/hero.png]
                </div>
                <div style={{ marginTop: "12px", ...placeholder }}>
                  [TAGS · Growth · SEO · Fintech]
                </div>
                <div style={{ ...grayBlock("28px"), marginTop: "8px" }}>
                  [CASE STUDY TITLE — one line]
                </div>
                <div style={{ ...grayBlock("22px"), marginTop: "6px" }}>
                  [HEADLINE METRIC · e.g. &quot;2x organic clicks in 3
                  months&quot;]
                </div>
                <div style={{ marginTop: "10px", ...placeholder }}>
                  [→ /work/[slug]]
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "20px", ...placeholder }}>
            [optional footer link · &quot;see all case studies →&quot; when
            index exists]
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FOLD 4 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={4}
          name="The Lab"
          job="Range"
          question="Do they build outside their day job?"
          docRef="CLAUDE.md §4"
        />
        <div style={box}>
          <div style={placeholder}>[MONO EYEBROW · &quot;THE LAB&quot;]</div>
          <div style={{ ...grayBlock("48px"), marginTop: "8px" }}>
            [SECTION HEADLINE · e.g. &quot;things I built when a tool
            didn&apos;t exist&quot;]
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ ...box, background: "#f8fafc" }}>
                <div style={{ ...grayBlock("30px"), fontSize: "12px" }}>
                  [LAB PROJECT NAME]
                </div>
                <div
                  style={{
                    ...grayBlock("60px"),
                    marginTop: "8px",
                    fontSize: "11px",
                  }}
                >
                  [1-2 sentence description]
                </div>
                <div style={{ marginTop: "8px", ...placeholder }}>
                  [MONO STACK TAGS]
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FOLD 5 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={5}
          name="Writing"
          job="Thought"
          question="How do they think about product?"
          docRef="PRD §7.6"
        />
        <div style={box}>
          <div style={placeholder}>[MONO EYEBROW · &quot;WRITING&quot;]</div>
          <div style={{ ...grayBlock("48px"), marginTop: "8px" }}>
            [SECTION HEADLINE · e.g. &quot;notes on product and building&quot;]
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...box, background: "#f8fafc" }}>
                <div
                  style={{
                    height: "140px",
                    background: "#0e1622",
                    border: "1px dashed #94a3b8",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f5ebd4",
                    fontSize: "11px",
                    fontStyle: "italic",
                  }}
                >
                  [PROCEDURAL THUMBNAIL · glyph by kind]
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    ...placeholder,
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                  }}
                >
                  [KIND · e.g. LEARNING]
                </div>
                <div style={{ ...grayBlock("36px"), marginTop: "6px" }}>
                  [ENTRY TITLE · 2 lines max · sans semibold]
                </div>
                <div
                  style={{
                    ...grayBlock("32px"),
                    marginTop: "6px",
                    fontSize: "11px",
                  }}
                >
                  [EXCERPT · 2 lines · muted]
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    ...placeholder,
                    fontSize: "11px",
                  }}
                >
                  [DATE · READ TIME · mono muted]
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              ...placeholder,
            }}
          >
            [view all →]
          </div>
          <div
            style={{
              marginTop: "16px",
              ...placeholder,
              fontSize: "11px",
            }}
          >
            Three cards, same grammar as the /writing index. If fewer than 3
            published entries exist, hide the fold. Full grid + filter chips
            live at /writing.
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FOLD 6 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={6}
          name="About + Stack"
          job="Person + Craft"
          question="Would I want to work with them, and what do they build with?"
          docRef="PRD §7.1"
        />
        <div style={box}>
          <div style={placeholder}>[MONO EYEBROW · &quot;ABOUT&quot;]</div>
          <div style={{ ...grayBlock("48px"), marginTop: "8px" }}>
            [SECTION HEADLINE · e.g. &quot;a bit about me&quot;]
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ ...grayBlock("240px"), flex: "0 0 240px" }}>
              [PORTRAIT · 240×240]
            </div>
            <div style={{ flex: 1, minWidth: "260px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    ...grayBlock("48px"),
                    marginBottom: "12px",
                    fontSize: "12px",
                  }}
                >
                  [ABOUT PARAGRAPH {i} · 2-3 sentences]
                </div>
              ))}
            </div>
          </div>

          {/* Stack row inside About */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "16px",
              borderTop: "1px dashed #94a3b8",
            }}
          >
            <div
              style={{
                ...placeholder,
                fontStyle: "italic",
                marginBottom: "10px",
              }}
            >
              my stack
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                alignItems: "center",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "#e2e8f0",
                    border: "1px dashed #94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: "#64748b",
                  }}
                >
                  [icon]
                </div>
              ))}
              <div style={{ ...placeholder, fontSize: "12px" }}>+ more</div>
            </div>
            <div
              style={{ ...placeholder, fontSize: "11px", marginTop: "12px" }}
            >
              Hover / focus → dark tooltip pill above the icon: tool name +
              one-liner &quot;how I use it.&quot; Content in lib/stack.ts. See
              PRD §7.1.
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────── FOLD 7 ─────────────────────────────── */}
      <section style={foldStyle}>
        <FoldHeader
          n={7}
          name="Let's connect"
          job="Action"
          question="Okay, how do I reach them?"
          docRef="PRD §7.2"
        />
        <div style={box}>
          <div style={placeholder}>
            [MONO EYEBROW · &quot;LET&apos;S CONNECT&quot;]
          </div>
          <div style={{ ...grayBlock("48px"), marginTop: "8px" }}>
            [SECTION HEADLINE · &quot;Let&apos;s connect.&quot;]
          </div>
          <div style={{ ...grayBlock("60px"), marginTop: "12px" }}>
            [DESCRIPTION · LinkedIn-bio-derived copy · PRD §7.2 TODO]
          </div>

          <div
            style={{
              marginTop: "24px",
              maxWidth: "480px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ ...grayBlock("40px") }}>[INPUT · email]</div>
            <div style={{ ...grayBlock("40px") }}>[INPUT · subject]</div>
            <div style={{ ...grayBlock("120px") }}>[TEXTAREA · message]</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ ...placeholder, fontSize: "11px" }}>
                (hidden honeypot field · anti-spam)
              </div>
              <div style={{ ...grayBlock("40px"), flex: "0 0 120px" }}>
                [SEND →]
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              ...placeholder,
              fontSize: "11px",
            }}
          >
            Success: inline confirmation replaces the form. Failure: inline
            error + fallback mailto link. Delivery: Resend (default per PRD
            §7.2).
          </div>
        </div>
      </section>

      {/* footer */}
      <footer
        style={{
          padding: "40px 24px",
          background: "#0f172a",
          color: "#f1f5f9",
          fontSize: "12px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div style={{ opacity: 0.7 }}>
          [FOOTER · © 2026 · mono initials · social links · minimal]
        </div>
        <div style={{ opacity: 0.5, marginTop: "8px" }}>
          End of skeleton. Real design lives in the palette experiments
          (/preview/ods, /preview/sky) and the coming-soon page (/).
        </div>
      </footer>
    </main>
  );
}
