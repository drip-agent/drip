import {
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Tokenomics — DRIP Docs",
};

export default function TokenomicsPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Token
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Tokenomics
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          $DRIP has a simple, transparent economic model: fair launch, no team
          allocation, usage-driven deflation. Here&apos;s the full picture.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="supply">Supply</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Property</th>
                <th className="pb-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Launch Platform
                </td>
                <td className="py-2.5">PumpFun (bonding curve)</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Team Allocation
                </td>
                <td className="py-2.5">None — 100% fair launch</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Vesting
                </td>
                <td className="py-2.5">None — all tokens are liquid</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Supply Direction
                </td>
                <td className="py-2.5">Deflationary (buyback &amp; burn)</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Network
                </td>
                <td className="py-2.5">Solana (SPL token)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="revenue-model">Revenue Model</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          DRIP generates revenue from every API query via x402 micropayments:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Query Type</th>
                <th className="pb-2 font-medium">Cost</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4">Company Research</td>
                <td className="py-2.5 font-mono text-soft-cyan">~$0.05</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4">Person Enrichment</td>
                <td className="py-2.5 font-mono text-soft-cyan">~$0.05</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4">Social Intelligence</td>
                <td className="py-2.5 font-mono text-soft-cyan">~$0.05</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4">Sentiment Analysis</td>
                <td className="py-2.5 font-mono text-soft-cyan">~$0.03</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4">Market Data</td>
                <td className="py-2.5 font-mono text-soft-cyan">~$0.02</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4">AI Brain Query</td>
                <td className="py-2.5 font-mono text-soft-cyan">~$0.05</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="deflationary">Deflationary Mechanics</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Every query contributes to deflation:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            User pays ~$0.05 for a research query.
          </li>
          <li>
            Revenue accumulates in the treasury.
          </li>
          <li>
            At $10 threshold, the buyback engine buys $DRIP on the open market.
          </li>
          <li>
            Purchased tokens are burned (permanently destroyed).
          </li>
          <li>
            Total supply decreases — the more people use DRIP, the smaller the
            supply gets.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="use-cases">Use Cases</H2>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Payment utility</strong> — query
            revenue drives the buyback engine
          </li>
          <li>
            <strong className="text-white">Deflationary asset</strong> — supply
            reduces with every burn cycle
          </li>
          <li>
            <strong className="text-white">Governance-free</strong> — no voting,
            no proposals, no committees. The token&apos;s value is tied to usage,
            not politics.
          </li>
        </ul>
      </section>

      <Callout type="info">
        $DRIP&apos;s economics are simple by design. No complex staking
        mechanisms, no emissions schedule, no inflationary rewards. Revenue goes
        in, tokens come out (and get burned).
      </Callout>

      <DocNav
        prev={{ label: "Buyback & Burn", href: "/docs/token/buyback" }}
        next={{ label: "FAQ", href: "/docs/faq" }}
      />
    </article>
  );
}
