import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Proof of Work — DRIP",
  description:
    "Daily execution log — everything DRIP shipped, integrated, and built. Transparent progress tracking.",
};

/* ─── Update data ─── */

type Update = {
  date: string;
  title: string;
  description?: string;
  link?: string;
  tags: string[];
  impact: "high" | "medium" | "low";
};

const UPDATES: Update[] = [
  {
    date: "Mar 17, 2026",
    title: "Promo video rendered with Remotion",
    description:
      "15-second vertical promo video (1080×1920) built with Remotion — 5 scenes: logo reveal, features, terminal demo, $DRIP token, CTA. React-powered video generation.",
    tags: ["marketing", "video"],
    impact: "medium",
  },
  {
    date: "Mar 17, 2026",
    title: "x402 ecosystem PR submitted to Coinbase",
    description:
      "Submitted PR #1651 to coinbase/x402 to list DRIP as a Services/Endpoints project in the official x402 ecosystem directory at x402.org/ecosystem.",
    link: "https://github.com/coinbase/x402/pull/1651",
    tags: ["x402", "ecosystem"],
    impact: "high",
  },
  {
    date: "Mar 17, 2026",
    title: "$DRIP token relaunch announced",
    description:
      "Preparing fresh PumpFun launch. Old contract address removed from all pages. New CA will be announced on launch day.",
    tags: ["token", "relaunch"],
    impact: "high",
  },
  {
    date: "Mar 16, 2026",
    title: "Complete documentation site — 23 pages",
    description:
      "Built Syra-style docs site at drip.surf/docs with sidebar navigation, 23 pages covering: Getting Started, DRIP Agent (Web/CLI/Capabilities), API Reference (6 endpoints), Integrations (AgentCash, Wallets, PumpFun, DexScreener, OpenRouter, Moltbook), Token & Utility, FAQ, Changelog. All pages prerender as static.",
    link: "https://drip.surf/docs",
    tags: ["docs", "website"],
    impact: "high",
  },
  {
    date: "Mar 16, 2026",
    title: "Marketing content bank created",
    description:
      "497-line content bank with 3 X/Twitter threads, 6 standalone tweets, 4 SEO blog outlines, 3 social captions, 7 video concepts, SEO schema markup, keyword clusters, and 7-day content calendar.",
    tags: ["marketing", "content"],
    impact: "medium",
  },
  {
    date: "Mar 16, 2026",
    title: "5 social media card designs",
    description:
      "1200×675px branded cards: Launch Announcement, Developer API, Token Utility, Comparison Table, Roadmap — dark DRIP aesthetic with gradient accents.",
    tags: ["marketing", "design"],
    impact: "medium",
  },
  {
    date: "Mar 16, 2026",
    title: "Live site screen recording",
    description:
      "20-second smooth scroll recording of drip.surf for social media and marketing use.",
    tags: ["marketing", "video"],
    impact: "low",
  },
  {
    date: "Mar 15, 2026",
    title: "Complete landing page redesign — 16 sections",
    description:
      "Full rewrite of drip.surf with 16 sections: Hero (split layout + terminal mockup), Stats Bar, Features (6 cards), Comparison Table (vs ChatGPT/Perplexity/Nansen), x402 API (3 cards), Developer Docs, Token ($DRIP with live market data), Roadmap (Q1 2025→Q2 2026), Partners (8 integrations), Testimonials, FAQ (6 accordion), Articles, CTA, Footer. 39KB page, 952 insertions.",
    link: "https://drip.surf",
    tags: ["website", "design"],
    impact: "high",
  },
  {
    date: "Mar 15, 2026",
    title: "Navbar and Footer components rebuilt",
    description:
      "New responsive navbar with smooth scroll navigation + mobile hamburger menu. 4-column footer with product, developer, community, and legal sections.",
    tags: ["website", "components"],
    impact: "medium",
  },
  {
    date: "Mar 15, 2026",
    title: "Competitive analysis: DRIP vs Syra",
    description:
      "Deep analysis of syraa.fun design, X/Twitter marketing strategy, and product positioning. Detailed comparison report covering design patterns, content strategy, and growth tactics.",
    tags: ["research", "strategy"],
    impact: "medium",
  },
  {
    date: "Mar 15, 2026",
    title: "Deployed to production on Vercel",
    description:
      "Landing page redesign merged to main and deployed to drip.surf via Vercel. All 16 sections confirmed live. Clean git history with drip-agent author.",
    link: "https://drip.surf",
    tags: ["deployment", "infrastructure"],
    impact: "high",
  },
  {
    date: "Mar 15, 2026",
    title: "Brand design system established",
    description:
      "SVG logo suite (icon, lockup, wordmark — color + mono variants), favicon, Apple icon, OG images. Color palette: Icy Aqua #bdfffd, Soft Cyan #9ffff5, Aquamarine #7cffc4, Ocean Mist #6abea7, Blue Slate #5e6973.",
    tags: ["design", "brand"],
    impact: "medium",
  },
  {
    date: "Mar 14, 2026",
    title: "Animation component library",
    description:
      "Built reusable animation components: ParticleField (floating dots), ScrollReveal (on-scroll fade-in), FadeInStagger (sequential reveals), GlowHover (aqua glow on hover). All using Framer Motion.",
    tags: ["website", "components"],
    impact: "medium",
  },
  {
    date: "Mar 14, 2026",
    title: "UI component library",
    description:
      "Card, Button, Badge, GlassPanel components with consistent dark theme styling. Glassmorphism effects with backdrop-blur and gradient borders.",
    tags: ["website", "components"],
    impact: "medium",
  },
  {
    date: "Mar 13, 2026",
    title: "Moltbook submolt created",
    description:
      "drip-market submolt registered on Moltbook (id: 6c6b4c55) under drip_agent owner for social engagement and community building.",
    tags: ["social", "integration"],
    impact: "low",
  },
  {
    date: "Mar 12, 2026",
    title: "Market data API endpoint",
    description:
      "Built /api/market/drip endpoint fetching live token data from DexScreener — price, market cap, volume, liquidity, 24h change. Powers the live stats on the landing page.",
    tags: ["api", "infrastructure"],
    impact: "medium",
  },
  {
    date: "Mar 12, 2026",
    title: "Social media API endpoints",
    description:
      "Built 7 social API routes: /api/social/banner, /profile, /teaser, /template-announcement, /template-update, /twitter-banner, /twitter-profile. Dynamic OG image generation for social sharing.",
    tags: ["api", "social"],
    impact: "medium",
  },
  {
    date: "Mar 11, 2026",
    title: "Agent chat interface",
    description:
      "Interactive AI chat at drip.surf/agent — research queries via conversational UI with wallet connection for x402 payments.",
    link: "https://drip.surf/agent",
    tags: ["product", "agent"],
    impact: "high",
  },
  {
    date: "Mar 10, 2026",
    title: "x402 payment middleware",
    description:
      "Server-side x402 payment verification for API endpoints. Returns 402 with payment terms, verifies Solana USDC transactions via X-Payment-Proof header.",
    tags: ["x402", "infrastructure"],
    impact: "high",
  },
  {
    date: "Mar 10, 2026",
    title: "Next.js project initialized",
    description:
      "Project scaffolded with Next.js 16, TypeScript, Tailwind CSS. Deployed to Vercel Hobby tier at drip.surf.",
    tags: ["infrastructure", "deployment"],
    impact: "medium",
  },
];

