# PRD: Portfolio Website — Skeleton (v0)

**Author:** Megh Gupta
**Status:** Draft
**Last updated:** 25 Jun 2026
**Owner:** Megh (PM + builder)
**Reviewers:** —
**Target ship:** 1 weekend (skeleton only)

---

## 1. TL;DR

Ship a single-page portfolio website with a sticky nav bar, six anchor-linked sections, and a working contact CTA. No detail pages. No case study journeys. No CMS. Skeleton only — content fills in after.

**What "skeleton" means here:** every section renders in its final position, with final type/spacing/colors and final responsive behavior, but the *content inside each section* can be placeholder. Goal is to have the architecture frozen so we can pour copy into it without restructuring.

---

## 2. Context

I'm in active PM job search, interviewing at VC-backed fintechs and AI-first startups. My case studies and proof artifacts are mostly written (see `Megh_Gupta_PM_Case_Studies.docx`). What I don't have is a public surface to point people to.

Original plan was a multi-page Next.js + MDX site with dedicated case study URLs. **Decision change:** v0 is single-page with anchor nav. Faster to ship, easier to maintain, sufficient for a recruiter's 60-second scan. Detail pages can be added in v1 if needed.

Reference vibe: kashwiaggarwal.com (editorial PM portfolio, single-page-ish, light palette).

---

## 3. Goals & non-goals

### Goals (v0)
- **G1.** Recruiter lands → sees role + 2-3 headline metrics → finds contact CTA in under 30 seconds.
- **G2.** Site is deployable to a real domain by end of weekend.
- **G3.** Adding new content (a work card, a lab project, an updated tagline) is a one-file edit.
- **G4.** Mobile-first: looks correct at 375px, 768px, 1440px widths.
- **G5.** Lighthouse ≥ 95 on all four metrics on the homepage.

### Non-goals (v0)
- **NG1.** Detail case study pages. Work cards link out (Notion, Loom, Figma, live URLs) or are non-clickable for now.
- **NG2.** Blog, newsletter signup, comments, search.
- **NG3.** CMS or admin panel. Content lives in TypeScript/MDX files in the repo.
- **NG4.** Dark mode, theme switcher, language switcher.
- **NG5.** Animations beyond hover transitions and one scroll-fade.
- **NG6.** Contact form. `mailto:` only for v0.
- **NG7.** Analytics dashboards beyond Vercel Analytics default.

---

## 4. Users & scenarios

| User | Scenario | What they need |
|---|---|---|
| **Recruiter** (40% of traffic) | Got my resume, wants to verify quickly before forwarding to hiring manager. | Name, role, one headline, 2-3 proof points, a way to reach me. Time-to-decision: <30s. |
| **Hiring PM** (30% of traffic) | Heard about me from a referral, wants to assess scope and depth. | Case study summaries with metrics, sense of how I think, my background. Time-to-decision: 2-5 min. |
| **Founder / hiring manager** (20% of traffic) | Considering me for a senior or founding role. | Range of work, AI fluency, vibe-coding evidence, contact. Time-to-decision: 5-10 min. |
| **Peer PM / network** (10% of traffic) | Curious, may share or refer. | The Lab section, side projects, anything quotable. |

All four need the same skeleton. The skeleton optimizes for the recruiter scenario (shortest attention span) without hurting the others.

---

## 5. Information architecture

### 5.1 Single page, six sections

The entire site is `app/page.tsx`. Sections are stacked vertically and linked from the nav by anchor.

```
┌────────────────────────────────────────┐
│  NAV (sticky)                          │
├────────────────────────────────────────┤
│  #hero        (full viewport height)   │
├────────────────────────────────────────┤
│  #work        (4 cards)                │
├────────────────────────────────────────┤
│  #lab         (6-8 cards, lighter)     │
├────────────────────────────────────────┤
│  #about       (short prose + photo)    │
├────────────────────────────────────────┤
│  #contact     (CTA + links)            │
├────────────────────────────────────────┤
│  FOOTER       (minimal)                │
└────────────────────────────────────────┘
```

### 5.2 Anchor map

| Nav label | Anchor | Section ID |
|---|---|---|
| Work | `#work` | `<section id="work">` |
| Lab | `#lab` | `<section id="lab">` |
| About | `#about` | `<section id="about">` |
| Contact | `#contact` | `<section id="contact">` |

Hero has no nav link — clicking the logo/name in the nav scrolls to top.

---

## 6. Component specs

