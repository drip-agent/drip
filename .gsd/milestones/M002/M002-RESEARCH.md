# M002: Agent Platform — Research

**Date:** 2026-03-15

## Summary

M002's core challenge is bridging AgentCash's x402 protocol — designed for CLI/MCP agents — into a web application backend. The good news: the x402 ecosystem has mature TypeScript packages (`@x402/fetch`, `@x402/evm`, `viem`) that handle the entire 402→sign→retry flow by wrapping `fetch`. The backend integration is straightforward: a Next.js API route creates a payment-wrapped fetch using the wallet's private key (via `X402_PRIVATE_KEY` env var), calls StableEnrich endpoints, and returns clean data to the frontend. No custom payment logic needed.

The Vercel AI SDK (`ai` + `@ai-sdk/react`) is the clear choice for LLM orchestration. Its `streamText` function with `tool()` definitions maps perfectly to the skill architecture: each skill registers tools that the LLM can call, and the `useChat` hook on the frontend handles streaming. The agent's "cool & mysterious" voice lives in the system prompt. StableEnrich calls become AI SDK tools executed server-side, with x402 payment happening transparently inside each tool's `execute` function.

The primary architectural risk is the discovery feed. Vercel Cron (max 2 jobs on Hobby, once/day each) can trigger autonomous agent runs, but results need persistence. There's no database in the current stack. Vercel KV (Upstash Redis) is the lightest sufficient option — key-value storage for feed entries, no schema migrations, generous free tier. The subdomain routing (agent.drip.surf vs drip.surf) is solved with Next.js middleware rewriting requests to `/agent/*` routes. Single codebase, single deployment.

## Recommendation

Use the Vercel AI SDK + x402 TypeScript SDK approach. Build a `lib/x402-client.ts` that creates a payment-wrapped fetch, then expose StableEnrich operations as AI SDK `tool()` functions. Each skill is a module that exports tools + prompt fragments. The LLM orchestrates tool selection; x402 handles payment. Add Vercel KV for feed persistence. Use Next.js middleware for subdomain routing within the same project.

Choose **Claude** (Anthropic) as the LLM — better at maintaining consistent voice/personality across conversations, which matters for the "cool & mysterious" agent character. The `@ai-sdk/anthropic` provider works identically to OpenAI with `streamText`.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| x402 payment flow (402→sign→retry) | `@x402/fetch` + `@x402/evm` | Handles EIP-712 signing, payment header encoding, retry logic. Battle-tested, maintained by Coinbase ecosystem |
| LLM streaming + tool calling | Vercel AI SDK (`ai`, `@ai-sdk/react`) | `streamText` + `useChat` + `tool()` — purpose-built for exactly this. 11K+ skill installs. Handles stream protocol, message conversion, multi-step tool calls |
| Wallet key management | `viem` `privateKeyToAccount` | Industry standard Ethereum account abstraction. Used by x402 SDK internally |
| Chat UI streaming state | `useChat` hook from `@ai-sdk/react` | Manages messages, streaming status, input state, error handling. Don't rebuild this |
| Cron scheduling on Vercel | `vercel.json` `crons` config | Native Vercel feature. API route + cron expression. `CRON_SECRET` auth built-in |
| KV storage for feed | Vercel KV (Upstash Redis) | Zero-config with Vercel, generous free tier, simple `get`/`set`/`list` API |
| Subdomain routing | Next.js middleware + `NextResponse.rewrite` | Standard pattern. Rewrites `agent.drip.surf/*` to `/agent/*` routes |

## Existing Code and Patterns

- `app/globals.css` — All design tokens live here via `@theme`. M002 agent UI must use the same tokens (colors, shadows, radii, fonts). No new theme file needed.
- `components/ui/` — 6 CVA components (Button, Input, Card, Badge, GlassPanel, GlowBorder). Reuse directly for agent UI. Card for feed items, GlassPanel for chat container, Input for chat input, Button for send.
- `components/animation/` — 5 animation components. Reuse ScrollReveal, FadeInStagger for feed. ParticleField likely too heavy for agent page (performance budget).
- `components/layout/` — NavBar, Footer, Container, Section. NavBar needs agent-aware variant (different links for agent subdomain). Container/Section reuse directly.
- `lib/utils.ts` — `cn()` utility and `VariantProps` re-export. Standard pattern, use everywhere.
- `lib/motion-variants.ts` — Existing animation variants. Reuse for agent page transitions.
- `app/layout.tsx` — Root layout with fonts and PageTransition. Agent layout may need its own layout with different NavBar but same fonts/theme.
- `app/page.tsx` — Data-driven pattern (const arrays → .map()). Follow same convention for feed items.

