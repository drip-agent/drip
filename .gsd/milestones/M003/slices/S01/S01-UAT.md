# S01: Payment-Gated Agent Chat — UAT

**Milestone:** M003
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven contract checks + live-runtime verification)
- Why this mode is sufficient: Contract checks verify structural correctness (37 checks). Live runtime tests verify the payment flow against real Solana RPC with a funded wallet. UI follows established M02 patterns — no subjective human assessment needed.

## Preconditions

- `npm install` completed without errors
- `.env.local` configured with:
  - `SOLANA_RPC_URL` — Solana mainnet or devnet RPC endpoint
  - `NEXT_PUBLIC_SOLANA_RPC_URL` — Same RPC endpoint (client-accessible)
  - `NEXT_PUBLIC_DRIP_TOKEN_MINT` — $DRIP SPL token mint address
  - `KV_REST_API_URL` and `KV_REST_API_TOKEN` — Vercel KV credentials
  - `OPENROUTER_API_KEY` — For chat LLM responses
- `next dev` running at localhost:3000
- Phantom or Solflare browser extension installed with a funded Solana wallet (needs USDC on the configured network)

## Smoke Test

1. Run `bash scripts/verify-s01.sh`
2. **Expected:** 37/37 passed, 0 failed, 0 warnings

## Test Cases

### 1. Contract Verification Passes

1. Run `bash scripts/verify-s01.sh`
2. **Expected:** All 37 checks pass — file existence, client directives, exports, API route handlers, dependency versions, single @solana/web3.js copy, build succeeds.

### 2. Wallet Connect Button Renders in Agent Nav

1. Navigate to `http://localhost:3000/agent`
2. Observe the navigation bar
3. **Expected:** "Connect Wallet" button visible alongside the existing EVM WalletBadge and "0 USDC" revenue badge. Three badges total in desktop nav.

### 3. Phantom Wallet Connection

1. Navigate to `/agent` with Phantom extension installed
2. Click "Connect Wallet" button in nav
3. Approve connection in Phantom popup
4. **Expected:** Button changes to show truncated wallet address (e.g., "AbCd…WxYz"). Clicking the address disconnects.

### 4. Empty State Shows Wallet Prompt

1. Navigate to `/agent` with wallet disconnected
2. Observe the chat empty state
3. **Expected:** Empty state shows "Connect your Solana wallet" prompt. Input placeholder says "Connect wallet to start…"

### 5. Chat Blocked Without Payment

1. Connect wallet
2. Type a message and click Send without completing payment flow
3. **Expected:** Payment flow initiates — PaymentStatus shows "Building invoice…" phase. Chat message is NOT sent until payment completes.

### 6. Full Payment Flow — Happy Path

1. Connect Phantom wallet (with USDC balance)
2. Type "What is DRIP?" and click Send
3. Observe PaymentStatus indicator below input bar
4. Approve the USDC transaction in Phantom popup
5. Wait for verification
6. **Expected:** PaymentStatus shows phases in sequence: "Building invoice…" → "Waiting for signature…" → "Submitting transaction…" → "Verifying payment…" → disappears. Chat message sends after verification. Agent responds with streaming text.

### 7. Revenue Badge Updates After Payment

1. Complete a successful payment (test case 6)
2. Observe the revenue badge in nav
3. Wait up to 60s for badge poll
4. **Expected:** Revenue badge updates from "0 USDC" to show the payment amount. Badge displays total earned with trend icon.

### 8. Revenue Endpoint Returns Correct Data

1. Complete one or more payments
2. `curl http://localhost:3000/api/agent/revenue`
3. **Expected:** Returns JSON `{ "totalEarned": "<amount>", "queryCount": <n>, "tokenMint": "<address>" }` with correct values matching actual payments made. `Cache-Control: no-store` header present.

### 9. Chat Route Returns 402 Without Payment

1. `curl -X POST http://localhost:3000/api/agent/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hello"}]}'`
2. **Expected:** Returns HTTP 402 with `{ "error": "Payment required", "code": "PAYMENT_REQUIRED" }`.

### 10. Payment Invoice Creation

