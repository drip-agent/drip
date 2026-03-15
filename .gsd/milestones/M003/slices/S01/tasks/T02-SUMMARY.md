---
id: T02
parent: S01
milestone: M003
provides:
  - SolanaWalletProvider context wrapping agent layout
  - ConnectButton showing wallet address or "Connect Wallet"
  - RevenueBadge polling /api/agent/revenue every 60s
  - Full payment flow in chat page — invoice → sign → verify → send with x-payment-invoice header
  - Payment status indicators during signing flow
  - scripts/verify-s01.sh contract verification script (37 checks)
key_files:
  - components/solana/wallet-provider.tsx
  - components/solana/connect-button.tsx
  - components/ui/revenue-badge.tsx
  - app/agent/layout.tsx
  - app/agent/page.tsx
  - scripts/verify-s01.sh
key_decisions:
  - "D045: Dynamic headers via ref + Resolvable function on DefaultChatTransport — invoiceRef.current set before sendMessage, transport reads it via header function. Avoids per-message transport recreation."
  - "D046: Suggestions set input text instead of auto-sending — forces user through payment flow (click Send) rather than bypassing it."
patterns_established:
  - "Payment flow phases tracked via PaymentPhase union type with PHASE_LABELS mapping. PaymentStatus component renders inline below input bar."
  - "Console observability prefix: [solana-payment] for client-side payment lifecycle, [revenue-badge] for badge errors."
  - "Wallet connect prompt shown in empty state when disconnected. Input placeholder changes based on connection state."
observability_surfaces:
  - "[solana-payment] console logs for each payment phase with timing (invoice creation, signing, tx submission, verification)"
  - "Revenue badge in nav shows total earned USDC at a glance"
  - "PaymentStatus component shows current flow phase inline in chat UI"
  - "Payment errors surfaced with per-phase messages (invoice, signing, tx, verification)"
duration: ~25min
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T02: Solana wallet frontend integration and payment-gated chat UX

**Built full client-side Solana wallet integration and payment-gated chat flow — users connect Phantom/Solflare, see revenue badge in nav, and go through invoice→sign→verify before each message sends.**

## What Happened

Built 3 new components and modified 2 existing files to complete the end-to-end payment-gated chat experience.

**SolanaWalletProvider** wraps ConnectionProvider + WalletProvider with Phantom and Solflare adapters, auto-connect enabled. Uses NEXT_PUBLIC_SOLANA_RPC_URL with mainnet fallback.

**ConnectButton** uses useWallet() — shows truncated address (4…4) when connected with disconnect on click, "Connect Wallet" when disconnected. Styled to match existing nav glass aesthetic.

**RevenueBadge** polls GET /api/agent/revenue every 60s (same pattern as WalletBadge). Shows total earned USDC with trend icon.

**Layout** wraps with SolanaWalletProvider, adds ConnectButton + RevenueBadge to both desktop and mobile nav alongside existing WalletBadge. Both EVM and Solana wallet ecosystems coexist.

**Chat page** implements the full payment flow before sendMessage via `executePaymentFlow()`:
1. POST /api/agent/payment with userPublicKey → get invoice + serialized tx
2. Deserialize Transaction, call wallet.signTransaction()
3. connection.sendRawTransaction() to Solana
4. POST /api/agent/payment/verify with invoiceId + txSignature
5. Set x-payment-invoice header via ref, call sendMessage

Payment status indicators show current phase (building invoice → signing → verifying → sending → error) inline below the input bar. Each phase has per-step error messages.

Key technical decision: used `Resolvable<Record<string, string>>` header function on DefaultChatTransport with a ref (`invoiceRef`) to dynamically inject the x-payment-invoice header per request without recreating the transport.

**React 19 + wallet adapter compatibility risk retired** — build succeeds, no React errors in console, wallet adapter renders and functions correctly with React 19.2.3.

## Verification

- `bash scripts/verify-s01.sh` — **37/37 passed, 0 failed, 0 warnings**
  - All 10 required files exist
  - All 5 client components have "use client" directive
  - All expected exports present (SolanaWalletProvider, ConnectButton, RevenueBadge)
  - Layout wraps with SolanaWalletProvider, includes all 3 badges
  - Chat page includes x-payment-invoice, signTransaction, sendRawTransaction
  - All API routes export correct HTTP methods
  - All 6 dependencies at correct versions
  - Single @solana/web3.js copy (no duplicates)
  - `next build` succeeds
- Browser verification at /agent:
  - "Connect Wallet" button visible in nav ✅
  - "0 USDC" revenue badge visible ✅
  - "N/A" WalletBadge (EVM) preserved ✅
  - "Connect your Solana wallet" prompt in empty state ✅
  - Input placeholder says "Connect wallet to start…" when disconnected ✅
  - No React 19 compatibility errors in console ✅

## Diagnostics

- **Revenue badge**: polls GET /api/agent/revenue — shows earned USDC in nav, errors logged with `[revenue-badge]` prefix
- **Payment flow**: browser console `[solana-payment]` prefix shows each phase with timing and error context
- **Payment status**: PaymentStatus component renders inline below input bar during flow — shows current phase or error message
- **Invoice lifecycle**: server-side KV tracks invoice states (created → verified → consumed), client logs invoice IDs
- **Error phases**: payment errors include phase context (creating-invoice, awaiting-signature, submitting-tx, verifying) for debugging

## Deviations

- Suggestions now set input text instead of auto-sending — forces user through the payment flow via Send button click rather than bypassing it. Better UX for paid queries.
- Verification script used `fs.readFileSync` for dependency version checks instead of `require()` because wallet adapter packages are ESM-only.
- Script arithmetic used `PASS=$((PASS + 1))` instead of `((PASS++))` to avoid bash exit-code-1 on first increment.

## Known Issues

- No .env.local configured — revenue badge shows "0 USDC" and wallet badge shows "N/A" because KV_REST_API_URL and SOLANA_RPC_URL are not set. This is expected for local dev without credentials.
- `bigint: Failed to load bindings, pure JS will be used` warning is cosmetic (documented in T01).

## Files Created/Modified

- `components/solana/wallet-provider.tsx` — SolanaWalletProvider context (ConnectionProvider + WalletProvider with Phantom/Solflare)
- `components/solana/connect-button.tsx` — Wallet connect/disconnect button with truncated address display
- `components/ui/revenue-badge.tsx` — Revenue display badge polling /api/agent/revenue every 60s
- `app/agent/layout.tsx` — Modified: wrapped with SolanaWalletProvider, added ConnectButton + RevenueBadge to desktop/mobile nav
- `app/agent/page.tsx` — Modified: full payment flow (invoice→sign→verify→send) before sendMessage, payment status indicators, wallet connection check
- `scripts/verify-s01.sh` — S01 contract verification script (37 checks)
- `.gsd/milestones/M003/slices/S01/tasks/T02-PLAN.md` — Added Observability Impact section
