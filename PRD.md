# PRD — Megh Gupta Portfolio Site

Owner: Megh Gupta
Last updated: 2026-09-11
Branch of truth: `main` (deployed on Vercel)
Repo: `medigitaldiary/megh-gupta-portfolio`

This PRD reverse-engineers what's currently shipped on the portfolio site, plus the gaps that still need to close. Locked technical decisions live in `CLAUDE.md` — this document is about product, not stack.

---

## 1. What is this website

A single-page personal portfolio for **Megh Gupta**, Product Manager (fintech + AI tooling). It is a **conversion funnel for an active job search** — the goal is moving a skimming recruiter or hiring PM from "who is this" to "I want to talk" inside 60 seconds.

**Primary audiences**
- Recruiters at VC-backed fintechs and AI-first startups.
- Hiring PMs and founders scouting PM #1 / early PM roles.
- Warm intros from LinkedIn / X / referrals who need a fast credibility check.

**Primary job of the site**
1. Prove Megh ships things with numbers attached (Selected Work).
2. Show he is technical enough to build without engineers (The Lab).
3. Give one, obvious way to reach him (mailto CTA, repeated).

**Non-goals (locked)**
- Not a blog.
- Not a CMS-driven marketing site.
- Not a multi-page deep site — everything lives on the homepage today.
- Not multi-tenant, not internationalized, no dark mode.

---

## 2. User journeys

### 2.1 The recruiter (60-second skim)

1. Lands on `/` from LinkedIn / email signature.
2. Reads hero: name, role tag, three-line headline, current gig one-liner.
3. Sees two CTAs above the fold — "See selected work" (scroll) and "Get in touch →" (mailto).
4. Skims 4 Work cards — pulls out the headline metric on each ("2x", "+15pp", "2 months", "5.2 → 6.0").
5. Clicks "Get in touch →" or copies `hi@meghgupta.com`.

**Success:** email hits Megh's inbox within 60 seconds of first load.

### 2.2 The hiring PM (5-minute deep read)

1. Lands on `/`, reads hero.
2. Reads all 4 Work cards in full — role, timeline, description, headline metric.
3. Scrolls through The Lab — sees 6 side-projects with stack tags (`claude-code`, `supabase`, `mcp`, `claude-api`) to gauge technical range.
4. Reads About — current role, prior role, taste ("0→1 builds, growth loops, internal tools").
5. Hits Contact section, emails.

**Success:** a first-round conversation booked.

### 2.3 The warm intro (name-drop check)

1. Someone said "check out Megh's portfolio."
2. Lands on `/`, confirms it looks credible (design, real numbers, real logos in copy — BondScanner, Ultra).
3. Bounces or forwards to a colleague.

**Success:** the site does not embarrass the intro.

### 2.4 The mobile scroller (~60% of traffic)

Same as 2.1 / 2.2, but on a phone. Nav collapses to a hamburger, hero stacks, work cards go single-column, contact section takes full width. Must not horizontally scroll at 375px.

### 2.5 Journeys not yet supported (see §6)

- **Deep-dive on a specific case study.** Today every "See more" / external link goes to `#` — case study detail pages don't exist yet.
- **Reading Megh's writing.** No `/writing` or blog surface — decision-locked as "push back."
- **Booking a call.** No Calendly link wired in — only mailto.

---

## 3. Messaging, copy, content

Voice guide (from `CLAUDE.md` §10): specific > vague, active verbs, honest attribution, short sentences, numbers as evidence not decoration, no "passionate about," no "leverage."

### 3.1 Hero

- **Eyebrow (mono, uppercase):** `Megh Gupta · Product Manager`
- **Headline (Instrument Serif, ~72px desktop):**
  > I turn ideas into features,
  > features into products,
  > products into systems.
- **Sub (Inter, muted):**
  > Currently at BondScanner, revamping support flows, building Swiggy-style chatbots, and shipping growth systems in regulated fintech.
- **CTAs:** `See selected work` (secondary, scrolls to `#work`) · `Get in touch →` (primary, `mailto:hi@meghgupta.com`)

### 3.2 Selected Work

Section eyebrow: `SELECTED WORK`
Section heading: `What I've shipped, with numbers.`

Four cards, in order:

| # | Title | Headline metric | Role · Timeline |
|---|---|---|---|
| 1 | How I 2x'd organic traffic at BondScanner in 3 months | **2x** daily organic clicks in 3 months | Growth PM · Jan 2026 – Q2 2026 |
| 2 | AI call analysis pipeline for BondScanner's RM team | **5.2 → 6.0** call quality score in 30 days | PM · Mar 2026 – present |
| 3 | Lifting payout-to-reinvestment from 55% to 70% at Ultra | **+15pp** retention lift in 30 days | Platform PM · Jun 2025 – Jul 2025 |
| 4 | Founding PM: BondScanner 0→1 | **2 months** regulated platform, sign-up to launch | Founding PM · Nov 2025 – present |

