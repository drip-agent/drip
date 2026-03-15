# S04: Landing Page — Research

**Date:** 2026-03-15

## Summary

S04 assembles the full DRIP landing page at `/` from the proven building blocks of S02 (10 UI/layout components) and S03 (5 animation components + utilities). The current homepage is a design-token placeholder — it gets completely replaced.

The component inventory is solid and battle-tested. ParticleField hero pattern is proven on `/motion`. ScrollReveal, FadeInStagger, GlowHover all compose cleanly with S02 cards/panels. The main work is *content design* — what sections to build, how to arrange them for maximum impact — plus NavBar/Footer link fixups, OG metadata, responsive verification, Lighthouse validation, and Vercel deployment.

The highest risk is Lighthouse performance with ParticleField + multiple ScrollTrigger instances on a single page. Secondary risk is responsive quality — the components are responsive-ready but haven't been tested in a full-page composition at mobile breakpoints. Deployment to Vercel is low-risk (Next.js auto-detection), but custom domain DNS requires user action.

## Recommendation

Build the landing page as a single `app/page.tsx` replacement using composition of existing components. No new UI primitives needed — the existing inventory covers every visual pattern. Structure the page into 5-6 clear sections with anchor IDs matching NavBar links. Use the `frontend-design` skill (already installed) during implementation for high design quality.

Update NavBar and Footer links to match actual section anchors (remove "Pricing", add appropriate DRIP sections). Add OG metadata via Next.js metadata API + an `opengraph-image.tsx` route for dynamic OG image generation.

Deploy to Vercel using the existing Next.js project (zero-config). Domain configuration (drip.surf DNS) is a manual step requiring user confirmation.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Hero particle background | `ParticleField` component | Proven on /motion, adaptive particle count, CSS fallback for reduced-motion |
| Section reveal on scroll | `ScrollReveal` wrapper | GSAP ScrollTrigger, 4 directions, cleanup via useGSAP |
| Feature card stagger | `FadeInStagger` wrapper | Motion variants, viewport trigger, reduced-motion fallback |
| Card hover glow | `GlowHover` wrapper | 3 intensity levels, spring transition, reduced-motion safe |
| Section structure | `Section` + `Container` | Consistent spacing, heading/subheading, responsive width |
| Glass panels | `GlassPanel` | 3 blur levels, composable with animation wrappers |
| OG image generation | Next.js `opengraph-image.tsx` | Built-in ImageResponse API, no external service needed |
| Deployment | Vercel + Next.js | Zero-config detection, just `vercel deploy` or git push |

## Existing Code and Patterns

### Components ready to compose

- `components/animation/particle-field.tsx` — Full-viewport background with `fixed inset-0 -z-10`. Use as hero background exactly like `/motion` page does. Adaptive: 80/40/20 particles by viewport width.
- `components/animation/scroll-reveal.tsx` — Wrap any section content. Supports `direction="up|down|left|right"` and `delay` for staggering multiple elements within a section.
- `components/animation/fade-in-stagger.tsx` — Wrap a grid of children. Each child gets a `motion.div` with stagger timing. Set `viewTrigger={true}` (default) for scroll-triggered.
- `components/animation/glow-hover.tsx` — Wrap Card or Button for hover glow. Three intensities.
- `components/layout/section.tsx` — Structural section with `heading`/`subheading` props and `spacing` variants. Wraps content in `<section>` with consistent vertical rhythm.
- `components/layout/container.tsx` — Max-width container, 3 sizes. Always nest inside Section.
- `components/layout/navbar.tsx` — Fixed top nav with glass-on-scroll. **Links need updating** — currently has "Pricing" which doesn't apply to DRIP.
- `components/layout/footer.tsx` — Footer with logo and links. **Links need updating** — has "/privacy", "/terms" that don't exist.
- `components/ui/card.tsx` — 3 variants. `featured` gets aqua glow border — use for hero accent or primary feature cards.
- `components/ui/glass-panel.tsx` — Glassmorphism panels. Good for feature descriptions or agent preview.
- `components/ui/button.tsx` — 4 variants × 3 sizes. `primary` (aquamarine) for CTAs.
- `components/ui/badge.tsx` — 3 variants. Good for section labels or feature tags.
- `components/ui/glow-border.tsx` — Standalone glow border at 3 intensities.

### Layout and utilities

- `app/layout.tsx` — PageTransition already wired. Fonts loaded (Space Grotesk, Inter, JetBrains Mono). Base metadata set.
- `app/globals.css` — All design tokens defined (@theme). 5 custom utilities: `glass`, `glass-strong`, `gradient-aqua`, `gradient-radial-glow`, `text-gradient-aqua`.
- `lib/utils.ts` — `cn()` for className composition. Import from `@/lib/utils`.
- `lib/motion-variants.ts` — 8 presets: fadeIn, slideUp, slideDown, slideLeft, slideRight, scaleIn, staggerContainer, staggerItem.
- `lib/gsap-utils.ts` — ScrollTrigger registration, `defaultScrollTrigger` config, `easings`, `withReducedMotion`.

### Brand assets

