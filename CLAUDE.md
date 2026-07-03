# CLAUDE.md

> **Read this fully on every new session.** This file is the source of truth for the project. If you're about to do something that contradicts a locked decision here, stop and flag it instead.

---

## 1. Project context

**What:** A personal portfolio website for Megh Gupta — Product Manager (fintech, growth, AI tooling).

**Why:** Conversion funnel for active job search. Goal is moving a recruiter or hiring PM from "skimming" to "I want to talk" inside 60 seconds.

**Who reads it:** Recruiters, hiring PMs, founders at VC-backed fintechs and AI-first startups. Mobile-heavy traffic (assume ~60% mobile).

**Tone of voice:** Confident, specific, slightly playful in the Lab section. Numbers-forward. No corporate jargon. No "passionate about" or "results-driven."

**Reference site for vibe:** kashwiaggarwal.com (editorial PM portfolio, not a copy target).

---

## 2. Locked decisions (do not relitigate without asking)

| Decision | Locked choice |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript**, strict mode on |
| Styling | **Tailwind CSS v4** |
| Components | **shadcn/ui** (copy-paste, owned in `/components/ui`) |
| Content format | **MDX** for case studies, about, lab entries |
| Hosting | **Vercel** (auto-deploy from `main` branch on GitHub) |
| Analytics | **Vercel Analytics** + **Vercel Speed Insights** |
| Email | `mailto:` link first. No form unless explicitly requested. |
| Fonts | **Instrument Serif** (headlines), **Inter** (body), **JetBrains Mono** (code/tags). Load via `next/font`. |
| Package manager | **pnpm** |
| Linting/formatting | **Biome** (single tool for both) |
| Node version | 20 LTS or newer |

If Megh asks for a change that breaks one of these (e.g. "let's use Framer Motion everywhere"), surface the tradeoff first, don't just implement.

---

## 3. Design system (the small set of decisions everything else inherits)

### Color tokens
Define in `app/globals.css` as CSS variables. Tailwind reads them via `@theme`.

```css
:root {
  --bg: #FAFAF7;          /* off-white, not pure white */
  --bg-elevated: #FFFFFF; /* cards, modals */
  --fg: #111111;          /* primary text */
  --fg-muted: #555555;    /* secondary text */
  --fg-subtle: #999999;   /* tertiary, captions */
  --border: #E8E6E0;      /* hairlines */
  --accent: #1F4D3A;      /* muted bond-paper green — the ONE accent */
  --accent-fg: #FAFAF7;   /* text on accent backgrounds */
}
```

**Rule:** No other colors. If a design needs a fifth color, ask first.

### Type scale
- `display`: 4rem / 64px, Instrument Serif, line-height 1.05 (hero only)
- `h1`: 2.5rem / 40px, Instrument Serif, line-height 1.1
- `h2`: 1.75rem / 28px, Instrument Serif, line-height 1.2
- `h3`: 1.25rem / 20px, Inter Semibold, line-height 1.3
- `body`: 1rem / 16px, Inter Regular, line-height 1.6
- `small`: 0.875rem / 14px, Inter Regular, line-height 1.5
- `mono`: 0.875rem / 14px, JetBrains Mono (tags, metrics annotations)

### Spacing
Use Tailwind defaults (`p-4`, `gap-8`, etc.). For section padding on the homepage, use `py-24 md:py-32`. Section max-width: `max-w-5xl`. Case study prose max-width: `max-w-2xl` (readability over fill).

### Motion
**Sparing.** Acceptable:
- Fade-up on scroll for section reveals (use `framer-motion` only if requested; otherwise pure CSS).
- 150ms ease-out hover transitions on cards and links.

**Not acceptable** without explicit ask: parallax, scroll-jacking, cursor effects, mouse-tracking glows, page transitions.

---

## 4. Repository structure

