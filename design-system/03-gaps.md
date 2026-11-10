# 03 · Gaps and inconsistencies

> Phase 3 of the design-system audit. It compares the as-built system (`01-inventory.md`, `02-tokens.md`, `02-components.md`) with the basic design system (CLAUDE.md §3 plus the rules it inherits from §2, §5, §7, §9, §14, and STYLE.md). It then lists accessibility problems and the pieces a portfolio like this will need.
>
> Scope: `/preview/v3`, `/preview/v3.1`, `/work/ai-call-analysis-pipeline`, `/unlock`. Nothing in the site code was changed.

## How to read this

**Severity:**
- **Critical:** blocks a visitor on the main path, or a WCAG AA failure on every page.
- **High:** a real failure that a recruiter or a keyboard / phone user will hit.
- **Medium:** noticeable or rule-breaking, with a workaround.
- **Low:** polish, documentation or hygiene.

**Effort:**
- **S:** under an hour, one or two files.
- **M:** half a day to a day, several files or a new component.
- **L:** several days, or needs content / design decisions first.

**Evidence status:** contrast ratios are calculated exactly from the token values (WCAG 2.x formula, alpha composited over the real background). Tap-target heights were computed from the class strings in Phase 3, then **measured in a browser in Phase 4; every computed value matched** (`04-verification.md` §3). Issues added or corrected by Phase 4 say so.

**Decisions already taken** (D1 to D6 in `02-decisions.md`) are not repeated as issues. Where an approved change fixes an issue, the issue says so.

---

## 0. Summary

| Area | Critical | High | Medium | Low |
|---|---:|---:|---:|---:|
| DS conflicts (§1.2) | 0 | 2 | 7 | 9 |
| Missing in DS (§1.3) | 0 | 0 | 2 | 4 |
| Missing in build (§1.4) | 0 | 0 | 0 | 2 |
| Contrast (§2.1) | 0 | 3 | 4 | 2 |
| Focus and keyboard (§2.3) | 0 | 1 | 3 | 2 |
| Other accessibility (§2.4) | 0 | 0 | 2 | 1 |
| Missing pieces (§3) | 0 | 1 | 5 | 3 |
| Tap targets (§2.2) | 0 | 2 | 8 | 7 |
| **Total** | **0** | **9** | **31** | **30** |

**Fix first** (most visitor impact for the least effort):

