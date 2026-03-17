import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "DexScreener Integration — DRIP Docs",
};

export default function DexScreenerPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Integrations
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          DexScreener Integration
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP uses <strong className="text-white">DexScreener</strong> as a
          primary data source for live token market data — price, volume,
          liquidity, and chart data across Solana DEXes.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="data-available">Available Data</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          When you query the{" "}
          <Code>/market</Code> endpoint, DRIP pulls the following from
          DexScreener:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Price</strong> — current USD price
            with timestamp
          </li>
          <li>
            <strong className="text-white">Volume</strong> — 24-hour trading
            volume in USD
          </li>
          <li>
            <strong className="text-white">Liquidity</strong> — total available
            liquidity in active pools
          </li>
          <li>
            <strong className="text-white">Price changes</strong> — 1h, 6h,
            24h, and 7d percentage movements
          </li>
          <li>
            <strong className="text-white">Pair info</strong> — trading pair
            address, DEX name, base/quote tokens
          </li>
          <li>
            <strong className="text-white">Chart link</strong> — direct URL to
            the DexScreener chart
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <H2 id="how-it-works">How the /market API Uses DexScreener</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          When a market data request comes in:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            DRIP resolves the token ticker or mint address to a DexScreener pair.
          </li>
          <li>
            It fetches the latest data from DexScreener&apos;s API.
          </li>
          <li>
            Data is normalized into DRIP&apos;s standard response format.
          </li>
          <li>
            The response includes a <Code>dexUrl</Code> field linking to the
            live chart.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="links">DexScreener Links</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          The link format for viewing any token on DexScreener:
        </p>
        <CodeBlock lang="text" title="URL format">
          {`https://dexscreener.com/solana/<pair-address>`}
        </CodeBlock>
        <p className="text-sm leading-relaxed text-ocean-mist">
          For $DRIP specifically:
        </p>
        <CodeBlock lang="text" title="$DRIP on DexScreener">
          {`https://dexscreener.com/solana/Coming soon — relaunching on PumpFun`}
        </CodeBlock>
      </section>

      <Callout type="info">
        DexScreener data updates in near real-time. DRIP caches results for a
        few seconds to reduce upstream load, so prices may lag by up to 30
        seconds during high-activity periods.
      </Callout>

      <DocNav
        prev={{ label: "PumpFun", href: "/docs/integrations/pumpfun" }}
        next={{ label: "OpenRouter", href: "/docs/integrations/openrouter" }}
      />
    </article>
  );
}
