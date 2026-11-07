# 02 · Tokens (normalised proposal)

> Phase 2 of the design-system audit. Input: `01-inventory.md` (revision 2). Output: this document, `tokens.json` and `tokens.css` (generated from one spec, so they cannot disagree), and `02-components.md`.
>
> **Nothing here is wired into the site.** `tokens.css` is a reference file; no route imports it. Phase 3 decides what migrates and in what order.

## 0. Rules this proposal follows

1. **Only values found in Phase 1.** Each near-duplicate group collapses onto a value already in the code. The proposal creates names, not values.
2. **Canonical value per group:** pick the value CLAUDE.md §3 already names; else the one with the most uses; else the one already on Tailwind's scale. The reason is stated in each group row.
3. **Existing names stay.** `--bg`, `--fg`, `--accent` and the other `:root` variables become the semantic layer on top of a new primitive layer. Adopting the set needs no rename across the 235 utility uses that already reference them.
4. **A value used once is not a token**, with three exceptions that a locked doc names: `--text-display` (CLAUDE.md §3 display size), `--container-prose` and `--container-rail` (CLAUDE.md §3 case-study shell). Single-use values elsewhere are folded into a neighbour or left as component-internal (§4).
5. **"Edits"** = source locations that would need changing to adopt the token. A Tailwind default utility whose value already equals the token (e.g. `text-sm` for `--text-small`) counts as **0**, because registering the token under Tailwind's own theme name keeps the utility working. Arbitrary values, inline styles, CSS literals and JS constants count **1 each**.
6. **Scopes:** `site` (every route), `lock` (`/unlock` only: the approved denied-red and dawn-sky exceptions), `island` (inside the AI Call iframe).

## Summary

| Family | Tokens | Edits to adopt |
|---|---:|---:|
| color | 41 | 75 |
| font | 36 | 108 |
| space | 5 | 5 |
| size | 4 | 2 |
| radius | 8 | 13 |
| border | 3 | 0 |
| shadow | 5 | 16 |
| opacity | 2 | 1 |
| zIndex | 7 | 8 |
| motion | 14 | 69 |
| breakpoint | 6 | 7 |
| island | 17 | 17 |
| **Total** | **148** | **321** |

**21 of the 148 tokens change something a visitor would notice** (§3). Everything else is a rename or a refactor with identical output.

---

## 1. Near-duplicate groups ("likely the same token")

Each row lists every value found, with its use count. **Verdict** says whether the values are likely meant to be one token, and which value wins.

### 1.1 Colour

| Group | Values found (uses) | Verdict | Canonical | Why |
|---|---|---|---|---|
| Pine | `--fg` `#1f3b2e` (63), `--accent` `#1f3b2e` (59), `PINE` const (12 via 1), relock `[#1f3b2e]` (3), Cal `#1F4D3A` (2) | **Same.** `#1F4D3A` is the retired pine (CLAUDE.md §3). | `#1f3b2e` | Locked value. `--fg` and `--accent` keep separate names because they carry different roles. |
| Pine at alpha | `rgba(31,59,46,…)`: .035, .12, .18, .2, .22, .28 ×3, .35, .45, .6; `color-mix(--fg …)`: 12%, 14%, 22% ×2, 28%, 50%; `border-fg/15`, `/30` | Mostly shadow and line alphas. Shadows → 4 shadow tokens (§2.15). Lines → `color-mix(var(--fg) N%)` keeping today's N. | see shadows | Alpha on a token keeps one source of truth without a token per alpha. |
| Oatmeal | `--bg` `#e8dcc6` (12), `--accent-fg` `#e8dcc6` (16), `theme-color` `#E8DCC6`, relock / unlock inline (2), veil `rgba(232,220,198,.55/.15)` | **Same.** | `#e8dcc6` | Locked value. `theme-color` cannot read a CSS variable; it stays a literal that must equal `--bg`. |
| Elevated oat | `--bg-elevated` `#f3ebd9` (30), `--paper` alias (3), relock `/85`, ticket body | **Same.** | `#f3ebd9` | Locked value |
| Stub oat | `#ece1ca` (1, unlock stub) | **Likely same as `--bg`** (4 to 5 RGB steps away) | `--bg` | Single use, imperceptible step. Phase 4 checks the stub still reads as a separate half. |
| Lilac | `--highlight` (8), `rgba(203,179,232,…)` 0 ×2, .22, .28, .3, .35, .45; `color-mix(--highlight …)` 30%, 42%, 45%, 82%; `highlighter.svg` `#CBB3E8` | **Same hue**, alphas vary by job (wash, glow, tape, badge). | `#cbb3e8` + `color-mix` at today's alpha | The SVG cannot read variables; it stays a literal that must match. |
| Strong lilac | `--highlight-strong` (3), `highlighter.svg` `#B89CDC` | **Same.** | `#b89cdc` | Add it to the Tailwind bridge so `outline-highlight-strong` exists. |
| Cream | `--venn-cream` `#fdf7ee` (4), `rgba(253,247,238,.6)` (1) | **Same**, but used for two jobs (Venn ink, timeline band) | `#fdf7ee` → `--venn-ink` + `--surface-band` | Splitting the role keeps the Venn token from leaking into the experience fold. |
| Tooltip greys | `bg-white/95`, `slate-200/70`, `/80`, `slate-500`, `slate-600`, `rgba(15,23,42,.18)` | **Off-system**; each maps to an existing role | `--bg-elevated`, `--border`, `--fg-subtle`, `--fg-muted`, `--shadow-md` | The only Tailwind-palette greys in scope. |
| Ring offset | Tailwind default `#fff` (17 `ring-offset-2`) | **Off-system** | `--bg` | White gap on oat. Phase 4 confirms whether this ring even renders. |
| Black shadows | `shadow-sm` ×3, `shadow-md` ×2, `shadow-lg` ×1 (Tailwind, black 10%); Cal card black .35 | **Off-system**; every custom shadow is pine-tinted | pine shadow tokens | §2.15 |
| Venn trio | `#c1497f`, `#4a72b0`, `#c77e3b` | **Distinct**, data-viz only | keep | Confirmed by Megh as the only three-colour set |
| Brand marks | LinkedIn `#0A66C2` (9), BondScanner `#182F8C`, Ultra `#171513`, MoveInSync `#3DAE2B` / `#10240E` | **Distinct**, content colours | keep as named content tokens | "Content as-is" (01 Q7) |
| Lock flow | `#b23a48` denied red; dawn sky `#B7CDE1 #CCDAE7 #E3DFCF #F1E6CE #F6ECD1`, glow, `#D5DBE3`, `#FFFFFF` | **Distinct**, approved `/unlock`-only exceptions | keep, scope `lock` | Megh's call (this session) |
| Not rendered | `cloud-background.tsx:41-53` (`blue`, `ods` palettes), `lib/work.ts` spine colours, globals dead rules | n/a | not tokenised | Not on any in-scope route |

