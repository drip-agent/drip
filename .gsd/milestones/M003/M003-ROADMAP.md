# M003: Token & Launch

**Vision:** $DRIP token live on PumpFun with a working revenue-to-buyback loop — users pay for agent queries, revenue buys back and burns $DRIP, and drip.surf displays token information and transparent metrics.

## Success Criteria

- A user with a Solana wallet (Phantom/Solflare) connected to the agent can pay USDC to send a chat query, and the agent responds after payment verification
- Revenue earned from agent queries is visible in a badge in the agent nav
- drip.surf shows a Token section with $DRIP information, PumpFun link, and contract address
- Payment transactions are verifiable on Solana explorer
- The buyback percentage is configured via PumpFun's Tokenized Agents (manual step, documented in launch checklist)

## Key Risks / Unknowns

- **SDK stability** — `@pump-fun/agent-payments-sdk@3.0.0` is 2 days old (March 13, 2026). No community track record. Could have bugs or breaking changes.
- **React 19 + wallet adapter** — `@solana/wallet-adapter-react` may need specific versions for React 19 / Next.js 16 compatibility. No confirmed working combination yet.
- **Solana dependency chain** — Codebase is EVM-only today (viem). Adding `@solana/web3.js` introduces a parallel chain. Version mismatch between SDK's peer dep and app install could cause silent PDA derivation failures.
- **$10 minimum threshold** — PumpFun buybacks only trigger at $10 accumulated revenue. Early revenue may not produce visible burns. Messaging must be clear.

## Proof Strategy

- **SDK stability** → retire in S01 by building the real payment flow through the SDK and verifying an invoice round-trip (build → sign → verify) against Solana RPC
- **React 19 + wallet adapter** → retire in S01 by rendering the wallet connect button in the agent layout and confirming connection with Phantom
- **Solana dependency chain** → retire in S01 by installing exact peer dependency versions and confirming the build compiles without duplicate `@solana/web3.js` copies

## Verification Classes

- Contract verification: Shell scripts checking file existence, dependencies, exports, and build success (same pattern as M002's 69-check suite)
- Integration verification: Payment round-trip with a real Solana wallet against RPC — invoice creation, signing, verification
- Operational verification: Revenue tracking accuracy, wallet balance display correctness
- UAT / human verification: None — UI follows established patterns from M001/M002

## Milestone Definition of Done

This milestone is complete only when all are true:

- All slice deliverables are complete and contract checks pass
- Payment flow works end-to-end: wallet connect → invoice → sign → verify → chat response
- Revenue tracking accurately reflects payments received
- Token section is visible on drip.surf with correct branding and PumpFun link
- $DRIP token exists on PumpFun (manual creation) and Tokenized Agents is activated (manual toggle)
- At least one payment has been verified through the full flow against Solana RPC
- Success criteria are re-checked against live behavior

## Requirement Coverage

- Covers: R010 (PumpFun Token Launch), R011 (Tokenized Agents Revenue Loop)
- Partially covers: None
- Leaves for later: R005, R006, R007 (live validation pending deployment — M002 scope, not M003)
- Orphan risks: None — all active M003 requirements are mapped

## Slices

- [x] **S01: Payment-Gated Agent Chat** `risk:high` `depends:[]`
  > After this: A user with Phantom wallet connected can pay USDC on Solana to send a chat query. The agent verifies payment before responding. Revenue earned is displayed in a badge in the agent nav. Proven against real Solana RPC.
- [x] **S02: Token Display & Launch Configuration** `risk:low` `depends:[S01]`
  > After this: drip.surf shows a Token section with $DRIP info, PumpFun link, contract address, and revenue/buyback stats. Landing navbar has a Token anchor link.

## Boundary Map

### S01

Produces:
- `lib/pump-agent.ts` — PumpAgent lazy singleton wrapping `@pump-fun/agent-payments-sdk` (server-only, mirrors x402-client.ts pattern)
- `POST /api/agent/payment` — Creates payment invoice for a chat query, returns transaction instruction for client signing
- `POST /api/agent/payment/verify` — Verifies a signed payment transaction against Solana RPC
- `GET /api/agent/revenue` — Returns revenue stats `{ totalEarned: string, queryCount: number, tokenMint: string | null }`
- `app/api/agent/chat/route.ts` — Modified to require payment verification header/token before streaming
- `components/solana/wallet-provider.tsx` — SolanaWalletProvider context wrapping wallet adapter
- `components/solana/connect-button.tsx` — Wallet connect button for agent nav
- `components/ui/revenue-badge.tsx` — Revenue display badge (polling, like WalletBadge)
- `app/agent/layout.tsx` — Modified: wrapped with SolanaWalletProvider, connect button + revenue badge in nav
- `app/agent/page.tsx` — Modified: payment flow before sending message (build invoice → sign → verify → send)
- Payment verification pattern: server builds invoice → client signs with browser wallet → client sends tx → server verifies on-chain → chat proceeds
- Revenue tracking: KV-backed counter (earned amount, query count) updated on each verified payment

Consumes:
- nothing (first slice)

### S01 → S02

Produces:
- `GET /api/agent/revenue` endpoint with `{ totalEarned, queryCount, tokenMint }` response shape
- Revenue tracking KV keys that S02's landing page can read via server component fetch
- `NEXT_PUBLIC_DRIP_TOKEN_MINT` env var convention for the token contract address

Consumes:
- Existing landing page Section component pattern (D022)
- Existing navbar navLinks array pattern
- Existing design tokens and animation components (FadeInStagger, ScrollReveal)
