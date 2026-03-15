"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { SolanaWalletProvider } from "@/components/solana/wallet-provider";
import { ConnectButton } from "@/components/solana/connect-button";
import { RevenueBadge } from "@/components/ui/revenue-badge";

const agentLinks = [
  { label: "Chat", href: "/agent" },
  { label: "Feed", href: "/agent/feed" },
];

/**
 * WalletBadge — shows USDC balance from /api/agent/wallet (x402 EVM).
 * Polls every 60s. Shows "—" while loading, "⚠" on error,
 * "Not configured" when key is missing.
 */
function WalletBadge() {
  const [state, setState] = useState<{
    formatted?: string;
    configured?: boolean;
    loading: boolean;
    error: boolean;
  }>({ loading: true, error: false });

  useEffect(() => {
    let mounted = true;

    async function fetchBalance() {
      try {
        const res = await fetch("/api/agent/wallet");
        const data = await res.json();

        if (!mounted) return;

        if (data.configured === false) {
          setState({ loading: false, error: false, configured: false });
        } else if (data.formatted) {
          setState({
            loading: false,
            error: false,
            configured: true,
            formatted: data.formatted,
          });
        } else {
          setState({ loading: false, error: true });
        }
      } catch {
        if (mounted) setState({ loading: false, error: true });
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 60_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  let display: string;
  if (state.loading) {
    display = "—";
  } else if (state.error) {
    display = "⚠";
  } else if (state.configured === false) {
    display = "N/A";
  } else {
    display = `${state.formatted} USDC`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-button px-2.5 py-1",
        "bg-dark-deepest/60 border border-ocean-mist/15",
        "text-xs font-medium tracking-wide",
        state.error
          ? "text-amber-400"
          : state.configured === false
            ? "text-blue-slate"
            : "text-icy-aqua"
      )}
      title={
        state.error
          ? "Failed to load wallet"
          : state.configured === false
            ? "Wallet not configured"
            : `Wallet balance: ${state.formatted ?? "—"} USDC`
      }
    >
      <svg
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1 0-6h5.25A2.25 2.25 0 0 1 21 6v6Zm0 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6a2.25 2.25 0 0 1 2.25-2.25h13.5"
        />
      </svg>
      <span>{display}</span>
    </div>
  );
}

/**
 * Agent-specific NavBar — agent route links + wallet badges.
 * Shows both EVM WalletBadge and Solana ConnectButton + RevenueBadge.
 */
function AgentNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 glass-strong shadow-glow-sm"
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/agent" className="flex items-center gap-2">
            <Image
              src="/brand/logo-lockup-mono.svg"
              alt="DRIP"
              width={100}
              height={28}
              priority
            />
            <span className="text-xs font-medium tracking-widest text-ocean-mist uppercase">
              Agent
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-3 md:flex">
            {agentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ocean-mist transition-colors hover:text-icy-aqua"
              >
                {link.label}
              </Link>
            ))}
            <div className="mx-1 h-4 w-px bg-ocean-mist/20" />
            <ConnectButton />
            <RevenueBadge />
            <WalletBadge />
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-ocean-mist/10 pb-3 md:hidden">
            <div className="flex flex-col gap-1 pt-2">
              {agentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-button px-3 py-2 text-sm text-ocean-mist transition-colors hover:bg-dark-elevated hover:text-icy-aqua"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <ConnectButton />
                <RevenueBadge />
                <WalletBadge />
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaWalletProvider>
      <div className="flex min-h-dvh flex-col bg-dark-deepest">
        <AgentNavBar />
        <main className="flex flex-1 flex-col pt-14">{children}</main>
      </div>
    </SolanaWalletProvider>
  );
}