```
/
├── app/
│   ├── layout.tsx              # Root layout, fonts, analytics
│   ├── page.tsx                # Homepage (hero, work, about, contact)
│   ├── globals.css             # Color tokens, base styles
│   ├── work/
│   │   ├── layout.tsx          # Case study shell (back link, meta strip)
│   │   └── [slug]/
│   │       └── page.tsx        # Renders MDX from /content/work/[slug].mdx
│   ├── lab/
│   │   └── page.tsx            # The Lab grid
│   └── about/
│       └── page.tsx            # Long-form about (optional)
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, card, etc.)
│   ├── hero.tsx
│   ├── work-card.tsx
│   ├── lab-card.tsx
│   ├── contact.tsx
│   ├── nav.tsx
│   └── mdx/                    # Custom MDX components (Callout, Metric, Figure)
├── content/
│   ├── work/                   # One MDX per case study
│   │   ├── seo-engine.mdx
│   │   ├── ai-call-analysis.mdx
│   │   ├── ultra-reinvestment.mdx
│   │   └── bondscanner-launch.mdx
│   ├── lab/                    # One MDX per side project (or single JSON)
│   └── about.mdx
├── lib/
│   ├── work.ts                 # getAllCaseStudies(), getCaseStudyBySlug()
│   └── lab.ts                  # getAllLabProjects()
├── public/
│   ├── images/work/[slug]/     # Screenshots per case study
│   └── og/                     # OG images
├── CLAUDE.md                   # This file
├── README.md                   # Human-readable setup
├── biome.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**Adding a new case study = adding one MDX file in `/content/work/`.** No new code unless the MDX needs a custom component.

---

## 5. MDX case study schema

Every case study MDX file MUST have this frontmatter:

```yaml
---
title: "How we 2x'd organic traffic at BondScanner in 3 months"
slug: "seo-engine"
role: "Growth PM"
timeline: "Jan 2026 – Q2 2026"
team: "Solo PM + 2 engineers + 1 content lead"
stack: ["Next.js", "Programmatic SEO", "Schema.org", "GSC"]
tags: ["Growth", "SEO", "Fintech"]
headline_metric: "2x organic clicks in 3 months"
supporting_metrics:
  - "350+ compliance-safe blogs published"
  - "26,000+ programmatic bond pages"
  - "Ranked #3 for 'hedge funds in india'"
