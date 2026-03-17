import Link from "next/link";

export const metadata = {
  title: "Documentation — DRIP",
  description:
    "DRIP documentation — AI research intelligence on Solana. Learn how to use the agent, API, and integrations.",
};

/* ─── Reusable doc components ─── */

function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "tip" | "warn";
}) {
  const styles = {
    info: "border-soft-cyan/30 bg-soft-cyan/5",
    tip: "border-aquamarine/30 bg-aquamarine/5",
    warn: "border-amber-500/30 bg-amber-500/5",
  };
  const icons = { info: "💡", tip: "✅", warn: "⚠️" };
  return (
    <div
      className={`rounded-lg border-l-4 px-4 py-3 text-sm ${styles[type]}`}
    >
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-card border border-ocean-mist/10 bg-dark-elevated p-5 transition-colors hover:border-icy-aqua/20"
    >
      <h3 className="text-base font-semibold text-white group-hover:text-icy-aqua">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-blue-slate">
        {description}
      </p>
    </Link>
  );
}

/* ─── Page ─── */

export default function DocsWelcome() {
  return (
    <article className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          AI Research Intelligence • Solana
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
          Research-driven AI Intelligence for Solana
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ocean-mist">
          DRIP helps researchers, traders, and developers make smarter decisions
          with real-time data, social intelligence, on-chain signals, and
          structured AI-driven research. Use the{" "}
          <strong className="text-white">DRIP Agent</strong> at{" "}
          <a href="/agent" className="text-icy-aqua hover:underline">
            drip.surf/agent
          </a>
          , or integrate via the x402 API.
        </p>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs/quickstart"
          className="rounded-button bg-gradient-to-r from-soft-cyan to-aquamarine px-5 py-2.5 text-sm font-semibold text-dark-deepest transition-shadow hover:shadow-glow-md"
        >
          Get Started
        </Link>
        <Link
          href="/agent"
          className="rounded-button border border-ocean-mist/20 px-5 py-2.5 text-sm font-medium text-ocean-mist transition-colors hover:border-icy-aqua/30 hover:text-icy-aqua"
        >
          Try Agent
        </Link>
        <Link
          href="/docs/api"
          className="rounded-button border border-ocean-mist/20 px-5 py-2.5 text-sm font-medium text-ocean-mist transition-colors hover:border-icy-aqua/30 hover:text-icy-aqua"
        >
          API Reference
        </Link>
        <a
          href="https://drip.surf"
          className="rounded-button border border-ocean-mist/20 px-5 py-2.5 text-sm font-medium text-ocean-mist transition-colors hover:border-icy-aqua/30 hover:text-icy-aqua"
        >
          Visit Website
        </a>
      </div>

      {/* What is DRIP */}
      <section>
        <h2 className="font-heading text-xl font-bold text-white">
          What is DRIP?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ocean-mist">
          DRIP is an <strong className="text-white">AI-powered research intelligence agent</strong>{" "}
          designed to analyze companies, people, social signals, and on-chain
          data in real time. Instead of hype or speculation, DRIP focuses on
          structured research, actionable insights, and transparency.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ocean-mist">
          Every research query delivers:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-ocean-mist">Company Research</strong> —
            industry, funding, tech stack, key people
          </li>
          <li>
            <strong className="text-ocean-mist">Person Enrichment</strong> —
            roles, contacts, social profiles
          </li>
          <li>
            <strong className="text-ocean-mist">Social Intelligence</strong> —
            sentiment, trends, narrative analysis
          </li>
          <li>
            <strong className="text-ocean-mist">Market Data</strong> — live
            token prices, volume, on-chain metrics
          </li>
          <li>
            <strong className="text-ocean-mist">AI Insights</strong> —
            confidence scores, signal interpretation
          </li>
        </ul>
      </section>

      {/* Where DRIP Runs */}
      <section>
        <h2 className="font-heading text-xl font-bold text-white">
          Where DRIP Runs
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ocean-mist">
          DRIP is not a single tool — it&apos;s an intelligence layer that
          operates across multiple surfaces:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Platform</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              {[
                ["🤖 Web Agent", "Chat at drip.surf/agent — research, enrichment, intelligence"],
                ["⌨️ CLI Agent", "Terminal tool via npx drip-agent — research from command line"],
                ["🔗 x402 API", "REST APIs with pay-per-request via x402 protocol"],
                ["📊 Market Feed", "Live token data, sentiment, discovery feed"],
                ["🧠 AI Brain", "Synthesizes signals into structured research briefs"],
                ["🔄 Buyback Engine", "Autonomous token buyback loop from revenue"],
              ].map(([platform, desc]) => (
                <tr
                  key={platform}
                  className="border-b border-ocean-mist/5"
                >
                  <td className="py-2.5 pr-4 font-medium text-soft-cyan whitespace-nowrap">
                    {platform}
                  </td>
                  <td className="py-2.5">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="font-heading text-xl font-bold text-white">
          Explore the Docs
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FeatureCard
            title="🚀 Quickstart"
            description="Get your first research query running in 30 seconds. CLI and Web Agent guides."
            href="/docs/quickstart"
          />
          <FeatureCard
            title="🤖 DRIP Agent"
            description="Chat with the AI agent for company research, person enrichment, and market intelligence."
            href="/docs/agent/web"
          />
          <FeatureCard
            title="📡 API Reference"
            description="x402 API endpoints for company, person, social, sentiment, and market data."
            href="/docs/api"
          />
          <FeatureCard
            title="🔌 Integrations"
            description="AgentCash, Solana wallets, PumpFun, DexScreener, OpenRouter, and more."
            href="/docs/integrations/agentcash"
          />
          <FeatureCard
            title="🪙 $DRIP Token"
            description="Token utility, buyback & burn mechanics, and tokenomics."
            href="/docs/token"
          />
          <FeatureCard
            title="❓ FAQ"
            description="Common questions about DRIP, pricing, data accuracy, and more."
            href="/docs/faq"
          />
        </div>
      </section>

      <Callout type="info">
        DRIP is designed as an intelligence layer — not just a signal bot. Every
        output includes sources, confidence levels, and structured reasoning.
      </Callout>
    </article>
  );
}
