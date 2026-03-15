# M001: Brand & Landing Page

**Vision:** Establish DRIP's visual identity and web presence with a futuristic, heavily animated landing page at drip.surf that becomes the project's primary discovery surface and viral asset. The design itself should stop the scroll — people share it on X because it looks incredible before they understand what the agent does.

## Success Criteria

- drip.surf loads with a futuristic animated experience that runs at 60fps on desktop
- Landing page is fully responsive and visually impressive on mobile
- Brand guidelines document exists with complete color system, typography, logo, and voice reference
- Design system components are reusable and will carry forward into M002 agent UI
- Social assets (X profile, banner, OG image) are production-ready
- Lighthouse performance score ≥ 80

## Key Risks / Unknowns

- GSAP particle system + scroll animations may create performance bottlenecks on mobile — this is the hardest thing to get right
- Achieving "futuristic" without looking generic or dated requires strong design decisions early
- Canvas/WebGL particles may fail on some mobile browsers — need fallback strategy

## Proof Strategy

- Animation performance risk → retire in S03 by proving particle system + scroll triggers run at 60fps on desktop and gracefully degrade on mobile
- Design quality risk → retire in S04 by shipping the full landing page and validating visual quality in-browser

## Verification Classes

- Contract verification: brand guidelines doc exists, all components render, landing page serves
- Integration verification: Vercel deployment works, custom domain resolves, OG images render in social previews
- Operational verification: Lighthouse ≥ 80, animations at 60fps, responsive across viewports
- UAT / human verification: visual quality assessment — does it actually look futuristic and impressive?

## Milestone Definition of Done

This milestone is complete only when all are true:

- drip.surf is deployed and accessible via browser
- Landing page has animated hero, features section, agent preview teaser, and CTA
- Page is responsive across mobile (375px), tablet (768px), and desktop (1440px)
- Brand guidelines document is comprehensive and usable for M002 design work
- Social media assets are exported and ready for X account
- Lighthouse performance score ≥ 80
- OG image renders correctly when drip.surf link is shared on X/Twitter

## Requirement Coverage

- Covers: R001, R002, R003, R004, R012, R013
- Partially covers: none
- Leaves for later: R005-R011 (M002, M003), R014-R018 (deferred)
- Orphan risks: none

## Slices

- [x] **S01: Brand Foundation** `risk:low` `depends:[]`
  > After this: Brand guidelines page renders in-browser showing complete color palette swatches, typography specimens, logo concepts, and voice reference. All design tokens are defined.

- [x] **S02: Design System & Dark Theme** `risk:medium` `depends:[S01]`
  > After this: Component showcase page at /design displays all UI primitives — buttons, cards, containers, badges, inputs — in the DRIP design language with dark backgrounds and aqua glow accents.

- [x] **S03: Animation Engine** `risk:high` `depends:[S02]`
  > After this: Animation demo page at /motion shows working scroll-triggered reveals, particle system, glow hover effects, and page transitions — all running at 60fps on desktop.

- [x] **S04: Landing Page** `risk:high` `depends:[S02,S03]`
  > After this: drip.surf loads with full animated hero (particle/ocean effects), features showcase, agent preview teaser, and CTA. Responsive across mobile/tablet/desktop. Deployed to Vercel.

- [x] **S05: Social Media Kit** `risk:low` `depends:[S01,S04]`
  > After this: Complete social asset set ready for X — profile picture, banner, build-in-public post templates, OG image configured on drip.surf.

## Boundary Map

### S01 → S02

Produces:
- `tailwind.config.ts` color values: palette tokens (icy-aqua, soft-cyan, aquamarine, ocean-mist, blue-slate) + dark background variants
- `public/fonts/` — selected web font files or Google Fonts references
- `public/brand/` — logo SVG files (primary, icon, wordmark variants)
- `docs/brand-guidelines.md` — complete brand reference: palette, typography scale, voice & tone, usage rules
- Design tokens: spacing scale, border-radius conventions, shadow/glow definitions

Consumes: nothing (first slice)

### S01 → S05

Produces:
- Logo assets, color palette values, typography choices
- Voice & tone reference for social copy

Consumes: nothing (first slice)

### S02 → S03

Produces:
- Next.js 15 project scaffold with App Router, TypeScript, Tailwind CSS configured
- Tailwind theme config: custom colors (palette + dark backgrounds), font families, spacing
- UI components: `Button`, `Card`, `GlassPanel`, `Container`, `Badge`, `Input`, `GlowBorder`
- CSS utilities: `.glow-sm`, `.glow-md`, `.glow-lg`, `.glass`, background gradient classes
- Layout components: `Section`, `NavBar`, `Footer`
- Dark theme implementation: CSS variables, background layering system

Consumes from S01:
- Color tokens, font selections, logo assets, design token definitions

### S02 → S04

Produces: same as S02 → S03

Consumes from S01: same as S02 → S03

### S03 → S04

Produces:
- `ScrollReveal` component: wraps children, animates on viewport entry via GSAP ScrollTrigger
- `ParticleField` component: configurable Canvas/WebGL particle system with aqua color scheme
- `PageTransition` component: Framer Motion layout wrapper for page-level transitions
- `GlowHover` component: aqua glow effect triggered on pointer hover
- `FadeInStagger` component: Framer Motion staggered children reveal
- GSAP utilities: reusable timeline presets, easing curves
- Framer Motion variants: `fadeIn`, `slideUp`, `scaleIn`, `staggerChildren`
- Performance: all animations tested at 60fps, prefers-reduced-motion respected

Consumes from S02:
- Project scaffold, Tailwind theme, UI components, CSS utilities

### S04 → S05

Produces:
- Live landing page at drip.surf as visual reference
- OG image design patterns (screenshot/design captures for social templates)
- Deployed URL for link preview testing

Consumes from S02:
- All UI and layout components

Consumes from S03:
- All animation components and utilities