### 1.2 Type size

| Group | Values found (uses) | Verdict | Canonical | Why |
|---|---|---|---|---|
| Micro mono | 9.28px (1), 9.6px (5), **10px (7)**, 10.4px (2), 10.88px (1) | **Same** | 10px | Most uses |
| Label | 11px (4), **12px (19)** | **Same** at this size; 11 and 12 both serve mono dates and pills | 12px | Most uses, and the larger value is safer on phones |
| Small | 13px (1), **14px (28)** | **Same** | 14px | Most uses |
| Compact body | **15px (3)**, 15.2px (1) | **Same** | 15px | Most uses |
| 28 vs 30 | 28px (3, case-study H2), 30px (7, homepage H2, metric, greeting) | **Not merged.** Different roles; 28 is CLAUDE.md §3 h2. | both | A merge would change every case-study section heading |
| 36 | `text-[2.25rem]` (5), `text-4xl` (3) | **Identical value**, two spellings | 36px | Exact duplicate |
| 40 | `text-[2.5rem]` (1) | **Single use**, fold into 36 | 36px | Rule 4 |
| 48 | `text-[3rem]` (2), `text-5xl` (3) | **Identical value** | 48px | Exact duplicate |
| 52 | `text-[3.25rem]` (1, hero H1 at lg) | **Single use**, fold into 48 | 48px | Rule 4. **Visible** (V11): needs your approval |
| Fluid clamps | About title `clamp(1.75rem, 5vw, 2.65rem)`, About copy `clamp(.9375rem, 1.7vw, 1.125rem)`, unlock H1 `clamp(3rem, 9vw, 5.25rem)` | **Not tokenised**; component-level | n/a | One use each. Phase 3 compares them with the CLAUDE.md fluid rule. |

### 1.3 Line height and letter spacing

| Group | Values found (uses) | Verdict | Canonical | Why |
|---|---|---|---|---|
| None | 0.95 (1), **1 (5)** | Same | 1 | Most uses |
| Display | **1.05 (2)**, 1.08 (1) | Same | 1.05 | CLAUDE.md §3 display |
| Heading | **1.1 (2)** | Own token | 1.1 | CLAUDE.md §3 h1 |
| Snug | **1.375 (3)**, 1.4 (1), 1.45 (1) | Same | 1.375 | Most uses; Tailwind `snug` |
| Body | 1.5 (1), **1.6 (2)**, 1.625 (10), 1.65 (1), 1.7 (1) | Same | **1.6** | CLAUDE.md §3 body. 1.625 has more uses, but the locked doc names 1.6 and the difference is 0.4px. |
| Display tracking | **-0.025em (5)**, -0.03em (1) | Same | -0.025em | Most uses |
| Tight display tracking | -0.04em (1), -0.045em (1) | Same | -0.04em | CLAUDE.md fluid-type rule uses -0.04em |
| Mono tracking | 0.025em (1), **0.05em (12)** | Same | 0.05em | Most uses |
| Label tracking | 0.15em (1), 0.16em (3), 0.18em (2), **0.2em (4)** | Same | 0.2em | Most uses |
| Eyebrow tracking | **0.24em (2)**, 0.25em (2), 0.3em (3, unlock) | Same | 0.24em | Homepage section eyebrow value. 0.3em has more uses but all on `/unlock`. |

### 1.4 Space, radius, shadow, z, motion, breakpoints

