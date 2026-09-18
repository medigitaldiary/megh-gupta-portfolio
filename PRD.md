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
- ❌ Blog surface.
- ❌ Dark mode.
- ❌ CMS.
- ❌ Search.
- ❌ Framer Motion / heavy animation.

> Note: the "no contact form" rule (previously here) is **superseded by §7.2 "Let's connect"** below — a contact form is now planned. `CLAUDE.md` §6.3 should be updated when that section ships.

---

## 7. Future sections (not built yet — spec here for when we do)

These are approved additions to the eventual full portfolio, captured here so nothing gets lost between now and building them. Order in the page = order in this section.

### 7.1 "My Stack" — icon row inside the About fold

> **Layout change (locked):** the earlier full-fold "My Work Stack" is retired. The stack now lives as a compressed icon row *inside* the About fold — no separate fold, no per-tool card grid. Reference: `docs/references/stack/01-icon-row.png`.

**Where:** at the bottom of the About fold, after the portrait + prose block. A small italic-serif label reads `my stack`, then a single horizontal row of circular tool icons, then a `+ more` text toggle at the end. Hover or keyboard-focus on any icon reveals a dark pill tooltip above it with the tool's name **and** the one-line "how I use it."

**Why the change:**
- Craft signals shouldn't earn a full fold. A recruiter doesn't scroll to the stack fold and think "ah, now I want to work with him because he uses Cursor." They form that opinion from Work and Experience. The stack is *evidence*, not the pitch.
- Compressing to an icon row keeps the signal without buying a fold.
- Hover tooltip is enough depth for anyone who cares to look; anyone who doesn't sees a quiet identity strip.

**Fold impact:** homepage drops from 8 to 7 folds. About's job is now `Person + Craft` — "Would I want to work with them, *and* what do they build with?" See `CLAUDE.md §14` for the updated storyboard.

**Layout — icon row:**
- Small handwritten-style label above the row: `my stack` in italic serif (`Instrument Serif italic`), ~14–15px, in `--fg-muted`. Matches the reference's handwritten register.
- Row of 6–10 circular icon buttons, ~48px diameter each, gap ~16–20px, wrapping to a second row on mobile.
- Each icon: soft `--bg-elevated` circle with 1px `--border`, brand-mono glyph (24px) centered in `--fg`. When the tool has an official monogram, use it — otherwise a monochrome SVG cast in `currentColor`.
- The current-focus tool gets a subtle dark fill on the circle (matches the "mixpanel" active state in the reference). Not a hover — this is the actively-tooltipped tool.
- A `+ more` link at the end of the row (mono-ish sans, `--fg-muted`, underline on hover). Click expands the row inline to reveal additional icons; second click collapses. No modal, no navigation, no `/stack` subpage.

**Tooltip:**
- Dark pill (`--fg` background, `--bg` text), ~10–12px vertical padding, ~14–18px horizontal padding, ~6px radius. Anchored above the icon with a 4px gap.
- Contents (two lines):
  - **Line 1:** tool name, sans-semibold, ~14px.
  - **Line 2:** one-liner "how I use it," sans-regular, ~12px, opacity 0.75. Wraps to 2 lines max; anything longer gets rewritten shorter, not truncated.
- Appears on hover, focus, or long-press. Disappears on mouseleave, blur, or Esc.
- Positioning: `absolute` above the icon by default; flips to below at the edge of the viewport (right-edge tools would clip on mobile otherwise).
- 100ms fade-in via CSS, honors `prefers-reduced-motion` (no animation, appears instantly).
- Keyboard: tooltip is announced via `aria-describedby` on the button, so screen readers get the one-liner as part of the button's accessible name.

**Content model — `lib/stack.ts`:**

```ts
type StackTool = {
  slug: string;              // "figma", "cursor", "mixpanel"
  name: string;              // display name, lowercase per reference ("mixpanel")
  icon: string;              // "/images/stack/figma.svg" — monochrome, viewBox 24x24
  one_liner: string;         // "funnel + retention analytics on the growth loops"
  featured?: boolean;         // true = in the default row; false = behind "+ more"
  order?: number;             // sort within featured group; defaults to source order
};
```

Author 6–10 tools with `featured: true` for the default row; put the rest behind `featured: false` (shown only when `+ more` is expanded). No categories, no `since` field, no `how_i_use_it` prose paragraphs. The one-liner is the whole story.

**Voice rules for `one_liner`** (per `CLAUDE.md §10`):
- Verb-first, present tense. "writes PRDs alongside code so implementation Qs surface at spec time" beats "productivity tool for writing PRDs."
- Name the actual use, not the category. "funnel + retention analytics on the growth loops" beats "product analytics."
- Under 12 words when possible. Absolute cap: 18. If it needs more, rewrite the use, not the sentence.
- No adjective stacks ("powerful, flexible, beautiful") — those read as marketing copy for the tool, not evidence of use.

**Anti-patterns:**
- No per-tool "since 2024" badge — years since first use is résumé weight, not signal.
- No filter chips (`AI-first / hands-on-code / PM-only` from the retired spec) — the row is short enough to scan whole; filtering is friction.
- No categories or grouping — one row, one story. If the row breaks 10 tools, cut the weakest ones, don't group them.
- No brand-color icons — everything in `currentColor` so the row reads as one system, not a sponsor strip.
- No `/stack` subpage. If the "+ more" expansion isn't enough, the fix is to cut tools from the row, not add a new surface.

**Analytics** (per `CLAUDE.md §6.3`, custom Vercel Analytics — no PII):
- `stack_tool_hover` (property: slug) — track which tools recruiters actually inspect.
- `stack_more_toggle` (property: `to` = `open | closed`) — signal on whether the "+ more" toggle earns its complexity.

**Launch order:**
1. Populate `lib/stack.ts` with 6–10 real tools, one-liners written in PM voice. TODO stubs cannot ship.
2. Ship the icon row and tooltip in the same commit — half the pattern is worthless.
3. Wire analytics events with the first ship.
4. `+ more` expansion in a follow-up commit if the default row proves too tight.

