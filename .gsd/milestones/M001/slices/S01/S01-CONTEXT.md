---
id: S01
milestone: M001
status: complete
---

# S01: Brand Foundation — Context

## Goal

Establish DRIP's complete visual identity — color tokens, typography, logo, voice & tone — as reusable design tokens and a brand guidelines reference that all downstream slices build on.

## Why this Slice

S01 is the root dependency for the entire milestone. S02 (design system) consumes its color tokens and fonts. S04 (landing page) needs the logo and voice direction. S05 (social kit) needs logo assets and copy voice. Without locked brand decisions, every downstream slice makes ad-hoc choices that diverge.

## Scope

### In Scope

- Complete color palette as Tailwind v4 @theme tokens (5 brand colors + 3 dark backgrounds)
- Typography stack selection and integration via next/font/google (Space Grotesk, Inter, JetBrains Mono)
- Logo SVGs — water droplet icon with aqua gradient, wordmark, and lockup variants in color and monochrome
- Brand guidelines document (docs/brand-guidelines.md) — palette, typography scale, logo usage, voice & tone
- Brand showcase page at /brand — palette swatches, typography specimens, logo gallery, voice reference
- Next.js project scaffold with Tailwind v4, TypeScript, App Router
- Design token definitions: glow shadows, spacing scale, border-radius conventions

### Out of Scope

- UI components (S02)
- Animation primitives (S03)
- Landing page assembly (S04)
- Social media asset export (S05)
- Light theme — dark aesthetic is the brand, no toggle
- Custom illustrations or mascot beyond the water droplet logo

## Constraints

- Color palette is user-provided and locked (D003) — no modifications to hex values
- Dark theme only — never place DRIP UI on white or light backgrounds (D005)
- Voice is "cool & mysterious" for social/X posts (D006), but **straightforward on the landing page** — clearly explain what DRIP does, save the mystery vibe for X content
- Logo SVGs must use explicit hex/gradient fills (no CSS variables) for portability to social assets and external platforms
- Tailwind v4 @theme in globals.css — not tailwind.config.ts (D013)

## Integration Points

### Consumes

- Nothing — S01 is the root slice with no upstream dependencies

### Produces

- `app/globals.css` @theme block — all color tokens, font families, shadow/glow definitions consumed by S02–S05
- `public/brand/` — 6 logo SVGs (icon, wordmark, lockup × color/mono) consumed by S04 landing page and S05 social kit
- `docs/brand-guidelines.md` — authoritative brand reference consumed by all downstream design work
- `app/brand/page.tsx` — brand showcase page, linked from site navigation (not hidden — publicly accessible)
- Font CSS variables (`--font-heading`, `--font-body`, `--font-mono`) consumed by all components

## Implementation Decisions

- **Logo direction:** Water droplet with aqua-to-aquamarine gradient — approved as final, not a placeholder. Ship on landing page and social assets as the permanent brand mark.
- **Brand page visibility:** /brand is public-facing and linked from site navigation — useful for community and partners to access brand assets, not just an internal developer reference.
- **Landing page voice:** Straightforward — clearly communicate that DRIP is an AI-powered research agent for Solana traders. Drop the cryptic energy for the landing page; reserve "cool & mysterious" for X/Twitter social posts.
- **Landing page CTA:** Teaser only — no waitlist signup, no community link, no email capture. The page is a brand showcase and agent preview until M002 is built.
- **Core message direction:** Agent + research focus — "AI-powered research for Solana traders" is the messaging axis, not outcome/edge language or community/token language.

## Agent's Discretion

- Exact hero headline and sub-copy wording — as long as it's straightforward and leads with the AI research agent positioning
- Layout of the /brand page sections — data-driven showcase pattern already established
- Whether to include a "coming soon" label on the teaser CTA or leave it as a visual-only agent preview

## Deferred Ideas

- Waitlist/email capture — revisit when M02 agent is closer to launch
- Community link (Discord/Telegram) — not needed yet, reconsider during M02 or M03
- Custom illustrations or mascot beyond the droplet logo — out of scope for M001

## Open Questions

- None — all brand foundation decisions are locked.
