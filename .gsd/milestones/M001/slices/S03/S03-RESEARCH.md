# S03: Animation Engine — Research

**Date:** 2026-03-15

## Summary

S03 delivers the animation engine that makes DRIP feel futuristic — scroll-triggered reveals, a canvas particle system, glow hover effects, staggered content reveals, and page transitions. The slice owns R004 (Animation System) and supports R002 (Futuristic Animated Landing Page).

Three packages are needed: `gsap` (v3.14.2) for scroll-driven animations and canvas particle timing, `@gsap/react` (v2.1.2) for the `useGSAP` cleanup hook, and `motion` (v12.36.0, the successor to `framer-motion`) for React component transitions and hover states. All are free for this use case. The import path for Motion is `motion/react`, not the legacy `framer-motion` path.

The existing S02 design system is animation-ready — all 10 components accept `className` via `cn()`, shadow-glow tokens are already defined for hover animation targets, and the glass/glass-strong utilities provide natural depth layering behind canvas particles. No S02 component modifications are required. The primary risk is canvas particle performance on mobile Safari — needs adaptive particle count and a CSS gradient fallback.

## Recommendation

Build five animation components plus two utility modules, deployed to a demo page at `/motion`. Use GSAP exclusively for scroll-driven effects (ScrollTrigger) and canvas particle animation timing. Use Motion exclusively for React component lifecycle animations (mount/unmount, hover, stagger). This separation matches D004 and avoids conflicts between the two animation engines.

The particle system should use Canvas 2D (not WebGL) — it's simpler, has broader mobile support, and is sufficient for floating particle effects. Use `requestAnimationFrame` directly for the particle render loop rather than GSAP's ticker, keeping the canvas system self-contained and independently optimizable.

Handle `prefers-reduced-motion` at every layer: GSAP via `gsap.matchMedia()`, Motion via `useReducedMotion()`, and the particle system via static gradient fallback.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Scroll-triggered animation | GSAP ScrollTrigger plugin | Industry standard, handles viewport intersection, scrub, pin, batch. Far more reliable than custom IntersectionObserver + animation code |
| React animation cleanup | `@gsap/react` useGSAP hook | Auto-reverts GSAP instances on unmount via `gsap.context()`. Prevents memory leaks in strict mode |
| Component mount/unmount animation | Motion AnimatePresence | Only reliable way to animate React component exit. Variants propagate stagger timing to children |
| Viewport enter detection (React) | Motion `useInView` hook | Wraps IntersectionObserver with React lifecycle awareness. Simpler than rolling custom hook |
| Reduced motion detection | Motion `useReducedMotion()` + GSAP `gsap.matchMedia()` | Both libraries have built-in support — using them is trivial |

## Existing Code and Patterns

- `components/layout/section.tsx` — Server component. ScrollReveal wraps Section children without modifying Section itself. Section's `className` prop accepts animation utility classes.
- `components/ui/button.tsx` — Client component with `forwardRef`. GlowHover can wrap Button directly. Already has `hover:shadow-glow-md` in primary variant — GlowHover enhances this with smooth animated transition.
- `components/ui/glow-border.tsx` — Uses `shadow-glow-sm/md/lg` tokens. These same tokens serve as GlowHover animation targets (animate between intensity levels).
- `components/layout/navbar.tsx` — Already client component with scroll listener (threshold: 20px). GSAP ScrollTrigger won't conflict since it manages its own scroll handlers.
- `app/globals.css` — `shadow-glow-sm/md/lg` theme tokens already defined. `glass`/`glass-strong` utilities provide depth layers behind particles.
- `app/layout.tsx` — Server component, no providers wrapping body. PageTransition will need a client wrapper inserted here.
- `lib/utils.ts` — `cn()` utility. All animation components should use this for className composition.

## Constraints