| Group | Values found (uses) | Verdict | Canonical |
|---|---|---|---|
| Scroll offset | 64px (1), **80px (1, global)**, 96px (2) | Same job: clear the 64 / 72px sticky nav | 80px |
| Avatar gap | **16px** (base), 18px (`md:` only) | Same | 16px |
| Page gutter | `px-6 md:px-8` ×6 shells; nav `px-4 md:px-6`; unlock `px-4 md:px-8` | **Not merged.** Nav and unlock are full-bleed bars, not content shells. Phase 3 checks edge alignment on phones. | `--gutter` 24 / 32 |
| Radius 6 / 7 | **6px (6)**, 7px (1, drag ghost) | Same | 6px |
| Radius 10 / 12 | 10px (1, stamp), **12px (7)** | Same | 12px |
| Radius 16 / 18 | **16px (3)**, 18px (5) | Same. 18 has more uses, but 16 is on Tailwind's scale. | 16px |
| Shadow, resting | hero `0 2px 8px pine .18`, Tailwind `shadow-sm` ×3 | Same job | hero value |
| Shadow, floating | relock `0 10px 30px -12px pine .45`, tooltip, drag ghost, unlock submit, Tailwind `shadow-md` ×2, `shadow-lg` ×1 | Same job | relock value |
| Shadow, raised card | work card `0 18px 32px -22px pine .28`, Cal `0 20px 60px -20px black .35` | Same job | work-card value |
| Shadow, tape | fg 12%, fg 14% | Same | 12% |
| Disabled | **0.6 (2)**, 0.5 (1) | Same | 0.6 |
| Duration 150 | **150 (19)**, 160 (1) | Same | 150ms (CLAUDE.md §3) |
| Duration 200 | **200 (7)**, 220, 260 | Same | 200ms |
| Duration 300 | **300 (2)**, 320 | Same | 300ms |
| Duration 400 | **400 (4)**, 420 (4), 480 (1) | Same | 400ms |
| Duration 500 | **500 (6)**, 520 (2), 550 (2), 580, 600 | Same | 500ms |
| Duration 650 | **650 (2)**, 700 (2) | Same | 650ms (CSS, so it can be tokenised; the 700s are JS) |
| Duration 900 | **900 (5)**, 1000, 1100 | Same | 900ms |
| Rotation interval | 4500 (carousel), **4800 (nav chip)** | Same job | 4800ms (more read time) |
| Ease, standard | `(0.4,0,0.2,1)` ×5 spellings + Tailwind default | Identical | Tailwind default |
| Ease, out | Tailwind `ease-out` (0,0,0.2,1) ×4; CSS keyword `ease-out` (0,0,0.58,1) ×7 | **Near**, different curves | Tailwind `(0,0,0.2,1)` |
| Ease, emphasized | **(0.22,0.61,0.36,1) ×7**, (.2,.7,.3,1) ×2, (.22,.9,.3,1) ×1 | Same family | (0.22,0.61,0.36,1) |
| Ease, overshoot | **(0.34,1.56,0.64,1) ×2**, (0.2,0.9,0.25,1.15), (0.2,1.4,0.4,1) ×2, (0.2,1.6,0.4,1) | Same family | (0.34,1.56,0.64,1) |
| Breakpoint 768 | `md:` (Tailwind) and four hand-written `max-width: 767px` / `768px` queries | Identical | `--breakpoint-md` |
| Breakpoint ~1100 | 1100px (1), **1104px (1)** | Same, both serve the Cal booker band | 1104px |

---

## 2. Proposed token set

Every token, with what it replaces and how many places change. The same data is in `tokens.json` (`$extensions.meghgupta.replaces / changes / source / visibleChange`).

### 2.1 Colour primitives

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--oatmeal-200` | `#e8dcc6` | #e8dcc6 (--bg, --accent-fg); #E8DCC6 theme-color; text-[#e8dcc6]; inline #e8dcc6 on unlock button | 0 |  | app/globals.css:9,16 |
| `--oatmeal-100` | `#f3ebd9` | #f3ebd9 (--bg-elevated); bg-[#f3ebd9]/85; #f3ebd9 ticket body | 0 |  | app/globals.css:10 |
| `--oatmeal-300` | `#d4c4a8` | #d4c4a8 (--border) | 0 |  | app/globals.css:14 |
| `--pine-900` | `#1f3b2e` | #1f3b2e (--fg, --accent); PINE constant; text-/bg-[#1f3b2e]; #1F4D3A (retired pine, Cal embed) | 0 |  | app/globals.css:11,15 |
| `--pine-700` | `#3a5544` | #3a5544 (--fg-muted) | 0 |  | app/globals.css:12 |
| `--pine-500` | `#556b5d` | #556b5d (--fg-subtle) | 0 |  | app/globals.css:13 |
| `--lilac-300` | `#cbb3e8` | #cbb3e8 (--highlight); rgba(203,179,232,a) x7 | 0 |  | app/globals.css:17 |
| `--lilac-400` | `#b89cdc` | #b89cdc (--highlight-strong) | 0 |  | app/globals.css:18 |
| `--cream-50` | `#fdf7ee` | #fdf7ee (--venn-cream); rgba(253,247,238,0.6) | 0 |  | app/globals.css:24 |

