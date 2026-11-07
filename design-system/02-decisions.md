# 02 · Decisions log

> Decisions Megh made on the Phase 2 proposal, with the evidence behind each and the exact change it implies. Code changes are **not applied**: each lives as a reviewable diff in `patches/`, generated against commit `50a3913` and checked in a scratch copy of the repo. CLAUDE.md text is drafted here for Megh to paste or approve.

| # | Decision | Status | Artefact |
|---|---|---|---|
| D1 | Visible changes V1 to V21 | V10, V18 approved; 19 open | `02-tokens.md` §3 |
| D2 | Delete the unused `@theme` type scale | Approved | `patches/D2-delete-theme-type-scale.diff` + CLAUDE.md text |
| D3 | AI Call diagram status colours | Approved as a scoped exception | `tokens.json` → `island.ai-call-pipeline` + CLAUDE.md text |
| D4 | Rename `font-serif` → `font-display` | Approved | `patches/D4-font-serif-to-font-display.diff` |
| D5 | Kalam inline styles → `font-hand` class | Approved in principle, diff for review | `patches/D5-font-hand-class.diff` |

---

## D1 · Visible changes

- **V10 approved:** the hero H1 is 48px from 768px up, and the 52px step at 1024px is retired.
- **V18 approved:** the timeline tooltip moves to oat and pine with the shared floating shadow, `--shadow-md`.

Both were reviewed against before/after mock-ups. The other 19 are listed in `02-tokens.md` §3, each with the fold or component it touches.

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

**Runtime check:** a production build shows Tailwind emits `--font-serif` on `:root` today, so the SVG `var()` references resolve. After the rename it emits `--font-display` the same way, because it detects the name in source.

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

## How to ship these

CLAUDE.md §13 says feature branches come off `dev` and are PR'd into `dev`. These are code changes, so they shouldn't ride along in this docs PR.

Suggested split:
1. A docs PR for the CLAUDE.md §3 text (D2, D3, plus the denied-red and sky entries).
2. One code PR for D2 + D4 + D5. All three are mechanical, with no visual change except where Phase 4 says otherwise.
