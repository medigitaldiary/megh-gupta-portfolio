# HANDOFF.md

> **Start here.** If you're a new teammate, a new Claude session, or Future
> Megh after a break, this is the doc that gets you productive in 10 minutes
> without reading every file. It points at the authoritative docs for each
> topic and keeps a running log of what's been shipped and what's open, so
> the project can migrate cleanly between people, machines, or AI sessions.

Last updated: 2026-10-28

---

## 1. The 10-minute read order

Open these in order. Stop when you have what you need.

1. **This file.** Current state, recent decisions, what's in flight.
2. **`CLAUDE.md`** — the project source of truth. Locked decisions
   (framework, fonts, palette, hosting, package manager), repo structure,
   natural-language → tech-task translation playbook, quality bar, branch
   strategy, SEO baseline, fold-based storyboarding rules. **Any new
   session should read this fully.**
3. **`PRD.md`** — product requirements. What the site is for, who reads it,
   the fold-by-fold spec (§7 covers Hero, Experience, Selected Work, Lab,
   Writing, About + Stack, Connect), and the deferred list.
4. **`OPEN_ITEMS.md`** — the launch-blocker punch list. Shrinks as items
   land, grows as new ones surface. If you want to know what's left before
   `dev → main` promotion flips production from coming-soon to the full
   portfolio, this is the file.
5. **`README.md`** — human-readable dev setup (`pnpm install`, `pnpm dev`,
   where things live).
6. **`Portfolio_Brief.md`** + **`Skeleton_PRD.md`** — older framing docs,
   kept for history. Only read if a decision in CLAUDE.md or PRD.md cites
   them.
7. **`Claude_Code_Kickoff_Prompt.md`** — the original one-shot prompt used
   to seed the project. Historical. Read if you want to understand why the
   repo is shaped the way it is.

Crawler-facing files (don't need these to work on the code, but they
exist and should stay in sync with the site copy):

- **`public/AGENTS.md`** — guidance for AI agents visiting the live site.
- **`public/llms.txt`** — elevator pitch for LLM crawlers.
- **`public/index.md`** — Markdown mirror of the homepage.

---

## 2. What this project is

