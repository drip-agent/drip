---
id: T01
parent: S02
milestone: M001
provides:
  - cn() className composition utility (clsx + tailwind-merge)
  - 5 custom CSS utilities via @utility (glass, glass-strong, gradient-aqua, gradient-radial-glow, text-gradient-aqua)
  - 4 UI primitive components (Button, Badge, Input, GlowBorder) with CVA variants
key_files:
  - lib/utils.ts
  - app/globals.css
  - components/ui/button.tsx
  - components/ui/badge.tsx
  - components/ui/input.tsx
  - components/ui/glow-border.tsx
key_decisions:
  - Used stable CVA v0.7.x with cva() function pattern, not beta defineConfig
  - Button uses forwardRef for composability with form libraries
  - Input uses forwardRef for uncontrolled form patterns
patterns_established:
  - cn() for all className composition — import from @/lib/utils
  - CVA variants exported alongside components (e.g. buttonVariants) for Slot/asChild patterns
  - "use client" only on components with event handlers (Button, Input); Badge and GlowBorder are server components
  - Design token references use Tailwind v4 theme tokens (e.g. bg-dark-surface, text-icy-aqua, border-ocean-mist/30)
observability_surfaces:
  - "npm run build" validates all components compile
  - "grep -c '@utility' app/globals.css" returns 5
  - "grep -r 'export' components/ui/" shows all named exports
duration: ~8min
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Install CVA/clsx/tailwind-merge, create cn() utility, add CSS utilities, and build UI primitives

**Installed component variant toolchain, created cn() utility, added 5 CSS utilities, and built 4 UI primitive components with CVA variants.**

## What Happened

1. Installed `class-variance-authority`, `clsx`, and `tailwind-merge` as dependencies.
2. Created `lib/utils.ts` with `cn()` function (pipes clsx through twMerge) and re-exports `VariantProps` type from CVA.
3. Added 5 `@utility` blocks to `app/globals.css`: glass (backdrop-blur 12px, semi-transparent bg), glass-strong (backdrop-blur 20px, higher opacity), gradient-aqua (linear-gradient 135deg), gradient-radial-glow (radial gradient for section backgrounds), text-gradient-aqua (background-clip text gradient for headings).
4. Built 4 UI primitive components:
   - `button.tsx` — CVA with 4 variants (primary/secondary/ghost/outline) and 3 sizes (sm/md/lg). Primary uses aquamarine bg + glow shadow. Client component with forwardRef.
   - `badge.tsx` — CVA with 3 variants (default/accent/info). Server component. Pill-shaped inline label.
   - `input.tsx` — Dark surface bg, ocean-mist border, focus ring with aqua glow. Client component with forwardRef.
   - `glow-border.tsx` — Wrapper with CVA intensity (sm/md/lg) mapping to shadow-glow tokens. Server component.

## Verification

- `npm run build` exits 0 — compiled successfully, no TypeScript or Tailwind errors
- `grep -c '@utility' app/globals.css` → 5
- All 4 component files exist in `components/ui/` with named exports
- `lib/utils.ts` exports `cn` and re-exports `VariantProps`
- Client/server boundaries correct: Button and Input have `"use client"`, Badge and GlowBorder do not
- **Slice-level checks:** build passes (✓), verify-s02.sh not yet created (T03), /design page not yet created (T03)

## Diagnostics

- Run `npm run build` to verify design system foundation compiles
- `grep -c '@utility' app/globals.css` should return 5
- `ls components/ui/` should show 4 files: badge.tsx, button.tsx, glow-border.tsx, input.tsx
- Component imports: `import { Button } from "@/components/ui/button"` etc.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `lib/utils.ts` — cn() utility function + VariantProps re-export
- `app/globals.css` — Added 5 @utility blocks (glass, glass-strong, gradient-aqua, gradient-radial-glow, text-gradient-aqua)
- `components/ui/button.tsx` — Button component with 4 variants and 3 sizes via CVA
- `components/ui/badge.tsx` — Badge component with 3 variants via CVA
- `components/ui/input.tsx` — Input component with dark theme styling and focus glow ring
- `components/ui/glow-border.tsx` — GlowBorder wrapper with 3 intensity levels via CVA
- `package.json` — Added class-variance-authority, clsx, tailwind-merge dependencies
- `.gsd/milestones/M001/slices/S02/S02-PLAN.md` — Added Observability / Diagnostics section
- `.gsd/milestones/M001/slices/S02/tasks/T01-PLAN.md` — Added Observability Impact section
