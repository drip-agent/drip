# S02: Token Display & Launch Configuration — Research

**Date:** 2026-03-15

## Summary

S02 is pure UI composition — no new dependencies, no API routes, no SDK work. The slice adds a Token section to the drip.surf landing page and a "Token" anchor link to the navbar. All building blocks exist: `Section`, `Container`, `GlassPanel`, `Card`, `Badge`, `ScrollReveal`, `FadeInStagger`, `GlowHover`, and the full design token palette. The revenue data source is already live at `GET /api/agent/revenue` (S01 output).

The Token section needs to show: $DRIP token identity (name, ticker, contract address with copy-to-clipboard), a PumpFun link, and revenue/buyback stats fetched from the revenue endpoint. The contract address comes from `NEXT_PUBLIC_DRIP_TOKEN_MINT` — a client-readable env var already established in S01. Revenue stats come from the existing endpoint, but unlike the agent's `RevenueBadge` (which polls client-side), the landing page can fetch server-side in a server component since the data doesn't need real-time updates on the marketing page.

The landing page (`app/page.tsx`) is currently `"use client"` because it uses `useReducedMotion` at the top level. The Token section could either fetch client-side (like `RevenueBadge` does) or be a nested server component. The simpler path: fetch revenue data in a client component using `useEffect` with the same pattern already proven in `RevenueBadge`. No need to restructure the page's client/server boundary for one data fetch.

## Recommendation

**Single task, single file scope.** The work is:

1. Add a `Token` entry to `navLinks` in `components/layout/navbar.tsx` — one line addition
2. Add a Token section in `app/page.tsx` between Agent Preview (`#agent`) and CTA (`#early-access`) — new section with `id="token"` using existing `Section` + `Container` + animation components
3. Write a `scripts/verify-s02.sh` contract check script

No new components needed — the section's content is composed from existing primitives. The token stats (contract address, revenue, query count) render inline using data from the revenue endpoint and the `NEXT_PUBLIC_DRIP_TOKEN_MINT` env var.

**Token section content:**
- $DRIP heading with token identity (name, ticker)
- Contract address with copy-to-clipboard (truncated display, full on hover/click)
- PumpFun link (external, opens in new tab)
- Revenue stats: total earned USDC, total queries processed
- Buyback explainer: brief copy explaining the Tokenized Agents loop ("Revenue from agent queries buys back and burns $DRIP")
- Buyback threshold note: "$10 minimum before buyback triggers" per PumpFun mechanics

**Design approach:** Match the existing section patterns — `Section` wrapper with heading/subheading, `Container` for width constraint, `GlassPanel` or `Card variant="featured"` for the token info card, `FadeInStagger` for stat items, `ScrollReveal` for the card itself. The featured card variant (`border-icy-aqua/30 shadow-glow-md`) is ideal for the token display — it already has the "important item" visual treatment.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Section layout with heading | `Section` component with `heading`/`subheading` props | Same pattern as 4 existing sections on the page |
| Glassmorphism card | `GlassPanel` or `Card variant="featured"` | Both exist with correct dark+aqua treatment |
| Scroll-reveal animation | `ScrollReveal direction="up"` | Same as Agent Preview and How It Works sections |
| Staggered stat display | `FadeInStagger` | Same as Features section grid |
| Revenue data shape | `GET /api/agent/revenue` → `{ totalEarned, queryCount, tokenMint }` | Built in S01, documented in S01 summary |
| Token mint env var | `NEXT_PUBLIC_DRIP_TOKEN_MINT` | Convention from S01, client-readable |
| Copy-to-clipboard | `navigator.clipboard.writeText()` | Native browser API, no library needed |

## Existing Code and Patterns

- `app/page.tsx` — Landing page with 5 sections. Token section inserts between `#agent` and `#early-access`. Page is `"use client"` — new section follows the same client component pattern.
- `components/layout/navbar.tsx` — `navLinks` array of `{ label, href }`. Add `{ label: "Token", href: "#token" }`. Both desktop and mobile nav render from this array.
- `components/layout/section.tsx` — `Section` with `heading`, `subheading`, `spacing` variants, and `id` passthrough via `...props`. Used by all 4 named sections.
- `components/ui/card.tsx` — `Card variant="featured"` has `border-icy-aqua/30 shadow-glow-md` — the right visual weight for the token card.
- `components/ui/glass-panel.tsx` — Alternative to Card for the info display. Used by How It Works and Agent Preview sections.
- `components/ui/badge.tsx` — `Badge variant="accent"` for token category label. Same as Hero's "AI Research Agent" badge.
- `components/animation/scroll-reveal.tsx` — Wraps the token card for scroll-triggered entrance.
- `components/animation/fade-in-stagger.tsx` — Wraps stat items for staggered reveal.
- `components/animation/glow-hover.tsx` — Can wrap the PumpFun link button for hover glow effect.
- `components/ui/revenue-badge.tsx` — Client-side fetch pattern for `/api/agent/revenue`. The Token section reuses this data fetching approach (useEffect + fetch).
- `app/api/agent/revenue/route.ts` — Revenue endpoint with no-store cache. Returns `{ totalEarned: "0", queryCount: 0, tokenMint: null }` as fallback on error — safe to display without error handling UI.
- `lib/motion-variants.ts` — `fadeIn`, `slideUp`, `staggerItem` variants for Framer Motion animations.

