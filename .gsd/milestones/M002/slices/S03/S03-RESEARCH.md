# S03: Operational Hardening & Modular Proof — Research

**Date:** 2026-03-15

## Summary

S03 has four deliverables: wallet balance display, in-character error handling, a stub skill proving modularity, and a milestone verification script. None require new packages or uncharted technology — everything builds on existing infrastructure from S01/S02.

The wallet balance endpoint is a straightforward `readContract` call using viem's `erc20Abi` against the USDC contract on Base Sepolia (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`). The x402 client already creates a `publicClient` (Base Sepolia) and derives an `account` from `X402_PRIVATE_KEY` — a new `lib/wallet.ts` module can reuse the same setup (just the read side, no signing) and export a `getWalletBalance()` function. An API route at `/api/agent/wallet` returns the balance as JSON, and a client-side component polls it for display in the agent layout.

Error handling is the meatiest piece. The chat page currently has **zero error UI** — no `error` state from `useChat`, no `onError` callback, no `regenerate()` retry. AI SDK v6 exposes all three. The in-character error messages (D006 voice: "Lost signal. Try again.") should map to specific failure modes: LLM provider down, x402 payment failure (empty wallet), StableEnrich API error, and network failures. The chat route already returns structured errors for missing API keys — the client just ignores them. The feed page's empty state is already in-character ("calibrating its sensors") and just needs a distinct error state for actual KV failures vs. empty data.

The stub skill (`social-trends`) is trivial by design — that's the point. It must follow the exact `SkillDefinition` interface, call `registerSkill()` at import time, and provide placeholder tools that return canned data. The modularity proof: importing it in `route.ts` alongside the research skill import registers it without touching registry code, skill types, or the chat route's logic. The milestone verification script (`verify-m002.sh`) aggregates S01+S02 checks and adds S03-specific checks.

## Recommendation

Build four focused units:

1. **Wallet balance** — `lib/wallet.ts` (server-only, reuses viem/publicClient pattern from x402-client), `/api/agent/wallet/route.ts` (GET, returns `{ address, balance, formatted }`), `WalletBadge` client component in agent layout (polls every 60s, shows formatted USDC).

2. **Error handling** — Enhance `app/agent/page.tsx` with `error` and `regenerate` from `useChat`, plus `onError` callback. Add an in-character error banner component. Enhance the chat route to return more specific error shapes. Add a distinct error state to the feed page (different from empty state).

3. **Stub skill** — `lib/skills/social-trends.ts` following research.ts pattern exactly. One tool (`trending-topics`) returning canned data. Import added to `route.ts` — that's the only "core" change, and it's purely additive.

4. **Milestone verification** — `scripts/verify-m002.sh` combining S01+S02 checks with S03-specific checks (wallet route, stub skill, error handling, build).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| ERC-20 token balance read | `viem` `readContract` + `erc20Abi` | Already a dependency. `erc20Abi` is built into viem (`viem/contracts`). Standard pattern: `readContract({ abi: erc20Abi, functionName: 'balanceOf', args: [address] })` |
| USDC decimal formatting | `viem` `formatUnits(balance, 6)` | USDC has 6 decimals. `formatUnits` handles BigInt→string conversion cleanly |
| Chat error + retry | AI SDK v6 `useChat` `error` + `regenerate()` | Already exposed by the hook. `status === 'error'` for state detection, `regenerate()` for retry. No custom error recovery needed |
| Skill registration | Existing `registerSkill()` from `lib/skills/registry.ts` | The whole point of S03 is proving this works without modification |

## Existing Code and Patterns

- `lib/x402-client.ts` — Creates `publicClient` (Base Sepolia, `http()` transport) and `account` (from `X402_PRIVATE_KEY` via `privateKeyToAccount`). The wallet balance module needs the same two objects but only for reads. Don't duplicate — extract a shared `getWalletAccount()` or build a parallel module that reads the same env var.
- `lib/skills/research.ts` — The template for the stub skill. Pattern: define tools with `tool()` + `z.object()` input schema + `execute` function, compose into a `SkillDefinition`, call `registerSkill()` at module level, export the skill object.
- `lib/skills/registry.ts` — Module-level `Map` registry. `registerSkill()` warns on duplicate IDs. `getSkills()` throws if empty. `getAllTools()` merges tools with collision warnings. Must NOT be modified for the stub skill to prove modularity.
- `app/api/agent/chat/route.ts` — Side-effect skill imports at top (`import "@/lib/skills/research"`). New skill import goes here. The route uses `getAllTools()` and `getSystemPrompt()` — both auto-include any registered skill. `AGENT_SYSTEM_PROMPT` does not reference specific skills, so no change needed.
- `app/agent/page.tsx` — Chat UI uses `useChat` with `DefaultChatTransport`. Currently destructures only `{ messages, sendMessage, status, stop }`. Missing: `error`, `regenerate`, `onError`. Status handling: `isReady = status === 'ready'`, shows "Thinking..." on `status === 'submitted'`. No `status === 'error'` case.
- `app/agent/layout.tsx` — Client component with `AgentNavBar`. Wallet balance display goes here (visible across all agent pages). NavBar has agent links (Chat, Feed) and DRIP AGENT branding. Desktop links div has `gap-6` — wallet badge fits naturally alongside.
- `app/agent/feed/page.tsx` — Server component with `EmptyState` component. Currently returns empty state for both "no entries" and "KV error" (graceful degradation means both look the same). Could differentiate with a `try/catch` around `getFeedEntries()` but the current pattern intentionally returns `[]` on error. Adding a separate error state requires either: (a) changing `getFeedEntries()` to throw/return a discriminated union, or (b) accepting that the empty state IS the error state (simplest, and already in-character).
- `lib/feed.ts` — All operations catch and return safe defaults. `getFeedEntries()` returns `[]` on error. This pattern is correct for the feed page — the empty state message already works as a graceful degradation surface.