A personal portfolio for Megh Gupta — Product Manager (fintech, growth,
AI tooling). Live at **[www.meghgupta.in](https://www.meghgupta.in)**.
Currently a coming-soon page while the full portfolio is built on `dev`;
on launch day the plan is to merge `dev → main` and flip the homepage.

Framework / stack is locked in `CLAUDE.md §2` — Next.js 15 App Router,
TypeScript strict, Tailwind v4, shadcn/ui, MDX for case studies, Vercel
hosting, pnpm, Biome.

**Fonts (as of PR #60, now on dev):** Geist Sans (display + body), Geist
Mono (code / tags), Kalam (handwritten greeting). The old
Oswald + Satoshi + JetBrains Mono stack is retired.

**Palette (as of PR #60, now on dev):** Oatmeal / Pine Green / Soft Lilac.
Pine on `--fg` and `--accent` (monochrome brand). Lilac is `--highlight`,
decorative only, never chrome. Tokens live in `app/globals.css :root`.

---

## 3. Branches and environments

Per `CLAUDE.md §13`:

| Branch | Vercel environment | What lives there |
|---|---|---|
| `main` | Production (`www.meghgupta.in`) | Current public site: coming-soon page |
| `dev` | Preview | Full portfolio in progress — case studies, folds, lab |

Feature branches follow `mxg/<slug>`, branch off `dev`, PR back to `dev`.
Never push directly to `main` or `dev`. Hotfixes to production branch off
`main` with the same `mxg/hotfix-<slug>` convention and PR to `main`.

### Open PRs as of 2026-10-28

- **PR #62 — `dev → main`** (draft). Promotes three merged PRs to
  production: #57 (case study system + SEO Engine rewrite), #60 (global
  fonts + palette + v3 chrome), #61 (one-line coming-soon headline).
  Merging this is the next ship. Impact on production is covered in the
  PR body.
- **PR #59 — `mxg/ai-call-analysis-case-study → dev`** (draft). Adds the
  AI Call Analysis Pipeline case study (new 11-section MDX + reusable
  Pipeline pattern + iframe-embedded live artifact at
  `public/artifacts/ai-call-pipeline.html` + the first draft of
  `STYLE.md` with the zero-em-dash policy). Waiting on content review per
  the design brief's accuracy checklist (rubric criteria, staged
  rollout, "vibe-coded end-to-end" phrasing, tech-decision trade-offs,
  related internal AI tools list).

### Feature branches with unmerged work

Each is pushed to origin. Pick one up by `git checkout <branch>`.

- `mxg/case-study-highlighter-tier1` — Tier 1 lilac highlighter surfaces
  for case study pages (hero eyebrow + HeadlineStrip page-load sweep,
  Callout eyebrow + Quote attribution scroll sweep, Pill[tag] hover).
  Deferred by Megh pending visual review.
- `mxg/global-fonts-and-palette` — merged into dev via PR #60; branch
  kept around.
- `mxg/coming-soon-headline-one-line` — merged into dev via PR #61.
- Many older branches (`mxg/about-me-v2`, `mxg/bookshelf-fold-v2`,
  `mxg/case-study-covers`, etc.) are already merged or superseded; see
  `git log` on the branch to confirm before deleting.

---

## 4. What's shipped recently (session log)

Reverse chronological. Append new entries at the top as work ships.

### 2026-10-28

- **PR #62 opened as draft** (`dev → main`) — promotes the three merged
  dev PRs below to production. Covers the coming-soon one-line fix (the
  trigger) plus the palette + fonts + chrome promotion and the case-study
  system rewrite. Not merged yet; waiting on review.

### 2026-10-27

- **PR #61 merged** (`dev`) — coming-soon headline fits on one line at
  every viewport. Dropped the stepped `text-[3.5rem] md:text-[6rem]`,
  swapped to `font-size: min(7.5vw, 6rem)` with `whitespace-nowrap` and
  tighter `letter-spacing: -0.03em`. Applied to both `coming-soon.tsx`
  and `coming-soon-with-paper.tsx`.
- **PR #60 merged** (`dev`) — promoted Geist typography + Oatmeal / Pine
  Green / Soft Lilac palette + v3 atmospheric chrome (ambient lilac
  washes, hero word highlighter sweep, section-eyebrow scroll-triggered
  highlighter, hero greeting sun, lilac text selection, focus rings,
  link hover underlines, shelf wall-shadow + preview-card chrome, card
  hairlines) from the `/preview/v3` scope up to the global stack in
  `app/layout.tsx` + `app/globals.css`. `CLAUDE.md §2 + §3` updated to
  match. `/preview/v2` and `/preview/v3` kept as no-op scopes so
  bookmarks don't 404.

### 2026-10-23 to 2026-10-26 (summarized from prior sessions)

- **PR #57 merged** (`dev`) — case study design system scaffolded under
  `components/case-study/` (primitives: Pill, Quote, Metric, Figure;
  patterns: HeadlineStrip, Callout, Section wrapper; `one-offs/`
  convention for case-study-specific wrappers). SEO Engine MDX rewritten
  end-to-end under the new system. `/preview/case-study-kit` route added
  for spot-checks.
- **PR #58 merged** (`main`) — v3 hero word highlighter + section-eyebrow
  highlighter. Later rolled up into the global promotion in PR #60.
- **PR #56 merged** (`main`) — v3 preview palette (Oatmeal / Pine /
  Lilac). Later promoted globally in PR #60.
- **PR #55 merged** (`main`) — interactive 3D bookshelf for Fold 3
  (Selected Work). Books lean on the shelf, straighten on hover, open to
  reveal a preview card.
