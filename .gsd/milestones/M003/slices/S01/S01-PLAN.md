# S01: Payment-Gated Agent Chat

**Goal:** Users with a Solana wallet can pay USDC to send chat queries. The agent verifies payment before responding. Revenue is tracked and displayed.
**Demo:** Connect Phantom wallet → type a message → approve USDC payment on Solana → agent responds after verification. Revenue badge in nav shows total earned.

## Must-Haves

- `@pump-fun/agent-payments-sdk` installed with pinned `@solana/web3.js` peer dep — build compiles with zero duplicate copies
- `lib/pump-agent.ts` lazy singleton wrapping the SDK (server-only, mirrors `x402-client.ts` pattern)
- `POST /api/agent/payment` creates a payment invoice and returns serialized transaction instructions for client signing
- `POST /api/agent/payment/verify` verifies a signed payment transaction against Solana RPC, updates revenue KV
- `GET /api/agent/revenue` returns `{ totalEarned: string, queryCount: number, tokenMint: string | null }`
- `app/api/agent/chat/route.ts` requires a verified invoice ID header before streaming
- `components/solana/wallet-provider.tsx` wraps wallet adapter for Phantom/Solflare support
- `components/solana/connect-button.tsx` renders wallet connect/disconnect in agent nav
- `components/ui/revenue-badge.tsx` polls revenue endpoint and displays total earned
- `app/agent/layout.tsx` wrapped with SolanaWalletProvider, connect button + revenue badge in nav
- `app/agent/page.tsx` implements full payment flow: build invoice → wallet sign → verify → send message

## Proof Level

- This slice proves: integration (payment round-trip against real Solana RPC)
- Real runtime required: yes (Solana RPC, wallet signing)
- Human/UAT required: no (UI follows established M002 patterns)

## Verification

- `bash scripts/verify-s01.sh` — contract verification script checking:
  - All new files exist with expected exports
  - Dependencies installed with correct versions
  - No duplicate `@solana/web3.js` copies in node_modules
  - `next build` succeeds
  - API routes respond to basic requests
  - Revenue KV keys readable
  - Wallet provider renders without React errors

## Observability / Diagnostics

- Runtime signals: `[pump-agent]` prefix for SDK operations, `[payment]` prefix for invoice/verify routes, `[revenue]` prefix for KV counter updates
- Inspection surfaces: `GET /api/agent/revenue` returns current earned/count/tokenMint — inspectable by any agent or curl
- Failure visibility: Payment API routes return structured errors `{ error: string, phase: "invoice" | "verify" | "rpc", invoiceId?: string }` with appropriate HTTP status codes
- Redaction constraints: Solana private key (PUMP_AGENT_PRIVATE_KEY) never logged — only public key and transaction signatures

## Integration Closure

- Upstream surfaces consumed: `app/api/agent/chat/route.ts` (M002), `@vercel/kv` (M002 feed pattern), `app/agent/layout.tsx` (M002), `app/agent/page.tsx` (M002), existing design tokens and components
- New wiring introduced in this slice: SolanaWalletProvider wrapping agent layout, payment verification gate in chat route, revenue KV counter
- What remains before the milestone is truly usable end-to-end: S02 token display section on drip.surf, manual $DRIP token creation on PumpFun, Tokenized Agents activation

## Tasks

- [x] **T01: Install Solana dependencies and build server-side payment infrastructure** `est:2h`
  - Why: Retires the two highest risks (SDK stability + dependency chain) by installing all Solana packages, building the PumpAgent singleton, payment/verify/revenue API routes, and payment-gating the chat endpoint. All server-side — can be verified without a browser.
  - Files: `package.json`, `lib/pump-agent.ts`, `app/api/agent/payment/route.ts`, `app/api/agent/payment/verify/route.ts`, `app/api/agent/revenue/route.ts`, `app/api/agent/chat/route.ts`
  - Do: (1) Install `@pump-fun/agent-payments-sdk@3.0.0`, `@solana/web3.js` at SDK's peer dep version, `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`, `@solana/wallet-adapter-wallets`, `@solana/wallet-adapter-base`. Verify build compiles and no duplicate `@solana/web3.js` copies. (2) Build `lib/pump-agent.ts` as lazy singleton with `import "server-only"`, using `PumpAgent` constructor with keypair from `PUMP_AGENT_PRIVATE_KEY`, Connection from `SOLANA_RPC_URL`, USDC payment mint. (3) Build payment route that creates invoice via SDK, serializes transaction instructions for client. (4) Build verify route that validates payment on-chain, updates KV revenue counter. (5) Build revenue route reading KV stats. (6) Add payment verification gate to chat route — require `x-payment-invoice` header with verified invoice ID.
  - Verify: `next build` succeeds; `npm ls @solana/web3.js` shows single copy; API routes export POST/GET handlers
  - Done when: All 3 API routes respond to requests, chat route rejects requests without valid payment header, revenue KV counter increments on verified payment

- [x] **T02: Solana wallet frontend integration and payment-gated chat UX** `est:2h`
  - Why: Retires the React 19 + wallet adapter risk by rendering wallet connect in the agent UI. Wires the full payment flow into the chat page so users pay before each message. Adds revenue badge for transparency.
  - Files: `components/solana/wallet-provider.tsx`, `components/solana/connect-button.tsx`, `components/ui/revenue-badge.tsx`, `app/agent/layout.tsx`, `app/agent/page.tsx`, `scripts/verify-s01.sh`
  - Do: (1) Build `SolanaWalletProvider` wrapping `ConnectionProvider` + `WalletProvider` with Phantom/Solflare adapters, connected to `NEXT_PUBLIC_SOLANA_RPC_URL`. (2) Build `ConnectButton` using wallet adapter hooks — shows truncated address when connected, "Connect Wallet" when not. Styled to match existing `WalletBadge` aesthetic. (3) Build `RevenueBadge` polling `GET /api/agent/revenue` every 60s, displaying total earned USDC. (4) Modify `layout.tsx` — wrap with `SolanaWalletProvider`, add `ConnectButton` + `RevenueBadge` to agent nav alongside existing `WalletBadge`. (5) Modify `page.tsx` — before `sendMessage`, check wallet connected, call POST /api/agent/payment to get invoice, prompt wallet to sign transaction, send signed tx to Solana, call POST /api/agent/payment/verify, then send chat message with invoice header. Show payment status indicators in the UI. (6) Write `scripts/verify-s01.sh` contract verification script.
  - Verify: `bash scripts/verify-s01.sh` passes all checks; `next build` succeeds; wallet connect button renders in agent nav
  - Done when: Verification script passes, build succeeds, payment flow is wired end-to-end in the chat page

## Files Likely Touched

- `package.json`
- `lib/pump-agent.ts`
- `app/api/agent/payment/route.ts`
- `app/api/agent/payment/verify/route.ts`
- `app/api/agent/revenue/route.ts`
- `app/api/agent/chat/route.ts`
- `components/solana/wallet-provider.tsx`
- `components/solana/connect-button.tsx`
- `components/ui/revenue-badge.tsx`
- `app/agent/layout.tsx`
- `app/agent/page.tsx`
- `scripts/verify-s01.sh`
