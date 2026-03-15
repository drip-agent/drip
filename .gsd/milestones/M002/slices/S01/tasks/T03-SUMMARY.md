---
id: T03
parent: S01
milestone: M002
provides:
  - Agent layout at /agent with agent-specific NavBar (Chat, Feed links)
  - Streaming chat UI with useChat, tool-call indicators, DRIP dark-theme styling
  - Research skill (company-lookup, person-enrich) via x402/StableEnrich
  - Chat API route with OpenRouter + skill tool orchestration
  - Slice contract verification script (25 checks)
key_files:
  - app/agent/layout.tsx
  - app/agent/page.tsx
  - app/api/agent/chat/route.ts
  - lib/skills/research.ts
  - scripts/verify-m002-s01.sh
key_decisions:
  - "D036: OpenRouter via @openrouter/ai-sdk-provider (user override of D028)"
  - "D037: AI SDK v6 API surface — sendMessage(), status, DefaultChatTransport, inputSchema, stepCountIs(), toUIMessageStreamResponse()"
patterns_established:
  - "useChat with DefaultChatTransport and manual useState for input (AI SDK v6 pattern)"
  - "Tool parts use isToolUIPart() + getToolName() for rendering, state 'output-available' = done"
  - "Agent layout as separate client component with its own AgentNavBar (not reusing landing NavBar)"
observability_surfaces:
  - "[agent-chat] console prefix — logs request counts, tool calls, tool results, step finishes"
  - "[research] console prefix — logs each tool invocation with domain/identifier and success/error"
  - "Missing OPENROUTER_API_KEY → 500 with '[agent-chat] OPENROUTER_API_KEY is not set'"
  - "Tool-call indicators in chat UI — pulsing dot while running, ✓ on completion"
  - "scripts/verify-m002-s01.sh — 25 contract checks, exit 1 on failure"
duration: 45m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T03: Build agent layout, chat UI, and integration verification

**Built agent layout, streaming chat UI, research skill, chat API route (OpenRouter), and verification script — all 25 contract checks pass, build green.**

## What Happened

T02 was blocked/skipped, so T03 absorbed its deliverables: the research skill and chat API route. User overrode D028 (direct Anthropic) in favor of OpenRouter (`@openrouter/ai-sdk-provider`).

The AI SDK v6 broke multiple APIs from the original plan: `useChat` no longer manages input state (use `useState` + `sendMessage()`), `parameters` → `inputSchema` in `tool()`, `maxSteps` → `stopWhen: stepCountIs(n)`, `toDataStreamResponse` → `toUIMessageStreamResponse`, tool part shape changed (no `.toolInvocation` wrapper, state `result` → `output-available`). Each was discovered via build failure and fixed systematically — one change at a time.

Built:
- **Research skill** (`lib/skills/research.ts`): company-lookup and person-enrich tools wrapping StableEnrich API via x402 fetch. Self-registers at import time. Structured error objects on failure.
- **Chat route** (`app/api/agent/chat/route.ts`): OpenRouter with Claude Sonnet 4, skill tools assembled from registry, `stepCountIs(5)` stop condition, onStepFinish logging.
- **Agent layout** (`app/agent/layout.tsx`): Client component with AgentNavBar (Chat/Feed links, DRIP logo + "AGENT" label), glass-strong backdrop, fixed top nav.
- **Chat page** (`app/agent/page.tsx`): Full streaming chat with empty state (suggestions), user/assistant message styling, tool-call indicators with isToolUIPart/getToolName, loading indicator, stop button, auto-scroll.
- **Verification script** (`scripts/verify-m002-s01.sh`): 25 checks across file existence, dependencies, exports, and build.

## Verification

- `bash scripts/verify-m002-s01.sh` — 25/25 pass ✅
- `npm run build` — succeeds, all routes visible (`/agent` static, `/api/agent/chat` dynamic)
- Dev server at `localhost:3000/agent`:
  - Empty state renders: DRIP Agent heading, subtitle, three suggestion buttons
  - NavBar shows DRIP logo + AGENT label, Chat and Feed links
  - Input bar with placeholder, send button
  - Typing "Hello" and submitting: user message appears right-aligned, "Thinking..." indicator shows, Stop button appears
  - API returns 500 (expected — no OPENROUTER_API_KEY set), UI recovers to ready state

### Slice-level verification status
- ✅ `npm run build` passes
- ✅ `bash scripts/verify-m002-s01.sh` — all contract checks pass
- ⏳ Manual: POST /api/agent/chat with research prompt — requires OPENROUTER_API_KEY
- ⏳ Manual: agent.drip.surf renders chat UI — requires /etc/hosts or Vercel preview

## Diagnostics

- **Chat route errors**: Server console `[agent-chat]` prefix. Missing env → `OPENROUTER_API_KEY is not set` at ERROR level.
- **Tool invocations**: `[research] company-lookup: {domain}` / `[research] person-enrich: {identifier}` — logged before x402 fetch.
- **Skill registration**: `[skill-registry] Registered skill: Company & People Research (research) — 2 tool(s)` at import time (visible in build output and server startup).
- **UI indicators**: Tool parts render as DOM elements with state-dependent styling (pulsing = in progress, ✓ = complete).
- **Verification**: `bash scripts/verify-m002-s01.sh` re-runnable at any time.

## Deviations

- T02 was skipped (blocker), so T03 built the research skill and chat route (T02's deliverables).
- OpenRouter replaces direct Anthropic (D036 — user request).
- AI SDK v6 API changes required adapting 6 API surfaces (D037).
- `app/agent/layout.tsx` is a client component (not server) — AgentNavBar uses useState for mobile menu toggle.

## Known Issues

- Without OPENROUTER_API_KEY, chat returns 500 — expected, env guard is clear.
- Image aspect ratio warning on logo (pre-existing from M001, not introduced here).

## Files Created/Modified

- `lib/skills/research.ts` — Research skill with company-lookup and person-enrich x402 tools
- `app/api/agent/chat/route.ts` — Streaming chat route with OpenRouter + skill tools
- `app/agent/layout.tsx` — Agent layout with AgentNavBar (Chat/Feed links)
- `app/agent/page.tsx` — Streaming chat UI with useChat, tool indicators, DRIP styling
- `scripts/verify-m002-s01.sh` — 25-check contract verification script
- `.gsd/milestones/M002/slices/S01/tasks/T03-PLAN.md` — Added Observability Impact section
- `.gsd/DECISIONS.md` — Appended D036 (OpenRouter), D037 (AI SDK v6 API surface)
