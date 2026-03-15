---
id: T02
parent: S02
milestone: M001
provides:
  - Card component with 3 CVA variants (default/elevated/featured)
  - GlassPanel component with 3 blur levels (sm/md/lg)
  - Container layout component with 3 max-width sizes
  - Section layout component with 3 spacing levels and optional heading/subheading
  - NavBar client component with glass background and scroll behavior
  - Footer server component with logo, links, copyright
key_files:
  - components/ui/card.tsx
  - components/ui/glass-panel.tsx
  - components/layout/container.tsx
  - components/layout/section.tsx
  - components/layout/navbar.tsx
  - components/layout/footer.tsx
key_decisions:
  - Card, GlassPanel, Container, Section, Footer are server components — no 'use client' directive
  - NavBar is the only new client component (needs scroll event listener for glass-strong transition)
  - GlassPanel uses CSS specificity override ([&]:backdrop-blur-*) to override the glass utility's default blur for sm/lg variants while keeping md as the glass default
  - Footer uses new Date().getFullYear() at render time for copyright year — valid because it's server-rendered on each request/build
patterns_established:
  - Layout components live in components/layout/ separate from UI primitives in components/ui/
  - Container wraps content with responsive max-width + horizontal padding — used inside NavBar and Footer, available for all page sections
  - Section provides consistent vertical spacing with optional heading/subheading — compose with Container for full-width sections
  - CVA variants + cn() pattern consistent across all components (cardVariants, glassPanelVariants, containerVariants, sectionVariants exported alongside components)
observability_surfaces:
  - "npm run build exit code — all 10 components compile"
  - "grep exports: grep -r 'export.*function' components/ui/ components/layout/ — confirms 10 named exports"
  - "Client directive: head -1 components/layout/navbar.tsx must show 'use client'"
duration: 8m
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T02: Build Card, GlassPanel, and layout components

**Built 6 components (Card, GlassPanel, Container, Section, NavBar, Footer) completing the 10-component design system inventory.**

## What Happened

Built two UI container primitives and four layout components following the CVA + cn() pattern established in T01:

- **Card** — 3 variants: default (dark-surface bg + border), elevated (dark-elevated bg), featured (aqua glow border via shadow-glow-md)
- **GlassPanel** — 3 blur levels: sm (8px), md (glass utility default 12px), lg (20px), all using the `glass` CSS utility as base
- **Container** — 3 max-width sizes: default (6xl), narrow (4xl), wide (7xl), centered with responsive horizontal padding
- **Section** — 3 spacing levels: default/compact/spacious vertical padding, optional heading (font-heading, icy-aqua) and subheading (ocean-mist)
- **NavBar** — Fixed top nav with scroll-based glass-strong transition, logo SVG, nav links, CTA button. Only new client component.
- **Footer** — Dark section with logo, nav links, copyright year. Server component using Container for layout.

## Verification

- `npm run build` — exits 0, all 10 components compile, no TypeScript errors
- All 6 new files exist in components/ui/ and components/layout/
- 10 total component files confirmed (4 from T01 + 6 from T02)
- NavBar has `'use client'` directive; all other 5 new components do not
- CSS utility count remains 5 (no changes to globals.css)
- Slice-level: `scripts/verify-s02.sh` not yet created (T03 deliverable) — expected

## Diagnostics

- Build compiles all 10 components — TypeScript errors from missing imports or type mismatches would surface here
- `grep -r 'export.*function' components/ui/ components/layout/` — audit all named component exports
- `head -1 components/layout/navbar.tsx` — verify client directive
- Missing exports would cause import errors when T03 builds the /design showcase page

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/ui/card.tsx` — Card component with default/elevated/featured CVA variants
- `components/ui/glass-panel.tsx` — GlassPanel component with sm/md/lg blur CVA variants
- `components/layout/container.tsx` — Container component with default/narrow/wide max-width CVA variants
- `components/layout/section.tsx` — Section component with default/compact/spacious spacing CVA variants, optional heading/subheading
- `components/layout/navbar.tsx` — NavBar client component with scroll-based glass-strong background
- `components/layout/footer.tsx` — Footer server component with logo, links, copyright
- `.gsd/milestones/M001/slices/S02/tasks/T02-PLAN.md` — Added Observability Impact section (pre-flight fix)