- **All animation components need `'use client'`** — they use browser APIs (Canvas, IntersectionObserver, scroll events, pointer events). This is consistent with S02's boundary pattern (D017).
- **GSAP useGSAP requires `'use client'` + `gsap.registerPlugin(useGSAP)`** — SSR-safe internally via `useIsomorphicLayoutEffect`, but the directive is mandatory.
- **Motion imports from `motion/react`** — not the legacy `framer-motion` path. Package name is `motion` on npm. Same maintainers (Framer team), same API surface.
- **R004 hard constraint: 60fps on desktop** — every animation must be profiled. Canvas particle count must be adaptive.
- **R004 constraint: `prefers-reduced-motion` respected** — skip animations entirely when user prefers reduced motion, don't just slow them down.
- **Page transitions in Next.js App Router are limited** — AnimatePresence works with `usePathname()` as key, but only animates the page content slot, not the layout. This is a known limitation. The PageTransition component should be scoped as a content wrapper, not a full page takeover.

## Common Pitfalls

- **GSAP + React strict mode double-mounting** — Without `useGSAP`, ScrollTrigger instances double-register and cause ghost triggers. Always use the hook, never raw `useEffect` + `gsap.to()`. The hook's `gsap.context()` handles cleanup.
- **Canvas devicePixelRatio scaling** — Setting canvas width/height to CSS pixels makes it blurry on retina. But using `window.devicePixelRatio` on mobile doubles pixel count (4x fill rate). Solution: cap DPR at 2 and reduce particle count proportionally on mobile.
- **Motion initial state hydration mismatch** — If `initial={{ opacity: 0 }}` is set on a server-rendered component, the SSR HTML shows `opacity: 1` and then flashes to 0 on hydration. Fix: only use `initial` on components inside AnimatePresence, or set `initial={false}` for elements that should match their `animate` state on first render.
- **ScrollTrigger instance accumulation on SPA navigation** — If route changes don't unmount trigger-owning components, stale triggers persist. `useGSAP` handles this via context cleanup, but only if the component actually unmounts. For persistent layout components, manually refresh: `ScrollTrigger.refresh()`.
- **Canvas compositing with glassmorphism** — Canvas elements sit in DOM flow. For particles behind glass panels, the canvas must be `position: fixed` or `absolute` with lower `z-index`, and the glass panel must preserve `backdrop-filter` by having its own stacking context.

## Architecture Notes

### Responsibility Split (D004)

| Concern | Engine | Why |
|---------|--------|-----|
| Scroll-triggered reveals | GSAP ScrollTrigger | Complex scroll math, scrub, toggleActions — GSAP's domain |
| Canvas particle animation | requestAnimationFrame (standalone) | Self-contained render loop, no GSAP dependency needed |
| Staggered content reveals | Motion variants | `staggerChildren` + propagation is native to variants |
| Hover glow effects | Motion `whileHover` | Declarative, integrates with React component model |
| Page transitions | Motion AnimatePresence | Only tool that handles React exit animations |
| Responsive animation config | GSAP `gsap.matchMedia()` | Clean breakpoint-scoped animation blocks |
| Reduced motion | Both | GSAP: `matchMedia()`, Motion: `useReducedMotion()` |

### Component Inventory

| Component | Engine | Purpose | Client? |
|-----------|--------|---------|---------|
| `ScrollReveal` | GSAP | Wraps children, animates on viewport entry | Yes |
| `ParticleField` | Canvas 2D + rAF | Floating aqua particles, full-viewport | Yes |
| `PageTransition` | Motion | AnimatePresence wrapper for route changes | Yes |
| `GlowHover` | Motion | Aqua glow effect on pointer hover | Yes |
| `FadeInStagger` | Motion | Staggered children reveal on mount/view | Yes |

### Utility Modules

| Module | Contents |
|--------|----------|
| `lib/motion-variants.ts` | Named variant presets: `fadeIn`, `slideUp`, `slideDown`, `slideLeft`, `slideRight`, `scaleIn`, `staggerContainer`, `staggerItem` |
| `lib/gsap-utils.ts` | ScrollTrigger defaults, easing presets, reduced-motion wrapper |

### Particle System Design

Canvas 2D with adaptive complexity:
- **Desktop (≥1024px):** 80–100 particles, DPR capped at 2
- **Tablet (768–1023px):** 40–50 particles, DPR capped at 1.5
- **Mobile (<768px):** 20–30 particles, DPR capped at 1
- **prefers-reduced-motion:** Static CSS gradient (no canvas), uses existing `gradient-radial-glow` utility
- **Colors:** Random from aqua palette with low opacity (0.1–0.4). Icy Aqua, Soft Cyan, Aquamarine.
- **Motion:** Slow upward drift with slight horizontal wander. Speed: 0.2–0.5px/frame.
- **Connections:** Optional line connections between nearby particles (≤150px) for neural/data-flow aesthetic. Lines at very low opacity (0.05–0.1).

