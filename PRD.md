# PRD — Megh Gupta Portfolio Site (v3, reconciled)

Owner: Megh Gupta
Last updated: 2026-09-22
Branch of truth: `main` (deployed on Vercel)
Repo: `medigitaldiary/megh-gupta-portfolio`
Canonical domain: **`meghgupta.in`** (see §0 changelog — `.com` fully retired)

This version reconciles v2. v2 had grown three different fold orders, two Stack specs, three Contact specs, two Lab specs, and a domain that flipped between `.com` and `.in`. Nothing substantive was cut. Where two specs described the same thing, the newer/locked one won, per the markers already in v2. Copy strings were rewritten to the voice rules in §10.

---

## 0. What changed from v2 (reconciliation log)

Read this once, then delete it in v4. It exists so nothing looks like it vanished by accident.

- **Domain settled: `meghgupta.in` only.** Every `meghgupta.com` reference (§3.5 email, §5.8 deploy, old SEO strings) is now `.in`. Canonical is `https://www.meghgupta.in`. Branded email is now `hi@meghgupta.in` — *open item: confirm that mailbox actually exists, else fall back to `megh.bpgc@gmail.com` everywhere.*
- **One fold order, locked (§7).** v2 disagreed with itself across §7.1, §7.4, §7.6, §7.7, §7.8. The reconciled order is: Hero → Experience → Selected Work → The Lab → Writing → About (Stack lives inside it) → Let's connect. That's 7 folds, which matches §7.1's "8 → 7" note. This also resolves the "Lab is Fold 3 vs Fold 4" clash — with Experience as Fold 2, the Lab is Fold 4.
- **Stack de-duplicated.** The card-grid spec (old §7.1a) is deleted. The icon-row-inside-About spec is the only one left (§7.6 here).
- **Contact de-duplicated.** The "no form" rule is gone. "Let's connect" (form) is the spec; the mailto is now only the fallback. The embed-vs-custom options survive as a decision appendix (§A). Heading is "Let's connect." everywhere ("Let's talk." retired).
- **Lab de-duplicated.** The three-kind taxonomy (skill-file / personal-tool / github-project) is the spec. The old stack-chip-only card is retired. *Open item flagged in §7.4 — whether the Lab should instead hold hostable, try-it tools; not decided, so v2's taxonomy stands for now.*
- **Non-goals rewritten (§1).** v2 locked "not a blog" and "not multi-page" while §7 fully specced a blog and four routes. The non-goals now say what's actually still true, and phasing moved to §6.
- **Hero CTA settled.** One primary CTA, "Let's connect →", scrolling to `#connect`. The old second CTA is gone.
- **Current live state settled.** The single-page homepage (Hero + Work + Lab + About + Contact) is what's live. `coming-soon.tsx` is legacy; its intro copy moved into the Hero spec.
- **Writing filter labels fixed** to match the six locked kinds.

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

**Non-goals (locked, still true after v3)**

- Not a CMS-driven marketing site.
- Not multi-tenant, not internationalized.
- No dark mode. The site stays one quiet editorial system, one accent.
- No feature added because "the page felt short."

**Phased, not v1 (moved here from the old non-goals — these are planned, just later; see §6):** case-study detail pages, the Writing surface, `/lab` and `/writing` indexes, the Experience timeline view. The homepage ships first; routes follow.

---

## 2. User journeys

### 2.1 The recruiter (60-second skim)

1. Lands on `/` from LinkedIn / email signature.
2. Reads the hero: name, one-line identity, the intro, one CTA.
3. Skims Experience for trajectory, then Selected Work for the headline metric on each card ("2×", "+15pp", "2 months", "5.2 → 6.0").
4. Clicks `Let's connect →`.

**Success:** a message or email reaches Megh within 60 seconds of first load.

### 2.2 The hiring PM (5-minute deep read)

1. Reads the hero, scans Experience.
2. Reads all Work cards in full — role, timeline, description, metric.
3. Scrolls The Lab to gauge technical range, reads a Writing entry or two.
4. Reads About (and the Stack row inside it), then hits Let's connect.

**Success:** a first-round conversation booked.

### 2.3 The warm intro (name-drop check)

Lands, confirms it looks credible (design, real numbers, real logos — BondScanner, Ultra), forwards it on. **Success:** the site doesn't embarrass the intro.

