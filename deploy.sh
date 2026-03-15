#!/bin/bash
# Deploy DRIP to production
# Usage: ./deploy.sh "commit message"

set -e

MSG="${1:-update}"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  💧 DRIP Deploy"
echo ""

# Ensure remote uses token (bypass macOS Keychain)
if [ -f "$DIR/.env.github" ]; then
  TOKEN=$(grep GITHUB_TOKEN "$DIR/.env.github" | cut -d= -f2-)
  git -C "$DIR" remote set-url origin "https://drip-agent:${TOKEN}@github.com/drip-agent/drip.git"
fi

# Check for uncommitted changes
if [ -n "$(git -C "$DIR" status --porcelain)" ]; then
  echo "  📦 Staging changes..."
  git -C "$DIR" add -A
  git -C "$DIR" commit -m "$MSG"
else
  echo "  ✓ No new changes to commit"
fi

echo "  🚀 Pushing to production..."
git -C "$DIR" push origin main

# Clean token from remote URL after push
git -C "$DIR" remote set-url origin "https://github.com/drip-agent/drip.git"

echo ""
echo "  ✅ Pushed! Vercel will auto-deploy in ~60s"
echo "  📍 https://drip.surf"
echo "  📊 https://vercel.com/drip-agents-projects/drip"
echo ""
