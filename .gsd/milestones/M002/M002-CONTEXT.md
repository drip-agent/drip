# M002: Agent Platform — Context

**Gathered:** 2026-03-15
**Status:** Pending (M001 must complete first)

## Project Description

M002 builds the actual AI agent web application at agent.drip.surf. Users interact with DRIP through a chat interface (type prompts → agent researches via AgentCash APIs → formatted responses) and browse a public discovery feed (autonomous agent findings). The first agent skill is people & company research via StableEnrich. Architecture is modular — new skills plug in without modifying core agent logic.

## Why This Milestone

M001 gives DRIP a face. M002 gives it a brain. The agent is the product — without it, DRIP is a pretty landing page with no utility. This milestone proves the core loop: user asks → agent uses paid APIs → user gets valuable results. It also establishes the modular skill architecture that makes DRIP a living, growing platform.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit agent.drip.surf and chat with the DRIP agent
- Ask the agent to research a person or company and get enriched results (LinkedIn data, company info, contacts)
- Browse a public feed of autonomous agent discoveries without prompting
- See the same futuristic design language from drip.surf carried through the agent UI

### Entry point / environment

- Entry point: https://agent.drip.surf (browser)
- Environment: Production deployment (Vercel)
- Live dependencies involved: AgentCash x402 API (USDC micropayments), LLM API (Claude or GPT), StableEnrich API

## Completion Class

- Contract complete means: Chat sends prompts and receives agent responses, feed displays entries, skills are registered and callable
- Integration complete means: AgentCash x402 payment flow works end-to-end, StableEnrich returns real enrichment data, LLM generates coherent agent responses
- Operational complete means: Agent handles errors gracefully, rate limits respected, wallet balance visible

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A user visits agent.drip.surf, types "research Anthropic", and receives a structured company profile with real data from StableEnrich
- The discovery feed shows at least 3 autonomous agent entries that were generated without user interaction
- Adding a new skill (e.g., social scraping stub) requires only creating a skill file and registering it — no core agent modifications

## Risks and Unknowns

- AgentCash is designed for CLI/MCP, not web apps — building a backend bridge for x402 is uncharted territory
- LLM orchestration with tool calling (AgentCash as a tool) needs careful prompt engineering for the "cool & mysterious" voice
- Autonomous feed requires a scheduler/cron that runs reliably in serverless (Vercel) — may need an external scheduler
- AgentCash wallet management on a server vs. local dev machine — security and deployment considerations

## Relevant Requirements

- R005 — Agent Chat Interface
- R006 — Agent Discovery Feed
- R007 — AgentCash Backend Integration (x402)
- R008 — People & Company Research Skill
- R009 — Modular Skill Architecture

## Scope

### In Scope

- Agent chat UI with streaming responses
- Public discovery feed with autonomous entries
- AgentCash x402 backend integration
- People & company research skill (StableEnrich)
- Modular skill registration system
- "Cool & mysterious" agent personality via system prompts
- Design consistency with M001 design system

### Out of Scope / Non-Goals

- User authentication (deferred R016)
- Conversation persistence (deferred R018)
- Social scraping skill (deferred R014)
- Image generation skill (deferred R015)
- Token integration (M003)

## Technical Constraints

- Must reuse M001 design system and animation components — visual consistency is non-negotiable
- AgentCash wallet private key must never be exposed to frontend
- LLM API key must be server-side only
- Agent responses should stream (SSE or similar) for real-time feel

## Integration Points

- AgentCash (agentcash.dev) — x402 payment protocol, wallet at ~/.agentcash/wallet.json
- StableEnrich (stableenrich.dev) — 30 routes for people/company enrichment
- LLM API — Claude (Anthropic) or GPT (OpenAI) for agent reasoning
- M001 design system — components, theme, animations carried forward

## Open Questions

- Which LLM to use for agent brain — Claude vs. GPT (decide during M002 planning)
- Whether to use AgentCash MCP mode or direct x402 HTTP calls from the backend
- How to schedule autonomous feed generation in Vercel's serverless environment (cron jobs, Vercel Cron, external trigger)
- Whether the agent needs a simple memory/context window between messages in the same session (without full persistence)
