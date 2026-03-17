"use client";

import { useEffect, useState, useRef } from "react";
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

/* ─── Constants ─── */

const TOKEN_MINT =
  process.env.NEXT_PUBLIC_DRIP_TOKEN_MINT || "";

const STATS = [
  { value: "1,000+", label: "Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "10,000+", label: "Research" },
  { value: "50+", label: "Tools" },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "AI-Powered Intelligence",
    description:
      "Advanced models analyze research data and on-chain patterns in real-time.",
  },
  {
    icon: "🔒",
    title: "Non-Custodial",
    description:
      "Your keys, your crypto. Full control of your assets at all times.",
  },
  {
    icon: "🚀",
    title: "Fast Execution",
    description: "Pay-per-request x402 API access on Solana.",
  },
  {
    icon: "🌐",
    title: "Solana-Native",
    description: "Built for Solana with x402 payments.",
  },
  {
    icon: "🤖",
    title: "Autonomous Agent",
    description: "24/7 autonomous research agent that never sleeps.",
  },
  {
    icon: "📊",
    title: "Real-time Analytics",
    description:
      "Comprehensive dashboards with actionable insights.",
  },
];

const COMPARISON_FEATURES = [
  { name: "AI Research Agent", drip: true, chatgpt: true, perplexity: true, nansen: false },
  { name: "On-chain Data", drip: true, chatgpt: false, perplexity: false, nansen: true },
  { name: "Pay-per-Query (x402)", drip: true, chatgpt: false, perplexity: false, nansen: false },
  { name: "Token Buyback", drip: true, chatgpt: false, perplexity: false, nansen: false },
  { name: "Non-Custodial", drip: true, chatgpt: true, perplexity: true, nansen: false },
  { name: "Solana-Native", drip: true, chatgpt: false, perplexity: false, nansen: true },
];

const API_CARDS = [
  {
    title: "Sentiment & research",
    description: "Real-time sentiment and market research.",
  },
  {
    title: "People & company intel",
    description: "Deep research on individuals and organizations.",
  },
  {
    title: "Social intelligence",
    description: "Social media data, profiles, and trends.",
  },
];

const ROADMAP = [
  {
    quarter: "Q1 2025",
    title: "Foundation",
    items: ["Brand & landing page", "Design system", "Core infrastructure"],
    current: false,
  },
  {
    quarter: "Q2 2025",
    title: "Agent Platform",
    items: ["AI chat agent", "Research skills (x402)", "Discovery feed"],
    current: false,
  },
  {
    quarter: "Q3 2025",
    title: "Token & Launch",
    items: ["$DRIP on PumpFun", "Payment-gated chat", "Buyback loop"],
    current: false,
  },
  {
    quarter: "Q4 2025",
    title: "Marketplace",
    items: ["Research intelligence market", "Agent-to-agent trading", "Moltbook integration"],
    current: false,
  },
  {
    quarter: "Q1 2026",
    title: "Scale & Intelligence",
    items: ["Advanced AI models", "Multi-chain expansion", "Autonomous discoveries"],
    current: true,
  },
  {
    quarter: "Q2 2026",
    title: "Enterprise & Beyond",
    items: ["Enterprise intelligence APIs", "Cross-agent learning", "Global market coverage"],
    current: false,
  },
];

