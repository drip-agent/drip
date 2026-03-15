---
estimated_steps: 5
estimated_files: 7
---

# T01: Install CVA/clsx/tailwind-merge, create cn() utility, add CSS utilities, and build UI primitives

**Slice:** S02 — Design System & Dark Theme
**Milestone:** M001

## Description

Install the component variant toolchain (CVA + clsx + tailwind-merge), create the `cn()` utility that every component will use for className composition, add glassmorphism and gradient CSS utilities to globals.css via Tailwind v4's `@utility` directive, and build the four atomic UI primitives: Button, Badge, Input, and GlowBorder.

## Steps

1. Install `class-variance-authority`, `clsx`, and `tailwind-merge` as dependencies.
2. Create `lib/utils.ts` with a `cn()` function that pipes `clsx()` through `twMerge()`. Export `cn` and re-export `type VariantProps` from CVA for component typing convenience.
3. Add 5 `@utility` blocks to `app/globals.css` (after existing `@theme` and `@layer` blocks):
   - `glass` — backdrop-blur(12px), semi-transparent dark bg, aqua-tinted border
   - `glass-strong` — backdrop-blur(20px), higher opacity bg for navbars
   - `gradient-aqua` — linear-gradient(135deg, #bdfffd, #7cffc4)
   - `gradient-radial-glow` — radial gradient with aqua at low opacity for section backgrounds
   - `text-gradient-aqua` — background-clip text with aqua gradient for headings
4. Build 4 UI primitive components in `components/ui/`:
   - `button.tsx` — CVA with variant (primary/secondary/ghost/outline) and size (sm/md/lg). Primary uses aquamarine bg + glow shadow. `'use client'` for onClick. Accepts `className` via `cn()`.
   - `badge.tsx` — CVA with variant (default/accent/info). Server component. Small inline label.
   - `input.tsx` — Text input with dark-surface bg, ocean-mist border, focus:ring with aqua glow. `'use client'` for onChange/onFocus. Forwards ref.
   - `glow-border.tsx` — Wrapper component, CVA with intensity (sm/md/lg) mapping to shadow-glow-sm/md/lg. Server component.
5. Verify: `npm run build` succeeds with no errors.

## Must-Haves

- [ ] `cn()` utility in `lib/utils.ts` using clsx + tailwind-merge
- [ ] 5 `@utility` blocks in globals.css (glass, glass-strong, gradient-aqua, gradient-radial-glow, text-gradient-aqua)
- [ ] Button component with 4 variants and 3 sizes, using CVA
- [ ] Badge component with 3 variants, using CVA
- [ ] Input component with dark theme styling and focus glow ring
- [ ] GlowBorder wrapper component with 3 intensity levels, using CVA
- [ ] All components accept `className` prop composed via `cn()`
- [ ] Correct client/server boundaries: Button and Input are `'use client'`, Badge and GlowBorder are server components

## Verification

- `npm run build` exits 0 with no TypeScript or Tailwind errors
- All 4 component files exist in `components/ui/` and export named components
- `lib/utils.ts` exists and exports `cn`
- `grep -c '@utility' app/globals.css` returns 5

## Inputs

- `app/globals.css` — Existing `@theme` tokens (colors, shadows, fonts, spacing, radii) from S01
- `app/layout.tsx` — Root layout with font CSS variables and dark background from S01
- S01 summary: tokens are in `@theme`, surface hierarchy is dark-deepest/surface/elevated, glow shadows are shadow-glow-sm/md/lg

## Expected Output

- `lib/utils.ts` — cn() utility + VariantProps re-export
- `components/ui/button.tsx` — Button component with CVA variants
- `components/ui/badge.tsx` — Badge component with CVA variants
- `components/ui/input.tsx` — Input component with ref forwarding
- `components/ui/glow-border.tsx` — GlowBorder wrapper component
- `app/globals.css` — 5 new @utility blocks added after existing content
- `package.json` — 3 new dependencies added

## Observability Impact

- **Build health:** After this task, `npm run build` validates cn() utility, all 4 UI primitives, and CSS utilities compile without TypeScript or Tailwind errors
- **CSS utility signal:** `grep -c '@utility' app/globals.css` returns 5 — verifiable count of custom CSS utility blocks
- **Component export verification:** `grep -r 'export' components/ui/` shows named exports for Button, Badge, Input, GlowBorder
- **Future agent inspection:** Run `npm run build` to verify design system foundation is intact; check `lib/utils.ts` exports `cn`; check `components/ui/` has 4 files with named exports
- **Failure visibility:** Missing or broken cn() causes TypeScript errors in any component importing it; broken CSS utilities cause Tailwind compilation warnings; missing 'use client' directives cause React hydration errors at runtime
