import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

const productLinks = [
  { label: "Agent", href: "/agent" },
  { label: "API Docs", href: "/docs" },
  { label: "Analytics", href: "#features" },
  { label: "Marketplace", href: "#roadmap" },
];

const resourceLinks = [
  { label: "Documentation", href: "/docs" },
  { label: "Articles", href: "#articles" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  {
    label: "X",
    href: "https://x.com/drip_agents",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-ocean-mist/10", className)}>
      {/* Main footer */}
      <Container size="wide">
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-soft-cyan to-aquamarine">
                <span className="font-mono text-sm font-bold text-dark-deepest">D</span>
              </div>
              <span className="font-mono text-sm font-bold tracking-[0.15em] text-white">
                DRIP
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-blue-slate">
              AI-powered research intelligence for the next generation.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocean-mist transition-colors hover:text-icy-aqua"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-slate transition-colors hover:text-icy-aqua"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white">Resources</h4>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-slate transition-colors hover:text-icy-aqua"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white">Legal</h4>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-slate transition-colors hover:text-icy-aqua"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright bar */}
      <div className="border-t border-ocean-mist/10">
        <Container size="wide">
          <div className="flex flex-col items-center justify-between gap-2 py-4 sm:flex-row">
            <p className="text-xs text-blue-slate">
              &copy; {new Date().getFullYear()} DRIP Intelligence. All rights reserved.
            </p>
            <p className="text-xs text-blue-slate">Autonomous Intelligence Since 2025</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
