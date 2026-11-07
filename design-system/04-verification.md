# 04 · Verification against the rendered site

> Phase 4 of the design-system audit. The site was rendered and screenshotted, and its computed styles were measured, to check that the tokens and components documented in phases 1 to 3 match what visitors actually see.

## 0. Method

| | |
|---|---|
| **What was rendered** | A **local production build** (`next build` + `next start`) of commit `50a3913`, the same commit `origin/main` serves. No app code differs between that commit and this branch (`git diff 50a3913 HEAD -- app components lib content public middleware.ts` is empty). |
| **Why not the live URL** | This environment's network proxy blocks `meghgupta.in` (`CONNECT tunnel failed, response 403`). The local build runs identical code. Vercel-only differences (CDN, edge config) don't affect styling. |
| **Lock** | The local server used a throwaway password (`PREVIEW_PASSWORD` / `PREVIEW_SECRET` set only for this process). Megh's real password was not used or stored. |
| **Pages** | `/preview/v3`, `/preview/v3.1`, `/work/ai-call-analysis-pipeline?mark=text` (from v3), `?mark=row` (from v3.1), `/unlock`. |
| **Widths** | 375 × 812 and 1440 × 900, device scale 2, light colour scheme. |
| **Motion** | Default motion for the measurements (5.2s wait so the Venn intro finishes). Reduced motion for the build-to-build comparisons, so frames are static and comparable. |
| **Tooling** | Playwright (pre-installed Chromium): `getComputedStyle`, `getBoundingClientRect`, keyboard `Tab` for focus, Pillow for pixel diffs. Scripts are in the session scratchpad, not the repo. |

Screenshots in `design-system/phase4/`:

| File | What |
|---|---|
| `home-v3-375.webp`, `home-v3-1440.webp` | `/preview/v3`, first viewport |
| `home-v3.1-375.webp`, `home-v3.1-1440.webp` | `/preview/v3.1`, first viewport |
| `home-v3-375-fullpage.webp` | `/preview/v3`, full page at 375px (1×) |
| `case-study-375.webp`, `case-study-1440.webp` | AI Call case study (`text` mark at 375, `row` mark at 1440) |
| `case-study-375-fullpage.webp` | Case study, full page at 375px (1×, cropped at 16,383px, the WebP height limit) |
| `unlock-375.webp`, `unlock-1440.webp` | `/unlock` |
| `focus-ring-today.webp` | Keyboard focus on the hero CTA at 375px |
| `d7-fonts-*.webp` | Before / after the proposed font fix (D7) |

---

## 1. Headline results

1. **Body text does not render in Geist.** `<body>`, footer, buttons, case-study prose and dek, and the Venn labels and chips all compute to the system font stack. Only elements with an explicit `font-serif` / `font-mono` class get Geist / Geist Mono. Root cause found, fix (D7) built and verified. *New issue, 03-gaps G-C17 (High).*
2. **The lilac focus outline is what renders**, not the pine ring the components ask for. It also squares off pill buttons while they're focused. Confirms G-A6 and adds G-A18.
3. **The four held patches (D2, D4, D5, D6) change nothing visually.** Pixel-identical at both widths on every page; the code PR gate in `02-decisions.md` is passed.
4. **Every computed tap-target height from Phase 3 matched the browser.** One control not listed before (desktop Resume, 36px) was added.
5. **Two Phase 2 / 3 statements were wrong and are corrected:** the Venn labels do *not* render in Geist (02-decisions D4), and the password field does have a focus ring, just the low-contrast lilac one (03-gaps G-A12).

---

## 2. Documented vs rendered

✓ = matches the docs. ✗ = mismatch (with where it was fixed).

### 2.1 Tokens

