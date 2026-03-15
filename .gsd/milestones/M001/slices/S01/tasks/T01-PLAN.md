---
estimated_steps: 5
estimated_files: 7
---

# T01: Scaffold Next.js 15 project and define design tokens

**Slice:** S01 — Brand Foundation
**Milestone:** M001

## Description

Bootstrap the DRIP project from empty repo. Set up Next.js 15 with App Router, TypeScript, and Tailwind v4. Configure all three brand fonts via `next/font/google` with CSS variable mode. Define the complete design token system in Tailwind v4's `@theme` directive — palette colors, dark backgrounds, font families, spacing scale, border-radius conventions, and glow shadow definitions. Set up root layout with dark background and font CSS variables applied to `<html>`. Create a verification script for the slice.

## Steps

1. Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"` (or equivalent flags for current Next.js 15). Verify the scaffold builds.
2. Configure `next/font/google` in `app/layout.tsx` — import `Space_Grotesk`, `Inter`, `JetBrains_Mono` with `subsets: ['latin']`, `variable` mode. Apply CSS variable classes to `<html>` element. Set dark background on body.
3. Define all design tokens in `app/globals.css` via Tailwind v4 `@theme` directive:
   - Palette colors: `--color-icy-aqua: #bdfffd`, `--color-soft-cyan: #9ffff5`, `--color-aquamarine: #7cffc4`, `--color-ocean-mist: #6abea7`, `--color-blue-slate: #5e6973`
   - Dark backgrounds: `--color-dark-deepest: #0a0f14`, `--color-dark-surface: #111820`, `--color-dark-elevated: #1a2230`
   - Font families: heading, body, mono mapped to the CSS variables from next/font
   - Spacing scale, border-radius conventions
   - Shadow/glow definitions: `--shadow-glow-sm`, `--shadow-glow-md`, `--shadow-glow-lg` using aqua palette colors
4. Update `app/page.tsx` to a minimal dark-themed home page that confirms tokens work (just enough to visually verify fonts and background).
5. Create `scripts/verify-s01.sh` — checks existence of all key deliverables (logos, docs, globals.css tokens, brand page).

## Must-Haves

- [ ] Next.js 15 + Tailwind v4 + TypeScript + App Router scaffold builds cleanly
- [ ] Three fonts load via `next/font/google` with CSS variable mode — no layout shift
- [ ] All 8 color tokens defined in `@theme` and generating utilities (`bg-icy-aqua`, `text-soft-cyan`, etc.)
- [ ] Glow shadow tokens defined (sm/md/lg) with aqua color
- [ ] Dark background applied to root layout
- [ ] Verification script covers all slice deliverables

## Verification

- `npm run build` exits 0
- `npm run dev` — root page loads with dark background and correct fonts visible
- `grep -c 'icy-aqua' app/globals.css` returns at least 1 (tokens defined)
- `bash scripts/verify-s01.sh` runs without error (may report missing files that T02 creates — that's expected)

## Inputs

- Empty repository with only `.git/`, `.gsd/`, `.gitignore`
- Color palette: D003 (Icy Aqua #bdfffd, Soft Cyan #9ffff5, Aquamarine #7cffc4, Ocean Mist #6abea7, Blue Slate #5e6973)
- Dark backgrounds from research: #0a0f14 (deepest), #111820 (surface), #1a2230 (elevated)
- Typography from research: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- Tailwind v4 uses `@theme` not `tailwind.config.ts` for token generation

## Observability Impact

**Signals added:**
- `scripts/verify-s01.sh` — file-existence checker for all S01 deliverables; exit code 0 means all files present
- Design token presence in `app/globals.css` — grep-verifiable (`grep 'icy-aqua' app/globals.css`)
- Font CSS variables on `<html>` element — inspectable via browser DevTools or `getComputedStyle`
- `npm run build` exit code — confirms scaffold + tokens + fonts are all wired correctly

**How a future agent inspects this task:**
- Run `npm run build` — if it fails, scaffold or token syntax is broken
- Run `bash scripts/verify-s01.sh` — reports which deliverable files exist/missing
- Check `app/globals.css` for `@theme` block with all 8 color tokens and 3 shadow tokens
- Check `app/layout.tsx` for three font imports with `variable` property

**Failure state visibility:**
- Build failure → `npm run build` stderr shows the specific parse/compile error
- Missing tokens → Tailwind generates no utility for that token name; class has no effect in browser
- Missing fonts → browser renders system fallback; `next/font` logs warning to dev server console

## Expected Output

- `package.json` — Next.js 15 project with dependencies
- `app/layout.tsx` — Root layout with font CSS variables and dark background
- `app/globals.css` — Complete design token system via `@theme`
- `app/page.tsx` — Minimal dark-themed home page
- `next.config.ts` — Next.js config
- `tailwind.config.ts` — Tailwind config (may be minimal with v4)
- `scripts/verify-s01.sh` — Slice verification script
