# Design System

> Single source of truth for the portfolio's visual language. Values here are mirrored from `app/globals.css` and `app/layout.tsx` — code is still the authority; this file keeps the design intent legible outside the codebase. Update both in the same PR when a token changes.

---

## 1. Color tokens

Defined on `:root` in `app/globals.css` and exposed to Tailwind as `--color-*` via `@theme inline`. One accent, one page bg, one elevated bg, three text weights, one border. No other colors in the site chrome.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FAFAF7` | Page background — off-white, never pure white |
| `--bg-elevated` | `#FFFFFF` | Cards, modals, the nav pill |
| `--fg` | `#111111` | Primary text, strong icons |
| `--fg-muted` | `#555555` | Secondary text, inactive nav labels |
| `--fg-subtle` | `#999999` | Meta strip, eyebrows, captions |
| `--border` | `#E8E6E0` | Hairlines, card outlines |
| `--accent` | `#1F4D3A` | Bond-paper green — headline metrics, primary CTAs, Contact bg |
| `--accent-fg` | `#FAFAF7` | Text on accent backgrounds |

### Scoped sub-palettes

Reserved for one specific component each. Not available to the rest of the site.

- **Product Venn (`components/product-venn.tsx`)**
  - `--venn-user` `#C1497F` · `--venn-tech` `#4A72B0` · `--venn-biz` `#C77E3B` · `--venn-cream` `#FDF7EE`

- **Lab fold** — Rick & Morty palette, hard-coded inline in `components/lab-portal.tsx` and `lab-scene.tsx` because this fold deliberately breaks system to carry its own atmosphere (portal green `#6EE7A0`, bulb amber, etc). Treat it as a self-contained micro-system; do not promote these to global tokens.

### Rule

If a design needs a fifth system color, ask first. New brand colors for an off-system component (e.g. LinkedIn `#0A66C2` on the nav icon) are allowed as inline Tailwind arbitrary values at the point of use — never promoted to `:root`.

---

## 2. Typography

Three faces, loaded via `next/font/local` from `/public/fonts/` so there's no third-party network hop.

| Face | Role | CSS variable | Where it loads |
|---|---|---|---|
| **Oswald** (Variable, 200–700) | Display: all H1 / H2 / H3, headline metrics | `--font-oswald` (aliased to `--font-serif`) | `public/fonts/Oswald-Variable.woff2` |
| **Satoshi** (Variable, 300–900, with italic axis) | Body: nav, buttons, sub-heads, running prose | `--font-satoshi` (aliased to `--font-sans`) | `public/fonts/Satoshi-Variable.woff2` + `Satoshi-VariableItalic.woff2` |
| **JetBrains Mono** | Eyebrows, stack chips, work-card category tags | `--font-jetbrains-mono` | Google Fonts (`next/font/google`) |
| Kalam | Rare handwritten accent (Product Venn labels) | `--font-hand` | Google Fonts |

### Why self-host Oswald + Satoshi

Oswald is on Google Fonts, Satoshi isn't. Loading both locally keeps the stack consistent and removes one third-party DNS/TLS round-trip. The OG image at `/opengraph-image` additionally ships `Satoshi-Medium.ttf` because Satori (behind `next/og`) rejects WOFF2.

### Type scale (Tailwind tokens, from `globals.css`)

| Token | Size | Line-height | Face | Role |
|---|---|---|---|---|
| `text-display` | 4rem / 64px | 1.05 | Oswald | Hero headline only |
| `text-h1` | 2.5rem / 40px | 1.10 | Oswald | Case study title |
| `text-h2` | 1.75rem / 28px | 1.20 | Oswald | Section headings |
| `text-h3` | 1.25rem / 20px | 1.30 | Satoshi Semibold | Sub-heads |
| `text-body` | 1rem / 16px | 1.60 | Satoshi Regular | Running text |
| `text-small` | 0.875rem / 14px | 1.50 | Satoshi Regular | Captions, chip text |
| (mono utility) | 0.875rem / 14px | 1.50 | JetBrains Mono | Eyebrows, tags |

### Conventions

- Headlines (Oswald) are uppercase + tracking tight on Hero / OG card, title case elsewhere.
- Body line-height stays at 1.6 for readability over density. 1.5 only when a specific component asks for a more editorial feel.
- Mono eyebrows use `letter-spacing: 0.08–0.18em` and `text-transform: uppercase`.
- Case study prose caps at `max-w-2xl` for readability.

---

## 3. Spacing & layout

Tailwind defaults for everything (`p-4`, `gap-8`, `space-y-6` …). No custom spacing scale.

### Homepage rhythm

- Section vertical padding: `py-24 md:py-32`.
- Section horizontal padding: `px-6 md:px-8`.
- `max-w-5xl` on homepage sections; `max-w-6xl` on the nav; `max-w-2xl` on case-study prose.
- Nav height: `h-16 md:h-[72px]`.
- Scroll offset for anchored sections: `scroll-margin-top: 80px` (so hash navigation clears the nav).

