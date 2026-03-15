---
estimated_steps: 4
estimated_files: 2
---

# T02: Build feed page and verification script

**Slice:** S02 — Discovery Feed
**Milestone:** M002

## Description

Build the public feed page as a server component that reads entries from Vercel KV and renders them as styled cards using the M001 design system. Then write the slice verification script that exercises all contract checks. The page must work gracefully when KV is unavailable — rendering an empty state instead of crashing.

## Steps

1. Build `app/agent/feed/page.tsx`:
   - Server component (no `"use client"`) with `export const dynamic = "force-dynamic"` to bypass static rendering cache
   - Import `getFeedEntries` from `lib/feed.ts`
   - Fetch up to 20 entries via `getFeedEntries(20)`
   - Render within `Container` > heading + entry grid
   - Use `FadeInStagger` to wrap the card grid (single observer, D023 convention)
   - First (latest) entry uses `Card variant="featured"`, rest use `variant="default"`
   - `Badge variant="accent"` for company entries, `variant="info"` for person entries
   - Each card shows: title, type badge, topic, summary (truncated), timestamp (relative or formatted)
   - Empty state: styled panel with "DRIP is calibrating its sensors. Discovery feed entries will appear here once the autonomous agent begins research." — maintaining the cool/mysterious voice (D006)
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
   - Page metadata: title "Discovery Feed | DRIP Agent", description for SEO
2. Write `scripts/verify-m002-s02.sh`:
   - File existence checks: lib/feed.ts, app/api/cron/feed/route.ts, app/agent/feed/page.tsx, vercel.json
   - Export checks: FeedEntry type, saveFeedEntry, getFeedEntries from lib/feed.ts
   - Export checks: GET handler, maxDuration from cron route
   - Dependency check: @vercel/kv in package.json
   - Auth check: CRON_SECRET referenced in cron route
   - Cron config check: vercel.json has valid cron entry
   - Build check: `npm run build` succeeds
   - Print pass/fail summary with count
3. Run `bash scripts/verify-m002-s02.sh` and confirm all checks pass.
4. Run dev server and verify `/agent/feed` renders (empty state expected without KV).

## Must-Haves

- [ ] Feed page is a server component (no `"use client"` directive)
- [ ] `force-dynamic` export to bypass static cache
- [ ] Graceful empty state when KV returns no entries or errors
- [ ] Card + Badge + FadeInStagger from M001 design system used
- [ ] Featured variant for latest entry
- [ ] Responsive grid layout
- [ ] Verification script checks all slice contracts
- [ ] Build passes with zero errors

## Verification

- `bash scripts/verify-m002-s02.sh` — all checks pass
- `npm run build` — zero errors, `/agent/feed` route compiles
- Dev server: `/agent/feed` renders empty state without KV connection

## Inputs

- `lib/feed.ts` — getFeedEntries() function (from T01)
- `components/ui/card.tsx` — Card with default/featured variants
- `components/ui/badge.tsx` — Badge with accent/info variants
- `components/animation/fade-in-stagger.tsx` — staggered entry animation
- `components/layout/container.tsx` — page container
- `app/agent/layout.tsx` — inherited agent layout with AgentNavBar

## Observability Impact

- **Feed page entry count**: The page renders a visible count of entries or the empty state message — visible by inspecting the DOM or screenshot.
- **Empty state signal**: When KV is unavailable or returns no entries, the page renders a specific empty-state panel with known text ("DRIP is calibrating its sensors…") — grep-able in page source for automated checks.
- **Server-side logs**: `getFeedEntries` logs `[feed] Fetched N entries` or `[feed] Failed to fetch entries: ...` — grep server logs for `[feed]` to trace data layer health.
- **Build verification**: `scripts/verify-m002-s02.sh` outputs a structured pass/fail summary with check count — machine-parseable for CI integration.
- **No new failure states introduced**: The feed page catches all KV errors internally (via `getFeedEntries`'s try/catch) and renders empty state. No unhandled promise rejections possible from this page.

## Expected Output

- `app/agent/feed/page.tsx` — server component rendering feed entries or empty state
- `scripts/verify-m002-s02.sh` — slice verification script with all contract checks
