# S02: Discovery Feed — Research

**Date:** 2026-03-15

## Summary

S02 is a persistence + rendering slice. The cron endpoint runs an autonomous agent via `generateText` (non-streaming), the result gets stored in Vercel KV, and the feed page reads it out as styled cards. The stack is straightforward — `@vercel/kv` for sorted-set storage, the existing skill registry + x402 client for agent tool calls, and the M001 Card/Badge/FadeInStagger components for UI.

The main risk isn't technical complexity — it's **operational setup**. Vercel KV requires creating a KV store in the Vercel dashboard and pulling `KV_REST_API_URL` + `KV_REST_API_TOKEN` env vars. The cron endpoint needs `CRON_SECRET` and `OPENROUTER_API_KEY` and `X402_PRIVATE_KEY`. Without all four env vars, the feed is dead. A second concern is **content quality** — the autonomous agent runs without user guidance, so seed topic selection and response formatting directly determine whether the feed is useful or garbage.

The good news: every building block exists. The skill registry and x402 client from S01 are directly reusable. The AI SDK's `generateText` with `stopWhen: stepCountIs(n)` gives us non-streaming tool-calling in a single function call. `@vercel/kv`'s sorted set (`zadd`/`zrange`) gives us time-ordered feed reads with zero custom indexing. The feed page is a server component that fetches from KV and renders cards — no client-side data fetching needed.

## Recommendation

Build four files:

1. **`lib/feed.ts`** — `FeedEntry` type, `saveFeedEntry()` (zadd + set), `getFeedEntries()` (zrange + mget). Use a sorted set `feed:entries` with timestamp scores for ordering, individual entry data stored at `feed:entry:{id}` keys.

2. **`app/api/cron/feed/route.ts`** — GET handler. Auth via `CRON_SECRET` Bearer header. Picks a topic from a seed list, runs `generateText` with research skill tools, formats result as `FeedEntry`, saves to KV. Set `maxDuration = 60` for Vercel Hobby.

3. **`app/agent/feed/page.tsx`** — Server component. Fetches entries from KV via `getFeedEntries()`. Renders as Card grid with FadeInStagger. Badge for entry type. Empty state when no entries exist.

4. **`vercel.json`** — Cron config: `{ "crons": [{ "path": "/api/cron/feed", "schedule": "0 8 * * *" }] }` (daily at 8:00 UTC).

Use `generateText` (not `streamText`) for the cron endpoint — no streaming needed, simpler error handling, cleaner result extraction.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Time-ordered feed storage | `@vercel/kv` sorted sets (`zadd`/`zrange`) | Redis sorted sets give O(log N) insert, O(log N + M) range queries, natural reverse-chronological ordering via `rev: true`. No custom indexing. |
| Non-streaming agent run with tools | AI SDK `generateText` + `stepCountIs()` | Purpose-built for programmatic (non-interactive) LLM calls with tool execution. Returns `{ text, steps, toolResults }` — exactly what we need to extract feed entry content. |
| Cron authentication | Vercel `CRON_SECRET` Bearer header | Vercel auto-sends `Authorization: Bearer {CRON_SECRET}` on cron invocations. Standard pattern — compare header to env var, return 401 on mismatch. |
| Feed card UI | M001 `Card` + `Badge` + `FadeInStagger` components | Already built, themed, and tested. Card has `default`/`elevated`/`featured` variants. Badge has `default`/`accent`/`info` variants. FadeInStagger handles scroll-triggered animation. |

## Existing Code and Patterns

- `lib/skills/registry.ts` — `getAllTools()` and `getSystemPrompt()` aggregate all registered skills. Reuse directly in the cron endpoint — same tool set as the chat route, just called via `generateText` instead of `streamText`.
- `lib/skills/research.ts` — Self-registers at import via `registerSkill()`. The cron route must import this module (side-effect import `import "@/lib/skills/research"`) same as the chat route does.
- `lib/x402-client.ts` — `createX402Fetch()` lazy singleton. Reused transparently by the research skill's tool `execute` functions — no additional setup needed in the cron route.
- `app/api/agent/chat/route.ts` — Pattern to follow: server-only import, side-effect skill registration, OpenRouter provider creation, system prompt composition. The cron route mirrors this but uses `generateText` instead of `streamText` and a cron-specific system prompt.
- `app/agent/layout.tsx` — The feed page lives under `/agent/feed`, so it inherits the agent layout (AgentNavBar with Chat/Feed links). No layout changes needed — Feed link already exists in the nav.
- `components/ui/card.tsx` — CVA variants: `default` (border ocean-mist/20), `elevated` (border ocean-mist/10), `featured` (border icy-aqua/30, shadow-glow-md). Use `featured` for the latest entry, `default` for older ones.
- `components/ui/badge.tsx` — CVA variants: `default`, `accent` (aqua tint), `info` (cyan tint). Use `accent` for company entries, `info` for person entries.
- `components/animation/fade-in-stagger.tsx` — Wraps children in staggered motion.div with viewport-triggered animation. Use for the card grid — single observer for all cards (D023 convention).
- `app/page.tsx` — Data-driven pattern: const arrays → `.map()` → component grid. The feed page follows the same pattern but with dynamic data from KV instead of static arrays.

