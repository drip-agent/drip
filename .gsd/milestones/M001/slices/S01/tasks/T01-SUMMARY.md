---
id: T01
parent: S01
milestone: M001
provides:
  - Next.js project scaffold with Tailwind v4, TypeScript, App Router
  - Complete design token system (8 colors, 3 glow shadows, spacing, radii)
  - Three brand fonts configured via next/font/google with CSS variable mode
  - Root layout with dark background and font integration
  - Slice verification script
key_files:
  - app/layout.tsx
  - app/globals.css
  - app/page.tsx
  - package.json
  - scripts/verify-s01.sh
key_decisions:
  - "D015: Used Next.js 16.1.6 (latest) instead of 15 — same API surface, create-next-app@latest default"
  - "D013: Tailwind v4 @theme in globals.css, no tailwind.config.ts needed"
patterns_established:
  - "Font integration: next/font/google with variable mode → CSS vars on <html> → @theme inline → font-heading/font-body/font-mono utilities"
  - "Color tokens: --color-{name} in @theme → bg-{name}, text-{name} utilities auto-generated"
  - "Surface hierarchy: dark-deepest (page bg) → dark-surface (cards) → dark-elevated (raised elements)"
  - "Glow shadows: shadow-glow-sm/md/lg using aqua rgba values"
observability_surfaces:
  - "npm run build — exit 0 confirms scaffold + tokens + fonts wired correctly"
  - "bash scripts/verify-s01.sh — file existence checker for all S01 deliverables"
  - "grep 'icy-aqua' app/globals.css — token presence check"
  - "Browser DevTools getComputedStyle(html) — verify CSS custom properties resolve"
duration: 15m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Scaffold Next.js project and define design tokens

**Bootstrapped DRIP project with Next.js 16 + Tailwind v4, configured three brand fonts via next/font/google, and defined complete design token system (8 colors, 3 glow shadows, spacing, border-radius) in CSS-first @theme.**

## What Happened

Scaffolded via `create-next-app@latest` in a temp directory (project directory name had capital letter that npm rejects), then moved files. Installed Next.js 16.1.6 with Tailwind v4 (`@tailwindcss/postcss ^4`), TypeScript, and App Router.

Configured `Space_Grotesk`, `Inter`, and `JetBrains_Mono` via `next/font/google` with `variable` mode and `display: "swap"`. CSS variables applied to `<html>`, then wired to Tailwind via `@theme inline` for font families.

Defined all design tokens in `app/globals.css` using Tailwind v4's `@theme` directive:
- 5 palette colors: icy-aqua, soft-cyan, aquamarine, ocean-mist, blue-slate
- 3 dark backgrounds: dark-deepest (#0a0f14), dark-surface (#111820), dark-elevated (#1a2230)
- 3 glow shadows: glow-sm, glow-md, glow-lg with aqua rgba tints
- Custom spacing (18, 22, 30, 34), border-radius (card, pill, button)

Built minimal home page exercising all token categories — palette swatches, surface cards, typography specimens, and glow shadow demos.

Created `scripts/verify-s01.sh` with file existence checks for all S01 deliverables. T02 files correctly marked as expected-missing.

## Verification

- `npm run build` — exits 0, compiles in 1.7s (Turbopack)
- `grep -c 'icy-aqua' app/globals.css` — returns 1
- `bash scripts/verify-s01.sh` — 16 passed, 8 warnings (T02 files expected-missing), 0 failed
- Browser at localhost:3004 — dark background (#0a0f14), all 5 palette colors render, 3 font families confirmed via getComputedStyle, glow shadows visible
- Browser assertions: 9/9 passed (URL, text visibility for DRIP/fonts, selector visibility for tokens, no console errors)

### Slice-level verification status (T01 checkpoint):
- ✅ `npm run build` completes without errors
- ✅ `bash scripts/verify-s01.sh` — all critical checks pass (T02 files expected-missing)
- ⬜ Dev server at localhost:3000/brand renders palette, typography, logos, and voice sections — pending T02

## Diagnostics

- **Build health:** `npm run build` — if it fails, check `app/globals.css` for @theme syntax errors or `app/layout.tsx` for font import issues
- **Token check:** `grep -E '(icy-aqua|soft-cyan|aquamarine|ocean-mist|blue-slate|dark-deepest|dark-surface|dark-elevated|glow-sm|glow-md|glow-lg)' app/globals.css`
- **Font check:** In browser DevTools, `getComputedStyle(document.documentElement).getPropertyValue('--font-heading')` should return `"Space Grotesk", ...`
- **Slice check:** `bash scripts/verify-s01.sh`

## Deviations

- **Next.js 16 instead of 15:** `create-next-app@latest` installed 16.1.6 (current latest). Same App Router API, same Tailwind v4 integration. Recorded as D015.
- **No tailwind.config.ts:** Tailwind v4 is CSS-first. The scaffold generated `postcss.config.mjs` instead. All tokens live in `app/globals.css` via `@theme`. This aligns with D013.
- **Port 3004:** Dev server used port 3004 because 3000 was occupied by another project. Not a project issue.

## Known Issues

None.

## Files Created/Modified

- `package.json` — Next.js 16 project with Tailwind v4, TypeScript, ESLint
- `app/layout.tsx` — Root layout with three Google Fonts (CSS variable mode) and dark background
- `app/globals.css` — Complete design token system via Tailwind v4 @theme (8 colors, 3 shadows, spacing, radii, fonts)
- `app/page.tsx` — Minimal dark-themed home page exercising all token categories
- `next.config.ts` — Next.js configuration (default scaffold)
- `postcss.config.mjs` — PostCSS config with @tailwindcss/postcss (Tailwind v4)
- `tsconfig.json` — TypeScript configuration
- `eslint.config.mjs` — ESLint configuration
- `scripts/verify-s01.sh` — Slice verification script (file existence + token presence)
- `.gsd/milestones/M001/slices/S01/S01-PLAN.md` — Added Observability / Diagnostics section
- `.gsd/milestones/M001/slices/S01/tasks/T01-PLAN.md` — Added Observability Impact section
- `.gsd/DECISIONS.md` — Appended D015 (Next.js 16 version choice)
