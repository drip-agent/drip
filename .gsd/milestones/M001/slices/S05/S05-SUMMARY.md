---
id: S05
parent: M001
milestone: M001
provides:
  - 4 social image API route handlers (profile 800×800, banner 1500×500, template-update 1200×675, template-announcement 1200×675)
  - Shared font-loading utility (lib/og-fonts.ts) for ImageResponse contexts
  - /social showcase page with 5 asset cards and download links
  - scripts/verify-s05.sh verification script (19 checks)
requires:
  - slice: S01
    provides: Logo SVG path data, brand color hex values, Space Grotesk font choice, voice & tone reference
  - slice: S04
    provides: OG image route pattern (opengraph-image.tsx), deployed landing page as visual reference
affects: []
key_files:
  - lib/og-fonts.ts
  - app/api/social/profile/route.tsx
  - app/api/social/banner/route.tsx
  - app/api/social/template-update/route.tsx
  - app/api/social/template-announcement/route.tsx
  - app/social/page.tsx
  - scripts/verify-s05.sh
key_decisions:
  - "D026: Use IE11 User-Agent to fetch TTF from Google Fonts API (Satori rejects woff2)"
patterns_established:
  - Social image route handler pattern using ImageResponse with shared font utility
  - Inlined SVG path data in JSX for Satori (no img tags)
  - Data-driven showcase page pattern (D019) reused from /brand and /design
observability_surfaces:
  - "[og-fonts] console.warn on font fetch failure — grep server logs"
  - "curl -sI /api/social/<name> for route health (200 + content-type: image/png)"
  - "Broken preview images on /social visible in browser network tab"
drill_down_paths:
  - .gsd/milestones/M001/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S05/tasks/T02-SUMMARY.md
duration: 25m
verification_result: passed
completed_at: 2026-03-15
---

# S05: Social Media Kit

**Complete social asset pipeline — 4 branded PNG routes, shared font utility, and /social showcase page with previews and downloads.**

## What Happened

Built a programmatic social image system using Next.js ImageResponse (Satori). Created a shared font utility (`lib/og-fonts.ts`) that fetches Space Grotesk 700 as TTF from Google Fonts API — using an IE11 User-Agent because Satori rejects woff2 format (D026). Falls back to built-in sans-serif with a `[og-fonts]` warning on failure.

Four route handlers generate branded PNGs on demand:
- **Profile** (`/api/social/profile`, 800×800): Centered droplet icon with radial aqua glow on dark background. No text — safe for circle-crop.
- **Banner** (`/api/social/banner`, 1500×500): Horizontal gradient, centered lockup with droplet + "DRIP" gradient text + "Value Drops Quietly" tagline. Content in safe zone.
- **Build Update** (`/api/social/template-update`, 1200×675): BUILD LOG badge, "Day N: Title Here" center, gradient divider, date/hashtags/URL footer.
- **Announcement** (`/api/social/template-announcement`, 1200×675): Large "DRIP" gradient text with radial glow, announcement placeholder, drip.surf.

All routes use `runtime = "edge"`, explicit `display: 'flex'` on every div, inlined SVG path data from `logo-icon.svg`, and direct hex brand colors.

Built `/social` showcase page using the data-driven const array pattern (D019). Five cards in a responsive 2-column grid: the 4 new assets plus the existing OG image (1200×630). Each card shows the live preview image, name, dimension badge, description, use case, and a download link with `download` attribute.

Wrote `scripts/verify-s05.sh` with 19 structural checks covering file existence, exports, page structure, build success, and build output routes.

## Verification

- `scripts/verify-s05.sh` — 19/19 checks pass
- `curl -sI` all 4 `/api/social/*` routes — HTTP 200, `content-type: image/png`
- `curl -sI` `/opengraph-image` and `/twitter-image` — HTTP 200, still functional
- PNG dimensions verified via hex header: 800×800, 1500×500, 1200×675, 1200×675
- Browser: `/social` page renders all 5 asset cards with visible previews and download links
- `npm run build` — clean, all routes in output

## Requirements Advanced

- R013 (X/Twitter Social Assets) — fully delivered: profile picture, banner, 2 post templates, OG image showcase

## Requirements Validated

- R013 — all social assets are programmatically generated, previewed on /social, and downloadable. OG image from S04 confirmed functional. Complete kit ready for X account setup.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- Font utility initially used Chrome User-Agent → Google served woff2 → Satori crashed. Fixed by switching to IE11 UA to get TTF. Documented as D026.

## Known Limitations

- Post templates have placeholder text ("Day N: Title Here", "Announcement Title Here") — they're templates, not editable through the API. User downloads PNG and overlays their own text, or edits the route handler source.
- On first cold load of `/social` in dev mode, all 5 image routes generate simultaneously which can cause transient `ERR_EMPTY_RESPONSE` on the banner. Dev-server-only issue, not production.

## Follow-ups

- none

## Files Created/Modified

- `lib/og-fonts.ts` — shared font-loading utility (Space Grotesk 700 via Google Fonts API)
- `app/api/social/profile/route.tsx` — 800×800 profile picture route
- `app/api/social/banner/route.tsx` — 1500×500 banner route
- `app/api/social/template-update/route.tsx` — 1200×675 build update template route
- `app/api/social/template-announcement/route.tsx` — 1200×675 announcement template route
- `app/social/page.tsx` — social asset showcase page with data-driven card grid
- `scripts/verify-s05.sh` — S05 structural verification script (19 checks)

## Forward Intelligence

### What the next slice should know
- M001 is complete after S05. No downstream slices in this milestone.
- All ImageResponse routes share `lib/og-fonts.ts` — if M002 needs dynamic OG images per page, this utility is ready.

### What's fragile
- Google Fonts TTF fetch depends on IE11 User-Agent trick (D026). If Google deprecates TrueType serving, routes fall back to sans-serif gracefully but lose Space Grotesk branding.

### Authoritative diagnostics
- `curl -sI http://localhost:3000/api/social/{profile,banner,template-update,template-announcement}` — fastest route health check
- Server logs with `[og-fonts]` tag — font loading issues surface here

### What assumptions changed
- Assumed Google Fonts API would serve TTF by default — it serves woff2 to modern browsers. IE11 UA workaround was needed.