/* ─── Heatmap ─── */

function generateHeatmapData() {
  const today = new Date(2026, 2, 17); // Mar 17, 2026
  const days: { date: string; level: number }[] = [];

  // Generate 12 weeks of data
  for (let w = 11; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      // Check if any updates match this date
      const matchingUpdates = UPDATES.filter((u) => {
        const uDate = new Date(u.date + "");
        return (
          uDate.getDate() === date.getDate() &&
          uDate.getMonth() === date.getMonth() &&
          uDate.getFullYear() === date.getFullYear()
        );
      });
      let level = 0;
      if (matchingUpdates.length > 0) {
        const hasHigh = matchingUpdates.some((u) => u.impact === "high");
        const hasMedium = matchingUpdates.some((u) => u.impact === "medium");
        level = hasHigh ? 3 : hasMedium ? 2 : 1;
      }
      days.push({ date: dateStr, level });
    }
  }
  return days;
}

const HEATMAP = generateHeatmapData();

const LEVEL_COLORS: Record<number, string> = {
  0: "bg-dark-elevated",
  1: "bg-aquamarine/20",
  2: "bg-aquamarine/50",
  3: "bg-aquamarine",
};

const TAG_COLORS: Record<string, string> = {
  website: "bg-soft-cyan/15 text-soft-cyan",
  design: "bg-purple-500/15 text-purple-400",
  docs: "bg-icy-aqua/15 text-icy-aqua",
  marketing: "bg-amber-500/15 text-amber-400",
  x402: "bg-aquamarine/15 text-aquamarine",
  token: "bg-emerald-500/15 text-emerald-400",
  api: "bg-blue-500/15 text-blue-400",
  infrastructure: "bg-blue-slate/20 text-blue-slate",
  product: "bg-icy-aqua/15 text-icy-aqua",
  agent: "bg-soft-cyan/15 text-soft-cyan",
  social: "bg-pink-500/15 text-pink-400",
  integration: "bg-orange-500/15 text-orange-400",
  research: "bg-yellow-500/15 text-yellow-400",
  strategy: "bg-yellow-500/15 text-yellow-400",
  deployment: "bg-emerald-500/15 text-emerald-400",
  brand: "bg-purple-500/15 text-purple-400",
  components: "bg-blue-500/15 text-blue-400",
  video: "bg-pink-500/15 text-pink-400",
  content: "bg-amber-500/15 text-amber-400",
  ecosystem: "bg-aquamarine/15 text-aquamarine",
  relaunch: "bg-emerald-500/15 text-emerald-400",
};

