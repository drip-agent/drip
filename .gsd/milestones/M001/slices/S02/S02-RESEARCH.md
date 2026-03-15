# S02: Design System & Dark Theme — Research

**Date:** 2026-03-15

## Summary

S02 builds on S01's design token foundation to create the full component library that S03 (animation engine) and S04 (landing page) consume. The codebase is clean — Next.js 16 + Tailwind v4 with CSS-first `@theme` tokens, three fonts wired, and a surface hierarchy (dark-deepest/surface/elevated) already defined. No components exist yet; no component tooling is installed.

The component inventory from the boundary map is: `Button`, `Card`, `GlassPanel`, `Container`, `Badge`, `Input`, `GlowBorder` (UI primitives) plus `Section`, `NavBar`, `Footer` (layout). CSS utilities needed: `.glass` (glassmorphism), background gradient classes, and the existing glow shadows wired into component variants. The showcase page at `/design` proves everything renders.

The recommended stack is **CVA + clsx + tailwind-merge** for the `cn()` utility pattern — the same approach shadcn/ui popularized. This gives type-safe variants on every component, clean className merging for overrides, and zero runtime overhead. Custom utilities (glass, gradients) go through Tailwind v4's `@utility` directive in `globals.css`. No external component library needed — everything is bespoke to the DRIP design language.

## Recommendation

Use **CVA (class-variance-authority)** for component variant definitions, **clsx** for conditional class composition, and **tailwind-merge** for conflict-free className merging. Create a `cn()` utility in `lib/utils.ts` that pipes clsx through twMerge — this is the standard pattern and S03/S04 will use it heavily for component customization.

Define glassmorphism and gradient utilities using Tailwind v4's `@utility` directive in `globals.css` alongside the existing `@theme` tokens. This keeps all design system CSS in one file and avoids a separate CSS module layer.

Component structure: `components/ui/` for primitives, `components/layout/` for page structure. Each component is a single `.tsx` file exporting a typed React component with CVA variants. No barrel exports — direct imports keep tree-shaking clean.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Component variant management | `class-variance-authority` (CVA) | Type-safe variants, `VariantProps` type extraction, composable. Industry standard. |
| Conditional className composition | `clsx` | Handles arrays, objects, falsy values. CVA re-exports it as `cx` but standalone `clsx` is lighter and decoupled. |
| Tailwind class conflict resolution | `tailwind-merge` | Prevents `p-2` + `p-4` → both in DOM. Critical for components that accept `className` overrides. |
| Glassmorphism CSS | Tailwind v4 `@utility` | Native Tailwind approach — auto-sorts, works with variants (hover:, lg:), avoids global CSS leaks. |

## Existing Code and Patterns

- `app/globals.css` — All design tokens live here under `@theme`. 5 palette colors, 3 dark backgrounds, 3 glow shadows, custom spacing, border-radius. New `@utility` definitions and any additional `@theme` tokens go here.
- `app/layout.tsx` — Root layout with three Google Fonts via `next/font/google` + CSS variable mode. Body has `bg-dark-deepest text-white antialiased`. New layout components (NavBar, Footer) wrap `{children}` here or in page-level layouts.
- `app/brand/page.tsx` — Data-driven component pattern. Arrays of config objects mapped to render functions. Good template for the `/design` showcase page.
- `app/page.tsx` — Minimal home page exercising all token categories. Will be replaced in S04 but useful for quick visual token checks during S02.
- Font variable chain: `next/font/google` → `variable` prop → className on `<html>` → `@theme inline` → Tailwind utility. Fragile — if any link breaks, fonts fall back silently.

## Constraints

