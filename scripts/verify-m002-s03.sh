#!/usr/bin/env bash
# ─── verify-m002-s03.sh ─────────────────────────────────────────────
# Slice verification: S03 — Operational Hardening & Modular Proof (M002)
# Checks wallet balance endpoint, stub skill registration, error
# handling UI, and build health.
# ────────────────────────────────────────────────────────────────────

set -uo pipefail

PASS=0
FAIL=0

check() {
  local label="$1"
  local result="$2"
  if [ "$result" -eq 0 ]; then
    echo "  ✓ $label"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $label"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══ S03: Operational Hardening & Modular Proof — Slice Verification ═══"
echo ""

# ─── File Existence ──────────────────────────────────────────────────

echo "── File Existence ──"

[ -f "lib/wallet.ts" ] && check "lib/wallet.ts exists" 0 || check "lib/wallet.ts exists" 1

[ -f "app/api/agent/wallet/route.ts" ] && check "app/api/agent/wallet/route.ts exists" 0 || check "app/api/agent/wallet/route.ts exists" 1

[ -f "lib/skills/social-trends.ts" ] && check "lib/skills/social-trends.ts exists" 0 || check "lib/skills/social-trends.ts exists" 1

echo ""

# ─── Exports: lib/wallet.ts ─────────────────────────────────────────

echo "── Exports: lib/wallet.ts ──"

grep -q 'import "server-only"' lib/wallet.ts && check "server-only import" 0 || check "server-only import" 1

grep -q "export async function getWalletBalance" lib/wallet.ts && check "getWalletBalance exported" 0 || check "getWalletBalance exported" 1

grep -q "CACHE_TTL" lib/wallet.ts && check "TTL cache present" 0 || check "TTL cache present" 1

grep -q '\[wallet\]' lib/wallet.ts && check "[wallet] log prefix" 0 || check "[wallet] log prefix" 1

echo ""

# ─── Exports: wallet route ──────────────────────────────────────────

echo "── Exports: wallet route ──"

grep -q "export async function GET" app/api/agent/wallet/route.ts && check "GET handler exported" 0 || check "GET handler exported" 1

grep -q "configured.*false\|configured: false" app/api/agent/wallet/route.ts && check "Missing-key returns configured:false" 0 || check "Missing-key returns configured:false" 1

grep -q '\[wallet\]' app/api/agent/wallet/route.ts && check "[wallet] log prefix in route" 0 || check "[wallet] log prefix in route" 1

echo ""

# ─── Stub Skill: social-trends ───────────────────────────────────────

echo "── Stub Skill: social-trends ──"

grep -q 'import "server-only"' lib/skills/social-trends.ts && check "server-only import" 0 || check "server-only import" 1

grep -q "registerSkill" lib/skills/social-trends.ts && check "Calls registerSkill" 0 || check "Calls registerSkill" 1

grep -q '\[social-trends\]' lib/skills/social-trends.ts && check "[social-trends] log prefix" 0 || check "[social-trends] log prefix" 1

grep -q 'import.*social-trends\|import.*socialTrends' app/api/agent/chat/route.ts && check "social-trends imported in chat route" 0 || check "social-trends imported in chat route" 1

echo ""

# ─── Error Handling UI ───────────────────────────────────────────────

echo "── Error Handling UI ──"

grep -q 'error' app/agent/page.tsx && check "error referenced in page.tsx" 0 || check "error referenced in page.tsx" 1

grep -q 'regenerate' app/agent/page.tsx && check "regenerate referenced in page.tsx" 0 || check "regenerate referenced in page.tsx" 1

grep -q 'onError' app/agent/page.tsx && check "onError callback in page.tsx" 0 || check "onError callback in page.tsx" 1

grep -q '\[agent-chat\]' app/agent/page.tsx && check "[agent-chat] log prefix" 0 || check "[agent-chat] log prefix" 1

echo ""

# ─── Wallet Badge in Layout ─────────────────────────────────────────

echo "── Wallet Badge ──"

grep -q 'WalletBadge\|walletBadge' app/agent/layout.tsx && check "WalletBadge in layout" 0 || check "WalletBadge in layout" 1

grep -q '/api/agent/wallet' app/agent/layout.tsx && check "Fetches /api/agent/wallet" 0 || check "Fetches /api/agent/wallet" 1

echo ""

# ─── Build ───────────────────────────────────────────────────────────

echo "── Build ──"

BUILD_OUTPUT=$(npm run build 2>&1) || true
if echo "$BUILD_OUTPUT" | grep -q "✓ Generating static pages"; then
  check "npm run build succeeds" 0
else
  check "npm run build succeeds" 1
  echo "$BUILD_OUTPUT" | tail -20
fi

echo ""

# ─── Summary ─────────────────────────────────────────────────────────

TOTAL=$((PASS + FAIL))
echo "═══════════════════════════════════════════════════"
echo "  Results: $PASS/$TOTAL passed, $FAIL failed"
echo "═══════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
