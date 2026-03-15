---
estimated_steps: 5
estimated_files: 4
---

# T01: Build KV data layer and cron endpoint

**Slice:** S02 — Discovery Feed
**Milestone:** M002

## Description

Install `@vercel/kv` and build the data persistence layer and autonomous agent endpoint. The KV layer provides typed read/write operations using Redis sorted sets for time-ordering. The cron endpoint authenticates via `CRON_SECRET`, picks a topic from a curated seed list, runs `generateText` with the research skill tools (same tools as the chat route), and saves the result as a `FeedEntry` in KV.

## Steps

1. Install `@vercel/kv` — add to package.json, npm install.
2. Build `lib/feed.ts`:
   - `FeedEntry` interface: `{ id, type, topic, title, summary, data, createdAt }`
   - `saveFeedEntry(entry)` — `kv.zadd("feed:entries", { score: timestamp, member: entry.id })` + `kv.set("feed:entry:{id}", entry)`
   - `getFeedEntries(limit)` — `kv.zrange("feed:entries", 0, limit-1, { rev: true })` to get IDs, then `kv.mget(...)` to batch-fetch entry data. Return empty array on any KV error (graceful degradation).
   - `addRecentTopic(topic)` / `getRecentTopics()` — track recently-used topics at `feed:recent-topics` to avoid duplicates
   - All functions use `[feed]` console prefix for observability
   - Handle missing KV connection gracefully — return empty/no-op rather than throwing
3. Build `app/api/cron/feed/route.ts`:
   - `export const maxDuration = 60` (Vercel Hobby limit)
   - `export const dynamic = "force-dynamic"`
   - Auth: check `Authorization: Bearer {CRON_SECRET}` header, return 401 JSON on mismatch
   - Seed topic list: ~20 company domains that StableEnrich can research (e.g. anthropic.com, openai.com, stripe.com, coinbase.com, etc.)
   - Filter out recently-used topics, pick random from remaining
   - Side-effect import `import "@/lib/skills/research"` for skill registration
   - Run `generateText` with OpenRouter, research skill tools, `stopWhen: stepCountIs(3)`, directive system prompt (not conversational)
   - Extract `text` as summary, construct `FeedEntry`, save to KV
   - Return JSON response with entry ID on success, error details on failure
   - `[cron-feed]` console prefix throughout
   - Wrap everything in try/catch — never let the cron 500 without context
4. Create `vercel.json` with cron config: `{ "crons": [{ "path": "/api/cron/feed", "schedule": "0 8 * * *" }] }`
5. Verify `npm run build` passes with the new route compiled.

## Must-Haves

- [ ] `FeedEntry` type exported from `lib/feed.ts`
- [ ] `saveFeedEntry()` and `getFeedEntries()` handle KV errors gracefully (empty returns, not throws)
- [ ] Cron endpoint returns 401 without valid CRON_SECRET
- [ ] Cron endpoint uses `generateText` (not `streamText`) with research skill tools
- [ ] `maxDuration = 60` exported from cron route
- [ ] `vercel.json` has valid cron entry
- [ ] Seed topic list has ≥15 entries
- [ ] Recently-used topic tracking to avoid duplicate entries

## Verification

- `npm run build` completes with zero errors
- `grep -c "export.*FeedEntry" lib/feed.ts` returns ≥1
- `grep "maxDuration" app/api/cron/feed/route.ts` shows 60
- `grep "CRON_SECRET" app/api/cron/feed/route.ts` confirms auth check
- `cat vercel.json` shows cron path and schedule

## Observability Impact

- Signals added: `[cron-feed]` console prefix for topic selection, agent run lifecycle, KV write, and errors. `[feed]` prefix for KV read/write operations.
- How a future agent inspects this: grep server logs for `[cron-feed]` to trace autonomous run lifecycle. Cron endpoint returns JSON body with entry details or structured error.
- Failure state exposed: generateText failures caught and logged with topic + error message. KV connection failures logged with `[feed]` prefix. Cron returns descriptive JSON error body (not bare 500).

## Inputs

- `lib/skills/registry.ts` — getAllTools() and getSystemPrompt() for agent tool set
- `lib/skills/research.ts` — side-effect import for skill registration
- `lib/x402-client.ts` — transparently used by research skill tool execute functions
- `app/api/agent/chat/route.ts` — pattern reference for OpenRouter setup, skill imports, system prompt composition

## Expected Output

- `lib/feed.ts` — FeedEntry type + saveFeedEntry() + getFeedEntries() + topic tracking
- `app/api/cron/feed/route.ts` — authenticated cron handler with autonomous generateText agent
- `vercel.json` — cron configuration
- `package.json` — `@vercel/kv` added
