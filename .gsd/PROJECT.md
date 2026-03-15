# Project

## What This Is

DRIP ($DRIP) — a web-based AI agent platform at drip.surf that uses AgentCash (agentcash.dev) as its API backbone to provide people/company research, social intelligence, and content generation. The agent has a futuristic, heavily animated dark-theme UI built on an aqua-to-slate ocean color palette. Token launched on PumpFun (Solana) with Tokenized Agents revenue-to-buyback loop. Growth via build-in-public documentation on X/Twitter.

## Core Value

A modular AI agent that does productive work via paid APIs, generates revenue, and channels it back to token holders through automated buybacks — making $DRIP one of the few PumpFun tokens backed by real agent productivity.

## Current State

All three milestones code-complete. M001 (Brand & Landing Page) — 5 slices, brand system + animated landing page + social assets. M002 (Agent Platform) — 3 slices, streaming chat + discovery feed + research skill (69/69 checks). M003 (Token & Launch) — 2 slices, payment-gated agent chat via PumpFun SDK + token display on landing page (58/58 checks).

Remaining: operational steps only — PumpFun $DRIP token creation (manual), Tokenized Agents activation (manual), Solana/EVM wallet funding, Vercel deployment with KV provisioning, DNS configuration for drip.surf and agent.drip.surf.

## Architecture / Key Patterns

Current stack:
- **Frontend:** Next.js 16.1.6 (App Router), Tailwind v4 (CSS-first @theme), TypeScript
- **Fonts:** Space Grotesk (headings), Inter (body), JetBrains Mono (code) via next/font/google
- **Design tokens:** 8 colors, 3 glow shadows, spacing/radii — all in app/globals.css via @theme
- **Build:** Turbopack, ~1.4s builds
- **Animation:** GSAP (scroll-driven, particles, complex timelines), Motion (React UI transitions, layout animations). Components in components/animation/. PageTransition wired in app/layout.tsx.
- **Design:** Dark theme, aqua glow accents, glassmorphism, futuristic aesthetic
- **Component structure:** ui/ (primitives), layout/ (structure), animation/ (motion components), solana/ (wallet integration)
- **Social images:** ImageResponse routes with shared font utility (lib/og-fonts.ts)
- **Agent Backend (M002):** Next.js API routes → AgentCash x402 integration → LLM orchestration (OpenRouter + Claude Sonnet 4)
- **Agent Chat:** Streaming via AI SDK streamText + useChat, 5-step tool calling limit, payment-gated via x-payment-invoice header
- **Discovery Feed:** Vercel KV (sorted set + individual keys) → cron endpoint with generateText (3-step limit) → server component feed page
- **Payment (M003/S01):** PumpFun SDK (`@pump-fun/agent-payments-sdk@3.0.0`) → server builds invoice → client signs with Phantom/Solflare → server verifies on-chain → KV revenue tracking
- **Token Display (M003/S02):** Landing page Token section with revenue stats from /api/agent/revenue, PumpFun link, contract address with copy-to-clipboard, buyback explainer

Domain: drip.surf (agent subdomain: agent.drip.surf)

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] M001: Brand & Landing Page — Brand identity system, futuristic animated landing page, design system, animation engine, social assets. Code-complete.
- [x] M002: Agent Platform — AI agent at agent.drip.surf (chat + feed), AgentCash integration, people research skill, modular architecture. Code-complete (69/69 contract checks).
- [x] M003: Token & Launch — $DRIP payment infrastructure on Solana via PumpFun SDK, payment-gated agent chat, revenue tracking, token display on landing page. Code-complete (58/58 contract checks). Operational steps remaining: token creation on PumpFun, Tokenized Agents activation, deployment.

## Deployment Checklist

1. Vercel project creation + KV provisioning
2. Environment variables: `SOLANA_RPC_URL`, `NEXT_PUBLIC_SOLANA_RPC_URL`, `NEXT_PUBLIC_DRIP_TOKEN_MINT`, `OPENROUTER_API_KEY`, EVM wallet key for AgentCash
3. DNS: drip.surf → Vercel, agent.drip.surf → same project (proxy.ts handles routing)
4. Create $DRIP token on PumpFun using brand assets (name, ticker, image, description)
5. Set `NEXT_PUBLIC_DRIP_TOKEN_MINT` to the created mint address
6. Activate Tokenized Agents on PumpFun dashboard, set buyback percentage
7. Fund agent's EVM wallet for AgentCash API calls (x402 USDC payments)
