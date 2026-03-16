"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "API", href: "#api" },
  { label: "Token", href: "#token" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

export function NavBar({ className }: { className?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLinkClick() {
    setMobileOpen(false);
  }

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled || mobileOpen ? "glass-strong shadow-glow-sm" : "bg-transparent",
        className
      )}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-soft-cyan to-aquamarine">
              <span className="font-mono text-sm font-bold text-dark-deepest">D</span>
            </div>
            <span className="font-mono text-sm font-bold tracking-[0.15em] text-white">DRIP</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ocean-mist transition-colors hover:text-icy-aqua"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/docs">
              <Button size="sm" variant="ghost">
                View Docs
              </Button>
            </Link>
            <Link href="/agent">
              <Button size="sm" variant="primary">
                Launch Agent
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-button p-2 text-ocean-mist transition-colors hover:text-icy-aqua md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-ocean-mist/10 pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="rounded-button px-3 py-2 text-sm text-ocean-mist transition-colors hover:bg-dark-elevated hover:text-icy-aqua"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 px-3">
                <Link href="/docs" onClick={handleLinkClick}>
                  <Button size="sm" variant="outline" className="w-full">
                    View Docs
                  </Button>
                </Link>
                <Link href="/agent" onClick={handleLinkClick}>
                  <Button size="sm" variant="primary" className="w-full">
                    Launch Agent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}
