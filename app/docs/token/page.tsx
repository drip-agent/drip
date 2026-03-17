import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "$DRIP Token — DRIP Docs",
};

export default function TokenPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Token
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          $DRIP Token
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          $DRIP is the utility token powering the DRIP intelligence network on
          Solana. It&apos;s used for query payments and has a deflationary
          buyback-and-burn mechanism.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="contract">Contract Address</H2>
        <CodeBlock lang="text" title="$DRIP on Solana">
          {`DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump`}
        </CodeBlock>
        <Callout type="warn">
          Always verify this address before trading. This is the only official
          $DRIP token contract.
        </Callout>
      </section>

      <section className="space-y-4">
        <H2 id="utility">What $DRIP Is Used For</H2>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Query payments</strong> — revenue
            from x402 API calls feeds the buyback engine
          </li>
          <li>
            <strong className="text-white">Buyback &amp; burn</strong> —
            accumulated revenue is used to buy $DRIP from the open market and
            burn it, permanently reducing supply
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-ocean-mist">
          $DRIP is <strong className="text-white">not</strong> a governance
          token. There are no votes, proposals, or DAOs. It&apos;s a pure
          utility token with deflationary mechanics tied to real usage.
        </p>
      </section>

      <section className="space-y-4">
        <H2 id="where-to-buy">Where to Buy</H2>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">PumpFun</strong> — original launch
            platform with bonding curve
          </li>
          <li>
            <strong className="text-white">Jupiter</strong> — Solana&apos;s
            leading DEX aggregator
          </li>
          <li>
            <strong className="text-white">Raydium</strong> — AMM on Solana
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Paste the contract address above into any Solana DEX to find the
          trading pair.
        </p>
      </section>

      <section className="space-y-4">
        <H2 id="live-stats">Live Stats</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          View real-time $DRIP market data:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">DexScreener</strong> —{" "}
            <Code>
              dexscreener.com/solana/DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump
            </Code>
          </li>
          <li>
            <strong className="text-white">PumpFun</strong> —{" "}
            <Code>
              pump.fun/coin/DLo15YaCdSMQ6Ni3j9yHDgAHUzhm4sLFxYeTtwcvpump
            </Code>
          </li>
        </ul>
      </section>

      <DocNav
        prev={{ label: "Moltbook", href: "/docs/integrations/moltbook" }}
        next={{ label: "Buyback & Burn", href: "/docs/token/buyback" }}
      />
    </article>
  );
}
