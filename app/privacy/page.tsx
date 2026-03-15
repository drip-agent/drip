import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = { title: "Privacy Policy — DRIP" };

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main className="pt-24">
        <Section spacing="spacious">
          <Container size="narrow">
            <h1 className="font-heading text-3xl font-bold text-icy-aqua sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-blue-slate">
              Last updated: March 15, 2026
            </p>

            <div className="mt-10 space-y-8 text-sm leading-relaxed text-ocean-mist">
              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  1. Overview
                </h2>
                <p>
                  DRIP (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
                  operates the drip.surf website and the drip-agent CLI tool. This
                  policy explains how we handle information when you use our
                  services.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  2. Information We Collect
                </h2>
                <p className="mb-2">We collect minimal information:</p>
                <ul className="list-inside list-disc space-y-1 text-blue-slate">
                  <li>
                    <strong className="text-ocean-mist">Wallet addresses</strong>{" "}
                    — public Solana wallet addresses used to connect to the agent
                  </li>
                  <li>
                    <strong className="text-ocean-mist">Query data</strong> —
                    research queries submitted to the agent (company domains,
                    email addresses for enrichment)
                  </li>
                  <li>
                    <strong className="text-ocean-mist">Usage analytics</strong>{" "}
                    — anonymous page views and feature usage via Vercel Analytics
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  3. How We Use Information
                </h2>
                <ul className="list-inside list-disc space-y-1 text-blue-slate">
                  <li>Process research queries and deliver results</li>
                  <li>Verify payments via AgentCash on the Solana blockchain</li>
                  <li>Improve service quality and fix bugs</li>
                  <li>Display aggregated revenue and query statistics</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  4. Data Sharing
                </h2>
                <p>
                  We do not sell your data. Query data is sent to third-party data
                  providers (StableEnrich) to fulfill research requests. Payment
                  transactions are recorded on the Solana blockchain and are
                  publicly visible by nature.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  5. Data Retention
                </h2>
                <p>
                  Research results are not stored permanently. Query logs are
                  retained for up to 30 days for debugging purposes and then
                  deleted. Blockchain transactions are permanent and immutable.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  6. Cookies
                </h2>
                <p>
                  We use essential cookies only — no tracking cookies, no
                  advertising cookies. Vercel may set performance cookies for
                  analytics.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  7. Your Rights
                </h2>
                <p>
                  You can disconnect your wallet at any time. To request deletion
                  of any stored data, contact us at privacy@drip.surf.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  8. Changes
                </h2>
                <p>
                  We may update this policy. Changes will be posted on this page
                  with an updated date.
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-soft-cyan">
                  9. Contact
                </h2>
                <p>
                  Questions about privacy? Reach us at{" "}
                  <span className="text-icy-aqua">privacy@drip.surf</span>
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
