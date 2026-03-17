import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Solana Wallets — DRIP Docs",
};

export default function WalletsPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Integrations
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Solana Wallets
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP uses Solana wallets for x402 micropayments. Connect a wallet to
          the web agent, or configure one for the CLI and SDK.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="supported-wallets">Supported Wallets</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Wallet</th>
                <th className="pb-2 pr-4 font-medium">Web Agent</th>
                <th className="pb-2 pr-4 font-medium">CLI / SDK</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Phantom
                </td>
                <td className="py-2.5 pr-4 text-aquamarine">✓</td>
                <td className="py-2.5 pr-4 text-aquamarine">✓</td>
                <td className="py-2.5">Most popular Solana wallet</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Solflare
                </td>
                <td className="py-2.5 pr-4 text-aquamarine">✓</td>
                <td className="py-2.5 pr-4 text-aquamarine">✓</td>
                <td className="py-2.5">Advanced features, hardware wallet support</td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Backpack
                </td>
                <td className="py-2.5 pr-4 text-aquamarine">✓</td>
                <td className="py-2.5 pr-4 text-aquamarine">✓</td>
                <td className="py-2.5">Multi-chain wallet with xNFT support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="connect-web">Connecting in the Web Agent</H2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            Open <strong className="text-white">drip.surf/agent</strong> in
            your browser.
          </li>
          <li>
            Click the <strong className="text-white">Connect Wallet</strong>{" "}
            button in the top-right corner.
          </li>
          <li>
            Select your wallet from the list (Phantom, Solflare, or Backpack).
          </li>
          <li>
            Approve the connection in your wallet extension.
          </li>
          <li>
            Your wallet address and USDC balance will appear in the interface.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="connect-cli">Connecting in the CLI</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Run the setup command to configure your wallet for CLI use:
        </p>
        <CodeBlock lang="bash" title="Terminal">
          {`drip-agent setup`}
        </CodeBlock>
        <p className="text-sm leading-relaxed text-ocean-mist">
          The setup wizard will prompt for your wallet&apos;s keypair path or
          let you paste a private key. Keys are stored locally and never
          transmitted.
        </p>
      </section>

      <section className="space-y-4">
        <H2 id="how-payments-work">How Payments Work</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          DRIP uses x402 micropayments — small USDC transfers on Solana for each
          query:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Currency:</strong> USDC on Solana
          </li>
          <li>
            <strong className="text-white">Typical cost:</strong> $0.02–$0.05
            per query
          </li>
          <li>
            <strong className="text-white">Transaction fee:</strong> Standard
            Solana tx fee (~$0.0005)
          </li>
          <li>
            <strong className="text-white">Speed:</strong> Near-instant
            confirmation (~400ms)
          </li>
        </ul>
        <Callout type="info">
          Make sure your wallet has USDC (SPL token) on Solana, not native SOL.
          You&apos;ll also need a small amount of SOL for transaction fees.
        </Callout>
      </section>

      <DocNav
        prev={{
          label: "AgentCash",
          href: "/docs/integrations/agentcash",
        }}
        next={{ label: "PumpFun", href: "/docs/integrations/pumpfun" }}
      />
    </article>
  );
}