const PARTNERS: { name: string; logo: React.ReactNode; url: string }[] = [
  {
    name: "Solana",
    url: "https://solana.com",
    logo: (
      <svg viewBox="0 0 397 312" className="h-5 w-5" fill="currentColor">
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
      </svg>
    ),
  },
  {
    name: "OKX",
    url: "https://okx.com",
    logo: (
      <svg viewBox="0 0 200 200" className="h-5 w-5" fill="currentColor">
        <rect x="10" y="10" width="55" height="55" rx="4" />
        <rect x="73" y="10" width="55" height="55" rx="4" />
        <rect x="136" y="10" width="55" height="55" rx="4" />
        <rect x="10" y="73" width="55" height="55" rx="4" />
        <rect x="136" y="73" width="55" height="55" rx="4" />
        <rect x="10" y="136" width="55" height="55" rx="4" />
        <rect x="73" y="136" width="55" height="55" rx="4" />
        <rect x="136" y="136" width="55" height="55" rx="4" />
      </svg>
    ),
  },
  {
    name: "PumpFun",
    url: "https://pump.fun",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: "Phantom",
    url: "https://phantom.app",
    logo: (
      <svg viewBox="0 0 128 128" className="h-5 w-5" fill="currentColor">
        <path d="M110.6 57.4C105.4 29.7 80.4 9 50.8 9 24 9 2 28.9 2 53.7c0 7 1.8 13.7 5 19.7 1.8 3.4 5.2 5.6 9 5.6h3.3c5.3 0 9.1-5.1 7.5-10.2-1-3.4-1.6-7-1.6-10.8 0-20.4 19-37 42.5-37 20.5 0 37.7 12.6 42 29.6.7 2.7 3.1 4.6 5.9 4.6h0c3.8 0 6.6-3.6 5.7-7.3zM36.4 63.4c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zm28.1 0c-3.6 0-6.5-2.9-6.5-6.5s2.9-6.5 6.5-6.5 6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5z" />
      </svg>
    ),
  },
  {
    name: "DexScreener",
    url: "https://dexscreener.com",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" />
        <circle cx="10" cy="12" r="3" />
        <path strokeLinecap="round" d="M15 15l6 6" strokeWidth={2} />
      </svg>
    ),
  },
  {
    name: "OpenRouter",
    url: "https://openrouter.ai",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "AgentCash",
    url: "https://agentcash.dev",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    name: "Moltbook",
    url: "https://moltbook.com",
    logo: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    logo: (
      <svg viewBox="0 0 76 65" className="h-4 w-4" fill="currentColor">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote:
      "DRIP's research intelligence is next-level. Real-time data that actually moves the needle for our trading desk.",
    name: "Alex K.",
    role: "DeFi Researcher",
    initials: "AK",
  },
  {
    quote:
      "The x402 payment model is genius. No subscriptions, no lock-in. Just pure research when you need it.",
    name: "Maria R.",
    role: "Crypto Fund Manager",
    initials: "MR",
  },
  {
    quote:
      "Finally an AI agent that delivers real alpha. The autonomous discovery feed surfaces opportunities I would have missed.",
    name: "Jake C.",
    role: "Solana Whale",
    initials: "JC",
  },
];

const FAQ_ITEMS = [
  {
    q: "What is DRIP and how does it work?",
    a: "DRIP is an autonomous AI research intelligence agent built on Solana. It crawls web data, social sentiment, and on-chain activity to deliver actionable research insights. You ask a question, DRIP deploys research agents, and you get a structured intelligence brief.",
  },
  {
    q: "Is DRIP custodial? Do you hold my funds?",
    a: "No. DRIP is fully non-custodial. We never hold your keys or funds. Payments happen via x402 protocol — pay per request directly from your wallet.",
  },
  {
    q: "What is the $DRIP token used for?",
    a: "$DRIP powers the research intelligence ecosystem. Use it to pay for AI research queries, and revenue from queries buys back and burns $DRIP, creating deflationary pressure.",
  },
  {
    q: "How do I get started with DRIP?",
    a: 'Click "Launch Agent" to start a research session. Connect your Solana wallet, ask a question, and DRIP handles the rest. Each query costs ~$0.05 via x402.',
  },
  {
    q: "Is there an API for developers?",
    a: "Yes. DRIP offers REST-style APIs that any HTTP client can use. Pay per request with $DRIP on Solana — no subscriptions, no API keys, instant access after payment.",
  },
  {
    q: "What are the fees?",
    a: "Research queries cost approximately $0.05 each via x402 micropayments. No subscriptions, no minimum spend. You only pay for what you use.",
  },
];

/* ─── Terminal Component ─── */

