---
estimated_steps: 5
estimated_files: 8
---

# T01: Build animation components and utility modules

**Slice:** S03 — Animation Engine
**Milestone:** M001

## Description

Install the animation stack (gsap, @gsap/react, motion) and build the entire animation component library: 2 utility modules and 5 components. This is the pure library authoring task — no page composition or verification scripts yet.

GSAP handles scroll-driven effects (ScrollReveal via ScrollTrigger). Motion handles React lifecycle animations (GlowHover via whileHover, FadeInStagger via variants, PageTransition via AnimatePresence). ParticleField is a standalone Canvas 2D system with requestAnimationFrame. This separation follows D004.

Every component must use `'use client'` (browser APIs), accept `className` via `cn()` (S02 pattern), and handle `prefers-reduced-motion`.

## Steps

1. Install animation dependencies: `gsap`, `@gsap/react`, `motion`. Verify they resolve in package.json.

2. Create `lib/gsap-utils.ts` — GSAP utility module:
   - Register ScrollTrigger plugin
   - Export `defaultScrollTrigger` config object (start: "top 85%", end: "bottom 15%", toggleActions: "play none none none")
   - Export easing presets: `easings` object with `smooth`, `snap`, `bounce` values
   - Export `withReducedMotion(normalFn, reducedFn)` wrapper using `gsap.matchMedia()` that runs `reducedFn` (or no-op) when `prefers-reduced-motion: reduce` matches
   - Export `registerGSAP()` function that registers ScrollTrigger (call once at app init)

3. Create `lib/motion-variants.ts` — Motion variant presets:
   - `fadeIn`: opacity 0→1
   - `slideUp`: opacity 0→1, y 40→0
   - `slideDown`: opacity 0→1, y -40→0
   - `slideLeft`: opacity 0→1, x 40→0
   - `slideRight`: opacity 0→1, x -40→0
   - `scaleIn`: opacity 0→1, scale 0.9→1
   - `staggerContainer`: variants with `staggerChildren: 0.1`, `delayChildren: 0.2`
   - `staggerItem`: `slideUp` variant (used as child within staggerContainer)
   - All variants include reasonable duration (0.6s) and easing
   - Export individual variants and a `variants` aggregate object

4. Create GSAP + Canvas components in `components/animation/`:
   - `scroll-reveal.tsx`: Wraps children. Props: `direction` (up/down/left/right, default: up), `delay`, `duration`, `className`, `children`. Uses `useGSAP` hook with ScrollTrigger. Animates from offscreen position + opacity 0 to final position + opacity 1. Reduced-motion: renders children immediately with no animation.
   - `particle-field.tsx`: Full-viewport canvas. Props: `className`, `particleCount` (optional override), `showConnections` (default true). Adaptive defaults: ≥1024px → 80 particles, 768–1023px → 40, <768px → 20. DPR capped at 2 (mobile: 1). Particles: random from aqua palette (#bdfffd, #9ffff5, #7cffc4) at low opacity (0.1–0.4). Motion: slow upward drift + horizontal wander. Connection lines between particles ≤150px apart at opacity 0.05–0.1. Uses `requestAnimationFrame` for render loop. Canvas positioned fixed behind content. Reduced-motion: renders a static CSS `gradient-radial-glow` div instead of canvas. Handles resize, cleanup on unmount. Dev-mode console log of particle count + DPR.

5. Create Motion components in `components/animation/`:
   - `glow-hover.tsx`: Wraps children. Props: `intensity` (sm/md/lg, default: md), `color` (string, default: aqua palette), `className`, `children`. Uses `motion.div` with `whileHover` animating box-shadow to corresponding glow token value. Transition with spring easing. Reduced-motion: renders children without hover animation.
   - `fade-in-stagger.tsx`: Wraps children list. Props: `staggerDelay` (default: 0.1), `className`, `children`, `viewTrigger` (default: true). When `viewTrigger` is true, uses Motion `useInView` to trigger on viewport entry. Applies `staggerContainer` + `staggerItem` variants to children. Each child wrapped in `motion.div` with `staggerItem` variant. Reduced-motion: renders children immediately.
   - `page-transition.tsx`: Layout wrapper. Uses `usePathname()` as AnimatePresence key. Props: `children`. Wraps children in `motion.div` with fadeIn variant. AnimatePresence `mode="wait"` for exit-before-enter. Reduced-motion: renders children without transition.

## Must-Haves

- [ ] gsap, @gsap/react, motion installed and importable
- [ ] `lib/gsap-utils.ts` exports registerGSAP, defaultScrollTrigger, easings, withReducedMotion
- [ ] `lib/motion-variants.ts` exports 8 named variants + variants aggregate
- [ ] ScrollReveal works with 4 directions, uses useGSAP, handles reduced-motion
- [ ] ParticleField renders adaptive Canvas particles with connection lines and CSS gradient fallback
- [ ] GlowHover animates shadow-glow on hover with 3 intensity levels
- [ ] FadeInStagger staggers children with viewport trigger option
- [ ] PageTransition wraps content with AnimatePresence keyed by pathname
- [ ] All 5 components use 'use client' and accept className via cn()
- [ ] All components degrade gracefully for prefers-reduced-motion

## Verification

- `npm run build` exits 0 (all TypeScript compiles, no import errors)
- All 7 files exist in expected paths
- Each component file contains `'use client'` directive
- `gsap-utils.ts` contains `prefers-reduced-motion` string
- `particle-field.tsx` contains adaptive breakpoint logic and gradient fallback

## Observability Impact

- **ParticleField dev console log:** `Particles: {count} @ {dpr}x` — emitted once on mount and on resize, only in development. Confirms adaptive particle count and DPR cap are working correctly.
- **Reduced-motion inspection:** Toggle `prefers-reduced-motion: reduce` in DevTools. All 5 components should render children statically — no animation, no canvas, CSS gradient fallback for ParticleField. `gsap-utils.ts` contains the `withReducedMotion` wrapper using `gsap.matchMedia()` for GSAP-side detection.
- **Failure visibility:** If GSAP plugins aren't registered, ScrollReveal silently renders children without animation (no crash). Motion components degrade to static render if variants are misconfigured. ParticleField catches canvas context failure and falls back to gradient div.

## Inputs

- `lib/utils.ts` — cn() utility for className composition
- `app/globals.css` — shadow-glow-sm/md/lg tokens for GlowHover targets, gradient-radial-glow for ParticleField fallback, glass utilities for depth layering
- S02 component patterns — 'use client' boundary convention, CVA + cn() pattern, forwardRef usage
- S03-RESEARCH.md — architecture decisions, pitfall avoidance (useGSAP for cleanup, DPR capping, initial={false} for hydration)

## Expected Output

- `package.json` — gsap, @gsap/react, motion added to dependencies
- `lib/gsap-utils.ts` — GSAP utility module with ScrollTrigger registration, defaults, easing presets, reduced-motion wrapper
- `lib/motion-variants.ts` — 8 named Motion variant presets with aggregate export
- `components/animation/scroll-reveal.tsx` — ScrollReveal component
- `components/animation/particle-field.tsx` — ParticleField component with adaptive Canvas 2D
- `components/animation/glow-hover.tsx` — GlowHover component
- `components/animation/fade-in-stagger.tsx` — FadeInStagger component
- `components/animation/page-transition.tsx` — PageTransition component