### 2.2 Colour roles (semantic)

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--bg` | `var(--oatmeal-200)` | (no change) | 0 |  | app/globals.css:9 |
| `--bg-elevated` | `var(--oatmeal-100)` | bg-white/95 (timeline tooltip); bg-[#f3ebd9]/85 (relock); #f3ebd9 (ticket body) | 4 | Timeline tooltip turns from white to oat. | app/globals.css:10; experience.tsx:890,902; relock-button.tsx:30; app/unlock/backstage.css:75 |
| `--fg` | `var(--pine-900)` | text-[#1f3b2e] (relock); PINE constant (unlock, 12 uses through one constant) | 2 |  | app/globals.css:11; relock-button.tsx:30; backstage-pass.tsx:13 |
| `--fg-muted` | `var(--pine-700)` | text-slate-600 (tooltip body); opacity-80 text (unlock body) | 2 | Tooltip body and unlock body copy shift to pine. | app/globals.css:12; experience.tsx:891; backstage-pass.tsx:161 |
| `--fg-subtle` | `var(--pine-500)` | text-slate-500 (tooltip date); opacity-60 / opacity-70 text labels (unlock) x7 | 8 | Unlock mono labels become solid pine-500 instead of translucent pine. | app/globals.css:13; experience.tsx:895; backstage-pass.tsx:132,171,297,305,342,348,376 |
| `--border` | `var(--oatmeal-300)` | border-slate-200/70, /80 (tooltip) | 3 |  | app/globals.css:14; experience.tsx:890,894,902 |
| `--border-hairline` | `color-mix(in oklab, var(--border) 70%, var(--highlight) 30%)` | [class*="border-border"] override | 1 | None if Phase 4 confirms the global rule already wins. | app/globals.css:311-313 |
| `--accent` | `var(--pine-900)` | #1F4D3A Cal brand (x2); bg-[#1f3b2e] (relock hover); PINE inline on unlock submit | 4 | Cal booker buttons move from the retired green #1F4D3A to current pine. | app/globals.css:15; cal-embed.tsx:15,16; relock-button.tsx:30; backstage-pass.tsx:250 |
| `--accent-fg` | `var(--oatmeal-200)` | text-[#e8dcc6] (relock hover); #e8dcc6 inline (unlock submit) | 2 |  | app/globals.css:16; relock-button.tsx:30; backstage-pass.tsx:251 |
| `--highlight` | `var(--lilac-300)` | rgba(203,179,232,0 / .22 / .28 / .3) in globals; rgba(203,179,232,.45 / .35) on unlock | 7 |  | app/globals.css:99,100,104,105,231; backstage-pass.tsx:137; app/unlock/backstage.css:169 |
| `--highlight-strong` | `var(--lilac-400)` | (no change) | 0 |  | app/globals.css:18 |
| `--ring-offset` | `var(--bg)` | --tw-ring-offset-color #fff (17 x ring-offset-2) | 17 | Focus-ring gap turns oat instead of white (if the pine ring is the one that renders, Phase 4). | 17 focus-visible:ring-offset-2 sites, see 01 §2.6 |
| `--surface-band` | `var(--cream-50)` | var(--venn-cream) outside the Venn; rgba(253,247,238,0.6) | 1 |  | experience.tsx:656 |

### 2.3 Data-viz colours (hero Venn)

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--venn-user` | `#c1497f` | (no change) | 0 |  | app/globals.css:21; product-venn.tsx:18; product-venn-travel.tsx:36 |
| `--venn-tech` | `#4a72b0` | (no change) | 0 |  | app/globals.css:22; product-venn.tsx:19; product-venn-travel.tsx:37 |
| `--venn-biz` | `#c77e3b` | (no change) | 0 |  | app/globals.css:23; product-venn.tsx:20; product-venn-travel.tsx:38 |
| `--venn-ink` | `var(--cream-50)` | var(--venn-cream) | 0 |  | product-venn.tsx:508; product-venn-travel.tsx:354,763 |

### 2.4 Content colours (third-party and product brands, kept true)

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--brand-linkedin` | `#0a66c2` | #0A66C2 x9 across border, bg, text, ring | 9 |  | nav.tsx:402,462 |
| `--brand-bondscanner` | `#182f8c` | (no change) | 1 |  | work-thumbnails.tsx:22 |
| `--brand-ultra` | `#171513` | (no change) | 1 |  | work-thumbnails.tsx:26 |
| `--brand-moveinsync` | `#3dae2b` | (no change) | 1 |  | work-thumbnails.tsx:30 |
| `--brand-moveinsync-ink` | `#10240e` | (no change) | 1 |  | work-thumbnails.tsx:30 |

### 2.5 Font families

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--font-sans` | `var(--font-geist-sans), Arial, Helvetica, sans-serif` | (no change) | 0 |  | app/layout.tsx:12-16; app/globals.css:43,74 |
| `--font-display` | `var(--font-sans)` | font-serif (resolves to Geist Sans) x14 | 14 |  | app/globals.css:42; 14 font-serif sites, see 01 §2.2a |
| `--font-mono` | `var(--font-geist-mono), ui-monospace, monospace` | (no change) | 0 |  | app/layout.tsx:18-22; app/globals.css:44 |
| `--font-hand` | `var(--font-kalam), cursive` | `style={{fontFamily: "var(--font-hand), cursive"}}` x3 sites | 3 | None. Requires renaming the next/font variable to --font-kalam (app/layout.tsx:27). | app/globals.css:45; experience.tsx:16; hero.tsx:56; backstage-pass.tsx:145 |

### 2.6 Font weights

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--weight-regular` | `400` | (no change) | 0 |  | browser default |
| `--weight-medium` | `500` | (no change) | 0 |  | nav.tsx:170; case-study/primitives/eyebrow.tsx:21; experience.tsx:973; backstage-pass.tsx:248 |
| `--weight-semibold` | `600` | (no change) | 0 |  | experience.tsx:248,348,750,951; work-thumbnails.tsx:316; app/work/[slug]/page.tsx:46; backstage-pass.tsx:152,345 |
| `--weight-bold` | `700` | (no change) | 0 |  | backstage-pass.tsx:316,325,359 |

