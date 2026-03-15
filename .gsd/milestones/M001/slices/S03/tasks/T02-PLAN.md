---
estimated_steps: 4
estimated_files: 3
---

# T02: Demo page at /motion and verification script

**Slice:** S03 — Animation Engine
**Milestone:** M001

## Description

Compose all 5 animation components into a demo page at `/motion` that proves the animation engine works end-to-end. Wire PageTransition into the app layout. Write the slice verification script that gates completion.

The demo page is both a proving ground and a reference — S04 will use it to understand how each animation component behaves before assembling the landing page. Each section should use S02 design system components (Card, Button, GlassPanel, Section, Container) as content within animation wrappers, proving the two layers compose cleanly.

## Steps

1. Wire PageTransition into `app/layout.tsx`:
   - Import PageTransition component
   - Wrap `{children}` inside the body with `<PageTransition>{children}</PageTransition>`
   - layout.tsx stays a server component (PageTransition is a client component child)
   - Verify build still passes after this change

2. Build `/motion` demo page (`app/motion/page.tsx`) with 5 sections:
   - **Hero section:** ParticleField as fixed background + overlay text (page title, description) demonstrating particles behind content with z-index layering
   - **ScrollReveal showcase:** 4 Cards inside ScrollReveal wrappers with different directions (up, down, left, right), arranged in a grid. Each card labeled with its reveal direction.
   - **FadeInStagger demo:** Grid of 6–8 items (Badges or small Cards) that appear sequentially when scrolled into view. Shows the stagger timing effect.
   - **GlowHover gallery:** Row of Cards and Buttons wrapped in GlowHover with different intensity levels (sm, md, lg). Hover any to see the glow effect.
   - **Variant presets:** Cards showing each motion-variants preset name with a visual demo — each card uses its named variant via Motion's motion.div.
   - Use Section + Container from S02 layout components for consistent spacing
   - Page should scroll vertically to exercise ScrollTrigger and viewport-entry triggers

3. Write `scripts/verify-s03.sh` verification script:
   - Check all 7 animation files exist (5 components + 2 utilities)
   - Check gsap, @gsap/react, motion in package.json dependencies
   - Check 'use client' directive present in all 5 component files
   - Check prefers-reduced-motion handling in gsap-utils.ts and particle-field.tsx
   - Check motion-variants.ts exports (grep for all 8 variant names)
   - Check /motion page file exists
   - Check PageTransition import in app/layout.tsx
   - Run `npm run build` and verify exit 0 with `/motion` in output
   - Use same check()/pass/fail counter pattern as verify-s02.sh

4. Run verification and fix any issues:
   - Execute `bash scripts/verify-s03.sh`
   - All checks must pass
   - If build fails, fix TypeScript/import errors and rerun

## Must-Haves

- [ ] PageTransition wired into app/layout.tsx without breaking server component status
- [ ] /motion page renders 5 distinct sections exercising all animation components
- [ ] Demo page uses S02 components (Card, Button, Badge, Section, Container) as content
- [ ] verify-s03.sh exists with comprehensive checks and passes fully
- [ ] `npm run build` exits 0 with /motion route in output

## Verification

- `bash scripts/verify-s03.sh` — all checks pass (0 failures)
- `npm run build` — exit 0, `/motion` in build output
- Browser: navigate to localhost:3000/motion, verify 5 sections render with working animations

## Inputs

- `components/animation/*` — all 5 animation components from T01
- `lib/gsap-utils.ts`, `lib/motion-variants.ts` — utility modules from T01
- `components/ui/card.tsx`, `components/ui/button.tsx`, `components/ui/badge.tsx` — S02 UI components for demo content
- `components/layout/section.tsx`, `components/layout/container.tsx` — S02 layout components for page structure
- `app/layout.tsx` — current server component layout, needs PageTransition wrapper
- `scripts/verify-s02.sh` — reference for verification script pattern (check()/pass/fail counter)

## Expected Output

- `app/layout.tsx` — modified to include PageTransition wrapper around children
- `app/motion/page.tsx` — demo page with 5 sections exercising all animation components
- `scripts/verify-s03.sh` — comprehensive verification script, all checks passing

## Observability Impact

- **New inspection surface:** `/motion` page — primary visual proving ground for all 5 animation components. Future agents can navigate here to verify animation behavior.
- **PageTransition:** Wrapping `{children}` in layout.tsx adds route-change animation. If motion is broken, page transitions will fail visibly (content won't appear or will flash). Check by navigating between routes.
- **Verification script:** `scripts/verify-s03.sh` — automated gate for S03 completion. Run it to validate file existence, exports, dependencies, build success, and route presence. Exit code 0 = all clear.
- **Failure visibility:** Build failure surfaces as non-zero exit from `npm run build`. Missing component imports or type errors will block the build. The verification script catches structural issues before the build step.
