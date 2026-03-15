---
id: T01
parent: S01
milestone: M003
provides:
  - PumpAgent lazy singleton with server-only guard
  - Payment invoice creation endpoint (POST /api/agent/payment)
  - Payment verification endpoint (POST /api/agent/payment/verify)
  - Revenue stats endpoint (GET /api/agent/revenue)
  - Payment-gated chat route (402 without verified invoice)
  - All Solana dependency chain installed and deduplicated
key_files:
  - lib/pump-agent.ts
  - app/api/agent/payment/route.ts
  - app/api/agent/payment/verify/route.ts
  - app/api/agent/revenue/route.ts
  - app/api/agent/chat/route.ts
  - package.json
key_decisions:
  - "D044: PumpAgent constructor takes (mint, environment, connection) — no Keypair needed for payment flow. Private key only for admin ops."
patterns_established:
  - "Invoice lifecycle: created (unverified) → verified (on-chain confirmed) → consumed (used for chat). KV tracks all states."
  - "Structured error responses with `phase` field: 'invoice' | 'verify' for payment debugging."
observability_surfaces:
  - "GET /api/agent/revenue — returns { totalEarned, queryCount, tokenMint } from KV"
  - "[pump-agent] prefix for SDK initialization and errors"
  - "[payment] prefix for invoice creation and on-chain verification"
  - "[revenue] prefix for KV counter reads"
  - "[agent-chat] prefix logs payment gate decisions (rejected/consumed)"
duration: 25min
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Install Solana dependencies and build server-side payment infrastructure

**Installed full Solana dependency chain and built all server-side payment infrastructure: PumpAgent singleton, three API routes, and payment-gated chat endpoint.**

## What Happened

Installed `@pump-fun/agent-payments-sdk@3.0.0` (pinned exact), `@solana/web3.js@1.98.4` (SDK's declared peer dep), wallet adapter packages, and Anchor/SPL-Token peer deps. All 1057 new packages installed cleanly. `npm ls @solana/web3.js` confirms exactly one resolved copy — no duplicates.

Built `lib/pump-agent.ts` as a lazy singleton following the `x402-client.ts` pattern. Key deviation from plan: the SDK's `PumpAgent` constructor takes `(mint, environment, connection)`, not a Keypair. Verified via the SDK's type definitions — `buildAcceptPaymentInstructions` and `validateInvoicePayment` don't need the agent's signing key. The private key is only for admin operations (withdraw, distribute). This simplifies the singleton — it only requires `NEXT_PUBLIC_DRIP_TOKEN_MINT` and `SOLANA_RPC_URL`.

Built three API routes:
- `POST /api/agent/payment` — generates unique invoice params (memo from timestamp, 1-hour validity window), calls SDK's `buildAcceptPaymentInstructions`, serializes an unsigned transaction for client wallet signing, stores invoice in KV.
- `POST /api/agent/payment/verify` — looks up invoice from KV, calls SDK's `validateInvoicePayment` with stored params, on success increments `revenue:total_earned` and `revenue:query_count` KV counters.
- `GET /api/agent/revenue` — reads KV counters, returns `{ totalEarned, queryCount, tokenMint }` with `Cache-Control: no-store`.

Modified `app/api/agent/chat/route.ts` with payment gate: reads `x-payment-invoice` header, verifies invoice exists in KV and is verified+not consumed, marks consumed before proceeding to `streamText`. Returns 402 with `{ error: "Payment required", code: "PAYMENT_REQUIRED" }` for any failure case.

## Verification

- `next build` — compiled successfully, all 3 new routes appear in route table as dynamic (`ƒ`)
- `npm ls @solana/web3.js` — single resolved version (1.98.4), all transitive deps deduped
- `grep -c "server-only" lib/pump-agent.ts` → 1
- All API routes export expected HTTP method handlers (POST/GET)
- Chat route contains 3 occurrences of 402 response code (no header, not verified, already consumed)
- All console output uses bracketed prefixes: `[pump-agent]`, `[payment]`, `[revenue]`, `[agent-chat]`
- Pinned versions confirmed: `@pump-fun/agent-payments-sdk@3.0.0`, `@solana/web3.js@1.98.4`

### Slice-Level Verification (partial — T01 is first task)

| Check | Status |
|-------|--------|
| All new files exist with expected exports | ✅ |
| Dependencies installed with correct versions | ✅ |
| No duplicate @solana/web3.js copies | ✅ |
| next build succeeds | ✅ |
| API routes respond to basic requests | ⏳ (needs running server — T02 will verify) |
| Revenue KV keys readable | ⏳ (needs KV connection) |
| Wallet provider renders without React errors | ⏳ (T02 scope) |

## Diagnostics

- `curl /api/agent/revenue` — returns current revenue stats from KV
- KV keys: `revenue:total_earned`, `revenue:query_count` for aggregate stats; `invoice:{id}` for individual payment records
- Payment errors include `phase` field (`"invoice"` or `"verify"`) identifying failure location
- RPC URL is redacted in logs (credentials stripped from connection string)
- `bigint: Failed to load bindings, pure JS will be used` warning is cosmetic — Solana's BN.js fallback works correctly

## Deviations

- **PumpAgent constructor doesn't use Keypair** — Plan said `Keypair.fromSecretKey()` with `PUMP_AGENT_PRIVATE_KEY`. SDK actually takes `(mint, environment, connection)`. Private key not needed for payment acceptance/verification flow. Documented as D044.
- **Added `@coral-xyz/anchor@0.31.1` and `@solana/spl-token@0.4.9`** — These are declared as dependencies of the SDK (not just peer deps). Installed explicitly to ensure correct versions and avoid resolution mismatches.

## Known Issues

- `bigint: Failed to load bindings, pure JS will be used` appears during build — cosmetic warning from Solana's bn.js. Pure JS fallback is functionally identical. Would be resolved by native binding compilation but not worth the build complexity.
- Wallet adapter deprecation warnings in npm install — several transitive deps (`@walletconnect/*`, `@toruslabs/*`) are deprecated. These are deep transitive deps from wallet adapter, not controllable by us.

## Files Created/Modified

- `lib/pump-agent.ts` — PumpAgent lazy singleton with server-only guard, USDC constants, unit conversion helper
- `app/api/agent/payment/route.ts` — Invoice creation endpoint, builds unsigned Solana transaction for client signing
- `app/api/agent/payment/verify/route.ts` — On-chain payment verification, KV revenue counter updates
- `app/api/agent/revenue/route.ts` — Revenue stats endpoint (totalEarned, queryCount, tokenMint)
- `app/api/agent/chat/route.ts` — Added payment gate requiring verified+unconsumed invoice via x-payment-invoice header
- `package.json` — Added 8 Solana ecosystem dependencies (all pinned exact)
