# S01: Brand Foundation — Research

**Date:** 2026-03-15

## Summary

S01 delivers DRIP's brand identity system: color palette tokens, typography selection, logo SVG concepts, voice & tone documentation, and a brand guidelines page that renders in-browser. The codebase is empty — greenfield. The palette is user-locked (Icy Aqua through Blue Slate). Typography candidates are well-researched. The project scaffold (Next.js 15 + Tailwind CSS) gets set up here as the vehicle to render the brand guidelines page, though the full design system is S02's concern.

Key finding: Tailwind CSS v4 (current in 2026) uses CSS-first `@theme` configuration instead of `tailwind.config.ts`. The M001 roadmap's boundary map references `tailwind.config.ts` — this is outdated. Design tokens will live in `globals.css` via `@theme` directive, which is actually cleaner for what S01 needs (color tokens as CSS custom properties, font family references). The boundary contract to S02 remains satisfied — just delivered as `@theme` in CSS rather than a JS config file.

## Recommendation

**Typography stack: Space Grotesk (headings) + Inter (body) + JetBrains Mono (code/data)**

- Space Grotesk is consistently cited as the top font for futuristic/tech/crypto aesthetics. The "Space Grotesk + Space Mono" combo is explicitly recommended for "AI tools, Web3 apps, crypto dashboards" — DRIP's exact market.
- Inter is the body text standard. Clean, highly readable, massive weight range. Used by Auth0 and Raycast alongside Space Grotesk.
- JetBrains Mono for code/data elements. Industry standard monospace, open source, pairs naturally with both.
- All three are Google Fonts, loadable via `next/font/google` with zero-layout-shift optimization.
- Orbitron (from the candidates list) is too heavy for headings and reads "retro sci-fi" more than "futuristic modern." Exo 2 trends generic. Outfit is versatile but lacks the distinctive character Space Grotesk brings. Space Grotesk wins.

**Logo direction: Abstract water droplet / wave mark**

- Craft SVG logos by hand — a stylized water drop or flowing wave using the aqua palette gradients.
- Three variants: icon mark (standalone drop), wordmark (DRIP in Space Grotesk with custom lettering), combined lockup.
- The droplet shape maps directly to the brand name and water theme. Simple enough to work as a favicon, distinctive enough for social.

**Tailwind v4 with `@theme` for design tokens**

- New project → use Tailwind v4. CSS-first config via `@theme` directive in `globals.css`.
- Color tokens, font families, spacing, border-radius, and glow definitions all defined as CSS custom properties that auto-generate utility classes.
- No `tailwind.config.ts` needed (v4 auto-detects content, replaces PostCSS with native engine, 70% smaller CSS output).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Font loading + optimization | `next/font/google` | Self-hosts fonts, eliminates layout shift, integrates with Tailwind via CSS variables |
| CSS utility generation from tokens | Tailwind v4 `@theme` | Design tokens → utility classes automatically (`bg-icy-aqua`, `text-soft-cyan`, etc.) |
| Project scaffold | `create-next-app` with Tailwind flag | Sets up Next.js 15 + Tailwind + TypeScript + App Router in one command |
| Color accessibility contrast | WCAG contrast checkers | Verify aqua-on-dark combinations meet minimum contrast ratios |

## Existing Code and Patterns

- No existing code — empty repository with only `.git` and `.gsd/`
- No prior art to follow or avoid
- Node v22.22.0, npm v11.11.0 — current toolchain, no compatibility concerns

## Constraints

- **Palette is locked** — Icy Aqua #bdfffd, Soft Cyan #9ffff5, Aquamarine #7cffc4, Ocean Mist #6abea7, Blue Slate #5e6973 are user-specified (D003). Not negotiable.
- **Dark theme only** — no light mode toggle (D005). Background colors derived from Blue Slate: `#0a0f14` (deepest), `#111820` (surface), `#1a2230` (elevated).
- **Voice is "cool & mysterious"** — drops alpha quietly, never hype, slightly cryptic (D006). This must be documented precisely for S05 social copy.
- **Tailwind v4 uses `@theme` not `tailwind.config.ts`** — the roadmap boundary map says "tailwind.config.ts color values" but v4 delivers these as CSS custom properties in `globals.css`. Same tokens, different vehicle. S02 consumes them identically.
- **next/font/google requires specific import names** — `Space_Grotesk`, `Inter`, `JetBrains_Mono` (underscored).

