# Requirements

This file is the explicit capability and coverage contract for the DRIP project.

## Active

### R005 — Agent Chat Interface
- Class: primary-user-loop
- Status: active
- Description: Chat UI at agent.drip.surf where users type prompts and the DRIP agent responds using AgentCash-powered APIs. Real-time streaming responses. Futuristic design language consistent with landing page.
- Why it matters: This is the product. Without the chat, DRIP is just a landing page.
- Source: user
- Primary owning slice: M002/S01
- Supporting slices: M002/S03
- Validation: M002/S01 — Streaming chat UI at /agent with useChat hook, tool-call indicators, dark-theme styling. 25/25 contract checks pass. Live integration pending API keys.
- Notes: Must maintain the same futuristic animated aesthetic as the landing page.

### R006 — Agent Discovery Feed
- Class: primary-user-loop
- Status: active
- Description: Public feed on agent.drip.surf showing autonomous agent discoveries — research results, trend findings, enrichment data. Runs independently of user interaction.
- Why it matters: Gives passive value. People visit and see what DRIP found without needing to prompt it. Creates a reason to return.
- Source: user
- Primary owning slice: M002/S02
- Supporting slices: none
- Validation: M002/S02 — FeedEntry KV persistence layer (saveFeedEntry/getFeedEntries with sorted set), authenticated cron endpoint with generateText agent (stepCountIs(3), 25 seed topics), feed page server component with Card grid and graceful empty state. 23/23 contract checks pass. Full pipeline proof pending Vercel KV credentials and deployment.
- Notes: Requires a backend scheduler/cron that runs the agent autonomously.

### R007 — AgentCash Backend Integration (x402)
- Class: integration
- Status: active
- Description: Server-side integration with AgentCash's x402 protocol. Backend API routes make HTTP requests to AgentCash-powered endpoints, handle 402 payment flow (request → 402 → sign USDC → retry with proof), and return clean data to the frontend.
- Why it matters: AgentCash is the agent's operational backbone. Without this, the agent can't access any paid APIs.
- Source: user
- Primary owning slice: M002/S01
- Supporting slices: M002/S02, M002/S03
- Validation: M002/S01 — x402 client built with toClientEvmSigner + registerExactEvmScheme, server-only guarded. Wired into research skill tools. Payment flow plumbed end-to-end; live proof pending funded wallet.
- Notes: AgentCash wallet is a local keypair at ~/.agentcash/wallet.json. Needs to be deployed on server with wallet funded. x402 protocol is stateless — no sessions or API keys.

### R008 — People & Company Research Skill
- Class: core-capability
- Status: validated
- Description: First agent skill. Uses AgentCash's StableEnrich API (stableenrich.dev) to research people, companies, LinkedIn profiles, org charts, and contact info. Returns structured, actionable results.
- Why it matters: Day-one demo capability. "Research Anthropic" → instant enriched company profile. Concrete, tangible, impressive.
- Source: user
- Primary owning slice: M002/S03
- Supporting slices: none
- Validation: M002/S01+S03 — company-lookup and person-enrich tools built with Zod schemas, StableEnrich API integration via x402 fetch. Self-registers in skill registry. Wired through streaming chat API with tool-call indicators. 69/69 M002 contract checks pass. Live end-to-end proof pending funded wallet.
- Notes: StableEnrich has 30 routes. Start with company lookup and person enrichment.

### R009 — Modular Skill Architecture
- Class: core-capability
- Status: validated
- Description: Plugin/skill system that allows new agent capabilities to be added over time without modifying core agent logic. Each skill registers its own prompt templates, API calls, and response formatting.
- Why it matters: This is the midterm strategy. DRIP grows by integrating new tech — if adding a skill requires rewriting the agent, growth stalls.
- Source: user
- Primary owning slice: M002/S03
- Supporting slices: none
- Validation: M002/S03 — social-trends stub skill registered alongside research via side-effect import. Zero changes to registry.ts, types.ts, or chat route logic beyond the import line. Both skills register with correct tool counts. Modularity proven.
- Notes: Future skills include social scraping (StableSocial), image gen (StableStudio), email (StableEmail), Solana Agent Kit tools.

