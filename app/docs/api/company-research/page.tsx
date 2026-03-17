import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Company Research API — DRIP Docs",
};

export default function CompanyResearchAPIPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          API
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Company Research API
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Retrieve structured company intelligence from a domain name. Returns
          industry classification, funding history, employee data, tech stack,
          key people, and more.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="endpoint">Endpoint</H2>
        <CodeBlock lang="text">
          {`GET https://api.drip.surf/research`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="parameters">Parameters</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Parameter</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Required</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  domain
                </td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5 pr-4 text-aquamarine">Yes</td>
                <td className="py-2.5">
                  Company domain (e.g. <Code>anthropic.com</Code>)
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  fields
                </td>
                <td className="py-2.5 pr-4">string[]</td>
                <td className="py-2.5 pr-4 text-blue-slate">No</td>
                <td className="py-2.5">
                  Limit response to specific fields (e.g.{" "}
                  <Code>fields=funding,techStack</Code>)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="response">Response</H2>
        <CodeBlock lang="json" title="200 OK">
          {`{
  "status": "success",
  "data": {
    "organization": {
      "name": "Anthropic",
      "domain": "anthropic.com",
      "description": "AI safety company building reliable, interpretable AI systems.",
      "industry": "Artificial Intelligence",
      "subIndustry": "AI Safety & Research",
      "founded": 2021,
      "employees": {
        "count": 800,
        "range": "501-1000",
        "growth": "+45% YoY"
      },
      "funding": {
        "totalRaised": "$7.6B",
        "lastRound": "Series D",
        "lastRoundDate": "2024-03",
        "investors": ["Google", "Spark Capital", "Salesforce Ventures"]
      },
      "techStack": ["Python", "JAX", "Kubernetes", "GCP", "React"],
      "keyPeople": [
        { "name": "Dario Amodei", "title": "CEO" },
        { "name": "Daniela Amodei", "title": "President" }
      ],
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "US"
      },
      "social": {
        "linkedin": "https://linkedin.com/company/anthropic",
        "twitter": "https://x.com/AnthropicAI"
      }
    }
  },
  "meta": {
    "sources": ["clearbit", "crunchbase", "builtwith", "linkedin"],
    "confidence": 0.95,
    "costUsd": 0.05,
    "durationMs": 3120
  }
}`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="examples">Examples</H2>
        <H3>curl</H3>
        <CodeBlock lang="bash" title="Full research">
          {`curl https://api.drip.surf/research?domain=anthropic.com \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Specific fields only">
          {`curl "https://api.drip.surf/research?domain=stripe.com&fields=funding,techStack" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>

        <H3>SDK</H3>
        <CodeBlock lang="typescript" title="TypeScript">
          {`import { Drip } from "@drip/sdk";

const drip = new Drip({ wallet: "<your-wallet>" });

// Full research
const result = await drip.research("anthropic.com");
console.log(result.organization.funding.totalRaised); // "$7.6B"

// Specific fields
const partial = await drip.research("stripe.com", {
  fields: ["funding", "techStack"],
});`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="errors">Error Handling</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Code</th>
                <th className="pb-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">400</td>
                <td className="py-2.5 pr-4">
                  <Code>invalid_domain</Code>
                </td>
                <td className="py-2.5">
                  The <Code>domain</Code> parameter is missing or malformed
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">402</td>
                <td className="py-2.5 pr-4">
                  <Code>payment_required</Code>
                </td>
                <td className="py-2.5">
                  Payment proof is missing — pay and retry
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">404</td>
                <td className="py-2.5 pr-4">
                  <Code>not_found</Code>
                </td>
                <td className="py-2.5">
                  No data found for the given domain
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">500</td>
                <td className="py-2.5 pr-4">
                  <Code>internal_error</Code>
                </td>
                <td className="py-2.5">
                  Server error — retry after a moment
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout type="warn">
          If a query returns partial data (some sources failed), the response
          will still be <Code>200</Code> but the{" "}
          <Code>meta.confidence</Code> score will be lower. Check it before
          relying on the data.
        </Callout>
      </section>

      <DocNav
        prev={{ label: "API Overview", href: "/docs/api" }}
        next={{
          label: "Person Enrichment",
          href: "/docs/api/person-enrichment",
        }}
      />
    </article>
  );
}