- `public/brand/logo-icon.svg` — 64×64 drop icon with aqua gradient
- `public/brand/logo-lockup.svg` — 320×64 icon + wordmark
- `public/brand/logo-lockup-mono.svg` — monochrome lockup (used by NavBar)
- `public/brand/logo-wordmark.svg` — 200×48 text only
- Mono variants of each also exist

### Patterns to follow

- `/motion` page (app/motion/page.tsx) is the canonical reference for composing animation components with S02 UI components. The hero pattern (ParticleField + Container z-10 overlay) is exactly what S04's hero should use.
- `/design` page (app/design/page.tsx) shows the data-driven rendering pattern with const arrays.
- Server component by default. The landing page itself should be `'use client'` only if it directly uses animation hooks — or better, keep it as server component and let the animation wrappers (all `'use client'`) handle client boundaries.

## Constraints

- **Lighthouse ≥ 80** — Hard constraint from milestone definition. ParticleField + multiple ScrollTrigger instances risk heavy main thread. Mitigation: lazy-load ParticleField, limit ScrollReveal instances (use FadeInStagger for grids instead of per-card ScrollReveal).
- **ParticleField is `position: fixed`** — Only one ParticleField per page. It serves as the ambient background for the entire page, not just the hero. Content layers on top at higher z-index.
- **NavBar is fixed at `z-50`** — Hero content must account for 64px (h-16) top offset from NavBar.
- **Section heading uses `<h2>`** — Hero heading should be `<h1>`, then sections use `<h2>` via Section's `heading` prop. Don't double-nest headings.
- **PageTransition already in layout** — No need to add page-level animations. They happen automatically on route change.
- **`'use client'` boundary** — If the homepage imports any animation components directly (ParticleField, ScrollReveal, etc.), the page itself needs `'use client'`. Alternative: create a `components/landing/` directory with client wrapper components that the page imports.
- **No mobile device testing available** — Responsive verification is viewport-simulation only (browser dev tools). Real device testing deferred.
- **OG image must be static or server-generated** — Cannot rely on client-side rendering for social preview images. Next.js ImageResponse API or a pre-built PNG.

## Landing Page Section Architecture

Based on the roadmap requirements ("animated hero, features showcase, agent preview teaser, and CTA"):

| # | Section | Anchor ID | Purpose | Key Components |
|---|---------|-----------|---------|----------------|
| 1 | Hero | (top) | Stop the scroll. DRIP name, tagline, particle atmosphere, primary CTA | ParticleField, Button, Badge |
| 2 | Features | `#features` | What DRIP does — research, intelligence, automation | ScrollReveal + FadeInStagger + Card/GlassPanel |
| 3 | How It Works | `#how-it-works` | 3-step flow showing the agent pipeline | ScrollReveal + numbered steps |
| 4 | Agent Preview | `#agent` | Teaser of the agent UI (mock/preview) | GlassPanel + GlowBorder, mock chat UI |
| 5 | CTA | `#early-access` | Final conversion — join waitlist or follow on X | Button, GlowHover |
| 6 | Footer | — | Standard footer | Footer component |

NavBar links update: "Features" → `#features`, "How It Works" → `#how-it-works`, "Agent" → `#agent` (or omit the third).

Footer links update: Remove "Pricing", keep "Features", add "X/Twitter" external link, keep placeholder "Privacy"/"Terms" or remove them.

## Common Pitfalls

- **Too many ScrollTrigger instances** — Each ScrollReveal creates a ScrollTrigger. With 10+ cards, that's 10+ scroll listeners fighting for CPU. Use FadeInStagger for groups of cards (1 viewport observer) instead of wrapping each card individually in ScrollReveal.
- **ParticleField canvas on mobile Safari** — Canvas rendering is expensive on iOS. The adaptive count (20 particles at <768px) mitigates this, but connection line rendering (O(n²)) is the real cost. Consider disabling connections on mobile or reducing the connection distance threshold.
- **Client component tree bloat** — If the entire page becomes `'use client'`, all children are also client components. This means Section, Container, Card, Badge (which are server components) lose their server-component benefits. Better approach: create a `LandingPage` client component wrapper or split into section-level client components.
- **Hero height on mobile** — `min-h-screen` works on desktop but iOS Safari has the dynamic viewport issue (URL bar). Use `min-h-dvh` (dynamic viewport height) if supported, or accept the slight gap.
- **OG image aspect ratio** — Twitter/X expects 1200×630 for summary_large_image cards. The OG image must use this exact ratio.
- **Smooth scroll for anchor links** — NavBar links are `#features` etc. Need `scroll-behavior: smooth` on HTML element, or handle programmatically. Account for NavBar height (64px) offset when scrolling to anchors.
- **Heading hierarchy** — Hero should use `<h1>`. Section components use `<h2>` via `heading` prop. Don't use Section's `heading` prop for the hero — build it custom with `<h1>`.

## OG Metadata Strategy

Next.js App Router supports metadata via the `metadata` export and file-based OG images:

```
app/
  opengraph-image.tsx    → generates OG image at build time via ImageResponse
  twitter-image.tsx      → same for Twitter card (can alias the OG image)
  layout.tsx             → update metadata with full title, description, url, etc.
```

