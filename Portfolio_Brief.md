# Megh Gupta — Portfolio Website Brief

*v0.1 · Working draft · Iterate ruthlessly*

---

## 1. Why this website exists

You're in active job search. A recruiter or hiring PM lands on this site after seeing your resume, LinkedIn, or a referral DM. You have **under 60 seconds** before they bounce. The site has to do three jobs in that window:

1. **Signal range** — fintech 0→1, growth, internal tooling, AI fluency.
2. **Prove velocity** — you ship. A lot. End-to-end.
3. **Make them want to talk to you** — a clear next step, not a dead end.

Everything else is decoration.

---

## 2. Positioning (the one-liner)

The reference site (Kashwi's) leans on "*storytelling meets technology*" — that's her angle.

Yours is sharper and different. You should own:

> **"PM who ships — fintech 0→1, growth loops, and AI tools built end-to-end."**

Or, if you want it warmer / more narrative:

> **"I build fintech products and the AI tools that run them. Currently at BondScanner, India's SEBI-regulated bond platform."**

Pick one direction. The first is for recruiters skimming. The second invites a read. I'd test the second on the homepage and the first as the meta description.

---

## 3. Site map (recommended)

A flat, single-page-with-anchors structure. No deep nav. Recruiters hate clicks.

```
/                          → Home (hero + featured work + about + contact, all on one scroll)
/work/seo-engine           → Case study: Product-led SEO at BondScanner
/work/ai-call-analysis     → Case study: AI call analysis pipeline
/work/ultra-reinvestment   → Case study: 55%→70% reinvestment at Ultra
/work/ultra-web-app        → Case study: 4-phase web rollout
/work/bondscanner-launch   → Case study: 0→1 founding PM launch
/lab                       → Side projects / vibe-coded experiments
/about                     → Longer-form about (optional)
```

Six case study pages is the cap. Anything beyond that, link the case-studies doc as a PDF.

---

## 4. Page-by-page structure

### 4.1 Home (single scroll)

**Section A — Hero**
- Name + role one-liner (positioning statement above).
- Sub-line: where you are now, what you're looking for.
- Two CTAs: `See selected work` (scrolls down) + `Get in touch` (email/Calendly).
- Optional: a single playful line of personality. Kashwi does this well — yours could be something like *"Currently obsessed with: shipping internal tools faster than meetings can be scheduled."*

**Section B — Selected work (4 cards)**
Pick the 4 strongest. My recommendation:

| # | Case study | Why it makes the cut |
|---|---|---|
| 1 | **Product-led SEO engine at BondScanner** | 2x organic clicks, 350+ blogs, 26K+ programmatic pages. Most quantifiable + most differentiated. |
| 2 | **AI call analysis pipeline** | Vibe-coded end-to-end. Shows AI fluency + ops impact (15% quality lift). |
| 3 | **App hygiene + PMM automations at Ultra** | 55%→70% reinvestment, +15pp retention. Cleanest growth story. |
| 4 | **BondScanner 0→1 launch** | Founding PM, regulated build, shipped in 2 months. Shows scope ownership. |

Each card: title, one-sentence outcome with the headline number, 3 tags (e.g. `Fintech · Growth · 0→1`), thumbnail or muted background graphic.

**Section C — About (short)**
3-4 sentences. Where you are now (BondScanner), where you've been (Ultra), what you care about (0→1, growth loops, AI tooling), and what you're looking for. No more.

**Section D — The Lab**
A teaser grid (3 items, 1 line each) of vibe-coded side projects. Link to `/lab` for the full set.

**Section E — Contact**
Email, LinkedIn, Twitter/X if you use it, GitHub if you want to show the vibe-coded repos. One line: *"Currently interviewing for PM roles at VC-backed fintechs and AI-first startups. Drop a note."*

---

### 4.2 Case study page template

This is the reusable template — same skeleton for all 4-6 case studies. Keep them **scannable in 30 seconds, deep in 5 minutes**.

```
Title (action-oriented, with the headline metric)
   e.g. "How we 2x'd organic traffic at BondScanner in 3 months"

Meta strip
   Role · Timeline · Team · Stack/tools

TL;DR (3 bullets, above the fold)
   • What I built
   • What changed (the metric)
   • What I owned

Context (the problem worth solving)
   2-3 short paragraphs. Why this mattered to the business.

Approach (how I thought about it)
   Numbered list or 2-3 subsections. Show the decision logic, not the activity log.

Execution (what we shipped)
   Screenshots, Figma embeds, Loom links, architecture diagrams.
   This is where proof artifacts live.

Outcome (what changed)
   Headline metric + 2-3 supporting numbers + qualitative wins.

Reflection (what I'd do differently)
   1 paragraph. Demonstrates self-awareness. Recruiters love this.

What I owned vs. what the team owned
   1-2 lines. Honest attribution. (Per your preference — keeps you credible.)
```

The **"what I owned vs. team owned"** line is your differentiator. Most PM portfolios overclaim. Yours doesn't. That's a feature, not a bug.

---

### 4.3 The Lab (`/lab`)

This is the section that separates you from every other PM portfolio. You vibe-code. Show it.

Grid of cards, ~6-10 items:
- **Job search OS** (Claude Code + Supabase + Google Tasks MCP)
- **Interview prep system** (Notion + Claude, 16-topic structured prep)
- **Bond Dictionary** (live on BondScanner — link out)
- **Compliance content tool** (Claude API, no-code)
- **Call analysis pipeline** (Sarvam + Claude)
- **Internal AI tools** (Deal QC, blog compliance, task agent)
- **MoEngage MCP workflows**
- Any personal experiments

Each card: title, 1-line description, stack tags, live link or repo if shareable.

Frame this section with a single line: *"Things I built when a tool didn't exist or moved too slow."*

---

## 5. Visual direction

Kashwi's site is **light, editorial, narrative**. You can either:

**Option A — Editorial cousin**
Similar light palette, serif headlines, lots of whitespace, but with **numbers as design elements** (big "2x", "55→70", "₹50Cr" as typographic anchors on case study cards). This positions you as a thoughtful builder.

**Option B — Builder / Lab aesthetic**
Darker, monospace accents, terminal-inspired touches in the Lab section. Closer to a dev portfolio. Differentiates you from the typical PM portfolio crowd, but riskier if hiring managers expect "polished PM."

I'd recommend **Option A with subtle builder touches** — editorial 80% of the time, monospace tags + terminal-style code blocks in the Lab section only. Best of both.

**Type & color (starting point):**
- Headlines: a strong editorial serif (e.g. Instrument Serif, Fraunces) or a clean geometric sans (e.g. Inter Display, General Sans).
- Body: Inter or Geist.
- Code/tags: JetBrains Mono or Geist Mono.
- Palette: off-white background (#FAFAF7), near-black text (#111), one accent color — I'd suggest a muted bond-paper green (#1F4D3A) or a deep terracotta (#B5503C) to differentiate from the default fintech blue.

---

## 6. Tech stack recommendation

You have three credible options:

| Stack | Pros | Cons | Verdict |
|---|---|---|---|
| **Lovable** (matches Kashwi) | Ship in a weekend. Visual builder. | Less control over animations / niche layouts. Vendor lock-in. | Good if you want it live this week. |
| **Next.js + Tailwind + Vercel + MDX** | Full control. Case studies as MDX = easy to add. Free hosting. Fits your vibe-coding workflow with Claude Code. | 1-2 weekends of build time. | **Recommended.** |
| **Framer** | Designer-friendly, fast, good animations. | Subscription cost. Less developer-y. | Skip — Next.js gives you more leverage long-term. |

**MDX** is the unlock for case studies. You write each case study as a markdown file with embedded React components for screenshots/charts. Adding a new case study = adding a new `.mdx` file. No CMS needed.

**Recommended stack:**
- **Next.js 15** (App Router)
- **Tailwind CSS** + **shadcn/ui** for components
- **MDX** for case studies
- **Vercel** for hosting (free, instant deploys from GitHub)
- **Plausible** or **Vercel Analytics** for traffic (privacy-friendly, no cookie banner needed)
- **Resend** or just a `mailto:` for contact

---

## 7. Build plan (1-2 weekend timeline)

**Weekend 1 — Skeleton + home page**
- Sat AM: Set up Next.js repo, deploy empty site to Vercel, point domain.
- Sat PM: Build hero, about, contact sections. Pick fonts and palette.
- Sun AM: Build the 4 featured work cards (no case study pages yet — they 404 for now).
- Sun PM: Polish mobile responsiveness. Get it live.

**Weekend 2 — Case studies + Lab**
- Sat: Write + ship 2 case studies (SEO engine, AI call analysis).
- Sun AM: Write + ship 2 more case studies (Ultra reinvestment, BondScanner launch).
- Sun PM: Build the Lab page. Add 6-8 side projects.

**Post-launch (rolling)**
- Plug in real screenshots, Figma embeds, Loom videos where placeholders exist.
- Add a case study every 2-3 weeks until you've covered the top 6.
- Add a `/now` page (à la nownownow.com) that you update monthly — signals you're alive and shipping.

---

## 8. Content checklist (what you need to gather)

Pull these from your case studies doc and your existing assets:

- [ ] Headshot (1 good photo, casual not corporate)
- [ ] 4-6 case study hero images / screenshots (Figma exports, dashboard screenshots, product shots)
- [ ] GSC screenshot for SEO case study (the 2x growth chart)
- [ ] Bond Bytes performance chart
- [ ] Reinvestment rate before/after chart (Ultra)
- [ ] 1-2 Loom walkthroughs for visual case studies (Ultra Web App, Early Payout)
- [ ] Architecture diagram for AI call analysis pipeline
- [ ] Logo or wordmark for BondScanner / Tap (with permission)

The proof artifacts are mostly already gathered in your case studies doc. The work is sequencing them into the page template, not creating them.

---

## 9. Things to avoid

- **Don't use generic stock illustrations.** Real screenshots > Figma mockup illustrations > stock.
- **Don't over-animate.** One subtle scroll fade is plenty. No parallax circus.
- **Don't bury the metrics.** Numbers belong above the fold on every case study.
- **Don't write paragraphs.** Tight bullets > long prose for PM portfolios. Recruiters scan.
- **Don't list every project.** 4-6 case studies + a Lab grid is the sweet spot. More dilutes.
- **Don't fake the artifacts.** If a Figma file or Loom doesn't exist yet, write a 1-line description in its place rather than a fake screenshot. Your "honest attribution" preference applies here too.

---

## 10. Open decisions to lock before building

A short list of things you should decide before writing a line of code:

1. **Domain name** — `meghgupta.com`? `meghbuilds.com`? Something else? Buy now even if you build later.
2. **Positioning line** — pick one of the two in Section 2, or write a third.
3. **Featured case studies** — confirm the 4 I picked, or swap one in.
4. **Aesthetic direction** — editorial vs. builder vs. hybrid (I'd vote hybrid).
5. **Tech stack** — Lovable (fast) vs. Next.js (controllable). I'd vote Next.js.
6. **What you're looking for** — explicit on the site, or implicit? I'd vote explicit ("currently interviewing for PM roles at VC-backed fintechs and AI-first startups").
7. **Contact mechanism** — `mailto:` vs. Calendly vs. form? `mailto:` is simplest, Calendly signals you're available.

---

### PM Takeaway

A portfolio site is a **conversion funnel**, not a museum — your top job is moving a recruiter from "skimming" to "I want to talk." That means the homepage carries 80% of the work (hero + 4 case studies + contact), case study pages are templated so adding new ones is cheap, and the Lab section is your unfair advantage because it shows you can build, not just spec. Tech-wise, **Next.js + MDX on Vercel** gives you a free, owned, infinitely extensible foundation that fits your existing Claude Code workflow — every new case study is just one more `.mdx` file in your repo.

### Technical Terms

- **MDX** → Markdown with React components mixed in. Lets you write case studies in plain text but embed interactive charts or screenshots inline. Like writing a Google Doc that can also run code blocks.
- **Next.js** → A React framework that handles routing, server-rendering, and deployment out of the box. The default choice for content-heavy modern websites.
- **Vercel** → The company behind Next.js; also hosts your site for free with auto-deploys from GitHub. Push code → site updates in 30 seconds.
- **shadcn/ui** → A library of pre-built, copy-pasteable React components (buttons, cards, modals) styled with Tailwind. You own the code, not a dependency. Like IKEA furniture with the assembly already done.
- **Tailwind CSS** → A styling system where you write class names like `text-xl font-bold mt-4` directly in your HTML instead of writing separate CSS files. Faster to build, easier to maintain.
- **Plausible / Vercel Analytics** → Privacy-friendly alternatives to Google Analytics. No cookies, no banners, no GDPR headache — just clean traffic numbers.
- **App Router** → The modern routing system in Next.js 15. Folders become URLs (`/work/seo-engine` is a folder called `seo-engine` inside `work`). Intuitive once you see it.
- **Single-page-with-anchors** → A homepage where clicking nav links scrolls you to sections instead of loading new pages. Feels fast, feels modern, perfect for portfolios.