- **PR #54 merged** — Experience fold tooltip + 2027 at the right edge.
- **AI Call Analysis case study drafted** on
  `mxg/ai-call-analysis-case-study` (PR #59). 11-section MDX, new
  Pipeline interactive pattern, horizontal flow diagram embedded as a
  live Claude artifact via iframe
  (`public/artifacts/ai-call-pipeline.html`). Still draft pending review
  of the accuracy guardrails from the design brief.
- **Zero em-dash policy introduced** on the same branch. Lives in
  `STYLE.md` at the repo root. Replacement rules: period / colon /
  comma / parentheses / "to" depending on context. Hyphens and en dashes
  still allowed. Enforcement: `grep -rn "—" content/ app/ components/
  lib/` should return nothing. Code comments are exempt (STYLE §Scope).

---

## 5. Where things live (quick map)

Full repo structure is in `CLAUDE.md §4`. The high-signal paths:

```
app/
├── layout.tsx                    # Root: fonts, metadata, JSON-LD, analytics
├── globals.css                   # Color tokens + v3 chrome (promoted)
├── page.tsx                      # Current: <ComingSoon /> on main, same on dev
├── work/[slug]/page.tsx          # Case study renderer (MDX)
├── preview/                      # Scoped experiments; v2 and v3 are no-ops
└── preview/case-study-kit/       # Internal preview of the case study system

components/
├── coming-soon.tsx               # Live production homepage
├── coming-soon-with-paper.tsx    # Paper-art variant (/preview/a, /b, /c, …)
├── hero.tsx                      # Full-portfolio hero (used on dev homepage)
├── case-study/                   # Primitives + patterns + one-offs
├── mdx/                          # Custom MDX components for case studies
└── (plus work-card, work-shelf, nav, contact, lab-*, etc.)

content/
└── work/*.mdx                    # One case study per file

lib/
├── work.ts                       # Case study registry
└── (plus writing.ts, lab.ts, experience.ts)

public/
├── images/work/[slug]/           # Case study hero / body images
├── images/v3/                    # Highlighter stroke + hero sun
└── artifacts/                    # Embedded Claude artifacts (iframed)
```

---

## 6. Quality gates before shipping

Enforced per `CLAUDE.md §7`:

- `pnpm build` must be clean.
- `pnpm biome check` must be clean (format + lint, single tool).
- Lighthouse on `/`: Performance / Accessibility / Best Practices / SEO
  all ≥ 95.
- Renders at 375 / 768 / 1440 widths. No horizontal scroll on mobile.
- No hardcoded colors outside `:root` tokens.
- Case studies: every MDX frontmatter field present (see `CLAUDE.md §5`
  for the schema).
- No em dashes in content (see `STYLE.md`).

---

## 7. If you're an AI session picking this up

Minimal onboarding:

1. Read `CLAUDE.md` fully — it's the operating manual and overrides any
   default behavior.
2. Read `PRD.md §7` for the fold-by-fold spec of the full portfolio.
3. Read Section 4 of this file to see what shipped recently and what's
   in flight.
4. Check `git log --oneline -20` and `git status` for recent commits and
   working-tree state.
5. Ask Megh what to work on if not clear from the opening message. Match
   his natural-language asks to the translation table in `CLAUDE.md §6`.
6. Don't relitigate anything in `CLAUDE.md §2` (locked decisions) without
   asking first.
7. Attribution footer on every GitHub comment / review you post. Co-author
   trailer on every commit per the per-session attribution guidance.

---

## 8. If you're migrating this to a new machine

```bash
# One-time setup
git clone https://github.com/medigitaldiary/megh-gupta-portfolio.git
cd megh-gupta-portfolio
pnpm install

# Dev loop
pnpm dev            # localhost:3000, Turbopack
pnpm build          # production build (used by Vercel)
pnpm biome check    # format + lint
```

Vercel is wired to `main` (production) and auto-builds every push + PR
preview. No manual deploy step. DNS, env vars, and analytics are
configured in the Vercel dashboard, not in the repo.

---

## 9. How to keep this file useful

- When a PR merges, add a one-line entry to Section 4 (reverse chrono).
- When a branch gets a decision locked, update Section 3 and `CLAUDE.md`
  in the same PR.
- When a new context doc is added to the repo, add it to Section 1.
- When something in here goes stale, fix it in the same PR as the change
  that made it stale. Stale handoff docs are worse than no handoff docs.

End of file.