## Constraints

- **`server-only` guard required** — `lib/wallet.ts` reads `X402_PRIVATE_KEY`. Must import `server-only` at top. The wallet API route is the only consumer.
- **No new packages needed** — `viem` (already installed) provides `erc20Abi` via `viem/contracts`, `readContract`, `formatUnits`, `privateKeyToAccount`, `createPublicClient`. All already imported in x402-client.
- **USDC contract address is testnet** — Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`. This will need to change for mainnet deployment (Base mainnet USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`). Make it configurable or at least clearly labeled.
- **Wallet balance API should be lightweight** — No auth needed (balance is public on-chain data by address), but should be rate-limited or cached to avoid excessive RPC calls. A simple in-memory TTL cache (60s) is sufficient.
- **Agent layout is a client component** — WalletBadge must be a client component (needs `useEffect` for polling). It can be a child of the existing client layout.
- **AI SDK v6 `regenerate()` retries the last assistant message** — It re-sends the conversation and asks the model to try again. Works out of the box with `useChat`.
- **Chat route error responses must be parseable by AI SDK** — The route currently returns `Response(JSON.stringify({ error }), { status: 500 })` for missing API key. AI SDK's `DefaultChatTransport` will surface this as the `error` object in `useChat`. This is correct behavior — just need to display it.
- **Stub skill tools should NOT call external APIs** — The `social-trends` skill is a proof of modularity, not functionality. Tools return static/canned responses. This avoids adding new env vars or API dependencies.
- **Skill imports in route.ts are additive** — Adding `import "@/lib/skills/social-trends"` alongside `import "@/lib/skills/research"` is the only "core" file change. The registry, types, chat logic, and UI all remain untouched. This is the modularity proof.

## Common Pitfalls

- **Polling wallet balance too aggressively** — RPC calls to Base Sepolia are free but rate-limited. Polling every 5s wastes calls. 60s interval is reasonable for a balance display that users glance at, not trade on.
- **Wallet route exposing private key** — The route returns balance and address. Never return the private key or any signing material. Double-check the response shape.
- **In-character errors that hide actionable info** — "Lost signal" is good voice, but operational errors (empty wallet, missing API key) need actionable context too. Pattern: in-character message for the user + detailed error in server logs. The server already logs with `[agent-chat]` prefix.
- **Conflating "no data" with "error" on feed page** — Current empty state says "calibrating its sensors" — this works for both cases. Adding a separate error state is optional complexity. The graceful degradation pattern (return `[]` on error) means the page always renders. A distinct error state is nice-to-have but not critical.
- **Stub skill tools appearing in LLM's system prompt** — The stub skill's `systemPrompt` fragment will be concatenated with the research skill's. If the LLM sees "you can look up trending topics" as a capability, it might try to route queries to it. The tool should return a clear "this feature is coming soon" message, and the system prompt fragment should tell the LLM it's a preview capability.
- **Breaking the build by importing server-only module in client code** — `lib/wallet.ts` will have `import "server-only"`. The wallet API route imports it (fine — server-side). The `WalletBadge` component fetches from the API route, never imports the module directly.
- **x402-client singleton interference** — `lib/wallet.ts` creates its own `publicClient` and `account` for read-only operations. Don't share the x402 client's cached instance — it's wrapped with payment logic that isn't needed for balance reads.

## Open Risks

- **Base Sepolia RPC reliability** — `createPublicClient({ transport: http() })` uses viem's default public RPC for Base Sepolia. If this RPC is down or slow, the wallet balance endpoint returns an error. Could add a fallback RPC URL via env var, but for now the default is sufficient.
- **USDC contract address hardcoded for testnet** — When deploying to mainnet, this address must change. A `USDC_CONTRACT_ADDRESS` env var would be more flexible, but for now the testnet address is fine since x402-client also hardcodes `baseSepolia`.
- **Wallet balance showing 0 without context** — If `X402_PRIVATE_KEY` is not set, the wallet endpoint should return a clear "not configured" response, not a fake 0 balance. Users seeing "0 USDC" without knowing the wallet isn't set up is confusing.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| x402 protocol | `coinbase/agentic-wallet-skills@x402` (1.5K installs) | available — could have patterns for wallet balance, but S03 scope is simple enough without it |
| Frontend design | `frontend-design` | installed — for wallet badge and error UI styling |
| Viem/EVM | `hairyf/blockchain-master@viem` (11 installs) | available — low installs, not worth it for a single readContract call |
| AI SDK | `vercel/ai@ai-sdk` (11.1K installs) | available — could help with error handling patterns, but AI SDK docs already cover it |

**No new skills recommended for S03.** The scope is straightforward and all patterns are already established in S01/S02. The `frontend-design` skill (already installed) is sufficient for the wallet badge and error state UI work.

## Sources

- USDC contract address on Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (source: [Circle USDC Contract Addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses))
- viem `readContract` + `erc20Abi` for USDC balance (source: [viem USDC integration guide](https://viem.sh/circle-usdc/guides/integrating))
- `formatUnits(balance, 6)` for USDC decimal conversion (source: viem docs)
- AI SDK v6 `useChat` error handling — `error`, `regenerate()`, `onError` callback, `status === 'error'` (source: [Vercel AI SDK error handling docs](https://sdk.vercel.ai/docs/ai-sdk-ui/error-handling))
- AI SDK v6 `useChat` status values: `ready`, `submitted`, `streaming`, `error` (source: [Vercel AI SDK chatbot docs](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot))
