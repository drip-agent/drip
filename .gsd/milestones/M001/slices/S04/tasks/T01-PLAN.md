---
estimated_steps: 8
estimated_files: 4
---

# T01: Build full animated landing page with all sections

**Slice:** S04 — Landing Page
**Milestone:** M001

## Description

Replace the placeholder `app/page.tsx` with the complete DRIP landing page. Build 5 sections composing S02 UI components and S03 animation components: hero (ParticleField + prominent CTA), features showcase (animated card grid), how-it-works (step-by-step pipeline), agent preview teaser (mock terminal), and final CTA. Update NavBar and Footer links to match the actual page structure. Add smooth scroll CSS with NavBar offset. Load the `frontend-design` skill for high visual quality.

This is the creative heavy lift of S04 — content design, visual composition, and animation orchestration.

## Steps

1. Load `frontend-design` skill for design quality guidance
2. Add `scroll-behavior: smooth` and `scroll-padding-top: 4rem` to `html` selector in `app/globals.css`
3. Update `components/layout/navbar.tsx`: replace navLinks array with Features/#features, How It Works/#how-it-works, Agent/#agent. Add mobile hamburger toggle (button visible below `md:`, toggles a dropdown with nav links). Keep CTA button always visible.
4. Update `components/layout/footer.tsx`: remove "Pricing" link, add "X" external link (https://x.com placeholder), keep Features link
5. Build `app/page.tsx` as a `'use client'` component with 5 sections:
   - **Hero**: ParticleField background (full viewport, fixed), Container z-10 overlay with `<h1>` "DRIP", tagline, Badge ("AI Research Agent"), primary CTA Button. Use `min-h-dvh` for iOS Safari.
   - **Features** (`id="features"`): Section with heading. FadeInStagger wrapping 3-4 Card components describing DRIP capabilities (research, intelligence, automation, alpha drops). GlowHover on each card.
   - **How It Works** (`id="how-it-works"`): Section with heading. ScrollReveal wrapping a 3-step numbered flow (Ask → Research → Deliver or similar). GlassPanel for each step.
   - **Agent Preview** (`id="agent"`): Section with heading. ScrollReveal wrapping a GlassPanel styled as a mock terminal/chat interface with static "typed" text showing an example agent interaction.
   - **CTA** (`id="early-access"`): Section with centered content, GlowHover wrapping a large primary Button, supporting text.
6. Ensure heading hierarchy: `<h1>` in hero only, `<h2>` via Section `heading` prop for all other sections
7. Limit ScrollReveal usage to ≤ 6 instances total. Use FadeInStagger for the features card grid (1 viewport observer instead of per-card ScrollReveal).
8. Run `npm run build` and verify in browser at desktop viewport — all sections visible and animated

## Must-Haves

- [ ] Hero with ParticleField background, h1, tagline, Badge, CTA
- [ ] Features section with FadeInStagger card grid (3-4 cards)
- [ ] How It Works section with ScrollReveal step flow
- [ ] Agent preview section with GlassPanel mock terminal
- [ ] CTA section with GlowHover Button
- [ ] NavBar links updated: Features, How It Works, Agent — no Pricing
- [ ] Footer links updated: no Pricing, X/Twitter link added
- [ ] Mobile hamburger menu in NavBar
- [ ] Smooth scroll CSS with 4rem scroll-padding-top
- [ ] Hero uses min-h-dvh, not min-h-screen

## Verification

- `npm run build` succeeds with `/` route in output
- Browser: localhost:3000 shows 5 distinct sections with animations
- NavBar links scroll to correct sections
- Footer has no dead Pricing link

## Inputs

- `components/animation/particle-field.tsx` — hero background (proven pattern from /motion page)
- `components/animation/scroll-reveal.tsx` — section reveals
- `components/animation/fade-in-stagger.tsx` — card grid stagger
- `components/animation/glow-hover.tsx` — card/button hover effects
- `components/ui/card.tsx`, `button.tsx`, `badge.tsx`, `glass-panel.tsx` — UI primitives
- `components/layout/section.tsx`, `container.tsx` — structural layout
- `app/motion/page.tsx` — canonical reference for hero + animation composition pattern
- S02 forward intelligence: glass/glass-strong utilities layer well with ParticleField for depth
- S03 forward intelligence: ParticleField is position:fixed z-0, content at z-10

## Expected Output

- `app/page.tsx` — complete landing page with 5 sections, all S02/S03 components composed
- `components/layout/navbar.tsx` — updated links + mobile hamburger toggle
- `components/layout/footer.tsx` — updated links
- `app/globals.css` — scroll-behavior and scroll-padding-top added

## Observability Impact

- **ParticleField console log**: In dev mode, `Particles: {count} @ {dpr}x` confirms canvas is running with expected particle count and device pixel ratio.
- **Section anchor IDs**: Each section has a stable `id` attribute (`features`, `how-it-works`, `agent`, `early-access`) — inspectable via DOM or grep.
- **Animation failure visibility**: If animations fail to load (GSAP/Motion issues), content renders static but visible — no blank sections.
- **NavBar scroll state**: NavBar applies `glass-strong` class when `scrollY > 20` — visible in DOM inspector.
- **Build errors**: `npm run build` surfaces SSR hydration mismatches, missing imports, or invalid component composition immediately.
