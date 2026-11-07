# 01 · Inventory (as-built)

> Phase 1 of the design-system audit. This is a reverse-engineered record of what the code does today. Nothing here is a recommendation. Normalisation is Phase 2, gaps and fixes are Phase 3, rendered verification is Phase 4.

**Revision 2** (after review): `/unlock` added as §4; Q1, Q6, Q8 and Q10 resolved; Q7 direction agreed.

**Audit date:** 2026-11-07 · **Commit:** `50a3913` (same commit as `origin/main`, so the live preview routes should run this code) · **Branch:** `mxg/upbeat-hypatia-85xg1z`

## 0. Scope and method

### What is in scope

The routes Megh named, and everything they render:

| Route | Entry file | What it renders |
|---|---|---|
| `/preview/v3` | `app/preview/v3/page.tsx` | `Nav` (Lab + Writing hidden), `Hero` (static Venn), `Experience`, `SelectedWorkShelf mark="text"`, `AboutCollage`, `Contact`, `SiteFooter`, plus `RelockButton` from `app/preview/layout.tsx` |
| `/preview/v3.1` | `app/preview/v3.1/page.tsx` | Same folds. Differences: `Hero link="travel"` (draggable Venn + the pine dot that flies from portrait to pin) and `SelectedWorkShelf mark="row"` |
| `/work/ai-call-analysis-pipeline` | `app/work/[slug]/page.tsx` + `content/work/ai-call-analysis-pipeline.mdx` | Case study shell, "On this page" index, headline-metric card, MDX body, "Keep reading" cards, `RelockButton` from `app/work/layout.tsx`. Reached from v3 as `?mark=text` and from v3.1 as `?mark=row`; the only visual difference is the index highlight style. |
| `/unlock` | `app/unlock/page.tsx` + `app/unlock/backstage.css` | Password gate ("Backstage Pass") that `middleware.ts:10-24` sends every locked page through. Added to scope after review: it stays as the lock flow for preview pages and for content shared with specific people. Inventoried separately in **§4** so its values do not blur the portfolio counts. |

`app/preview/v3/layout.tsx` and `app/preview/v3/scope.css` are no-ops (`scope.css:15-17`, empty `.v3-scope` class). v3 and v3.1 differ only in the two props above.

The file list came from an import-graph walk from those entry points (47 files). From that list, **28 files actually emit styles** and were scanned for values (listed in Appendix A).

### What is out of scope (and why it is still mentioned)

- `app/globals.css:357-621` and `670-685` style the Lab scene, which does not render on these routes. `329-355` (`.cs-cloud` drift) renders only on `/unlock` and is covered in §4. They are excluded from the counts and listed in Appendix B.
- Case-study kit components that exist but are **not used by the AI Call case study**: `Figure`, `Pill`, `Quote`, `ScreenshotStack`, `Pipeline`. They ship in the same bundle (`components/case-study/index.ts`) but never render here. Appendix C.
- `/unlock` is in scope (see table above) but counted on its own in §4. §2 and Appendix D cover only the three portfolio routes.

### How values were counted

1. A script tokenised every line of the 28 files (comments stripped, line numbers preserved) and classified each Tailwind utility, CSS declaration, inline `style`, SVG attribute and Web Animations API call.
2. Every value is recorded with its `file:line`. The scan was cross-checked against `grep` for font weights, radii, font sizes, tracking, leading, durations, z-index, backgrounds, padding and gaps. The only grep hits the script skips are words inside code comments.
3. Tailwind defaults were resolved against the installed `node_modules/tailwindcss/theme.css` (Tailwind **4.3.2**), not from memory.
4. **Source** column legend:
   - **variable**: comes from a project CSS variable, either directly (`var(--fg)`) or through a Tailwind utility that `@theme inline` maps to one (`text-fg`, `bg-bg-elevated`).
   - **Tailwind default**: a utility on Tailwind's built-in scale (`text-sm`, `p-4`, `rounded-full`). Themed, but by Tailwind, not by this project.
   - **hardcoded**: an arbitrary value (`text-[15px]`), a literal in CSS, an inline style or SVG attribute, or a JS constant.
5. A "use" is one occurrence in source. A class in a component used by many rows (e.g. a card in `.map()`) counts **once**, because that is the number of places that would change.

File paths in tables drop the `components/` prefix. `app/...` paths are kept as-is.

---

## 1. Stack

