---
id: T01
parent: S02
milestone: M003
provides:
  - Token section on drip.surf landing page with $DRIP identity, revenue stats, PumpFun link, and buyback explainer
  - Token navbar link in landing page navigation
  - S02 contract verification script (verify-s02.sh)
key_files:
  - components/layout/navbar.tsx
  - app/page.tsx
  - scripts/verify-s02.sh
key_decisions:
  - TokenSection as inline component in page.tsx (not separate file) — single-use, page-specific, avoids unnecessary module boundary
  - Revenue fetch with graceful error fallback ("–" values) rather than hiding section on error
  - TOKEN_MINT read from env at module scope (NEXT_PUBLIC_ prefix makes it available client-side)
patterns_established:
  - Console log prefix convention [token-section] for revenue fetch diagnostics
  - Fetch error state (fetchError boolean) renders dash fallback instead of zeros or blank
observability_surfaces:
  - "[token-section] Revenue fetch failed" console error with URL and status on non-200 response
  - "[token-section] Clipboard API unavailable" console warning when not in HTTPS context
  - "Coming soon" visible text when NEXT_PUBLIC_DRIP_TOKEN_MINT is unset — deterministic pre-launch state
duration: 15m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Add Token section to landing page with navbar link and verification

**Added Token section with $DRIP identity, revenue stats, PumpFun link, and buyback explainer between Agent Preview and CTA sections. Navbar extended with Token anchor link.**

## What Happened

Added `{ label: "Token", href: "#token" }` to navLinks in navbar.tsx. Built TokenSection component inline in page.tsx with:
- $DRIP heading + Solana Token badge
- Contract address with copy-to-clipboard (truncated display, "Copied!" feedback via setTimeout)
- "Coming soon" fallback when `NEXT_PUBLIC_DRIP_TOKEN_MINT` unset
- Dynamic PumpFun link (`pump.fun/coin/{mint}` or `pump.fun` fallback)
- Revenue stats (total USDC, queries) via single useEffect fetch from `/api/agent/revenue`
- Fetch error state renders "–" fallbacks instead of zeros or blank
- Buyback explainer with $10 threshold note
- Uses Section, Card (featured), ScrollReveal, FadeInStagger, Badge, GlassPanel

ScrollReveal count: 4 total (was 3, added 1) — within D023 budget of 5 max.

## Verification

- `bash scripts/verify-s02.sh` — 21/21 checks passed (including `npm run build`)
- Browser assertions: 8/8 passed — Token heading, $DRIP, Coming soon, PumpFun link, 0 USDC, Tokenized Agents Loop, $10 threshold, #token section visible
- Visual: section renders correctly at desktop viewport with all elements visible

### Slice-level verification
- `bash scripts/verify-s02.sh` — **all pass** (this is the only task in S02)

## Diagnostics

- Browser console: grep for `[token-section]` to see revenue fetch errors or clipboard warnings
- Pre-launch state: no env config needed — section shows "Coming soon" + generic PumpFun link + zero revenue stats by default
- Set `NEXT_PUBLIC_DRIP_TOKEN_MINT=<address>` in .env to activate contract address display and dynamic PumpFun link

## Deviations

- Fixed verify-s02.sh bash arithmetic: `((PASS++))` fails under `set -e` when PASS=0 (bash treats 0 as falsy exit code). Changed to `PASS=$((PASS + 1))`.
- Fixed verify-s02.sh check: "page.tsx contains #token" changed to "page.tsx contains token section" with `grep 'id="token"'` — page.tsx uses `id="token"` attribute, not literal `#token`.

## Known Issues

None.

## Files Created/Modified

- `components/layout/navbar.tsx` — Added Token link to navLinks array
- `app/page.tsx` — Added TokenSection component and Token section between Agent Preview and CTA
- `scripts/verify-s02.sh` — S02 contract verification script (21 checks)
- `.gsd/milestones/M003/slices/S02/S02-PLAN.md` — Added Observability/Diagnostics section and failure-path verification
- `.gsd/milestones/M003/slices/S02/tasks/T01-PLAN.md` — Added Observability Impact section
