import {
  Code,
  H2,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "FAQ — DRIP Docs",
};

function FAQItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-ocean-mist/10 bg-dark-elevated p-4">
      <h3 className="font-heading text-base font-semibold text-white">
        {question}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-ocean-mist">
        {children}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Support
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          FAQ
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Common questions about DRIP, pricing, data accuracy, and how
          everything fits together.
        </p>
      </div>

      <div className="space-y-4">
        <FAQItem question="What is DRIP?">
          <p>
            DRIP is an AI-powered research intelligence agent on Solana. It
            analyzes companies, people, social signals, and on-chain data to
            deliver structured research briefs. Available as a web agent, CLI
            tool, and API.
          </p>
        </FAQItem>

        <FAQItem question="Is DRIP custodial?">
          <p>
            No. DRIP never holds your funds. Payments happen directly from your
            wallet to the DRIP treasury via Solana transactions. Your wallet
            keys stay with you — DRIP only receives signed payment proofs.
          </p>
        </FAQItem>

        <FAQItem question="What is $DRIP used for?">
          <p>
            $DRIP is a utility token with a deflationary mechanic. Revenue from
            API queries (paid in USDC) is used to buy $DRIP from the open market
            and burn it. It is not a governance token — there are no votes or
            proposals.
          </p>
        </FAQItem>

        <FAQItem question="How do I get started?">
          <p>
            The fastest path: open{" "}
            <strong className="text-white">drip.surf/agent</strong>, connect
            your Solana wallet, and type a query. Or run{" "}
            <Code>npx drip-agent research anthropic.com</Code> from your
            terminal. See the{" "}
            <a href="/docs/quickstart" className="text-icy-aqua hover:underline">
              Quickstart guide
            </a>{" "}
            for details.
          </p>
        </FAQItem>

        <FAQItem question="Is there an API?">
          <p>
            Yes. DRIP exposes a full REST API at{" "}
            <Code>api.drip.surf</Code> with endpoints for company research,
            person enrichment, social intelligence, sentiment analysis, and
            market data. Authentication is handled via x402 payments — no API
            key needed. See the{" "}
            <a href="/docs/api" className="text-icy-aqua hover:underline">
              API Reference
            </a>.
          </p>
        </FAQItem>

        <FAQItem question="What are the fees?">
          <p>
            Queries cost between $0.02 and $0.05 in USDC, depending on the
            endpoint. Market data is the cheapest (~$0.02), while full company
            research and AI brain queries are ~$0.05. There are no subscriptions
            or monthly fees.
          </p>
        </FAQItem>

        <FAQItem question="How accurate is the data?">
          <p>
            Every response includes a{" "}
            <Code>confidence</Code> score (0–1) and lists its data sources. DRIP
            cross-references multiple sources and flags conflicting signals.
            Typical confidence for well-known companies is 0.90+. Less-known
            entities may have lower scores with fewer sources.
          </p>
        </FAQItem>

        <FAQItem question="Can I use DRIP for sales prospecting?">
          <p>
            Yes. The person enrichment endpoint resolves emails and LinkedIn
            URLs into structured profiles — name, title, company, and contact
            info. The company research endpoint provides industry, funding, and
            tech stack data useful for targeting and qualification.
          </p>
        </FAQItem>

        <FAQItem question="What happens if a query fails?">
          <p>
            If DRIP cannot complete a query, you are not charged. The x402
            payment is only verified and finalized when data is successfully
            returned. If the server errors after payment, the transaction is
            refundable via the dispute mechanism.
          </p>
        </FAQItem>

        <FAQItem question="Do I need a Solana wallet?">
          <p>
            Yes, for the web agent and API. DRIP uses x402 micropayments on
            Solana, which require a wallet (Phantom, Solflare, or Backpack). You
            need USDC (SPL) for query payments and a small amount of SOL for
            transaction fees.
          </p>
        </FAQItem>
      </div>

      <Callout type="tip">
        Still have questions? Ask the DRIP agent at{" "}
        <strong className="text-white">drip.surf/agent</strong> — it can answer
        questions about itself.
      </Callout>

      <DocNav
        prev={{ label: "Tokenomics", href: "/docs/token/tokenomics" }}
        next={{ label: "Changelog", href: "/docs/changelog" }}
      />
    </article>
  );
}
