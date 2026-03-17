import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  EndpointCard,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "API Reference — DRIP Docs",
};

export default function APIOverviewPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          API
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          API Reference
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          The DRIP API provides programmatic access to all research
          capabilities. No API keys — authentication and payment happen via the
          x402 protocol on Solana.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="base-url">Base URL</H2>
        <CodeBlock lang="text">
          {`https://api.drip.surf`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="authentication">Authentication</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          DRIP uses the <strong className="text-white">x402</strong> payment
          protocol instead of API keys. Every request follows this flow:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            Send a standard HTTP request to any endpoint.
          </li>
          <li>
            Receive a <Code>402 Payment Required</Code> response with payment
            details (amount, recipient, token).
          </li>
          <li>
            Submit the payment on Solana using USDC.
          </li>
          <li>
            Retry the request with the <Code>X-Payment-Proof</Code> header
            containing the transaction signature.
          </li>
          <li>
            Receive the data.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="example">Example — curl</H2>
        <CodeBlock lang="bash" title="Step 1: Initial request">
          {`curl -i https://api.drip.surf/research?domain=anthropic.com

# HTTP/1.1 402 Payment Required
# X-Payment-Amount: 0.05
# X-Payment-Token: USDC
# X-Payment-Recipient: <drip-wallet-address>`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Step 2: Retry with payment proof">
          {`curl https://api.drip.surf/research?domain=anthropic.com \\
  -H "X-Payment-Proof: <solana-tx-signature>"`}
        </CodeBlock>
        <Callout type="tip">
          The SDK and CLI handle this flow automatically. You only need to manage
          payment proofs manually when using raw HTTP requests.
        </Callout>
      </section>

      <section className="space-y-4">
        <H2 id="endpoints">Endpoints</H2>
        <div className="space-y-3">
          <EndpointCard
            method="GET"
            path="/research"
            description="Full company research — industry, funding, tech stack, key people, and more."
            cost="~$0.05"
          />
          <EndpointCard
            method="GET"
            path="/enrich"
            description="Person enrichment — resolve an email or LinkedIn URL into a complete profile."
            cost="~$0.05"
          />
          <EndpointCard
            method="GET"
            path="/social"
            description="Social intelligence — sentiment, trends, and engagement data for any topic."
            cost="~$0.05"
          />
          <EndpointCard
            method="GET"
            path="/sentiment"
            description="Sentiment analysis — positive/negative/neutral scoring for tokens or topics."
            cost="~$0.03"
          />
          <EndpointCard
            method="GET"
            path="/market"
            description="Live market data — price, volume, liquidity, and price changes for any token."
            cost="~$0.02"
          />
          <EndpointCard
            method="GET"
            path="/brain"
            description="AI brain — free-form query processed by the AI reasoning engine with tool selection."
            cost="~$0.05"
          />
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="response-format">Response Format</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          All endpoints return JSON with a consistent envelope:
        </p>
        <CodeBlock lang="json" title="Response envelope">
          {`{
  "status": "success",
  "data": { ... },
  "meta": {
    "sources": ["source1", "source2"],
    "confidence": 0.92,
    "costUsd": 0.05,
    "durationMs": 2340
  }
}`}
        </CodeBlock>
      </section>

      <DocNav
        prev={{ label: "Capabilities", href: "/docs/agent/capabilities" }}
        next={{
          label: "Company Research",
          href: "/docs/api/company-research",
        }}
      />
    </article>
  );
}