### 2.7 Font sizes

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--text-micro` | `0.625rem` | text-[10px] x7; text-[0.6rem] 9.6px x5; text-[0.65rem] 10.4px x2; 0.58rem 9.28px x1; text-[0.68rem] 10.88px x1 | 16 | Unlock labels move to 10px (from 9.6 and 10.4px); About tip kicker grows 0.7px; relock pill shrinks 0.9px. | see 01 §2.2b and §4.3 |
| `--text-label` | `0.75rem` | text-xs x18; text-[11px] x4; text-[12px] x1 | 5 | 11px dates and stack pills grow to 12px. | see 01 §2.2b |
| `--text-small` | `0.875rem` | text-sm x28; 0.8125rem (13px) About tip body x1 | 1 |  | about-collage.css:602 |
| `--text-body-compact` | `0.9375rem` | text-[15px] x2; 0.9375rem x1; text-[0.95rem] 15.2px x1 | 4 |  | experience.tsx:325,891; about-collage.css:688; backstage-pass.tsx:161 |
| `--text-body` | `1rem` | text-base x8 | 0 |  |  |
| `--text-lead` | `1.125rem` | text-lg x8 | 0 |  |  |
| `--text-title-sm` | `1.25rem` | text-xl x4 | 0 |  |  |
| `--text-title` | `1.5rem` | text-2xl x7 | 0 |  |  |
| `--text-h3` | `1.75rem` | text-[1.75rem] x3 | 3 |  | app/work/[slug]/page.tsx:46; case-study/layouts/markdown-h2.tsx:23; case-study/layouts/section.tsx:55 |
| `--text-h2-sm` | `1.875rem` | text-3xl x7 | 0 |  |  |
| `--text-h2` | `2.25rem` | text-[2.25rem] x5 (identical to text-4xl); text-4xl x3; text-[2.5rem] 40px x1 (single use) | 6 | Experience role H3 at md+ drops from 40px to 36px. | see 01 §2.2b |
| `--text-h1` | `3rem` | text-[3rem] x2 (identical to text-5xl); text-5xl x3; text-[3.25rem] 52px x1 (hero lg only) | 3 | Hero H1 at 1024px+ drops from 52px to 48px. **Approved by Megh.** | contact.tsx:12; hero.tsx:64 |
| `--text-display` | `4rem` | text-[4rem] x1 | 1 |  | contact.tsx:12 |

### 2.8 Heading roles (responsive pairs)

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--role-display` | `var(--text-h2) → `md:` var(--text-h1)` | hero 36/48/52; case study 36/48 | 2 |  | hero.tsx:64; app/work/[slug]/page.tsx:105 |
| `--role-section` | `var(--text-h2-sm) → `md:` var(--text-h1)` | (no change) | 1 |  | section-header.tsx:18 |
| `--role-article` | `var(--text-h3) → `md:` var(--text-h2)` | (no change) | 3 |  | case-study/layouts/section.tsx:55; markdown-h2.tsx:23; app/work/[slug]/page.tsx:46 |
| `--role-contact` | `var(--text-h1) → `md:` var(--text-display)` | (no change) | 1 |  | contact.tsx:12 |

### 2.9 Line heights

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--leading-none` | `1` | leading-none x4; leading-[1] x1; leading-[0.95] x1 (unlock H1) | 2 |  | hero.tsx:55; backstage-pass.tsx:152 |
| `--leading-display` | `1.05` | leading-[1.05] x2; leading-[1.08] x1 (hero) | 3 | Hero H1 lines sit about 1.4px closer at 48px. | contact.tsx:12; experience.tsx:319; hero.tsx:64 |
| `--leading-heading` | `1.1` | leading-[1.1] x1; line-height: 1.1 x1 | 2 |  | section-header.tsx:18; about-collage.css:449 |
| `--leading-tight` | `1.25` | leading-tight x8 | 0 |  |  |
| `--leading-snug` | `1.375` | leading-snug x3; leading-[1.4] x1; line-height: 1.45 x1 | 2 |  | experience.tsx:348; about-collage.css:603 |
| `--leading-body` | `1.6` | leading-relaxed 1.625 x10; leading-[1.6] x2; leading-[1.5] x1; line-height: 1.65 x1; leading-[1.7] x1 | 15 | Case-study prose tightens 0.4px per line at 16px. Entry-detail body tightens from 1.7. | see 01 §2.2d |

### 2.10 Letter spacing

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--tracking-display` | `-0.025em` | tracking-tight x5; -0.03em x1 (About title) | 1 |  | about-collage.css:450 |
| `--tracking-display-tight` | `-0.04em` | tracking-[-0.04em] x1; -0.045em x1 (unlock H1) | 2 |  | work-thumbnails.tsx:316; backstage-pass.tsx:155 |
| `--tracking-mono` | `0.05em` | tracking-wider x12; tracking-wide 0.025em x1 | 1 |  | experience.tsx:895 |
| `--tracking-label` | `0.2em` | 0.15em x1; 0.16em x3; 0.18em x2; 0.2em x4 | 10 | Small. 'View all' and card eyebrows widen from 0.16em. | see 01 §2.2e and §4.3 |
| `--tracking-eyebrow` | `0.24em` | 0.24em x2; 0.25em x2; 0.3em x3 (unlock) | 7 | Unlock brand and stub labels tighten from 0.3em. | section-header.tsx:14; case-study/primitives/eyebrow.tsx:24; backstage-pass.tsx:132,171,342,348,376 |

### 2.11 Spacing and layout

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--spacing` | `0.25rem` | (no change) | 0 |  | node_modules/tailwindcss/theme.css:325 |
| `--gutter` | `1.5rem → `md:` 2rem` | px-6 md:px-8 x6 page shells | 0 |  | hero.tsx:34; experience.tsx:25; selected-work-shelf.tsx:13; contact.tsx:9; site-footer.tsx:77; app/work/[slug]/page.tsx:80 |
| `--section-y` | `6rem → `md:` 8rem` | py-24 md:py-32 x3 | 0 |  | experience.tsx:25; selected-work-shelf.tsx:13; app/work/[slug]/page.tsx:80 |
| `--scroll-offset` | `80px` | scroll-mt-16 64px x1; scroll-mt-24 96px x2; scroll-margin-top: 80px x1 | 4 | None if Phase 4 confirms the global 80px already wins. | contact.tsx:9; case-study/layouts/markdown-h2.tsx:23; case-study/layouts/section.tsx:46; app/globals.css:316 |
| `--hero-avatar-gap` | `1rem` | gap-4; md:gap-[18px] x1 | 1 | 2px narrower at md+. | hero.tsx:45 |

### 2.12 Containers

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--container-content` | `64rem` | max-w-5xl x4 | 0 |  | contact.tsx:11; experience.tsx:27; hero.tsx:38; site-footer.tsx:78 |
| `--container-wide` | `72rem` | max-w-6xl x3 | 0 |  | app/work/[slug]/page.tsx:84; nav.tsx:335; selected-work-shelf.tsx:15 |
| `--container-prose` | `46rem` | max-w-[46rem] x1 | 1 |  | app/work/[slug]/page.tsx:82 |
| `--container-rail` | `15.5rem` | grid col 15.5rem x1 | 1 |  | app/work/[slug]/page.tsx:84 |

