# S02: Design System & Dark Theme — UAT

**Milestone:** M001
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (artifact-driven + live-runtime)
- Why this mode is sufficient: Design system components are statically verifiable (file existence, exports, build) plus visually verifiable (render correctness on /design page). No backend or dynamic data involved.

## Preconditions

- `npm install` has been run (dependencies installed)
- Dev server running: `npm run dev` (or build via `npm run build`)
- Browser available for visual inspection

## Smoke Test

Run `bash scripts/verify-s02.sh` — all 24 checks must pass. If this passes, the design system files, exports, CSS utilities, and build are healthy.

## Test Cases

### 1. cn() utility works correctly

1. Open `lib/utils.ts`
2. Confirm it exports a `cn` function that pipes `clsx()` through `twMerge()`
3. Confirm it re-exports `VariantProps` type from `class-variance-authority`
4. **Expected:** `cn('px-4 py-2', 'px-6')` resolves to `'py-2 px-6'` (twMerge deduplicates conflicting classes)

### 2. CSS utilities render correctly

1. Navigate to `http://localhost:3000/design` (or current dev port)
2. Locate the "CSS Utilities" section
3. Verify `glass` panel has visible backdrop blur effect with semi-transparent background
4. Verify `glass-strong` panel has stronger blur and higher opacity than `glass`
5. Verify `gradient-aqua` shows a 135° linear gradient from Icy Aqua to Aquamarine
6. Verify `gradient-radial-glow` shows a radial gradient glow effect
7. Verify `text-gradient-aqua` shows gradient text (not solid color)
8. **Expected:** All 5 CSS utilities render visually distinct effects on dark backgrounds

### 3. Button component — all variants and sizes

1. Navigate to `/design` and locate the "Buttons" section
2. Verify 4 variants render: primary (aquamarine bg with glow), secondary (dark surface), ghost (transparent), outline (border only)
3. Verify 3 sizes render for each variant: sm, md, lg
4. Hover over primary button — confirm it has a glow shadow effect
5. **Expected:** 12 buttons visible (4 variants × 3 sizes), each visually distinct. Primary stands out with aquamarine background and glow.

### 4. Badge component — all variants

1. Locate the "Badges" section on `/design`
2. Verify 3 variants: default (dark surface), accent (aquamarine bg), info (soft-cyan bg)
3. **Expected:** 3 pill-shaped badges with distinct colors matching the aqua palette

### 5. Input component — states

1. Locate the "Input" section on `/design`
2. Verify input with value, placeholder input, and disabled input render
3. Click an enabled input — verify focus ring appears with aqua glow
4. **Expected:** Dark surface background, ocean-mist border, aqua glow ring on focus. Disabled input has reduced opacity.

### 6. GlowBorder component — intensity levels

1. Locate the "GlowBorder" section on `/design`
2. Verify 3 intensity levels render: sm (subtle glow), md (medium glow), lg (strong glow)
3. **Expected:** Each level has progressively stronger aqua glow shadow around its content

### 7. Card component — all variants

1. Locate the "Cards" section on `/design`
2. Verify 3 variants: default (dark-surface bg + border), elevated (dark-elevated bg, no border), featured (aqua glow border effect)
3. **Expected:** Featured card visually stands out with glow effect. All cards have rounded corners and padding.

### 8. GlassPanel component — blur levels

1. Locate the "GlassPanel" section on `/design`
2. Verify 3 blur levels: sm (8px), md (12px), lg (20px)
3. **Expected:** Progressive blur intensity visible. All panels have semi-transparent backgrounds.

### 9. Container component — width sizes

1. Locate the "Container" section on `/design`
2. Verify 3 sizes render: narrow (max-w-4xl), default (max-w-6xl), wide (max-w-7xl)
3. **Expected:** Visible width difference between narrow, default, and wide. All centered with horizontal padding.

### 10. Section component — spacing variants

1. Locate the "Section" section on `/design`
2. Verify 3 spacing levels: compact, default, spacious
3. Verify heading and subheading render when provided
4. **Expected:** Visible vertical spacing difference. Heading in Space Grotesk font with icy-aqua color. Subheading in ocean-mist.

### 11. NavBar renders with glass effect

1. Load `/design` page
2. Scroll down past the hero area
3. Observe the NavBar at the top of the page
4. **Expected:** NavBar is fixed at top. On scroll, background transitions to glass-strong (stronger backdrop blur). Logo and nav links visible.

### 12. Footer renders at page bottom

1. Scroll to the bottom of `/design`
2. **Expected:** Footer section with DRIP logo, navigation links, and copyright with current year. Dark background consistent with theme.

### 13. Build compiles cleanly

1. Run `npm run build`
2. Check output for `/design` route
3. **Expected:** Exit code 0. `/design` listed as a generated route. No TypeScript errors, no Tailwind warnings.

### 14. Verification script passes

1. Run `bash scripts/verify-s02.sh`
2. **Expected:** "24 passed, 0 failed" — all file existence, export, CSS utility, and build checks pass.

## Edge Cases

### Dark backgrounds contrast

1. On `/design`, verify all text is readable against dark backgrounds
2. Check that aqua-colored text (icy-aqua, soft-cyan) has sufficient contrast on dark-surface and dark-elevated backgrounds
3. **Expected:** All text legible. No text disappears into backgrounds.

### className override composition

1. In any component usage, verify that passing a `className` prop merges correctly with internal classes (via cn())
2. **Expected:** Custom classes apply without breaking the component's base styling. Conflicting Tailwind classes resolve via twMerge.

### Server vs client component boundaries

1. Run `head -1 components/ui/button.tsx` — should show `"use client"`
2. Run `head -1 components/ui/input.tsx` — should show `"use client"`
3. Run `head -1 components/layout/navbar.tsx` — should show `"use client"`
4. Run `head -1 components/ui/badge.tsx` — should NOT show `"use client"`
5. Run `head -1 components/ui/card.tsx` — should NOT show `"use client"`
6. Run `head -1 components/layout/footer.tsx` — should NOT show `"use client"`
7. **Expected:** Only 3 components (Button, Input, NavBar) are client components. All others are server components.

## Failure Signals

- `npm run build` fails → component import errors or TypeScript type mismatches
- `verify-s02.sh` reports failures → missing files, broken exports, or CSS utility count wrong
- `/design` page shows white/blank sections → component render errors (check browser console)
- Text invisible or unreadable → contrast issue with dark theme colors
- No glow effects visible → shadow-glow tokens missing from @theme or overridden
- NavBar doesn't stick on scroll → missing `fixed` positioning or z-index issue

## Requirements Proved By This UAT

- R003 (Dark Theme + Aqua Glow Design Language) — All 10 components implement the dark+aqua design language. /design page proves coherence. verify-s02.sh proves structural completeness.
- R012 (Responsive Design) — Partially. Components use responsive-first sizing (Container max-widths, responsive padding). Full viewport testing deferred to S04.

## Not Proven By This UAT

- R002 (Futuristic Animated Landing Page) — Components exist but aren't assembled into the landing page yet (S04)
- R004 (Animation System) — No animations on components yet (S03)
- R012 full responsive verification — Not tested across mobile/tablet/desktop viewports (S04)
- Performance under animation load — Components are static here; 60fps verification comes in S03

## Notes for Tester

- NavBar links (`#features`, `#about`, `#contact`) don't scroll to sections on `/design` — those anchors exist on the landing page (S04), not the showcase
- The `/design` page is a developer reference, not a user-facing page — layout is functional, not polished
- Glow effects may appear subtle on low-contrast monitors — check on a quality display
- The page background should never be pure black (#000) — it uses dark-base and dark-surface tokens
