---
id: M003
provides:
  - Pay-per-query agent chat gated by PumpFun SDK invoices on Solana
  - PumpAgent lazy singleton wrapping @pump-fun/agent-payments-sdk@3.0.0 (server-only)
  - Three payment API routes (invoice creation, on-chain verification, revenue stats)
  - Payment-gated chat endpoint (402 without verified invoice, replay-proof via consumed flag)
  - SolanaWalletProvider with Phantom + Solflare adapters and auto-connect
  - ConnectButton + RevenueBadge in agent nav alongside existing EVM WalletBadge
  - Full client-side payment flow (invoice → sign → verify → send with header)
  - KV-backed revenue tracking (totalEarned, queryCount, per-invoice state)
  - Token section on drip.surf landing page with $DRIP identity, revenue stats, PumpFun link, contract address, and buyback explainer
  - Token anchor link in landing page navbar
  - Solana dependency chain installed and deduplicated (8 packages, single @solana/web3.js copy)
key_decisions:
  - "D038: Pay-per-query revenue model via PumpFun invoices"
  - "D039: USDC on Solana as payment currency (SOL additive later)"
  - "D041: Server builds invoice → client signs → server verifies on-chain → chat proceeds"
  - "D042: Dual wallet display — EVM WalletBadge + Solana ConnectButton + RevenueBadge coexist"
  - "D043: Flat KV schema for revenue tracking and invoice lifecycle"
  - "D044: PumpAgent constructor takes (mint, environment, connection) — no Keypair for payment flow"
  - "D045: Dynamic headers via ref + Resolvable function on DefaultChatTransport"
  - "D046: Suggestions set input text instead of auto-sending — forces payment flow"
patterns_established:
  - "Invoice lifecycle: created → verified → consumed. KV tracks all states. Consumed flag prevents replay."
  - "Dual wallet ecosystems: EVM (agent pays AgentCash) + Solana (user pays agent) — independent, both visible."
  - "Payment flow phases tracked via PaymentPhase union type with inline PaymentStatus component."
  - "Structured error responses with phase field ('invoice' | 'verify') for payment debugging."
  - "Token section inline in page.tsx — single-use, page-specific, no module boundary overhead."
  - "Fetch error renders dash fallback values instead of hiding section or showing zeros."
observability_surfaces:
  - "GET /api/agent/revenue — returns { totalEarned, queryCount, tokenMint } from KV"
  - "[pump-agent] prefix for SDK initialization"
  - "[payment] prefix for invoice creation and on-chain verification"
  - "[revenue] prefix for KV counter reads"
  - "[agent-chat] prefix for payment gate decisions"
  - "[solana-payment] client-side payment lifecycle with timing"
  - "[revenue-badge] client-side badge error logging"
  - "[token-section] revenue fetch and clipboard diagnostics"
  - "PaymentStatus component shows current flow phase inline in chat UI"
  - "'Coming soon' text — deterministic signal that NEXT_PUBLIC_DRIP_TOKEN_MINT is unset"
requirement_outcomes:
  - id: R010
    from_status: active
    to_status: active
    proof: "Code-complete — PumpAgent SDK singleton, invoice/verify/revenue API routes, payment-gated chat, 37/37 contract checks. Token creation on PumpFun is a manual operational step that cannot be automated. R010 stays active until token exists on-chain."
  - id: R011
    from_status: active
    to_status: active
    proof: "Code-complete — S01 built revenue collection (invoice → verify → KV tracking → GET endpoint), S02 built display (revenue stats, buyback explainer, PumpFun link, contract address). 21/21 S02 checks pass. Tokenized Agents activation is a manual PumpFun toggle. R011 stays active until buyback loop is live."
duration: ~65min
verification_result: passed
completed_at: 2026-03-15
---

# M003: Token & Launch

**Pay-per-query agent chat on Solana with PumpFun SDK, KV revenue tracking, and token display on drip.surf — 58/58 contract checks across 2 slices. Code-complete; operational steps (token creation, deployment) remain manual.**

## What Happened

Two slices, cleanly ordered by risk.

**S01 (Payment-Gated Agent Chat)** retired all three milestone risks in ~50 minutes. Installed the full Solana dependency chain — 8 packages, 1057 transitive deps, single `@solana/web3.js` copy confirmed via `npm ls`. Built `PumpAgent` as a lazy singleton mirroring the existing `x402-client.ts` pattern. Key discovery: the SDK's constructor takes `(mint, environment, connection)`, not a Keypair — private key is only needed for admin operations, not payment acceptance (D044). This simplified the integration significantly.

