---
id: S04
parent: M001
milestone: M001
provides:
  - Complete 5-section animated landing page at / (hero, features, how-it-works, agent preview, CTA)
  - NavBar with anchor links (Features, How It Works, Agent) and mobile hamburger menu
  - Footer with X/Twitter social link, no dead links
  - Smooth scroll CSS with NavBar offset (scroll-padding-top: 4rem)
  - OpenGraph + Twitter card metadata with dynamic 1200×630 branded image
  - Slice verification script (scripts/verify-s04.sh) — 20 structural checks
  - Responsive layout verified at 375px, 768px, 1440px
  - Lighthouse performance score 91 (≥ 80 threshold)
requires:
  - slice: S02
    provides: UI components (Button, Card, GlassPanel, Badge, Input, GlowBorder), layout components (Container, Section, NavBar, Footer), CSS utilities (glass, glow-sm/md/lg), Tailwind theme tokens
  - slice: S03
    provides: Animation components (ScrollReveal, ParticleField, GlowHover, FadeInStagger, PageTransition), motion-variants presets, gsap-utils
affects:
  - S05
key_files:
  - app/page.tsx
  - app/layout.tsx
  - app/opengraph-image.tsx
  - app/twitter-image.tsx
  - components/layout/navbar.tsx
  - components/layout/footer.tsx
  - app/globals.css
  - scripts/verify-s04.sh
key_decisions:
  - NavBar CTA wraps Button in Link tag (Button component lacks asChild support)
  - ScrollReveal limited to 5 instances (How It Works 3 + Agent Preview 1 + CTA 1) — FadeInStagger for card groups
  - Hero uses motion/react fadeIn+slideUp entrance (not ScrollReveal, since already in viewport)
  - Terminal mock uses static content with CSS pulse cursor (no JS typing animation)
  - CTA section heading is direct h2 (not Section heading prop) for custom sizing
  - twitter-image.tsx re-exports opengraph-image.tsx — single source of truth
  - OG image uses inline JSX styling (no external fonts/images) for zero-dependency generation
patterns_established:
  - Landing page composition: NavBar + main with anchored sections + Footer, all within page.tsx
  - Section IDs match NavBar href anchors for smooth scroll navigation
  - Hero pattern: ParticleField (fixed z-0) + Container (relative z-10) with min-h-dvh
  - Next.js file-convention OG images at app/opengraph-image.tsx
observability_surfaces:
  - ParticleField console.log in dev: Particles: {count} @ {dpr}x
  - Section anchor IDs in DOM: #features, #how-it-works, #agent, #early-access
  - NavBar glass-strong class at scrollY > 20
  - /opengraph-image route returns 1200×630 PNG (404 = generation broke)
  - /twitter-image route returns same branded image
  - HTML meta tags: curl -s localhost:3000 | grep -E 'og:|twitter:'
  - scripts/verify-s04.sh — single-command structural health check (20 checks)
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S04/tasks/T02-SUMMARY.md
duration: ~50min
verification_result: passed
completed_at: 2026-03-15
---

# S04: Landing Page

**Full animated 5-section landing page with ParticleField hero, scroll-animated features/pipeline/preview sections, social sharing metadata, and Lighthouse 91 — responsive across mobile/tablet/desktop.**

## What Happened

Assembled all S02 UI components and S03 animation components into the complete DRIP landing page at `/`. Two tasks: T01 built the page sections and navigation, T02 added social metadata and ran verification.

**Hero section** — ParticleField canvas background (fixed, z-0) with gradient-text H1 "DRIP", Badge ("AI Research Agent"), tagline, two CTAs. Uses `min-h-dvh` for iOS Safari. Hero content enters with motion fadeIn/slideUp variants.

