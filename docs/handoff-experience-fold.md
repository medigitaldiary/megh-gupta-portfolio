# Handoff: Experience fold (fold 2)

Paste this into a new chat to pick up where we left off.

---

I'm Megh. We're working on my portfolio repo (`medigitaldiary/megh-gupta-portfolio`). Read `CLAUDE.md` first: it has the design system, branch rules and quality bar.

## What we're working on

The **Experience fold** ("Where I've been."). It has two views with a switcher: **timeline** and **list**. Keep both views and the switcher.

## Where things live

- `components/experience-roadmap.tsx`: the fold. `timeline="bar"` (current pick) or `timeline="roadmap"` (older experiment). The list view is the changelog in both.
- `lib/experience.ts`: the roles and dates. Every version of the fold reads this one file.
- `components/experience.tsx`: the original fold. Still used by v3, v3.1, v3.4.

## Preview routes (behind the pass at `/unlock`)

- `/preview/v3.2`: same page as `/preview/v3.1`, with only the experience fold swapped for the bar. Keep it that way.
- `/preview/v4.1`, `/preview/v4.3`, `/preview/v5`: also use the bar.
- `/preview/experience-roadmap`: the older roadmap experiment.

## What's decided

- **Timeline = one segmented bar.** Pieces sized by role length, flush, no gap. Short fold height is the whole point.
- **Motion:** bar fills left to right once on scroll; hover lifts one role, dims the others and shows a small floating card; click opens that role in the list view. The sheen runs only for a current role.
- **List = changelog.** Dates and duration on the left, logo, name and role on the right, expandable notes.
- **Removed on purpose:** headline metrics, "Shipped" / "Live now" chips, v1.0 to v3.0 tags.
- **Rejected:** roadmap grid with quarters and swimlanes, version stepper.
- **Dates:** BondScanner ended Oct 2026. No role is current right now.

## Open items

- Copy still in present tense: About fold ("Founding PM at BondScanner, where I'm making..."), BondScanner notes ("Lately I've been living in Claude Code"), `app/resume/page.tsx` descriptions.
- Lighthouse not run on these previews.
- `design-system/02-components.md` not updated for the bar. Do this if the bar replaces the live fold.

## How I like to work

- Show me a mockup (artifact) before building a new idea.
- Build on a preview route, check at 375, 768 and 1440px.
- Ship: feature branch → PR into `dev` → PR `dev` → `main`. Only push to meghgupta.in when I say so.
- Only change what I ask. If a change touches other pages, tell me first.
