---
id: T02
parent: S04
milestone: M001
provides:
  - OpenGraph + Twitter card metadata with dynamic 1200×630 branded image
  - Slice verification script (scripts/verify-s04.sh) — 20 structural checks
  - Responsive visual quality verified at 375px, 768px, 1440px
  - Lighthouse performance score 91 (≥ 80 threshold)
key_files:
  - app/layout.tsx
  - app/opengraph-image.tsx
  - app/twitter-image.tsx
  - scripts/verify-s04.sh
key_decisions:
  - twitter-image.tsx re-exports opengraph-image.tsx rather than duplicating — single source of truth for branded image
  - OG image uses inline JSX styling (no external fonts/images) for zero-dependency generation
patterns_established:
  - Next.js file-convention OG images at app/opengraph-image.tsx — downstream pages can follow same pattern
observability_surfaces:
  - /opengraph-image route returns 1200×630 PNG — 404 means image generation is broken
  - /twitter-image route returns same branded image for Twitter cards
  - HTML meta tags inspectable via `curl -s localhost:3000 | grep -E 'og:|twitter:'`
  - scripts/verify-s04.sh provides single-command structural health check for entire slice
duration: ~25min
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T02: OG metadata, responsive verification, Lighthouse, and deployment readiness

**Added social sharing metadata with dynamic OG image, verified responsive layout at 3 breakpoints, scored Lighthouse 91, and wrote 20-check slice verification script.**

## What Happened

Updated `app/layout.tsx` with `metadataBase`, full `openGraph` object (title, description, siteName, locale, type), and `twitter` card metadata (summary_large_image). Created `app/opengraph-image.tsx` using Next.js ImageResponse API — renders a 1200×630 branded image with dark gradient background, aqua DRIP title, "Value Drops Quietly" tagline, and "Autonomous Research Agents" subtitle. `app/twitter-image.tsx` re-exports the same image.

Wrote `scripts/verify-s04.sh` covering 20 structural checks: file existence (5), section anchor IDs (4), key imports (3), no-Pricing assertions (2), metadata presence (3), CSS scroll-padding (1), semantic h1 (1), and npm build success (1).

Ran responsive verification at 375px (mobile), 768px (tablet), and 1440px (wide desktop) — all clean, no overflow, text readable, layouts responsive. Feature cards go single-column on mobile, 2-column on tablet, 4-column on desktop.

Lighthouse performance: 91 (FCP 0.8s, TBT 0ms, CLS 0, SI 1.2s, LCP 3.5s). Well above the 80 threshold.

## Verification

- `bash scripts/verify-s04.sh` — all 20 checks pass (0 failures)
- Browser: `/opengraph-image` renders 1200×630 branded PNG with DRIP title and tagline
- Browser: both `/opengraph-image` and `/twitter-image` routes in build output
- Browser: HTML head contains all `og:*` and `twitter:*` meta tags with correct values
- Browser: responsive visual check passed at 375px, 768px, 1440px — no overflow, readable text
- Browser: h1 and canvas elements visible on page
- Lighthouse: performance score 91 (≥ 80 threshold met)
- Build: `npm run build` succeeds, both image routes listed in output

### Slice-level verification status (final task — all must pass):
- ✅ `bash scripts/verify-s04.sh` — 20/20 pass
- ✅ Browser: homepage loads with all 5 sections visible
- ✅ Browser: responsive check at 375px, 768px, 1440px — content readable, no overflow
- ✅ Lighthouse: performance 91 ≥ 80
- ✅ Diagnostic: canvas element confirmed active in DOM
- ✅ Build: `npm run build` succeeds

## Diagnostics

- **OG image**: GET `/opengraph-image` — should return PNG image; 404 means generation broke
- **Twitter image**: GET `/twitter-image` — same route pattern
- **Meta tags**: `curl -s localhost:3000 | grep -E 'og:|twitter:'` to inspect rendered tags
- **Structural health**: `bash scripts/verify-s04.sh` — single command checks all slice invariants
- **Build log**: `/tmp/s04-build.log` written by verify script

## Deviations

- Fixed verify-s04.sh arithmetic: `((PASS++))` returns exit code 1 when PASS=0 under `set -e` — changed to `PASS=$((PASS + 1))` form

## Known Issues

None.

## Files Created/Modified

- `app/layout.tsx` — expanded metadata with metadataBase, openGraph, and twitter objects
- `app/opengraph-image.tsx` — dynamic OG image generation (1200×630 branded image)
- `app/twitter-image.tsx` — re-exports OG image for Twitter cards
- `scripts/verify-s04.sh` — 20-check structural verification script
- `.gsd/milestones/M001/slices/S04/tasks/T02-PLAN.md` — added Observability Impact section (pre-flight fix)
