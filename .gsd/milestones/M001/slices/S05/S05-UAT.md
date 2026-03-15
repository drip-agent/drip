# S05: Social Media Kit — UAT

**Milestone:** M001
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven structural checks + live-runtime route/page verification)
- Why this mode is sufficient: Social images are programmatically generated via API routes — structural checks confirm files exist, runtime checks confirm valid PNG output, browser checks confirm the showcase page renders correctly. No complex user flows to test.

## Preconditions

- `npm run build` succeeds (no build errors)
- Dev server running (`npx next dev`) or production build served (`npx next start`)
- Browser available for /social page verification

## Smoke Test

Run `bash scripts/verify-s05.sh` — all 19 checks should pass. Then `curl -sI http://localhost:3000/api/social/profile` should return HTTP 200 with `content-type: image/png`.

## Test Cases

### 1. Profile picture route returns valid branded PNG

1. `curl -sI http://localhost:3000/api/social/profile`
2. **Expected:** HTTP 200, `content-type: image/png`
3. Open `http://localhost:3000/api/social/profile` in browser
4. **Expected:** 800×800 dark image with centered aqua droplet icon and radial glow. No text. Suitable for circle-crop.

### 2. Banner route returns valid branded PNG

1. `curl -sI http://localhost:3000/api/social/banner`
2. **Expected:** HTTP 200, `content-type: image/png`
3. Open `http://localhost:3000/api/social/banner` in browser
4. **Expected:** 1500×500 image with horizontal gradient background. Centered lockup: droplet icon + "DRIP" in gradient text + "Value Drops Quietly" tagline. Content within center safe zone (not cut off at edges).

### 3. Build update template returns valid branded PNG

1. `curl -sI http://localhost:3000/api/social/template-update`
2. **Expected:** HTTP 200, `content-type: image/png`
3. Open `http://localhost:3000/api/social/template-update` in browser
4. **Expected:** 1200×675 image with BUILD LOG badge top-left, "Day N: Title Here" centered, gradient divider, footer with "March 2026", "$DRIP #BuildInPublic", and "drip.surf".

### 4. Announcement template returns valid branded PNG

1. `curl -sI http://localhost:3000/api/social/template-announcement`
2. **Expected:** HTTP 200, `content-type: image/png`
3. Open `http://localhost:3000/api/social/template-announcement` in browser
4. **Expected:** 1200×675 image with large "DRIP" gradient text centered, radial glow behind it, "Announcement Title Here" below, "drip.surf" at bottom.

### 5. Existing OG/Twitter image routes still functional

1. `curl -sI http://localhost:3000/opengraph-image`
2. **Expected:** HTTP 200, `content-type: image/png`
3. `curl -sI http://localhost:3000/twitter-image`
4. **Expected:** HTTP 200, `content-type: image/png`
5. Open both in browser
6. **Expected:** 1200×630 branded OG images with DRIP branding — unchanged from S04.

### 6. /social showcase page renders all 5 assets

1. Navigate to `http://localhost:3000/social` in browser
2. **Expected:** Page title "DRIP — Social Media Kit"
3. **Expected:** NavBar at top with DRIP logo and navigation links
4. **Expected:** "SOCIAL MEDIA KIT" label and "Social Assets" heading
5. Scroll through page
6. **Expected:** 5 asset cards in a responsive 2-column grid:
   - Profile Picture (800×800) with droplet preview
   - Banner (1500×500) with lockup preview
   - Build Update Template (1200×675) with BUILD LOG preview
   - Announcement Template (1200×675) with DRIP text preview
   - Open Graph Image (1200×630) with OG preview
7. Each card shows: preview image, asset name, dimension badge, description, use case text, and "Download PNG" link

### 7. Download links work

1. On `/social` page, click "Download PNG" link on the Profile Picture card
2. **Expected:** Browser downloads a PNG file (not navigates to a new page). File is a valid PNG image.
3. Repeat for at least one other card (e.g., Banner)
4. **Expected:** Downloaded PNG matches the preview shown on the page

### 8. Verification script passes

1. Run `bash scripts/verify-s05.sh`
2. **Expected:** "Results: 19 passed, 0 failed"
3. All categories checked: Route Handlers (5), Font Utility (3), Showcase Page (6), Build (1), Build Output (2)

## Edge Cases

### Font loading failure graceful degradation

1. In `lib/og-fonts.ts`, temporarily change the Google Fonts URL to an invalid domain (e.g., `https://invalid.example.com/...`)
2. Restart dev server
3. Request `http://localhost:3000/api/social/profile`
4. **Expected:** Route still returns HTTP 200 with `content-type: image/png` — image renders with fallback sans-serif font instead of Space Grotesk
5. Check server console output
6. **Expected:** Warning with `[og-fonts]` tag indicating font fetch failure
7. Revert the URL change

### Brand color consistency

1. Open all 4 social images in separate tabs
2. **Expected:** All use the same dark background tones (#0a0f14 range) and aqua accent colors (#bdfffd, #9ffff5, #7cffc4 range). No off-brand colors.

## Failure Signals

- Any `/api/social/*` route returns non-200 or missing `content-type: image/png` header
- Preview images on `/social` page show broken image icons
- Download links navigate to error pages instead of downloading PNGs
- `scripts/verify-s05.sh` reports any failed checks
- Server logs show `[og-fonts]` errors during normal operation (font should load successfully under normal conditions)
- Build fails with errors in social route files

## Requirements Proved By This UAT

- R013 (X/Twitter Social Assets) — profile picture, banner, 2 post templates, and OG image are all generated, previewable, and downloadable. Complete kit for X account setup.

## Not Proven By This UAT

- Actual rendering on X/Twitter — requires uploading assets to a real X account and verifying display in X's UI (profile, banner, post attachments)
- OG image link preview — requires sharing drip.surf URL on X/Slack/Discord and verifying the preview card renders correctly (depends on deployment, not local dev)
- Production performance — routes are verified locally, not under production load

## Notes for Tester

- On first cold load of `/social` in dev mode, all 5 images generate simultaneously. The banner (largest at 1500×500) may show a transient empty response. Reload the page — it resolves immediately. This is a dev-server concurrency limitation, not a bug.
- Post templates show placeholder text ("Day N: Title Here", "Announcement Title Here"). These are intentional templates — the user downloads and overlays real content.
- The brand color check is subjective — exact hex values are baked into the route source code, so they can also be verified by reading the route files directly.
