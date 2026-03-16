# S01: Moltbook Auth + Listing Storage

**Goal:** Register DRIP as a Moltbook developer app, build identity verification middleware, and use a Moltbook submolt as persistent listing storage.
**Demo:** API accepts Moltbook identity tokens, rejects invalid ones, and returns listing data from the `drip-market` submolt that survives Vercel cold starts.

## Must-Haves

- Moltbook developer app registered (`moltdev_` API key)
- Identity verification middleware for Next.js API routes
- Dedicated `drip-market` submolt created on Moltbook
- Listing CRUD: create listing (post to submolt), get listing, list all, search
- At least 3 seed listings with real research content
- TypeScript types for `AgentProfile`, `MarketListing`, `PurchaseRecord`
- Token verification caching (5min TTL) to stay under 100 req/min rate limit

## Proof Level

- This slice proves: integration (Moltbook API round-trip)
- Real runtime required: yes (Moltbook API, Vercel deploy)
- Human/UAT required: yes (apply for Moltbook developer access)

## Verification

- `curl -s POST /api/market/listings` returns 200 with listing array from Moltbook submolt
- `curl -s GET /api/market/listings/[id]` returns single listing with content
- `curl` without identity token returns 401
- `curl` with valid Moltbook identity token returns 200 with agent profile attached
- Listings persist after Vercel redeploy (fetched from Moltbook, not filesystem)

## Observability / Diagnostics

- Runtime signals: `[moltbook-auth]` log prefix for verify attempts, cache hits/misses
- Inspection surfaces: `GET /api/market/status` returns auth config status, listing count, cache stats
- Failure visibility: verify errors include Moltbook response body, rate limit remaining headers logged
- Redaction constraints: Moltbook app key never logged, only key prefix

## Tasks

- [ ] **T01: Register Moltbook developer app + create submolt** `est:15m`
  - Why: Need `moltdev_` app key for identity verification, need submolt for listing storage
  - Files: `.env.local`, Vercel env vars
  - Do: Apply at moltbook.com/developers/apply, create app, get `moltdev_` key. Create `drip-market` submolt with `allow_crypto: true`. Store key as `MOLTBOOK_APP_KEY` env var.
  - Verify: `curl` verify-identity endpoint returns valid response with app key
  - Done when: `MOLTBOOK_APP_KEY` set locally and on Vercel, `drip-market` submolt exists

- [ ] **T02: Build Moltbook identity verification middleware** `est:30m`
  - Why: All marketplace API routes need authenticated agent context
  - Files: `lib/moltbook-auth.ts`, `app/api/market/test-auth/route.ts`
  - Do: Create `verifyMoltbookAgent(req)` that extracts `X-Moltbook-Identity` header, calls Moltbook verify endpoint with `MOLTBOOK_APP_KEY`, caches result for 5min (in-memory Map with TTL), returns `AgentProfile` type. Create test route to exercise it. Handle all error cases from Moltbook docs (expired, invalid, deactivated, rate limited).
  - Verify: Test route returns agent profile with valid token, 401 with invalid token
  - Done when: Middleware correctly verifies tokens and caches results

- [ ] **T03: Build listing storage backed by Moltbook submolt** `est:30m`
  - Why: Listings need to persist across Vercel cold starts — Moltbook posts are the store
  - Files: `lib/market-store.ts`, `app/api/market/listings/route.ts`, `app/api/market/listings/[id]/route.ts`
  - Do: Create `MarketListing` type (id, title, preview, fullContent, price, currency, sellerId, sellerName, sellerKarma, category, createdAt). `createListing()` posts to `drip-market` submolt with structured JSON in content field. `getListings()` fetches submolt feed. `getListing(id)` fetches single post. Parse listing metadata from post content (JSON block at top of content). Add price/currency/category as structured data.
  - Verify: Create a listing via API, fetch it back, verify all fields present
  - Done when: Listing CRUD works through Moltbook submolt with proper type safety

- [ ] **T04: Seed marketplace with 3 research listings** `est:20m`
  - Why: Marketplace needs initial content to not look empty at launch
  - Files: `app/api/market/seed/route.ts` (one-time use)
  - Do: Generate 3 high-quality research listings using DeepSeek V3.2: (1) Solana DeFi ecosystem analysis, (2) AI agent economy report, (3) PumpFun token mechanics deep-dive. Each listing has title, 2-paragraph preview, 4-paragraph full content, price (1000-5000 $DRIP). Post to `drip-market` submolt as DRIP agent.
  - Verify: `GET /api/market/listings` returns 3 listings with preview and price
  - Done when: 3 seed listings live on Moltbook `drip-market` submolt

- [ ] **T05: Market status endpoint** `est:10m`
  - Why: Diagnostics surface for monitoring marketplace health
  - Files: `app/api/market/status/route.ts`
  - Do: Return JSON with: auth configured (bool), listing count, cache stats (size, hit rate), Moltbook connectivity, last listing created timestamp
  - Verify: `curl /api/market/status` returns all diagnostic fields
  - Done when: Status endpoint returns accurate marketplace diagnostics

## Files Likely Touched

- `lib/moltbook-auth.ts` (new)
- `lib/market-store.ts` (new)
- `lib/market-types.ts` (new)
- `app/api/market/listings/route.ts` (new)
- `app/api/market/listings/[id]/route.ts` (new)
- `app/api/market/test-auth/route.ts` (new)
- `app/api/market/seed/route.ts` (new)
- `app/api/market/status/route.ts` (new)
- `.env.local`
