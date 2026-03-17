import {
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "OpenRouter Integration — DRIP Docs",
};

export default function OpenRouterPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Integrations
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          OpenRouter Integration
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP uses <strong className="text-white">OpenRouter</strong> to access
          multiple AI models through a unified API. This powers the AI reasoning
          layer that synthesizes collected data into structured research.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="models">Models Used</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          DRIP dynamically selects the best model for each task. The AI brain
          routes queries through OpenRouter to models including:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Model</th>
                <th className="pb-2 pr-4 font-medium">Provider</th>
                <th className="pb-2 font-medium">Used For</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Claude 3.5 Sonnet
                </td>
                <td className="py-2.5 pr-4">Anthropic</td>
                <td className="py-2.5">
                  Complex research synthesis, long-form analysis
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  GPT-4o
                </td>
                <td className="py-2.5 pr-4">OpenAI</td>
                <td className="py-2.5">
                  Structured data extraction, tool selection
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                  Claude 3 Haiku
                </td>
                <td className="py-2.5 pr-4">Anthropic</td>
                <td className="py-2.5">
                  Fast classification, routing, simple queries
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="how-it-works">How the AI Brain Works</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          When you submit a query to DRIP, the AI brain:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Classifies</strong> the query type
            (company, person, market, social, or mixed).
          </li>
          <li>
            <strong className="text-white">Selects tools</strong> — determines
            which data sources to query based on the classification.
          </li>
          <li>
            <strong className="text-white">Collects data</strong> — fans out to
            multiple sources in parallel.
          </li>
          <li>
            <strong className="text-white">Synthesizes</strong> — the AI model
            processes raw data into a structured research brief with citations
            and confidence scores.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <H2 id="for-users">What This Means for Users</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          OpenRouter is a server-side integration. As a DRIP user, you:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-slate">
          <li>
            <strong className="text-white">Don&apos;t need an API key</strong>{" "}
            — DRIP handles model access on the backend
          </li>
          <li>
            <strong className="text-white">
              Don&apos;t pay for AI separately
            </strong>{" "}
            — model costs are included in the per-query price
          </li>
          <li>
            <strong className="text-white">
              Don&apos;t configure anything
            </strong>{" "}
            — the AI brain selects the optimal model automatically
          </li>
        </ul>
      </section>

      <Callout type="info">
        OpenRouter gives DRIP access to multiple frontier models through a
        single API, with automatic failover. If one provider is down, queries
        are routed to an alternative model transparently.
      </Callout>

      <DocNav
        prev={{
          label: "DexScreener",
          href: "/docs/integrations/dexscreener",
        }}
        next={{ label: "Moltbook", href: "/docs/integrations/moltbook" }}
      />
    </article>
  );
}
