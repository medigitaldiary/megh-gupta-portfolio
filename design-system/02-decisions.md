# 02 · Decisions log

> Decisions Megh made on the Phase 2 proposal, with the evidence behind each and the exact change it implies. Code changes are **not applied**: each lives as a reviewable diff in `patches/`, generated against commit `50a3913` and checked in a scratch copy of the repo. CLAUDE.md text is drafted here for Megh to paste or approve.

| # | Decision | Status | Artefact |
|---|---|---|---|
| D1 | Visible changes V1 to V21 | All 21 approved | `02-tokens.md` §3 |
| D2 | Delete the unused `@theme` type scale | Approved | `patches/D2-delete-theme-type-scale.diff` + CLAUDE.md text |
| D3 | AI Call diagram status colours | Approved as a scoped exception | `tokens.json` → `island.ai-call-pipeline` + CLAUDE.md text |
| D4 | Rename `font-serif` → `font-display` | Approved | `patches/D4-font-serif-to-font-display.diff` |
| D5 | Kalam inline styles → `font-hand` class | Approved in principle, diff for review | `patches/D5-font-hand-class.diff` |
| D6 | Work carousel advances every 10s | Approved (Megh), phone trade-off accepted | `patches/D6-carousel-interval-10s.diff` |
| D7 | Move next/font variables from `<body>` to `<html>` so body text renders in Geist | **Proposed (Phase 4), needs Megh** | `patches/D7-font-variables-on-html.diff` |

---

## D1 · Visible changes

**All 21 approved.** V10 and V18 were reviewed against single before/after mock-ups, the other 19 against grouped mock-ups.

- **V20** was approved at a new value, 10s, instead of the proposed 4.8s (see D6).
- **V19** (Cal booker shadow) was approved although Claude flagged that a pine shadow barely shows on the pine Contact fold. Phase 4 checks it on the real page.

## D2 · Delete the `@theme` type scale

**Evidence:**
- `app/globals.css:47-58` defines 12 lines: `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-small`, plus their line heights.
- A repo-wide grep finds no `text-display`, `text-h1` and so on in any component.
- The utilities still compile. A Tailwind probe produced `.text-h1 { font-size: 2.5rem; … }`, so they're live but unused.

**Change:** delete the 12 lines (the diff also removes the blank line before them). No class references them, so there is no visual change.

**Follow-on in this audit:** the proposed heading sizes were renamed `--text-head-xs / sm / md / lg / xl` (28 / 30 / 36 / 48 / 64px). That way no proposed token reuses a deleted name with a different value.

**CLAUDE.md §3 text to add under "Type scale"** (draft):

> These are **nominal** sizes for reasoning about hierarchy. They are not live tokens: the `@theme` entries that mirrored them were removed because no component used them. Components use Tailwind's scale, arbitrary values, or the fluid `clamp()` triples below. The as-built size set is documented in `design-system/02-tokens.md` §2.7.

## D3 · AI Call diagram status colours

**Evidence:**
- The iframe (`public/artifacts/ai-call-pipeline.html`) defines `--warning: #d97706` (`:22`) and `--success: #16a34a` (`:25`). Its dark set uses `#f59e0b` and `#22c55e`.
- They're used in 36 rules, plus soft and glow variants and one hardcoded `rgba(22,163,74,0.14)` at `:366`.
- **Success marks the destination node** (`.node-badge.destination`, `.node-chip.dest`). **Warning marks the warning / fallback nodes** (`.node-badge.warning`, `.node-chip.warn`, and the `.warning-text` and `.success-text` step copy at `:668-669`).

**Change:** in `tokens.json`, `island.ai-call-pipeline.pipeline-success` and `pipeline-warning` keep their light values and are marked as an approved exception. The other 15 artifact variables keep the proposed mapping onto site tokens.

**Assumption to confirm:** mapping the rest of the artifact to the site's single light palette retires its dark-mode set, including the two dark status values. That matches CLAUDE.md §6.3, where a single light theme is locked.

**CLAUDE.md §3 exception entries** (draft; one table covering all three approved exceptions):

