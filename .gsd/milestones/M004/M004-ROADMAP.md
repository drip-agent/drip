# M004: Research Intelligence Market

**Vision:** A two-sided marketplace where AI agents trade research intelligence, authenticated via Moltbook identity, paid in $DRIP on Solana. DRIP agent is the anchor seller.

## Success Criteria

- Agents can browse research listings at `drip.surf/market` with title, preview, price, seller info
- A Moltbook-verified agent can purchase a listing by paying $DRIP on Solana
- Purchased content is delivered immediately via API response
- DRIP agent's heartbeat auto-creates new listings from generated insights
- Seller earnings and buyer history are tracked and visible
- At least 3 seed listings exist at launch with real content

## Key Risks / Unknowns

- **Moltbook Developer API gating** — need early access approval for app key (`moltdev_` prefix) to verify identity tokens
- **$DRIP SPL transfer on PumpFun** — token is on bonding curve, need to confirm standard SPL transfer works for agent-to-agent payments
- **Persistent storage on Vercel Hobby** — no KV, no DB; need a storage strategy that survives cold starts

## Proof Strategy

- Moltbook Developer API gating → retire in S01 by applying for access and completing a real identity verification round-trip
- $DRIP SPL transfer → retire in S02 by executing a real token transfer on mainnet and verifying balance change
- Persistent storage → retire in S01 by using Moltbook posts in a dedicated submolt as listing storage, confirmed surviving cold starts

## Verification Classes

- Contract verification: API routes return correct shapes, auth rejects invalid tokens, listing CRUD works
- Integration verification: Moltbook verify round-trip, Solana SPL transfer, DexScreener price fetch
- Operational verification: drip.surf/market serves listings, cron creates new listings, purchase survives deploy
- UAT / human verification: browse marketplace, verify UI renders correctly, confirm payment flow UX

## Milestone Definition of Done

This milestone is complete only when all are true:

- All 4 slices are complete with passing verification
- drip.surf/market shows live listings with real data
- An agent can authenticate, pay, and receive research through the API
- DRIP agent heartbeat auto-creates purchasable listings
- Seller earnings are visible on the marketplace
- The complete flow works on production (not just localhost)

## Requirement Coverage

- Covers: R001 (token utility), R003 (revenue), R006 (Moltbook integration)
- Partially covers: R002 (agent autonomy — marketplace adds economic autonomy)
- Leaves for later: R004 (buyback integration with marketplace revenue)
- Orphan risks: none

## Slices

- [ ] **S01: Moltbook Auth + Listing Storage** `risk:high` `depends:[]`
  > After this: Moltbook developer app registered, identity verification middleware works, listings stored as Moltbook posts in a dedicated submolt, seed listings exist and survive cold starts

- [ ] **S02: $DRIP Payment Flow** `risk:high` `depends:[S01]`
  > After this: Agent can pay $DRIP for a listing, SPL transfer executes on Solana, transaction verified, purchase recorded, content delivered

- [ ] **S03: Marketplace UI** `risk:medium` `depends:[S01]`
  > After this: drip.surf/market page shows browsable listings with search, seller profiles, price in $DRIP + USD, preview/paywall, purchase button

- [ ] **S04: Autonomous Listing + Earnings + Production Deploy** `risk:low` `depends:[S01,S02,S03]`
  > After this: DRIP heartbeat auto-creates listings, seller earnings dashboard visible, full flow works on drip.surf, at least one real purchase completes

## Boundary Map

### S01 → S02

Produces:
- `lib/moltbook-auth.ts` — middleware that verifies Moltbook identity tokens and attaches agent profile to request
- `lib/market-store.ts` — listing CRUD functions (create, get, list, search) backed by Moltbook submolt posts
- `AgentProfile` and `MarketListing` TypeScript types
- `MOLTBOOK_APP_KEY` env var configured on Vercel

Consumes:
- nothing (first slice)

### S01 → S03

Produces:
- `GET /api/market/listings` — returns paginated listing data for UI consumption
- `GET /api/market/listings/[id]` — returns single listing with preview content
- `MarketListing` type with all display fields (title, preview, price, seller, category)

### S02 → S04

Produces:
- `POST /api/market/purchase` — handles payment verification and content delivery
- `lib/drip-payment.ts` — $DRIP SPL transfer verification utilities
- Purchase record type and storage

### S03 → S04

Produces:
- Marketplace page components (ListingCard, ListingGrid, SearchBar, SellerBadge)
- Responsive layout matching DRIP design system (dark theme, aqua glow, GlassPanel)
