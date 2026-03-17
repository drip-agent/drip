import {
  Code,
  H2,
  H3,
  Callout,
  DocNav,
} from "@/components/docs/doc-components";

export const metadata = {
  title: "Capabilities — DRIP Docs",
};

export default function CapabilitiesPage() {
  return (
    <article className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-aquamarine">
          Agent
        </p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
          Capabilities
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-mist">
          DRIP&apos;s intelligence layer covers four core domains. Each
          capability pulls from multiple data sources, cross-references signals,
          and delivers structured output with confidence scores.
        </p>
      </div>

      <section className="space-y-4">
        <H2 id="company-research">Company Research</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Deep-dive analysis of any company from a domain name.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Data Point</th>
                <th className="pb-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              {[
                ["Industry", "Sector classification and sub-categories"],
                ["Funding", "Total raised, latest round, key investors"],
                ["Employees", "Headcount, growth rate, department breakdown"],
                ["Tech Stack", "Languages, frameworks, infrastructure, tools"],
                ["Key People", "Founders, C-suite, notable hires"],
                ["Description", "What the company does, in plain language"],
                ["Location", "HQ and office locations"],
                ["Social Presence", "Website, LinkedIn, Twitter/X, GitHub"],
              ].map(([point, detail]) => (
                <tr key={point} className="border-b border-ocean-mist/5">
                  <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                    {point}
                  </td>
                  <td className="py-2.5">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="person-enrichment">Person Enrichment</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Resolve an email or LinkedIn URL into a complete professional profile.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Data Point</th>
                <th className="pb-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              {[
                ["Full Name", "First and last name, verified against sources"],
                ["Title", "Current job title and seniority level"],
                ["Company", "Current employer with domain and industry"],
                ["Email", "Verified email address(es)"],
                ["Location", "City, state/region, country"],
                ["Social Profiles", "LinkedIn, Twitter/X, GitHub, personal site"],
              ].map(([point, detail]) => (
                <tr key={point} className="border-b border-ocean-mist/5">
                  <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                    {point}
                  </td>
                  <td className="py-2.5">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="social-intelligence">Social Intelligence</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Track narratives, sentiment, and engagement across social platforms.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Data Point</th>
                <th className="pb-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              {[
                ["Sentiment", "Positive / negative / neutral breakdown"],
                ["Trends", "Emerging topics and narrative shifts"],
                ["Engagement", "Volume, likes, reposts, reply depth"],
                ["Key Voices", "Influential accounts driving the conversation"],
              ].map(([point, detail]) => (
                <tr key={point} className="border-b border-ocean-mist/5">
                  <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                    {point}
                  </td>
                  <td className="py-2.5">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <H2 id="market-data">Market Data</H2>
        <p className="text-sm leading-relaxed text-ocean-mist">
          Live token and market data from on-chain sources and aggregators.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-mist/10 text-blue-slate">
                <th className="pb-2 pr-4 font-medium">Data Point</th>
                <th className="pb-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="text-ocean-mist">
              {[
                ["Price", "Current USD price with source timestamp"],
                ["Volume", "24-hour trading volume"],
                ["Liquidity", "Available liquidity across pools"],
                ["Price Change", "1h, 24h, 7d percentage change"],
                ["Market Cap", "Circulating and fully diluted"],
              ].map(([point, detail]) => (
                <tr key={point} className="border-b border-ocean-mist/5">
                  <td className="py-2.5 pr-4 font-medium text-soft-cyan">
                    {point}
                  </td>
                  <td className="py-2.5">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout type="info">
        All capabilities are available through the web agent, CLI, and API. The
        agent automatically selects the right tools based on your query.
      </Callout>

      <DocNav
        prev={{ label: "CLI Agent", href: "/docs/agent/cli" }}
        next={{ label: "API Overview", href: "/docs/api" }}
      />
    </article>
  );
}
