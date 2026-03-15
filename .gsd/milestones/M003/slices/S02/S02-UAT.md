# S02: Token Display & Launch Configuration — UAT

**Milestone:** M003
**Written:** 2026-03-15

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S02 is a single UI section on the landing page using established component patterns. All behavior is deterministic from env config and API response shape. Contract checks (21) and browser assertions (8) already cover structural and runtime correctness.

## Preconditions

- `npm run dev` running (or `npm run build && npm start`)
- No `NEXT_PUBLIC_DRIP_TOKEN_MINT` set in `.env.local` (pre-launch default state)
- Landing page accessible at http://localhost:3000

## Smoke Test

Load http://localhost:3000, scroll down past Agent Preview section. A "Token" section with $DRIP heading should be visible before the CTA section.

## Test Cases

### 1. Navbar Token link

1. Load http://localhost:3000
2. Look at the navigation bar links
3. **Expected:** "Token" link is visible alongside existing links (Features, How It Works, Agent, Early Access)
4. Click the "Token" link
5. **Expected:** Page smooth-scrolls to the Token section (`#token`)

### 2. Token section — pre-launch state (no mint configured)

1. Ensure `NEXT_PUBLIC_DRIP_TOKEN_MINT` is NOT set in `.env.local`
2. Load http://localhost:3000 and scroll to the Token section
3. **Expected:** Section displays:
   - "$DRIP" heading with "Solana Token" badge
   - "Coming soon" text where contract address would be (not blank, not an error)
   - PumpFun link pointing to `https://pump.fun` (generic, not coin-specific)
   - Revenue stats showing "0 USDC" earned and "0" queries (or "–" if revenue endpoint unreachable)
   - Buyback explainer mentioning "Tokenized Agents Loop" and "$10" threshold

### 3. Token section — with mint configured

1. Set `NEXT_PUBLIC_DRIP_TOKEN_MINT=So11111111111111111111111111111111` in `.env.local`
2. Restart dev server
3. Load http://localhost:3000 and scroll to the Token section
4. **Expected:**
   - Contract address displays truncated (e.g., `So111...1111`)
   - PumpFun link points to `https://pump.fun/coin/So11111111111111111111111111111111`
   - "Coming soon" text is NOT visible

### 4. Copy-to-clipboard (requires HTTPS or localhost exception)

1. With mint configured, load the Token section
2. Click the contract address / copy button
3. **Expected:** "Copied!" feedback appears briefly. Pasting yields the full mint address.
4. If on plain HTTP localhost: copy may fail silently — check browser console for `[token-section] Clipboard API unavailable` warning

### 5. Revenue stats display

1. With the dev server running (and S01's revenue endpoint available at `/api/agent/revenue`)
2. Load the Token section
3. **Expected:** Revenue stats show current values from KV (likely "0 USDC" and "0 queries" in dev)
4. The stats should not be blank — either real numbers or "0" defaults

### 6. PumpFun link opens correctly

1. Load the Token section
2. Click the PumpFun link/button
3. **Expected:** Opens `pump.fun` (or `pump.fun/coin/{mint}`) in a new tab (`target="_blank"`)

## Edge Cases

### Revenue endpoint unreachable

1. Stop the dev server's API route or block `/api/agent/revenue` (e.g., rename the route file temporarily)
2. Load the landing page and scroll to Token section
3. **Expected:** Section still renders. Revenue values show "–" (dash), not blank or broken layout. Browser console shows `[token-section] Revenue fetch failed` with URL and status.

### Mobile responsive layout

1. Load http://localhost:3000 on a narrow viewport (375px width or mobile device)
2. Scroll to the Token section
3. **Expected:** Stats stack vertically. Contract address truncates properly. No horizontal overflow. All text readable.

### Section ordering

1. Scroll through the full landing page
2. **Expected:** Section order is: Hero → Features → How It Works → Agent Preview → **Token** → CTA (Early Access)

## Failure Signals

- Token section missing or not visible between Agent Preview and CTA
- "Coming soon" showing when `NEXT_PUBLIC_DRIP_TOKEN_MINT` IS set
- Contract address showing full untruncated address without copy functionality
- Blank/broken revenue stats (should be "0" or "–", never empty)
- PumpFun link not opening in new tab
- Navbar missing "Token" link
- Console errors (other than expected `[token-section]` diagnostics on fetch failure)
- Horizontal scroll overflow on mobile

## Requirements Proved By This UAT

- R011 (Tokenized Agents Revenue Loop) — Display and messaging side: revenue stats from S01's endpoint rendered in landing page, buyback mechanics explained with $10 threshold, PumpFun link for token access. Revenue collection proved by S01's 37/37 checks.

## Not Proven By This UAT

- Actual PumpFun token creation (manual step, requires funded Solana wallet)
- Tokenized Agents activation on PumpFun (manual toggle on platform)
- Real buyback execution (requires $10+ accumulated revenue and activated Tokenized Agents)
- Revenue endpoint returning non-zero values (requires actual payment flow from S01 against live Solana RPC)

## Notes for Tester

- The default pre-launch state (no mint, zero revenue) is the expected look for now. The section is designed to look complete and informative even before token launch.
- Copy-to-clipboard requires a secure context (HTTPS). On localhost HTTP, the clipboard API may not be available — this is a browser limitation, not a bug.
- The "$10 threshold" in the buyback explainer is a PumpFun platform constraint, not configurable.