**Features (#features)** — "Built for the Edge" heading. FadeInStagger wrapping 4 Cards (Deep Research, Alpha Intelligence, Automated Pipelines, Alpha Drops) in a responsive grid with GlowHover on each card.

**How It Works (#how-it-works)** — "Three Steps to Alpha" heading. 3 ScrollReveal GlassPanels with numbered steps (Ask → Research → Deliver). Vertical connector line on desktop, staggered delays.

**Agent Preview (#agent)** — "See DRIP in Action" heading. ScrollReveal GlassPanel styled as terminal with window chrome, prompt/system/output lines showing a research session, blinking CSS cursor.

**CTA (#early-access)** — "Ready for the Edge?" heading. ScrollReveal with GlowHover Button and supporting text.

**Navigation** — NavBar links updated to Features/#features, How It Works/#how-it-works, Agent/#agent (Pricing removed). Mobile hamburger toggle added. Footer updated with X/Twitter icon link, Pricing removed. Smooth scroll CSS with 4rem NavBar offset.

**Social metadata** — layout.tsx updated with metadataBase (https://drip.surf), openGraph and twitter card objects. Dynamic OG image (1200×630) via ImageResponse API showing DRIP gradient title, tagline, and subtitle. twitter-image.tsx re-exports the same image.

## Verification

- `bash scripts/verify-s04.sh` — 20/20 structural checks pass
- Browser: all 5 sections visible with working scroll animations at desktop
- Browser: ParticleField canvas rendering (console: `Particles: 80 @ 2x`)
- Browser: NavBar shows Features, How It Works, Agent — no Pricing
- Browser: Footer shows X icon link — no Pricing
- Browser: responsive check at 375px, 768px, 1440px — no overflow, readable
- Browser: /opengraph-image renders 1200×630 branded PNG
- Browser: /twitter-image route functional
- Browser assertions: all section IDs visible, key text present, no console errors
- Lighthouse: performance score 91 (FCP 0.8s, TBT 0ms, CLS 0, LCP 3.5s)
- `npm run build` succeeds with all routes in output

## Requirements Advanced

- R002 (Futuristic Animated Landing Page) — Landing page now exists with all specified sections: animated hero with particle effects, features showcase, agent preview teaser, CTA. The design is futuristic and heavily animated.
- R012 (Responsive Design) — Verified responsive at 375px, 768px, 1440px. Feature cards go 1-col mobile, 2-col tablet, 4-col desktop. ParticleField adapts particle count by device.

## Requirements Validated

- R002 — Full landing page shipped: ParticleField hero, 4-card features, 3-step pipeline, mock terminal preview, CTA. All S02 components + S03 animations composed. Lighthouse 91. verify-s04.sh 20/20. Responsive at 3 breakpoints. Awaits human UAT for subjective "futuristic" assessment but structural/functional proof is complete.
- R012 — Responsive at mobile (375px), tablet (768px), desktop (1440px). Feature cards reflow, ParticleField adapts, NavBar has hamburger menu. All content readable, no overflow.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

- NavBar CTA uses `Link` wrapping `Button` instead of `asChild` pattern — Button component doesn't support Slot composition
- CTA section heading is a direct `<h2>` with custom sizing instead of Section heading prop — needed larger text-3xl/4xl/5xl for visual impact

## Known Limitations

- Vercel deployment with custom domain (drip.surf) not yet done — requires user DNS action (S05 or post-milestone)
- OG image social preview not testable until deployed to a public URL
- Hero image warning in dev console about width/height on logo-lockup-mono.svg — cosmetic, doesn't affect production

## Follow-ups

- S05: Social media kit — uses live landing page as visual reference for asset creation
- Vercel deployment: needs user action for domain DNS configuration

## Files Created/Modified

- `app/page.tsx` — Complete rewrite: 5-section landing page with all S02/S03 components
- `app/layout.tsx` — Expanded metadata: metadataBase, openGraph, twitter card objects
- `app/opengraph-image.tsx` — Dynamic OG image generation (1200×630 branded image)
- `app/twitter-image.tsx` — Re-exports OG image for Twitter cards
- `components/layout/navbar.tsx` — Updated links (no Pricing), mobile hamburger toggle
- `components/layout/footer.tsx` — Removed Pricing, added X/Twitter social link
- `app/globals.css` — scroll-behavior: smooth, scroll-padding-top: 4rem
- `scripts/verify-s04.sh` — 20-check structural verification script

## Forward Intelligence

### What the next slice should know
- The landing page at `/` is the complete reference for DRIP's visual identity in production — screenshot it for social asset templates in S05
- OG image at `/opengraph-image` is the social preview image — can be used as basis for X profile/banner design
- All brand colors, fonts, and design patterns are proven and working end-to-end

### What's fragile
- NavBar hamburger menu state is a simple useState toggle — no focus trap or escape-to-close. Works fine but isn't production-grade accessibility
- hero image warning (logo-lockup-mono.svg width/height) — cosmetic console warning, no functional impact

### Authoritative diagnostics
- `bash scripts/verify-s04.sh` — single-command structural verification, 20 checks covering files, anchors, imports, metadata, CSS, semantics, build
- `Particles: {count} @ {dpr}x` in dev console — confirms ParticleField canvas is running
- `/opengraph-image` route — 200 = OG working, 404 = generation broke

### What assumptions changed
- Landing page Lighthouse target was ≥ 80 — actual score is 91, well above threshold
- LCP at 3.5s is the main Lighthouse deduction — could be improved with font preloading or image optimization but isn't blocking
