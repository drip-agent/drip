import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "PumpFun Integration — DRIP Docs",
};

export default function PumpFunPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Integrations
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          PumpFun Integration
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          The <strong className="text-white">$DRIP</strong> token was launched
          on PumpFun — a fair-launch platform on Solana with a bonding curve
          mechanism. No presale, no team allocation.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="contract">Contract Address</H2>
        <CodeBlock lang="text" title="$DRIP Token Address">
          {`DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump`}
        </CodeBlock>
        <Callout type="warn">
          Always verify the contract address before trading. The address above
          is the only official $DRIP token.
        </Callout>
      </section>

      <section className="space-y-4">
        <H2 id="pumpfun-link">PumpFun Page</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          View the token on PumpFun:
        </p>
        <CodeBlock lang="text">
          {`https://pump.fun/coin/DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="how-to-buy">How to Buy $DRIP</H2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            Open a Solana wallet (Phantom, Solflare, or Backpack).
          </li>
          <li>
            Fund your wallet with SOL.
          </li>
          <li>
            Navigate to the PumpFun page linked above.
          </li>
          <li>
            Enter the amount of SOL you want to swap for $DRIP.
          </li>
          <li>
            Confirm the transaction in your wallet.
          </li>
        </ol>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Alternatively, you can trade $DRIP on any Solana DEX (Jupiter,
          Raydium) by pasting the contract address.
        </p>
      </section>

      <section className="space-y-4">
        <H2 id="bonding-curve">Bonding Curve</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          PumpFun uses a bonding curve for price discovery. The price increases
          as more tokens are purchased and decreases as tokens are sold. This
          creates a transparent, market-driven pricing mechanism without
          order books or market makers.
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Fair launch</strong> — no pre-mine,
            no insider allocation
          </li>
          <li>
            <strong className="text-white">Instant liquidity</strong> — buy or
            sell at any time via the curve
          </li>
          <li>
            <strong className="text-white">Transparent pricing</strong> — price
            is a function of supply, visible on-chain
          </li>
        </ul>
      </section>

      <DocNav
        prev={{ label: "Wallets", href: "/docs/integrations/wallets" }}
        next={{ label: "DexScreener", href: "/docs/integrations/dexscreener" }}
      />
    </article>
  );
}
