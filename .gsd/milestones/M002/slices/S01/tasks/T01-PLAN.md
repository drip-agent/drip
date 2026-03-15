---
estimated_steps: 5
estimated_files: 5
---

# T01: Install deps and build middleware, x402 client, and skill architecture

**Slice:** S01 — Agent Chat with Live Research
**Milestone:** M002

## Description

Foundation plumbing for the entire agent platform. Three distinct pieces that have no value alone but are prerequisites for everything: (1) subdomain middleware so agent.drip.surf resolves to /agent/* routes, (2) x402 payment-wrapped fetch so the agent can pay for StableEnrich API calls, (3) skill type system so the research skill and chat route have a clean interface contract.

## Steps

1. Install dependencies: `ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`, `@x402/fetch`, `viem`, `server-only`, `zod` (explicit — currently only transitive). Verify installation resolves cleanly.
2. Create `middleware.ts` at project root. Detect `agent.drip.surf` (or `agent.localhost:3000` for local dev) via `request.headers.get('host')`. Rewrite matching requests from `/path` to `/agent/path`. Exclude `/_next`, `/api`, static file extensions, and `favicon.ico` from rewriting. Export a `config.matcher` that avoids unnecessary middleware invocations.
3. Create `lib/x402-client.ts`. Import `wrapFetchWithPayment` from `@x402/fetch` and `createWalletClient`/`http` from `viem`. Import `server-only` at top to prevent client bundle inclusion. Export `createX402Fetch()` that reads `X402_PRIVATE_KEY` from env, constructs a viem wallet client on Base Sepolia, and returns a payment-wrapped fetch. Lazy initialization — create once, reuse.
4. Create `lib/skills/types.ts`. Define `SkillDefinition` interface: `{ id: string, name: string, description: string, systemPrompt: string, tools: Record<string, CoreTool> }`. Import `CoreTool` type from `ai` package. Export the interface.
5. Create `lib/skills/registry.ts`. Module-level `Map<string, SkillDefinition>` as the registry store. Export `registerSkill(skill: SkillDefinition)` (adds to map, warns on duplicate ID), `getSkills()` (returns all registered skills), `getAllTools()` (merges all skill tools into one Record), `getSystemPrompt()` (concatenates all skill system prompts with skill name headers). Guard against empty registry with clear error messages.

## Must-Haves

- [ ] All 7 packages install without peer dependency conflicts
- [ ] Middleware correctly rewrites agent subdomain requests but passes through /_next, /api, and static files
- [ ] x402 client is server-only guarded — importing it in a client component should fail at build
- [ ] SkillDefinition interface is compatible with AI SDK's CoreTool type
- [ ] Registry functions are pure module-level operations (no database, no async init)
- [ ] Build passes with all new files

## Verification

- `npm run build` completes with zero errors
- `grep -l "server-only" lib/x402-client.ts` confirms server guard
- Registry module exports the expected functions: registerSkill, getSkills, getAllTools, getSystemPrompt
- Middleware exports config.matcher array

## Inputs

- `package.json` — current dependency list (M001 stack: next, react, gsap, motion, cva, clsx, tailwind-merge)
- `next.config.ts` — current empty config (may need updates)
- `tsconfig.json` — existing TypeScript config with `@/*` path alias
- D027 — subdomain routing decision (single codebase, middleware rewrite)
- D030 — x402 integration mode (direct HTTP via @x402/fetch, not MCP)
- D032 — AI SDK as orchestration framework

## Expected Output

- `package.json` — updated with 7 new dependencies
- `middleware.ts` — subdomain router with matcher config
- `lib/x402-client.ts` — server-only x402 payment fetch factory
- `lib/skills/types.ts` — SkillDefinition interface
- `lib/skills/registry.ts` — skill registration and aggregation functions

## Observability Impact

- **Middleware:** No runtime logging in this task (stateless rewrite). Future agent inspects via `config.matcher` export and request path tests. Misconfigured rewrites surface as 404s on agent.drip.surf routes.
- **x402 client:** `server-only` guard makes misuse visible at build time (client import → build error). Missing `X402_PRIVATE_KEY` → logged warning at initialization, not silent failure. Lazy singleton means first call surfaces config errors.
- **Skill registry:** `registerSkill` logs duplicate ID warnings to console. `getAllTools`/`getSystemPrompt` throw on empty registry — fail fast rather than silently returning empty prompts. Registered skill count visible at import time via console output in consuming modules.
