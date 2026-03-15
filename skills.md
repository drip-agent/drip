---
name: drip-agent
description: >-
  DRIP is an autonomous research intelligence agent on Solana.
  It provides company research and people enrichment via CLI (npx drip-agent)
  and web interface (drip.surf/agent). Each query costs ~$0.05 USDC paid via
  AgentCash micropayments. Revenue is used for automated $DRIP token buyback
  and burn on pump.fun.
metadata:
  author: drip-agent
  version: "0.1.0"
  website: https://drip.surf
  twitter: https://x.com/drip_agents
  token: DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump
---

# DRIP Agent

Autonomous research intelligence that pays for itself on Solana.

## What It Does

DRIP provides two core capabilities:

1. **Company Research** — Look up any company by domain. Returns industry, funding, employee count, tech stack, and more.
2. **People Enrichment** — Look up any person by email or LinkedIn URL. Returns name, title, company, location, and work history.

## How It Works

- User submits a research query
- Agent routes to AI model (Claude Sonnet 4 via OpenRouter)
- Agent calls data provider (StableEnrich) via AgentCash micropayment
- Payment settles on Solana in USDC (~$0.05 per query)
- Results stream back to user

## Access

- **Web**: https://drip.surf/agent
- **CLI**: `npx drip-agent research <domain>` or `npx drip-agent enrich <email>`
- **Docs**: https://drip.surf/docs

## Revenue Model

- Each query generates ~$0.05 USDC revenue
- 20% of revenue → automated $DRIP buyback & burn
- 80% of revenue → creator (development, infrastructure)
- Buybacks are executed automatically via pump.fun Tokenized Agent Authority

## Tech Stack

- Next.js 16 (App Router)
- AI SDK v6 (tool calling, streaming)
- OpenRouter → Claude Sonnet 4
- Solana wallet adapter (Phantom, Solflare)
- AgentCash micropayments (USDC on Solana)
- @pump-fun/agent-payments-sdk 3.0.2
- TypeScript end-to-end
