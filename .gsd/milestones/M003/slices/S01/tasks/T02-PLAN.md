---
estimated_steps: 6
estimated_files: 7
---

# T02: Solana wallet frontend integration and payment-gated chat UX

**Slice:** S01 — Payment-Gated Agent Chat
**Milestone:** M003

## Description

Build the client-side Solana wallet integration and wire the full payment flow into the agent chat page. Users connect Phantom/Solflare via the wallet adapter, see a connect button and revenue badge in the agent nav, and go through invoice→sign→verify before each chat message is sent. This task retires the React 19 + wallet adapter compatibility risk and completes the end-to-end payment-gated chat experience.

## Steps

1. **Build `components/solana/wallet-provider.tsx` — SolanaWalletProvider context.** `"use client"` directive. Wrap `ConnectionProvider` (endpoint from `NEXT_PUBLIC_SOLANA_RPC_URL` with fallback to public mainnet) + `WalletProvider` with `PhantomWalletAdapter` and `SolflareWalletAdapter`. Export as a single `SolanaWalletProvider` component that wraps children. Auto-connect enabled. No wallet modal UI needed — connect button handles interaction.

2. **Build `components/solana/connect-button.tsx` — wallet connect/disconnect button.** `"use client"`. Use `useWallet()` hook. When disconnected: show "Connect Wallet" button styled to match existing nav aesthetic (dark bg, aqua text, glass border). When connected: show truncated address (first 4 + last 4 chars) with disconnect on click. Match `WalletBadge` sizing and spacing from layout.tsx.

3. **Build `components/ui/revenue-badge.tsx` — revenue display badge.** `"use client"`. Poll `GET /api/agent/revenue` every 60s (same pattern as `WalletBadge`). Display total earned USDC with a small revenue icon. Show "—" while loading, "⚠" on error. Styled identically to `WalletBadge`.

4. **Modify `app/agent/layout.tsx` — wrap with SolanaWalletProvider, add nav elements.** Import `SolanaWalletProvider` and wrap the entire agent layout. Add `ConnectButton` and `RevenueBadge` to the desktop nav (alongside existing `WalletBadge`) and mobile dropdown. Preserve existing `WalletBadge` (x402 EVM balance) — both wallet ecosystems coexist.

5. **Modify `app/agent/page.tsx` — implement payment flow before sending messages.** Before `sendMessage`: (a) check wallet connected via `useWallet()` — if not, show toast/inline prompt to connect. (b) Call `POST /api/agent/payment` to get invoice + serialized transaction. (c) Deserialize transaction, call `wallet.signTransaction()`. (d) Send signed transaction to Solana via `connection.sendRawTransaction()`. (e) Call `POST /api/agent/payment/verify` with invoiceId + txSignature. (f) On verified: call `sendMessage` with custom headers including `x-payment-invoice: {invoiceId}`. Show payment status indicators during the flow (building invoice → signing → verifying → sending). Handle failures at each step with user-visible error messages.

6. **Write `scripts/verify-s01.sh` — contract verification script.** Check: all new files exist, expected exports present, dependencies installed at correct versions, no duplicate `@solana/web3.js`, `next build` succeeds, API route files have expected HTTP method exports, wallet provider has `"use client"` directive, layout wraps with SolanaWalletProvider, chat route has 402 response.

## Must-Haves

- [ ] `SolanaWalletProvider` renders without React 19 errors — risk retired
- [ ] Connect button shows wallet address when connected, "Connect Wallet" when not
- [ ] Revenue badge polls and displays total earned USDC
- [ ] Agent layout wraps with `SolanaWalletProvider` and shows both wallet badges + connect button
- [ ] Chat page implements full payment flow: invoice → sign → verify → send with `x-payment-invoice` header
- [ ] Payment status indicators visible during the signing flow
- [ ] `scripts/verify-s01.sh` passes all checks
- [ ] `next build` succeeds with all new components

## Verification

- `bash scripts/verify-s01.sh` — all contract checks pass
- `next build` completes without errors
- Wallet connect button renders in the agent nav at `/agent`
- Revenue badge renders alongside existing WalletBadge
- Chat input flow includes payment step before message send

## Inputs

- `app/agent/layout.tsx` — existing agent layout with WalletBadge pattern to extend
- `app/agent/page.tsx` — existing chat page with sendMessage flow to wrap with payment
- `app/api/agent/payment/route.ts` — T01 output, invoice creation endpoint
- `app/api/agent/payment/verify/route.ts` — T01 output, verification endpoint
- `app/api/agent/revenue/route.ts` — T01 output, revenue stats endpoint
- `components/ui/glass-panel.tsx` — existing glass panel component for consistent styling

## Observability Impact

**New signals:**
- `[solana-payment]` console prefix for client-side payment flow lifecycle (invoice creation, signing, verification, errors)
- Payment status indicators in chat UI show current flow phase: `connecting` → `building invoice` → `signing` → `verifying` → `sending`
- Revenue badge polls `/api/agent/revenue` every 60s — visible earned USDC in nav

**Inspection surfaces:**
- Revenue badge in agent nav shows total earned USDC at a glance
- Wallet connect button shows connection state (address or "Connect Wallet")
- Browser console shows `[solana-payment]` logs for each payment step with phase and timing
- Payment errors surfaced inline in chat UI with user-visible messages per phase

**Failure visibility:**
- Wallet not connected → inline prompt shown before payment flow starts
- Invoice creation failure → error toast with "Failed to create invoice" + phase
- Transaction signing rejected → "Transaction cancelled" shown in chat
- Verification failure → "Payment verification failed" with invoiceId for debugging
- 402 from chat endpoint → triggers payment flow (not shown as generic error)

**What a future agent inspects:**
- `GET /api/agent/revenue` — current revenue state
- Browser console filtered for `[solana-payment]` — payment flow traces
- Payment status div in chat UI — current flow state

## Expected Output

- `components/solana/wallet-provider.tsx` — SolanaWalletProvider context component
- `components/solana/connect-button.tsx` — wallet connect/disconnect button
- `components/ui/revenue-badge.tsx` — revenue display badge with polling
- `app/agent/layout.tsx` — modified with SolanaWalletProvider wrapping + nav additions
- `app/agent/page.tsx` — modified with payment flow before sendMessage
- `scripts/verify-s01.sh` — slice-level contract verification script
