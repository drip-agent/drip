---
id: S01
parent: M002
milestone: M002
provides:
  - Subdomain routing via proxy.ts (agent.drip.surf → /agent/*)
  - x402 payment-wrapped fetch factory (server-only guarded)
  - SkillDefinition interface + skill registry (registerSkill/getSkills/getAllTools/getSystemPrompt)
  - Research skill with company-lookup and person-enrich tools via StableEnrich/x402
  - Streaming chat API route (OpenRouter + Claude Sonnet 4, stepCountIs(5) stop, tool orchestration)
  - Agent layout with AgentNavBar (Chat/Feed links, DRIP AGENT branding)
  - Streaming chat UI (useChat, tool-call indicators, dark-theme styling, suggestion buttons)
  - 25-check contract verification script
requires:
  - slice: M001
    provides: Design system (components/ui/*, components/layout/*, globals.css tokens, lib/utils.ts)
affects:
  - S02 (consumes x402-client, skill registry, research skill, agent layout)
  - S03 (consumes registry for modular skill proof, x402-client for wallet balance, all agent surfaces for error hardening)
key_files:
  - proxy.ts
  - lib/x402-client.ts
  - lib/skills/types.ts
  - lib/skills/registry.ts
  - lib/skills/research.ts
  - app/api/agent/chat/route.ts
  - app/agent/layout.tsx
  - app/agent/page.tsx
  - scripts/verify-m002-s01.sh
key_decisions:
  - "D033: proxy.ts convention (Next.js 16 deprecates middleware.ts)"
  - "D034: toClientEvmSigner(account, publicClient) for x402 signing"
  - "D035: @x402/evm is explicit dep, not transitive from @x402/fetch"
  - "D036: OpenRouter via @openrouter/ai-sdk-provider (supersedes D028 direct Anthropic)"
  - "D037: AI SDK v6 API surface — sendMessage(), status, DefaultChatTransport, inputSchema, stepCountIs(), toUIMessageStreamResponse()"
patterns_established:
  - "proxy.ts with host-based subdomain detection and path rewriting"
  - "server-only import guard at top of server-exclusive modules"
  - "Lazy singleton for expensive client initialization (createX402Fetch)"
  - "Module-level Map registry with fail-fast on empty access"
  - "useChat with DefaultChatTransport and manual useState for input (AI SDK v6)"
  - "Tool parts rendered via isToolUIPart() + getToolName(), state 'output-available' = done"
  - "Agent layout as separate client component with its own AgentNavBar"
observability_surfaces:
  - "[agent-chat] console prefix — request counts, tool calls, tool results, step finishes"
  - "[research] console prefix — tool invocations with domain/identifier and success/error"
  - "[skill-registry] — registration logs, duplicate warnings, empty registry errors"
  - "[x402-client] — missing env var error with descriptive message"
  - "Tool-call indicators in chat UI — pulsing dot while running, ✓ on completion"
  - "scripts/verify-m002-s01.sh — 25 contract checks, re-runnable"
drill_down_paths:
  - .gsd/milestones/M002/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T03-SUMMARY.md
duration: 1h
verification_result: passed
completed_at: 2026-03-15
---

# S01: Agent Chat with Live Research

**Full agent chat stack — subdomain routing, x402 payment client, modular skill registry, StableEnrich research tools, streaming LLM orchestration via OpenRouter, and dark-theme chat UI with tool-call indicators. 25/25 contract checks pass.**

## What Happened

Three tasks planned, one skipped and absorbed:

**T01** (15m) installed 8 packages and built the foundation: `proxy.ts` for subdomain routing (agent.drip.surf → /agent/*), `lib/x402-client.ts` with server-only guarded payment fetch factory using `toClientEvmSigner` composition, and the skill type system (`SkillDefinition` interface + registry with registerSkill/getSkills/getAllTools/getSystemPrompt).

**T02** was blocked during auto-mode execution and skipped. Its deliverables (research skill + chat API route) were absorbed into T03.

**T03** (45m) built everything remaining: the research skill with company-lookup and person-enrich tools wrapping StableEnrich API via x402 fetch, the streaming chat API route using OpenRouter (user override of D028's direct Anthropic) with Claude Sonnet 4, and the full chat UI. The UI has an empty state with suggestion buttons, streaming message display with markdown-ready formatting, tool-call indicators (pulsing dot → ✓), a stop button during generation, and auto-scroll. Agent layout includes a custom AgentNavBar with Chat/Feed links and DRIP AGENT branding.

AI SDK v6 broke 6 API surfaces from what the plan assumed — `useChat` input management, `parameters` → `inputSchema`, `maxSteps` → `stepCountIs()`, `toDataStreamResponse` → `toUIMessageStreamResponse`, and tool part shape changes. Each was discovered via build error and fixed systematically.

## Verification

- `bash scripts/verify-m002-s01.sh` — **25/25 checks pass**: file existence (8), dependencies (8), export contracts (8), build (1)
- `npm run build` — zero errors, zero warnings. Routes: `/agent` (static), `/api/agent/chat` (dynamic)
- Dev server at `localhost:3000/agent` — chat UI renders with empty state, NavBar, input bar. Sending a message shows user bubble, "Thinking..." indicator, stop button. Returns 500 without OPENROUTER_API_KEY (expected, clear error message).
- All observability surfaces confirmed in code: `[agent-chat]`, `[research]`, `[skill-registry]`, `[x402-client]` console prefixes, server-only guard, tool-call indicators in UI.

## Requirements Advanced

- **R005** (Agent Chat Interface) — Chat UI at /agent with streaming responses, tool-call indicators, dark-theme design. Structurally complete; needs live API key for full validation.
- **R007** (x402 Integration) — x402 client built with proper EVM signer composition, wired into research skill tools. Payment flow plumbed end-to-end; needs funded wallet for live proof.
- **R008** (People & Company Research Skill) — company-lookup and person-enrich tools with Zod schemas, StableEnrich API integration via x402. Needs live StableEnrich call for validation.
- **R009** (Modular Skill Architecture) — SkillDefinition interface, module-level registry, auto-registration at import. Research skill proves the pattern works. Full validation deferred to S03 (stub skill without core changes).

## Requirements Validated

None — all four requirements are structurally complete but need live runtime (API keys + funded wallet) or S03's modular proof before they can move to validated status.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

1. **T02 skipped, absorbed into T03** — Auto-mode recovery failed after 1 attempt. T03 took on both its own scope and T02's deliverables (research skill + chat route), completing everything.
2. **OpenRouter instead of direct Anthropic** (D036) — User override. Same AI SDK provider interface, one-line revert if needed.
3. **AI SDK v6 API changes** (D037) — 6 breaking changes from what the plan assumed. Required systematic adaptation during T03.
4. **Agent layout is a client component** — AgentNavBar uses useState for mobile menu toggle. Server component wasn't viable for the interactive nav.

## Known Limitations

- **No live API testing** — Without OPENROUTER_API_KEY and X402_PRIVATE_KEY, the chat returns 500. The x402 → StableEnrich → LLM flow is plumbed but unproven with live data.
- **No error recovery UI** — Failed requests show default error state. In-character error messages ("Lost signal. Try again.") deferred to S03.
- **No wallet balance display** — Deferred to S03.
- **Feed page link in NavBar leads to unbuilt route** — /agent/feed will 404 until S02 ships.

## Follow-ups

- S02 needs OPENROUTER_API_KEY set for autonomous feed generation (reuses same chat route pattern).
- S03 should test adding a stub skill that imports `registerSkill` from registry — proving zero-core-change modularity.
- Logo image aspect ratio warning persists from M001 — cosmetic, not blocking.

## Files Created/Modified

- `package.json` — added 8 dependencies (ai, @ai-sdk/react, @openrouter/ai-sdk-provider, @x402/fetch, @x402/evm, viem, server-only, zod)
- `proxy.ts` — subdomain routing proxy (agent.drip.surf → /agent/*)
- `lib/x402-client.ts` — server-only x402 payment-wrapped fetch factory
- `lib/skills/types.ts` — SkillDefinition interface
- `lib/skills/registry.ts` — skill registration and aggregation functions
- `lib/skills/research.ts` — research skill with company-lookup and person-enrich tools
- `app/api/agent/chat/route.ts` — streaming chat route with OpenRouter + skill tools
- `app/agent/layout.tsx` — agent layout with AgentNavBar
- `app/agent/page.tsx` — streaming chat UI with tool-call indicators
- `scripts/verify-m002-s01.sh` — 25-check contract verification script

## Forward Intelligence

### What the next slice should know
- OpenRouter is the LLM provider (D036), not direct Anthropic. `OPENROUTER_API_KEY` env var required.
- AI SDK v6 has significant API differences from v5 docs (D037). Don't trust old examples — check actual exports.
- The skill registry auto-registers at import time via side-effect imports in the chat route. New skills need to be imported there too.
- `proxy.ts` (not `middleware.ts`) is the Next.js 16 convention. Same API, different file name.

### What's fragile
- **Side-effect skill registration** — Skills must be imported in the chat route to register. If a new route needs skills, it must duplicate the import. A central `lib/skills/index.ts` barrel file would be cleaner.
- **x402 client lazy singleton** — First request pays initialization cost. If x402 setup is slow, first tool call may approach timeout. Not tested with real network yet.

### Authoritative diagnostics
- `bash scripts/verify-m002-s01.sh` — fastest contract health check (file existence, exports, dependencies, build). Run this first when something breaks.
- `[agent-chat]` in server console — shows every request, tool call, and tool result. Grep for it.
- `[skill-registry]` at server startup — confirms which skills loaded and how many tools registered.

### What assumptions changed
- **Plan assumed AI SDK v5 APIs** — v6 broke useChat input management, tool parameters, step limits, stream response format, and tool part shapes. All adapted, but future code must use v6 patterns.
- **Plan assumed direct Anthropic** — User chose OpenRouter. Provider interface is identical but env var name differs (OPENROUTER_API_KEY vs ANTHROPIC_API_KEY).
- **Plan assumed middleware.ts** — Next.js 16 deprecated it to proxy.ts (D033). Same API.
