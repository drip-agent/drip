import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "DRIP — Brand Guidelines",
  description: "Complete brand system reference for DRIP.",
};

/* ─── Data ─── */

const paletteColors = [
  { name: "Icy Aqua", token: "icy-aqua", hex: "#bdfffd" },
  { name: "Soft Cyan", token: "soft-cyan", hex: "#9ffff5" },
  { name: "Aquamarine", token: "aquamarine", hex: "#7cffc4" },
  { name: "Ocean Mist", token: "ocean-mist", hex: "#6abea7" },
  { name: "Blue Slate", token: "blue-slate", hex: "#5e6973" },
] as const;

const darkColors = [
  { name: "Dark Deepest", token: "dark-deepest", hex: "#0a0f14" },
  { name: "Dark Surface", token: "dark-surface", hex: "#111820" },
  { name: "Dark Elevated", token: "dark-elevated", hex: "#1a2230" },
] as const;

const logoVariants = [
  { file: "logo-icon.svg", label: "Icon", width: 64, height: 64 },
  { file: "logo-wordmark.svg", label: "Wordmark", width: 200, height: 48 },
  { file: "logo-lockup.svg", label: "Lockup", width: 320, height: 64 },
  { file: "logo-icon-mono.svg", label: "Icon Mono", width: 64, height: 64 },
  { file: "logo-wordmark-mono.svg", label: "Wordmark Mono", width: 200, height: 48 },
  { file: "logo-lockup-mono.svg", label: "Lockup Mono", width: 320, height: 64 },
] as const;

const voiceDo = [
  "Let the work speak. Share results, not promises.",
  "Use precise, lowercase-energy language.",
  "Be warm but terse — respect people's time.",
  "Hint at depth. Leave room for curiosity.",
  '"Drops value quietly." — not "AMAZING VALUE DROP!!!"',
];

const voiceDont = [
  "Never use hype language: 🚀 revolutionary, game-changing, insane.",
  "Don't over-explain. Trust the reader.",
  "Avoid exclamation marks in product copy.",
  "Don't perform enthusiasm — earned confidence only.",
  "No filler phrases: \"we're excited to announce\", \"we're thrilled\".",
];

const sampleCopy = [
  { context: "Feature launch", copy: "New drop. Smarter notifications — they learn what matters to you." },
  { context: "Pricing", copy: "Free to start. Pay when it clicks." },
  { context: "Error state", copy: "Something slipped. We're looking into it." },
  { context: "Onboarding", copy: "Set up takes two minutes. No demo call required." },
  { context: "About", copy: "DRIP builds tools that stay out of your way until you need them." },
];