**Deprecated:** the earlier fold-level "My Work Stack" spec (category-grouped card grid, per-tool "since" year, `how_i_use_it` prose). If any content model was drafted under the old spec, migrate to the compressed `lib/stack.ts` shape above.

---

### 7.1a "My Work Stack" — DEPRECATED (see §7.1 above)

**Placement:** after **Selected Work**, before **The Lab**. Reads as a bridge — "here's what I shipped, here's what I ship with."

**Why it exists:** hiring PMs and founders want to know how someone actually works, not just what they've delivered. Listing the stack in a PM-native way ("Cursor for writing PRDs alongside code," not "expert in Cursor") signals fluency without needing a résumé. Also a differentiator vs. traditional PM portfolios that stop at case studies.

**Content model — one entry per tool:**
- `tool` — display name (e.g. "Claude Code", "Cursor", "Vercel", "GitHub", "Notion", "Figma", "Linear", "MoEngage", "Sarvam").
- `category` — one of: `AI / LLM`, `Editor / IDE`, `Hosting / Infra`, `Version control`, `PM & docs`, `Design`, `Analytics`, `Messaging / lifecycle`.
- `how_i_use_it` — 1–2 sentences, PM-voice, specific. "I write PRDs alongside code in Cursor so implementation questions surface at spec time, not review time." NOT: "productivity tool for developers."
- `since` — optional, first year I used it (e.g. `2024`).
- `link` — optional external URL.
- `icon` — optional; if we do icons, use a monochrome set for consistency (e.g. `simple-icons`).

**Layout:**
- Grid of small cards, 3 cols desktop / 2 tablet / 1 mobile.
- Each card: category label (mono eyebrow) → tool name (serif h3) → `how_i_use_it` prose → optional link arrow.
- Group cards by `category` with a mono heading per group. Groups collapse to a single flat scroll on mobile.
- Copy the visual grammar from The Lab section — don't invent a new card style.

**Content format:** MDX file at `/content/stack/stack.mdx`, with entries as a typed frontmatter array; OR a plain TS array in `lib/stack.ts` if we want the same shape as `lib/lab.ts`. Decide when building — same rule as Lab.

**Voice rules (per `CLAUDE.md` §10):**
- Specific over vague — say what I do with it, not what it is.
- No jargon like "leverage", "ecosystem", "productivity 10x".
- If a tool is trendy but I barely use it, leave it out. This section is a self-portrait, not a keyword sponge.

**Nice-to-haves (not in v1):**
- Sortable by category or by "how often I use it".
- A tiny recency badge ("using since 2024", "recently added").
- Filter chip: `AI-first` / `hands-on-code` / `PM-only`.

---

### 7.2 "Let's connect" — reach-out section

**Placement:** replaces the current mailto-only Contact section at the bottom of the homepage. Same slot, richer surface.

**Why it exists:** a `mailto:` link opens a mail client, breaks the flow on mobile, and loses anyone whose default client isn't set up. An inline form keeps the reader on the page, captures intent while it's warm, and gives me a structured inbox instead of freeform emails.

**Copy:**
- **Section heading:** `Let's connect.`
- **Description:** *(same as my current LinkedIn bio — TODO: paste exact copy here before build. Keep tone consistent with the rest of the site — first-person, contractions, no résumé voice.)*

**Form fields (all required unless noted):**
- `email` — email input, RFC-5322-ish validation, autofocus.
- `subject` — single-line text, ~80 char cap. Placeholder: "What's this about?"
- `message` — multi-line textarea, ~1500 char cap. Placeholder: "A sentence or two is fine."
- `honeypot` — hidden field, must stay empty. Basic spam filter, no CAPTCHA.

**Submit UX:**
- Submit button: `Send →`, same visual grammar as the LinkedIn CTA on the coming-soon page.
- Loading state: button label swaps to `Sending…`, disabled.
- Success: inline confirmation replacing the form — "Got it. I'll reply from `hi@meghgupta.com` within a couple of days."
- Failure: inline error under the button — "Something broke on my end. Try again, or email `megh.bpgc@gmail.com` directly." Never expose the underlying error to the user.

**Delivery — pick one at build time:**
1. **Email via Resend** (recommended default): server action posts to Resend API, delivers to my inbox. Simplest, no DB, works on Vercel's free tier. Costs ~$0/mo for this volume.
2. **Store in Supabase + email digest**: server action inserts into a `contact_submissions` row, plus a daily/weekly Vercel cron email. Good if I want history + analytics on who's reaching out.
3. **Forward to WhatsApp via a bot** (Twilio, WhatsApp Cloud API, or a simple webhook to Baileys/whatsapp-web.js): highest-signal for me, most infra to set up. Reserve for later if inbound volume grows.

Default = option 1 unless volume changes. All three keep the same form UI — only the server action swaps.

**Anti-abuse:**
- Honeypot field (above).
- Server-side rate limit: max 3 submissions per IP per hour (Vercel KV or a simple in-memory store).
- Server-side email format check before hitting the delivery adapter.

**Accessibility:**
- Every field has an associated `<label>`, not just a placeholder.
- Error messages announced via `aria-live="polite"`.
- Full keyboard flow, focus ring on the submit button.

**Environment / secrets:**
- API key(s) in `.env.local` and Vercel project env vars, never committed.
- Reference via `process.env.RESEND_API_KEY` etc.
- Add `.env.example` when this ships so setup is self-serve.

**Analytics:**
- Track: form view, form submit-attempt, submit-success, submit-error. Vercel Analytics custom events — no PII, no field contents.

**Deprecates:**
- The current mailto link + `hi@meghgupta.com` on the coming-soon page. Both stay until this section ships (mailto is the fallback if the form 500s).

**Anchor & CTA target:**
- The section's `<section>` has `id="connect"`. The hero's single `Let's connect →` CTA smooth-scrolls to it (`document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })` — or CSS-native scroll-behavior on `html`).
- If nav ever exists, its final item points to `#connect`.

---

### 7.2a Third-party embed options (short-list for the connect surface)

If a custom Resend + server action feels like more surface area than the connect fold needs, the alternative is embedding a hosted form / booking widget. Below are the candidates, ordered by how well their default UI fits an editorial personal portfolio. Not a recommendation yet — the pick depends on whether the goal is *messages* or *meetings*.