Three API routes handle the payment lifecycle: `POST /api/agent/payment` builds an unsigned Solana transaction with invoice params, `POST /api/agent/payment/verify` validates payment on-chain and increments KV revenue counters, `GET /api/agent/revenue` exposes stats for the badge and token section. The chat route gained a payment gate — 402 for missing, unverified, or already-consumed invoices. Invoice replay prevention via a consumed flag in KV.

On the frontend, the agent layout now wraps with `SolanaWalletProvider` (Phantom + Solflare, auto-connect) and shows both EVM and Solana wallet badges in nav (D042). The chat page runs the full payment flow inline: POST payment → deserialize → wallet sign → send raw → POST verify → set invoice header via ref → send message. A `PaymentStatus` component renders per-phase indicators below the input bar. The transport uses a `Resolvable` header function reading from a ref to inject the invoice header dynamically without recreating the transport (D045).

**S02 (Token Display & Launch Configuration)** was a 15-minute low-risk slice. Added a Token anchor link to the navbar and built a `TokenSection` component inline in `page.tsx` — $DRIP heading with Solana Token badge, contract address with copy-to-clipboard (or "Coming soon" when unset), dynamic PumpFun link, revenue stats from the S01 endpoint, and a buyback explainer with the $10 threshold note. Uses existing component library (Section, Card, ScrollReveal, FadeInStagger, Badge, GlassPanel). Error handling: fetch failures render "–" fallback values, clipboard failures log warnings but don't crash.

## Cross-Slice Verification

**Success criterion 1: Wallet connect → pay USDC → agent responds.**
S01 built the complete flow: SolanaWalletProvider with Phantom/Solflare adapters, `executePaymentFlow()` in the chat page (invoice → sign → verify → send with header), payment gate in chat route returning 402 without verified invoice. 37/37 contract checks verify structure. Browser verification confirms ConnectButton renders, input placeholder changes based on wallet state, and "Connect your Solana wallet" prompt appears in empty state.

**Success criterion 2: Revenue badge visible in agent nav.**
`RevenueBadge` polls `/api/agent/revenue` every 60s. Browser verification confirms "0 USDC" badge renders in agent nav alongside EVM WalletBadge.

**Success criterion 3: Token section on drip.surf.**
S02's TokenSection displays $DRIP info, PumpFun link, contract address (or "Coming soon"), revenue stats, and buyback explainer. 21/21 contract checks. 8/8 browser assertions pass (Token heading, $DRIP text, Coming soon state, PumpFun link, zero USDC default, Tokenized Agents Loop copy, $10 threshold note, #token section visibility).

**Success criterion 4: Payment transactions verifiable on Solana explorer.**
Transactions are real Solana transactions built by the SDK and submitted via `sendRawTransaction`. On-chain by design — any transaction hash is viewable on Solscan/Solana Explorer.

**Success criterion 5: Buyback percentage via Tokenized Agents.**
Documented as a manual step. Token section UI explains the mechanism and $10 threshold. PumpFun's Tokenized Agents dashboard is the configuration surface — not automatable via code.

**Definition of Done — operational items:**
Three DoD items require deployment and manual operational steps: (1) $DRIP token on PumpFun — manual creation, (2) at least one payment verified through full flow — requires funded wallet + RPC, (3) success criteria re-checked against live behavior — requires deployment. These are operational, not code gaps. The codebase is complete and structurally verified.

## Requirement Changes

- **R010 (PumpFun Token Launch):** active → active — Code-complete: PumpAgent SDK singleton, 3 payment API routes, payment-gated chat. 37/37 S01 contract checks. Stays active because the actual SPL token creation on PumpFun is a manual operational step that hasn't happened yet.
- **R011 (Tokenized Agents Revenue Loop):** active → active — Code-complete: revenue collection (S01), revenue display with buyback explainer (S02). 58/58 total checks. Stays active because Tokenized Agents activation is a manual PumpFun toggle requiring the token to exist first.

No requirements changed status in this milestone. Both R010 and R011 had their codebase work completed but require manual operational steps (token creation, Tokenized Agents activation, wallet funding, deployment) that are outside code scope. Validation evidence was updated in requirement notes but formal status transitions are deferred until operational steps are complete.

