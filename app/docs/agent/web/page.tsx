import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Web Agent — DRIP Docs",
};

export default function WebAgentPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Agent
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Web Agent
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          The DRIP web agent is a conversational research interface at{" "}
          <Code>drip.surf/agent</Code>. Ask it anything — company research,
          person enrichment, market intelligence — and it handles data
          collection, analysis, and synthesis in real time.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="getting-started">Getting Started</H2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            Navigate to{" "}
            <strong className="text-white">drip.surf/agent</strong> in your
            browser.
          </li>
          <li>
            Click <strong className="text-white">Connect Wallet</strong> to link
            your Solana wallet (Phantom, Solflare, or Backpack).
          </li>
          <li>
            Type a query in the chat input and press Enter.
          </li>
          <li>
            The agent processes your request, deducts a micropayment via x402,
            and returns structured research.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="example-queries">Example Queries</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          The agent understands natural language. Here are queries that work
          well:
        </p>

        <div className="space-y-3">
          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>Company Research</H3>
            <CodeBlock lang="text">
              {`Research anthropic.com
Tell me about Stripe — funding, team size, tech stack
What does Vercel do?`}
            </CodeBlock>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>Person Enrichment</H3>
            <CodeBlock lang="text">
              {`Enrich dario@anthropic.com
Who is the CEO of OpenAI?
Find LinkedIn for satya nadella`}
            </CodeBlock>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>Social Intelligence</H3>
            <CodeBlock lang="text">
              {`What's the sentiment on Solana?
Show me trending crypto narratives
What are people saying about $DRIP?`}
            </CodeBlock>
          </div>

          <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
            <H3>Market Data</H3>
            <CodeBlock lang="text">
              {`Price of SOL
Show me $DRIP market data
What's the 24h volume on Jupiter?`}
            </CodeBlock>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="interface">Agent Interface</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          The web agent interface consists of:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Chat panel</strong> — conversation
            thread with the agent. Research results appear inline with
            formatting, tables, and confidence scores.
          </li>
          <li>
            <strong className="text-white">Wallet indicator</strong> — shows
            connected wallet address and USDC balance.
          </li>
          <li>
            <strong className="text-white">Tool activity</strong> — real-time
            display of which data sources the agent is querying during
            processing.
          </li>
          <li>
            <strong className="text-white">Cost display</strong> — each response
            shows the micropayment amount deducted.
          </li>
        </ul>
      </section>

      <Callout type="tip">
        The agent remembers context within a session. You can ask follow-up
        questions like &ldquo;What about their competitors?&rdquo; after a
        company research query.
      </Callout>

      <DocNav
        prev={{ label: "How It Works", href: "/docs/how-it-works" }}
        next={{ label: "CLI Agent", href: "/docs/agent/cli" }}
      />
    </article>
  );
}