Every card has: tag row (Growth / SEO / Fintech / AI Tooling / Ops / Platform / 0→1 / Founding PM), 1-paragraph description, headline metric, role + timeline meta strip.

### 3.3 The Lab

Section eyebrow: `THE LAB`
Section heading: `Things I built when a tool didn't exist or moved too slow.`

Six cards, each with stack chips (JetBrains Mono):

1. **Job Search OS** — Claude Code + Supabase tracker for the whole job search. `claude-code`, `supabase`, `next.js`
2. **Bond Dictionary** — Investopedia-style glossary hub for BondScanner, 200+ terms, programmatic SEO. `next.js`, `programmatic-seo`
3. **Compliance Content Reviewer** — no-code Claude API tool checking drafts against SEBI/NSE/BSE. `claude-api`
4. **Call Analysis Pipeline** — Sarvam STT + Claude scoring, auto-extracts action items into Radar. `sarvam`, `claude-api`
5. **Interview Prep System** — structured Notion + Claude workflow for PM interviews. `notion`, `claude-api`
6. **MoEngage MCP Workflows** — MCP-driven campaign reporting + lifecycle orchestration. `mcp`, `moengage`

### 3.4 About

Section eyebrow: `ABOUT`
Section heading: `A bit about me.`

Photo (green-composited portrait, `/images/about/megh-on-green.png`) + 4-paragraph prose:
1. Identity — PM at intersection of fintech and AI tooling.
2. Current — Founding PM at BondScanner, retail bond market.
3. Prior — Platform PM at Ultra, growth loops + reinvestment.
4. Taste — 0→1 builds, growth loops, internal tools that compound leverage.

### 3.5 Contact

Full-bleed accent-green section.
- **Heading:** `Let's talk.` (Instrument Serif, ~96px)
- **Email:** `hi@meghgupta.com` (visible, underlined)
- **Primary button:** `Email me` → `mailto:hi@meghgupta.com?subject=Hello%20from%20your%20site`
- **Socials row:** LinkedIn · Twitter · GitHub · Read.cv (all currently `#` placeholders — see §6)

### 3.6 Footer

`© 2026 Megh Gupta · Built with Claude Code · Source` (Source links to the GitHub repo.)

---

## 4. Design style

Governed by `CLAUDE.md` §3. Editorial, quiet, numbers-forward. Reference vibe: kashwiaggarwal.com.

### 4.1 Color (locked — one accent only)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#FAFAF7` | Page background (off-white, not pure white) |
| `--bg-elevated` | `#FFFFFF` | Cards, Lab section background |
| `--fg` | `#111111` | Primary text, headlines |
| `--fg-muted` | `#555555` | Body copy, secondary text |
| `--fg-subtle` | `#999999` | Meta strip, eyebrows, captions |
| `--border` | `#E8E6E0` | Hairlines, card outlines |
| `--accent` | `#1F4D3A` | Bond-paper green — headline metric, primary button, Contact bg |
| `--accent-fg` | `#FAFAF7` | Text on accent backgrounds |

### 4.2 Type

- **Instrument Serif** — display, all H1/H2, headline metrics
- **Inter** — all body text, nav, buttons, sub-heads
- **JetBrains Mono** — eyebrows (uppercase, tracking-wide), stack tags on Lab cards, work-card category tags

Type scale (Tailwind theme tokens): display 64px / h1 40px / h2 28px / h3 20px / body 16px / small 14px. Body line-height 1.6, headlines 1.05–1.2.

### 4.3 Spacing & layout

- Section padding: `py-24 md:py-32`. Contact section is bigger (`py-32 md:py-48`) as the closing beat.
- Content width: `max-w-5xl` centered.
- Work grid: 1 col mobile → 2 col ≥ md.
- Lab grid: 1 col mobile → 2 col ≥ sm → 3 col ≥ lg.
- Card padding: `p-6 md:p-8`. Rounded `rounded-xl`.

### 4.4 Motion (sparing)

- 150ms ease-out hover transitions on cards, links, buttons.
- Work card hover: 0.5px translate-up + border shifts to accent green.
- Smooth in-page scroll (`scroll-behavior: smooth`), disabled under `prefers-reduced-motion`.
- **No** parallax, scroll-jacking, cursor effects, page transitions.

### 4.5 Component patterns

