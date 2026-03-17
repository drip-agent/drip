import {
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Changelog — DRIP Docs",
};

export default function ChangelogPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Updates
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Changelog
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Version history for the DRIP platform — agent, API, integrations, and
          documentation.
        </p>
      </div>

      <section className="space-y-4">
        <div className="rounded-lg border border-aquamarine/20 bg-aquamarine/5 p-5">
          <div className="flex items-center gap-3">
            <span className="rounded bg-aquamarine/15 px-2 py-0.5 font-mono text-xs font-semibold text-aquamarine">
              v2.0
            </span>
            <span className="text-sm text-ocean-mist">March 2026</span>
            <span className="rounded bg-aquamarine/15 px-2 py-0.5 text-xs text-aquamarine">
              Latest
            </span>
          </div>
          <h3 className="mt-3 font-heading text-base font-semibold text-white">
            Complete Platform Redesign
          </h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-blue-slate">
            <li>Complete landing page redesign with 16 sections</li>
            <li>Developer documentation section with full API reference</li>
            <li>Comparison table — DRIP vs. traditional research tools</li>
            <li>Interactive roadmap timeline</li>
            <li>Partners and integrations section</li>
            <li>Expanded FAQ with detailed answers</li>
            <li>Articles and research blog</li>
            <li>
              Documentation for all integrations — AgentCash, PumpFun,
              DexScreener, OpenRouter, Moltbook
            </li>
            <li>Token documentation — $DRIP utility, buyback &amp; burn, tokenomics</li>
            <li>CLI agent reference with commands and flags</li>
            <li>Agent capabilities overview</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-5">
          <div className="flex items-center gap-3">
            <span className="rounded bg-ocean-mist/10 px-2 py-0.5 font-mono text-xs font-semibold text-ocean-mist">
              v1.0
            </span>
            <span className="text-sm text-ocean-mist">Q3 2025</span>
          </div>
          <h3 className="mt-3 font-heading text-base font-semibold text-white">
            Initial Launch
          </h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-blue-slate">
            <li>Web agent at drip.surf/agent — conversational research interface</li>
            <li>CLI tool — <Code>npx drip-agent</Code> for terminal-based research</li>
            <li>x402 API with company research, person enrichment, and market data endpoints</li>
            <li>$DRIP token launch on PumpFun</li>
            <li>Buyback &amp; burn engine — automated deflationary loop</li>
            <li>Solana wallet integration (Phantom, Solflare, Backpack)</li>
            <li>DexScreener integration for live market data</li>
            <li>OpenRouter integration for multi-model AI reasoning</li>
          </ul>
        </div>
      </section>

      <DocNav
        prev={{ label: "FAQ", href: "/docs/faq" }}
      />
    </article>
  );
}
