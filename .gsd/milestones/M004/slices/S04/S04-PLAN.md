# S04: Autonomous Listing + Earnings + Production Deploy

**Goal:** Wire DRIP agent's heartbeat to auto-create marketplace listings, build seller earnings view, and deploy the complete marketplace to production.
**Demo:** DRIP agent heartbeat creates a new marketplace listing, earnings dashboard shows accumulated sales, full purchase flow works on drip.surf/market.

## Must-Haves

- Heartbeat cron auto-creates marketplace listings from generated insights
- Seller earnings dashboard (total earned, per-listing breakdown, recent sales)
- Full end-to-end purchase flow verified on production
- All env vars set on Vercel
- Homepage section linking to marketplace
- Git push + Vercel deploy
- At least one real purchase completes (even if self-purchased for verification)

## Proof Level

- This slice proves: operational (full flow on production, surviving deploy)
- Real runtime required: yes (drip.surf, Solana mainnet)
- Human/UAT required: yes (visual verification + real purchase)

## Verification

- Trigger heartbeat → new listing appears in marketplace
- `GET /api/market/earnings?seller=drip_agent` returns accumulated earnings
- Full purchase flow works on drip.surf: browse → detail → pay $DRIP → unlock
- All API routes return proper responses on production
- Marketplace visible from homepage

## Tasks

- [ ] **T01: Wire heartbeat to auto-create marketplace listings** `est:20m`
  - Why: DRIP agent needs to automatically populate the marketplace
  - Files: `lib/agent-brain.ts`, `app/api/cron/heartbeat/route.ts`, `lib/market-store.ts`
  - Do: After generating an insight in `heartbeat()`, also call `createListing()` with the content. Set price based on content length (short: 1000 $DRIP, medium: 2500 $DRIP, long: 5000 $DRIP). Include category auto-detection from topic. Skip if marketplace not configured (graceful degradation). Add `marketListingId` to AgentPost type.
  - Verify: Trigger heartbeat, confirm new listing appears in `/api/market/listings`
  - Done when: Every heartbeat creates both a feed post and a marketplace listing

- [ ] **T02: Seller earnings dashboard** `est:25m`
  - Why: Sellers need to see what they've earned
  - Files: `app/api/market/earnings/route.ts`, `app/market/earnings/page.tsx`
  - Do: `GET /api/market/earnings` returns: totalEarned ($DRIP), listingsSold (count), recentSales (last 20 with listing title, buyer name, amount, date). Page at `/market/earnings` shows stats cards + sales table. Authenticated via Moltbook identity. DRIP agent's earnings shown by default (public for drip_agent, private for others).
  - Verify: Earnings page shows correct totals after purchases
  - Done when: Earnings data accurate and page renders with real data

- [ ] **T03: Homepage marketplace section** `est:15m`
  - Why: Marketplace needs visibility from the main landing page
  - Files: `app/page.tsx`
  - Do: Add "Research Market" section between Features and Token sections. Show 3 latest listings in a compact card row. "Browse Market →" CTA link to `/market`. Stats: "X listings · Y purchases · Z $DRIP traded" (from market status API).
  - Verify: Homepage shows marketplace section with live data
  - Done when: Marketplace preview visible on homepage with working links

- [ ] **T04: Production deploy + env vars + verification** `est:20m`
  - Why: Everything needs to work live, not just localhost
  - Files: `.env.local`, `vercel.json`, `deploy.sh`
  - Do: Set all new env vars on Vercel (`MOLTBOOK_APP_KEY`, `MARKETPLACE_WALLET`). Push to GitHub. Deploy to Vercel. Verify all API routes on production. Run one end-to-end purchase flow (self-purchase with $DRIP from agent wallet). Verify listings persist after redeploy.
  - Verify: `curl drip.surf/api/market/listings` returns data, purchase flow completes
  - Done when: Full marketplace operational on drip.surf with real data

- [ ] **T05: Final integrated acceptance** `est:15m`
  - Why: Prove the complete system works as promised
  - Files: none (verification only)
  - Do: (1) Visit drip.surf/market — confirm listings visible. (2) Trigger heartbeat — confirm new listing appears. (3) Execute purchase flow — auth → pay → unlock. (4) Check earnings — confirm sale recorded. (5) Check Moltbook — confirm cross-posts visible. (6) Redeploy — confirm data persists. Document any issues in M004-SUMMARY.md.
  - Verify: All 6 checks pass
  - Done when: Marketplace is live, autonomous, and functional for agents and humans

## Files Likely Touched

- `lib/agent-brain.ts` (update — add listing creation to heartbeat)
- `app/api/cron/heartbeat/route.ts` (update — wire marketplace)
- `lib/market-store.ts` (update — earnings queries)
- `app/api/market/earnings/route.ts` (new)
- `app/market/earnings/page.tsx` (new)
- `app/page.tsx` (update — marketplace section)
- `.env.local` (update)
