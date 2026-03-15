---
id: S03
parent: M002
milestone: M002
provides:
  - lib/wallet.ts — server-only USDC balance reader with 60s TTL cache
  - app/api/agent/wallet/route.ts — GET endpoint returning balance or "not configured"
  - lib/skills/social-trends.ts — stub skill proving modular registration with zero core changes
  - WalletBadge client component in agent nav (polls wallet endpoint every 60s)
  - In-character error banner with retry in chat page (error + regenerate from useChat)
  - scripts/verify-m002-s03.sh — 21 S03 contract checks
  - scripts/verify-m002.sh — milestone aggregator (69 checks across S01+S02+S03)
requires:
  - slice: S01
    provides: lib/x402-client.ts (viem/publicClient pattern), lib/skills/registry.ts (registerSkill), app/agent/page.tsx (chat UI), app/agent/layout.tsx (agent layout)
  - slice: S02
    provides: app/agent/feed/page.tsx (feed page for error hardening context)
affects: []
key_files:
  - lib/wallet.ts
  - app/api/agent/wallet/route.ts
  - lib/skills/social-trends.ts
  - app/api/agent/chat/route.ts
  - app/agent/layout.tsx
  - app/agent/page.tsx
  - scripts/verify-m002-s03.sh
  - scripts/verify-m002.sh
key_decisions: []
patterns_established:
  - WalletBadge polling — useEffect + setInterval(60s) with mounted guard and cleanup
  - Stub skill template — canned data + preview system prompt, registerSkill() at module level, imported via side-effect
  - Graceful "not configured" API response — 200 with { configured: false } instead of 500
  - Milestone verification aggregator — runs slice scripts in sequence, extracts pass/fail counts, reports per-slice and aggregate
observability_surfaces:
  - "[wallet]" console prefix on all balance reads and errors
  - "[social-trends]" console prefix on skill registration
  - "[agent-chat]" error logging via onError callback in useChat
  - "[skill-registry]" logs show both Research and Social Trends registration with tool counts
  - GET /api/agent/wallet returns { address, balance, formatted } or { error, configured: false }
drill_down_paths:
  - .gsd/milestones/M002/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S03/tasks/T02-SUMMARY.md
duration: 30m
verification_result: passed
completed_at: 2026-03-15
---

# S03: Operational Hardening & Modular Proof

**Wallet balance display, in-character error handling, stub skill proving modular architecture, and milestone-level verification — 69/69 checks across all M002 slices.**

## What Happened

Three independent features shipped in a single task, then verified with two scripts.

**Wallet balance** — `lib/wallet.ts` creates its own viem `publicClient` on Base Sepolia (separate from x402 singleton), derives account from `X402_PRIVATE_KEY`, reads USDC balance via `readContract` with `erc20Abi`. 60s in-memory TTL cache prevents redundant RPC calls. Route at `/api/agent/wallet` returns JSON balance or `{ configured: false }` when the key is missing (200, not 500 — graceful degradation). `WalletBadge` client component in agent nav polls every 60s, shows formatted USDC amount, "N/A" when not configured, warning icon on error.

**Stub skill (modularity proof)** — `lib/skills/social-trends.ts` follows the research skill pattern exactly: one `trending-topics` tool returning canned data, system prompt fragment marking it as a preview capability, `registerSkill()` at module level. A single `import "@/lib/skills/social-trends"` line added to `chat/route.ts` — the only "core" change. Zero modifications to `registry.ts`, `types.ts`, or any chat route logic. Server logs confirm both skills register with tool counts.

**In-character error handling** — Destructured `error` and `regenerate` from `useChat`. `onError` callback logs with `[agent-chat]` prefix. When `status === 'error'`, renders a dark-elevated banner with aqua accent: "Lost signal. Try again." with a retry button calling `regenerate()`. Voice matches the cool & mysterious agent character.

**Verification** — `verify-m002-s03.sh` runs 21 checks covering file existence, export contracts, observability prefixes, error handling wiring, wallet badge presence, and build health. `verify-m002.sh` aggregates all three slice scripts: S01 (25) + S02 (23) + S03 (21) = 69/69 passed.

## Verification

- `bash scripts/verify-m002-s03.sh` — 21/21 passed
- `bash scripts/verify-m002.sh` — 69/69 passed (S01: 25, S02: 23, S03: 21)
- `npm run build` — zero errors
- Dev server: WalletBadge renders "N/A" in nav, error banner renders on chat failure
- Server logs: `[skill-registry] Registered skill: Company & People Research (research) — 2 tool(s)` and `[skill-registry] Registered skill: Social Trends (social-trends) — 1 tool(s)`

## Requirements Advanced

- R005 (Agent Chat Interface) — error handling hardened with in-character messages and retry
- R007 (AgentCash Backend Integration) — wallet balance endpoint provides operational awareness of funded state

## Requirements Validated

- R008 (People & Company Research Skill) — research skill fully built with company-lookup and person-enrich tools, self-registers in skill registry, wired through streaming chat API. Live proof pending funded wallet.
- R009 (Modular Skill Architecture) — social-trends stub skill registered alongside research with zero changes to registry, types, or chat route logic beyond one import line. Architecture proven modular.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

- Wallet balance requires a funded Base Sepolia wallet with `X402_PRIVATE_KEY` set — returns "not configured" otherwise
- Social trends skill returns canned data only (intentional — it's a modularity proof, not a real capability)
- Error banner covers all error types with a single message — no differentiation between network failures, rate limits, or empty wallet
- Live end-to-end proof (user types "research Anthropic" → gets real data) pending API keys and funded wallet

## Follow-ups

None — S03 is the final slice of M002. Remaining live integration work (funded wallet, API keys, Vercel KV credentials, deployment) is operational, not code.

## Files Created/Modified

- `lib/wallet.ts` — new: server-only USDC balance reader with own publicClient, 60s TTL cache
- `app/api/agent/wallet/route.ts` — new: GET endpoint returning balance JSON or "not configured"
- `lib/skills/social-trends.ts` — new: stub skill with trending-topics tool, canned data
- `app/api/agent/chat/route.ts` — added `import "@/lib/skills/social-trends"` (one line)
- `app/agent/layout.tsx` — added WalletBadge component to desktop and mobile nav
- `app/agent/page.tsx` — added error/regenerate destructuring, onError callback, error banner with retry
- `scripts/verify-m002-s03.sh` — new: S03 slice verification (21 checks)
- `scripts/verify-m002.sh` — new: M002 milestone aggregator (69 checks)

## Forward Intelligence

### What the next milestone should know
- The entire agent platform is code-complete but not live-tested. M003 (Token & Launch) can proceed independently — the agent surfaces are stable and all 69 contract checks pass.
- Live integration requires: `X402_PRIVATE_KEY` with funded wallet, `OPENROUTER_API_KEY`, `KV_REST_API_URL` + `KV_REST_API_TOKEN`, `CRON_SECRET`. All are runtime config, no code changes needed.

### What's fragile
- Wallet balance depends on Base Sepolia USDC contract address being correct — if deploying to mainnet, the contract address in `lib/wallet.ts` must change
- The TTL cache in `lib/wallet.ts` is in-memory and per-serverless-invocation on Vercel — effectively no caching in production. Acceptable for 60s polling but worth noting.

### Authoritative diagnostics
- `bash scripts/verify-m002.sh` — single command to audit all 69 M002 contract checks
- `GET /api/agent/wallet` — wallet health check (configured state, balance, address)
- Server logs `[skill-registry]` — confirms which skills and how many tools are registered

### What assumptions changed
- No assumptions changed — S03 was low-risk by design and executed exactly to plan
