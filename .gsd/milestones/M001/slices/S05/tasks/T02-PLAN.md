---
estimated_steps: 3
estimated_files: 2
---

# T02: Build /social showcase page and verification

**Slice:** S05 — Social Media Kit
**Milestone:** M001

## Description

Build the `/social` showcase page displaying all social assets with previews, dimensions, and download links. Follows the data-driven const array pattern established in `/brand` (D019). Write the slice verification script. Verify OG image from S04 is still functional.

## Steps

1. Create `app/social/page.tsx` — data-driven showcase page. Define a const array of social assets, each with: name, description, dimensions, use case, API route path. Map to a responsive grid of preview cards. Each card shows the image (via `<img src="/api/social/...">`), asset name, pixel dimensions, purpose description, and a download link (anchor tag with `download` attribute pointing to the API route). Include the existing OG image (`/opengraph-image`) in the showcase. Use Container, Section from layout components. NavBar + Footer wrapping via standard page structure.

2. Write `scripts/verify-s05.sh` — structural verification script following the pattern from S01-S04. Checks: all 5 route handler files exist, font utility exists, `/social` page file exists, `npm run build` succeeds, build output includes `/api/social/*` routes and `/social` page. Target: ~15 checks.

3. Run verification: execute `scripts/verify-s05.sh`, start dev server, confirm each API route returns PNG in browser, confirm `/social` page renders all assets, confirm existing `/opengraph-image` and `/twitter-image` routes still work.

## Must-Haves

- [ ] `/social` page renders all 5 assets (profile, banner, update template, announcement template, OG image)
- [ ] Each asset card shows preview image, name, dimensions, and download link
- [ ] Page uses data-driven const array pattern (D019)
- [ ] Page uses standard layout (Container, Section, NavBar/Footer)
- [ ] Verification script passes all checks
- [ ] Existing OG image and Twitter image routes unaffected

## Verification

- `bash scripts/verify-s05.sh` — all checks pass
- Browser: `/social` page shows 5 asset cards with visible preview images
- Browser: clicking download links triggers image download
- Browser: `/opengraph-image` still returns 1200×630 branded PNG

## Inputs

- T01 output: all 4 API route handlers + font utility
- `app/brand/page.tsx` — reference for data-driven showcase page pattern
- `components/layout/navbar.tsx`, `components/layout/footer.tsx` — layout components
- `components/ui/container.tsx`, `components/layout/section.tsx` — structural components
- `scripts/verify-s04.sh` — reference for verification script pattern

## Expected Output

- `app/social/page.tsx` — social asset showcase page
- `scripts/verify-s05.sh` — slice verification script (~15 checks)

## Observability Impact

- **Showcase page broken images**: If a social image route fails, the `/social` page shows a broken `<img>`. Browser network tab reveals which specific route returned non-200. Each card's `<img>` has a descriptive `alt` attribute for accessibility tree inspection.
- **Verification script output**: `scripts/verify-s05.sh` emits `✓`/`✗` per check with a final pass/fail summary. Build log is captured to `/tmp/s05-build.log` for post-mortem on build failures.
- **Download links**: Each download anchor uses `download` attribute with a filename — browser downloads the PNG directly. If the route is broken, the download produces a 0-byte file or error HTML.
