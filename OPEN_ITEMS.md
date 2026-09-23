# Open Items

Living punch list of everything blocking a clean portfolio launch. Anything that gets a real answer moves to the PRD (locked) or the code (shipped) and comes off this list. Anything new that lacks an owner or a decision belongs here.

Last updated: 2026-09-22 (post PR #18 merge — /preview/v1 shipped).

---

## 1. Blocking launch (must land before we merge /preview/v1 → /)

1. **Real portrait.** Currently a monogram placeholder (`MG` on accent tint) in About. Ship a proper photo — square crop, off-white or accent-tinted bg, ~500×500 exported to WebP, drop at `public/images/about/megh.webp`, wire into `components/about-stack.tsx`.
2. **Real About prose.** The 3-paragraph draft in `components/about-stack.tsx` is in the right shape but needs your voice. Rules: identity → current → prior → one personal line, warm-but-specific, no "passionate about."
3. **Real Writing entries.** `lib/writing.ts` has 4 seed titles + excerpts, no bodies. Either author 4–6 real entries (per PRD §7.5 launch order) or hide the fold at launch until 3 are ready — the section auto-hides if fewer than 3 published.
4. **Real external URLs on every Work card.** All 4 cards in `lib/work.ts` currently point at `#`. Fill `externalUrl` with the deck / PRD / Loom / dashboard for each, or wait for `/work/[slug]` detail pages (PRD §6.2).
5. **Real external URLs on every Lab card.** Same problem in `lib/lab.ts` — 6 cards, all `#`. Every Lab entry needs a real `url` per PRD §7.4.
6. **Real social URLs in the Connect fold.** LinkedIn is real; X, GitHub, Read.cv are `#` in `components/contact.tsx`. Fill them or drop the row.
7. **Connect fold delivery decision.** Pick one per PRD Appendix A — Cal.com (meetings), Tally (messages), or Resend + custom (full control). Currently the fold is mailto-only. Recommendation stands: Cal.com if the goal is meetings, Tally if the goal is messages.
8. **Real MoveInSync bullets in `lib/experience.ts`.** One entry has a literal `TODO:` string as its bullet. Replace with real 2–4 bullets from your résumé, or drop the entry from v1.

## 2. Infra / domain

9. **`hi@meghgupta.in` mailbox — confirm it exists.** Called out in PRD §0. If the mailbox isn't live, everything on the site that says `hi@meghgupta.in` needs to fall back to `megh.bpgc@gmail.com`. Do this before the domain goes wide.
10. **`meghgupta.in` DNS on Vercel — confirm live.** PRD §5.8. Verify `www.meghgupta.in` resolves, apex 308-redirects, cert is valid.
11. **Verify `@vercel/analytics` and `@vercel/speed-insights` are actually mounted in `app/layout.tsx`.** PRD §6.1. Check the network tab in prod — the pings should fire.

## 3. Open decisions still pending

12. **The Lab: 3-kind taxonomy vs. hostable try-it tools.** Flagged in PRD §0 and §7.4. Current spec (and current build) ships the 3-kind taxonomy (skill-file / personal-tool / github-project) with outbound links. The parallel idea is a Kashwi-style wall of hostable mini-apps (bond decoder, FD-vs-bond, Bonds Wrapped). Different section, different build. Pick one before investing more in Lab.
13. **When to promote /preview/v1 → /.** Right now `/` is coming-soon and the real portfolio lives at `/preview/v1` (noindex). Launch = swap `app/page.tsx` to render the v1 folds and remove noindex. Trigger: items 1–8 above are green.

## 4. Deferred (parking lot — don't work without asking)

Explicitly out of scope for v1 per PRD §6.4. Not "open" — listed here so nobody re-opens them by accident:

- Dark mode
- CMS
- On-site search (revisit past ~15–20 entries)
- Framer Motion / heavy animation
- Testimonials, newsletter signup, "logos I've worked with" strip, stat-tile rows
- Case-study detail pages (`/work/[slug]`) — planned, but only after real deck/PRD/dashboard links exist to point at
- `/lab` index, `/writing` index — planned, but only after homepage folds are validated

## How to use this file

- When you close an item, delete the line. Don't leave `~~struck-through~~` clutter — the git history is the record.
- When a new open question surfaces mid-build, add it here immediately, not in chat.
- When an item gets a real answer, the answer belongs in the PRD or in code — not here.
