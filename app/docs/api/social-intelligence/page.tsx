import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Social Intelligence API — DRIP Docs",
};

export default function SocialIntelligenceAPIPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          API
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Social Intelligence API
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Analyze social signals for any topic, project, or token. Returns
          profiles, engagement metrics, trends, and narrative analysis across
          platforms.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="endpoint">Endpoint</H2>
        <CodeBlock lang="text">
          {`GET https://api.drip.surf/social`}
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
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">query</td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5 pr-4 text-aquamarine">Yes</td>
                <td className="py-2.5">
                  Topic, project name, or token ticker (e.g.{" "}
                  <Code>Solana</Code>, <Code>$DRIP</Code>)
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  platform
                </td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5 pr-4 text-blue-slate">No</td>
                <td className="py-2.5">
                  Filter to a specific platform (<Code>twitter</Code>,{" "}
                  <Code>reddit</Code>, <Code>telegram</Code>). Defaults to all.
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
    "query": "Solana",
    "profiles": [
      {
        "platform": "twitter",
        "handle": "@solana",
        "followers": 2800000,
        "engagement": {
          "avgLikes": 1200,
          "avgReposts": 340,
          "avgReplies": 89
        }
      }
    ],
    "trends": [
      {
        "topic": "Solana DeFi TVL",
        "direction": "rising",
        "mentions24h": 4200,
        "sentiment": "positive"
      }
    ],
    "engagement": {
      "totalMentions24h": 18500,
      "uniqueAuthors": 6200,
      "avgSentiment": 0.62,
      "topHashtags": ["#Solana", "#SOL", "#DeFi"]
    }
  },
  "meta": {
    "sources": ["twitter", "reddit", "telegram"],
    "confidence": 0.88,
    "costUsd": 0.05,
    "durationMs": 2850
  }
}`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="examples">Examples</H2>
        <H3>curl</H3>
        <CodeBlock lang="bash" title="General social query">
          {`curl "https://api.drip.surf/social?query=Solana" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Twitter only">
          {`curl "https://api.drip.surf/social?query=%24DRIP&platform=twitter" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>

        <H3>SDK</H3>
        <CodeBlock lang="typescript" title="TypeScript">
          {`import { Drip } from "@drip/sdk";

const drip = new Drip({ wallet: "<your-wallet>" });

const social = await drip.social("Solana");
console.log(social.engagement.totalMentions24h); // 18500
console.log(social.trends[0].direction);          // "rising"

// Platform-specific
const twitterOnly = await drip.social("$DRIP", {
  platform: "twitter",
});`}
        </CodeBlock>
      </section>

      <Callout type="info">
        Social data is collected in real time. Results reflect the past 24 hours
        unless otherwise noted in the response.
      </Callout>

      <DocNav
        prev={{
          label: "Person Enrichment",
          href: "/docs/api/person-enrichment",
        }}
        next={{ label: "Sentiment", href: "/docs/api/sentiment" }}
      />
    </article>
  );
}
