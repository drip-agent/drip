# DRIP Brand Guidelines

> Cool, mysterious, precise. Value drops quietly.

This document defines DRIP's complete visual and verbal identity. Use it as the authoritative reference for all design, copy, and development work.

---

## Color System

### Brand Palette

| Name | Hex | Token | Usage |
|------|-----|-------|-------|
| Icy Aqua | `#bdfffd` | `--color-icy-aqua` | Primary accent, headings, key UI highlights, glow base |
| Soft Cyan | `#9ffff5` | `--color-soft-cyan` | Secondary accent, hover states, interactive elements |
| Aquamarine | `#7cffc4` | `--color-aquamarine` | Success states, CTAs, positive indicators, gradient endpoint |
| Ocean Mist | `#6abea7` | `--color-ocean-mist` | Body text on dark backgrounds, secondary information |
| Blue Slate | `#5e6973` | `--color-blue-slate` | Muted text, borders, disabled states, captions |

### Dark Backgrounds

| Name | Hex | Token | Usage |
|------|-----|-------|-------|
| Dark Deepest | `#0a0f14` | `--color-dark-deepest` | Page background, primary canvas |
| Dark Surface | `#111820` | `--color-dark-surface` | Cards, panels, elevated containers |
| Dark Elevated | `#1a2230` | `--color-dark-elevated` | Modals, dropdowns, highest elevation layer |

### Color Rules

