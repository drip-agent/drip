# S01: Agent Chat with Live Research — UAT

**Milestone:** M002
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven contract checks + live-runtime for API integration + human-experience for design/voice)
- Why this mode is sufficient: S01 includes both structural contracts (file existence, exports, build) and live integration (x402 → StableEnrich → LLM → streaming response) that can only be proven at runtime with real API keys. Design consistency and agent voice require human judgment.

## Preconditions

- `npm install` completed (all 8 new dependencies installed)
- `npm run build` passes with zero errors
- Dev server running: `npm run dev`
- For contract tests: no additional setup needed
- For live integration tests: `OPENROUTER_API_KEY` and `X402_PRIVATE_KEY` set in `.env.local`, x402 wallet funded with USDC
- For subdomain routing: either `/etc/hosts` entry mapping `agent.localhost` to `127.0.0.1` or Vercel preview deployment with `agent.drip.surf` configured

## Smoke Test

1. Run `bash scripts/verify-m002-s01.sh`
2. **Expected:** 25/25 checks pass, exit code 0
3. Open `http://localhost:3000/agent` in browser
4. **Expected:** Chat page renders with "DRIP Agent" heading, three suggestion buttons, input bar with "Ask DRIP anything..." placeholder

## Test Cases

### 1. Contract Verification (Automated)

1. Run `bash scripts/verify-m002-s01.sh`
2. **Expected:** All 25 checks pass:
   - 8 file existence checks (proxy.ts, x402-client, types, registry, research, chat route, layout, page)
   - 8 dependency checks (ai, @ai-sdk/react, @openrouter/ai-sdk-provider, @x402/fetch, @x402/evm, viem, zod, server-only)
   - 8 export contract checks (config, SkillDefinition, registerSkill, getSkills, getAllTools, getSystemPrompt, research default, POST)
   - 1 build check (npm run build succeeds)

### 2. Chat UI Empty State

1. Navigate to `http://localhost:3000/agent`
2. **Expected:**
   - NavBar at top with DRIP logo + "AGENT" label, "Chat" and "Feed" links
   - "DRIP Agent" heading with subtitle about intelligence and research
   - Three suggestion buttons ("Research a company", "Look up a person", "What can you do?")
   - Input bar at bottom with "Ask DRIP anything..." placeholder and send button
   - Dark-theme styling with aqua-glow accents consistent with drip.surf

### 3. Chat Message Submission (UI Flow)

1. Navigate to `http://localhost:3000/agent`
2. Type "Hello" in the input bar
3. Click send button (or press Enter)
4. **Expected:**
   - User message appears right-aligned in a dark-surface bubble
   - "Thinking..." indicator appears with pulsing animation
   - Stop button appears during generation
   - Input bar clears after submission
   - If OPENROUTER_API_KEY is not set: error state returns, UI recovers to ready state (not stuck)

### 4. Suggestion Button Interaction

1. Navigate to `http://localhost:3000/agent`
2. Click the "What can you do?" suggestion button
3. **Expected:** The suggestion text is sent as a message — user bubble appears, thinking indicator shows

### 5. Streaming Response with Tool Calls (Live — requires API keys)

1. Set `OPENROUTER_API_KEY` in `.env.local`, restart dev server
2. Navigate to `http://localhost:3000/agent`
3. Type "Research Anthropic" and submit
4. **Expected:**
   - User message appears right-aligned
   - "Thinking..." indicator shows
   - Tool-call indicator appears: shows "company-lookup" with pulsing dot
   - Tool-call indicator transitions to ✓ when complete
   - Assistant response streams in with structured company data from StableEnrich
   - Server console shows `[agent-chat]` logs: request count, tool call name, tool result
   - Server console shows `[research] company-lookup: anthropic.com` (or similar domain)
5. If x402 payment fails (wallet unfunded): tool result returns error object, agent responds acknowledging the issue

### 6. Person Enrichment Tool Call (Live — requires API keys + funded wallet)

1. With API keys set and wallet funded
2. Type "Look up the CEO of Anthropic" and submit
3. **Expected:**
   - Agent invokes person-enrich tool (visible in tool-call indicator)
   - Streaming response includes person data from StableEnrich
   - Server console shows `[research] person-enrich: {identifier}`

### 7. Agent NavBar Navigation

