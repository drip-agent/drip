# S02: Token Display & Launch Configuration

**Goal:** drip.surf landing page shows a Token section with $DRIP info, PumpFun link, contract address, and revenue/buyback stats. Landing navbar includes a Token anchor link.
**Demo:** Scrolling down drip.surf reveals a Token section between Agent Preview and CTA. Clicking "Token" in the navbar smooth-scrolls to the section. Contract address shows with copy-to-clipboard (or "Coming soon" if mint not set). Revenue stats render from the existing endpoint. PumpFun link opens in a new tab.

## Must-Haves

- Token section visible at `#token` between `#agent` and `#early-access` sections
- Navbar has "Token" link that scrolls to `#token`
- Contract address displayed with copy-to-clipboard (truncated, full on click) — graceful "Coming soon" when `NEXT_PUBLIC_DRIP_TOKEN_MINT` is unset
- PumpFun link (dynamic `pump.fun/coin/{mint}` when mint set, `pump.fun` fallback)
- Revenue stats (total USDC earned, queries processed) fetched from `GET /api/agent/revenue`
- Buyback explainer copy explaining the Tokenized Agents loop and $10 threshold
- Section uses existing components: `Section`, `Card variant="featured"`, `ScrollReveal`, `FadeInStagger`
- Mobile-responsive layout (stats stack vertically, address truncates)
- Renders cleanly with zero values (pre-launch default state)

## Observability / Diagnostics

- **Revenue fetch failure**: Console error logged with endpoint URL and status code. Section still renders with "–" fallback values (never blank/broken).
- **Clipboard failure**: Falls back silently — copy button remains functional on retry, no crash. Console warning on clipboard API unavailability.
- **Pre-launch state**: Null `NEXT_PUBLIC_DRIP_TOKEN_MINT` produces a deterministic "Coming soon" state — visually inspectable without env configuration.
- **No secrets exposed**: Contract address (public on-chain data) displayed, but no private keys or API secrets surfaced in UI or console.

## Verification

- `bash scripts/verify-s02.sh` — contract checks covering file patterns, section ID, navbar link, component usage, build pass
- Failure path: revenue fetch with unreachable endpoint renders section with fallback values (not blank/broken)

## Tasks

- [x] **T01: Add Token section to landing page with navbar link and verification** `est:30m`
  - Why: Entire slice scope — navbar link, token section with revenue data, copy-to-clipboard, PumpFun link, and contract checks
  - Files: `components/layout/navbar.tsx`, `app/page.tsx`, `scripts/verify-s02.sh`
  - Do: Add `{ label: "Token", href: "#token" }` to navLinks. Add Token section in page.tsx between `#agent` and `#early-access` using Section + Card variant="featured" + ScrollReveal + FadeInStagger. Fetch revenue data via useEffect (single fetch, no polling). Handle null mint gracefully. Copy-to-clipboard with "Copied!" feedback. Write verify-s02.sh with structural checks.
  - Verify: `bash scripts/verify-s02.sh` passes all checks, `npm run build` succeeds
  - Done when: All contract checks pass, section renders with zero-value defaults, navbar link points to #token

## Files Likely Touched

- `components/layout/navbar.tsx`
- `app/page.tsx`
- `scripts/verify-s02.sh`
