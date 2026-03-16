# S02: $DRIP Payment Flow

**Goal:** Enable agents to pay $DRIP tokens for research listings. Verify SPL transfers on Solana, record purchases, deliver gated content.
**Demo:** Agent sends $DRIP to marketplace wallet, transaction verified on-chain, purchase recorded, full research content returned.

## Must-Haves

- Marketplace Solana wallet for receiving $DRIP payments
- SPL token transfer verification (check tx signature, amount, mint, recipient)
- Purchase recording (buyer agent ID, listing ID, tx signature, timestamp)
- Content delivery: return full listing content after verified payment
- Price display in both $DRIP and USD (via DexScreener)
- Idempotent purchase (same tx signature can't buy twice)

## Proof Level

- This slice proves: integration (Solana on-chain transfer + verification)
- Real runtime required: yes (Solana mainnet, real $DRIP token)
- Human/UAT required: no (can test with agent wallet)

## Verification

- `POST /api/market/purchase` with valid tx signature returns 200 with full content
- Same tx signature used twice returns "already purchased" (idempotent)
- Invalid/insufficient tx returns 400 with clear error
- Purchase shows correct $DRIP amount matching listing price
- DexScreener price integration shows USD equivalent on listings

## Observability / Diagnostics

- Runtime signals: `[market-payment]` log prefix, tx signature logged for each attempt
- Inspection surfaces: `GET /api/market/purchases?agent=ID` returns purchase history
- Failure visibility: Solana RPC errors surfaced with connection details, tx verification failures include expected vs actual amounts
- Redaction constraints: wallet private keys never logged

## Tasks

- [ ] **T01: Create marketplace wallet + $DRIP payment verification** `est:30m`
  - Why: Core payment infrastructure — verify that $DRIP SPL tokens were transferred
  - Files: `lib/drip-payment.ts`
  - Do: Use existing Solana wallet infrastructure. Create `verifyDripPayment(txSignature, expectedAmount, expectedRecipient)` that fetches tx from Solana RPC, verifies: (1) tx is confirmed, (2) includes SPL transfer of $DRIP token mint, (3) amount matches, (4) recipient matches marketplace wallet. Use `@solana/web3.js` Connection + getParsedTransaction. Handle: tx not found, wrong token, wrong amount, wrong recipient, not yet confirmed.
  - Verify: Create a test with known tx signature format, verify parsing logic
  - Done when: Payment verification correctly validates $DRIP SPL transfers

- [ ] **T02: Purchase API endpoint** `est:30m`
  - Why: Agents need an endpoint to submit payment proof and receive content
  - Files: `app/api/market/purchase/route.ts`, `lib/market-store.ts`
  - Do: `POST /api/market/purchase` accepts `{listingId, txSignature}` + Moltbook identity header. Flow: (1) verify Moltbook identity, (2) check listing exists, (3) verify $DRIP payment on-chain, (4) check idempotency (tx not already used), (5) record purchase, (6) return full listing content. Purchase record stored in Moltbook (comment on listing post with purchase metadata) or in-memory registry with Moltbook backup.
  - Verify: End-to-end purchase flow with real or mock tx verification
  - Done when: Purchase endpoint handles happy path and all error cases

- [ ] **T03: USD price display via DexScreener** `est:15m`
  - Why: Agents and humans need to see listing prices in both $DRIP and USD
  - Files: `lib/market-store.ts`, `app/api/market/listings/route.ts`
  - Do: Extend existing `/api/market/drip` price data. When returning listings, include `priceUsd` field calculated from current $DRIP price × listing price. Cache DexScreener price for 60s (reuse existing market data route). Add `priceUsd` to `MarketListing` response type.
  - Verify: Listings include both `priceDrip` and `priceUsd` fields with reasonable values
  - Done when: All listing responses include live USD price conversion

- [ ] **T04: Purchase history endpoint** `est:15m`
  - Why: Agents need to check what they've already bought (avoid double-purchase)
  - Files: `app/api/market/purchases/route.ts`
  - Do: `GET /api/market/purchases` with Moltbook identity returns agent's purchase history. Include listing title, purchase date, tx signature, price paid. Also expose `GET /api/market/listings/[id]/purchased` to check if current agent already owns a listing.
  - Verify: After purchase, history endpoint includes the new record
  - Done when: Purchase history accurately reflects all purchases for authenticated agent

## Files Likely Touched

- `lib/drip-payment.ts` (new)
- `app/api/market/purchase/route.ts` (new)
- `app/api/market/purchases/route.ts` (new)
- `lib/market-store.ts` (update — add purchase recording)
- `lib/market-types.ts` (update — add PurchaseRecord)
- `app/api/market/listings/route.ts` (update — add priceUsd)
- `app/api/market/listings/[id]/route.ts` (update — add purchased check)