### R010 — PumpFun Token Launch ($DRIP)
- Class: launchability
- Status: active
- Description: $DRIP SPL token created and launched on PumpFun. Name, ticker, image (from brand assets), description. Bonding curve mechanics, graduating to PumpSwap at $69K market cap.
- Why it matters: The token is the community alignment mechanism and the financial incentive that drives attention.
- Source: user
- Primary owning slice: M003/S01
- Supporting slices: none
- Validation: M003/S01 — Payment infrastructure built: PumpAgent SDK singleton, invoice creation/verification API routes, revenue KV tracking, payment-gated chat endpoint. 37/37 contract checks pass. Actual SPL token creation on PumpFun is a manual step.
- Notes: Requires funded Solana wallet. Token image should use DRIP brand assets.

### R011 — Tokenized Agents Revenue Loop
- Class: differentiator
- Status: active
- Description: PumpFun's Tokenized Agents feature connects agent revenue to token buybacks. Agent earns revenue (SOL/USDC) from services → percentage auto-buys and burns $DRIP. Revenue threshold: $10 minimum before buyback triggers.
- Why it matters: This is what separates DRIP from pump-and-dump tokens. Real revenue → real buyback → real value alignment. Launched by PumpFun on March 13, 2026.
- Source: research
- Primary owning slice: M003/S02
- Supporting slices: M003/S01
- Validation: M003/S01 — Revenue collection half built: agent earns USDC per query via PumpFun SDK invoices, KV tracks totalEarned and queryCount, GET /api/agent/revenue exposes stats. M003/S02 — Token section on landing page displays revenue stats, buyback explainer with $10 threshold, PumpFun link, contract address (or "Coming soon"). 21/21 contract checks pass. Buyback activation requires manual PumpFun Tokenized Agents toggle.
- Notes: Feature is 2 days old. Documentation is sparse. Existing tokens on bonding curve or PumpSwap can activate. Multiple agents can contribute to same token.

### R013 — X/Twitter Social Assets
- Class: launchability
- Status: validated
- Description: Complete social media kit for X: profile picture, banner, build-in-public post templates, OG image for drip.surf link previews. All using DRIP brand identity.
- Why it matters: X is the growth engine. Professional, consistent assets signal legitimacy and attract followers.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: M001/S01
- Validation: M001/S05 — 4 ImageResponse route handlers generate branded PNGs (profile 800×800, banner 1500×500, template-update 1200×675, template-announcement 1200×675). /social showcase page displays all 5 assets with previews and download links. OG image from S04 confirmed functional. verify-s05.sh 19/19 checks pass. All routes return content-type: image/png.
- Notes: Post templates have placeholder text — user downloads and overlays real content. Templates accommodate build-in-public format.

## Validated

