# Claude Code Kickoff Prompt — Portfolio Skeleton v0

> **How to use:** Open a new Claude Code session in an empty directory. Attach `CLAUDE.md`, `Skeleton_PRD.md`, and optionally `Megh_Gupta_PM_Case_Studies.docx`. Paste the block below as your first message.

---

## The prompt

```
You're my senior full-stack engineer for this session. We're building the v0 skeleton of my
personal portfolio website. I'm a Product Manager (fintech, growth, AI tooling) — not a
professional engineer, but I vibe-code and understand what I'm looking at.

# What's attached

1. CLAUDE.md — the operational config. Locked stack, design tokens, repo structure,
   conventions, anti-patterns, and a natural-language → task translation table. This file
   is authoritative on HOW we build.

2. Skeleton_PRD.md — the spec for what we're building this session. Structure, component
   specs, responsive behavior, acceptance criteria. This file is authoritative on WHAT
   we build.

3. Megh_Gupta_PM_Case_Studies.docx (optional) — source material for populating placeholder
   content on the 4 Work cards. Use for titles, headline metrics, and tags only in v0.
   Don't write full case study content yet.

# Read order (do this before writing any code)

1. Read CLAUDE.md fully. It's short and every section matters.
2. Read Skeleton_PRD.md fully, especially §3 (goals/non-goals), §6 (component specs),
   §12 (acceptance criteria), and §13 (open questions with default answers).
3. If the case studies doc is attached, skim it for the 4 case studies referenced in
   PRD §6.3: seo-engine, ai-call-analysis, ultra-reinvestment, bondscanner-launch. Pull
   the title, headline metric, and 2-3 tags for each. Ignore the rest for now.

# What "skeleton" means for this session

Ship a deployable v0 with:
- All 6 sections rendering in correct positions (Hero, Work, Lab, About, Contact + Nav & Footer).
- Final layout, spacing, typography, colors — locked per CLAUDE.md §3.
- Final responsive behavior at 375px, 768px, 1440px.
- Placeholder content where real content is missing. Mark placeholders with a
  `{/* TODO: real copy */}` comment so I can grep them later.
- Meets ALL acceptance criteria in Skeleton_PRD.md §12.

Do NOT write real case study content, real About prose, or invent copy that pretends to be
mine. Placeholder is fine and expected. Real content comes in a later session.

# Locked defaults for open questions

Skeleton_PRD.md §13 lists 7 open questions with default answers. Apply the defaults unless
I've said otherwise in this session:
- No photo in hero
- Accent background for Contact section
- All 4 Work cards clickable (use `#` as placeholder href until I provide real URLs)
- Domain: meghgupta.com (for metadata only; I'll wire DNS later)
- Email: hi@meghgupta.com (placeholder, I'll swap)
- Public GitHub repo assumed
- No eyebrow tag above hero name

If any of these feel wrong given something you spot in the docs, flag it before implementing.

# How to work with me this session

1. Start by proposing a plan, not code. Give me a numbered checklist of what you'll build,
   in order, with rough time estimates. Wait for my go-ahead.

2. Once I approve, execute in the order you proposed. After each major milestone (scaffold
   done, nav done, hero done, etc.), pause and show me:
   - What you built (1-2 lines)
   - Any decisions you made that weren't explicit in the docs
   - What's next

3. When you hit a locked decision from CLAUDE.md that conflicts with what would be easier,
   don't quietly break the lock — flag it and ask. Example: if you want to add a dep like
   framer-motion, ask first.

4. Briefly explain key technical decisions as you make them (which components need
   "use client" and why, why a particular Tailwind pattern, etc.). Don't over-explain, but
   assume I want to learn the tech behind what you're doing.

5. At the end of the session, produce:
   - A summary of what shipped vs. what's stubbed
   - Commands to run locally (`pnpm install`, `pnpm dev`, `pnpm build`)
   - Deployment steps for Vercel
   - A short list of TODOs for the next session (populate cards, add real photo, etc.)

# Session goal

By end of session, I should be able to:
- Run `pnpm dev` and see the site locally.
- Run `pnpm build` with zero TypeScript errors.
- Deploy to Vercel and get a live URL.
- See all 6 sections rendering correctly on desktop and mobile.
- Have Lighthouse ≥ 95 on all four metrics.

Ready? Read the two locked docs first, then propose the plan.
```

---

## Notes for you (Megh)

- **Don't skip the "propose a plan first" step.** Claude Code will try to jump straight to `pnpm create next-app` if you don't tell it not to. The plan step forces it to demonstrate it read the docs and has a mental model before touching your filesystem.
- **The `TODO: real copy` comment convention is deliberate.** After the build, run `grep -r "TODO: real copy" .` and you get a clean checklist of everywhere placeholder content lives. Faster than clicking through the site.
- **If you want to iterate visually before committing** to the accent color, add this to the prompt: *"Before building, generate a single reference component (a work card) with 3 accent color variants — the bond-paper green from CLAUDE.md, plus one warmer alternative and one cooler alternative. I'll pick, then you proceed."*
- **If you're worried about scope creep during the session**, add: *"If at any point you find yourself building something not explicitly listed in Skeleton_PRD.md §6, stop and ask."*

---

## What comes next (rough sequencing)

| Session | Goal | Attach |
|---|---|---|
| **1. Skeleton** (this one) | Deployable v0. Placeholders everywhere. | CLAUDE.md, Skeleton_PRD.md, case studies doc |
| **2. Content pass** | Real Work card copy, real About, real Lab descriptions. | Case studies doc, LinkedIn export, resume |
| **3. Assets pass** | Real screenshots, hero image (if adding), OG image, favicon. | Screenshots, Figma exports |
| **4. Case study pages** (if wanted) | Convert best 2-3 Work cards into MDX detail pages. | Full case study content per card |
| **5. Polish & performance** | Lighthouse tuning, meta tag audit, cross-browser check. | — |

Skeleton → content → assets → depth → polish. Don't merge sessions or you'll thrash.

---

### PM Takeaway

The kickoff prompt is doing three jobs at once — **setting the mental model** (you're my engineer, here's the goal), **enforcing read order** (CLAUDE.md before PRD before code), and **installing a checkpoint pattern** (propose plan → wait → build → summarize). Without those guardrails, Claude Code defaults to eager execution and you spend the session correcting course instead of building. The single most valuable line in the prompt is *"Start by proposing a plan, not code"* — it forces Claude Code to prove it read the docs before touching your filesystem, which is where most vibe-coding sessions go wrong.

### Technical Terms

- **Claude Code** → Anthropic's terminal-based coding agent. It runs on your machine, reads/writes files directly, executes commands, and iterates on code. Like pair-programming with a senior engineer who has read every doc in your repo.
- **Kickoff prompt** → The opening message you send to an agent that establishes context, goals, and working conventions for a session. Think of it as the "briefing document" you'd give a contractor on day one.
- **Attach (in Claude Code context)** → Adding files to the model's context window so it can read them alongside your prompt. Different from putting files in the working directory — attached files are guaranteed to be in the model's memory for that turn.
- **Context window** → The maximum amount of text the model can "see" at once, including your messages, attached files, and its own responses. Attaching too many big files can push older content out of memory.
- **Placeholder content** → Fake copy (lorem ipsum, "TODO", stub data) used during scaffolding so structure can be built and tested before real content exists. Faster than waiting for finished copy.
- **`pnpm create next-app`** → The command that scaffolds a fresh Next.js project. Sets up the folder structure, TypeScript config, and dependencies in one shot.
- **`grep -r`** → A terminal command that recursively searches files for a pattern. `grep -r "TODO: real copy" .` finds every placeholder marker in the whole project tree.
- **Checkpoint pattern** → A working convention where the agent pauses at defined milestones to summarize progress and get feedback instead of executing the whole task silently. Prevents runaway agents from making 30 files worth of decisions before you can course-correct.
- **Scope creep** → When a project quietly expands beyond its original goals mid-execution. In vibe-coding, it looks like "while I was in there, I also added…" — usually costs you the weekend.
- **Vercel** → A hosting platform built by the makers of Next.js. Auto-deploys from GitHub, free for personal sites, extremely fast static hosting.
- **Lighthouse** → Google's free auditing tool built into Chrome DevTools. Scores your site 0-100 on Performance, Accessibility, Best Practices, and SEO. Your v0 target is ≥95 on all four.