const IMPACT_DOTS: Record<string, string> = {
  high: "bg-aquamarine",
  medium: "bg-soft-cyan",
  low: "bg-blue-slate",
};

/* ─── Page ─── */

export default function ProofOfWork() {
  return (
    <>
      <NavBar />
      <main className="pt-24">
        <Section spacing="spacious">
          <Container size="default">
            {/* Header */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
                Proof of Work
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
                Daily execution log
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-ocean-mist">
                A record of what shipped and moved the project forward. Each
                update is tagged by area and color-coded by impact. No promises
                — only work done.
              </p>
            </div>

            {/* Tabs-style nav */}
            <div className="mt-10 flex justify-center gap-6 border-b border-ocean-mist/10 pb-4">
              <span className="border-b-2 border-icy-aqua pb-2 text-sm font-medium text-icy-aqua">
                Recent updates
              </span>
              <span className="pb-2 text-sm text-blue-slate">Heatmap</span>
              <span className="pb-2 text-sm text-blue-slate">Token locked</span>
            </div>

            {/* Recent updates */}
            <div className="mt-10 space-y-0">
              {UPDATES.map((update, i) => (
                <div
                  key={`${update.date}-${i}`}
                  className="group flex gap-5 border-l-2 border-ocean-mist/10 py-5 pl-6 transition-colors hover:border-aquamarine/40"
                >
                  {/* Impact dot */}
                  <div className="relative mt-1.5 flex shrink-0">
                    <div
                      className={`h-3 w-3 rounded-full ${IMPACT_DOTS[update.impact]}`}
                    />
                    <div
                      className={`absolute h-3 w-3 animate-ping rounded-full ${IMPACT_DOTS[update.impact]} opacity-20`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Date */}
                    <div className="text-xs text-blue-slate">{update.date}</div>

                    {/* Title */}
                    {update.link ? (
                      <a
                        href={update.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-base font-semibold text-white transition-colors hover:text-icy-aqua"
                      >
                        {update.title} ↗
                      </a>
                    ) : (
                      <div className="mt-1 text-base font-semibold text-white">
                        {update.title}
                      </div>
                    )}

                    {/* Description */}
                    {update.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
                        {update.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {update.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[tag] || "bg-dark-elevated text-blue-slate"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="mt-16">
              <h2 className="font-heading text-xl font-bold text-white">
                Activity Heatmap
              </h2>
              <p className="mt-2 text-sm text-blue-slate">
                Last 12 weeks of development activity
              </p>

              <div className="mt-6 overflow-x-auto">
                <div className="inline-grid grid-cols-12 gap-1.5">
                  {Array.from({ length: 12 }, (_, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1.5">
                      {Array.from({ length: 7 }, (_, dayIdx) => {
                        const idx = weekIdx * 7 + dayIdx;
                        const cell = HEATMAP[idx];
                        if (!cell) return null;
                        return (
                          <div
                            key={dayIdx}
                            className={`h-4 w-4 rounded-sm ${LEVEL_COLORS[cell.level]}`}
                            title={`${cell.date} — ${cell.level === 0 ? "No activity" : cell.level === 1 ? "Low" : cell.level === 2 ? "Medium" : "High"}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center gap-3 text-xs text-blue-slate">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-sm bg-dark-elevated" />
                    <div className="h-3 w-3 rounded-sm bg-aquamarine/20" />
                    <div className="h-3 w-3 rounded-sm bg-aquamarine/50" />
                    <div className="h-3 w-3 rounded-sm bg-aquamarine" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Token Locked */}
            <div className="mt-16 mb-8">
              <h2 className="font-heading text-xl font-bold text-white">
                Token Locked
              </h2>
              <p className="mt-2 text-sm text-blue-slate">
                Liquidity and token lock details for $DRIP
              </p>

              <div className="mt-6 rounded-card border border-ocean-mist/10 bg-dark-surface p-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {/* Lock status */}
                  <div className="text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-slate">
                      Lock Status
                    </div>
                    <div className="mt-2 text-2xl font-bold text-ocean-mist">
                      Pending
                    </div>
                    <div className="mt-1 text-xs text-blue-slate">
                      Awaiting PumpFun relaunch
                    </div>
                  </div>

                  {/* Lock duration */}
                  <div className="text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-slate">
                      Lock Duration
                    </div>
                    <div className="mt-2 text-2xl font-bold text-ocean-mist">
                      —
                    </div>
                    <div className="mt-1 text-xs text-blue-slate">
                      To be announced
                    </div>
                  </div>

                  {/* Lock amount */}
                  <div className="text-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-slate">
                      Locked Amount
                    </div>
                    <div className="mt-2 text-2xl font-bold text-ocean-mist">
                      —
                    </div>
                    <div className="mt-1 text-xs text-blue-slate">
                      To be announced
                    </div>
                  </div>
                </div>

                {/* Lock details placeholder */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-ocean-mist/5 bg-dark-elevated px-5 py-3.5">
                    <span className="text-sm text-ocean-mist">
                      Contract Address
                    </span>
                    <span className="font-mono text-sm text-blue-slate">
                      Coming after launch
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-ocean-mist/5 bg-dark-elevated px-5 py-3.5">
                    <span className="text-sm text-ocean-mist">
                      Lock Platform
                    </span>
                    <span className="font-mono text-sm text-blue-slate">
                      TBA
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-ocean-mist/5 bg-dark-elevated px-5 py-3.5">
                    <span className="text-sm text-ocean-mist">
                      Lock TX
                    </span>
                    <span className="font-mono text-sm text-blue-slate">
                      Coming after launch
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-ocean-mist/5 bg-dark-elevated px-5 py-3.5">
                    <span className="text-sm text-ocean-mist">
                      Unlock Date
                    </span>
                    <span className="font-mono text-sm text-blue-slate">
                      TBA
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border-l-4 border-soft-cyan/30 bg-soft-cyan/5 px-4 py-3 text-sm text-ocean-mist">
                  💡 Token lock details will be updated here immediately after the PumpFun relaunch. All lock transactions will be verifiable on-chain.
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
