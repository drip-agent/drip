# S03: Animation Engine

**Goal:** Deliver the animation engine that makes DRIP feel futuristic — scroll-triggered reveals, canvas particle system, glow hover effects, staggered content reveals, and page transitions, all respecting `prefers-reduced-motion`.
**Demo:** Animation demo page at `/motion` shows working scroll-triggered reveals, particle system, glow hover effects, staggered reveals, and page transitions — all running at 60fps on desktop.

## Must-Haves

- 5 animation components: ScrollReveal (GSAP), ParticleField (Canvas 2D), GlowHover (Motion), FadeInStagger (Motion), PageTransition (Motion)
- 2 utility modules: `lib/gsap-utils.ts` (ScrollTrigger defaults, easing presets, reduced-motion wrapper), `lib/motion-variants.ts` (8 named variant presets)
- All components respect `prefers-reduced-motion` — skip animations, show static fallbacks
- ParticleField uses adaptive particle count: ~80 desktop, ~40 tablet, ~20 mobile, CSS gradient fallback for reduced-motion
- GSAP for scroll-driven effects, Motion for React lifecycle animations (D004 responsibility split)
- All components use `'use client'` directive (browser APIs required)
- Demo page at `/motion` exercises every component
- `npm run build` passes with `/motion` route

## Proof Level

- This slice proves: operational — animations run at target performance, reduced-motion works
- Real runtime required: yes (browser needed to verify animation behavior)
- Human/UAT required: no (visual quality UAT is S04's concern; S03 proves the engine works)

## Verification

- `bash scripts/verify-s03.sh` — automated checks: file existence, exports, package deps, `prefers-reduced-motion` handling, build pass
- `npm run build` — exit 0, `/motion` route in build output
- Browser: `/motion` page renders 5 sections with working animations (manual smoke test during T02)
- Diagnostic: ParticleField logs `Particles: {count} @ {dpr}x` to dev console — verify particle count adapts by viewport width. Toggle `prefers-reduced-motion: reduce` in DevTools and confirm CSS gradient fallback renders instead of canvas.

## Observability / Diagnostics

- Runtime signals: ParticleField logs adaptive particle count to console in development (`Particles: {count} @ {dpr}x`)
- Inspection surfaces: `/motion` demo page — primary visual inspection surface for all animation components
- Failure visibility: reduced-motion state visible via CSS media query toggle in DevTools; particle fallback renders as CSS gradient
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: S02 components (`Button`, `Card`, `GlassPanel`, `Section`, `Container`), `cn()` utility, CSS glow/glass utilities, Tailwind theme tokens
- New wiring introduced: PageTransition client wrapper in `app/layout.tsx`; animation components directory `components/animation/`
- What remains before milestone is usable end-to-end: S04 assembles these animation components with S02 UI components into the landing page; S05 produces social assets

## Tasks

- [x] **T01: Build animation components and utility modules** `est:2h`
  - Why: Creates the entire animation component library — every reusable piece S04 needs to build the landing page
  - Files: `lib/gsap-utils.ts`, `lib/motion-variants.ts`, `components/animation/scroll-reveal.tsx`, `components/animation/particle-field.tsx`, `components/animation/glow-hover.tsx`, `components/animation/fade-in-stagger.tsx`, `components/animation/page-transition.tsx`
  - Do: Install gsap + @gsap/react + motion. Create gsap-utils with ScrollTrigger defaults, easing presets, and `gsap.matchMedia()` reduced-motion wrapper. Create motion-variants with 8 named presets (fadeIn, slideUp, slideDown, slideLeft, slideRight, scaleIn, staggerContainer, staggerItem). Build ScrollReveal using useGSAP + ScrollTrigger with direction prop (up/down/left/right). Build ParticleField with Canvas 2D, adaptive particle count by breakpoint, DPR capped at 2, connection lines between nearby particles, CSS gradient fallback for reduced-motion. Build GlowHover with Motion whileHover animating shadow-glow tokens. Build FadeInStagger with Motion variants + staggerChildren + optional useInView trigger. Build PageTransition with AnimatePresence + usePathname as key. All components use 'use client', accept className via cn(), handle reduced-motion.
  - Verify: `npm run build` passes, all 7 files exist with correct exports
  - Done when: All 5 animation components and 2 utility modules exist, compile, and export their public APIs

- [x] **T02: Demo page at /motion and verification script** `est:1.5h`
  - Why: Composes all animation components into a single demo page that proves the engine works, and writes the verification script that gates slice completion
  - Files: `app/motion/page.tsx`, `app/layout.tsx`, `scripts/verify-s03.sh`
  - Do: Wire PageTransition wrapper into app/layout.tsx (layout stays server component, PageTransition is client child). Build /motion page with 5 sections: (1) ParticleField hero with overlay text, (2) ScrollReveal showcase with cards revealing from 4 directions, (3) FadeInStagger grid of items appearing sequentially, (4) GlowHover gallery with cards and buttons, (5) Variant presets interactive showcase. Use S02 components (Card, Button, GlassPanel, Section, Container) as content within animation wrappers. Write verify-s03.sh checking: 7 animation files exist, package deps installed, 'use client' on all components, prefers-reduced-motion handled in gsap-utils and particle-field, motion-variants exports 8 presets, build passes with /motion route.
  - Verify: `bash scripts/verify-s03.sh` — all checks pass
  - Done when: /motion page renders in browser with all 5 animation sections working, verify-s03.sh passes all checks, `npm run build` exit 0

## Files Likely Touched

- `package.json` — gsap, @gsap/react, motion dependencies
- `lib/gsap-utils.ts` — GSAP ScrollTrigger defaults, easing presets, reduced-motion wrapper
- `lib/motion-variants.ts` — 8 named Motion variant presets
- `components/animation/scroll-reveal.tsx` — ScrollReveal (GSAP ScrollTrigger)
- `components/animation/particle-field.tsx` — ParticleField (Canvas 2D + rAF)
- `components/animation/glow-hover.tsx` — GlowHover (Motion whileHover)
- `components/animation/fade-in-stagger.tsx` — FadeInStagger (Motion variants)
- `components/animation/page-transition.tsx` — PageTransition (Motion AnimatePresence)
- `app/motion/page.tsx` — Animation demo page
- `app/layout.tsx` — PageTransition wrapper wiring
- `scripts/verify-s03.sh` — Verification script
