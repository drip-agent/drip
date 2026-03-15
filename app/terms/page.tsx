import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = { title: "Terms of Service — DRIP" };

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="pt-24">
        <Section spacing="spacious">
          <Container size="narrow">
            <h1 className="font-heading text-3xl font-bold text-icy-aqua sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-blue-slate">
              Last updated: March 15, 2026
            </p>

            <div className="mt-10 space-y-8 text-sm leading-relaxed text-ocean-mist">
              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  1. Acceptance
                </h2>
                <p>
                  By using DRIP (drip.surf, the drip-agent CLI, or any related
                  services), you agree to these terms. If you don&apos;t agree,
                  don&apos;t use the service.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  2. Service Description
                </h2>
                <p>
                  DRIP provides autonomous research intelligence — company
                  research, person enrichment, and data analysis. The service is
                  accessed via the web interface at drip.surf or the CLI tool
                  (npx drip-agent). Queries are paid per-use via AgentCash
                  micropayments on the Solana blockchain.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  3. Payments &amp; Pricing
                </h2>
                <ul className="list-inside list-disc space-y-1 text-blue-slate">
                  <li>Research queries cost approximately $0.05 USDC each</li>
                  <li>
                    Payments are processed via AgentCash on the Solana blockchain
                  </li>
                  <li>All payments are final — no refunds on completed queries</li>
                  <li>
                    Pricing may change; current rates are displayed before each
                    query
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  4. $DRIP Token
                </h2>
                <p>
                  $DRIP is a utility token on the Solana blockchain. Holding $DRIP
                  may be required to access certain agent features. The token is
                  not a security, does not represent ownership in any entity, and
                  carries no guaranteed financial return. Token value may
                  fluctuate. Do your own research before purchasing.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  5. Acceptable Use
                </h2>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-inside list-disc space-y-1 text-blue-slate">
                  <li>Use the service for illegal purposes</li>
                  <li>
                    Scrape, resell, or redistribute research data in bulk
                  </li>
                  <li>Attempt to exploit, hack, or disrupt the service</li>
                  <li>
                    Use enriched personal data in violation of applicable privacy
                    laws
                  </li>
                  <li>Impersonate others or misrepresent your identity</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  6. Data Accuracy
                </h2>
                <p>
                  Research results are sourced from third-party providers and
                  public data. We do not guarantee the accuracy, completeness, or
                  timeliness of any data returned. Results should be verified
                  independently before making business decisions.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  7. Limitation of Liability
                </h2>
                <p>
                  DRIP is provided &ldquo;as is&rdquo; without warranties. We are
                  not liable for any damages arising from use of the service,
                  including but not limited to: inaccurate data, lost funds,
                  blockchain transaction failures, or service downtime. Use at
                  your own risk.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  8. Intellectual Property
                </h2>
                <p>
                  The DRIP brand, logo, website design, and agent code are owned
                  by us. Research results belong to the querying user. The
                  drip-agent CLI is distributed under the MIT license.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  9. Termination
                </h2>
                <p>
                  We may suspend or terminate access to the service at any time
                  for violations of these terms. You may stop using the service at
                  any time.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  10. Changes
                </h2>
                <p>
                  We may update these terms. Continued use after changes
                  constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  11. Contact
                </h2>
                <p>
                  Questions? Reach us at{" "}
                  <span className="text-icy-aqua">legal@drip.surf</span>
                </p>
              </section>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
