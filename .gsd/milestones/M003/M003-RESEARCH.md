# M003: Token & Launch — Research

**Date:** 2026-03-15

## Summary

M003 has two distinct halves: (1) the token launch on PumpFun, which is a one-time manual action on pump.fun's web UI — not something we build in code, and (2) the revenue-to-buyback integration, which is the real engineering work. PumpFun's Tokenized Agents feature (launched March 13, 2026 — literally 2 days old) provides an official `@pump-fun/agent-payments-sdk` that handles the heavy lifting: building payment transaction instructions, generating invoices, and verifying payments on-chain. The SDK operates on Solana mainnet with `@solana/web3.js@^1.98.0`, which is a net-new dependency chain for this codebase (currently EVM-only via viem).

The core engineering question is how to add a pay-per-query revenue model to the existing chat flow without breaking the current architecture. The existing skill registry, streaming chat API, and wallet badge patterns are solid and should be extended, not replaced. The riskiest slice is wiring revenue payments through the agent because it requires frontend wallet integration (Solana wallet adapter), a server-side payment verification flow, and correct SDK version pinning for a 2-day-old library. The token creation and branding slice is lowest risk — it's a manual PumpFun action plus a static info section on drip.surf.

Primary recommendation: **prove the payment SDK integration first** (most unknowns, newest dependency, highest risk of API instability), then wire in the token information section and launch assets.

## Recommendation

Three slices, ordered by risk:

1. **Revenue & Payment Integration** (highest risk): Install `@pump-fun/agent-payments-sdk`, build payment flow into the chat API, add Solana wallet adapter to the agent frontend. This proves the entire revenue loop works before a token even exists.
2. **Token Launch & Configuration** (medium risk, mostly manual): Create $DRIP on PumpFun, activate Tokenized Agents toggle, set buyback percentage, configure contract address. Add token info section to drip.surf landing page.
3. **Launch Assets & Transparency** (lowest risk): Revenue tracking dashboard/badge on agent UI showing earned/buyback amounts, launch announcement assets for X.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Solana payment instructions & invoice verification | `@pump-fun/agent-payments-sdk@3.0.0` | Official PumpFun SDK, handles PDA derivation, SOL wrapping/unwrapping, invoice deduplication. 2 days old but from PumpFun themselves. |
| Solana wallet connection in React | `@solana/wallet-adapter-react` + `@solana/wallet-adapter-react-ui` | Standard Solana wallet integration. Phantom, Solflare, Backpack support. PumpFun's own SKILL.md mandates this. |
| Solana RPC interactions | `@solana/web3.js@^1.98.0` | Required peer dependency of agent-payments-sdk. Pin to the version the SDK declares. |
| Token creation on PumpFun | PumpFun web UI (pump.fun) | Manual action. Don't programmatically create — the UI handles metadata upload, bonding curve setup, and Tokenized Agents toggle. |
| Streaming chat with tool calls | Existing `streamText` + `useChat` (AI SDK v6) | Already proven in M002. Payment gating wraps around the existing flow. |

## Existing Code and Patterns