## Constraints

- **No middleware.ts exists yet** — must create one for subdomain routing. Matcher must exclude `/_next`, `/api`, static files.
- **No vercel.json exists** — must create for cron configuration. Also needed for subdomain domain setup.
- **Next.js 16.1.6** — relatively new. Verify AI SDK compatibility (should be fine, same App Router API surface).
- **Turbopack** — dev server uses Turbopack. Server-only modules (viem, x402) must not leak to client bundles. Use `'use server'` and `server-only` package guard.
- **Wallet private key must never reach the client** — all x402 calls happen in API routes. `X402_PRIVATE_KEY` env var, not prefixed with `NEXT_PUBLIC_`.
- **LLM API key server-side only** — `ANTHROPIC_API_KEY` env var, same constraint.
- **Vercel Hobby plan** — 2 cron jobs max, once/day minimum interval. Sufficient for daily autonomous feed generation (1 cron for feed gen is enough).
- **Serverless function timeout** — Vercel Hobby: 10s default, configurable up to 60s with `maxDuration`. Agent responses with tool calls may need the full 60s. Pro plan allows 300s.
- **Vercel KV free tier** — 256MB storage, 30K commands/day. More than enough for a discovery feed.
- **No user auth (deferred R016)** — agent is public. No per-user state. Chat is session-only (no persistence).

## Common Pitfalls

- **x402 signing in client-side code** — The private key must never leave the server. All x402 calls must be in API routes or server actions. The `@x402/fetch` wrapper must only be instantiated server-side.
- **Streaming timeout on complex tool calls** — Agent calls StableEnrich (x402 payment + API call) inside a streaming response. If StableEnrich is slow or the 402→sign→retry takes >10s, the stream may timeout. Set `maxDuration = 60` on the chat API route. Consider showing intermediate "researching..." status in the stream.
- **Tool call loops** — AI SDK's `stopWhen: stepCountIs(N)` prevents infinite tool-calling loops. Set a reasonable cap (5 steps). Without this, the LLM can loop calling tools forever.
- **Subdomain middleware breaking API routes** — Middleware matcher must explicitly exclude `/api/*` paths. If it rewrites API calls, the backend breaks.
- **Client/server module leakage** — `viem` and `@x402/evm` are heavy packages with Node.js dependencies. If accidentally imported in client components, the build will fail or bundle will bloat. Use a `lib/x402-client.ts` with `import 'server-only'` guard.
- **Feed data loss on redeploy** — Vercel's filesystem is ephemeral. Any JSON files written during a cron run vanish on next deploy. Must use external storage (Vercel KV) from day one.
- **CRON_SECRET not set** — Without this env var, anyone can trigger the cron endpoint. Set it in Vercel environment variables and validate in the API route.
- **Rate limiting StableEnrich** — Apollo people-search returns obfuscated names. Must follow up with people-enrich for each person. Batch carefully to avoid excessive x402 charges in a single agent run.

## Open Risks

- **x402 SDK edge runtime compatibility** — The `@x402/fetch` and `viem` packages use Node.js APIs. If any route needs Edge Runtime, these won't work. Stick with Node.js runtime for all API routes.
- **AgentCash wallet funding in production** — The wallet needs USDC on Base. If the balance runs out, all agent functionality stops. Need a balance check + warning surface. No automated refill mechanism exists.
- **Vercel Hobby function timeout** — Complex research queries (multiple StableEnrich calls in one agent turn) may exceed 60s. May need Vercel Pro for 300s timeout, or break long research into multiple chat turns.
- **StableEnrich response schema stability** — StableEnrich is relatively new. Response schemas could change. Defensive parsing with fallbacks is important.
- **Claude model availability/pricing** — Using Claude via Anthropic API. Need to handle rate limits and potential outages gracefully with user-facing error messages.
- **Discovery feed content quality** — Autonomous agent runs without user guidance may produce low-quality or repetitive content. Need good seed topics and result deduplication.

## Requirement Analysis

### Table Stakes (must have, correctly scoped)
- **R005 (Chat Interface)** — Core product. Well-scoped. Streaming is correctly called out.
- **R007 (AgentCash Integration)** — Correctly identified as the backbone. x402 SDK makes this manageable.
- **R008 (People & Company Research)** — Good first skill. StableEnrich API is well-documented with 30 routes.

### Reasonable but Watch Closely
- **R006 (Discovery Feed)** — Requires persistence (not addressed in requirements) and autonomous scheduling. Vercel Hobby plan limits cron to once/day. Feed quality depends on unsupervised agent runs. Consider making this a stretch goal within M002 rather than a hard requirement.
- **R009 (Modular Skill Architecture)** — Good goal but risks over-engineering for a single skill. Suggest proving it with a minimal interface (skill = { tools, systemPromptFragment, formatResponse }) and validating by adding a stub second skill, not a full plugin system.

