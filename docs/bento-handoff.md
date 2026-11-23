# Bento board: handoff prompt

Paste everything below the line into a new chat to pick up the work.

---

You are continuing work on Megh Gupta's portfolio repo (`medigitaldiary/megh-gupta-portfolio`). Read `CLAUDE.md` first; it holds the locked rules (palette, no em dashes, branch flow, motion exceptions).

**Project:** a one-page bento board, a second take on the portfolio, meant to live at `bento.meghgupta.in` later. All sections fit in two folds on desktop. The idea: the route LKO → GOI → BLR is the page identity (a boarding pass), with work tiles, a photo stack, a Venn, numbers and a contact tile around it.

**Where it is**
- Branch: `mxg/cool-archimedes-2ol5k5`. Draft PR into `dev`: #137.
- Board: `/preview/bento`. Card lab (try-out room): `/preview/bento/lab`. Both are behind the preview password and noindexed.
- Vercel preview: https://megh-gupta-portfolio-git-mxg-co-210734-medigitaldiarys-projects.vercel.app

**Key files**
- `app/preview/bento/page.tsx`, `app/preview/bento/bento.css` (the one approved CSS file for the board)
- `components/bento/`: `bento-board.tsx` (shared state: lens, day/night mode), `bento-tiles.tsx`, `bento-widgets.tsx`, `bento-entrance.tsx` (fly-in), `bento-ink.ts` + `bento-mode-toggle.tsx` (ink bleed day/night), `bento-lab-cards.tsx`, `bento-mode-switches.tsx`
- `lib/bento.ts` (board data)

**Done so far**
1. Board built: route tile (Lucknow flips "City of Nawabs" to Hindi; Goa stop with BITS crest chip, Backstage, Waves '22; Bengaluru jobs), work tiles, print stack, Venn lenses, numbers, connect. Scan mode, the BLR now tile and the workbench were removed later; the grid is 9 rows on desktop.
2. Card lab: six object cards (GT650 retro dials with a synthesised engine sound and 05000 km, AI call card, Waves crew pass, cassette, crossfader, HYROX bib) and four day/night switches (window shade, guitar pedal, ignition key, clock out).
3. Fly-in entrance: tiles fly in one by one and snap; small loops start after landing.
4. Ink bleed day/night: one sun/moon toggle (bottom left, `T` key too) spreads the new theme with a marbled edge. Built on the View Transitions API, not the html2canvas recipe from the PDF Megh shared, so glass and videos keep working.
5. `CLAUDE.md` updated with the bento exceptions (28px radius, glass, night mode, entrance, ink bleed).

**Open decisions (ask Megh)**
- Which lab cards and which switch move onto the board.
- Stand-in values: bib number, sample call, clock-in time.
- Short "day" flash on reload when night was saved.

**Next steps**
- Merge #137 into `dev`, then move the board off `/preview`, add SEO basics, set up `bento.meghgupta.in`, run Lighthouse, test on a real phone and in Safari.

**How to work with Megh**
- He is a PM: explain the tech simply. End every reply with "PM Takeaway" (2 to 4 lines) and "Technical Terms" (short glossary).
- Run `pnpm check` and `pnpm exec tsc --noEmit` before every push. Never push to `dev` or `main`.
- Local testing: run the dev server with `PREVIEW_PASSWORD` and `PREVIEW_SECRET` set, and forge the `mg_backstage_pass` cookie in Playwright (see `lib/preview-auth.ts`).
