import type { Metadata } from "next";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlowBorder } from "@/components/ui/glow-border";
import { Card } from "@/components/ui/card";
import { GlassPanel } from "@/components/ui/glass-panel";

export const metadata: Metadata = {
  title: "DRIP — Design System",
  description: "Component showcase for the DRIP design system.",
};

/* ─── Data ─── */

const buttonVariants = ["primary", "secondary", "ghost", "outline"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

const badgeVariants = [
  { variant: "default" as const, label: "Default" },
  { variant: "accent" as const, label: "Accent" },
  { variant: "info" as const, label: "Info" },
];

const glowIntensities = ["sm", "md", "lg"] as const;

const cardVariants = [
  { variant: "default" as const, label: "Default", description: "Standard surface card with subtle border." },
  { variant: "elevated" as const, label: "Elevated", description: "Raised surface for layered content." },
  { variant: "featured" as const, label: "Featured", description: "Highlighted card with aqua glow accent." },
];

const glassPanelBlurs = [
  { blur: "sm" as const, label: "Small Blur (8px)" },
  { blur: "md" as const, label: "Medium Blur (12px)" },
  { blur: "lg" as const, label: "Large Blur (20px)" },
];

const containerSizes = [
  { size: "narrow" as const, label: "Narrow", maxWidth: "max-w-4xl" },
  { size: "default" as const, label: "Default", maxWidth: "max-w-6xl" },
  { size: "wide" as const, label: "Wide", maxWidth: "max-w-7xl" },
];

const sectionSpacings = ["compact", "default", "spacious"] as const;

/* ─── Helpers ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

/* ─── Page ─── */

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-dark-deepest">
      <NavBar />

      {/* Hero header — pushed down for fixed nav */}
      <header className="pt-24 pb-12 border-b border-dark-elevated">
        <Container>
          <p className="font-mono text-xs text-blue-slate uppercase tracking-widest mb-4">
            Design System
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white tracking-tight">
            Component Showcase
          </h1>
          <p className="mt-4 text-lg text-ocean-mist max-w-2xl">
            Every UI primitive and layout component in the DRIP design language —
            dark backgrounds, aqua glow accents, and glassmorphism.
          </p>
        </Container>
      </header>

      <main>
        {/* ── CSS Utilities ── */}
        <Section heading="CSS Utilities" subheading="Custom Tailwind utilities for glass, gradients, and text effects.">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* glass */}
              <div className="space-y-2">
                <SectionLabel>glass</SectionLabel>
                <div className="glass rounded-card p-6 h-32 flex items-center justify-center">
                  <p className="text-sm text-ocean-mist">Frosted glass panel</p>
                </div>
              </div>

              {/* glass-strong */}
              <div className="space-y-2">
                <SectionLabel>glass-strong</SectionLabel>
                <div className="glass-strong rounded-card p-6 h-32 flex items-center justify-center">
                  <p className="text-sm text-ocean-mist">Dense glass panel</p>
                </div>
              </div>

              {/* gradient-aqua */}
              <div className="space-y-2">
                <SectionLabel>gradient-aqua</SectionLabel>
                <div className="gradient-aqua rounded-card p-6 h-32 flex items-center justify-center">
                  <p className="text-sm text-dark-deepest font-medium">Aqua gradient swatch</p>
                </div>
              </div>

              {/* gradient-radial-glow */}
              <div className="space-y-2">
                <SectionLabel>gradient-radial-glow</SectionLabel>
                <div className="gradient-radial-glow rounded-card p-6 h-32 flex items-center justify-center border border-ocean-mist/10">
                  <p className="text-sm text-ocean-mist">Radial glow background</p>
                </div>
              </div>

              {/* text-gradient-aqua */}
              <div className="space-y-2 md:col-span-2 lg:col-span-2">
                <SectionLabel>text-gradient-aqua</SectionLabel>
                <div className="bg-dark-surface rounded-card p-6 h-32 flex items-center justify-center border border-ocean-mist/10">
                  <h3 className="text-gradient-aqua font-heading text-4xl font-bold">
                    Gradient Text Heading
                  </h3>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── Buttons ── */}
        <Section heading="Buttons" subheading="All variant × size combinations with glow accents.">
          <Container>
            <div className="space-y-8">
              {buttonVariants.map((variant) => (
                <div key={variant}>
                  <SectionLabel>{variant}</SectionLabel>
                  <div className="flex flex-wrap items-center gap-4">
                    {buttonSizes.map((size) => (
                      <Button key={`${variant}-${size}`} variant={variant} size={size}>
                        {variant} {size}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── Badges ── */}
        <Section heading="Badges" subheading="Status indicators in three semantic variants.">
          <Container>
            <div className="flex flex-wrap items-center gap-4">
              {badgeVariants.map(({ variant, label }) => (
                <Badge key={variant} variant={variant}>
                  {label}
                </Badge>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── Input ── */}
        <Section heading="Input" subheading="Text input with focus glow and placeholder styling.">
          <Container size="narrow">
            <div className="space-y-6">
              <div className="space-y-2">
                <SectionLabel>Default</SectionLabel>
                <Input defaultValue="Entered text" />
              </div>
              <div className="space-y-2">
                <SectionLabel>With placeholder</SectionLabel>
                <Input placeholder="Enter your email..." />
              </div>
              <div className="space-y-2">
                <SectionLabel>Disabled</SectionLabel>
                <Input placeholder="Disabled input" disabled />
              </div>
            </div>
          </Container>
        </Section>

        {/* ── GlowBorder ── */}
        <Section heading="GlowBorder" subheading="Aqua glow effect at three intensity levels.">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {glowIntensities.map((intensity) => (
                <GlowBorder key={intensity} intensity={intensity}>
                  <div className="bg-dark-surface rounded-card p-6">
                    <p className="font-heading text-sm font-semibold text-icy-aqua mb-1">
                      Intensity: {intensity}
                    </p>
                    <p className="text-sm text-ocean-mist">
                      Glow wraps around content with {intensity === "sm" ? "subtle" : intensity === "md" ? "medium" : "strong"} aqua shadow.
                    </p>
                  </div>
                </GlowBorder>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── Cards ── */}
        <Section heading="Cards" subheading="Three surface variants for content hierarchy.">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cardVariants.map(({ variant, label, description }) => (
                <Card key={variant} variant={variant}>
                  <p className="font-heading text-lg font-semibold text-icy-aqua mb-2">
                    {label}
                  </p>
                  <p className="text-sm text-ocean-mist">{description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── GlassPanel ── */}
        <Section heading="GlassPanel" subheading="Glassmorphism panels with three blur levels.">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {glassPanelBlurs.map(({ blur, label }) => (
                <GlassPanel key={blur} blur={blur}>
                  <p className="font-heading text-sm font-semibold text-icy-aqua mb-1">
                    {label}
                  </p>
                  <p className="text-sm text-ocean-mist">
                    Content behind this panel is blurred at the specified intensity.
                  </p>
                </GlassPanel>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── Layout: Container ── */}
        <Section heading="Container" subheading="Responsive max-width wrapper in three sizes.">
          <div className="space-y-6">
            {containerSizes.map(({ size, label, maxWidth }) => (
              <div key={size}>
                <Container>
                  <SectionLabel>{label} ({maxWidth})</SectionLabel>
                </Container>
                <Container size={size}>
                  <div className="bg-dark-surface border border-ocean-mist/20 rounded-card p-4">
                    <p className="text-sm text-ocean-mist text-center">
                      Container size=&quot;{size}&quot;
                    </p>
                  </div>
                </Container>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Layout: Section ── */}
        <div className="border-t border-dark-elevated">
          <Container>
            <div className="py-16">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-icy-aqua sm:text-4xl text-center mb-4">
                Section
              </h2>
              <p className="text-lg text-ocean-mist text-center mb-12">
                Three spacing variants — compact, default, and spacious.
              </p>
              <div className="space-y-4">
                {sectionSpacings.map((spacing) => (
                  <div key={spacing} className="border border-ocean-mist/10 rounded-card overflow-hidden">
                    <Section spacing={spacing}>
                      <Container>
                        <div className="bg-dark-surface border border-dashed border-ocean-mist/20 rounded-card p-4 text-center">
                          <p className="text-sm text-ocean-mist">
                            Section spacing=&quot;{spacing}&quot;
                          </p>
                        </div>
                      </Container>
                    </Section>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </main>

      <Footer />
    </div>
  );
}