## Constraints

- **`@vercel/kv` v3.0.0** — Current latest. Requires `KV_REST_API_URL` and `KV_REST_API_TOKEN` env vars. Auto-populated when KV store is linked to Vercel project; for local dev, `vercel env pull .env.local` pulls them.
- **Vercel Hobby plan: 2 cron jobs max, once/day minimum** — We need exactly 1 cron job at once/day. Fits within Hobby limits.
- **Vercel Hobby plan: 60s max function duration** — The cron endpoint runs `generateText` with tool calls (LLM call + x402 payment + StableEnrich API). Must set `export const maxDuration = 60`. If tool calls chain (company-lookup → person-enrich), total time could approach this limit.
- **KV free tier: 256MB storage, 30K commands/day** — A single feed entry is ~2-5KB. Even at 365 entries/year, that's <2MB. 30K commands/day is far beyond what 1 daily cron + page loads require.
- **Server-only constraint** — `@vercel/kv` and skill modules must only run server-side. Feed page should be a server component (default in App Router). Cron route is inherently server-side.
- **No `maxDuration` export in existing chat route** — The chat route doesn't set it (likely relying on Vercel default 10s or streaming keeping the connection alive). The cron route must set it explicitly since `generateText` blocks until complete.
- **proxy.ts skips `/api` paths** — Confirmed: the cron endpoint at `/api/cron/feed` won't be rewritten by the subdomain proxy. Safe.
- **AI SDK v6 API surface (D037)** — `generateText` uses `stopWhen: stepCountIs(n)` not `maxSteps`. Tool `inputSchema` not `parameters`. Confirmed working in S01's `streamText` usage — same API for `generateText`.

## Common Pitfalls

- **Forgetting side-effect skill import in cron route** — The registry is empty until a skill module is imported. Must add `import "@/lib/skills/research"` at the top of the cron route, same as the chat route. Without it, `getAllTools()` throws "[skill-registry] No skills registered."
- **KV env vars missing in local dev** — `@vercel/kv`'s default `kv` import reads from `KV_REST_API_URL` / `KV_REST_API_TOKEN`. If not set, it throws at runtime. For local dev without a real KV store, the feed page should gracefully handle the missing connection — render an empty state, not crash.
- **Sorted set stores member as string, not object** — `zadd` stores a `member` string (the entry ID), not the full entry object. Entry data must be stored separately at `feed:entry:{id}` and fetched via `kv.get()` after `zrange` returns IDs. Two-step read: get IDs from sorted set → batch-get entry data.
- **generateText result extraction** — `generateText` returns `{ text, steps, toolResults }`. The `text` field contains the LLM's final natural language response (after all tool calls). This is the feed entry summary. Tool results contain raw StableEnrich data. Need to capture both — text for display, tool results for structured data.
- **Duplicate feed entries on repeated cron runs** — If the cron picks the same topic twice, we get duplicate entries. Mitigate by: (a) tracking recently-used topics in KV, and (b) using the topic as part of the entry ID (allowing dedup check before save).
- **Cron endpoint returns 500 without error context** — If `generateText` fails mid-execution (LLM timeout, x402 payment failure), the cron silently fails. Add structured logging with `[cron-feed]` prefix and return a JSON body with error details for Vercel dashboard inspection.
- **Feed page caching** — Next.js App Router server components are statically rendered by default. The feed page must use `export const dynamic = 'force-dynamic'` or `revalidate = 3600` to pick up new KV entries. Without this, the page shows stale data indefinitely.

## Open Risks