### 2.13 Radius

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--radius-focus` | `2px` | border-radius: 2px x1 | 1 |  | app/globals.css:232 |
| `--radius-sm` | `0.25rem` | rounded-sm x3 | 0 |  |  |
| `--radius-md` | `0.375rem` | rounded-md x6; 7px drag ghost x1 | 1 |  | product-venn-travel.tsx:352 |
| `--radius-lg` | `0.5rem` | rounded-lg x5 | 0 |  |  |
| `--radius-xl` | `0.75rem` | rounded-xl x7; border-radius: 10px x1 (stamp) | 1 |  | app/unlock/backstage.css:177 |
| `--radius-2xl` | `1rem` | rounded-2xl x3; rounded-[18px] x1 (tooltip); 18px ticket corners x4 | 5 | Tooltip and ticket corners 2px tighter. | experience.tsx:890; app/unlock/backstage.css:99,113,139,152 |
| `--radius-card` | `1.75rem` | rounded-[1.75rem] x4 | 4 |  | work-thumbnails.tsx:295,310,321,343 |
| `--radius-full` | `9999px` | rounded-full x31; 999px hero dot x1 | 1 |  | hero-link.tsx:35 |

### 2.14 Border widths

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--border-width-hairline` | `1px` | border, border-[side], divide x46 | 0 |  |  |
| `--border-width-strong` | `2px` | ring-2 x19; outline 2px x2; border-b-2 x1; decoration 2px x1; 2px dashed x2 | 0 |  |  |
| `--border-width-bar` | `4px` | border-l-4 x3; 4px double x1; ring-4 x1 | 0 |  |  |

### 2.15 Shadows

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--shadow-xs` | `0 1px 0 color-mix(in srgb, var(--fg) 12%, transparent)` | fg 12%; fg 14% | 2 |  | about-collage.css:357,439 |
| `--shadow-sm` | `0 2px 8px rgba(31, 59, 46, 0.18)` | hero drop-shadow (same value); Tailwind shadow-sm (black 10%) x3 | 4 | Nav pill and chips get a pine-tinted shadow instead of grey. | hero.tsx:24; nav.tsx:360,374; experience.tsx:741 |
| `--shadow-md` | `0 10px 30px -12px rgba(31, 59, 46, 0.45)` | relock (same value); Tailwind shadow-md x2; Tailwind shadow-lg x1 (unlock hover); tooltip 0 12px 28px -10px slate .18; drag ghost 0 14px 28px -16px fg 50%; unlock submit 0 10px 24px -10px pine .6 | 7 | Timeline tooltip shadow gets noticeably stronger (0.18 to 0.45 alpha). **Approved by Megh.** | relock-button.tsx:30; nav.tsx:360; experience.tsx:741,890; product-venn-travel.tsx:361-362; backstage-pass.tsx:248,252 |
| `--shadow-lg` | `0 18px 32px -22px rgba(31, 59, 46, 0.28)` | work card (same value); Cal card 0 20px 60px -20px black .35 | 2 | Cal booker shadow shrinks and turns pine. | work-thumbnails.tsx:321; cal-embed.tsx:25 |
| `--shadow-focus` | `0 0 0 4px color-mix(in srgb, var(--highlight) 30%, transparent)` | rgba(203,179,232,0.3) | 1 |  | app/globals.css:231 |

### 2.16 Opacity

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--opacity-hover` | `0.9` | hover:opacity-90 x5 | 0 |  |  |
| `--opacity-disabled` | `0.6` | disabled:opacity-60 x2; disabled:opacity-50 x1 | 1 |  | backstage-pass.tsx:248 |

### 2.17 Z-index

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--z-behind` | `-1` | z-index: -1 x4 | 4 |  | app/globals.css:108,129,192; about-collage.css:475 |
| `--z-raised` | `20` | z-20 x1 | 0 |  | work-thumbnails.tsx:295 |
| `--z-menu` | `40` | z-40 x1 | 0 |  | nav.tsx:441 |
| `--z-nav` | `50` | z-50 x2 | 0 |  | nav.tsx:321; app/layout.tsx:195 |
| `--z-floating` | `60` | z-[60] x1; zIndex 60 x1 | 2 |  | relock-button.tsx:14; hero-link.tsx:31 |
| `--z-tooltip` | `70` | z-[70] x1 | 1 |  | experience.tsx:881 |
| `--z-drag` | `80` | zIndex 80 x1 | 1 |  | product-venn-travel.tsx:343 |

### 2.18 Durations

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--duration-fast` | `150ms` | duration-150 x19; 160ms tooltip x1 | 1 |  | experience.tsx:887 |
| `--duration-base` | `200ms` | duration-200 x5; 200 JS arrowheads x2; 220 tilt x1; 260 ink dot x1 | 4 |  | app/unlock/backstage.css:41,237 |
| `--duration-moderate` | `300ms` | duration-300 x2; 320 hinge close x1 | 1 |  | work-thumbnails.tsx:255 |
| `--duration-slow` | `400ms` | 400 x4 (incl. duration-[400ms] x2); 420 x4 (carousel, chips, stamp x2); 480 x1 | 9 |  | work-thumbnails.tsx:160; product-venn.tsx:253; app/unlock/backstage.css:179,183; product-venn-travel.tsx:437 |
| `--duration-slower` | `500ms` | duration-500 x3; 500 CSS/JS x3; 520 x2; 550 x2; 580 x1; 600 x1 | 9 |  | product-venn-travel.tsx:391,466,85; app/unlock/backstage.css:47,225; product-venn.tsx:265 |
| `--duration-emphasis` | `650ms` | 650 x2; 700 x2 | 4 |  | product-venn.tsx:270; product-venn-travel.tsx:483 |
| `--duration-scene` | `900ms` | 900 x5; 1000 x1; 1100 x1 | 7 |  | product-venn-travel.tsx:426; hero-link.tsx:74 |
| `--interval-rotate` | `4800ms` | 4800 nav chip; 4500 carousel | 2 | Carousel advances 0.3s slower. | work-thumbnails.tsx:77 |