- **Nav:** sticky, translucent white with backdrop blur; borderless at top, hairline border after 80px scroll; hamburger + full-screen menu on mobile.
- **Work card:** tag pills · title · headline metric (serif, green) · description · meta strip (role · timeline).
- **Lab card:** title · description · mono stack chips.
- **CTA hierarchy:** primary = filled accent green; secondary = bordered outline that shifts to accent on hover.

---

## 5. Functional requirements

### 5.1 Pages & routes (current state)

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Shipped | Hero + Work + Lab + About + Contact, all in one page |
| `/work/[slug]` | ❌ Not built | Referenced in `CLAUDE.md`, no route yet |
| `/lab/[slug]` | ❌ Not built | Referenced in `CLAUDE.md`, no route yet |
| `/about` | ❌ Not built | Long-form about — optional per PRD |
| `/api/og` | ❌ Not built | Per-case-study OG images |
| `sitemap.xml` | ✅ Shipped | Via `app/sitemap.ts` |
| `robots.txt` | ✅ Shipped | Via `app/robots.ts` |
| Favicon | ✅ Shipped | Via `app/icon.tsx` |
| Open Graph image | ✅ Shipped | Via `app/opengraph-image.tsx` |

### 5.2 Navigation & interaction

- Sticky top nav with smooth-scroll anchor links (Work / Lab / About / Contact) + "Get in touch →" CTA.
- Mobile menu: hamburger opens full-screen overlay, locks body scroll, closes on Escape or link tap.
- Every focusable element has a visible focus ring (`ring-accent`).
- Every external link opens in a new tab with `rel="noopener noreferrer"`.

### 5.3 Content model

- Work cards: hard-coded in `lib/work.ts` (typed `WorkCard[]`).
- Lab cards: hard-coded in `lib/lab.ts` (typed `LabCard[]`).
- **No MDX pipeline yet.** `CLAUDE.md` §4–§5 describe a full `/content/work/*.mdx` schema — none of it exists on disk.

### 5.4 Contact

- Single canonical email: `hi@meghgupta.com`.
- CTA in hero, in nav, in Contact section. All are `mailto:` links.
- No form. No newsletter. No captcha.

### 5.5 Analytics & SEO

- Vercel Analytics + Vercel Speed Insights (locked in `CLAUDE.md`; needs verification in `app/layout.tsx`).
- Per-page `metadata` export via Next.js.
- Sitemap + robots + OG image shipped.

### 5.6 Accessibility

- Semantic landmarks (`<nav aria-label>`, `<main id="main">`, `<section id="…">`).
- Keyboard-navigable throughout.
- `alt` text on all images (currently one: the About portrait).
- `prefers-reduced-motion` respected.
- Aim: Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO.

### 5.7 Performance

- Next.js 15 App Router, server components by default (only `Nav` is `"use client"`).
- Fonts loaded via `next/font` with `display: swap`.
- `next/image` for the About portrait.
- No client-side data fetching, no third-party scripts beyond Vercel.

### 5.8 Deployment

- GitHub `main` → Vercel auto-deploy.
- Preview deploys per PR.
- Custom domain: `meghgupta.com` (see §6 — DNS may not be wired yet).

---

## 6. What is pending

Grouped by priority. Everything below is either not built, placeholder, or explicitly deferred.

### 6.1 Blockers before public launch

- [ ] **Real social URLs in Contact.** LinkedIn / Twitter / GitHub / Read.cv are all `#` today.
- [ ] **Real external URLs on Work cards.** Every card's "↗" link points to `#`. Needs either (a) deck / PRD / dashboard links, or (b) internal case study detail pages.
- [ ] **Custom domain.** Confirm `meghgupta.com` is live on Vercel (or update footer/email domain if not).
- [ ] **Verify analytics wiring.** Confirm `@vercel/analytics` + `@vercel/speed-insights` are actually mounted in `app/layout.tsx`.

### 6.2 High-value, not yet built

- [ ] **Case study detail pages (`/work/[slug]`).** MDX pipeline described in `CLAUDE.md` §4–§5 does not exist. No `/content/work/` directory, no dynamic route, no MDX components (`Metric`, `Callout`, `Figure`, `LoomEmbed`, `FigmaEmbed`).
- [ ] **Real screenshots / artifacts** for each case study — currently zero supporting visuals beyond the About portrait.
- [ ] **Per-case-study OG images** via `next/og` route at `/api/og/[slug]`.
- [ ] **Lab detail pages or links out.** Two Lab entries have `externalUrl: "#"` and two have none at all.

### 6.3 Copy that is still placeholder

- [ ] About prose — `page.tsx` marks it `TODO: real copy — placeholder prose, structure is locked per PRD §6.5`.
- [ ] "See more case studies" link on Work section — deferred until a real Notion / PDF index exists.
- [ ] Lab entries `job-search-os` and `interview-prep-system` — flagged as placeholder in `lib/lab.ts`.

