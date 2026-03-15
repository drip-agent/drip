"use client";

import { motion, useReducedMotion } from "motion/react";
import { ParticleField } from "@/components/animation/particle-field";
import { ScrollReveal } from "@/components/animation/scroll-reveal";
import { FadeInStagger } from "@/components/animation/fade-in-stagger";
import { GlowHover } from "@/components/animation/glow-hover";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scaleIn,
  staggerContainer,
  staggerItem,
} from "@/lib/motion-variants";

const VARIANT_PRESETS = [
  { name: "fadeIn", variants: fadeIn, label: "Fade In" },
  { name: "slideUp", variants: slideUp, label: "Slide Up" },
  { name: "slideDown", variants: slideDown, label: "Slide Down" },
  { name: "slideLeft", variants: slideLeft, label: "Slide Left" },
  { name: "slideRight", variants: slideRight, label: "Slide Right" },
  { name: "scaleIn", variants: scaleIn, label: "Scale In" },
] as const;

const SCROLL_DIRECTIONS = ["up", "down", "left", "right"] as const;

const STAGGER_ITEMS = [
  "gsap-utils",
  "motion-variants",
  "ScrollReveal",
  "ParticleField",
  "GlowHover",
  "FadeInStagger",
  "PageTransition",
  "Animation Engine",
];

export default function MotionPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen">
      {/* ── Hero: ParticleField background ── */}
      <div className="relative flex min-h-screen items-center justify-center">
        <ParticleField />
        <Container className="relative z-10 text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-icy-aqua sm:text-6xl lg:text-7xl">
            Animation Engine
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ocean-mist sm:text-xl">
            Scroll-triggered reveals, canvas particles, glow effects, staggered
            content, and page transitions — all respecting{" "}
            <code className="rounded bg-dark-elevated px-1.5 py-0.5 font-mono text-sm text-soft-cyan">
              prefers-reduced-motion
            </code>
            .
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Badge variant="accent">S03 Demo</Badge>
            <Badge variant="info">
              {shouldReduceMotion ? "Reduced Motion" : "Full Motion"}
            </Badge>
          </div>
        </Container>
      </div>

      {/* ── ScrollReveal Showcase ── */}
      <Section
        heading="ScrollReveal"
        subheading="Cards reveal from four directions as they enter the viewport."
      >
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SCROLL_DIRECTIONS.map((dir) => (
              <ScrollReveal key={dir} direction={dir}>
                <Card variant="default" className="text-center">
                  <Badge variant="accent" className="mb-3">
                    {dir}
                  </Badge>
                  <h3 className="font-heading text-lg font-semibold text-icy-aqua">
                    Reveal {dir.charAt(0).toUpperCase() + dir.slice(1)}
                  </h3>
                  <p className="mt-2 text-sm text-ocean-mist">
                    This card slides in from the {dir} direction when scrolled
                    into view.
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── FadeInStagger Demo ── */}
      <Section
        heading="FadeInStagger"
        subheading="Items appear sequentially with stagger timing as they enter view."
      >
        <Container>
          <FadeInStagger
            staggerDelay={0.08}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {STAGGER_ITEMS.map((item) => (
              <Card key={item} variant="elevated" className="text-center p-4">
                <Badge variant="default" className="mb-2">
                  {item.includes("-") ? "util" : "component"}
                </Badge>
                <p className="font-mono text-sm text-soft-cyan">{item}</p>
              </Card>
            ))}
          </FadeInStagger>
        </Container>
      </Section>

      {/* ── GlowHover Gallery ── */}
      <Section
        heading="GlowHover"
        subheading="Hover over cards and buttons to see glow effects at different intensities."
      >
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {(["sm", "md", "lg"] as const).map((intensity) => (
              <GlowHover key={intensity} intensity={intensity}>
                <Card variant="default" className="text-center">
                  <Badge variant="accent" className="mb-3">
                    {intensity}
                  </Badge>
                  <h3 className="font-heading text-lg font-semibold text-icy-aqua">
                    Glow {intensity.toUpperCase()}
                  </h3>
                  <p className="mt-2 text-sm text-ocean-mist">
                    Hover to see the {intensity} glow effect.
                  </p>
                </Card>
              </GlowHover>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <GlowHover intensity="sm">
              <Button variant="primary" size="sm">
                Small Glow
              </Button>
            </GlowHover>
            <GlowHover intensity="md">
              <Button variant="secondary" size="md">
                Medium Glow
              </Button>
            </GlowHover>
            <GlowHover intensity="lg">
              <Button variant="outline" size="lg">
                Large Glow
              </Button>
            </GlowHover>
          </div>
        </Container>
      </Section>

      {/* ── Variant Presets ── */}
      <Section
        heading="Variant Presets"
        subheading="Each card demonstrates a named motion-variants preset."
        spacing="spacious"
      >
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VARIANT_PRESETS.map(({ name, variants, label }, i) => (
              <motion.div
                key={name}
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card variant="elevated" className="text-center">
                  <Badge variant="info" className="mb-3">
                    {name}
                  </Badge>
                  <h3 className="font-heading text-lg font-semibold text-icy-aqua">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm text-ocean-mist">
                    Uses the <code className="font-mono text-soft-cyan">{name}</code>{" "}
                    variant preset from motion-variants.
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Footer spacer ── */}
      <div className="h-24" />
    </main>
  );
}
