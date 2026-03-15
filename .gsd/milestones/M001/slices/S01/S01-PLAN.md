# S01: Brand Foundation

**Goal:** Establish DRIP's complete visual identity — color system, typography, logos, voice — with all design tokens defined and a brand guidelines page rendering in-browser.
**Demo:** Brand guidelines page at `/brand` renders showing complete color palette swatches (all 5 palette colors + 3 dark backgrounds), typography specimens (Space Grotesk, Inter, JetBrains Mono), logo concepts (icon, wordmark, lockup), and voice & tone reference. All design tokens generate working Tailwind v4 utilities.

## Must-Haves

- Next.js 15 project scaffold with Tailwind v4, TypeScript, App Router
- Design tokens in `@theme`: palette colors (#bdfffd, #9ffff5, #7cffc4, #6abea7, #5e6973), dark backgrounds (#0a0f14, #111820, #1a2230), font families, spacing scale, border-radius, shadow/glow definitions
- Fonts configured via `next/font/google`: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- Logo SVGs in `public/brand/`: icon mark (water drop), wordmark (DRIP text), combined lockup — both colored and monochrome variants
- Brand guidelines page at `/brand` showing palette swatches, typography specimens, logo display, voice reference
- `docs/brand-guidelines.md` — comprehensive brand reference document covering palette, typography, logo usage, voice & tone, spacing, and glow definitions
- Voice documented as "cool & mysterious" — drops value quietly, never hype, ocean mist energy

## Verification

- `npm run build` completes without errors
- `bash scripts/verify-s01.sh` — checks file existence for all deliverables (logos, docs, tokens)
- Dev server at localhost:3000/brand renders palette, typography, logos, and voice sections (browser verification)

## Tasks

- [x] **T01: Scaffold Next.js 15 project and define design tokens** `est:45m`
  - Why: Everything in S01–S05 builds on this scaffold and these tokens. No project exists yet.
  - Files: `package.json`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `tailwind.config.ts`, `next.config.ts`, `scripts/verify-s01.sh`
  - Do: Run `create-next-app` with Tailwind + TypeScript + App Router. Configure `next/font/google` for Space Grotesk, Inter, JetBrains Mono with CSS variable mode. Define all design tokens via Tailwind v4 `@theme` in globals.css — palette colors, dark backgrounds, font families, spacing scale, border-radius conventions, and shadow/glow definitions (sm/md/lg with aqua tint). Set up root layout with dark background and font variables applied. Create minimal home page. Write `scripts/verify-s01.sh` for file existence checks.
  - Verify: `npm run build` passes, `npm run dev` serves root page with correct fonts and dark background
  - Done when: Project builds cleanly, design tokens generate working Tailwind utilities (e.g. `bg-icy-aqua`, `shadow-glow-md`), fonts render correctly

- [x] **T02: Create logo SVGs, build brand guidelines page, and write brand doc** `est:1h`
  - Why: Delivers the slice demo — brand guidelines visible in-browser — and the boundary outputs S02/S05 need (logos, voice doc).
  - Files: `public/brand/logo-icon.svg`, `public/brand/logo-wordmark.svg`, `public/brand/logo-lockup.svg`, `public/brand/logo-icon-mono.svg`, `public/brand/logo-wordmark-mono.svg`, `public/brand/logo-lockup-mono.svg`, `app/brand/page.tsx`, `docs/brand-guidelines.md`
  - Do: Hand-craft SVG logos — stylized water droplet icon using aqua gradient, DRIP wordmark in Space Grotesk with custom spacing, combined lockup. Export colored (gradient fills) and monochrome (white) variants. All SVGs use explicit hex values, not CSS variables. Build `/brand` page with four sections: palette swatches (color name + hex + swatch for all 8 colors), typography specimens (heading/body/code at multiple sizes), logo gallery (all variants at multiple sizes including 32px favicon test), voice & tone reference (personality traits, do/don't examples, sample copy). Write comprehensive `docs/brand-guidelines.md` covering all brand elements with usage rules.
  - Verify: `bash scripts/verify-s01.sh` passes, `/brand` page renders all four sections in browser, logo SVGs display correctly at 32px and 400px sizes
  - Done when: Brand guidelines page shows complete palette, typography, logos, and voice. All 6 logo SVGs exist. `docs/brand-guidelines.md` is comprehensive enough to guide S02 component design and S05 social copy.

## Observability / Diagnostics

**Runtime signals:**
- `npm run build` exit code — primary health signal for the scaffold and token system
- Dev server stdout — font loading warnings, CSS parse errors surface here
- Browser console — `next/font` logs warnings for failed font loads or missing subsets

**Inspection surfaces:**
- `scripts/verify-s01.sh` — file-existence checks for all slice deliverables; exit 0 = all present
- Tailwind utility generation — use `bg-icy-aqua`, `text-soft-cyan` etc. in markup; if they produce no style, tokens are misconfigured
- Browser DevTools computed styles — verify CSS custom properties (`--font-heading`, `--color-icy-aqua`) resolve on `<html>`
- `/brand` page — visual integration test for palette, typography, logos, voice

**Failure visibility:**
- Missing font CSS variables → text falls back to system font stack (visible in browser)
- Broken `@theme` tokens → Tailwind build warnings + utilities produce no output
- Missing logo SVGs → broken images on `/brand` page + `verify-s01.sh` reports missing files

**Redaction constraints:**
- No secrets in this slice. All values are design tokens (colors, font names, spacing) — safe to log and display.

## Files Likely Touched

- `package.json`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/brand/page.tsx`
- `next.config.ts`
- `public/brand/logo-icon.svg`
- `public/brand/logo-wordmark.svg`
- `public/brand/logo-lockup.svg`
- `public/brand/logo-icon-mono.svg`
- `public/brand/logo-wordmark-mono.svg`
- `public/brand/logo-lockup-mono.svg`
- `docs/brand-guidelines.md`
- `scripts/verify-s01.sh`