### 2.4 The mobile scroller (~60% of traffic)

Same as above on a phone. Nav collapses to a hamburger, folds stack, cards go single-column, no horizontal scroll at 375px.

### 2.5 Journeys not yet supported (see §6)

- Deep-dive on a specific case study (`/work/[slug]` not built).
- Reading the archive (`/writing` not built).
- Booking a call (no Calendly/Cal.com wired — decision open, §A).

---

## 3. Messaging, copy, content

Voice guide in §10. Specific over vague, active verbs, honest attribution, short sentences, numbers as evidence. No "passionate about," no "leverage."

### 3.1 Hero (Fold 1)

- **Eyebrow (mono, uppercase):** `Megh Gupta · Product Manager`
- **Headline (Instrument Serif, ~72px desktop):**
  > I turn ideas into features,
  > features into products,
  > products into systems.
- **Intro (Inter, muted):**
  > I'm a product manager at BondScanner, a SEBI-registered online bond platform, making bond investing as simple as it should be. BITS Goa grad, a couple of years into fintech, and lately I've been building with voice AI and agentic systems.
- **CTA (one only):** `Let's connect →` — smooth-scrolls to `#connect`. No second button. LinkedIn / résumé live inside the Let's-connect fold, not the hero; the hero pulls the reader down the page, not off it.

### 3.2 Experience (Fold 2) — full spec §7.3

Section eyebrow: `EXPERIENCE`. Heading: `Where I've been.`

### 3.3 Selected Work (Fold 3)

Section eyebrow: `SELECTED WORK`. Heading: `What I've shipped, with numbers.`

Four cards, in order:

| # | Title | Headline metric | Role · Timeline |
|---|---|---|---|
| 1 | How I 2×'d organic traffic at BondScanner in 3 months | **2×** daily organic clicks in 3 months | Growth PM · Jan 2026 – Q2 2026 |
| 2 | AI call analysis pipeline for BondScanner's RM team | **5.2 → 6.0** call quality score in 30 days | PM · Mar 2026 – present |
| 3 | Lifting payout-to-reinvestment from 55% to 70% at Ultra | **+15pp** retention lift in 30 days | Platform PM · Jun 2025 – Jul 2025 |
| 4 | Founding PM: BondScanner 0→1 | **2 months** sign-up to launch, regulated platform | Founding PM · Nov 2025 – present |

Every card: tag row (Growth / SEO / Fintech / AI Tooling / Ops / Platform / 0→1 / Founding PM), one-paragraph description, headline metric (serif, accent green), role + timeline meta strip. Cards link to `/work/[slug]` once those exist; until then, to a deck / Notion / Loom (no `#`).

### 3.4 The Lab (Fold 4) — full spec §7.4

Section eyebrow: `THE LAB`. Heading: `Things I built when a tool didn't exist or moved too slow.`

### 3.5 Writing (Fold 5) — full spec §7.5

Section eyebrow: `WRITING`. Heading: `Notes on product and building.`

### 3.6 About + Stack (Fold 6) — full spec §7.6

Section eyebrow: `ABOUT`. Heading: `A bit about me.` The Stack icon row lives at the bottom of this fold. About's job is now Person + Craft.

### 3.7 Let's connect (Fold 7) — full spec §7.7

Full-bleed accent-green section. Heading: `Let's connect.` A short form (or a hosted embed, §A) plus the socials row (LinkedIn · X · GitHub · Read.cv) and `hi@meghgupta.in` as the visible fallback.

### 3.8 Footer

`© 2026 Megh Gupta · Built with Claude Code · Source` (Source → GitHub repo).

---

## 4. Design style

Editorial, quiet, numbers-forward. Reference vibe: kashwiaggarwal.com.

### 4.1 Color (locked — one accent only)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FAFAF7` | Page background (off-white) |
| `--bg-elevated` | `#FFFFFF` | Cards, Lab section background |
| `--fg` | `#111111` | Primary text, headlines |
| `--fg-muted` | `#555555` | Body copy, secondary text |
| `--fg-subtle` | `#999999` | Meta strip, eyebrows, captions |
| `--border` | `#E8E6E0` | Hairlines, card outlines |
| `--accent` | `#1F4D3A` | Bond-paper green — headline metric, primary button, Contact bg |
| `--accent-fg` | `#FAFAF7` | Text on accent backgrounds |

