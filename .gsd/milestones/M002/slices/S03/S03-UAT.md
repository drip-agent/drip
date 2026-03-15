# S03: Operational Hardening & Modular Proof — UAT

**Milestone:** M002
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven + live-runtime)
- Why this mode is sufficient: Wallet badge and error banner are visual UI elements requiring browser verification. Stub skill modularity is proven by contract checks and build success. Error copy requires human judgment for voice consistency.

## Preconditions

- Dev server running (`npm run dev`)
- No `X402_PRIVATE_KEY` set (tests "not configured" path — the expected local state)
- No `OPENROUTER_API_KEY` set (triggers chat error path for error banner testing)
- Browser open to `http://localhost:3000/agent`

## Smoke Test

Visit `http://localhost:3000/agent`. Confirm:
- Chat UI renders with input field and send button
- WalletBadge visible in the top navigation showing "N/A" or a USDC amount
- Nav links include Chat and Feed

## Test Cases

### 1. Wallet Badge — Not Configured State

1. Ensure `X402_PRIVATE_KEY` is **not** set in `.env.local`
2. Visit `http://localhost:3000/agent`
3. Look at the top navigation bar
4. **Expected:** WalletBadge shows "N/A" (not an error, not blank, not a crash)
5. Check dev server console logs
6. **Expected:** `[wallet]` prefixed log indicating key not configured

### 2. Wallet Badge — Configured State

1. Set `X402_PRIVATE_KEY` in `.env.local` to a valid Base Sepolia private key
2. Restart dev server
3. Visit `http://localhost:3000/agent`
4. **Expected:** WalletBadge shows a formatted USDC amount (e.g., "0.00 USDC" for unfunded wallet)
5. Wait 60+ seconds
6. **Expected:** Badge refreshes (may show same value — confirms polling works)

### 3. Wallet API Endpoint — Not Configured

1. `curl http://localhost:3000/api/agent/wallet`
2. **Expected:** `{ "error": "Wallet not configured", "configured": false }` with HTTP 200

### 4. Wallet API Endpoint — Configured

1. With `X402_PRIVATE_KEY` set, `curl http://localhost:3000/api/agent/wallet`
2. **Expected:** `{ "address": "0x...", "balance": "...", "formatted": "X.XX" }` with HTTP 200

### 5. In-Character Error Banner

1. Ensure `OPENROUTER_API_KEY` is **not** set (or set to an invalid value)
2. Visit `http://localhost:3000/agent`
3. Type "research Anthropic" and press Send
4. **Expected:** Error banner appears with text "Lost signal. Try again." and a retry button
5. **Expected:** Banner uses dark elevated background with aqua accent border (design system consistent)
6. **Expected:** No raw error message, stack trace, or technical jargon visible to the user

### 6. Error Banner Retry

1. Trigger error state (same as test 5)
2. Click the "Try again" retry button
3. **Expected:** Banner dismisses and chat attempts to regenerate the response
4. **Expected:** If API is still misconfigured, error banner reappears (not a crash loop)

### 7. Stub Skill Registration — Zero Core Changes

1. Check server startup logs
2. **Expected:** Two `[skill-registry]` log lines:
   - `Registered skill: Company & People Research (research) — 2 tool(s)`
   - `Registered skill: Social Trends (social-trends) — 1 tool(s)`
3. Open `lib/skills/registry.ts` — confirm no references to "social-trends" (skill self-registers)
4. Open `lib/skills/types.ts` — confirm no references to "social-trends"
5. Open `app/api/agent/chat/route.ts` — confirm only change is the import line `import "@/lib/skills/social-trends"`
6. **Expected:** All three files unchanged from S01 except the single import line in the chat route

### 8. Feed Page Still Works

1. Visit `http://localhost:3000/agent/feed`
2. **Expected:** Feed page renders (either entries or empty state message)
3. **Expected:** No regressions from S02 — cards, layout, navigation all intact

### 9. Mobile Wallet Badge

1. Resize browser to mobile width (~375px) or use device emulation
2. Visit `http://localhost:3000/agent`
3. Open the mobile hamburger menu
4. **Expected:** WalletBadge visible in the mobile nav alongside Chat and Feed links

## Edge Cases

### Empty wallet (configured but zero balance)

1. Set `X402_PRIVATE_KEY` to a valid key with zero USDC balance
2. Visit `http://localhost:3000/agent`
3. **Expected:** WalletBadge shows "0.00 USDC" (not "N/A", not error)

### Network interruption during wallet poll

1. Start dev server, load `/agent`
2. Kill the dev server while the page is open
3. Wait for the next 60s wallet poll
4. **Expected:** WalletBadge shows warning icon "⚠" (not a page crash)

### Rapid consecutive chat errors

1. Send multiple messages quickly with no API key configured
2. **Expected:** Each triggers the error banner; no duplicate banners stacking; retry works for the latest

## Failure Signals

- WalletBadge shows nothing (blank) instead of "N/A" or a balance
- Raw error text like "TypeError" or "fetch failed" visible in the chat UI
- Server crashes on startup due to missing social-trends skill import
- `npm run build` fails after S03 changes
- `/api/agent/wallet` returns 500 instead of 200 with `configured: false`
- Only one skill registered in `[skill-registry]` logs (missing social-trends)

## Requirements Proved By This UAT

- R005 (Agent Chat Interface) — error handling with in-character messages (tests 5, 6)
- R007 (AgentCash Backend Integration) — wallet balance operational awareness (tests 1-4)
- R008 (People & Company Research Skill) — research skill registered and wired (test 7, server logs)
- R009 (Modular Skill Architecture) — stub skill registers with zero core changes (test 7)

## Not Proven By This UAT

- Live end-to-end research flow ("research Anthropic" → real StableEnrich data) — requires funded wallet + API keys
- Live cron feed generation — requires Vercel KV credentials and deployment
- Production wallet balance accuracy — requires mainnet USDC contract address change
- Wallet balance display with very large amounts (formatting edge case)

## Notes for Tester

- Most tests work best in the "not configured" state (no env vars set) — this is the expected local development experience
- The "configured" wallet tests (2, 4) require a real Base Sepolia private key — skip if unavailable
- Error banner voice check: "Lost signal. Try again." should feel consistent with the cool & mysterious agent character, not robotic or corporate
- The social-trends stub intentionally returns canned data — this is correct behavior, not a bug
- WalletBadge "N/A" is the correct display when wallet is not configured — it's informational, not an error state
