# S02: Design System & Dark Theme

**Goal:** Complete component library in the DRIP design language — all UI primitives and layout components with dark backgrounds, aqua glow accents, and glassmorphism — proven rendering on a showcase page.
**Demo:** Component showcase page at `/design` displays all UI primitives (Button, Card, GlassPanel, Badge, Input, GlowBorder) and layout components (Container, Section, NavBar, Footer) in the DRIP design language with dark backgrounds and aqua glow accents.

## Must-Haves

- `cn()` utility using clsx + tailwind-merge for type-safe className merging
- CVA variants on all interactive/visual components (Button, Card, GlassPanel, Badge, GlowBorder)
- CSS utilities via Tailwind v4 `@utility`: glass, glass-strong, gradient-aqua, gradient-radial-glow, text-gradient-aqua
- All 10 components render correctly with dark-surface backgrounds and aqua palette accents
- NavBar with glassmorphism background, logo, and nav links (client component for scroll state)
- Footer with logo, links, copyright (server component)
- Container with responsive max-width and horizontal padding
- Section with consistent vertical spacing and optional heading
- Showcase page at `/design` exercising every component and variant
- Components accept `className` prop for override composition via `cn()`
- Client/server boundary correct: only Button, Input, NavBar are `'use client'`

## Verification

- `npm run build` — compiles with zero errors, `/design` route generated
- `bash scripts/verify-s02.sh` — file existence, export checks, CSS utility definitions, component count
- Visual: `/design` page renders all components in browser with correct dark theme and aqua accents

## Tasks

- [x] **T01: Install CVA/clsx/tailwind-merge, create cn() utility, add CSS utilities, and build UI primitives** `est:35m`
  - Why: Foundation layer — cn() and CSS utilities are consumed by every component. UI primitives (Button, Badge, Input, GlowBorder) are the atomic building blocks.
  - Files: `package.json`, `lib/utils.ts`, `app/globals.css`, `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/input.tsx`, `components/ui/glow-border.tsx`
  - Do: Install class-variance-authority, clsx, tailwind-merge. Create cn() utility piping clsx through twMerge. Add 5 @utility blocks to globals.css (glass, glass-strong, gradient-aqua, gradient-radial-glow, text-gradient-aqua). Build 4 UI primitives with CVA variants — Button (variant: primary/secondary/ghost/outline, size: sm/md/lg), Badge (variant: default/accent/info), Input (dark-surface bg, ocean-mist border, focus glow ring), GlowBorder (intensity: sm/md/lg wrapper). All accept className via cn(). Button and Input are 'use client', Badge and GlowBorder are server components.
  - Verify: `npm run build` passes, all 4 component files exist and export named components
  - Done when: cn() utility works, 5 CSS utilities defined, 4 UI primitives compile and export

- [x] **T02: Build Card, GlassPanel, and layout components** `est:30m`
  - Why: Container components (Card, GlassPanel) and page structure (Container, Section, NavBar, Footer) complete the component inventory. NavBar and Footer establish the layout shell S04 will use.
  - Files: `components/ui/card.tsx`, `components/ui/glass-panel.tsx`, `components/layout/container.tsx`, `components/layout/section.tsx`, `components/layout/navbar.tsx`, `components/layout/footer.tsx`
  - Do: Build Card (variant: default/elevated/featured with optional glow border on featured), GlassPanel (blur: sm/md/lg using glass CSS utility), Container (size: default/narrow/wide with responsive padding), Section (spacing: default/compact/spacious with optional heading prop), NavBar (fixed top, glass-strong background, logo SVG, nav links, 'use client' for scroll state), Footer (dark section, logo, links, copyright, server component). All accept className via cn(). Layout components use responsive-first sizing.
  - Verify: `npm run build` passes, all 6 component files exist and export
  - Done when: All 10 components in the inventory compile and export correctly

- [x] **T03: Build component showcase page at /design and slice verification script** `est:25m`
  - Why: The demo — proves every component renders in the DRIP design language. Verification script provides automated checks for CI and future agents.
  - Files: `app/design/page.tsx`, `scripts/verify-s02.sh`
  - Do: Build /design page as a data-driven showcase (following the pattern from /brand). Sections for: CSS utilities demo (glass panels, gradients, text gradients), Button variants grid, Badge variants, Input with states, GlowBorder demo, Card variants, GlassPanel variants, Container/Section layout demo, NavBar and Footer in page layout. Write verify-s02.sh checking: all 10 component files exist, lib/utils.ts exists, CSS utilities present in globals.css, /design route builds, component exports are named.
  - Verify: `npm run build` shows /design route, `bash scripts/verify-s02.sh` passes all checks, /design page visually renders all components in browser
  - Done when: /design page renders complete component showcase, verification script passes, npm run build succeeds

## Observability / Diagnostics

- **Build verification:** `npm run build` exit code — primary health signal for all components compiling
- **Verification script:** `bash scripts/verify-s02.sh` — automated file existence, export checks, CSS utility counts; exit code and stdout report pass/fail per check
- **Component inspection:** Each component exports named React components; `grep -r 'export.*function\|export.*const' components/` to audit exports
- **CSS utility count:** `grep -c '@utility' app/globals.css` — must return 5 for this slice's utilities
- **Visual inspection:** `/design` page at dev server — renders all components with correct dark theme and aqua accents
- **Failure visibility:** TypeScript and Tailwind errors surface at build time via `npm run build`; missing component exports cause import errors in `/design` page
- **Redaction:** No secrets or credentials in this slice — purely frontend design system

## Files Likely Touched

- `package.json`
- `lib/utils.ts`
- `app/globals.css`
- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/input.tsx`
- `components/ui/glow-border.tsx`
- `components/ui/card.tsx`
- `components/ui/glass-panel.tsx`
- `components/layout/container.tsx`
- `components/layout/section.tsx`
- `components/layout/navbar.tsx`
- `components/layout/footer.tsx`
- `app/design/page.tsx`
- `scripts/verify-s02.sh`