### 4.2 Type

- **Instrument Serif** — display, all H1/H2, headline metrics.
- **Inter** — body, nav, buttons, sub-heads.
- **JetBrains Mono** — eyebrows, stack tags, work-card category tags.

Type scale (Tailwind tokens): display 64 / h1 40 / h2 28 / h3 20 / body 16 / small 14. Body line-height 1.6, headlines 1.05–1.2.

### 4.3 Spacing & layout

- Section padding `py-24 md:py-32`; Let's-connect bigger (`py-32 md:py-48`) as the closing beat.
- Content width `max-w-5xl` centered.
- Work grid 1→2 col. Lab grid 1→2→3 col. Card padding `p-6 md:p-8`, `rounded-xl`.

### 4.4 Motion (sparing)

- 150ms ease-out hover on cards, links, buttons.
- Work card hover: slight translate-up + border → accent.
- Smooth in-page scroll, disabled under `prefers-reduced-motion`.
- **No** parallax, scroll-jacking, cursor effects, page transitions, Framer Motion.

### 4.5 Component patterns

- **Nav:** sticky, translucent white + backdrop blur; borderless at top, hairline after 80px; hamburger + full-screen menu on mobile.
- **Work card:** tag pills · title · metric (serif, green) · description · meta strip.
- **Lab card:** kind badge · title · description · mono stack chips · outbound arrow.
- **CTA hierarchy:** primary = filled accent green; secondary = outline → accent on hover.

---

## 5. Functional requirements

### 5.1 Pages & routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Shipped | Hero + Work + Lab + About + Contact, single page (live state) |
| `/work/[slug]` | ❌ Not built | §6.2 |
| `/lab` | ❌ Not built | §7.4 index |
| `/writing`, `/writing/[slug]` | ❌ Not built | §7.5 |
| `/about` | ❌ Optional | Only if split from the homepage fold |
| `/api/og/[slug]` | ❌ Not built | Per-entry OG images |
| `sitemap.xml`, `robots.txt`, favicon, site OG image | ✅ Shipped | via `app/*` |

### 5.2 Navigation & interaction

- Sticky nav, smooth-scroll anchors (Experience / Work / Lab / Writing / About / Connect) + `Let's connect →`.
- Mobile menu: hamburger → full-screen overlay, body-scroll lock, closes on Esc or tap.
- Visible focus ring on every focusable element. External links `target="_blank" rel="noopener noreferrer"`.

### 5.3 Content model

- Work: `lib/work.ts` (`WorkCard[]`). Lab: `lib/lab.ts` (`LabEntry[]`, §7.4 schema). Experience: `lib/experience.ts` (§7.3). Stack: `lib/stack.ts` (§7.6). Writing: MDX in `/content/writing/` (§7.5).

### 5.4 Contact

- Branded email `hi@meghgupta.in` (confirm mailbox — §0), real fallback `megh.bpgc@gmail.com`.
- The Let's-connect fold is the primary surface (form or embed, §A). Mailto stays as fallback until that ships.

### 5.5 Analytics & SEO

- Vercel Analytics + Speed Insights (verify mounted in `app/layout.tsx` — §6.1).
- Per-page `metadata`. Sitemap + robots + OG shipped. JSON-LD baseline per §8.

### 5.6 Accessibility

- Semantic landmarks, keyboard-navigable throughout, `alt` on all images, `prefers-reduced-motion` respected. Target Lighthouse ≥ 95 on all four categories.

### 5.7 Performance

- Next.js 15 App Router, server components by default; client islands only where interaction needs them (nav, experience toggle, any Lab/Stack interactivity). Fonts via `next/font` `display: swap`. `next/image`. No third-party scripts beyond Vercel + any chosen form embed.

### 5.8 Deployment

