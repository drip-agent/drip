"use client";

import { useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

/**
 * SolanaWalletProvider — wraps children with Solana connection + wallet context.
 *
 * Uses NEXT_PUBLIC_SOLANA_RPC_URL with fallback to public mainnet.
 * Auto-connect enabled. No modal UI — ConnectButton handles interaction.
 *
 * Observability: wallet adapter logs connection events to console natively.
 */

const MAINNET_FALLBACK = "https://rpc.solanatracker.io/public";

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || MAINNET_FALLBACK;

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
