---
id: T01
parent: S03
milestone: M001
provides:
  - Animation utility modules (gsap-utils, motion-variants)
  - 5 animation components (ScrollReveal, ParticleField, GlowHover, FadeInStagger, PageTransition)
  - GSAP + @gsap/react + motion dependencies
key_files:
  - lib/gsap-utils.ts
  - lib/motion-variants.ts
  - components/animation/scroll-reveal.tsx
  - components/animation/particle-field.tsx
  - components/animation/glow-hover.tsx
  - components/animation/fade-in-stagger.tsx
  - components/animation/page-transition.tsx
key_decisions:
  - Canvas 2D with requestAnimationFrame for particle system (D021 confirmed)
  - Motion easing as typed tuple [number, number, number, number] for TypeScript compatibility
  - ParticleField checks reduced-motion via window.matchMedia at render time (not useReducedMotion) since it controls canvas vs gradient fallback at component level
patterns_established:
  - Animation components in components/animation/ directory (D020)
  - GSAP components use useGSAP hook for cleanup, Motion components use useReducedMotion
  - Reduced-motion handling at every layer — GSAP matchMedia, Motion useReducedMotion, direct window.matchMedia for canvas
observability_surfaces:
  - ParticleField dev console log: "Particles: {count} @ {dpr}x" on mount and resize
  - prefers-reduced-motion toggle in DevTools reveals fallback behavior for all components
duration: 25min
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Build animation components and utility modules

**Built the complete animation component library — 2 utility modules and 5 components, all compiling and respecting prefers-reduced-motion.**

## What Happened

Installed gsap (3.14.2), @gsap/react (2.1.2), and motion (12.36.0). Created `lib/gsap-utils.ts` with ScrollTrigger registration, default trigger config, easing presets, and a `withReducedMotion` wrapper using `gsap.matchMedia()`. Created `lib/motion-variants.ts` with 8 named variant presets (fadeIn, slideUp, slideDown, slideLeft, slideRight, scaleIn, staggerContainer, staggerItem) plus an aggregate export.

Built 5 animation components:
- **ScrollReveal** — GSAP + ScrollTrigger with 4 directions, useGSAP for cleanup, immediate render for reduced-motion
- **ParticleField** — Canvas 2D with adaptive particle count (80/40/20 by breakpoint), DPR capped at 2/1.5/1, connection lines between nearby particles, CSS gradient-radial-glow fallback for reduced-motion
- **GlowHover** — Motion whileHover animating box-shadow to glow tokens at 3 intensity levels (sm/md/lg), spring transition
- **FadeInStagger** — Motion variants with staggerChildren, optional viewport trigger via useInView, wraps each child in motion.div
- **PageTransition** — AnimatePresence mode="wait" keyed by usePathname, fadeIn variant

Fixed one type error: Motion's Easing type requires a tuple, not a plain array. Changed easing constant to `as [number, number, number, number]`.

## Verification

- `npm run build` — exit 0, all TypeScript compiles
- All 7 files exist at expected paths
- All 5 components have `"use client"` directive
- `gsap-utils.ts` contains `prefers-reduced-motion` (3 occurrences)
- `particle-field.tsx` contains adaptive breakpoint logic (1024, 768) and gradient fallback
- `motion-variants.ts` exports 8 named variants + 1 aggregate
- `gsap-utils.ts` exports registerGSAP, defaultScrollTrigger, easings, withReducedMotion

Slice-level checks not yet applicable: /motion route and verify-s03.sh are T02 scope.

## Diagnostics

- ParticleField logs `Particles: {count} @ {dpr}x` to dev console on mount/resize (development only)
- Toggle `prefers-reduced-motion: reduce` in DevTools → all components render children statically, ParticleField shows CSS gradient
- ScrollReveal degrades to immediate render if GSAP plugins missing (no crash)
- GlowHover and FadeInStagger render children without animation when reduced-motion is active

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `package.json` — added gsap, @gsap/react, motion dependencies
- `lib/gsap-utils.ts` — GSAP utility module with ScrollTrigger registration, defaults, easing presets, reduced-motion wrapper
- `lib/motion-variants.ts` — 8 named Motion variant presets with aggregate export
- `components/animation/scroll-reveal.tsx` — ScrollReveal component (GSAP + ScrollTrigger)
- `components/animation/particle-field.tsx` — ParticleField component (Canvas 2D + rAF, adaptive, CSS fallback)
- `components/animation/glow-hover.tsx` — GlowHover component (Motion whileHover, 3 intensities)
- `components/animation/fade-in-stagger.tsx` — FadeInStagger component (Motion variants + stagger + viewport trigger)
- `components/animation/page-transition.tsx` — PageTransition component (AnimatePresence + pathname key)
