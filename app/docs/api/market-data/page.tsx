import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Market Data API — DRIP Docs",
};

export default function MarketDataAPIPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          API
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Market Data API
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Live token market data from on-chain sources and aggregators. Returns
          price, market cap, volume, liquidity, and price changes.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="endpoint">Endpoint</H2>
        <CodeBlock lang="text">
          {`GET https://api.drip.surf/market`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="parameters">Parameters</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Parameter</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Required</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">token</td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5 pr-4 text-aquamarine">Yes</td>
                <td className="py-2.5">
                  Token ticker or mint address (e.g. <Code>SOL</Code>,{" "}
                  <Code>DRIP</Code>)
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">chain</td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5 pr-4 text-blue-slate">No</td>
                <td className="py-2.5">
                  Blockchain to query. Defaults to <Code>solana</Code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="response">Response</H2>
        <CodeBlock lang="json" title="200 OK">
          {`{
  "status": "success",
  "data": {
    "token": "DRIP",
    "chain": "solana",
    "priceUsd": 0.00234,
    "marketCap": 234000,
    "volume24h": 45200,
    "priceChange24h": 12.5,
    "priceChange1h": 2.1,
    "priceChange7d": -3.4,
    "liquidity": {
      "usd": 89000,
      "base": 38000000,
      "quote": 89000
    },
    "pairAddress": "...",
    "dexUrl": "https://dexscreener.com/solana/..."
  },
  "meta": {
    "sources": ["dexscreener", "jupiter"],
    "confidence": 0.97,
    "costUsd": 0.02,
    "durationMs": 890
  }
}`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="examples">Examples</H2>
        <H3>curl</H3>
        <CodeBlock lang="bash" title="Token market data">
          {`curl "https://api.drip.surf/market?token=DRIP" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>
        <CodeBlock lang="bash" title="With explicit chain">
          {`curl "https://api.drip.surf/market?token=SOL&chain=solana" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>

        <H3>SDK</H3>
        <CodeBlock lang="typescript" title="TypeScript">
          {`import { Drip } from "@drip/sdk";

const drip = new Drip({ wallet: "<your-wallet>" });

const market = await drip.market("DRIP");
console.log(market.priceUsd);        // 0.00234
console.log(market.volume24h);       // 45200
console.log(market.priceChange24h);  // 12.5`}
        </CodeBlock>
      </section>

      <Callout type="info">
        Market data is sourced primarily from DexScreener and Jupiter. Price
        updates are near real-time, typically within 30 seconds of on-chain
        activity.
      </Callout>

      <DocNav
        prev={{ label: "Sentiment", href: "/docs/api/sentiment" }}
        next={{
          label: "AgentCash Integration",
          href: "/docs/integrations/agentcash",
        }}
      />
    </article>
  );
}