### 6.1 Nav bar

**Behavior:**
- Sticky to top of viewport on scroll.
- Translucent background with backdrop blur (`bg-bg/80 backdrop-blur-md`) so content shows through subtly.
- Bottom hairline border appears only when scrolled past 80px (use `IntersectionObserver` or scroll listener).
- On mobile (<768px): nav links collapse into a hamburger menu that opens a full-screen overlay.

**Structure (desktop):**
```
[Megh Gupta]                    Work · Lab · About · Contact   [Get in touch →]
   ^ left                                                              ^ right
```

**Structure (mobile):**
```
[Megh Gupta]                                                          [≡]
```
Hamburger opens full-screen overlay with the 4 nav links + the CTA, vertically stacked, centered.

**Specs:**
- Height: 64px desktop, 56px mobile.
- Horizontal padding: matches section container (`px-6 md:px-8`).
- Logo/name: Inter SemiBold, 1rem.
- Nav links: Inter Regular, 0.875rem, muted color (`--fg-muted`), hover → `--fg`.
- CTA button: small, accent-colored, rounded-md, opens `mailto:` link.
- Active section indicator: optional in v1, not required in v0.

**States:**
- Default (top of page): transparent background, no border.
- Scrolled: blurred background, hairline bottom border.
- Mobile menu open: full-screen overlay, body scroll locked.

