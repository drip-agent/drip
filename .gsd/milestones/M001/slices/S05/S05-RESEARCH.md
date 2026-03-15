# S05: Social Media Kit — Research

**Date:** 2026-03-15

## Summary

S05 is the final low-risk slice in M001, delivering the social asset kit for X/Twitter (R013). The OG image is already done — S04 shipped `app/opengraph-image.tsx` (1200×630) and `app/twitter-image.tsx` that re-exports it. What remains: profile picture (400×400, displayed as circle), banner (1500×500), build-in-public post templates (1200×675), and a `/social` showcase page where all assets are previewable and downloadable.

The natural approach is Next.js route handlers using `ImageResponse` (Satori renderer) — the same pattern the OG image already uses. Each social asset becomes an API route that generates a branded PNG on the fly. A `/social` page displays previews and links to the raw image routes for download. This keeps assets programmatic, brand-consistent, and zero-dependency (no Figma exports, no binary PNGs committed to git).

The one technical wrinkle: `ImageResponse` uses Satori (not a real browser), so custom fonts must be loaded as `ArrayBuffer` — the `next/font/google` setup in `layout.tsx` doesn't apply. Space Grotesk should be fetched from Google Fonts API at image generation time to match the DRIP heading font. The existing OG image skips custom fonts (uses system defaults) but social assets — especially banner and templates — will look noticeably better with brand typography.

## Recommendation

**Use ImageResponse route handlers for all social assets**, following the established OG image pattern from S04. Create:

