import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "CLI Agent — DRIP Docs",
};

export default function CLIAgentPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Agent
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          CLI Agent
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Run DRIP research queries from your terminal. No browser, no GUI —
          structured intelligence output piped wherever you need it.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="installation">Installation</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Use <Code>npx</Code> for one-off queries (no install needed), or
          install globally for repeated use:
        </p>
        <CodeBlock lang="bash" title="One-off (no install)">
          {`npx drip-agent research anthropic.com`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Global install">
          {`npm install -g drip-agent`}
        </CodeBlock>
        <p className="text-sm leading-relaxed text-ocean-mist">
          After global install, use <Code>drip-agent</Code> directly:
        </p>
        <CodeBlock lang="bash">
          {`drip-agent research stripe.com`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="commands">Commands</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Command</th>
                <th className="pb-2 pr-4 font-medium">Arguments</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  research
                </td>
                <td className="py-2.5 pr-4">
                  <Code>{"<domain>"}</Code>
                </td>
                <td className="py-2.5">
                  Full company research — industry, funding, tech stack, key
                  people
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  enrich
                </td>
                <td className="py-2.5 pr-4">
                  <Code>{"<email|url>"}</Code>
                </td>
                <td className="py-2.5">
                  Person enrichment — name, title, company, social profiles
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  balance
                </td>
                <td className="py-2.5 pr-4">—</td>
                <td className="py-2.5">
                  Check your wallet balance and recent DRIP transactions
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  setup
                </td>
                <td className="py-2.5 pr-4">—</td>
                <td className="py-2.5">
                  Configure wallet and preferences
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="flags">Flags</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Flag</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  -f json
                </td>
                <td className="py-2.5">
                  Output as JSON (default is human-readable)
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  --verbose
                </td>
                <td className="py-2.5">
                  Show data source queries and timing details
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  --help
                </td>
                <td className="py-2.5">Show help and available commands</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="examples">Examples</H2>
        <CodeBlock lang="bash" title="Company research with JSON output">
          {`drip-agent research vercel.com -f json`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Person enrichment">
          {`drip-agent enrich satya@microsoft.com`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Verbose output for debugging">
          {`drip-agent research openai.com --verbose`}
        </CodeBlock>
      </section>

      <Callout type="info">
        The CLI uses the same x402 payment flow as the web agent. On first run,{" "}
        <Code>drip-agent setup</Code> will prompt you to configure your Solana
        wallet.
      </Callout>

      <DocNav
        prev={{ label: "Web Agent", href: "/docs/agent/web" }}
        next={{ label: "Capabilities", href: "/docs/agent/capabilities" }}
      />
    </article>
  );
}