### 2.19 Easing

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | (.4,0,.2,1) x4 in Venns; [0.4,0,0.2,1] hinge close | 5 |  | product-venn.tsx:218,310; product-venn-travel.tsx:428,485; work-thumbnails.tsx:255 |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Tailwind ease-out x4; CSS keyword ease-out x7 (different curve: 0,0,.58,1) | 7 |  | experience.tsx:887; product-venn.tsx:230,320,329; product-venn-travel.tsx:439,495; app/unlock/backstage.css:41 |
| `--ease-emphasized` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | same value x7 (ease-[...] x4, CSS x3); (.2,.7,.3,1) x2; (.22,.9,.3,1) x1 | 10 |  | product-venn.tsx:255; product-venn-travel.tsx:509,392 |
| `--ease-overshoot` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | same value x2; (0.2,0.9,0.25,1.15) x1; (0.2,1.4,0.4,1) x2; (0.2,1.6,0.4,1) x1 | 6 |  | app/unlock/backstage.css:10,179,183,237 |
| `--ease-in` | `ease-in` | ease-in x3; (0.55,0,0.75,0.4) tear x1 | 4 |  | app/unlock/backstage.css:207 |
| `--spring-hinge` | `{ stiffness: 400, damping: 30, mass: 1 }` | (no change) | 0 |  | work-thumbnails.tsx:246-251 |

### 2.20 Breakpoints

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--breakpoint-sm` | `40rem` | (no change) | 0 |  | theme.css:327 |
| `--breakpoint-md` | `48rem` | @media (max-width: 767px) x4; (min-width: 768px) x1 | 4 |  | about-collage.css:622,654; app/unlock/backstage.css:127,215 |
| `--breakpoint-lg` | `64rem` | (max-width: 1023px) x1 | 0 |  | about-collage.css:622 |
| `--breakpoint-xl` | `80rem` | (no change) | 0 |  | theme.css:330 |
| `--breakpoint-nav-chip` | `53.75rem` | min-[860px] | 1 |  | nav.tsx:170 |
| `--breakpoint-booker` | `69rem` | min-[1104px]; min-[1100px] x1 | 2 | Contact copy break moves from 1100 to 1104px. | contact.tsx:19,28 |

### 2.21 Lock-flow colours (`/unlock` only, approved exceptions)

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--status-danger` | `#b23a48` | DENIED_INK constant | 1 |  | backstage-pass.tsx:14 (used :197,279,317) |
| `--ticket-stub` | `var(--bg)` | #ece1ca | 1 | Stub darkens by about 2% luminance. Check in Phase 4. | app/unlock/backstage.css:114 |
| `--sky-1` | `#b7cde1` | (no change) | 1 |  | cloud-background.tsx:36 |
| `--sky-2` | `#ccdae7` | (no change) | 0 |  | cloud-background.tsx:36 |
| `--sky-3` | `#e3dfcf` | (no change) | 0 |  | cloud-background.tsx:36 |
| `--sky-4` | `#f1e6ce` | (no change) | 0 |  | cloud-background.tsx:36 |
| `--sky-5` | `#f6ecd1` | (no change) | 0 |  | cloud-background.tsx:36 |
| `--sky-glow` | `rgba(255, 239, 200, 0.85)` | (no change) | 1 |  | cloud-background.tsx:37 |
| `--sky-cloud` | `#ffffff` | #FFFFFF x6 | 6 |  | cloud-background.tsx:67-71 |
| `--sky-cloud-shadow` | `#d5dbe3` | (no change) | 1 |  | cloud-background.tsx:38 |

### 2.22 Island mapping: AI Call pipeline iframe (proposed)

| Token | Value | Replaces (as built) | Edits | Visible change | Source |
|---|---|---|---:|---|---|
| `--pipeline-bg` | `var(--bg-elevated)` | #ffffff | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-surface` | `var(--bg)` | #fafafa | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-surface-2` | `var(--bg-elevated)` | #ffffff | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-surface-3` | `var(--bg)` | #f3f3f5 | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-border` | `var(--border)` | rgba(0,0,0,0.08) | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-border-strong` | `var(--fg-subtle)` | rgba(0,0,0,0.22) | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-text` | `var(--fg)` | #0a0a0a | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-text-muted` | `var(--fg-muted)` | #666666 | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-text-faint` | `var(--fg-subtle)` | #999999 | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-accent` | `var(--accent)` | #635bff | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-accent-soft` | `color-mix(in srgb, var(--highlight) 45%, transparent)` | rgba(99,91,255,0.12) | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-accent-glow` | `color-mix(in srgb, var(--highlight) 30%, transparent)` | rgba(99,91,255,0.3) | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-node-bg` | `var(--bg-elevated)` | #ffffff | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-node-active-bg` | `color-mix(in srgb, var(--highlight) 22%, transparent)` | rgba(99,91,255,0.06) | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-node-dim` | `color-mix(in srgb, var(--fg) 4%, transparent)` | rgba(0,0,0,0.04) | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-success` | `PENDING: Phase 3 decision` | #16a34a | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |
| `--pipeline-warning` | `PENDING: Phase 3 decision` | #d97706 | 1 |  | public/artifacts/ai-call-pipeline.html:10-28 |