- **Tailwind v4.2.1 CSS-first** — No `tailwind.config.ts`. All custom values go through `@theme` or `@utility` in `globals.css`. The `@utility` directive replaces v3's `@layer utilities {}`.
- **Next.js 16.1.6 with App Router** — Components must be client components (`'use client'`) only if they use hooks/interactivity. Pure display components stay as server components for zero JS overhead.
- **Dark-only** — No light mode toggle (D005). Every component assumes dark backgrounds. No `dark:` prefix variants needed.
- **CVA stable vs beta** — Two versions exist: `class-variance-authority` (stable, v0.7.x) uses `cva(base, { variants })` syntax. `cva@beta` uses `cva({ base, variants })` object syntax + `defineConfig` for tw-merge integration. Use **stable** (`class-variance-authority`) — it's proven, widely documented, and the `cn()` pattern is simpler than `defineConfig`.
- **`backdrop-filter` for glassmorphism** — Supported in all modern browsers (96%+ global support). No fallback needed for the target audience (crypto degens on modern browsers). Safari requires `-webkit-backdrop-filter` which Tailwind v4 autoprefixes.
- **R003 requires consistency** — The design language must feel unified across landing page (S04) and future agent UI (M002). Components must be genuinely reusable, not page-specific.

## Common Pitfalls

- **Tailwind v4 `@utility` must be top-level** — Cannot nest inside `@layer base` or other at-rules. Each utility is a standalone `@utility name { ... }` block. Can use `@apply` inside.
- **`tailwind-merge` doesn't know custom theme values** — `twMerge('bg-dark-surface', 'bg-dark-elevated')` works because tw-merge handles `bg-*` generically. But custom shadow names like `shadow-glow-sm` vs `shadow-glow-md` resolve correctly because tw-merge strips conflicting `shadow-*` classes. Tested fine with Tailwind v4 custom theme values.
- **`@utility` sorting** — Tailwind v4 sorts custom utilities by property count. Multi-property utilities (like `.glass` with 3+ properties) sort before single-property utilities, meaning standard Tailwind classes override them. This is the correct behavior — `.glass bg-red-500` lets `bg-red-500` win.
- **Client component boundary** — Button with onClick is client. Card displaying content is server. Don't make everything `'use client'` just because it's a "component". Only interactive primitives (Button, Input) need the directive. Layout and display components stay server.
- **Missing CSS variable fallback** — If `--font-heading` CSS variable doesn't resolve (font load failure), heading font falls back to `ui-sans-serif, system-ui, sans-serif` as defined in `@layer base`. This is already handled in globals.css.

## Open Risks

- **CVA + Tailwind v4 edge cases** — CVA is class-string-based and doesn't care about the CSS framework, so no real compatibility risk. But `tailwind-merge` was built for Tailwind v3 class patterns. It handles v4 fine for standard utilities; the risk is with complex custom `@theme` values that use unusual naming patterns. Our token names (`bg-dark-deepest`, `shadow-glow-md`) follow standard Tailwind conventions so this should be safe. Verify during implementation.
- **Component showcase completeness vs. S03/S04 needs** — We're designing components before knowing exactly how S03 animations and S04 layout will use them. Risk of building variants that go unused or missing variants that are needed. Mitigation: build the core set from the boundary map, keep variant surfaces minimal, and accept that S03/S04 may add variants.
- **NavBar glassmorphism + scroll** — NavBar with `backdrop-filter: blur()` on scroll over particle systems (S03) may cause compositing layer performance issues. This is an S03 concern but the NavBar structure we define here needs to be compatible. Keep the NavBar simple — the blur effect can be refined in S03.

## Requirements Targeted

| Requirement | Role | What This Slice Must Deliver |
|-------------|------|------------------------------|
| R003 (Dark Theme + Aqua Glow Design Language) | Primary owner | Complete component library with dark backgrounds, aqua glow accents, glassmorphism. All UI primitives in the DRIP design language. |
| R002 (Futuristic Animated Landing Page) | Supporting | Components that S04 assembles into the landing page — cards, buttons, containers, nav, footer, glass panels. |
| R012 (Responsive Design) | Supporting | Components must be responsive-ready. Mobile-first sizing, responsive variant support in component APIs. |

## Component Inventory

