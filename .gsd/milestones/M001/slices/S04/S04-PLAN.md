# S04: Landing Page

**Goal:** Full animated landing page at `/` with hero, features, how-it-works, agent preview, and CTA — responsive, performant, social-share-ready.
**Demo:** Homepage loads with ParticleField hero atmosphere, 4 scroll-animated content sections, and a final CTA. Responsive at 375px/768px/1440px. Lighthouse ≥ 80. OG image renders when link is shared on X.

## Must-Haves

- Hero section with ParticleField background, `<h1>`, tagline, Badge, primary CTA Button
- Features section with animated card grid showcasing DRIP capabilities
- How It Works section with step-by-step agent pipeline flow
- Agent preview teaser section with mock terminal/chat UI
- CTA section with final conversion call-to-action
- NavBar links match actual page anchors (remove "Pricing")
- Footer links updated (no dead links, add X/Twitter)
- Mobile hamburger menu in NavBar
- Smooth scroll with NavBar offset (`scroll-padding-top`)
- OG image (1200×630) via Next.js ImageResponse API
- Twitter card metadata (`summary_large_image`)
- Responsive visual quality at mobile (375px), tablet (768px), desktop (1440px)
- Lighthouse performance ≥ 80
- `min-h-dvh` on hero (not `min-h-screen`) for iOS Safari

## Proof Level

- This slice proves: final-assembly — landing page is the primary deliverable of M001
- Real runtime required: yes — visual quality, animations, and performance must be verified in browser
- Human/UAT required: yes — "does it look futuristic and impressive" is subjective

## Verification

- `bash scripts/verify-s04.sh` — structural checks (section anchors, imports, metadata, OG image, build)
- Browser: homepage loads at `localhost:3000` with all 5 sections visible and animated
- Browser: responsive check at 375px, 768px, 1440px — content readable, no overflow
- Lighthouse: performance score ≥ 80
- Diagnostic: ParticleField console log `Particles: {count} @ {dpr}x` confirms canvas is active in dev mode
- Failure path: `npm run build` surfaces any SSR/import errors; missing section IDs caught by verify-s04.sh grep checks

## Observability / Diagnostics

- Runtime signals: ParticleField console log `Particles: {count} @ {dpr}x` confirms canvas is running
- Inspection surfaces: `/` page in browser, Lighthouse audit, `npm run build` output
- Failure visibility: build errors surface in terminal; animation failures visible as static content
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: all 10 S02 components (ui/ + layout/), all 5 S03 animation components, motion-variants presets, gsap-utils, brand SVGs
- New wiring introduced: app/page.tsx (complete rewrite), NavBar/Footer link updates, OG image routes, layout metadata, scroll CSS
- What remains before milestone is truly usable end-to-end: S05 (social media kit), Vercel deployment with custom domain DNS (requires user action)

## Tasks

- [x] **T01: Build full animated landing page with all sections** `est:2h`
  - Why: This is the primary deliverable — assembling proven S02/S03 components into the complete landing page experience. Load `frontend-design` skill for visual quality.
  - Files: `app/page.tsx`, `components/layout/navbar.tsx`, `components/layout/footer.tsx`, `app/globals.css`
  - Do: Add `scroll-behavior: smooth` and `scroll-padding-top: 4rem` to html in globals.css. Update NavBar links to Features/#features, How It Works/#how-it-works, Agent/#agent — remove Pricing. Add mobile hamburger toggle. Update Footer links — remove Pricing, add X/Twitter external link. Build 5 page sections: (1) Hero with ParticleField + h1 + tagline + Badge + CTA, (2) Features grid with FadeInStagger + Card, (3) How It Works with ScrollReveal + numbered steps, (4) Agent preview with GlassPanel mock terminal, (5) CTA with GlowHover. Use `min-h-dvh` for hero. Keep hero content at `z-10` above ParticleField. Use `<h1>` for hero heading, Section's `heading` prop (h2) for subsequent sections. Limit ScrollReveal to 4-6 instances — use FadeInStagger for card groups. Respect prefers-reduced-motion.
  - Verify: `npm run build` succeeds, browser shows all sections with working animations at desktop viewport
  - Done when: All 5 sections render, NavBar/Footer links are correct, animations trigger on scroll, hero has particle atmosphere

- [x] **T02: OG metadata, responsive verification, Lighthouse, and deployment readiness** `est:1h`
  - Why: Page needs social sharing metadata, responsive validation, and performance confirmation before it can ship.
  - Files: `app/layout.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `scripts/verify-s04.sh`
  - Do: Update layout.tsx metadata with metadataBase (https://drip.surf), full openGraph object (siteName, locale, type), twitter object (summary_large_image). Create opengraph-image.tsx using ImageResponse API — 1200×630 with DRIP gradient background, logo, tagline. Create twitter-image.tsx (can re-export OG image). Write verify-s04.sh with structural checks (section IDs, imports, metadata, OG file, build). Run responsive checks at 375px/768px/1440px — fix any overflow, readability, or layout issues. Run Lighthouse and verify ≥ 80. Fix any performance issues found.
  - Verify: `bash scripts/verify-s04.sh` passes, Lighthouse ≥ 80, responsive visual check at 3 viewports
  - Done when: OG images generate, Lighthouse ≥ 80, verify-s04.sh all-pass, page is visually solid at all breakpoints

## Files Likely Touched

- `app/page.tsx` — complete rewrite with 5 landing page sections
- `app/globals.css` — scroll-behavior, scroll-padding-top
- `components/layout/navbar.tsx` — link updates, mobile hamburger menu
- `components/layout/footer.tsx` — link updates
- `app/layout.tsx` — metadata updates (metadataBase, openGraph, twitter)
- `app/opengraph-image.tsx` — OG image generation via ImageResponse
- `app/twitter-image.tsx` — Twitter card image
- `scripts/verify-s04.sh` — slice verification script
