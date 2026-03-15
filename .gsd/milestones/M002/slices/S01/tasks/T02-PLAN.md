---
estimated_steps: 4
estimated_files: 3
---

# T02: Build research skill and streaming chat API route

**Slice:** S01 — Agent Chat with Live Research
**Milestone:** M002

## Description

The agent's brain. This task builds the research skill (StableEnrich tools for company and person lookup via x402 payment) and the streaming chat API route that orchestrates Claude + tool-calling. This is where the highest risk gets retired — if x402 payment flow works inside a Next.js API route with streaming LLM tool calls, the product loop is proven.

## Steps

1. Collect environment variables via `secure_env_collect`: `ANTHROPIC_API_KEY` (Claude API access), `X402_PRIVATE_KEY` (wallet private key for x402 signing). Store in `.env.local`.
2. Create `lib/skills/research.ts`. Define a `SkillDefinition` with two AI SDK tools:
   - `company-lookup`: Zod schema with `{ domain: z.string() }` parameter. Execute function calls StableEnrich company enrichment endpoint (`https://api.stableenrich.com/enrich/company`) via x402 fetch with the domain. Parse and return structured company data.
   - `person-enrich`: Zod schema with `{ linkedinUrl: z.string().optional(), email: z.string().optional() }`. Calls StableEnrich person enrichment endpoint (`https://api.stableenrich.com/enrich/person`) via x402 fetch. Parse and return structured person data.
   - System prompt establishes the "cool & mysterious" agent voice (D006): research-focused, drops insights without hype, formats results as structured markdown.
   - Auto-register the skill by calling `registerSkill()` at module level.
3. Create `app/api/agent/chat/route.ts`. POST handler that:
   - Reads `messages` from request body
   - Imports anthropic model from `@ai-sdk/anthropic`
   - Calls `getAllTools()` from registry to get merged tool definitions
   - Calls `getSystemPrompt()` from registry to build the combined system prompt
   - Uses `streamText()` with Claude model, system prompt, messages, tools, `maxSteps: 5`, `maxDuration: 60`
   - Returns `result.toDataStreamResponse()`
   - Side-imports `lib/skills/research.ts` to trigger auto-registration
4. Test the route: start dev server, send a curl POST to `/api/agent/chat` with a test message. Verify streaming response. If live x402 calls work, verify real data. If wallet isn't funded, verify the tool call attempt and graceful error.

## Must-Haves

- [ ] Research skill defines 2 tools with proper Zod schemas and x402 fetch execution
- [ ] Research skill auto-registers via module-level registerSkill() call
- [ ] Chat route uses streamText with Claude, assembled system prompt, merged tools
- [ ] maxSteps: 5 prevents tool-call loops; maxDuration: 60 prevents Vercel timeout
- [ ] System prompt maintains "cool & mysterious" voice — no hype, no filler, structured output
- [ ] Tool execution errors are caught and returned as structured error objects (not thrown)
- [ ] Environment variables validated at route initialization — clear errors for missing keys

## Verification

- `npm run build` succeeds with research skill and chat route
- Dev server: `curl -X POST http://localhost:3000/api/agent/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hello"}]}'` returns streaming response
- Research skill appears in `getSkills()` output (2 tools registered)
- System prompt contains "cool & mysterious" voice directives

## Observability Impact

- Signals added: console.log for tool invocations (tool name, input summary), x402 payment outcomes (success/failure/amount), step count per request
- How a future agent inspects this: dev server console shows tool call flow; curl to chat endpoint shows raw stream data
- Failure state exposed: x402 payment failure returns `{ error: string, code: string }` in tool result; missing env vars throw descriptive error at module load; tool timeout returns partial result

## Inputs

- `lib/x402-client.ts` — createX402Fetch() for payment-wrapped HTTP calls (from T01)
- `lib/skills/types.ts` — SkillDefinition interface (from T01)
- `lib/skills/registry.ts` — registerSkill, getAllTools, getSystemPrompt (from T01)
- D006 — agent voice: cool & mysterious, drops value quietly
- D008 — first skill: StableEnrich people & company research
- D028 — Claude via @ai-sdk/anthropic
- D032 — AI SDK streamText + tool()

## Expected Output

- `lib/skills/research.ts` — research skill with 2 StableEnrich tools, auto-registered
- `app/api/agent/chat/route.ts` — streaming POST handler with Claude + tool-calling
- `.env.local` — ANTHROPIC_API_KEY and X402_PRIVATE_KEY populated via secure_env_collect