### Demo Page (`/motion`)

Sections to demonstrate:
1. **ParticleField hero** — Full viewport canvas with overlay text
2. **ScrollReveal showcase** — Cards revealing from different directions (up, down, left, right)
3. **FadeInStagger demo** — Grid of items appearing sequentially
4. **GlowHover gallery** — Cards and buttons with hover glow effect
5. **Variant presets** — Interactive showcase of each motion variant

## Open Risks

- **Mobile Safari Canvas performance** — Safari's Canvas 2D has historically lagged Chrome/Firefox. The adaptive particle count mitigates this, but real-device testing in S04 will be the true proof. If performance is poor even at 20 particles, the fallback is a CSS animated gradient.
- **Next.js App Router page transitions** — AnimatePresence with `usePathname()` as key works for simple fade transitions but may conflict with streaming/suspense boundaries. For S03, the PageTransition component demonstrates the pattern; S04 will validate it works in the full landing page layout.
- **GSAP ScrollTrigger + smooth scroll libraries** — If S04 adds smooth scroll (lenis, locomotive), ScrollTrigger needs `ScrollTrigger.scrollerProxy()` integration. Not blocked for S03 but worth noting.
- **Bundle size** — GSAP core (~30KB gzipped) + ScrollTrigger (~10KB) + Motion (~32KB) adds ~72KB gzipped to client bundle. Acceptable for a showcase site but worth monitoring. Tree-shaking helps — only import what's used.

## Skills Discovered

| Technology | Skill | Installs | Status |
|------------|-------|----------|--------|
| GSAP | `martinholovsky/claude-skills-generator@gsap` | 692 | available — general GSAP guidance |
| GSAP + React | `bbeierle12/skill-mcp-claude@gsap-react` | 468 | available — React-specific patterns |
| GSAP ScrollTrigger | `bbeierle12/skill-mcp-claude@gsap-scrolltrigger` | 314 | available — ScrollTrigger patterns |
| GSAP Awwwards | `eng0ai/eng0-template-skills@gsap-awwwards-website` | 256 | available — high-quality animation sites |
| Framer Motion | `patricio0312rev/skills@framer-motion-animator` | 1.4K | available — most popular, animation patterns |
| Motion best practices | `pproenca/dot-skills@framer-motion-best-practices` | 191 | available — best practices guidance |
| frontend-design | (built-in) | — | installed — `~/.gsd/agent/skills/frontend-design/SKILL.md` |

The `gsap-awwwards-website` skill (256 installs) and `framer-motion-animator` (1.4K installs) are the most relevant for achieving the "stop the scroll" quality bar. The built-in `frontend-design` skill is already available and should be loaded during implementation.

## Sources

- GSAP `useGSAP` hook is SSR-safe, requires `'use client'` directive in Next.js App Router (source: [GSAP React docs](https://gsap.com/resources/React))
- `gsap.matchMedia()` is the canonical way to handle `prefers-reduced-motion` — wraps animation blocks conditionally (source: [GSAP Accessibility](https://gsap.com/resources/a11y))
- `gsap.ticker.deltaRatio(60)` normalizes frame-rate-dependent values to 60fps target (source: [GSAP Ticker](https://gsap.com/docs/v3/GSAP/gsap.ticker))
- ScrollTrigger `toggleActions` and `scrub` control scroll-animation binding (source: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger))
- Motion (formerly Framer Motion) imports from `motion/react`, v12.36.0 — same API, renamed package (source: [Motion docs](https://motion.dev))
- Motion `useInView` wraps IntersectionObserver with `once`, `amount`, `margin` options (source: [Motion docs](https://motion.dev))
- Motion variants support `staggerChildren` and `delayChildren` for orchestrated reveals (source: [Motion docs](https://motion.dev))
- AnimatePresence `mode="wait"` ensures exit completes before enter begins — needed for page transitions (source: [Motion docs](https://motion.dev))
- `contextSafe()` is required for any GSAP animation created inside event handlers within `useGSAP` scope (source: [GSAP React](https://github.com/greensock/react))
