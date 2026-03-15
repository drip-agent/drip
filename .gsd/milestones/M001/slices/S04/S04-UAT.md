# S04: Landing Page — UAT

**Milestone:** M001
**Written:** 2026-03-15

## UAT Type

- UAT mode: mixed (live-runtime + human-experience)
- Why this mode is sufficient: Landing page requires both functional verification (sections render, links work, metadata present) and subjective quality assessment (does it look futuristic and impressive)

## Preconditions

- Dev server running: `cd . && npm run dev`
- Browser open at `http://localhost:3000`
- Device or emulator available for mobile testing (or browser dev tools responsive mode)

## Smoke Test

Load `http://localhost:3000` — the page should show a dark background with animated aqua particles, a large "DRIP" heading in gradient text, and a NavBar with Features/How It Works/Agent links. If any of these are missing, stop — something is broken.

## Test Cases

### 1. Hero Section Visual Quality

1. Load `http://localhost:3000` on desktop (≥1280px wide)
2. Observe the hero section fills the viewport
3. **Expected:** Dark background with animated connected particles floating across the screen. "AI Research Agent" badge above a large gradient-text "DRIP" heading. Tagline reads "Autonomous research intelligence that surfaces alpha before the crowd. Ask a question. Get the edge." Two buttons: "Get Early Access" (primary/filled) and "See How It Works" (outline/secondary).
4. Wait 3 seconds — particles should be continuously animating
5. **Expected:** Smooth 60fps particle animation with no stutter or flicker

### 2. NavBar Navigation and Smooth Scroll

1. Click "Features" in the NavBar
2. **Expected:** Page smooth-scrolls to the Features section. URL shows `#features`. The section heading "Built for the Edge" is visible below the NavBar (not hidden behind it).
3. Click "How It Works" in the NavBar
4. **Expected:** Page smooth-scrolls to the How It Works section. URL shows `#how-it-works`.
5. Click "Agent" in the NavBar
6. **Expected:** Page smooth-scrolls to the Agent Preview section. URL shows `#agent`.
7. Click the DRIP logo in the NavBar
8. **Expected:** Page scrolls back to top.
9. Verify: No "Pricing" link exists in the NavBar.

### 3. Features Section

1. Scroll down to the Features section
2. **Expected:** Section heading "Built for the Edge" visible. 4 feature cards in a grid layout: "Deep Research", "Alpha Intelligence", "Automated Pipelines", "Alpha Drops". Each card should have a glow effect on hover and fade-in animation when entering the viewport.
3. Hover over each feature card
4. **Expected:** Aqua glow border/highlight appears on hover

### 4. How It Works Section

1. Scroll to the How It Works section
2. **Expected:** Section heading "Three Steps to Alpha". Three glass-panel steps numbered 01 (Ask), 02 (Research), 03 (Deliver). Each step has a description. Steps should animate in with staggered timing as they enter the viewport.
3. On desktop, verify a vertical connector line between steps
4. **Expected:** Visual connector line linking the three steps vertically

### 5. Agent Preview Section

1. Scroll to the Agent Preview section
2. **Expected:** Section heading "See DRIP in Action". A glass panel styled as a terminal with window chrome (colored dots). Inside: a prompt line ("> Research Anthropic..."), system response lines, and structured output lines showing company data. A blinking cursor at the bottom.
3. **Expected:** The terminal content is static (no typing animation), with a CSS-animated blinking cursor

### 6. CTA Section

1. Scroll to the bottom CTA section
2. **Expected:** Heading "Ready for the Edge?" with supporting text. A "Get Early Access" button with glow hover effect. The button links to `#early-access`.
3. Hover over the CTA button
4. **Expected:** Aqua glow effect on the button

### 7. Footer

1. Scroll to the footer
2. **Expected:** DRIP logo and tagline. Navigation links: Features, Privacy, Terms. An X/Twitter icon link. Copyright notice.
3. Verify: No "Pricing" link in footer
4. Click the X/Twitter icon
5. **Expected:** Opens X/Twitter in a new tab (external link)

### 8. Mobile Responsive (375px)

