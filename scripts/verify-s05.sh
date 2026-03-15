#!/usr/bin/env bash
# scripts/verify-s05.sh — Structural verification for S05 (Social Media Kit)
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

echo "═══ S05 Social Media Kit — Structural Verification ═══"
echo ""

# ─── Route handler files ───
echo "── Route Handlers ──"
check "profile route exists"              test -f app/api/social/profile/route.tsx
check "banner route exists"               test -f app/api/social/banner/route.tsx
check "template-update route exists"      test -f app/api/social/template-update/route.tsx
check "template-announcement route exists" test -f app/api/social/template-announcement/route.tsx
check "OG image route exists"             test -f app/opengraph-image.tsx

# ─── Font utility ───
echo ""
echo "── Font Utility ──"
check "og-fonts.ts exists"                test -f lib/og-fonts.ts
check "og-fonts exports getOgFonts"      grep -q 'getOgFonts' lib/og-fonts.ts
check "og-fonts has error logging tag"    grep -q '\[og-fonts\]' lib/og-fonts.ts

# ─── Showcase page ───
echo ""
echo "── Showcase Page ──"
check "social page exists"                test -f app/social/page.tsx
check "social page has data array"        grep -q 'socialAssets' app/social/page.tsx
check "social page has download links"    grep -q 'download=' app/social/page.tsx
check "social page includes OG image"     grep -q 'opengraph-image' app/social/page.tsx
check "social page uses Container"        grep -q 'Container' app/social/page.tsx
check "social page uses Section"          grep -q 'Section' app/social/page.tsx
check "social page uses NavBar"           grep -q 'NavBar' app/social/page.tsx
check "social page uses Footer"           grep -q 'Footer' app/social/page.tsx

# ─── Build ───
echo ""
echo "── Build ──"
echo "  Running npm run build..."
if npm run build > /tmp/s05-build.log 2>&1; then
  echo "  ✓ npm run build succeeds"
  PASS=$((PASS + 1))
else
  echo "  ✗ npm run build failed (see /tmp/s05-build.log)"
  FAIL=$((FAIL + 1))
fi

# ─── Build output routes ───
echo ""
echo "── Build Output ──"
check "build includes /social page"       grep -q '/social' /tmp/s05-build.log
check "build includes /api/social routes" grep -q '/api/social' /tmp/s05-build.log

# ─── Summary ───
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
