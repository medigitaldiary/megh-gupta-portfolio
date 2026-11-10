# Deferred folds · post-launch log

> Context record for the three homepage folds that were cut from the launch storyboard. Keep this file as the single home for every thought, spec and asset list tied to Lab, Writing and Stack so the work can resume with no re-derivation.

**Current launch storyboard (CLAUDE.md §14):** Hero → Experience → Selected Work → About → Let's connect. Four content folds plus the contact CTA.

**Why these three were deferred:** the portfolio's first job is a job-search conversion funnel. Lab and Writing cost design and content time that does not move a recruiter from "skimming" to "I want to talk" in the first 60 seconds. Stack was folded into About; the as-built About fold ships without it. Launch is the near-term goal; these folds are the roadmap.

**Nav flag:** Lab and Writing are hidden on every launch route via `Nav hide={["lab","writing"]}`. Removing the flag is the switch to turn each fold back on, once its content ships.

---

## Fold 4 · The Lab

**Job in the story (per CLAUDE.md §14 pre-deferral):** Range. Answers "Do they build outside their day job?"

**Why it matters post-launch:** The reader has just finished Selected Work (fintech PM proof). The Lab fold is the moment to show breadth: side projects, tools, experiments. It's where a founder reading the page starts thinking "this person builds, not just manages." Without it, the portfolio reads as PM-only; with it, it reads as PM-who-ships.

**What exists today:**
- `app/lab/page.tsx` — the Lab grid route, built.
- `components/lab-section.tsx`, `components/lab-portal.tsx`, `components/lab-scene.tsx`, `components/lab-card.tsx` — components built.
- `lib/lab.ts` — data array of 5+ Lab entries with descriptions.
- Lab entries currently listed: job-search tracker (Claude Code + Supabase), BondScanner glossary hub, AI tools comparison, SEO interlink nodal diagram, and one or two more. Content is live; wiring on `/` is the missing link.

**What's missing to ship:**
- Decide: a dedicated Lab fold on the homepage (mirrors Selected Work's shelf), or keep Lab at `/lab` only and link from the nav. Current build has `/lab` but no homepage fold.
- Thumbnails / cover media for each Lab entry (same 4:3 pattern as Selected Work per CLAUDE.md §3 Imagery).
- Decide the fold's one job: a 3-card shelf (the shortest version) vs. a scroll-scrubbed stage like About (the expensive version).
- Hover + focus states consistent with Selected Work cards.

**Open questions:**
- How many Lab entries make the homepage shelf? Three at launch (same cap as Selected Work), rest on `/lab`?
- Does the Lab fold link to each entry's own page, or deep-link to `/lab#slug`?
- Are any Lab entries actually under active development (worth marking "live"), or are they all completed experiments?

**When to revisit:** After launch + first round of recruiter reactions. If multiple recruiters ask "what else do you build?", Lab is the right next fold. If they ask about writing or thought, Writing is.

---

## Fold 5 · Writing

**Job in the story (per CLAUDE.md §14 pre-deferral):** Thought. Answers "How do they think about product?"

**Why it matters post-launch:** A hiring PM scrolling past Selected Work wants a window into how the candidate thinks when nobody's assigning them problems. Writing is where that lives. A good essay is a work sample that costs the reader less than a case study to consume.

**What exists today:**
- `components/writing-section.tsx` — a 3-card grid section, built.
- `components/writing/thumbnail.tsx` — per-entry thumbnail component.
- `lib/writing.ts` — data model with `getFeaturedWriting()`, `WritingEntry` type.
- No actual writing entries yet.

**What's missing to ship:**
- 3-6 real essays. Not drafts, not placeholder titles. Each essay carries its own pull-weight: topic, thesis, length (5-10 min read is the sweet spot), publishing date.
- Decide where essays live: MDX files under `content/writing/`, or external links (Substack, Medium, LinkedIn articles). Current build points at `#writing` as `aria-disabled` with "soon" — treat as a placeholder, not a design.
- Per-essay cover thumbnail (visual, abstract, or typographic — not a stock photo).
- A writing-section "view all" page at `/writing` if more than 6 essays exist.

**Open questions:**
- Essays as original content on this site, or as a shelf of links to existing writing elsewhere?
- Does Writing include LinkedIn posts, Twitter threads, or only long-form?
- Does each essay need an OG image (yes per CLAUDE.md §15 if `/writing/[slug]` pages ship)?

**When to revisit:** If the near-term job search needs a thought-leadership angle (research-oriented PM role, founding PM at a high-conviction company). Otherwise it can live on `/writing` without a homepage fold.

---

## Fold 6 half · Stack

**Job in the story (per CLAUDE.md §14 pre-deferral):** Craft. Combined with About to answer "and what do they build with?"

**Why it matters post-launch:** Engineers reading the page want to know the stack. Founders want to know whether this PM can speak the engineering language. Stack is a quiet proof surface: no bullshit, just tools used in real work.

**What exists today:**
- `components/about-stack.tsx` — older About variant with Stack. Still used by `/preview/v1` and `/preview/v2.1`.
- `lib/stack.ts` — data array of tools with role descriptors.
- `components/stack-icon.tsx` — icon component (wiring unclear).
- Current launch About fold is `components/about-collage.tsx`, which does NOT include Stack.

**What's missing to ship:**
- Decide where Stack lives: inside the About fold (scroll-scrubbed collage continues into Stack), or as its own slim band between About and Contact, or on `/stack` as a dedicated page.
- Visual treatment: grid of tool logos (cheapest), categorised list (clearest), or an interactive "my second engineer" kind of narrative panel (richest, matches `lib/stack.ts` tone).
- Reconciliation with `lib/stack.ts` tone: entries like "my second engineer: ships internal tools while the team ships product" read as narrative, not inventory. Honour that voice if Stack ships as a fold.

**Open questions:**
- Is Stack a PM-tools stack (Figma, Linear, Mixpanel, Notion) or a builder-tools stack (Next.js, Supabase, Claude, Cursor)? `lib/stack.ts` currently mixes both.
- Does Stack belong on every case study (foot-of-page "built with"), or only on the homepage?
- If kept off the homepage, does `/stack` still get built, or is it dropped entirely?

**When to revisit:** Lower priority than Lab and Writing for job-search impact. Revisit when the About fold next gets a redesign, or when a recruiter specifically asks about tooling.

---

## Workflow note

- Any PR that reintroduces one of these folds updates both this file (move the fold's section to a "Shipped" subsection below) and CLAUDE.md §14 (re-add the fold to the launch storyboard table). Same PR, no drift.
- Do not delete this file after shipping one fold; the other two still live here.
- If a fold's scope changes (e.g. Lab moves from homepage shelf to `/lab` only), update the section rather than overwriting it. The log is value, not process.

## Shipped

_Empty for now. Each fold moves here with its launch PR number, the date, and one line on what actually shipped vs. what was spec'd._
