---
estimated_steps: 5
estimated_files: 5
---

# T01: Build social image route handlers with shared font utility

**Slice:** S05 — Social Media Kit
**Milestone:** M001

## Description

Build the 4 social image API route handlers (profile picture, banner, build update template, announcement template) plus a shared font-loading utility. All routes use Next.js `ImageResponse` from `next/og` — the same pattern proven in `app/opengraph-image.tsx`. The font utility fetches Space Grotesk 700 from Google Fonts API to give social assets brand-consistent typography.

## Steps

1. Create `lib/og-fonts.ts` — async function that fetches Space Grotesk 700 TTF from Google Fonts API (fetch CSS → extract `.ttf` URL → fetch binary → return `ArrayBuffer`). Include try/catch with graceful fallback (Satori uses built-in sans-serif if font loading fails). Export the font data getter and a reusable fonts config array for ImageResponse options.

2. Create `app/api/social/profile/route.tsx` — 800×800 PNG. Dark deepest background (`#0a0f14`). Centered water droplet icon drawn as inline JSX `<svg>` with the path data from `logo-icon.svg` (teardrop shape, aqua gradient `#bdfffd` → `#7cffc4`). Radial glow behind icon approximated with a radial-gradient div overlay. No text — icon only for circle crop safety. Content centered within 640px visual circle.

3. Create `app/api/social/banner/route.tsx` — 1500×500 PNG. Horizontal gradient background (`#0a0f14` → `#111820` → `#0a0f14`). Centered lockup: droplet icon (smaller) + "DRIP" gradient text (`#bdfffd` → `#7cffc4` via `backgroundClip: 'text'`). Below: "Value Drops Quietly" in muted aqua (`#6abea7`). Subtle centered radial glow. All content within center 1380px safe zone for mobile cropping.

4. Create `app/api/social/template-update/route.tsx` — 1200×675 PNG. Dark surface background (`#111820`). Top-left: small DRIP droplet icon + "BUILD LOG" badge (aqua border, small text). Center: large placeholder title "Day N: Title Here" in Space Grotesk. Bottom: date stamp, "#DRIP #BuildInPublic", "drip.surf" — in muted `#5e6973`. Horizontal aqua gradient accent line divider above bottom section.

5. Create `app/api/social/template-announcement/route.tsx` — 1200×675 PNG. Dark deepest background (`#0a0f14`) with stronger centered radial glow. Center: large "DRIP" in gradient text (same technique as OG image). Below: "Announcement Title Here" in white. Bottom: "drip.surf" in muted aqua. More dramatic glow treatment than the update template.

## Must-Haves

- [ ] Font utility fetches Space Grotesk 700 TTF with error handling
- [ ] Profile route returns 800×800 PNG with centered droplet icon
- [ ] Banner route returns 1500×500 PNG with lockup in safe zone
- [ ] Update template route returns 1200×675 PNG with BUILD LOG layout
- [ ] Announcement template route returns 1200×675 PNG with dramatic gradient text
- [ ] All routes use `ImageResponse` with explicit `display: 'flex'` on every div
- [ ] Droplet icon SVG path data inlined as JSX (not `<img>` tag)
- [ ] Brand colors used as direct hex values matching design tokens

## Verification

- `npm run build` succeeds with all routes in output
- Dev server: each of the 4 `/api/social/*` routes returns a viewable PNG in browser
- Each PNG has correct dimensions (check via browser or image info)
- Font utility doesn't crash if Google Fonts is unreachable (fallback behavior)

## Observability Impact

- **Font loading**: `lib/og-fonts.ts` emits `console.warn('[og-fonts] ...')` on fetch failure with the error message. A future agent can grep server logs for `[og-fonts]` to diagnose font issues.
- **Route diagnostics**: Each route returns `content-type: image/png` with correct dimensions. `curl -sI /api/social/<name>` confirms health. Non-200 = rendering failure surfaced via Next.js error response.
- **Failure state**: Font utility returns `null` on failure rather than throwing, so routes degrade gracefully to system fonts. No persistent failure state — failures are transient per-request.

## Inputs

- `app/opengraph-image.tsx` — reference implementation for ImageResponse pattern, gradient text technique
- `public/brand/logo-icon.svg` — path data for the water droplet shape (must be inlined as JSX)
- `app/globals.css` — brand color hex values (don't import — use hex values directly in ImageResponse JSX)
- `docs/brand-guidelines.md` — voice/tone for template copy ("Value Drops Quietly")
- S05-RESEARCH.md — asset dimensions, Satori constraints, design direction for each asset

## Expected Output

- `lib/og-fonts.ts` — shared font-loading utility for ImageResponse contexts
- `app/api/social/profile/route.tsx` — 800×800 profile picture generation
- `app/api/social/banner/route.tsx` — 1500×500 banner generation
- `app/api/social/template-update/route.tsx` — 1200×675 build update template
- `app/api/social/template-announcement/route.tsx` — 1200×675 announcement template
