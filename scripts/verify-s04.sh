#!/usr/bin/env bash
# scripts/verify-s04.sh — Structural verification for S04 (Landing Page)
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

echo "═══ S04 Landing Page — Structural Verification ═══"
echo ""

# ─── File existence ───
echo "── File Existence ──"
check "app/page.tsx exists"               test -f app/page.tsx
check "app/opengraph-image.tsx exists"    test -f app/opengraph-image.tsx
check "app/twitter-image.tsx exists"      test -f app/twitter-image.tsx
check "app/layout.tsx exists"             test -f app/layout.tsx
check "app/globals.css exists"            test -f app/globals.css

# ─── Section anchor IDs ───
echo ""
echo "── Section Anchors ──"
check "id=\"features\" in page.tsx"       grep -q 'id="features"' app/page.tsx
check "id=\"how-it-works\" in page.tsx"   grep -q 'id="how-it-works"' app/page.tsx
check "id=\"agent\" in page.tsx"          grep -q 'id="agent"' app/page.tsx
check "id=\"early-access\" in page.tsx"   grep -q 'id="early-access"' app/page.tsx

# ─── Key imports ───
echo ""
echo "── Key Imports ──"
check "ParticleField import"              grep -q 'ParticleField' app/page.tsx
check "ScrollReveal import"               grep -q 'ScrollReveal' app/page.tsx
check "FadeInStagger import"              grep -q 'FadeInStagger' app/page.tsx

# ─── No Pricing references ───
echo ""
echo "── No Pricing ──"
check "NavBar has no Pricing"             bash -c '! grep -qi "pricing" components/layout/navbar.tsx'
check "Footer has no Pricing"             bash -c '! grep -qi "pricing" components/layout/footer.tsx'

# ─── Metadata ───
echo ""
echo "── Metadata ──"
check "layout.tsx has openGraph"          grep -q 'openGraph' app/layout.tsx
check "layout.tsx has twitter"            grep -q 'twitter' app/layout.tsx
check "layout.tsx has metadataBase"       grep -q 'metadataBase' app/layout.tsx

# ─── CSS ───
echo ""
echo "── CSS ──"
check "scroll-padding-top in globals.css" grep -q 'scroll-padding-top' app/globals.css

# ─── Semantic HTML ───
echo ""
echo "── Semantic HTML ──"
check "h1 tag in page.tsx"                grep -q '<h1' app/page.tsx

# ─── Build ───
echo ""
echo "── Build ──"
echo "  Running npm run build..."
if npm run build > /tmp/s04-build.log 2>&1; then
  echo "  ✓ npm run build succeeds"
  PASS=$((PASS + 1))
else
  echo "  ✗ npm run build failed (see /tmp/s04-build.log)"
  FAIL=$((FAIL + 1))
fi

# ─── Summary ───
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
