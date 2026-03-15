---
id: T02
parent: S03
milestone: M001
provides:
  - /motion demo page exercising all 5 animation components with S02 design system content
  - PageTransition wired into app/layout.tsx for route-change animations
  - verify-s03.sh verification script (29 checks, all passing)
key_files:
  - app/motion/page.tsx
  - app/layout.tsx
  - scripts/verify-s03.sh
key_decisions:
  - none (composed existing patterns from T01 and S02)
patterns_established:
  - Animation components wrap S02 components — proves the two layers compose cleanly
  - Section + Container from S02 used as structural frame for animation demo sections
observability_surfaces:
  - /motion page — primary visual inspection surface for all animation components
  - ParticleField logs "Particles: {count} @ {dpr}x" to dev console (confirmed 80 @ 2x on desktop)
  - verify-s03.sh — 29 automated checks covering files, deps, directives, exports, build
duration: 25m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T02: Demo page at /motion and verification script

**Composed all 5 animation components into a demo page at `/motion` with S02 design system content, wired PageTransition into the app layout, and wrote a 29-check verification script that passes fully.**

## What Happened

1. Wired PageTransition into `app/layout.tsx` — imported the client component and wrapped `{children}` with `<PageTransition>`. Layout remains a server component; PageTransition is a client child. Build passed immediately after.

2. Built `app/motion/page.tsx` with 5 distinct sections:
   - **Hero:** ParticleField as fixed canvas background with overlay text, badges showing motion state
   - **ScrollReveal showcase:** 4 Cards in a grid, each wrapped in ScrollReveal with a different direction (up/down/left/right), labeled with Badge
   - **FadeInStagger demo:** 8 items (Cards with Badges) in a grid that stagger-animate on scroll
   - **GlowHover gallery:** 3 Cards at sm/md/lg intensity + 3 Buttons wrapped in GlowHover
   - **Variant Presets:** 6 Cards each using a named motion-variants preset (fadeIn, slideUp, slideDown, slideLeft, slideRight, scaleIn) with whileInView trigger

   All sections use S02 `Section` + `Container` for structure and `Card`, `Button`, `Badge` as content.

3. Wrote `scripts/verify-s03.sh` with 29 checks covering file existence, package deps, 'use client' directives, prefers-reduced-motion handling, motion-variants exports, demo page existence, PageTransition integration, and build success with /motion in output.

4. Ran verification — 29/29 pass. Build exits 0 with /motion route in output.

5. Browser verification: navigated to localhost:3000/motion, scrolled through all 5 sections, confirmed particles rendering (canvas element visible), all sections present, console diagnostic `Particles: 80 @ 2x` logged.

## Verification

- `bash scripts/verify-s03.sh` — 29/29 checks pass
- `npm run build` — exit 0, `/motion` in build output route list
- Browser: 12/12 assertions pass (all 5 section headings, S03 badges, direction labels, glow buttons, variant names, canvas element)
- Console: `Particles: 80 @ 2x` diagnostic confirmed

### Slice-level verification status (S03):
- ✅ `bash scripts/verify-s03.sh` — all checks pass (29/29)
- ✅ `npm run build` — exit 0, `/motion` route in build output
- ✅ Browser: `/motion` page renders 5 sections with working animations
- ✅ Diagnostic: ParticleField logs `Particles: 80 @ 2x` to dev console

All slice verification checks pass. This is the final task of S03.

## Diagnostics

- `/motion` page — visual inspection surface for all animation components
- ParticleField console log: `Particles: {count} @ {dpr}x` in development
- Toggle `prefers-reduced-motion: reduce` in DevTools to verify reduced-motion fallbacks
- `bash scripts/verify-s03.sh` to validate structural integrity at any time

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/layout.tsx` — added PageTransition import and wrapper around {children}
- `app/motion/page.tsx` — demo page with 5 sections exercising all animation components
- `scripts/verify-s03.sh` — 29-check verification script for S03
- `.gsd/milestones/M001/slices/S03/tasks/T02-PLAN.md` — added Observability Impact section (pre-flight fix)
