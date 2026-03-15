---
id: S01
parent: M003
milestone: M003
provides:
  - PumpAgent lazy singleton wrapping @pump-fun/agent-payments-sdk (server-only)
  - Payment invoice creation endpoint (POST /api/agent/payment)
  - Payment verification endpoint (POST /api/agent/payment/verify)
  - Revenue stats endpoint (GET /api/agent/revenue)
  - Payment-gated chat route (402 without verified invoice)
  - SolanaWalletProvider context wrapping agent layout
  - ConnectButton with truncated address display
  - RevenueBadge polling revenue endpoint every 60s
  - Full client-side payment flow (invoice → sign → verify → send with header)
  - Solana dependency chain installed and deduplicated (8 packages)
requires:
  - slice: none
    provides: first slice in M003
affects:
  - S02
key_files:
  - lib/pump-agent.ts
  - app/api/agent/payment/route.ts
  - app/api/agent/payment/verify/route.ts
  - app/api/agent/revenue/route.ts
  - app/api/agent/chat/route.ts
  - components/solana/wallet-provider.tsx
  - components/solana/connect-button.tsx
  - components/ui/revenue-badge.tsx
  - app/agent/layout.tsx
  - app/agent/page.tsx
  - scripts/verify-s01.sh
key_decisions:
  - "D044: PumpAgent constructor takes (mint, environment, connection) — no Keypair needed for payment flow"
  - "D045: Dynamic headers via ref + Resolvable function on DefaultChatTransport"
  - "D046: Suggestions set input text instead of auto-sending — forces user through payment flow"
patterns_established:
  - "Invoice lifecycle: created → verified → consumed. KV tracks all states. Consumed flag prevents replay."
  - "Dual wallet display: EVM WalletBadge (agent's x402) + Solana ConnectButton + RevenueBadge coexist in agent nav."
  - "Payment flow phases tracked via PaymentPhase union type with PHASE_LABELS mapping and inline PaymentStatus component."
  - "Structured error responses with phase field ('invoice' | 'verify') for payment debugging."
observability_surfaces:
  - "GET /api/agent/revenue — returns { totalEarned, queryCount, tokenMint } from KV"
  - "[pump-agent] prefix for SDK initialization"
  - "[payment] prefix for invoice creation and on-chain verification"
  - "[revenue] prefix for KV counter reads"
  - "[agent-chat] prefix for payment gate decisions"
  - "[solana-payment] client-side console logs for payment lifecycle with timing"
  - "[revenue-badge] client-side badge error logging"
  - "PaymentStatus component shows current flow phase inline in chat UI"
drill_down_paths:
  - .gsd/milestones/M003/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T02-SUMMARY.md
duration: ~50min
verification_result: passed
completed_at: 2026-03-15
---

# S01: Payment-Gated Agent Chat

**Full pay-per-query infrastructure on Solana — PumpFun SDK integration, three API routes, payment-gated chat, wallet UI with revenue badge. 37/37 contract checks pass.**

## What Happened

Installed the full Solana dependency chain: `@pump-fun/agent-payments-sdk@3.0.0`, `@solana/web3.js@1.98.4`, wallet adapter packages, Anchor, and SPL-Token — 8 packages total, 1057 transitive deps. `npm ls @solana/web3.js` confirms a single resolved copy. No duplicates.

Built `lib/pump-agent.ts` as a lazy singleton following the existing `x402-client.ts` pattern. Key finding: the SDK's `PumpAgent` constructor takes `(mint, environment, connection)`, not a Keypair. Private key is only needed for admin operations (withdraw/distribute), not for payment acceptance. This simplified the singleton significantly (D044).

Built three API routes: `POST /api/agent/payment` generates invoice params and serializes an unsigned Solana transaction for client signing. `POST /api/agent/payment/verify` validates payment on-chain via SDK and increments KV revenue counters. `GET /api/agent/revenue` returns `{ totalEarned, queryCount, tokenMint }` for the revenue badge and future S02 token display.

Added a payment gate to `app/api/agent/chat/route.ts` — reads `x-payment-invoice` header, verifies the invoice is verified and unconsumed in KV, marks it consumed, then proceeds to `streamText`. Returns 402 for missing, unverified, or already-consumed invoices.

On the frontend, built `SolanaWalletProvider` (Phantom + Solflare adapters with auto-connect), `ConnectButton` (truncated address when connected, disconnect on click), and `RevenueBadge` (polls revenue endpoint every 60s). The agent layout wraps with the provider and shows both EVM and Solana wallet badges in nav (D042).

The chat page implements the full payment flow in `executePaymentFlow()`: POST payment → deserialize transaction → wallet signTransaction → sendRawTransaction → POST verify → set invoice header via ref → sendMessage. Payment status renders inline below the input bar with per-phase indicators. The transport uses a `Resolvable<Record<string, string>>` header function reading from a ref to inject the invoice header dynamically without recreating the transport (D045).

All three milestone risks retired: SDK stability proven (compiles and exports work), React 19 + wallet adapter confirmed compatible (renders without errors), Solana dependency chain deduplicated (single web3.js copy).

## Verification