### 6.4 Explicitly deferred (do NOT build without asking)

Per `CLAUDE.md` §6.3:
- ❌ Contact form (mailto is enough).
- ❌ Blog surface.
- ❌ Dark mode.
- ❌ CMS.
- ❌ Search.
- ❌ Framer Motion / heavy animation.

### 6.5 Quality gates before "done"

From `CLAUDE.md` §7 — verify each before shipping any substantial change:
- [ ] `pnpm build` clean.
- [ ] `pnpm check` clean (Biome).
- [ ] Lighthouse ≥ 95 across all four categories on `/`.
- [ ] Renders correctly at 375 / 768 / 1440.
- [ ] No console errors in dev.
- [ ] No hardcoded hex colors outside `globals.css`.

---

## Appendix — file map (as of today)

```
app/
  layout.tsx              # Root layout, fonts, metadata
  page.tsx                # Homepage (composes Hero + Work + Lab + About + Contact)
  globals.css             # Design tokens
  icon.tsx                # Favicon
  opengraph-image.tsx     # Site-wide OG image
  robots.ts               # /robots.txt
  sitemap.ts              # /sitemap.xml
components/
  nav.tsx                 # Sticky nav + mobile menu
  hero.tsx
  work-card.tsx
  lab-card.tsx
  contact.tsx
lib/
  work.ts                 # 4 hardcoded work cards
  lab.ts                  # 6 hardcoded lab cards
public/images/about/megh-on-green.png
```

No `/content`, no `/app/work`, no `/app/lab`, no `/app/about` yet — those are §6.2 work.

---

### PM Takeaway

The site today is a **single, tight homepage** built as server-rendered React with hardcoded content in TypeScript arrays — fast, simple, and correct for a 4-case-study portfolio, but it hasn't grown into the MDX-driven case study system `CLAUDE.md` promises. Every "↗" link and every social handle is still a `#` placeholder, so the top launch blocker is *content and real links*, not code. As PM, treat §6.1 as your pre-launch checklist and §6.2 as the "second wave" that unlocks 5-minute deep reads for hiring managers.

### Technical Terms

- **Next.js App Router** → The current-generation Next.js routing model where each folder under `/app` is a URL, and files like `page.tsx` render that URL. Like giving each room in your house its own door label instead of a single map.
- **Server component** → A React component rendered on the server and sent as HTML — no JavaScript ships to the browser for it. Like getting a printed report vs. a live spreadsheet.
- **Client component (`"use client"`)** → A React component that runs in the browser because it needs state, effects, or event handlers. Used here only for `Nav` (scroll + menu toggle).
- **MDX** → Markdown with React components mixed in. Lets you write long-form content (case studies) with custom widgets like `<Metric>` embedded inline.
- **Tailwind CSS v4** → A utility-first CSS framework where you style by adding classes (`py-24`, `text-fg-muted`) instead of writing separate CSS files. v4 reads design tokens from CSS variables via `@theme`.
- **shadcn/ui** → Not a library — a set of copy-paste React components you own in your own repo. No dependency updates to worry about.
- **Design tokens (CSS variables)** → Named values (`--accent`, `--fg-muted`) defined once and referenced everywhere. Change the token, the whole site updates. Like editing a "brand color" cell in a spreadsheet that every other cell references.
- **`next/font`** → Next.js's built-in font loader — self-hosts Google Fonts at build time so users don't hit fonts.googleapis.com at runtime. Faster + privacy-friendlier.
- **`next/image`** → Next.js's `<Image>` component that auto-generates responsive sizes, lazy-loads, and serves modern formats (AVIF/WebP). Like having a photo lab that resizes and reformats on demand.
- **Open Graph (OG) image** → The preview card that shows up when your link is pasted into Slack / LinkedIn / iMessage. Currently one site-wide image; per-case-study versions are pending.
- **`mailto:` link** → A plain HTML link that opens the user's email client with a prefilled recipient. Zero backend, zero cost, zero spam surface.
- **Vercel Analytics / Speed Insights** → Vercel's first-party product analytics + Core Web Vitals monitoring, dropped in as one component in the root layout.
- **Lighthouse** → Google's automated audit tool that scores a page on Performance, Accessibility, Best Practices, and SEO from 0–100. Our bar is ≥ 95 on all four.
- **Biome** → A modern all-in-one linter + formatter (replaces ESLint + Prettier). One config, one CLI.
- **Programmatic SEO** → Auto-generating thousands of landing pages from structured data (e.g., one page per bond ISIN). Each page targets a long-tail keyword; together they trap high-intent search traffic.