featured: true              # appears on homepage
order: 1                    # display order when featured
hero_image: "/images/work/seo-engine/hero.png"
published: true             # set false to draft
---
```

Body structure (in this order, even if some sections are short):

1. **TL;DR** — 3 bullets, above the fold.
2. **Context** — why this mattered.
3. **Approach** — decision logic, not activity log.
4. **Execution** — what shipped, with screenshots / Figma embeds / Loom links.
5. **Outcome** — headline metric + supporting numbers + qualitative wins.
6. **Reflection** — 1 paragraph, what I'd do differently.
7. **What I owned vs. team owned** — honest attribution.

Custom MDX components available:
- `<Metric value="2x" label="organic clicks" />` — big number block
- `<Figure src="..." caption="..." />` — screenshot with caption
- `<Callout type="insight | tradeoff | learning">...</Callout>` — pull quote
- `<LoomEmbed id="..." />` — Loom video embed
- `<FigmaEmbed url="..." />` — Figma file embed

---

## 6. Natural-language → tech task translation

This is the most important section. Megh speaks like a PM. You translate to code without asking back unless ambiguity is severe. Below is the playbook.

### 6.1 Content & copy changes

| He says | You do |
|---|---|
| "Update my about" | Edit `/content/about.mdx`. Confirm the new copy after. |
| "Change my one-liner" | Edit the `hero.tsx` component's `tagline` prop in `app/page.tsx`. |
| "Add a new case study about X" | Create `/content/work/[slug].mdx` with full frontmatter scaffolded. Fill in what you can from context, mark gaps with `TODO:` comments. Set `featured: false` initially. |
| "Make this case study featured" | Set `featured: true` and assign an `order` value in its frontmatter. |
| "Reorder the work cards" | Update `order` values in frontmatter. Do not introduce a separate config file. |
| "Add a project to the Lab" | Append entry to `/content/lab/[slug].mdx` (or `/lib/lab.ts` data array if we kept it inline — check which pattern is in use). |
| "Hide this case study" | Set `published: false`. Do not delete. |

### 6.2 Visual / styling changes

| He says | You do |
|---|---|
| "Make the hero pop more" | Default move: increase display type size by one step AND add the accent color to one element (e.g. underline a key word). Do NOT add motion or images without asking. |
| "The cards feel cramped" | Increase `gap-` on the grid by one Tailwind step and `p-` on the card by one step. Show before/after. |
| "It feels too plain" | Add one of: (a) a subtle background texture/gradient on the hero, (b) accent-colored underlines on key headline words, (c) a small monospace label above each section header. Pick one, not three. |
| "Make it more editorial" | Tighten body line-height to 1.5, increase paragraph margin-bottom, switch H1/H2 to Instrument Serif if not already. |
| "Make it look more like a dev/builder" | Apply only inside `/lab` — add JetBrains Mono tags, terminal-style code blocks, a hairline border treatment. Do not change the homepage. |
| "Mobile looks bad" | First check container padding, font-size scaling, and image overflow. Run `npm run dev` and check at 375px width. Don't redesign — fix breakpoints. |
| "Add an accent color" | Refuse softly. Point at the locked single-accent rule in Section 3. If he insists, ask which existing accent role it should replace. |

### 6.3 Functionality changes

| He says | You do |
|---|---|
| "Add analytics" | Install `@vercel/analytics` and `@vercel/speed-insights`. Wire into root layout. Two lines each. |
| "Add a contact form" | Push back once: confirm `mailto:` isn't sufficient. If he confirms he wants a form, use Resend + a server action. No third-party form builders. |
| "Add a Calendly link" | Add a secondary CTA button in the contact section linking to his Calendly URL. Ask for the URL if not provided. |
| "Add SEO meta tags" | Use Next.js `metadata` export on each page. Generate per-case-study OG images via `next/og` route at `/api/og`. |
| "Add a blog" | Push back. Suggest using the Lab section or linking to existing writing instead. A blog is a maintenance burden. Only build if he confirms. |
| "Add dark mode" | Push back. Single light theme is locked. Ask if he wants to relitigate or scope a dark variant. |
| "Add a CMS" | Push back hard. MDX in the repo IS the CMS. A headless CMS adds cost, latency, and a vendor for zero benefit at this scale. |
| "Make it faster" | Run Lighthouse. Fix in this order: image optimization (`next/image`, AVIF), font loading (`display: swap`, subset), JS bundle (dynamic import heavy components), third-party scripts. Don't pre-optimize. |
| "Add a search" | Push back. With 4-6 case studies, search is overkill. Reconsider only at 20+ entries. |

### 6.4 Deployment & infrastructure

| He says | You do |
|---|---|
| "Ship it" / "Push live" | `git add -A && git commit -m "[descriptive message]" && git push`. Vercel auto-deploys. Confirm preview URL works first if it's a substantial change. |
| "Set up the domain" | Walk him through Vercel domain settings + DNS records at his registrar. Don't try to do this yourself. |
| "Add a redirect" | Edit `next.config.ts` `redirects()` array. Confirm source/destination/permanent status. |
| "Rollback" | `git revert HEAD && git push`. Don't `reset --hard` shared branches. |

### 6.5 When to ask back (don't be a robot)

Translate aggressively, but ask if ANY of these are true:
- The change touches more than 3 files AND he didn't describe it precisely.
- It would break a locked decision in Section 2.
- It conflicts with a recent decision in the conversation.
- It requires a paid third-party (Resend, Tinybird, etc.) he hasn't approved.
- It would noticeably degrade Lighthouse performance, SEO, or accessibility.

When asking, ask ONE question with 2-3 concrete options, not open-ended.

---

## 7. Quality bar (definition of done)

Before declaring any task complete, verify:

- [ ] TypeScript builds with no errors (`pnpm build`).
- [ ] Biome reports no issues (`pnpm check`).
- [ ] Lighthouse scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (on the homepage at minimum).
- [ ] No console errors or warnings in dev mode.
- [ ] Renders correctly at 375px, 768px, and 1440px widths.
- [ ] All images use `next/image` with `alt` text. No `<img>` tags.
- [ ] All external links have `rel="noopener noreferrer"` and open in new tab where appropriate.
- [ ] All interactive elements are keyboard-navigable and have focus states.
- [ ] No hardcoded colors outside the CSS variables defined in Section 3.

For a new case study specifically:
- [ ] Frontmatter complete (no missing required fields).
- [ ] Hero image present and optimized (AVIF or WebP, < 200KB).
- [ ] At least one supporting visual in the body.
- [ ] Headline metric appears above the fold.
- [ ] Reads cleanly at 30-second scan and 5-minute deep read.

---

## 8. Common workflows

### Adding a new case study from scratch

```
1. Read /content/work/seo-engine.mdx as template.
2. Create /content/work/[new-slug].mdx with full frontmatter.
3. Create /public/images/work/[new-slug]/ directory.
4. Scaffold all 7 body sections with TODO comments where content is missing.
5. Set featured: false, published: true.
6. Run pnpm dev, visit /work/[new-slug], verify rendering.
7. Report back what's missing so Megh can fill it in.
```

### Promoting a case study to homepage-featured

```
1. Open the case study's MDX frontmatter.
2. Set featured: true.
3. Set order to the desired position (1-4).
4. If 4 are already featured, ask which to demote.
5. Verify the homepage shows the new card.
```

### Changing the accent color

```
1. Update --accent and --accent-fg in app/globals.css.
2. Search the codebase for any hex colors outside globals.css. Fix.
3. Verify contrast ratios meet WCAG AA (4.5:1 for body, 3:1 for large text).
4. Take a screenshot of the homepage at 1440px and confirm with Megh.
```

### Setting up a fresh local dev environment

```
pnpm install
cp .env.example .env.local   # if env vars exist
pnpm dev                      # opens at localhost:3000
```

---

## 9. What NOT to do (anti-patterns)

- **Do not add dependencies casually.** Every new package is a long-term cost. Ask if it's worth it. Prefer writing 30 lines yourself over adding a 50KB dep.
- **Do not introduce new design tokens** (colors, fonts, spacing units) without flagging it.
- **Do not write inline styles.** Tailwind classes only.
- **Do not use `any` in TypeScript.** Use `unknown` + narrowing, or define the type.
- **Do not commit secrets.** Use `.env.local` (gitignored). Reference via `process.env.X`.
- **Do not use client components when server components work.** Default to server. Add `"use client"` only when needed (state, effects, browser APIs).
- **Do not write CSS files** beyond `globals.css`. All styling in Tailwind.
- **Do not add `<form>` tags inside React without a clear onSubmit handler** — they cause full page reloads if not handled.
- **Do not over-engineer.** This is a portfolio. It does not need a state management library, a CMS, an i18n framework, or a service worker.

---

## 10. Tone & writing conventions (for any copy you draft)

When you generate copy (case study draft, hero tagline, project description), match this voice:

- **Specific over vague.** "₹50Cr AUM in 3 months" not "significant growth."
- **Active verbs.** "Shipped," "designed," "scoped." Not "was responsible for."
- **Honest attribution.** When ownership is shared, say so. "Contributed to" is fine.
- **Short sentences.** Average 15 words. If a sentence runs past 25, split it.
- **No filler.** Cut "in order to," "it is important to note," "leverage," "synergy," "passionate."
- **One idea per paragraph.** No walls of text.
- **Numbers as evidence, not decoration.** Every number should earn its place by changing the reader's belief.

If you draft something and aren't sure it matches this voice, mark it `[draft — please review tone]` so Megh knows to check.

---

## 11. Session kickoff checklist

At the start of every session, before making any changes:

1. Read this CLAUDE.md fully (you're doing it now).
2. Skim `git log --oneline -20` to see recent work.
3. Check `git status` for uncommitted changes.
4. Ask Megh what we're working on if it's not clear from the opening message.
5. Confirm any destructive operation (delete file, force push, drop dependency) before doing it.

---

## 12. Contact / escalation

If something here is wrong or out of date, edit this file in the same PR as the change that makes it wrong. CLAUDE.md is living documentation — stale docs are worse than no docs.

End of file.