| Component | Location | CVA Variants | Notes |
|-----------|----------|-------------|-------|
| `Button` | `components/ui/button.tsx` | variant: primary/secondary/ghost/outline, size: sm/md/lg | Primary CTA uses aquamarine bg + glow. Ghost for nav links. |
| `Card` | `components/ui/card.tsx` | variant: default/elevated/featured | dark-surface bg, border, optional glow border on featured. |
| `GlassPanel` | `components/ui/glass-panel.tsx` | blur: sm/md/lg | Glassmorphism container — backdrop-blur + semi-transparent bg + aqua-tinted border. |
| `Badge` | `components/ui/badge.tsx` | variant: default/accent/info | Small inline label. Default is blue-slate, accent is aquamarine, info is soft-cyan. |
| `Input` | `components/ui/input.tsx` | — | Text input with dark-surface bg, ocean-mist border, focus glow ring. |
| `GlowBorder` | `components/ui/glow-border.tsx` | intensity: sm/md/lg | Wrapper that adds aqua glow border to children. Used to highlight featured content. |
| `Container` | `components/layout/container.tsx` | size: default/narrow/wide | Max-width wrapper with responsive horizontal padding. |
| `Section` | `components/layout/section.tsx` | spacing: default/compact/spacious | Vertical page section with consistent padding and optional heading. |
| `NavBar` | `components/layout/navbar.tsx` | — | Fixed top nav with logo, links, glass background. Client component (scroll state). |
| `Footer` | `components/layout/footer.tsx` | — | Dark bottom section with logo, links, copyright. Server component. |

## CSS Utilities to Add

| Utility | Implementation | Purpose |
|---------|---------------|---------|
| `glass` | `@utility glass { backdrop-filter: blur(12px); background: rgba(17, 24, 32, 0.7); border: 1px solid rgba(189, 255, 253, 0.1); }` | Glassmorphism effect — the signature DRIP panel style. |
| `glass-strong` | Same as glass but with `blur(20px)` and higher bg opacity | Stronger glass for navbars and overlays. |
| `gradient-aqua` | `@utility gradient-aqua { background: linear-gradient(135deg, #bdfffd, #7cffc4); }` | Primary brand gradient (icy-aqua → aquamarine). |
| `gradient-radial-glow` | Radial gradient using aqua colors at low opacity | Subtle background glow effect for sections. |
| `text-gradient-aqua` | Background-clip text with the aqua gradient | Gradient text effect for headings and emphasis. |

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Tailwind CSS | `jezweb/claude-skills@tailwind-patterns` (1.1K installs) | Available — patterns guide for Tailwind. Potentially useful but we're using v4-specific features not covered. |
| Design System (React) | `samhvw8/dot-claude@ui-design-system` (2K installs) | Available — generic design system skill. High install count but likely generic; we're building a bespoke system. |
| Frontend Design | `frontend-design` | Installed — available in `<available_skills>`. Will use for component implementation quality. |

## Sources

- CVA variant API, `VariantProps`, and `cx` utility (source: [CVA GitHub docs](https://github.com/joe-bell/cva))
- `tailwind-merge` class conflict resolution for React component className overrides (source: [tailwind-merge docs](https://github.com/dcastil/tailwind-merge))
- Tailwind v4 `@utility` directive replaces `@layer utilities` for custom classes (source: [Tailwind CSS v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide))
- `@utility` supports `@apply`, nesting, and auto-sorts by property count (source: [Tailwind v4 custom styles docs](https://tailwindcss.com/docs/adding-custom-styles))
- `tailwind-variants` evaluated — slots feature is powerful but adds unnecessary complexity for a bespoke system (source: [tailwind-variants.org](https://www.tailwind-variants.org/docs/introduction))
- S01 summary forward intelligence: tokens in `@theme` in globals.css, surface hierarchy `dark-deepest → dark-surface → dark-elevated`, glow shadows `shadow-glow-sm/md/lg` (source: S01-SUMMARY.md)
