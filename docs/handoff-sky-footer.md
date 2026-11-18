# Handoff: sky footer

Paste the prompt below into a new chat to continue this work.

---

I'm continuing work on the **sky footer** in my portfolio repo (`medigitaldiary/megh-gupta-portfolio`). Read `CLAUDE.md` first and follow it. Branch off `origin/dev` and open PRs into `dev` (CLAUDE.md §13).

**What it is:** a closing fold that replaces the pine "Let's connect" section and the small site footer. It has a headline, a row of contact pills (book a call, LinkedIn, GitHub, email, phone) and a meta strip (IST clock, "made with zero em dashes"). Behind it, clouds drift slowly. The sky starts on the page colour (oatmeal) and cools to blue at the bottom. The motion is CSS only, with no video file, and it holds still under reduced motion.

**Where it lives (all behind the `/unlock` pass, noindex):**
- `/preview/footer-sky`: the footer by itself.
- `/preview/v5`: v4.1 with the sky footer in place of Contact and the footer.
- `/preview/v5.1`: the current version. It brings the footer in line with the other folds and has the latest pill set.
- `/preview/v5.3`: v5.1 plus a weather toy. One button in the meta strip cycles the sky through sunny, drizzle, rain, thunderstorm and winter morning (`components/footer-weather.tsx`, `.wx-*` in `app/globals.css`).

**Key files:**
- `components/footer-sky.tsx` (the fold)
- `components/cloud-background.tsx` (`footer` palette)
- `components/social-links.tsx` (shared links)
- `app/preview/v5/page.tsx`
- `app/preview/v5.1/page.tsx`

**Already decided:**
- Coded clouds, not an AI or stock video. A real video can replace the background later without changing the layout.
- The colour and motion exceptions for this footer are recorded in CLAUDE.md §3.

**Open items:**
1. Clouds look oversized on phones (375px). Scale them down for mobile.
2. Lighthouse has not been run on v5 or v5.1.
3. `design-system/02-components.md` has no entry for the sky footer yet.
4. Pick a home: decide whether v5.1's closing fold goes to the homepage.
5. Trade-off to confirm: v5 and v5.1 drop the inline Cal booker in favour of a "book" pill that opens Cal in a new tab.

**History:** [#153](https://github.com/medigitaldiary/megh-gupta-portfolio/pull/153) (sky footer and v5), [#155](https://github.com/medigitaldiary/megh-gupta-portfolio/pull/155) (shipped to `main`), then #156 to #159 (v5.1 and later tweaks). Read `git log origin/dev` for details.

**First step:** ask me which open item to start with.