- **Text on dark backgrounds:** Use `ocean-mist` for body text, `white` (#ffffff) for headings and emphasis, `blue-slate` for muted/secondary text.
- **Accents:** `icy-aqua` for primary interactive elements and highlights. `soft-cyan` for hover/focus states. `aquamarine` for success and CTAs.
- **Backgrounds:** Always use the dark palette. Never place DRIP UI on white or light backgrounds.
- **Borders:** Use `dark-elevated` for subtle borders, `blue-slate` at low opacity (20-30%) for stronger borders.
- **Gradients:** Primary gradient flows from `icy-aqua` (#bdfffd) to `aquamarine` (#7cffc4). Use for logos, hero elements, and key visual accents.

---

## Typography

### Font Stack

| Role | Font | Variable | Weights | Usage |
|------|------|----------|---------|-------|
| Heading | Space Grotesk | `--font-heading` | 600 (semibold), 700 (bold) | All headings (h1–h6), display text, brand lockups |
| Body | Inter | `--font-body` | 400 (regular), 500 (medium) | Body text, UI labels, descriptions, navigation |
| Code | JetBrains Mono | `--font-mono` | 400 (regular) | Code blocks, technical values, token names, captions |

### Size Scale

| Level | Size | Weight | Font | Tracking |
|-------|------|--------|------|----------|
| H1 | 3rem (48px) | 700 | Space Grotesk | tight |
| H2 | 1.875rem (30px) | 700 | Space Grotesk | tight |
| H3 | 1.5rem (24px) | 600 | Space Grotesk | normal |
| H4 | 1.25rem (20px) | 600 | Space Grotesk | normal |
| Body large | 1.125rem (18px) | 400 | Inter | normal |
| Body regular | 1rem (16px) | 400 | Inter | normal |
| Body small | 0.875rem (14px) | 400 | Inter | normal |
| Caption | 0.75rem (12px) | 400 | JetBrains Mono | widest |

### Typography Rules

- Headings are always in Space Grotesk. Never use Inter or system fonts for headings.
- Body text is always in Inter. Never use heading or code fonts for body copy.
- Code/technical references use JetBrains Mono inline — including token names, hex values, and commands.
- Captions and meta labels use JetBrains Mono at 12px, uppercase, with wide tracking.
- Heading color: `white` (#ffffff) or `icy-aqua` (#bdfffd) for accented headings.
- Body text color: `ocean-mist` (#6abea7) on dark backgrounds. `blue-slate` (#5e6973) for secondary text.

---

## Logo

### Variants

DRIP has six logo files, covering all use cases:

| File | Type | Description |
|------|------|-------------|
| `logo-icon.svg` | Colored Icon | Stylized water droplet with aqua gradient |
| `logo-wordmark.svg` | Colored Wordmark | "DRIP" text with aqua gradient fill |
| `logo-lockup.svg` | Colored Lockup | Icon + wordmark combined |
| `logo-icon-mono.svg` | Mono Icon | White droplet for any background |
| `logo-wordmark-mono.svg` | Mono Wordmark | White "DRIP" text |
| `logo-lockup-mono.svg` | Mono Lockup | White icon + wordmark combined |

All SVGs live in `public/brand/` and use explicit hex/gradient values (not CSS variables) for portability in social assets, documents, and external platforms.

### Logo Usage Rules

- **Minimum size:** Icon at 32px (favicon-viable). Wordmark at 120px wide. Lockup at 200px wide.
- **Clear space:** Maintain at least 50% of the icon's height as padding around any logo variant.
- **Background:** Always place logos on dark backgrounds (`dark-deepest`, `dark-surface`, or `dark-elevated`). Use mono variants when background contrast is uncertain.
- **Colored variants:** Use the gradient versions as the primary choice on DRIP-controlled surfaces.
- **Mono variants:** Use white mono versions on photography, third-party dark backgrounds, or anywhere the gradient might clash.

### What Not to Do

- Do not stretch, rotate, or skew the logo.
- Do not change the gradient colors or replace them with non-brand colors.
- Do not place the colored gradient logo on light backgrounds.
- Do not add drop shadows, outlines, or effects to the logo.
- Do not recreate the wordmark in a different font — always use the SVG file.
- Do not use the icon smaller than 32px.

---

## Voice & Tone

### Personality

DRIP's voice is **cool and mysterious**. Think: ocean mist energy — calm surface with depth underneath. We drop value quietly instead of announcing it loudly.

**Core traits:**
- **Cool & Mysterious** — Never overshare. Hint at depth. Leave room for curiosity.
- **Quietly Confident** — State facts. Don't hedge, don't hype. Earned authority.
- **Precise & Terse** — Every word earns its place. Respect people's time and intelligence.
- **Depth-First** — Substance over spectacle. Show the work, not the excitement about the work.

### Communication Principles

1. **Let the work speak.** Share results, not promises. Show what's built, not what's planned.
2. **Be warm but terse.** Respectful and human, but never verbose or performative.
3. **Use lowercase energy.** Even exciting things are stated calmly. Confidence doesn't need volume.
4. **Trust the reader.** Don't over-explain. If someone is reading DRIP copy, assume they're smart.
5. **Earn every word.** If a sentence doesn't add information or character, cut it.

### Do

- Let the work speak. Share results, not promises.
- Use precise, lowercase-energy language.
- Be warm but terse — respect people's time.
- Hint at depth. Leave room for curiosity.
- "Drops value quietly." — not "AMAZING VALUE DROP!!!"

### Don't

- Never use hype language: 🚀 revolutionary, game-changing, insane, incredible, blown away.
- Don't over-explain. Trust the reader.
- Avoid exclamation marks in product copy.
- Don't perform enthusiasm — earned confidence only.
- No filler phrases: "we're excited to announce", "we're thrilled", "we can't wait".

### Sample Copy

| Context | Example |
|---------|---------|
| Feature launch | "New drop. Smarter notifications — they learn what matters to you." |
| Pricing | "Free to start. Pay when it clicks." |
| Error state | "Something slipped. We're looking into it." |
| Onboarding | "Set up takes two minutes. No demo call required." |
| About | "DRIP builds tools that stay out of your way until you need them." |
| Empty state | "Nothing here yet. That's about to change." |
| Loading | "Gathering drops..." |
| 404 | "This page evaporated. Try the surface." |

---

## Glow & Shadow System

DRIP uses aqua-tinted glow shadows to create depth and atmosphere on dark backgrounds. Three levels defined as design tokens:

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Glow SM | `--shadow-glow-sm` | Subtle hover states, small buttons, input focus rings |
| Glow MD | `--shadow-glow-md` | Cards on hover, active interactive elements, medium emphasis |
| Glow LG | `--shadow-glow-lg` | Hero elements, featured content, major CTAs, modal highlights |

### Glow Values

```css
--shadow-glow-sm: 0 0 8px 0 rgba(189, 255, 253, 0.15), 0 0 4px 0 rgba(189, 255, 253, 0.1);
--shadow-glow-md: 0 0 16px 0 rgba(189, 255, 253, 0.2), 0 0 8px 0 rgba(159, 255, 245, 0.15);
--shadow-glow-lg: 0 0 32px 0 rgba(189, 255, 253, 0.25), 0 0 16px 0 rgba(124, 255, 196, 0.2);
```

### Glow Rules

- **Always on dark backgrounds.** Glow effects are invisible or ugly on light surfaces.
- **Use sparingly.** One or two glowing elements per viewport. More than that kills the effect.
- **Scale with importance.** SM for minor interactions, MD for standard focus, LG for hero moments.
- **Base colors:** Glow SM/MD use `icy-aqua` as the base color. Glow LG mixes `icy-aqua` with `aquamarine` for a richer, wider spread.
- **Combine with transitions.** Glow effects work best when animated on hover/focus — not static.

---

## Spacing & Radii

### Custom Spacing

In addition to Tailwind's default spacing scale, DRIP defines:

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-18` | 4.5rem (72px) | Section gaps on desktop |
| `--spacing-22` | 5.5rem (88px) | Hero section padding |
| `--spacing-30` | 7.5rem (120px) | Major section separators |
| `--spacing-34` | 8.5rem (136px) | Page-level vertical rhythm |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-card` | 0.75rem (12px) | Cards, panels, content containers |
| `--radius-pill` | 9999px | Tags, badges, pills |
| `--radius-button` | 0.5rem (8px) | Buttons, inputs, small interactive elements |

---

## Technical Reference

### Tailwind v4 Usage

All tokens are defined in `app/globals.css` using `@theme` blocks. Tailwind v4 auto-generates utilities:

```css
/* Colors → bg-icy-aqua, text-soft-cyan, border-aquamarine, etc. */
/* Shadows → shadow-glow-sm, shadow-glow-md, shadow-glow-lg */
/* Spacing → p-18, m-22, gap-30, etc. */
/* Radii → rounded-card, rounded-pill, rounded-button */
```

### Font Integration

Fonts are loaded via `next/font/google` in `app/layout.tsx` and wired through CSS variables:

```
--font-heading → Space Grotesk (via next/font)
--font-body    → Inter (via next/font)
--font-mono    → JetBrains Mono (via next/font)
```

Use via Tailwind utilities: `font-heading`, `font-body`, `font-mono`.

---

*DRIP Brand Guidelines — Internal Reference*
