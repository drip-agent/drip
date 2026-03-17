import {
  CodeBlock,
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Person Enrichment API — DRIP Docs",
};

export default function PersonEnrichmentAPIPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          API
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Person Enrichment API
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          Resolve an email address or LinkedIn URL into a structured professional
          profile — name, title, company, location, and social links.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="endpoint">Endpoint</H2>
        <CodeBlock lang="text">
          {`GET https://api.drip.surf/enrich`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="parameters">Parameters</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Provide at least one of the following:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Parameter</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">email</td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5">
                  Email address to enrich (e.g.{" "}
                  <Code>dario@anthropic.com</Code>)
                </td>
              </tr>
              <tr className="border-b border-ocean-mist/5">
                <td className="py-2.5 pr-4 font-mono text-soft-cyan">
                  linkedin_url
                </td>
                <td className="py-2.5 pr-4">string</td>
                <td className="py-2.5">
                  LinkedIn profile URL (e.g.{" "}
                  <Code>linkedin.com/in/darioamodei</Code>)
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
    "person": {
      "firstName": "Dario",
      "lastName": "Amodei",
      "fullName": "Dario Amodei",
      "title": "Chief Executive Officer",
      "company": {
        "name": "Anthropic",
        "domain": "anthropic.com",
        "industry": "Artificial Intelligence"
      },
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "US"
      },
      "social": {
        "linkedin": "https://linkedin.com/in/darioamodei",
        "twitter": "https://x.com/DarioAmodei",
        "github": null
      },
      "email": "dario@anthropic.com",
      "emailVerified": true
    }
  },
  "meta": {
    "sources": ["clearbit", "linkedin", "hunter"],
    "confidence": 0.93,
    "costUsd": 0.05,
    "durationMs": 2180
  }
}`}
        </CodeBlock>
      </section>

      <section className="space-y-4">
        <H2 id="examples">Examples</H2>
        <H3>curl</H3>
        <CodeBlock lang="bash" title="Enrich by email">
          {`curl "https://api.drip.surf/enrich?email=dario@anthropic.com" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>
        <CodeBlock lang="bash" title="Enrich by LinkedIn URL">
          {`curl "https://api.drip.surf/enrich?linkedin_url=linkedin.com/in/darioamodei" \\
  -H "X-Payment-Proof: <tx-signature>"`}
        </CodeBlock>

        <H3>SDK</H3>
        <CodeBlock lang="typescript" title="TypeScript">
          {`import { Drip } from "@drip/sdk";

const drip = new Drip({ wallet: "<your-wallet>" });

// By email
const person = await drip.enrich({ email: "dario@anthropic.com" });
console.log(person.fullName);  // "Dario Amodei"
console.log(person.title);     // "Chief Executive Officer"

// By LinkedIn
const person2 = await drip.enrich({
  linkedinUrl: "linkedin.com/in/satyanadella",
});`}
        </CodeBlock>
      </section>

      <Callout type="info">
        When both <Code>email</Code> and <Code>linkedin_url</Code> are
        provided, DRIP cross-references both sources for higher confidence.
      </Callout>

      <DocNav
        prev={{
          label: "Company Research",
          href: "/docs/api/company-research",
        }}
        next={{
          label: "Social Intelligence",
          href: "/docs/api/social-intelligence",
        }}
      />
    </article>
  );
}
