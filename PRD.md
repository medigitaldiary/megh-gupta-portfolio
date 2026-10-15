# PRD — Megh Gupta Portfolio Site (v4)

Owner: Megh Gupta
Last updated: 2026-10-12
Branch of truth: `main` (deployed on Vercel)
Repo: `medigitaldiary/megh-gupta-portfolio`
Canonical domain: **`meghgupta.in`**
Current preview URLs: `/preview/v1` (all seven folds), `/preview/v2` (Hero · Experience · Work · About · Connect — Lab + Writing hidden while being finalised).

v4 is a state refresh, not a redesign. The storyboard, the design system, and the voice rules from v3 are locked. What changed: six case studies now carry real narratives, Lab + Writing folds shipped, Oswald + Satoshi replaced Instrument Serif + Inter, nav mirrors the full storyboard, and the shelf grew to six books.

---

## 0. What changed from v3 (reconciliation log)

Read this once, then delete it in v5. Keeps the diff visible so nothing feels like it vanished.

- **Fonts settled.** Instrument Serif → **Oswald** (display, variable woff2, self-hosted), Inter → **Satoshi** (body, variable woff2 + italic axis, self-hosted). Loaded via `next/font/local` from `/public/fonts/`. OG route additionally ships `Satoshi-Medium.ttf` because Satori (`next/og`) rejects WOFF2. CSS variables kept their semantic names (`--font-serif`, `--font-sans`) so no component consumer had to change.
- **All six case studies live.** `/content/work/<slug>.mdx` landed for all six: `product-led-seo-engine`, `ultra-web-platform`, `bond-bytes`, `deridata-integration`, `freshdesk-support-stack`, `moveinsync-independence-day`. `/work/[slug]` renders via `next-mdx-remote`, with a headline-metric strip at the top, prose body, and a stack-chip strip at the bottom. Routes without an MDX file still fall back to the coming-soon card.
- **Shelf: 5 → 6 books.** `getShelfWorkCards(6)` on `components/selected-work.tsx`, grid `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6`.
- **MoveInSync re-scoped.** Was scaffolded as "Pricing · Campaign" (an invented frame). Correct frame: "Analytics · Content" — an Independence Day traffic analysis fed into a CEO LinkedIn post.
- **Writing fold shipped.** `components/writing-section.tsx` + `lib/writing.ts`. Six-kind taxonomy stayed as locked in v3.
- **Nav mirrors the full storyboard.** Six pill entries (Experience · Work · Lab · Writing · About · Contact) instead of three. `/preview/v2` passes `hide={["lab","writing"]}` while those two folds get finalised; `/preview/v1` shows all six.
- **Nav polish.** Avatar removed from the left slot; LinkedIn in brand `#0A66C2`; collapse motion is 40px + 400ms cubic-bezier(0.22, 0.61, 0.36, 1) with rAF-throttled scroll handler, no outer-bar background transition. Active-tab `activeId` clears while `scrollY ≤ 80` so no tab is highlighted on the hero fold.
- **Design system doc.** Tokens live in `DESIGN_SYSTEM.md` at the repo root. §4 here keeps the fold-level rules; the token hexes and loader paths live there to avoid two sources of truth.
- **Discovery files refreshed.** `public/llms.txt`, `public/AGENTS.md`, `public/index.md` describe the full seven-fold site and the three employers.

---

## 1. What is this website

A single-page personal portfolio for **Megh Gupta**, Product Manager (fintech + AI tooling). Its one job is a **conversion funnel for an active job search**: move a skimming recruiter or hiring PM from "who is this" to "I want to talk" inside 60 seconds, and give a deeper reader enough to book a call.

**Primary audiences**

- Recruiters at VC-backed fintechs and AI-first startups.
- Hiring PMs and founders scouting an early / founding PM.
- Warm intros from LinkedIn / X / referrals who need a fast credibility check.

**Primary job of the site**

