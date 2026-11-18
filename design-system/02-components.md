# 02 · Components

> Phase 2 component reference. Facts (anatomy, variants, states, mobile) come from `01-inventory.md` §3 and §4, which carry the file:line citations. Token names come from `02-tokens.md`. A usage rule marked *(proposed)* is a recommendation; unmarked rules restate what the code or a code comment already does.
>
> **Phase 4 note:** today every element without an explicit font class renders in the system font, not Geist (03-gaps G-C17, patch D7). The specs below describe the intended faces.
>
> Mobile is listed first in every component because about 60% of visitors are on phones (CLAUDE.md §1). "Computed" tap heights come from padding + line height + border and get measured in Phase 4.

## Index

| # | Component | File | Routes |
|---|---|---|---|
| 1 | [Buttons](#1-buttons) (primary pill, secondary pill, icon button, ghost icon, segmented control) | `components/ui/button.tsx` | all |
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
| 15 | [Relock pill](#15-relock-pill) (retired) | retired | retired |
| 16 | [Case-study shell](#16-case-study-shell) (header, index, headline metric, prose, keep reading) | `app/work/[slug]/page.tsx`, `case-study/case-study-toc.tsx` | case study |
| 17 | [Case-study blocks](#17-case-study-blocks) (Section, Callout, DataTable, Metric, StepGrid, Timeline, Embed frame) | `components/case-study/*` | case study |
| 18 | [Backstage pass](#18-backstage-pass-unlock) (ticket, password field, submit, status, stamps) | `components/backstage-pass.tsx`, `app/unlock/backstage.css` | `/unlock` |

---

## 1. Buttons

Three CTA tiers. Primary and secondary are `<Button>` and `<ButtonLink>` in `components/ui/button.tsx` (`buttonStyles()` for an element that cannot be either). Tertiary is `<TextLink>` / `<TextLinkButton>` in `components/ui/text-link.tsx` (§2a). Labels are sentence case in Geist Sans. Arrows are the shared 24-grid icon (`CtaArrow`), never a typed character. One primary is visible per fold. Highlight (§1f, §2b) is built and unused.

### 1a. Primary pill

| | |
|---|---|
| **Anatomy** | Label, optional trailing icon (arrow or download). `rounded-full`, pine fill, oatmeal label, `shadow-[var(--shadow-md)]`. |
| **Component** | `<Button>` / `<ButtonLink variant="primary">` (the default). Sizes `sm` `px-4 py-2`, `md` `px-5 py-2.5`, `lg` `px-6 py-3`, `touch` `min-h-11 px-5`. All `text-sm`. |
| **Where** | Hero "Let's connect" (`hero.tsx`). Case-study "Book 20 min" (`case-study-contact.tsx`) and the coming-soon "Let's talk about it" (`app/work/[slug]/page.tsx`). 404 "Home" (`app/not-found.tsx`). Error "Try again" (`app/error.tsx`). Unlock "Get my pass" (`backstage-pass.tsx`), including loading, success and disabled. Resume "Download resume (PDF)", header and close (`resume-document.tsx`), via `buttonStyles()` because the link downloads a file. |
| **States** | Hover opacity 0.9, 150ms. Focus: pine `ring-2` with offset. Disabled: opacity 0.6, no pointer events. Unlock keeps its spinner ("Checking…"), "Welcome in", and the disabled gate. |
| **Mobile** | `lg` and `touch` clear 44px. `sm` is shorter and sits in the resume bar. |
| **Tokens** | `--accent`, `--accent-fg`, `--shadow-md`, `--radius-full`, `--text-small`, `--duration-fast` |
| **Usage rule** | The one most important action in view. One per fold. |

### 1b. Secondary pill

| | |
|---|---|
| **Anatomy** | Sentence-case label, 1.5px pine border, `--bg-elevated` fill, pine label, `rounded-full`. |
| **Component** | `<Button variant="secondary">` / `<ButtonLink variant="secondary">`. Same sizes as primary. |
| **Where** | Nav "Resume", desktop and mobile menu (`nav.tsx`). Case-study top bar "Let's connect" (`case-study-top-bar.tsx`). "Copy email" (`case-study-contact.tsx`, `buttonStyles()` on `CopyEmailButton`). 404 "Selected work". Error "Home". Resume "Watch it get built" (`resume-walkthrough.tsx`). GitHub graph "Play" / "Pause" (`github-graph.tsx`). |
| **States** | Hover inverts to pine fill with oatmeal text, 150ms. Focus: pine `ring-2`. Disabled: opacity 0.6. |
| **Mobile** | Mobile-menu Resume uses `lg` (14px label, focus ring). |
| **Tokens** | `--fg`, `--bg-elevated`, `--accent-fg`, `--radius-full`, `--text-small` |
| **Usage rule** | A real alternative to the primary. Not a quieter copy of it, and not the only action in a fold. |

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
| **Where** | Experience view toggle "list / timeline" (`experience.tsx`); TapInvest product tabs (`experience.tsx`); contribution scene switch, Graph / Hello / Heart (`github-graph.tsx`). Play / Pause beside it is a secondary pill (§1b), not a segment. |
| **States** | Active: `bg-fg text-bg` (inverted). Idle: `text-fg-muted hover:text-fg`. Focus: pine ring. ARIA: `role="tablist"` / `role="tab"` / `aria-selected`. |
| **Mobile** | Computed 28px tall per segment. Sits under the section H2 (header stacks). |
| **Tokens** | `--bg-elevated`, `--border`, `--fg`, `--bg`, `--fg-muted`, `--text-label`, `--radius-full` |
| **Usage rule** | Switches between views of the **same** content. Not for navigation. |

### 1f. Highlight pill

| | |
|---|---|
| **Anatomy** | Same pill as 1a. The fill is a gradient strip (deepened Venn pink → amber → blue → pink) twice the pill's width that slides through it on a 7s loop. A blurred copy of the same strip sits behind it as the glow. Cream label (`--venn-cream`), weight 500. |
| **Where** | `<Button variant="highlight">` / `<ButtonLink variant="highlight">` (`components/ui/button.tsx`). Styles in `app/globals.css` (`.cta-highlight`). No call site yet. |
| **Sizes** | Same `sm` / `md` / `lg` / `touch` as the other variants. |
| **States** | Idle: gradient flows without a trigger, so phones see it (no hover on touch). Hover: glow opacity 0.8 → 1, 150ms. Focus: pine `ring-2` from the shared base. Reduced motion: gradient and glow hold still; the colour alone still sets it apart from primary. Disabled: `opacity-60` from the base. |
| **Contrast** | Cream on the three stops: 5.02 (pink), 4.67 (amber), 5.05 (blue). Blends between stops stay above 4.9. The original Venn hues were not used because cream on `--venn-biz` is 3.04. |
| **Tokens** | `--venn-user-deep`, `--venn-biz-deep`, `--venn-tech-deep`, `--venn-cream`, `--radius-full` |
| **Usage rule** | For one time-bound moment: something new, limited seats, a deadline. **One on the whole site at a time.** It replaces the primary in its fold and never sits beside one. It always states the reason in or next to the label ("2 seats left"). Set the date it returns to a plain primary before it ships. |

---

## 2. Text link

| | |
|---|---|
| **Variants** | **Tertiary CTA**: `<TextLink>` (§2a). **Prose link**: underlined, offset 4px, inherits colour (`[&_a]` in the case-study article). **On-pine link**: the email address in the contact fold (`contact.tsx`), left as its own treatment. **Name back link**: "Megh Gupta · Work" and "Megh Gupta · Resume" keep their own styling; only the typed arrow was swapped for `CtaArrow`. |
| **States** | A global rule adds a 2px lilac underline at offset 4px on hover for every link inside `main`, `nav` or `footer`. Focus on tertiary links is a pine `ring-2`. |
| **Mobile** | Tertiary hit area is 44px. Prose links stay text-height. |
| **Tokens** | `--fg`, `--accent`, `--highlight-strong`, `--accent-fg` |
| **Usage rule** | A tertiary link reads as a link at rest: underline visible, arrow icon, focus ring. External links use `target="_blank" rel="noopener noreferrer"`. |

### 2a. Tertiary CTA (`TextLink`)

| | |
|---|---|
| **Anatomy** | Label + small arrow icon (14px, 1.8px stroke, `currentColor`). Label underlined at 1.5px, offset 5px. Geist Sans 14px (`size="sm"`), weight 500. The hit area is 44px tall; the underline hugs the text. |
| **Component** | `<TextLink>` for links. `<TextLinkButton>` for the same look on a button (Skip, replay). `size="xs"` (product tab) and `size="base"` with `weight="semibold"` (company name) when 14px would fight the surrounding type. `arrow={false}` only when a leading icon is already there and a second glyph would crowd it. |
| **Where** | "View all work" (`section-header.tsx`, label from `selected-work-shelf.tsx`). Experience company name, product tab, and both link-outs (`experience.tsx`); the same link-out and "See what shipped" on the roadmap (`experience-roadmap.tsx`). Case-study "LinkedIn" (`case-study-contact.tsx`). 404 "Contact". "Back to selected work" and the work index back link (`app/work/[slug]/page.tsx`, `app/work/page.tsx`). Unlock "Not supposed to be here?" (`backstage-pass.tsx`). Hero overture "Skip" and the resume-agent dock "Skip" / "Watch it build again" (`hero-overture.tsx`, `resume-agents.tsx`). Resume contact row (`resume-document.tsx`): underline and focus ring on each link, new-tab arrow on LinkedIn only, leading icons kept, `print:min-h-0` so the printed sheet does not grow. |
| **Direction** | `onward` (arrow right, trailing; default). `external` (arrow up-right, trailing; adds `target="_blank" rel="noopener noreferrer"`). `back` (arrow left, leading). |
| **States** | Underline visible at rest. Hover: the global lilac underline. Focus: pine `ring-2`, oatmeal ring with `onPine`. |
| **Tokens** | `--fg`, `--accent`, `--accent-fg`, `--text-small` |
| **Usage rule** | The third rung: "see more", "go back", "open elsewhere". Never the only way to do the main action of a fold. Do not use `highlight` until a moment is named. |

### 2b. Highlighted tertiary

| | |
|---|---|
| **Anatomy** | Same as 2a, but the underline is a 2px strip of the highlight gradient (deepened Venn pink → amber → blue) that slides under the label on a 7s loop. The words keep their normal colour. |
| **Where** | `<TextLink highlight>`. Styles in `app/globals.css` (`.link-highlight`). No call site yet. |
| **Variants** | `onPine`: oatmeal label; the line uses the original Venn hues (`--venn-user`, `--venn-biz`, `--venn-tech`) so it stays visible on pine. |
| **States** | Idle: flows without a trigger. Reduced motion: the gradient line holds still and still sets it apart from 2a. Focus as 2a. |
| **Contrast** | Unchanged from 2a. Only the line carries colour, so the label is pine on oatmeal or oatmeal on pine. |
| **Tokens** | `--venn-user-deep`, `--venn-biz-deep`, `--venn-tech-deep`; on pine `--venn-user`, `--venn-biz`, `--venn-tech` |
| **Usage rule** | Same as the highlight pill (§1f) and counted together with it: **one highlight on the whole site at a time**, pill or link. It states its reason and has an end date. |

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
| **Mobile** | Scales to the column width. Type is in drawing units: measured in Phase 4, chip text is 4px at 375px and 7px at 1440px. Travel chips set `touch-action: none`, so a finger that lands on a chip drags it instead of scrolling the page. |
| **Tokens** | `--venn-user`, `--venn-tech`, `--venn-biz`, `--venn-ink`, `--fg`, `--accent`, `--font-display`, `--font-mono`, `--ease-overshoot`, `--ease-standard`, `--z-drag` |
| **Usage rule** | The Venn trio is the site's only data-viz palette and appears **only** here (confirmed by Megh). Never reuse the three colours as UI accents. |

---

## 6. Section header and eyebrow

| | |
|---|---|
| **Anatomy** | Mono uppercase **eyebrow** (with a highlighter mark) → **H2** → optional **action** (tertiary text link, §2a), right-aligned on desktop. |
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
| **List view** | Rows: logo tile, company (tertiary external link, underlined at rest), role, dates, chevron | First row open; open rows expand the entry detail; hover `bg-bg-elevated`; inset focus ring | Dates move under the name below 640px |
| **Entry detail card** | `rounded-2xl` sheet, mono company eyebrow, role H3 (30 → 40px), emoji-led lines (📅 dates, 🎖 role chips, 📢 headline), narrative, `*` bullets, link-out | Static | `p-6` |
| **Product tabs** (TapInvest) | Segmented control + tertiary external link | Active tab | |

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

- **Anatomy:** 3 ghost icon links (LinkedIn, GitHub, Email; X removed) + meta text: "megh gupta · {live IST clock}" and "made with zero em dashes".
- **States:** icon hover goes to pine; pine focus ring. **X and GitHub link to `#`** (`site-footer.tsx:17,26`).
- **Mobile:** centred stack; a row from `sm`.
- **Tokens:** `--fg-subtle`, `--fg`, `--text-label`, `--leading-body`, `--container-content`.
- **Usage rule:** not rendered on case-study pages.

---

## 15. Relock pill

Retired. The floating "Lock again" pill is gone from `/preview/*`, `/paper-preview`, and `/work/*`. Those routes stay gated by the 24-hour pass (`middleware.ts`, `lib/preview-auth.ts`). There is no manual lock control.

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
