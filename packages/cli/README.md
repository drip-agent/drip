# drip-agent

Autonomous research intelligence from the command line. Company lookups, people enrichment, and web research — powered by [AgentCash](https://agentcash.dev) micropayments.

## Quick Start

```bash
# Set up wallet (one-time)
npx drip-agent setup

# Research a company
npx drip-agent research anthropic.com

# Enrich a person
npx drip-agent enrich john@company.com

# Check balance
npx drip-agent balance
```

## Install

```bash
# Use directly with npx (no install needed)
npx drip-agent research coinbase.com

# Or install globally
npm install -g drip-agent
drip-agent research stripe.com
```

## Commands

### `research <query>`

Look up company intelligence by domain or name.

```bash
drip-agent research anthropic.com
drip-agent research "Coinbase"        # auto-resolves to coinbase.com
drip-agent research stripe.com -f json  # JSON output
```

Returns: name, industry, funding, headcount, HQ, tech stack, key links.

**Cost:** ~$0.05 per lookup

### `enrich <email|linkedin>`

Enrich a person's profile by email or LinkedIn URL.

```bash
drip-agent enrich john@company.com
drip-agent enrich https://linkedin.com/in/johndoe
drip-agent enrich jane@startup.io -f json
```

Returns: name, title, company, location, contact info, employment history.

**Cost:** ~$0.05 per lookup

### `setup [invite-code]`

Set up your AgentCash wallet for paid API access.

```bash
drip-agent setup                    # basic setup
drip-agent setup AC-XXXX-XXXX      # with invite code for free credits
```

### `balance`

Check your AgentCash wallet balance and deposit link.

```bash
drip-agent balance
```

## How It Works

1. You run a command
2. DRIP calls [StableEnrich](https://stableenrich.dev) via [AgentCash](https://agentcash.dev)
3. Payment is automatic — USDC micropayment on Solana
4. Results appear in your terminal

No API keys. No subscriptions. Pay per query.

## Pricing

| Command | Cost |
|---------|------|
| `research` | ~$0.05 |
| `enrich` | ~$0.05 |

Payments settle on success only — failed requests don't cost anything.

## Programmatic Usage

```js
import { companyResearch, personEnrich } from "drip-agent";

const company = await companyResearch("anthropic.com");
const person = await personEnrich({ email: "john@company.com" });
```

Requires AgentCash wallet set up locally (`npx drip-agent setup`).

## Links

- **Website:** [drip.surf](https://drip.surf)
- **Agent:** [agent.drip.surf](https://agent.drip.surf)
- **Token:** $DRIP on PumpFun

---

Built by DRIP × AgentCash