- **x402 payment in serverless without funded wallet** — Same as S01: `X402_PRIVATE_KEY` must be set and the wallet must have USDC on Base Sepolia. If the wallet is empty, every tool call in the cron job will fail, producing empty/error feed entries. The cron should detect payment failures and skip saving bad entries.
- **`generateText` timeout with chained tool calls** — If the agent calls company-lookup (5-10s), then decides to call person-enrich (5-10s), plus LLM inference time (5-10s each step), total could exceed 60s on Hobby plan. Mitigation: limit cron agent to single-tool queries (company-lookup only, no follow-up enrichment) or accept occasional timeouts.
- **Feed content quality without curation** — Autonomous runs depend on seed topic selection. Bad topics (too niche, already well-known, StableEnrich has no data) produce empty or low-value entries. Need a curated seed list of ~20 interesting companies/domains that StableEnrich can actually return data on.
- **Vercel KV setup requires manual dashboard action** — Unlike npm packages, KV store creation happens in the Vercel dashboard (Storage → Create → KV). The env vars are only populated after linking. This is a deployment blocker that can't be automated.
- **CRON_SECRET not set → anyone can trigger the endpoint** — Must be set in Vercel environment variables. For local testing, we can use a local `.env` value and test via `curl -H "Authorization: Bearer $CRON_SECRET"`.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Vercel KV | `jezweb/claude-skills@vercel-kv` (318 installs) | available — covers KV setup, operations, common issues |
| Vercel KV | `ovachiever/droid-tings@vercel-kv` (27 installs) | available — lower installs |
| Vercel AI SDK | `vercel/ai@ai-sdk` (11.1K installs) | available — already noted in M002 research |
| Vercel Cron | No dedicated skill found | n/a — pattern is simple enough (vercel.json + auth check) |
| Frontend Design | `frontend-design` | installed — for feed card styling |

**Recommended installs** (user decides):
- `npx skills add jezweb/claude-skills@vercel-kv` — 318 installs. Covers setup, known issues, and patterns specific to `@vercel/kv`. Useful for avoiding gotchas during KV integration.

## Architecture Notes

### KV Data Model

```
Sorted Set: "feed:entries"
  - score: timestamp (ms)      → enables time-ordered queries
  - member: entry ID string     → reference to full entry

Key: "feed:entry:{id}"
  - value: FeedEntry JSON object

Key: "feed:recent-topics"
  - value: string[] of recently used domains (last 20)
  - TTL: 30 days
```

### FeedEntry Shape

```typescript
interface FeedEntry {
  id: string;          // e.g. "1710489600000-anthropic-com"
  type: "company" | "person";
  topic: string;       // domain or identifier researched
  title: string;       // "Anthropic" — display name
  summary: string;     // LLM-generated markdown summary
  data: unknown;       // raw StableEnrich response (for future use)
  createdAt: string;   // ISO 8601 timestamp
}
```

### Cron Agent Prompt Strategy

The cron endpoint uses a different system prompt than the chat route. Chat prompt is conversational ("You are DRIP..."). Cron prompt is directive: "Write a brief research profile on {topic}. Include key facts, funding, notable people, and why this company matters. Format as clean markdown with sections."

This produces structured content suitable for feed card display, not conversational back-and-forth.

### Feed Page Rendering

```
Server Component (force-dynamic or ISR with revalidate)
  └─ getFeedEntries(limit: 20)
       └─ kv.zrange("feed:entries", 0, 19, { rev: true })  → IDs
       └─ kv.mget("feed:entry:id1", "feed:entry:id2", ...) → entries
  └─ Render: Container > FadeInStagger > Card[] with Badge
  └─ Empty state: GlassPanel with "No discoveries yet" message
```

### Graceful Degradation

The feed page must work even when KV is unavailable (env vars missing, connection error). Render an empty state — "DRIP is calibrating. Check back soon." — rather than crashing. This matters for local dev and for Vercel deployments before KV is linked.

## Sources

- Vercel KV (`@vercel/kv` v3.0.0) setup, sorted set operations, env var requirements (source: [Vercel Storage docs](https://github.com/vercel/storage), [Context7 /vercel/storage])
- AI SDK `generateText` with `stopWhen: stepCountIs(n)` for non-streaming multi-step tool calling (source: [Context7 /vercel/ai](https://github.com/vercel/ai))
- Vercel Cron configuration with `vercel.json` and `CRON_SECRET` Bearer auth pattern (source: [Vercel docs](https://vercel.com/docs/cron-jobs/manage-cron-jobs))
- Vercel Hobby plan limits: 2 cron jobs, 60s max duration, KV free tier 256MB/30K commands (source: [Vercel pricing](https://vercel.com/pricing))