1. Prove Megh ships things with numbers attached (Experience + Selected Work).
2. Show he's technical enough to build without engineers (The Lab).
3. Give one obvious way to reach him (the Let's-connect fold).

**Non-goals (locked, still true)**

- Not a CMS-driven marketing site.
- Not multi-tenant, not internationalized.
- No dark mode. One quiet editorial system, one accent.
- No feature added because "the page felt short."

**Phased, planned (see §6):** per-case-study OG images, Lab + Writing finalisation, launch flip from coming-soon to full portfolio at `/`.

---

## 2. User journeys

### 2.1 The recruiter (60-second skim)

1. Lands on `/` from LinkedIn / email signature.
2. Hero establishes identity and promise (one line).
3. Experience shows the trajectory — three employers, roles, dates.
4. Shelf of six case studies, each carrying a headline number on hover.
5. Either books time via the Cal.com embed or saves the résumé.

Exit criteria: "I want to talk to this person."

### 2.2 The hiring PM (5-minute deep read)

1. Opens one case study (likely SEO engine, Bond Bytes, or DERIDATA).
2. Reads TL;DR, scans for the metric, reads the Approach paragraph.
3. Decides whether the person thinks in trade-offs or in activity logs.
4. Scrolls back to the shelf, picks a second case study to triangulate.
5. Clicks LinkedIn or books time.

### 2.3 The warm intro (name-drop check)

Someone from LinkedIn / X / an inbox referral opens the site to confirm Megh is for real before replying.

- First-screen checks: real name, real company, specific numbers.
- JSON-LD graph in `<head>` means Claude / Perplexity / ChatGPT also get a clean read.

### 2.4 The mobile scroller (~60% of traffic)

Every fold reflows to a single column. Nav collapses to a hamburger. Shelf stacks. OG card renders cleanly in LinkedIn / Slack previews via the `/opengraph-image` route.

### 2.5 Journeys not yet supported (see §6)

- Reading long-form writing (Writing fold ships cards, no per-entry route yet).
- Browsing the Lab's github-project or personal-tool kinds in isolation (hover-only on the workbench today).

---

## 3. Messaging, copy, content

The homepage is seven viewport-height folds. Each fold has one job, pinned in a code comment above its `<section>`.

### 3.1 Hero (Fold 1)

- **Eyebrow (mono, uppercase):** `Megh Gupta · Product Manager`
- **Headline (Oswald display):**
  > I turn ideas into features,
  > features into products,
  > products into systems.
- **Intro (Satoshi body, muted):**
  > I'm a product manager at BondScanner, a SEBI-registered online bond platform, making bond investing as simple as it should be. BITS Goa grad, a couple of years into fintech, and lately I've been building with voice AI and agentic systems.
- **One primary CTA:** `Let's connect →` smooth-scrolls to `#connect`. No second button; LinkedIn / résumé live inside the Let's-connect fold.
- **Visual anchor:** 2-column grid with a Product Venn (user × tech × business) on the right.

### 3.2 Experience (Fold 2) — full spec §7.3

Three cards: BondScanner (current) · Ultra · MoveInSync. Each card carries role, dates, one-line summary, and a tooltip with the longer narrative. Timeline-with-toggle view optional, deferred until it earns its weight.

### 3.3 Selected Work (Fold 3) — the shelf

- Six leaning books on a shelf, alternating leans.
- Each book carries: spine color, eyebrow (category · subcategory), title, one-liner, role + company + timeline.
- Hover: book straightens, cover opens, headline metric appears.
- Click → `/work/<slug>` renders the full case study from `/content/work/<slug>.mdx` via `next-mdx-remote`.
- Six slugs: `product-led-seo-engine`, `ultra-web-platform`, `bond-bytes`, `deridata-integration`, `freshdesk-support-stack`, `moveinsync-independence-day`.

### 3.4 The Lab (Fold 4) — full spec §7.4

A full-width Rick & Morty-themed workbench scene. On the workbench: a real WebGL portal (pizza3 shader port), skill files (CRT), flasks for side-quest projects (hover for chemistry smoke tooltips), and a GitHub soft-board with the last 26 weeks of contributions.

### 3.5 Writing (Fold 5) — full spec §7.5

A grid of writing cards. Each card has a kind badge (field-note / learning / take / idea / mini-case / teardown), title, excerpt, date, reading time. The index is browse-only today; per-entry routes come later.

### 3.6 About + Stack (Fold 6) — full spec §7.6

Personal context + the tools Megh works in daily (icon row, not a card grid). Convocation photo on one side, prose + stack on the other.

### 3.7 Let's connect (Fold 7) — full spec §7.7

Primary surface: an embedded Cal.com widget for booking time. Supporting rails: email (as selectable text, not just a mailto), LinkedIn in brand blue, résumé PDF button.

### 3.8 Footer

Compact. Three columns: Mentions / Resources / Site; a monoline attribution row ("Megh Gupta · 2026 · built in public").

---

## 4. Design style

The locked token values live in `DESIGN_SYSTEM.md`. This section keeps the design *rules* that bind this site specifically.

### 4.1 Color

One accent — bond-paper green `--accent` `#1F4D3A`. Everything else is neutrals. Two sub-palettes are allowed, each scoped to one component: the Product Venn hues (hero), and the Rick & Morty green/amber system (Lab). Nothing else introduces a new color without a locked decision.

### 4.2 Type

- **Oswald** — display, all H1 / H2, headline metrics. Variable woff2, self-hosted.
- **Satoshi** — body, nav, buttons, sub-heads. Variable woff2 (upright + italic), self-hosted.
- **JetBrains Mono** — eyebrows, stack tags, work-card category tags.

Type scale (tokens in `globals.css`): display 64 / h1 40 / h2 28 / h3 20 / body 16 / small 14. Body line-height 1.6, headlines 1.05–1.2.

### 4.3 Spacing & layout

Tailwind defaults. Section padding `py-24 md:py-32`, horizontal `px-6 md:px-8`. Max-widths: `max-w-5xl` on home sections, `max-w-6xl` on nav, `max-w-2xl` on case-study prose. Nav height `h-16 md:h-[72px]`. `scroll-margin-top: 80px` on every section so hash anchors clear the nav.

### 4.4 Motion (sparing)

- Allowed: hover color shifts (150ms ease-out), fade-up on scroll, nav collapse (40px / 400ms cubic-bezier(0.22, 0.61, 0.36, 1)), scoped Lab animations (bubbles, bulb flicker, portal swirl).
- Everything respects `prefers-reduced-motion: reduce`.
- Not allowed without explicit ask: parallax, scroll-jacking, cursor glow, animated gradients, animated `backdrop-filter` toggles.

### 4.5 Component patterns

See `DESIGN_SYSTEM.md §5` for the real class strings. Highlights:

- Primary CTA: `rounded-full bg-accent px-5 py-2.5 text-sm text-accent-fg hover:opacity-90`.
- Secondary icon chip: `rounded-full border border-border bg-bg-elevated`; LinkedIn is the one brand-colored exception (`text-[#0A66C2]`).
- Card: `rounded-xl border border-border bg-bg-elevated p-6 md:p-8`.
- Nav pill: `rounded-full border border-border bg-bg-elevated p-1`; outer bar always transparent.

---

## 5. Functional requirements

### 5.1 Pages & routes

| Route | Status | Purpose |
|---|---|---|
| `/` | Live — coming-soon page | Flips to the full portfolio on launch (`components/coming-soon.tsx` → `/preview/v1`'s layout). |
| `/preview/v1` | Live, `noindex` | Full seven-fold portfolio for ongoing review. |
| `/preview/v2` | Live, `noindex` | Five folds (Lab + Writing hidden) for focused review while those two get finalised. |
| `/work/[slug]` | Live, `index` on routes with an MDX body | Case study pages. Six routes generated from `/content/work/*.mdx`. |
| `/opengraph-image` | Live | Dynamic OG card for `/` (Oswald + Satoshi, bond-paper green). |
| `/sitemap.xml`, `/robots.txt` | Live | Standard. |

Deferred: `/lab`, `/lab/[slug]`, `/writing`, `/writing/[slug]`, `/api/og/[slug]`.

### 5.2 Navigation & interaction

- Nav mirrors the storyboard order (CLAUDE.md §14). Full pill: Experience · Work · Lab · Writing · About · Contact.
- Nav accepts a `hide: string[]` prop so preview routes can slim the pill without a second component.
- On scroll past 80px, the left (wordmark) and right (LinkedIn + résumé) sections collapse via a 40px slide + fade (400ms, cubic-bezier(0.22, 0.61, 0.36, 1)). Pill stays anchored. Hover re-expands.
- Active-tab highlight clears while `scrollY ≤ 80` so no tab is active on the hero fold.
- Outer bar is always transparent; the pill carries its own border + fill.
- Mobile: hamburger menu, full-height overlay.

### 5.3 Content model

- **Case studies:** MDX files in `/content/work/`. Frontmatter schema in CLAUDE.md §5. Loader in `lib/case-study.ts` (parses via `gray-matter`, body rendered via `next-mdx-remote`).
- **Experience:** inline data array in `lib/experience.ts`.
- **Work shelf cards:** inline data array in `lib/work.ts` (title, eyebrow, oneLiner, spineColor, leanDeg, featured, order). MoveInSync is `featured: true` as of v4.
- **Writing entries:** inline data array in `lib/writing.ts`.
- **Lab entries:** three kinds hard-coded in `components/lab-scene.tsx` (skill files on CRT, flasks for side-quest, github grid on softboard).

### 5.4 Contact

- Primary: Cal.com embed via `@calcom/embed-react` inside the Let's-connect fold.
- Supporting: email as selectable text (`megh.bpgc@gmail.com`), LinkedIn, résumé PDF.
- No form submission. The brand email `hi@meghgupta.in` is still an open item (see §6).

### 5.5 Analytics & SEO

- `@vercel/analytics` + `@vercel/speed-insights` wired in root layout.
- Full head spec in CLAUDE.md §15 and §8 below. Case study pages extend the baseline JSON-LD with `Article` nodes.

### 5.6 Performance

- Fonts self-hosted, variable WOFF2, `display: swap`.
- Images via `next/image` (AVIF/WebP, `alt` required).
- Heavy components (Lab shader) lazy-loaded via `next/dynamic` with `ssr: false`.
- Lighthouse gates: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on the homepage. Case study pages: ≥ 90 on all four.

### 5.7 Deployment

- Vercel, auto-deploy from `main`. Previews from `dev` and feature branches.
- Branch protection on `main` — merge-via-PR only. Feature branches merge into `dev` first; `dev` → `main` is the launch flip.

---

## 6. What is pending

### 6.1 Blockers before public launch flip (coming-soon → full portfolio)

- **Visual QA on prod at 1440 and 375.** Font swap + 6-book shelf + nav polish all compound; eye on real devices before the launch flip.
- **Figma design system — install Satoshi locally.** The `portfolio/h3`, `portfolio/body`, `portfolio/small` text styles in Figma file `AJ64jdtTSo68rHp2yBE7iv` are still on Inter because Satoshi isn't in the Figma font library. One-time install on the desktop app unblocks the final 3 styles.

### 6.2 High-value, not yet built

- **`/api/og/[slug]`** — per-case-study OG cards. Case study bodies now exist, so this is unblocked.
- **Lab + Writing finalisation.** Both hidden on `/preview/v2` while they get polish (user flagged them as distracting mid-review). Finalisation covers both visual edge cases and copy.
- **Explicit Experience timeline view with toggle.** Currently cards; the timeline alternate is specced in §7.3 but not shipped.

### 6.3 Copy still placeholder

- MoveInSync case study carries `TODO:` markers inside the MDX for a confirmed engagement number on the LinkedIn post, a screenshot link, and whether any PMM collateral shipped beyond the post.
- Four other case studies carry smaller `TODO:` lines for screenshot links / Loom URLs / Figma frames — invisible to readers (MDX comments) but visible in the source.

### 6.4 Explicitly deferred (do NOT build without asking)

- `/lab` and `/writing` indexes with per-entry routes.
- Dark mode variant.
- A real contact form (mailto fallback is enough; Cal.com embed covers scheduled time).
- A CMS. MDX in the repo IS the CMS at this scale.

### 6.5 Quality gates before "done" on launch

- `pnpm build` clean.
- `pnpm exec biome check` clean on touched files.
- Lighthouse per §5.6 on the homepage + two sampled case studies.
- View-source on `/` and `/work/<slug>` contains: `canonical`, `og:type`, `og:image`, `twitter:card`, JSON-LD `@graph`, discovery block.
- Google Rich Results Test renders `Person` and `Article` cards.
- LinkedIn Post Inspector renders the OG card cleanly.

---

## 7. Section specs (in fold order)

### 7.0 Fold-by-fold storyboard

| Fold | Job | Question it answers | Status |
|---|---|---|---|
| 1 · Hero | Hook | "Who is this and why should I keep scrolling?" | Shipped |
| 2 · Experience | Trajectory | "Where has this person been?" | Shipped |
| 3 · Selected Work | Proof | "What have they actually shipped, with numbers?" | Shipped; 6 case studies live |
| 4 · The Lab | Range | "Do they build outside their day job?" | Shipped; hidden on v2 for finalisation |
| 5 · Writing | Thought | "How do they think about product?" | Shipped; hidden on v2 for finalisation |
| 6 · About + Stack | Person + Craft | "Would I want to work with them, and what do they build with?" | Shipped |
| 7 · Let's connect | Action | "Okay, how do I reach them?" | Shipped |

Nav mirrors this exact order. Mobile stacks the same sequence into one column; order never reorders by breakpoint.

### 7.1 Hero (Fold 1)

- 2-column grid: left column carries eyebrow + headline + intro + Product Venn label; right column renders the Product Venn.
- Product Venn uses its scoped sub-palette (`--venn-user` / `--venn-tech` / `--venn-biz` / `--venn-cream`).
- One primary CTA (`Let's connect →` → `#connect`). No LinkedIn / résumé here — they live in Fold 7.
- Mobile: Venn drops below the text block, same copy.

### 7.2 Experience (Fold 2)

- Three employer cards: BondScanner (current, Growth / Platform PM), Ultra (Platform PM), MoveInSync (Product Intern).
- Each card: logo, company, role, dates, one-liner summary, 2–3 narrative bullets revealed on expand.
- Deferred: timeline view with Current / Full-time / All toggle (specced in v3 §7.3, not yet shipped).
- Data lives in `lib/experience.ts`.

### 7.3 Selected Work (Fold 3)

- Shelf of 6 leaning books on a horizontal shelf (hairline + 2px rounded strip).
- Grid: `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6`, `lg:gap-2`.
- Book spine carries: title, eyebrow (category · subcategory), lean angle, spine color.
- Hover: book straightens, cover flips open, headline metric fades in from frontmatter.
- Click → `/work/<slug>`.
- Six case studies live:
  - `product-led-seo-engine` — Growth · SEO · 2026 · ~2x daily organic clicks in 3 months
  - `ultra-web-platform` — Platform · 0→1 · 2025 · 15–20% True AUM growth from web, Q3 2025
  - `bond-bytes` — Content · Retention · 2026 · 3.5x MoM reach growth
  - `deridata-integration` — Data · Integrations · 2026 · 80% of deal creation fields auto-populated
  - `freshdesk-support-stack` — Ops · Support · 2025 · 40% reduction in manual support effort
  - `moveinsync-independence-day` — Analytics · Content · 2024 · 17.4% faster BLR traffic on Aug 15 vs 3-month baseline

### 7.4 The Lab (Fold 4)

Full-width, bleeds to the edges. Rick & Morty workbench scene composed in SVG + a WebGL portal canvas.

- **Portal (center).** Three.js + custom fragment shader (pizza3 port). Fallback: CSS conic-gradient until the shader boots. `prefers-reduced-motion` pauses the animation loop.
- **Skill files (CRT, left).** Hover on each file reveals a tooltip with a one-line description of the skill.
- **Flasks (right).** Three side-quest projects. Hover reveals a tooltip in chemistry framing and animates smoke rising from the flask.
- **GitHub softboard (back).** Last 26 weeks of contribution grid, pseudo-random intensities. Legend: "GitHub · last 26 weeks."
- **Stack row (below).** Mono-cased list — Claude · Cursor · Figma · Notion · GitHub · Linear · Vercel · Slack. This is the Stack surface; it does not render as a card grid.

Status: shipped, hidden on `/preview/v2` while being finalised.

### 7.5 Writing (Fold 5)

- Grid of writing cards, 3-across on desktop, 1 on mobile.
- Each card: kind badge, title, excerpt (≤140 chars), date, reading time, tags.
- Six kinds locked: field-note, learning, take, idea, mini-case, teardown.
- Filter row above the grid; the index is browse-only today, no per-entry routes.
- Thumbnails rendered by `components/writing/thumbnail.tsx` from entry kind + accent.

Status: shipped, hidden on `/preview/v2` while being finalised.

### 7.6 About + Stack (Fold 6)

- 2-column layout: convocation photo (zoomed, less sky) + personal prose.
- Prose: 2–3 short paragraphs; voice per §10.
- Stack row inside the fold: icon row of the tools Megh actually works in daily. Not a card grid.
- Mobile: photo above prose, stack row below.

### 7.7 Let's connect (Fold 7)

- Primary surface: embedded Cal.com widget via `@calcom/embed-react`.
- Supporting rails below the embed:
  - Email as selectable text with a copy button.
  - LinkedIn chip (brand `#0A66C2`).
  - Résumé PDF button.
- No form. No "send message" field.
- Section id: `#connect` (the Hero CTA scrolls here).

---

## 8. SEO & head-tag spec

Full baseline in CLAUDE.md §15. Summary:

- Shared `TITLE` / `DESCRIPTION` on `/`; child pages override via `metadata.title.template = "%s | Megh Gupta"`.
- Canonical URL on every page, absolute.
- `robots: index, follow`, `max-image-preview: large`, `googleBot` directives.
- OpenGraph: `type: profile` on `/`, `type: article` on `/work/[slug]`, `type: website` elsewhere.
- Twitter: `summary_large_image`.
- JSON-LD `@graph`: `Person` + `WebSite` + `ProfilePage` on `/`; `Article` extension on case study pages.
- Discovery block in `<head>`: `rel="alternate" type="text/markdown"` for per-page `.md`, `rel="help"` for `/llms.txt` and `/AGENTS.md`, `rel="sitemap"` for `/sitemap.xml`.
- `theme-color: #FAFAF7`.
- Favicon: `app/icon.svg`.

Per-page type overrides (case study specific):

- `openGraph.type: "article"`.
- Per-case-study OG image (deferred to `/api/og/[slug]`).
- `Article` + `Person(author)` JSON-LD extension.
- `.md` alternate reachable at `/work/<slug>.md` (generated from MDX at build — deferred).

---

## 9. MDX case-study system (live)

- Files live in `/content/work/<slug>.mdx`.
- Loader: `lib/case-study.ts` → `getCaseStudy(slug)` reads the file, parses frontmatter via `gray-matter`, returns `{ frontmatter, body }`.
- Renderer: `app/work/[slug]/page.tsx` uses `MDXRemote` from `next-mdx-remote/rsc`. Routes without a corresponding MDX file fall back to the coming-soon card.
- Frontmatter schema and body section structure in CLAUDE.md §5.
- Supported body shapes today: standard markdown (headings, paragraphs, lists, bold, links). Custom MDX components (`Metric`, `Figure`, `Callout`, `LoomEmbed`, `FigmaEmbed`) are planned per CLAUDE.md but not yet wired — introduce them the first time a case study body actually needs one.

---

## 10. Voice rules (content language — locked)

Any copy generated for the site matches this voice. Case studies get it strictly. Component copy and nav labels too.

- **Specific over vague.** "₹50Cr AUM in 3 months" not "significant growth."
- **Active verbs.** "Shipped," "designed," "scoped." Not "was responsible for."
- **Honest attribution.** "Contributed to" is fine. Don't claim team work as solo.
- **Short sentences.** Average 15 words. Split anything over 25.
- **No filler.** Cut "in order to," "it is important to note," "leverage," "synergy," "passionate."
- **One idea per paragraph.** No walls of text.
- **Numbers earn their place.** Every number should change what the reader believes.
- **No AI tells.** No em-dash asides, no "not X but Y" framing, no "worth noting."

If something you drafted might miss the voice, mark it `[draft — please review tone]` so Megh knows to check.

---

## Appendix A — Let's-connect delivery options (settled)

v3 left this as an open decision. v4 settles: Cal.com embed is the primary surface, with email + LinkedIn + résumé as supporting rails. No custom form, no third-party scheduling SaaS beyond Cal. Revisit only if Cal.com's embed stops meeting the brief.

---

## Appendix B — file map (as of today)

```
app/
  layout.tsx              # root metadata, fonts (Oswald + Satoshi via localFont), analytics
  page.tsx                # coming-soon on prod; flips to /preview/v1 layout on launch
  globals.css             # color tokens, type scale, scoped Lab animations
  opengraph-image.tsx     # dynamic OG card (Oswald + Satoshi)
  icon.svg                # favicon
  work/
    [slug]/page.tsx       # MDX-rendered case study
  preview/
    v1/page.tsx           # full 7-fold portfolio (ongoing review)
    v2/page.tsx           # 5-fold portfolio (Lab + Writing hidden)

components/
  nav.tsx                 # pill nav with hide prop, rAF-throttled scroll
  hero.tsx                # Fold 1 — 2-col with Product Venn
  product-venn.tsx        # Hero visual anchor
  experience.tsx          # Fold 2
  selected-work.tsx       # Fold 3 — 6-book shelf
  work-card.tsx           # Shelf book
  lab-section.tsx         # Fold 4 wrapper
  lab-scene.tsx           # Workbench scene (CRT, flasks, GitHub softboard)
  lab-portal.tsx          # WebGL portal shader
  writing-section.tsx     # Fold 5
  writing/thumbnail.tsx   # Writing card art
  about-stack.tsx         # Fold 6
  contact.tsx             # Fold 7 — Cal.com embed
  cal-embed.tsx           # @calcom/embed-react wrapper
  site-footer.tsx         # Shahroz-style footer
  coming-soon.tsx         # Legacy / toggle-back

content/
  work/
    product-led-seo-engine.mdx
    ultra-web-platform.mdx
    bond-bytes.mdx
    deridata-integration.mdx
    freshdesk-support-stack.mdx
    moveinsync-independence-day.mdx

lib/
  case-study.ts           # MDX loader + frontmatter parser
  work.ts                 # Shelf card data
  experience.ts           # Experience fold data
  writing.ts              # Writing fold data
  lab.ts                  # Lab helpers
  paper-art.ts            # Canvas certificate art (Oswald)

public/
  fonts/                  # Oswald-Variable.woff2, Satoshi-Variable.woff2, Satoshi-VariableItalic.woff2, Satoshi-Medium.ttf
  images/work/            # Case study hero images (placeholders today)
  llms.txt, AGENTS.md, index.md  # Discovery files
  resume.pdf

CLAUDE.md                 # Rules — read fully on every session
PRD.md                    # This file
DESIGN_SYSTEM.md          # Token source of truth
Portfolio_Brief.md        # Original brief (archive)
Skeleton_PRD.md           # Early skeleton (archive)
OPEN_ITEMS.md             # Rolling open items
```

End of file.