1. `curl -X POST http://localhost:3000/api/agent/payment -H "Content-Type: application/json" -d '{"userPublicKey":"<valid-solana-pubkey>"}'`
2. **Expected:** Returns JSON with `invoiceId`, serialized transaction data, and `amount` field. Invoice stored in KV.

### 11. Suggestions Fill Input Instead of Auto-Sending

1. Connect wallet
2. Click a suggestion chip in the empty state
3. **Expected:** The suggestion text fills the input field. Message is NOT auto-sent. User must click Send (triggering payment flow) to submit.

### 12. Dual Wallet Display

1. Navigate to `/agent`
2. Observe nav bar
3. **Expected:** Both EVM WalletBadge (showing agent's x402 balance or "N/A") and Solana ConnectButton + RevenueBadge are visible. Neither replaces the other.

### 13. Mobile Nav Includes All Badges

1. Resize browser to mobile width (≤768px) or use mobile viewport
2. Open hamburger menu
3. **Expected:** Mobile nav includes ConnectButton, RevenueBadge, and WalletBadge — same as desktop.

## Edge Cases

### Payment With Insufficient USDC Balance

1. Connect a wallet with zero USDC balance
2. Type a message and click Send
3. **Expected:** Phantom shows insufficient balance error during signing. PaymentStatus shows an error message with "signing" phase context. Chat message is not sent.

### Invoice Replay Prevention

1. Complete a payment and note the invoice ID from browser console logs (`[solana-payment]`)
2. Attempt to use the same invoice ID via `x-payment-invoice` header on a second chat request
3. **Expected:** Chat route returns 402 — invoice is marked consumed after first use.

### Wallet Disconnect Mid-Payment

1. Start a payment flow (click Send after typing a message)
2. Disconnect wallet in Phantom before signing
3. **Expected:** Payment flow shows error at "signing" phase. No chat message sent. User can reconnect and retry.

### Revenue Badge Error Handling

1. Start dev server without KV credentials
2. Navigate to `/agent`
3. **Expected:** Revenue badge shows "0 USDC" gracefully. Console shows `[revenue-badge]` error log but no UI crash.

### Build Succeeds With All Dependencies

1. `npm run build`
2. **Expected:** Build completes successfully. All 3 new API routes appear in route table as dynamic (`ƒ`). No duplicate `@solana/web3.js` warnings.

## Failure Signals

- PaymentStatus stuck on a phase for >30s — likely RPC timeout or SDK error
- Revenue badge permanently shows "0 USDC" after successful payment — KV write failure
- "Connect Wallet" button missing from nav — SolanaWalletProvider not wrapping layout
- React hydration errors in console — wallet adapter React 19 incompatibility
- 402 response on chat even with valid payment — invoice consumed flag set prematurely or KV read failure
- `npm ls @solana/web3.js` shows multiple versions — dependency deduplication broken

## Requirements Proved By This UAT

- R010 — Payment infrastructure functional: SDK integration, invoice lifecycle, on-chain verification, revenue tracking. Token creation on PumpFun is a separate manual step.
- R011 — Revenue collection half proven: agent earns USDC per query, KV tracks totals, revenue endpoint exposes stats for S02 consumption.

## Not Proven By This UAT

- Actual $DRIP SPL token creation on PumpFun (manual step)
- Tokenized Agents activation and buyback execution (manual PumpFun toggle + $10 threshold)
- Token display section on drip.surf (S02 scope)
- Live deployment on Vercel with production KV and RPC endpoints

## Notes for Tester

- The `bigint: Failed to load bindings` warning in console is cosmetic — Solana's bn.js pure JS fallback works correctly.
- Wallet adapter deprecation warnings during `npm install` are from deep transitive deps — not controllable.
- Revenue badge polls every 60s — wait for the poll cycle after payment to see updates, or refresh the page.
- Without `.env.local` credentials, the agent runs in a degraded mode: revenue shows "0 USDC", wallet badge shows "N/A", payments will fail at RPC. This is expected for unconfigured local dev.
- Payment amounts are in USDC on Solana. Ensure the test wallet has USDC (not SOL) for the payment flow.
