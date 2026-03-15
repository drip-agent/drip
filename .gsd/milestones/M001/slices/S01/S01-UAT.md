# S01: Brand Foundation — UAT

**Milestone:** M001
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven + live-runtime)
- Why this mode is sufficient: S01 produces static assets (SVGs, docs) verifiable by file checks, plus a live brand page verifiable in-browser. No backend logic or user flows to test.

## Preconditions

- Node.js installed (v18+)
- `npm install` completed in project root
- Dev server running: `npm run dev` (serves at localhost:3000 or next available port)

## Smoke Test

Run `bash scripts/verify-s01.sh` — must exit 0 with 24/24 passed. Then open `/brand` in browser — page should render on dark background with aqua-themed content.

## Test Cases

### 1. Build completes without errors

1. Run `npm run build`
2. **Expected:** Exit code 0. Output shows 3 routes generated: `/`, `/_not-found`, `/brand`. No TypeScript errors, no CSS warnings.

### 2. Design tokens produce working Tailwind utilities

1. Open `app/globals.css` in editor
2. Confirm `@theme` block contains: `--color-icy-aqua: #bdfffd`, `--color-soft-cyan: #9ffff5`, `--color-aquamarine: #7cffc4`, `--color-ocean-mist: #6abea7`, `--color-blue-slate: #5e6973`
3. Confirm dark backgrounds: `--color-dark-deepest: #0a0f14`, `--color-dark-surface: #111820`, `--color-dark-elevated: #1a2230`
4. Confirm glow shadows: `--shadow-glow-sm`, `--shadow-glow-md`, `--shadow-glow-lg` defined with aqua rgba values
5. Open dev server root page in browser
6. **Expected:** `bg-icy-aqua`, `text-soft-cyan`, `shadow-glow-md` classes produce visible styles. Page background is #0a0f14 (dark-deepest).

### 3. Fonts load and render correctly

1. Open browser DevTools on any page
2. Run `getComputedStyle(document.documentElement).getPropertyValue('--font-heading')`
3. Run `getComputedStyle(document.documentElement).getPropertyValue('--font-body')`
4. Run `getComputedStyle(document.documentElement).getPropertyValue('--font-mono')`
5. **Expected:** Returns font family strings containing "Space Grotesk", "Inter", and "JetBrains Mono" respectively. Headings render in Space Grotesk (geometric sans), body in Inter, code in JetBrains Mono.

### 4. Logo SVGs exist and render correctly

1. Confirm all 6 files exist: `ls -la public/brand/logo-{icon,wordmark,lockup}{,.svg} public/brand/logo-{icon,wordmark,lockup}-mono.svg`
2. Open `/brand/logo-icon.svg` directly in browser
3. Open `/brand/logo-icon-mono.svg` directly in browser
4. **Expected:** Colored icon shows a water droplet shape with aqua gradient (#bdfffd → #7cffc4). Mono icon shows same shape in white (#ffffff). All 6 SVGs have non-zero file sizes and valid `viewBox` attributes.

### 5. Brand page — Palette section

1. Navigate to `/brand` in browser
2. Scroll to palette section
3. **Expected:** 8 color swatches visible — 5 brand colors (Icy Aqua, Soft Cyan, Aquamarine, Ocean Mist, Blue Slate) and 3 dark backgrounds (Dark Deepest, Dark Surface, Dark Elevated). Each swatch shows color name, hex code, and token name. Swatch backgrounds match their hex values.

### 6. Brand page — Typography section

1. Navigate to `/brand` in browser
2. Scroll to typography section
3. **Expected:** Three font specimen groups: Space Grotesk (shown at H1–H4 heading sizes), Inter (body text at multiple sizes), JetBrains Mono (code specimens). Each group clearly identifies the font name and shows visible size/weight differences.

### 7. Brand page — Logo gallery section

1. Navigate to `/brand` in browser
2. Scroll to logos section
3. **Expected:** All 6 logo variants displayed — icon, wordmark, and lockup in both colored and mono. Icon scalability test shows the droplet at 32px, 64px, and 128px sizes. 32px icon is recognizable (favicon-viable). No broken image placeholders.

### 8. Brand page — Voice & tone section

1. Navigate to `/brand` in browser
2. Scroll to voice section
3. **Expected:** Personality traits listed (cool, mysterious, minimal, ocean energy). Do/Don't examples with visual distinction (e.g., border accents). Sample copy examples showing the DRIP voice in context.

### 9. Brand guidelines document

1. Open `docs/brand-guidelines.md`
2. **Expected:** Document covers: color palette (all 8 colors with hex values and usage guidance), typography (3 fonts with roles), logo usage rules (clear space, minimum sizes, don't-do list), voice & tone (personality, do/don't, sample copy), glow/shadow system, spacing/radius conventions. Document is comprehensive enough to guide S02 component design without needing to reference /brand page.

### 10. Verification script covers all deliverables

1. Run `bash scripts/verify-s01.sh`
2. **Expected:** 24/24 checks pass. Checks cover: project scaffold files (5), design tokens in globals.css (11), logo SVGs (6), brand page (1), brand doc (1). Exit code 0.

## Edge Cases

### Font fallback behavior

1. In browser DevTools Network tab, block requests to `fonts.googleapis.com`
2. Reload the page
3. **Expected:** Text still renders using system font fallback stack. Page doesn't break or show blank text. The `display: "swap"` configuration ensures text is always visible.

### SVG at extreme sizes

1. On `/brand` page, right-click the droplet icon → open in new tab
2. Zoom browser to 500%
3. **Expected:** Vector artwork scales cleanly with no pixelation. Gradient transitions remain smooth.

### Dark mode consistency

1. Check the `<html>` element's background color
2. **Expected:** Background is `#0a0f14` (dark-deepest). No flash of white or light background on initial load. All page content renders on dark surfaces.

## Failure Signals

- `npm run build` exits non-zero — scaffold or token syntax broken
- `scripts/verify-s01.sh` reports failures — missing deliverable files
- `/brand` page shows 404 — route not created or build error in page component
- Broken image icons on `/brand` — SVG files missing or malformed
- Text renders in system font (Arial/Helvetica) — font variable chain broken
- Color swatches show wrong colors or no background — token definitions incorrect
- White/light flash on page load — dark background not applied to root layout

## Requirements Proved By This UAT

- R001 (Brand Identity System) — All UAT cases collectively prove: color palette defined and rendering (TC2, TC5), typography selected and working (TC3, TC6), logo concepts created (TC4, TC7), voice & tone documented (TC8), comprehensive brand reference exists (TC9).

## Not Proven By This UAT

- R002 (Landing Page) — Not built yet, S04 deliverable
- R003 (Dark Theme Design Language) — Tokens defined but component library not built yet (S02)
- R012 (Responsive Design) — Brand page responsiveness not a requirement; landing page responsiveness is S04
- R013 (Social Assets) — Brand assets exist but social-specific exports (profile pic, banner, OG image) are S05

## Notes for Tester

- Dev server may run on a port other than 3000 if that port is occupied. Check terminal output for actual port.
- Logo SVGs are geometric/minimalist by design — they're hand-crafted code, not professional vector illustrations. Evaluate for brand consistency and scalability, not illustration quality.
- The root `/` page is a minimal token showcase, not the landing page. The brand page at `/brand` is the S01 demo surface.
