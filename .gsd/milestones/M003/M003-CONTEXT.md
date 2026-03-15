# M003: Token & Launch — Context

**Gathered:** 2026-03-15
**Status:** Pending (M001 and M002 must complete first)

## Project Description

M003 launches the $DRIP token on PumpFun and integrates the Tokenized Agents revenue loop. The agent (built in M002) generates revenue from its services, and a percentage automatically buys back and burns $DRIP tokens on-chain. This milestone also includes the launch strategy and assets for the X/Twitter build-in-public campaign.

## Why This Milestone

The token is the community alignment mechanism. Without it, DRIP is a cool agent with no economic flywheel. Tokenized Agents (launched by PumpFun on March 13, 2026) creates the value loop: agent productivity → revenue → buyback → burn → token appreciation → more attention → more users → more revenue. This is what makes DRIP a midterm play, not a one-time launch.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Find $DRIP on PumpFun and trade it
- See transparent revenue-to-buyback metrics — how much the agent earned, how much was used for buybacks
- Watch the token supply decrease as burns happen
- Visit drip.surf and see token information and links

### Entry point / environment

- Entry point: PumpFun token page, drip.surf token section
- Environment: Solana mainnet
- Live dependencies involved: PumpFun, PumpSwap, Solana blockchain, AgentCash revenue stream

## Completion Class

- Contract complete means: Token exists on PumpFun, Tokenized Agents is activated, buyback percentage is set
- Integration complete means: Agent revenue actually triggers buyback and burn transactions on-chain
- Operational complete means: Revenue tracking is transparent, buyback events are verifiable on-chain

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- $DRIP token is live on PumpFun with correct branding (name, ticker, image, description)
- Tokenized Agents is activated with a buyback percentage configured
- At least one buyback event has occurred from actual agent revenue
- drip.surf displays token information and links to PumpFun

## Risks and Unknowns

- PumpFun Tokenized Agents feature is 2 days old (March 13, 2026) — documentation is sparse, behavior may change
- Revenue model for the agent needs to be defined — what services generate revenue, how is it collected?
- Buyback authority is centralized (per PumpFun docs) — only SOL and USDC revenue eligible, $10 minimum threshold
- Legal considerations around token launches — PumpFun faces active lawsuits in the US, banned by UK FCA
- Token bonding curve mechanics — graduating to PumpSwap at $69K market cap requires enough buy pressure

## Relevant Requirements

- R010 — PumpFun Token Launch ($DRIP)
- R011 — Tokenized Agents Revenue Loop

## Scope

### In Scope

- $DRIP token creation on PumpFun
- Token branding assets (image, description)
- Tokenized Agents activation and configuration
- Revenue routing from agent services to buyback
- Token information section on drip.surf
- Launch announcement assets for X

### Out of Scope / Non-Goals

- Centralized exchange listings
- Token staking or governance mechanisms
- Liquidity provision beyond PumpFun mechanics
- Paid marketing or influencer campaigns

## Technical Constraints

- Requires funded Solana wallet for token creation
- PumpFun Tokenized Agents: only SOL and USDC revenue, $10 minimum threshold for buyback trigger
- Buybacks executed by centralized buyback authority and instantly burned
- Token creator can adjust buyback percentage at any time
- Multiple agents can contribute revenue to the same token

## Integration Points

- PumpFun — token creation and Tokenized Agents configuration
- PumpSwap — post-graduation trading
- Solana blockchain — on-chain token, transactions, burns
- Agent backend (M002) — revenue source
- drip.surf (M001) — token information display

## Open Questions

- Revenue model: flat fee per query? subscription? pay-per-use matching AgentCash pricing? Decide during M003 planning
- Buyback percentage: what portion of revenue goes to buyback vs. operational costs? Decide during M003 planning
- Whether to do a "soft launch" (token first, Tokenized Agents later) or launch everything together
- Legal review needs — jurisdiction considerations for token launch
