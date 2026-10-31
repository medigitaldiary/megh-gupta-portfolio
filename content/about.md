# About Me — content source of truth

> Everything shown in the About fold, in one editable place. Code lives in
> `components/about-me.tsx` (current direction, used by `/preview/v2`
> and `/preview/v3`) and `components/about-stack.tsx` (older variant,
> still used by `/preview/v1` and `/preview/v2.1`). When copy changes
> here, it needs to be mirrored into the matching component for the
> change to actually ship.

Last updated: 2026-10-29

---

## 1. Current About fold — `components/about-me.tsx`

This is the production direction. Dark edge-to-edge fold: left panel is the intro, right panel is a horizontally-scrolling story track of six personal cards. A quieter "Looking Ahead" panel sits below on the cream surface so the fold doesn't end on dark.

### Left-panel intro

**Fold label (small mono, top-left):**
`06  /  ABOUT ME`

**Eyebrow (above the headline):**
`A LITTLE ABOUT ME`

**Headline:**
Old-school taste. Always something new to explore.

**Intro paragraph:**
Outside work, I like having something to work towards, something to explore, and something to get lost in.

**Handwritten closer (pinned bottom of panel, Kalam font):**
Exploring new places, new ideas, and a better version of myself.

**Portrait (background image behind the intro):**
`/images/about/placeholders/portrait.webp` — placeholder; swap for a real portrait when ready.

---

### Right-panel story track — six personal cards

Each card has an image, a category label, a short heading, and one paragraph. Cards scroll horizontally; a progress bar runs along the bottom.

#### Card 01 — Fitness

- **Category:** Fitness
- **Heading:** Building a hybrid athlete.
- **Copy:** I'm working towards becoming a hybrid athlete. I recently took part in HYROX Delhi and am now training for my next race in Noida this January.
- **Image:** `/images/about/placeholders/fitness.webp`

#### Card 02 — Music

- **Category:** Music
- **Heading:** Musician at heart.
- **Copy:** I play multiple instruments, with a special focus on the guitar.
- **Image:** `/images/about/placeholders/music.webp`

#### Card 03 — Goa

- **Category:** Goa
- **Heading:** A different side of Goa.
- **Copy:** I graduated from BITS Goa in 2025. Some of my favourite memories are of discovering a quieter side of the state, away from the usual tourist trail. If you ever get a month there, rent a two-wheeler, skip the fixed itinerary, and see where you end up.
- **Image:** `/images/about/placeholders/goa.webp`

#### Card 04 — Retro aesthetics

- **Category:** Retro aesthetics
- **Heading:** Old-school by choice.
- **Copy:** I'm drawn to retro bikes, classic cars, and vintage fashion. My GT650 is one of my favourite purchases. I'm not looking to build a collection of bikes. I just love the idea of taking it to new cities and exploring at my own pace.
- **Image:** `/images/about/placeholders/motorcycle.webp`

#### Card 05 — FIFA

- **Category:** FIFA
- **Heading:** FIFA over football.
- **Copy:** I don't follow football much, but I'm always up for a game of FIFA with friends.
- **Image:** `/images/about/placeholders/fifa.webp`

#### Card 06 — Reading

- **Category:** Reading
- **Heading:** Building a reading habit.
- **Copy:** I'm trying to build a more regular reading habit. I'm not a big reader just yet, but it's a habit I'd like to develop over time.
- **Image:** `/images/about/placeholders/reading.webp`

---

### Looking Ahead panel (cream surface, below the dark fold)

**Eyebrow:** `LOOKING AHEAD`

**Heading:**
Financial products, from the ground up.

**Copy:**
Lately, I've been spending more time learning about payments, lending, and the infrastructure behind them. I'm especially curious about GIFT City and its financial ecosystem. Over the next five years, I'd like to work within this ecosystem and explore how we can build consumer-facing financial products for retail investors.

**Side image (right column, desktop only):**
Placeholder — GIFT City / fintech imagery TBD.

---

## 2. Older About section — `components/about-stack.tsx`

Still mounted on `/preview/v1` and `/preview/v2.1`. Simpler layout: portrait on the left, three paragraphs on the right.

**Eyebrow:** `About`

**Heading:**
A bit about me.

**Portrait:**
`/images/about/megh-convocation.webp` — Megh at BITS Pilani K.K. Birla Goa Campus convocation.

**Paragraph 1:**
I'm a product manager at the fintech × AI-tooling intersection. Founding PM at BondScanner, where I'm making the retail bond market feel less like a spreadsheet and more like an app.

**Paragraph 2:**
Before that I was a platform PM at Ultra, running growth loops and reinvestment for their alternative-investment app — the kind of lifecycle work that adds a real ₹50cr of AUM if you get it right.

**Paragraph 3:**
I got into fintech because financial products in India still feel hostile to the person using them. That's the fix I keep chasing. Outside work: I read too much, run in Bangalore weather badly, and vibe-code the tools I wish existed.

---

## 3. Assets map

Current images on disk at `public/images/about/`:

| File | Used by | Notes |
|---|---|---|
| `megh-convocation.webp` | `about-stack.tsx` | BITS Goa convocation portrait (209 KB) |
| `megh-on-green.png` | not currently wired | Dark-background portrait (1.9 MB), could feed `about-me.tsx` intro background once a real portrait replaces the placeholder |
| `placeholders/*.webp` | `about-me.tsx` story cards + intro portrait | Six category images + one portrait — all placeholder, swap for real photos |

---

## 4. Open items (what's missing before this reads as "real")

- [ ] **Real portrait** for `about-me.tsx` intro panel. Currently `placeholders/portrait.webp`. Should feel like Megh, same photographic style as the hero portrait.
- [ ] **Six real story-card images**, one per card, replacing every file in `placeholders/`. Shortlist that'd read well: a HYROX moment, a guitar close-up, a Goa landscape shot, a GT650 photo, a FIFA / console moment, a bookshelf or current-read shot.
- [ ] **GIFT City / fintech side image** on the "Looking Ahead" panel. Placeholder box currently.
- [ ] **Voice check.** Current copy is in Megh's voice but worth a second read: HYROX line (dates), guitar line (feels thin — maybe expand), reading line (hedged — tighten).
- [ ] **Mirror into mirror component.** If this doc is edited, update `about-me.tsx` and/or `about-stack.tsx` in the same PR so the shipped site matches.

---

## 5. How to use this file

- When Megh asks for an About copy change, edit this file first, then port the change into the matching component in the same PR.
- When a photo arrives, drop it in `public/images/about/`, update the component to point at it, and tick the box in §4.
- When the About fold's structure changes (new card, re-ordered sections), reflect that here before touching the code.

End of file.
