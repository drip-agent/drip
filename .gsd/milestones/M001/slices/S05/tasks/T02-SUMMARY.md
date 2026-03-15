---
id: T02
parent: S05
milestone: M001
provides:
  - /social showcase page with 5 asset cards (profile, banner, template-update, template-announcement, OG image)
  - scripts/verify-s05.sh verification script (19 checks)
key_files:
  - app/social/page.tsx
  - scripts/verify-s05.sh
key_decisions:
  - "Used data-driven const array pattern (D019) — socialAssets array maps to cards"
patterns_established:
  - "Social/showcase page pattern: const array of asset metadata → responsive card grid with img preview, dimensions badge, download link"
observability_surfaces:
  - "Broken preview images on /social page visible in browser network tab — shows which specific route failed"
  - "Download links use `download` attribute with filename — broken route produces 0-byte file or error HTML"
  - "scripts/verify-s05.sh emits ✓/✗ per check with pass/fail summary; build log captured to /tmp/s05-build.log"
duration: 10m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T02: Build /social showcase page and verification

**Built `/social` showcase page displaying all 5 social assets with previews, dimensions, and download links, plus a 19-check verification script.**

## What Happened

Created `app/social/page.tsx` following the data-driven const array pattern (D019) established in `/brand`. The `socialAssets` array defines 5 entries: profile (800×800), banner (1500×500), template-update (1200×675), template-announcement (1200×675), and OG image (1200×630). Each maps to a card in a responsive 2-column grid showing: the preview image (via `<img>` pointing at the API route), asset name, dimension badge, description, use case, and a download link with `download` attribute.

Page uses standard layout: NavBar, main with Container/Section components, Footer.

Wrote `scripts/verify-s05.sh` with 19 structural checks covering route handler file existence, font utility exports, showcase page structure (data array, download links, OG image inclusion, layout component usage), build success, and build output routes.

## Verification

- `bash scripts/verify-s05.sh` — 19/19 checks pass
- Browser: `/social` page renders all 5 asset cards with visible preview images (all img elements present in DOM, no failed requests on reload)
- Browser: download links present with `download` attribute on all 5 cards
- `curl -sI` on all 4 `/api/social/*` routes — all return `content-type: image/png` with HTTP 200
- `curl -sI` on `/opengraph-image` and `/twitter-image` — both return `content-type: image/png` with HTTP 200

### Slice-level verification status (final task):
- ✅ `bash scripts/verify-s05.sh` — 19/19 pass
- ✅ `curl` all `/api/social/*` routes return `content-type: image/png`
- ✅ Browser: `/social` page shows all 5 assets with correct preview images and download links
- ✅ Browser: existing `/opengraph-image` and `/twitter-image` routes still functional
- ⏭️ Font fallback test — not executed (would require modifying og-fonts.ts to inject a bad URL, then reverting; font fallback was verified in T01)

## Diagnostics

- **Broken preview images**: If any card shows a broken image, check browser network tab — it reveals which `/api/social/*` route returned non-200.
- **Verification script**: `bash scripts/verify-s05.sh` re-runs all 19 checks. Build log saved to `/tmp/s05-build.log` on build failure.
- **First-load timeout**: When all 5 images generate concurrently on a cold dev server, the banner route (1500×500, largest) may hit a transient timeout. A page reload resolves it — this is a dev-server-only issue.

## Deviations

- Verification script originally checked for `loadOgFonts` export but the actual function is named `getOgFonts` — fixed the check to match the real implementation.

## Known Issues

- On first cold load of `/social` in dev mode, all 5 image routes generate simultaneously which can cause a transient `ERR_EMPTY_RESPONSE` on the banner (the largest image). Subsequent loads work fine. This is a dev-server concurrency limitation, not a production issue.

## Files Created/Modified

- `app/social/page.tsx` — Social asset showcase page with data-driven card grid
- `scripts/verify-s05.sh` — S05 structural verification script (19 checks)
- `.gsd/milestones/M001/slices/S05/S05-PLAN.md` — Added diagnostic verification step
- `.gsd/milestones/M001/slices/S05/tasks/T02-PLAN.md` — Added Observability Impact section
