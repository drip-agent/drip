#!/usr/bin/env bash
# scripts/verify-m002-s01.sh — Contract verification for M002/S01
# Checks file existence, exports, dependencies, and build.

set -euo pipefail

PASS=0
FAIL=0
TOTAL=0

check() {
  TOTAL=$((TOTAL + 1))
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    echo "  ✅ $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $label"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "═══════════════════════════════════════════"
echo "  M002/S01 Contract Verification"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. File existence ──
echo "📁 File existence"

check "proxy.ts exists" test -f proxy.ts
check "lib/x402-client.ts exists" test -f lib/x402-client.ts
check "lib/skills/types.ts exists" test -f lib/skills/types.ts
check "lib/skills/registry.ts exists" test -f lib/skills/registry.ts
check "lib/skills/research.ts exists" test -f lib/skills/research.ts
check "app/api/agent/chat/route.ts exists" test -f app/api/agent/chat/route.ts
check "app/agent/layout.tsx exists" test -f app/agent/layout.tsx
check "app/agent/page.tsx exists" test -f app/agent/page.tsx

echo ""

# ── 2. Dependencies ──
echo "📦 Dependencies in package.json"

check "ai" grep -q '"ai"' package.json
check "@ai-sdk/react" grep -q '"@ai-sdk/react"' package.json
check "@openrouter/ai-sdk-provider" grep -q '"@openrouter/ai-sdk-provider"' package.json
check "@x402/fetch" grep -q '"@x402/fetch"' package.json
check "@x402/evm" grep -q '"@x402/evm"' package.json
check "viem" grep -q '"viem"' package.json
check "zod" grep -q '"zod"' package.json
check "server-only" grep -q '"server-only"' package.json

echo ""

# ── 3. Export contracts ──
echo "📤 Export contracts"

check "proxy.ts exports config" grep -q 'export const config' proxy.ts
check "types.ts exports SkillDefinition" grep -q 'export interface SkillDefinition' lib/skills/types.ts
check "registry.ts exports registerSkill" grep -q 'export function registerSkill' lib/skills/registry.ts
check "registry.ts exports getSkills" grep -q 'export function getSkills' lib/skills/registry.ts
check "registry.ts exports getAllTools" grep -q 'export function getAllTools' lib/skills/registry.ts
check "registry.ts exports getSystemPrompt" grep -q 'export function getSystemPrompt' lib/skills/registry.ts
check "research.ts exports SkillDefinition" grep -q 'export.*researchSkill' lib/skills/research.ts
check "chat/route.ts exports POST" grep -q 'export async function POST' app/api/agent/chat/route.ts

echo ""

# ── 4. Build ──
echo "🔨 Build"

check "npm run build succeeds" npm run build

echo ""
echo "═══════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed ($TOTAL total)"
echo "═══════════════════════════════════════════"
echo ""

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
