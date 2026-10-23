# STYLE.md

> **Rule book for all prose on this portfolio.** Covers case studies, UI copy, frontmatter, commit messages, and PR descriptions. Lives at the repo root so it's visible to anyone who clones the site. Loaded by `CLAUDE.md` §10.

## 1. No em dashes. Zero. Anywhere.

The em dash (`—`, U+2014) is a cheap way to make prose sound considered when it isn't. This portfolio bans it everywhere: case studies, inline UI copy, frontmatter, commit messages, PR descriptions, and alt text.

### What to use instead

Pick the replacement that matches what the sentence is actually doing.

| What the em dash was doing | Use this instead | Example |
|---|---|---|
| Starting a new, independent thought | **Period + new sentence.** | ~~"Shipped in Q1 — the engine compounded."~~ → "Shipped in Q1. The engine compounded." |
| Introducing an elaboration or list | **Colon.** | ~~"Three pillars — editorial, dictionary, programmatic."~~ → "Three pillars: editorial, dictionary, programmatic." |
| Setting off a short parenthetical aside | **Comma(s).** | ~~"Rohit, a prospect — curious about the bond — asked for a callback."~~ → "Rohit, a prospect curious about the bond, asked for a callback." |
| A longer parenthetical the sentence can live without | **Parentheses.** | ~~"The compliance agent — built on top of Strapi — reviews each blog."~~ → "The compliance agent (built on top of Strapi) reviews each blog." |
| A range (Month Year to Month Year, number to number) | **"to"** | ~~"Jan 2026 — Q2 2026"~~ → "Jan 2026 to Q2 2026" |
| A title and subtitle | **Colon or period, pick for rhythm.** | ~~"BondScanner Watchlist — a daily digest that stuck"~~ → "BondScanner Watchlist: a daily digest that stuck" |

### What's still allowed

- **Hyphens** (`-`): compound modifiers, word joins (full-time, product-led, nightly-batch).
- **En dashes** (`–`): ranges in tables where "to" is awkward (pp. 42–47). Prefer "to" in prose anyway.

### Why the ban

The em dash lets you avoid a decision about structure. "Should this be two sentences?" "Does this clause need parentheses?" The em dash papers over the question and reads as a stylistic tic. Picking the right punctuation makes the sentence commit to a shape.

### Enforcement

- `grep -rn "—" content/ app/ components/ lib/` must return zero hits on the content layer. Code comments are not enforced.
- CI check (TODO): fail a PR that introduces an em dash in `content/**/*.mdx` or in strings in `app/**` and `components/**`.
- Reviewers: flag any em dash on sight; it's never the right call on this project.

## 2. Headings

Sentence case, not Title Case. "A product-led SEO engine" not "A Product-Led SEO Engine." The one exception is a proper noun that happens to start a heading.

## 3. Numbers

- Numbers earn their place by changing the reader's belief. If removing a number wouldn't change the point, remove the number.
- Always carry the denominator. "15% improvement" with no denominator is noise. "~2x daily organic clicks" is a sentence.
- Never attribute total growth to a single initiative when multiple initiatives shipped together. Separate the claims.
- Illustrative numbers in a demo must be labelled `[illustrative]` or `illustrative`. Fabricated-looking numbers that aren't labelled read as dishonest.

## 4. Attribution

Case studies always end with an ownership breakdown that distributes credit. "I owned X" is better than "I owned everything." If the project was genuinely solo, say so and move on; don't inflate it.

## 5. Voice

- First person active. "I built", "I decided", "we stopped."
- No "passionate about", "results-driven", "synergy", "leverage" (as a verb), "unlock" (as a verb), "move the needle", "deep dive" (as a noun), "touch base", "circle back."
- Short sentences. Average 15 words. If a sentence runs past 25, split it.
- Match the tone the surrounding codebase already uses. If something feels off, read a committed MDX file and match its voice.

## 6. Case study specifics

- Rubric-change caveats and other "the number isn't what it looks like" cautions go **directly next to the number**, not in a footnote.
- Illustrative transcripts, screenshots, and output shapes carry an `[illustrative]` label.
- "Nothing here was a formal validation study" is a sentence that belongs on any page where it's true. Say it and move on.