| Option | Category | Free tier | UI fit for editorial portfolio | Notes |
|---|---|---|---|---|
| **Tally** ([tally.so](https://tally.so)) | Form | Generous (unlimited forms, ~50 submissions/month free-ish) | ★★★★★ — clean, minimal, notion-adjacent | The current default answer for personal-site forms. Embeds via iframe or a hosted subpage. Supports Notion / Airtable webhooks. Very easy to make it look native. |
| **Fillout** ([fillout.com](https://fillout.com)) | Form | Yes (limited submissions) | ★★★★☆ — modern, clean, slightly denser than Tally | Newer Tally competitor. Stronger conditional-logic and multi-step flows; overkill for a contact form but no worse looking. |
| **Cal.com** ([cal.com](https://cal.com)) | Booking | Yes | ★★★★★ — clean brutalist, matches editorial | Different mental model: instead of "send a message" it says "book 20 min." Higher signal per submission — a recruiter putting time on your calendar is a strong intent — but excludes async messages. Can embed inline or as a popover. Consider pairing with a small mailto/copy fallback. |
| **Youform** ([youform.com](https://youform.com)) | Form | Yes | ★★★★☆ — minimal, monochrome by default | Newer entrant. Aggressively simple. Fewer integrations than Tally, but the default styling is closer to editorial. |
| **Formspark** / **Basin** / **Formspree** | Backend only | Yes (limits vary) | You style the form yourself | These are backends, not UIs. You still author the HTML / React form; they handle submission + spam + email delivery. Good middle ground: keeps your styling, avoids Resend setup. |
| **Typeform** ([typeform.com](https://typeform.com)) | Form | Very limited (10 responses/mo on free) | ★★★☆☆ — polished but conversational-marketing vibe | Feels like a landing-page tool. On a personal portfolio it can read as over-produced. Skip unless you want the conversational one-question-at-a-time flow. |
| **HubSpot Forms** | Form | Yes | ★★☆☆☆ — corporate CRM aesthetic | Ships CRM tracking baggage. Wrong tool for a personal site. |
| **Google Forms** | Form | Yes | ★☆☆☆☆ — Google's default styling | Works, ugly, no brand control. Skip. |
| **Airtable Forms** | Form | Yes | ★★☆☆☆ — utilitarian | Right if you want submissions in an Airtable base for follow-up tracking; wrong if you care how the form looks embedded. |
| **NotionForms** ([notionforms.io](https://notionforms.io)) | Form → Notion | Yes | ★★★☆☆ — decent, some ads on free | Third-party wrapper that pipes submissions into a Notion database. Convenient if your inbox is already in Notion. Free tier has visible branding. |

**PM-shortlist recommendations:**

1. **Cal.com if the goal is meetings.** A "book 20 min" button beats a form on intent-per-click for recruiters, hiring PMs, and founders. Higher signal, less inbox management. Pair with a small mailto/copy-email fallback for async.
2. **Tally if the goal is messages.** Free tier is enough for a personal-site volume forever, the default UI matches editorial vibes with almost no theming, iframe embed is one line, and switching backends later (Notion, Airtable, Zapier → email) is a settings change, not a rewrite.
3. **Resend + custom server action (the original PRD §7.2 plan) if you want to own the pixels.** More setup, more maintenance, but zero third-party UI dependency and full control.

**Rule of thumb:** for a section that will exist for the life of the site, hosted forms are a two-line ship; a custom form is a two-day ship plus ongoing spam / delivery ops. The savings compound. The one thing hosted forms cost you is total control over the visual — worth checking whether the embed still reads as "your site" or as "someone else's widget."

**Next step (decision needed from Megh):** message-shaped surface or meeting-shaped surface? That determines whether the pick is Tally / Fillout / Youform (form) or Cal.com (booking). I'll wire up whichever direction you name, in whichever chrome (embedded iframe vs. hosted subdomain vs. server action) fits.

---

### 7.3 "10-second intro" long-form copy (future replacement for the coming-soon paragraph)

**Where:** replaces the current short intro paragraph on the coming-soon page (`components/coming-soon.tsx`).

**Current live copy** (short, kept for now):
> Hi, I'm Megh. I build 0→1 fintech, and the AI tools that quietly run behind it. Right now at BondScanner. Ultra before.

**Future copy — the "10-second intro":**
> Hi, I'm Megh. I'm a product manager at BondScanner, a SEBI-registered online bond platform, where I'm trying to make bond investing as simple as it should be. I'm a BITS Goa grad, over 1.5 yrs in fintech now, and lately I've been experimenting with voice AI and use cases around it.

**Why it's parked:**
- Adds concrete evidence (`SEBI-registered`, `BITS Goa`, `1.5 yrs`, `voice AI`) that lifts the paragraph from generic-PM to specific-person.
- Not shipped yet because the current line is tighter and the coming-soon layout is still moving; will drop this in once the visual system stabilizes.

**Voice checks before shipping (per `CLAUDE.md` §10):**
- One 55-word sentence. Consider breaking into 2–3 shorter sentences to hit the ~15-word target.
- "trying to make X as simple as it should be" — good voice; keep.
- Consider whether "BITS Goa grad" reads too résumé-forward next to the personal opener.
- The final clause ("experimenting with voice AI") is the strongest hook for the next section (Work Stack §7.1). Consider making it its own sentence.

**Drop-in target:**
- File: `components/coming-soon.tsx`
- Element: the `<p>` immediately below the italic subtitle "Building a new home for my work & ideas."

---

### 7.4 Fold-by-fold storyboard for the full portfolio launch

Applies **only** to the full portfolio, not the coming-soon page. The rules that lock this in live in `CLAUDE.md §14`. This section is the *content* of the storyboard: what each fold says, shows, and hooks into next.

**The whole homepage reads as one scroll story, not a stack of tiles.** Every fold has a job, answers one specific question, and hands the reader off to the next fold with a hook. Write this list before you write components.

#### Fold 1 · Hero (the hook, 3-second grab)

- **Job:** get a recruiter or hiring PM to stop skimming.
- **Question answered:** "Who is this and why should I keep scrolling?"
- **Contents:** name, one-line role/identity, and **exactly one primary CTA** labeled `Let's connect →` that smooth-scrolls to the Let's-connect fold (id `#connect`). No secondary CTA, no separate LinkedIn / Resume buttons. LinkedIn and Resume live inside the connect section, not the hero — the hero pulls the reader down the page rather than shipping them off it.
- **Voice:** the 10-second intro from §7.3.
- **Lead-out hook:** the sentence should end with a fragment that plants the next fold ("… lately I've been building X" → Fold 2 shows X).

#### Fold 2 · Selected Work (the proof)

- **Job:** replace vague adjectives with named numbers.
- **Question answered:** "What have they actually shipped, with numbers?"
- **Contents:** 3–4 case study cards (per `lib/work.ts`), each with a headline metric visible without hover. Cards link to `/work/[slug]` when case study pages exist; before that, link to Notion / deck / Loom.
- **Voice:** past tense, verbs first, numbers early. "Grew organic clicks 2×." Not "Responsible for growth."
- **Lead-out hook:** last card gently implies "there's more" — either "See all case studies →" or a bridge line into Fold 3.

#### Fold 3 · The Lab (the range)

- **Job:** show the reader Megh builds beyond the day job — signals initiative and taste.
- **Question answered:** "Do they build outside their day job? Do I like what they build?"
- **Contents:** side projects grid (per `lib/lab.ts`), smaller cards than Work, each with 1–2 sentence description and a mono stack tag row.
- **Voice:** present tense where projects are live, past for wrapped. Playful is allowed here (only here).
- **Lead-out hook:** implies "and here's how I actually work" → Fold 4.

#### Fold 4 · My Work Stack (the craft)

- **Job:** show fluency with the tools that make him productive — a PM-native answer to "what's your stack."
- **Question answered:** "How do they actually work day-to-day?"
- **Contents:** full spec in §7.1.
- **Voice:** specific per-tool one-liners ("Cursor for PRDs alongside code so implementation Qs surface at spec time"). Not adjective lists.
- **Lead-out hook:** by now they've seen work, side work, and tooling; the natural next question is "who is this person?" → Fold 5.

#### Fold 5 · About (the person)

- **Job:** turn the résumé signal into a person the reader would want to work with.
- **Question answered:** "Would I want to spend 40 hours a week with them?"
- **Contents:** portrait (250 px square, off-white bg), 3–4 short paragraphs on background, why-fintech, what he's curious about, one lightly personal line.
- **Voice:** warm, still specific. "I got into fintech because…" not "passionate about finance."
- **Lead-out hook:** ends on "here's how to reach me" → Fold 6.

#### Fold 6 · Let's connect (the action)

- **Job:** convert intent into a message that reaches Megh.
- **Question answered:** "Okay, how do I reach out?"
- **Contents:** full spec in §7.2.
- **Voice:** LinkedIn-bio-derived heading, direct CTA, no filler.
- **Lead-out hook:** none — this is the terminal fold. A minimal footer (© year, mono initials) can sit below it but should not compete for attention.

---

**Anti-patterns for the launch (do not add without asking):**

- A testimonials fold without real, attributed quotes.
- A newsletter signup between Work and About.
- A "logos I've worked with" strip that duplicates Fold 2.
- A stats-tile row ("years of experience," "products shipped") — that's résumé, not story.
- Any fold that exists because "the page felt short."

**Pre-launch storyboard review:**

Before merging the launch PR, write the storyboard as six bullets in the PR body — headline + job + hook. If any bullet feels weak, cut or redesign the fold before shipping. It's cheaper here than in front of a recruiter.

---

### 7.5 SEO & head-tag spec for future page types

Shape rules — canonical, OG, Twitter card, JSON-LD graph, discovery block, etc. — are locked in `CLAUDE.md §15`. This section captures the *content* each page type has to fill in when it gets built. The baseline never gets simplified out; new pages only add.

#### Root (`app/layout.tsx`) — already shipped

Baseline `Person + WebSite + ProfilePage` graph, discovery block, canonical, OG profile, Twitter card, favicon. Nothing to change here except when the elevator pitch changes (bump `TITLE`, `DESCRIPTION`, `public/index.md`, `public/llms.txt` together).

#### `/work` (case study index) — future

- `metadata.title`: `"Selected work"` → renders as `"Selected work | Megh Gupta"` via the template.
- `metadata.description`: 1 sentence naming the case-study themes ("Growth PM work at BondScanner, platform PM at Ultra, AI tooling.").
- OpenGraph `type: "website"`, page-specific `og:image` (a grid of case-study covers, generated by `/api/og?type=work-index`).
- JSON-LD: extend the root graph with a `CollectionPage` node whose `mainEntity` is an `ItemList` of the case studies.
- Discovery block: `alternate type="text/markdown"` → `/work/index.md` (Markdown list of case studies).
- Sitemap: added on the same PR.

#### `/work/[slug]` (individual case study) — future

- `metadata.title`: case study headline; auto-suffixed via the root template.
- `metadata.description`: the case study TL;DR (per MDX schema, `CLAUDE.md §5`).
- OpenGraph `type: "article"`, `og:image` from `/api/og/[slug]` (headline metric over a solid accent card, generated dynamically). Include `og:article:author`, `og:article:published_time`, `og:article:tag` (from MDX frontmatter `tags`).
- Twitter card: same `summary_large_image` with the per-case OG image.
- JSON-LD: **extend** the root graph with an `Article` node → `author: { @id: Person }`, `headline`, `datePublished`, `image`, `about` (the tags), `mainEntity` reference from `WebPage`.
- Canonical: `https://www.meghgupta.in/work/[slug]`. If a case study was originally published elsewhere (Notion, Medium, LinkedIn), set canonical to *that* URL and add `rel="alternate"` back to this one — never cannibalize the original's rank.
- Discovery block: `alternate type="text/markdown"` → `/work/[slug].md` (the raw MDX rendered as plain markdown).
- Sitemap: added by iterating `getAllCaseStudies()` in `app/sitemap.ts`.

#### `/lab` and `/lab/[slug]` — future

- `metadata.title`: `"The Lab"` / individual project title.
- OpenGraph `type: "website"` for the index, `"article"` for individual entries.
- JSON-LD: extend with `CollectionPage` (index) and `CreativeWork` nodes per entry — `name`, `description`, `url` (external), `keywords` (stack tags), `creator: { @id: Person }`.
- Same discovery block. Add each lab entry to sitemap.

#### `/about` — future (if separated from the homepage About fold)

- `metadata.title`: `"About"`.
- OpenGraph `type: "profile"` (same as root).
- JSON-LD: extends `Person` on the root graph with deeper `description`, `knowsAbout` (topics: fintech, product management, voice AI, growth), `alumniOf` already present.

#### `/api/og/[slug]` — future dynamic OG images

- `next/og` `ImageResponse`, 1200×630, cream `--bg` background, headline metric in Instrument Serif, cloud favicon in the corner.
- One-line PM voice quote below the metric (from MDX `headline_metric` + author line).
- No auth, no cookies, no user data — safe for any social platform to fetch.

#### Discovery files — living

- `public/llms.txt` — refresh whenever the elevator pitch changes.
- `public/AGENTS.md` — refresh whenever new sections ship (add a "Sections" list once Work / Lab / Stack are live).
- `public/index.md` — refresh whenever `/` copy changes.
- Per-page `.md` alternates (`/work/[slug].md`, `/lab/[slug].md`) — generated from the same MDX source at build time; never hand-maintained separately.

#### Validation checklist (per launch or per new page type)

- [ ] View-source of the new route contains the full discovery block.
- [ ] Google Rich Results Test renders a matching structured-data card.
- [ ] LinkedIn Post Inspector shows the correct OG image and description.
- [ ] `sitemap.xml` includes the new route.
- [ ] `robots.ts` allows the new route (no accidental disallow).
- [ ] All linked `.md` alternates return 200.
- [ ] No hardcoded absolute URLs pointing at a wrong domain (e.g., `www.meghgupta.com` when the site is `www.meghgupta.in`).

---

### 7.6 "Writing" — the product-journey journal

**Placement:** homepage fold between **My Work Stack (§7.1)** and **About**. Reads as "here's how I think" after "here's how I work," before "here's who I am." Also lives as its own top-level section at `/writing` for the full archive and `/writing/[slug]` for individual entries.

**Why it exists:** most PM portfolios stop at case studies. A writing surface signals that Megh reflects on the work as it happens — small learnings, product reviews, opinions on features — which is a durable differentiator vs. résumé + case-studies-only portfolios. It also compounds: every entry is another crawlable page with a real keyword surface, and readers who like one entry are one click away from the case studies and the reach-out form.

**What lives here (all first-person, short-form):**
- **Notes** — quick observations from the day-to-day (a stand-up realization, a Slack thread that changed a decision).
- **Learnings** — post-mortems on a specific thing that worked or didn't.
- **Thoughts / opinions** — takes on a product, market, or PM-craft debate.
- **Ideas** — half-formed product concepts, "I would build X because Y."
- **Case-study mini** — smaller-scope stories that don't earn a full `/work/[slug]` write-up.
- **Product reviews** — a tool or app used substantively (see anti-patterns for the bar).
- **Feature reviews** — a single feature analyzed as if we shipped it (why now, what it costs, what it competes with).

**Content model — MDX frontmatter per entry (`/content/writing/[slug].mdx`):**

```yaml
---
title: "Ten minutes as a Blinkit delivery partner"
slug: "blinkit-ten-minutes"
date: "2026-03-04"                 # first-published, YYYY-MM-DD
updated: "2026-03-11"              # optional, when meaningful
kind: "field-note"                 # see Kind vocabulary below — one required label
tags: ["quick-commerce", "operations"]  # freeform, cross-cutting
excerpt: "Signed up as a rider, ran three deliveries, wrote it up. Here's what I couldn't have seen from a dashboard."
reading_time: "4 min"              # optional; can auto-compute
featured: false                     # true = shows on homepage Writing fold
order: 0                            # tie-breaker among featured
published: true                     # false to draft
canonical: null                    # set to the original URL if cross-posted from Substack/LinkedIn
---
```

**Kind vocabulary (locked — six kinds, curated to Megh's profile):**

Kind is a single required label, chosen from this fixed set. Tags stay open-ended for topics; kind names what *shape of thought* the entry is. Card thumbnails and filter chips key off this field, so keep it stable.

| Kind (slug) | Display label | What it is | Voice register |
|---|---|---|---|
| `field-note` | Field Note | A quick observation from the day-to-day — a Slack thread that changed a decision, a stand-up realization, something spotted in a product used at work. | Short, present-tense, specific to a moment. |
| `learning` | Learning | Retrospective on a shipped decision, a launch that worked or didn't, a mistake and what it cost. | First person, honest attribution, ends with what you'd do differently. |
| `take` | Take | An opinion or hot-take on a product, market, or craft debate (fintech regulation, PM interview format, a category shift). | Direct, position first, argument after. State the take in the first sentence. |
| `idea` | Idea | "I would build X because Y." Half-formed product concepts, feature wishlists for tools you use, market gaps. | Speculative but concrete — name the audience, the shape, and why it doesn't exist yet. |
| `mini-case` | Mini Case | A smaller-scope story than a full `/work/[slug]` — a sub-feature, an experiment, a growth loop that didn't warrant a case study but taught something. | Same structure as a case study but compressed: context → decision → outcome, in ~500-700 words. |
| `teardown` | Teardown | A product or single feature analyzed as if we shipped it — why now, what it costs, what it competes with, what would you have done differently. | Analytical, screenshot-driven, opinionated but sourced. Combines the earlier "product review" + "feature review" kinds. |

New kinds need an explicit ask + a card thumbnail glyph (below) + an update to `lib/writing.ts`. Don't drift the vocabulary silently.

**Procedural thumbnails (locked — no hand-authored images):**

Cards on `/writing` show a dark thumbnail per entry. To avoid asking Megh to author illustrations for every new note, thumbnails are generated deterministically at build time from the entry's `kind` + `slug`. Rendered as inline SVG (no PNG assets, no `next/og` route).

- **Frame:** `aspect-ratio: 3 / 2`, rounded corners matching the card, background `#0E1622` (deeper charcoal than the site's `--fg`), 1px inner border in `rgba(245,235,212,0.08)`.
- **Glyph (center, single stroke, cream `#F5EBD4`, ~2px):** determined by `kind`.
  - `field-note` → map pin outline.
  - `learning` → circular arrow (retry).
  - `take` → typographic quotation mark, oversized.
  - `idea` → simple lightbulb outline.
  - `mini-case` → 3×2 grid of unequal squares (one filled).
  - `teardown` → four small squares in a row, one dashed and marked with an ✕.
- **Background pattern (subtle, `rgba(245,235,212,0.05)`):** picked from `hash(slug) % 4` — dot grid, hairline horizontal rules, hairline vertical rules, or blank. Zero per-entry authoring.
- **No text, no per-entry color variance.** Consistency across the grid > individual expression. If a specific entry ever needs custom art, that's a `hero_image` override on the entry (deferred; add only when the first entry actually needs it).
- **Implementation target:** `components/writing/thumbnail.tsx` — pure SVG, server component, ~40 lines. `getGlyph(kind)` and `getPattern(slug)` as pure functions in `lib/writing.ts`.

**Homepage fold (§7.6a in the storyboard):**
- Job: show that Megh reflects on the work, not just executes it.
- Question answered: "How do they think about product?"
- Contents: 3 most-recent-and-featured entries as small cards — `kind` pill (mono, uppercase), date, title (serif), excerpt (~2 lines), tag chips. Cards link to `/writing/[slug]`.
- Bottom of the fold: `All writing →` link to `/writing`.
- Lead-out hook: implied "and here's who's behind all this" → About.

**`/writing` index page:**
- Reverse-chronological list, grouped by month heading (mono eyebrow).
- Filter chips at the top: `All / Notes / Learnings / Thoughts / Reviews / Ideas / Mini case studies`. Client-side filter, no server round-trip.
- Search deferred (per §6.4 anti-patterns); revisit only at 20+ entries.
- RSS feed at `/writing/rss.xml` — one of the few places a real feed reader still helps recruiters and other PMs follow along.

**`/writing/[slug]` detail page:**
- MDX-rendered body.
- Header strip: `kind` pill, date, "updated" date if present, reading time, tags.
- Prev/next entry links at the bottom, cross-linked to related tags.
- Same SEO/JSON-LD baseline as `/work/[slug]` but with `@type: BlogPosting` on the JSON-LD graph.
- Discovery block includes `alternate type="text/markdown"` → `/writing/[slug].md` (raw MDX).

**Voice rules (per `CLAUDE.md §10`):**
- First person, present tense unless retelling.
- Short opening — one sentence hook, then the story.
- Show numbers when they exist (`ran 3 deliveries in 90 minutes`), skip when they'd be fluff.
- Name products, companies, people you're critiquing directly. No "a certain popular delivery app."
- End with what you'd do next / what you'd want to see next — an active close, not a summary.

**Anti-patterns (do not ship):**
- Product reviews of tools used < 30 min or one week of daily use. State usage duration in the entry.
- "Rewrites" of AI-generated summaries. If it doesn't come from lived experience or original analysis, it isn't a writing entry.
- Entries that duplicate a `/work/[slug]` case study. If the story fits a full case study, write it there; if not, keep this shorter.
- Publishing drafts. Use `published: false`.
- Chasing SEO topics you don't care about. This surface is a *self*-portrait, not a keyword farm.

**Storage decision:** MDX in `/content/writing/[slug].mdx` (matches the case-study system in `CLAUDE.md §5`). `lib/writing.ts` exports `getAllWriting()`, `getWritingBySlug()`, `getRecent(n)`, and `getByKind(kind)`. RSS built from the same array at build time.

**Analytics events to add** (per `CLAUDE.md §6.3`, custom Vercel Analytics — no PII):
- `writing_index_view`
- `writing_entry_view` (property: slug, kind)
- `writing_filter_apply` (property: kind)
- `writing_all_click` (from homepage fold to `/writing`)

**Launch order:**
1. Author 4–6 entries in `/content/writing/` before the surface goes live. An empty section reads worse than none.
2. Ship `/writing/[slug]` first (per-entry pages, MDX + JSON-LD), then `/writing` index, then the homepage fold.
3. RSS in a separate PR after the section is proven.

---

### 7.7 "Experience" — where I have worked

**Placement:** homepage fold immediately after the Hero, before Selected Work. Reads as: *who I am → where I've been → what I shipped there.* Not a résumé block — a scannable trajectory that expands on demand.

**References (three screenshots checked into `docs/references/experience/`):**
- `03-timeline-pills.webp` — the **default** view. Horizontal timeline with a year axis, company pill cards positioned at their era, current role highlighted in warm cream, a dashed "now" marker, "drag sideways" hint underneath.
- `01-list-view.webp` — the **alternate** view. LinkedIn-style vertical stack with logo tiles down the left, dates on the right, tap-to-expand cards.
- `02-hero-with-era-timeline.webp` — inspirational reference for how a horizontal timeline can carry narrative weight; kept for future About-fold ideas, not the direct pattern for this section.

**Both views render the same `lib/experience.ts` data.** The toggle in the top-right (`list / timeline`) swaps presentation only. Default state on load is **timeline** — it's more compact vertically, which matters because Experience is Fold 2 and can't eat too much of the reader's scroll budget.

**Why it exists:** recruiters and hiring PMs form a first-pass "is this senior enough / relevant enough" judgment inside 15 seconds. A tight experience list, above Work, front-loads that context and lets them decide whether to keep scrolling into the case studies. Without it, they scroll into Work with no anchor for what environment those numbers came from.

**Fold job:** trajectory. Question answered: *"Where has this person been?"* Lead-out hook: the current role plants a promise ("here's what I've built at BondScanner") that the next fold (Selected Work) pays off with case studies from that role.

**Content model (`lib/experience.ts`, TS array — no MDX):**

```ts
type ExperienceEntry = {
  slug: string;                  // "bondscanner", "ultra", etc.
  company: string;               // display name, lowercase per reference ("wint wealth")
  role: string;                  // job title, lowercase ("senior product designer")
  logo: string;                  // "/images/experience/bondscanner.svg"
  start: string;                 // "2025-01" (YYYY-MM)
  end: string | "present";       // "2024-12" or "present"
  tagline: string;               // one-line what the company does
  bullets: string[];             // 2–4 short strings, action + evidence per bullet
  current?: boolean;             // true = green dot indicator, defaults from end === "present"
  nda?: boolean;                 // true adds "recent work under NDA" affordance in the expand
  order?: number;                // optional override; default is reverse-chronological by `start`
};
```

**View toggle (top-right of the section):**
- Pill container in `--bg-elevated` with two segments: `list` and `timeline`. Active segment = filled dark pill (`--fg`) with cream text; inactive = transparent with `--fg-muted` text.
- Follows the reference exactly, including the handwritten "try this" arrow the first time a visitor hits the section (drop the doodle after 30 days per client-side flag if we ship it at all — v1 can skip the doodle).
- Toggle state persists in `localStorage` under `mxg.experience.view` so a returning visitor lands on their preferred view.
- Keyboard: `role="tablist"`, each segment a `<button role="tab">`, `aria-selected` toggles, arrow keys move between them.
- Both views render the same data structure below the toggle. Swapping is a client component (`components/experience/section.tsx` with `"use client"` at the top).

---

#### Timeline view (default)

Reference: `docs/references/experience/03-timeline-pills.webp`.

**Layout:**
- Horizontal band across the section's `max-w-5xl` container.
- **Year axis** along the bottom: mono numbers (`2020` … `2027`, `--fg-subtle`) evenly spaced. Extends 1 year past the earliest role and ~6 months past `now` for headroom.
- **Duration band** behind the pills: a soft warm-cream translucent strip (`rgba(246,236,209,0.55)` on dawn palette) spanning from the earliest role's start to the current role's start. Signals "this is the active career span" as one continuous ribbon.
- **Pill cards** positioned by start-date on the axis, each ~360×72px. Contents: 44×44 logo tile (top-left of the pill), company name in sans-semibold 16–17px on line 1, role in sans-regular 13–14px `--fg-muted` on line 2. Wide enough for one company name; overflow with `…` on narrow columns (`wint we…` in the reference).
- **Current role pill** gets the warm-cream fill (`rgba(246,236,209,0.9)`), making it pop against the other neutral-white pills.
- **"now" marker**: dashed vertical rule at today's date, `--accent`-tinted, with a small handwritten-style "now" label above it. (Handwritten style = 400-weight italic serif — no new font).
- **Overlap handling**: when two roles overlap in time (rare — internships during college etc.), stack pills vertically at the same x-position. The godaddy pill floats below the arre-bro pill in the reference; use that pattern.
- **Bottom hint**: small italic serif line `drag sideways, the last N years are in here` where N is computed from the data (`currentYear - firstEntryYear`).

**Interaction:**
- **Desktop scroll**: horizontal scroll on the timeline container. Two-finger touchpad, mouse wheel (shift+wheel for wheel mice), or click-and-drag to pan.
- **Click a pill**: expands a detail panel *below* the timeline (not inline in the row) with the same tagline + bullets used in the list view's expanded state. Only one pill's detail visible at a time. Clicking the same pill again collapses; clicking a different pill swaps the detail.
- **Keyboard**: Tab focuses each pill in chronological order; Enter/Space opens its detail panel; Left/Right arrow keys pan the timeline by ~1 year of x-scroll.
- **Mobile**: native horizontal touch scroll; tap a pill for its detail panel.
- **Reduced motion**: no smooth-scroll animation, no drag inertia, detail panel appears without a height animation.
- **Focus scroll**: when a pill receives keyboard focus off-screen, smooth-scroll it into view (native `scrollIntoView({ block: 'nearest', inline: 'center' })`).

**Screen-reader path**: the timeline is decorative for AT. Under the `<div role="tablist">` toggle, both views live inside `<div role="tabpanel">` regions with the same accessible content — screen readers can jump to the list view via the tablist without a lost trail.

---

#### List view (alternate)

Reference: `docs/references/experience/01-list-view.webp`.

**Layout — collapsed row (default state):**
- Left column: 44×44 rounded logo tile with a hairline border. A small green dot in the top-right corner if `current`.
- Middle: company name (sans, semibold, 18–20px, lowercase) on line 1; role (sans, regular, 14–15px, `--fg-muted`) on line 2.
- Right column: date range in mono type, `--fg-muted`, right-aligned (`sep 2025 to present`, `jun 2023 to sep 2025`, single-year entries render as `2022`).
- A single chevron `>` (rotating to `v` when expanded) at the far right hints the expand affordance.
- Timeline gutter: vertical hairline between the logo tiles, connecting every entry so it reads as one continuous history.

**Layout — expanded row (on click / Enter / Space):**
- Reveals a tagline line first: one sentence italicized in `--fg-muted` describing the company ("making fixed income investing feel simple and trustworthy.").
- Then 2–4 bullets, each prefixed with a small warm accent asterisk `*` in the site's accent color, matching the reference. Bullet copy is one line where possible, wraps to two max.
- No embedded images or logos beyond the row's own tile — this is a fast-read block, not a case study.
- 220ms ease-out expand, respects `prefers-reduced-motion` (jumps instantly, no height animation).

**Interaction:**
- Whole row is a `<button>` (semantic — not a `<div onClick>`), `aria-expanded` toggles, `aria-controls` points at the expand region.
- Keyboard: `Enter` and `Space` toggle; `Tab` moves to next row.
- Only one row expanded at a time on mobile (accordion-style) to keep the fold's height bounded. Desktop allows multiple.
- No routing changes — expand is inline, URL doesn't change. If we ever want deep-linking (`/#experience/bondscanner`), add later.

**Voice rules (per `CLAUDE.md §10`):**
- All company names and role titles in lowercase. It's an editorial choice from the reference and holds across the section.
- Tagline says what the *company* does in one line. Not what you did — that's the bullets.
- Bullets are verb-first, numbers-forward. "shipped X → Y," "grew AUM ₹50Cr in 6 months." Not "responsible for" or "helped with."
- NDA cases: one bullet acknowledging it directly. Reference language: *"recent work is under NDA, happy to walk through it on a call."*
- Present tense only for current role. Past tense for prior roles, even if the company still exists.

**Seed entries (draft — Megh to confirm and refine):**

```ts
[
  {
    slug: "bondscanner",
    company: "bondscanner",
    role: "product manager",
    logo: "/images/experience/bondscanner.svg",
    start: "2025-01", end: "present", current: true,
    tagline: "sebi-registered online bond platform making bond investing simple for retail investors.",
    bullets: [
      "TODO: shipped X flow that did Y (headline metric).",
      "TODO: growth loop / SEO engine / AI-review-tool bullet.",
      "TODO: one more concrete shipped thing with numbers.",
    ],
  },
  {
    slug: "ultra",
    company: "ultra",
    role: "platform product manager",
    logo: "/images/experience/ultra.svg",
    start: "TODO", end: "TODO",
    tagline: "TODO: one-line what ultra does / did.",
    bullets: [
      "TODO: reinvestment loop bullet with numbers.",
      "TODO: one more shipped thing.",
    ],
  },
  // Add earlier roles (internships, freelance if meaningful) in the same shape.
]
```

Draft entries ship with `TODO:` placeholders per `CLAUDE.md §6.1` conventions. Fill from Megh's resume, LinkedIn, or offer letters — never invent titles or dates.

**Anti-patterns:**
- **No stat tile row.** ("2.5 years in PM," "3 companies") The reader can compute it from the dates. Adding a tile makes the section read as résumé instead of story.
- **No "responsibilities included" language.** Every bullet is something you *shipped*, *grew*, *scoped*, *ran*. Present the outcome, not the job description.
- **No filler roles.** A 2-month contract that didn't ship anything meaningful stays off. Better to have three entries with real bullets than seven with fluff.
- **No unverified logos.** Use official brand assets or ask before creating a stand-in.
- **Do not skip the view toggle in v1.** Both views ship together — timeline default, list as the alternate — and the toggle in the top-right is the primary control. Skipping either view means recruiters on assistive tech or narrow mobile viewports lose the accessible path.

**Storage decision:** TS array in `lib/experience.ts`. Matches `lib/lab.ts` shape. Not MDX because entries are structured and short; no long-form body earns its way in here. If a role warrants a longer story, that's a `/writing/mini-case` entry (§7.6) linked from the experience bullets, not an expanded experience row.

**Analytics events** (per `CLAUDE.md §6.3`, custom Vercel Analytics — no PII):
- `experience_view_toggle` (property: `to` = `list | timeline`) — which view the visitor lands in.
- `experience_pill_open` (property: slug) — click on a timeline pill.
- `experience_row_expand` / `experience_row_collapse` (property: slug) — list-view expands.

Track view distribution over time — if 95% of visitors stay in the default view, we can consider dropping the toggle in a future PR.

**Launch order:**
1. Author entries in `lib/experience.ts` from Megh's real history before wiring the fold. Empty rows or `TODO` stubs cannot ship on production.
2. Ship the **list view first** (layout is simpler, gets the data model + expand behavior proven). Toggle is present but the timeline segment is a placeholder.
3. Ship the timeline view in a follow-up: layout + horizontal scroll + click-to-open-detail-panel.
4. Add drag-to-pan and keyboard pan in a third commit — these are the trickiest interactions and the section works without them.
5. Wire all analytics events in the same commit as the timeline ships.

**Visual reference (locked layout pattern):**

Reference screenshots checked into `docs/references/writing/`. Follow this layout language when building — don't invent a new one.

- **Homepage fold** — same card grammar as the `/writing` index, condensed to three. Reference: `docs/references/writing/02-index-grid.webp` (used to be the quiet-list layout in `01-homepage-fold.webp`; that layout is deprecated).
  - Mono uppercase eyebrow (`WRITING`, wide tracking), on the same off-white body bg.
  - Serif headline underneath, ~40–48px, e.g. *"notes on product and building"* — Megh writes his own version.
  - **Three cards in a 3-column row on desktop, 2 on tablet, 1 on mobile.** Each card is identical in grammar to the `/writing` index card: procedural thumbnail (see Kind vocabulary and thumbnail spec below), mono uppercase category label pulled from `kind` display name, sans semibold title (2 lines max, truncated with `…`), 2-line excerpt, mono date + read time.
  - Three entries are picked in this order: `featured: true` first (by `order`), then most-recent-published; cap at 3. If fewer than 3 published entries exist, hide the fold entirely rather than shipping half-empty cards.
  - Below the row: a `view all →` CTA aligned to the right (or centered on mobile), taking the reader to `/writing`.
  - No filter chips on the homepage fold — those live on `/writing` only.
- **`/writing` index** — `docs/references/writing/02-index-grid.webp`
  - Same eyebrow (`BLOG` or `WRITING`) + serif headline treatment, one step larger than the homepage fold.
  - Grid of cards, 3 columns desktop / 2 tablet / 1 mobile.
  - Each card: a large dark thumbnail (per-entry accent art, cream stroke on charcoal — same tone across cards for consistency), category label (mono, uppercase, small, above the title), title (sans, semibold, 2 lines max, truncated with `…`), 2-line excerpt, date + read time (mono, muted) below.
  - No filter chips in v1; add them only once entry count > 15.
- **Entry detail** — `docs/references/writing/03-entry-detail.webp`
  - Full-width prose page, ~640px reading column, centered.
  - Breadcrumb `← all posts` at top-left of the reading column.
  - Title (serif, ~32–40px), then a meta strip: date · reading time · category (mono, muted, one line, dot-separated).
  - Body: sans, ~16–18px, line-height 1.65. Subheads in bold sans (not serif) — the serif is reserved for the title on this page. Short paragraphs. No pull-quotes. Real quotes go inline in `"..."` — no `<blockquote>` styling.
  - No sidebars, no related-posts rail, no sticky share buttons. The page is a reading page.
  - Footer of the reading column: small "one last thing before you go" line + a light signature (mono initials or single-word signoff). Keep it quiet — the value is the prose.

Any of the above can be relaxed later; if we do, note the deviation in the PR that ships it, and update this section in the same PR.

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
