#!/usr/bin/env bash
# ─── verify-m002.sh ─────────────────────────────────────────────────
# Milestone-level verification: M002 — Agent Platform
# Runs all three slice verification scripts in sequence and reports
# aggregate pass/fail across the entire milestone.
# ────────────────────────────────────────────────────────────────────

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TOTAL_PASS=0
TOTAL_FAIL=0
SLICE_RESULTS=()

run_slice() {
  local label="$1"
  local script="$2"

  echo ""
  echo "╔═══════════════════════════════════════════════════╗"
  echo "  $label"
  echo "╚═══════════════════════════════════════════════════╝"
  echo ""

  local output
  output=$(bash "$SCRIPT_DIR/$script" 2>&1) || true
  echo "$output"

  # Extract pass/fail counts from the script's summary line
  local pass fail
  pass=$(echo "$output" | grep -oE '[0-9]+/[0-9]+ passed' | grep -oE '^[0-9]+' || echo "0")
  fail=$(echo "$output" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' || echo "0")

  # Fallback: try the S01 format ("X passed, Y failed")
  if [ "$pass" = "0" ] && [ "$fail" = "0" ]; then
    pass=$(echo "$output" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+' || echo "0")
    fail=$(echo "$output" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' || echo "0")
  fi

  TOTAL_PASS=$((TOTAL_PASS + pass))
  TOTAL_FAIL=$((TOTAL_FAIL + fail))

  if [ "$fail" -gt 0 ]; then
    SLICE_RESULTS+=("  ✗ $label — $pass passed, $fail failed")
  else
    SLICE_RESULTS+=("  ✓ $label — $pass passed, $fail failed")
  fi
}

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           M002: Agent Platform — Milestone Verification  ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# ─── Run all slice verification scripts ──────────────────────────────

run_slice "S01: Agent Chat & Skill Architecture" "verify-m002-s01.sh"
run_slice "S02: Discovery Feed" "verify-m002-s02.sh"
run_slice "S03: Operational Hardening & Modular Proof" "verify-m002-s03.sh"

# ─── Aggregate Summary ──────────────────────────────────────────────

GRAND_TOTAL=$((TOTAL_PASS + TOTAL_FAIL))

echo ""
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                 M002 Milestone Summary                   ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "── Slice Results ──"
for r in "${SLICE_RESULTS[@]}"; do
  echo "$r"
done
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  TOTAL: $TOTAL_PASS/$GRAND_TOTAL passed, $TOTAL_FAIL failed"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ "$TOTAL_FAIL" -gt 0 ]; then
  echo "❌ M002 verification FAILED"
  exit 1
else
  echo "✅ M002 verification PASSED"
  exit 0
fi
