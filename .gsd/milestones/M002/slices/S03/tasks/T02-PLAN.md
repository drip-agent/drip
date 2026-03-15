---
estimated_steps: 3
estimated_files: 2
---

# T02: Write verification scripts and run final proof

**Slice:** S03 — Operational Hardening & Modular Proof
**Milestone:** M002

## Description

Write the slice-level verification script (`verify-m002-s03.sh`) and the milestone-level aggregator (`verify-m002.sh`). Run both to prove S03 deliverables are correct and M002 as a whole is structurally complete. Fix any issues found during verification.

## Steps

1. **Write `scripts/verify-m002-s03.sh`** — check: `lib/wallet.ts` exists and exports `getWalletBalance`, `app/api/agent/wallet/route.ts` exists and exports GET, `lib/skills/social-trends.ts` exists and calls `registerSkill`, social-trends imported in `app/api/agent/chat/route.ts`, `error` and `regenerate` referenced in `app/agent/page.tsx`, WalletBadge or wallet-related fetch in `app/agent/layout.tsx`, `npm run build` passes. Pattern: follow the same `check()` / `pass`/`fail` / summary format from `verify-m002-s01.sh` and `verify-m002-s02.sh`.

2. **Write `scripts/verify-m002.sh`** — milestone-level script that runs all three slice verification scripts in sequence (`verify-m002-s01.sh`, `verify-m002-s02.sh`, `verify-m002-s03.sh`), counts total pass/fail across all slices, and reports aggregate result. Also runs a build check as a final gate.

3. **Run both scripts, fix any failures** — execute `verify-m002-s03.sh` first (faster feedback), then `verify-m002.sh` for the full milestone sweep. If any checks fail, fix the underlying issue and re-run until all pass.

## Must-Haves

- [ ] `scripts/verify-m002-s03.sh` checks all S03 deliverables (wallet, stub skill, error handling, build)
- [ ] `scripts/verify-m002.sh` aggregates S01+S02+S03 and reports milestone-level pass/fail
- [ ] Both scripts pass all checks with zero failures

## Verification

- `bash scripts/verify-m002-s03.sh` — all checks pass
- `bash scripts/verify-m002.sh` — all checks pass (S01 + S02 + S03 aggregate)

## Inputs

- `scripts/verify-m002-s01.sh` — S01 verification script (25 checks), used as format reference and aggregated by milestone script
- `scripts/verify-m002-s02.sh` — S02 verification script (23 checks), aggregated by milestone script
- All T01 outputs — the files being verified must exist before this task runs

## Observability Impact

- **Verification scripts as diagnostic tools:** `verify-m002-s03.sh` checks S03 contract (wallet, stub skill, error handling, build) — run it to audit S03 health. `verify-m002.sh` aggregates all M002 slices — run it after any cross-slice change to confirm nothing regressed.
- **Exit codes:** Both scripts exit 0 on all-pass, exit 1 on any failure — usable in CI gates.
- **Future-agent inspection:** Run `bash scripts/verify-m002.sh` to instantly assess M002 health. Individual slice scripts (`verify-m002-s01.sh`, `verify-m002-s02.sh`, `verify-m002-s03.sh`) isolate which slice broke.
- **Failure visibility:** Each check prints ✓/✗ with a descriptive label. Failed checks name the missing file/export/pattern so the fix is obvious.

## Expected Output

- `scripts/verify-m002-s03.sh` — slice-level verification script for S03
- `scripts/verify-m002.sh` — milestone-level verification script aggregating all M002 slices