1. **G-C17 · Body text isn't rendering in Geist.** Everything without an explicit font class falls back to the system font (found in Phase 4). One file, patch D7 ready and verified. *(High, S)*
2. **G-A6 · Focus ring is nearly invisible on oat** (1.75:1, needs 3:1). Keyboard users can't see where they are on most of the site. One CSS rule. *(High, S · shipped PR #112)*
3. **G-A10 · Skip link is broken on `/preview/v3` and `/preview/v3.1`**: `<main>` has no `id="main"`. Two attributes. *(High, S · shipped PR #112)*
4. **G-A1 · Caption grey fails contrast on the page background** (4.25:1, needs 4.5:1). It's used in 24 places: dates, eyebrows, footer. One token value. *(High, S · shipped PR #112)*
5. **G-A3 · Hero Venn chips are unreadable on phones** (they render at about 4px). This is the first screen 60% of visitors see. *(High, M · shipped in PR below: Venn hidden below `lg` on all hero variants; phones get heading + CTA only. Contrast subproblem moot because the chips never render on the failing viewport.)*
6. **G-M1 · A case-study page has no way to get in touch**: no nav, no footer, no contact CTA. A recruiter who opens a shared link can only go "back". *(High, M · ✅ Closed: shipped in PR #119, live via #120. Options #1 end block, #2 footer, #3 top bar, #5 mobile index bar)*

---

## 1. Basic design system vs as built

### 1.1 Matches

| Rule (basic DS) | Where it's written | As built | Evidence |
|---|---|---|---|
| Oatmeal / Pine / Lilac core palette with these exact values | CLAUDE.md §3 | Same 9 values in `:root` | `app/globals.css:9-17` |
| Single accent (pine) | CLAUDE.md §3, §6.2 | `--accent` = `--fg` = `#1f3b2e`; no second accent in UI chrome | 01 §2.1a |
| Lilac is decorative, never meaning-carrying text | CLAUDE.md §3 | No lilac text anywhere. Used for marks, washes, tape, selection, focus. | 01 §2.1a |
| Geist Sans, Geist Mono, Kalam (greeting only) via `next/font/google` | CLAUDE.md §2 | Exactly these three, `display: swap` | `app/layout.tsx:12-31` |
| Stepped headings allowed if the phone step is ≥ 1.75× body | CLAUDE.md §3 fluid rule | Hero H1 36 / 16 = 2.25×; section H2 30 / 16 = 1.88×; contact H2 48 / 16 = 3×; case-study H1 36 / 18 = 2× | 01 §2.2b |
| Homepage fold padding `py-24 md:py-32`, `max-w-5xl` | CLAUDE.md §3 Spacing | Experience; footer and contact widths | `experience.tsx:25-27` |
| Case-study shell: `max-w-6xl`, 46rem prose column, 15.5rem rail from `xl` | CLAUDE.md §3 Spacing | Exactly as written | `app/work/[slug]/page.tsx:82-87` |
| 150ms hover transitions | CLAUDE.md §3 Motion | 19 `duration-150` uses | 01 §2.10a |
| Reduced motion respected | CLAUDE.md §3 Motion (implied by "sparing") | Every animated surface has a reduced-motion path | 01 §2.10d |
| External links `target="_blank" rel="noopener noreferrer"` | CLAUDE.md §7 | All in scope | `nav.tsx:396-419`, `experience.tsx:252-253`, `site-footer.tsx:84-86` |
| `next/image` for images with alt text | CLAUDE.md §7 | All `<img>` are `next/image`. Decorative logos use `alt=""` next to visible names. | `experience.tsx:222`, `work-thumbnails.tsx:349-355` |
| `mailto:` first, no contact form | CLAUDE.md §2 | Contact fold `mailto:` fallback; no form | `contact.tsx:34-39` |
| Sentence-case headings | STYLE.md §2 | All case-study headings and section H2s, with one exception (G-C14) | `content/work/ai-call-analysis-pipeline.mdx` |
| Colour exceptions documented | CLAUDE.md §3 (added this audit) | Venn, unlock red, dawn sky, diagram status | CLAUDE.md §3 table |

### 1.2 Conflicts

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-C16** | Lilac as the focus-ring colour fails contrast | §3 names lilac for focus rings. The global outline `--highlight-strong` is 1.75:1 on oat (G-A6). The rule itself produces an inaccessible ring. | High *(Shipped PR #112: §3 updated; outline swapped to pine with `#connect` override to oat)* | Update §3: focus rings are pine on light surfaces and oat on pine. Lilac stays as the outer glow only. Fixed in code by G-A6. | S |
| **G-C17** | Body text is not rendered in Geist | CLAUDE.md §2 locks Geist Sans for body. Phase 4 measured `<body>`, footer, buttons, case-study prose and dek, and the Venn labels and chips all computing to the system stack (`ui-sans-serif, system-ui…`). Only elements with an explicit `font-serif` / `font-mono` class get Geist or Geist Mono. Cause: next/font sets its variables on `<body>` (`app/layout.tsx:191`), but Tailwind's `--font-sans`, `--font-serif`, `--font-mono` and `--default-font-family` are declared on `:root` (`<html>`), where those variables don't exist yet, so the chain resolves to nothing. Visitors see SF Pro (Apple), Segoe UI (Windows) or Roboto (Android). | High *(Shipped PR #110, D7 patch)* | Patch D7: move the three next/font variable classes from `<body>` to `<html>` (`design-system/patches/D7-font-variables-on-html.diff`, 1 file). Verified in a production build at 375 and 1440px: body, footer, prose and Venn labels become Geist, the chips Geist Mono, and the greeting stays Kalam. | S |
| **G-C1** | Hardcoded colours outside the tokens | CLAUDE.md §7 'No hardcoded colors outside the CSS variables' and §3 'No other colors'. 32 hardcoded colour uses on the portfolio routes (01 §2.1c), 53 hex literals across in-scope TSX. Undocumented ones after the exceptions table: Tailwind slate in the timeline tooltip (`experience.tsx:890-902`), retired `#1F4D3A` in Cal (`cal-embed.tsx:15-16`), pine / oat re-typed in the relock pill (`relock-button.tsx:30`) and unlock (`backstage-pass.tsx:13,251`, `backstage.css:75,114`). | Medium *(Shipped PR below: retired `#1F4D3A` purged from lab-scene.tsx (6 uses). Relock pill swapped to `text-fg`, `bg-bg-elevated`, `hover:text-accent-fg`. Timeline tooltip slate-200/500/600 to border / fg-subtle / fg-muted + pine-tinted shadow. Backstage pass stamp colour via `var(--accent-fg)`. backstage.css body/stub bg via `var(--bg-elevated)`. Cal hex was fixed in PR #125. The two module-level consts (`PINE`, `DENIED_INK` at `backstage-pass.tsx:13`) stay as inline-style anchors; both already match tokens.)* | Adopt the approved token set (02-tokens §2); V1, V2, V4 and the `PINE` / relock swaps cover every undocumented case. | M |
| **G-C2** | Fluid-type rule: case-study dek is too close to body | CLAUDE.md §3: subtitle must be ≥ 1.25× body. The case-study dek is 18px over 16px body = **1.125×**, at every width (`app/work/[slug]/page.tsx:108`). | Medium *(Shipped PR below: text-lg → text-xl, 20px on both breakpoints)* | Dek to `--text-title-sm` 20px (1.25×). The H1 stays ≥ 1.75× the dek at every width (36/20 = 1.8× on phones, 48/20 = 2.4× on desktop). | S |
| **G-C5** | No shadcn/ui primitives; shared controls are copied class strings | CLAUDE.md §2 locks shadcn/ui in `/components/ui`. That folder doesn't exist. The primary pill is copied 5 times with drifting padding (02-components §1a); outline pill, icon button and segmented control are also inline class strings. | Medium *(Shipped PR below: `components/ui/button.tsx` with `<Button>` + `<ButtonLink>`, variants primary / outline / ghost, sizes sm / md / lg, plus a `mono` modifier for uppercase-tracking CTAs. Swapped 7 copies: not-found ×3, error ×2, hero, section-header. Case-study top-bar, case-study-contact ghost, nav resume pair, work/[slug] CTA kept their current classes pending a touch-target variant.)* | Create `components/ui/button.tsx` (primary / outline / icon / ghost, sizes M / L), `tag.tsx`, `segmented.tsx`. shadcn's copy-paste Button is the locked route. | M |
| **G-C8** | MDX component API in CLAUDE.md §5 doesn't match the kit | §5 documents `<Callout type="insight \| tradeoff \| learning">`, `<LoomEmbed>`, `<FigmaEmbed>`. The kit uses `variant`, offers insight / result / decision / caution / learning (no `tradeoff`), and has no Loom or Figma embed (`components/case-study/primitives/callout.tsx:10-15`; grep finds no LoomEmbed / FigmaEmbed). | Medium *(Shipped PR below: §5 rewritten with the kit's real API. TLDR, Section, MetricRow, Figure variants, Callout variants, Quote, Pipeline / AiCallPipeline, Timeline, StepGrid, ScreenshotStack, DataTable, Pill, Eyebrow. Loom / Figma listed under 'not built yet'.)* | Update §5 to the kit's real API (`02-components.md` §17), and list Loom / Figma embeds under 'not built yet'. | S |
| **G-C9** | Case study has no TL;DR section | CLAUDE.md §5 body order starts with 'TL;DR: 3 bullets, above the fold'. The AI Call study opens with 'The problem' (`ai-call-analysis-pipeline.mdx:20`). The shell's headline-metric card partly does the job. | Medium *(Shipped PR below: new `<TLDR>` primitive at `components/case-study/primitives/tldr.tsx`, wired into the AI Call Analysis MDX. Other case studies are still drafts and will adopt it as they come out of draft.)* | Content decision: add a 3-bullet TL;DR `Section`, or amend §5 so the headline-metric card counts as the TL;DR. | S |
| **G-C10** | Storyboard: two folds missing, Stack missing from About | CLAUDE.md §14 locks a 7-fold story. v3 and v3.1 render 5 (`Nav hide={["lab","writing"]}`, `app/preview/v3/page.tsx:20`). Fold 6 is 'About + Stack', but the About collage has no Stack; the `StackIcon` component exists but isn't used. | Medium *(Shipped PR below: §14 amended to the as-built four-content-folds-plus-CTA launch storyboard. Lab, Writing and Stack context moved to `docs/deferred-folds.md` as a post-launch log.)* | Known in-progress state. Either finish Lab / Writing / Stack before launch, or amend the §14 launch storyboard. | L |
| **G-C13** | Em dashes in rendered text | STYLE.md §1: zero, anywhere. Rendered in scope: two work-card one-liners shown on the homepage shelf and in 'Keep reading' (`lib/work.ts:72,106`); the `/preview/v3` and `/preview/v3.1` tab titles (`app/preview/v3/page.tsx:11`, `v3.1/page.tsx:11`); 5 inside the AI Call iframe text. Not rendered here but shipped as UI strings: `quote.tsx:22`, `figure.tsx:113`, `pipeline.tsx:179`. Content layer also has 6 frontmatter comments reading `# draft [em dash] please review tone` in the other case studies. | Medium *(Shipped PR below: all rendered em-dashes replaced per STYLE.md table. Quote attribution uses en dash. G-B4 guard now prevents regressions.)* | Replace per STYLE.md's table (colon or period). The CI check STYLE.md lists as TODO (G-B4) would stop regressions. | S |
| **G-C3** | Motion: cursor tracking and scroll-linked effects | CLAUDE.md §3 Motion lists 'parallax, scroll-jacking, cursor effects, mouse-tracking glows' as not acceptable without an explicit ask. As built: unlock ticket tilts toward the mouse (`backstage-pass.tsx:77-91`); About strips slide with scroll and the collage is scroll-scrubbed across 220svh (`about-collage.css:97,123,148`, `about-collage.tsx:262-280`); hero dot flight (`hero-link.tsx`); draggable Venn chips (`product-venn-travel.tsx:315-410`). The audit cannot see whether these were asked for. | Low *(Resolved)* | Megh confirmed the unlock tilt, About collage and draggable Venn were explicit asks: recorded in CLAUDE.md §3 Motion. Hero dot flight not yet confirmed. | S |
| **G-C4** | `motion` (Framer Motion) used without the 'only if requested' note | CLAUDE.md §3 Motion: 'use framer-motion only if requested'. `motion` 14.4.0 drives the work-card hinge only (`work-thumbnails.tsx:3,308-328`). | Low *(Shipped PR below: §3 Motion lists the work-card hinge as the fourth approved exception, scoped to that one component.)* | Record it as an approved use in §3 Motion, scoped to the hinge. | S |
| **G-C6** | Inline styles | CLAUDE.md §9: 'Do not write inline styles.' 58 `style={…}` props in scope: experience 16, backstage-pass 15, venn 8 + 7, cloud 3, others 9. Most are runtime values (positions, timeline widths, SVG geometry); about 12 are static (Kalam ×3 fixed by D5, hero drop shadow, unlock colours, veil gradient). | Low *(Shipped PR below: 6 static inline styles swapped to classes — hero portrait drop-shadow to `drop-shadow-[...]`, three Kalam fontFamily inlines (figure caption, hero overture, about-me closer) to `font-hand`, pipeline stage number mono family to `font-mono`, backstage "Works in progress" lilac chip to `bg-highlight/45`. CLAUDE.md §9 amended to allow runtime-computed values through `style={{}}`; static styling belongs in classes.)* | Move the static ones to classes or tokens (D5 plus the unlock token swaps). Amend §9 to allow runtime-computed values through CSS variables. | M |
| **G-C7** | CSS files beyond `globals.css` | CLAUDE.md §9: 'Do not write CSS files beyond globals.css.' Three exist: `components/about-collage.css` (735 lines), `app/unlock/backstage.css` (282), `app/preview/v3/scope.css` (empty, 18 lines). | Low *(Shipped PR below: §9 names about-collage.css and backstage.css as the two approved exceptions. Closes this gap; empty v3/scope.css was removed earlier.)* | Delete the empty `v3/scope.css` and its import (`app/preview/v3/layout.tsx:2`). Record the other two as approved exceptions: clip-path paper and ticket masks don't fit utility classes. | S |
| **G-C11** | Type scale nominal values no longer describe the site | §3 nominal `h1 40`, `h2 28`, `mono 14px (tags)`, `display 64 (hero only)`. Built: H1 36 → 48, section H2 30 → 48, mono tags 10 to 12px, hero 48 (64 is the Contact H2). Now labelled nominal (this audit). | Low *(Shipped PR below: §3 Type scale replaced with as-built role pairs — display / section / contact / article — matching 02-tokens §2.7 to §2.8.)* | Replace the nominal list with the as-built role pairs (`02-tokens.md` §2.8), or keep it as intent and accept the gap. | S |
| **G-C12** | Hover easing | §3 Motion: '150ms ease-out hover'. Most hovers use Tailwind's default curve (0.4, 0, 0.2, 1); only 4 say `ease-out` (01 §2.10a). | Low *(Shipped PR below: CLAUDE.md §3 Motion updated to match as-built: Tailwind default or `ease-out`, consistent per component.)* | Set `--ease-out` on hover transitions, or change §3 to 'ease-standard'. Not visible. | S |
| **G-C14** | Title Case heading | STYLE.md §2: sentence case. Contact H2 reads 'Let's Connect.' (`contact.tsx:13`). | Low *(Shipped PR below: `contact.tsx` H2 to 'Let's connect.'.)* | 'Let's connect.' | S |
| **G-C15** | Spaced hyphen used as a dash | STYLE.md allows hyphens only for compounds. Contact copy: 'early-stage startup world - I'd love to hear from you' (`contact.tsx:18`). | Low *(Shipped PR below)* | Period: '…startup world. I'd love to hear from you.' | S |
| **G-C18** ✅ fixed on `mxg/design-system-patches` | Venn chip layout was tuned on the fallback font | With D7 the chips render in Geist Mono, which is wider. At 1440px 'Experimentation' and 'Monetization' (Business row 3) touch (`design-system/phase4/d7-fonts-venn-1440.webp`). Chip home positions are hand-placed (`product-venn.tsx:29-56`). | Low | Nudge the two chips apart (about 10 drawing units) when D7 ships. If G-A3 moves chips out of the SVG on phones, only desktop needs it. | S |

### 1.3 Missing from the basic design system (built, but not documented)

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-D3** | Component specs and states | No rule for buttons, links, tags, cards, segmented controls, tooltips, or for hover / focus / active / disabled / loading / error states. | Medium *(Shipped PR below: new 'Component states and primitives' subsection in CLAUDE.md §3 points at `02-components.md` as the living spec.)* | `02-components.md` is the spec; link it from §3 and keep it current in the same PR as component changes (CLAUDE.md §12). | S |
| **G-D6** | Form fields | The only form field (unlock password) defines idle, error, disabled, revealed and loading states with no documented pattern. Megh plans to reuse the lock flow. | Medium *(Shipped PR below: new 'Form-field pattern (unlock lock)' subsection in CLAUDE.md §3 documents all six states, ready for G-M7 reuse.)* | Document the unlock field / submit / status line as the form pattern (02-components §18) before the second lock flow is built. | S |
| **G-D1** | Token families with no rule | Radius (8 steps), shadow (pine family), z-index layers, opacity, breakpoints beyond Tailwind (860px nav chip, 1104px booker), easing and duration scales: all built, none in CLAUDE.md. | Low *(Shipped PR below: new 'Other token families' subsection in CLAUDE.md §3 covers radius, shadow, z-index, breakpoints, easing / duration.)* | CLAUDE.md §3 now points at `02-tokens.md`; promote the token tables there once tokens.css is adopted. | S |
| **G-D2** | `--highlight-strong` missing from the documented token block | Defined and used for focus and link-hover underline (`app/globals.css:18`), absent from the §3 `:root` block. | Low *(Shipped PR below: added to CLAUDE.md §3 `:root` block.)* | Add it to the §3 block (or replace it per G-C16). | S |
| **G-D4** | Iconography | All icons are hand-written inline SVG on a 24 grid, stroke 1.8 (nav) or 2 (arrows, download, lock), `currentColor`. Undocumented, so a new icon could arrive from a library at a different weight. | Low *(Shipped PR below: new "Iconography" subsection added to CLAUDE.md §3.)* | Add one line to §3: inline SVG, 24 grid, 1.8 stroke, round caps and joins, `currentColor`. | S |
| **G-D5** | Imagery and texture | Cover media 4:3 with looping muted video and poster fallback; grain overlay (`/images/about/grain.svg`); torn-paper clip-paths; highlighter SVG with hardcoded lilac. No written rule. | Low *(Shipped PR below: new "Imagery and texture" subsection added to CLAUDE.md §3.)* | Short imagery note in §3 (cover ratio, video rules, where grain and paper are allowed). | S |

### 1.4 Missing from the build (documented, but not built)

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-B1** | shadcn/ui `components/ui` | Locked in §2; folder absent. See G-C5. | Medium *(Shipped PR below: `components/ui/` folder created with `button.tsx` and `index.ts` barrel. First primitive in place; Tag / Segmented land as callsites need them.)* | G-C5 | M |
| **G-B3** | Lab, Writing and Stack folds | In the §14 launch storyboard, not on v3 / v3.1. See G-C10. | Medium *(Needs Megh)* | G-C10 | L |
| **G-B2** | `LoomEmbed`, `FigmaEmbed`, Callout `tradeoff` | Documented in §5, not in the kit. See G-C8. | Low | Build when a case study needs them, or remove from §5. | M |
| **G-B4** | Em-dash CI check | STYLE.md §1 'CI check (TODO)'. Not built; G-C13 shows regressions already shipped. | Low *(Shipped PR below: `scripts/check-emdash.sh` + `pnpm check` wired. Script scopes to `content/**`, `public/artifacts/**`, and string literals in `components/`, `app/`, `lib/` — code comments are exempt.)* | A Biome rule or a 3-line grep step in CI on `content/**`, `app/**`, `components/**`, `lib/**` strings. | S |

---

## 2. Accessibility

### 2.1 Contrast, every text / background pair

Normal text needs 4.5:1 and large text (24px, or 18.66px bold) needs 3:1. Non-text UI parts (focus indicators, input borders, meaningful graphics) need 3:1 (WCAG 1.4.11). Alpha colours are composited over the background they actually sit on.

**19 of 51 pairs fail** (one more is an exempt disabled control). The core text colours pass. The failures cluster in four places: the caption grey on oat, lilac used as a focus ring, the Venn, and the unlock / iframe one-offs.

| ID | Where | Pair | Ratio | Needs | Result | Issue |
|---|---|---|---:|---:|---|---|
| C1 | Body / headings on page | fg | 8.99:1 | 4.5:1 | Pass |  |
| C2 | Body / headings on cards | fg | 10.27:1 | 4.5:1 | Pass |  |
| C3 | Secondary text on page | fg-muted | 6.04:1 | 4.5:1 | Pass |  |
| C4 | Secondary text on cards | fg-muted | 6.91:1 | 4.5:1 | Pass |  |
| C5 | Captions, mono labels on page | fg-subtle | 4.25:1 | 4.5:1 | **Fail** | G-A1 |
| C6 | Captions, mono labels on cards | fg-subtle | 4.85:1 | 4.5:1 | Pass |  |
| C7 | Pine button / Contact fold text | accent-fg on accent | 8.99:1 | 4.5:1 | Pass |  |
| C8 | Contact copy (accent-fg 85%) on pine | accent-fg/85 | 6.98:1 | 4.5:1 | Pass |  |
| C9 | Contact email line (accent-fg 70%) on pine | accent-fg/70 | 5.29:1 | 4.5:1 | Pass |  |
| C10 | Text over highlighter mark (hero words, eyebrows) | fg on lilac mark | 7.37:1 | 4.5:1 | Pass |  |
| C11 | Eyebrow (fg-subtle) over highlighter mark | fg-subtle on lilac mark | 3.48:1 | 4.5:1 | **Fail** | G-A2 |
| C12 | Metric marker text (timeline card) | fg on highlight/80 | 7.12:1 | 4.5:1 | Pass |  |
| C13 | Selection highlight | fg on lilac | 6.47:1 | 4.5:1 | Pass |  |
| C14 | Timeline tooltip body TODAY | slate-600 on white/95 | 7.46:1 | 4.5:1 | Pass |  |
| C15 | Timeline tooltip date TODAY | slate-500 on white/95 | 4.68:1 | 4.5:1 | Pass |  |
| C16 | Timeline tooltip body PROPOSED (V1+V2) | fg-muted on bg-elevated | 6.91:1 | 4.5:1 | Pass |  |
| C17 | Venn chip: User | cream on #c1497f | 4.36:1 | 4.5:1 | **Fail** | G-A3 |
| C18 | Venn chip: Technology | cream on #4a72b0 | 4.56:1 | 4.5:1 | Pass |  |
| C19 | Venn chip: Business | cream on #c77e3b | 3.04:1 | 4.5:1 | **Fail** | G-A3 |
| C20 | Work-card spine: BondScanner | accent-fg on #182f8c | 8.49:1 | 4.5:1 | Pass |  |
| C21 | Work-card spine: Ultra | accent-fg on #171513 | 13.43:1 | 4.5:1 | Pass |  |
| C22 | Work-card spine: MoveInSync | #10240e on #3dae2b | 5.69:1 | 4.5:1 | Pass |  |
| C23 | LinkedIn icon at rest | #0a66c2 on bg-elevated | 4.79:1 | 3:1 | Pass |  |
| C24 | LinkedIn icon hover | white on #0a66c2 | 5.69:1 | 3:1 | Pass |  |
| C25 | Lock-again pill text at rest | fg on elevated/85 over page | 10.08:1 | 4.5:1 | Pass |  |
| C26 | Unlock: labels TODAY (pine 60%) | pine@60% on ticket | 3.45:1 | 4.5:1 | **Fail** | G-A4 |
| C27 | Unlock: labels TODAY (pine 70%) | pine@70% on ticket | 4.45:1 | 4.5:1 | **Fail** | G-A4 |
| C28 | Unlock: body TODAY (pine 80%) | pine@80% on ticket | 5.9:1 | 4.5:1 | Pass |  |
| C29 | Unlock: labels PROPOSED (V3) | fg-subtle on ticket | 4.85:1 | 4.5:1 | Pass |  |
| C30 | Unlock: stub labels TODAY (pine 60% on #ece1ca) | pine@60% on stub | 3.34:1 | 4.5:1 | **Fail** | G-A4 |
| C31 | Unlock: error text | #b23a48 on ticket | 4.93:1 | 4.5:1 | Pass |  |
| C32 | Unlock: 'Works in progress' badge | fg on lilac 45% over ticket | 8.41:1 | 4.5:1 | Pass |  |
| C33 | Unlock: submit button | oat on pine | 8.99:1 | 4.5:1 | Pass |  |
| C34 | Unlock: disabled submit (opacity 50%) | oat on pine, whole button @50% over ticket | 2.53:1 | 4.5:1 | Exempt: disabled control (WCAG 1.4.3 exception) |  |
| C35 | AI Call iframe body (light) | #0a0a0a on #ffffff | 19.8:1 | 4.5:1 | Pass |  |
| C36 | AI Call iframe muted (light) | #666666 on #ffffff | 5.74:1 | 4.5:1 | Pass |  |
| C37 | AI Call iframe faint (light) | #999999 on #ffffff | 2.85:1 | 4.5:1 | **Fail** | G-A5 |
| C38 | AI Call iframe success text (light) | #16a34a on #ffffff | 3.3:1 | 4.5:1 | **Fail** | G-A5 |
| C39 | AI Call iframe warning text (light) | #d97706 on #ffffff | 3.19:1 | 4.5:1 | **Fail** | G-A5 |
| U1 | Focus outline, global (lilac-400) on page | outline #b89cdc vs bg | 1.75:1 | 3:1 | **Fail** | G-A6 |
| U2 | Focus outline, global, on cards | outline #b89cdc vs bg-elevated | 2.0:1 | 3:1 | **Fail** | G-A6 |
| U3 | Focus outline, global, on pine Contact fold | outline #b89cdc vs pine | 5.12:1 | 3:1 | Pass |  |
| U4 | Focus ring, component (pine) on page | ring pine vs bg | 8.99:1 | 3:1 | Pass |  |
| U5 | Focus ring, component (pine) on pine fold | ring pine vs pine | 1.0:1 | 3:1 | **Fail** | G-A6 |
| U6 | Hairline border (controls: arrows, toggle track) | #d4c4a8 vs bg | 1.26:1 | 3:1 | **Fail** | G-A9 |
| U7 | Password input underline TODAY | pine@35% vs ticket | 1.93:1 | 3:1 | **Fail** | G-A7 |
| U8 | Password input underline, error | #b23a48 vs ticket | 4.93:1 | 3:1 | Pass |  |
| U9 | Venn rings (0.85 opacity) on page | venn-tech@85% vs bg | 2.89:1 | 3:1 | **Fail** | G-A8 |
| U10 | Venn ring User @85% |  | 2.85:1 | 3:1 | **Fail** | G-A8 |
| U11 | Venn ring Business @85% |  | 2.08:1 | 3:1 | **Fail** | G-A8 |
| U12 | Timeline node (past) bg-border dot | #d4c4a8 vs bg | 1.26:1 | 3:1 | **Fail** | G-A9 |

Contrast issues:

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-A1** | Caption grey fails on the page background | `--fg-subtle` #556b5d on `--bg` = **4.25:1** (needs 4.5). It passes on cards (4.85). It's used about 24 times on page backgrounds: dates, eyebrows, footer, captions, index numbers (C5). After V3 + V6 it is also the unlock stub label colour (4.25). | High *(Shipped PR #112 at #506758)* | Darken `--fg-subtle` to **#506758** (20% toward `--fg-muted`): 4.52 on oat, 5.17 on cards. This is a new value, so it needs approval (CLAUDE.md §9). Alternative: use `--fg-muted` for small text on `--bg`. | S |
| **G-A3** | Venn chip text: contrast and size | Cream on User #c1497f = **4.36:1**, on Business #c77e3b = **3.04:1** (C17, C19). The bigger problem is size: chip text is 14.5 drawing units in a 1200-unit SVG that fills the column. Computed render size: **about 4px at 375px wide** (327px column) and about 7px at 1440px. Zone labels about 10px and the 'I'm here' label about 8px on phones. The SVG has an `aria-label`, so screen readers get the summary. | High *(Shipped: Venn hidden below `lg` on hero. Phones get heading + CTA only. Contrast subproblem moot on failing viewport. Approved exception table unchanged.)* | Phones first: below `lg`, show the three rings and zone labels only and list the chips as HTML below the diagram (real 12 to 14px text that wraps). Contrast: darker chip fills, or pine ink on Business only (3.76, still short). Both colour routes change an approved exception, so they need Megh. | M |
| **G-A6** | Focus outline is nearly invisible on oat | Global `*:focus-visible` outline `--highlight-strong` #b89cdc: **1.75:1** on oat, 2.00:1 on cards (U1, U2); needs 3:1. The 4px lilac glow adds little. The pine component ring (8.99:1) may be overridden by this unlayered rule (01 Q2, Phase 4). A pine ring on the pine Contact fold would be 1:1 (U5); no element there uses it today. | High *(Shipped PR #112)* | One rule in `app/globals.css:228-233`: outline `2px solid var(--fg)`, offset 2px; on `#connect` (pine) use `var(--accent-fg)`. Keep the lilac glow as decoration, and drop the `border-radius: 2px` (G-A18). Updates CLAUDE.md §3 (G-C16). | S |
| **G-A2** | Section eyebrows over the highlighter mark | Mono 12px `--fg-subtle` on the lilac mark = **3.48:1** (C11). Affects 'EXPERIENCE', 'SELECTED WORK' and the case-study section eyebrows. | Medium *(Shipped PR #112)* | Eyebrow text to `--fg-muted` (4.96:1 on the mark). Found value, no new token. | S |
| **G-A4** | Unlock labels | Pine at 60 to 70% on the ticket = **3.45 / 4.45:1**; on the stub 3.34:1 (C26, C27, C30). V3 (approved) fixes the ticket labels (4.85). The stub stays at 4.25 after V6, fixed by G-A1. | Medium *(Shipped PR below: opacity removed from the five ticket and stub labels, so they read full pine on the cream fill.)* | Ship V3 + V6 with G-A1. | S |
| **G-A5** | AI Call iframe: faint and status text | Faint #999 on white = **2.85:1**; success text #16a34a = **3.30:1**; warning text #d97706 = **3.19:1** (C37 to C39). The status colours pass the 3:1 non-text bar, so they're fine on badges, icons and borders. They fail as text (`.warning-text`, `.success-text`, `.node-chip.warn/.dest` labels, `ai-call-pipeline.html:347-349,668-669`). | Medium *(Shipped PR below: `--text-faint` to #595959 (light) / #a1a1a8 (dark), both > 4.5:1. `.warning-text` and `.success-text` get a coloured dot via `::before`, so status also reads by shape, not only colour.)* | The island mapping fixes faint (→ `--fg-subtle` on `--bg-elevated`, 4.85). For status: keep the approved colours on badges and icons, and set status **text** in `--fg` next to a coloured dot. No new colours. | S |
| **G-A7** | Password field boundary | The underline is the field's only visible edge: pine at 35% = **1.93:1** (U7). Error state passes (4.93). | Medium *(Shipped PR below)* | Underline at `--fg-subtle` (4.85:1 on the ticket). Found value. | S |
| **G-A8** | Venn rings | Ring strokes at 0.85 opacity on oat: User 2.85, Technology 2.89, Business **2.08:1** (U9 to U11). Rings group the chips, so they carry meaning. | Low *(Shipped PR below: opacity 1, stroke 3 on both Venn variants, plus the travel Venn's animated targets. Business still reads 2.44:1 so the zone label carries the ID.)* | Opacity 1 and stroke 3 (the hover value in v3.1). Business still needs a darker stroke or relies on the zone label. | S |
| **G-A9** | Hairline borders on controls | `--border` on oat = 1.26:1 (U6, U12). Carousel arrows and the segmented control are identifiable by their glyph and text, so not a 1.4.11 failure. Past-timeline dots rely on position and the 'now' label. | Low | No change required. If a control ever relies on its border alone, use `--fg-subtle`. | S |

### 2.2 Tap targets under 44px

44 × 44px is the target size you asked for (Apple HIG; WCAG 2.5.5 AAA). WCAG 2.2 AA (2.5.8) sets a 24px floor, or enough spacing around a smaller target. Heights are **computed from classes**; Phase 4 measures. Listed phone-first.

| Control | Where | Computed height | Seen on | WCAG 2.2 AA (24px) | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|---|---|
| Mobile menu links | `nav.tsx:448` | 28px (text-lg, no padding) | Phone | Pass (≥ 24) | High | `py-2` + `min-h-11` on each link (≥ 44px). | S |
| Case-study back link | `app/work/[slug]/page.tsx:97` | ≈ 20px | Phone | Below 24, spacing exception likely | High | `py-3` (≥ 44px). It is the only way off the page (G-M1). | S |
| Experience view toggle segments | `experience.tsx:77` | 28px | Phone | Pass | Medium | `py-2.5` + `min-h-11` per segment. | S |
| TapInvest product tabs | `experience.tsx:426` | 28px | Phone | Pass | Medium | Same segmented-control fix (one component, G-C5). | S |
| Unlock show / hide password | `backstage-pass.tsx:238` | 28px (p-1 + 20px icon) | Phone | Pass | Medium | `p-3` (44px). | S |
| Nav status chip | `nav.tsx:170` | ≈ 38px | Phone | Pass | Medium | `py-3` (≈ 46px). | S |
| Hamburger | `nav.tsx:429` | 40px | Phone | Pass | Medium | `h-11 w-11`. | S |
| Carousel arrows | `work-thumbnails.tsx:229,237` | 40px | Phone | Pass | Medium | `size-11`. | S |
| 'View all' | `section-header.tsx:24` | ≈ 34px | Phone | Pass | Medium | `py-3`. | S |
| Travel-Venn chips (drag) | `product-venn-travel.tsx:746` | ≈ 8px tall at 375px | Phone | Below 24 | Medium | Turn off drag for coarse pointers (also fixes the scroll trap, G-A13). | S |
| Footer social icons | `site-footer.tsx:89` | 40px | Phone | Pass | Low | `h-11 w-11`. | S |
| Lock-again pill | `relock-button.tsx:30` | ≈ 34px | Phone | Pass | Low | `py-3`. | S |
| 'On this page' rows | `case-study-toc.tsx:60` | ≈ 39px | Phone | Pass | Low | `py-3`. | S |
| Unlock 'Not supposed to be here?' | `backstage-pass.tsx:305` | ≈ 16px | Phone | Below 24, spacing exception likely | Low | `py-3 inline-block`. | S |
| Nav section tabs | `nav.tsx:372` | 32px | Tablet / desktop | Pass | Low | `py-2.5`. | S |
| LinkedIn icon (bar) | `nav.tsx:402` | 36px | Tablet / desktop | Pass | Low | `h-11 w-11` to match the menu copy. | S |
| Resume button (bar) | `nav.tsx:413` | 36px (measured) | Tablet / desktop | Pass | Low | `py-2.5` (40px) or `py-3` (44px). | S |

Inline text links inside sentences (contact `mailto:`, Experience company names, case-study prose links) are exempt from 2.5.8 and not listed.

### 2.3 Focus states and keyboard

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-A6b** | Focus ring contrast | See G-A6. | High | G-A6 | S |
| **G-A10** | Skip link broken on the preview pages | 'Skip to content' targets `#main` (`app/layout.tsx:194`). `<main>` on `/preview/v3` and `/preview/v3.1` has no `id` (`app/preview/v3/page.tsx:21`, `v3.1/page.tsx:21`), so the link does nothing. Case-study and unlock pages have it. | High *(Shipped PR #112)* | `<main id="main">` on both pages. | S |
| **G-A11** | Mobile menu doesn't manage focus | Opening the menu doesn't move focus into it, focus isn't trapped, and the page behind stays tabbable (`nav.tsx:438-482`; no focus or inert handling in the file). `Esc` closes it (good). | Medium *(Shipped PR below: focus moves to the first drawer item on open, is trapped inside, and returns to the hamburger on Esc or close. Every non-nav body child gets `inert`.)* | On open, focus the first link and set `inert` on `<main>` and the footer; on close, return focus to the hamburger. | S |
| **G-A12** ✅ Closed | Password field focus ring is the low-contrast lilac one | The field sets `outline-none focus-visible:shadow-none` (`backstage-pass.tsx:194`), but Phase 4 shows the unlayered global rule wins: when focused it renders `outline: solid 2px #b89cdc` plus the lilac glow (measured on `/unlock`). The 2px custom caret (`:220-225`) is extra. So the field has a focus ring, but at about 2:1 on the ticket (same problem as G-A6). *(Corrected in Phase 4: Phase 3 said it relied on the caret only.)* | Medium *(Shipped PR #112 via G-A6)* | Fixed by G-A6. Optionally thicken the underline to `--fg` on focus as well (`focus-visible:border-fg`). | S |
| **G-A18** | Focused buttons lose their rounded shape | The global `*:focus-visible` rule also sets `border-radius: 2px` (`app/globals.css:232`). Unlayered, it beats `rounded-full`, so every pill and circle control turns square-cornered while it has keyboard focus. Seen on the hero CTA (`design-system/phase4/focus-ring-today.webp`). Applies to the primary pills, icon buttons, nav tabs and segmented controls. | Medium *(Shipped PR #112 via G-A6)* | Drop `border-radius` from the global rule; an outline follows the element's own radius in current browsers. Ships with G-A6. | S |
| **G-A14** | Some timeline entries are unreachable by keyboard on desktop | Desktop timeline chips are focusable only when the entry has a URL (`experience.tsx:769-784`); others are plain `div`s, so their tooltip can't be opened with a keyboard. The same content is in the list view and on phones. | Low *(Shipped PR below: non-URL chips now wrap in a `<button>` with the same focus ring, so the tooltip opens on keyboard focus.)* | Make every chip a `button` that toggles the tooltip, or render the summary inline for chips without a link. | S |
| **G-A15** | Controls with no component focus style | Carousel arrows, mobile-menu LinkedIn + Resume, Experience product and link-out links, contact `mailto:`, relock pill, 'View all' (01 §2.7). They rely on the global rule, so G-A6 fixes them. | Low *(Shipped PR #112 via G-A6)* | G-A6. | S |

### 2.4 Other accessibility issues

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-A16** | Carousel moves on its own with no pause control | Auto-advances indefinitely (10s after D6). Pauses only on hover or keyboard focus (`work-thumbnails.tsx:192-202`), so touch users can't stop it. WCAG 2.2.2 (Pause, Stop, Hide). | Medium *(Shipped PR below: pause / play button added beside the arrows; any manual arrow press or touch swipe stops auto-advance for the rest of the session until play is pressed.)* | A small pause / play button beside the arrows, and stop autoplay after the first manual swipe or arrow press. | S |
| **G-A13** ✅ Closed | Travel Venn traps the scroll on phones | Chips set `touch-action: none` (`product-venn-travel.tsx:746`), so a thumb that starts a scroll on a chip drags the chip instead. The hero is the first screen. | Medium *(Shipped PR below: drag attach gated on `(pointer: fine)`. Touch pointers skip both the `touch-action: none` and the pointerdown wiring; chips render but scroll passes through.)* | Enable drag only for `(pointer: fine)`; leave touch to scroll. | S |
| **G-A17** | Rotating nav status chip | Text changes every 4.8s and pauses only on hover / focus (`nav.tsx:88-94`). Lower risk than the carousel (one short line, no layout shift), but the same 2.2.2 rule applies to auto-updating content. | Low *(Shipped PR below: nav chip stops after one full cycle through the four lines. Still pauses on hover and focus.)* | Stop after one full cycle, or pause while the page is scrolled past the hero (it already collapses there). | S |

---

## 3. Missing pieces a portfolio like this will need

Judged against the job in CLAUDE.md §1: move a recruiter or hiring PM from skimming to "I want to talk" in 60 seconds, mostly on a phone.

| ID | Issue | Evidence | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|
| **G-M1** ✅ Closed | No path to contact from a case study | Case-study pages render no nav, no footer and no contact CTA when the study has a body (`app/work/[slug]/page.tsx:80-205`; the CTA at `:193-198` shows only on coming-soon studies). A recruiter who opens a shared study link can only press 'Back'. | High *(Closed. Shipped PR #119, live via #120: end-of-study block with Book 20 min, Copy email and LinkedIn; site footer on every `/work/*` page; slim top bar with "Let's connect", sticky from `xl`, scrolls away below it. Also fixed a 9px sideways overflow on phones: the case-study grid had no column cap below `xl`.)* | Add an end-of-study CTA block (reuse the primary pill: 'Let's talk about it →' to `/#connect` and `mailto:`), plus the site nav or a slim top bar. | M |
| **G-M2** ✅ Closed | Long case studies have no in-page navigation on phones | Below 1280px 'On this page' is a list above the article, not sticky (`page.tsx:145-151`). The AI Call study is long (351 lines of MDX), so a phone reader has no way to jump or get back to the top. | Medium *(Shipped PR #119, live via #120: below `xl` the index is a one-line bar pinned to the top that names the current section and drops the full list down on tap. The inline list it replaces is hidden below `xl`.)* | A sticky 'On this page' pill that opens the index as a sheet below `xl`, or a back-to-top button. | M |
| **G-M3** | Branded 404 page | No `app/not-found.tsx`, so `notFound()` (`page.tsx:81`) and mistyped links show Next's default page. | Medium *(Shipped PR below: `app/not-found.tsx` built with 'Wrong doorway.' headline, three exits (Home, Selected Work, Contact), noindex meta.)* | A one-screen 404 in the site's voice, with links to Selected Work and Contact. | S |
| **G-M5** | Loading state for the Cal booker | The booker is a white `min-height: 560px` box until Cal's script loads (`cal-embed.tsx:25-29`), the last thing a recruiter sees before booking. | Medium *(Shipped PR below: `cal-embed.tsx` renders a month-grid skeleton over pine with a `mailto:` fallback line until Cal's API fires ready. Also fixed the retired `#1F4D3A` cal-brand value to the current pine.)* | A skeleton (month grid outline) plus the `mailto:` fallback visible from the start. | S |
| **G-M6** | Shared UI primitives | Button, Link, Tag, IconButton, SegmentedControl, Tooltip. Three different tooltip implementations exist (timeline portal, About torn tip, native `title`). | Medium *(Partial PR below: Button + ButtonLink shipped. Tag, IconButton, SegmentedControl, Tooltip still to build; the three tooltip implementations still diverge.)* | Build with G-C5; one Tooltip pattern. | M |
| **G-M7** | Reusable lock flow for shared content | Megh wants the lock for content shown to specific people. Today it is one route-level gate (`middleware.ts:10-24`, one password, all of `/preview/*` and `/work/*`). There's no per-item lock, no 'locked' state on a work card, and no 'request access' path. | Medium *(Needs Megh (scope))* | Extract the ticket's field, submit and status line into a component; add a `locked` variant to the work card (lock badge plus a 'Request access' `mailto:`); allow per-path passes in `lib/preview-auth.ts`. | L |
| **G-M4** | Error boundary | No `app/error.tsx` or `global-error.tsx`. A runtime error in a client component (Venn, collage) shows Next's default error. | Low *(Shipped PR below: `app/error.tsx` with 'Not your fault.' headline, Try again (reset) and Home. Dev-only console.error; digest shown when Next emits one.)* | Minimal branded error page with a retry and a link home. | S |
| **G-M8** ✅ Closed | Confirmation pattern for copy actions | `components/copy-email-button.tsx` already does copy-to-clipboard with a 'Copied' state but isn't used. Phone visitors without a mail app get nothing from `mailto:`. | Low *(Shipped PR below: case-study end block uses it (#119); the Contact fold now has a "Copy" button beside the `mailto:` link, 44px tall, with the "Copied to clipboard" state. Verified in a local build.)* | Use it next to the `mailto:` in Contact. | S |
| **G-M9** | Zoomable screenshots for future case studies | `Figure` has no tap-to-zoom (`figure.tsx`). The AI Call study uses an iframe, but the other studies will use screenshots that are hard to read in a 327px column. | Low | A simple full-screen viewer on tap for `Figure` (no new dependency). | M |

---

## 4. Full issue register

Every issue above in one list, sorted by severity then effort. Cross-references (G-A6b, G-B1, G-B3) point at another issue and are not counted twice. Tap targets are grouped as one row; §2.2 has each control.

| ID | Area | Issue | Severity | Effort | Needs Megh? |
|---|---|---|---|---|---|
| G-A3 | Contrast | Venn chip text: contrast and size | High | M |  |
| G-M1 | Missing piece | No path to contact from a case study (✅ closed, PR #119) | High | M |  |
| G-A1 | Contrast | Caption grey fails on the page background | High | S |  |
| G-A10 | Focus / keyboard | Skip link broken on the preview pages | High | S |  |
| G-A6 | Contrast | Focus outline is nearly invisible on oat | High | S |  |
| G-C16 | DS conflict | Lilac as the focus-ring colour fails contrast | High | S |  |
| G-C17 | DS conflict | Body text is not rendered in Geist | High | S |  |
| G-C10 | DS conflict | Storyboard: two folds missing, Stack missing from About | Medium | L | Yes |
| G-M7 | Missing piece | Reusable lock flow for shared content | Medium | L | Yes |
| G-C1 | DS conflict | Hardcoded colours outside the tokens | Medium | M |  |
| G-C5 | DS conflict | No shadcn/ui primitives; shared controls are copied class strings | Medium | M |  |
| G-M2 | Missing piece | Long case studies have no in-page navigation on phones (✅ closed) | Medium | M |  |
| G-M6 | Missing piece | Shared UI primitives | Medium | M |  |
| G-A11 | Focus / keyboard | Mobile menu doesn't manage focus | Medium | S |  |
| G-A12 | Focus / keyboard | Password field focus ring is the low-contrast lilac one (✅ closed) | Medium | S |  |
| G-A13 | Accessibility | Travel Venn traps the scroll on phones (✅ closed) | Medium | S |  |
| G-A16 | Accessibility | Carousel moves on its own with no pause control | Medium | S |  |
| G-A18 | Focus / keyboard | Focused buttons lose their rounded shape | Medium | S |  |
| G-A2 | Contrast | Section eyebrows over the highlighter mark | Medium | S |  |
| G-A4 | Contrast | Unlock labels | Medium | S |  |
| G-A5 | Contrast | AI Call iframe: faint and status text | Medium | S |  |
| G-A7 | Contrast | Password field boundary | Medium | S |  |
| G-C13 | DS conflict | Em dashes in rendered text | Medium | S |  |
| G-C2 | DS conflict | Fluid-type rule: case-study dek is too close to body | Medium | S |  |
| G-C8 | DS conflict | MDX component API in CLAUDE.md §5 doesn't match the kit | Medium | S |  |
| G-C9 | DS conflict | Case study has no TL;DR section | Medium | S | Yes |
| G-D3 | Missing in DS | Component specs and states | Medium | S |  |
| G-D6 | Missing in DS | Form fields | Medium | S |  |
| G-M3 | Missing piece | Branded 404 page | Medium | S |  |
| G-M5 | Missing piece | Loading state for the Cal booker | Medium | S |  |
| G-B2 | Missing in build | `LoomEmbed`, `FigmaEmbed`, Callout `tradeoff` | Low | M |  |
| G-C6 | DS conflict | Inline styles | Low | M |  |
| G-M9 | Missing piece | Zoomable screenshots for future case studies | Low | M |  |
| G-A14 | Focus / keyboard | Some timeline entries are unreachable by keyboard on desktop | Low | S |  |
| G-A15 | Focus / keyboard | Controls with no component focus style | Low | S |  |
| G-A17 | Accessibility | Rotating nav status chip | Low | S |  |
| G-A8 | Contrast | Venn rings | Low | S |  |
| G-A9 | Contrast | Hairline borders on controls | Low | S |  |
| G-B4 | Missing in build | Em-dash CI check | Low | S |  |
| G-C11 | DS conflict | Type scale nominal values no longer describe the site | Low | S | Yes |
| G-C12 | DS conflict | Hover easing | Low | S |  |
| G-C14 | DS conflict | Title Case heading | Low | S |  |
| G-C15 | DS conflict | Spaced hyphen used as a dash | Low | S |  |
| G-C18 | DS conflict | Venn chip layout was tuned on the fallback font | Low | S |  |
| G-C3 | DS conflict | Motion: cursor tracking and scroll-linked effects | Low | S |  |
| G-C4 | DS conflict | `motion` (Framer Motion) used without the 'only if requested' note | Low | S | Yes |
| G-C7 | DS conflict | CSS files beyond `globals.css` | Low | S |  |
| G-D1 | Missing in DS | Token families with no rule | Low | S |  |
| G-D2 | Missing in DS | `--highlight-strong` missing from the documented token block | Low | S |  |
| G-D4 | Missing in DS | Iconography | Low | S |  |
| G-D5 | Missing in DS | Imagery and texture | Low | S |  |
| G-M4 | Missing piece | Error boundary | Low | S |  |
| G-M8 | Missing piece | Confirmation pattern for copy actions (✅ closed) | Low | S |  |
| G-T1 to G-T17 | Tap targets | 17 controls under 44px (§2.2) | High 2, Medium 8, Low 7 | S each | |
