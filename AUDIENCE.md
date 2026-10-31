# AUDIENCE.md

> Who this website is for. Extracted from `PRD.md §1–2` so the audience
> and the specific journeys they take through the site live in one place
> that's easy to open, read, and reference when deciding what to build
> and what to cut.

Last updated: 2026-10-31

---

## 1. Who the site serves

A single-page personal portfolio for **Megh Gupta**, Product Manager at the fintech + AI-tooling intersection. One job: **move the right reader from "who is this" to "I want to talk" inside 60 seconds**, and give a deeper reader enough to book a call.

Three primary audiences. Everything on the site is scored against these three.

### Audience 1 — Recruiters at VC-backed fintechs and AI-first startups

- Finds Megh via LinkedIn Recruiter, candidate databases, an email signature, or a referral forward.
- Reads for shape, not depth. Wants a credibility check in about 60 seconds.
- Scoring question: "Can I pitch this candidate to a hiring manager tomorrow?"

### Audience 2 — Hiring PMs and founders scouting an early / founding PM

- Comes in with context (saw a LinkedIn post, got a warm intro, read a case study link).
- Reads for depth and judgement. Wants to understand *how* Megh thinks before scheduling time.
- Scoring question: "Would I enjoy a hiring conversation with this person?"

### Audience 3 — Warm intros from LinkedIn / X / referrals

- Was told to "take a look" by someone who already vouched for Megh.
- Confirming they're not about to make a bad intro.
- Scoring question: "Does this embarrass the person who sent me here?"

---

## 2. User journeys — what each audience actually does on the page

Numbered steps are the actual scroll pattern, not what we wish they'd do.

### 2.1 The recruiter — 60-second skim

1. Lands on `/` from LinkedIn or an email signature.
2. Reads the hero: name, one-line identity, intro, one CTA.
3. Skims Experience for trajectory, then Selected Work for the headline metric on each card (`2×`, `+15pp`, `2 months`, `5.2 → 6.0`).
4. Clicks `Let's connect →`.

**Success:** a message or email reaches Megh within 60 seconds of first load.

**What this journey needs:**
- Numbers above the fold on every work card.
- One CTA, not three.
- No visual noise that costs scanning time.

### 2.2 The hiring PM — 5-minute deep read

1. Reads the hero, scans Experience.
2. Reads every Work card in full: role, timeline, description, metric.
3. Scrolls The Lab to gauge technical range, reads a Writing entry or two.
4. Reads About (and the Stack row inside it), then hits Let's connect.

**Success:** a first-round conversation booked.

**What this journey needs:**
- Honest attribution on every number (what Megh owned vs. the team).
- The Lab must prove technical range, not just list links.
- Voice in About has to feel like a real person, not a résumé.

### 2.3 The warm intro — name-drop check

Lands, confirms it looks credible (design, real numbers, real logos: BondScanner, Ultra), forwards it on.

**Success:** the site doesn't embarrass the intro.

**What this journey needs:**
- Working OG card when someone pastes the URL into Slack / email / LinkedIn.
- No broken links. No "coming soon" placeholders where numbers should be.
- Zero typos in the first fold.

### 2.4 The mobile scroller — ~60% of traffic

Same as above on a phone. Nav collapses to a hamburger, folds stack, cards go single-column, no horizontal scroll at 375px.

**What this journey needs:**
- Font hierarchy that holds up at 375px (per CLAUDE.md §3 fluid-type rule).
- Tap targets ≥ 44px.
- Images optimised; no 2 MB PNGs on 3G.

---

## 3. Journeys the site deliberately does NOT serve yet

These exist in the roadmap but aren't scored during current builds:

- **Deep-dive on a specific case study.** `/work/[slug]` pages are phased, not v1.
- **Reading the archive.** `/writing` index isn't built; individual pieces still live offsite until that fold ships.
- **Booking a call directly.** Calendly / Cal.com not wired; `mailto:` is the current primary channel per CLAUDE.md.

Flagged here so no one adds a journey to the site in a PR without noticing it was explicitly deferred.

---

## 4. How to use this file

- **Before building a feature:** does it serve one of the three audiences above? If no, delete the ticket.
- **Before adding copy:** is this what the recruiter / hiring PM / warm intro needs at this scroll depth? If no, cut it.
- **Before shipping a change:** did the mobile scroller (60% of traffic) just lose anything? If yes, redesign the breakpoint.

The audience doesn't change often; this file shouldn't need frequent updates. When it does change (new target audience, dropped audience, shifted priorities), update `PRD.md §1–2` in the same PR so the two stay in sync.

End of file.