/* ─── Components ─── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-3xl font-bold text-icy-aqua mb-8 tracking-tight">
      {children}
    </h2>
  );
}

function ColorSwatch({
  name,
  token,
  hex,
  dark = false,
}: {
  name: string;
  token: string;
  hex: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`h-24 rounded-card border ${
          dark ? "border-blue-slate/30" : "border-white/10"
        }`}
        style={{ backgroundColor: hex }}
      />
      <div className="space-y-0.5">
        <p className="font-heading text-sm font-semibold text-white">{name}</p>
        <p className="font-mono text-xs text-blue-slate">{hex}</p>
        <p className="font-mono text-xs text-blue-slate/60">--color-{token}</p>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-dark-deepest">
      {/* Header */}
      <header className="border-b border-dark-elevated px-6 py-16 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-4">
            Brand System
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white tracking-tight">
            DRIP Brand Guidelines
          </h1>
          <p className="mt-4 text-lg text-ocean-mist max-w-2xl">
            The complete visual and verbal identity for DRIP. Cool, mysterious,
            and precise — every element designed to drop value quietly.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16 space-y-24">
        {/* ── Section 1: Palette ── */}
        <section id="palette">
          <SectionHeading>Color Palette</SectionHeading>

          <div className="space-y-10">
            <div>
              <h3 className="font-heading text-lg font-semibold text-white mb-4">
                Brand Colors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {paletteColors.map((c) => (
                  <ColorSwatch key={c.token} {...c} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold text-white mb-4">
                Dark Backgrounds
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {darkColors.map((c) => (
                  <ColorSwatch key={c.token} {...c} dark />
                ))}
              </div>
            </div>

            <div className="bg-dark-surface rounded-card p-6 border border-dark-elevated">
              <h3 className="font-heading text-sm font-semibold text-white mb-3">
                Usage Rules
              </h3>
              <ul className="space-y-1.5 text-sm text-ocean-mist">
                <li>
                  <span className="text-icy-aqua font-mono text-xs">icy-aqua</span>{" "}
                  — Primary accent, headings, key UI highlights
                </li>
                <li>
                  <span className="text-soft-cyan font-mono text-xs">soft-cyan</span>{" "}
                  — Secondary accent, hover states, interactive elements
                </li>
                <li>
                  <span className="text-aquamarine font-mono text-xs">aquamarine</span>{" "}
                  — Success states, CTAs, positive indicators
                </li>
                <li>
                  <span className="text-ocean-mist font-mono text-xs">ocean-mist</span>{" "}
                  — Body text on dark, secondary information
                </li>
                <li>
                  <span className="text-blue-slate font-mono text-xs">blue-slate</span>{" "}
                  — Muted text, borders, disabled states
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Section 2: Typography ── */}
        <section id="typography">
          <SectionHeading>Typography</SectionHeading>

          <div className="space-y-12">
            {/* Space Grotesk */}
            <div className="bg-dark-surface rounded-card p-8 border border-dark-elevated">
              <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-6">
                Heading — Space Grotesk
              </p>
              <div className="space-y-4">
                <p className="font-heading text-5xl font-bold text-white tracking-tight">
                  H1 — The ocean remembers
                </p>
                <p className="font-heading text-3xl font-bold text-white tracking-tight">
                  H2 — Currents beneath the surface
                </p>
                <p className="font-heading text-2xl font-semibold text-white">
                  H3 — Value drops quietly
                </p>
                <p className="font-heading text-xl font-semibold text-white">
                  H4 — Depth over noise
                </p>
              </div>
            </div>

            {/* Inter */}
            <div className="bg-dark-surface rounded-card p-8 border border-dark-elevated">
              <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-6">
                Body — Inter
              </p>
              <div className="space-y-4">
                <p className="font-body text-lg text-ocean-mist">
                  Body large — Every interaction should feel like discovering
                  something valuable in still water. No noise, no rush —
                  just clarity when you need it.
                </p>
                <p className="font-body text-base text-ocean-mist">
                  Body regular — DRIP surfaces what matters and lets the rest
                  settle. Built for people who value signal over spectacle.
                </p>
                <p className="font-body text-sm text-blue-slate">
                  Body small — Updated 3 minutes ago · 12 drops · 4 collaborators
                </p>
              </div>
            </div>

            {/* JetBrains Mono */}
            <div className="bg-dark-surface rounded-card p-8 border border-dark-elevated">
              <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-6">
                Code — JetBrains Mono
              </p>
              <div className="space-y-4">
                <div className="bg-dark-deepest rounded-button p-4 border border-dark-elevated">
                  <code className="font-mono text-sm text-aquamarine">
                    const drip = await connect(&#123; quiet: true &#125;);
                  </code>
                </div>
                <p className="font-mono text-xs text-blue-slate">
                  Used for code blocks, technical values, token names, and
                  inline references like <span className="text-icy-aqua">--color-icy-aqua</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Logos ── */}
        <section id="logos">
          <SectionHeading>Logo System</SectionHeading>

          {/* All 6 variants grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {logoVariants.map((logo) => (
              <div
                key={logo.file}
                className="bg-dark-surface rounded-card border border-dark-elevated p-8 flex flex-col items-center gap-4"
              >
                <div className="flex items-center justify-center h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/brand/${logo.file}`}
                    alt={`DRIP ${logo.label}`}
                    width={logo.width}
                    height={logo.height}
                    className="max-h-16 w-auto"
                  />
                </div>
                <p className="font-mono text-xs text-blue-slate">{logo.label}</p>
              </div>
            ))}
          </div>

          {/* Icon scalability test */}
          <div className="bg-dark-surface rounded-card border border-dark-elevated p-8">
            <h3 className="font-heading text-lg font-semibold text-white mb-6">
              Icon Scalability
            </h3>
            <div className="flex items-end gap-8">
              {[32, 64, 128].map((size) => (
                <div key={size} className="flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-icon.svg"
                    alt={`Icon at ${size}px`}
                    width={size}
                    height={size}
                    style={{ width: size, height: size }}
                  />
                  <p className="font-mono text-xs text-blue-slate">{size}px</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Voice & Tone ── */}
        <section id="voice">
          <SectionHeading>Voice &amp; Tone</SectionHeading>

          <div className="space-y-10">
            {/* Personality */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-white mb-4">
                Personality
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Cool & Mysterious", "Quietly Confident", "Precise & Terse", "Depth-First"].map(
                  (trait) => (
                    <div
                      key={trait}
                      className="bg-dark-surface rounded-card border border-dark-elevated p-5 text-center"
                    >
                      <p className="font-heading text-sm font-semibold text-icy-aqua">
                        {trait}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Do / Don't */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-surface rounded-card border border-aquamarine/20 p-6">
                <h3 className="font-heading text-sm font-semibold text-aquamarine mb-4">
                  ✓ Do
                </h3>
                <ul className="space-y-2.5">
                  {voiceDo.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-ocean-mist pl-4 border-l-2 border-aquamarine/30"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-dark-surface rounded-card border border-blue-slate/20 p-6">
                <h3 className="font-heading text-sm font-semibold text-blue-slate mb-4">
                  ✗ Don&apos;t
                </h3>
                <ul className="space-y-2.5">
                  {voiceDont.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-blue-slate pl-4 border-l-2 border-blue-slate/30"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sample Copy */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-white mb-4">
                Sample Copy
              </h3>
              <div className="space-y-3">
                {sampleCopy.map((s) => (
                  <div
                    key={s.context}
                    className="bg-dark-surface rounded-card border border-dark-elevated p-5 flex flex-col sm:flex-row sm:items-baseline gap-2"
                  >
                    <span className="font-mono text-xs text-blue-slate shrink-0 w-28">
                      {s.context}
                    </span>
                    <p className="text-sm text-ocean-mist">{s.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-elevated px-6 py-8 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-blue-slate">
            DRIP Brand Guidelines — Internal Reference
          </p>
        </div>
      </footer>
    </main>
  );
}
