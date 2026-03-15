---
estimated_steps: 4
estimated_files: 6
---

# T02: Build Card, GlassPanel, and layout components

**Slice:** S02 — Design System & Dark Theme
**Milestone:** M001

## Description

Build the remaining 6 components: two container primitives (Card, GlassPanel) and four layout components (Container, Section, NavBar, Footer). These complete the component inventory and establish the page structure that S03 animations and S04 landing page will compose.

## Steps

1. Build `components/ui/card.tsx` — CVA with variant (default/elevated/featured). Default uses dark-surface bg + border. Elevated uses dark-elevated bg. Featured adds aqua glow border via shadow-glow-md. Server component. Accepts children + className.
2. Build `components/ui/glass-panel.tsx` — CVA with blur (sm/md/lg) mapping to different backdrop-blur values. Uses the `glass` CSS utility as base. Server component. Accepts children + className.
3. Build `components/layout/container.tsx` — CVA with size (default/narrow/wide) setting max-width (default: max-w-6xl, narrow: max-w-4xl, wide: max-w-7xl). Centered with responsive horizontal padding (px-4 sm:px-6 lg:px-8). Server component.
4. Build `components/layout/section.tsx` — CVA with spacing (default/compact/spacious) setting vertical padding. Optional `heading` prop renders a section title with font-heading. Optional `subheading` prop. Server component. Children slot for content.
5. Build `components/layout/navbar.tsx` — Fixed top nav. Uses `glass-strong` CSS utility for background. Contains logo SVG (from public/brand/logo-lockup-mono.svg), nav links, and CTA button. `'use client'` for scroll-based background opacity change. Uses Container for max-width.
6. Build `components/layout/footer.tsx` — Dark section (dark-surface bg). Logo, navigation links, copyright with current year. Uses Container for max-width. Server component.

## Must-Haves

- [ ] Card with 3 variants (default/elevated/featured), featured has glow border
- [ ] GlassPanel with 3 blur levels using glassmorphism CSS
- [ ] Container with 3 responsive max-width sizes
- [ ] Section with 3 spacing levels and optional heading/subheading
- [ ] NavBar with glass background, logo, links, scroll behavior (`'use client'`)
- [ ] Footer with logo, links, copyright (server component)
- [ ] All 6 components accept `className` via `cn()` from T01

## Verification

- `npm run build` exits 0 — all 10 components compile, no TypeScript errors
- All 6 new component files exist and export named components
- NavBar has `'use client'` directive; Footer, Card, GlassPanel, Container, Section do not

## Inputs

- `lib/utils.ts` — cn() utility from T01
- `app/globals.css` — glass/glass-strong CSS utilities from T01, existing @theme tokens from S01
- `public/brand/logo-lockup-mono.svg` — Logo SVG for NavBar and Footer from S01
- `components/ui/button.tsx` — Button component from T01 (used in NavBar CTA)

## Expected Output

- `components/ui/card.tsx` — Card component with CVA variants
- `components/ui/glass-panel.tsx` — GlassPanel component with blur variants
- `components/layout/container.tsx` — Container component with size variants
- `components/layout/section.tsx` — Section component with spacing variants
- `components/layout/navbar.tsx` — NavBar client component with glass background
- `components/layout/footer.tsx` — Footer server component

## Observability Impact

- **Build signal:** All 6 new components compile via `npm run build` — TypeScript errors surface missing imports or type mismatches immediately
- **Export inspection:** `grep -r 'export.*function\|export.*const' components/ui/card.tsx components/ui/glass-panel.tsx components/layout/` confirms each file exports named components
- **Client directive check:** `head -1 components/layout/navbar.tsx` must show `'use client'`; other 5 files must NOT have it — verifiable via `grep -rL "'use client'" components/layout/container.tsx components/layout/section.tsx components/layout/footer.tsx components/ui/card.tsx components/ui/glass-panel.tsx`
- **Failure visibility:** Missing component exports cause immediate import errors in downstream pages (e.g. `/design` showcase in T03); CVA variant mismatches produce TypeScript errors at build time