1. `app/api/social/profile/route.tsx` — 800×800 PNG (retina-ready for X's 400×400 display)
2. `app/api/social/banner/route.tsx` — 1500×500 PNG
3. `app/api/social/template-update/route.tsx` — 1200×675 build-in-public template
4. `app/api/social/template-announcement/route.tsx` — 1200×675 announcement template
5. `app/social/page.tsx` — showcase page with previews, dimensions, download links
6. Shared font-loading utility to avoid duplicating Google Fonts fetch logic

The `/social` page follows the data-driven showcase pattern from `/brand` and `/design` (D019) — const arrays of assets mapped to preview cards.

Post templates should include the DRIP logo, brand gradient, and placeholder regions for title/description text — the user fills in content when creating X posts. The templates are static (no dynamic text params) since the user documents their own build process manually (D010).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| PNG image generation | `ImageResponse` from `next/og` | Already used for OG image. Satori renders JSX to PNG. Zero external deps. |
| Custom font in ImageResponse | Google Fonts API `fetch()` | Fetch .ttf at generation time. No need to bundle font files — Google serves them reliably. |
| Social asset showcase page | `/brand` and `/design` page pattern (D019) | Data-driven const arrays mapped to component grids. Proven, consistent. |
| OG image + Twitter card | Already done in S04 | `app/opengraph-image.tsx` + `app/twitter-image.tsx`. Don't touch — just verify. |

## Existing Code and Patterns

- `app/opengraph-image.tsx` — The reference implementation. 1200×630, dark gradient background, "DRIP" gradient text, tagline, divider. Uses inline JSX styles, no custom fonts. twitter-image re-exports it. Follow this exact pattern for new assets.
- `app/brand/page.tsx` — Data-driven showcase. Const arrays (`paletteColors`, `logoVariants`, `voiceDo`) mapped to grid sections. Use this pattern for `/social` page layout.
- `public/brand/logo-icon.svg` — Water droplet with aqua gradient (`#bdfffd` → `#7cffc4`). Cannot embed SVGs directly in ImageResponse — need to redraw as JSX path elements.
- `app/globals.css` — Design tokens. Colors: `#bdfffd` (icy-aqua), `#9ffff5` (soft-cyan), `#7cffc4` (aquamarine), `#6abea7` (ocean-mist), `#5e6973` (blue-slate). Backgrounds: `#0a0f14`, `#111820`, `#1a2230`.
- `components/layout/navbar.tsx` + `footer.tsx` — Layout components for the showcase page.
- `docs/brand-guidelines.md` — Voice & tone reference. Post template copy should match: cool, understated, no hype. "Value drops quietly."

## Constraints

- **Satori CSS subset**: Only flexbox layout. No CSS Grid, no `backdrop-filter`, no `box-shadow` with spread, no `text-shadow`. Glow effects must be approximated with radial-gradient overlays.
- **SVG in ImageResponse**: SVGs cannot be embedded via `<img>` — must be redrawn as inline JSX `<svg>` elements with explicit `<path>` data. The droplet icon path (`M32 4 C32 4, 14 26, 14 38...`) needs to be inlined.
- **Font loading**: `next/font/google` variables (`--font-heading`) don't work in Satori. Must fetch Space Grotesk `.ttf` from Google Fonts API (`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700`) and parse the URL to the actual `.ttf` file.
- **X profile picture circle crop**: 400×400 minimum but displayed as circle. The droplet icon and any glow must be centered with safe margin from edges — content within ~320px centered circle is guaranteed visible.
- **X banner edge cropping**: 1500×500, but mobile crops ~60px from each side. Keep logo and key text within the center 1380×500 safe zone.
- **No API routes exist yet**: `app/api/` directory doesn't exist — first route handler in the project.
- **ImageResponse file size**: X allows up to 5-10MB per image. ImageResponse PNGs are typically 50-200KB — well under limits.

## Common Pitfalls

- **Missing `display: 'flex'` on divs** — Satori requires explicit `display: 'flex'` on every `<div>`. Without it, children don't layout correctly. The existing OG image already does this correctly.
- **Gradient text in Satori** — `backgroundClip: 'text'` with `color: 'transparent'` works in Satori (proven by existing OG image), but only on elements with explicit `display: 'flex'`.
- **Font loading failure silently falls back** — If the Google Fonts fetch fails, Satori uses a built-in sans-serif. Images will render but look wrong. Add error handling or a `try/catch` with fallback font config.
- **Profile picture circle awareness** — Designers often forget X crops to circle. The droplet icon is already centered/symmetric, which is ideal. Don't add text or elements near corners of the 400×400 square.
- **Banner mobile cropping** — Important content at the horizontal edges gets cut on mobile X. Center the DRIP lockup and tagline horizontally.
- **Forgetting `contentType` header** — Route handlers need to return the ImageResponse with proper content-type. ImageResponse handles this automatically, but if wrapping in a custom Response, set `Content-Type: image/png`.

## Open Risks

- **Google Fonts API rate limiting** — Fetching font data on every request could hit rate limits in production. Mitigated by: these routes are rarely hit (user downloads once), and Next.js can cache the response. If issues arise, bundle a local `.ttf` file.
- **Satori rendering differences** — Satori doesn't render identically to browsers. Complex gradients or glow effects may look subtly different. Need to verify each asset visually after implementation.
- **Post template utility** — Build-in-public templates are static images. The user may find them too rigid if they want custom text. This is acceptable for V1 — templates serve as brand-consistent starting points, not a full design tool.

## X/Twitter Image Specifications (2026)

| Asset | Dimensions | Aspect Ratio | Max Size | Format | Notes |
|-------|-----------|--------------|----------|--------|-------|
| Profile picture | 400×400 min, 800×800 recommended | 1:1 | 10 MB | JPG, PNG | Displayed as circle |
| Banner/header | 1500×500 | 3:1 | 5 MB | JPG, PNG | Mobile crops edges ~60px |
| Post image (single) | 1200×675 | 16:9 | 5 MB | JPG, PNG | Optimal engagement |
| Post image (square) | 1200×1200 | 1:1 | 5 MB | JPG, PNG | For 2-4 image posts |
| OG/Twitter card (large) | 1200×630 | 1.91:1 | 5 MB | PNG | Already done in S04 |

## Asset Design Direction

### Profile Picture (800×800)
- Dark deepest background (`#0a0f14`)
- Centered water droplet icon (scaled up from logo-icon.svg path data)
- Radial aqua glow behind the droplet (`rgba(189, 255, 253, 0.08-0.15)`)
- No text — icon only for circle crop clarity
- Content within 640px centered circle for safe display

### Banner (1500×500)
- Dark gradient background matching OG image (`#0a0f14` → `#111820` → `#0a0f14`)
- DRIP lockup centered (droplet icon + "DRIP" wordmark)
- Tagline below: "Value Drops Quietly" in muted aqua
- Subtle radial glow centered behind lockup
- Safe zone: keep all content within center 1380×500

### Post Template: Build Update (1200×675)
- Dark surface background with subtle glow
- Top: DRIP logo (small, corner) + "BUILD LOG" badge
- Center: large area for title text (e.g., "Day 3: Animation Engine")
- Bottom: date stamp, hashtag area, DRIP URL
- Brand gradient accent line/divider

### Post Template: Announcement (1200×675)
- Dark deepest background with stronger glow
- Center: large "DRIP" gradient text or announcement headline
- Supporting text area below
- Bottom: "drip.surf" URL, subtle brand elements

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Social media assets | `langchain-ai/deepagents@social-media` (321 installs) | available — content strategy focused, not image generation. Not relevant. |
| Social media design | `eddiebe147/claude-settings@social-media-designer` (55 installs) | available — low installs, unclear scope. Skip. |
| Frontend design | `frontend-design` | installed — could use for /social page but it's a simple showcase. Not worth loading. |

No skills are directly relevant to this slice. The work is standard Next.js ImageResponse route handlers + a simple showcase page.

## Sources

- X/Twitter image dimensions for 2026 — profile 400×400 (800×800 retina), banner 1500×500, post 1200×675 (source: [imageforpost.com](https://imageforpost.com/guides/twitter-x-image-sizes-dimensions-guide-2025), [tweetarchivist.com](https://www.tweetarchivist.com/twitter-image-size-guide))
- Next.js ImageResponse API — constructor accepts JSX + options (width, height, fonts array with ArrayBuffer data) (source: [Next.js docs](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/image-response.mdx))
- Satori rendering engine constraints — flexbox only, explicit `display: 'flex'`, font loading via ArrayBuffer (source: [vercel/satori](https://github.com/vercel/satori))
