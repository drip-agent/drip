---
estimated_steps: 5
estimated_files: 3
---

# T01: Add Token section to landing page with navbar link and verification

**Slice:** S02 — Token Display & Launch Configuration
**Milestone:** M003

## Description

Add the complete Token display section to the drip.surf landing page and a "Token" anchor link to the navbar. The section shows $DRIP token identity, contract address with copy-to-clipboard, PumpFun link, revenue/buyback stats from the existing revenue endpoint, and a buyback explainer. All composed from existing UI primitives — no new components or dependencies.

## Steps

1. **Add navbar link** — Add `{ label: "Token", href: "#token" }` to the `navLinks` array in `components/layout/navbar.tsx`, positioned after "Agent"
2. **Add Token section to page.tsx** — Insert a new `Section id="token"` between the `#agent` and `#early-access` sections. Contents:
   - Section heading "Token" with subheading about $DRIP
   - Revenue data fetch via `useEffect` + `useState` (single fetch on mount, no polling — this is a marketing page). Response shape: `{ totalEarned: string, queryCount: number, tokenMint: string | null }`
   - `ScrollReveal` wrapping a `Card variant="featured"` with token info:
     - $DRIP name and ticker with `Badge variant="accent"`
     - Contract address: read from `NEXT_PUBLIC_DRIP_TOKEN_MINT` env var. If set, show truncated address with copy button (navigator.clipboard.writeText + "Copied!" state toggle via setTimeout). If null, show "Coming soon" text
     - PumpFun link: `https://pump.fun/coin/${mint}` when mint set, `https://pump.fun` fallback. External link, opens new tab
   - `FadeInStagger` wrapping stat items: total USDC earned, queries processed
   - Buyback explainer: brief copy about the Tokenized Agents loop ("Revenue from agent queries buys back and burns $DRIP") with $10 threshold note
   - Mobile responsive: stats stack vertically on small screens, address truncates with ellipsis
3. **Handle pre-launch state** — Section must render cleanly when:
   - `NEXT_PUBLIC_DRIP_TOKEN_MINT` is unset (no contract address, generic PumpFun link, "Coming soon")
   - Revenue endpoint returns zeros (totalEarned: "0", queryCount: 0) — show "0 USDC" and "0" queries, not empty/broken
4. **Write verify-s02.sh** — Contract checks:
   - File existence: navbar.tsx, page.tsx modified (grep for `#token`)
   - Navbar link: `Token` label with `#token` href present
   - Section: `id="token"` section exists in page.tsx
   - Component usage: Section, Card, ScrollReveal, FadeInStagger used in token section area
   - Revenue fetch: useEffect + `/api/agent/revenue` fetch present
   - Copy-to-clipboard: `navigator.clipboard` usage present
   - PumpFun link: `pump.fun` URL present
   - Graceful null handling: "Coming soon" or equivalent fallback text present
   - Build: `npm run build` succeeds
5. **Run verification** — Execute `bash scripts/verify-s02.sh` and confirm all checks pass

## Must-Haves

- [ ] `navLinks` includes `{ label: "Token", href: "#token" }`
- [ ] Token section has `id="token"` and sits between `#agent` and `#early-access`
- [ ] Contract address displays truncated with copy-to-clipboard when mint is set
- [ ] "Coming soon" fallback when `NEXT_PUBLIC_DRIP_TOKEN_MINT` is unset
- [ ] PumpFun link dynamically constructed from mint, with `pump.fun` fallback
- [ ] Revenue stats fetched once on mount from `/api/agent/revenue`
- [ ] Buyback explainer copy includes $10 threshold note
- [ ] Uses existing components: Section, Card (featured), ScrollReveal, FadeInStagger, Badge
- [ ] ScrollReveal count stays within budget (5 max after adding this one)
- [ ] Mobile-responsive: stats stack, address truncates
- [ ] Renders cleanly with zero values and null mint
- [ ] `npm run build` succeeds
- [ ] `verify-s02.sh` all checks pass

## Verification

- `bash scripts/verify-s02.sh` — all contract checks pass
- `npm run build` — no errors
- Dev server visual check: Token section visible, navbar link works

## Inputs

- `components/layout/navbar.tsx` — existing navLinks array (3 items: Features, How It Works, Agent)
- `app/page.tsx` — existing 5-section landing page (Hero, Features, How It Works, Agent Preview, CTA)
- `GET /api/agent/revenue` — S01 output, returns `{ totalEarned: string, queryCount: number, tokenMint: string | null }`
- `NEXT_PUBLIC_DRIP_TOKEN_MINT` — env var convention from S01, may not be set pre-launch
- S01 summary — revenue endpoint shape, KV schema, env var conventions
- Existing component APIs: Section (heading/subheading/id), Card (variant="featured"), ScrollReveal, FadeInStagger, Badge (variant="accent"), GlassPanel

## Observability Impact

- **Revenue fetch errors**: Console error with endpoint URL and HTTP status — grep for `[token-section]` prefix in browser console.
- **Clipboard API**: Graceful degradation — no crash if `navigator.clipboard` unavailable (HTTP context). Console warning logged.
- **Pre-launch inspection**: Section renders deterministic fallback state when `NEXT_PUBLIC_DRIP_TOKEN_MINT` is unset — "Coming soon" text and generic PumpFun link. No env config needed to verify section renders.
- **Zero-value rendering**: Revenue stats show "0 USDC" and "0" rather than blank/missing when endpoint returns zeros.

## Expected Output

- `components/layout/navbar.tsx` — navLinks array extended with Token entry
- `app/page.tsx` — Token section added between Agent Preview and CTA sections
- `scripts/verify-s02.sh` — contract verification script for S02, all checks passing