function TerminalMockup() {
  return (
    <div className="w-full overflow-hidden rounded-card border border-ocean-mist/10 bg-dark-surface">
      {/* Chrome */}
      <div className="flex items-center justify-between border-b border-ocean-mist/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/60" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
          <div className="h-3 w-3 rounded-full bg-green-500/60" />
        </div>
        <span className="font-mono text-xs text-blue-slate">DRIP Terminal v1.0</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 border-b border-ocean-mist/10">
        <div className="border-r border-ocean-mist/10 p-4">
          <div className="text-xs text-blue-slate">Research Score</div>
          <div className="mt-1 font-mono text-2xl font-bold text-white">94.7%</div>
          <div className="mt-0.5 text-xs font-medium text-aquamarine">High Confidence</div>
        </div>
        <div className="p-4">
          <div className="text-xs text-blue-slate">Queries Today</div>
          <div className="mt-1 font-mono text-2xl font-bold text-white">1,247</div>
          <div className="mt-0.5 text-xs font-medium text-aquamarine">+12.3%</div>
        </div>
      </div>

      {/* Sentiment */}
      <div className="border-b border-ocean-mist/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white">AI Sentiment Score</span>
          <span className="text-xs text-aquamarine">Live</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] text-blue-slate">Positive</div>
            <div className="font-mono text-sm font-bold text-aquamarine">2,481</div>
          </div>
          <div>
            <div className="text-[10px] text-blue-slate">Negative</div>
            <div className="font-mono text-sm font-bold text-red-400">521</div>
          </div>
          <div>
            <div className="text-[10px] text-blue-slate">Score</div>
            <div className="font-mono text-sm font-bold text-aquamarine">82.6%</div>
          </div>
        </div>
      </div>

      {/* Signal */}
      <div className="space-y-1 px-4 py-3 font-mono text-xs">
        <div className="text-soft-cyan">
          AI Signal: Solana BULLISH with HIGH confidence
        </div>
        <div className="text-blue-slate">$DRIP: relaunching soon</div>
      </div>
    </div>
  );
}

/* ─── Token Section ─── */

