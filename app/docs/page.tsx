import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassPanel } from "@/components/ui/glass-panel";

export const metadata = {
  title: "Docs — DRIP",
  description: "Learn how to use DRIP agent for company research and people enrichment.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-ocean-mist/10 bg-dark-deepest/80 p-4 font-mono text-sm leading-relaxed text-soft-cyan">
      {children}
    </pre>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-b border-ocean-mist/10 pb-2 font-heading text-xl font-bold text-icy-aqua"
    >
      {children}
    </h2>
  );
}

export default function DocsPage() {
  return (
    <>
      <NavBar />
      <main className="pt-24">
        <Section spacing="spacious">
          <Container size="narrow">
            {/* Header */}
            <h1 className="font-heading text-3xl font-bold text-icy-aqua sm:text-4xl">
              Documentation
            </h1>
            <p className="mt-2 text-ocean-mist">
              Everything you need to use DRIP for research intelligence.
            </p>

            {/* Table of contents */}
            <GlassPanel className="mt-8">
              <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-blue-slate">
                On this page
              </h3>
              <nav className="space-y-1 text-sm">
                {[
                  ["what-is-drip", "What is DRIP?"],
                  ["quickstart", "Quickstart"],
                  ["cli", "CLI Reference"],
                  ["web-agent", "Web Agent"],
                  ["commands", "Commands"],
                  ["pricing", "Pricing & Payments"],
                  ["wallet-setup", "Wallet Setup"],
                  ["programmatic", "Programmatic Usage"],
                  ["token", "$DRIP Token"],
                  ["faq", "FAQ"],
                ].map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-ocean-mist transition-colors hover:text-icy-aqua"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </GlassPanel>

            {/* Content */}
            <div className="mt-12 space-y-12 text-sm leading-relaxed text-ocean-mist">
              {/* What is DRIP */}
              <section>
                <SectionHeading id="what-is-drip">What is DRIP?</SectionHeading>
                <div className="mt-4 space-y-3">
                  <p>
                    DRIP is an autonomous research intelligence platform. It
                    provides instant company research and people enrichment
                    through two interfaces:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-blue-slate">
                    <li>
                      <strong className="text-ocean-mist">Web Agent</strong> —
                      chat-based interface at{" "}
                      <a href="/agent" className="text-icy-aqua hover:underline">
                        drip.surf/agent
                      </a>
                    </li>
                    <li>
                      <strong className="text-ocean-mist">CLI Tool</strong> —
                      terminal-based tool via{" "}
                      <code className="rounded bg-dark-deepest px-1.5 py-0.5 font-mono text-soft-cyan">
                        npx drip-agent
                      </code>
                    </li>
                  </ul>
                  <p>
                    Queries cost ~$0.05 each, paid via AgentCash micropayments on
                    the Solana blockchain. No subscriptions. No API keys. Pay per
                    use.
                  </p>
                </div>
              </section>

              {/* Quickstart */}
              <section>
                <SectionHeading id="quickstart">Quickstart</SectionHeading>
                <div className="mt-4 space-y-4">
                  <p>Get research results in 30 seconds:</p>
                  <CodeBlock>{`# Research a company
npx drip-agent research anthropic.com

# Enrich a person
npx drip-agent enrich dario@anthropic.com

# Interactive mode (no args)
npx drip-agent`}</CodeBlock>
                  <p>
                    That&apos;s it. No install needed — npx downloads and runs it
                    directly.
                  </p>
                </div>
              </section>

              {/* CLI Reference */}
              <section>
                <SectionHeading id="cli">CLI Reference</SectionHeading>
                <div className="mt-4 space-y-4">
                  <p>
                    The drip-agent CLI is published on npm and runs with Node.js
                    18+.
                  </p>

                  <h3 className="font-heading text-base font-semibold text-soft-cyan">
                    Installation
                  </h3>
                  <CodeBlock>{`# Run directly (recommended)
npx drip-agent

# Or install globally
npm install -g drip-agent
drip-agent --help`}</CodeBlock>

                  <h3 className="font-heading text-base font-semibold text-soft-cyan">
                    Available Commands
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-ocean-mist/10 text-blue-slate">
                          <th className="pb-2 pr-4 font-medium">Command</th>
                          <th className="pb-2 pr-4 font-medium">Description</th>
                          <th className="pb-2 font-medium">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="text-ocean-mist">
                        <tr className="border-b border-ocean-mist/5">
                          <td className="py-2 pr-4 font-mono text-soft-cyan">
                            research &lt;domain&gt;
                          </td>
                          <td className="py-2 pr-4">
                            Company research by domain or name
                          </td>
                          <td className="py-2">~$0.05</td>
                        </tr>
                        <tr className="border-b border-ocean-mist/5">
                          <td className="py-2 pr-4 font-mono text-soft-cyan">
                            enrich &lt;email|url&gt;
                          </td>
                          <td className="py-2 pr-4">
                            Person enrichment by email or LinkedIn
                          </td>
                          <td className="py-2">~$0.05</td>
                        </tr>
                        <tr className="border-b border-ocean-mist/5">
                          <td className="py-2 pr-4 font-mono text-soft-cyan">
                            balance
                          </td>
                          <td className="py-2 pr-4">Check wallet balance</td>
                          <td className="py-2">Free</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-mono text-soft-cyan">
                            setup [code]
                          </td>
                          <td className="py-2 pr-4">
                            Set up AgentCash wallet
                          </td>
                          <td className="py-2">Free</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Web Agent */}
              <section>
                <SectionHeading id="web-agent">Web Agent</SectionHeading>
                <div className="mt-4 space-y-3">
                  <p>
                    The web agent at{" "}
                    <a href="/agent" className="text-icy-aqua hover:underline">
                      drip.surf/agent
                    </a>{" "}
                    provides a chat interface to DRIP. You can:
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-blue-slate">
                    <li>Ask natural language questions about companies</li>
                    <li>
                      Use quick-action buttons (Research Anthropic, Look up
                      Coinbase)
                    </li>
                    <li>Connect your Solana wallet for paid queries</li>
                    <li>View the live activity feed</li>
                  </ul>
                  <p>
                    The agent uses AI to understand your intent and automatically
                    calls the right research tools.
                  </p>
                </div>
              </section>

              {/* Commands in detail */}
              <section>
                <SectionHeading id="commands">Commands</SectionHeading>
                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="font-heading text-base font-semibold text-soft-cyan">
                      🔍 research
                    </h3>
                    <p className="mt-1 mb-3">
                      Look up company information by domain name. Returns
                      industry, founding year, employee count, funding, tech
                      stack, and more.
                    </p>
                    <CodeBlock>{`# Text output (default)
npx drip-agent research stripe.com

# JSON output (for scripting)
npx drip-agent research stripe.com -f json

# Markdown output
npx drip-agent research stripe.com -f markdown`}</CodeBlock>
                    <p className="mt-2 text-xs text-blue-slate">
                      Data sourced from StableEnrich via AgentCash payments.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-semibold text-soft-cyan">
                      👤 enrich
                    </h3>
                    <p className="mt-1 mb-3">
                      Look up a person by email address or LinkedIn URL. Returns
                      name, title, company, location, and employment history.
                    </p>
                    <CodeBlock>{`# By email
npx drip-agent enrich satya@microsoft.com

# By LinkedIn URL
npx drip-agent enrich https://linkedin.com/in/satyanadella

# JSON output
npx drip-agent enrich satya@microsoft.com -f json`}</CodeBlock>
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-semibold text-soft-cyan">
                      💰 balance
                    </h3>
                    <p className="mt-1 mb-3">
                      Check your AgentCash wallet balance across all chains.
                    </p>
                    <CodeBlock>{`npx drip-agent balance

# Output:
#   💧 DRIP Wallet
#   Address:  0x...
#   Balance:  $8.80 USDC
#   Deposit:  https://agentcash.dev/deposit/...`}</CodeBlock>
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-semibold text-soft-cyan">
                      ⚙️ setup
                    </h3>
                    <p className="mt-1 mb-3">
                      Set up an AgentCash wallet for paid queries. Optionally
                      pass an invite code.
                    </p>
                    <CodeBlock>{`# Interactive setup
npx drip-agent setup

# With invite code
npx drip-agent setup AC-XXXX-XXXX-XXXX-XXXX`}</CodeBlock>
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section>
                <SectionHeading id="pricing">
                  Pricing &amp; Payments
                </SectionHeading>
                <div className="mt-4 space-y-3">
                  <p>
                    DRIP uses pay-per-query pricing. No subscriptions, no monthly
                    fees.
                  </p>
                  <GlassPanel>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-icy-aqua">
                          ~$0.05
                        </div>
                        <div className="mt-1 text-xs text-blue-slate">
                          per research query
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-icy-aqua">
                          ~$0.05
                        </div>
                        <div className="mt-1 text-xs text-blue-slate">
                          per enrichment query
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                  <p>
                    Payments are processed via{" "}
                    <strong className="text-soft-cyan">AgentCash</strong> — a
                    micropayment layer for AI agents. Payments settle instantly on
                    the Solana blockchain in USDC.
                  </p>
                  <p>
                    The agent has its own wallet and pays data providers
                    automatically. You fund the wallet, the agent handles the
                    rest.
                  </p>
                </div>
              </section>

              {/* Wallet Setup */}
              <section>
                <SectionHeading id="wallet-setup">Wallet Setup</SectionHeading>
                <div className="mt-4 space-y-4">
                  <p>To use paid features, set up an AgentCash wallet:</p>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-icy-aqua/30 font-mono text-xs text-icy-aqua">
                        1
                      </span>
                      <p>
                        Run{" "}
                        <code className="rounded bg-dark-deepest px-1.5 py-0.5 font-mono text-soft-cyan">
                          npx drip-agent setup
                        </code>{" "}
                        to create a wallet
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-icy-aqua/30 font-mono text-xs text-icy-aqua">
                        2
                      </span>
                      <p>
                        Fund your wallet with USDC on Solana using the deposit
                        link
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-icy-aqua/30 font-mono text-xs text-icy-aqua">
                        3
                      </span>
                      <p>
                        Start researching —{" "}
                        <code className="rounded bg-dark-deepest px-1.5 py-0.5 font-mono text-soft-cyan">
                          npx drip-agent research stripe.com
                        </code>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-blue-slate">
                    Wallet credentials are stored locally at
                    ~/.agentcash/wallet.json
                  </p>
                </div>
              </section>

              {/* Programmatic */}
              <section>
                <SectionHeading id="programmatic">
                  Programmatic Usage
                </SectionHeading>
                <div className="mt-4 space-y-4">
                  <p>
                    drip-agent can be imported as a library in your Node.js
                    projects:
                  </p>
                  <CodeBlock>{`import { companyResearch, personEnrich } from "drip-agent";

// Company research
const company = await companyResearch("openai.com");
console.log(company.data.organization.name);
// → "OpenAI"

// Person enrichment
const person = await personEnrich("sam@openai.com");
console.log(person.data.person.title);
// → "CEO"`}</CodeBlock>
                  <p>
                    Install as a dependency:
                  </p>
                  <CodeBlock>{`npm install drip-agent`}</CodeBlock>
                </div>
              </section>

              {/* Token */}
              <section>
                <SectionHeading id="token">$DRIP Token</SectionHeading>
                <div className="mt-4 space-y-3">
                  <p>
                    $DRIP is the utility token that powers the DRIP ecosystem on
                    Solana.
                  </p>
                  <h3 className="font-heading text-base font-semibold text-soft-cyan">
                    Tokenomics
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-blue-slate">
                    <li>
                      <strong className="text-ocean-mist">Payment gate</strong>{" "}
                      — hold $DRIP to access the research agent
                    </li>
                    <li>
                      <strong className="text-ocean-mist">Buyback & burn</strong>{" "}
                      — agent revenue buys back and burns $DRIP automatically
                    </li>
                    <li>
                      <strong className="text-ocean-mist">
                        Usage = scarcity
                      </strong>{" "}
                      — every query makes $DRIP scarcer
                    </li>
                  </ul>

                  <h3 className="mt-4 font-heading text-base font-semibold text-soft-cyan">
                    Where to Buy
                  </h3>
                  <p>
                    $DRIP will be available on PumpFun (Solana). Contract address
                    will be published on this page and announced on Twitter.
                  </p>
                </div>
              </section>

              {/* FAQ */}
              <section>
                <SectionHeading id="faq">FAQ</SectionHeading>
                <div className="mt-4 space-y-5">
                  {[
                    [
                      "Is the data real or AI-generated?",
                      "Real. DRIP pulls from verified data providers (StableEnrich), not LLM hallucinations. The AI agent orchestrates queries and formats results, but the underlying data is sourced from real databases.",
                    ],
                    [
                      "Do I need a Solana wallet?",
                      "For the CLI: no wallet needed, payments happen through AgentCash. For the web agent: connecting a Solana wallet (Phantom, Solflare) is required for paid queries.",
                    ],
                    [
                      "How accurate is the data?",
                      "Data is sourced from professional-grade enrichment APIs. Accuracy is comparable to tools like Apollo or Clearbit. Always verify critical data independently.",
                    ],
                    [
                      "Can I use this for sales prospecting?",
                      "Yes. Company research and person enrichment are commonly used for sales intelligence, due diligence, and competitive analysis. Respect applicable data privacy laws.",
                    ],
                    [
                      "What happens if a query fails?",
                      "Failed queries are not charged. If the data provider returns no results, you won't be billed.",
                    ],
                    [
                      "Is there an API?",
                      "Not yet. Use the CLI with JSON output (-f json) for scripting, or import drip-agent as a Node.js library for programmatic access.",
                    ],
                  ].map(([q, a]) => (
                    <div key={q}>
                      <h3 className="font-heading text-base font-semibold text-soft-cyan">
                        {q}
                      </h3>
                      <p className="mt-1">{a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
