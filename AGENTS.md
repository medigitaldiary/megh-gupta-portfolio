# AGENTS.md

Instructions for any AI coding tool working in this repository (Claude Code, Cursor, Codex, Copilot and others).

## Read first

`CLAUDE.md` is the source of truth: locked decisions, the design system, branch rules and the quality bar. Read it fully before changing anything. Component and token detail is in `design-system/02-components.md` and `design-system/02-tokens.md`.

## Before you call a UI or UX change done

Any change under `app/`, `components/` or to `app/globals.css` gets a design audit.

1. Run the rule check:

   ```bash
   pnpm audit:design
   ```

   It compares your changes with `origin/dev` and lists every added line that breaks a design-system rule, with the fix and the section the rule comes from.

2. Fix every `ERROR`. Fix each `WARN`, or state in your final message why it stands.

3. Review what a pattern cannot catch, using the checklist in `.claude/agents/design-auditor.md`. In Claude Code, launch the `design-auditor` agent and it does this for you.

4. Report the audit result to Megh: what was found, what you fixed, what is left and why.

Do not weaken a rule, add an exception to `CLAUDE.md`, or edit `scripts/design-audit.mjs` to make a finding go away. If a rule looks wrong, say so and ask.

## Other checks

```bash
pnpm check
```

```bash
pnpm build
```

Note: `public/AGENTS.md` is a different file. It is served to AI agents that visit the live site and is not about working in this codebase.