> **Scoped colour exceptions.** Outside Oatmeal / Pine / Lilac, these colours are approved only where listed. Each one is semantic or decorative for its own surface and never becomes site chrome.
>
> | Surface | Where | Colours | Use |
> |---|---|---|---|
> | Unlock gate | `/unlock`, `components/backstage-pass.tsx` (`DENIED_INK`) | `#B23A48` | Wrong-password feedback only: input underline, status text, DENIED stamp |
> | Unlock gate | `/unlock`, `components/cloud-background.tsx` (`dawn`) | Sky `#B7CDE1 → #F6ECD1`, glow, cloud `#FFFFFF` / `#D5DBE3` | Decorative backdrop |
> | AI Call Analysis pipeline diagram | iframe `public/artifacts/ai-call-pipeline.html` | `--success #16A34A`, `--warning #D97706` | Semantic node states: destination node (success), warning / fallback nodes (warning) |

## D4 · `font-serif` → `font-display`

**Evidence:** `font-serif` resolves to Geist Sans (`app/globals.css:42`), and the comment at `:38-41` explains the workaround.

**Scope correction:** the first count (14) covered only in-scope files. The repo-wide sweep this PR needs is **47 lines across 27 files**. That includes:
- the `@theme` key;
- the four SVG `fontFamily="var(--font-serif), serif"` attributes in both Venns (`product-venn.tsx:472,564`, `product-venn-travel.tsx:726,822`). If these were missed, the Venn labels would fall back to a real serif;
- the preview-only routes (`app/preview/*`, `app/paper-preview`) and `lab-*` components.

**Change:** a mechanical `font-serif` → `font-display` replacement across `app/` and `components/`.

**Checked in a scratch copy:**
- applies cleanly;
- `tsc --noEmit` passes;
- Biome reports 20 issues before and 20 after, all pre-existing (`noImportantStyles` in `app/preview/v2.1/scope.css` and similar), so no new issues.

**Runtime check (corrected in Phase 4):** Phase 2 said the Venn's SVG `var(--font-serif)` references resolve to Geist. They don't. Tailwind does emit `--font-serif` on `:root`, but its value points at next/font's variable, which only exists on `<body>`, so on `:root` it resolves to nothing and the labels render in the system font. The rename itself is still safe: Phase 4 rendered the patched build and it matches today's build pixel for pixel (see below). The font problem is separate and is fixed by D7.

## D5 · Kalam inline styles → `font-hand` class

**Evidence:**
- In scope, three inline styles set Kalam:
  - `experience.tsx:16`: a `hand` constant used at `:31, 564, 667, 720, 964`;
  - `hero.tsx:56`;
  - `backstage-pass.tsx:145`.
- No element uses the `font-hand` class today.
- Elsewhere, Kalam is set through SVG `fontFamily` attributes, which can't take a class: `product-venn-travel.tsx:821` (in scope), `lab-scene.tsx` ×9 (out of scope). There are also inline styles in out-of-scope components: `hero-overture.tsx:407`, `about-me.tsx:127` and `case-study/primitives/figure.tsx:88`.

**Why no variable rename is needed:** a production build shows three things.
1. Tailwind emits `.font-hand { font-family: var(--font-hand) }`.
2. On `:root` it emits `--font-hand: var(--font-hand)`, which points at itself and is invalid, but only on `<html>`.
3. next/font sets `--font-hand: "Kalam","Kalam Fallback"` on `<body>` through its variable class.

Every element inside `<body>` inherits the real value, so the class renders the same font stack as the inline style. Renaming the variable to `--font-kalam` would only tidy up the self-reference on `<html>`. It's optional and left out to keep the diff small.

**Change** (3 files, +7 / −13):
- `experience.tsx`: remove the `hand` constant; add `font-hand` to the five elements that used `style={hand}`.
- `hero.tsx:55-56`: add `font-hand` to the greeting and drop the inline style.
- `backstage-pass.tsx:144-145`: same.

The SVG attribute at `product-venn-travel.tsx:821` is untouched.

**Checked:** applies cleanly together with D2 and D4; `tsc` passes; no new Biome issues. **Not yet checked:** the rendered font. Phase 4 confirms the computed `font-family` at all seven spots before merge.

---

## D6 · Work carousel advances every 10 seconds

**Decision (Megh):** the Selected Work shelf moves to the next case study every **10s**, up from 4.5s, because the cover videos are longer than 4.5s. A new value, set by the owner, not one found in Phase 1. The nav status chip stays at 4.8s (confirmed).