### Candidate Requirements (not in current spec, should surface)
- **[CANDIDATE] Wallet Balance Visibility** — The context mentions "wallet balance visible" under Operational Complete but there's no requirement for it. Should be a small UI element showing remaining USDC. Critical for operational awareness.
- **[CANDIDATE] Error State UI** — No requirement covers what happens when: wallet is empty, StableEnrich is down, LLM rate-limited, or network fails. Agent should communicate failures in-character ("Lost signal. Try again.") rather than showing raw errors.
- **[CANDIDATE] Chat Input Validation** — No mention of input length limits, injection prevention, or empty message handling. Basic but necessary.
- **[CANDIDATE] Agent Response Formatting** — Requirements say "structured results" but don't specify format. StableEnrich returns JSON with company data, employee lists, LinkedIn URLs. Need markdown/card rendering in chat, not raw JSON dumps.

### Not Missing (correctly deferred)
- Auth (R016), persistence (R018), social scraping (R014), image gen (R015) — all correctly deferred.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| AgentCash | `merit-systems/agentcash-skills@agentcash-wallet` (21 installs) | available — CLI/MCP focused, may have useful wallet utils |
| AgentCash | `merit-systems/agentcash-skills@agentcash` (6 installs) | available — general AgentCash skill |
| x402 Protocol | `coinbase/agentic-wallet-skills@x402` (1.5K installs) | available — high install count, likely useful for x402 integration patterns |
| Vercel AI SDK | `vercel/ai@ai-sdk` (11.1K installs) | available — official Vercel skill, very high installs |
| Next.js Streaming | `erichowens/some_claude_skills@llm-streaming-response-handler` (36 installs) | available — low installs, probably not needed with AI SDK |
| Next.js Patterns | `wshobson/agents@nextjs-app-router-patterns` (8.4K installs) | available — high installs, useful for App Router patterns |
| Frontend Design | `frontend-design` | installed — for agent UI implementation |

**Recommended installs** (user decides):
- `npx skills add vercel/ai@ai-sdk` — Official AI SDK skill, 11.1K installs. Most relevant for streaming chat implementation.
- `npx skills add coinbase/agentic-wallet-skills@x402` — Official x402 skill, 1.5K installs. Patterns for payment integration.

## Architecture Decisions to Make During Planning

1. **Subdomain strategy**: Single codebase with middleware rewriting (recommended) vs. separate Vercel project
2. **LLM choice**: Claude (recommended for voice consistency) vs. GPT-4o (more mature tool calling)
3. **Feed storage**: Vercel KV (recommended, simplest) vs. Vercel Blob (cheaper for large objects) vs. Vercel Postgres (overkill)
4. **AgentCash integration mode**: Direct x402 HTTP via `@x402/fetch` SDK (recommended for web backend) vs. AgentCash MCP mode (designed for CLI agents, not web backends)
5. **Session memory**: In-memory per API request (simplest, no persistence) vs. short-lived KV cache (survives page reload within session)

## Sources

- x402 protocol architecture and TypeScript SDK usage (source: [coinbase/x402 GitHub](https://github.com/coinbase/x402), [@x402/fetch npm](https://www.npmjs.com/package/@x402/fetch))
- StableEnrich complete API reference with 30 routes, pricing, and schemas (source: [stableenrich.dev/llms.txt](https://stableenrich.dev/llms.txt))
- AgentCash wallet management and x402 payment flow (source: [agentcash.dev/docs](https://agentcash.dev/docs))
- Vercel AI SDK streaming chat with tool calling (source: [Context7 /vercel/ai](https://github.com/vercel/ai) — `streamText`, `useChat`, `tool()` patterns)
- Vercel Cron jobs configuration and security (source: [Vercel docs](https://vercel.com/docs/cron-jobs), community examples)
- Next.js middleware subdomain routing (source: [Vercel Platforms Starter Kit](https://vercel.com/templates/next.js/platforms-starter-kit), community patterns)
- x402 Foundation and ecosystem status — Coinbase + Cloudflare co-founded, V2 released Dec 2025, 100M+ transactions (source: [Cloudflare blog](https://blog.cloudflare.com/x402/), [simplescraper guide](https://simplescraper.io/blog/x402-payment-protocol))
- Messari x402 integration showing TypeScript pattern with `wrapFetchWithPaymentFromConfig` (source: [messari.io/report/x402](https://messari.io/report/x402-how-messari-is-opening-its-data-layer-to-autonomous-agents))
