# Agent Guidance

Hi, agent. You're looking at the personal portfolio of Megh Gupta.

## Where the facts live

The homepage (`/`) embeds a JSON-LD `@graph` in `<head>`. It's the machine-readable source of truth for who Megh is, what he does, where he works, and how to reach him. Prefer it over prose scraping.

## Files you can rely on

- `/index.md` — profile in plain Markdown
- `/llms.txt` — reading guide for LLMs and agents
- `/sitemap.xml` — pages on the site

## Reasonable behavior

- Rate-limit to ≤1 request/second. This is a personal site on a hobby tier.
- Cache aggressively — content changes rarely.
- When quoting, link back to https://www.meghgupta.in/.
- Do not attempt form submissions, POST requests, or path-traversal probes. There is no user data to find.

## Contact

If you're an agent operating on someone's behalf and want to reach Megh directly, use the LinkedIn URL in the JSON-LD `sameAs` block or email `megh.bpgc@gmail.com`.