| Concern | What is used | Where |
|---|---|---|
| Framework | Next.js **15.5.20**, App Router, React 19.1.0 | `package.json` |
| Styling | Tailwind CSS **4.3.2** via `@tailwindcss/postcss`. No `tailwind.config.ts`; theme lives in CSS (`@theme inline`). | `app/globals.css:1`, `app/globals.css:27-59`, `postcss.config.mjs` |
| Global CSS | One global stylesheet. **All its rules are unlayered** (no `@layer`), so they sit above Tailwind's utility layer in the cascade. | `app/globals.css` |
| Component CSS | One extra stylesheet, imported by its component. | `components/about-collage.css`, imported at `components/about-collage.tsx:6` |
| Inline styles | Used for runtime-computed values (positions, timeline widths, SVG geometry) and a few static ones. | see §2 tables |
| Fonts | `next/font/google`: Geist (`--font-geist-sans`), Geist Mono (`--font-geist-mono`), Kalam 400 (`--font-hand`). All `display: swap`, `latin` subset. | `app/layout.tsx:12-31` |
| Font mapping | `--font-serif` **and** `--font-sans` both point to Geist Sans, so `font-serif` renders Geist Sans. `--font-mono` → Geist Mono. | `app/globals.css:42-45` |
| Icons | **No icon library.** Every icon is a hand-written inline SVG (24×24 viewBox, `stroke="currentColor"`, stroke 1.8 or 2). | `nav.tsx:491-650`, `site-footer.tsx:5-51`, `relock-button.tsx:36-47` |
| Animation | (a) CSS keyframes + transitions; (b) **`motion` 14.4.0** (Framer Motion's successor), used **only** for the work-card hinge; (c) the Web Animations API (`element.animate`) + `requestAnimationFrame` loops for the Venns, hero dot, carousel scroll, nav chip; (d) scroll-driven CSS (`animation-timeline: view()`) for eyebrow highlights. | (b) `work-thumbnails.tsx:3`; (c) `product-venn.tsx:213-337`, `product-venn-travel.tsx:391-509`, `hero-link.tsx:79-106`, `work-thumbnails.tsx:155-171`; (d) `app/globals.css:153-167` |
| 3D | `three` is a dependency but is **not imported** by any in-scope file. | `package.json` |
| Embeds | Cal.com booker (`@calcom/embed-react` 1.5.3); the AI Call diagram is a static HTML file in an `<iframe>`. | `cal-embed.tsx`, `case-study/one-offs/ai-call-pipeline.tsx:28` |
| Analytics | Vercel Analytics + Speed Insights | `app/layout.tsx:1-2,201-202` |

---

## 2. Tokens and raw values

### 2.1 Colour

#### 2.1a Defined colour variables (`:root` in `app/globals.css`)

"Uses" = Tailwind utilities that resolve to the variable + direct `var()` references, excluding the one mapping line in `@theme inline`.

| Variable | Value | Defined | Role comment in code | Utility uses | `var()` uses | **Total** | How it's used |
|---|---|---|---|---:|---:|---:|---|
| `--fg` | `#1f3b2e` | `app/globals.css:11` | Pine, body, headings, CTA fill | 50 | 13 | **63** | text 42, bg 6, border 2; SVG zone labels, drag shadow, collage shadows |
| `--accent` | `#1f3b2e` | `app/globals.css:15` | Same hue as `--fg`, monochrome brand | 49 | 10 | **59** | ring 17, bg 11, text 10, decoration 6, border 5; SVG marker, arrow, hero dot |
| `--border` | `#d4c4a8` | `app/globals.css:14` | Toasted oat, hairlines | 36 | 3 | **39** | border 32, divide 2, bg 2; collage strip 3, photo backing |
| `--bg-elevated` | `#f3ebd9` | `app/globals.css:10` | Lightened oatmeal, cards | 24 | 6 | **30** | bg 24; collage `--paper`, stage glow, tape |
| `--fg-muted` | `#3a5544` | `app/globals.css:12` | Lighter pine, secondary text | 26 | 3 | **29** | text 24, border-l 2 |
| `--fg-subtle` | `#556b5d` | `app/globals.css:13` | Muted pine, captions | 25 | 1 | **26** | text 24, bg 1 |
| `--accent-fg` | `#e8dcc6` | `app/globals.css:16` | Oatmeal, text on pine | 16 | 0 | **16** | text 15 (incl. `/85`, `/70`), decoration 1 |
| `--bg` | `#e8dcc6` | `app/globals.css:9` | Oatmeal, primary surface | 8 | 4 | **12** | bg 4, text 2, ring 2; `body`, collage |
| `--highlight` | `#cbb3e8` | `app/globals.css:17` | Soft lilac, decorative only | 1 | 7 | **8** | `::selection`, card hairline mix, collage strip 2 + tape, metric highlight `bg-highlight/80` |
| `--highlight-strong` | `#b89cdc` | `app/globals.css:18` | Stronger lilac, focus + underline | 0 | 3 | **3** | focus outline, link-hover underline. **Not exposed to Tailwind** (no `--color-highlight-strong`). |
| `--venn-user` | `#c1497f` | `app/globals.css:21` | "used only by product-venn.tsx" | 0 | 2 | **2** | User ring + chips (both Venns) |
| `--venn-tech` | `#4a72b0` | `app/globals.css:22` | same | 0 | 2 | **2** | Technology ring + chips |
| `--venn-biz` | `#c77e3b` | `app/globals.css:23` | same | 0 | 2 | **2** | Business ring + chips |
| `--venn-cream` | `#fdf7ee` | `app/globals.css:24` | same | 0 | 4 | **4** | Chip text; **also** the desktop timeline band at `experience.tsx:656` (outside the Venn) |

Notes from the code:
- `--fg` and `--accent` hold the **same hex** (`#1f3b2e`). Together, pine is referenced **122** times.
- `--bg` and `--accent-fg` also hold the **same hex** (`#e8dcc6`).
- `about-collage.css:26` defines a local alias `--paper: var(--bg-elevated)` (3 uses: `:181`, `:377`, `:489`).
- The colour tokens reach Tailwind through `@theme inline` at `app/globals.css:28-36`.

#### 2.1b Colour utilities in use (all resolve to the variables above)

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `text-fg` |  | variable | 42 | base `[&_a]:` `[&_h2]:` `[&_h3]:` `[&_strong]:` `hover:` `[&_tbody_td.num]:` | `app/layout.tsx:191` `app/work/[slug]/page.tsx:46,97,105,145,168` `experience.tsx:78,248,319,348,365,369,427,439,750,951,973` `hero.tsx:64` `nav.tsx:173,374,375,429,448` `section-header.tsx:18,24` `site-footer.tsx:89` `work-thumbnails.tsx:229,237,358` `case-study/case-study-toc.tsx:61` `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:55` `case-study/patterns/data-table.tsx:72` `case-study/patterns/step-grid.tsx:82` `case-study/patterns/timeline.tsx:25` `case-study/primitives/callout.tsx:48` `case-study/primitives/metric.tsx:23` |
| `border-border` |  | variable | 31 | base `md:[&>*:first-child]:` `[&_thead_th]:` | `app/work/[slug]/page.tsx:118,140,163,203` `experience.tsx:66,218,302,339,415,586,741,940` `nav.tsx:173,359` `work-thumbnails.tsx:229,237,343` `case-study/case-study-toc.tsx:50,55` `case-study/one-offs/ai-call-pipeline.tsx:91` `case-study/patterns/data-table.tsx:57,60,71,72` `case-study/patterns/step-grid.tsx:59` `case-study/patterns/timeline.tsx:57,72,79,85` `case-study/primitives/callout.tsx:45` `case-study/primitives/metric.tsx:37` |
| `bg-bg-elevated` |  | variable | 24 | base `hover:` | `app/work/[slug]/page.tsx:140,163` `experience.tsx:66,131,214,302,415,741,939` `nav.tsx:173,359,402,462` `work-thumbnails.tsx:229,237,343,364` `case-study/one-offs/ai-call-pipeline.tsx:91` `case-study/patterns/data-table.tsx:60,71` `case-study/patterns/step-grid.tsx:59` `case-study/patterns/timeline.tsx:85` `case-study/primitives/callout.tsx:45` `case-study/primitives/metric.tsx:37` |
| `text-fg-muted` |  | variable | 24 | base | `app/work/[slug]/page.tsx:97,108,112,118,149,171` `experience.tsx:78,144,325,339,357,380,427,752,961` `nav.tsx:375,448` `work-thumbnails.tsx:361` `case-study/case-study-toc.tsx:61` `case-study/patterns/data-table.tsx:28,72` `case-study/patterns/step-grid.tsx:88` `case-study/patterns/timeline.tsx:27` `case-study/primitives/metric.tsx:30` |
| `text-fg-subtle` |  | variable | 24 | base `[&_thead_th]:` | `app/work/[slug]/page.tsx:142,165,207` `experience.tsx:146,151,157,231,315,329,439,563,693,719,954,962` `section-header.tsx:14` `site-footer.tsx:89,97` `work-thumbnails.tsx:345` `case-study/case-study-toc.tsx:47,64` `case-study/patterns/data-table.tsx:72` `case-study/primitives/eyebrow.tsx:24,27` |
| `ring-accent` |  | variable | 17 | `focus-visible:` | `app/work/[slug]/page.tsx:97,178` `experience.tsx:77,131,256,426,776,939` `hero.tsx:83` `nav.tsx:170,372,413,429,448` `site-footer.tsx:89` `work-thumbnails.tsx:295` `case-study/case-study-toc.tsx:60` |
| `text-accent-fg` |  | variable | 12 | `focus:` base `hover:` | `app/layout.tsx:195` `app/work/[slug]/page.tsx:178` `contact.tsx:9` `experience.tsx:231` `hero.tsx:83` `nav.tsx:172,413,473` `section-header.tsx:24` `work-thumbnails.tsx:22,26,38` |
| `bg-accent` |  | variable | 11 | `focus:` base | `app/layout.tsx:195` `app/work/[slug]/page.tsx:178` `contact.tsx:9` `experience.tsx:240,596` `hero.tsx:83` `nav.tsx:172,413,473` `case-study/patterns/timeline.tsx:38,49` |
| `text-accent` |  | variable | 10 | base | `app/work/[slug]/page.tsx:102` `experience.tsx:31,34,370,389,667,964,1009` `hero.tsx:55` `case-study/primitives/eyebrow.tsx:26` |
| `bg-fg` |  | variable | 6 | base `hover:` | `experience.tsx:78,427` `nav.tsx:195` `section-header.tsx:24` `work-thumbnails.tsx:38` `lib/experience.ts:69` |
| `bg-bg` |  | variable | 4 | base | `app/layout.tsx:191` `experience.tsx:339` `nav.tsx:374,441` |
| `decoration-accent` |  | variable | 4 | `hover:` | `experience.tsx:256,389,439,1009` |
| `border-accent` |  | variable | 3 | `hover:` base | `experience.tsx:741,940` `nav.tsx:172` |
| `bg-border` |  | variable | 2 | base `after:` | `experience.tsx:596` `case-study/patterns/step-grid.tsx:51` |
| `border-l-accent` |  | variable | 2 | base | `case-study/patterns/step-grid.tsx:46` `case-study/primitives/callout.tsx:41` |
| `border-l-fg-muted` |  | variable | 2 | base | `case-study/patterns/step-grid.tsx:45` `case-study/primitives/callout.tsx:41` |
| `decoration-accent/40` |  | variable | 2 | base | `experience.tsx:389,1009` |
| `divide-border` |  | variable | 2 | base `md:` | `experience.tsx:98` `case-study/patterns/data-table.tsx:58` |
| `ring-bg` |  | variable | 2 | base | `experience.tsx:240,595` |
| `text-bg` |  | variable | 2 | base | `experience.tsx:78,427` |
| `bg-accent-fg` |  | variable | 1 | base | `nav.tsx:195` |
| `bg-fg-subtle` |  | variable | 1 | `[&_ul>li]:before:` | `case-study/patterns/data-table.tsx:28` |
| `bg-highlight/80` |  | variable | 1 | base | `experience.tsx:973` |
| `border-border/60` |  | variable | 1 | `[&_tbody_td]:` | `case-study/patterns/data-table.tsx:72` |
| `border-fg/30` |  | variable | 1 | `hover:` | `experience.tsx:940` |
| `border-fg` |  | variable | 1 | base | `section-header.tsx:24` |
| `decoration-accent-fg/50` |  | variable | 1 | base | `contact.tsx:36` |
| `text-accent-fg/70` |  | variable | 1 | base | `contact.tsx:32` |
| `text-accent-fg/85` |  | variable | 1 | base | `contact.tsx:16` |

#### 2.1c Hardcoded colours (not from a variable)

These are every colour literal and every off-palette Tailwind colour in scope. `token-def` rows (the `:root` definitions) are excluded here; they are in 2.1a.

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `#1f4d3a` |  | hardcoded | 2 | base | `cal-embed.tsx:15,16` |
| `bg-[#0A66C2]` |  | hardcoded | 2 | `hover:` | `nav.tsx:402,462` |
| `bg-white/95` |  | Tailwind default | 2 | base | `experience.tsx:890,902` |
| `border-[#0A66C2]/30` |  | hardcoded | 2 | base | `nav.tsx:402,462` |
| `border-[#0A66C2]` |  | hardcoded | 2 | `hover:` | `nav.tsx:402,462` |
| `border-slate-200/70` |  | Tailwind default | 2 | base | `experience.tsx:890,902` |
| `decoration-transparent` |  | Tailwind default | 2 | base | `experience.tsx:256,439` |
| `rgba(203, 179, 232, 0)` |  | hardcoded | 2 | base | `app/globals.css:100,105` |
| `text-[#0A66C2]` |  | hardcoded | 2 | base | `nav.tsx:402,462` |
| `text-white` |  | Tailwind default | 2 | `hover:` | `nav.tsx:402,462` |
| `#e8dcc6` |  | hardcoded | 1 | base | `app/layout.tsx:163` |
| `bg-[#171513]` |  | hardcoded | 1 | base | `work-thumbnails.tsx:26` |
| `bg-[#182F8C]` |  | hardcoded | 1 | base | `work-thumbnails.tsx:22` |
| `bg-[#1f3b2e]` |  | hardcoded | 1 | `hover:` | `relock-button.tsx:30` |
| `bg-[#3DAE2B]` |  | hardcoded | 1 | base | `work-thumbnails.tsx:30` |
| `bg-[#f3ebd9]/85` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `bg-white` |  | Tailwind default | 1 | base | `cal-embed.tsx:25` |
| `border-[#1f3b2e]/15` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `border-slate-200/80` |  | Tailwind default | 1 | base | `experience.tsx:894` |
| `rgba(0,0,0,0.35)` |  | hardcoded | 1 | base | `cal-embed.tsx:25` |
| `rgba(15,23,42,0.18)` |  | hardcoded | 1 | base | `experience.tsx:890` |
| `rgba(203, 179, 232, 0.22)` |  | hardcoded | 1 | base | `app/globals.css:99` |
| `rgba(203, 179, 232, 0.28)` |  | hardcoded | 1 | base | `app/globals.css:104` |
| `rgba(203, 179, 232, 0.3)` |  | hardcoded | 1 | base | `app/globals.css:231` |
| `rgba(253,247,238,0.6)` |  | hardcoded | 1 | base | `experience.tsx:656` |
| `rgba(31, 59, 46, 0.18)` |  | hardcoded | 1 | base | `hero.tsx:24` |
| `rgba(31,59,46,0.28)` |  | hardcoded | 1 | base | `work-thumbnails.tsx:321` |
| `rgba(31,59,46,0.45)` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `ring-[#0A66C2]` |  | hardcoded | 1 | `focus-visible:` | `nav.tsx:402` |
| `text-[#10240E]` |  | hardcoded | 1 | base | `work-thumbnails.tsx:30` |
| `text-[#1f3b2e]` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `text-[#e8dcc6]` |  | hardcoded | 1 | `hover:` | `relock-button.tsx:30` |
| `text-slate-500` |  | Tailwind default | 1 | base | `experience.tsx:895` |
| `text-slate-600` |  | Tailwind default | 1 | base | `experience.tsx:891` |

What the hardcoded colours are, grouped by origin (no judgement, just provenance):

| Group | Values | Where | Note in code |
|---|---|---|---|
| Lilac at alpha, written as raw `rgba(203,179,232,…)` | 0 ×2, 0.22, 0.28, 0.3 | `app/globals.css:99,100,104,105,231` | Same RGB as `--highlight`, but spelled out because alpha is needed |
| Pine at alpha, raw `rgba(31,59,46,…)` | 0.18, 0.28, 0.45 | `hero.tsx:24`, `work-thumbnails.tsx:321`, `relock-button.tsx:30` | Same RGB as `--fg` |
| Pine / oat hex re-typed in the relock pill | `#1f3b2e`, `#f3ebd9`, `#e8dcc6` | `relock-button.tsx:30` | Same values as `--fg`, `--bg-elevated`, `--bg` |
| Retired pine | `#1F4D3A` | `cal-embed.tsx:15-16` | Cal.com brand colour. This is the pre-v3 accent (CLAUDE.md §3 calls the `#1F4D3A` stack retired). |
| LinkedIn brand blue | `#0A66C2` (+ `/30`), `text-white` | `nav.tsx:402,462` | LinkedIn icon button, desktop + mobile menu |
| Product brand slabs | `#182F8C` BondScanner, `#171513` Ultra, `#3DAE2B` + `#10240E` MoveInSync | `work-thumbnails.tsx:22,26,30` | Comment `work-thumbnails.tsx:17-18`: "Sampled from the logo files" |
| Tailwind `slate` + `white` | `slate-200/70`, `slate-200/80`, `slate-500`, `slate-600`, `white/95`, `rgba(15,23,42,0.18)` (= slate-900) | `experience.tsx:890-902` | Desktop timeline hover tooltip. The only Tailwind-palette greys in scope. |
| Black shadow | `rgba(0,0,0,0.35)` + `bg-white` | `cal-embed.tsx:25` | Cal booker card |
| Timeline band fade | `rgba(253,247,238,0.6)` | `experience.tsx:656` | Same RGB as `--venn-cream` |
| Shelf-card override (dead, excluded from the table above) | `#F7F1E6` (selector), `#ede4d9`, plus `rgba(31,59,46,.22)` and `rgba(203,179,232,.4)` shadows | `app/globals.css:249-255` | Rule targets class `bg-[#F7F1E6]`. **No element in the repo has that class** (grep). See Appendix B. |
| `theme-color` meta | `#E8DCC6` | `app/layout.tsx:163` | Same as `--bg` |
| Highlighter stroke asset | `#CBB3E8` @0.6, `#B89CDC` @0.28 to 0.35 | `public/images/v3/highlighter.svg:7-17` | Background-image used by every highlight mark; cannot read CSS variables |
| Tailwind ring offset | `#fff` (Tailwind's default `--tw-ring-offset-color`) | applied by every `ring-offset-2` (17 uses, §2.7) | Confirmed in `node_modules/tailwindcss/dist/lib.js`. No `ring-offset-bg` override exists in scope. |

#### 2.1d Colour islands (rendered, but with their own palette)

| Island | Palette | Where |
|---|---|---|
| AI Call pipeline iframe | Own `:root` with **light and dark** sets. Light: `--bg #ffffff`, `--text #0a0a0a`, `--accent #635bff`, `--warning #d97706`, `--success #16a34a`, greys `#fafafa #f3f3f5 #666 #999`. Dark (via `prefers-color-scheme: dark`): `--bg #0a0a0b`, `--accent #8b7cff` and more. Font stack `-apple-system, … "Inter" …`. | `public/artifacts/ai-call-pipeline.html:10-28` (light), `:34-55` (dark media query), `:59-77` (forced dark), `:84` (font) |
| Cal.com booker | Third-party iframe. Only the brand colour is set from this repo (`#1F4D3A`). Everything else is Cal's own. | `cal-embed.tsx:13-20` |

### 2.2 Typography

#### 2.2a Font families

| Family | Variable | Loaded | Utility / reference | Uses |
|---|---|---|---|---:|
| Geist Sans | `--font-geist-sans` → `--font-sans` **and** `--font-serif` | `app/layout.tsx:12-16` | `font-serif` 14, `font-sans` 3, `var(--font-serif)` in SVG 4, `body` default 1. **Phase 4: only the utility classes resolve; `body` and the SVG references render in the system font** (03-gaps G-C17). | see table |
| Geist Mono | `--font-geist-mono` → `--font-mono` | `app/layout.tsx:18-22` | `font-mono` 27, `var(--font-mono)` 4 | |
| Kalam 400 | `--font-hand` | `app/layout.tsx:26-31` | Inline `style={{fontFamily: "var(--font-hand), cursive"}}` only. **No `font-hand` utility is used.** | 4 |

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `font-mono` |  | variable | 27 | base `[&_thead_th]:` `[&_tbody_td.num]:` | `app/work/[slug]/page.tsx:102,118,142,165,207` `experience.tsx:66,146,151,157,315,339,415,693,895,954,962` `nav.tsx:431` `relock-button.tsx:30` `section-header.tsx:14,24` `work-thumbnails.tsx:316,345` `case-study/case-study-toc.tsx:47,64` `case-study/patterns/data-table.tsx:72` `case-study/primitives/eyebrow.tsx:21` |
| `font-serif` |  | variable | 14 | `[&_h2]:` base | `app/work/[slug]/page.tsx:46,105,145,168` `contact.tsx:12` `experience.tsx:231,319` `hero.tsx:64` `section-header.tsx:18` `work-thumbnails.tsx:358` `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:55` `case-study/patterns/step-grid.tsx:82` `case-study/primitives/metric.tsx:23` |
| `font-sans` |  | variable | 3 | `[&_h3]:` base | `app/work/[slug]/page.tsx:46` `case-study/patterns/timeline.tsx:25` `case-study/primitives/callout.tsx:48` |
| `var(--font-serif), serif` |  | hardcoded | 3 | base | `product-venn-travel.tsx:726` `product-venn.tsx:472,564` |
| `var(--font-hand), cursive` |  | hardcoded | 2 | base | `experience.tsx:16` `hero.tsx:56` |
| `var(--font-mono), monospace` |  | hardcoded | 2 | base | `product-venn-travel.tsx:761` `product-venn.tsx:506` |
| `font-family: var(--font-mono), ui-monospace, monospace` |  | hardcoded | 1 | base | `about-collage.css:593` |
| `font-family: var(--font-sans), Arial, Helvetica, sans-serif` |  | hardcoded | 1 | base | `app/globals.css:74` |

#### 2.2b Font sizes

The `@theme` type scale at `app/globals.css:47-58` (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`) is **defined but used 0 times** in scope. Every size below comes from Tailwind's default scale or an arbitrary value.

SVG `fontSize` values (`14.5`, `36`, `24`, `28`, `30`) are in viewBox units of a `1200 × 940` drawing that scales to its container width (`product-venn.tsx:435-437`). Their rendered pixel size depends on viewport width; Phase 4 measures it.

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `text-sm` | 0.875rem (14px) / lh 1.429 | Tailwind default | 26 | base | `app/work/[slug]/page.tsx:97,112,149,171,178` `contact.tsx:32` `experience.tsx:144,157,563,667,719,750,951,954,1004` `hero.tsx:83` `nav.tsx:170,372,413` `work-thumbnails.tsx:361` `case-study/case-study-toc.tsx:60` `case-study/patterns/data-table.tsx:28,72` `case-study/patterns/step-grid.tsx:88` `case-study/patterns/timeline.tsx:27` `case-study/primitives/metric.tsx:30` |
| `text-xs` | 0.75rem (12px) / lh 1.333 | Tailwind default | 17 | base | `app/work/[slug]/page.tsx:102` `experience.tsx:66,151,315,339,415,439,693,752,961,973` `section-header.tsx:14,24` `site-footer.tsx:97` `work-thumbnails.tsx:316,345` `case-study/primitives/eyebrow.tsx:24` |
| `text-base` | 1rem (16px) / lh 1.5 | Tailwind default | 8 | base `md:` | `contact.tsx:16` `experience.tsx:212,248,325,719` `nav.tsx:473` `case-study/patterns/timeline.tsx:25` `case-study/primitives/callout.tsx:48` |
| `text-[10px]` |  | hardcoded | 7 | base | `app/work/[slug]/page.tsx:142,165,207` `case-study/case-study-toc.tsx:47,64` `case-study/primitives/eyebrow.tsx:26,27` |
| `text-lg` | 1.125rem (18px) / lh 1.556 | Tailwind default | 7 | `[&_h3]:` base `md:` | `app/work/[slug]/page.tsx:46,108` `contact.tsx:16` `experience.tsx:31,213,348` `nav.tsx:448` |
| `text-[2.25rem]` |  | hardcoded | 5 | `md:[&_h2]:` `md:` base | `app/work/[slug]/page.tsx:46` `hero.tsx:55,64` `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:55` |
| `text-3xl` | 1.875rem (30px) / lh 1.2 | Tailwind default | 5 | `md:` base | `app/work/[slug]/page.tsx:145` `experience.tsx:319` `hero.tsx:55` `section-header.tsx:18` `case-study/primitives/metric.tsx:23` |
| `text-[11px]` |  | hardcoded | 4 | base `[&_thead_th]:` | `app/work/[slug]/page.tsx:118` `experience.tsx:146,962` `case-study/patterns/data-table.tsx:72` |
| `text-2xl` | 1.5rem (24px) / lh 1.333 | Tailwind default | 4 | base | `app/work/[slug]/page.tsx:145,168` `experience.tsx:210` `work-thumbnails.tsx:358` |
| `text-[1.75rem]` |  | hardcoded | 3 | `[&_h2]:` base | `app/work/[slug]/page.tsx:46` `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:55` |
| `text-xl` | 1.25rem (20px) / lh 1.4 | Tailwind default | 3 | `md:` base | `experience.tsx:348` `nav.tsx:431` `case-study/patterns/step-grid.tsx:82` |
| `14.5` |  | hardcoded | 2 | base | `product-venn-travel.tsx:762` `product-venn.tsx:507` |
| `36` |  | hardcoded | 2 | base | `product-venn-travel.tsx:727` `product-venn.tsx:473` |
| `text-[15px]` |  | hardcoded | 2 | base | `experience.tsx:325,891` |
| `text-[3rem]` |  | hardcoded | 2 | base `md:` | `contact.tsx:12` `hero.tsx:64` |
| `text-4xl` | 2.25rem (36px) / lh 1.111 | Tailwind default | 2 | base `md:` | `app/work/[slug]/page.tsx:105` `case-study/primitives/metric.tsx:23` |
| `text-5xl` | 3rem (48px) / lh 1 | Tailwind default | 2 | `md:` | `app/work/[slug]/page.tsx:105` `section-header.tsx:18` |
| `{hideMarker ? 24 : 30}` |  | hardcoded | 1 | base | `product-venn.tsx:566` |
| `{variant === "stage" ? 28 : 30}` |  | hardcoded | 1 | base | `product-venn-travel.tsx:825` |
| `font-size: 0.58rem` |  | hardcoded | 1 | base | `about-collage.css:594` |
| `font-size: 0.8125rem` |  | hardcoded | 1 | base | `about-collage.css:602` |
| `font-size: 0.9375rem` |  | hardcoded | 1 | base | `about-collage.css:688` |
| `font-size: clamp(0.9375rem, 1.7vw, 1.125rem)` |  | hardcoded | 1 | base | `about-collage.css:456` |
| `font-size: clamp(1.75rem, 5vw, 2.65rem)` |  | hardcoded | 1 | base | `about-collage.css:448` |
| `text-[0.68rem]` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `text-[12px]` |  | hardcoded | 1 | base | `experience.tsx:895` |
| `text-[2.5rem]` |  | hardcoded | 1 | `md:` | `experience.tsx:319` |
| `text-[3.25rem]` |  | hardcoded | 1 | `lg:` | `hero.tsx:64` |
| `text-[4rem]` |  | hardcoded | 1 | `md:` | `contact.tsx:12` |

Headline sizes per breakpoint (read from the class strings, so the mobile picture is explicit):

| Element | Base (mobile) | `md:` 768+ | `lg:` 1024+ | Line height | Tracking | Where |
|---|---|---|---|---|---|---|
| Hero H1 | 2.25rem / 36px | 3rem / 48px | 3.25rem / 52px | 1.08 | tight (-0.025em) | `hero.tsx:64` |
| Hero greeting (Kalam) | 1.875rem / 30px | 2.25rem / 36px | | 1 | | `hero.tsx:55` |
| Section H2 (`SectionHeader`) | 1.875rem / 30px | 3rem / 48px | | 1.1 | tight | `section-header.tsx:18` |
| About title | `clamp(1.75rem, 5vw, 2.65rem)` (28 to 42.4px) | | | 1.1 | -0.03em | `about-collage.css:447-451` |
| Contact H2 | 3rem / 48px | 4rem / 64px | | 1.05 | tight | `contact.tsx:12` |
| Experience role H3 | 1.875rem / 30px | 2.5rem / 40px | | 1.05 | tight | `experience.tsx:319` |
| Case study H1 | 2.25rem / 36px | 3rem / 48px | | tight (1.25) | none | `app/work/[slug]/page.tsx:105` |
| Case study H2 (Section, MarkdownH2, prose) | 1.75rem / 28px | 2.25rem / 36px | | tight (1.25) | none | `case-study/layouts/section.tsx:55`, `case-study/layouts/markdown-h2.tsx:23`, `app/work/[slug]/page.tsx:46` |
| Headline metric | 1.5rem / 24px | 1.875rem / 30px | | Tailwind default | none | `app/work/[slug]/page.tsx:145` |
| Metric value | 1.875rem / 30px | 2.25rem / 36px | | 1 | none | `case-study/primitives/metric.tsx:23` |

#### 2.2c Font weights

Only two weights are set anywhere. Everything else renders at the browser default (400).

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `font-semibold` | 600 | Tailwind default | 6 | `[&_h3]:` base | `app/work/[slug]/page.tsx:46` `experience.tsx:248,348,750,951` `work-thumbnails.tsx:316` |
| `font-medium` | 500 | Tailwind default | 3 | base | `experience.tsx:973` `nav.tsx:170` `case-study/primitives/eyebrow.tsx:21` |

#### 2.2d Line heights

Explicit line-height classes and declarations only. Tailwind `text-*` utilities also carry a default line height (shown in 2.2b "Resolves to").

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `leading-relaxed` | 1.625 | Tailwind default | 9 | `[&_li]:` `[&_p]:` base | `app/work/[slug]/page.tsx:46,108` `experience.tsx:891,973` `case-study/patterns/data-table.tsx:28` `case-study/patterns/step-grid.tsx:88` `case-study/patterns/timeline.tsx:27` `case-study/primitives/callout.tsx:48` |
| `leading-tight` | 1.25 | Tailwind default | 7 | `[&_h2]:` base | `app/work/[slug]/page.tsx:46,105` `work-thumbnails.tsx:358` `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:55` `case-study/patterns/step-grid.tsx:82` `case-study/primitives/metric.tsx:30` |
| `leading-snug` | 1.375 | Tailwind default | 3 | base | `experience.tsx:961` `case-study/case-study-toc.tsx:60` `case-study/patterns/timeline.tsx:25` |
| `leading-[1.05]` |  | hardcoded | 2 | base | `contact.tsx:12` `experience.tsx:319` |
| `leading-[1.6]` |  | hardcoded | 2 | base | `contact.tsx:16` `site-footer.tsx:97` |
| `leading-none` | 1 | Tailwind default | 2 | base | `experience.tsx:31` `case-study/primitives/metric.tsx:23` |
| `leading-[1.08]` |  | hardcoded | 1 | base | `hero.tsx:64` |
| `leading-[1.1]` |  | hardcoded | 1 | base | `section-header.tsx:18` |
| `leading-[1.4]` |  | hardcoded | 1 | base | `experience.tsx:348` |
| `leading-[1.5]` |  | hardcoded | 1 | base | `experience.tsx:369` |
| `leading-[1.7]` |  | hardcoded | 1 | base | `experience.tsx:325` |
| `leading-[1]` |  | hardcoded | 1 | base | `hero.tsx:55` |
| `leading-5` | 1.25rem | Tailwind default | 1 | base | `work-thumbnails.tsx:361` |
| `line-height: 0` |  | hardcoded | 1 | base | `about-collage.css:182` |
| `line-height: 1.1` |  | hardcoded | 1 | base | `about-collage.css:449` |
| `line-height: 1.45` |  | hardcoded | 1 | base | `about-collage.css:603` |
| `line-height: 1.65` |  | hardcoded | 1 | base | `about-collage.css:457` |

#### 2.2e Letter spacing

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `tracking-wider` | 0.05em | Tailwind default | 12 | base `[&_thead_th]:` | `app/work/[slug]/page.tsx:102,142,165,207` `experience.tsx:146,151,339` `case-study/case-study-toc.tsx:47,64` `case-study/patterns/data-table.tsx:72` `case-study/primitives/eyebrow.tsx:26,27` |
| `tracking-tight` | -0.025em | Tailwind default | 4 | base | `contact.tsx:12` `experience.tsx:319` `hero.tsx:64` `section-header.tsx:18` |
| `tracking-[0.16em]` |  | hardcoded | 2 | base | `section-header.tsx:24` `work-thumbnails.tsx:345` |
| `tracking-[0.24em]` |  | hardcoded | 2 | base | `section-header.tsx:14` `case-study/primitives/eyebrow.tsx:24` |
| `letter-spacing: -0.03em` |  | hardcoded | 1 | base | `about-collage.css:450` |
| `letter-spacing: 0.16em` |  | hardcoded | 1 | base | `about-collage.css:595` |
| `tracking-[-0.04em]` |  | hardcoded | 1 | base | `work-thumbnails.tsx:316` |
| `tracking-[0.18em]` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `tracking-[0.2em]` |  | hardcoded | 1 | base | `experience.tsx:315` |
| `tracking-wide` | 0.025em | Tailwind default | 1 | base | `experience.tsx:895` |

### 2.3 Spacing

#### 2.3a Spacing by scale step (Tailwind utilities)

Tailwind v4 spacing is `calc(0.25rem * n)` (`node_modules/tailwindcss/theme.css:325`). This roll-up counts every padding, margin, gap, space-between and scroll-margin utility by step:

| Step | Value | Uses | Utilities (count) |
|---:|---|---:|---|
| auto | auto | 11 | `mx` 10, `ml` 1 |
| 0 | 0rem (0px) | 4 | `mt` 1, `ml` 1, `gap` 1, `pl` 1 |
| 0.5 | 0.125rem (2px) | 5 | `mt` 3, `gap-y` 1, `gap` 1 |
| 1 | 0.25rem (4px) | 19 | `p` 5, `mt` 4, `py` 3, `space-y` 2, `mb` 2, `mr` 1, `px` 1, `mx` 1 |
| 1.5 | 0.375rem (6px) | 6 | `py` 3, `p` 1, `mt` 1, `gap` 1 |
| 2 | 0.5rem (8px) | 41 | `gap` 18, `py` 7, `mt` 5, `space-y` 2, `pl` 2, `mb` 1, `gap-x` 1, `pb` 1, `mr` 1, `ml` 1, `px` 1, `pt` 1 |
| 2.5 | 0.625rem (10px) | 4 | `py` 2, `px` 1, `pl` 1 |
| 3 | 0.75rem (12px) | 31 | `mt` 8, `gap` 8, `px` 5, `py` 5, `mb` 4, `pt` 1 |
| 3.5 | 0.875rem (14px) | 3 | `px` 2, `pr` 1 |
| 4 | 1rem (16px) | 30 | `mt` 9, `gap` 8, `px` 7, `space-y` 2, `p` 1, `gap-y` 1, `pr` 1, `pl` 1 |
| 5 | 1.25rem (20px) | 7 | `p` 2, `px` 1, `py` 1, `gap` 1, `pl` 1, `mt` 1 |
| 6 | 1.5rem (24px) | 42 | `px` 10, `gap` 10, `p` 7, `mt` 6, `pl` 3, `mb` 2, `py` 1, `pr` 1, `pt` 1, `space-y` 1 |
| 8 | 2rem (32px) | 24 | `px` 7, `gap` 6, `mt` 5, `p` 3, `gap-x` 1, `py` 1, `my` 1 |
| 10 | 2.5rem (40px) | 21 | `my` 10, `mt` 5, `gap` 4, `mb` 1, `pb` 1 |
| 12 | 3rem (48px) | 5 | `pt` 2, `mt` 1, `mb` 1, `my` 1 |
| 14 | 3.5rem (56px) | 1 | `mb` 1 |
| 16 | 4rem (64px) | 11 | `mt` 6, `pb` 2, `gap-x` 1, `scroll-mt` 1, `mb` 1 |
| 20 | 5rem (80px) | 11 | `mt` 9, `py` 2 |
| 24 | 6rem (96px) | 6 | `py` 3, `scroll-mt` 2, `pb` 1 |
| 28 | 7rem (112px) | 2 | `py` 2 |
| 32 | 8rem (128px) | 4 | `py` 3, `pt` 1 |
| 48 | 12rem (192px) | 1 | `pt` 1 |


#### 2.3b Section rhythm (vertical padding per fold)

| Fold | Mobile | `md:` | Horizontal | Max width | Where |
|---|---|---|---|---|---|
| Hero | `py-20` (80px) | `py-28` (112px) | `px-6` / `md:px-8` | `max-w-5xl` | `hero.tsx:34-35,38` |
| Experience | `py-24` (96px) | `py-32` (128px) | `px-6` / `md:px-8` | `max-w-5xl` | `experience.tsx:25-27` |
| Selected Work | `py-24` | `py-32` | `px-6` / `md:px-8` | `max-w-6xl` | `selected-work-shelf.tsx:13,15` |
| About | 210svh scroll track (mobile), 200svh (768-1023), 220svh (desktop); content is a 100svh sticky stage | | bio `1.35rem` mobile, `5rem` tablet, `max(1.75rem, calc(50vw - 15rem))` desktop | slip `32rem` | `about-collage.css:29,37,368,624,641,656,679` |
| Contact | `pt-32 pb-16` | `pt-48 pb-24` | `px-6` / `md:px-8` | `max-w-5xl`, booker `1000px` / `1040px` at ≥1104px | `contact.tsx:9,11,28` |
| Footer | `py-6` | `py-8` | `px-6` / `md:px-8` | `max-w-5xl` | `site-footer.tsx:77-78` |
| Case study page | `py-24` | `py-32` | `px-6` / `md:px-8` | `46rem` column; `max-w-6xl` grid with `15.5rem` rail at `xl:` | `app/work/[slug]/page.tsx:80-87` |
| Case study `Section` | `mt-16` (64px) | `mt-20` (80px) | | | `case-study/layouts/section.tsx:28-35` (`deepDive` and `reflection` use `mt-20` at all sizes) |

#### 2.3c Full spacing utility table

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `gap-2` | 0.5rem (8px) | Tailwind default | 18 | base | `app/work/[slug]/page.tsx:97,114,178` `experience.tsx:326,334,348,741,943` `hero.tsx:83` `nav.tsx:181,372,390,413,473` `relock-button.tsx:30` `section-header.tsx:24` `site-footer.tsx:79` `work-thumbnails.tsx:224` |
| `gap-6` | 1.5rem (24px) | Tailwind default | 10 | base `md:` | `experience.tsx:28,131` `nav.tsx:441` `work-thumbnails.tsx:211` `case-study/patterns/data-table.tsx:62` `case-study/patterns/step-grid.tsx:112,116,117` `case-study/patterns/timeline.tsx:79` `case-study/primitives/metric.tsx:50` |
| `mx-auto` |  | Tailwind default | 10 | base | `app/work/[slug]/page.tsx:82` `cal-embed.tsx:25` `contact.tsx:11,28,32` `experience.tsx:27` `hero.tsx:38` `nav.tsx:335` `selected-work-shelf.tsx:15` `site-footer.tsx:78` |
| `my-10` | 2.5rem (40px) | Tailwind default | 10 | base | `case-study/patterns/data-table.tsx:60,71` `case-study/patterns/step-grid.tsx:112,114,116,117` `case-study/patterns/timeline.tsx:72,79,85` `case-study/primitives/metric.tsx:50` |
| `px-6` | 1.5rem (24px) | Tailwind default | 10 | base `md:` | `app/work/[slug]/page.tsx:80` `contact.tsx:9` `experience.tsx:25` `hero.tsx:34,35,83` `nav.tsx:335,473` `selected-work-shelf.tsx:13` `site-footer.tsx:77` |
| `mt-20` | 5rem (80px) | Tailwind default | 9 | base `md:` | `app/work/[slug]/page.tsx:203` `case-study/layouts/section.tsx:28,29,30,31,32,33,34,35` |
| `mt-4` | 1rem (16px) | Tailwind default | 9 | `[&_p]:` `[&_ul]:` base | `app/work/[slug]/page.tsx:46,112,114,149` `experience.tsx:987` `nav.tsx:456` `work-thumbnails.tsx:224` `case-study/patterns/data-table.tsx:28` |
| `gap-3` | 0.75rem (12px) | Tailwind default | 8 | base | `experience.tsx:30,369,411` `nav.tsx:335,448,456` `work-thumbnails.tsx:344` `case-study/case-study-toc.tsx:60` |
| `gap-4` | 1rem (16px) | Tailwind default | 8 | base | `experience.tsx:131,303` `hero.tsx:45` `site-footer.tsx:78` `case-study/patterns/step-grid.tsx:61,112,116,117` |
| `mt-3` | 0.75rem (12px) | Tailwind default | 8 | base | `app/work/[slug]/page.tsx:105,171` `experience.tsx:894,1004` `work-thumbnails.tsx:358` `case-study/case-study-toc.tsx:50` `case-study/patterns/step-grid.tsx:82,88` |
| `p-6` | 1.5rem (24px) | Tailwind default | 7 | base `md:` | `app/work/[slug]/page.tsx:140,163` `experience.tsx:302` `case-study/patterns/data-table.tsx:62` `case-study/patterns/step-grid.tsx:59` `case-study/primitives/callout.tsx:45` `case-study/primitives/metric.tsx:37` |
| `px-4` | 1rem (16px) | Tailwind default | 7 | `focus:` base `[&_thead_th]:` `[&_tbody_td]:` | `app/layout.tsx:195` `nav.tsx:335,413` `section-header.tsx:24` `case-study/patterns/data-table.tsx:72` `case-study/patterns/timeline.tsx:57` |
| `px-8` | 2rem (32px) | Tailwind default | 7 | `md:` | `app/work/[slug]/page.tsx:80` `contact.tsx:9` `experience.tsx:25` `hero.tsx:34,35` `selected-work-shelf.tsx:13` `site-footer.tsx:77` |
| `py-2` | 0.5rem (8px) | Tailwind default | 7 | `focus:` base `[&_thead_th]:` | `app/layout.tsx:195` `experience.tsx:741` `nav.tsx:170,413` `relock-button.tsx:30` `section-header.tsx:24` `case-study/patterns/data-table.tsx:72` |
| `gap-8` | 2rem (32px) | Tailwind default | 6 | base `md:` | `hero.tsx:38` `work-thumbnails.tsx:64,65` `case-study/layouts/section.tsx:66` `case-study/patterns/step-grid.tsx:114` `case-study/primitives/metric.tsx:50` |
| `mt-16` | 4rem (64px) | Tailwind default | 6 | base | `case-study/layouts/section.tsx:28,29,30,31,32,35` |
| `mt-6` | 1.5rem (24px) | Tailwind default | 6 | `[&_h3]:` base | `app/work/[slug]/page.tsx:46,108,178` `experience.tsx:325,563,719` |
| `mt-10` | 2.5rem (40px) | Tailwind default | 5 | `[&_h2]:` base | `app/work/[slug]/page.tsx:46,128,140,163` `contact.tsx:28` |
| `mt-2` | 0.5rem (8px) | Tailwind default | 5 | base | `app/work/[slug]/page.tsx:145,168` `work-thumbnails.tsx:361` `case-study/primitives/callout.tsx:48` `case-study/primitives/metric.tsx:26` |
| `mt-8` | 2rem (32px) | Tailwind default | 5 | base | `app/work/[slug]/page.tsx:102,211` `contact.tsx:16,32` `hero.tsx:79` |
| `p-1` | 0.25rem (4px) | Tailwind default | 5 | base | `experience.tsx:66,212,213,415` `nav.tsx:359` |
| `px-3` | 0.75rem (12px) | Tailwind default | 5 | base | `experience.tsx:77,339,426,741,939` |
| `py-3` | 0.75rem (12px) | Tailwind default | 5 | base `[&_tbody_td]:` | `experience.tsx:939` `hero.tsx:83` `nav.tsx:473` `case-study/patterns/data-table.tsx:72` `case-study/patterns/timeline.tsx:57` |
| `gap-10` | 2.5rem (40px) | Tailwind default | 4 | `md:` | `hero.tsx:38` `case-study/layouts/section.tsx:66` `case-study/patterns/step-grid.tsx:114` `case-study/patterns/timeline.tsx:79` |
| `mb-3` | 0.75rem (12px) | Tailwind default | 4 | base | `experience.tsx:365` `hero.tsx:45` `section-header.tsx:14` `case-study/layouts/section.tsx:51` |
| `mt-1` | 0.25rem (4px) | Tailwind default | 4 | base | `experience.tsx:367` `case-study/patterns/timeline.tsx:25,27` `case-study/primitives/metric.tsx:30` |
| `mt-0.5` | 0.125rem (2px) | Tailwind default | 3 | base | `experience.tsx:146,349` `case-study/case-study-toc.tsx:64` |
| `p-8` | 2rem (32px) | Tailwind default | 3 | `md:` | `app/work/[slug]/page.tsx:140,163` `experience.tsx:302` |
| `pl-6` | 1.5rem (24px) | Tailwind default | 3 | `[&_ul]:` `md:[&>*:last-child]:` base | `app/work/[slug]/page.tsx:46` `case-study/patterns/data-table.tsx:57` `case-study/patterns/timeline.tsx:35` |
| `py-1.5` | 0.375rem (6px) | Tailwind default | 3 | base | `experience.tsx:77,426` `nav.tsx:372` |
| `py-1` | 0.25rem (4px) | Tailwind default | 3 | base | `app/work/[slug]/page.tsx:118` `experience.tsx:339,586` |
| `py-24` | 6rem (96px) | Tailwind default | 3 | base | `app/work/[slug]/page.tsx:80` `experience.tsx:25` `selected-work-shelf.tsx:13` |
| `py-32` | 8rem (128px) | Tailwind default | 3 | `md:` | `app/work/[slug]/page.tsx:80` `experience.tsx:25` `selected-work-shelf.tsx:13` |
| `mb-1` | 0.25rem (4px) | Tailwind default | 2 | base | `experience.tsx:315,667` |
| `mb-6` | 1.5rem (24px) | Tailwind default | 2 | base | `experience.tsx:411` `case-study/layouts/section.tsx:49` |
| `p-5` | 1.25rem (20px) | Tailwind default | 2 | base | `work-thumbnails.tsx:343` `case-study/primitives/callout.tsx:45` |
| `pb-16` | 4rem (64px) | Tailwind default | 2 | base | `contact.tsx:9` `work-thumbnails.tsx:209` |
| `pl-2` | 0.5rem (8px) | Tailwind default | 2 | base | `case-study/patterns/timeline.tsx:72,79` |
| `pt-12` | 3rem (48px) | Tailwind default | 2 | base | `app/work/[slug]/page.tsx:203` `work-thumbnails.tsx:209` |
| `px-3.5` | 0.875rem (14px) | Tailwind default | 2 | base | `nav.tsx:372` `relock-button.tsx:30` |
| `py-2.5` | 0.625rem (10px) | Tailwind default | 2 | base | `app/work/[slug]/page.tsx:178` `case-study/case-study-toc.tsx:60` |
| `py-20` | 5rem (80px) | Tailwind default | 2 | base | `hero.tsx:34,35` |
| `py-28` | 7rem (112px) | Tailwind default | 2 | `md:` | `hero.tsx:34,35` |
| `scroll-mt-24` | 6rem (96px) | Tailwind default | 2 | base | `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:46` |
| `space-y-1` | 0.25rem (4px) | Tailwind default | 2 | base | `app/work/[slug]/page.tsx:149` `experience.tsx:367` |
| `space-y-2` | 0.5rem (8px) | Tailwind default | 2 | `[&_ul]:` | `app/work/[slug]/page.tsx:46` `case-study/patterns/data-table.tsx:28` |
| `space-y-4` | 1rem (16px) | Tailwind default | 2 | base | `experience.tsx:325,586` |
| `gap-0.5` | 0.125rem (2px) | Tailwind default | 1 | base | `nav.tsx:359` |
| `gap-0` | 0rem (0px) | Tailwind default | 1 | `md:` | `case-study/patterns/data-table.tsx:62` |
| `gap-1.5` | 0.375rem (6px) | Tailwind default | 1 | base | `experience.tsx:939` |
| `gap-5` | 1.25rem (20px) | Tailwind default | 1 | `md:` | `experience.tsx:303` |
| `gap-x-16` | 4rem (64px) | Tailwind default | 1 | `xl:` | `app/work/[slug]/page.tsx:84` |
| `gap-x-2` | 0.5rem (8px) | Tailwind default | 1 | base | `experience.tsx:142` |
| `gap-x-8` | 2rem (32px) | Tailwind default | 1 | base | `section-header.tsx:17` |
| `gap-y-0.5` | 0.125rem (2px) | Tailwind default | 1 | base | `experience.tsx:142` |
| `gap-y-4` | 1rem (16px) | Tailwind default | 1 | base | `section-header.tsx:17` |
| `mb-10` | 2.5rem (40px) | Tailwind default | 1 | base | `experience.tsx:28` |
| `mb-12` | 3rem (48px) | Tailwind default | 1 | base | `section-header.tsx:13` |
| `mb-14` | 3.5rem (56px) | Tailwind default | 1 | `md:` | `experience.tsx:28` |
| `mb-16` | 4rem (64px) | Tailwind default | 1 | `md:` | `section-header.tsx:13` |
| `mb-2` | 0.5rem (8px) | Tailwind default | 1 | `md:` | `experience.tsx:30` |
| `ml-0` | 0rem (0px) | Tailwind default | 1 | base | `nav.tsx:216` |
| `ml-2` | 0.5rem (8px) | Tailwind default | 1 | base | `nav.tsx:216` |
| `ml-auto` |  | Tailwind default | 1 | base | `experience.tsx:954` |
| `mr-1` | 0.25rem (4px) | Tailwind default | 1 | base | `experience.tsx:964` |
| `mr-2` | 0.5rem (8px) | Tailwind default | 1 | base | `nav.tsx:194` |
| `mt-0` | 0rem (0px) | Tailwind default | 1 | `xl:` | `app/work/[slug]/page.tsx:128` |
| `mt-1.5` | 0.375rem (6px) | Tailwind default | 1 | base | `experience.tsx:370` |
| `mt-12` | 3rem (48px) | Tailwind default | 1 | base | `app/work/[slug]/page.tsx:46` |
| `mt-5` | 1.25rem (20px) | Tailwind default | 1 | base | `work-thumbnails.tsx:364` |
| `mx-1` | 0.25rem (4px) | Tailwind default | 1 | base | `case-study/patterns/step-grid.tsx:70` |
| `my-12` | 3rem (48px) | Tailwind default | 1 | base | `case-study/one-offs/ai-call-pipeline.tsx:91` |
| `my-8` | 2rem (32px) | Tailwind default | 1 | base | `case-study/primitives/callout.tsx:45` |
| `p-1.5` | 0.375rem (6px) | Tailwind default | 1 | base | `experience.tsx:210` |
| `p-4` | 1rem (16px) | Tailwind default | 1 | base | `experience.tsx:890` |
| `pb-10` | 2.5rem (40px) | Tailwind default | 1 | base | `experience.tsx:169` |
| `pb-24` | 6rem (96px) | Tailwind default | 1 | `md:` | `contact.tsx:9` |
| `pb-2` | 0.5rem (8px) | Tailwind default | 1 | base | `experience.tsx:646` |
| `pl-0` | 0rem (0px) | Tailwind default | 1 | `md:` | `case-study/patterns/timeline.tsx:79` |
| `pl-2.5` | 0.625rem (10px) | Tailwind default | 1 | base | `nav.tsx:170` |
| `pl-4` | 1rem (16px) | Tailwind default | 1 | `[&_ul>li]:` | `case-study/patterns/data-table.tsx:28` |
| `pl-5` | 1.25rem (20px) | Tailwind default | 1 | base | `experience.tsx:586` |
| `pr-3.5` | 0.875rem (14px) | Tailwind default | 1 | base | `nav.tsx:170` |
| `pr-4` | 1rem (16px) | Tailwind default | 1 | base | `work-thumbnails.tsx:310` |
| `pr-6` | 1.5rem (24px) | Tailwind default | 1 | `md:[&>*:first-child]:` | `case-study/patterns/data-table.tsx:57` |
| `pt-2` | 0.5rem (8px) | Tailwind default | 1 | `md:` | `case-study/patterns/timeline.tsx:79` |
| `pt-32` | 8rem (128px) | Tailwind default | 1 | base | `contact.tsx:9` |
| `pt-3` | 0.75rem (12px) | Tailwind default | 1 | base | `experience.tsx:894` |
| `pt-48` | 12rem (192px) | Tailwind default | 1 | `md:` | `contact.tsx:9` |
| `pt-6` | 1.5rem (24px) | Tailwind default | 1 | base | `case-study/patterns/timeline.tsx:51` |
| `px-1` | 0.25rem (4px) | Tailwind default | 1 | base | `experience.tsx:973` |
| `px-2.5` | 0.625rem (10px) | Tailwind default | 1 | base | `app/work/[slug]/page.tsx:118` |
| `px-2` | 0.5rem (8px) | Tailwind default | 1 | base | `case-study/case-study-toc.tsx:60` |
| `px-5` | 1.25rem (20px) | Tailwind default | 1 | base | `app/work/[slug]/page.tsx:178` |
| `py-5` | 1.25rem (20px) | Tailwind default | 1 | base | `experience.tsx:131` |
| `py-6` | 1.5rem (24px) | Tailwind default | 1 | base | `site-footer.tsx:77` |
| `py-8` | 2rem (32px) | Tailwind default | 1 | `md:` | `site-footer.tsx:77` |
| `scroll-mt-16` | 4rem (64px) | Tailwind default | 1 | base | `contact.tsx:9` |
| `space-y-6` | 1.5rem (24px) | Tailwind default | 1 | base | `case-study/patterns/timeline.tsx:72` |

#### 2.3d Hardcoded spacing

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `gap-[18px]` |  | hardcoded | 1 | `md:` | `hero.tsx:45` |
| `margin-bottom: 0.35rem` |  | hardcoded | 1 | base | `about-collage.css:592` |
| `margin-inline: auto` |  | hardcoded | 1 | base | `about-collage.css:375` |
| `margin-top: 0.75rem` |  | hardcoded | 1 | base | `about-collage.css:462` |
| `margin-top: 0.9rem` |  | hardcoded | 1 | base | `about-collage.css:455` |
| `margin: 0 0.02em` |  | hardcoded | 1 | base | `app/globals.css:119` |
| `padding: 0 0.06em` |  | hardcoded | 1 | base | `about-collage.css:468` |
| `padding: 0 0.1em` |  | hardcoded | 1 | base | `app/globals.css:117` |
| `padding: 0.04em 0.12em` |  | hardcoded | 1 | base | `app/globals.css:206` |
| `padding: 0.28rem 0.26rem 0.32rem` |  | hardcoded | 1 | base | `about-collage.css:675` |
| `padding: 0.32rem 0.3rem 0.38rem` |  | hardcoded | 1 | base | `about-collage.css:637` |
| `padding: 0.42rem 0.4rem 0.5rem` |  | hardcoded | 1 | base | `about-collage.css:180` |
| `padding: 0.7rem 0.8rem 0.8rem` |  | hardcoded | 1 | base | `about-collage.css:488` |
| `padding: 0` |  | hardcoded | 1 | base | `about-collage.css:610` |
| `padding: 1.05rem 1rem 1.15rem` |  | hardcoded | 1 | base | `about-collage.css:684` |
| `padding: 1.15rem 1.1rem 1.25rem` |  | hardcoded | 1 | base | `about-collage.css:646` |
| `padding: 1.45rem 1.5rem 1.6rem` |  | hardcoded | 1 | base | `about-collage.css:376` |
| `padding: 7.5rem 5rem 7rem` |  | hardcoded | 1 | base | `about-collage.css:641` |
| `padding: 8rem max(1.75rem, calc(50vw - 15rem)) 7.5rem` |  | hardcoded | 1 | base | `about-collage.css:368` |
| `padding: 9.25rem 1.35rem 9.75rem` |  | hardcoded | 1 | base | `about-collage.css:679` |
| `scroll-margin-top: 80px` |  | hardcoded | 1 | base | `app/globals.css:316` |
| `text-underline-offset: 4px` |  | hardcoded | 1 | base | `app/globals.css:241` |

#### 2.3e Max widths

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `max-w-5xl` | 64rem (1024px) | Tailwind default | 4 | base | `contact.tsx:11` `experience.tsx:27` `hero.tsx:38` `site-footer.tsx:78` |
| `max-w-6xl` | 72rem (1152px) | Tailwind default | 3 | `xl:` base | `app/work/[slug]/page.tsx:84` `nav.tsx:335` `selected-work-shelf.tsx:15` |
| `max-width: 100%` |  | hardcoded | 2 | base | `about-collage.css:645,683` |
| `max-width: none` |  | hardcoded | 2 | base | `about-collage.css:567,577` |
| `max-w-[1000px]` |  | hardcoded | 1 | base | `contact.tsx:28` |
| `max-w-[1040px]` |  | hardcoded | 1 | `min-[1104px]:` | `contact.tsx:28` |
| `max-w-[46rem]` |  | hardcoded | 1 | base | `app/work/[slug]/page.tsx:82` |
| `max-w-2xl` | 42rem (672px) | Tailwind default | 1 | base | `contact.tsx:32` |
| `max-w-3xl` | 48rem (768px) | Tailwind default | 1 | base | `section-header.tsx:18` |
| `max-w-none` |  | Tailwind default | 1 | base | `app/work/[slug]/page.tsx:46` |
| `max-w-xl` | 36rem (576px) | Tailwind default | 1 | base | `case-study/layouts/section.tsx:79` |
| `max-width: 12rem` |  | hardcoded | 1 | base | `about-collage.css:487` |
| `max-width: 32rem` |  | hardcoded | 1 | base | `about-collage.css:374` |

### 2.4 Border radius

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `rounded-full` | calc(infinity * 1px) | Tailwind default | 26 | base | `app/work/[slug]/page.tsx:118,178` `experience.tsx:66,77,240,339,415,426,595` `hero.tsx:22,83` `nav.tsx:170,194,359,372,402,413,462,473` `relock-button.tsx:30` `section-header.tsx:24` `site-footer.tsx:89` `work-thumbnails.tsx:229,237` `case-study/patterns/timeline.tsx:38,49` |
| `rounded-xl` | 0.75rem (12px) | Tailwind default | 7 | base | `app/work/[slug]/page.tsx:140,163` `cal-embed.tsx:25` `experience.tsx:741,776,939` `case-study/one-offs/ai-call-pipeline.tsx:91` |
| `rounded-lg` | 0.5rem (8px) | Tailwind default | 5 | base | `experience.tsx:218` `case-study/patterns/data-table.tsx:60` `case-study/patterns/step-grid.tsx:59` `case-study/primitives/callout.tsx:45` `case-study/primitives/metric.tsx:37` |
| `rounded-md` | 0.375rem (6px) | Tailwind default | 5 | `focus:` base | `app/layout.tsx:195` `nav.tsx:429` `work-thumbnails.tsx:354` `case-study/patterns/data-table.tsx:71` `case-study/patterns/timeline.tsx:85` |
| `2` |  | hardcoded | 4 | base | `nav.tsx:558,596` `relock-button.tsx:42` `site-footer.tsx:46` |
| `rounded-[1.75rem]` |  | hardcoded | 4 | base | `work-thumbnails.tsx:295,310,321,343` |
| `rounded-2xl` | 1rem (16px) | Tailwind default | 3 | base | `experience.tsx:302,652` `work-thumbnails.tsx:364` |
| `rounded-sm` | 0.25rem (4px) | Tailwind default | 3 | base | `app/work/[slug]/page.tsx:97` `experience.tsx:256` `nav.tsx:448` |
| `7` |  | hardcoded | 2 | base | `product-venn-travel.tsx:753` `product-venn.tsx:498` |
| `7px` |  | hardcoded | 1 | base | `product-venn-travel.tsx:352` |
| `999px` |  | hardcoded | 1 | base | `hero-link.tsx:35` |
| `border-radius: 2px` |  | hardcoded | 1 | base | `app/globals.css:232` |
| `rounded-[18px]` |  | hardcoded | 1 | base | `experience.tsx:890` |

Rows `2` and `7` are SVG `rx` attributes: `2` on icon rectangles (`nav.tsx:558,596`, `relock-button.tsx:42`, `site-footer.tsx:46`), `7` on Venn chips in viewBox units (`product-venn.tsx:498`, `product-venn-travel.tsx:753`).

### 2.5 Shadows

Tailwind's `shadow-sm` / `shadow-md` are **black** at 10% (`theme.css:408-409`). Every custom shadow is pine-tinted, except the Cal card (black) and the timeline tooltip (slate).

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `shadow-sm` | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) | Tailwind default | 3 | base | `experience.tsx:741` `nav.tsx:360,374` |
| `shadow-md` | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | Tailwind default | 2 | `hover:` base | `experience.tsx:741` `nav.tsx:360` |
| `box-shadow: 0 0 0 4px rgba(203, 179, 232, 0.3)` |  | hardcoded | 1 | base | `app/globals.css:231` |
| `box-shadow: 0 1px 0 color-mix(in srgb, var(--fg) 12%, transparent)` |  | hardcoded | 1 | base | `about-collage.css:439` |
| `box-shadow: 0 1px 0 color-mix(in srgb, var(--fg) 14%, transparent)` |  | hardcoded | 1 | base | `about-collage.css:357` |
| `drop-shadow(0 2px 8px rgba(31, 59, 46, 0.18))` |  | hardcoded | 1 | base | `hero.tsx:24` |
| `filter: drop-shadow( 0.2rem 0.35rem 0.45rem color-mix(in srgb, var(--fg) 22%, transparent) )` |  | hardcoded | 1 | base | `about-collage.css:494` |
| `filter: drop-shadow( 0.2rem 0.4rem 0.55rem color-mix(in srgb, var(--fg) 28%, transparent) )` |  | hardcoded | 1 | base | `about-collage.css:183` |
| `filter: drop-shadow( 0.35rem 0.7rem 0.85rem color-mix(in srgb, var(--fg) 22%, transparent) )` |  | hardcoded | 1 | base | `about-collage.css:382` |
| `shadow-[0_10px_30px_-12px_rgba(31,59,46,0.45)]` |  | hardcoded | 1 | base | `relock-button.tsx:30` |
| `shadow-[0_12px_28px_-10px_rgba(15,23,42,0.18)]` |  | hardcoded | 1 | base | `experience.tsx:890` |
| `shadow-[0_18px_32px_-22px_rgba(31,59,46,0.28)]` |  | hardcoded | 1 | base | `work-thumbnails.tsx:321` |
| `shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]` |  | hardcoded | 1 | base | `cal-embed.tsx:25` |

### 2.6 Borders, rings, outlines

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `border` | 1px | Tailwind default | 29 | base | `app/work/[slug]/page.tsx:118,140,163` `experience.tsx:66,218,302,339,415,741,890,939` `nav.tsx:170,359,402,462` `relock-button.tsx:30` `section-header.tsx:24` `work-thumbnails.tsx:229,237,343` `case-study/one-offs/ai-call-pipeline.tsx:91` `case-study/patterns/data-table.tsx:60,71` `case-study/patterns/step-grid.tsx:59` `case-study/patterns/timeline.tsx:85` `case-study/primitives/callout.tsx:41,45` `case-study/primitives/metric.tsx:37` |
| `ring-2` | 2px | Tailwind default | 19 | `focus-visible:` base | `app/work/[slug]/page.tsx:97,178` `experience.tsx:77,131,240,256,426,776,939` `hero.tsx:83` `nav.tsx:170,372,402,413,429,448` `site-footer.tsx:89` `work-thumbnails.tsx:295` `case-study/case-study-toc.tsx:60` |
| `outline-none` |  | Tailwind default | 18 | `focus-visible:` | `app/work/[slug]/page.tsx:97,178` `experience.tsx:77,131,256,426,776,939` `hero.tsx:83` `nav.tsx:170,372,402,413,429,448` `site-footer.tsx:89` `work-thumbnails.tsx:295` `case-study/case-study-toc.tsx:60` |
| `ring-offset-2` | 2px | Tailwind default | 17 | `focus-visible:` | `app/work/[slug]/page.tsx:97,178` `experience.tsx:77,256,426,776,939` `hero.tsx:83` `nav.tsx:170,372,402,413,429,448` `site-footer.tsx:89` `work-thumbnails.tsx:295` `case-study/case-study-toc.tsx:60` |
| `border-b` | 1px | Tailwind default | 4 | base `[&_thead_th]:` `[&_tbody_td]:` | `experience.tsx:902` `case-study/case-study-toc.tsx:55` `case-study/patterns/data-table.tsx:72` |
| `border-l` | 1px | Tailwind default | 4 | base | `experience.tsx:586` `case-study/patterns/timeline.tsx:57,72,79` |
| `border-t` | 1px | Tailwind default | 4 | base `md:` | `app/work/[slug]/page.tsx:203` `experience.tsx:894` `case-study/case-study-toc.tsx:50` `case-study/patterns/timeline.tsx:79` |
| `border-l-4` | 4px | Tailwind default | 3 | base | `case-study/patterns/step-grid.tsx:45,46` `case-study/primitives/callout.tsx:45` |
| `border-l-0` | 0px | Tailwind default | 2 | `first:` `md:` | `case-study/patterns/timeline.tsx:57,79` |
| `border-r` | 1px | Tailwind default | 2 | base `md:[&>*:first-child]:` | `experience.tsx:902` `case-study/patterns/data-table.tsx:57` |
| `ring` | 1px | Tailwind default | 2 | base | `product-venn-travel.tsx:260,290` |
| `border-b-0` | 0px | Tailwind default | 1 | `[&_tbody_tr:last-child_td]:` | `case-study/patterns/data-table.tsx:72` |
| `border: 0` |  | hardcoded | 1 | base | `about-collage.css:611` |
| `divide-x` | 1px | Tailwind default | 1 | `md:` | `case-study/patterns/data-table.tsx:58` |
| `divide-y` | 1px | Tailwind default | 1 | base | `experience.tsx:98` |
| `outline-offset: 2px` |  | hardcoded | 1 | base | `app/globals.css:230` |
| `outline-offset: 4px` |  | hardcoded | 1 | base | `about-collage.css:619` |
| `outline: 2px solid var(--highlight-strong, var(--highlight))` |  | hardcoded | 1 | base | `about-collage.css:618` |
| `outline: 2px solid var(--highlight-strong)` |  | hardcoded | 1 | base | `app/globals.css:229` |
| `ring-4` | 4px | Tailwind default | 1 | base | `experience.tsx:595` |
| `ring-inset` | 1px | Tailwind default | 1 | `focus-visible:` | `experience.tsx:131` |
| `text-decoration-thickness: 2px` |  | hardcoded | 1 | base | `app/globals.css:240` |

SVG stroke widths (geometry, viewBox units for the Venns):

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `1.8` |  | hardcoded | 7 | base | `nav.tsx:497,516,534,552,571,590` `site-footer.tsx:41` |
| `2` |  | hardcoded | 5 | base | `nav.tsx:608,639` `product-venn-travel.tsx:707` `product-venn.tsx:453` `relock-button.tsx:37` |
| `2.5` |  | hardcoded | 2 | base | `product-venn-travel.tsx:796` `product-venn.tsx:542` |

### 2.7 Focus treatment (as written; which one wins is an open question)

Two focus systems are both in the code:

| System | Rule | Where | Applies to |
|---|---|---|---|
| Global | `*:focus-visible { outline: 2px solid var(--highlight-strong); outline-offset: 2px; box-shadow: 0 0 0 4px rgba(203,179,232,0.3); border-radius: 2px }` | `app/globals.css:228-233` | Every focusable element. Unlayered. |
| Component | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2` | 17 elements, listed under `ring-offset-2` in §2.6 | Pine 2px ring with a 2px offset. Offset colour is Tailwind's default `#fff`. |
| Collage | `.about-cut-hit:focus-visible { outline: 2px solid var(--highlight-strong, var(--highlight)); outline-offset: 4px }` | `about-collage.css:617-620` | Photo buttons in About |
| Skip link | `focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-accent …` | `app/layout.tsx:195` | "Skip to content" |

Elements with **no** component-level focus classes (they get only the global rule): carousel arrows `work-thumbnails.tsx:225-240`, mobile-menu LinkedIn + Resume `nav.tsx:457-479`, Experience product link `experience.tsx:435-441`, `linkOut` link `experience.tsx:386-392`, timeline detail link `experience.tsx:1004-1011`, contact `mailto` `contact.tsx:34-39`, relock pill `relock-button.tsx:25-46`, "View all" `section-header.tsx:22-27`, About photo buttons (CSS rule above).

### 2.8 Breakpoints

| Breakpoint | Value | Source |
|---|---|---|
| `sm` | 40rem (640px) | Tailwind default, `theme.css:327` |
| `md` | 48rem (768px) | `theme.css:328` |
| `lg` | 64rem (1024px) | `theme.css:329` |
| `xl` | 80rem (1280px) | `theme.css:330` |
| `860px` | custom | `nav.tsx:170` (status chip reappears at 860+; hidden 768 to 859) |
| `1100px` | custom | `contact.tsx:19` (line break in contact copy) |
| `1104px` | custom | `contact.tsx:28` (booker widens to 1040px) |
| `767px` / `768-1023px` | custom CSS media queries | `about-collage.css:622,654` (match `md` and `lg` boundaries, written by hand) |
| Container query | `@container` + `cqw` card widths | `work-thumbnails.tsx:209,215` |
| `(hover: hover)` | JS `matchMedia` | `about-collage.tsx:429` (tap vs hover on photos) |

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `md:` | min-width 48rem (768px) | Tailwind default | 96 | `md:[&_h2]:` `md:` `md:[&>*:first-child]:` `md:[&>*:last-child]:` `md:after:` | `app/work/[slug]/page.tsx:46,80,105,140,145,163` `contact.tsx:9,12,16` `experience.tsx:25,28,30,131,302,303,319,325,348,719` `hero.tsx:22,34,35,38,45,55,64` `nav.tsx:335,359,390,429,441` `section-header.tsx:13,18` `selected-work-shelf.tsx:13` `site-footer.tsx:77` `case-study/layouts/markdown-h2.tsx:23` `case-study/layouts/section.tsx:28,29,30,31,32,35,55,66,67,68` `case-study/patterns/data-table.tsx:49,51,53,54,57,58,62` `case-study/patterns/step-grid.tsx:51,112,114,116,117` `case-study/patterns/timeline.tsx:79,85` `case-study/primitives/callout.tsx:45` `case-study/primitives/metric.tsx:23,50` |
| `xl:` | min-width 80rem (1280px) | Tailwind default | 15 | `xl:` | `app/work/[slug]/page.tsx:43,46,84,128,132` |
| `lg:` | min-width 64rem (1024px) | Tailwind default | 8 | `lg:` | `experience.tsx:563,586,645` `hero.tsx:38,64` `work-thumbnails.tsx:65,215` `case-study/patterns/step-grid.tsx:117` |
| `sm:` | min-width 40rem (640px) | Tailwind default | 7 | `sm:` | `experience.tsx:146,151` `site-footer.tsx:78,97` `work-thumbnails.tsx:64,65,215` |
| `@media (prefers-reduced-motion: reduce)` |  | media feature | 4 | base | `app/globals.css:65,178,663` `about-collage.css:703` |
| `cqw width` |  | hardcoded | 3 | base `sm:` `lg:` | `work-thumbnails.tsx:215` |
| `window.innerWidth read` |  | hardcoded | 2 | base | `about-collage.tsx:208` `experience.tsx:869` |
| `@container` |  | Tailwind default | 1 | base | `work-thumbnails.tsx:209` |
| `@media (max-width: 1023px) and (min-width: 768px)` |  | hardcoded | 1 | base | `about-collage.css:622` |
| `@media (max-width: 767px)` |  | hardcoded | 1 | base | `about-collage.css:654` |
| `@supports not (animation-timeline: view())` |  | media feature | 1 | base | `app/globals.css:162` |
| `max-md:` | max-width < 48rem (768px) | Tailwind default | 1 | `max-md:` | `nav.tsx:170` |
| `min-[1100px]:` |  | hardcoded | 1 | `min-[1100px]:` | `contact.tsx:19` |
| `min-[1104px]:` |  | hardcoded | 1 | `min-[1104px]:` | `contact.tsx:28` |
| `min-[860px]:` |  | hardcoded | 1 | `min-[860px]:` | `nav.tsx:170` |

### 2.9 Z-index

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `z-index: -1` |  | hardcoded | 4 | base | `app/globals.css:108,129,192` `about-collage.css:475` |
| `z-index: 0` |  | hardcoded | 3 | base | `app/globals.css:118` `about-collage.css:62,467` |
| `z-50` | 50 | Tailwind default | 2 | `focus:` base | `app/layout.tsx:195` `nav.tsx:321` |
| `60` |  | hardcoded | 1 | base | `hero-link.tsx:31` |
| `80` |  | hardcoded | 1 | base | `product-venn-travel.tsx:343` |
| `z-[60]` |  | hardcoded | 1 | base | `relock-button.tsx:14` |
| `z-[70]` |  | hardcoded | 1 | base | `experience.tsx:881` |
| `z-0` | 0 | Tailwind default | 1 | base | `case-study/case-study-toc.tsx:60` |
| `z-20` | 20 | Tailwind default | 1 | base | `work-thumbnails.tsx:295` |
| `z-40` | 40 | Tailwind default | 1 | base | `nav.tsx:441` |
| `z-index: 20` |  | hardcoded | 1 | base | `about-collage.css:154` |
| `z-index: 25` |  | hardcoded | 1 | base | `about-collage.css:363` |
| `z-index: 2` |  | hardcoded | 1 | base | `about-collage.css:433` |
| `z-index: 3` |  | hardcoded | 1 | base | `about-collage.css:346` |
| `z-index: 40` |  | hardcoded | 1 | base | `about-collage.css:173` |
| `z-index: 4` |  | hardcoded | 1 | base | `about-collage.css:56` |
| `z-index: 8` |  | hardcoded | 1 | base | `about-collage.css:485` |
| `z-index: var(--mz)` |  | variable | 1 | base | `about-collage.css:663` |
| `z-index: var(--z)` |  | variable | 1 | base | `about-collage.css:163` |

Stacking order as built, top to bottom: drag-ghost chip **80** (`product-venn-travel.tsx:343`) > timeline tooltip **70** (`experience.tsx:881`) > hero flying dot **60** (`hero-link.tsx:31`) = relock pill **60** (`relock-button.tsx:14`) > nav **50** (`nav.tsx:321`) = skip link **50** > mobile menu **40** (`nav.tsx:441`) > lifted work card **20** (`work-thumbnails.tsx:295`). The About collage runs its own local stack (0 to 40) inside `isolation: isolate` (`about-collage.css:28`).

### 2.10 Motion

#### 2.10a CSS / Tailwind transitions and animations

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `duration-150` | 150ms | Tailwind default | 19 | base | `app/work/[slug]/page.tsx:178` `contact.tsx:36` `experience.tsx:77,131,256,426,741,939` `hero.tsx:83` `nav.tsx:372,402,413,448` `section-header.tsx:24` `site-footer.tsx:89` `work-thumbnails.tsx:229,237,273` `case-study/case-study-toc.tsx:60` |
| `transition-colors` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 13 | base | `experience.tsx:77,131,426,939` `nav.tsx:194,372,402,448` `section-header.tsx:24` `site-footer.tsx:89` `work-thumbnails.tsx:229,237` `case-study/case-study-toc.tsx:60` |
| `transition-none` | none | Tailwind default | 8 | `motion-reduce:` base | `experience.tsx:881,939,954` `nav.tsx:170,215,341,390` `work-thumbnails.tsx:274` |
| `transition-opacity` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 5 | base | `app/work/[slug]/page.tsx:178` `contact.tsx:36` `hero.tsx:83` `nav.tsx:413` `work-thumbnails.tsx:273` |
| `ease-[cubic-bezier(0.22,0.61,0.36,1)]` |  | hardcoded | 4 | base | `nav.tsx:170,215,341,390` |
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | Tailwind default | 4 | base | `experience.tsx:131` `hero.tsx:83` `nav.tsx:359,448` |
| `animation: none` |  | hardcoded | 3 | base | `app/globals.css:180,666` `about-collage.css:729` |
| `duration-200` | 200ms | Tailwind default | 3 | base | `experience.tsx:157,954` `relock-button.tsx:30` |
| `duration-500` | 500ms | Tailwind default | 3 | base | `nav.tsx:170,194,215` |
| `transition-transform` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 3 | base | `experience.tsx:157,954` `relock-button.tsx:34` |
| `animation-delay: 0.4s` |  | hardcoded | 2 | base | `app/globals.css:135,141` |
| `animation: v3-hl-sweep 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) forwards` |  | hardcoded | 2 | base | `app/globals.css:134,164` |
| `duration-[400ms]` |  | hardcoded | 2 | base | `nav.tsx:341,390` |
| `duration-300` | 300ms | Tailwind default | 2 | base | `nav.tsx:359` `relock-button.tsx:34` |
| `transition-[transform,opacity]` |  | hardcoded | 2 | base | `nav.tsx:341,390` |
| `transition-all` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 2 | base | `experience.tsx:741` `relock-button.tsx:30` |
| `animation-delay: 0.2s` |  | hardcoded | 1 | base | `app/globals.css:165` |
| `animation-delay: 0.58s` |  | hardcoded | 1 | base | `app/globals.css:144` |
| `animation-delay: 0.76s` |  | hardcoded | 1 | base | `app/globals.css:147` |
| `animation-delay: 0` |  | hardcoded | 1 | base | `app/globals.css:157` |
| `animation-duration: 500ms` |  | hardcoded | 1 | base | `app/globals.css:650` |
| `animation-range: entry 20% entry 70%` |  | hardcoded | 1 | base | `app/globals.css:156` |
| `animation-timeline: view(block)` |  | hardcoded | 1 | base | `app/globals.css:155` |
| `animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1)` |  | hardcoded | 1 | base | `app/globals.css:651` |
| `animation: about-float var(--float-dur, 4.8s) ease-in-out var(--float-delay, 0s) infinite` |  | hardcoded | 1 | base | `about-collage.css:189` |
| `animation: v3-hl-sweep linear forwards` |  | hardcoded | 1 | base | `app/globals.css:154` |
| `scroll-behavior: auto` |  | hardcoded | 1 | base | `app/globals.css:67` |
| `scroll-behavior: smooth` |  | hardcoded | 1 | base | `app/globals.css:62` |
| `transition-[text-decoration-color]` |  | hardcoded | 1 | base | `experience.tsx:256` |
| `transition-[width,background-color,color,border-color]` |  | hardcoded | 1 | base | `nav.tsx:170` |
| `transition-[width,margin,opacity]` |  | hardcoded | 1 | base | `nav.tsx:215` |
| `transition-shadow` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 1 | base | `nav.tsx:359` |
| `transition: none` |  | hardcoded | 1 | base | `about-collage.css:733` |
| `transition: opacity 0.9s ease` |  | hardcoded | 1 | base | `about-collage.css:226` |

#### 2.10b Keyframes (in scope)

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `@keyframes about-float` |  | hardcoded | 1 | base | `about-collage.css:198` |
| `@keyframes nav-chip-in` |  | hardcoded | 1 | base | `app/globals.css:626` |
| `@keyframes nav-chip-out` |  | hardcoded | 1 | base | `app/globals.css:637` |
| `@keyframes v3-hl-sweep` |  | hardcoded | 1 | base | `app/globals.css:169` |

`tl-tip-in` is a seventh keyframe, declared inside a `<style>` tag in JSX at `experience.tsx:905-913`.

#### 2.10c JavaScript-driven motion

| Moment | Timing | Easing | Where |
|---|---|---|---|
| Nav status chip rotation | hold 4800ms, flip 500ms | `cubic-bezier(0.22,0.61,0.36,1)` | `nav.tsx:50,52`; `app/globals.css:648-653` |
| Nav collapse (chip + right CTAs slide out after 80px scroll) | 400ms | `cubic-bezier(0.22,0.61,0.36,1)` | `nav.tsx:253,341,390` |
| Venn intro: rings draw | 900ms, delay 120 + i·140 | `cubic-bezier(.4,0,.2,1)` | `product-venn.tsx:213-221` |
| Venn intro: zone labels | 500ms, delay 700 + i·140 | `ease-out` | `product-venn.tsx:226-233` |
| Venn intro: chips | 420ms, delay 1250 + i·45 | `cubic-bezier(.2,.7,.3,1)` | `product-venn.tsx:241-258` |
| Venn marker pop | 550ms at 2600ms | `cubic-bezier(0.34,1.56,0.64,1)` (overshoot) | `product-venn.tsx:264-297` |
| Venn arrow, arrowhead, label | 700 / 200 / 400ms | `cubic-bezier(.4,0,.2,1)`, `ease-out` | `product-venn.tsx:270-337` |
| Venn idle float | sine drift, amplitude 3 units, continuous rAF | | `product-venn.tsx:353-400` |
| Travel Venn rings / labels | 1000ms, delay 80 + i·160 / 480ms, delay 640 + i·160 | `cubic-bezier(.4,0,.2,1)` / `ease-out` | `product-venn-travel.tsx:426-439` |
| Travel Venn intro timing | start 1.02s, stagger 0.036s, duration 0.58s, marker at 2.5s | custom `easeOut` (cubic) | `product-venn-travel.tsx:83-86,92-94` |
| Travel Venn chip drag-return | 520ms (1ms if reduced) | `cubic-bezier(.22,.9,.3,1)` | `product-venn-travel.tsx:385-394` |
| Hero dot flight (v3.1) | delay 600, hold 480, flight 1100ms | quadratic in-out | `hero-link.tsx:73-75,150-152` |
| Work carousel autoplay | step every 4500ms, scroll 420ms | cubic ease-out | `work-thumbnails.tsx:77,160-161` |
| Work card hinge open | spring stiffness 400, damping 30, mass 1 | spring | `work-thumbnails.tsx:246-251` |
| Work card hinge close | 320ms | `[0.4,0,0.2,1]` | `work-thumbnails.tsx:255` |
| About photo cross-fade | fade 900ms + gap 1000ms, first tick 1600ms | `ease` | `about-collage.tsx:358-361`, `about-collage.css:226` |
| About float | 4.2s to 6.4s per photo, staggered `-0.67s·i` | `ease-in-out` | `about-collage.tsx:156-157`, `about-collage.css:189-206` |
| About scroll scrub | `--p` 0→1 from scroll; latches open at 0.62 | linear | `about-collage.tsx:262-280` |
| Timeline tooltip in | 160ms | `ease-out` | `experience.tsx:887` |

#### 2.10d Reduced-motion handling (as written)

| Surface | Behaviour under `prefers-reduced-motion: reduce` | Where |
|---|---|---|
| Smooth scroll | off | `app/globals.css:65-69` |
| Highlighter sweeps | no animation, shown fully drawn | `app/globals.css:178-183` |
| Nav chip | stops rotating; flip animation off | `nav.tsx:89`, `app/globals.css:663-668` |
| Venns | final frame, no intro, no float | `product-venn.tsx:200-203`, `product-venn-travel.tsx:167` |
| Hero dot | skipped; pin shown immediately | `hero-link.tsx:67-71` |
| Work carousel | no autoplay, no animated scroll, no hinge | `work-thumbnails.tsx:149-154,186,264-271` |
| About collage | static, fully opened, `height: auto`, no float | `about-collage.tsx:237-250`, `about-collage.css:703-735` |
| Timeline tooltip | animation off | `experience.tsx:910-912` |

### 2.11 Opacity states

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `opacity-0` | 0 | Tailwind default | 9 | base | `hero.tsx:49,55,64,79,92` `nav.tsx:216,343,392` `work-thumbnails.tsx:275` |
| `opacity-90` | 0.9 | Tailwind default | 5 | `hover:` | `app/work/[slug]/page.tsx:178` `contact.tsx:36` `hero.tsx:83` `nav.tsx:172,413` |
| `opacity-100` | 1 | Tailwind default | 4 | base | `nav.tsx:216,344,393` `work-thumbnails.tsx:275` |
| `opacity-60` | 0.6 | Tailwind default | 1 | `disabled:` | `relock-button.tsx:30` |

Plus alpha-on-colour utilities: `text-accent-fg/85`, `/70`, `decoration-accent-fg/50` (contact), `decoration-accent/40`, `border-fg/30`, `border-border/60`, `bg-highlight/80` (see 2.1b).

---

## 3. Components and patterns

Format for each: **file**, **variants**, **states**, **mobile behaviour** (from class strings; rendered sizes get checked in Phase 4). Tap-target heights are worked out from padding + line height + border, and marked "computed".

### 3.1 Nav (`nav.tsx`)

| Part | Lines | Variants / states | Mobile (<768) |
|---|---|---|---|
| Bar | `319-335` | Sticky `top-0 z-50`, transparent. Height `h-16` (64px), `md:h-[72px]`. 3-column grid `1fr auto 1fr`, `max-w-6xl`, `px-4` / `md:px-6`. `hide` prop drops items (v3 and v3.1 hide Lab + Writing). | Same 64px bar |
| Status chip (left) | `54-225` | 4 rotating lines; 4th is a CTA (pine fill, arrow, links `#connect`); others link `#hero`. Pill `rounded-full border py-2 pl-2.5 pr-3.5 text-sm font-medium`. Width eases to the text. Pauses on hover/focus/hidden tab/reduced motion. | **Visible** (`max-md:inline-flex`). Hidden from 768 to 859px, back at 860+. Height computed ≈ 38px. |
| Collapse | `241,340-352,389-395` | After `scrollY > 80` and not hovered/focused: chip and right CTAs fade + slide out (`translate-x-10`, `opacity-0`, `tabIndex -1`). | Chip disappears on scroll; only the hamburger stays. |
| Section pill (centre) | `356-385` | `rounded-full border bg-bg-elevated p-1`, `shadow-sm`, or `shadow-md` when collapsed. Tabs `px-3.5 py-1.5 text-sm`, icon 16px + label. Active (scroll-spy) = `bg-bg text-fg shadow-sm`; idle = `text-fg-muted hover:text-fg`. `role="tab"` + `aria-selected`. | **Hidden** (`hidden md:flex`). Tab height computed 32px. |
| LinkedIn icon button | `396-407` | 36×36 `rounded-full`, brand blue border/text, hover fills `#0A66C2` with white icon | Hidden in bar; 44×44 copy in the menu (`462`) |
| Resume button | `408-419` | Pine pill `px-4 py-2 text-sm` + download icon, `hover:opacity-90` | Hidden in bar; `px-6 py-3 text-base` copy in the menu (`468-479`) |
| Hamburger | `423-434` | 40×40 `rounded-md`, glyph `☰`/`✕` in `font-mono text-xl`, `aria-expanded` | Shown only below `md` |
| Mobile menu | `438-482` | Full-screen `fixed inset-x-0 top-16 bottom-0 z-40 bg-bg`, centred column `gap-6`. Links `text-lg text-fg-muted hover:text-fg` with 20px icons. Locks body scroll, `Esc` closes. | Link tap height computed 28px (no padding) |
| Icons | `491-650` | 8 inline SVGs: Book, Pen, User, Briefcase, Flask, Mail, ArrowRight, LinkedIn, Download | |

### 3.2 Hero (`hero.tsx`, `hero-link.tsx`, `product-venn.tsx`, `product-venn-travel.tsx`)

| Part | Lines | Variants / states | Mobile |
|---|---|---|---|
| Section | `hero.tsx:30-37` | `link="travel"` (v3.1) adds `relative` and mounts `HeroLink`. `handoff` prop hides everything (`opacity-0`), not used on these routes. | `px-6 py-20` |
| Layout | `hero.tsx:38` | `lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]`, gap 32 / `md:` 40 | **Single column below 1024px**: text first, Venn below |
| Avatar | `hero.tsx:15-27,45-52` | 44px / `md:` 56px circle, `drop-shadow(0 2px 8px rgba(31,59,46,.18))`, `next/image` 128×128 src | 44px |
| Greeting | `hero.tsx:53-59` | Kalam, `text-accent`, `translate-y-[3px]` / `md:[5px]` optical nudge | 30px |
| H1 | `hero.tsx:62-75` | Three `block` lines. `features`, `products`, `systems` carry `data-hl-word` → lilac highlighter sweeps in on load, staggered 400 / 580 / 760ms (`app/globals.css:114-148`) | 36px, wraps naturally |
| CTA | `hero.tsx:81-86` | Primary pill: `bg-accent text-accent-fg px-6 py-3 text-sm`, `hover:opacity-90`, pine focus ring | Tap height computed 44px |
| Venn (v3) | `product-venn.tsx` | Static positions; intro draw then idle float; `settled` prop for no-intro. Rings 2px at 0.85 opacity in the 3 venn colours; chips are filled pills (`rx 7`, mono 14.5u, cream text); zone labels Geist 36u; pine marker r9 + arrow + italic "I'm here" 30u. `role="img"` with a long `aria-label`. | Scales to column width. **No mobile-specific layout or type.** |
| Venn (v3.1, travel) | `product-venn-travel.tsx` | Same drawing, plus: hovering a chip dims other zones (0.35) and thickens that ring to 3; chips are **draggable** with pointer events (lifted copy on `document.body`, z-80, springs home 520ms). Marker waits for the hero dot. | Same scaling. Drag uses `touch-action: none` on chips (`:746`), so a finger on a chip drags it instead of scrolling the page. |
| Hero dot | `hero-link.tsx` | Fixed pine dot (z-60) flies on a bowed quadratic path from portrait centre to the Venn marker, then dispatches `hero-pin-arrived` | Same |

### 3.3 Section header (`section-header.tsx`)

| Part | Lines | Detail |
|---|---|---|
| Eyebrow | `14-16` | `font-mono text-xs uppercase tracking-[0.24em] text-fg-subtle`; inner `data-hl-word` → lilac stroke drawn by scroll (`animation-timeline: view()`, `app/globals.css:153-167`; timed fallback when unsupported) |
| H2 | `18-20` | `font-serif text-3xl md:text-5xl leading-[1.1] tracking-tight`, `max-w-3xl` |
| Action (optional) | `21-28` | Outline pill: `border border-fg px-4 py-2 font-mono text-xs uppercase tracking-[0.16em]`, hover inverts to `bg-fg text-accent-fg`. Used once ("View all", `selected-work-shelf.tsx:19-22`). Tap height computed 34px. |
| Spacing | `13` | `mb-12 md:mb-16` |
| Used by | | Experience (`experience.tsx:29`), Selected Work (`selected-work-shelf.tsx:16`). **About and Contact do not use it.** |

### 3.4 Experience (`experience.tsx`)

| Part | Lines | Variants / states | Mobile |
|---|---|---|---|
| Header row | `28-39` | `SectionHeader` + Kalam "try this ↗" + view toggle | Stacks (`flex-col`, `md:flex-row`) |
| View toggle (segmented control) | `51-87` | Two buttons "list" / "timeline", `font-mono text-xs`, active `bg-fg text-bg`, idle `text-fg-muted hover:text-fg`, pine focus ring, `role="tab"` | Button height computed 28px |
| List view: row | `113-193` | Full-width button: logo tile + company (semibold) + role + date (mono 11px under `sm`, 12px right-aligned from `sm`) + chevron that rotates 90° when open. `hover:bg-bg-elevated`, `ring-inset` focus. First row open by default. | Date moves under the name below 640px |
| Logo tile | `195-245` | Sizes `sm` 36px, `md` 44px, `lg` 56px; `rounded-lg border`; `logoBg` prop for transparent marks (`lib/experience.ts:69` uses `bg-fg`); initial-letter fallback; pine "current" dot with `ring-2 ring-bg` | |
| Company link | `247-262` | Underline appears on hover (`decoration-transparent` → `hover:decoration-accent`) | |
| Entry detail card | `269-398` | `rounded-2xl border bg-bg-elevated p-6 md:p-8`. Mono company eyebrow (`tracking-[0.2em]`), H3 role, then a 15px / `md:` 16px body at line height 1.7 with **emoji bullets** (📅 🎖 📢), role-chip pills, headline (semibold 18 / `md:` 20), pine `*` bullets, link-out (`text-accent` + 40% underline). | Padding 24px |
| Product sub-tabs (TapInvest) | `400-461` | Same segmented control as the view toggle + "{name} ↗" link (`text-xs`) | |
| Timeline, mobile (`< lg`) | `566`, `574-612` | Vertical spine (`border-l`, `pl-5`), node dots 10px (`bg-accent` current / `bg-border` past, `ring-4 ring-bg`), newest first. Tap a card to expand its detail inline. Kalam hint "open a card for the detail". | **This is the default mobile view** |
| Timeline card | `918-980` | Button `rounded-xl border bg-bg-elevated px-3 py-3`; open = `border-accent`, idle `hover:border-fg/30`; metric in a lilac marker span (`bg-highlight/80`) | Full width |
| Timeline, desktop (`lg+`) | `614-726` | Horizontal band: `min-width 780px`, `overflow-x-auto`, cream gradient band (`--venn-cream`), lanes 68px tall, dashed pine "now" line with Kalam label, mono year axis. Chips `rounded-xl` with `hover:-translate-y-0.5 hover:border-accent hover:shadow-md`. Kalam hint "hover any card…". | Hidden below 1024px |
| Tooltip | `787-917` | Portal to `body`, `fixed z-[70]`, 280px wide, `rounded-[18px]` white/slate card with notch, `backdrop-blur-sm`, 160ms fade-up. Opens on hover **and** focus. | n/a (desktop band only) |

### 3.5 Selected Work shelf, the "bookshelf" (`selected-work-shelf.tsx`, `work-thumbnails.tsx`)

The code has no component named "bookshelf". The shelf is the Selected Work carousel: each card is a book cover that hinges open to show a coloured spine reading "Click to read".

| Part | Lines | Variants / states | Mobile |
|---|---|---|---|
| Fold | `selected-work-shelf.tsx:10-26` | `SectionHeader` "Selected Work" + "View all" → `/work?mark=…`. Shows up to 10 cards (`getShelfWorkCards(10)`). | `px-6 py-24` |
| Carousel | `work-thumbnails.tsx:107-244` | Horizontal scroll-snap track inside `@container`; scrollbar hidden. Card width `(100cqw − 1.5rem) / 1.15` base, `/2.15` from `sm`, `/3.5` from `lg`. Autoplays one card every 4.5s; wraps at both ends; pauses on pointer enter or focus inside. `aria-roledescription="carousel"`. | **About 1.15 cards visible**, swipe or arrows |
| Arrows | `224-241` | Two 40px circles `border-border`, `hover:bg-bg-elevated`, glyphs `←` / `→`, right-aligned under the track | 40px tap target (computed) |
| Card (`Thumbnail`) | `257-332` | One `Link` → `/work/[slug]?mark=…`. Three layers: back copy (1px behind), coloured slab (product brand colour, rotates 4°, vertical mono "Click to read"), front cover (rotates `Y -35°` off its left edge, spring). `rounded-[1.75rem]`, pine-tinted shadow. | **Touch does not hinge** (`pointerType === "touch"` returns early, `:278`). Tap goes straight to the case study. |
| Card face | `334-373` | `border bg-bg-elevated p-5`; mono eyebrow + 28px logo; H3 `font-serif text-2xl leading-tight`; 2-line clamped one-liner (`h-10`); 4:3 media well `rounded-2xl` | Same |
| Cover media | `375-434` | Muted looping `<video>` that plays only when ≥45% visible; GIF or poster fallback; poster only under reduced motion | Same |
| Grid layout | `61-75` | `layout="grid"`: 1 → `sm:` 2 → `lg:` 3 columns (or locked at 2 via `columns={2}`), `gap-8`. Used by "Keep reading" on the case study. | 1 column |
| Brand slabs | `19-41` | BondScanner `#182F8C`, Ultra `#171513`, MoveInSync `#3DAE2B` / text `#10240E`; fallback `bg-fg` | |

### 3.6 About collage (`about-collage.tsx`, `about-collage.css`)

| Part | Where | Variants / states | Mobile (<768) |
|---|---|---|---|
| Scroll stage | `.css:22-45` | Section is 220svh tall; inner stage is sticky 100svh with a radial `--bg-elevated` glow and a 22% grain overlay (`.css:47-57`) | 210svh track |
| Accent strips ("bars") | `.tsx:376-380`, `.css:59-149` | **Three torn-paper strips.** 1: `color-mix(--fg 78%, --bg)` (pine), rotated −7°. 2: `color-mix(--highlight 82%, --bg-elevated)` (lilac), +4°. 3: `color-mix(--border 70%, --fg-muted)` (oat-grey), −3°. Heights 1.35 / 1.7 / 1.35rem. Fade and slide in with scroll (`--t`). Code comment `.css:2`: "Palette stays oatmeal / pine / lilac. No Vox yellow-blue-red." | Same strips |
| Photo stickers | `.tsx:383-477`, `.css:158-340` | Photos start in a pile and fly to scattered positions as `--p` grows (`--t`). Six torn-edge `clip-path` cuts (a to f), paper border, pine drop shadow, optional washi tape (every 3rd). Hover/focus lifts (`scale(1.04)`, z-40). After opening, photos float and stacks cross-fade. | Separate phone layout (`--mfx`/`--mfy`/`--mfr`), width 5.85rem, `scale(1.05)` |
| Photo tooltip | `.tsx:472-475`, `.css:483-605` | Torn-paper caption: mono kicker 0.58rem (≈9.3px) + body 0.8125rem (13px). Auto-placed (right, left, bottom, top, cover-top, cover-bottom) so it stays on stage and off the bio (`.tsx:171-212`). Shown on hover, keyboard focus, or tap. | Pinned **over the bottom of the photo** (`.css:691-700`); opens by **tap** (`hover: none` path, `.tsx:427-439`) |
| Bio slip | `.tsx:480-505`, `.css:361-463` | Torn-paper card with tape and grain, rotated −2.4°, fades in on the second half of the scroll (`--b`). H2 `clamp(1.75rem, 5vw, 2.65rem)`; copy `clamp(.9375rem, 1.7vw, 1.125rem)` at 1.65 line height in `--fg-muted`; "fintech" carries a highlighter mark that draws with `--b`. | Copy fixed at 15px; padding `1.05rem 1rem` |
| Reduced motion | `.css:703-735` | Static, open, `height: auto` | |

### 3.7 Contact (`contact.tsx`, `cal-embed.tsx`)

| Part | Lines | Detail | Mobile |
|---|---|---|---|
| Fold | `contact.tsx:7-10` | **Only full-bleed pine fold**: `bg-accent text-accent-fg`, `scroll-mt-16` | `pt-32 pb-16` |
| H2 | `:12-14` | "Let's Connect." 48px / `md:` 64px, line height 1.05, tight | 48px |
| Copy | `:16-22` | 16px / `md:` 18px, `text-accent-fg/85`; manual `<br>` from 1100px | |
| Cal booker | `cal-embed.tsx:25-35` | White `rounded-xl` card, black shadow, `min-height: 560px`, month view, brand `#1F4D3A` | Cal's own layout below 1024px |
| Email fallback | `contact.tsx:32-41` | `text-sm text-accent-fg/70`, underlined `mailto:` (`decoration-accent-fg/50`), `hover:opacity-90` | Inline text link |

### 3.8 Footer (`site-footer.tsx`)

| Part | Lines | Detail | Mobile |
|---|---|---|---|
| Socials | `79-95` | 4 ghost icon links, 40×40 `rounded-full`, `text-fg-subtle hover:text-fg`, pine ring focus. **X and GitHub `href="#"`** (`site-footer.tsx:17,26`). | Centred row |
| Meta | `97-100` | `text-xs leading-[1.6] text-fg-subtle`: "megh gupta · {time} ist" (live clock, 30s tick), "made with zero em dashes" | Centred; right-aligned from `sm` |

### 3.9 Relock pill (`relock-button.tsx`)

`fixed right-4 bottom-4 z-[60]`, frosted pill (`bg-[#f3ebd9]/85 backdrop-blur-md`), mono 0.68rem uppercase `tracking-[0.18em]`, lock icon tilts −12° on hover, pill lifts `-translate-y-0.5` and inverts to pine. `disabled:opacity-60` while pending ("Locking…"). Shown on every `/preview/*` and `/work/*` page (`app/preview/layout.tsx`, `app/work/layout.tsx`). **The only component with a disabled state.** Mobile: same position; it sits over the bottom-right of the content. Height computed ≈ 34px.

### 3.10 Case study page (`app/work/[slug]/page.tsx` + `components/case-study/*`)

| Part | Where | Variants / states | Mobile |
|---|---|---|---|
| Page chrome | `page.tsx:80-87` | **No `Nav` and no `SiteFooter`** on case study pages. Only the skip link, back link and relock pill. | |
| Back link | `page.tsx:89-100` | `text-sm text-fg-muted underline` → "← Back to selected work". Target depends on `mark`: `text` → `/preview/v3#work`, `row` → `/preview/v3.1#work`, none → `/#work`. | Tap height ≈ 20px (computed) |
| Kicker | `page.tsx:102-104` | `font-mono text-xs uppercase tracking-wider text-accent`, "role · company · timeline · N min" | |
| H1 + dek | `page.tsx:105-110` | H1 36 / `md:` 48px; dek `text-lg leading-relaxed text-fg-muted` | |
| Team + stack pills | `page.tsx:112-124` | Team `text-sm`; stack pills `rounded-full border px-2.5 py-1 font-mono text-[11px] text-fg-muted` | Wrap |
| "On this page" index | `case-study/case-study-toc.tsx` | Numbered list (`01`…), hairline rows, `text-sm`, current = `text-fg` + `aria-current="location"`. **Two highlight marks:** `row` (v3.1, default) fills the whole row with the highlighter (`app/globals.css:189-202`); `text` (v3) highlights only the words (`app/globals.css:204-217`). Scroll-spy with `rootMargin -96px 0 -80%`. | **Below 1280px it sits inline under the header, as a full list, not sticky.** Sticky right rail (15.5rem) from `xl`. Row tap height ≈ 39px (computed). |
| Headline metric card | `page.tsx:139-155` | `rounded-xl border bg-bg-elevated p-6 md:p-8`; mono 10px label; value `font-serif text-2xl md:text-3xl`; supporting metrics `text-sm` with `·` bullets | |
| Prose | `page.tsx:46` (`articleClass`) | Descendant styling: links underlined with offset 4; H2 28 / 36px; H3 `text-lg font-semibold`; `p` and `li` at `leading-relaxed` (1.625); `ul` disc, `space-y-2`, `pl-6`. Body text inherits 16px. | |
| `Section` | `case-study/layouts/section.tsx` | 8 variants declared; **this case study uses 5**: `narrative` ×4, `deepDive` ×4, `metrics`, `reflection`, `ownership`. Optional eyebrow + H2. `reflection` caps width at `max-w-xl`; `split` 3/5 + 2/5 (not used here). | `split` stacks |
| `Eyebrow` | `case-study/primitives/eyebrow.tsx` | `section` 12px `tracking-[0.24em]` subtle · `micro` 10px `tracking-wider` subtle · `accent` 10px pine. All `font-mono font-medium uppercase`. | |
| `Callout` | `case-study/primitives/callout.tsx` | 5 variants, 2 looks: `insight`/`result`/`decision` = pine left bar + pine eyebrow; `caution`/`learning` = `fg-muted` bar + subtle eyebrow. `rounded-lg border border-l-4 bg-bg-elevated p-5 md:p-6`. Used: insight, decision, caution ×2, learning. | |
| `DataTable` | `case-study/patterns/data-table.tsx` | `data` / `comparison` (scrolling table, mono 11px uppercase headers, right-aligned `td.num`, right-edge fade mask) and `ownership` / `responsibility` (2 to 4 labelled columns with a hairline divider). Used: data ×2, comparison ×2, ownership ×1. | Table scrolls sideways; ownership columns stack |
| `Metric` + `MetricRow` | `case-study/primitives/metric.tsx` | `inline` (value 30 / `md:` 36px + micro label + caption) or `card`. Row = 1 → `md:` 3 columns. Used: 3 inline in 1 row. | Stacked |
| `StepGrid` | `case-study/patterns/step-grid.tsx` | `parallel` (1 → 2 → 3 cols), `sequence` (numbered, auto-flow columns, hairline connectors), `compare` (muted vs pine left bars). Cells `rounded-lg border bg-bg-elevated p-6`, H3 `text-xl`. Used: parallel ×1, sequence ×1, 7 cells. | Single column; sequence connector runs downward |
| `Timeline` | `case-study/patterns/timeline.tsx` | `vertical` (used, 3 events), `horizontal`, `phase`. Pine 10px dots, accent mono date eyebrow, `text-base` title. | Vertical |
| `AiCallPipeline` | `case-study/one-offs/ai-call-pipeline.tsx` | Bordered `rounded-xl` frame around a same-origin `<iframe>` (`sandbox="allow-scripts allow-same-origin"`, `loading="lazy"`), auto-height via `ResizeObserver`, 820px minimum. Internal palette in §2.1d. | Iframe height follows content |
| Keep reading | `page.tsx:191-216` | Hairline top border, mono 10px label, 2 cards via `WorkThumbnails` grid `columns={2}` (hinge cards) | 1 column |

### 3.11 Shared patterns (cross-component)

| Pattern | Definition | Used by |
|---|---|---|
| **Highlighter mark** (lilac chisel stroke, background SVG) | `[data-hl-word]` `app/globals.css:114-183`; collage variant `.about-collage-mark` `about-collage.css:465-481`; index variants `app/globals.css:189-217` | Hero words (load sweep), section eyebrows (scroll sweep), "fintech" in About (scroll scrub), case-study index (static) |
| **Primary pill button** | `rounded-full bg-accent text-accent-fg` + `hover:opacity-90` | Hero CTA `hero.tsx:83`, nav Resume `nav.tsx:413`, mobile Resume `nav.tsx:473`, chip CTA state `nav.tsx:172`, coming-soon CTA `page.tsx:178` (not rendered for AI Call) |
| **Outline pill** | `rounded-full border border-fg … hover:bg-fg hover:text-accent-fg` | "View all" `section-header.tsx:24` |
| **Segmented control** | `rounded-full border bg-bg-elevated p-1 font-mono text-xs`, active `bg-fg text-bg` | `experience.tsx:51-87`, `experience.tsx:412-433` |
| **Icon button (circle)** | `rounded-full` 36 / 40 / 44px | LinkedIn, carousel arrows, footer socials |
| **Hairline card** | `rounded-{lg,xl,2xl,[1.75rem]} border border-border bg-bg-elevated` (border colour remixed with 30% lilac by `app/globals.css:311-313` on non-button, non-link elements) | Entry detail, timeline card/chip, work card, metric card, callout, step cell, data table, iframe frame |
| **Mono eyebrow** | `font-mono uppercase` + `text-xs`/`text-[10px]`/`text-[11px]` + tracking `0.24em` / `0.2em` / `0.16em` / `wider` | Section header, case study `Eyebrow`, work card, entry detail, table headers, footer of tooltip |
| **Handwritten aside** (Kalam) | inline `style={{fontFamily: "var(--font-hand), cursive"}}` | Hero greeting, "try this ↗", "now", timeline hints, travel-Venn stage label |
| **Pine "current" dot** | `rounded-full bg-accent` 6 to 10px | Logo tile, vertical timeline, nav chip dot, Venn marker |
| **Torn paper** | `clip-path: polygon(...)` + grain + drop shadow | About strips, stickers, slip, tooltip |
| **Avatars** | Hero portrait 44 / 56px circle (`hero.tsx:22`); logo tiles 36 / 44 / 56px `rounded-lg` (`experience.tsx:208-213`); work-card logo 28px `rounded-md` (`work-thumbnails.tsx:354`) | |
| **Tags / chips** | Role chips `experience.tsx:339` (rounded-full, mono xs uppercase); stack pills `page.tsx:118`; Venn chips (SVG); metric marker `experience.tsx:973` | |
| **Global link hover** | `main a:not(.group):hover, nav a:hover, footer a:hover` → lilac 2px underline, offset 4px (`app/globals.css:236-242`) | Every link in those landmarks. Note: case study pages have a `main` but no `nav` or `footer`. |

---

## 4. Unlock screen (`/unlock`)

Added after review. Files: `app/unlock/page.tsx` (59 lines), `app/unlock/backstage.css` (282 lines, every selector prefixed `bp-`), `components/backstage-pass.tsx` (433 lines), `components/cloud-background.tsx` (104 lines), and `.cs-cloud` drift at `app/globals.css:329-355`. Logic lives in `app/unlock/actions.ts` and `lib/preview-auth.ts` (no styles).

Counted separately from §2. Only the `dawn` sky renders here (`page.tsx:41`); the `blue` and `ods` palettes at `cloud-background.tsx:41-53` serve other preview routes and are excluded.

### 4.1 Headline facts

- **It uses zero project colour variables.** Pine is re-declared as a JS constant (`const PINE = "#1f3b2e"`, `backstage-pass.tsx:13`) and applied through inline `style` or SVG attributes in **12 places** (`backstage-pass.tsx:108,124,199,200,216,223,250,280,326,337,370,396`). The table below counts the constant once, at its definition. Oatmeal and elevated oat are typed as hex in CSS (`backstage.css:75`) and inline (`backstage-pass.tsx:251`). The only `var()` reads are `--font-hand` and the component's own `--bp-*` variables.
- **It introduces a fourth colour family:** `DENIED_INK = "#b23a48"` (a red, `backstage-pass.tsx:14`), used for the error state: input underline, status text and the DENIED stamp.
- **It introduces a sky palette:** a 5-stop blue-to-gold gradient, a warm sun glow and white clouds (`cloud-background.tsx:35-40,66-71`).
- **It is the only screen with a form field**, and so the only place with input, error, loading and success states.
- **Its type sizes are almost all one-offs:** five arbitrary mono sizes (`0.6rem`, `0.65rem`, `0.95rem`…) and a `clamp(3rem, 9vw, 5.25rem)` H1 set by inline style.

### 4.2 Colour (all hardcoded)

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `#000` |  | hardcoded | 16 | base | `app/unlock/backstage.css:90,92,95,97,104,106,109,111,130,132,135,137,143,145,148,150` |
| `#ffffff` |  | hardcoded | 6 | base | `cloud-background.tsx:39,67,68,69,70,71` |
| `rgba(31, 59, 46, 0.28)` |  | hardcoded | 2 | base | `app/unlock/backstage.css:124,161` |
| `#1f3b2e` |  | hardcoded | 1 | base | `backstage-pass.tsx:13` |
| `#b23a48` |  | hardcoded | 1 | base | `backstage-pass.tsx:14` |
| `#b7cde1` |  | hardcoded | 1 | base | `cloud-background.tsx:36` |
| `#ccdae7` |  | hardcoded | 1 | base | `cloud-background.tsx:36` |
| `#d5dbe3` |  | hardcoded | 1 | base | `cloud-background.tsx:38` |
| `#e3dfcf` |  | hardcoded | 1 | base | `cloud-background.tsx:36` |
| `#e8dcc6` |  | hardcoded | 1 | base | `backstage-pass.tsx:251` |
| `#ece1ca` |  | hardcoded | 1 | base | `app/unlock/backstage.css:114` |
| `#f1e6ce` |  | hardcoded | 1 | base | `cloud-background.tsx:36` |
| `#f3ebd9` |  | hardcoded | 1 | base | `app/unlock/backstage.css:75` |
| `#f6ecd1` |  | hardcoded | 1 | base | `cloud-background.tsx:36` |
| `bg-transparent` |  | Tailwind default | 1 | base | `backstage-pass.tsx:194` |
| `rgba(203, 179, 232, 0.35)` |  | hardcoded | 1 | base | `app/unlock/backstage.css:169` |
| `rgba(203,179,232,0.45)` |  | hardcoded | 1 | base | `backstage-pass.tsx:137` |
| `rgba(232,220,198,0.15)` |  | hardcoded | 1 | base | `app/unlock/page.tsx:48` |
| `rgba(232,220,198,0.55)` |  | hardcoded | 1 | base | `app/unlock/page.tsx:48` |
| `rgba(255, 255, 255, 0.55)` |  | hardcoded | 1 | base | `app/unlock/backstage.css:80` |
| `rgba(255, 255, 255, 0)` |  | hardcoded | 1 | base | `app/unlock/backstage.css:81` |
| `rgba(255,232,187,0.35)` |  | hardcoded | 1 | base | `cloud-background.tsx:37` |
| `rgba(255,239,200,0.85)` |  | hardcoded | 1 | base | `cloud-background.tsx:37` |
| `rgba(31, 59, 46, 0.035)` |  | hardcoded | 1 | base | `app/unlock/backstage.css:77` |
| `rgba(31, 59, 46, 0.12)` |  | hardcoded | 1 | base | `app/unlock/backstage.css:168` |
| `rgba(31, 59, 46, 0.22)` |  | hardcoded | 1 | base | `app/unlock/backstage.css:167` |
| `rgba(31,59,46,0.2)` |  | hardcoded | 1 | base | `backstage-pass.tsx:295` |
| `rgba(31,59,46,0.35)` |  | hardcoded | 1 | base | `backstage-pass.tsx:198` |
| `rgba(31,59,46,0.45)` |  | hardcoded | 1 | base | `backstage-pass.tsx:355` |
| `rgba(31,59,46,0.6)` |  | hardcoded | 1 | base | `backstage-pass.tsx:252` |

Where the `#000` values are: CSS `mask` gradients that cut the ticket's half-circle notches (`backstage.css:88-154`). They control transparency, not visible colour.

Provenance:

| Group | Values | Where |
|---|---|---|
| Pine, re-typed | `#1f3b2e` (constant), alpha 0.035 / 0.12 / 0.2 / 0.22 / 0.28 / 0.35 / 0.45 / 0.6 | `backstage-pass.tsx:13,198,252,295,355`, `backstage.css:77,124,161,167,168` |
| Oatmeal family, re-typed | `#f3ebd9` (= `--bg-elevated`), `#ece1ca` (stub, darker oat, **not a token**), `#e8dcc6` (= `--bg`) at 0.55 / 0.15 veil | `backstage.css:75,114`, `backstage-pass.tsx:251`, `page.tsx:48` |
| Lilac at alpha | `rgba(203,179,232,…)` 0.45 (badge), 0.35 (glow) | `backstage-pass.tsx:137`, `backstage.css:169` |
| Denied red | `#b23a48` | `backstage-pass.tsx:14` (used at `:197,279,317`) |
| Dawn sky | `#B7CDE1 → #CCDAE7 → #E3DFCF → #F1E6CE → #F6ECD1`, glow `rgba(255,239,200,.85)` / `rgba(255,232,187,.35)`, cloud shadow `#D5DBE3`, clouds `#FFFFFF` | `cloud-background.tsx:36-39,66-71` |
| Paper sheen | `rgba(255,255,255,0.55 → 0)` | `backstage.css:80-81` |
| Cloud shadow | `drop-shadow(0 18px 30px rgba(60,78,110,0.14))` + `blur(9px)` | `app/globals.css:338` |

### 4.3 Typography

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `text-[0.6rem]` |  | hardcoded | 5 | base | `backstage-pass.tsx:136,342,348,354,376` |
| `text-2xl` | 1.5rem (24px) / lh 1.333 | Tailwind default | 3 | `md:` base | `backstage-pass.tsx:144,316,325` |
| `text-[0.65rem]` |  | hardcoded | 2 | base | `backstage-pass.tsx:132,171` |
| `text-3xl` | 1.875rem (30px) / lh 1.2 | Tailwind default | 2 | `md:` | `backstage-pass.tsx:316,325` |
| `text-sm` | 0.875rem (14px) / lh 1.429 | Tailwind default | 2 | base | `backstage-pass.tsx:248,275` |
| `clamp(3rem, 9vw, 5.25rem)` |  | hardcoded | 1 | base | `backstage-pass.tsx:154` |
| `text-[0.95rem]` |  | hardcoded | 1 | base | `backstage-pass.tsx:161` |
| `text-4xl` | 2.25rem (36px) / lh 1.111 | Tailwind default | 1 | base | `backstage-pass.tsx:345` |
| `text-5xl` | 3rem (48px) / lh 1 | Tailwind default | 1 | `md:` | `backstage-pass.tsx:345` |
| `text-lg` | 1.125rem (18px) / lh 1.556 | Tailwind default | 1 | base | `backstage-pass.tsx:194` |
| `text-xl` | 1.25rem (20px) / lh 1.4 | Tailwind default | 1 | base | `backstage-pass.tsx:144` |
| `text-xs` | 0.75rem (12px) / lh 1.333 | Tailwind default | 1 | base | `backstage-pass.tsx:294` |

| Element | Size | Weight | Tracking | Line height | Font | Where |
|---|---|---|---|---|---|---|
| H1 "Backstage." | `clamp(3rem, 9vw, 5.25rem)` (48 to 84px), inline style | 600 | -0.045em | 0.95 | Geist Sans | `backstage-pass.tsx:150-159` |
| Handwritten line | 20px / `md:` 24px | 400 | | 1 | Kalam | `:143-148` |
| Body | 0.95rem (15.2px), `opacity-80` | | | relaxed (1.625) | Geist Sans | `:161` |
| Mono labels (brand, password label, stub) | 0.6rem (9.6px) and 0.65rem (10.4px) uppercase, `opacity-60/70` | | 0.15em to 0.3em | | Geist Mono | `:132,136,171,342,348,354,376` |
| Password input | 18px mono | | 0.2em | | Geist Mono | `:194` |
| Status line | 14px | | | | Geist Sans | `:275` |
| Stamp | 24px / `md:` 30px mono uppercase | 700 | 0.18em | | Geist Mono | `:316,325`, `backstage.css:178` |
| "One" (stub) | 36px / `md:` 48px | 600 | tight | 1 | Geist Sans | `:345` |

Weights:

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `font-bold` | 700 | Tailwind default | 3 | base | `backstage-pass.tsx:316,325,359` |
| `font-semibold` | 600 | Tailwind default | 2 | base | `backstage-pass.tsx:152,345` |
| `font-medium` | 500 | Tailwind default | 1 | base | `backstage-pass.tsx:248` |

Letter spacing:

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `tracking-[0.2em]` |  | hardcoded | 3 | base | `backstage-pass.tsx:136,194,298` |
| `tracking-[0.3em]` |  | hardcoded | 3 | base | `backstage-pass.tsx:132,342,376` |
| `tracking-[0.25em]` |  | hardcoded | 2 | base | `backstage-pass.tsx:171,348` |
| `-0.045em` |  | hardcoded | 1 | base | `backstage-pass.tsx:155` |
| `letter-spacing: 0.18em` |  | hardcoded | 1 | base | `app/unlock/backstage.css:178` |
| `tracking-[0.15em]` |  | hardcoded | 1 | base | `backstage-pass.tsx:354` |
| `tracking-tight` | -0.025em | Tailwind default | 1 | base | `backstage-pass.tsx:345` |

### 4.4 Shape, depth, motion

Radius (rows `112`, `62`, `55`, `54`, `42`, `36` are cloud ellipse geometry in SVG units, not corner radii):

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `rounded-full` | calc(infinity * 1px) | Tailwind default | 5 | base | `backstage-pass.tsx:136,215,248,354` `cloud-background.tsx:82` |
| `112` |  | hardcoded | 1 | base | `cloud-background.tsx:66` |
| `36` |  | hardcoded | 1 | base | `cloud-background.tsx:70` |
| `42` |  | hardcoded | 1 | base | `cloud-background.tsx:67` |
| `54` |  | hardcoded | 1 | base | `cloud-background.tsx:69` |
| `55` |  | hardcoded | 1 | base | `cloud-background.tsx:71` |
| `62` |  | hardcoded | 1 | base | `cloud-background.tsx:68` |
| `border-radius: 0 0 18px 18px` |  | hardcoded | 1 | base | `app/unlock/backstage.css:152` |
| `border-radius: 0 18px 18px 0` |  | hardcoded | 1 | base | `app/unlock/backstage.css:113` |
| `border-radius: 10px` |  | hardcoded | 1 | base | `app/unlock/backstage.css:177` |
| `border-radius: 18px 0 0 18px` |  | hardcoded | 1 | base | `app/unlock/backstage.css:99` |
| `border-radius: 18px 18px 0 0` |  | hardcoded | 1 | base | `app/unlock/backstage.css:139` |
| `rounded-md` | 0.375rem (6px) | Tailwind default | 1 | base | `backstage-pass.tsx:238` |

Shadows: the ticket carries a three-layer `filter: drop-shadow(0 30px 40px rgba(31,59,46,.22)) drop-shadow(0 6px 10px rgba(31,59,46,.12)) drop-shadow(0 0 40px rgba(203,179,232,.35))` (`backstage.css:166-170`), on a wrapper because masks clip `box-shadow`. The submit button adds `box-shadow: 0 10px 24px -10px rgba(31,59,46,.6)` inline (`backstage-pass.tsx:252`) and `hover:shadow-lg` (Tailwind, black).

Motion:

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `duration-200` | 200ms | Tailwind default | 2 | base | `backstage-pass.tsx:248,264` |
| `animate-spin` |  | Tailwind default | 1 | base | `backstage-pass.tsx:413` |
| `animation: bp-caret 1.1s steps(2, end) infinite` |  | hardcoded | 1 | base | `app/unlock/backstage.css:251` |
| `animation: bp-dot 260ms cubic-bezier(0.2, 1.6, 0.4, 1) both` |  | hardcoded | 1 | base | `app/unlock/backstage.css:237` |
| `animation: bp-enter 900ms cubic-bezier(0.2, 0.9, 0.25, 1.15) both` |  | hardcoded | 1 | base | `app/unlock/backstage.css:10` |
| `animation: bp-exit 300ms ease-in forwards` |  | hardcoded | 1 | base | `app/unlock/backstage.css:280` |
| `animation: bp-exit 600ms ease-in 1100ms forwards` |  | hardcoded | 1 | base | `app/unlock/backstage.css:225` |
| `animation: bp-float 6s ease-in-out 900ms infinite` |  | hardcoded | 1 | base | `app/unlock/backstage.css:25` |
| `animation: bp-shake 520ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both` |  | hardcoded | 1 | base | `app/unlock/backstage.css:47` |
| `animation: bp-stamp 420ms cubic-bezier(0.2, 1.4, 0.4, 1) both, bp-stamp-out 500ms ease-in 1500ms forwards` |  | hardcoded | 1 | base | `app/unlock/backstage.css:182` |
| `animation: bp-stamp 420ms cubic-bezier(0.2, 1.4, 0.4, 1) both` |  | hardcoded | 1 | base | `app/unlock/backstage.css:179` |
| `animation: bp-tear 900ms cubic-bezier(0.55, 0, 0.75, 0.4) 450ms forwards` |  | hardcoded | 1 | base | `app/unlock/backstage.css:207` |
| `animation: none` |  | hardcoded | 1 | base | `app/unlock/backstage.css:268` |
| `transition-all` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 1 | base | `backstage-pass.tsx:248` |
| `transition-opacity` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 1 | base | `backstage-pass.tsx:238` |
| `transition-transform` | 150ms cubic-bezier(0.4, 0, 0.2, 1) | Tailwind default | 1 | base | `backstage-pass.tsx:264` |
| `transition: none` |  | hardcoded | 1 | base | `app/unlock/backstage.css:272` |
| `transition: transform 220ms ease-out` |  | hardcoded | 1 | base | `app/unlock/backstage.css:41` |

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `@keyframes bp-tear` |  | hardcoded | 2 | base | `app/unlock/backstage.css:209,216` |
| `@keyframes bp-caret` |  | hardcoded | 1 | base | `app/unlock/backstage.css:253` |
| `@keyframes bp-dot` |  | hardcoded | 1 | base | `app/unlock/backstage.css:239` |
| `@keyframes bp-enter` |  | hardcoded | 1 | base | `app/unlock/backstage.css:12` |
| `@keyframes bp-exit` |  | hardcoded | 1 | base | `app/unlock/backstage.css:227` |
| `@keyframes bp-float` |  | hardcoded | 1 | base | `app/unlock/backstage.css:27` |
| `@keyframes bp-shake` |  | hardcoded | 1 | base | `app/unlock/backstage.css:49` |
| `@keyframes bp-stamp-out` |  | hardcoded | 1 | base | `app/unlock/backstage.css:199` |
| `@keyframes bp-stamp` |  | hardcoded | 1 | base | `app/unlock/backstage.css:186` |

Cloud drift: eight clouds, 150 to 195s per pass, linear, infinite (`cloud-background.tsx:18-27`, `app/globals.css:332-348`). Reduced motion parks them (`app/globals.css:350-355`).

Breakpoints:

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `md:` | min-width 48rem (768px) | Tailwind default | 19 | `md:` | `app/unlock/page.tsx:39` `backstage-pass.tsx:103,107,144,316,325,336,341,345,362,363` |
| `sm:` | min-width 40rem (640px) | Tailwind default | 3 | `sm:` | `backstage-pass.tsx:176,354` |
| `@media (max-width: 767px)` |  | hardcoded | 2 | base | `app/unlock/backstage.css:127,215` |
| `@media (prefers-reduced-motion: reduce)` |  | media feature | 1 | base | `app/unlock/backstage.css:259` |

### 4.5 Components on this screen

| Part | Where | Variants / states | Mobile (<768) |
|---|---|---|---|
| Sky backdrop | `cloud-background.tsx:76-104`, `page.tsx:41-50` | `dawn` palette; 8 drifting clouds; radial oatmeal veil with `backdrop-blur-[2px]` behind the ticket | Same; full-bleed `min-h-[100svh]` |
| Ticket | `backstage-pass.tsx:93-103`, `backstage.css:4-43,72-116,166-170` | Enters with an overshoot slide (900ms), floats (6s loop), tilts toward a **mouse** pointer (±8° / ±6°, `pointerType === "mouse"` only). Body and stub are separate halves with real half-circle notches (CSS masks) and an 18px outer radius. | Stacks vertically: body on top, stub below, perforation turns horizontal (`backstage.css:127-163`) |
| Header row | `backstage-pass.tsx:131-141` | Mono brand label + lilac "Works in progress" badge (`rounded-full`, inline lilac 45% background) | Same |
| Password field | `:169-242` | Underline-only input (`border-b-2`), mono 18px. **Typed characters show as pine ink dots**, not bullets: the real input text is transparent and an overlay draws one dot per character, max 14 (`:204-227`). Custom blinking caret. Show/hide toggle (eye icon, `aria-pressed`). States: idle (pine 35% underline), **error** (red underline, `aria-invalid`), disabled (`opacity-60`). The input **removes its own focus indicator**: `outline-none focus-visible:shadow-none focus-visible:outline-none` (`:194`). | Full width; button drops below the input (`flex-col`, `sm:flex-row`) |
| Submit button | `:244-269` | Primary pine pill (inline background, not `bg-accent`) `px-6 py-3 text-sm font-medium`. States: hover lifts + `shadow-lg` + arrow nudges right; **loading** ("Checking…" + spinning SVG); **success** ("Welcome in"); disabled until text is typed (`opacity-50`). No component focus style (global rule only). | Full width under the field. Tap height computed 44px. |
| Status line | `:272-290` | `aria-live="polite"`, reserved 1.25rem height so layout does not jump. Copy for: wrong (1st and 2nd try), wrong (3rd+), server not configured (red), admitted (pine). | Same |
| Stamps | `:311-330`, `backstage.css:172-203` | DENIED (red, fades out after 1.5s) and ADMITTED (pine). Double 4px border, `mix-blend-mode: multiply`, slam-in at 2.4× scale. Decorative (`aria-hidden`). | Smaller (24px) |
| Error feedback | `:51-61`, `backstage.css:45-67` | The whole ticket **shakes** (520ms), clears the field, refocuses | Same |
| Success sequence | `:63-74`, `backstage.css:205-233` | ADMITTED stamp → stub **tears off** along the perforation (900ms, starts at 450ms) → ticket blurs out (600ms at 1100ms) → redirect at 1650ms (350ms under reduced motion) | Tear direction changes for the vertical layout (`backstage.css:215-222`) |
| Footer row | `:293-309` | Dashed hairline; mono "Heading to → /preview/v3"; underlined "← Not supposed to be here?" link to `/` (`opacity-70 hover:opacity-100`, no focus style) | Wraps |
| Stub | `:334-380` | "Admit One", rotated dashed date badge (`sm:` and up only), decorative barcode (fixed bar widths), serial. Entire stub `aria-hidden`. | Horizontal row; date badge hidden below 640px |
| Reduced motion | `backstage.css:259-282` | No enter / float / shake / tear / dot / caret animation; no tilt; stamps static; exit shortened to 300ms | |

---

## 5. Open questions

Nothing below is guessed. Each one needs your answer or a Phase 4 render check.

| # | Question | What the code shows | How it gets resolved |
|---|---|---|---|
| Q1 | ~~Where are the "yellow-blue-red accent bars"?~~ **Resolved.** | There are none. `about-collage.css:2` is a reference note: the collage borrows Vox's paper-collage layout, and its yellow-blue-red palette was dropped on purpose. The only three-colour set is the hero Venn (`--venn-user #c1497f`, `--venn-tech #4a72b0`, `--venn-biz #c77e3b`, `app/globals.css:21-23`), read by **both** `product-venn.tsx:18-20` (v3) and `product-venn-travel.tsx:36-38` (v3.1). `--venn-cream` also tints the desktop experience band (`experience.tsx:656`). | Answered by Megh |
| Q2 | ~~Which focus ring actually renders?~~ **Resolved (Phase 4).** | The unlayered global rule wins everywhere: focused elements compute to `outline: solid 2px #b89cdc` plus the lilac 4px glow, and the pine `ring` classes never show. The same rule's `border-radius: 2px` squares off pill buttons while focused. | 03-gaps G-A6, G-A18 |
| Q3 | ~~Do unlayered global rules override other utilities?~~ **Resolved (Phase 4): yes.** | Card hairlines compute to the lilac-mixed `oklab(…)` colour (global rule wins over `border-border`); `#connect` and `#experience` compute `scroll-margin-top: 80px` (global wins over `scroll-mt-16`). | `04-verification.md` |
| Q4 | ~~Does `--font-hand` resolve?~~ **Resolved (Phase 4): yes for Kalam, but see the font bug.** | The greeting computes to `Kalam, "Kalam Fallback", cursive`. The same mechanism breaks Geist: body text, footer, prose and the Venn compute to the system font because next/font's variables sit on `<body>` while Tailwind's font variables are declared on `:root`. | 03-gaps G-C17, patch D7 |
| Q5 | ~~What size does the Venn text render at on a phone?~~ **Resolved (Phase 4).** | Measured: SVG 327px wide at 375px (scale 0.273): chip text 4.0px (5px box), zone labels 9.8px, marker label about 8px. At 1440px (590px wide): chip text 7.1px, zone labels 17.7px. | 03-gaps G-A3 |
| Q6 | ~~Is `/unlock` in scope?~~ **Resolved: yes.** | Kept as the lock flow for preview pages and for content shared with specific people. | Inventoried in §4 |
| Q7 | **Should the AI Call iframe follow the site palette?** Direction agreed, decision in Phase 3. | Its own white / purple theme with an OS-driven dark mode (`ai-call-pipeline.html:34-55`) and an in-artifact theme switch (`:1837-1838`). Proposed rule: **site chrome on-system, content as-is.** Diagrams Megh authors adopt site tokens; real product screenshots and UI mockups keep their true colours inside a site-styled frame. Open sub-question: the artifact uses green `--success` and amber `--warning` as status colours, and the site palette has none. | Phase 3 logs the status-colour choice for Megh (scoped status set vs. pine shades + icons) |
| Q8 | ~~Are the dead rules intentional?~~ **Resolved: dead, flagged for removal.** | `app/globals.css:244-257` (shelf card, orphaned when the bookshelf became thumbnail cards in PR #91) and `app/globals.css:259-306` (hero sun, orphaned by the portrait avatar in PR #67, plus its asset `public/images/v3/hero-sun.svg`). Boundary note for the cleanup: the sun block ends at **306**; `308-313` is the live card-hairline rule. The unused `@theme` type scale (`app/globals.css:47-58`) is a separate question for Phase 2. | Phase 3 lists the cleanup |
| Q9 | ~~Relock pill line height~~ **Resolved (Phase 4).** | Measured 136.8 × 34.3px. | 03-gaps §2.2 |
| Q10 | ~~Is `#b23a48` (denied red) an approved colour?~~ **Resolved: approved, scoped exception.** | Deliberate. The palette has no red-adjacent hue, and a wrong password must read as "wrong" instantly. Scope: `/unlock` only, a utility gate rather than a brand surface; it never appears on `/`, `/work/*` or `/preview/*`. Used through `DENIED_INK` (`backstage-pass.tsx:14`) in three places: input underline on a wrong password (`:197`), status text (`:279`) and the DENIED stamp (`:317`). Not yet recorded in CLAUDE.md §3; Megh is backfilling the exception. The sky backdrop colours (`cloud-background.tsx:36-39`) are a separate case, still uncategorised. | Answered by Megh. Phase 2 tokenises it as a status colour scoped to the lock flow. |

---

## Appendix A · Files scanned for values (28)

`app/globals.css`, `app/layout.tsx`, `app/work/[slug]/page.tsx`, `components/about-collage.css`, `components/about-collage.tsx`, `components/cal-embed.tsx`, `components/contact.tsx`, `components/experience.tsx`, `components/hero-link.tsx`, `components/hero.tsx`, `components/nav.tsx`, `components/product-venn-travel.tsx`, `components/product-venn.tsx`, `components/relock-button.tsx`, `components/section-header.tsx`, `components/selected-work-shelf.tsx`, `components/site-footer.tsx`, `components/work-thumbnails.tsx`, `components/case-study/case-study-toc.tsx`, `components/case-study/layouts/markdown-h2.tsx`, `components/case-study/layouts/section.tsx`, `components/case-study/one-offs/ai-call-pipeline.tsx`, `components/case-study/patterns/data-table.tsx`, `components/case-study/patterns/step-grid.tsx`, `components/case-study/patterns/timeline.tsx`, `components/case-study/primitives/callout.tsx`, `components/case-study/primitives/eyebrow.tsx`, `components/case-study/primitives/metric.tsx`, plus `lib/experience.ts` (one `logoBg` class string).

Imported but style-free: `app/preview/layout.tsx`, `app/preview/v3/*`, `app/preview/v3.1/page.tsx`, `app/work/layout.tsx`, `app/unlock/actions.ts`, `components/case-study/index.ts`, `lib/*.ts` (data only). `lib/work.ts:42-111` holds `spineColor` / `spineHex` values (`#1F4D3A`, `#1E3A8A`, `#C2410C`, `#0F4C3A`, `#701A2F`, `bg-[#8B5E3C]`, `bg-[#4A5D5A]`, `bg-[#6B4E71]`) that are read only by `components/work-card.tsx:65`, which does not render in scope.

## Appendix B · Excluded blocks in `app/globals.css`

These blocks sit in the same global file and ship on every page, but they style nothing on the in-scope routes. They are **excluded from every count in §2**.

| Lines | What | Why excluded |
|---|---|---|
| `244-257` | Shelf preview card override (`#ede4d9` background, pine + lilac box-shadow, `!important`) | Dead: targets class `bg-[#F7F1E6]`, which no element in the repo uses |
| `259-306` | Hero greeting sun (`hero-sun.svg`, lilac drop-shadow glow, `hero-sun-spin` 10s + `hero-sun-pulse` 3s keyframes) | Dead: targets `[data-hero-greeting]`, removed on purpose (`hero.tsx:40-44`) |
| `329-355` | `.cs-cloud` drift | Not on the portfolio routes. Renders on `/unlock` and is covered in §4. |
| `357-412` | `.lab-cursor`, `.lab-bubble`, `.lab-led` | Lab (hidden on v3 / v3.1) |
| `414-621` | Lab portal, bulb, sparks, flask smoke, skill tooltip | Lab |
| `670-685` | Lab reduced-motion overrides | Lab |

Motion values in those blocks:

| Value | Resolves to | Source | Uses | Prefixes seen | Where |
|---|---|---|---:|---|---|
| `animation: none` |  | hardcoded | 4 | base | `app/globals.css:303,352,407,680` |
| `transition: opacity 400ms ease-out` |  | hardcoded | 2 | base | `app/globals.css:459,471` |
| `animation-delay: 0.8s` |  | hardcoded | 1 | base | `app/globals.css:531` |
| `animation-delay: 1.6s` |  | hardcoded | 1 | base | `app/globals.css:535` |
| `animation-delay: 2.4s` |  | hardcoded | 1 | base | `app/globals.css:539` |
| `animation-delay: 3.2s` |  | hardcoded | 1 | base | `app/globals.css:543` |
| `animation-duration: 4.8s` |  | hardcoded | 1 | base | `app/globals.css:540` |
| `animation-duration: 4s` |  | hardcoded | 1 | base | `app/globals.css:536` |
| `animation-duration: 5.2s` |  | hardcoded | 1 | base | `app/globals.css:532` |
| `animation-duration: 5.6s` |  | hardcoded | 1 | base | `app/globals.css:544` |
| `animation-timing-function: linear` |  | hardcoded | 1 | base | `app/globals.css:336` |
| `animation: hero-sun-spin 10s linear infinite, hero-sun-pulse 3s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:276` |
| `animation: lab-bubble-rise 3.6s ease-in infinite` |  | hardcoded | 1 | base | `app/globals.css:370` |
| `animation: lab-bulb-flicker 8s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:509` |
| `animation: lab-bulb-sway 6s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:497` |
| `animation: lab-cursor-blink 1.1s steps(2, end) infinite` |  | hardcoded | 1 | base | `app/globals.css:360` |
| `animation: lab-flick-anim 6s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:559` |
| `animation: lab-led-pulse 2.4s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:391` |
| `animation: lab-portal-core-pulse 2.2s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:478` |
| `animation: lab-portal-halo-pulse 3.2s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:416` |
| `animation: lab-portal-spin 14s linear infinite` |  | hardcoded | 1 | base | `app/globals.css:431` |
| `animation: lab-portal-spin-reverse 8s linear infinite` |  | hardcoded | 1 | base | `app/globals.css:434` |
| `animation: lab-smoke-rise 3.6s ease-out infinite` |  | hardcoded | 1 | base | `app/globals.css:586` |
| `animation: lab-spark-drift 4.5s ease-in-out infinite` |  | hardcoded | 1 | base | `app/globals.css:528` |
| `transition: opacity 140ms ease-out, transform 140ms ease-out` |  | hardcoded | 1 | base | `app/globals.css:609` |
| `transition: opacity 200ms ease-out` |  | hardcoded | 1 | base | `app/globals.css:580` |

## Appendix C · Case-study kit pieces not rendered on the AI Call page

| Component | File | Variants it offers |
|---|---|---|
| `Figure` | `components/case-study/primitives/figure.tsx` | `prose`, `wide`, `svg`, `annotated`; placeholder state; Kalam `note` (also references `--font-caveat`, which is not defined anywhere, `figure.tsx:88`) |
| `Pill` | `components/case-study/primitives/pill.tsx` | `stack`, `tag`, `status` |
| `Quote` | `components/case-study/primitives/quote.tsx` | single variant; attribution prefixed with an em dash, `aria-hidden` (`quote.tsx:17`) |
| `ScreenshotStack` | `components/case-study/patterns/screenshot-stack.tsx` | `row`, `column` |
| `Pipeline` + 5 icons | `components/case-study/patterns/pipeline.tsx` | interactive stage diagram (482 lines) |

## Appendix D · Totals

Excludes the Appendix B blocks and the `:root` definitions.

| Category | Occurrences | Distinct values | Variable | Tailwind default | Hardcoded |
|---|---:|---:|---:|---:|---:|
| Colour | 279 | 63 | 235 | 12 | 32 |
| Font size | 113 | 29 | 0 | 74 | 39 |
| Font weight | 9 | 2 | 0 | 9 | 0 |
| Font family | 53 | 8 | 44 | 0 | 9 |
| Line height | 36 | 17 | 0 | 22 | 14 |
| Letter spacing | 26 | 10 | 0 | 17 | 9 |
| Spacing | 311 | 121 | 0 | 289 | 22 |
| Radius | 63 | 13 | 0 | 49 | 14 |
| Shadow | 16 | 13 | 0 | 5 | 11 |
| Border / ring / outline | 115 | 22 | 0 | 109 | 6 |
| Breakpoint | 143 | 15 | 0 | 133 | 10 |
| Z-index | 25 | 19 | 2 | 5 | 18 |
| Motion (CSS / Tailwind) | 95 | 34 | 0 | 63 | 32 |
| Motion (JS) | 52 | 43 | 0 | 0 | 52 |
| Max width | 20 | 13 | 0 | 11 | 9 |