### Fold rule (CLAUDE.md §14)

The homepage is a sequence of ~100svh folds. Each fold has one job, named in a comment above its `<section>`. Never chain two unrelated ideas into one fold. Mobile stacks folds vertically; order never reorders by breakpoint.

### Shelf layout (Selected Work)

6 cards. Grid: `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6`. Books lean on alternating sign per `leanDeg`; the hairline + shadow element below is the "shelf."

---

## 4. Motion

**Sparing.** The default is "no animation." Add one only when it serves comprehension.

### Allowed

- Fade-up on scroll for section reveals (pure CSS; no `framer-motion`).
- 150ms ease-out hover transitions on cards and links.
- Nav collapse — 400ms cubic-bezier(0.22, 0.61, 0.36, 1) fade + 40px slide on left/right sections. See `components/nav.tsx`.
- Scoped animations inside `/components/lab-scene.tsx` (bubbles, bulb flicker, portal) — enclosed by `.lab-*` class names, never leak globally.

### Rules

- Everything respects `prefers-reduced-motion: reduce`. The CSS block in `globals.css` is explicit.
- Scroll handlers that drive animation state are `rAF`-throttled so React state flips land on frame boundaries, not mid-paint.
- Any element animating `transform` or `opacity` carries `will-change-[transform,opacity]` so it lives on a compositor layer.

### Not allowed without explicit ask

Parallax, scroll-jacking, cursor-tracking glows, page transitions, animated gradients, animated `backdrop-filter` toggles (the last one causes composited-layer rebuilds and reads as jank).

---

## 5. Component patterns

### Buttons / CTAs

- Primary CTA: `rounded-full bg-accent px-5 py-2.5 text-sm text-accent-fg hover:opacity-90`.
- Secondary / icon chip: `rounded-full border border-border bg-bg-elevated` with hover shifting color only.
- Brand-color exception: LinkedIn chip uses `text-[#0A66C2]` at rest with blue border tint; hover fills solid blue (`bg-[#0A66C2]` + white icon).

### Cards

- Base: `rounded-xl border border-border bg-bg-elevated p-6 md:p-8`.
- Use border, fill, radius, shadow selectively — not on every block.

### Nav pill

- `rounded-full border border-border bg-bg-elevated p-1`.
- Outer bar is always transparent; the pill carries its own weight.
- Active tab: `bg-bg text-fg shadow-sm`; inactive: `text-fg-muted hover:text-fg`.
- `activeId` clears when `scrollY ≤ 80` — no tab highlighted on the hero fold.

### MDX case study page (`/work/[slug]`)

- Title in Oswald, 40–56px.
- Headline metric strip in a `rounded-xl border border-border bg-bg-elevated` card at top.
- Body prose wrapped in an `article` with per-element Tailwind arbitrary variants (`[&_h2]:…`, `[&_p]:…`) rather than a `@tailwindcss/typography` plugin — fewer deps.

---

## 6. Theming

Single light theme locked. No dark mode. The published `<meta name="theme-color" content="#FAFAF7">` matches the page bg, so iOS browser chrome blends into the site.

If dark mode comes back on the table it reopens as a separate design review — not a 2-token hex swap.

---

## 7. SEO & head baseline (summary)

Full spec lives in CLAUDE.md §15. Every page inherits from `app/layout.tsx`:

- Title with `%s | Megh Gupta` template, canonical URL, `index, follow`.
- OG card at 1200×630 generated by `/opengraph-image` (Oswald + Satoshi).
- JSON-LD `@graph`: Person + WebSite + ProfilePage; case studies extend with `Article`.
- Discovery block: `rel="alternate"` for `.md`, `/llms.txt`, `/AGENTS.md`, `/sitemap.xml`.
- Favicon: `app/icon.svg`.

New page types add overrides on top; they never subtract from this baseline.

---

## 8. What NOT to do

Hard rules, surfaced here so the design doesn't drift:

- No hardcoded hex outside `globals.css`, except for a single-use brand color at the point of use (LinkedIn) or a scoped sub-palette (Venn, Lab).
- No new fonts. The three-face system is locked.
- No inline `style={{ ... }}`. Tailwind classes only.
- No dark mode variant.
- No motion library unless the task explicitly asks and we can't do it in pure CSS.
- No parallax, no scroll-jacking, no cursor-tracking effects.
- No `@tailwindcss/typography` — prose styling stays inline per route so the type system doesn't fork.

---

## 9. When to update this file

- A `:root` token value changes in `globals.css`.
- A new face is added or an existing one swapped.
- A new system component ships that establishes a new recurring pattern (not a one-off).
- CLAUDE.md §3 or PRD.md §4 is edited.

Same PR as the change. Stale docs beat no docs, but current docs beat stale ones.
