"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { cn } from "@/lib/utils";

/**
 * ConnectButton — Solana wallet connect/disconnect with wallet picker.
 *
 * Disconnected: shows "Connect Wallet". Click opens a dropdown of detected wallets.
 * Connected: shows truncated address (first4…last4), click to disconnect.
 *
 * Only wallets with readyState "Installed" or "Loadable" are shown.
 * If only one wallet is available, connects directly without dropdown.
 */
export function ConnectButton() {
  const { publicKey, connected, select, disconnect, connecting, wallets, wallet } =
    useWallet();

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Prefer installed extensions; fall back to loadable (mobile deep-link capable)
  const installedWallets = wallets.filter(
    (w) => w.readyState === WalletReadyState.Installed
  );
  const loadableWallets = wallets.filter(
    (w) => w.readyState === WalletReadyState.Loadable
  );
  // Show installed first, then loadable as fallback
  const availableWallets =
    installedWallets.length > 0 ? installedWallets : loadableWallets;

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : null;

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  // Close picker when connected
  useEffect(() => {
    if (connected) setShowPicker(false);
  }, [connected]);

  const handleSelectWallet = useCallback(
    (walletName: string) => {
      const found = wallets.find((w) => w.adapter.name === walletName);
      if (found) {
        select(found.adapter.name);
        // autoConnect in provider will trigger connection after select
        setShowPicker(false);
      }
    },
    [wallets, select]
  );

  const handleConnectClick = useCallback(() => {
    if (installedWallets.length === 1) {
      // Single installed extension — connect directly, no picker needed
      handleSelectWallet(installedWallets[0].adapter.name);
      return;
    }
    if (installedWallets.length === 0 && loadableWallets.length === 0) {
      // No wallets at all — open Phantom install page
      window.open("https://phantom.app/", "_blank");
      return;
    }
    // Multiple installed wallets, or only loadable ones — show picker
    setShowPicker((prev) => !prev);
  }, [installedWallets, loadableWallets, handleSelectWallet]);

  // --- Connected state ---
  if (connected && truncatedAddress) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className={cn(
          "flex items-center gap-1.5 rounded-button px-2.5 py-1",
          "bg-dark-deepest/60 border border-ocean-mist/15",
          "text-xs font-medium tracking-wide text-icy-aqua",
          "transition-colors hover:border-icy-aqua/30 hover:bg-dark-elevated"
        )}
        title={`Connected: ${publicKey!.toBase58()}\nClick to disconnect`}
      >
        <svg
          className="h-3.5 w-3.5 shrink-0 text-aquamarine"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
        <span>{truncatedAddress}</span>
      </button>
    );
  }

  // --- Disconnected state ---
  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={handleConnectClick}
        disabled={connecting}
        className={cn(
          "flex items-center gap-1.5 rounded-button px-2.5 py-1",
          "bg-dark-deepest/60 border border-ocean-mist/15",
          "text-xs font-medium tracking-wide text-icy-aqua",
          "transition-colors hover:border-icy-aqua/30 hover:bg-dark-elevated",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
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
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </svg>
        <span>{connecting ? "Connecting…" : "Connect Wallet"}</span>
      </button>

      {/* Wallet picker dropdown */}
      {showPicker && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 z-50 min-w-[180px]",
            "rounded-lg border border-ocean-mist/20 bg-dark-elevated/95 backdrop-blur-md",
            "shadow-lg shadow-black/30",
            "animate-in fade-in slide-in-from-top-2 duration-150"
          )}
        >
          <div className="px-3 py-2 border-b border-ocean-mist/10">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-ocean-mist/60">
              Select Wallet
            </span>
          </div>
          <div className="py-1">
            {[...installedWallets, ...loadableWallets]
              .filter(
                (w, i, arr) =>
                  arr.findIndex((x) => x.adapter.name === w.adapter.name) === i
              )
              .map((w) => (
              <button
                key={w.adapter.name}
                type="button"
                onClick={() => handleSelectWallet(w.adapter.name)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2",
                  "text-xs text-soft-cyan hover:bg-icy-aqua/10 hover:text-icy-aqua",
                  "transition-colors"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.adapter.icon}
                  alt={w.adapter.name}
                  className="h-5 w-5 rounded"
                />
                <span className="font-medium">{w.adapter.name}</span>
                {w.readyState === WalletReadyState.Installed ? (
                  <span className="ml-auto text-[10px] text-aquamarine/60">
                    Detected
                  </span>
                ) : (
                  <span className="ml-auto text-[10px] text-ocean-mist/40">
                    Install
                  </span>
                )}
              </button>
            ))}
          </div>
          {installedWallets.length === 0 && loadableWallets.length === 0 && (
            <div className="px-3 py-3 text-center">
              <p className="text-[11px] text-ocean-mist/50 mb-2">
                No wallet detected
              </p>
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-icy-aqua hover:underline"
              >
                Install Phantom →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
