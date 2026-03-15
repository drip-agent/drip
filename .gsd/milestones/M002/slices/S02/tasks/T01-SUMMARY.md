---
id: T01
parent: S02
milestone: M002
provides:
  - FeedEntry type and KV persistence layer (lib/feed.ts)
  - Authenticated cron endpoint with autonomous generateText agent (app/api/cron/feed/route.ts)
  - Vercel cron configuration (vercel.json)
  - @vercel/kv dependency
key_files:
  - lib/feed.ts
  - app/api/cron/feed/route.ts
  - vercel.json
key_decisions:
  - Used stopWhen: stepCountIs(3) with generateText (matches AI SDK v6 API, consistent with D037)
  - 25 seed topics (exceeds 15 minimum) — all real company domains StableEnrich can research
  - KV topic tracking uses Redis list (lpush/ltrim) bounded to 30 entries
patterns_established:
  - "[feed]" console prefix for all KV data layer operations
  - "[cron-feed]" console prefix for cron endpoint lifecycle
  - Cron route mirrors chat route pattern (OpenRouter setup, skill side-effect imports) but uses generateText instead of streamText
  - Graceful KV degradation — all read ops return empty arrays, write ops return false, never throw
observability_surfaces:
  - "[cron-feed]" logs trace topic selection, agent run start/complete, KV write, and errors
  - "[feed]" logs trace KV read/write operations with entry IDs and counts
  - Cron endpoint returns structured JSON body with entryId/topic/steps on success, error/topic/message/phase on failure
duration: 8m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Build KV data layer and cron endpoint

**Built FeedEntry KV persistence layer and authenticated cron endpoint with autonomous generateText agent.**

## What Happened

Installed `@vercel/kv` and built two main files:

1. **`lib/feed.ts`** — FeedEntry type with four KV operations: `saveFeedEntry` (zadd sorted set + set entry data), `getFeedEntries` (zrange rev + mget batch fetch), `addRecentTopic` / `getRecentTopics` (lpush/ltrim bounded list for dedup). All operations catch errors and return safe defaults (empty arrays, false) — the feed page will never crash from KV failures.

2. **`app/api/cron/feed/route.ts`** — GET handler with Bearer token auth against CRON_SECRET. Picks a random topic from 25 seed company domains, filtering out recently-used ones. Runs `generateText` with OpenRouter (Claude via research skill tools), `stopWhen: stepCountIs(3)` to stay within the 60s Hobby limit. Saves the result as a FeedEntry to KV. Returns structured JSON on both success and failure.

3. **`vercel.json`** — Cron config running `/api/cron/feed` daily at 08:00 UTC.

## Verification

- `npm run build` — passes, `/api/cron/feed` compiled as dynamic route ✅
- `grep -c "export.*FeedEntry" lib/feed.ts` — returns 3 (type + re-exports) ✅
- `grep "maxDuration" app/api/cron/feed/route.ts` — shows `export const maxDuration = 60` ✅
- `grep "CRON_SECRET" app/api/cron/feed/route.ts` — confirms auth check ✅
- `cat vercel.json` — shows cron path `/api/cron/feed` with schedule `0 8 * * *` ✅
- Seed topic list has 25 entries (≥15 required) ✅
- `generateText` used with `stopWhen: stepCountIs(3)` ✅
- `addRecentTopic` / `getRecentTopics` present for duplicate avoidance ✅

### Slice-level checks (partial — T02 creates remaining)

- `scripts/verify-m002-s02.sh` — does not exist yet (T02 creates it) ⏳
- Feed page at `/agent/feed` — not built yet (T02) ⏳
- Cron endpoint auth check — code present, compilable ✅
- `npm run build` — passes ✅

## Diagnostics

- Grep server logs for `[cron-feed]` to trace autonomous run lifecycle (topic selection → agent start → completion → KV write)
- Grep for `[feed]` to trace KV data operations
- Cron endpoint returns JSON: `{ success, entryId, topic, saved, steps, toolCalls }` on success, `{ error, topic, message, phase }` on failure
- KV connection failures are logged but never thrown — check `[feed] Failed to...` log patterns

## Deviations

- Used `stopWhen: stepCountIs(3)` instead of `maxSteps: 3` — AI SDK v6 deprecated maxSteps (per D037). Same behavior, correct API.
- `@vercel/kv@3.0.0` emits a deprecation warning (recommends Upstash Redis). Package still works — it's a wrapper around Upstash. Plan specifies `@vercel/kv`, keeping it.

## Known Issues

None.

## Files Created/Modified

- `lib/feed.ts` — FeedEntry type + saveFeedEntry + getFeedEntries + addRecentTopic + getRecentTopics
- `app/api/cron/feed/route.ts` — Authenticated cron GET handler with autonomous generateText agent
- `vercel.json` — Vercel cron configuration (daily 08:00 UTC)
- `package.json` — Added `@vercel/kv` dependency
