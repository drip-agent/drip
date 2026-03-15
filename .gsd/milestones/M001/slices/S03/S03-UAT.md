# S03: Animation Engine — UAT

**Milestone:** M001
**Written:** 2026-03-15

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: Animation behavior can only be verified in a running browser — canvas rendering, scroll triggers, hover effects, and reduced-motion fallbacks all require real DOM interaction

## Preconditions

- `npm install` completed (gsap, @gsap/react, motion installed)
- Dev server running: `npm run dev` → localhost:3000
- Modern browser with DevTools (Chrome recommended for prefers-reduced-motion emulation)
- No browser extensions blocking canvas or animations

## Smoke Test

Navigate to `http://localhost:3000/motion` — page loads with a particle canvas background and 5 labeled sections visible on scroll. If the page renders without errors and you see floating aqua particles, the engine is working.

## Test Cases

### 1. ParticleField renders with adaptive particle count

1. Open `http://localhost:3000/motion`
2. Open browser DevTools → Console
3. Look for log message matching `Particles: {count} @ {dpr}x`
4. **Expected:** On desktop (≥1024px viewport): count is ~80. On a 2x display: DPR shows 2.
5. Resize browser to tablet width (~768px), check console for updated log
6. **Expected:** Count drops to ~40
7. Resize to mobile width (~375px)
8. **Expected:** Count drops to ~20
9. Visually confirm: floating aqua-tinted particles with connection lines between nearby ones, moving fluidly over a dark background

### 2. ScrollReveal directional animations

1. On `/motion`, scroll down to the "ScrollReveal" section
2. As cards enter the viewport, observe their entrance animations
3. **Expected:** 4 cards animate in from different directions — one from bottom (up), one from top (down), one from right (left), one from left (right). Each card has a Badge labeling its direction.
4. Scroll back up past the section, then scroll down again
5. **Expected:** Animations replay on re-entry (ScrollTrigger toggleActions)

### 3. FadeInStagger sequential reveal

1. Scroll to the "FadeInStagger" section
2. Observe items appearing as the section enters the viewport
3. **Expected:** 8 items (Cards with Badges) appear one after another with a visible stagger delay — not all at once, but in sequence from first to last
4. The stagger should feel smooth, not jerky

### 4. GlowHover intensity levels

1. Scroll to the "GlowHover" section
2. Hover over the first card (sm intensity)
3. **Expected:** Subtle aqua glow appears around the card on hover
4. Hover over the second card (md intensity)
5. **Expected:** More prominent aqua glow, visibly stronger than sm
6. Hover over the third card (lg intensity)
7. **Expected:** Strong aqua glow, clearly the most intense
8. Hover over the buttons in the section
9. **Expected:** Buttons also show glow effect on hover
10. Move mouse away from any glowing element
11. **Expected:** Glow fades out smoothly (spring transition, not instant)

### 5. Motion variant presets

1. Scroll to the "Variant Presets" section
2. As cards enter the viewport, observe their animations
3. **Expected:** 6 cards each demonstrate a different named animation — fadeIn (opacity), slideUp (from below), slideDown (from above), slideLeft (from right), slideRight (from left), scaleIn (grows from small). Each card should be labeled with its variant name.

### 6. Page transitions between routes

1. Navigate from `/motion` to `/design` (or `/brand`) using the NavBar
2. **Expected:** Page content fades out before the new page fades in. No hard cut.
3. Navigate back to `/motion`
4. **Expected:** Same smooth fade transition on return
5. ParticleField should reinitialize on `/motion` load (check console for Particles log)

### 7. prefers-reduced-motion: reduce — full fallback

1. Open DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion" → set to "reduce"
2. Reload `/motion`
3. **Expected for ParticleField:** Canvas is NOT rendered. Instead, a CSS gradient background (gradient-radial-glow class) appears. No particle movement, no animation frame loop.
4. Scroll through ScrollReveal section
5. **Expected:** Cards are immediately visible in their final position — no slide-in animation
6. Scroll through FadeInStagger section
7. **Expected:** All items visible immediately — no stagger delay
8. Hover over GlowHover elements
9. **Expected:** No glow animation on hover (elements render statically)
10. Check variant presets section
11. **Expected:** All cards visible in final position, no entrance animations
12. Disable reduced-motion emulation and reload to restore normal behavior

## Edge Cases

### Canvas resize handling

1. Load `/motion` at desktop width
2. Resize browser window from desktop to mobile width rapidly (drag window edge)
3. **Expected:** Canvas resizes smoothly without visual artifacts. Console logs updated particle count. No console errors.

### Fast scrolling through all sections

1. Load `/motion` and rapidly scroll from top to bottom (use Page Down or fast scroll wheel)
2. **Expected:** No janky animation pileups, no layout shift, no console errors. Animations may be skipped (already in viewport) but content is visible.

### Multiple route transitions

1. Navigate rapidly: `/motion` → `/design` → `/brand` → `/motion`
2. **Expected:** Each transition completes cleanly. No stuck animation states, no blank pages. ParticleField reinitializes on returning to `/motion`.

## Failure Signals

- Console errors mentioning `gsap`, `ScrollTrigger`, `motion`, or `canvas`
- ParticleField shows no particles (blank black/dark area where canvas should be)
- ScrollReveal cards never appear (stuck at opacity 0 or off-screen position)
- GlowHover produces no visible change on hover
- Page transitions show a hard cut (instant swap) instead of fade
- Reduced-motion mode still shows animated particles or scroll animations
- Build fails: `npm run build` exits non-zero or `/motion` route missing from output
- verify-s03.sh reports any failures (run `bash scripts/verify-s03.sh`)

## Requirements Proved By This UAT

- R004 (Animation System) — scroll-triggered reveals, particle system, glow hover effects, page transitions all verified working at runtime. GSAP + Motion responsibility split confirmed. Reduced-motion accessibility validated.
- R012 (Responsive Design) — ParticleField adaptive particle count verified across breakpoints via console diagnostic

## Not Proven By This UAT

- 60fps performance measurement (requires profiling tools, not visual inspection — visual smoothness is a proxy)
- Real mobile device testing (iOS Safari, Android Chrome) — only desktop browser viewport resizing tested
- Landing page integration quality (S04 scope — this UAT only validates the animation engine in isolation on /motion)
- Lighthouse performance score impact (S04 scope — measured on the final landing page, not the demo page)

## Notes for Tester

- The `/motion` page is a demo/showcase surface, not the final landing page. Visual design quality is not the concern here — functional animation behavior is.
- ParticleField console log (`Particles: {count} @ {dpr}x`) only appears in development mode (`npm run dev`), not in production builds.
- The GlowHover spring transition has a subtle bounce — this is intentional, not a bug.
- Canvas DPR is capped at 2 on desktop and lower on smaller viewports — this is a deliberate performance optimization, not a rendering bug.