function TokenSection() {
  const [copied, setCopied] = useState(false);
  const [market, setMarket] = useState<{
    priceUsd: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
  } | null>(null);

  useEffect(() => {
    async function fetchMarket() {
      try {
        const res = await fetch("/api/market/drip");
        if (res.ok) {
          const data = await res.json();
          if (data.priceUsd) setMarket(data);
        }
      } catch {
        /* silent */
      }
    }
    fetchMarket();
    const interval = setInterval(fetchMarket, 60_000);
    return () => clearInterval(interval);
  }, []);

  function handleCopy() {
    if (!TOKEN_MINT || !navigator.clipboard) return;
    navigator.clipboard.writeText(TOKEN_MINT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Contract address — only show when CA is set */}
      {TOKEN_MINT && (
      <div className="flex w-full max-w-2xl flex-col items-center gap-2 rounded-card border border-ocean-mist/10 bg-dark-surface px-6 py-4 sm:flex-row sm:justify-between">
        <div>
          <div className="text-xs text-blue-slate">Token Contract Address</div>
          <div className="mt-1 font-mono text-sm text-white break-all">{TOKEN_MINT}</div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-2 flex shrink-0 items-center gap-1.5 rounded-button border border-ocean-mist/10 px-3 py-1.5 text-sm text-blue-slate transition-colors hover:text-icy-aqua sm:mt-0"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 002 2z"
            />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      )}

      {/* Live market data */}
      {market && (
        <FadeInStagger
          staggerDelay={0.1}
          className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">Price</div>
            <div className="mt-1 font-mono text-lg font-bold text-icy-aqua">
              $
              {market.priceUsd < 0.01
                ? market.priceUsd.toFixed(6)
                : market.priceUsd < 1
                  ? market.priceUsd.toFixed(4)
                  : market.priceUsd.toFixed(2)}
            </div>
          </GlassPanel>
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">Market Cap</div>
            <div className="mt-1 font-mono text-lg font-bold text-soft-cyan">
              {market.marketCap >= 1_000_000
                ? `$${(market.marketCap / 1_000_000).toFixed(1)}M`
                : market.marketCap >= 1_000
                  ? `$${(market.marketCap / 1_000).toFixed(1)}K`
                  : `$${market.marketCap.toFixed(0)}`}
            </div>
          </GlassPanel>
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">24h Volume</div>
            <div className="mt-1 font-mono text-lg font-bold text-soft-cyan">
              {market.volume24h >= 1_000_000
                ? `$${(market.volume24h / 1_000_000).toFixed(1)}M`
                : market.volume24h >= 1_000
                  ? `$${(market.volume24h / 1_000).toFixed(1)}K`
                  : `$${market.volume24h.toFixed(0)}`}
            </div>
          </GlassPanel>
          <GlassPanel className="text-center">
            <div className="text-xs text-blue-slate">24h Change</div>
            <div
              className={`mt-1 font-mono text-lg font-bold ${
                market.priceChange24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {market.priceChange24h >= 0 ? "+" : ""}
              {market.priceChange24h.toFixed(1)}%
            </div>
          </GlassPanel>
        </FadeInStagger>
      )}

      {/* Utility cards */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <Card variant="elevated" className="flex flex-col gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-dark-deepest text-2xl">
            🔥
          </div>
          <h4 className="text-base font-semibold text-white">Buyback &amp; Burn</h4>
          <p className="text-sm leading-relaxed text-blue-slate">
            x402 revenue buys back and burns $DRIP, creating deflationary pressure.
          </p>
        </Card>
        <Card variant="elevated" className="flex flex-col gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-dark-deepest text-2xl">
            💳
          </div>
          <h4 className="text-base font-semibold text-white">Pay-per-Query</h4>
          <p className="text-sm leading-relaxed text-blue-slate">
            Use $DRIP to pay for AI research queries. Real utility, real value.
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ─── FAQ Accordion ─── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ocean-mist/10">
      <button
        type="button"
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-base font-medium text-white pr-4">{q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-blue-slate transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-blue-slate">{a}</div>
      )}
    </div>
  );
}

/* ─── Page ─── */

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <NavBar />

      <main className="relative">
        {/* ── 1. HERO ── */}
        <div className="relative min-h-dvh overflow-hidden pt-16">
          <ParticleField />

          <Container size="wide" className="relative z-10">
            <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center gap-10 py-16 lg:flex-row lg:items-center lg:gap-16">
              {/* Left — headline */}
              <div className="flex-1">
                <Badge variant="accent" className="mb-6">
                  ⚡ Powered by x402 Technology
                </Badge>

                <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                  <span className="text-white">AI Research</span>
                  <br />
                  <span className="text-gradient-aqua">Intelligence</span>
                  <br />
                  <span className="text-ocean-mist">Layer</span>
                  <br />
                  <span className="text-white">for Alpha Seekers</span>
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-relaxed text-ocean-mist">
                  Deep research, social intelligence, and on-chain data — distilled into
                  actionable insights. Pay per query with $DRIP on Solana.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="/agent">
                    <Button size="lg" variant="primary">
                      Launch Agent →
                    </Button>
                  </a>
                  <a href="#features">
                    <Button size="lg" variant="outline">
                      ▶ Watch Demo
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right — terminal */}
              <div className="w-full max-w-md flex-shrink-0 lg:max-w-lg">
                <ScrollReveal direction="right">
                  <TerminalMockup />
                </ScrollReveal>
              </div>
            </div>
          </Container>

          {/* Gradient fade */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-deepest to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* ── 2. STATS BAR ── */}
        <div className="border-y border-ocean-mist/10 bg-dark-surface/50">
          <Container size="wide">
            <FadeInStagger
              staggerDelay={0.1}
              className="grid grid-cols-2 divide-x divide-ocean-mist/10 sm:grid-cols-4"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="py-8 text-center">
                  <div className="font-mono text-3xl font-bold text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-slate">
                    {stat.label}
                  </div>
                </div>
              ))}
            </FadeInStagger>
          </Container>
        </div>

        {/* ── 3. FEATURES ── */}
        <Section
          id="features"
          heading="The Future of Research Intelligence"
          subheading="DRIP provides the intelligence layer for next-generation research. We combine cutting-edge AI with real-time data to deliver actionable insights and autonomous discovery."
        >
          <Container>
            <FadeInStagger
              staggerDelay={0.1}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {FEATURES.map((f) => (
                <GlowHover key={f.title} intensity="sm">
                  <Card
                    variant="elevated"
                    className="h-full transition-colors hover:border-icy-aqua/20"
                  >
                    <div className="mb-3 text-2xl">{f.icon}</div>
                    <h3 className="text-base font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-blue-slate">
                      {f.description}
                    </p>
                  </Card>
                </GlowHover>
              ))}
            </FadeInStagger>
          </Container>
        </Section>

        {/* ── 4. COMPARISON ── */}
        <Section
          id="comparison"
          className="bg-dark-surface/30"
        >
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  WHY CHOOSE DRIP
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Built for{" "}
                  <span className="text-gradient-aqua">Serious Researchers</span>
                </h2>
              </div>

              <div className="overflow-x-auto rounded-card border border-ocean-mist/10">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-dark-elevated">
                      <th className="px-5 py-4 text-left text-sm font-semibold text-white">
                        Feature
                      </th>
                      <th className="px-4 py-4 text-center font-mono text-sm font-bold text-soft-cyan">
                        DRIP
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-medium text-blue-slate">
                        ChatGPT
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-medium text-blue-slate">
                        Perplexity
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-medium text-blue-slate">
                        Nansen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((row) => (
                      <tr key={row.name} className="border-t border-ocean-mist/10">
                        <td className="px-5 py-3.5 text-sm text-white">{row.name}</td>
                        <td className="px-4 py-3.5 text-center">
                          {row.drip ? (
                            <span className="text-base font-bold text-aquamarine">✓</span>
                          ) : (
                            <span className="text-blue-slate">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {row.chatgpt ? (
                            <span className="text-blue-slate">✓</span>
                          ) : (
                            <span className="text-blue-slate">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {row.perplexity ? (
                            <span className="text-blue-slate">✓</span>
                          ) : (
                            <span className="text-blue-slate">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {row.nansen ? (
                            <span className="text-blue-slate">✓</span>
                          ) : (
                            <span className="text-blue-slate">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 5. API ── */}
        <Section id="api">
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  HTTP 402
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Request. Pay. Get data.
                </h2>
                <p className="mt-4 text-lg text-ocean-mist">
                  Pay per request with $DRIP on Solana. No subscriptions.
                </p>
              </div>

              <FadeInStagger
                staggerDelay={0.12}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {API_CARDS.map((card) => (
                  <Card key={card.title} variant="elevated" className="flex flex-col gap-3">
                    <h3 className="text-base font-semibold text-white">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-blue-slate">
                      {card.description}
                    </p>
                    <span className="mt-auto font-mono text-xs text-aquamarine">
                      Available via x402
                    </span>
                  </Card>
                ))}
              </FadeInStagger>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 6. DEVELOPERS ── */}
        <Section id="developers">
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  FOR DEVELOPERS
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Build with{" "}
                  <span className="text-gradient-aqua">DRIP APIs</span>
                </h2>
                <p className="mt-4 text-lg text-ocean-mist">
                  Integrate research intelligence into your agents, bots, and applications.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Code sample */}
                <div className="overflow-hidden rounded-card border border-ocean-mist/10 bg-dark-elevated">
                  <div className="flex items-center gap-2 border-b border-ocean-mist/10 bg-dark-deepest px-4 py-3">
                    <div className="h-2 w-2 rounded-full bg-aquamarine" />
                    <span className="font-mono text-xs text-blue-slate">Quick Start</span>
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
                    <code>
                      <span className="text-blue-slate">{`# Install the DRIP SDK\n`}</span>
                      <span className="text-soft-cyan">{`npm install @drip/sdk\n\n`}</span>
                      <span className="text-blue-slate">{`# Research a person\n`}</span>
                      <span className="text-purple-400">const </span>
                      <span className="text-white">result </span>
                      <span className="text-purple-400">= await </span>
                      <span className="text-aquamarine">{`drip.research(\n`}</span>
                      <span className="text-white">{`  { name: `}</span>
                      <span className="text-amber-400">{`'Vitalik Buterin'`}</span>
                      <span className="text-white">{` }\n`}</span>
                      <span className="text-aquamarine">{`)`}</span>
                    </code>
                  </pre>
                </div>

                {/* Feature list */}
                <div className="flex flex-col justify-center gap-5">
                  {[
                    "REST-style, any HTTP client",
                    "Pay per request — no subscriptions",
                    "Solana-native payments via x402",
                    "Instant access after payment",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 shrink-0 text-aquamarine"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-base text-white">{item}</span>
                    </div>
                  ))}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href="/docs">
                      <Button variant="primary" size="md">
                        📖 Open Docs
                      </Button>
                    </a>
                    <a href="/docs#playground">
                      <Button variant="outline" size="md">
                        &lt;/&gt; API Playground
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 7. TOKEN — hidden until PumpFun relaunch ── */}

        {/* ── 8. ROADMAP ── */}
        <Section id="roadmap" className="bg-dark-surface/30">
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  ROADMAP
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Building the{" "}
                  <span className="text-gradient-aqua">Future</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ROADMAP.map((phase) => (
                  <Card
                    key={phase.quarter}
                    variant={phase.current ? "featured" : "elevated"}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          phase.current ? "text-soft-cyan" : "text-blue-slate"
                        }`}
                      >
                        {phase.quarter}
                      </span>
                      {phase.current && (
                        <span className="rounded bg-aquamarine px-2 py-0.5 font-mono text-[10px] font-bold text-dark-deepest">
                          NOW
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                    <ul className="space-y-1.5">
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          className={`text-sm ${
                            phase.current ? "text-white" : "text-blue-slate"
                          }`}
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 9. PARTNERS ── */}
        <Section id="partners">
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  ECOSYSTEM
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Partners &amp;{" "}
                  <span className="text-gradient-aqua">Integrations</span>
                </h2>
                <p className="mt-4 text-lg text-ocean-mist">
                  DRIP integrates with leading protocols and data providers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {PARTNERS.map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 rounded-card border border-ocean-mist/10 bg-dark-surface/50 px-5 py-5 text-blue-slate transition-all hover:border-icy-aqua/30 hover:text-icy-aqua hover:shadow-[0_0_20px_rgba(189,255,253,0.05)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center text-ocean-mist transition-colors group-hover:text-icy-aqua">
                      {partner.logo}
                    </div>
                    <span className="text-sm font-medium">{partner.name}</span>
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 10. TESTIMONIALS ── */}
        <Section id="testimonials" className="bg-dark-surface/30">
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  TESTIMONIALS
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Trusted by{" "}
                  <span className="text-gradient-aqua">Professionals</span>
                </h2>
              </div>

              <FadeInStagger
                staggerDelay={0.12}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {TESTIMONIALS.map((t) => (
                  <Card key={t.name} variant="elevated" className="flex flex-col gap-4">
                    <p className="text-sm italic leading-relaxed text-white">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-deepest font-mono text-sm font-semibold text-soft-cyan">
                        {t.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t.name}</div>
                        <div className="text-xs text-blue-slate">{t.role}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </FadeInStagger>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 11. FAQ ── */}
        <Section id="faq">
          <Container size="narrow">
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  FAQ
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Frequently Asked{" "}
                  <span className="text-gradient-aqua">Questions</span>
                </h2>
              </div>

              <div>
                {FAQ_ITEMS.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 12. ARTICLES ── */}
        <Section id="articles" className="bg-dark-surface/30">
          <Container>
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <Badge variant="accent" className="mb-4">
                  ARTICLES
                </Badge>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Insights &amp;{" "}
                  <span className="text-gradient-aqua">Updates</span>
                </h2>
              </div>

              <FadeInStagger
                staggerDelay={0.12}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <Card variant="elevated" className="flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dark-deepest text-xl">
                    📄
                  </div>
                  <h3 className="text-base font-semibold leading-snug text-white">
                    DRIP Explained: The AI Research Intelligence Layer on Solana
                  </h3>
                  <p className="text-sm leading-relaxed text-blue-slate">
                    How DRIP delivers real-time research intelligence for the agent economy.
                  </p>
                  <span className="mt-auto text-sm font-medium text-soft-cyan">
                    Read more ↗
                  </span>
                </Card>

                {[2, 3].map((n) => (
                  <Card
                    key={n}
                    variant="elevated"
                    className="flex flex-col gap-4 opacity-60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dark-deepest text-xl">
                      📄
                    </div>
                    <h3 className="text-base font-semibold text-white">Article {n}</h3>
                    <div className="mt-auto flex items-center gap-1.5 text-sm text-blue-slate">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Coming soon
                    </div>
                  </Card>
                ))}
              </FadeInStagger>
            </ScrollReveal>
          </Container>
        </Section>

        {/* ── 13. CTA ── */}
        <Section id="cta" spacing="spacious" className="bg-dark-elevated/50">
          <Container size="narrow" className="text-center">
            <ScrollReveal direction="up">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                <span className="text-white">Ready to Research </span>
                <span className="text-gradient-aqua">Smarter?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-ocean-mist">
                Join the next generation of research intelligence. Start today.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a href="/agent">
                  <GlowHover intensity="lg">
                    <Button size="lg" variant="primary" className="px-10 text-base">
                      Launch Agent
                    </Button>
                  </GlowHover>
                </a>
                <a href="https://x.com/drip_agents" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">
                    ✉ Get Updates
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
