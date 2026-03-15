# M001: Brand & Landing Page — Context

**Gathered:** 2026-03-15
**Status:** Ready for planning

## Project Description

DRIP is a web-based AI agent platform at drip.surf. M001 establishes the visual identity and first web presence — the futuristic animated landing page that becomes DRIP's primary discovery surface and viral asset on X/Twitter.

## Why This Milestone

The landing page IS the first impression. In the PumpFun ecosystem, projects live and die on attention. A stunning, futuristic interface that stops the scroll is the foundation for everything — community growth, token interest, build-in-public content on X. Without a locked brand system and a jaw-dropping landing page, M002 (agent) and M003 (token) have nothing to stand on.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit drip.surf and see a fully animated, futuristic landing page with particle effects, scroll-driven animations, and the DRIP brand identity
- Share drip.surf on X/Twitter with proper OG images and social previews
- Use brand assets (profile picture, banner, post templates) to start build-in-public documentation on X

### Entry point / environment

- Entry point: https://drip.surf (browser)
- Environment: Production deployment (Vercel)
- Live dependencies involved: None — static/SSR landing page with no external API dependencies

## Completion Class

- Contract complete means: All brand assets exist, design system components render correctly, landing page serves on drip.surf
- Integration complete means: Landing page deploys to Vercel, domain configured, OG images render in social previews
- Operational complete means: Page loads under 3s on mobile, animations run at 60fps, Lighthouse ≥ 80

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- drip.surf loads in a browser with full animated experience — hero, features, CTA all visible and animated
- The same page renders correctly on mobile (iPhone Safari viewport)
- Sharing drip.surf link on X shows proper OG image, title, and description
- Brand guidelines document exists and is comprehensive enough to guide M002 design work

## Risks and Unknowns

- Complex GSAP animations may tank Lighthouse performance scores — heavy particle systems and scroll-triggered animations need careful optimization
- Canvas/WebGL particle effects may not render well on older mobile devices — need graceful degradation
- OG image generation for social sharing needs to match the futuristic aesthetic — static image must capture the animated feel

## Existing Codebase / Prior Art

- Empty project — no existing code
- `drip.surf` — domain acquired, needs DNS configuration

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R001 — Brand Identity System: complete color palette, typography, logo, voice & tone
- R002 — Futuristic Animated Landing Page: the showpiece, must stop the scroll
- R003 — Dark Theme + Aqua Glow Design Language: dark backgrounds, glowing aqua accents, glassmorphism
- R004 — Animation System: GSAP + Framer Motion, scroll-triggered, 60fps, particles
- R012 — Responsive Design: mobile-first, graceful degradation
- R013 — X/Twitter Social Assets: profile pic, banner, post templates, OG image

## Scope

### In Scope

- Brand guidelines document (colors, typography, logo concepts, voice & tone)
- Next.js 15 project scaffold with Tailwind CSS and TypeScript
- Design system: reusable UI components in DRIP design language
- Animation engine: GSAP + Framer Motion primitives, particle system
- Full landing page at drip.surf with animated hero, features, agent preview, CTA
- Social media kit for X (profile, banner, templates, OG image)
- Vercel deployment with custom domain

### Out of Scope / Non-Goals

- Agent functionality (M002)
- Token creation (M003)
- Backend API or database
- User authentication
- The agent.drip.surf subdomain (M002)

## Technical Constraints

- Lighthouse performance score ≥ 80 — animations must not destroy load times
- GSAP ScrollTrigger for complex scroll-driven animation, Framer Motion for React component transitions — don't mix their responsibilities
- Dark theme only — no light mode toggle (the dark aesthetic IS the brand)
- Use prefers-reduced-motion media query for accessibility

## Color Palette

| Name | Hex | Role |
|---|---|---|
| Icy Aqua | #bdfffd | Highlights, secondary glow, hover states |
| Soft Cyan | #9ffff5 | Primary accent, active states, links |
| Aquamarine | #7cffc4 | CTA buttons, success states, primary glow |
| Ocean Mist | #6abea7 | Subtle accents, borders, secondary text |
| Blue Slate | #5e6973 | Muted text, disabled states, dark borders |

Background colors should be derived from Blue Slate — darker variants (#0a0f14, #111820, #1a2230) for depth layering.

## Typography Direction

- Headings: geometric sans-serif with futuristic character (candidates: Space Grotesk, Outfit, Exo 2, Orbitron for display)
- Body: clean, highly readable sans-serif (candidates: Inter, Plus Jakarta Sans)
- Monospace: for code/data elements (JetBrains Mono or similar)

## Voice & Tone

DRIP's voice is **cool & mysterious** — drops alpha quietly, doesn't try hard, lets quality speak. Ocean mist energy.

- Never hype. Never "LFG" or "to the moon" energy.
- Confident but understated. "The data speaks" not "AMAZING results!"
- Technical competence shown, not claimed.
- Slightly cryptic — leave room for curiosity.

## Integration Points

- Vercel — deployment platform
- drip.surf — custom domain (DNS configuration)
- X/Twitter — social assets deployed to account

## Open Questions

- Exact logo direction (abstract ocean/wave mark? lettermark? mascot?) — agent decides during S01, user reviews
- Whether to include a waitlist/email capture on the landing page — could be a lightweight CTA for M002 agent access
