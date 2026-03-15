"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * RevenueBadge — displays total earned USDC from /api/agent/revenue.
 *
 * Polls every 60s. Shows "—" while loading, "⚠" on error.
 * Styled identically to WalletBadge in agent layout.
 *
 * Observability: polls GET /api/agent/revenue, logs errors to console
 * with [revenue-badge] prefix.
 */

interface RevenueState {
  totalEarned?: string;
  queryCount?: number;
  loading: boolean;
  error: boolean;
}

export function RevenueBadge() {
  const [state, setState] = useState<RevenueState>({
    loading: true,
    error: false,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchRevenue() {
      try {
        const res = await fetch("/api/agent/revenue");
        const data = await res.json();

        if (!mounted) return;

        if (typeof data.totalEarned === "string") {
          setState({
            loading: false,
            error: false,
            totalEarned: data.totalEarned,
            queryCount: data.queryCount ?? 0,
          });
        } else {
          setState({ loading: false, error: true });
        }
      } catch (err) {
        console.error("[revenue-badge] Failed to fetch revenue:", err);
        if (mounted) setState({ loading: false, error: true });
      }
    }

    fetchRevenue();
    const interval = setInterval(fetchRevenue, 60_000);
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
  } else {
    display = `${state.totalEarned} USDC`;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-button px-2.5 py-1",
        "bg-dark-deepest/60 border border-ocean-mist/15",
        "text-xs font-medium tracking-wide",
        state.error ? "text-amber-400" : "text-icy-aqua"
      )}
      title={
        state.error
          ? "Failed to load revenue"
          : state.loading
            ? "Loading revenue…"
            : `Revenue: ${state.totalEarned} USDC (${state.queryCount} queries)`
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
          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-.001m5.94 0-.002 5.94"
        />
      </svg>
      <span>{display}</span>
    </div>
  );
}
