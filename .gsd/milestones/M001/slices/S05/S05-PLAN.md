# S05: Social Media Kit

**Goal:** Complete social asset set for X/Twitter — profile picture, banner, build-in-public post templates — generated programmatically via Next.js ImageResponse route handlers, with a `/social` showcase page for preview and download.
**Demo:** `/social` page displays all 4 social images with correct dimensions and download links. Each `/api/social/*` route returns a branded PNG. OG image (from S04) confirmed working.

## Must-Haves

- Profile picture route (800×800) — centered droplet icon on dark background with aqua glow
- Banner route (1500×500) — DRIP lockup centered with tagline, content within 1380px safe zone
- Build update post template route (1200×675) — BUILD LOG badge, title area, date/hashtag/URL
- Announcement post template route (1200×675) — large DRIP gradient text, supporting text area, URL
- Shared font-loading utility for Space Grotesk in ImageResponse contexts
- `/social` showcase page with previews, dimensions, and download links
- Verification script covering all routes and page

## Verification

- `bash scripts/verify-s05.sh` — structural checks: route files exist, showcase page exists, font utility exists, build succeeds
- `curl` each `/api/social/*` route returns `content-type: image/png`
- Browser: `/social` page shows all 4 assets with correct preview images and download links
- Browser: existing `/opengraph-image` and `/twitter-image` routes still functional
- Font fallback: temporarily block Google Fonts (e.g., invalid URL) and confirm routes still return valid PNGs without crashing
- Diagnostics: server logs contain `[og-fonts]` tag on font load failure (grep server stderr); non-200 from any `/api/social/*` route returns a meaningful error response, not a blank crash

## Tasks

- [x] **T01: Build social image route handlers with shared font utility** `est:35m`
  - Why: Core deliverable — the 4 branded PNG images that become X profile, banner, and post templates. Shared font utility avoids duplicating Google Fonts fetch logic across routes.
  - Files: `lib/og-fonts.ts`, `app/api/social/profile/route.tsx`, `app/api/social/banner/route.tsx`, `app/api/social/template-update/route.tsx`, `app/api/social/template-announcement/route.tsx`
  - Do: Create font utility that fetches Space Grotesk 700 TTF from Google Fonts API with error handling. Build 4 route handlers using ImageResponse — each with dark background, brand colors, inlined droplet SVG path data (not `<img>`). Profile: 800×800 centered icon with radial glow. Banner: 1500×500 lockup + "Value Drops Quietly" tagline in safe zone. Templates: 1200×675 with appropriate layout per research spec. All divs need explicit `display: 'flex'`. Use brand colors from globals.css directly as hex values.
  - Verify: `npm run build` succeeds, dev server returns PNG from each route
  - Done when: All 4 routes return valid PNG images with correct dimensions and brand styling

- [x] **T02: Build /social showcase page and verification** `est:25m`
  - Why: Showcase page makes assets discoverable and downloadable. Verification script proves the slice is complete.
  - Files: `app/social/page.tsx`, `scripts/verify-s05.sh`
  - Do: Build `/social` page following the data-driven const array pattern from `/brand` (D019). Each asset card shows: preview image (via `<img>` pointing to API route), asset name, dimensions, use case description, download link. Include the existing OG image in the showcase for completeness. Use NavBar/Footer layout, Container/Section components. Write verification script checking file existence, build success, and route availability.
  - Verify: `bash scripts/verify-s05.sh` passes, browser shows all assets on `/social`
  - Done when: `/social` page renders all 5 assets (4 new + OG) with working preview images and download links, verification script passes

## Observability / Diagnostics

- **Font loading failure**: `lib/og-fonts.ts` logs a console warning with the error message when Google Fonts fetch fails, then returns `null` so routes render with Satori's built-in sans-serif. Visible in server logs during `next dev` or `next start`.
- **Route health**: Each `/api/social/*` route returns `content-type: image/png` on success. A non-200 response or missing content-type header indicates a rendering failure. `curl -sI` against each route is the quickest diagnostic.
- **Image dimensions**: Correct dimensions are encoded in the `ImageResponse` constructor options. If dimensions are wrong, the bug is in the route's size config, not in Satori.
- **Showcase page**: `/social` page renders `<img>` tags pointing at the API routes. If a preview is broken, the browser's network tab shows whether the route itself failed or the page has a bad src.

## Files Likely Touched

- `lib/og-fonts.ts`
- `app/api/social/profile/route.tsx`
- `app/api/social/banner/route.tsx`
- `app/api/social/template-update/route.tsx`
- `app/api/social/template-announcement/route.tsx`
- `app/social/page.tsx`
- `scripts/verify-s05.sh`
