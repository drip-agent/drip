import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Quickstart — DRIP Docs",
};

export default function QuickstartPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Getting Started
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Quickstart
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Get your first research query running in under 30 seconds. No API
          keys, no signup — just a Solana wallet and a question.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="cli">Option 1 — CLI (one command)</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Run a research query directly from your terminal. Nothing to install
          permanently — <Code>npx</Code> handles it.
        </p>
        <CodeBlock lang="bash" title="Terminal">
          {`npx drip-agent research anthropic.com`}
        </CodeBlock>
        <p className="text-sm leading-relaxed text-ocean-mist">
          That&apos;s it. DRIP will collect company data, analyze it, and return
          a structured research brief — industry, funding, tech stack, key
          people, and more.
        </p>
      </section>

      <section className="space-y-4">
        <H2 id="web-agent">Option 2 — Web Agent</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Open the agent in your browser and start a conversation:
        </p>
        <CodeBlock lang="text" title="URL">
          {`https://drip.surf/agent`}
        </CodeBlock>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Connect your Solana wallet, type a query like{" "}
          <Code>Research anthropic.com</Code>, and the agent handles the rest.
          Payments happen automatically via x402 micropayments — usually around
          $0.05 per query.
        </p>
      </section>

      <section className="space-y-4">
        <H2 id="sdk">Option 3 — SDK</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          For programmatic access, install the SDK and call endpoints directly:
        </p>
        <CodeBlock lang="bash" title="Install">
          {`npm install @drip/sdk`}
        </CodeBlock>
        <CodeBlock lang="typescript" title="example.ts">
          {`import { Drip } from "@drip/sdk";

const drip = new Drip({ wallet: "<your-solana-wallet>" });

const result = await drip.research("anthropic.com");
console.log(result.organization.name);    // "Anthropic"
console.log(result.organization.industry); // "Artificial Intelligence"`}
        </CodeBlock>
      </section>

      <Callout type="tip">
        No API key required. DRIP uses the x402 protocol — your wallet pays per
        request, and payment proof is attached automatically.
      </Callout>

      <section className="space-y-4">
        <H2 id="next-steps">What to Try Next</H2>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Person enrichment</strong> —{" "}
            <Code>npx drip-agent enrich dario@anthropic.com</Code>
          </li>
          <li>
            <strong className="text-white">Market data</strong> —{" "}
            <Code>npx drip-agent research solana --market</Code>
          </li>
          <li>
            <strong className="text-white">Social intelligence</strong> — ask
            the web agent &ldquo;What&apos;s the sentiment on Solana?&rdquo;
          </li>
        </ul>
      </section>

      <DocNav
        prev={{ label: "Welcome", href: "/docs" }}
        next={{ label: "How It Works", href: "/docs/how-it-works" }}
      />
    </article>
  );
}