1. Set viewport to 375px wide (or use phone)
2. Load `http://localhost:3000`
3. **Expected:** NavBar shows DRIP logo, "Get Early Access" button, and hamburger menu icon (☰). No horizontal text links visible.
4. Tap the hamburger menu
5. **Expected:** Dropdown menu appears with Features, How It Works, Agent links
6. Scroll through entire page
7. **Expected:** Feature cards stack vertically (1 column). How It Works steps stack vertically. All text is readable with no horizontal overflow. No content is cut off.

### 9. Tablet Responsive (768px)

1. Set viewport to 768px wide
2. Scroll through entire page
3. **Expected:** Feature cards display in 2-column grid. Content has appropriate padding. NavBar may show text links or hamburger depending on breakpoint. All text readable.

### 10. OG Image Social Preview

1. Navigate to `http://localhost:3000/opengraph-image`
2. **Expected:** A 1200×630 branded image with dark gradient background. Aqua "DRIP" title text. "Value Drops Quietly" tagline. "Autonomous Research Agents" subtitle.
3. Navigate to `http://localhost:3000/twitter-image`
4. **Expected:** Same branded image as the OG image

### 11. Scroll Animation Performance

1. Load page at desktop viewport
2. Slowly scroll from top to bottom of page
3. **Expected:** Sections animate in as they enter the viewport — cards fade in with stagger, How It Works steps reveal sequentially, Agent Preview slides in. All animations are smooth with no jank.
4. Quickly scroll up and down multiple times
5. **Expected:** No visual glitches, no elements stuck mid-animation, no performance degradation

## Edge Cases

### Reduced Motion Preference

1. Enable "prefers-reduced-motion: reduce" in OS accessibility settings or browser dev tools
2. Reload the page
3. **Expected:** ParticleField may reduce or disable animation. ScrollReveal elements appear without animation (or with minimal fade). All content is still visible and accessible — nothing depends on animation to be usable.

### NavBar Scroll State

1. Load page at top (scrollY = 0)
2. **Expected:** NavBar has standard appearance
3. Scroll down past the hero section
4. **Expected:** NavBar gains a frosted glass effect (glass-strong class) for readability over content

### Direct Anchor Navigation

1. Navigate directly to `http://localhost:3000/#agent`
2. **Expected:** Page loads and scrolls to the Agent Preview section, properly offset below the NavBar

## Failure Signals

- Blank white page or missing hero — build/import error, check `npm run build`
- No particles visible — ParticleField canvas failed, check console for `Particles:` log
- Horizontal scrollbar on mobile — overflow issue in a section, inspect with dev tools
- NavBar links don't scroll — missing `scroll-behavior: smooth` in globals.css or wrong anchor IDs
- "Pricing" visible anywhere — NavBar/Footer cleanup was missed
- OG image returns 404 — opengraph-image.tsx has a generation error
- Animations don't trigger — ScrollReveal/FadeInStagger GSAP or IntersectionObserver issue

## Requirements Proved By This UAT

- R002 — Futuristic animated landing page with all specified sections, particle effects, scroll animations
- R003 — Dark theme with aqua glow design language verified in production landing page context
- R004 — Animation system (GSAP + Framer Motion) proven in full-page composition
- R012 — Responsive design verified at 375px, 768px, 1440px breakpoints

## Not Proven By This UAT

- Vercel deployment and custom domain (drip.surf) — requires DNS configuration, tested only locally
- OG image rendering in actual X/Twitter social preview — requires deployed public URL
- R013 (Social media assets) — deferred to S05
- Performance on actual mobile devices (tested via viewport emulation only)

## Notes for Tester

- The particle animation is intentionally subtle — floating dots with connection lines, not fireworks. It creates atmosphere.
- The terminal mock in the Agent Preview section is static content, not a live demo. The blinking cursor is CSS-only. This is by design.
- "Get Early Access" buttons currently link to `#early-access` (the CTA section itself). There's no signup form yet — this is a landing page, not a product launch.
- The logo image warning in dev console (`Image with src ... has either width or height modified`) is cosmetic and doesn't affect the production build.
- Focus your subjective assessment on: Does the hero make you want to keep scrolling? Does the overall design feel "futuristic" or "generic"? Would you screenshot this and share it on X?
