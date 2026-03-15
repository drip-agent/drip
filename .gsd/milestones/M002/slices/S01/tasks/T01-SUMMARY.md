---
id: T01
parent: S01
milestone: M002
provides:
  - Subdomain routing via proxy.ts (agent.drip.surf → /agent/*)
  - x402 payment-wrapped fetch factory (server-only guarded)
  - SkillDefinition interface compatible with AI SDK Tool type
  - Skill registry with registerSkill/getSkills/getAllTools/getSystemPrompt
key_files:
  - proxy.ts
  - lib/x402-client.ts
  - lib/skills/types.ts
  - lib/skills/registry.ts
key_decisions:
  - "D033: Use proxy.ts convention (Next.js 16 deprecates middleware.ts)"
  - "D034: Compose ClientEvmSigner via toClientEvmSigner(account, publicClient)"
  - "D035: @x402/evm is explicit dep, not transitive from @x402/fetch"
patterns_established:
  - "proxy.ts with host-based subdomain detection and path rewriting"
  - "server-only import guard at top of server-exclusive modules"
  - "Lazy singleton pattern for expensive client initialization (createX402Fetch)"
  - "Module-level Map registry with fail-fast on empty access"
observability_surfaces:
  - "Skill registry logs registrations and warns on duplicates at import time"
  - "Empty registry throws with clear message instead of silently returning empty tools"
  - "x402 client throws with descriptive message on missing X402_PRIVATE_KEY"
duration: 15m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Install deps and build middleware, x402 client, and skill architecture

**Installed 8 packages (7 planned + @x402/evm) and built subdomain proxy, x402 payment client, and skill type system — all passing build.**

## What Happened

Installed all AI SDK packages (ai, @ai-sdk/anthropic, @ai-sdk/react), payment packages (@x402/fetch, @x402/evm, viem), server-only, and zod. Zero peer conflicts.

Created `proxy.ts` (Next.js 16 convention, not the deprecated `middleware.ts`) with host-based detection for `agent.drip.surf` and `agent.localhost:3000`. Rewrites `/path` → `/agent/path`, excludes `/_next`, `/api`, static extensions, and `favicon.ico`.

Built `lib/x402-client.ts` with `server-only` import guard. Uses `toClientEvmSigner(account, publicClient)` to compose a proper `ClientEvmSigner` from a viem account + public client, then registers with `registerExactEvmScheme`. Lazy singleton — created once, reused.

Defined `SkillDefinition` interface in `lib/skills/types.ts` using AI SDK's `Tool` type (not `CoreTool` — that was the v3 name, v6 exports `Tool`).

Built `lib/skills/registry.ts` with module-level Map store. Four exports: `registerSkill` (warns on duplicate), `getSkills` (throws on empty), `getAllTools` (merges all skill tools), `getSystemPrompt` (concatenates with headers).

## Verification

- `npm run build` → zero errors, zero warnings
- `grep -l "server-only" lib/x402-client.ts` → confirmed
- Registry exports verified: registerSkill, getSkills, getAllTools, getSystemPrompt
- Proxy exports config.matcher array
- All 8 packages present in package.json dependencies

### Slice-level verification (T01 scope)

- ✅ `npm run build` passes with zero errors
- ⏳ `bash scripts/verify-m002-s01.sh` — not yet created (T03)
- ⏳ POST /api/agent/chat — not yet created (T02)
- ⏳ agent.drip.surf renders chat UI — not yet created (T03)

## Diagnostics

- **Proxy:** Stateless rewrite — no runtime logs. Misconfigured rewrites surface as 404s on agent subdomain routes. Inspect via `config.matcher` export.
- **x402 client:** Missing env → thrown Error with message containing `[x402-client]`. Server-only guard prevents client bundle inclusion (build-time error).
- **Registry:** Console output at import time shows registered skills. Empty access → thrown Error with `[skill-registry]` prefix. Duplicate registration → console.warn.

## Deviations

1. **proxy.ts instead of middleware.ts** — Next.js 16.1.6 deprecates the `middleware` file convention. Same API, renamed. Avoids build warning.
2. **@x402/evm added as 8th dependency** — Not transitive from @x402/fetch. Required for `ExactEvmScheme` and `toClientEvmSigner`.
3. **`Tool` type instead of `CoreTool`** — AI SDK v6 exports `Tool` from `@ai-sdk/provider-utils`, not `CoreTool`. Same type, different name.
4. **`toClientEvmSigner` + `registerExactEvmScheme` pattern** — x402 v2 `ExactEvmScheme` requires `ClientEvmSigner` with `readContract`. Can't pass a bare `privateKeyToAccount` result directly.

## Known Issues

None.

## Files Created/Modified

- `package.json` — added 8 dependencies (ai, @ai-sdk/anthropic, @ai-sdk/react, @x402/fetch, @x402/evm, viem, server-only, zod)
- `proxy.ts` — subdomain routing proxy with host detection and path rewriting
- `lib/x402-client.ts` — server-only x402 payment-wrapped fetch factory
- `lib/skills/types.ts` — SkillDefinition interface
- `lib/skills/registry.ts` — skill registration and aggregation functions
