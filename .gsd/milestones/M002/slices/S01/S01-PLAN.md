# S01: Agent Chat with Live Research

**Goal:** User visits agent.drip.surf, types "research Anthropic" in the chat, and receives a streaming response with real company data from StableEnrich — paid via x402 — formatted as structured markdown in the chat UI.
**Demo:** A user types "research Anthropic" into the chat at agent.drip.surf and receives a streaming response containing real StableEnrich company data, with visible tool-calling steps, in the DRIP dark-theme aesthetic.

## Must-Haves

- Subdomain routing: agent.drip.surf/* rewrites to /agent/* page routes via middleware
- x402 payment-wrapped fetch utility guarded with `server-only`
- Modular skill system: SkillDefinition interface, registry with registerSkill/getSkills/getSystemPrompt
- Research skill with StableEnrich tools (company-lookup, person-enrich) using x402 fetch
- Streaming chat API route using AI SDK streamText with registered skill tools, maxSteps: 5, maxDuration: 60
- Chat UI page using useChat hook with streaming message display, input with send button
- Agent layout with adapted NavBar (agent links, not landing page anchors)
- All agent pages use the M001 dark-theme + aqua-glow design system
- Build passes with no type errors

## Proof Level

- This slice proves: integration (x402 → StableEnrich → LLM → streaming response)
- Real runtime required: yes — live API calls through x402 payment flow
- Human/UAT required: yes — agent voice quality, response formatting, visual design consistency

## Verification

- `npm run build` passes with zero errors
- `bash scripts/verify-m002-s01.sh` — contract checks (file existence, exports, route responses, middleware config)
- Manual: POST /api/agent/chat with a research prompt returns streaming response with StableEnrich data
- Manual: agent.drip.surf renders chat UI in dev mode (requires /etc/hosts or Vercel preview)

## Observability / Diagnostics

- Runtime signals: console.log in chat route for tool invocations and x402 payment outcomes; structured error objects in tool results
- Inspection surfaces: dev server console shows tool calls, payment attempts, step count; chat UI renders tool call indicators
- Failure visibility: missing env vars → clear startup error; x402 payment failure → tool returns error object with reason; LLM timeout → maxDuration boundary prevents runaway; skill registry → lists registered skills at import time
- Redaction constraints: X402_PRIVATE_KEY and ANTHROPIC_API_KEY must never appear in logs or responses

## Integration Closure

- Upstream surfaces consumed: M001 design system (`components/ui/*`, `components/layout/*`, `lib/utils.ts`, `app/globals.css` tokens)
- New wiring introduced: middleware.ts (subdomain routing), /api/agent/chat (streaming endpoint), skill registry auto-registration
- What remains before milestone is truly usable end-to-end: S02 (discovery feed with KV persistence), S03 (wallet balance display, error hardening, modular skill proof)

## Tasks

- [x] **T01: Install deps and build middleware, x402 client, and skill architecture** `est:45m`
  - Why: Foundation plumbing that everything else builds on — subdomain routing, payment infrastructure, and the skill type system. No agent features work without these.
  - Files: `package.json`, `middleware.ts`, `lib/x402-client.ts`, `lib/skills/types.ts`, `lib/skills/registry.ts`
  - Do: Install AI SDK packages (ai, @ai-sdk/anthropic, @ai-sdk/react), x402 packages (@x402/fetch, viem), server-only, and zod. Create middleware with subdomain detection and path rewriting (exclude /_next, /api, static). Build x402-client with createX402Fetch() guarded by server-only. Define SkillDefinition interface and registry with registerSkill/getSkills/getSystemPrompt.
  - Verify: `npm run build` succeeds; `node -e "require('./lib/skills/types')"` resolves types
  - Done when: All 5 files exist, build passes, middleware matches agent.drip.surf routing pattern

- [x] **T02: Build research skill and streaming chat API route** `est:1h`
  - Why: The core agent brain — this is where x402 risk gets retired. The research skill defines StableEnrich tools with Zod schemas, the chat route orchestrates LLM + tool-calling + streaming. If this works, the product loop is proven.
  - Files: `lib/skills/research.ts`, `app/api/agent/chat/route.ts`
  - Do: Build research skill with company-lookup and person-enrich tools using x402 fetch against StableEnrich API. Create chat POST handler with streamText, Claude model, assembled system prompt from registry, registered tools, maxSteps: 5, maxDuration: 60. Collect ANTHROPIC_API_KEY and X402_PRIVATE_KEY via secure_env_collect. Wire the cool & mysterious agent voice into the system prompt.
  - Verify: `npm run build` succeeds; curl POST to /api/agent/chat with test prompt returns streaming response
  - Done when: Chat route streams real LLM responses; tool calls execute StableEnrich lookups via x402 payment flow

- [x] **T03: Build agent layout, chat UI, and integration verification** `est:1h`
  - Why: The agent's face — chat UI with useChat, agent layout with adapted navbar, and the verification script that proves the slice works. Without this, the backend has no user-facing surface.
  - Files: `app/agent/layout.tsx`, `app/agent/page.tsx`, `scripts/verify-m002-s01.sh`
  - Do: Create agent layout extending RootLayout patterns (same fonts/theme) with agent-specific NavBar (Chat, Feed links). Build chat page with useChat hook, scrolling message list with markdown rendering, input bar with send button, tool-call step indicators, loading states. Style everything in DRIP dark-theme aesthetic. Write verification script checking file existence, build success, route responses, and export contracts.
  - Verify: `bash scripts/verify-m002-s01.sh` all checks pass; dev server shows functional chat at /agent
  - Done when: Chat UI renders at /agent, sends messages, displays streaming responses with tool-call indicators; verification script passes all contract checks

## Files Likely Touched

- `package.json`
- `middleware.ts`
- `lib/x402-client.ts`
- `lib/skills/types.ts`
- `lib/skills/registry.ts`
- `lib/skills/research.ts`
- `app/agent/layout.tsx`
- `app/agent/page.tsx`
- `app/api/agent/chat/route.ts`
- `scripts/verify-m002-s01.sh`