1. Navigate to `http://localhost:3000/agent`
2. Click "Feed" link in NavBar
3. **Expected:** Navigates to `/agent/feed` (will 404 until S02 — this is expected)
4. Click "Chat" link in NavBar
5. **Expected:** Returns to `/agent` chat page
6. Click DRIP logo
7. **Expected:** Navigates to root `/` (landing page)

### 8. Skill Registry Diagnostics

1. Start dev server with `npm run dev`
2. Open `http://localhost:3000/agent` to trigger server-side module loading
3. Check server console output
4. **Expected:** Line containing `[skill-registry] Registered skill: Company & People Research (research) — 2 tool(s)`

### 9. Build Verification

1. Run `npm run build`
2. **Expected:**
   - Zero errors, zero warnings (logo aspect ratio warning acceptable — pre-existing from M001)
   - Route table shows `/agent` as static and `/api/agent/chat` as dynamic
   - No `server-only` module leaked into client bundle (would cause build error)

## Edge Cases

### Missing OPENROUTER_API_KEY

1. Ensure `OPENROUTER_API_KEY` is NOT set in environment
2. Submit a message in the chat
3. **Expected:** Server returns 500, server console shows `[agent-chat] OPENROUTER_API_KEY is not set`. Chat UI shows error state and recovers (not stuck in loading).

### Missing X402_PRIVATE_KEY

1. Set `OPENROUTER_API_KEY` but NOT `X402_PRIVATE_KEY`
2. Submit "Research Anthropic"
3. **Expected:** LLM receives tool definitions but when tool executes, x402 client throws `[x402-client] X402_PRIVATE_KEY env var is required`. Tool returns error object to LLM, which should relay the issue in its response.

### Rapid Message Submission

1. Type and submit a message
2. While response is streaming, type and submit another message
3. **Expected:** No crash. Second message may queue or be sent after first completes. UI should not break.

### Stop Button During Streaming

1. Submit a message that triggers a response
2. While "Thinking..." or streaming is active, click the Stop button
3. **Expected:** Streaming stops. UI returns to ready state. Input bar is usable again.

### Empty Message Submission

1. Click send button without typing anything
2. **Expected:** Nothing happens — empty messages should not be sent.

## Failure Signals

- `scripts/verify-m002-s01.sh` exits non-zero → contract regression
- `npm run build` fails → type error or server-only leak
- `/agent` page shows blank/error → layout or page component broken
- Server console shows no `[skill-registry]` line → skill not auto-registering
- Tool-call indicator never appears during research query → tool definitions not reaching LLM
- Chat stuck in "Thinking..." indefinitely → streaming response not terminating (check stepCountIs limit)

## Requirements Proved By This UAT

- **R005** (Agent Chat Interface) — Test cases 2-6 prove the chat UI renders, accepts input, streams responses with tool indicators, and maintains dark-theme design
- **R007** (x402 Integration) — Test cases 5-6 prove the x402 payment flow works server-side with StableEnrich (requires funded wallet)
- **R008** (People & Company Research Skill) — Test cases 5-6 prove company-lookup and person-enrich tools return real data
- **R009** (Modular Skill Architecture) — Test case 8 proves the registry pattern works; full modularity proof deferred to S03 (stub skill without core changes)

## Not Proven By This UAT

- **Live x402 payment with real USDC** — Requires funded wallet, which is an operational prerequisite not a code issue
- **Subdomain routing (agent.drip.surf)** — Requires DNS/hosts config or Vercel preview. The proxy.ts logic is contract-tested but not end-to-end tested here
- **In-character error messages** — S01 returns raw error states; S03 adds the "Lost signal" messaging
- **Wallet balance display** — Deferred to S03
- **Modular skill proof (zero-core-change)** — Deferred to S03 (stub skill registration)
- **Agent voice consistency** — Requires human judgment on multiple response samples with live API

## Notes for Tester

- The Feed link in the NavBar will 404 — this is expected until S02 ships.
- Live integration tests (5, 6) require real API keys and a funded x402 wallet. Contract tests (1, 2, 3, 4, 7, 8, 9) work without any API keys.
- The agent voice ("cool & mysterious") is baked into the system prompt in the chat route. Judge whether responses feel consistent with the DRIP brand — not robotic, not hype-y, ocean mist energy.
- Logo image aspect ratio warning in build output is a pre-existing M001 issue, not introduced by S01.
- If OpenRouter returns rate limit errors, wait and retry — this is not an S01 bug.