| Claim (doc) | 375px | 1440px | Result |
|---|---|---|---|
| Page background `--bg` #e8dcc6, text `--fg` #1f3b2e (01 §2.1a) | rgb(232,220,198) / rgb(31,59,46) | same | ✓ |
| Caption / eyebrow colour `--fg-subtle` #556b5d (01 §2.1a) | rgb(85,107,93) on eyebrow and footer | same | ✓ |
| `border-border` renders as the lilac mix (01 Q3, `--border-hairline` in 02-tokens) | `oklab(0.8198 0.0178 0.0100)` on a card | same | ✓ global rule wins |
| `section` scroll offset 80px overrides `scroll-mt-16` (01 Q3) | `#connect` 80px, `#experience` 80px | same | ✓ |
| Nav pill uses Tailwind's black `shadow-sm` (01 §2.5, V17) | `rgba(0,0,0,.1) 0 1px 3px, rgba(0,0,0,.1) 0 1px 2px -1px` | same | ✓ |
| Body / prose / footer in **Geist Sans** (CLAUDE.md §2, 01 §1, 01 §2.2a) | `ui-sans-serif, system-ui, sans-serif, …` | same | **✗ Not Geist.** G-C17, fix D7 |
| Headings in Geist via `font-serif` (01 §2.2a) | `Geist, "Geist Fallback"` (hero H1, section H2, case H1 / H2, contact H2) | same | ✓ |
| Eyebrows in Geist Mono, 12px, 0.24em (01 §2.2e, 02-components §6) | Geist Mono, 12px, 2.88px | same | ✓ |
| Greeting in Kalam (01 Q4) | `Kalam, "Kalam Fallback", cursive` | same | ✓ |
| Venn labels in Geist, chips in Geist Mono (01 §3.2) | both system font | both system font | **✗** G-C17, fix D7 |

### 2.2 Type sizes (01 §2.2b)

| Element | Doc (base → `md`/`lg`) | 375px | 1440px | Result |
|---|---|---|---|---|
| Hero H1 | 36 → 48 → 52 | 36px, lh 38.88 (1.08), -0.9px (-0.025em) | 52px, lh 56.16 | ✓ (52 retires with approved V10) |
| Greeting | 30 → 36 | 30px | 36px | ✓ |
| Section H2 | 30 → 48 | 30px, lh 33 (1.1) | 48px | ✓ |
| Contact H2 | 48 → 64 | 48px | 64px | ✓ |
| Case-study H1 | 36 → 48, lh 1.25 | 36px, lh 45 | 48px, lh 60 | ✓ |
| Case-study dek | 18 | 18px | 18px | ✓ (fails the fluid rule: G-C2) |
| Case-study section H2 | 28 → 36 | 28px | 36px | ✓ |
| Case-study body | 16, lh 1.625 | 16px, lh 26 | same | ✓ |
| Unlock H1 | `clamp(3rem, 9vw, 5.25rem)` | 48px (floor) | 84px (cap) | ✓ |
| Venn chip text (01 Q5) | 14.5 drawing units | **4.0px** (5px box), SVG 327px wide | **7.1px**, SVG 590px wide | ✓ as computed; G-A3 confirmed |
| Venn zone label | 36 units | 9.8px | 17.7px | ✓ as computed |

### 2.3 Components and states

| Claim | Measured | Result |
|---|---|---|
| Hero CTA tap height 44px (02-components §1a) | 155 × 44px | ✓ |
| Component focus ring is pine `ring-2` + offset (02-components §1) | Focused CTA: `outline: solid 2px rgb(184,156,220)`, offset 2px, glow `0 0 0 4px rgba(203,179,232,.3)`. Corners square while focused (screenshot). | **✗** global lilac wins; docs updated; G-A6 + G-A18 |
| Skip link is the first Tab stop, target `#main` | First Tab focuses "Skip to content"; `#main` missing on v3 / v3.1, present on case study | ✓ confirms G-A10 |
| Case-study pages have no nav and no footer (02-components §16) | `nav[aria-label=Primary]` absent, `footer` absent | ✓ confirms G-M1 |
| "On this page" is inline below `xl`, sticky from 1280px (02-components §16) | `position: static` at 375, `sticky` at 1440 | ✓ |
| Index mark follows `?mark=` (01 §3.10) | `data-index-mark="text"` / `"row"` | ✓ |
| AI Call iframe auto-height, minimum 820px (01 §3.10) | 820px before content measured; 1162px once resized (375) | ✓ |
| Unlock: password autofocused, submit disabled until typed, eye toggle 28px (02-components §18) | Focus on `#bp-password`; submit 287 × 47 (375), 153 × 45 (1440); toggle 28 × 28 | ✓ |
| Unlock field relies on its caret for focus (03-gaps G-A12, Phase 3) | Focused field renders the lilac outline + glow | **✗** Phase 3 claim corrected |
| Em dashes visible on the homepage (03-gaps G-C13) | Bond Bytes and Freshdesk one-liners on the shelf; tab title "Portfolio v3 preview [em dash] Megh Gupta" | ✓ confirmed |
| Lock-again pill overlaps content on phones (02-components §15) | Sits over the lower Venn at 375 (`home-v3-375.webp`) | ✓ |

