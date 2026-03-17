import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Sentiment Analysis API — DRIP Docs",
};

export default function SentimentAPIPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          API
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Sentiment Analysis API
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Quantify market and social sentiment for any token or topic. Returns
          positive/negative/neutral scores, confidence levels, and trend
          direction.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="endpoint">Endpoint</H2>
        <CodeBlock lang="text">
          {`GET https://api.drip.surf/sentiment`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="parameters">Parameters</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Provide at least one of the following:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Parameter</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  ticker
                </td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5">
                  Token ticker symbol (e.g. <Code>SOL</Code>,{" "}
                  <Code>DRIP</Code>)
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">query</td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5">
                  Free-form text query (e.g. <Code>Solana DeFi</Code>)
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
    "subject": "SOL",
    "sentiment": {
      "positive": 0.58,
      "negative": 0.15,
      "neutral": 0.27
    },
    "confidence": 0.91,
    "trend": "improving",
    "sampleSize": 12400,
    "timeframe": "24h",
    "topPositiveSignals": [
      "DeFi TVL growth",
      "Developer activity increase",
      "Institutional adoption"
    ],
    "topNegativeSignals": [
      "Network congestion concerns",
      "Competing L1 narratives"
    ]
  },
  "meta": {
    "sources": ["twitter", "reddit", "news"],
    "confidence": 0.91,
    "costUsd": 0.03,
    "durationMs": 1940
  }
}`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="examples">Examples</H2>
        <H3>curl</H3>
        <CodeBlock lang="bash" title="By ticker">
          {`curl "https://api.drip.surf/sentiment?ticker=SOL" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>
        <CodeBlock lang="bash" title="By query">
          {`curl "https://api.drip.surf/sentiment?query=Solana%20DeFi" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>

        <H3>SDK</H3>
        <CodeBlock lang="typescript" title="TypeScript">
          {`import { Drip } from "@drip/sdk";

const drip = new Drip({ wallet: "<your-wallet>" });

const sentiment = await drip.sentiment({ ticker: "SOL" });
console.log(sentiment.sentiment.positive); // 0.58
console.log(sentiment.trend);              // "improving"

// Free-form query
const query = await drip.sentiment({ query: "Solana DeFi" });`}
        </CodeBlock>
      </section>

      <Callout type="info">
        Sentiment scores range from 0 to 1 and always sum to 1. The{" "}
        <Code>trend</Code> field indicates direction over the past 24 hours:{" "}
        <Code>improving</Code>, <Code>declining</Code>, or{" "}
        <Code>stable</Code>.
      </Callout>

      <DocNav
        prev={{
          label: "Social Intelligence",
          href: "/docs/api/social-intelligence",
        }}
        next={{ label: "Market Data", href: "/docs/api/market-data" }}
      />
    </article>
  );
}
