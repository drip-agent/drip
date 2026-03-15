#!/usr/bin/env bash
# ─── verify-m002-s02.sh ─────────────────────────────────────────────
# Slice verification: S02 — Discovery Feed (M002)
# Checks all contract requirements for the feed data layer, cron
# endpoint, feed page, and build health.
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

echo "═══ S02: Discovery Feed — Slice Verification ═══"
echo ""

# ─── File Existence ──────────────────────────────────────────────────

echo "── File Existence ──"

[ -f "lib/feed.ts" ] && check "lib/feed.ts exists" 0 || check "lib/feed.ts exists" 1

[ -f "app/api/cron/feed/route.ts" ] && check "app/api/cron/feed/route.ts exists" 0 || check "app/api/cron/feed/route.ts exists" 1

[ -f "app/agent/feed/page.tsx" ] && check "app/agent/feed/page.tsx exists" 0 || check "app/agent/feed/page.tsx exists" 1

[ -f "vercel.json" ] && check "vercel.json exists" 0 || check "vercel.json exists" 1

echo ""

# ─── Export Checks: lib/feed.ts ──────────────────────────────────────

echo "── Exports: lib/feed.ts ──"

grep -q "export interface FeedEntry" lib/feed.ts && check "FeedEntry type exported" 0 || check "FeedEntry type exported" 1

grep -q "export async function saveFeedEntry" lib/feed.ts && check "saveFeedEntry exported" 0 || check "saveFeedEntry exported" 1

grep -q "export async function getFeedEntries" lib/feed.ts && check "getFeedEntries exported" 0 || check "getFeedEntries exported" 1

echo ""

# ─── Export Checks: cron route ───────────────────────────────────────

echo "── Exports: cron route ──"

grep -q "export async function GET" app/api/cron/feed/route.ts && check "GET handler exported" 0 || check "GET handler exported" 1

grep -q "export const maxDuration" app/api/cron/feed/route.ts && check "maxDuration exported" 0 || check "maxDuration exported" 1

echo ""

# ─── Feed Page Checks ───────────────────────────────────────────────

echo "── Feed Page ──"

if grep -q '"use client"' app/agent/feed/page.tsx; then
  check "No 'use client' directive (server component)" 1
else
  check "No 'use client' directive (server component)" 0
fi

grep -q 'export const dynamic = "force-dynamic"' app/agent/feed/page.tsx && check "force-dynamic export present" 0 || check "force-dynamic export present" 1

grep -q "getFeedEntries" app/agent/feed/page.tsx && check "Uses getFeedEntries from data layer" 0 || check "Uses getFeedEntries from data layer" 1

grep -q "Card" app/agent/feed/page.tsx && check "Uses Card component" 0 || check "Uses Card component" 1

grep -q "Badge" app/agent/feed/page.tsx && check "Uses Badge component" 0 || check "Uses Badge component" 1

grep -q "FadeInStagger" app/agent/feed/page.tsx && check "Uses FadeInStagger component" 0 || check "Uses FadeInStagger component" 1

grep -q '"featured"' app/agent/feed/page.tsx && check "Featured variant for latest entry" 0 || check "Featured variant for latest entry" 1

grep -q "calibrating its sensors" app/agent/feed/page.tsx && check "Empty state message present" 0 || check "Empty state message present" 1

if grep -q "grid-cols-1" app/agent/feed/page.tsx && \
   grep -q "md:grid-cols-2" app/agent/feed/page.tsx && \
   grep -q "lg:grid-cols-3" app/agent/feed/page.tsx; then
  check "Responsive grid (1/2/3 cols)" 0
else
  check "Responsive grid (1/2/3 cols)" 1
fi

echo ""

# ─── Dependency Check ────────────────────────────────────────────────

echo "── Dependencies ──"

grep -q '"@vercel/kv"' package.json && check "@vercel/kv in package.json" 0 || check "@vercel/kv in package.json" 1

echo ""

# ─── Auth Check ──────────────────────────────────────────────────────

echo "── Security ──"

grep -q "CRON_SECRET" app/api/cron/feed/route.ts && check "CRON_SECRET referenced in cron route" 0 || check "CRON_SECRET referenced in cron route" 1

echo ""

# ─── Cron Config ─────────────────────────────────────────────────────

echo "── Cron Config ──"

if grep -q '"schedule"' vercel.json && grep -q '"/api/cron/feed"' vercel.json; then
  check "vercel.json has cron entry for /api/cron/feed" 0
else
  check "vercel.json has cron entry for /api/cron/feed" 1
fi

echo ""

# ─── Build Check ─────────────────────────────────────────────────────

echo "── Build ──"

BUILD_OUTPUT=$(npm run build 2>&1) || true
if echo "$BUILD_OUTPUT" | grep -q "✓ Generating static pages"; then
  check "npm run build succeeds" 0
else
  check "npm run build succeeds" 1
  # Show last 20 lines on failure for diagnosis
  echo "$BUILD_OUTPUT" | tail -20
fi

# Check that /agent/feed route compiled
if echo "$BUILD_OUTPUT" | grep -q "/agent/feed"; then
  check "/agent/feed route in build output" 0
else
  check "/agent/feed route in build output" 1
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
