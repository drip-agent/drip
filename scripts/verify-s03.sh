#!/usr/bin/env bash
# verify-s03.sh — Automated verification for S03 (Animation Engine)
set -euo pipefail

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

echo "S03 Animation Engine Verification"
echo "==================================="
echo ""

# ── File existence: 5 animation components ──
echo "Animation Components:"

ANIM_FILES=("scroll-reveal.tsx" "particle-field.tsx" "fade-in-stagger.tsx" "glow-hover.tsx" "page-transition.tsx")
for f in "${ANIM_FILES[@]}"; do
  test -f "components/animation/$f"; check "components/animation/$f exists" $?
done

echo ""

# ── File existence: 2 utility modules ──
echo "Utility Modules:"
test -f "lib/gsap-utils.ts"; check "lib/gsap-utils.ts exists" $?
test -f "lib/motion-variants.ts"; check "lib/motion-variants.ts exists" $?

echo ""

# ── Package dependencies ──
echo "Package Dependencies:"
grep -q '"gsap"' package.json; check "gsap in package.json" $?
grep -q '"@gsap/react"' package.json; check "@gsap/react in package.json" $?
grep -q '"motion"' package.json; check "motion in package.json" $?

echo ""

# ── 'use client' directive in all 5 component files ──
echo "'use client' Directives:"
for f in "${ANIM_FILES[@]}"; do
  head -1 "components/animation/$f" | grep -q "use client"; check "components/animation/$f has 'use client'" $?
done

echo ""

# ── prefers-reduced-motion handling ──
echo "Reduced Motion Handling:"
grep -q "prefers-reduced-motion" lib/gsap-utils.ts; check "gsap-utils.ts handles prefers-reduced-motion" $?
grep -q "prefers-reduced-motion" components/animation/particle-field.tsx; check "particle-field.tsx handles prefers-reduced-motion" $?

echo ""

# ── motion-variants exports (all 8 variant names) ──
echo "Motion Variant Exports:"
VARIANT_NAMES=("fadeIn" "slideUp" "slideDown" "slideLeft" "slideRight" "scaleIn" "staggerContainer" "staggerItem")
for v in "${VARIANT_NAMES[@]}"; do
  grep -q "export const $v" lib/motion-variants.ts; check "motion-variants.ts exports $v" $?
done

echo ""

# ── /motion page exists ──
echo "Demo Page:"
test -f "app/motion/page.tsx"; check "app/motion/page.tsx exists" $?

echo ""

# ── PageTransition in layout ──
echo "PageTransition Integration:"
grep -q "PageTransition" app/layout.tsx; check "PageTransition imported in app/layout.tsx" $?

echo ""

# ── Build check ──
echo "Build:"
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?
if [ "$BUILD_EXIT" -eq 0 ]; then
  check "npm run build succeeds" 0
else
  check "npm run build succeeds" 1
fi

if echo "$BUILD_OUTPUT" | grep -q "/motion"; then
  check "/motion route in build output" 0
else
  check "/motion route in build output" 1
fi

echo ""

# ── Summary ──
TOTAL=$((PASS + FAIL))
echo "==================================="
echo "Results: $PASS passed, $FAIL failed (out of $TOTAL checks)"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
