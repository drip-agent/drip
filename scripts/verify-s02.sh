#!/usr/bin/env bash
# verify-s02.sh — Contract checks for S02: Token Display & Launch Configuration
set -euo pipefail

PASS=0
FAIL=0

check() {
  local label="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "  ✓ $label"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $label"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══ S02 Contract Checks ═══"
echo ""

echo "── File patterns ──"
check "navbar.tsx contains #token" grep -q '#token' components/layout/navbar.tsx
check "page.tsx contains token section" grep -q 'id="token"' app/page.tsx

echo ""
echo "── Navbar link ──"
check "Token label in navLinks" grep -q '"Token"' components/layout/navbar.tsx
check "#token href in navLinks" grep -q '"#token"' components/layout/navbar.tsx

echo ""
echo "── Token section ──"
check "id=\"token\" section exists" grep -q 'id="token"' app/page.tsx
check "Section component used for token" grep -q 'id="token"' app/page.tsx

echo ""
echo "── Component usage ──"
check "Section imported" grep -q "from.*layout/section" app/page.tsx
check "Card component used" grep -q "Card" app/page.tsx
check "Card variant=featured used" grep -q 'variant="featured"' app/page.tsx
check "ScrollReveal used in page" grep -q "ScrollReveal" app/page.tsx
check "FadeInStagger used in page" grep -q "FadeInStagger" app/page.tsx
check "Badge component used" grep -q "Badge" app/page.tsx

echo ""
echo "── Revenue fetch ──"
check "useEffect present" grep -q "useEffect" app/page.tsx
check "/api/agent/revenue fetch" grep -q '/api/agent/revenue' app/page.tsx

echo ""
echo "── Copy-to-clipboard ──"
check "navigator.clipboard usage" grep -q 'navigator.clipboard' app/page.tsx

echo ""
echo "── PumpFun link ──"
check "pump.fun URL present" grep -q 'pump.fun' app/page.tsx

echo ""
echo "── Graceful fallbacks ──"
check "Coming soon fallback text" grep -q 'Coming soon' app/page.tsx
check "Fetch error fallback" grep -q 'fetchError' app/page.tsx

echo ""
echo "── Observability ──"
check "Console error on fetch failure" grep -q '\[token-section\]' app/page.tsx
check "Clipboard API warning" grep -q 'Clipboard API unavailable' app/page.tsx

echo ""
echo "── Build ──"
if npm run build > /dev/null 2>&1; then
  echo "  ✓ npm run build succeeds"
  PASS=$((PASS + 1))
else
  echo "  ✗ npm run build failed"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "═══════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
