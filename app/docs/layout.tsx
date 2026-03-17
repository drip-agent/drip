import Link from "next/link";
import { Container } from "@/components/layout/container";
import { NavBar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/* ─── Sidebar Navigation Data ─── */

const SIDEBAR = [
  {
    title: "Getting Started",
    items: [
      { label: "👋 Welcome", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "How It Works", href: "/docs/how-it-works" },
    ],
  },
  {
    title: "DRIP Agent",
    items: [
      { label: "Web Agent", href: "/docs/agent/web" },
      { label: "CLI Agent", href: "/docs/agent/cli" },
      { label: "Capabilities", href: "/docs/agent/capabilities" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "Overview & x402", href: "/docs/api" },
      { label: "Company Research", href: "/docs/api/company-research" },
      { label: "Person Enrichment", href: "/docs/api/person-enrichment" },
      { label: "Social Intelligence", href: "/docs/api/social-intelligence" },
      { label: "Sentiment Analysis", href: "/docs/api/sentiment" },
      { label: "Market Data", href: "/docs/api/market-data" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "AgentCash (x402)", href: "/docs/integrations/agentcash" },
      { label: "Solana Wallets", href: "/docs/integrations/wallets" },
      { label: "PumpFun", href: "/docs/integrations/pumpfun" },
      { label: "DexScreener", href: "/docs/integrations/dexscreener" },
      { label: "OpenRouter AI", href: "/docs/integrations/openrouter" },
      { label: "Moltbook", href: "/docs/integrations/moltbook" },
    ],
  },
  {
    title: "Token & Utility",
    items: [
      { label: "$DRIP Token", href: "/docs/token" },
      { label: "Buyback & Burn", href: "/docs/token/buyback" },
      { label: "Tokenomics", href: "/docs/token/tokenomics" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "FAQ", href: "/docs/faq" },
      { label: "Changelog", href: "/docs/changelog" },
    ],
  },
];

/* ─── Sidebar Component ─── */

function DocsSidebar({ currentPath }: { currentPath?: string }) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100dvh-5rem)] w-64 shrink-0 overflow-y-auto border-r border-ocean-mist/10 pb-8 pr-6 lg:block">
      <nav className="space-y-6 pt-2">
        {SIDEBAR.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-slate">
              {section.title}
            </h4>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-aquamarine/10 font-medium text-icy-aqua"
                          : "text-ocean-mist hover:bg-dark-elevated hover:text-icy-aqua"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Connect links */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-slate">
            Connect
          </h4>
          <ul className="space-y-0.5">
            <li>
              <a
                href="https://x.com/drip_agents"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-3 py-1.5 text-sm text-ocean-mist transition-colors hover:bg-dark-elevated hover:text-icy-aqua"
              >
                𝕏 Twitter
              </a>
            </li>
            <li>
              <a
                href="https://drip.surf"
                className="block rounded-md px-3 py-1.5 text-sm text-ocean-mist transition-colors hover:bg-dark-elevated hover:text-icy-aqua"
              >
                🌐 Website
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

/* ─── Mobile Sidebar ─── */

function MobileSidebar() {
  return (
    <details className="group mb-6 rounded-card border border-ocean-mist/10 bg-dark-surface lg:hidden">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ocean-mist">
        📖 Documentation Menu
      </summary>
      <nav className="space-y-4 px-4 pb-4 pt-2">
        {SIDEBAR.map((section) => (
          <div key={section.title}>
            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-slate">
              {section.title}
            </h4>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded px-2 py-1 text-sm text-ocean-mist transition-colors hover:text-icy-aqua"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </details>
  );
}

/* ─── Layout ─── */

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="pt-16">
        <Container size="wide">
          <div className="flex gap-8 py-8">
            <DocsSidebar />
            <main className="min-w-0 flex-1">
              <MobileSidebar />
              {children}
            </main>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}

/* Re-export sidebar data for subpages */
export { SIDEBAR };
