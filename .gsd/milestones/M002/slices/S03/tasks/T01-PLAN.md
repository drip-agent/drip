---
estimated_steps: 5
estimated_files: 6
---

# T01: Build wallet balance, stub skill, and error handling UI

**Slice:** S03 — Operational Hardening & Modular Proof
**Milestone:** M002

## Description

All code deliverables for S03: wallet USDC balance endpoint + display badge, stub social-trends skill proving modular registration, and in-character error handling in the chat UI. These are independent features that each touch different files, unified only by the theme of "hardening and proving what S01/S02 built."

## Steps

1. **Build `lib/wallet.ts`** — server-only module. Create own `publicClient` (Base Sepolia, `http()` transport) and derive `account` from `X402_PRIVATE_KEY` via `privateKeyToAccount`. Export `getWalletBalance()` that calls `readContract` with `erc20Abi`, `functionName: 'balanceOf'`, `args: [account.address]` on the USDC contract (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`). Format result with `formatUnits(balance, 6)`. Add 60s in-memory TTL cache to avoid excessive RPC calls. Return `{ address: string, balance: string, formatted: string }`. Graceful handling when `X402_PRIVATE_KEY` is not set — throw descriptive error, don't return fake 0.

2. **Build `/api/agent/wallet` GET route** — imports `getWalletBalance` from `lib/wallet.ts`. Returns JSON `{ address, balance, formatted }` on success. Returns `{ error: "Wallet not configured", configured: false }` with 200 (not 500) when private key is missing — the badge should show "not configured" state, not crash. Log with `[wallet]` prefix.

3. **Build `lib/skills/social-trends.ts`** — follow `research.ts` pattern exactly. One tool: `trending-topics` with `z.object({ category: z.string().describe("Topic category") })` input schema. Execute function returns canned data: `{ status: "preview", message: "Social trend analysis coming soon.", topics: ["crypto sentiment", "defi trends", "nft market"] }`. System prompt fragment tells the LLM this is a preview capability — available but returns sample data. Call `registerSkill()` at module level. Add `import "@/lib/skills/social-trends"` to `app/api/agent/chat/route.ts` alongside the research import.

4. **Add WalletBadge to agent layout** — client component inside `app/agent/layout.tsx`. Uses `useEffect` + `useState` to fetch `/api/agent/wallet` on mount and every 60s. Displays formatted USDC amount with a small wallet icon. Shows "—" while loading, "⚠" on error. Positioned in the desktop nav links area (alongside Chat/Feed links). Styled with the design system — aqua text, subtle glass background. Use the frontend-design skill for the badge styling.

5. **Enhance chat page error handling** — in `app/agent/page.tsx`, destructure `error` and `regenerate` from `useChat` (AI SDK v6 exposes both). Add `onError` callback that logs with `[agent-chat]` prefix. When `status === 'error'`, render an in-character error banner below the messages: "Lost signal. Try again." with a retry button that calls `regenerate()`. Voice per D006: cool and understated, not panicked. Style the banner with the design system — dark elevated background, aqua accent border, matching the chat bubble aesthetic.

## Must-Haves

- [ ] `lib/wallet.ts` imports `server-only`, exports `getWalletBalance()`, uses own publicClient (not shared x402 singleton)
- [ ] `/api/agent/wallet` returns `{ address, balance, formatted }` or `{ error, configured: false }` — never exposes private key
- [ ] `lib/skills/social-trends.ts` follows `SkillDefinition` interface, calls `registerSkill()` at module level, tool returns canned data
- [ ] `social-trends` import added to `chat/route.ts` — registry.ts, types.ts, and chat route logic unchanged
- [ ] WalletBadge client component in agent layout polls wallet endpoint every 60s
- [ ] Chat page destructures `error` + `regenerate` from `useChat`, shows in-character error banner with retry
- [ ] `npm run build` passes with zero errors

## Verification

- `npm run build` — zero errors, all routes compile
- Dev server: `/api/agent/wallet` returns JSON (either balance or "not configured")
- Dev server: `/agent` shows wallet badge in nav, error banner on failed chat
- Server console shows `[skill-registry] Registered skill: Social Trends` alongside research skill

## Observability Impact

- Signals added: `[wallet]` console prefix for balance reads and errors; enhanced `[agent-chat]` error logging via `onError`
- How a future agent inspects this: `GET /api/agent/wallet` for wallet health; grep server logs for `[wallet]` or `[skill-registry]`
- Failure state exposed: wallet endpoint returns `{ configured: false }` when env missing; chat UI shows error state with retry action

## Inputs

- `lib/x402-client.ts` — pattern reference for viem publicClient + privateKeyToAccount (don't share its singleton)
- `lib/skills/research.ts` — template for stub skill structure (tools, registerSkill, systemPrompt)
- `lib/skills/registry.ts` — must NOT be modified (modularity proof)
- `lib/skills/types.ts` — must NOT be modified (modularity proof)
- `app/agent/layout.tsx` — add WalletBadge alongside existing AgentNavBar
- `app/agent/page.tsx` — enhance existing useChat destructuring with error + regenerate
- `app/api/agent/chat/route.ts` — add one import line for social-trends skill

## Expected Output

- `lib/wallet.ts` — server-only wallet balance reader with TTL cache
- `app/api/agent/wallet/route.ts` — GET endpoint returning wallet balance JSON
- `lib/skills/social-trends.ts` — stub skill proving modular registration
- `app/api/agent/chat/route.ts` — one new import line added
- `app/agent/layout.tsx` — WalletBadge component added to nav
- `app/agent/page.tsx` — error banner with retry, in-character copy