### 2.4 Tap targets (03-gaps §2.2): computed vs measured

| Control | Computed (Phase 3) | Measured | Result |
|---|---|---|---|
| Nav status chip | ≈ 38px | 38px | ✓ |
| Hamburger | 40px | 40 × 40 | ✓ |
| Experience view toggle | 28px | 28px | ✓ |
| Carousel arrows | 40px | 40 × 40 | ✓ |
| "View all" | ≈ 34px | 34px | ✓ |
| Footer social icons | 40px | 40 × 40 | ✓ |
| Lock-again pill | ≈ 34px | 34.3px | ✓ |
| Case-study back link | ≈ 20px | 20px | ✓ |
| "On this page" rows | ≈ 39px | 39.3px (375), 58.5px (1440, 2-line rows) | ✓ |
| Unlock eye toggle | 28px | 28 × 28 | ✓ |
| Nav section tabs (desktop) | 32px | 32px | ✓ |
| LinkedIn icon (desktop bar) | 36px | 36 × 36 | ✓ |
| Resume button (desktop bar) | not listed | 36px | Added to 03-gaps §2.2 |

---

## 3. Patch verification

### 3.1 D2, D4, D5, D6 (held code changes): no visual change

Both builds were rendered with reduced motion (static frames) at 375 and 1440px, then compared pixel by pixel:

| Page | 375 viewport | 375 full page | 1440 viewport | 1440 full page |
|---|---|---|---|---|
| `/preview/v3` | identical | identical except footer clock | identical | identical except footer clock |
| `/preview/v3.1` | identical | identical except footer clock | identical | identical |
| Case study, `text` mark | identical | identical | identical | identical |
| Case study, `row` mark | (viewport not compared) | identical | identical | identical |
| `/unlock` | identical except ticket serial | n/a | identical except ticket serial | n/a |

The only differences are the live IST clock ("1:38 am ist" vs "1:40 am ist", two minutes apart) and the unlock ticket's minute-based serial. **Verdict: safe to ship as one code PR.** The one computed-style difference: the greeting's `font-family` string loses the trailing `cursive` under D5, which only matters if Kalam fails to load.

### 3.2 D7 (proposed in Phase 4): fixes the font, visible by design

| Element | Today | With D7 |
|---|---|---|
| `<body>` | system stack | `Geist, "Geist Fallback", Arial, Helvetica, sans-serif` |
| Footer text | system stack | Geist |
| Case-study prose and dek | system stack | Geist |
| Venn zone labels | system stack | Geist |
| Venn chips | system stack | Geist Mono |
| Greeting | Kalam | Kalam (unchanged) |
| Hero / section headings | Geist | Geist (unchanged) |

Verified at 375 and 1440px. Patch: `patches/D7-font-variables-on-html.diff` (Biome-clean, `tsc` passes). Side effect: two Business chips touch at 1440px (03-gaps G-C18).

**Note on the screenshots:** this server's fallback font looks close to Geist, so the before/after looks subtle here. On real devices the fallback is SF Pro (Apple), Segoe UI (Windows) or Roboto (Android), and the difference is larger.

---

## 4. Mismatches and where they were fixed

| # | Mismatch | Fixed in |
|---|---|---|
| X1 | Body / prose / footer / Venn text is not Geist | 03-gaps **G-C17** (new, High); 01 §2.2a note; 02-components header note; patch **D7** |
| X2 | Focus ring renders lilac (not pine) and squares pill corners | 01 Q2 resolved; 02-components §1 and §2; 03-gaps **G-A6** updated, **G-A18** (new) |
| X3 | Venn labels said to render in Geist (02-decisions D4) | 02-decisions D4 corrected |
| X4 | Password field said to rely on its caret only | 03-gaps **G-A12** corrected |
| X5 | Desktop Resume button (36px) missing from the tap list | 03-gaps §2.2 |
| X6 | Venn chip collision once Geist Mono loads | 03-gaps **G-C18** (new, Low) |

Everything else documented in phases 1 to 3 matched the render.
