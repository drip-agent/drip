"use client";

import { useEffect, useState } from "react";
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
import { GlassPanel } from "@/components/ui/glass-panel";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { fadeIn, slideUp } from "@/lib/motion-variants";

/* ─── Content data ─── */

const FEATURES = [
  {
    title: "Deep Research",
    description:
      "Autonomous web crawling, social sentiment parsing, and on-chain data aggregation — distilled into actionable insights.",
    icon: "🔬",
  },
  {
    title: "Alpha Intelligence",
    description:
      "Pattern recognition across thousands of data points surfaces opportunities before they hit the mainstream radar.",
    icon: "🧠",
  },
  {
    title: "Automated Pipelines",
    description:
      "Set research triggers, schedule scans, and receive reports — DRIP works around the clock so you don't have to.",
    icon: "⚡",
  },
  {
    title: "Alpha Drops",
    description:
      "Curated intelligence drops delivered to your feed. Each drop is a condensed research package ready for action.",
    icon: "💧",
  },
] as const;

const STEPS = [
  {
    number: "01",
    title: "Ask",
    description:
      "Describe what you're researching — a project, trend, narrative, or specific data point.",
  },
  {
    number: "02",
    title: "Research",
    description:
      "DRIP deploys autonomous agents that crawl, parse, cross-reference, and validate across multiple sources.",
  },
  {
    number: "03",
    title: "Deliver",
    description:
      "Receive a structured intelligence brief with sources, confidence scores, and actionable takeaways.",
  },
] as const;

const TERMINAL_LINES = [
  { type: "prompt" as const, text: "npx drip-agent research anthropic.com" },
  { type: "system" as const, text: "Researching anthropic.com..." },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "  💧 Company Research: Anthropic" },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "  Industry:     Artificial Intelligence" },
  { type: "output" as const, text: "  Founded:      2021" },
  { type: "output" as const, text: "  Employees:    1,000-5,000" },
  { type: "output" as const, text: "  Funding:      $7.3B raised" },
  { type: "output" as const, text: "  Tech Stack:   Python, React, Kubernetes, GCP" },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "  Cost: ~$0.05 via AgentCash" },
  { type: "output" as const, text: "" },
  { type: "prompt" as const, text: "npx drip-agent enrich dario@anthropic.com" },
  { type: "system" as const, text: "Enriching profile..." },
  { type: "output" as const, text: "  👤 Dario Amodei — CEO @ Anthropic" },
];

/* ─── Token Section ─── */

const TOKEN_MINT = process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT || "DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump";

// Mock revenue: starts at $250 USDC, grows $10/hour from launch
const REVENUE_LAUNCH = new Date("2026-03-15T12:00:00Z").getTime();
const REVENUE_BASE = 250;
const REVENUE_PER_HOUR = 10;
const QUERIES_PER_DOLLAR = 20; // ~$0.05 per query

function getMockRevenue() {
  const now = Date.now();
  const hoursElapsed = Math.max(0, (now - REVENUE_LAUNCH) / (1000 * 60 * 60));
  const totalEarned = REVENUE_BASE + hoursElapsed * REVENUE_PER_HOUR;
  const queryCount = Math.floor(totalEarned * QUERIES_PER_DOLLAR);
  return { totalEarned: totalEarned.toFixed(2), queryCount };
}