## Common Pitfalls

- **Aqua-on-dark contrast** — Light aqua colors (#bdfffd, #9ffff5) on dark backgrounds (#0a0f14) will pass contrast for large text but may fail for small body text. Verify WCAG AA (4.5:1) for body text pairs. Ocean Mist (#6abea7) on darkest background may be borderline — test during execution.
- **Glow effect token definitions** — Defining `box-shadow` glow values in `@theme` requires `--shadow-*` custom properties. These generate `shadow-*` utilities. Define glow sizes (sm/md/lg) with the aqua palette colors as the glow color.
- **SVG logo color management** — Logo SVGs should use `currentColor` or explicit hex values, not CSS variables, since SVGs may be used outside the web context (social assets, favicons). Export both colored and monochrome variants.
- **Font subsetting** — `next/font/google` handles subsetting automatically via the `subsets: ['latin']` option. Don't manually download font files unless needed for a specific variant.
- **Tailwind v4 `@theme` vs `:root`** — Only `@theme` variables generate utility classes. Regular `:root` variables don't. Put all design tokens that need utilities (colors, fonts, spacing) in `@theme`. Put non-utility variables (sidebar width, header height) in `:root`.

## Open Risks

- **Logo quality** — SVG logos are hand-crafted in code. Complex organic shapes (water drops, waves) are hard to make look polished in raw SVG path data. Might need multiple iterations. The logo needs to work at 32px favicon size and 400px social size.
- **Aqua palette accessibility** — The palette is beautiful but optimized for aesthetics, not contrast ratios. Some combinations may need supplementary text treatments (slightly brighter variants for small text, or using Aquamarine #7cffc4 instead of Ocean Mist #6abea7 for readable body text on dark backgrounds).
- **Brand guidelines page scope** — This is primarily a developer/design reference, not a user-facing page. Keep it functional — color swatches, type specimens, logo display, voice reference. Don't over-invest in making it flashy (that's S04's job).

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Frontend design | `frontend-design` | installed (bundled GSD skill) |
| Tailwind CSS | `josiahsiegel/claude-plugin-marketplace@tailwindcss-advanced-layouts` (2.3K installs) | available |
| Tailwind CSS | `giuseppe-trisciuoglio/developer-kit@tailwind-css-patterns` (1.8K installs) | available |
| Next.js | `wshobson/agents@nextjs-app-router-patterns` (8.4K installs) | available |
| Brand design | `daffy0208/ai-dev-standards@brand-designer` (441 installs) | available |

The bundled `frontend-design` skill covers the core need here. The Next.js App Router patterns skill (8.4K installs) may be worth installing for S02+ when the component library gets built. The brand-designer skill is low install count and unlikely to add much over the bundled skill. Tailwind skills are v3-focused and may not cover v4 patterns well.

## Sources

- Space Grotesk is the top recommended font for futuristic/tech/crypto web design (source: [Elementor 50 Modern Fonts 2026](https://elementor.com/blog/modern-fonts-to-use-on-your-website/))
- Space Grotesk + Space Mono pairing explicitly recommended for "AI tools, Web3 apps, crypto dashboards" (source: [Best Google Font Pairings 2025](https://medium.com/design-bootcamp/best-google-font-pairings-for-ui-design-in-2025-ba8d006aa03d))
- Tailwind v4 uses CSS-first `@theme` directive, replaces `tailwind.config.ts` (source: [Tailwind CSS v4 Complete Guide 2026](https://devtoolbox.dedyn.io/blog/tailwind-css-v4-complete-guide))
- Both Tailwind v3 and v4 work with Next.js 15; v4 recommended for new projects (source: [Tailwind + Next.js Setup Guide 2026](https://designrevision.com/blog/tailwind-nextjs-setup))
- `next/font/google` supports CSS variable mode for Tailwind integration (source: [Next.js font docs](https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/02-components/font.mdx))
- All three selected fonts (Space Grotesk, Inter, JetBrains Mono) are Google Fonts, available via `next/font/google` (source: [Google Fonts](https://fonts.google.com))