**Contract verification: 37/37 passed, 0 failed, 0 warnings**
- 10 file existence checks ✅
- 5 client directive checks ✅
- 10 export/pattern checks ✅
- 4 API route export checks ✅
- 6 dependency version checks ✅
- 1 duplicate check ✅
- 1 build check ✅

**Browser verification (dev server):**
- "Connect Wallet" button visible in agent nav
- "0 USDC" revenue badge renders
- EVM WalletBadge preserved alongside Solana components
- "Connect your Solana wallet" prompt in empty state
- Input placeholder changes based on wallet connection state
- No React 19 compatibility errors in console

## Requirements Advanced

- R010 — Payment infrastructure built: SDK integration, invoice creation, on-chain verification, revenue tracking. Token creation on PumpFun remains a manual step.
- R011 — Revenue collection half built: agent earns USDC per query, KV tracks `totalEarned` and `queryCount`, revenue endpoint exposes stats. Buyback activation is S02 + manual PumpFun toggle.

## Requirements Validated

- None moved to validated — R010 and R011 require token creation and Tokenized Agents activation (manual + S02) to be fully validated.

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

- **PumpAgent doesn't use Keypair** — Plan said `Keypair.fromSecretKey()` with `PUMP_AGENT_PRIVATE_KEY`. SDK actually takes `(mint, environment, connection)`. Private key not needed for payment flow. Documented as D044.
- **Added `@coral-xyz/anchor@0.31.1` and `@solana/spl-token@0.4.9`** — Not in the original plan. These are SDK dependencies that needed explicit installation for correct version resolution.
- **Suggestions set input text instead of auto-sending** — Changed from auto-send to fill-input-only to force users through the payment flow. Documented as D046.

## Known Limitations

- No .env.local configured — revenue badge shows "0 USDC" and wallet connections can't reach RPC without `SOLANA_RPC_URL` and `NEXT_PUBLIC_SOLANA_RPC_URL`. Expected for local dev without credentials.
- `bigint: Failed to load bindings, pure JS will be used` warning during build — cosmetic, from Solana's bn.js. Pure JS fallback is functionally identical.
- Wallet adapter deprecation warnings in `npm install` — deep transitive deps from wallet adapter packages. Not controllable.
- Live end-to-end payment verification requires a funded Solana wallet, RPC endpoint, and deployed KV. Contract checks verify structure; integration proof requires deployment.

## Follow-ups

- S02 consumes `GET /api/agent/revenue` response shape and `NEXT_PUBLIC_DRIP_TOKEN_MINT` env var convention for token display section.
- Manual $DRIP token creation on PumpFun needed before Tokenized Agents can be activated.

## Files Created/Modified

- `lib/pump-agent.ts` — PumpAgent lazy singleton with server-only guard
- `app/api/agent/payment/route.ts` — Invoice creation, builds unsigned Solana transaction
- `app/api/agent/payment/verify/route.ts` — On-chain verification, KV revenue counter updates
- `app/api/agent/revenue/route.ts` — Revenue stats endpoint
- `app/api/agent/chat/route.ts` — Added payment gate (402 without verified invoice)
- `components/solana/wallet-provider.tsx` — SolanaWalletProvider context
- `components/solana/connect-button.tsx` — Wallet connect/disconnect button
- `components/ui/revenue-badge.tsx` — Revenue display badge
- `app/agent/layout.tsx` — Wrapped with SolanaWalletProvider, added ConnectButton + RevenueBadge
- `app/agent/page.tsx` — Full payment flow, payment status indicators
- `scripts/verify-s01.sh` — 37-check contract verification script
- `package.json` — Added 8 Solana ecosystem dependencies

## Forward Intelligence

### What the next slice should know
- `GET /api/agent/revenue` returns `{ totalEarned: string, queryCount: number, tokenMint: string | null }`. S02 can fetch this from a server component for the token display section.
- `NEXT_PUBLIC_DRIP_TOKEN_MINT` is the env var convention for the $DRIP contract address. Currently used by pump-agent.ts and revenue endpoint.
- Revenue KV keys are `revenue:total_earned` and `revenue:query_count`. S02 can read these directly from KV in a server component if needed.

### What's fragile
- `@pump-fun/agent-payments-sdk@3.0.0` is 2 days old — API surface may change. The singleton in `pump-agent.ts` wraps all SDK calls, so changes are contained.
- Wallet adapter CSS (`@solana/wallet-adapter-react-ui`) is imported in `wallet-provider.tsx`. If it conflicts with Tailwind's reset or dark theme, that's where to look.

### Authoritative diagnostics
- `GET /api/agent/revenue` — the fastest way to check if payment tracking is working. Returns live KV state.
- `npm ls @solana/web3.js` — confirms no duplicate Solana copies. Run after any dependency change.
- `scripts/verify-s01.sh` — 37 structural checks. Run after any S01-related file changes.

### What assumptions changed
- Plan assumed PumpAgent needs a Keypair for payment flow — it doesn't. Only for admin operations (withdraw/distribute). This is a simpler integration than expected.
- Plan didn't account for `@coral-xyz/anchor` and `@solana/spl-token` as explicit dependencies — they needed manual installation alongside the SDK.
