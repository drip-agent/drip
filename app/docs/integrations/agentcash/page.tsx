import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "AgentCash Integration — DRIP Docs",
};

export default function AgentCashIntegrationPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Integrations
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          AgentCash Integration
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP uses <strong className="text-white">AgentCash</strong> to handle
          x402 payments — the protocol that lets AI agents pay for data
          programmatically using USDC on Solana.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="what-is-x402">What Is x402?</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          x402 is a payment protocol built on HTTP status code{" "}
          <Code>402 Payment Required</Code>. Instead of API keys and
          subscription tiers, services return a 402 response with payment
          instructions. The client pays on-chain and retries with proof.
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">No API keys</strong> — payment is
            the authentication
          </li>
          <li>
            <strong className="text-white">No subscriptions</strong> — pay
            exactly for what you use
          </li>
          <li>
            <strong className="text-white">No rate limits</strong> — if you can
            pay, you can query
          </li>
          <li>
            <strong className="text-white">Agent-native</strong> — AI agents
            can pay for resources autonomously
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <H2 id="payment-flow">Payment Flow</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Every DRIP API request follows this flow:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            Client sends a request to a DRIP endpoint.
          </li>
          <li>
            Server responds with <Code>402 Payment Required</Code> containing:
            amount, recipient wallet, token (USDC), and a payment nonce.
          </li>
          <li>
            Client signs and submits a Solana transaction for the specified
            amount.
          </li>
          <li>
            Client retries the original request with an{" "}
            <Code>X-Payment-Proof</Code> header containing the transaction
            signature.
          </li>
          <li>
            Server verifies the payment on-chain and returns data.
          </li>
        </ol>
        <CodeBlock lang="json" title="402 Response Body">
          {`{
  "error": "payment_required",
  "payment": {
    "amount": "0.05",
    "token": "USDC",
    "recipient": "DRiPxxx...xxx",
    "network": "solana",
    "nonce": "abc123"
  }
}`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="integration">Integration Guide</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          If you&apos;re building on top of DRIP and want to handle x402
          payments programmatically:
        </p>

        <H3>Using the SDK (recommended)</H3>
        <CodeBlock lang="typescript" title="Automatic x402 handling">
          {`import { Drip } from "@drip/sdk";

// The SDK handles the 402 flow automatically
const drip = new Drip({ wallet: "<your-solana-keypair>" });
const result = await drip.research("anthropic.com");
// Payment was signed, submitted, and verified behind the scenes`}
        </CodeBlock>

        <H3>Manual x402 flow</H3>
        <CodeBlock lang="typescript" title="Manual implementation">
          {`// 1. Make initial request
const res = await fetch("https://api.drip.surf/research?domain=anthropic.com");

if (res.status === 402) {
  const { payment } = await res.json();

  // 2. Submit Solana payment
  const txSig = await submitPayment({
    amount: payment.amount,
    token: payment.token,
    recipient: payment.recipient,
  });

  // 3. Retry with proof
  const data = await fetch(
    "https://api.drip.surf/research?domain=anthropic.com",
    { headers: { "X-Payment-Proof": txSig } }
  );

  return data.json();
}`}
        </CodeBlock>
      </section>

      <Callout type="tip">
        AgentCash makes DRIP agent-native — any AI agent with a Solana wallet
        can use DRIP without human intervention. The payment flow is fully
        programmatic.
      </Callout>

      <DocNav
        prev={{ label: "Market Data API", href: "/docs/api/market-data" }}
        next={{ label: "Solana Wallets", href: "/docs/integrations/wallets" }}
      />
    </article>
  );
}
