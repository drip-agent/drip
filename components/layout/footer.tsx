import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
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
    <footer
      className={cn(
        "border-t border-ocean-mist/10 bg-dark-surface py-12",
        className
      )}
    >
      <Container>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand/logo-lockup-mono.svg"
              alt="DRIP"
              width={100}
              height={26}
            />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-ocean-mist transition-colors hover:text-icy-aqua"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="h-4 w-px bg-ocean-mist/20" />

            <div className="flex gap-4">
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
        </div>

        <div className="mt-8 border-t border-ocean-mist/10 pt-8 text-center">
          <p className="text-sm text-blue-slate">
            &copy; {new Date().getFullYear()} DRIP. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