## Constraints

- **`app/page.tsx` is `"use client"`** — The landing page imports `useReducedMotion` from Motion. The Token section must be a client component or nested within one. Revenue data fetching uses `useEffect` + `fetch`, not server-side.
- **`NEXT_PUBLIC_DRIP_TOKEN_MINT` may not be set** — Before token launch, this env var won't exist. The section must handle `null` gracefully — show placeholder text like "Coming soon" for contract address, hide the copy button, and still show the PumpFun link as a general link.
- **ScrollReveal limit** — D023 caps ScrollReveal at 5-6 instances per page. Current count: 4 (3 in How It Works steps + 1 in Agent Preview). Adding 1 for the Token section = 5 total. Within budget. Use `FadeInStagger` for stat items, not individual ScrollReveals.
- **No new dependencies** — All UI primitives and animation components already exist. Copy-to-clipboard is a native browser API.
- **Section order per D022** — D022 says "sections can be added/reordered" (revisable). Token goes between Agent Preview and CTA as the roadmap specifies.
- **Navbar link count** — Currently 3 links (Features, How It Works, Agent). Adding Token = 4. Still fits desktop nav comfortably. Mobile dropdown handles any count.
- **PumpFun URL pattern** — Token page URL will be `https://pump.fun/coin/<token_mint_address>`. If mint address is available, link directly. Otherwise link to `https://pump.fun`.

## Common Pitfalls

- **Fetching revenue data on every page load** — The landing page is a marketing page. Don't poll every 60s like `RevenueBadge` does. Fetch once on mount. Stale data on a marketing page is fine.
- **Overbuilding the token display** — This is a static info section with one dynamic data fetch, not a dashboard. Don't add charts, real-time updates, or complex interactivity. A card with stats and a link is sufficient.
- **Breaking scroll anchor spacing** — Adding a section changes scroll positions for `#early-access`. But smooth scroll with `scroll-padding-top` handles this automatically — no manual offset needed.
- **Copy-to-clipboard without feedback** — Must show visual confirmation (brief "Copied!" text swap or tooltip) after clicking copy. Users need to know the copy worked. Use a simple state toggle with setTimeout.
- **Hardcoding the PumpFun URL** — Use `NEXT_PUBLIC_DRIP_TOKEN_MINT` to construct the URL dynamically: `` `https://pump.fun/coin/${mint}` ``. Falls back to `https://pump.fun` when mint is not set.
- **Forgetting mobile layout** — Token info card needs to reflow cleanly on mobile. Stats should stack vertically on small screens. Contract address should truncate with ellipsis.

## Open Risks

- **Revenue endpoint returns zeros before deployment** — Without Vercel KV credentials, the endpoint returns `{ totalEarned: "0", queryCount: 0 }`. The Token section must look good with zero values, not broken or empty. This is the default state pre-launch.
- **Token mint not set pre-launch** — `NEXT_PUBLIC_DRIP_TOKEN_MINT` won't have a value until the token is actually created on PumpFun. Section must render a clean "coming soon" state without the address.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| PumpFun | `sendaifun/skills@pumpfun` (69 installs) | Available — not needed for S02 (no SDK work, display only) |
| Solana | `solana-foundation/solana-dev-skill@solana-dev` (1.1K installs) | Available — not needed for S02 (no chain interaction) |
| Frontend design | Built-in `frontend-design` skill | Installed — available if design refinement needed, but section follows established patterns |
| Landing pages | `bear2u/my-skills@landing-page-guide-v2` (589 installs) | Available — not needed, existing codebase patterns are sufficient |

No skills need installation for S02. The work is entirely within established component patterns.

## Sources

- S01 summary — revenue endpoint shape, env var conventions, KV key schema (inlined context)
- M003 roadmap — boundary map defining S01→S02 data contract (inlined context)
- M003 research — PumpFun URL patterns, buyback mechanics, $10 threshold (inlined context)
- Existing codebase — landing page structure, component APIs, design tokens (explored via file reads)