- GitHub `main` → Vercel auto-deploy, preview per PR.
- Custom domain: **`meghgupta.in`** (confirm DNS live on Vercel; update any lingering string that isn't `.in`).

---

## 6. What is pending

### 6.1 Blockers before public launch

- [ ] Real social URLs in the Let's-connect fold (LinkedIn / X / GitHub / Read.cv are `#`).
- [ ] Real external URLs on Work cards (every `↗` is `#` — deck / PRD / dashboard / Loom, or the detail pages in §6.2).
- [ ] `meghgupta.in` live on Vercel; confirm `hi@meghgupta.in` mailbox or switch to gmail everywhere.
- [ ] Verify `@vercel/analytics` + `@vercel/speed-insights` are actually mounted.

### 6.2 High-value, not yet built

- [ ] Case-study detail pages (`/work/[slug]`) + the MDX pipeline (§8).
- [ ] Real screenshots / artifacts per case study (currently only the About portrait).
- [ ] Per-entry OG images (`/api/og/[slug]`).
- [ ] Lab links out — every entry needs a real `url` (§7.4).

### 6.3 Copy still placeholder

- [ ] About prose (real copy, structure locked in §7.6).
- [ ] Lab entries `job-search-os`, `interview-prep-system` flagged placeholder.
- [ ] Experience bullets — `TODO:` stubs in the seed data (§7.3).

### 6.4 Explicitly deferred (do NOT build without asking)

- ❌ Dark mode.
- ❌ CMS.
- ❌ On-site search (revisit only past ~15–20 entries in a surface).
- ❌ Heavy animation / Framer Motion.
- ❌ Testimonials, newsletter signup, "logos I've worked with" strip, stat-tile rows.

### 6.5 Quality gates before "done"

- [ ] `pnpm build` clean · `pnpm check` (Biome) clean.
- [ ] Lighthouse ≥ 95 on all four categories on `/`.
- [ ] Renders at 375 / 768 / 1440, no horizontal scroll at 375.
- [ ] No console errors in dev.
- [ ] No hardcoded hex outside `globals.css`.
- [ ] No hardcoded URL on any domain other than `meghgupta.in`.

---

## 7. Section specs (in fold order)

**Locked fold order (single source of truth):**

1. Hero
2. Experience
3. Selected Work
4. The Lab
5. Writing
6. About (Stack icon row lives inside this fold)
7. Let's connect

The whole homepage reads as one scroll story, not a stack of tiles. Every fold has a job, answers one question, and hands off to the next with a hook.

### 7.0 Fold-by-fold storyboard

| Fold | Section | Job | Question it answers | Lead-out hook |
|---|---|---|---|---|
| 1 | Hero | Stop the skim in 3 seconds | Who is this, why keep scrolling? | Ends on "building with voice AI / agentic systems" → sets up the work |
| 2 | Experience | Trajectory | Where has this person been? | Current role promises "here's what I built there" |
| 3 | Selected Work | Proof | What have they shipped, with numbers? | "there's more to how I build" → Lab |
| 4 | The Lab | Range | Do they build outside the day job? | "and here's how I think" → Writing |
| 5 | Writing | Thinking | How do they think about product? | "who's behind all this" → About |
| 6 | About + Stack | Person + craft | Would I want to work with them, and what do they build with? | "here's how to reach me" → Connect |
| 7 | Let's connect | Action | How do I reach out? | terminal fold; quiet footer only |

**Anti-patterns for launch (do not add without asking):** a testimonials fold without real attributed quotes; a newsletter signup between Work and About; a logos strip duplicating Work; a stats-tile row; any fold that exists because the page felt short.

**Pre-launch review:** before merging the launch PR, write the storyboard as seven bullets (headline + job + hook) in the PR body. If a bullet feels weak, cut or redesign the fold before it ships.

### 7.3 Experience (Fold 2)

Placement: right after the Hero. Not a résumé block — a scannable trajectory that expands on demand. Fold job: trajectory. Reference screenshots in `docs/references/experience/`.

**v1 decision (locked):** ship the **list view only**. The timeline view + view-toggle from v2 is deferred (see §6 phasing) — it's a lot of interaction for Fold 2 of a 60-second funnel. Add it later only if analytics justify it. This supersedes v2's "do not skip the view toggle in v1."

**Content model (`lib/experience.ts`, TS array — no MDX):**

```ts
type ExperienceEntry = {
  slug: string;                 // "bondscanner", "ultra"
  company: string;              // lowercase display ("bondscanner")
  role: string;                 // lowercase ("product manager")
  logo: string;                 // "/images/experience/bondscanner.svg"
  start: string;                // "2025-11" (YYYY-MM)
  end: string | "present";
  tagline: string;              // one line: what the company does
  bullets: string[];            // 2–4, verb-first, numbers-forward
  current?: boolean;            // green dot; defaults from end === "present"
  nda?: boolean;                // adds an NDA affordance in the expand
  order?: number;               // default reverse-chron by start
};
```

**List view:** logo tile (44×44, green dot if current) · company (semibold) + role (muted) · date range (mono, right-aligned) · chevron. A vertical hairline gutter connects entries into one history. Row is a `<button>` (`aria-expanded`, `aria-controls`); expand reveals an italic company tagline then 2–4 accent-asterisk bullets. 220ms ease-out, instant under reduced-motion. One row open at a time on mobile; desktop allows multiple.

**Voice:** lowercase company + role (editorial choice). Tagline = what the company does. Bullets = what *you* shipped, verb-first, numbers-forward. Present tense only for the current role. NDA: one honest bullet — "recent work is under NDA, happy to walk through it on a call."

**Seed (draft — fill from résumé, never invent):**

```ts
[
  { slug: "bondscanner", company: "bondscanner", role: "product manager",
    logo: "/images/experience/bondscanner.svg",
    start: "2025-11", end: "present", current: true,
    tagline: "sebi-registered online bond platform making bond investing simple for retail investors.",
    bullets: [
      "built bondscanner 0→1 as founding pm — web + mobile onboarding live in 2 months.",
      "shipped a product-led seo engine: 350+ blogs, 200+ dictionary terms, 26,000+ programmatic pages → ~2× daily organic clicks in 3 months.",
      "built an ai call-analysis pipeline (sarvam stt + claude) → team call-quality 5.2 → 6.0 in 30 days.",
    ] },
  { slug: "ultra", company: "ultra", role: "platform product manager",
    logo: "/images/experience/ultra.svg",
    start: "2025-03", end: "2025-10",
    tagline: "alternative-investment app (tap invest) across invoice discounting, fds, and more.",
    bullets: [
      "drove lifecycle automations across push, whatsapp, email, in-app → +15pp retention in 30 days.",
      "launched flexi invoice discounting → ~₹50cr additional aum in 3 months.",
    ] },
  // earlier roles (MoveInSync intern, etc.) in the same shape.
]
```

**Anti-patterns:** no stat-tile row; no "responsibilities included"; no filler roles; no unverified logos.

**Analytics:** `experience_row_expand` / `experience_row_collapse` (property: slug).

**Launch order:** author real entries → ship list view → (later) timeline view + toggle if justified.

### 7.4 The Lab (Fold 4)

Job: range. Reference the current headline in `app/page.tsx` — keep or replace, Megh's call.

**What lives here — three kinds (locked):**

| Kind (slug) | Label | What it is | Signal |
|---|---|---|---|
| `skill-file` | Skill File | A `.md` instruction file authored for an AI agent — a repeatable playbook a model runs on demand. | "I write for agents, not just humans." |
| `personal-tool` | Personal Tool | A self-built utility that solves a real problem — CLI, web app, extension, script. Must run for someone other than you. | "I build to solve my own problems." |
| `github-project` | GitHub Project | A public, functional repo. | "I build in public." |

No other kinds. If a build doesn't fit, reshape it or leave it out.

> **Open decision (not resolved — flagged in §0).** A parallel direction discussed separately: make the Lab a wall of *hostable, try-it-out* tools (a bond decoder, FD-vs-bond, "Bonds Wrapped"), Kashwi-style, rather than outbound links to files and repos. That's a different section (playable apps vs. artifacts you link to) and a different build. Until decided, the three-kind taxonomy above stands. If the hostable direction wins, this whole section gets rewritten and the aesthetic locks in §4 (no dark mode, sparing motion) need a conscious exception for that one surface.

**Content model (`lib/lab.ts`):**

```ts
type LabEntry = {
  slug: string;
  title: string;                                       // sentence case
  kind: "skill-file" | "personal-tool" | "github-project";
  description: string;                                 // 1–2 sentences, verb-first, ≤25 words
  stack: string[];                                     // mono tags
  url: string;                                         // required — a link, not a claim
  featured?: boolean;                                  // homepage fold vs /lab only
  order?: number;
  published?: boolean;                                 // default true
};
```

Migrate the current six: add `kind` to each; rename `externalUrl` → `url`, make it required (no `#`). Suggested mapping — `job-search-os` → personal-tool, `bond-dictionary` → personal-tool, `compliance-content-reviewer` → skill-file or personal-tool (Megh's call), `call-analysis-pipeline` → personal-tool, `interview-prep-system` → skill-file, `moengage-mcp-workflows` → skill-file.

**Homepage fold:** 3/2/1-col grid, max 6 featured cards. Card: kind badge (mono, top-right) · title (semibold) · description (2 lines, `…`) · stack chips (2–4, `+N` overflow) · outbound `↗`. Whole card is an `<a target="_blank" rel="noopener noreferrer">`. Bottom: `all builds →` → `/lab`.

**`/lab` index (later):** same grammar, filter chips `All / Skill files / Personal tools / GitHub`, no cap.

**Anti-patterns:** no private repos as `github-project`; no broken links (add a build-time fetch check that fails on non-2xx); no tutorial follow-alongs; no one-PR contributions; monochrome icons only.

**Analytics:** `lab_card_click` (slug, kind), `lab_all_click`, `lab_filter_apply` (kind).

### 7.5 Writing (Fold 5)

Placement: between the Lab and About. Also its own surface at `/writing` and `/writing/[slug]`. Why it exists: most PM portfolios stop at case studies; a writing surface shows Megh reflects on the work, compounds as crawlable pages, and sits one click from Work and the reach-out.

**Six kinds (locked):** `field-note` (Field Note), `learning` (Learning), `take` (Take), `idea` (Idea), `mini-case` (Mini Case), `teardown` (Teardown). Kind names the *shape of thought*; tags stay open for topics. New kinds need an explicit ask + a thumbnail glyph + a `lib/writing.ts` update.

**Content model — MDX frontmatter (`/content/writing/[slug].mdx`):** `title, slug, date, updated?, kind, tags[], excerpt, reading_time?, featured?, order?, published, canonical?`.

**Procedural thumbnails (locked — no hand-authored art):** deterministic inline SVG from `kind` + `slug`. Frame `aspect-ratio 3/2`, bg `#0E1622`, 1px inner border `rgba(245,235,212,0.08)`. Center glyph (cream `#F5EBD4`, ~2px, single stroke) by kind — field-note: map pin; learning: circular retry arrow; take: oversized quote mark; idea: lightbulb; mini-case: 3×2 grid, one filled; teardown: four squares, one dashed with ✕. Subtle background pattern from `hash(slug) % 4`. No text, no per-entry color. Built in `components/writing/thumbnail.tsx` with pure `getGlyph(kind)` / `getPattern(slug)`.

**Homepage fold:** three cards (featured by `order`, then most-recent), same grammar as the index card. If fewer than 3 published entries exist, hide the fold entirely. `view all →` to `/writing`. No filter chips on the homepage.

**`/writing` index:** reverse-chron, grouped by month. Filter chips (client-side): `All / Field Notes / Learnings / Takes / Ideas / Mini Cases / Teardowns`. RSS at `/writing/rss.xml`. On-site search deferred.

**`/writing/[slug]`:** ~640px reading column, `← all posts` breadcrumb, serif title + meta strip (date · read time · kind), sans body (16–18px, 1.65). Prev/next links. `@type: BlogPosting` in JSON-LD (§8). `.md` alternate at `/writing/[slug].md`.

**Voice:** first person, present tense unless retelling. One-sentence hook, then the story. Numbers when real. Name what you critique directly. Active close.

**Anti-patterns:** no reviews of tools used < 30 min / one week; no rewrites of AI summaries; no entries duplicating a `/work/[slug]`; no published drafts (`published: false`); no SEO chasing.

**Storage:** MDX; `lib/writing.ts` exports `getAllWriting()`, `getWritingBySlug()`, `getRecent(n)`, `getByKind(kind)`. RSS from the same array at build.

**Analytics:** `writing_index_view`, `writing_entry_view` (slug, kind), `writing_filter_apply` (kind), `writing_all_click`.

**Launch order:** author 4–6 entries first (an empty section reads worse than none) → ship `/writing/[slug]` → `/writing` index → homepage fold → RSS last.

### 7.6 About + Stack (Fold 6)

**About:** portrait (250px square, off-white bg, `/images/about/megh-on-green.png`) + 3–4 short paragraphs: identity (PM at the fintech × AI-tooling intersection) · current (founding PM at BondScanner, retail bond market) · prior (platform PM at Ultra, growth loops + reinvestment) · one lightly personal line. Warm, still specific. "I got into fintech because…" not "passionate about finance."

**Stack (icon row inside the About fold — no separate fold):** a small italic-serif `my stack` label, then a single row of circular tool icons (~48px, `--bg-elevated`, 1px `--border`, monochrome glyph in `currentColor`), wrapping on mobile, ending in a `+ more` toggle. Hover / focus / long-press shows a dark pill tooltip above the icon: line 1 tool name (semibold ~14px), line 2 the one-line "how I use it" (~12px, opacity 0.75, 2 lines max). Flips below at the viewport edge. 100ms fade, instant under reduced-motion. Announced via `aria-describedby`.

**Content model (`lib/stack.ts`):**

```ts
type StackTool = {
  slug: string;         // "figma", "cursor", "mixpanel"
  name: string;         // lowercase display
  icon: string;         // monochrome SVG, viewBox 24x24
  one_liner: string;    // "funnel + retention analytics on the growth loops"
  featured?: boolean;   // true = default row; false = behind "+ more"
  order?: number;
};
```

Author 6–10 featured tools; the rest behind `+ more`. No categories, no `since`, no prose paragraphs — the one-liner is the whole story.

**Voice for `one_liner`:** verb-first, present tense; name the actual use, not the category; under 12 words (cap 18); no adjective stacks.

**Anti-patterns:** no "since 2024" badge; no filter chips; no categories; no brand-color icons; no `/stack` subpage — if `+ more` isn't enough, cut tools.

**Analytics:** `stack_tool_hover` (slug), `stack_more_toggle` (to = open|closed).

**Launch order:** populate `lib/stack.ts` with real tools + PM-voice one-liners (no stubs) → ship icon row + tooltip in one commit → wire analytics → `+ more` in a follow-up if the row proves tight.

### 7.7 Let's connect (Fold 7)

Placement: bottom of the homepage, `id="connect"`, terminal fold. Why a real surface over a bare mailto: a mailto breaks on mobile and loses anyone without a mail client set up; an on-page surface keeps intent warm and gives Megh a structured inbox.

**Copy:** heading `Let's connect.` Description: a first-person line (contractions, no résumé voice) — *TODO: paste final copy.*

**Delivery — pick one at build time (decision open, options in §A):**
1. Hosted form embed (Tally / Fillout / Youform) — fastest, matches editorial, one-line iframe.
2. Booking (Cal.com) — if the goal is meetings over messages; higher intent per click.
3. Custom form + Resend server action — full control of the pixels, most upkeep.

If a custom form: fields `email` (autofocus, validated), `subject` (~80 char), `message` (~1500 char), `honeypot` (hidden). Submit `Send →`; loading `Sending…`; success replaces the form ("Got it. I'll reply from `hi@meghgupta.in` within a couple of days."); failure shows an inline error + the gmail fallback, never the raw error. Anti-abuse: honeypot + server-side rate limit (3/IP/hour) + server-side email check. Every field has a real `<label>`; errors via `aria-live="polite"`. Secrets in Vercel env, `.env.example` committed.

**Fallback:** mailto + `hi@meghgupta.in` stay until this ships (mailto is the fallback if the form 500s).

**Analytics:** form view, submit-attempt, submit-success, submit-error (no PII, no field contents).

---

## 8. SEO & head-tag spec

Domain is `meghgupta.in`; every canonical, OG URL, and JSON-LD `@id` uses `https://www.meghgupta.in`. The baseline never gets simplified out; new page types only add.

- **Root (`app/layout.tsx`, shipped):** `Person + WebSite + ProfilePage` graph, discovery block, canonical, OG profile, Twitter card, favicon. Bump `TITLE`, `DESCRIPTION`, `public/index.md`, `public/llms.txt` together when the pitch changes.
- **`/work` index (future):** `title "Selected work"`; OG `type website` with a generated grid image; JSON-LD `CollectionPage` → `ItemList`; `.md` alternate; sitemap same PR.
- **`/work/[slug]` (future):** headline title; OG `type article` from `/api/og/[slug]`; JSON-LD `Article` → `author {@id: Person}`, `headline`, `datePublished`, `image`, `about`. Canonical `https://www.meghgupta.in/work/[slug]`; if cross-posted, canonical points at the original and this one adds `rel="alternate"`. `.md` alternate; sitemap via `getAllCaseStudies()`.
- **`/lab`, `/lab/[slug]` (future):** `CollectionPage` + `CreativeWork` nodes (name, description, external url, keywords, `creator {@id: Person}`).
- **`/writing`, `/writing/[slug]` (future):** `BlogPosting` nodes; same discovery + `.md` alternate.
- **`/api/og/[slug]` (future):** `next/og` `ImageResponse` 1200×630, cream bg, metric in Instrument Serif, favicon corner; no auth/cookies/user data.
- **Discovery files (living):** `public/llms.txt`, `public/AGENTS.md`, `public/index.md`, per-page `.md` alternates (generated from MDX at build).

**Validation checklist (per launch / new page type):** view-source has the full discovery block · Rich Results Test renders the card · LinkedIn Post Inspector shows the right OG · route in `sitemap.xml` · not disallowed in `robots.ts` · all `.md` alternates return 200 · no URL on any domain other than `meghgupta.in`.

---

## 9. MDX / case-study system (future — §6.2)

Case studies and Writing both render from MDX. Schema and components (`Metric`, `Callout`, `Figure`, `LoomEmbed`, `FigmaEmbed`) live in `CLAUDE.md §5`. Build the pipeline only when there's real case-study content to put in it — don't ship the conveyor belt before the product.

---

## 10. Voice rules (content language — locked)

Applies to every string on the site and in this doc.

- Sound naturally human-written. No AI giveaways.
- Specific over vague — say what you did, with the number, not what you are.
- Active verbs, first person, contractions. Past tense for shipped work, present for current.
- No robotic transitions (moreover, furthermore, additionally). No cliché AI vocab (delve, leverage, tapestry, robust, seamless, unlock, elevate). No "passionate about."
- Avoid unnecessary em dashes, stiff openers, rule-of-three padding, and false-balance hedging. Take the position.
- Vary sentence length and rhythm. A fragment for emphasis is fine.
- Honest attribution — "I built / grew / scoped / ran," not "responsible for," and not claiming a team's work as solo.

---

## Appendix A — Let's-connect delivery options (decision needed)

Message-shaped surface or meeting-shaped surface? That's the fork.

| Option | Type | Free tier | Fit for editorial | Notes |
|---|---|---|---|---|
| **Tally** | Form | Generous | ★★★★★ | Default answer for personal-site forms. One-line iframe, Notion/Airtable webhooks, looks native with almost no theming. |
| **Cal.com** | Booking | Yes | ★★★★★ | "Book 20 min" beats a form on intent per click; excludes async messages. Pair with a small mailto fallback. |
| **Fillout** | Form | Yes | ★★★★☆ | Tally-adjacent, stronger logic; overkill for a contact form but no worse-looking. |
| **Youform** | Form | Yes | ★★★★☆ | Minimal, monochrome by default. |
| **Formspark / Basin / Formspree** | Backend only | Yes | You style it | You keep your own React form; they handle submit + spam + delivery. Middle ground, avoids Resend setup. |
| **Resend + server action** | Custom | ~free | Own the pixels | Full control, most upkeep (spam, delivery ops). |

Skip Typeform (over-produced), HubSpot (CRM baggage), Google Forms (ugly), Airtable/NotionForms (utilitarian / branded free tier) for this use.

**Recommendation:** **Cal.com if the goal is meetings, Tally if the goal is messages.** Resend only if owning the pixels matters more than the two days of setup + ongoing ops. Whichever you pick, the fold's copy and the mailto fallback stay the same — only the delivery swaps.

---

## Appendix B — file map (as of today)

```
app/
  layout.tsx            # root layout, fonts, metadata, JSON-LD baseline
  page.tsx              # homepage (Hero + Work + Lab + About + Contact today)
  globals.css           # design tokens
  icon.tsx · opengraph-image.tsx · robots.ts · sitemap.ts
components/
  nav.tsx · hero.tsx · work-card.tsx · lab-card.tsx · contact.tsx
lib/
  work.ts (4) · lab.ts (6)
public/images/about/megh-on-green.png
```

Not yet on disk: `/content`, `/app/work`, `/app/lab`, `/app/writing`, `lib/experience.ts`, `lib/stack.ts`, `lib/writing.ts` — all §6 / §7 work.