function TokenSection() {
  const [revenue, setRevenue] = useState<{
    totalEarned: string;
    queryCount: number;
  }>(() => getMockRevenue());
  const [copied, setCopied] = useState(false);
  const [market, setMarket] = useState<{
    priceUsd: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    liquidity: number;
  } | null>(null);

  useEffect(() => {
    // Update revenue every 30 seconds
    const interval = setInterval(() => {
      setRevenue(getMockRevenue());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch live market data
    async function fetchMarket() {
      try {
        const res = await fetch("/api/market/drip");
        if (res.ok) {
          const data = await res.json();
          if (data.priceUsd) setMarket(data);
        }
      } catch { /* silent */ }
    }
    fetchMarket();
    const interval = setInterval(fetchMarket, 60_000);
    return () => clearInterval(interval);
  }, []);

  function handleCopy() {
    if (!TOKEN_MINT) return;
    if (!navigator.clipboard) {
      console.warn("[token-section] Clipboard API unavailable (non-HTTPS context)");
      return;
    }
    navigator.clipboard.writeText(TOKEN_MINT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const pumpFunUrl = TOKEN_MINT
    ? `https://pump.fun/coin/${TOKEN_MINT}`
    : "https://pump.fun";

  const truncatedMint = TOKEN_MINT
    ? `${TOKEN_MINT.slice(0, 6)}...${TOKEN_MINT.slice(-4)}`
    : null;

  return (
    <>
      <ScrollReveal direction="up">
        <Card variant="featured">
          <div className="flex flex-col gap-6">
            {/* Token identity */}
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-heading text-2xl font-bold text-icy-aqua">$DRIP</h3>
              <Badge variant="accent">Solana Token</Badge>
            </div>

            {/* Contract address */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-blue-slate">
                Contract Address
              </span>
              {TOKEN_MINT ? (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="group flex items-center gap-2 text-left"
                >
                  <code className="truncate rounded-button bg-dark-elevated px-3 py-1.5 font-mono text-sm text-ocean-mist transition-colors group-hover:text-icy-aqua">
                    {truncatedMint}
                  </code>
                  <span className="shrink-0 text-xs text-blue-slate transition-colors group-hover:text-icy-aqua">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              ) : (
                <span className="text-sm text-ocean-mist/60">Coming soon</span>
              )}
            </div>

            {/* PumpFun link */}
            <a
              href={pumpFunUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-button border border-aquamarine/25 bg-aquamarine/10 px-4 py-2 text-sm font-medium text-icy-aqua transition-colors hover:bg-aquamarine/20"
            >
              View on PumpFun
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </Card>
      </ScrollReveal>

      {/* Revenue stats */}
      <FadeInStagger staggerDelay={0.15} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassPanel className="text-center">
          <div className="text-sm text-blue-slate">Total Revenue</div>
          <div className="mt-1 font-heading text-2xl font-bold text-icy-aqua">
            {`${revenue.totalEarned} USDC`}
          </div>
        </GlassPanel>
        <GlassPanel className="text-center">
          <div className="text-sm text-blue-slate">Queries Processed</div>
          <div className="mt-1 font-heading text-2xl font-bold text-soft-cyan">
            {revenue.queryCount.toLocaleString()}
          </div>
        </GlassPanel>
      </FadeInStagger>

      {/* Live market data */}
      {market && (
        <FadeInStagger staggerDelay={0.1} className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">Price</div>
            <div className="mt-1 font-heading text-lg font-bold text-icy-aqua">
              ${market.priceUsd < 0.01
                ? market.priceUsd.toFixed(6)
                : market.priceUsd < 1
                  ? market.priceUsd.toFixed(4)
                  : market.priceUsd.toFixed(2)}
            </div>
          </GlassPanel>
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">Market Cap</div>
            <div className="mt-1 font-heading text-lg font-bold text-soft-cyan">
              {market.marketCap >= 1_000_000
                ? `$${(market.marketCap / 1_000_000).toFixed(1)}M`
                : market.marketCap >= 1_000
                  ? `$${(market.marketCap / 1_000).toFixed(1)}K`
                  : `$${market.marketCap.toFixed(0)}`}
            </div>
          </GlassPanel>
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">24h Volume</div>
            <div className="mt-1 font-heading text-lg font-bold text-soft-cyan">
              {market.volume24h >= 1_000_000
                ? `$${(market.volume24h / 1_000_000).toFixed(1)}M`
                : market.volume24h >= 1_000
                  ? `$${(market.volume24h / 1_000).toFixed(1)}K`
                  : `$${market.volume24h.toFixed(0)}`}
            </div>
          </GlassPanel>
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">24h Change</div>
            <div className={`mt-1 font-heading text-lg font-bold ${
              market.priceChange24h >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {market.priceChange24h >= 0 ? "+" : ""}{market.priceChange24h.toFixed(1)}%
            </div>
          </GlassPanel>
        </FadeInStagger>
      )}

      {/* Buyback explainer */}
      <div className="mt-8 rounded-card border border-ocean-mist/10 bg-dark-surface/50 p-5">
        <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-aquamarine">
          Tokenized Agents Loop
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
          Revenue from agent queries buys back and burns $DRIP — creating a
          direct link between usage and token value. Once accumulated revenue
          crosses the $10 threshold, a buyback is triggered automatically.
          Every query makes $DRIP scarcer.
        </p>
      </div>
    </>
  );
}

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <NavBar />

      <main className="relative">
        {/* ── Hero ── */}
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden">
          <ParticleField />

          <Container className="relative z-10 text-center">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl"
            >
              <Badge variant="accent" className="mb-6">
                AI Research Agent
              </Badge>

              <h1 className="font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                <span className="text-gradient-aqua">DRIP</span>
              </h1>

              <motion.p
                variants={slideUp}
                initial="hidden"
                animate="visible"
                className="mx-auto mt-6 max-w-xl text-lg text-ocean-mist sm:text-xl"
              >
                Autonomous research intelligence that surfaces alpha before the
                crowd. Ask a question. Get the edge.
              </motion.p>

              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <a href="/agent">
                  <Button size="lg" variant="primary">
                    Try DRIP Agent
                  </Button>
                </a>
                <a href="#features">
                  <Button size="lg" variant="outline">
                    See How It Works
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </Container>

          {/* Gradient fade at bottom of hero */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-deepest to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ── Features ── */}
        <Section
          id="features"
          heading="Built for the Edge"
          subheading="DRIP combines autonomous agents, real-time data pipelines, and pattern recognition to deliver intelligence that matters."
        >
          <Container>
            <FadeInStagger
              staggerDelay={0.12}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {FEATURES.map((feature) => (
                <GlowHover key={feature.title} intensity="sm">
                  <Card
                    variant="elevated"
                    className="h-full transition-colors hover:border-icy-aqua/20"
                  >
                    <div className="mb-4 text-3xl">{feature.icon}</div>
                    <h3 className="font-heading text-lg font-semibold text-icy-aqua">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
                      {feature.description}
                    </p>
                  </Card>
                </GlowHover>
              ))}
            </FadeInStagger>
          </Container>
        </Section>

        {/* ── How It Works ── */}
        <Section
          id="how-it-works"
          heading="Three Steps to Alpha"
          subheading="From question to actionable intelligence in minutes, not hours."
          className="relative"
        >
          <Container size="narrow">
            <div className="relative space-y-8">
              {/* Vertical connector line */}
              <div
                className="absolute top-0 bottom-0 left-8 hidden w-px bg-gradient-to-b from-icy-aqua/40 via-aquamarine/20 to-transparent sm:block"
                aria-hidden="true"
              />

              {STEPS.map((step, i) => (
                <ScrollReveal key={step.number} direction="up" delay={i * 0.15}>
                  <GlassPanel className="relative pl-20 sm:pl-24">
                    {/* Step number */}
                    <div className="absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-icy-aqua/30 bg-dark-deepest font-mono text-sm font-bold text-icy-aqua shadow-glow-sm sm:left-3">
                      {step.number}
                    </div>

                    <h3 className="font-heading text-xl font-semibold text-soft-cyan">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
                      {step.description}
                    </p>
                  </GlassPanel>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── Agent Preview ── */}
        <Section
          id="agent"
          heading="See DRIP in Action"
          subheading="A research pipeline that thinks, validates, and delivers."
        >
          <Container size="narrow">
            <ScrollReveal direction="up">
              <GlassPanel blur="lg" className="overflow-hidden p-0">
                {/* Terminal chrome */}
                <div className="flex items-center gap-2 border-b border-ocean-mist/10 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                  <div className="h-3 w-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 font-mono text-xs text-blue-slate">
                    drip-agent — terminal
                  </span>
                </div>

                {/* Terminal body */}
                <div className="space-y-1.5 p-5 font-mono text-sm">
                  {TERMINAL_LINES.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {line.type === "prompt" && (
                        <>
                          <span className="shrink-0 text-aquamarine">❯</span>
                          <span className="text-icy-aqua">{line.text}</span>
                        </>
                      )}
                      {line.type === "system" && (
                        <>
                          <span className="shrink-0 text-blue-slate">⠿</span>
                          <span className="text-ocean-mist">{line.text}</span>
                        </>
                      )}
                      {line.type === "output" && (
                        <span className="text-soft-cyan">{line.text}</span>
                      )}
                    </div>
                  ))}

                  {/* Blinking cursor */}
                  <div className="flex items-center gap-2">
                    <span className="text-aquamarine">❯</span>
                    <span className="inline-block h-4 w-2 animate-pulse bg-icy-aqua/70" />
                  </div>
                </div>
              </GlassPanel>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── Token ── */}
        <Section
          id="token"
          heading="Token"
          subheading="$DRIP — the token that fuels autonomous research intelligence."
        >
          <Container size="narrow">
            <TokenSection />
          </Container>
        </Section>

        {/* ── CTA ── */}
        <Section
          id="try-agent"
          spacing="spacious"
          className="relative"
        >
          <Container size="narrow" className="text-center">
            <ScrollReveal direction="up">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-icy-aqua sm:text-4xl lg:text-5xl">
                Ready for the Edge?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-ocean-mist">
                Research any company or person in seconds.
                Intelligence that compounds.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a href="/agent">
                  <GlowHover intensity="lg">
                    <Button size="lg" variant="primary" className="px-10 text-base">
                      Try DRIP Agent
                    </Button>
                  </GlowHover>
                </a>
                <code className="rounded-md border border-ocean-mist/20 bg-dark-deepest/50 px-4 py-2.5 font-mono text-sm text-soft-cyan">
                  npx drip-agent
                </code>
              </div>

              <p className="mt-4 text-sm text-blue-slate">
                Free to try. ~$0.05 per research query via AgentCash.
              </p>
            </ScrollReveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