**Accessibility:**
- `<nav aria-label="Primary">`.
- Hamburger button has `aria-expanded` and `aria-controls`.
- Anchor clicks update URL hash (browser default behavior — don't override).
- Keyboard: Tab through links in order, Escape closes mobile menu.

---

### 6.2 Hero (`#hero`)

**Behavior:**
- Fills approximately one viewport height on desktop (`min-h-[85vh]`). On mobile, `min-h-[80vh]`.
- Content vertically centered with slight upward bias (`pt-32 md:pt-40`) so the eyeline sits at upper-third.
- Two CTAs: primary scrolls to `#work`, secondary opens `mailto:`.

**Structure:**
```
─────────────────────────────────────────
            [eyebrow label]            ← optional small mono tag, e.g. "PM · Fintech · India"

         I'm Megh.                      ← display type
         I ship fintech products
         and the AI tools that
         run them.

         Currently at BondScanner,      ← muted sub-line, 1-2 lines
         building India's bond market for retail.

         [See selected work]  [Get in touch →]
─────────────────────────────────────────
```

**Specs:**
- Eyebrow: JetBrains Mono, 0.75rem, uppercase, letter-spacing wide, muted color. Optional, can omit in v0.
- Headline: Instrument Serif (or fallback), 3rem mobile / 4.5rem desktop, line-height 1.05.
- Sub-line: Inter Regular, 1.125rem, muted color, max-width 32rem.
- Primary CTA: solid accent background, `Get in touch` semantics → `mailto:`.
- Secondary CTA: ghost button (border only), `See selected work` semantics → smooth-scroll to `#work`.
- Gap between elements: 1.5rem vertical rhythm.

**States:**
- Static. No scroll animations on hero in v0.

**Open question:** Do we include a small photo/avatar in the hero, or stay text-only? See §13.

---

### 6.3 Work (`#work`)

**Behavior:**
- Grid of 4 case study cards. 2x2 on desktop, single column on mobile.
- Each card is a self-contained block — title, headline metric, tags, short description, external link.
- Cards may or may not be clickable in v0. If clickable, they link to an external resource (Notion case study, Loom video, Figma file, live URL). If a card has no external resource yet, it renders as non-interactive with a `Soon` chip.

**Section structure:**
```
─────────────────────────────────────────
[Section eyebrow]    SELECTED WORK
[Section header]     What I've shipped, with numbers.

   ┌──────────────┐  ┌──────────────┐
   │  Card 1      │  │  Card 2      │
   └──────────────┘  └──────────────┘
   ┌──────────────┐  ┌──────────────┐
   │  Card 3      │  │  Card 4      │
   └──────────────┘  └──────────────┘

         [See more case studies →]   ← optional, links to a PDF or Notion index
─────────────────────────────────────────
```

**Card spec:**
- Background: `--bg-elevated` (white).
- Border: 1px solid `--border`.
- Border radius: `rounded-xl` (12px).
- Padding: `p-6 md:p-8`.
- Hover (only if clickable): subtle lift (`translate-y-[-2px]`), border darkens to accent.

**Card content (top to bottom):**
1. **Tags row** — 2-3 mono chips (`Fintech`, `Growth`, `0→1`).
2. **Title** — Instrument Serif, 1.5rem, 2 lines max.
3. **Headline metric** — large display number + label below in small text. E.g. `2x organic clicks · 3 months`.
4. **Description** — Inter Regular, 1rem, muted, 3-4 lines.
5. **Footer row** — `Role · Timeline` on left, external link icon on right (if applicable).

**Data shape (TypeScript):**
```ts
// /lib/work.ts
export type WorkCard = {
  slug: string;
  title: string;
  tags: string[];
  headlineMetric: string;
  headlineMetricLabel: string;
  description: string;
  role: string;
  timeline: string;
  externalUrl?: string; // optional; if absent, card is non-interactive
  status: "live" | "soon";
};

export const workCards: WorkCard[] = [
  // 4 entries
];
```

**v0 content (placeholder OK, but lock the 4 slugs):**
1. `seo-engine` — BondScanner product-led SEO.
2. `ai-call-analysis` — AI call analysis pipeline.
3. `ultra-reinvestment` — Ultra reinvestment growth.
4. `bondscanner-launch` — BondScanner 0→1 founding PM.

---

### 6.4 Lab (`#lab`)

**Behavior:**
- Tighter grid than Work. 3 columns on desktop, 2 on tablet, 1 on mobile.
- 6-8 cards. Smaller, denser, more "builder" aesthetic — monospace tags, smaller titles, more text per card.
- Background of the section is slightly different (`--bg-elevated` or a `--bg-subtle` if defined) to visually separate it from Work.

**Section structure:**
```
─────────────────────────────────────────
[Section eyebrow]    THE LAB
[Section header]     Things I built when a tool didn't exist
                     or moved too slow.

   ┌────────┐ ┌────────┐ ┌────────┐
   │ Lab 1  │ │ Lab 2  │ │ Lab 3  │
   └────────┘ └────────┘ └────────┘
   ┌────────┐ ┌────────┐ ┌────────┐
   │ Lab 4  │ │ Lab 5  │ │ Lab 6  │
   └────────┘ └────────┘ └────────┘
─────────────────────────────────────────
```

**Card spec:**
- Background: matches section background or slightly elevated.
- Border: 1px dashed `--border` (the "builder" touch — distinguishes from Work cards).
- Border radius: `rounded-lg` (8px).
- Padding: `p-5`.
- Hover (if clickable): border becomes solid, accent color.

**Card content (top to bottom):**
1. **Title** — Inter SemiBold, 1.125rem.
2. **One-line description** — Inter Regular, 0.875rem, muted.
3. **Stack tags row** — JetBrains Mono, 0.75rem, e.g. `claude-api · supabase · next.js`.
4. **External link** (optional) — small icon bottom-right.

**Data shape:**
```ts
// /lib/lab.ts
export type LabCard = {
  slug: string;
  title: string;
  description: string; // one line
  stack: string[];
  externalUrl?: string;
};
```

**v0 placeholder list (lock the 6-8 slugs, fill content later):**
- `job-search-os` — Claude Code + Supabase job tracker.
- `bond-dictionary` — Investopedia-style hub on BondScanner.
- `compliance-content-tool` — AI compliance reviewer.
- `call-analysis-pipeline` — Sarvam + Claude.
- `interview-prep-system` — Structured Notion + Claude prep.
- `moengage-mcp-workflows` — MCP-driven lifecycle ops.

(Add 2 more later as you build them.)

---

### 6.5 About (`#about`)

**Behavior:**
- Two-column on desktop: photo/avatar on left (1/3 width), prose on right (2/3 width).
- Single column on mobile: photo on top, prose below.
- No scroll animations. Static.

**Structure:**
```
─────────────────────────────────────────
[Section eyebrow]    ABOUT

   ┌─────────┐   I'm Megh, a Product Manager working at the intersection of
   │  Photo  │   fintech and AI tooling.
   │         │
   │         │   Right now I'm Founding PM at BondScanner...
   └─────────┘
                 Before that, I was Platform PM at Ultra...

                 I care about 0→1 builds, growth loops, and shipping internal
                 tools that compound team leverage.

                 Currently interviewing for PM roles at VC-backed fintechs
                 and AI-first startups.
─────────────────────────────────────────
```

**Specs:**
- Photo: square, 240px desktop / 200px mobile, `rounded-2xl`. Casual headshot, not corporate.
- Prose: Inter Regular, 1.125rem, line-height 1.6, max-width 36rem.
- Paragraph spacing: 1rem vertical gap.
- Last paragraph (the "currently interviewing" line) gets slight emphasis — `font-medium` or accent-colored.

**Content for v0:** placeholder copy, lock the structure.

---

### 6.6 Contact (`#contact`)

**Behavior:**
- Final section before footer. Larger vertical padding than other sections to give it visual weight.
- Single CTA above the fold: large `Get in touch` button → `mailto:`.
- Below CTA: a row of social/contact links (email, LinkedIn, Twitter/X, GitHub).
- Background: optionally use `--accent` color for the whole section to make it pop visually. Test both ways.

**Structure:**
```
─────────────────────────────────────────

         Let's talk.

         hi@meghgupta.com

         [Email me]

         LinkedIn · Twitter · GitHub · Read.cv

─────────────────────────────────────────
```

**Specs:**
- Heading: Instrument Serif, 3rem mobile / 4rem desktop.
- Email text: Inter Regular, 1.25rem, optionally underlined with accent color.
- CTA button: large, solid accent, opens `mailto:hi@meghgupta.com?subject=Hello%20from%20[name]`.
- Social links row: Inter Regular, 0.875rem, muted with separator dots.
- Section padding: `py-32 md:py-48` (more breathing room than other sections).

---

### 6.7 Footer

**Behavior:**
- Minimal. One line. Centered.
- Sticks to bottom of page after Contact section.

**Structure:**
```
─────────────────────────────────────────
   © 2026 Megh Gupta · Built with Claude Code · Source
─────────────────────────────────────────
```

**Specs:**
- Inter Regular, 0.75rem, muted color.
- Padding: `py-8`.
- `Source` link → GitHub repo (or omitted in v0 if repo isn't public).
- No newsletter, no extra nav, no sitemap. Single line.

---

## 7. Layout & responsive behavior

### 7.1 Section container

Every section uses the same container pattern:

```tsx
<section id="..." className="py-24 md:py-32 px-6 md:px-8">
  <div className="max-w-5xl mx-auto">
    {/* section content */}
  </div>
</section>
```

- Vertical padding: `py-24` mobile, `py-32` desktop.
- Horizontal padding: `px-6` mobile, `px-8` desktop.
- Content max-width: `max-w-5xl` (≈ 1024px).
- Centered with `mx-auto`.

### 7.2 Section header pattern

Every section (except hero, contact) starts with the same header pattern:

```tsx
<div className="mb-12 md:mb-16">
  <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-3">
    {eyebrow}
  </p>
  <h2 className="font-serif text-3xl md:text-4xl">
    {heading}
  </h2>
</div>
```

### 7.3 Breakpoints

| Name | Min width | Tailwind prefix |
|---|---|---|
| Mobile | 0 | (default) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |

Don't introduce custom breakpoints in v0.

---

## 8. Interactions & states

### 8.1 Smooth scroll to anchors

Use CSS `scroll-behavior: smooth` on `html`. Account for sticky nav height with `scroll-margin-top: 80px` on every `<section>`.

```css
html {
  scroll-behavior: smooth;
}

section {
  scroll-margin-top: 80px;
}
```

### 8.2 Hover states (locked)

- Links: color shifts from `--fg-muted` → `--fg`, 150ms ease-out.
- Buttons: subtle background shift, 150ms.
- Cards (if clickable): 2px translate-y up, border color → accent.

### 8.3 Focus states

All interactive elements get a visible focus ring:
```css
focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
```

### 8.4 Reduced motion

Respect `prefers-reduced-motion`. Disable smooth scroll and hover translations for users who have it set.

---

## 9. Accessibility requirements

- All sections have semantic HTML5 tags (`<section>`, `<nav>`, `<footer>`, `<main>`).
- All images have meaningful `alt` text. Decorative images get `alt=""`.
- All interactive elements are keyboard-navigable. Tab order matches visual order.
- Color contrast meets WCAG AA: 4.5:1 for body text, 3:1 for large text and UI elements.
- Page has a single `<h1>` (in the hero). All other section headings are `<h2>`.
- Skip-to-content link at the top of the page (visually hidden, appears on Tab focus).
- Reduced motion respected (see 8.4).

---

## 10. Performance requirements

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Largest Contentful Paint (LCP) | < 1.5s on 4G |
| Cumulative Layout Shift (CLS) | < 0.05 |
| Total page weight | < 500KB (excluding photos) |
| JS bundle | < 100KB gzipped |

How we hit it:
- Server components by default. Client components only where needed.
- `next/font` for font loading with `display: swap`.
- `next/image` for all images, AVIF format, explicit width/height.
- No third-party scripts in v0 except Vercel Analytics.
- Tailwind's purge eliminates unused CSS.

---

## 11. SEO & metadata

- Title: `Megh Gupta — Product Manager (Fintech, Growth, AI)`
- Description: `PM building fintech products and the AI tools that run them. Currently at BondScanner. Previously Ultra.`
- OG image: 1200x630, generated via `next/og` route. Headline = name + role, accent background.
- Favicon: simple monogram or accent-colored circle.
- `robots.txt`: allow all.
- `sitemap.xml`: single URL (the homepage).
- Structured data: `Person` schema with name, jobTitle, url, sameAs (social links).

---

## 12. Acceptance criteria

Skeleton v0 is **shippable** when ALL of the following are true:

- [ ] Site is live at the target domain.
- [ ] All 6 sections render in correct order with locked layouts.
- [ ] Nav bar sticks, anchor links scroll smoothly, mobile menu works.
- [ ] Hero CTAs both work: primary → `mailto:`, secondary → `#work` scroll.
- [ ] Work section shows 4 cards in a 2x2 grid (1-col on mobile).
- [ ] Lab section shows 6 cards in a 3-col grid (1-col on mobile, 2-col on tablet).
- [ ] About section shows photo + prose layout.
- [ ] Contact section shows email CTA + social row.
- [ ] Footer renders centered single line.
- [ ] All Lighthouse scores ≥ 95 on the homepage.
- [ ] Renders correctly at 375px, 768px, 1440px widths.
- [ ] No console errors or warnings.
- [ ] Keyboard navigation works end-to-end.
- [ ] `prefers-reduced-motion` is respected.
- [ ] `pnpm build` succeeds with no TypeScript errors.

**Content can be placeholder.** Skeleton ships even if work cards have lorem ipsum descriptions. The acceptance criteria is structural, not editorial.

---

## 13. Open questions

| # | Question | Decision needed before |
|---|---|---|
| Q1 | Photo in the hero, yes or no? | Hero build |
| Q2 | Contact section background: white or accent color? | Contact build |
| Q3 | Cards clickable in v0, or "Soon" chips? Mix? | Work data wiring |
| Q4 | Domain name. `meghgupta.com`? Something else? | Deploy |
| Q5 | Email address to use in mailto. Personal or new? | Hero & Contact |
| Q6 | Source-on-GitHub: public repo or private? | Footer build |
| Q7 | Eyebrow tag above hero name: include or skip? | Hero build |

Default answers I'd lock unless you push back:
- Q1: Skip in v0 (text-only is faster, more editorial).
- Q2: Accent background for Contact (gives the section visual weight).
- Q3: All 4 Work cards clickable to external URLs; Lab cards mix (some live links, some Soon).
- Q4: `meghgupta.com`.
- Q5: A new dedicated address like `hi@meghgupta.com` or `megh@meghgupta.com`.
- Q6: Public repo (signals openness, costs nothing).
- Q7: Skip the eyebrow in v0 to keep the hero clean.

---

## 14. Out of scope (v1+)

Captured here so we don't relitigate during v0 build:

- Dedicated case study pages with MDX.
- Blog or writing section.
- Newsletter signup.
- Search.
- Dark mode.
- Animations beyond hover transitions.
- Contact form with server-side handling.
- Multi-language support.
- `/now` page.
- Anything that requires a database.

Each of these becomes its own PRD if/when prioritized.

---

## 15. Engineering notes

For the engineer (or Claude Code) building this:

- **Why this PRD exists:** to lock structure before content. Restructuring after launch is expensive; restructuring before content is cheap.
- **System it impacts:** brand-new Next.js app. No existing systems to integrate with.
- **What you're likely building:** ~6 React components, 2 data files (`work.ts`, `lab.ts`), 1 globals.css, 1 page.tsx. Probably ~600 lines of code total for skeleton.
- **Dependencies:** see CLAUDE.md §2. No new deps beyond what's locked.
- **Risks:** (a) scope creep — see §14 list; (b) over-animation — see §8; (c) introducing new design tokens — see CLAUDE.md §3.
- **Definition of done:** §12 acceptance criteria.

---

End of PRD.
