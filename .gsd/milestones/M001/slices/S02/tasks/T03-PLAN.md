---
estimated_steps: 3
estimated_files: 2
---

# T03: Build component showcase page at /design and slice verification script

**Slice:** S02 — Design System & Dark Theme
**Milestone:** M001

## Description

Build the `/design` showcase page that demonstrates every component and variant from the design system, proving they render correctly in the DRIP design language. Write a verification script that automates file existence, export, and CSS utility checks.

## Steps

1. Build `app/design/page.tsx` as a data-driven showcase page (following the /brand page pattern from S01). Organize into labeled sections:
   - **CSS Utilities** — glass and glass-strong panels, gradient-aqua swatch, gradient-radial-glow background, text-gradient-aqua heading
   - **Buttons** — grid of all variant × size combinations (primary/secondary/ghost/outline × sm/md/lg)
   - **Badges** — row of all 3 variants (default/accent/info)
   - **Input** — default state, with placeholder, showing focus glow styling
   - **GlowBorder** — 3 intensity levels wrapping sample content
   - **Cards** — all 3 variants (default/elevated/featured) side by side
   - **GlassPanel** — all 3 blur levels with sample content
   - **Layout** — Container and Section demos showing sizing and spacing variants
   - Page is wrapped in NavBar + Footer to prove layout components work together
   - Use Section/Container from layout components for page structure
2. Write `scripts/verify-s02.sh` checking:
   - All 10 component files exist (4 in components/ui/, 6 total with layout)
   - `lib/utils.ts` exists
   - `app/design/page.tsx` exists
   - 5 `@utility` blocks present in globals.css
   - Each component file contains an `export` statement
   - `npm run build` succeeds (build check)
   - Summary: X passed, X failed
3. Run verification: `npm run build` to confirm /design route compiles, then `bash scripts/verify-s02.sh` for full check suite.

## Must-Haves

- [ ] `/design` page renders all 10 components with their variants
- [ ] CSS utilities demonstrated visually (glass, gradients, text gradient)
- [ ] Page uses NavBar + Footer for layout proof
- [ ] Page uses Container + Section for structural consistency
- [ ] `scripts/verify-s02.sh` passes all checks
- [ ] `npm run build` shows `/design` as a generated route

## Verification

- `npm run build` — /design route appears in build output
- `bash scripts/verify-s02.sh` — all checks pass (0 failures)
- Visual: /design page in browser shows all component sections with dark theme and aqua accents

## Inputs

- All 10 components from T01 and T02
- `lib/utils.ts` — cn() utility from T01
- `app/globals.css` — CSS utilities from T01
- `app/brand/page.tsx` — pattern reference for data-driven page structure (from S01)
- `public/brand/logo-lockup-mono.svg` — logo for NavBar/Footer

## Observability Impact

- **Showcase page as visual smoke test:** `/design` renders all 10 components — a future agent navigates this route to verify the design system renders without errors.
- **Verification script:** `bash scripts/verify-s02.sh` returns exit code 0 on success, non-zero on failure. Stdout reports per-check pass/fail and a summary line `Results: X passed, X failed`.
- **Build signal:** `npm run build` output includes `/design` in the route table — confirms the showcase page compiles and generates as static content.
- **Failure visibility:** Missing component exports, broken imports, or CSS utility regressions surface as build errors or verification script failures.

## Expected Output

- `app/design/page.tsx` — Complete component showcase page
- `scripts/verify-s02.sh` — Automated verification script with pass/fail reporting
