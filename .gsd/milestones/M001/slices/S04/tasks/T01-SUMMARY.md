---
id: T01
parent: S04
milestone: M001
provides:
  - Complete 5-section animated landing page at /
  - NavBar with updated anchor links and mobile hamburger menu
  - Footer with X/Twitter link, no dead Pricing link
  - Smooth scroll CSS with NavBar offset
key_files:
  - app/page.tsx
  - components/layout/navbar.tsx
  - components/layout/footer.tsx
  - app/globals.css
key_decisions:
  - NavBar CTA wraps Button in Link tag (no asChild support on Button component)
  - ScrollReveal used for How It Works steps (3 instances), Agent Preview (1), CTA (1) = 5 total, under 6 limit
  - FadeInStagger used for Features card grid (single viewport observer)
  - Hero uses motion/react fadeIn+slideUp for entrance instead of ScrollReveal (already in viewport)
  - Terminal mock uses static content with CSS pulse cursor (no JS typing animation — keeps it simple and reliable)
patterns_established:
  - Landing page composition pattern: NavBar + main with sections + Footer, all within page.tsx (each page owns its chrome)
  - Section IDs match NavBar href anchors for smooth scroll navigation
  - Hero pattern: ParticleField (fixed z-0) + Container (relative z-10) with min-h-dvh
observability_surfaces:
  - ParticleField console.log in dev mode: `Particles: {count} @ {dpr}x`
  - Section anchor IDs in DOM: #features, #how-it-works, #agent, #early-access
  - NavBar glass-strong class applied when scrollY > 20
  - Build errors surface SSR/import issues immediately
duration: 25min
verification_result: passed
completed_at: 2026-03-15
blocker_discovered: false
---

# T01: Build full animated landing page with all sections

**Built complete 5-section DRIP landing page with ParticleField hero, animated feature cards, step-by-step pipeline, mock terminal agent preview, and CTA — plus NavBar/Footer updates and smooth scroll.**

## What Happened

Replaced the placeholder page.tsx with the full landing page composing all S02 UI components and S03 animation components. Five sections:

1. **Hero** — ParticleField background (fixed, z-0), gradient-text H1 "DRIP", Badge ("AI Research Agent"), tagline, two CTAs. Uses `min-h-dvh` for iOS Safari. Hero content enters with motion fadeIn/slideUp variants.

2. **Features** (#features) — "Built for the Edge" heading. FadeInStagger wrapping 4 Cards (Deep Research, Alpha Intelligence, Automated Pipelines, Alpha Drops) in a responsive grid. GlowHover on each card.

3. **How It Works** (#how-it-works) — "Three Steps to Alpha" heading. 3 ScrollReveal GlassPanels with numbered steps (Ask → Research → Deliver). Vertical connector line on desktop. Staggered delays.

4. **Agent Preview** (#agent) — "See DRIP in Action" heading. ScrollReveal GlassPanel styled as terminal with window chrome, prompt/system/output lines showing a research session, blinking cursor.

5. **CTA** (#early-access) — "Ready for the Edge?" heading. ScrollReveal with GlowHover Button. Supporting text.

NavBar updated: links now Features/#features, How It Works/#how-it-works, Agent/#agent. Pricing removed. Mobile hamburger toggle added (visible below md:, toggles dropdown). CTA button always visible.

Footer updated: Pricing link removed, X/Twitter icon link added with proper SVG, separator between nav links and social.

globals.css: `scroll-behavior: smooth` and `scroll-padding-top: 4rem` on html selector.

## Verification

- `npm run build` — succeeds, `/` route in output ✅
- Browser: all 5 sections visible at desktop viewport ✅
- Browser: ParticleField canvas rendering with connected particles ✅
- Browser: NavBar shows Features, How It Works, Agent — no Pricing ✅
- Browser: clicking Features link navigates to `#features` URL ✅
- Browser: Footer shows Features, Privacy, Terms + X icon — no Pricing ✅
- Browser assertions: 9/9 pass (all section IDs visible, key text present, no console errors) ✅
- Heading hierarchy: H1 only in hero, H2 via Section heading prop, H3 for sub-items ✅
- ScrollReveal count: 5 instances (under 6 limit) ✅
- `min-h-dvh` on hero, no `min-h-screen` ✅
- Structural grep: all 4 section IDs present, all animation imports used, scroll CSS applied ✅

### Slice-level verification (partial — T01 is intermediate task)
- `bash scripts/verify-s04.sh` — not yet created (T02 responsibility)
- Browser homepage loads with all 5 sections ✅
- Responsive check — not yet verified (T02 responsibility)
- Lighthouse — not yet run (T02 responsibility)

## Diagnostics

- Section IDs in DOM: grep for `id="features"`, `id="how-it-works"`, `id="agent"`, `id="early-access"`
- ParticleField: dev console shows `Particles: {count} @ {dpr}x` on load
- NavBar scroll state: `glass-strong` class toggled at scrollY > 20
- Animation failures degrade to static content (prefers-reduced-motion supported)
- Build: `npm run build` catches SSR/import errors

## Deviations

- Used `Link` wrapping `Button` for NavBar CTA instead of `asChild` pattern — Button component doesn't support asChild/Slot
- CTA section heading is a direct `<h2>` instead of Section heading prop — needed different sizing (text-3xl sm:text-4xl lg:text-5xl) for the final CTA impact

## Known Issues

None.

## Files Created/Modified

- `app/page.tsx` — Complete rewrite: 5-section landing page with all S02/S03 components composed
- `components/layout/navbar.tsx` — Updated links (no Pricing), added mobile hamburger toggle
- `components/layout/footer.tsx` — Removed Pricing, added X/Twitter social link with SVG icon
- `app/globals.css` — Added scroll-behavior: smooth and scroll-padding-top: 4rem to html
- `.gsd/milestones/M001/slices/S04/S04-PLAN.md` — Added diagnostic verification checks (pre-flight fix)
- `.gsd/milestones/M001/slices/S04/tasks/T01-PLAN.md` — Added Observability Impact section (pre-flight fix)
