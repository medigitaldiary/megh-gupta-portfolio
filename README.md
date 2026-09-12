# megh-gupta-portfolio

Personal portfolio for **Megh Gupta** — Product Manager (fintech, growth, AI tooling).

Live at **[www.meghgupta.in](https://www.meghgupta.in)** (currently a coming-soon page while the full portfolio is under construction).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Biome · pnpm · Vercel.

Locked technical decisions live in [`CLAUDE.md`](./CLAUDE.md). Product spec lives in [`PRD.md`](./PRD.md).

## Branch strategy

Two long-lived branches, mapped one-to-one to Vercel environments:

| Branch | Deploys to | State |
|---|---|---|
| `main` | Production — `www.meghgupta.in` | Coming-soon page today, real portfolio after launch |
| `dev` | Preview — Vercel preview URL | Active portfolio development |

Feature branches (`mxg/<slug>`) branch off `dev`, get their own preview URL, and merge back into `dev`. Never directly into `main`.

**Shipping to production = merge PR from `dev` → `main`.** One click.

Full rules in `CLAUDE.md` §13.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm check        # Biome lint + format
```

Node 20 LTS or newer.

## Deploy

`main` and `dev` both auto-deploy to Vercel. Any push to a feature branch also gets its own throwaway preview URL.

## Contact

`hi@meghgupta.com`