**Cover video lengths** (`ffprobe` on `public/videos/work/*.mp4`): Ultra 18.0s, Bond Bytes 17.0s, MoveInSync 16.0s, AI Call 12.0s, SEO engine 5.0s, Deridata 4.8s, Freshdesk 4.8s.

**Phone trade-off (accepted by Megh, keep 10s):** 10s fully covers the three short clips. On desktop (about 3.5 cards visible, one-card steps) every card stays in view for about 3 steps, so all clips finish. On phones (about 1.15 cards visible) each card gets about 10s, so the four long clips (12 to 18s) are cut off. They loop, and a swipe back replays them. Alternatives considered: 18s (every clip finishes, desktop feels slow) and advancing when each video ends (about 20 lines of new code).

**Change:** `components/work-thumbnails.tsx:77`, `STEP_MS = 4500` → `10000`. One line. Pause on hover / focus, reduced-motion (no autoplay) and the arrows are unchanged.

**Token impact:** V20's shared `--interval-rotate` is split into `--interval-chip` (4800ms, nav status chip, unchanged) and `--interval-carousel` (10000ms).

**Carried into Phase 3 (unaffected by the new speed):** the shelf moves on its own indefinitely. It pauses on hover and keyboard focus, but has no visible pause control, so a touch user can't stop it. WCAG 2.2.2 (Pause, Stop, Hide) asks for one on any auto-moving content that lasts more than 5 seconds.

## D7 · Font variables on `<html>` (proposed in Phase 4)

**Finding:** everything without an explicit `font-serif` / `font-mono` class renders in the system font: body text, footer, buttons, case-study prose and dek, and the Venn labels and chips (03-gaps G-C17).

**Cause:** next/font declares `--font-geist-sans`, `--font-geist-mono` and `--font-hand` on `<body>` (`app/layout.tsx:191`). Tailwind declares `--font-sans` / `--font-serif` / `--font-mono` / `--default-font-family` on `:root` as references to them, and on `:root` they don't exist yet.

**Change:** `app/layout.tsx`, move the three `.variable` classes to `<html>`; `<body>` keeps `antialiased bg-bg text-fg`. One file, +5 / −2, Biome-clean, `tsc` passes.

**Verified:** production build at 375px and 1440px. Body, footer, prose, dek and Venn labels compute to Geist; Venn chips to Geist Mono; greeting stays Kalam. Before/after: `phase4/d7-fonts-*.webp`.

**Visible effect:**
- Body copy switches from the visitor's system font to Geist. That's the locked brand face (CLAUDE.md §2), but it changes how every paragraph looks on real devices.
- Two Venn chips touch at 1440px (G-C18).

## Phase 4 gate for D2, D4, D5, D6: passed

Production builds of `50a3913` with and without the four patches were rendered with reduced motion (static frames) at 375px and 1440px: `/preview/v3`, `/preview/v3.1`, both case-study marks, and `/unlock`. Every viewport and full-page screenshot is **pixel-identical**, except the live IST clock in the footer and the unlock ticket's minute-based serial. Computed styles match, with one string difference: D5's `font-hand` class gives `Kalam, "Kalam Fallback"` without the trailing `cursive` the inline style had. That only matters if Kalam fails to load, and "Kalam Fallback" (a metric-matched local font) still covers it.

## How these ship

- **CLAUDE.md §3: applied in this PR** (Megh's call). Adds the scoped colour exceptions table (Venn, denied red, dawn sky, diagram status) and the "nominal, not live tokens" note under Type scale. The note says the `@theme` entries are *scheduled* for removal; flip it to "removed" when the D2 code PR merges.
- **Code diffs D2 + D4 + D5 + D6: held until Phase 4 has checked the rendered result** (Claude's call, delegated by Megh). Reasons:
  1. D5 changes how Kalam is applied at seven spots. The build evidence says it renders the same, but it has not been seen on screen.
  2. D4 touches 27 files, including the Venn SVG font references. Phase 4 already screenshots the hero at 375px and 1440px, so it can compare before and after in the same pass.
  3. CLAUDE.md §13 wants code PRs off `dev`, and `dev` is behind `main` today. Waiting lets the code PR start from a synced `dev`.

  Plan: Phase 4 renders `main`, then renders it again with the patches applied. If both match (fonts, sizes, Venn labels), open one code PR into `dev` with the four diffs and the screenshots attached. **Result: matched (gate passed).** Waiting on Megh for a branch to open the code PR from, and whether D7 rides along.
