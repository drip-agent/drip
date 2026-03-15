---
estimated_steps: 6
estimated_files: 4
---

# T02: OG metadata, responsive verification, Lighthouse, and deployment readiness

**Slice:** S04 — Landing Page
**Milestone:** M001

## Description

Add social sharing metadata (OpenGraph + Twitter cards) so drip.surf link previews look good on X. Build dynamic OG image using Next.js ImageResponse API. Verify responsive layout at 375px, 768px, 1440px and fix any issues. Run Lighthouse and verify score ≥ 80. Write the slice verification script. This is the polish-and-ship task — the page exists from T01, this task makes it production-ready.

## Steps

1. Update `app/layout.tsx` metadata: add `metadataBase: new URL('https://drip.surf')`, expand `openGraph` object (title, description, siteName: 'DRIP', locale: 'en_US', type: 'website'), add `twitter` object (card: 'summary_large_image', title, description)
2. Create `app/opengraph-image.tsx` using Next.js ImageResponse API — 1200×630 image with dark gradient background, DRIP title in aqua, tagline text. Keep it simple — text on gradient, no external images needed.
3. Create `app/twitter-image.tsx` — can re-export the same ImageResponse as the OG image
4. Write `scripts/verify-s04.sh` — structural verification:
   - File existence checks (page.tsx, opengraph-image.tsx, twitter-image.tsx)
   - Section anchor IDs in page.tsx (features, how-it-works, agent, early-access)
   - Key imports in page.tsx (ParticleField, ScrollReveal, FadeInStagger)
   - NavBar has no "Pricing" text
   - Footer has no "Pricing" text
   - layout.tsx contains "openGraph" and "twitter" metadata
   - scroll-padding-top in globals.css
   - h1 tag in page.tsx
   - `npm run build` succeeds
5. Run responsive verification: start dev server, check at 375px, 768px, 1440px. Fix overflow, text sizing, or layout breaks.
6. Run Lighthouse audit. If score < 80, identify bottleneck and fix (likely: lazy-load ParticleField, reduce ScrollTrigger count, check image optimization).

## Must-Haves

- [ ] layout.tsx has metadataBase, openGraph, and twitter metadata
- [ ] opengraph-image.tsx generates 1200×630 branded image
- [ ] twitter-image.tsx generates Twitter card image
- [ ] verify-s04.sh passes all checks
- [ ] Responsive layout works at 375px, 768px, 1440px — no overflow, readable text
- [ ] Lighthouse performance ≥ 80

## Verification

- `bash scripts/verify-s04.sh` — all checks pass
- Browser: OG image route returns an image (check /opengraph-image in browser)
- Browser: page renders well at 375px, 768px, 1440px viewports
- Lighthouse: performance ≥ 80

## Inputs

- `app/page.tsx` — completed landing page from T01
- `app/layout.tsx` — existing metadata to extend
- `components/layout/navbar.tsx` — T01 updated version (verify no Pricing)
- `components/layout/footer.tsx` — T01 updated version (verify no Pricing)
- `app/globals.css` — T01 added scroll CSS
- Brand tokens: icy-aqua (#bdfffd), aquamarine (#7cffc4), dark-deepest for OG image colors

## Observability Impact

- **OG image route**: `/opengraph-image` returns a 1200×630 PNG — future agents can fetch this URL to verify social sharing metadata is working
- **Twitter image route**: `/twitter-image` returns the same branded image for Twitter card previews
- **Metadata inspection**: `curl -s localhost:3000 | grep -E 'og:|twitter:'` surfaces rendered meta tags in HTML head
- **Verification script**: `scripts/verify-s04.sh` provides a single-command structural health check for the entire slice — catches regressions in section IDs, imports, metadata, and build
- **Failure visibility**: Missing OG image → 404 on `/opengraph-image`; broken metadata → missing `og:` tags in page source; responsive issues → visual overflow at tested breakpoints

## Expected Output

- `app/layout.tsx` — expanded metadata with openGraph and twitter objects
- `app/opengraph-image.tsx` — dynamic OG image generation
- `app/twitter-image.tsx` — Twitter card image
- `scripts/verify-s04.sh` — comprehensive verification script
