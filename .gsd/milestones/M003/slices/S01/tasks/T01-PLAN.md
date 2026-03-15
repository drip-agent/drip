---
estimated_steps: 6
estimated_files: 6
---

# T01: Install Solana dependencies and build server-side payment infrastructure

**Slice:** S01 — Payment-Gated Agent Chat
**Milestone:** M003

## Description

Install the full Solana dependency chain (`@pump-fun/agent-payments-sdk`, `@solana/web3.js`, wallet adapter packages) and build all server-side payment infrastructure: PumpAgent lazy singleton, three API routes (payment invoice, payment verification, revenue stats), and payment gating on the chat endpoint. This task retires two of three roadmap risks (SDK stability, dependency chain) without touching any frontend code.

## Steps

1. **Install all Solana dependencies.** `@pump-fun/agent-payments-sdk@3.0.0` (pin exact), `@solana/web3.js` at the SDK's declared peer dep version (check with `npm info`), `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`, `@solana/wallet-adapter-base`. Run `next build` to verify no compilation errors. Run `npm ls @solana/web3.js` to confirm single copy — no duplicates.

2. **Build `lib/pump-agent.ts` — PumpAgent lazy singleton.** `import "server-only"`. Create `PumpAgent` instance from `@pump-fun/agent-payments-sdk` using `Keypair.fromSecretKey()` with `PUMP_AGENT_PRIVATE_KEY` env var, `Connection` from `SOLANA_RPC_URL`, USDC mint as payment currency. Lazy initialization on first call (same pattern as `lib/x402-client.ts`). Export `getPumpAgent()` function. Clear error on missing env vars — throw with `[pump-agent]` prefix and guidance.

3. **Build `POST /api/agent/payment/route.ts` — invoice creation.** Accept `{ action: string }` body (e.g. "chat_query"). Call PumpAgent to build payment instructions for the configured query price. Return `{ invoiceId, serializedTransaction, amount, currency }`. Handle SDK errors with structured `{ error, phase: "invoice" }` response. Log with `[payment]` prefix.

4. **Build `POST /api/agent/payment/verify/route.ts` — payment verification.** Accept `{ invoiceId, txSignature }` body. Call PumpAgent to validate the payment on-chain. On success: increment KV revenue counter (`revenue:total_earned`, `revenue:query_count`), store invoice as verified (`invoice:{invoiceId}` → `{ verified: true, timestamp, txSignature }`). Return `{ verified: true, invoiceId }`. On failure: return structured error with `phase: "verify"`.

5. **Build `GET /api/agent/revenue/route.ts` — revenue stats.** Read from KV: `revenue:total_earned` (string, USDC amount), `revenue:query_count` (number). Read `NEXT_PUBLIC_DRIP_TOKEN_MINT` env var (nullable — token may not exist yet). Return `{ totalEarned: string, queryCount: number, tokenMint: string | null }`. Cache-Control: `no-store` (always fresh for polling).

6. **Modify `app/api/agent/chat/route.ts` — add payment gate.** Before `streamText`, check for `x-payment-invoice` header. Look up invoice ID in KV — must be verified and not already consumed. If valid: mark invoice as consumed (`invoice:{id}` → add `consumed: true`), proceed with streaming. If missing/invalid: return 402 with `{ error: "Payment required", code: "PAYMENT_REQUIRED" }`. Log payment verification with `[agent-chat]` prefix.

## Must-Haves

- [ ] All Solana packages install without errors; `next build` passes
- [ ] `npm ls @solana/web3.js` shows exactly one copy (no duplicates)
- [ ] `lib/pump-agent.ts` exports `getPumpAgent()` with `import "server-only"` guard
- [ ] `POST /api/agent/payment` returns invoiceId + serialized transaction
- [ ] `POST /api/agent/payment/verify` validates on-chain and updates KV revenue counter
- [ ] `GET /api/agent/revenue` returns `{ totalEarned, queryCount, tokenMint }` from KV
- [ ] Chat route returns 402 without valid `x-payment-invoice` header
- [ ] All console output uses bracketed prefixes (`[pump-agent]`, `[payment]`, `[revenue]`, `[agent-chat]`)

## Verification

- `next build` completes without errors
- `npm ls @solana/web3.js` shows single resolved version
- `grep -c "server-only" lib/pump-agent.ts` returns 1
- API route files export expected HTTP method handlers
- Chat route contains 402 response code for missing payment

## Observability Impact

- Signals added: `[pump-agent]` for SDK init/errors, `[payment]` for invoice creation/verification, `[revenue]` for KV counter updates
- How a future agent inspects this: `curl /api/agent/revenue` for current stats; KV keys `revenue:*` and `invoice:*` for raw data
- Failure state exposed: structured error responses with `phase` field identifying where in the payment flow failure occurred; missing env vars throw at init with guidance message

## Inputs

- `lib/x402-client.ts` — pattern reference for lazy singleton with server-only guard
- `lib/feed.ts` — KV usage pattern (`@vercel/kv` import, key naming, get/set)
- `app/api/agent/chat/route.ts` — existing chat route to modify
- M003 research — PumpAgent constructor API, payment instruction flow, verification API

## Expected Output

- `lib/pump-agent.ts` — PumpAgent lazy singleton, server-only
- `app/api/agent/payment/route.ts` — invoice creation endpoint
- `app/api/agent/payment/verify/route.ts` — payment verification endpoint
- `app/api/agent/revenue/route.ts` — revenue stats endpoint
- `app/api/agent/chat/route.ts` — modified with payment gate (402 without valid invoice)
- `package.json` — updated with all Solana dependencies
