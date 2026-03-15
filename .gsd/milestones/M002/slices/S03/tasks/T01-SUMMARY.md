---
id: T01
parent: S03
milestone: M002
provides:
  - lib/wallet.ts — server-only USDC balance reader with TTL cache
  - app/api/agent/wallet/route.ts — GET endpoint returning wallet balance or "not configured"
  - lib/skills/social-trends.ts — stub skill proving modular registration
  - WalletBadge component in agent layout nav
  - In-character error banner with retry in chat page
key_files:
  - lib/wallet.ts
  - app/api/agent/wallet/route.ts
  - lib/skills/social-trends.ts
  - app/api/agent/chat/route.ts
  - app/agent/layout.tsx
  - app/agent/page.tsx
key_decisions: []
patterns_established:
  - WalletBadge polling pattern — useEffect + setInterval(60s) with mounted guard and cleanup
  - Stub skill template — canned data + preview system prompt, registerSkill() at module level
  - Graceful "not configured" API response — 200 with { configured: false } instead of 500
observability_surfaces:
  - "[wallet]" console prefix on all balance reads and errors
  - GET /api/agent/wallet returns { address, balance, formatted } or { error, configured: false }
  - "[agent-chat]" error logging via onError callback in useChat
  - "[skill-registry]" logs show both Research and Social Trends registration
duration: 20m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Build wallet balance, stub skill, and error handling UI

**Wallet USDC balance endpoint + badge, social-trends stub skill registered via side-effect import, and in-character chat error banner with retry.**

## What Happened

Built three independent features:

1. **Wallet balance** — `lib/wallet.ts` creates its own viem `publicClient` on Base Sepolia (separate from x402 singleton), derives account from `X402_PRIVATE_KEY`, calls `readContract` with `erc20Abi` / `balanceOf`. 60s in-memory TTL cache. Route at `/api/agent/wallet` returns JSON or `{ configured: false }` when key missing (200, not 500). `WalletBadge` client component added to `AgentNavBar` — polls every 60s, shows formatted USDC, "N/A" when not configured, "⚠" on error.

2. **Social trends stub** — `lib/skills/social-trends.ts` follows the `research.ts` pattern exactly. One tool (`trending-topics`), canned return data, system prompt fragment marking it as preview. Calls `registerSkill()` at module level. Single import line added to `chat/route.ts`. Zero changes to `registry.ts`, `types.ts`, or chat route logic.

3. **Chat error handling** — Destructured `error` and `regenerate` from `useChat`. Added `onError` callback logging with `[agent-chat]` prefix. When `status === 'error'`, renders in-character banner: "Lost signal. Try again." with a retry button calling `regenerate()`. Styled with design system — dark elevated bg, aqua accent border.

## Verification

- `npm run build` — zero errors, all routes compile including new `/api/agent/wallet`
- `curl /api/agent/wallet` returns `{ "error": "Wallet not configured", "configured": false }`
- Server logs show `[skill-registry] Registered skill: Company & People Research (research) — 2 tool(s)` and `[skill-registry] Registered skill: Social Trends (social-trends) — 1 tool(s)`
- Browser: `/agent` shows WalletBadge with "N/A" in nav alongside Chat/Feed links
- Browser assertions passed: Chat, Feed, N/A text visible; nav element present

## Diagnostics

- **Wallet health:** `GET /api/agent/wallet` — returns balance or `{ configured: false }`
- **Skill registration:** grep server logs for `[skill-registry]` — both skills listed with tool counts
- **Wallet errors:** grep for `[wallet]` in server logs
- **Chat errors:** grep for `[agent-chat]` — includes onError callback output

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `lib/wallet.ts` — new: server-only USDC balance reader with own publicClient, 60s TTL cache
- `app/api/agent/wallet/route.ts` — new: GET endpoint returning balance JSON or "not configured"
- `lib/skills/social-trends.ts` — new: stub skill with trending-topics tool, canned data
- `app/api/agent/chat/route.ts` — added `import "@/lib/skills/social-trends"` (one line)
- `app/agent/layout.tsx` — added WalletBadge component to desktop and mobile nav
- `app/agent/page.tsx` — added error/regenerate destructuring, onError callback, error banner with retry