### R001 — Brand Identity System
- Class: core-capability
- Status: validated
- Description: Complete brand guidelines including color palette usage (Icy Aqua #bdfffd, Soft Cyan #9ffff5, Aquamarine #7cffc4, Ocean Mist #6abea7, Blue Slate #5e6973), typography selection, logo concepts, and voice & tone documentation. The voice is "cool & mysterious" — drops value quietly, doesn't try hard, lets quality speak. Ocean mist energy.
- Why it matters: Everything visual and verbal derives from this. Without a locked brand system, every downstream asset is inconsistent.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: none
- Validation: M001/S01 — Brand guidelines page at /brand renders complete palette (8 colors), typography specimens (3 fonts), logo gallery (6 SVGs), and voice reference. docs/brand-guidelines.md provides comprehensive written reference. verify-s01.sh 24/24 checks pass.
- Notes: User provided exact hex values with named colors. Voice explicitly described as cool & mysterious. Preserve "ocean mist energy" framing verbatim.

### R002 — Futuristic Animated Landing Page
- Class: launchability
- Status: validated
- Description: drip.surf loads with a futuristic, heavily animated dark-theme landing page. Hero with particle/ocean effects, features showcase, agent preview teaser, CTA. Must stop the scroll — the design itself is a viral asset.
- Why it matters: First impression and primary discovery surface. People share screenshots on X because the design is stunning, driving organic traffic.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M001/S02, M001/S03
- Validation: M001/S04 — 5-section landing page shipped: ParticleField hero with gradient-text H1, 4-card features with FadeInStagger + GlowHover, 3-step pipeline with ScrollReveal, mock terminal agent preview, CTA section. All S02 UI components and S03 animation components composed. Lighthouse 91. verify-s04.sh 20/20 checks pass. Responsive at 375px/768px/1440px. Awaits human UAT for subjective "futuristic" quality assessment.
- Notes: User emphasized "sangat canggih dan futuristik modern dan juga beranimasi" — very sophisticated, futuristic, modern, animated. This is not a nice-to-have, it's the core brand expression.

### R003 — Dark Theme + Aqua Glow Design Language
- Class: quality-attribute
- Status: validated
- Description: Dark backgrounds with glowing aqua accents, glassmorphism, fluid motion. Consistent across landing page and future agent UI. Not pure black — dark slate/charcoal base with the aqua palette as luminous accents.
- Why it matters: The visual language must feel unified. Dark + aqua glow IS the DRIP aesthetic — every screen must feel like the same product.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S04
- Validation: M001/S02 — 10 components implement dark-surface backgrounds with aqua glow accents. 5 CSS utilities (glass, glass-strong, gradient-aqua, gradient-radial-glow, text-gradient-aqua) proven on /design showcase page. verify-s02.sh 24/24 checks pass. No pure black — dark-base/dark-surface/dark-elevated tokens used throughout.
- Notes: Avoid pure black (#000). Use dark variants of Blue Slate as base. Aqua palette colors serve as accents, glows, and highlights.

### R004 — Animation System (GSAP + Framer Motion)
- Class: quality-attribute
- Status: validated
- Description: Scroll-triggered reveals, particle system, glow hover effects, page transitions, and micro-interactions. Must run at 60fps. GSAP for complex scroll-driven and particle animations, Framer Motion for React component transitions.
- Why it matters: The "futuristic" promise lives or dies on animation quality. Stuttery animations destroy the premium feel.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S04
- Validation: M001/S03 — 5 animation components (ScrollReveal, ParticleField, GlowHover, FadeInStagger, PageTransition) and 2 utility modules built. GSAP handles scroll-driven effects, Motion handles React lifecycle animations. ParticleField adaptive (80/40/20 particles by breakpoint) with Canvas 2D + CSS gradient fallback. prefers-reduced-motion respected at every layer. verify-s03.sh 29/29 checks pass. /motion demo page proves all components at runtime.
- Notes: Performance is a hard constraint — animations cannot tank Lighthouse scores below 80.

### R012 — Responsive Design (Mobile-first)
- Class: quality-attribute
- Status: validated
- Description: All pages (landing page, agent UI) fully responsive across mobile, tablet, and desktop. Animations gracefully degrade on lower-powered devices.
- Why it matters: Crypto degens browse on mobile. If drip.surf doesn't look incredible on a phone, you lose half your audience.
- Source: inferred
- Primary owning slice: M001/S04
- Supporting slices: M001/S02
- Validation: M001/S04 — Landing page verified responsive at 375px (mobile), 768px (tablet), 1440px (desktop). Feature cards reflow 1→2→4 columns. ParticleField adapts particle count (20/40/80). NavBar has hamburger menu on mobile. All text readable, no horizontal overflow. prefers-reduced-motion respected.
- Notes: Use prefers-reduced-motion for accessibility. Test on iPhone Safari and Android Chrome.

## Deferred

### R014 — Social Trend Scraping (StableSocial)
- Class: core-capability
- Status: deferred
- Description: Agent skill to scrape Instagram, TikTok, YouTube, Reddit, Facebook trends via AgentCash's StableSocial API (stablesocial.dev, 45 routes).
- Why it matters: Cross-platform trend intelligence is high-value alpha for crypto degens.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to post-M002. Second skill after people research is established.

### R015 — Image & Video Generation (StableStudio)
- Class: core-capability
- Status: deferred
- Description: Agent skill to generate images and videos via AgentCash's StableStudio API (stablestudio.dev, 28 routes). GPT Image, Sora, Veo, Wan models.
- Why it matters: Content generation capability makes DRIP a creative tool, not just a research tool.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to post-M002. Third skill.

### R016 — User Auth & Persistent Sessions
- Class: continuity
- Status: deferred
- Description: User accounts with authentication. Persistent conversation history across sessions.
- Why it matters: Without persistence, users lose context every visit. Limits repeat engagement.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred — V1 works without auth. Consider wallet-based auth (Phantom/Solflare) for crypto-native UX.

### R017 — Agent Email Capabilities (StableEmail)
- Class: core-capability
- Status: deferred
- Description: Agent skill for sending transactional or outreach email via AgentCash's StableEmail API (stableemail.dev, 24 routes).
- Why it matters: Enables the agent to send research reports, alerts, and outreach on behalf of users.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to post-M002.

### R018 — Agent Conversation History
- Class: continuity
- Status: deferred
- Description: Persist and display previous conversations in the agent chat UI. Users can revisit past research sessions.
- Why it matters: Without history, every session starts from zero. Returning users get no benefit from prior interactions.
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred — depends on R016 (auth) for per-user persistence.

## Out of Scope

### R019 — Autonomous X/Twitter Bot
- Class: anti-feature
- Status: out-of-scope
- Description: DRIP does not autonomously post on X. The user handles X manually as a build-in-public documentation channel.
- Why it matters: Prevents scope confusion. The agent lives on the web, not on X.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: User explicitly stated X is for their own documentation, not agent automation.

### R020 — Telegram/Discord Bots
- Class: anti-feature
- Status: out-of-scope
- Description: No Telegram or Discord bot interfaces. Twitter/X only for community, web only for agent.
- Why it matters: Focus. Multi-platform dilutes effort.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: May revisit in a future milestone if community demands it.

### R021 — Mobile Native App
- Class: constraint
- Status: out-of-scope
- Description: No native iOS/Android app. Responsive web covers mobile use cases.
- Why it matters: Prevents over-engineering. Web-first with responsive design is sufficient.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Responsive web (R012) satisfies mobile users.

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | validated | M001/S01 | none | M001/S01 UAT |
| R002 | launchability | validated | M001/S04 | M001/S02, M001/S03 | M001/S04 UAT |
| R003 | quality-attribute | validated | M001/S02 | M001/S04 | M001/S02 UAT |
| R004 | quality-attribute | validated | M001/S03 | M001/S04 | M001/S03 UAT |
| R005 | primary-user-loop | active | M002/S01 | M002/S03 | M002/S01 partial |
| R006 | primary-user-loop | active | M002/S02 | none | unmapped |
| R007 | integration | active | M002/S01 | M002/S02, M002/S03 | M002/S01 partial |
| R008 | core-capability | validated | M002/S03 | none | M002/S03 proven |
| R009 | core-capability | validated | M002/S03 | none | M002/S03 proven |
| R010 | launchability | active | M003/S01 | none | M003/S01 code-complete (37/37), token creation manual |
| R011 | differentiator | active | M003/S02 | M003/S01 | M003/S01+S02 code-complete (58/58), activation manual |
| R012 | quality-attribute | validated | M001/S04 | M001/S02 | M001/S04 UAT |
| R013 | launchability | validated | M001/S05 | M001/S01 | M001/S05 UAT |
| R014 | core-capability | deferred | none | none | unmapped |
| R015 | core-capability | deferred | none | none | unmapped |
| R016 | continuity | deferred | none | none | unmapped |
| R017 | core-capability | deferred | none | none | unmapped |
| R018 | continuity | deferred | none | none | unmapped |
| R019 | anti-feature | out-of-scope | none | none | n/a |
| R020 | anti-feature | out-of-scope | none | none | n/a |
| R021 | constraint | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 6
- Mapped to slices: 12
- Validated: 8 (R001, R002, R003, R004, R008, R009, R012, R013)
- Unmapped active requirements: 0
