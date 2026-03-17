import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Buyback & Burn — DRIP Docs",
};

export default function BuybackBurnPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Token
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Buyback &amp; Burn
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP operates an autonomous buyback loop that uses API revenue to
          purchase and permanently burn $DRIP tokens. Every query reduces the
          total supply.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="how-it-works">How the Buyback Loop Works</H2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Revenue collection</strong> — users
            pay for queries via x402 micropayments (USDC on Solana).
          </li>
          <li>
            <strong className="text-white">Accumulation</strong> — revenue
            accumulates in the DRIP treasury wallet.
          </li>
          <li>
            <strong className="text-white">Threshold trigger</strong> — when
            accumulated revenue reaches <strong className="text-white">$10</strong>,
            the buyback engine activates.
          </li>
          <li>
            <strong className="text-white">Market buy</strong> — the engine
            buys $DRIP from the open market (Jupiter / Raydium) at current
            market price.
          </li>
          <li>
            <strong className="text-white">Burn</strong> — purchased tokens are
            sent to a burn address, permanently removing them from circulation.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="flow">Revenue → Burn Flow</H2>
        <CodeBlock lang="text" title="Buyback cycle">
          {`User Query ($0.05 USDC)
    │
    ▼
Treasury Wallet
    │
    ├── Accumulates until ≥ $10
    │
    ▼
Buy $DRIP (open market)
    │
    ▼
Burn Address (permanent removal)
    │
    ▼
Supply Decreases`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="details">Key Details</H2>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Threshold:</strong> $10 accumulated
            before a buyback triggers
          </li>
          <li>
            <strong className="text-white">Execution:</strong> automated — no
            governance vote, no manual intervention
          </li>
          <li>
            <strong className="text-white">Transparency:</strong> all buyback
            and burn transactions are on-chain and publicly verifiable
          </li>
          <li>
            <strong className="text-white">Frequency:</strong> depends on query
            volume — more usage means more frequent burns
          </li>
          <li>
            <strong className="text-white">Burn address:</strong> tokens are
            sent to Solana&apos;s standard burn address (irreversible)
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <H2 id="why">Why Buyback &amp; Burn?</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          The buyback loop creates a direct link between DRIP usage and token
          value. As more people use DRIP for research:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>More revenue flows to the treasury</li>
          <li>More frequent buybacks occur</li>
          <li>Total supply decreases</li>
          <li>Each remaining token represents a larger share of the network</li>
        </ul>
        <p className="text-sm leading-relaxed text-ocean-mist">
          This is a mechanical, transparent process — not a promise or a
          roadmap item.
        </p>
      </section>

      <Callout type="info">
        The buyback engine runs autonomously. No team member can redirect funds,
        change the threshold, or pause the process. The logic is on-chain.
      </Callout>

      <DocNav
        prev={{ label: "$DRIP Token", href: "/docs/token" }}
        next={{ label: "Tokenomics", href: "/docs/token/tokenomics" }}
      />
    </article>
  );
}
