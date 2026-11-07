# 02 · Components

> Phase 2 component reference. Facts (anatomy, variants, states, mobile) come from `01-inventory.md` §3 and §4, which carry the file:line citations. Token names come from `02-tokens.md`. A usage rule marked *(proposed)* is a recommendation; unmarked rules restate what the code or a code comment already does.
>
> Mobile is listed first in every component because about 60% of visitors are on phones (CLAUDE.md §1). "Computed" tap heights come from padding + line height + border and get measured in Phase 4.

## Index

| # | Component | File | Routes |
|---|---|---|---|
| 1 | [Buttons](#1-buttons) (primary pill, outline pill, icon button, ghost icon, segmented control) | several | all |
| 2 | [Text link](#2-text-link) | several | all |
| 3 | [Nav](#3-nav) + status chip + mobile menu | `components/nav.tsx` | v3, v3.1 |
| 4 | [Hero](#4-hero) | `components/hero.tsx` | v3, v3.1 |
| 5 | [Product Venn](#5-product-venn) (static, travel) | `components/product-venn.tsx`, `product-venn-travel.tsx`, `hero-link.tsx` | v3, v3.1 |
| 6 | [Section header + eyebrow](#6-section-header-and-eyebrow) | `components/section-header.tsx`, `case-study/primitives/eyebrow.tsx` | all |
| 7 | [Highlighter mark](#7-highlighter-mark) | `app/globals.css:114-217`, `about-collage.css:465-481` | all |
| 8 | [Logo tile, avatar, current dot](#8-logo-tile-avatar-current-dot) | `components/experience.tsx`, `hero.tsx` | v3, v3.1 |
| 9 | [Tags and pills](#9-tags-and-pills) | several | all |
| 10 | [Experience](#10-experience) (list, timeline, detail card, tooltip) | `components/experience.tsx` | v3, v3.1 |
| 11 | [Work card and shelf](#11-work-card-and-shelf) | `components/work-thumbnails.tsx`, `selected-work-shelf.tsx` | v3, v3.1, case study |
| 12 | [About collage](#12-about-collage) | `components/about-collage.tsx`, `.css` | v3, v3.1 |
| 13 | [Contact fold + booker](#13-contact-fold-and-booker) | `components/contact.tsx`, `cal-embed.tsx` | v3, v3.1 |
| 14 | [Footer](#14-footer) | `components/site-footer.tsx` | v3, v3.1 |
| 15 | [Relock pill](#15-relock-pill) | `components/relock-button.tsx` | all locked pages |
| 16 | [Case-study shell](#16-case-study-shell) (header, index, headline metric, prose, keep reading) | `app/work/[slug]/page.tsx`, `case-study/case-study-toc.tsx` | case study |
| 17 | [Case-study blocks](#17-case-study-blocks) (Section, Callout, DataTable, Metric, StepGrid, Timeline, Embed frame) | `components/case-study/*` | case study |
| 18 | [Backstage pass](#18-backstage-pass-unlock) (ticket, password field, submit, status, stamps) | `components/backstage-pass.tsx`, `app/unlock/backstage.css` | `/unlock` |

---

## 1. Buttons

Five button patterns exist. None is a shared component; each is a class string repeated at its call site.

### 1a. Primary pill

| | |
|---|---|
| **Anatomy** | Label + optional trailing glyph or icon (→, download, arrow). `rounded-full`, pine fill, oat text. |
| **Sizes** | **L** `px-6 py-3 text-sm` (hero CTA, `hero.tsx:83`; unlock submit, `backstage-pass.tsx:248`). **M** `px-4 py-2 text-sm` (nav Resume, `nav.tsx:413`). **L-mobile** `px-6 py-3 text-base` (mobile-menu Resume, `nav.tsx:473`). **M-alt** `px-5 py-2.5` (case-study coming-soon CTA, not rendered on AI Call). |
| **States** | Hover `opacity: var(--opacity-hover)` (0.9), 150ms. Focus: pine `ring-2` + `ring-offset-2` (which ring renders is Phase 4 Q2). Unlock submit adds hover lift + shadow, **loading** (spinner + "Checking…"), **success** ("Welcome in"), **disabled** (`opacity` 0.5 → `--opacity-disabled`). No pressed / active state anywhere. |
| **Mobile** | Hero CTA computed 44px tall. Nav Resume is hidden below `md`; the menu shows the L-mobile size (computed 48px). |
| **Tokens** | `--accent`, `--accent-fg`, `--radius-full`, `--text-small`, `--opacity-hover`, `--duration-fast`, `--shadow-md` (unlock) |
| **Usage rule** | One primary pill per fold. It is the only filled-pine control, so it always means "the main thing to do here". *(proposed)* Build it once as a shared component with `size="m" | "l"` and `state` props; today it is copied 5 times with drifting padding. |

### 1b. Outline pill

| | |
|---|---|
| **Anatomy** | Mono uppercase label, 1px pine border, `rounded-full`, `px-4 py-2 text-xs tracking-[0.16em]`. |
| **Where** | "View all" in the section header (`section-header.tsx:24`). One use. |
| **States** | Hover inverts to pine fill with oat text (150ms). Focus: global rule only (no component classes). |
| **Mobile** | Computed 34px tall, under the 44px target. |
| **Tokens** | `--fg`, `--accent-fg`, `--text-label`, `--tracking-label`, `--radius-full` |
| **Usage rule** | Secondary navigation out of a fold ("see more"). Never next to a primary pill doing the same job. |

### 1c. Icon button (circle)

| | |
|---|---|
| **Anatomy** | Square hit area, `rounded-full`, centred glyph or SVG. |
| **Variants** | **Brand** (LinkedIn): 36px desktop / 44px menu, LinkedIn-blue border and icon, fills blue on hover (`nav.tsx:402,462`). **Outline** (carousel arrows): 40px, `border-border`, `hover:bg-bg-elevated`, glyphs `←` `→` (`work-thumbnails.tsx:225-240`). **Ghost** (footer socials): 40px, no border, `text-fg-subtle hover:text-fg` (`site-footer.tsx:89`). |
| **States** | Hover as above. Focus: pine ring on LinkedIn desktop and footer; global rule only on carousel arrows and the menu LinkedIn. |
| **Mobile** | 40px (arrows, footer, hamburger) and 36px (desktop LinkedIn, hidden on phones) are under 44px. The menu LinkedIn is 44px. |
| **Tokens** | `--border`, `--bg-elevated`, `--fg-subtle`, `--brand-linkedin`, `--radius-full` |
| **Usage rule** | Every icon button carries an `aria-label` (all in scope do). *(proposed)* One size, 44px, everywhere a thumb can reach it. |

### 1d. Hamburger

40px `rounded-md` ghost button, mono glyph `☰` / `✕`, `aria-expanded`, `aria-controls="mobile-menu"`, pine focus ring (`nav.tsx:423-434`). Phones only.

### 1e. Segmented control

| | |
|---|---|
| **Anatomy** | Pill track (`rounded-full border bg-bg-elevated p-1 font-mono text-xs`) holding 2+ buttons (`rounded-full px-3 py-1.5`). |
| **Where** | Experience view toggle "list / timeline" (`experience.tsx:51-87`); TapInvest product tabs (`experience.tsx:412-433`). |
| **States** | Active: `bg-fg text-bg` (inverted). Idle: `text-fg-muted hover:text-fg`. Focus: pine ring. ARIA: `role="tablist"` / `role="tab"` / `aria-selected`. |
| **Mobile** | Computed 28px tall per segment. Sits under the section H2 (header stacks). |
| **Tokens** | `--bg-elevated`, `--border`, `--fg`, `--bg`, `--fg-muted`, `--text-label`, `--radius-full` |
| **Usage rule** | Switches between views of the **same** content. Not for navigation. |

---

## 2. Text link

| | |
|---|---|
| **Variants** | **Prose link**: underlined, offset 4px, inherits colour (`[&_a]` in the case-study article, `app/work/[slug]/page.tsx:46`). **Accent link**: `text-accent` + 40% pine underline that goes solid on hover (`experience.tsx:389,1009`). **Reveal link**: no underline until hover (company names, `experience.tsx:256`; product link `:439`). **Back link**: `text-sm text-fg-muted underline` + `←` (`page.tsx:97`). **On-pine link**: oat underline at 50% (`contact.tsx:36`). |
| **States** | A global rule adds a 2px lilac underline at offset 4px on hover for every link inside `main`, `nav` or `footer` (`app/globals.css:236-242`). How it interacts with each link's own hover is Phase 4 Q3. Focus: pine ring on back link, company name and timeline chip; global rule elsewhere. |
| **Mobile** | Inline links are text-height (computed ≈ 20px). The back link is the only way off a case-study page (no nav there). |
| **Tokens** | `--fg`, `--accent`, `--highlight-strong`, `--border-width-strong`, `--accent-fg` |
| **Usage rule** | Links read as links at rest: underline or accent colour, never colour alone. External links use `target="_blank" rel="noopener noreferrer"` (all in scope do) and an `↗` when inline. |

---

## 3. Nav

| | |
|---|---|
| **Anatomy** | Sticky transparent bar (`z-nav` 50, 64px / 72px at `md`), 3-column grid in `--container-wide`. Left: **status chip**. Centre: **section pill** (desktop). Right: **LinkedIn + Resume** (desktop). Phones: **hamburger** in column 3. |
| **Variants** | `hide` prop drops sections; v3 and v3.1 hide Lab and Writing, so the pill shows Experience, Work, About, Contact. |
| **Status chip** | Pill that rotates 4 lines every `--interval-chip` (4.8s) with a 500ms slide; the 4th line ("Let's connect.") is a pine CTA with an arrow that jumps to `#connect`; the others scroll to top. Width eases to the text. Pauses on hover, focus, hidden tab and reduced motion. |
| **Section pill** | Icon + label tabs, scroll-spy active state (`bg-bg text-fg shadow-sm`), `shadow-sm` → `shadow-md` once collapsed. |
| **States** | **Collapsed** after 80px scroll (unless hovered / focused): chip and right CTAs fade and slide out, `tabIndex -1`. **Menu open**: full-screen oat sheet (`z-menu` 40) under the bar, body scroll locked, `Esc` closes. |
| **Mobile** | Chip visible at the left; hidden 768 to 859px (`--breakpoint-nav-chip`); back from 860. After 80px of scroll only the hamburger remains. Menu links are text-height (computed 28px), icons 20px, Resume 48px, LinkedIn 44px. |
| **Tokens** | `--container-wide`, `--bg-elevated`, `--border`, `--fg`, `--fg-muted`, `--accent`, `--shadow-sm`, `--shadow-md`, `--z-nav`, `--z-menu`, `--duration-slow`, `--ease-emphasized`, `--interval-chip` |
| **Usage rule** | Nav items mirror the fold order and names (CLAUDE.md §14). Case-study pages render **no nav** today; the back link is the only route home. |

---

## 4. Hero

| | |
|---|---|
| **Anatomy** | Avatar (44 / 56px) + Kalam greeting → three-line H1 with three highlighted words → primary pill CTA → Venn. |
| **Variants** | Default (v3): static Venn. `link="travel"` (v3.1): travel Venn + flying pine dot. |
| **Type** | H1 `role-display` 36 → 48 (→ 52 at `lg` today; V10). Greeting 30 → 36, Kalam, pine. |
| **States** | Load: highlighter sweeps under "features", "products", "systems" at 400 / 580 / 760ms. Reduced motion: marks drawn, no sweep. |
| **Mobile** | One column below `lg`: text, then Venn full width. `px-6 py-20`. |
| **Tokens** | `--gutter`, `--container-content`, `--role-display`, `--leading-display`, `--tracking-display`, `--font-hand`, `--accent`, `--shadow-sm` (avatar), `--hero-avatar-gap` |
| **Usage rule** | Fold 1 job: hook (CLAUDE.md §14). One CTA. The three highlighted words are the only highlight marks in the fold. |

---

## 5. Product Venn

| | |
|---|---|
| **Anatomy** | SVG, viewBox 1200 × 940: three rings (User, Technology, Business), three zone labels, 23 skill chips, pine marker + arrow + "I'm here" label. |
| **Variants** | **Static** (v3): rings draw, chips pop in, marker bounces, arrow draws; then chips float. **Travel** (v3.1): same drawing; hover a chip to dim the other zones (0.35) and thicken its ring; **drag** a chip anywhere and it springs home; the marker waits for the hero dot to land. |
| **States** | Hover (travel), drag (travel), reduced motion (final frame, no float). |
| **Mobile** | Scales to the column width. Type is in drawing units, so chips render far smaller on a phone (Phase 4 Q5 measures). Travel chips set `touch-action: none`, so a finger that lands on a chip drags it instead of scrolling the page. |
| **Tokens** | `--venn-user`, `--venn-tech`, `--venn-biz`, `--venn-ink`, `--fg`, `--accent`, `--font-display`, `--font-mono`, `--ease-overshoot`, `--ease-standard`, `--z-drag` |
| **Usage rule** | The Venn trio is the site's only data-viz palette and appears **only** here (confirmed by Megh). Never reuse the three colours as UI accents. |

---

## 6. Section header and eyebrow

| | |
|---|---|
| **Anatomy** | Mono uppercase **eyebrow** (with a highlighter mark) → **H2** → optional **action** (outline pill), right-aligned on desktop. |
| **Eyebrow variants** | **section**: 12px, `--tracking-eyebrow`, `--fg-subtle` (homepage + case-study Section). **micro**: 10px, `--tracking-mono`, subtle (cards, captions, table labels). **accent**: 10px, pine (Callout positive, Timeline dates, ownership columns). |
| **States** | Eyebrow mark draws as it scrolls into view (`animation-timeline: view()`; timed fallback). |
| **Mobile** | H2 `role-section` 30px, 48px from `md`. Action wraps under the H2. |
| **Tokens** | `--text-label`, `--text-micro`, `--tracking-eyebrow`, `--tracking-mono`, `--fg-subtle`, `--accent`, `--role-section`, `--leading-heading`, `--tracking-display` |
| **Usage rule** | Used by Experience and Selected Work. About and Contact use their own headings. *(proposed)* Either route them through this component too, or document them as the two deliberate exceptions. |

---

## 7. Highlighter mark

| | |
|---|---|
| **Anatomy** | Lilac chisel stroke (`/images/v3/highlighter.svg`) painted behind words as a background image. |
| **Variants** | **Hero sweep** (on load, staggered). **Eyebrow sweep** (on scroll). **Index row** (v3.1, `mark="row"`, fills the whole current row). **Index text** (v3, `mark="text"`, behind the words only). **About scrub** ("fintech", drawn by scroll progress). **Metric marker** (flat `bg-highlight/80`, timeline cards). |
| **Mobile** | Same. |
| **Tokens** | `--highlight`, `--highlight-strong` (stroke colours are hardcoded inside the SVG and must match), `--duration-emphasis`, `--ease-emphasized`, `--z-behind` |
| **Usage rule** | Lilac is decorative only (CLAUDE.md §3): a mark never carries meaning that the words do not. At most three marks in one viewport. *(proposed; today the hero has exactly three)* |

---

## 8. Logo tile, avatar, current dot

| | |
|---|---|
| **Logo tile** | `rounded-lg border` square, sizes sm 36 / md 44 / lg 56px; image or initial-letter fallback; optional `logoBg` for transparent marks; optional **current dot** (10px pine with an oat ring). |
| **Avatar** | Hero portrait, circle, 44 / 56px, pine drop shadow. |
| **Work-card logo** | 28px `rounded-md`. |
| **Current dot** | Pine circle 6 to 10px: logo tile, mobile timeline node, nav chip, Venn marker. Past nodes use `--border`. |
| **Tokens** | `--radius-lg`, `--radius-md`, `--radius-full`, `--border`, `--bg-elevated`, `--accent`, `--bg` |
| **Usage rule** | Pine dot = "now / current". Use it for nothing else. |

---

## 9. Tags and pills

| Variant | Look | Where |
|---|---|---|
| Role chip | `rounded-full border bg-bg px-3 py-1 font-mono text-xs uppercase tracking-wider text-fg-muted` | Experience detail (`experience.tsx:339`) |
| Stack pill | `rounded-full border px-2.5 py-1 font-mono text-[11px] text-fg-muted` | Case-study header (`page.tsx:118`) |
| Status badge (lock) | `rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase`, lilac 45% fill | Unlock header (`backstage-pass.tsx:136`) |
| Venn chip | SVG pill, venn colour fill, cream mono text | Hero |
| Metric marker | `bg-highlight/80 px-1 text-xs font-medium` | Timeline card (`experience.tsx:973`) |

- **States:** none are interactive.
- **Mobile:** they wrap.
- **Tokens:** `--text-label`, `--text-micro`, `--tracking-mono`, `--fg-muted`, `--border`, `--radius-full`.
- **Usage rule:** a pill is a label, never a button. A linked tag is a link styled as a pill (comment in `case-study/primitives/pill.tsx`). The kit's `Pill` component exists but is unused in scope. *(proposed)* Route role chips and stack pills through it.

---

## 10. Experience

| Part | Anatomy | States | Mobile |
|---|---|---|---|
| Header | Section header + Kalam "try this ↗" + view toggle | | Stacks |
| **Mobile timeline** (default below `lg`) | Left spine, node dots, newest first; each node a **timeline card** (logo tile, label, chevron, role, mono dates with Kalam "now", optional metric marker) | Card open: `border-accent`, chevron rotates 90°, **entry detail** expands below. Hover: `border-fg/30`. Focus: pine ring. | **This is what phones see** |
| **Desktop timeline** (`lg+`) | Cream band, year axis, lanes of chips positioned by date, dashed "now" line | Chip hover: lift 2px, `border-accent`, `shadow-md`; **tooltip** (portal, 280px, fade-up 160ms) on hover **or focus** | Hidden |
| **List view** | Rows: logo tile, company (reveal link), role, dates, chevron | First row open; open rows expand the entry detail; hover `bg-bg-elevated`; inset focus ring | Dates move under the name below 640px |
| **Entry detail card** | `rounded-2xl` sheet, mono company eyebrow, role H3 (30 → 40px), emoji-led lines (📅 dates, 🎖 role chips, 📢 headline), narrative, `*` bullets, link-out | Static | `p-6` |
| **Product tabs** (TapInvest) | Segmented control + "{name} ↗" | Active tab | |

- **Tokens:** `--bg-elevated`, `--border`, `--accent`, `--fg-muted`, `--fg-subtle`, `--surface-band`, `--highlight`, `--radius-xl`, `--radius-2xl`, `--shadow-sm`, `--shadow-md`, `--z-tooltip`, `--text-body-compact`, `--leading-body`.
- **Usage rule:** fold 2's job is trajectory. The timeline is the default because it answers "where has this person been" at a glance. The tooltip duplicates the card summary, so nothing is hover-only.

---

## 11. Work card and shelf

| | |
|---|---|
| **Anatomy (card)** | One link. Back copy (1px behind) + coloured **spine slab** ("Click to read", vertical mono) + front **cover**: mono eyebrow + 28px logo, H3 24px, 2-line one-liner, 4:3 media well (looping muted video, GIF or poster). |
| **Variants** | Layout **carousel** (homepage shelf) or **grid** (1 → 2 → 3 cols, or locked at 2 for "Keep reading"). `mark` passes `text` / `row` through to the case-study index style. |
| **States** | **Hover / focus (fine pointer):** cover hinges open on a spring (rotateY -35°), slab tilts 4°, card lifts to `z-raised`. **Close:** 320ms tween (no overshoot). **Touch:** no hinge, tap opens the study. **Reduced motion:** stays closed, poster only. Video plays only when 45% visible. |
| **Shelf** | Scroll-snap row in a container query; autoplays one card every 4.5s today; 10s once D6 ships (`--interval-carousel`), wraps both ways, pauses on pointer or focus; two 40px arrows. |
| **Mobile** | About 1.15 cards visible; swipe or arrows. Arrows are 40px. |
| **Tokens** | `--radius-card`, `--radius-2xl`, `--bg-elevated`, `--border`, `--shadow-lg`, `--brand-*` (slabs), `--text-title`, `--text-small`, `--text-label`, `--tracking-label`, `--z-raised`, `--duration-moderate`, `--duration-slow`, `spring-hinge` |
| **Usage rule** | Product brand colours appear only on the slab ("content as-is"). Every card links to a case study, even before the write-up exists (the coming-soon body handles that). |

---

## 12. About collage

| | |
|---|---|
| **Anatomy** | 220svh scroll track with a 100svh sticky stage: grain overlay, three torn **strips** (pine, lilac, oat-grey), **photo stickers** (torn cuts a to f, paper border, optional tape), **bio slip** (torn paper card with tape and grain, H2 + 3 paragraphs, "fintech" mark). |
| **States** | Scroll drives `--p` → explode (`--t`) then slip (`--b`); latches open at 62%. Open: photos float, stacks cross-fade. Photo **hover / focus / tap** lifts it (`scale 1.04`) and shows a torn **tip** placed to stay on stage and off the slip. Reduced motion: static, open, normal height. |
| **Mobile** | 210svh track; separate photo layout and smaller stickers (5.85rem); tips sit **over the bottom of the photo** and open on **tap**; copy fixed at 15px. |
| **Tokens** | `--bg`, `--bg-elevated` (as `--paper`), `--fg`, `--fg-muted`, `--fg-subtle`, `--highlight`, `--border`, `--text-micro`, `--text-small`, `--text-body-compact`, `--leading-body`, `--tracking-display`, `--shadow-xs`. Geometry is internal (02-tokens §4). |
| **Usage rule** | Palette stays oatmeal / pine / lilac; the Vox yellow-blue-red is deliberately not used (`about-collage.css:2`, confirmed by Megh). |

---

## 13. Contact fold and booker

| | |
|---|---|
| **Anatomy** | Full-bleed pine section: H2 "Let's Connect." → 2-line pitch → Cal.com month booker (white card) → "calendars not your thing?" + `mailto:` fallback. |
| **States** | Booker is third-party; fallback link hover `opacity 0.9`. |
| **Mobile** | H2 48px (`role-contact`), `pt-32 pb-16`. Booker follows Cal's own layout below 1024px. |
| **Tokens** | `--accent` (fold bg), `--accent-fg` and its 85% / 70% / 50% mixes, `--role-contact`, `--leading-display`, `--shadow-lg`, `--radius-xl`, `--breakpoint-booker` |
| **Usage rule** | The only pine-background fold; it marks the end of the story (fold 7, action). `mailto:` stays as the no-JavaScript route (CLAUDE.md §2: email link first). |

---

## 14. Footer

- **Anatomy:** 4 ghost icon links (LinkedIn, X, GitHub, Email) + meta text: "megh gupta · {live IST clock}" and "made with zero em dashes".
- **States:** icon hover goes to pine; pine focus ring. **X and GitHub link to `#`** (`site-footer.tsx:17,26`).
- **Mobile:** centred stack; a row from `sm`.
- **Tokens:** `--fg-subtle`, `--fg`, `--text-label`, `--leading-body`, `--container-content`.
- **Usage rule:** not rendered on case-study pages.

---

## 15. Relock pill

- **Anatomy:** fixed bottom-right (`z-floating` 60) frosted oat pill with a lock icon and mono "LOCK AGAIN".
- **States:**
  - hover: lifts 2px, inverts to pine, and the icon tilts -12°;
  - pending: "Locking…" with `opacity 0.6`. This is one of only two disabled states on the site.
- **Mobile:** same corner. It sits over content, including the last line of the contact fold and the footer. Computed height ≈ 34px.
- **Tokens:** `--bg-elevated`, `--fg`, `--accent-fg`, `--shadow-md`, `--text-micro`, `--tracking-label`, `--radius-full`, `--z-floating`, `--opacity-disabled`.
- **Usage rule:** shown only on locked routes (`/preview/*`, `/work/*`).

---

## 16. Case-study shell

| Part | Anatomy | States | Mobile |
|---|---|---|---|
| Back link | `← Back to selected work`, target follows `mark` (v3 / v3.1 / home) | Hover to `fg`, pine focus ring | Only exit; no nav or footer on these pages |
| Kicker | Mono pine "role · company · timeline · N min" | | Wraps |
| H1 + dek | H1 `role-display` 36 → 48; dek 18px at body leading | | |
| Team + stack | `text-sm` team line; stack pills | | Wrap |
| **On this page** index | Mono label; numbered hairline rows (`01`…); current row `text-fg` + `aria-current="location"` + highlighter (**row** for v3.1, **text** for v3); scroll-spy | Hover / current / focus | **Below `xl` it is a full list above the article, not sticky.** Sticky 15.5rem rail from 1280px. Rows computed 39px. |
| Headline metric card | `rounded-xl` sheet: mono 10px label, value 24 → 30px, `·` supporting metrics | | `p-6` |
| Prose | Descendant styles: H2 `role-article`, H3 18px semibold, body at `--leading-body`, disc lists | | `--container-prose` |
| Keep reading | Hairline, mono label, 2 work cards (grid) | Card hover | 1 column |

- **Tokens:** `--container-prose`, `--container-rail`, `--container-wide`, `--breakpoint-xl`, `--role-display`, `--role-article`, `--text-lead`, `--text-micro`, `--accent`, `--bg-elevated`, `--border`, `--radius-xl`, `--scroll-offset`.
- **Usage rule:** CLAUDE.md §5 body order (TL;DR → Context → Approach → Execution → Outcome → Reflection → Ownership). The shell renders the headline-metric card directly under the header, so the number lands above the fold.

---

## 17. Case-study blocks

Only blocks rendered on the AI Call study are listed. `Figure`, `Pill`, `Quote`, `ScreenshotStack` and `Pipeline` exist in the kit but are not used here (01 Appendix C).

| Block | Variants (used here) | Anatomy | Mobile | Usage rule (from code comments) |
|---|---|---|---|---|
| `Section` | 8 declared; used: narrative ×4, deepDive ×4, metrics, reflection, ownership | Optional eyebrow (section) + H2 (`role-article`), then children. `reflection` caps width at 36rem; `split` is 3/5 + 2/5. | `split` stacks; spacing 64 → 80px | "The one layout wrapper every case study section uses." |
| `Callout` | 5 declared; used: insight, decision, caution ×2, learning | `rounded-lg` sheet, 4px left bar (pine for insight / result / decision; `fg-muted` for caution / learning), eyebrow label, 16px body | Same | "A sentence lifted out of the prose because the reader shouldn't scroll past it." |
| `DataTable` | used: data ×2, comparison ×2, ownership | data / comparison: scrolling table, mono 11px headers, right-aligned tabular numbers, right-edge fade. ownership: 2 labelled columns with a hairline divider. | Tables scroll sideways; ownership columns stack | "When the content genuinely reads better in rows and columns." |
| `Metric` + `MetricRow` | inline ×3 in one row | Value 30 → 36px (leading 1), micro label, caption | 1 column, then 3 from `md` | "A number that earns the page." |
| `StepGrid` | parallel ×1, sequence ×1 (7 cells) | `rounded-lg` cells, eyebrow (auto "Step 01" for sequence), H3 20px, body 14px; sequence draws hairline connectors | Single column; connectors run down | parallel = 3 to 6 equal workstreams; sequence = 2 to 5 ordered steps |
| `Timeline` | vertical (3 events) | Left hairline, pine 10px dots, pine mono date, 16px title | Vertical | "Dated events on an axis." |
| Embed frame (`AiCallPipeline`) | 1 | `rounded-xl` bordered frame around a same-origin iframe, auto-height (minimum 820px), lazy | Height follows content | Island: site chrome on-system, artifact palette to be mapped (02-tokens §2.22). |

Shared tokens: `--bg-elevated`, `--border`, `--border-width-bar`, `--accent`, `--fg-muted`, `--radius-lg`, `--radius-xl`, `--text-micro`, `--text-small`, `--text-title-sm`, `--leading-body`.

---

## 18. Backstage pass (`/unlock`)

The only form on the site, and therefore the reference for every input, error, loading and success state. Scope `lock`.

| Part | Anatomy | States | Mobile |
|---|---|---|---|
| Stage | Dawn sky + 8 drifting clouds + oat veil behind the ticket | Reduced motion parks clouds | Full-bleed `100svh` |
| Ticket | Body + tear-off stub with half-circle notches (CSS mask), 3-layer pine + lilac drop shadow | Enter (overshoot, 900ms), idle float (6s), mouse-only tilt | Stacks: body over stub, perforation turns horizontal |
| Header | Mono brand label + lilac "Works in progress" badge | | |
| Copy | Kalam line, H1 "Backstage." `clamp(3rem, 9vw, 5.25rem)` semibold, 15px body | | H1 floor 48px |
| **Password field** | Mono label; underline-only input; typed characters drawn as pine **ink dots** (max 14) with a custom caret; eye toggle (`aria-pressed`) | **Idle** (pine 35% underline) · **error** (`--status-danger` underline, `aria-invalid`) · **disabled** (`opacity 0.6`) · **revealed** (plain text). **No visible focus indicator** (`outline-none focus-visible:shadow-none`, `backstage-pass.tsx:194`). | Full width |
| **Submit** | Primary pill L + arrow | Hover (lift, shadow, arrow nudge) · **disabled until text is typed** · **loading** (spinner, "Checking…") · **success** ("Welcome in") | Full width below the field; computed 44px |
| **Status line** | `aria-live="polite"`, reserved height | Wrong ×1–2, wrong ×3+ ("Ask Megh…"), not configured (red), admitted (pine) | |
| Stamps | DENIED (red, fades after 1.5s) / ADMITTED (pine); double 4px rule, multiply blend, slam-in | Decorative (`aria-hidden`) | 24px |
| Error feedback | Whole ticket shakes 520ms, field clears, refocuses | | |
| Success sequence | Stamp → stub tears off → ticket blurs out → redirect at 1.65s (0.35s reduced) | | Tear direction adapts |
| Stub | "Admit One", dated badge (from `sm`), decorative barcode, serial; `aria-hidden` | | Horizontal row; date badge hidden below 640px |

- **Tokens:** `--fg`, `--accent`, `--accent-fg`, `--bg-elevated`, `--ticket-stub`, `--highlight`, `--status-danger`, `--sky-*`, `--font-hand`, `--font-mono`, `--text-micro`, `--text-small`, `--text-body-compact`, `--tracking-label`, `--tracking-eyebrow`, `--tracking-display-tight`, `--weight-semibold`, `--weight-bold`, `--radius-2xl`, `--radius-xl`, `--radius-full`, `--shadow-md`, `--ease-overshoot`, `--ease-in`, `--duration-slower`, `--duration-scene`, `--opacity-disabled`.
- **Usage rule:**
  - `--status-danger` and the sky palette never leave `/unlock` (approved exceptions).
  - *(proposed)* The next lock flow, for content shared with specific people, reuses this field, submit and status-line pattern instead of a new one.
  - *(proposed)* The field gets a visible focus state before it is reused.
