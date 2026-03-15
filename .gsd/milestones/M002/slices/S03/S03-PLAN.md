# S03: Operational Hardening & Modular Proof

**Goal:** The agent shows wallet USDC balance, handles failures with in-character errors, and a stub skill registers without touching core agent code — proving the skill architecture is modular.
**Demo:** User visits agent.drip.surf — wallet balance visible in nav. Sending a chat message when the API is misconfigured shows "Lost signal. Try again." with a retry button instead of a blank failure. The social-trends stub skill is registered alongside research with zero changes to the registry, types, or chat route logic.

## Must-Haves

- Wallet USDC balance visible in agent layout (polls `/api/agent/wallet`, displays formatted amount)
- In-character error messages in chat UI using `error` + `regenerate()` from `useChat` (AI SDK v6)
- Stub `social-trends` skill following `SkillDefinition` interface, registered via side-effect import — no modifications to `registry.ts`, `types.ts`, or chat route logic beyond the import line
- Milestone verification script aggregating S01+S02+S03 checks

## Proof Level

- This slice proves: operational + contract (error resilience, modular registration)
- Real runtime required: no (wallet balance needs RPC but the code path is a standard viem `readContract`; errors tested by the absence of API keys)
- Human/UAT required: yes (error copy voice consistency, wallet badge visual fit)

## Verification

- `bash scripts/verify-m002-s03.sh` — slice-level checks (file existence, exports, error handling wiring, build)
- `bash scripts/verify-m002.sh` — milestone-level checks aggregating S01 + S02 + S03
- `npm run build` — zero errors

## Observability / Diagnostics

- Runtime signals: `[wallet]` console prefix on balance reads, `[agent-chat]` error categorization on failure paths
- Inspection surfaces: `/api/agent/wallet` GET returns `{ address, balance, formatted }` or `{ error, configured: false }`
- Failure visibility: chat UI shows categorized error banner with retry action; wallet endpoint returns descriptive error JSON
- Redaction constraints: wallet private key never exposed — only public address and balance returned

## Integration Closure

- Upstream surfaces consumed: `lib/x402-client.ts` (viem/publicClient pattern for wallet balance), `lib/skills/registry.ts` (registerSkill for stub skill), `app/agent/page.tsx` + `app/agent/layout.tsx` + `app/agent/feed/page.tsx` (error hardening and wallet display)
- New wiring: WalletBadge component in agent layout, stub skill import in chat route, error/regenerate destructured from useChat
- What remains before the milestone is truly usable end-to-end: nothing — S03 is the final slice

## Tasks

- [x] **T01: Build wallet balance, stub skill, and error handling UI** `est:45m`
  - Why: All four code deliverables — wallet endpoint+badge, stub skill proving modularity, and in-character error states in the chat UI. These are independent features that don't interact with each other, just with existing S01/S02 surfaces.
  - Files: `lib/wallet.ts`, `app/api/agent/wallet/route.ts`, `lib/skills/social-trends.ts`, `app/api/agent/chat/route.ts`, `app/agent/layout.tsx`, `app/agent/page.tsx`
  - Do: (1) Build `lib/wallet.ts` — server-only module with `getWalletBalance()` using viem `readContract` + `erc20Abi` against Base Sepolia USDC. Own `publicClient` + `account` (don't share x402 singleton). 60s in-memory TTL cache. Returns `{ address, balance, formatted }` or throws. (2) Build `/api/agent/wallet` GET route returning balance JSON, with `{ error, configured: false }` when `X402_PRIVATE_KEY` missing. (3) Build `WalletBadge` client component in agent layout — fetches `/api/agent/wallet` on mount + 60s interval, shows formatted USDC. (4) Build `lib/skills/social-trends.ts` — stub skill with one `trending-topics` tool returning canned data, `registerSkill()` at module level, system prompt fragment saying it's a preview capability. Add `import "@/lib/skills/social-trends"` to chat route (the only "core" change). (5) Enhance `app/agent/page.tsx` — destructure `error` + `regenerate` from `useChat`, add `onError` callback. Show in-character error banner ("Lost signal. Try again.") with retry button when `status === 'error'`. Use frontend-design skill for styling.
  - Verify: `npm run build` passes; dev server renders wallet badge and error states; stub skill shows in `[skill-registry]` logs
  - Done when: Build passes with all six files, wallet badge renders in layout, error banner renders when chat fails, social-trends registers alongside research without modifying registry/types

- [x] **T02: Write verification scripts and run final proof** `est:15m`
  - Why: Validates all S03 deliverables via automated checks. Also produces the milestone-level verification script that aggregates S01+S02+S03 — a deliverable called out in the roadmap.
  - Files: `scripts/verify-m002-s03.sh`, `scripts/verify-m002.sh`
  - Do: (1) Write `verify-m002-s03.sh` checking: wallet module exports `getWalletBalance`, wallet route exports GET, stub skill file exists with `registerSkill` call, social-trends imported in chat route, `error` and `regenerate` destructured in chat page, WalletBadge in layout, build passes. (2) Write `verify-m002.sh` — runs S01 (25 checks) + S02 (23 checks) + S03 checks, reports aggregate pass/fail. (3) Run both scripts, fix any failures.
  - Verify: `bash scripts/verify-m002-s03.sh` all pass; `bash scripts/verify-m002.sh` all pass
  - Done when: Both verification scripts pass all checks with zero failures

## Files Likely Touched

- `lib/wallet.ts` (new)
- `app/api/agent/wallet/route.ts` (new)
- `lib/skills/social-trends.ts` (new)
- `app/api/agent/chat/route.ts` (add import)
- `app/agent/layout.tsx` (add WalletBadge)
- `app/agent/page.tsx` (add error handling)
- `scripts/verify-m002-s03.sh` (new)
- `scripts/verify-m002.sh` (new)
