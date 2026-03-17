import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "How It Works — DRIP Docs",
};

export default function HowItWorksPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Architecture
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          How It Works
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP transforms a natural-language query into structured research
          through a five-step pipeline. Every step is transparent — you can see
          what data was collected, how it was analyzed, and what the AI
          concluded.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="pipeline">The Five-Step Pipeline</H2>

        <div className="space-y-6">
          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>1. User Request</H3>
            <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
              You submit a query — via the web agent, CLI, or API. It can be a
              company domain, a person&apos;s email, a token ticker, or a
              free-form question like &ldquo;Who are Anthropic&apos;s key
              investors?&rdquo;
            </p>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>2. Data Collection</H3>
            <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
              DRIP&apos;s tool layer fans out across multiple data sources —
              company databases, social platforms, on-chain data, market feeds —
              and collects raw signals in parallel. This typically takes 2–5
              seconds.
            </p>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>3. Analysis Engine</H3>
            <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
              Raw data is normalized, deduplicated, and scored. Conflicting
              signals are flagged. Confidence levels are assigned to each data
              point based on source reliability and recency.
            </p>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>4. AI Reasoning</H3>
            <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
              The AI brain (powered by{" "}
              <strong className="text-white">OpenRouter</strong>) synthesizes
              collected data into a coherent research brief. It selects the right
              model for the task, interprets signals, and generates structured
              output with citations.
            </p>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>5. Insight Delivery</H3>
            <p className="mt-2 text-sm leading-relaxed text-ocean-mist">
              The final research brief is returned to you — as a chat message,
              CLI output, or JSON response. Every claim includes its source and
              confidence level. No hallucinated data, no unsupported claims.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="x402-payments">Payment Model — x402</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          DRIP uses the{" "}
          <strong className="text-white">x402 payment protocol</strong> instead
          of traditional API keys or subscriptions. Here&apos;s how it works:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            You send a request to any DRIP endpoint.
          </li>
          <li>
            The server responds with{" "}
            <Code>HTTP 402 Payment Required</Code> and a payment
            instruction (amount, recipient wallet, token).
          </li>
          <li>
            Your wallet (or SDK) signs and submits the payment on Solana.
          </li>
          <li>
            You retry the original request with the payment proof attached.
          </li>
          <li>
            The server verifies proof and returns the data.
          </li>
        </ol>
        <Callout type="info">
          Typical cost: ~$0.02–$0.05 per query. No subscriptions, no rate limits
          based on tiers — you pay exactly for what you use.
        </Callout>
      </section>

      <section className="space-y-4">
        <H2 id="flow-diagram">Request Flow</H2>
        <CodeBlock lang="text" title="Simplified Flow">
          {`Client                   DRIP Server               Solana
  │                          │                        │
  ├── GET /research ────────▶│                        │
  │                          │                        │
  │◀── 402 Payment Required ─┤                        │
  │    (amount, wallet, token)                        │
  │                          │                        │
  ├── Sign + Submit ─────────────────────────────────▶│
  │                          │                        │
  │◀── Transaction Confirmed ─────────────────────────┤
  │                          │                        │
  ├── GET /research ────────▶│                        │
  │    (+ payment proof)     │                        │
  │                          ├── Collect data         │
  │                          ├── Analyze              │
  │                          ├── AI synthesis         │
  │◀── 200 Research Brief ───┤                        │
  │                          │                        │`}
        </CodeBlock>
      </section>

      <DocNav
        prev={{ label: "Quickstart", href: "/docs/quickstart" }}
        next={{ label: "Web Agent", href: "/docs/agent/web" }}
      />
    </article>
  );
}
