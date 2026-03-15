---
estimated_steps: 4
estimated_files: 8
---

# T02: Create logo SVGs, build brand guidelines page, and write brand doc

**Slice:** S01 — Brand Foundation
**Milestone:** M001

## Description

Create DRIP's logo suite as hand-crafted SVGs, build the brand guidelines page at `/brand` that renders the complete brand system in-browser, and write the comprehensive brand guidelines markdown document. The logos use a stylized water droplet motif with aqua palette gradients. The guidelines page serves as the visual proof that all brand elements work together. The markdown doc is the portable reference for all future design and copy work.

## Steps

1. Create logo SVGs in `public/brand/`:
   - `logo-icon.svg` — Stylized water droplet using aqua gradient (#bdfffd → #7cffc4). Simple, geometric, works at 32px.
   - `logo-wordmark.svg` — "DRIP" text in Space Grotesk style with custom letter-spacing. Aqua gradient fill.
   - `logo-lockup.svg` — Icon + wordmark combined with proper spacing.
   - Monochrome variants (`-mono.svg`) of all three — white (#ffffff) fills for use on any background.
   - All SVGs use explicit hex/gradient values, not CSS variables (portability for social assets).
2. Build `/brand` page (`app/brand/page.tsx`) with four sections:
   - **Palette**: All 8 colors as swatches — color name, hex value, visual swatch block. Show palette colors and dark backgrounds separately.
   - **Typography**: Specimens for Space Grotesk (heading sizes h1–h4), Inter (body text, small text), JetBrains Mono (code blocks). Show each at representative sizes.
   - **Logos**: Gallery displaying all 6 logo variants. Show icon at 32px, 64px, 128px to prove scalability. Show all variants on dark background.
   - **Voice & Tone**: Personality traits, communication principles, do/don't examples, sample copy in the DRIP voice.
3. Write `docs/brand-guidelines.md` — comprehensive reference covering:
   - Color system: palette values, dark backgrounds, usage rules (which colors for text, accents, backgrounds, glows)
   - Typography: font stack, size scale, weight usage, when to use each font
   - Logo: variants, spacing rules, minimum sizes, what not to do
   - Voice & tone: personality ("cool & mysterious"), principles, do/don't, example phrases
   - Glow/shadow usage: when to use sm/md/lg, which colors
4. Verify all deliverables: run `scripts/verify-s01.sh`, visually check `/brand` page in browser.

## Must-Haves

- [ ] 6 logo SVG files in `public/brand/` (icon, wordmark, lockup × colored, mono)
- [ ] Logo icon works visually at 32px (favicon-viable)
- [ ] `/brand` page renders palette swatches, typography specimens, logo gallery, voice reference
- [ ] `docs/brand-guidelines.md` covers palette, typography, logo, voice, glow definitions
- [ ] Voice documented as "cool & mysterious" with concrete do/don't examples
- [ ] All SVGs use explicit color values (not CSS variables) for portability

## Verification

- `bash scripts/verify-s01.sh` exits 0 — all files exist
- `npm run build` still passes with new page added
- Browser: `/brand` page shows all four sections with correct colors, fonts, and logos rendering
- Logo SVGs render correctly when opened directly in browser (`/brand/logo-icon.svg`)

## Observability Impact

**New inspection surfaces:**
- `public/brand/*.svg` — 6 logo files; open directly in browser to verify rendering. Missing files surface as broken `<img>` tags on `/brand` page.
- `/brand` page — visual integration test for the entire brand system. If colors, fonts, or logos are wrong, it's immediately visible here.
- `docs/brand-guidelines.md` — portable reference; `cat docs/brand-guidelines.md | head -5` confirms existence and structure.

**Diagnostic commands:**
- `ls -la public/brand/` — verify all 6 SVGs exist with non-zero size
- `grep -c 'viewBox' public/brand/*.svg` — confirm each SVG has valid structure
- `grep -l '#bdfffd\|#7cffc4' public/brand/logo-icon.svg` — confirm gradient colors in colored variants
- `grep -l '#ffffff\|white' public/brand/logo-icon-mono.svg` — confirm mono uses white fill

**Failure shapes:**
- Missing SVG → broken image on `/brand` page, verify script reports missing file
- Bad SVG syntax → browser shows nothing or broken icon; `xmllint --noout public/brand/*.svg` catches parse errors
- Page build failure → `npm run build` exits non-zero with route error referencing `app/brand/page.tsx`
- Font mismatch → typography section renders in system font instead of Space Grotesk/Inter/JetBrains Mono (visible in browser DevTools computed styles)

## Inputs

- `app/globals.css` — design tokens from T01 (colors, fonts, spacing, glows)
- `app/layout.tsx` — font CSS variables and dark theme from T01
- Color palette: #bdfffd, #9ffff5, #7cffc4, #6abea7, #5e6973
- Dark backgrounds: #0a0f14, #111820, #1a2230
- Typography: Space Grotesk, Inter, JetBrains Mono
- Voice: "cool & mysterious" — drops value quietly, never hype, ocean mist energy (D006)

## Expected Output

- `public/brand/logo-icon.svg` — Colored water droplet icon
- `public/brand/logo-wordmark.svg` — Colored DRIP wordmark
- `public/brand/logo-lockup.svg` — Colored icon + wordmark
- `public/brand/logo-icon-mono.svg` — White water droplet icon
- `public/brand/logo-wordmark-mono.svg` — White DRIP wordmark
- `public/brand/logo-lockup-mono.svg` — White icon + wordmark
- `app/brand/page.tsx` — Brand guidelines page with palette, typography, logos, voice sections
- `docs/brand-guidelines.md` — Comprehensive brand reference document