---

## 3. Visible changes that need your approval

Adopting the set is invisible **except** for these. Each one comes from folding a near-duplicate onto its canonical value.

| # | Token | What a visitor would notice |
|---:|---|---|
| V1 | `--bg-elevated` | Timeline tooltip turns from white to oat. |
| V2 | `--fg-muted` | Tooltip body and unlock body copy shift to pine. |
| V3 | `--fg-subtle` | Unlock mono labels become solid pine-500 instead of translucent pine. |
| V4 | `--accent` | Cal booker buttons move from the retired green #1F4D3A to current pine. |
| V5 | `--ring-offset` | Focus-ring gap turns oat instead of white (if the pine ring is the one that renders, Phase 4). |
| V6 | `--ticket-stub` | Stub darkens by about 2% luminance. Check in Phase 4. |
| V7 | `--text-micro` | Unlock labels move to 10px (from 9.6 and 10.4px); About tip kicker grows 0.7px; relock pill shrinks 0.9px. |
| V8 | `--text-label` | 11px dates and stack pills grow to 12px. |
| V9 | `--text-h2` | Experience role H3 at md+ drops from 40px to 36px. |
| V10 | `--text-h1` | Hero H1 at 1024px+ drops from 52px to 48px. **Approved by Megh.** |
| V11 | `--leading-display` | Hero H1 lines sit about 1.4px closer at 48px. |
| V12 | `--leading-body` | Case-study prose tightens 0.4px per line at 16px. Entry-detail body tightens from 1.7. |
| V13 | `--tracking-label` | Small. 'View all' and card eyebrows widen from 0.16em. |
| V14 | `--tracking-eyebrow` | Unlock brand and stub labels tighten from 0.3em. |
| V15 | `--hero-avatar-gap` | 2px narrower at md+. |
| V16 | `--radius-2xl` | Tooltip and ticket corners 2px tighter. |
| V17 | `--shadow-sm` | Nav pill and chips get a pine-tinted shadow instead of grey. |
| V18 | `--shadow-md` | Timeline tooltip shadow gets noticeably stronger (0.18 to 0.45 alpha). **Approved by Megh.** |
| V19 | `--shadow-lg` | Cal booker shadow shrinks and turns pine. |
| V20 | `--interval-rotate` | Carousel advances 0.3s slower. |
| V21 | `--breakpoint-booker` | Contact copy break moves from 1100 to 1104px. |

I'd be most careful with **V11** (hero H1 loses its 52px desktop step) and **V18** (the tooltip shadow gets much stronger). Both are small rule-driven folds with a big visual effect. If you'd rather keep either one, the honest move is to make it a named token with one use, not to keep the arbitrary value.

---

## 4. Deliberately not tokenised (component-internal)

These values are real but belong to one component's own geometry or choreography. Making them global tokens would add names without adding reuse.

| Component | Values | Where | Why internal |
|---|---|---|---|
| About collage | paper paddings (`0.42rem 0.4rem 0.5rem` and 8 more), clip-path polygons, strip heights 1.35 / 1.7rem, float 4.2 to 6.4s, photo positions | `about-collage.css`, `about-collage.tsx:84-160` | The irregular values are the point (torn paper) |
| Venn diagrams | viewBox geometry, chip `rx 7`, font sizes 14.5 / 36 / 30 / 24 / 28 units, intro choreography (start, stagger, marker times) | `product-venn.tsx`, `product-venn-travel.tsx` | SVG units scale with the drawing, not the page |
| Hero dot | hold 480, flight 1100, delay 600, bow 72 | `hero-link.tsx:73-75,135-140` | Single choreography |
| Work-card hinge | perspective 1500, rotateY -35°, slab tilt 4°, spring 400 / 30 / 1 (documented as `spring-hinge`) | `work-thumbnails.tsx:246-325` | Single choreography |
| Desktop timeline | lane height 68, min-width 780, tooltip width 280, gap / edge 12 | `experience.tsx:641-649,863-865` | Layout math |
| Unlock ticket | notch 14px, three-layer drop shadow, stamp scale 2.4 and rotation, shake keyframes, barcode bars | `app/unlock/backstage.css`, `backstage-pass.tsx` | Lock-flow choreography |
| Card one-liner | `leading-5` paired with `h-10` for a 2-line clamp | `work-thumbnails.tsx:361` | The two values only work together |
| Cal booker | `min-height 560px`, `max-w-[1000px]` / `[1040px]` | `cal-embed.tsx:29`, `contact.tsx:28` | Driven by Cal's own breakpoints |

---

## 5. Decisions carried into Phase 3

| # | Decision | Options |
|---|---|---|
| D1 | Approve, reject or keep-as-named each visible change V1 to V21 (§3) | per row |
| D2 | `@theme` type scale (`app/globals.css:47-58`, 0 uses, CLAUDE.md §3 nominal sizes) | (a) replace its values with §2.7 as-built sizes so `text-h1` etc. become real; (b) delete it; (c) keep CLAUDE.md sizes and migrate the code to them (large visual change) |
| D3 | AI Call iframe status colours (`--success` green, `--warning` amber) | (a) approve a diagram-only status pair; (b) express status with pine shades + icons |
| D4 | `font-serif` → `font-display` rename (14 edits) | (a) rename; (b) keep `font-serif` as the alias (0 edits, misleading name) |
| D5 | `--font-hand` fix | Rename the next/font variable to `--font-kalam` (`app/layout.tsx:27`), then the token works and 3 inline styles go away |

Phase 4 still verifies the rendered values behind `--border-hairline`, `--scroll-offset` and the focus ring before any of these migrate.