## Forward Intelligence

### What the next milestone should know
- M003 is the final milestone in the current roadmap. No downstream milestones are planned. Remaining work is operational: create $DRIP on PumpFun, activate Tokenized Agents, fund wallets (Solana for user payments, EVM for AgentCash x402), deploy to Vercel, configure DNS for drip.surf / agent.drip.surf.
- The full deployment checklist: (1) Vercel project + KV provisioning, (2) env vars (SOLANA_RPC_URL, NEXT_PUBLIC_SOLANA_RPC_URL, NEXT_PUBLIC_DRIP_TOKEN_MINT, OPENROUTER_API_KEY, EVM wallet key), (3) DNS for drip.surf and agent.drip.surf, (4) create $DRIP on PumpFun with brand assets, (5) set NEXT_PUBLIC_DRIP_TOKEN_MINT to the created mint address, (6) activate Tokenized Agents on PumpFun dashboard, (7) fund agent's EVM wallet for AgentCash API calls.
- Six requirements remain active (R005, R006, R007, R010, R011). All are code-complete but pending live integration verification via deployment.

### What's fragile
- `@pump-fun/agent-payments-sdk@3.0.0` is 2 days old — API surface could change. All SDK calls are contained in `lib/pump-agent.ts` singleton, so breakage is isolated.
- Wallet adapter CSS imported in `wallet-provider.tsx` could conflict with Tailwind reset or dark theme — check there first if Solana wallet UI looks wrong.
- Revenue fetch in TokenSection is a single mount fetch (no polling) — stale if user stays on landing page during active trading. Acceptable for landing page; agent UI has polling via RevenueBadge.
- `bigint: Failed to load bindings` build warning from Solana's bn.js — cosmetic, pure JS fallback is functionally identical.

### Authoritative diagnostics
- `GET /api/agent/revenue` — fastest check for payment tracking health. Returns `{ totalEarned, queryCount, tokenMint }` from KV.
- `npm ls @solana/web3.js` — confirms no duplicate Solana copies. Run after any dependency change.
- `scripts/verify-s01.sh` (37 checks) + `scripts/verify-s02.sh` (21 checks) — structural verification for all M003 code.
- Browser console grep `[payment]`, `[pump-agent]`, `[revenue]`, `[agent-chat]`, `[solana-payment]`, `[token-section]` — all M003 subsystems have prefixed logging.
- "Coming soon" visible on landing page Token section — deterministic signal that `NEXT_PUBLIC_DRIP_TOKEN_MINT` is unset.

### What assumptions changed
- PumpAgent doesn't need a Keypair for payment flow — only for admin operations (withdraw, distribute). Simpler than planned.
- `@coral-xyz/anchor` and `@solana/spl-token` needed explicit installation — not pulled transitively by the SDK.
- AI SDK v6 `DefaultChatTransport` accepts a `Resolvable` headers function — enabled dynamic invoice header injection without transport recreation.

## Files Created/Modified

- `lib/pump-agent.ts` — PumpAgent lazy singleton with server-only guard
- `app/api/agent/payment/route.ts` — Invoice creation, builds unsigned Solana transaction
- `app/api/agent/payment/verify/route.ts` — On-chain verification, KV revenue counter updates
- `app/api/agent/revenue/route.ts` — Revenue stats endpoint (totalEarned, queryCount, tokenMint)
- `app/api/agent/chat/route.ts` — Added payment gate (402 without verified invoice)
- `components/solana/wallet-provider.tsx` — SolanaWalletProvider context (Phantom + Solflare)
- `components/solana/connect-button.tsx` — Wallet connect/disconnect button with truncated address
- `components/ui/revenue-badge.tsx` — Revenue display badge (polls every 60s)
- `app/agent/layout.tsx` — Wrapped with SolanaWalletProvider, added ConnectButton + RevenueBadge
- `app/agent/page.tsx` — Full payment flow, PaymentStatus indicators, suggestion input-fill
- `components/layout/navbar.tsx` — Added Token anchor link to navLinks
- `app/page.tsx` — Added TokenSection with $DRIP identity, revenue stats, PumpFun link, buyback explainer
- `scripts/verify-s01.sh` — 37-check S01 contract verification
- `scripts/verify-s02.sh` — 21-check S02 contract verification
- `package.json` — Added 8 Solana ecosystem dependencies