The ImageResponse API renders JSX to an image at build time — ideal for a branded OG image with the DRIP gradient, logo, and tagline. No external service needed.

Metadata additions needed in `app/layout.tsx`:
- `metadataBase: new URL('https://drip.surf')`
- `title`, `description` updates
- `openGraph` object with siteName, locale, type
- `twitter` object with card: 'summary_large_image', site, creator

## Vercel Deployment

- Next.js 16 projects are auto-detected by Vercel — no `vercel.json` needed for basic deployment.
- `vercel deploy --prod` or git push to connected repo triggers production build.
- Custom domain (`drip.surf`) requires DNS configuration: either Vercel nameservers or CNAME/A records. This is a manual step requiring user action.
- Vercel's edge network handles caching, CDN, and HTTPS automatically.

## Lighthouse Considerations

Main risks to score ≥ 80:

| Risk | Impact | Mitigation |
|------|--------|------------|
| ParticleField canvas | LCP, TBT | Lazy-mount behind `requestIdleCallback` or intersection observer. Canvas is `aria-hidden` so a11y is fine. |
| GSAP + Motion JS bundle | Bundle size | Both are already dependencies. Tree-shaking helps. GSAP is ~30KB gzipped, Motion ~15KB. |
| Multiple ScrollTrigger instances | TBT | Limit to 4-6 ScrollReveal wrappers. Use FadeInStagger for card grids. |
| Google Fonts | LCP, CLS | Already using `next/font/google` with `display: swap` — handled correctly. |
| Large images | LCP | No raster images planned. SVG logos are tiny. OG image is server-generated, not page-loaded. |
| Font loading | CLS | `next/font` preloads and inlines font declarations. No FOUT risk. |

Expectation: Score should be 85-95 since the page is mostly text + SVGs + canvas, with no heavy images or third-party scripts.

## Open Risks

- **Agent preview section content** — The agent doesn't exist yet (M002). The "preview teaser" is a mock — a stylized terminal/chat UI that hints at what's coming. Risk: it could look fake or underwhelming. Mitigation: make it a visually impressive glass panel with typed-out text animation, not a functional demo.
- **Smooth scroll offset** — Anchor scrolling with a fixed NavBar (h-16 = 64px) needs CSS `scroll-padding-top: 64px` or JS offset. Easy to miss, ugly when broken.
- **Mobile hamburger menu** — NavBar currently hides links on mobile (`hidden md:flex`). No mobile menu exists. S04 should either add a mobile hamburger or ensure the CTA button alone is sufficient on mobile.
- **Deployment DNS** — drip.surf domain configuration requires user action (pointing DNS to Vercel). Cannot be automated by the agent. Must be surfaced as a follow-up or handled during slice UAT.

## Requirements Coverage

| Requirement | Role | What S04 delivers |
|-------------|------|-------------------|
| R002 — Futuristic Animated Landing Page | **Primary owner** | Full page with hero, features, agent preview, CTA. Particle effects, scroll animations, responsive. |
| R012 — Responsive Design | **Primary owner** | Mobile (375px), tablet (768px), desktop (1440px) verification. Adaptive particle count. |
| R003 — Dark Theme + Aqua Glow | Supporting | Landing page proves the design language in a real page context (not just component showcase). |
| R004 — Animation System | Supporting | Landing page uses all animation components in production context. |

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Frontend/landing page design | `frontend-design` | **Installed** — use during implementation for high design quality |
| GSAP animation | `martinholovsky/claude-skills-generator@gsap` (692 installs) | Available — not needed, S03 patterns established |
| Awwwards animations | `devmartinese/awwwards-animations-skill@awwwards-animations` (323 installs) | Available — could elevate visual quality, optional |
| Landing page guide | `bear2u/my-skills@landing-page-guide-v2` (589 installs) | Available — generic guide, not DRIP-specific |

The installed `frontend-design` skill is the most relevant. The GSAP skill has high installs but S03 already established all GSAP patterns needed. The awwwards skill could add polish but isn't essential given the existing animation toolkit.

## Task Decomposition Signal

Natural split into 2-3 tasks:

1. **Landing page content + structure** — Replace `app/page.tsx` with full landing page. Build all sections (hero, features, how-it-works, agent preview, CTA). Update NavBar and Footer links. This is the bulk of the work.
2. **OG metadata + social** — Add metadata to layout, build `opengraph-image.tsx` and `twitter-image.tsx`, verify social previews.
3. **Responsive verification + Lighthouse + deployment** — Test across viewports, optimize for Lighthouse ≥ 80, deploy to Vercel, verify production URL.

Tasks 2 and 3 could merge if OG + deployment is straightforward.

## Sources

- Existing codebase exploration (all component files, layout, globals.css, brand assets)
- S02-SUMMARY.md forward intelligence (component composition patterns, fragile areas)
- S03-SUMMARY.md forward intelligence (ParticleField hero pattern, animation composition)
- REQUIREMENTS.md (R002, R003, R004, R012 specifications)
- Next.js App Router metadata docs (metadata API, opengraph-image convention)
