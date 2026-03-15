#!/usr/bin/env bash
# scripts/verify-s01.sh — S01 Payment-Gated Agent Chat contract verification
#
# Checks: file existence, expected exports, dependency versions,
# no duplicate @solana/web3.js, next build, API route exports,
# "use client" directives, provider wrapping, 402 gate.
set -euo pipefail

PASS=0
FAIL=0
WARNINGS=0

pass() { echo "  ✅ $1"; PASS=$((PASS + 1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL + 1)); }
warn() { echo "  ⚠️  $1"; WARNINGS=$((WARNINGS + 1)); }

echo "═══════════════════════════════════════════════════"
echo "  S01: Payment-Gated Agent Chat — Contract Verification"
echo "═══════════════════════════════════════════════════"
echo ""

# ── 1. File existence ────────────────────────────────────────────────
echo "▸ File existence"
REQUIRED_FILES=(
  "components/solana/wallet-provider.tsx"
  "components/solana/connect-button.tsx"
  "components/ui/revenue-badge.tsx"
  "app/agent/layout.tsx"
  "app/agent/page.tsx"
  "app/api/agent/payment/route.ts"
  "app/api/agent/payment/verify/route.ts"
  "app/api/agent/revenue/route.ts"
  "app/api/agent/chat/route.ts"
  "lib/pump-agent.ts"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ -f "$f" ]; then
    pass "$f exists"
  else
    fail "$f missing"
  fi
done
echo ""

# ── 2. "use client" directives ──────────────────────────────────────
echo "▸ Client directives"
CLIENT_FILES=(
  "components/solana/wallet-provider.tsx"
  "components/solana/connect-button.tsx"
  "components/ui/revenue-badge.tsx"
  "app/agent/layout.tsx"
  "app/agent/page.tsx"
)

for f in "${CLIENT_FILES[@]}"; do
  if [ -f "$f" ] && head -1 "$f" | grep -q '"use client"'; then
    pass "$f has \"use client\""
  else
    fail "$f missing \"use client\" directive"
  fi
done
echo ""

# ── 3. Expected exports / patterns ──────────────────────────────────
echo "▸ Expected exports and patterns"

if grep -q "export function SolanaWalletProvider" components/solana/wallet-provider.tsx 2>/dev/null; then
  pass "SolanaWalletProvider exported"
else
  fail "SolanaWalletProvider not exported"
fi

if grep -q "export function ConnectButton" components/solana/connect-button.tsx 2>/dev/null; then
  pass "ConnectButton exported"
else
  fail "ConnectButton not exported"
fi

if grep -q "export function RevenueBadge" components/ui/revenue-badge.tsx 2>/dev/null; then
  pass "RevenueBadge exported"
else
  fail "RevenueBadge not exported"
fi

if grep -q "SolanaWalletProvider" app/agent/layout.tsx 2>/dev/null; then
  pass "layout.tsx wraps with SolanaWalletProvider"
else
  fail "layout.tsx does not wrap with SolanaWalletProvider"
fi

if grep -q "ConnectButton" app/agent/layout.tsx 2>/dev/null; then
  pass "layout.tsx includes ConnectButton"
else
  fail "layout.tsx missing ConnectButton"
fi

if grep -q "RevenueBadge" app/agent/layout.tsx 2>/dev/null; then
  pass "layout.tsx includes RevenueBadge"
else
  fail "layout.tsx missing RevenueBadge"
fi

if grep -q "WalletBadge" app/agent/layout.tsx 2>/dev/null; then
  pass "layout.tsx preserves WalletBadge (EVM)"
else
  fail "layout.tsx missing WalletBadge"
fi

if grep -q "x-payment-invoice" app/agent/page.tsx 2>/dev/null; then
  pass "page.tsx includes x-payment-invoice header"
else
  fail "page.tsx missing x-payment-invoice header"
fi

if grep -q "signTransaction" app/agent/page.tsx 2>/dev/null; then
  pass "page.tsx calls signTransaction"
else
  fail "page.tsx missing signTransaction call"
fi

if grep -q "sendRawTransaction" app/agent/page.tsx 2>/dev/null; then
  pass "page.tsx calls sendRawTransaction"
else
  fail "page.tsx missing sendRawTransaction"
fi
echo ""

# ── 4. API route HTTP method exports ────────────────────────────────
echo "▸ API route exports"

if grep -q "export async function POST" app/api/agent/payment/route.ts 2>/dev/null; then
  pass "payment/route.ts exports POST"
else
  fail "payment/route.ts missing POST export"
fi

if grep -q "export async function POST" app/api/agent/payment/verify/route.ts 2>/dev/null; then
  pass "payment/verify/route.ts exports POST"
else
  fail "payment/verify/route.ts missing POST export"
fi

if grep -q "export async function GET" app/api/agent/revenue/route.ts 2>/dev/null; then
  pass "revenue/route.ts exports GET"
else
  fail "revenue/route.ts missing GET export"
fi

if grep -q "402" app/api/agent/chat/route.ts 2>/dev/null; then
  pass "chat/route.ts has 402 response"
else
  fail "chat/route.ts missing 402 payment gate"
fi
echo ""

# ── 5. Dependencies ─────────────────────────────────────────────────
echo "▸ Dependencies"

check_dep() {
  local pkg="$1"
  local expected="$2"
  local pkg_json="node_modules/$pkg/package.json"
  if [ ! -f "$pkg_json" ]; then
    fail "$pkg not installed"
    return
  fi
  local actual
  actual=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$pkg_json','utf8')).version)" 2>/dev/null)
  if [ "$actual" = "$expected" ]; then
    pass "$pkg@$actual"
  else
    warn "$pkg@$actual (expected $expected)"
  fi
}

check_dep "@solana/web3.js" "1.98.4"
check_dep "@solana/wallet-adapter-react" "0.15.39"
check_dep "@solana/wallet-adapter-wallets" "0.19.35"
check_dep "@solana/wallet-adapter-base" "0.9.25"
check_dep "@solana/spl-token" "0.4.9"
check_dep "@pump-fun/agent-payments-sdk" "3.0.0"
echo ""

# ── 6. No duplicate @solana/web3.js ─────────────────────────────────
echo "▸ Duplicate check"
SOLANA_COPIES=$(find node_modules -name "package.json" -path "*/@solana/web3.js/package.json" 2>/dev/null | wc -l | tr -d ' ')
if [ "$SOLANA_COPIES" -le 1 ]; then
  pass "Single @solana/web3.js copy ($SOLANA_COPIES)"
else
  # Multiple copies are common in nested deps — warn but don't fail
  warn "$SOLANA_COPIES copies of @solana/web3.js found (may cause issues)"
fi
echo ""

# ── 7. Build ─────────────────────────────────────────────────────────
echo "▸ Build"
echo "  Running next build..."
if npx next build 2>&1 | tail -5; then
  pass "next build succeeded"
else
  fail "next build failed"
fi
echo ""

# ── Summary ──────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed, $WARNINGS warnings"
echo "═══════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi

echo ""
echo "All contract checks passed."
