---
id: T01
parent: S05
milestone: M001
provides:
  - 4 social image API route handlers (profile, banner, template-update, template-announcement)
  - Shared font-loading utility for ImageResponse contexts
key_files:
  - lib/og-fonts.ts
  - app/api/social/profile/route.tsx
  - app/api/social/banner/route.tsx
  - app/api/social/template-update/route.tsx
  - app/api/social/template-announcement/route.tsx
key_decisions:
  - "D026: Use IE11 User-Agent to fetch TTF from Google Fonts API (Satori rejects woff2)"
patterns_established:
  - Social image route handler pattern using ImageResponse with shared font utility
  - Inlined SVG path data in JSX for Satori (no img tags)
observability_surfaces:
  - "[og-fonts] console.warn on font fetch failure — grep server logs"
  - "curl -sI /api/social/<name> for route health (200 + content-type: image/png)"
duration: 15m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Build social image route handlers with shared font utility

**Built 4 branded social image routes and a shared font utility — all returning correct-dimension PNGs with DRIP brand styling.**

## What Happened

Created `lib/og-fonts.ts` — fetches Space Grotesk 700 from Google Fonts API as TTF (Satori requires TrueType, not woff2). Uses an IE11 User-Agent string so Google serves the `format('truetype')` variant. Returns `null` on failure with a `[og-fonts]` console warning; routes fall back to Satori's built-in sans-serif.

Built all 4 route handlers following the proven `ImageResponse` pattern from `app/opengraph-image.tsx`:

- **Profile** (800×800): Centered droplet icon at 320px with radial aqua glow on `#0a0f14` background. No text for circle-crop safety.
- **Banner** (1500×500): Horizontal gradient background, centered lockup (droplet + "DRIP" gradient text + tagline). All content within center safe zone.
- **Template-update** (1200×675): BUILD LOG badge top-left, "Day N: Title Here" centered, gradient accent divider, metadata footer with date/hashtags/URL.
- **Template-announcement** (1200×675): Large "DRIP" gradient text centered with dramatic radial glow, announcement placeholder, divider, "drip.surf" bottom.

All routes use `runtime = "edge"`, explicit `display: 'flex'` on every div, inlined SVG path data from `logo-icon.svg`, and direct hex brand color values.

Hit one issue during implementation: initial font utility used a modern Chrome UA → Google served woff2 → Satori crashed with "Unsupported OpenType signature wOF2". Fixed by switching to IE11 UA (D026).

## Verification

- `npm run build` — clean, all 4 routes in output as dynamic (ƒ) routes
- `curl -sI` all 4 routes — HTTP 200, `content-type: image/png`
- PNG dimensions verified via hex header parsing: 800×800, 1500×500, 1200×675, 1200×675
- Browser screenshots of all 4 routes — visually correct (droplet icon, gradient text, layouts, brand colors)
- Existing `/opengraph-image` and `/twitter-image` routes — still returning 200

### Slice-level checks (partial — T02 not started)
- ✅ `curl` each `/api/social/*` returns `content-type: image/png`
- ✅ Existing `/opengraph-image` and `/twitter-image` still functional
- 🔲 `verify-s05.sh` — script not yet created (T02)
- 🔲 `/social` page — not yet created (T02)

## Diagnostics

- **Font issues**: Grep server logs for `[og-fonts]` — any font loading failure is logged with the specific error message.
- **Route health**: `curl -sI http://localhost:3000/api/social/{profile,banner,template-update,template-announcement}` — should return `content-type: image/png` with HTTP 200.
- **Dimension check**: Download PNG and read IHDR chunk bytes 16-23 for width/height, or use PIL/ImageMagick.
- **Satori rendering**: If visual output looks wrong, issue is likely missing `display: 'flex'` or unsupported CSS property. Satori supports only a CSS subset (flexbox, no grid, no box-shadow spread).

## Deviations

- Font utility originally used Chrome User-Agent, which caused woff2 format and Satori crash. Changed to IE11 UA to get TTF. This is the correct approach — documented as D026.

## Known Issues

None.

## Files Created/Modified

- `lib/og-fonts.ts` — shared font-loading utility (Space Grotesk 700 via Google Fonts API)
- `app/api/social/profile/route.tsx` — 800×800 profile picture route
- `app/api/social/banner/route.tsx` — 1500×500 banner route
- `app/api/social/template-update/route.tsx` — 1200×675 build update template route
- `app/api/social/template-announcement/route.tsx` — 1200×675 announcement template route
- `.gsd/milestones/M001/slices/S05/S05-PLAN.md` — added Observability/Diagnostics section
- `.gsd/milestones/M001/slices/S05/tasks/T01-PLAN.md` — added Observability Impact section
- `.gsd/DECISIONS.md` — appended D026