- `lib/x402-client.ts` — Lazy singleton pattern for payment-wrapped fetch. Same pattern works for a Solana payment client (lazy PumpAgent singleton).
- `lib/wallet.ts` — EVM wallet balance reader with TTL cache. Extend this pattern for Solana balance reading (agent's SOL/USDC balance on Solana mainnet).
- `lib/skills/registry.ts` — Module-level skill registry with self-registration at import. Revenue gating should wrap around `getAllTools()` output, not modify individual skills.
- `lib/skills/research.ts` — Canonical skill implementation. Structured error returns (`{ error: true, reason }`) — reuse this pattern for payment failures.
- `lib/skills/types.ts` — `SkillDefinition` interface. No changes needed — payment is orthogonal to skill registration.
- `app/api/agent/chat/route.ts` — Streaming chat endpoint. Payment verification happens here (before `streamText`) or in a middleware wrapper.
- `app/api/agent/wallet/route.ts` — Wallet balance endpoint. Add parallel Solana balance endpoint or extend to show both chains.
- `app/agent/layout.tsx` — Agent layout with `WalletBadge`. Extend for Solana wallet connect button and token info.
- `proxy.ts` — Subdomain routing. No changes needed for M003.
- `app/page.tsx` — Landing page with 5 sections. Add a "Token" section (between Agent Preview and CTA) for $DRIP info + PumpFun link.
- `components/layout/navbar.tsx` — Landing NavBar with anchor links. Add "Token" link.
- `public/brand/` — 6 SVG assets. Token image for PumpFun should derive from `logo-icon.svg`.
- `app/globals.css` — Design tokens. No new tokens needed — existing palette covers M003 UI.

## Constraints

- **No `@solana/web3.js` today** — The codebase uses `viem` for EVM (Base Sepolia). Adding Solana is a new dependency chain. Version must match what `@pump-fun/agent-payments-sdk` declares — mismatches cause runtime errors (per SDK docs).
- **Two wallet ecosystems** — EVM wallet (for x402/AgentCash payments) and Solana wallet (for $DRIP token payments). These are independent — the agent spends USDC via x402 to call APIs, but users pay in SOL/USDC on Solana to generate revenue.
- **Server-side vs client-side** — The agent's x402 wallet is server-only (private key in env). The user's Solana wallet is client-side (browser wallet adapter). These must never cross — server never touches user wallet, client never touches agent key.
- **`@pump-fun/agent-payments-sdk@3.0.0`** is 2 days old — expect rough edges. The SDK's `validateInvoicePayment` tries HTTP API first, falls back to RPC if Connection provided. Always provide Connection for reliability.
- **Solana RPC** — Public mainnet RPC (`api.mainnet-beta.solana.com`) doesn't support `sendTransaction`. Need a provider RPC (Solana Tracker, Ankr, or Helius). This is a new env var.
- **PumpFun buyback mechanics** — Buybacks are executed by a centralized buyback authority (not the agent). Timing is probabilistic (anti-frontrunning). $10 minimum threshold. Agent just sends revenue to the right address.
- **Next.js 16 + React 19** — Solana wallet adapter packages must be compatible. Some older wallet adapter versions may not work with React 19.

## Common Pitfalls

- **Version mismatch between `@solana/web3.js` copies** — If the SDK and app install different versions, PDAs derive differently and transactions fail silently. Always pin to the SDK's declared peer dependency version. Check with `npm info @pump-fun/agent-payments-sdk dependencies` before installing.
- **Building payment flow without wallet adapter** — The SDK builds instructions; the user's browser wallet signs. You cannot sign Solana transactions server-side with the user's key. The `signTransaction` flow must go: server builds → client signs → client sends → server verifies.
- **Treating token creation as code work** — Token creation is a PumpFun web UI action (upload image, set name/ticker/description, configure Tokenized Agents). Don't build a programmatic token creator — it's unnecessary complexity and PumpFun's UI is the supported path.
- **Conflating agent wallet with user wallet** — The agent's EVM wallet (x402) pays for API calls. Users' Solana wallets pay the agent for services. Revenue from user payments goes to PumpFun's buyback mechanism. These are three separate money flows.
- **Assuming PumpFun docs are stable** — Feature is 2 days old. The `@pump-fun/agent-payments-sdk` had its last commit on March 13. API surface could change. Pin exact version, not range.
- **Overbuilding the revenue dashboard** — Start with a simple badge showing total revenue and total burned. Don't build a real-time chart before proving the basic flow works.
- **Ignoring Mayhem Mode** — PumpFun has an experimental "Mayhem Mode" that doubles supply and uses an AI trading agent. This is separate from Tokenized Agents. Do not enable it — it's had bugs and community complaints. Stick to standard bonding curve.

## Open Risks

- **SDK stability** — `@pump-fun/agent-payments-sdk@3.0.0` is brand new. No community track record. If it breaks, fallback is raw Solana transaction construction using `@solana/web3.js` directly.
- **React 19 compatibility** — `@solana/wallet-adapter-react` may need specific versions for React 19. Test early.
- **Revenue model decision** — Pay-per-query? Subscription? Flat fee? This must be decided before building the payment flow. Context suggests pay-per-query (matches AgentCash pricing model and PumpFun's invoice-per-request pattern).
- **Bonding curve graduation** — Token must reach ~$69K market cap to graduate from bonding curve to PumpSwap. Until graduation, liquidity is limited. This is a market risk, not a code risk.
- **Legal exposure** — PumpFun faces active lawsuits in the US and is banned by UK FCA. Token launch carries regulatory risk. This is a user decision, not a code decision.
- **Minimum revenue threshold** — Buybacks only trigger at $10 accumulated revenue. Early on, revenue may be too low for visible burns. Need clear messaging that buybacks accumulate before triggering.

## Requirements Analysis

### Table Stakes (R010, R011)
- R010 (PumpFun Token Launch) is launchability-class — straightforward but requires manual steps with funded Solana wallet.
- R011 (Tokenized Agents Revenue Loop) is the differentiator — this is the whole point. Must prove end-to-end: user pays → revenue accumulates → buyback triggers → burn verifiable on-chain.

### Candidate Requirements (not yet in REQUIREMENTS.md)
These surfaced during research and should be discussed during roadmap planning:

1. **Solana Wallet Integration (Frontend)** — Users need to connect Phantom/Solflare to pay for agent queries. This is a new requirement implied by R011 but not explicit. Candidate for a new requirement.
2. **Revenue Tracking / Transparency** — Context doc says "transparent revenue-to-buyback metrics." Not a formal requirement yet. Candidate — users should see how much revenue was generated and how much was used for buybacks.
3. **Token Section on drip.surf** — Context says "Visit drip.surf and see token information and links." Implied by R010 acceptance criteria but worth formalizing.
4. **Payment Gating for Agent Queries** — The current chat API is free/open. Revenue requires a payment step. This is an architectural change to the agent flow implied by R011. Worth making explicit.

### Not Needed (advisory only)
- Programmatic token creation SDK — use PumpFun web UI
- Real-time buyback notification websocket — overkill for MVP
- Multi-currency pricing — start with USDC only, add SOL later if needed
- Revenue analytics dashboard — simple badge/counter first

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| PumpFun | `sendaifun/skills@pumpfun` (69 installs) | Available — comprehensive PumpFun protocol guide including bonding curve, PumpSwap, creator fees. Worth considering. |
| PumpFun Tokenized Agents | `pump-fun/pump-fun-skills@tokenized-agents` (official) | Available via GitHub — official PumpFun skill with SKILL.md for agent-payments-sdk. Reference material, not an installable pi skill. |
| Solana | `sendaifun/skills@solana-kit` (97 installs) | Available — Solana development toolkit. Could help with wallet/RPC patterns. |
| Solana | `mindrally/skills@solana` (75 installs) | Available — general Solana development skill. |
| Solana token launcher | `tomi204/clawpump-skill@solana-token-launcher` (18 installs) | Available but unnecessary — token creation is manual via PumpFun UI. |
| Crypto/Web3 general | `vasilyu1983/ai-agents-public@software-crypto-web3` (146 installs) | Available — broad crypto/web3 patterns. Low priority vs. PumpFun-specific skills. |

## Sources

- PumpFun Tokenized Agents announcement and mechanics (source: [The Defiant](https://thedefiant.io/news/defi/pumpfun-launches-automated-buyback-tool-for-ai-agent-tokens), March 13 2026)
- PumpFun agent-payments-sdk SKILL.md — full integration guide (source: [pump-fun/pump-fun-skills](https://github.com/pump-fun/pump-fun-skills/blob/main/tokenized-agents/SKILL.md))
- SDK constructor, payment instructions, and verification API (source: [pump-fun/pump-fun-skills SKILL.md](https://raw.githubusercontent.com/pump-fun/pump-fun-skills/main/tokenized-agents/SKILL.md))
- PumpFun Tokenized Agents setup flow — launch, configure, connect agent (source: [NullTX](https://nulltx.com/pump-fun-introduces-automated-buybacks-for-tokenized-agents-as-ai-economy-expands/))
- PumpFun protocol addresses and SDK packages (source: [lobehub.com/skills/sendaifun-skills-pumpfun](https://lobehub.com/skills/sendaifun-skills-pumpfun))
- Mayhem Mode risks and PUMP token performance (source: [PANews](https://www.panewslab.com/en/articles/a7fef83b-337d-4141-9da9-d232de491720))
- `@pump-fun/pump-sdk` for token creation instructions (source: [npm](https://www.npmjs.com/package/@pump-fun/pump-sdk))
