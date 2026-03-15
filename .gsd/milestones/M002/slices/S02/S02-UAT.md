# S02: Discovery Feed — UAT

**Milestone:** M002
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven + live-runtime)
- Why this mode is sufficient: Feed page rendering can be verified locally (empty state). Full cron→KV→render pipeline requires Vercel deployment with KV credentials — that's an integration test, not UAT. The contract checks cover structural correctness.

## Preconditions

- Dev server running (`npm run dev`)
- For full pipeline tests: Vercel KV credentials configured (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`)
- For cron endpoint tests: `CRON_SECRET` env var set, `OPENROUTER_API_KEY` configured
- `scripts/verify-m002-s02.sh` exists and is executable

## Smoke Test

1. Run `bash scripts/verify-m002-s02.sh`
2. **Expected:** 23/23 checks pass

## Test Cases

### 1. Feed page renders empty state without KV

1. Ensure no Vercel KV env vars are set
2. Start dev server (`npm run dev`)
3. Navigate to `http://localhost:3000/agent/feed`
4. **Expected:** Page loads without crashing. Shows "Sensors Calibrating" heading with descriptive copy about the agent preparing. No error page, no unhandled exception. Page title is "Discovery Feed | DRIP Agent".

### 2. Feed page layout and design system

1. Navigate to `/agent/feed`
2. Inspect the page header area
3. **Expected:** Page has a "Discovery Feed" heading with descriptive subtitle. Shares the agent layout (NavBar with agent links, dark theme background). Uses the same font stack and color tokens as the chat page at `/agent`.

### 3. Feed page responsive grid

1. Navigate to `/agent/feed`
2. Resize browser to mobile width (~375px)
3. Resize to tablet (~768px)
4. Resize to desktop (~1440px)
5. **Expected:** Card grid reflows — 1 column on mobile, 2 on tablet, 3 on desktop. No horizontal overflow at any breakpoint.

### 4. Cron endpoint rejects unauthenticated requests

1. Set `CRON_SECRET=test-secret-123` in environment
2. Send GET request to `/api/cron/feed` without Authorization header:
   ```
   curl http://localhost:3000/api/cron/feed
   ```
3. **Expected:** Returns 401 status with `{ "error": "Unauthorized" }` body

### 5. Cron endpoint rejects wrong secret

1. Send GET request with wrong Bearer token:
   ```
   curl -H "Authorization: Bearer wrong-token" http://localhost:3000/api/cron/feed
   ```
2. **Expected:** Returns 401 status with `{ "error": "Unauthorized" }` body

### 6. Cron endpoint runs with valid auth (requires API keys)

1. Set `CRON_SECRET`, `OPENROUTER_API_KEY`, and KV env vars
2. Send authenticated GET request:
   ```
   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/feed
   ```
3. **Expected:** Returns 200 with JSON body containing `{ success: true, entryId, topic, saved, steps, toolCalls }`. Server logs show `[cron-feed]` prefixed messages tracing the full lifecycle.

### 7. Feed page renders entries from KV (requires KV credentials)

1. After test case 6 completes successfully (entry saved to KV)
2. Navigate to `/agent/feed`
3. **Expected:** At least one card renders with: company/person name as title, type badge (accent color for company, info for person), topic label, summary text, and relative timestamp. First card has featured styling (larger/highlighted). No empty state shown.

### 8. Build succeeds with all S02 files

1. Run `npm run build`
2. **Expected:** Build completes with zero errors. Output includes `/agent/feed` in the route listing. `/api/cron/feed` compiled as a dynamic/function route.

### 9. Verification script comprehensive check

1. Run `bash scripts/verify-m002-s02.sh`
2. Review each check category: file existence (4), exports (5), feed page structure (9), dependencies (1), security (1), cron config (1), build (2)
3. **Expected:** 23/23 pass. No warnings or failures.

## Edge Cases

### Empty KV response with credentials set

1. Connect to KV with valid credentials but empty database (no entries)
2. Navigate to `/agent/feed`
3. **Expected:** Empty state renders gracefully — same "Sensors Calibrating" display. No error, no crash, no empty grid with broken layout.

### Cron endpoint without OPENROUTER_API_KEY

1. Set `CRON_SECRET` but not `OPENROUTER_API_KEY`
2. Send authenticated GET request
3. **Expected:** Returns 500 with structured error JSON: `{ error: true, message: "OPENROUTER_API_KEY is not set" }`. Server logs show `[cron-feed]` error.

### Cron topic deduplication

1. Run the cron endpoint multiple times in succession (requires full credentials)
2. Check server logs for selected topics
3. **Expected:** Topics don't repeat within a window of ~25 runs (bounded list tracks last 30). Each `[cron-feed] Selected topic:` log line shows a different company domain.

## Failure Signals

- Feed page shows Next.js error page or unhandled exception instead of empty state
- Cron endpoint returns 200 without auth header (security bypass)
- `npm run build` fails with import errors in feed.ts or cron route
- `scripts/verify-m002-s02.sh` reports any checks failed
- Server logs show uncaught exceptions without `[feed]` or `[cron-feed]` prefix (observability gap)
- Feed cards render without Badge or FadeInStagger (design system not applied)

## Requirements Proved By This UAT

- R006 (Agent Discovery Feed) — test cases 1, 6, 7 prove the full pipeline from cron → agent → KV → render
- R007 (AgentCash Backend Integration) — test case 6 proves x402 fetch reuse in cron context (partial, extends S01 proof)

## Not Proven By This UAT

- Live Vercel cron scheduling (requires deployment — test case 6 simulates manual trigger only)
- Feed visual consistency with M001 design language (milestone-level UAT in S03)
- In-character error messaging for feed failures (S03 scope)
- Feed pagination or infinite scroll (not implemented — capped at 20 entries)

## Notes for Tester

- Test cases 6 and 7 require live API credentials and KV setup — skip if testing locally without credentials. Cases 1–5 and 8–9 work without any external services.
- The `@vercel/kv` package emits a deprecation warning during install — this is expected and doesn't affect functionality.
- Feed page is `force-dynamic` — it will always fetch fresh from KV on each request, no caching surprises.
- The cron endpoint's `maxDuration: 60` export tells Vercel to allow up to 60s execution — locally there's no such limit, but the `stepCountIs(3)` constraint keeps runs short.
